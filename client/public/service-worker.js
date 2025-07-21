const CACHE_NAME = 'journowl-v1.1.0';
const BACKGROUND_SYNC_TAG = 'journowl-background-sync';
const PENDING_WRITES_STORE = 'journowl-pending-writes';

const STATIC_CACHE_URLS = [
  '/',
  '/auth',
  '/dashboard',
  '/import',
  '/share',
  '/manifest.json',
  '/offline.html',
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

// IndexedDB setup for offline data storage
const DB_NAME = 'JournOwlOfflineDB';
const DB_VERSION = 1;

async function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Store for pending writes (journal entries, etc.)
      if (!db.objectStoreNames.contains(PENDING_WRITES_STORE)) {
        const store = db.createObjectStore(PENDING_WRITES_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
}

// Install event - cache core assets and initialize offline storage
self.addEventListener('install', (event) => {
  console.log('JournOwl Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME)
        .then((cache) => {
          console.log('Caching core assets...');
          return cache.addAll(STATIC_CACHE_URLS);
        }),
      initIndexedDB()
        .then(() => console.log('IndexedDB initialized for offline storage'))
    ])
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

  // Handle POST requests (writes) with background sync for offline support
  if (request.method === 'POST' && url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request.clone())
        .then((response) => {
          return response;
        })
        .catch(async () => {
          // Network failed, store for background sync
          console.log('Network failed for POST request, storing for background sync');
          
          try {
            const requestData = {
              url: request.url,
              method: request.method,
              headers: Object.fromEntries(request.headers.entries()),
              body: request.method !== 'GET' ? await request.text() : null,
              timestamp: Date.now(),
              type: 'api_write'
            };

            const db = await initIndexedDB();
            const transaction = db.transaction([PENDING_WRITES_STORE], 'readwrite');
            const store = transaction.objectStore(PENDING_WRITES_STORE);
            await store.add(requestData);

            // Register for background sync
            if (self.registration && self.registration.sync) {
              await self.registration.sync.register(BACKGROUND_SYNC_TAG);
            }

            return new Response(JSON.stringify({
              success: true,
              message: 'Saved offline. Will sync when back online.',
              offline: true
            }), {
              status: 202,
              headers: { 'Content-Type': 'application/json' }
            });
          } catch (error) {
            console.error('Failed to store offline request:', error);
            return new Response(JSON.stringify({
              success: false,
              message: 'Failed to save offline. Please try again when online.',
              error: error.message
            }), {
              status: 500,
              headers: { 'Content-Type': 'application/json' }
            });
          }
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

// Enhanced Background Sync - Retry failed requests when back online
self.addEventListener('sync', (event) => {
  if (event.tag === BACKGROUND_SYNC_TAG) {
    console.log('Background sync triggered, processing pending writes...');
    event.waitUntil(processPendingWrites());
  }
});

async function processPendingWrites() {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([PENDING_WRITES_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_WRITES_STORE);
    const allRequests = await getAllFromStore(store);

    console.log(`Processing ${allRequests.length} pending writes`);

    for (const requestData of allRequests) {
      try {
        const response = await fetch(requestData.url, {
          method: requestData.method,
          headers: requestData.headers,
          body: requestData.body
        });

        if (response.ok) {
          // Success - remove from pending writes
          await store.delete(requestData.id);
          console.log('Successfully synced pending write:', requestData.url);
          
          // Notify user of successful sync
          if (self.registration && self.registration.showNotification) {
            self.registration.showNotification('🦉 JournOwl Sync Complete', {
              body: 'Your offline changes have been synced successfully!',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
              tag: 'sync-success'
            });
          }
        } else {
          console.error('Failed to sync pending write:', response.status, requestData.url);
        }
      } catch (error) {
        console.error('Error syncing pending write:', error, requestData.url);
        // Keep the request for next sync attempt
      }
    }
  } catch (error) {
    console.error('Error processing pending writes:', error);
  }
}

function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

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

// Message handling for manual sync triggers and service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_NOW') {
    console.log('Manual sync requested');
    processPendingWrites();
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.tag === 'sync-success') {
    // Open JournOwl when sync notification is clicked
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/dashboard');
        }
      })
    );
  } else if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});