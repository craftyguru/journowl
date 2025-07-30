import { useState, useEffect } from 'react';

export function PWAUpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Listen for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setIsUpdating(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });

      // Check for pending updates
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          setShowBanner(true);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowBanner(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    setIsUpdating(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ action: 'skipWaiting' });
        }
      });
    }
  };

  if (!showBanner && !isUpdating) return null;

  if (isUpdating) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 z-50 text-center">
        <div className="flex items-center justify-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          <span>🦉 JournOwl is updating to the latest version...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 z-50">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <span>🚀</span>
          <span>A new version of JournOwl is available!</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleUpdate}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-white/70 hover:text-white px-2"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}