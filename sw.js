// Service Worker for offline GPS tracking capability
const CACHE_NAME = 'ultra-gps-tracker-v1';
const urlsToCache = [
    '/',
    '/ultra-gps-tracker.html',
    '/v3.html',
    // Add other assets as needed
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Handle background sync for GPS data
self.addEventListener('sync', (event) => {
    if (event.tag === 'gps-sync') {
        event.waitUntil(syncGPSData());
    }
});

function syncGPSData() {
    // Handle GPS data synchronization when connection is restored
    return new Promise((resolve) => {
        console.log('Syncing GPS data...');
        // Add your sync logic here
        resolve();
    });
}

// Handle offline fallback
self.addEventListener('fetch', (event) => {
    if (event.request.destination === 'document') {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    if (response) {
                        return response;
                    }
                    
                    return fetch(event.request)
                        .then((response) => {
                            // Cache successful responses
                            if (response.status === 200) {
                                const responseClone = response.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                            }
                            return response;
                        })
                        .catch(() => {
                            // If both cache and network fail, try to serve a fallback
                            return caches.match('/v3.html') || caches.match('/ultra-gps-tracker.html');
                        });
                })
        );
    } else {
        // For non-document requests, use the original fetch handler
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        );
    }
});

// Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
