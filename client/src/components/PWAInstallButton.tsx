import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  platforms: string[];
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  prompt(): Promise<void>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showDevHelper, setShowDevHelper] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if we're in development mode
    const isProduction = window.location.hostname === 'journowl.app';
    const isDev = window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost';
    
    console.log('PWA Debug: Environment check', {
      hostname: window.location.hostname,
      isProduction,
      isDev,
      protocol: window.location.protocol
    });

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Debug: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA Debug: app installed event');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // In development, always show the helper button after a delay
    if (isDev && !isInstalled) {
      setTimeout(() => {
        console.log('PWA Debug: Showing dev helper button');
        setShowDevHelper(true);
      }, 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // In development mode, show helper modal instead
      const isDev = window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost';
      if (isDev) {
        alert(`PWA Installation Info:

🚀 For full PWA installation, visit: https://journowl.app

Why it doesn't work here:
• Development domains don't trigger install prompts
• Browsers require trusted production domains
• Full PWA features need HTTPS production environment

On production (journowl.app):
• Install button will work automatically
• Mobile users get native install prompts
• Full offline capabilities available

Current environment: Development Mode`);
        return;
      }
      return;
    }

    console.log('PWA Debug: Triggering install prompt');
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA Debug: User accepted the install prompt');
    } else {
      console.log('PWA Debug: User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // Show button if installable OR in development mode
  if (isInstalled) {
    return null;
  }

  const isDev = window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost';
  
  // Hide button if not installable and not in dev mode
  if (!isInstallable && !isDev) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
    >
      <Smartphone className="w-4 h-4" />
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
}

// Mobile install banner component
export function MobilePWABanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Only show on mobile devices and check PWA requirements
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const isHTTPS = window.location.protocol === 'https:';
    
    console.log('PWA Mobile Check:', { isMobile, isInstalled, isHTTPS, origin: window.location.origin });
    
    if (!isMobile || isInstalled || !isHTTPS) {
      if (!isHTTPS) console.log('PWA requires HTTPS for mobile installation');
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('Mobile beforeinstallprompt event triggered');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Show iOS install instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  if (isIOS && !showBanner) {
    return (
      <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">📱 Install JournOwl App</h3>
            <p className="text-xs opacity-90 mt-1">
              Tap the share button <span className="text-lg">⬆️</span> then "Add to Home Screen"
            </p>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="ml-3 text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || sessionStorage.getItem('pwa-banner-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🦉</div>
          <div>
            <div className="font-semibold text-sm">Install JournOwl</div>
            <div className="text-xs opacity-90">Get the app for a better experience</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 text-xs px-3"
          >
            Not now
          </Button>
          <Button
            onClick={handleInstall}
            variant="secondary"
            size="sm"
            className="bg-white text-purple-600 hover:bg-gray-100 text-xs px-3"
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}