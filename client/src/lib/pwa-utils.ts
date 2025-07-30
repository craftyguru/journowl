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
    // Listen for service worker updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Service worker updated, reloading...');
      window.location.reload();
    });
    
    navigator.serviceWorker.ready.then(registration => {
      // Check for updates every 5 minutes when app is active
      setInterval(() => {
        console.log('[PWA] Checking for updates...');
        registration.update();
      }, 5 * 60 * 1000);
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('[PWA] New version found, installing...');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version installed, activating...');
              // Show update notification
              showUpdateNotification();
              // Skip waiting to activate immediately
              newWorker.postMessage({ action: 'skipWaiting' });
            }
          });
        }
      });
      
      // Initial update check
      registration.update();
    });
    
    // Check for app version updates from server
    checkServerVersion();
  }
}

function showUpdateNotification() {
  // Create a simple notification that the app is updating
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease-out;
  `;
  notification.textContent = '🦉 JournOwl is updating to the latest version...';
  
  // Add animation keyframes
  if (!document.getElementById('pwa-update-styles')) {
    const styles = document.createElement('style');
    styles.id = 'pwa-update-styles';
    styles.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styles);
  }
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

async function checkServerVersion() {
  try {
    const response = await fetch('/api/version', { cache: 'no-cache' });
    if (response.ok) {
      const serverVersion = await response.json();
      const currentVersion = localStorage.getItem('app-version');
      
      if (currentVersion && currentVersion !== serverVersion.version) {
        console.log(`[PWA] Server version updated: ${currentVersion} → ${serverVersion.version}`);
        localStorage.setItem('app-version', serverVersion.version);
        // Force service worker update
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => registration.update());
          });
        }
      } else if (!currentVersion) {
        localStorage.setItem('app-version', serverVersion.version);
      }
    }
  } catch (error) {
    console.log('[PWA] Could not check server version:', error);
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