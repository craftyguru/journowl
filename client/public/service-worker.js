const CACHE_NAME = 'journowl-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/auth',
  '/dashboard',
  '/manifest.json',
  // Add core CSS and JS files that get built
  // Note: In production, you'd want to add the actual built asset paths
];

const API_CACHE_URLS = [
  '/api/auth/me',
  '/api/journal/entries',
  '/api/stats',
  '/api/achievements',
  '/api/goals'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('JournOwl Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching core assets...');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('JournOwl Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('JournOwl Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('JournOwl Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (page loads)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Serve cached page or offline page
          return caches.match('/')
            .then((cachedResponse) => {
              return cachedResponse || new Response(
                `<!DOCTYPE html>
                <html>
                <head>
                  <title>JournOwl - Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { 
                      font-family: Arial, sans-serif; 
                      text-align: center; 
                      padding: 50px; 
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      margin: 0;
                      min-height: 100vh;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                    }
                    .owl { font-size: 4rem; margin-bottom: 1rem; }
                    h1 { margin: 0 0 1rem 0; }
                    p { margin: 0.5rem 0; opacity: 0.9; }
                    .retry-btn {
                      background: rgba(255,255,255,0.2);
                      border: 2px solid white;
                      color: white;
                      padding: 12px 24px;
                      margin-top: 20px;
                      border-radius: 8px;
                      font-size: 16px;
                      cursor: pointer;
                    }
                    .retry-btn:hover {
                      background: rgba(255,255,255,0.3);
                    }
                  </style>
                </head>
                <body>
                  <div class="owl">🦉</div>
                  <h1>JournOwl is Offline</h1>
                  <p>You're not connected to the internet right now.</p>
                  <p>Your wise writing companion will be back once you're online!</p>
                  <button class="retry-btn" onclick="window.location.reload()">
                    Try Again
                  </button>
                </body>
                </html>`,
                {
                  headers: { 'Content-Type': 'text/html' }
                }
              );
            });
        })
    );
    return;
  }

  // Handle API requests with cache-first strategy for reads
  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET' && API_CACHE_URLS.some(path => url.pathname.startsWith(path))) {
      event.respondWith(
        caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              // Serve from cache and update in background
              fetch(request)
                .then((response) => {
                  if (response.status === 200) {
                    caches.open(CACHE_NAME)
                      .then((cache) => cache.put(request, response.clone()));
                  }
                })
                .catch(() => {
                  // Network failed, cached version is still valid
                });
              return cachedResponse;
            }

            // Not in cache, fetch and cache
            return fetch(request)
              .then((response) => {
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(request, responseClone));
                }
                return response;
              });
          })
      );
      return;
    }
  }

  // Handle static assets (images, fonts, etc.)
  if (request.destination === 'image' || request.destination === 'font' || request.destination === 'style') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseClone));
              }
              return response;
            });
        })
    );
    return;
  }

  // Default: network first, fallback to cache
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.match(request);
      })
  );
});

// Background sync for offline journal entries (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'journal-sync') {
    event.waitUntil(
      // Future: sync offline journal entries when back online
      console.log('Background sync: journal entries')
    );
  }
});

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const notificationData = event.data.json();
    const options = {
      body: notificationData.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      tag: 'journowl-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Open JournOwl'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(notificationData.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});