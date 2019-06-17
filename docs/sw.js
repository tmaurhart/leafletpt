const swCache = 'leafletpg-v1';
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(swCache)
            .then(function (cache) {
                return cache.addAll([
                    '/leafletpt/',
                    'index.html',
                    'css/leaflet.css',
                    'css/style.css',
                    'js/leaflet.js',
                    'js/leaflet-tilelayer-wmts.js',
                    'icons/favicon.ico',
                    'icons/icon-512x512.png',
                    'icons/android-chrome-192x192.png',
                    'icons/android-chrome-256x256.png',
                    'icons/android-chrome-512x512.png',
                    'icons/apple-touch-icon.png',
                    'icons/favicon-16x16.png',
                    'icons/favicon-32x32.png',
                    'icons/mstile-150x150.png',
                    'icons/safari-pinned-tab.svg',
                    // 'images/layers-2x.png',
                    // 'images/layers.png',
                    'images/marker-icon-2x.png',
                    // 'images/marker-icon.png',
                    // 'images/marker-shadow.png',
                    'manifest.webmanifest'
                ]);
            })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== swCache) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});


// self.addEventListener('fetch', function (e) {
//     e.respondWith(
//         caches.match(e.request).then(function (response) {
//             return response || fetch(e.request);
//         })
//     );
// });

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.open(swCache).then(function (cache) {
            return cache.match(event.request).then(function (response) {
                return response || fetch(event.request).then(function (response) {
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});

// self.addEventListener('fetch', function (event) {
//     let online = navigator.onLine
//     if (!online) {
//         event.respondWith(
//             caches.match(event.request).then(function (res) {
//                 if (res) {
//                     return res;
//                 }
//                 requestBackend(event);
//             })
//         )
//     }
// });
