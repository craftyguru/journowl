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
      
      // Also show automatically after 2 seconds for testing purposes
      setTimeout(showBanner, 2000);
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
        className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-md pointer-events-auto"
      >
        <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white rounded-xl shadow-2xl p-6 backdrop-blur-sm border-4 border-yellow-400 pointer-events-auto animate-bounce">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            onTouchEnd={handleDismiss}
            className="absolute top-2 right-2 h-8 w-8 bg-black/20 hover:bg-black/40 rounded-full touch-manipulation flex items-center justify-center"
            style={{ touchAction: 'manipulation' }}
          >
            <X className="h-4 w-4 text-white" />
          </button>

          <div className="text-center space-y-4">
            {/* Eye-catching icon and title */}
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white drop-shadow-lg">
                  🦉 Install JournOwl App!
                </h3>
                <p className="text-sm text-white/90 font-medium">
                  Get the full mobile experience
                </p>
              </div>
            </div>
            
            {/* Prominent install button */}
            <button
              onClick={handleInstallClick}
              onTouchEnd={handleInstallClick}
              className="w-full bg-yellow-300 text-black hover:bg-yellow-200 py-4 px-6 rounded-xl font-black text-lg flex items-center justify-center gap-3 shadow-xl border-4 border-red-500 touch-manipulation transform hover:scale-110 transition-all duration-200 animate-pulse"
              style={{ touchAction: 'manipulation' }}
            >
              <Download className="h-6 w-6" />
              <span className="text-lg">
                {isIOS ? "📱 Get Install Guide" : "🚀 Install App Now"}
              </span>
            </button>
            
            <p className="text-xs text-white/80 px-2">
              {isIOS 
                ? "Tap for step-by-step installation instructions"
                : "Install for faster access and offline journaling"
              }
            </p>
            
            {/* Smaller dismiss button */}
            <button
              onClick={handleDismiss}
              onTouchEnd={handleDismiss}
              className="text-white/60 hover:text-white/80 text-xs underline touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}