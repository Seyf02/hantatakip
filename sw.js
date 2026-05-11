// HantaTakip Service Worker
// Offline cache için temel veriler saklanır
const CACHE = 'hantatakip-v1';
const OFFLINE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(OFFLINE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // API isteklerini her zaman ağdan al
  if (url.hostname.includes('rss2json') || url.hostname.includes('hantacount')) {
    e.respondWith(
      fetch(e.request).catch(() => new Response('{"error":"offline"}', { headers: { 'Content-Type': 'application/json' } }))
    );
    return;
  }

  // Diğer istekler: önce cache, yoksa ağ
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
