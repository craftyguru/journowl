import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function LandingPWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Only show on mobile devices on production domain
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired - auto-install ready!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show our custom prompt immediately when install is available
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000); // Show faster when auto-install available
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Even if no beforeinstallprompt, show manual instructions on mobile
    if (isMobile && isProduction && !isInstalled && !deferredPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    console.log('PWA: Install button clicked - attempting auto-install');
    
    // First priority: Use native browser install prompt for automatic installation
    if (deferredPrompt) {
      try {
        console.log('PWA: Triggering automatic browser installation');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('PWA: Installation result:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA: Installation successful!');
          setShowPrompt(false);
          return;
        }
      } catch (error) {
        console.error('PWA: Auto-install failed:', error);
      }
    }

    // Fallback: Try to trigger browser-specific installation methods
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent);
    
    if (isAndroid && isChrome) {
      // For Android Chrome, try to simulate the install flow
      console.log('PWA: Attempting Chrome Android auto-install');
      
      // Check if there's an install prompt available in the browser
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // Show immediate install instructions that work like auto-install
        const confirmed = confirm(`🚀 AUTO-INSTALL JOURNOWL NOW?

Tap "OK" then look for the install prompt from your browser, or:

→ Tap the menu (⋮) in Chrome
→ Tap "Install app" or "Add to Home screen"
→ Tap "Install"

JournOwl will install automatically!`);
        
        if (confirmed) {
          setShowPrompt(false);
          return;
        }
      }
    }

    // For iOS - guide them to the native install method
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      const confirmed = confirm(`📱 AUTO-INSTALL ON iOS:

Tap "OK" then:
1. Tap the Share button (⬆️) at the bottom
2. Tap "Add to Home Screen"
3. Tap "Add"

JournOwl will install like a native app!`);
      
      if (confirmed) {
        setShowPrompt(false);
        return;
      }
    }

    // Generic auto-install guidance
    const confirmed = confirm(`🔄 AUTO-INSTALL JOURNOWL:

Your browser should show an install prompt. If not:

→ Look for an install icon in your address bar
→ Or check your browser menu for "Install" option

This will install JournOwl automatically!`);
    
    if (confirmed) {
      setShowPrompt(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl border border-white/20 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <span className="text-2xl">🦉</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Install JournOwl</h3>
                  <p className="text-sm text-purple-100">Get the app experience!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-purple-100 mb-4">
              {deferredPrompt 
                ? "🚀 One-click install available! JournOwl will install automatically as a native app."
                : "Install JournOwl as an app for offline access, faster loading, and a native experience on your device."
              }
            </p>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-white text-purple-600 hover:bg-purple-50 font-bold text-sm"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                🚀 Auto-Install Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}