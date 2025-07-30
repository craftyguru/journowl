// PWA utility functions for cache management and updates

export function forcePWARefresh() {
  // Force service worker to update
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.update();
      });
    });
  }
  
  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Force reload after clearing caches
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

export function checkForPWAUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Service worker has been updated, refresh the page
      window.location.reload();
    });
    
    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available, but waiting
              console.log('New version available, refreshing...');
              newWorker.postMessage({ action: 'skipWaiting' });
            }
          });
        }
      });
      
      // Check for updates
      registration.update();
    });
  }
}

export function clearPWACache() {
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log('Deleting cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches cleared');
    });
  }
}