import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X } from 'lucide-react';

export function FloatingInstallButton() {
  const [showButton, setShowButton] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const isHTTPS = window.location.protocol === 'https:';
    const isProduction = window.location.hostname === 'journowl.app';
    
    // Check if user has dismissed this button before
    const hasSeenButton = localStorage.getItem('floating-install-dismissed');
    
    console.log('Floating Install Button Check:', {
      isMobile,
      isInstalled, 
      isHTTPS,
      isProduction,
      hasSeenButton,
      userAgent: navigator.userAgent
    });

    // Show button if all conditions are met
    if (isMobile && !isInstalled && isHTTPS && isProduction && !hasSeenButton) {
      // Show after 5 seconds to let user see the page first
      const timer = setTimeout(() => {
        setShowButton(true);
        setTimeout(() => setIsVisible(true), 100);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      alert(`📱 Install JournOwl on your iPhone/iPad:

Steps:
1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and find "Add to Home Screen"
3. Tap "Add to Home Screen"
4. Tap "Add" to install

JournOwl will appear on your home screen like a native app!

Tip: Only works in Safari browser, not Chrome on iOS.`);
    } else if (isAndroid) {
      alert(`📱 Install JournOwl on your Android:

Method 1 - Browser Menu:
1. Tap the menu button (⋮) in your browser
2. Look for "Add to Home screen" or "Install app"
3. Tap it to install JournOwl

Method 2 - Address Bar:
1. Look for a download/install icon in the address bar
2. Tap it to install

Why no automatic prompt?
• Browser needs more user interaction first
• Try using the app for 1-2 minutes
• Visit multiple times to build engagement

Once installed:
• JournOwl works offline
• Faster loading
• Native app experience`);
    }

    // Mark as seen and hide
    handleDismiss();
  };

  const handleDismiss = () => {
    localStorage.setItem('floating-install-dismissed', 'true');
    setIsVisible(false);
    setTimeout(() => setShowButton(false), 300);
  };

  if (!showButton) return null;

  return (
    <div className={`fixed bottom-20 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-full opacity-0 scale-95'
    }`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg border border-white/20">
        <div className="flex items-center gap-2">
          <Button
            onClick={handleInstall}
            size="sm"
            className="bg-white text-purple-600 hover:bg-white/90 text-sm px-4 py-2 h-10 rounded-full font-medium"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            <Download className="w-4 h-4 mr-2" />
            Install App
          </Button>
          
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2 h-8 w-8 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}