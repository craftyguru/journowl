import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// PWA Hook
export function usePWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if already dismissed
    if (sessionStorage.getItem('pwa-dismissed') === 'true') {
      return;
    }

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      
      // Only show on mobile devices and production
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isProduction = window.location.hostname === 'journowl.app';
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname.includes('replit.dev');
      
      if (isMobile && (isProduction || isLocalhost)) {
        // Delay to prevent immediate flashing
        setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setShowPrompt(false);
      setDeferredPrompt(null);
      sessionStorage.setItem('pwa-dismissed', 'true');
    } catch (error) {
      console.error('PWA installation failed:', error);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  return {
    deferredPrompt,
    showPrompt,
    isInstalled,
    handleInstall,
    handleDismiss
  };
}

// Desktop install button component
export function PWAInstallButton() {
  const { isInstalled, deferredPrompt, handleInstall } = usePWAManager();

  if (isInstalled || !deferredPrompt) return null;

  return (
    <Button
      onClick={handleInstall}
      variant="outline"
      size="sm"
      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
}

// Mobile install prompt component
export function PWAMobilePrompt() {
  const { showPrompt, handleInstall, handleDismiss } = usePWAManager();

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
                onClick={handleDismiss}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-purple-100 mb-4">
              Install JournOwl as a native app for offline access and a better experience.
            </p>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-white text-purple-600 hover:bg-purple-50 font-bold text-sm"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Install Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
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