// Checks public/remind.js: what is sent, when, and what it says. Run: node scripts/test-remind.mjs
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const self = {};
new Function('self', readFileSync(new URL('../public/remind.js', import.meta.url), 'utf8'))(self);
const R = self.GitaRemind;

const at = (d, h = 9, m = 0) => new Date(2026, 10, d, h, m); // November 2026, local time
const base = (over = {}) => ({
  on: true, time: '07:00', perDay: 5, from: 1, to: 18,
  lastOpen: at(10, 20).getTime(), lastRead: at(10, 20).getTime(), day: '2026-11-10', count: 5,
  pos: { c: 2, v: 47, name: 'सांख्ययोग', meaning: 'The Yoga of Knowledge', count: 72 },
  essence: 'Your right is to action alone, never to its fruits.',
  next: { c: 2, v: 48, hook: 'How should you act once you let go of results?', lead: 'Kṛṣṇa has told Arjuna not to act for fruits.' },
  left: { chapter: 25, plan: 582 }, ...over,
});
let n = 0;
const t = (name, fn) => { fn(); n++; };

t('off, finished, before the time, at night', () => {
  assert.equal(R.decide(base({ on: false }), at(11)).send, false);
  assert.equal(R.decide(base({ done: true }), at(11)).send, false);
  assert.match(R.decide(base(), at(11, 6, 59)).why, /before/);
  assert.match(R.decide(base(), at(11, 22, 0)).why, /night/);
});
t('sends the next morning, once', () => {
  const s = base(), d = R.decide(s, at(11, 7, 0));
  assert.equal(d.send, true);
  const s2 = R.recordSent(s, d.msg, at(11, 7, 0));
  assert.match(R.decide(s2, at(11, 15)).why, /already/);
  assert.equal(s2.sent.log.length, 1);
  assert.equal(s2.sent.ignored, 1);
});
t("not when today's reading is done, or the app was just open", () => {
  assert.match(R.decide(base({ day: '2026-11-11', count: 5 }), at(11, 18)).why, /done/);
  assert.match(R.decide(base({ lastOpen: at(11, 8).getTime() }), at(11, 9)).why, /three hours/);
});
t('half read today: says how many are left', () => {
  const d = R.decide(base({ day: '2026-11-11', count: 2, lastOpen: at(11, 8).getTime(), lastRead: at(11, 8).getTime() }), at(11, 18));
  assert.equal(d.msg.kind, 'today_partial');
  assert.match(d.msg.body, /2 of 5 read today\. 3 shlokas to go, from 2\.48/);
});
t('chapter finished: points to the next chapter, and alternates', () => {
  const s = base({ pos: { c: 2, v: 72, name: 'सांख्ययोग', meaning: 'The Yoga of Knowledge', count: 72 }, left: { chapter: 0, plan: 582 },
    next: { c: 3, v: 1, hook: 'If knowledge is higher, why act at all?' },
    nextChapter: { c: 3, name: 'कर्मयोग', meaning: 'The Yoga of Action', opening: 'Renouncing the world is not the same as renouncing the ego.' } });
  const a = R.decide(s, at(11)).msg;
  assert.ok(['chapter_done', 'new_chapter'].includes(a.kind));
  const b = R.decide(R.recordSent(s, a, at(11)), at(12)).msg;
  assert.ok(['chapter_done', 'new_chapter'].includes(b.kind) && b.kind !== a.kind);
  assert.match(a.body + b.body, /कर्मयोग|The Yoga of Action/);
});
t('away three days, then a week', () => {
  assert.equal(R.decide(base(), at(13)).msg.kind, 'away');
  assert.match(R.decide(base(), at(13)).msg.body, /3 days since chapter 2, shloka 47\. .+\(\d+\.\d+\)/);
  assert.equal(R.decide(base(), at(16)).msg.kind, 'away');
  assert.equal(R.decide(base(), at(17)).msg.kind, 'away_long');
  assert.equal(R.decide(base(), at(24)).msg.kind, 'away_far');
  const lost = R.decide(base({ hist: { '2026-11-08': 5, '2026-11-09': 5, '2026-11-10': 5 } }), at(13)).msg.body;
  assert.match(lost, /a 3-day streak ended/);
});
t('long away: the away message is not repeated back to back', () => {
  const s = base(), a = R.decide(s, at(13)).msg;
  assert.equal(a.kind, 'away');
  const b = R.decide(R.recordSent(s, a, at(13)), at(14)).msg;
  assert.notEqual(b.kind, 'away');
});
t('can finish the chapter today', () => {
  const d = R.decide(base({ left: { chapter: 4, plan: 561 } }), at(11));
  assert.equal(d.msg.kind, 'finish_chapter_today');
});
t('never the same kind two days running', () => {
  let s = base({ lastRead: at(11, 6).getTime(), lastOpen: at(11, 6).getTime() });
  const kinds = [];
  for (let d = 11; d <= 13; d++) { // within three days, so the "away" messages do not take over
    s = { ...s, lastRead: at(d, 6).getTime(), lastOpen: at(d, 6).getTime() - 4 * 36e5 };
    const r = R.decide(s, at(d, 12));
    assert.equal(r.send, true, r.why);
    kinds.push(r.msg.kind);
    s = { ...R.recordSent(s, r.msg, at(d, 12)), sent: { ...R.recordSent(s, r.msg, at(d, 12)).sent, ignored: 0 } };
  }
  assert.ok(kinds[0] !== kinds[1] && kinds[1] !== kinds[2], kinds.join());
});
t('unanswered reminders thin out, then stop; opening the app resets', () => {
  let s = base(), sentDays = [];
  for (let d = 11; d <= 30; d++) {
    const r = R.decide(s, at(d, 9));
    if (r.send) { sentDays.push(d); s = R.recordSent(s, r.msg, at(d, 9)); }
  }
  assert.deepEqual(sentDays.slice(0, 3), [11, 12, 13]);          // daily
  assert.deepEqual(sentDays.slice(3, 6), [15, 17, 19]);          // every second day
  assert.deepEqual(sentDays.slice(6), [23, 27]);                 // every fourth day, and the month is over
  s = { ...s, sent: { ...s.sent, ignored: 10 } };
  assert.match(R.decide(s, at(30, 9)).why, /quiet/);
  s = R.recordOpen(s, at(30, 6));
  assert.equal(s.sent.ignored, 0);
});
t('every text stays short and has no exclamation mark', () => {
  const states = [base(), base({ count: 0, day: '2026-11-11' }), base({ left: { chapter: 3, plan: 3 } }),
    base({ pos: { c: 18, v: 78, name: 'मोक्षसंन्यासयोग', meaning: 'x', count: 78 }, next: null, left: { chapter: 0, plan: 0 } })];
  for (const s of states) for (const d of [11, 14, 21, 29]) for (const m of R.candidates(s, at(d))) {
    assert.ok(m.title.length <= 48, m.title);
    assert.ok(m.body.length <= 170, `${m.kind}: ${m.body.length}`);
    assert.ok(!/!/.test(m.title + m.body), m.body);
    assert.ok(!/undefined|NaN|null/.test(m.title + m.body), m.body);
  }
});
t('streak and real pace', () => {
  const hist = { '2026-11-07': 4, '2026-11-08': 6, '2026-11-09': 5, '2026-11-10': 5 };
  assert.equal(R.streak(hist, '2026-11-10'), 4);
  assert.equal(R.streak(hist, '2026-11-11'), 4);            // nothing read yet today: yesterday keeps it
  assert.equal(R.streak(hist, '2026-11-12'), 0);            // a day missed
  assert.equal(R.streak({ ...hist, '2026-11-11': 1 }, '2026-11-11'), 5);
  assert.equal(R.rate(hist, '2026-11-10'), 5);              // 20 over 4 days
  assert.equal(R.rate(hist, '2026-11-11'), 4);              // a rest day counts
  assert.equal(R.rate({}, '2026-11-11'), 0);
  const s = base({ hist, lastOpen: at(10, 20).getTime() });
  const kinds = new Set(R.candidates(s, at(11)).map(m => m.kind));
  assert.ok(kinds.has('streak'));
  assert.match(R.candidates(s, at(11)).find(m => m.kind === 'streak').title, /4 days in a row/);
  assert.match(R.greeting(s, at(11)), /4 days in a row/);
});
t('chapter finished with its record: days taken, pace, time for the rest', () => {
  const s = base({ pos: { c: 2, v: 72, name: 'सांख्ययोग', meaning: 'The Yoga of Knowledge', count: 72 }, left: { chapter: 0, plan: 582 },
    chapter: { c: 2, name: 'सांख्ययोग', days: 6, perDay: 12 },
    next: { c: 3, v: 1, hook: 'If knowledge is higher, why act at all?' },
    nextChapter: { c: 3, name: 'कर्मयोग', meaning: 'The Yoga of Action', opening: 'x.' } });
  const m = R.candidates(s, at(11)).find(x => x.kind === 'chapter_done');
  assert.equal(m.title, 'Chapter 2 complete in 6 days');
  assert.match(m.body, /12 shlokas a day\. At that rate the rest of the Gita takes 49 days\. Next: कर्मयोग\./);
});
t('every line of wisdom names its verse', () => {
  for (const [ref, text] of R.WISDOM) { assert.match(ref, /^\d+\.\d+$/); assert.ok(text.length < 90 && !/!/.test(text)); }
});
t('the plan arithmetic', () => {
  assert.equal(R.perDayFor(701, 100), 8);
  assert.equal(R.pace(701, 5, at(11), 0).days, 141);
  assert.equal(R.pace(10, 5, at(11), 0).date, '12 November');
  assert.equal(R.pace(10, 5, at(11), 5).date, '13 November'); // today's share already read
  assert.equal(R.scope({ from: 1, to: 18 }), 'the Gita');
  assert.equal(R.scope({ from: 2, to: 2 }), 'chapter 2');
});
t('the greeting on return', () => {
  assert.match(R.greeting(base(), at(13)), /You were at अध्याय 2 · श्लोक 47, 3 days ago\. 25 shlokas left/);
  assert.equal(R.greeting({}, at(13)), '');
});
console.log(`remind.js ok: ${n} checks`);
