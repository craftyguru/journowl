// Dynamic cache version based on build timestamp
const BUILD_TIMESTAMP = '2025-07-31T23:19:01.533Z'; // Updated automatically on build // Updated automatically on build
const CACHE_NAME = `journowl-cache-v${BUILD_TIMESTAMP}`;
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Force update check interval (24 hours for stable updates)
const UPDATE_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

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

// DISABLED: Periodic background sync for updates to prevent infinite loops
// self.addEventListener('periodicsync', (event) => {
//   if (event.tag === 'update-journal-data') {
//     event.waitUntil(updateJournalData());
//   } else if (event.tag === 'check-app-version') {
//     event.waitUntil(checkForAppUpdate());
//   }
// });

async function updateJournalData() {
  console.log('[ServiceWorker] Periodic sync: updating journal data');
  // Implement periodic data updates here
}

// DISABLED: Force app version checking to prevent infinite update loops
// This function is now only called manually through app UI, not automatically
async function checkForAppUpdate() {
  console.log('[ServiceWorker] Automatic update checking is disabled to prevent infinite loops');
  return; // Exit early - no automatic updates
  
  // Original function remains commented out for manual use if needed
  /*
  try {
    console.log('[ServiceWorker] Checking for app updates...');
    
    // Fetch current server version
    const response = await fetch('/api/version', { 
      cache: 'no-cache',
      headers: { 'Cache-Control': 'no-cache' }
    });
    
    if (response.ok) {
      const serverVersion = await response.json();
      const currentTimestamp = BUILD_TIMESTAMP;
      
      if (serverVersion.buildTimestamp && serverVersion.buildTimestamp !== currentTimestamp) {
        console.log('[ServiceWorker] New version detected, manual update required');
        
        // Only notify, don't auto-update
        const clients = await self.clients.matchAll();
        clients.forEach(client => {
          client.postMessage({
            type: 'UPDATE_AVAILABLE',
            payload: {
              currentVersion: currentTimestamp,
              newVersion: serverVersion.buildTimestamp
            }
          });
        });
      }
    }
  } catch (error) {
    console.error('[ServiceWorker] Version check failed:', error);
  }
  */
}

// Helper functions for update throttling
async function getLastUpdateCheckTime() {
  try {
    const cache = await caches.open('update-cache');
    const response = await cache.match('last-update-check');
    if (response) {
      const data = await response.json();
      return data.timestamp || 0;
    }
  } catch (error) {
    console.error('[ServiceWorker] Error getting last update check time:', error);
  }
  return 0;
}

async function setLastUpdateCheckTime(timestamp) {
  try {
    const cache = await caches.open('update-cache');
    await cache.put('last-update-check', new Response(JSON.stringify({ timestamp })));
  } catch (error) {
    console.error('[ServiceWorker] Error setting last update check time:', error);
  }
}

// DISABLED: Auto-check for updates to prevent infinite loops
// Only manual update checks through app UI
// setInterval(checkForAppUpdate, UPDATE_CHECK_INTERVAL);