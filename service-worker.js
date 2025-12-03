const CACHE_NAME = "468-breathing-v1";
const URLS_TO_CACHE = [
    "/468-breathing/",
    "/468-breathing/index.html",
    "/468-breathing/manifest.webmanifest",
    "/468-breathing/assets/icon-192.png",
    "/468-breathing/assets/icon-512.png",
    // 필요하면 CSS/JS 번들도 추가 (예: ./assets/index-xxxxx.js, ./assets/index-xxxxx.css)
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});
