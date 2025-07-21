import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function MobilePWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
    console.log('PWA Debug: Device is iOS:', iOS);
    console.log('PWA Debug: User Agent:', navigator.userAgent);

    // Check if already in standalone mode (already installed)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any)?.standalone === true;
    setIsInStandaloneMode(standalone);
    console.log('PWA Debug: Is in standalone mode:', standalone);
    console.log('PWA Debug: Current hostname:', window.location.hostname);

    // Listen for beforeinstallprompt event (Android)
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner immediately when event fires
      if (!standalone) {
        setShowBanner(true);
      }
    };

    // Listen for custom PWA event from index.html
    const handlePWAInstallable = (e: CustomEvent) => {
      console.log('PWA: Custom pwa-installable event received');
      setDeferredPrompt(e.detail as BeforeInstallPromptEvent);
      if (!standalone) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('pwa-installable', handlePWAInstallable as EventListener);

    // For iOS or production testing, show banner after user interaction
    if ((iOS || window.location.hostname.includes('journowl') || window.location.hostname === 'localhost') && !standalone) {
      const showBanner = () => {
        setTimeout(() => {
          console.log('PWA: Showing banner for iOS/production testing');
          console.log('PWA: Device is iOS:', iOS);
          console.log('PWA: Is standalone:', standalone);
          console.log('PWA: Current hostname:', window.location.hostname);
          setShowBanner(true);
        }, 1000); // 1 second delay for testing
      };
      
      // Show after user interaction OR automatically after delay for testing
      document.addEventListener('click', showBanner, { once: true });
      document.addEventListener('touchstart', showBanner, { once: true });
      
      // Also show automatically after 3 seconds for testing purposes
      setTimeout(showBanner, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa-installable', handlePWAInstallable as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android installation
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install prompt outcome: ${outcome}`);
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } else if (isIOS) {
      // iOS: Show instructions
      alert('To install JournOwl:\n\n1. Tap the Share button at the bottom of your screen\n2. Select "Add to Home Screen"\n3. Tap "Add" to install JournOwl');
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Remember dismissal for this session
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  // Don't show if already installed, dismissed, or not ready
  if (isInStandaloneMode || !showBanner || sessionStorage.getItem('pwa-banner-dismissed')) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl p-4 backdrop-blur-sm border border-white/20">
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="absolute top-1 right-1 h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">
                🦉 Install JournOwl
              </h3>
              <p className="text-xs text-white/90 mt-1">
                {isIOS 
                  ? "Add JournOwl to your home screen for the best experience!"
                  : "Install JournOwl as an app for faster access and offline use!"
                }
              </p>
              
              <div className="mt-3 flex space-x-2">
                <Button
                  onClick={handleInstallClick}
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-white/90 flex-1 text-xs py-1 h-7"
                >
                  <Download className="h-3 w-3 mr-1" />
                  {isIOS ? "Install Guide" : "Install App"}
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 text-xs py-1 h-7"
                >
                  Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}