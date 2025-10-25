/**
 * Service Worker for Portfolio Website
 * Provides offline support and caching for better performance
 */

const CACHE_NAME = "portfolio-v2-webp";
const ASSETS_TO_CACHE = [
  // Core HTML, CSS, and JavaScript
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
  "/js/webpLazyLoader.js",
  "/js/webpPerformanceMonitor.js",

  // Language files
  "/lang/en.json",
  "/lang/sr.json",

  // Hero image (WebP + fallback)
  "/assets/sasa.webp",
  "/assets/sasa-mobile.webp",
  "/assets/sasa.jpg",

  // Technology icons (WebP + fallbacks)
  "/assets/java.webp",
  "/assets/java-mobile.webp",
  "/assets/java.png",
  "/assets/csharp.webp",
  "/assets/csharp-mobile.webp",
  "/assets/csharp.png",
  "/assets/cplusplus.webp",
  "/assets/cplusplus-mobile.webp",
  "/assets/cplusplus.png",
  "/assets/hcq.webp",
  "/assets/hcq-mobile.webp",
  "/assets/hcq.png",
  "/assets/sqlvbnet.webp",
  "/assets/sqlvbnet-mobile.webp",
  "/assets/sqlvbnet.png",

  // Project screenshots (WebP + fallbacks)
  "/assets/Video/kratki/vesti/csharpcode.webp",
  "/assets/Video/kratki/vesti/csharpcode-mobile.webp",
  "/assets/Video/kratki/vesti/csharpcode.png",
  "/assets/Video/kratki/vesti/vesti.webp",
  "/assets/Video/kratki/vesti/vesti-mobile.webp",
  "/assets/Video/kratki/vesti/vesti.png",
  "/assets/Video/kratki/milioner/pocetna.webp",
  "/assets/Video/kratki/milioner/pocetna-mobile.webp",
  "/assets/Video/kratki/milioner/pocetna.png",
  "/assets/Video/kratki/milioner/krajnja.webp",
  "/assets/Video/kratki/milioner/krajnja-mobile.webp",
  "/assets/Video/kratki/milioner/krajnja.png",
  "/assets/Video/kratki/zdravstvo/javacode.webp",
  "/assets/Video/kratki/zdravstvo/javacode-mobile.webp",
  "/assets/Video/kratki/zdravstvo/javacode.png",
  "/assets/Video/kratki/zdravstvo/login.webp",
  "/assets/Video/kratki/zdravstvo/login-mobile.webp",
  "/assets/Video/kratki/zdravstvo/login.png",
  "/assets/Video/kratki/HTML/glavnazavideo.webp",
  "/assets/Video/kratki/HTML/glavnazavideo-mobile.webp",
  "/assets/Video/kratki/HTML/glavnazavideo.png",
  "/assets/Video/kratki/HTML/pocetna.webp",
  "/assets/Video/kratki/HTML/pocetna-mobile.webp",
  "/assets/Video/kratki/HTML/pocetna.png",
  "/assets/Video/kratki/HTML/krajnja.webp",
  "/assets/Video/kratki/HTML/krajnja-mobile.webp",
  "/assets/Video/kratki/HTML/krajnja.png",

  // Decorative images (WebP + fallbacks)
  "/assets/fg_charisma.webp",
  "/assets/fg_charisma.jpg",
  "/assets/fg_perception.webp",
  "/assets/fg_perception.jpg",
  "/assets/fg_strength.webp",
  "/assets/fg_strength.jpg",
  "/assets/git.webp",
  "/assets/git.png",
  "/assets/bachelorhat.webp",
  "/assets/bachelorhat.png",

  // Other essential assets
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

// Fetch event - serve from cache, fallback to network with WebP awareness
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

          // For WebP images, try to serve fallback format from cache
          if (event.request.url.includes(".webp")) {
            const fallbackUrl = event.request.url
              .replace(".webp", ".png")
              .replace(".webp", ".jpg");
            console.log(
              "[Service Worker] WebP failed, trying fallback:",
              fallbackUrl
            );

            return caches.match(fallbackUrl).then((fallbackResponse) => {
              if (fallbackResponse) {
                console.log(
                  "[Service Worker] Serving fallback from cache:",
                  fallbackUrl
                );
                return fallbackResponse;
              }
              throw error;
            });
          }

          throw error;
        });
    })
  );
});

// Helper function to check WebP support (for future enhancements)
function supportsWebP() {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src =
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  });
}
