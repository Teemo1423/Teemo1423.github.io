const CACHE_NAME = 'mohyeonsomang-pwa-v4';
const APP_SHELL = [
  '/',
  '/app-download.html',
  '/css/church.css',
  '/js/site-data.js',
  '/js/nav-dropdowns.js',
  '/content/site.json',
  '/content/sermons.json',
  '/content/news.json',
  '/favicon.svg',
  '/apple-touch-icon-v2.png',
  '/assets/site/logo.png'
];

const STANDALONE_CSS = `\n@media (display-mode: standalone){\n  .mobile-app-link,\n  .home-app-cta-wrap,\n  .nav-app-install{display:none!important;}\n}\n`;

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

  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && url.pathname === '/css/church.css') {
    event.respondWith(
      fetch(event.request)
        .then(async response => {
          const css = await response.text();
          const patched = new Response(css + STANDALONE_CSS, {
            status: response.status,
            statusText: response.statusText,
            headers: {'Content-Type':'text/css; charset=utf-8'}
          });
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, patched.clone())).catch(() => null);
          return patched;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)).catch(() => null);
        return response;
      })
      .catch(() => caches.match(event.request).then(cached => cached || caches.match('/')))
  );
});
