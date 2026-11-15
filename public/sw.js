// shortcut: data, fonts and code are cache-first, so bump V whenever public/data changes
const V = 'gita-v2';
const CORE = ['/', '/manifest.webmanifest', '/icon.svg',
  '/data/index.json',
  ...Array.from({length:18},(_,i)=>`/data/chapter-${String(i+1).padStart(2,'0')}.json`),
  '/fonts/tiro-devanagari-sanskrit-devanagari-400-normal.woff2',
  '/fonts/tiro-devanagari-sanskrit-latin-400-normal.woff2',
  '/fonts/tiro-devanagari-sanskrit-latin-ext-400-normal.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
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
