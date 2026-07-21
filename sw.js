/* ==========================================================================
   ProDown Service Worker — Offline-first static asset cache
   ========================================================================== */

const CACHE_NAME    = 'prodown-v1';
const OFFLINE_URL   = '/';

const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/contact.html',
    '/privacy-policy.html',
    '/terms-of-service.html',
    '/assets/css/style.css',
    '/assets/js/app.js',
    '/assets/images/logo.png',
    '/manifest.json'
];

/* ── Install: pre-cache all static assets ───────────────────────────────── */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS))
    );
    self.skipWaiting();
});

/* ── Activate: remove stale caches ─────────────────────────────────────── */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

/* ── Fetch: network-first for API calls, cache-first for static assets ───── */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET, cross-origin API calls (download engines), and chrome-extension
    if (request.method !== 'GET') return;
    if (url.protocol === 'chrome-extension:') return;
    if (url.origin !== self.location.origin) return; // Let API calls go to network directly

    event.respondWith(
        caches.match(request).then(cached => {
            if (cached) return cached;
            return fetch(request).then(response => {
                // Cache successful same-origin GET responses
                if (response && response.status === 200 && response.type === 'basic') {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
                }
                return response;
            }).catch(() => {
                // Offline fallback: serve the homepage for navigation requests
                if (request.mode === 'navigate') return caches.match(OFFLINE_URL);
            });
        })
    );
});
