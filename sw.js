// Cards of the Lost: keeps the game playable offline. Cache version c42b4210df.
const CACHE = 'cotl-c42b4210df', FILES = ['./', 'index.html', 'game.bin', 'icon-180.png', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const fresh = e.request.mode === 'navigate' || e.request.url.endsWith('game.bin');
  if (fresh){
    const slot = e.request.mode === 'navigate' ? './' : 'game.bin';
    e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(slot, copy)); return r; }).catch(() => caches.match(slot)));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
});
