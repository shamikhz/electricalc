// axiscaculator Service Worker (PWA Install Enabled — Network Only / No Offline Caching)
// Explicit requirement: App must NOT work offline.

const CACHE_NAME = 'axiscaculator-v1-no-offline';

self.addEventListener('install', (event) => {
  // Activate immediately without pre-caching pages
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear any existing caches to ensure no offline persistence
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Network-only fetch strategy: Do not cache or serve offline responses
self.addEventListener('fetch', (event) => {
  // Pass all requests directly to the network
  event.respondWith(
    fetch(event.request).catch(() => {
      // Intentionally reject or return a 503 response if offline
      return new Response('Internet connection required. Offline usage is disabled.', {
        status: 503,
        statusText: 'Service Unavailable Offline',
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});
