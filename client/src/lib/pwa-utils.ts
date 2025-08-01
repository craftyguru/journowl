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
    // Listen for force update messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'FORCE_UPDATE') {
        console.log('[PWA] Force update received:', event.data.payload);
        
        showForceUpdateNotification(event.data.payload);
        
        // Force reload after short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
    
    // DISABLED: Service worker controllerchange auto-reload to prevent infinite loops
    // navigator.serviceWorker.addEventListener('controllerchange', () => {
    //   console.log('[PWA] Service worker updated, reloading...');
    //   window.location.reload();
    // });
    
    navigator.serviceWorker.ready.then(registration => {
      // DISABLED: All automatic update checking to prevent infinite loops
      // Manual update checking only through app UI
      console.log('[PWA] Service worker ready, automatic updates disabled');
      
      // Only listen for manual update events, no automatic checking
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('[PWA] Manual update found, installing...');
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version ready for manual activation');
              // Only show notification, don't auto-activate
              showUpdateNotification();
            }
          });
        }
      });
      
      // NO automatic update checks - prevents infinite loops
    });
    
    // DISABLED: Automatic server version checking to prevent infinite loops
    // checkServerVersion();
    // setInterval(checkServerVersion, 5 * 60 * 1000);
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

function showForceUpdateNotification(payload: any) {
  // Create force update notification
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 10px;
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 15px;
    font-weight: bold;
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
    animation: slideIn 0.3s ease-out;
    border: 2px solid rgba(255, 255, 255, 0.2);
  `;
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="font-size: 24px;">🚀</div>
      <div>
        <div style="margin-bottom: 4px;">New Version Available!</div>
        <div style="font-size: 12px; opacity: 0.9;">Updating JournOwl automatically...</div>
      </div>
    </div>
  `;
  
  // Add animation keyframes if not already added
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
  
  // Keep notification visible longer for force updates
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}

// DISABLED: checkServerVersion function to prevent infinite update loops
async function checkServerVersion() {
  console.log('[PWA] Automatic server version checking is permanently disabled to prevent infinite loops');
  return; // Exit early - no automatic version checks
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