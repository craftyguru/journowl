const CACHE_NAME = 'journowl-v1.3.0';
const BACKGROUND_SYNC_TAG = 'journowl-background-sync';
const PENDING_WRITES_STORE = 'journowl-pending-writes';
const WIDGET_CACHE = 'journowl-widgets';

const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/offline.html'
  // Only cache essential files that definitely exist
  // Skip dynamic routes that may not exist
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
          // Cache files individually to handle failures gracefully
          return Promise.allSettled(
            STATIC_CACHE_URLS.map(url => 
              cache.add(url).catch(err => {
                console.warn(`Failed to cache ${url}:`, err);
                return null;
              })
            )
          );
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
      // Continue with installation even if some caching fails
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and enable background sync
self.addEventListener('activate', (event) => {
  console.log('JournOwl Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== WIDGET_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Initialize widget cache
      caches.open(WIDGET_CACHE),
      // Take control immediately
      self.clients.claim()
    ])
    .then(async () => {
      console.log('JournOwl Service Worker activated with enhanced offline support');
      
      // Register periodic background sync for data consistency
      if ('periodicSync' in self.registration) {
        await self.registration.periodicSync.register('journal-sync', {
          minInterval: 12 * 60 * 60 * 1000 // 12 hours
        });
        console.log('Periodic background sync registered');
      }
      
      // Notify all clients about enhanced capabilities
      return self.clients.matchAll()
        .then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              message: 'JournOwl now supports full offline mode with background sync and widgets!',
              features: {
                backgroundSync: true,
                widgets: true,
                offline: true,
                periodicSync: 'periodicSync' in self.registration
              }
            });
          });
        });
    })
    .catch((error) => {
      console.error('Service Worker activation failed:', error);
    })
  );
});

// Enhanced Background Sync Event Handler
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(syncPendingData());
  }
});

// Periodic Background Sync for data consistency
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic background sync triggered:', event.tag);
  
  if (event.tag === 'journal-sync') {
    event.waitUntil(performPeriodicSync());
  }
});

// Enhanced periodic sync function
async function performPeriodicSync() {
  try {
    console.log('Performing periodic sync...');
    
    // Sync pending writes
    await syncPendingData();
    
    // Update widget data cache
    await updateWidgetCache();
    
    console.log('Periodic sync completed successfully');
  } catch (error) {
    console.error('Periodic sync failed:', error);
  }
}

// Update widget data cache for better performance
async function updateWidgetCache() {
  try {
    const response = await fetch('/api/widget/quick-entry');
    if (response.ok) {
      const widgetData = await response.json();
      const cache = await caches.open(WIDGET_CACHE);
      await cache.put('/api/widget/quick-entry', new Response(JSON.stringify(widgetData)));
      console.log('Widget cache updated');
    }
  } catch (error) {
    console.error('Failed to update widget cache:', error);
  }
}

// Enhanced sync function for all pending data
async function syncPendingData() {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([PENDING_WRITES_STORE], 'readonly');
    const store = transaction.objectStore(PENDING_WRITES_STORE);
    const pendingWrites = await getAllFromStore(store);
    
    console.log(`Syncing ${pendingWrites.length} pending writes...`);
    
    for (const write of pendingWrites) {
      try {
        const response = await fetch(write.url, {
          method: write.method,
          headers: write.headers,
          body: write.body,
          credentials: 'include'
        });
        
        if (response.ok) {
          await removeFromIndexedDB(write.id);
          console.log('Successfully synced:', write.type);
          
          // Show notification for successful sync
          if (self.registration.showNotification) {
            self.registration.showNotification('JournOwl Sync Complete', {
              body: `Your ${write.type} has been synchronized`,
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
              tag: 'sync-success'
            });
          }
          
          // Notify client about successful sync
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'SYNC_SUCCESS',
              data: { type: write.type, id: write.id }
            });
          });
        }
      } catch (error) {
        console.warn('Failed to sync write:', write.type, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Widget support for increased reach
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'WIDGET_REQUEST') {
    handleWidgetRequest(event);
  }
  
  if (event.data && event.data.type === 'WIDGET_ACTION') {
    handleWidgetAction(event);
  }
});

// Handle widget interactions
async function handleWidgetAction(event) {
  try {
    const { action, data } = event.data;
    
    if (action === 'saveEntry') {
      // Save the journal entry from widget
      const response = await fetch('/api/widget/quick-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: data.journalContent,
          mood: data.mood || 'neutral'
        })
      });
      
      if (response.ok) {
        // Show success notification
        if (self.registration.showNotification) {
          self.registration.showNotification('🦉 Entry Saved!', {
            body: 'Your journal entry has been saved successfully.',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: 'widget-success'
          });
        }
        
        event.ports[0].postMessage({
          type: 'WIDGET_SUCCESS',
          message: 'Journal entry saved successfully!'
        });
      } else {
        throw new Error('Failed to save entry');
      }
    }
  } catch (error) {
    console.error('Widget action failed:', error);
    event.ports[0].postMessage({
      type: 'WIDGET_ERROR',
      message: 'Failed to save entry. Please try again.'
    });
  }
}

async function handleWidgetRequest(event) {
  try {
    // Try to get widget data from cache first, then network
    const cache = await caches.open(WIDGET_CACHE);
    const cachedResponse = await cache.match('/api/widget/quick-entry');
    
    let widgetData;
    if (cachedResponse) {
      widgetData = await cachedResponse.json();
    } else {
      // Fallback widget data
      widgetData = {
        template: "quick-entry",
        data: {
          placeholder: "What's on your mind today? 🦉",
          prompts: [
            "How are you feeling right now?",
            "What made you smile today?",
            "What are you grateful for?",
            "Describe your current mood in three words",
            "What's the best thing that happened today?",
            "What challenge did you overcome today?",
            "What are you looking forward to?",
            "What did you learn today?"
          ]
        }
      };
    }
    
    event.ports[0].postMessage({
      type: 'WIDGET_RESPONSE',
      data: widgetData
    });
  } catch (error) {
    console.error('Widget request failed:', error);
    
    // Send error response
    event.ports[0].postMessage({
      type: 'WIDGET_ERROR',
      message: 'Widget data unavailable'
    });
  }
}

// Helper functions for IndexedDB operations
function getAllFromStore(store) {
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removeFromIndexedDB(id) {
  const db = await initIndexedDB();
  const transaction = db.transaction([PENDING_WRITES_STORE], 'readwrite');
  const store = transaction.objectStore(PENDING_WRITES_STORE);
  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Store failed requests for background sync
async function storeForSync(url, method, headers, body, type) {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction([PENDING_WRITES_STORE], 'readwrite');
    const store = transaction.objectStore(PENDING_WRITES_STORE);
    
    const writeData = {
      url,
      method,
      headers,
      body,
      type,
      timestamp: Date.now()
    };
    
    return new Promise((resolve, reject) => {
      const request = store.add(writeData);
      request.onsuccess = () => {
        console.log('Stored for background sync:', type);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to store for sync:', error);
  }
}

// Helper function to determine request type
function getRequestType(url) {
  if (url.includes('/api/journal/entries')) return 'journal_entry';
  if (url.includes('/api/auth/')) return 'auth';
  if (url.includes('/api/')) return 'api_request';
  return 'unknown';
}

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

    // Handle POST/PUT/DELETE requests with background sync
    if (request.method !== 'GET') {
      event.respondWith(
        fetch(request)
          .then((response) => response)
          .catch(async (error) => {
            // Store failed write for background sync
            const headers = {};
            for (const [key, value] of request.headers.entries()) {
              headers[key] = value;
            }
            
            const body = request.method !== 'GET' ? await request.clone().text() : null;
            
            await storeForSync(
              request.url,
              request.method,
              headers,
              body,
              getRequestType(request.url)
            );
            
            // Register background sync
            if (self.registration.sync) {
              await self.registration.sync.register(BACKGROUND_SYNC_TAG);
              console.log('Background sync registered for failed request');
            }
            
            // Show notification about offline save
            if (self.registration.showNotification) {
              self.registration.showNotification('🦉 Saved Offline', {
                body: 'Your changes are saved and will sync when you\'re back online.',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                tag: 'offline-save'
              });
            }
            
            // Return an offline response
            return new Response(
              JSON.stringify({
                success: true,
                offline: true,
                message: 'Content saved offline and will sync when connection returns'
              }),
              {
                status: 202,
                headers: { 
                  'Content-Type': 'application/json',
                  'X-Offline-Mode': 'true'
                }
              }
            );
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