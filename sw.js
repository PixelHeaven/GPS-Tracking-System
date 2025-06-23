// Service Worker for offline GPS tracking capability
const CACHE_NAME = 'ultra-gps-tracker-v1';
const urlsToCache = [
    '/',
    '/ultra-gps-tracker.html',
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
