// shortcut: data, fonts and code are cache-first, so bump V whenever public/data changes
const V = 'gita-v6';
// The reader's plan and place, written by the page for the reminder code below. Kept apart from the versioned
// cache so a new version does not erase it.
const STATE = 'gita-state';
importScripts('/remind.js');
const CORE = ['/', '/manifest.webmanifest', '/icon-192.png', '/remind.js',
  '/data/index.json',
  ...Array.from({length:18},(_,i)=>`/data/chapter-${String(i+1).padStart(2,'0')}.json`),
  '/fonts/tiro-devanagari-sanskrit-devanagari-400-normal.woff2',
  '/fonts/tiro-devanagari-sanskrit-latin-400-normal.woff2',
  '/fonts/tiro-devanagari-sanskrit-latin-ext-400-normal.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(async c => {
    await c.addAll(CORE);
    // also store the page's own scripts and styles, so the stored page never points at files that are not stored
    const page = await c.match('/');
    const html = page ? await page.text() : '';
    const assets = [...new Set(html.match(/\/_next\/static\/[^"'\\ )<]+/g) || [])];
    await Promise.all(assets.map(u => c.add(u).catch(() => {})));
  }).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V && k !== STATE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const save = res => {
    if (res.ok) { const copy = res.clone(); caches.open(V).then(c => c.put(r, copy)); }
    return res;
  };
  // pages: network first, so a new deploy reaches installed readers; cache only when offline
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(save).catch(() => caches.match(r).then(hit => hit || caches.match('/'))));
    return;
  }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(save)));
});

// ---- reading reminders (rules and texts: /remind.js; the reader's side: lib/engine.js) ----
// Nothing is sent to a server. On an installed app Chrome wakes this worker now and then (periodic background sync);
// each time it reads the saved state and asks GitaRemind.decide whether a reminder is due. iPhone has no such
// wake-up, so there the reader sees the greeting on the title screen instead.
const readState = () => caches.open(STATE).then(c => c.match('/state.json')).then(r => r ? r.json() : null).catch(() => null);
const writeState = s => caches.open(STATE).then(c => c.put('/state.json', new Response(JSON.stringify(s), { headers: { 'Content-Type': 'application/json' } })));
async function remind(force) {
  const s = await readState();
  if (!s || Notification.permission !== 'granted') return;
  const now = new Date();
  const d = force ? { send: true, msg: self.GitaRemind.pick(s, now) } : self.GitaRemind.decide(s, now);
  if (!d.send || !d.msg) return;
  await self.registration.showNotification(d.msg.title, {
    body: d.msg.body, icon: '/icon-192.png', badge: '/badge-96.png', tag: 'gita-reading', renotify: true, lang: 'en',
    data: { kind: d.msg.kind },
  });
  // Read again before writing: only `sent` is this worker's to change, and the page may have saved meanwhile.
  if (!force) { const fresh = (await readState()) || s; await writeState(self.GitaRemind.recordSent(fresh, d.msg, now)); }
}
self.addEventListener('periodicsync', e => { if (e.tag === 'gita-remind') e.waitUntil(remind(false)); });
// The settings form asks for a sample of what would be sent ("show me one now").
self.addEventListener('message', e => { if (e.data && e.data.type === 'remind-test') e.waitUntil(remind(true)); });
// A tap on the reminder opens the reader, which returns to the reader's place by itself.
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws.find(x => 'focus' in x);
    return w ? w.focus() : self.clients.openWindow('/');
  }));
});
