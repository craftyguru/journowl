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

    // Check for existing global deferredPrompt first
    if ((window as any).deferredPrompt) {
      console.log('PWA: Using existing global deferredPrompt');
      setDeferredPrompt((window as any).deferredPrompt);
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired - auto-install ready!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      (window as any).deferredPrompt = e;
      
      // Show our custom prompt immediately when install is available
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000); // Show faster when auto-install available
      }
    };

    // Listen for custom PWA installable event from index.html
    const handlePWAInstallable = (e: CustomEvent) => {
      console.log('PWA: Custom installable event received');
      setDeferredPrompt(e.detail);
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('pwa-installable', handlePWAInstallable as EventListener);

    // Even if no beforeinstallprompt, show manual instructions on mobile
    if (isMobile && isProduction && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000); // Show after 4 seconds if no install prompt
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('pwa-installable', handlePWAInstallable as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    console.log('PWA: Install button clicked - attempting auto-install');
    console.log('PWA: deferredPrompt available:', !!deferredPrompt);
    console.log('PWA: Global deferredPrompt available:', !!(window as any).deferredPrompt);
    
    // Try global deferredPrompt first
    const promptToUse = deferredPrompt || (window as any).deferredPrompt;
    
    if (promptToUse) {
      try {
        console.log('PWA: Triggering automatic browser installation');
        await promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;
        console.log('PWA: Installation result:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA: Installation successful!');
          setShowPrompt(false);
          setDeferredPrompt(null);
          (window as any).deferredPrompt = null;
          return;
        }
      } catch (error) {
        console.error('PWA: Auto-install failed:', error);
      }
    } else {
      console.log('PWA: No install prompt available, showing manual instructions');
    }

    // Fallback: Show platform-specific manual instructions
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent);
    
    if (isIOS) {
      alert(`📱 INSTALL JOURNOWL ON iOS:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm installation

JournOwl will appear on your home screen as a native app!`);
    } else if (isAndroid) {
      alert(`📱 INSTALL JOURNOWL ON ANDROID:

1. Tap the menu (⋮) in your browser
2. Look for "Install app" or "Add to Home screen"
3. Tap "Install" to confirm

JournOwl will install automatically to your home screen!`);
    } else {
      alert(`💻 INSTALL JOURNOWL:

Look for an install icon in your browser's address bar, or:
1. Chrome/Edge: Menu → Install JournOwl
2. Firefox: Menu → Install This Site as App

This creates a desktop app version of JournOwl!`);
    }
    
    setShowPrompt(false);
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