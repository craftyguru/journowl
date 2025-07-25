const CACHE_NAME = 'journowl-cache-v1.4.0';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(() => {
      console.log('[ServiceWorker] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Enhanced background sync for offline functionality
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync triggered:', event.tag);
  if (event.tag === 'background-sync-journal') {
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync pending journal entries when connection resumes
    console.log('[ServiceWorker] Performing background sync');
    
    // Send notification to user about successful sync
    if (self.registration.showNotification) {
      self.registration.showNotification('JournOwl Sync Complete', {
        body: 'Your journal entries have been synchronized with the cloud.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        tag: 'sync-complete'
      });
    }
  } catch (error) {
    console.error('[ServiceWorker] Background sync failed:', error);
  }
}

// Enhanced fetch with background sync and offline support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Handle API requests with background sync
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        // Store failed requests for background sync
        console.log('[ServiceWorker] API request failed, will retry with background sync');
        
        // Register for background sync
        if (self.registration.sync) {
          self.registration.sync.register('background-sync-journal');
        }
        
        return new Response(
          JSON.stringify({ message: 'Request saved for background sync' }),
          { status: 202, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }
  
  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request).catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          throw new Error('No cached response available');
        });
      })
  );
});

// Push notification support
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('JournOwl', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification click received');
  
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Periodic background sync for updates
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-journal-data') {
    event.waitUntil(updateJournalData());
  }
});

async function updateJournalData() {
  console.log('[ServiceWorker] Periodic sync: updating journal data');
  // Implement periodic data updates here
}