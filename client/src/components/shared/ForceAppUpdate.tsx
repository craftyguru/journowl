import { useState } from 'react';

export function ForceAppUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);

  const forceHardUpdate = () => {
    setIsUpdating(true);
    
    // Show immediate notification
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px 30px;
      border-radius: 12px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 16px;
      font-weight: 600;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      text-align: center;
      min-width: 300px;
    `;
    notification.innerHTML = `
      <div style="margin-bottom: 12px;">🦉 JournOwl Updating...</div>
      <div style="font-size: 14px; font-weight: 400; opacity: 0.9;">
        Clearing cache and loading latest AI features
      </div>
      <div style="margin-top: 15px;">
        <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden;">
          <div style="width: 0%; height: 100%; background: white; border-radius: 2px; animation: progress 3s ease-out forwards;"></div>
        </div>
      </div>
    `;
    
    // Add progress animation
    if (!document.getElementById('update-progress-styles')) {
      const styles = document.createElement('style');
      styles.id = 'update-progress-styles';
      styles.textContent = `
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 60%; }
          100% { width: 100%; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Comprehensive cache clearing
    console.log('[Force Update] Starting comprehensive app update...');
    
    // 1. Clear all browser caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log('[Force Update] Clearing caches:', cacheNames);
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log('[Force Update] Deleting cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      });
    }
    
    // 2. Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    console.log('[Force Update] Cleared local storage');
    
    // 3. Unregister and re-register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('[Force Update] Unregistering service worker');
          registration.unregister();
        });
        
        // Re-register after a delay
        setTimeout(() => {
          navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
              console.log('[Force Update] Service worker re-registered');
              registration.update();
            });
        }, 1000);
      });
    }
    
    // 4. Force reload with cache bypass after 3 seconds
    setTimeout(() => {
      console.log('[Force Update] Performing hard reload...');
      // Use multiple reload methods for maximum compatibility
      window.location.href = window.location.href + '?cache_bust=' + Date.now();
    }, 3000);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={forceHardUpdate}
        disabled={isUpdating}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 
                   text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                   text-sm font-medium border border-purple-500/20"
      >
        {isUpdating ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Updating...
          </>
        ) : (
          <>
            🔄 Force Update
          </>
        )}
      </button>
    </div>
  );
}