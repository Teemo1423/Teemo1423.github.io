const CACHE_NAME = 'mohyeonsomang-pwa-v2';
const APP_SHELL = [
  '/',
  '/app.html',
  '/app-download.html',
  '/css/app.css',
  '/js/app.js',
  '/content/site.json',
  '/content/sermons.json',
  '/content/news.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/assets/site/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => null));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => null);
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('/app.html') || caches.match('/')))
  );
});
