/**
 * Service Worker for Portfolio Website
 * Provides offline support and caching for better performance
 */

const CACHE_NAME = "portfolio-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/css/index.css",
  "/css/language.css",
  "/js/utils.js",
  "/js/citajJSON.js",
  "/js/indexMODAL.js",
  "/js/indexJQ.js",
  "/js/indexJS.js",
  "/js/validatorNew.js",
  "/js/i18n.js",
  "/js/menuAnimation.js",
  "/lang/en.json",
  "/lang/sr.json",
  "/assets/sasa.jpg",
  "/assets/space5.png",
  "/assets/favicon.svg",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching assets");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log("[Service Worker] Installation complete");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[Service Worker] Installation failed:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("[Service Worker] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("[Service Worker] Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip external CDN requests (let them load normally)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("[Service Worker] Serving from cache:", event.request.url);
        return cachedResponse;
      }

      // Not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache the new response for future use
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.error("[Service Worker] Fetch failed:", error);
          // Could return a custom offline page here
          throw error;
        });
    })
  );
});
