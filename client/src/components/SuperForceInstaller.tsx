import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Zap, AlertTriangle } from 'lucide-react';

export function SuperForceInstaller() {
  const [showInstaller, setShowInstaller] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile && isProduction && !isInstalled) {
      setShowInstaller(true);
    }
  }, []);

  const superForceInstall = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // Show Android instructions with immediate action
      const installMessage = `🚀 INSTALL JOURNOWL RIGHT NOW:

STEP 1: Tap "OK" on this message
STEP 2: Tap the menu button (⋮) in your browser 
STEP 3: Tap "Add to Home screen" or "Install app"
STEP 4: Tap "Install" or "Add"

YOUR APP WILL INSTALL IMMEDIATELY!

Ready? Tap OK to continue!`;

      const userReady = confirm(installMessage);
      
      if (userReady) {
        // Create multiple installation triggers
        setTimeout(() => {
          // First attempt - trigger browser menu
          const menuEvent = new KeyboardEvent('keydown', {
            key: 'F10',
            keyCode: 121,
            which: 121,
            bubbles: true
          });
          document.dispatchEvent(menuEvent);
        }, 500);

        setTimeout(() => {
          // Second attempt - context menu
          const contextEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: window.innerWidth - 50,
            clientY: 50
          });
          document.body.dispatchEvent(contextEvent);
        }, 1000);

        setTimeout(() => {
          // Final prompt with exact instructions
          alert(`⚡ QUICK! WHILE THIS MESSAGE IS SHOWING:

1. Look for browser menu (⋮) at top-right
2. Tap "Add to Home screen" 
3. Tap "Install"

DO IT NOW - The option should be visible!`);
        }, 1500);

        setTimeout(() => {
          // Success confirmation
          const installed = confirm(`🎉 DID JOURNOWL INSTALL?

If YES: Tap OK - You're done!
If NO: Tap Cancel and we'll try another method`);

          if (installed) {
            setShowInstaller(false);
            alert('🎉 Success! JournOwl is now installed on your device!');
          } else {
            // Alternative method
            alert(`🔧 ALTERNATIVE METHOD:

1. Copy this URL: ${window.location.href}
2. Open Chrome browser
3. Paste URL and visit site
4. Tap menu (⋮) → "Add to Home screen"
5. Tap "Install"

This method works 100% of the time!`);
          }
        }, 4000);
      }
    } else {
      // iOS instructions
      alert(`📱 INSTALL ON IPHONE/IPAD:

1. Tap Share button (⬆️) at bottom
2. Scroll down, tap "Add to Home Screen"
3. Tap "Add"

Works immediately on iOS Safari!`);
    }
  };

  if (!showInstaller) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-xl border-2 border-yellow-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-6 h-6 animate-pulse" />
          <span className="font-bold">INSTALL JOURNOWL AS APP</span>
        </div>
        <Button
          onClick={superForceInstall}
          className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold animate-pulse"
          size="sm"
        >
          <Zap className="w-4 h-4 mr-1" />
          INSTALL NOW
        </Button>
      </div>
      <p className="text-sm mt-2">Tap "INSTALL NOW" for step-by-step instructions that actually work!</p>
    </div>
  );
}