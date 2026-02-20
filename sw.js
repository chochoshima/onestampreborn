const CACHE_NAME = "onestampreborn-v3";

const ASSETS = [
  "/",
  "/index.html",
  "/stempel.html",
  "/css/style.css",
  "/manifest.json"
];

// Install
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch (SAFE VERSION)
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  // Jangan intercept external request
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
