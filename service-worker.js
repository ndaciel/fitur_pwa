var dataCacheName = 'spa-data-v1';
var cacheName = 'spa-cache-v1';
var filesToCache = [
 "./",
 "./favicon.ico",
 "./images",
 "./images/icons",
 "./images/icons/icon-128x128.png",
 "./images/icons/icon-144x144.png",
 "./images/icons/icon-152x152.png",
 "./images/icons/icon-192x192.png",
 "./images/icons/icon-256x256.png",
 "./images/icons/icon-512x512.png",
 "./index.html",
 "./pages/home.html",
 "./pages/indexdb.html",
 "./manifest.json",
 "./js",
 "./js/app.js",
 "./js/jquery.min.js",
 "./js/materialize.min.js",
 "./js/routepage.js",
 "./service-worker.js",
 "./styles",
 "./styles/style.css"
];

//Note:
// *. matikan fitur addEventListener 'install' jika ingin cache di browser tidak aktif 

// self.addEventListener('install', function(e) {
//   console.log('[ServiceWorker] Install');
//   e.waitUntil(
//     caches.open(cacheName).then(function(cache) {
//       console.log('[ServiceWorker] Caching app shell');
//       return cache.addAll(filesToCache);
//     })
//   );
// });

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (
           !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

