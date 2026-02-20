const CACHE_NAME = "onestampreborn-v4";

const ASSETS = [
  "/",
  "/index.html",
  "/stempel.html",
  "/style.css",
  "/data.js",
  "/manifest.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

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

self.addEventListener("fetch", event => {

  // 🚫 Jangan ganggu navigasi halaman (ini penyebab error kemarin)
  if (event.request.mode === "navigate") return;

  // 🚫 Hanya cache GET request
  if (event.request.method !== "GET") return;

  // 🚫 Hanya cache dari domain sendiri
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
