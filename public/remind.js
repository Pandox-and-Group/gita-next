/* Reading reminders: the plan arithmetic, the message texts and the rules for what is sent and when.
   One file, loaded by the page (script tag) and by the service worker (importScripts), so both follow the same rules.
   Everything here is pure: it takes the saved state and a time, and returns a decision. Nothing leaves the device.

   state (written by lib/engine.js, read by public/sw.js):
     on, time 'HH:MM', perDay, from, to        the reader's plan (chapters from..to, shlokas a day)
     lastOpen, lastRead                        timestamps (ms)
     day 'YYYY-MM-DD', count                   shlokas read on that day
     pos {c, v, name, meaning, count}          the last shloka read, and its chapter
     essence                                   that shloka's one-line sense
     next {c, v, hook, lead}                   the next shloka: its question, and the first sentence of its background
     nextChapter {c, name, meaning, opening}   the chapter after this one, when the reader stands at a chapter's end
     left {chapter, plan}                      shlokas left in this chapter, and in the plan
     done                                      the plan is finished
     hist {'YYYY-MM-DD': n}                    shlokas read on each recent day (the streak and the real pace come from it)
     chapter {c, name, days, perDay}           the chapter last completed: how long it took and at what pace
     sent {day, kind, ignored, log[]}          what was last sent; `ignored` counts reminders since the app was opened
*/
(function (root) {
  'use strict';
  const DAY = 864e5;
  const pad = n => String(n).padStart(2, '0');
  const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const dayNumber = d => Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / DAY); // local days since 1970
  const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00') - new Date(a + 'T00:00')) / DAY);
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const clip = (t, n) => { t = String(t || '').trim(); return t.length <= n ? t : t.slice(0, n - 1).replace(/[\s,;:.—-]+\S*$/, '') + '…'; };
  const firstSentence = t => { const m = String(t || '').trim().match(/^.*?[.!?](?=\s|$)/); return m ? m[0] : String(t || '').trim(); };
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  /* ---- the plan ---- */
  // How long `left` shlokas take at `perDay`, and the date that lands on, counting today when nothing is read yet.
  function pace(left, perDay, now, readToday) {
    perDay = Math.max(1, perDay | 0);
    const days = Math.ceil(Math.max(0, left) / perDay);
    const start = readToday >= perDay ? 1 : 0; // today's share is done: the count starts tomorrow
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + Math.max(0, days - 1 + start));
    return { days, date: `${end.getDate()} ${MONTHS[end.getMonth()]}${end.getFullYear() !== now.getFullYear() ? ' ' + end.getFullYear() : ''}` };
  }
  const perDayFor = (left, days) => Math.max(1, Math.ceil(Math.max(0, left) / Math.max(1, days | 0)));
  const scope = s => (s.from === 1 && s.to === 18) ? 'the Gita' : s.from === s.to ? `chapter ${s.from}` : `chapters ${s.from} to ${s.to}`;

  /* ---- streak and real pace, from the days actually read ---- */
  const shift = (key, n) => { const d = new Date(key + 'T00:00'); d.setDate(d.getDate() + n); return dayKey(d); };
  // Days in a row with at least one shloka read. Today counts once something is read; until then yesterday keeps it alive.
  function streak(hist, today) {
    hist = hist || {};
    let d = hist[today] > 0 ? today : shift(today, -1), n = 0;
    while (hist[d] > 0) { n++; d = shift(d, -1); }
    return n;
  }
  // Shlokas a day over the last two weeks, counted from the first day read in that window (rest days included).
  function rate(hist, today) {
    hist = hist || {};
    let total = 0, first = null;
    for (let i = 13; i >= 0; i--) { const k = shift(today, -i); if (hist[k] > 0) { total += hist[k]; if (!first) first = k; } }
    if (!first) return 0;
    return total / (daysBetween(first, today) + 1);
  }
  const fmt = x => x >= 10 ? String(Math.round(x)) : String(Math.round(x * 10) / 10); // 12, or 3.4

  // Lines from the Gita itself, for a reader who has been away. Each is a plain rendering of the verse it names.
  const WISDOM = [
    ['2.40', 'On this path no effort is lost, and even a little of it protects from great fear.'],
    ['6.40', 'No one who does good ever comes to grief.'],
    ['6.5', 'Raise yourself by yourself. You are your own friend.'],
    ['6.35', 'The mind is restless and hard to hold, but practice and letting go restrain it.'],
    ['2.14', 'Heat and cold, pleasure and pain come and go. Bear them.'],
    ['2.3', 'Cast off this faintness of heart and stand up.'],
  ];
  const wisdom = n => { const w = WISDOM[((n % WISDOM.length) + WISDOM.length) % WISDOM.length]; return `${w[1]} (${w[0]})`; };

  /* ---- the texts ----
     Each entry: when(ctx) says whether it fits; make(ctx) writes it. Quiet in tone: no streaks, no guilt, no
     exclamation marks. Titles are short; bodies stay within about 120 characters so they are not cut on a lock screen. */
  const TEXTS = [
    { kind: 'away_far', when: c => c.away >= 14,
      make: c => ({ title: 'Your place is kept',
        body: clip(`Chapter ${c.pos.c}, shloka ${c.pos.v}, whenever you come back. ${wisdom(c.dayNo)}`, 160) }) },
    { kind: 'away_long', when: c => c.away >= 7 && c.away < 14,
      make: c => ({ title: `Still waiting at ${c.pos.c}.${c.pos.v}`,
        body: clip(`${c.away} days now, and the page has not turned. ${wisdom(c.dayNo)} One shloka is enough to begin again.`, 165) }) },
    { kind: 'away', when: c => c.away >= 3 && c.away < 7,
      make: c => ({ title: 'It has been quiet here',
        body: clip(`${c.away} days since chapter ${c.pos.c}, shloka ${c.pos.v}${c.streakLost > 1 ? `, and a ${c.streakLost}-day streak ended` : ''}. ${wisdom(c.dayNo)}`, 165) }) },
    { kind: 'chapter_done', when: c => c.atEnd && c.nc,
      make: c => { const ch = c.s.chapter && c.s.chapter.c === c.pos.c ? c.s.chapter : null;
        if (!ch) return { title: `Chapter ${c.pos.c} complete`,
          body: clip(`${c.pos.name} is behind you. Chapter ${c.nc.c}, ${c.nc.name}, begins: ${c.nc.opening || c.nc.meaning}`, 150) };
        const rest = Math.ceil(c.left.plan / Math.max(ch.perDay, 0.1));
        return { title: `Chapter ${c.pos.c} complete in ${plural(ch.days, 'day')}`,
          body: clip(`${c.pos.name}: ${fmt(ch.perDay)} shlokas a day. At that rate the rest of ${scope(c.s)} takes ${plural(rest, 'day')}. Next: ${c.nc.name}.`, 160) }; } },
    { kind: 'new_chapter', when: c => c.atEnd && c.nc,
      make: c => ({ title: `अध्याय ${c.nc.c} · ${c.nc.name}`,
        body: clip(`${c.nc.meaning}. ${c.nx && c.nx.hook ? c.nx.hook : c.nc.opening || ''}`, 150) }) },
    { kind: 'today_partial', when: c => c.readToday > 0 && c.readToday < c.s.perDay && c.nx,
      make: c => ({ title: "Today's reading",
        body: `${c.readToday} of ${c.s.perDay} read today. ${plural(c.s.perDay - c.readToday, 'shloka')} to go, from ${c.nx.c}.${c.nx.v}.` }) },
    { kind: 'streak', when: c => c.streak >= 2 && c.readToday === 0 && c.nx,
      make: c => ({ title: `${c.streak} days in a row`,
        body: `Today's ${plural(c.s.perDay, 'shloka')} ${c.s.perDay === 1 ? 'keeps' : 'keep'} it going. ${c.s.perDay === 1 ? 'It is' : 'They start at'} ${c.nx.c}.${c.nx.v}.` }) },
    { kind: 'finish_chapter_today', when: c => !c.atEnd && c.left.chapter > 0 && c.left.chapter <= c.s.perDay,
      make: c => ({ title: `Finish ${c.pos.name} today`,
        body: `${plural(c.left.chapter, 'shloka')} left in chapter ${c.pos.c}. They fit in today's reading.` }) },
    { kind: 'next_question', when: c => !c.atEnd && c.nx && c.nx.hook,
      make: c => ({ title: `अध्याय ${c.nx.c} · श्लोक ${c.nx.v}`,
        body: clip(`${c.nx.hook} Your next shloka answers it.`, 150) }) },
    { kind: 'what_next', when: c => !c.atEnd && c.nx && c.nx.lead,
      make: c => ({ title: 'What comes next',
        body: clip(`${c.nx.lead} Read on at ${c.nx.c}.${c.nx.v}.`, 160) }) },
    { kind: 'chapter_left', when: c => !c.atEnd && c.left.chapter > c.s.perDay && c.left.chapter <= 30,
      make: c => { const p = pace(c.left.chapter, c.s.perDay, c.now, c.readToday);
        return { title: c.pos.name, body: `${plural(c.left.chapter, 'shloka')} left in chapter ${c.pos.c}: ${plural(p.days, 'day')} at your pace.` }; } },
    { kind: 'today_waiting', when: c => c.readToday === 0 && c.nx,
      make: c => ({ title: `Today's ${plural(c.s.perDay, 'shloka')}`,
        body: clip(`${c.s.perDay === 1 ? 'It is' : 'They start at'} chapter ${c.nx.c}, shloka ${c.nx.v}${c.nx.hook ? ': ' + c.nx.hook : '.'}`, 150) }) },
    { kind: 'last_stretch', when: c => c.left.plan > 0 && c.left.plan <= c.s.perDay * 3,
      make: c => ({ title: 'Almost there',
        body: `${plural(c.left.plan, 'shloka')} to the end of ${scope(c.s)}.` }) },
    { kind: 'pace', when: c => c.left.plan > c.s.perDay * 3 && c.dayNo % 5 === 0,
      make: c => { const real = c.rate >= 0.5, per = real ? c.rate : c.s.perDay, p = pace(c.left.plan, per < 1 ? 1 : Math.round(per), c.now, c.readToday);
        return { title: 'Your pace', body: real
          ? `You have been reading about ${fmt(c.rate)} a day. At that rate ${scope(c.s)} ends on ${p.date}: ${plural(c.left.plan, 'shloka')} to go.`
          : `At ${c.s.perDay} a day you finish ${scope(c.s)} on ${p.date}. ${plural(c.left.plan, 'shloka')} to go.` }; } },
  ];

  function context(s, now) {
    const today = dayKey(now);
    return { s, now, today, dayNo: dayNumber(now),
      readToday: s.day === today ? (s.count | 0) : 0,
      away: s.lastRead ? Math.max(0, daysBetween(dayKey(new Date(s.lastRead)), today)) : 0, // calendar days, as a person counts them
      pos: s.pos || { c: 1, v: 1, name: '', meaning: '', count: 0 },
      atEnd: !!(s.pos && s.pos.v >= s.pos.count),
      nx: s.next || null, nc: s.nextChapter || null,
      left: s.left || { chapter: 0, plan: 0 },
      streak: streak(s.hist, today), rate: rate(s.hist, today),
      // the streak that ended when the reader stopped: counted up to the last day read
      streakLost: s.lastRead ? streak(s.hist, dayKey(new Date(s.lastRead))) : 0 };
  }

  // Every message that fits the state now, in order of preference.
  function candidates(s, now) {
    const c = context(s, now);
    return TEXTS.filter(t => { try { return t.when(c); } catch (e) { return false; } }).map(t => Object.assign({ kind: t.kind }, t.make(c)));
  }

  // Which one to send: the situation decides first (long away, chapter just finished, today half read);
  // otherwise rotate through what fits, never the same kind as last time.
  function pick(s, now) {
    const all = candidates(s, now);
    if (!all.length) return null;
    const c = context(s, now), last = s.sent && s.sent.kind;
    const first = k => all.find(m => m.kind === k);
    // Away: say so, sadly and with a line from the Gita, but never twice in a row. The reminder after it goes
    // back to what the next shloka holds.
    const awayKind = c.away >= 14 ? 'away_far' : c.away >= 7 ? 'away_long' : c.away >= 3 ? 'away' : null;
    if (awayKind && last !== awayKind && first(awayKind)) return first(awayKind);
    if (first('streak') && last !== 'streak' && c.dayNo % 2 === 0) return first('streak');
    if (c.atEnd && c.nc) { const two = all.filter(m => m.kind === 'chapter_done' || m.kind === 'new_chapter'); return two.find(m => m.kind !== last) || two[0]; }
    if (first('today_partial') && last !== 'today_partial') return first('today_partial');
    if (first('finish_chapter_today') && last !== 'finish_chapter_today') return first('finish_chapter_today');
    const pool = all.filter(m => m.kind !== last && !['away', 'away_long', 'away_far', 'chapter_done', 'new_chapter'].includes(m.kind));
    const from = pool.length ? pool : all;
    return from[c.dayNo % from.length];
  }

  /* ---- the rules for sending ----
     One reminder a day at most, never before the chosen time, never late at night, never when today's reading is
     done or the app was just open. Reminders that go unanswered thin out: daily for the first three, then every
     second day, then every fourth, and after ten the app stays quiet until the reader comes back. */
  const QUIET_FROM = 22 * 60; // no reminders from 22:00 until the chosen time the next day
  function gapFor(ignored) { return ignored < 3 ? 1 : ignored < 6 ? 2 : ignored < 10 ? 4 : 0; }

  function decide(s, now) {
    if (!s || !s.on) return { send: false, why: 'reminders are off' };
    if (s.done) return { send: false, why: 'the plan is finished' };
    const [h, m] = String(s.time || '07:00').split(':').map(Number);
    const mins = now.getHours() * 60 + now.getMinutes(), today = dayKey(now);
    if (mins < h * 60 + m) return { send: false, why: 'before the chosen time' };
    if (mins >= QUIET_FROM) return { send: false, why: 'late at night' };
    const readToday = s.day === today ? (s.count | 0) : 0;
    if (readToday >= s.perDay) return { send: false, why: "today's reading is done" };
    if (s.lastOpen && now - s.lastOpen < 3 * 36e5) return { send: false, why: 'the app was open in the last three hours' };
    const sent = s.sent || {};
    if (sent.day === today) return { send: false, why: 'already reminded today' };
    const gap = gapFor(sent.ignored | 0);
    if (!gap) return { send: false, why: 'ten reminders went unanswered; quiet until the reader returns' };
    if (sent.day && daysBetween(sent.day, today) < gap) return { send: false, why: `spacing out: one every ${gap} days now` };
    const msg = pick(s, now);
    return msg ? { send: true, msg } : { send: false, why: 'nothing to say' };
  }

  // The state after a reminder was shown: remembered so the next one differs, and kept in a short log.
  function recordSent(s, msg, now) {
    const prev = s.sent || {};
    const log = [{ t: now.getTime(), kind: msg.kind, title: msg.title, body: msg.body }].concat(prev.log || []).slice(0, 12);
    return Object.assign({}, s, { sent: { day: dayKey(now), kind: msg.kind, ignored: (prev.ignored | 0) + 1, log } });
  }
  // The reader opened the app: the unanswered count starts again.
  function recordOpen(s, now) {
    return Object.assign({}, s, { lastOpen: now.getTime(), sent: Object.assign({}, s.sent || {}, { ignored: 0 }) });
  }

  // One line for the title screen when the reader returns: where they were, and what is left.
  function greeting(s, now) {
    if (!s || !s.pos || !s.lastRead) return '';
    const c = context(s, now);
    const ago = c.away >= 2 ? `${c.away} days ago` : c.away === 1 ? 'yesterday' : 'today';
    if (s.done) return `You have read all of ${scope(s)}.`;
    const where = `अध्याय ${c.pos.c} · श्लोक ${c.pos.v}`;
    if (c.atEnd && c.nc) return `${where}: chapter ${c.pos.c} complete, ${ago}. Next: ${c.nc.name}.`;
    const left = c.left.chapter > 0 ? ` ${plural(c.left.chapter, 'shloka')} left in this chapter.` : '';
    const run = c.streak >= 2 ? ` ${c.streak} days in a row.` : '';
    return `You were at ${where}, ${ago}.${left}${run}`;
  }

  root.GitaRemind = { dayKey, daysBetween, streak, rate, fmt, WISDOM, pace, perDayFor, scope, candidates, pick, decide, recordSent, recordOpen, greeting, firstSentence, clip, TEXTS };
})(typeof self !== 'undefined' ? self : globalThis);
