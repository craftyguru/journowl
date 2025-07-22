import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

export function MobilePWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const isHTTPS = window.location.protocol === 'https:';
    const isProduction = window.location.hostname === 'journowl.app';
    
    // Check if user has dismissed this prompt before
    const hasSeenPrompt = localStorage.getItem('pwa-prompt-dismissed');
    
    console.log('Mobile PWA Prompt Check:', {
      isMobile,
      isInstalled, 
      isHTTPS,
      isProduction,
      hasSeenPrompt,
      userAgent: navigator.userAgent
    });

    // Show prompt if all conditions are met
    if (isMobile && !isInstalled && isHTTPS && isProduction && !hasSeenPrompt) {
      // Delay showing the prompt to allow user to engage with site
      const timer = setTimeout(() => {
        setShowPrompt(true);
        // Animate in after a short delay
        setTimeout(() => setIsVisible(true), 100);
      }, 10000); // Show after 10 seconds of site usage

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      alert(`📱 Install JournOwl on your iPhone/iPad:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and find "Add to Home Screen"
3. Tap "Add to Home Screen"
4. Tap "Add" to install JournOwl as an app

Once installed, you can open JournOwl directly from your home screen like any other app!`);
    } else if (isAndroid) {
      alert(`📱 Install JournOwl on your Android:

METHOD 1 - Browser Menu:
1. Tap the menu button (⋮) in your browser
2. Look for "Add to Home screen" or "Install app"
3. Tap it to install JournOwl

METHOD 2 - Address Bar:
1. Look for a download icon in the address bar
2. Tap it to install

If you don't see install options:
• Use Chrome or Edge browser
• Try refreshing the page
• Make sure you're on journowl.app (not a subdomain)

Once installed, JournOwl will work offline and feel like a native app!`);
    }

    // Mark as seen and hide
    handleDismiss();
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', 'true');
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt) return null;

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Smartphone className="w-6 h-6" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Install JournOwl App</h3>
            <p className="text-xs text-white/90 mb-3">
              Add JournOwl to your home screen for a better experience. Works offline!
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white text-purple-600 hover:bg-white/90 text-xs px-3 py-1 h-8"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 text-xs px-3 py-1 h-8"
              >
                Not now
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-1 h-6 w-6 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}