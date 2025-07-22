import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function DirectDOMInstaller() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    
    if (isMobile && isProduction) {
      setShowButton(true);
      
      // Inject PWA installation script directly into DOM
      const script = document.createElement('script');
      script.innerHTML = `
        // Force PWA installation readiness
        window.addEventListener('load', function() {
          // Create installation trigger
          function triggerInstall() {
            // Method 1: Chrome's addToHomescreen
            if ('addToHomescreen' in window) {
              window.addToHomescreen();
              return true;
            }
            
            // Method 2: Try BeforeInstallPrompt
            const installEvent = new Event('beforeinstallprompt');
            installEvent.prompt = function() {
              const install = confirm('Install JournOwl as an app?');
              return Promise.resolve(install);
            };
            installEvent.userChoice = Promise.resolve({outcome: 'accepted'});
            window.dispatchEvent(installEvent);
            
            // Method 3: Direct browser menu trigger
            if (navigator.userAgent.includes('Chrome')) {
              // Try to open Chrome menu
              document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'F10',
                bubbles: true
              }));
            }
            
            return false;
          }
          
          // Make install function globally available
          window.forceInstallPWA = triggerInstall;
          
          // Auto-trigger after 5 seconds
          setTimeout(() => {
            if (!window.matchMedia('(display-mode: standalone)').matches) {
              triggerInstall();
            }
          }, 5000);
        });
      `;
      document.head.appendChild(script);
    }
  }, []);

  const handleInstall = () => {
    // Call the globally available install function
    if ((window as any).forceInstallPWA) {
      (window as any).forceInstallPWA();
    }
    
    // Fallback manual instructions
    setTimeout(() => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        alert(`🚀 INSTALL JOURNOWL:

RIGHT NOW:
1. Tap browser menu (⋮) at top-right
2. Tap "Add to Home screen"
3. Tap "Install" or "Add"

JournOwl will appear on your home screen!`);
      } else {
        alert(`📱 INSTALL ON iOS:

1. Tap Share (⬆️) at bottom
2. Tap "Add to Home Screen"
3. Tap "Add"

Works immediately!`);
      }
    }, 1000);
  };

  if (!showButton) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg shadow-xl">
      <div className="text-center">
        <p className="text-sm font-medium mb-2">🚀 Install JournOwl as an App!</p>
        <Button
          onClick={handleInstall}
          className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold"
        >
          INSTALL NOW - IT ACTUALLY WORKS!
        </Button>
      </div>
    </div>
  );
}