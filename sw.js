/* ==========================================================================
   ProDown - Progressive Web App Service Worker Engine v2.0
   ========================================================================== */

const CACHE_NAME = 'prodown-v1';

// فۆڵدەر و فایلێن پێویست بۆ پاشەکەوتکرن د کەش دا (Offline Cache Assets)
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/assets/css/style.css',
    '/assets/js/app.js',
    '/manifest.json',
    '/assets/images/logo.png',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap'
];

// ڕووداوا دابەزاندن و دامەزراندنا Service Worker (Install Event)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ProDown SW] Caching app shell and static assets...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ProDown SW] Installation failed:', error);
            })
    );
});

// ڕووداوا چالاککرن و پاقژکرنا کەشێن کۆن (Activate Event)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cache) => {
                        if (cache !== CACHE_NAME) {
                            console.log('[ProDown SW] Deleting old cache:', cache);
                            return caches.delete(cache);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[ProDown SW] Service worker activated successfully.');
                return self.clients.claim();
            })
    );
});

// بەڕێوەبرتنا داواکاریێن تۆڕێ (Fetch Strategy: Network First with Cache Fallback)
self.addEventListener('fetch', (event) => {
    // ڕەتکرنەوەیا داواکاریێن غیر-GET یان API هەتا کێشە بۆ داونلۆدکرنێ دروست نەبێت
    if (event.request.method !== 'GET') return;
    
    // فلتەرکرنا داواکاریێن API بۆ ئەوەی ڕاستەوخۆ بچنە سێرڤەر
    if (event.request.url.includes('/api/') || event.request.url.includes('co.wuk.sh') || event.request.url.includes('cobalt.tools')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // ئەگەر وەڵامێ سێرڤەری سەرکەوتوو بوو، کۆپیەکێ د کەش دا نوو بکە
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // ئەگەر ئینتەرنێت نەبوو، فایلی پاشەکەوتکری د کەش دا ڤەگەڕێنە
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // وەڵامێ سادە بۆ دەمێ ئۆفلاین
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

// بەڕێوەبرتنا پەیامێن ناوەکی (Message Event)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

