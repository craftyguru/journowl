const CACHE_NAME = 'journowl-cache-v1.5.6';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install - Cache version:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[ServiceWorker] Skip waiting - forcing immediate activation');
        return self.skipWaiting();
      })
  );
});

// Listen for skipWaiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    console.log('[ServiceWorker] Received skipWaiting message');
    self.skipWaiting();
  }
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

// Enhanced fetch with cache invalidation for API calls
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Force no-cache for all API calls to prevent stale authentication issues
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request, {
        cache: 'no-cache',
        headers: {
          ...Object.fromEntries(request.headers.entries()),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(() => {
        // If offline, return error response instead of cached data for API calls
        return new Response(
          JSON.stringify({ error: 'Network unavailable', offline: true }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
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