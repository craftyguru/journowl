import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function MobilePWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isInstalled);

    if (isInstalled) return;

    // Only for mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isHTTPS = window.location.protocol === 'https:';
    const isProduction = window.location.hostname === 'journowl.app';

    if (!isMobile || !isHTTPS || !isProduction) {
      return;
    }

    console.log('Mobile PWA Installer: Setting up for mobile device');

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('Mobile PWA: beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      console.log('Mobile PWA: App installed successfully');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowMobilePrompt(false);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Show mobile prompt after user has had time to engage
    const timer = setTimeout(() => {
      if (!isInstalled) {
        console.log('Mobile PWA: Showing mobile prompt');
        setShowMobilePrompt(true);
      }
    }, 15000); // Show after 15 seconds

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('Mobile PWA: Install clicked, deferredPrompt:', !!deferredPrompt);

    // If we have the native prompt, use it
    if (deferredPrompt) {
      try {
        console.log('Mobile PWA: Showing native install prompt');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('Mobile PWA: User choice:', outcome);
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        
        setDeferredPrompt(null);
        setShowMobilePrompt(false);
        return;
      } catch (error) {
        console.error('Mobile PWA: Native prompt failed:', error);
      }
    }

    // Fallback to manual instructions
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      alert(`📱 Install JournOwl on iPhone/iPad:

🔹 Step 1: Tap the Share button (⬆️) at the bottom of Safari
🔹 Step 2: Scroll down and tap "Add to Home Screen"
🔹 Step 3: Tap "Add" to install

After installation, JournOwl will appear on your home screen like a native app!`);
    } else if (isAndroid) {
      alert(`📱 Install JournOwl on Android:

🔹 Method 1: Tap the menu (⋮) in your browser → "Add to Home screen"
🔹 Method 2: Look for the install icon in your address bar and tap it

If you don't see these options:
• Make sure you're using Chrome or Edge
• Try visiting the site a few more times
• Use the app for a minute or two first

The browser needs to see you're actively using the site before showing install options.`);
    }
  };

  const handleDismiss = () => {
    setShowMobilePrompt(false);
    // Remember that user dismissed this
    localStorage.setItem('mobile-pwa-dismissed', Date.now().toString());
  };

  // Don't show if already installed or if user dismissed recently
  if (isInstalled || !showMobilePrompt) {
    return null;
  }

  // Check if dismissed recently (within 24 hours)
  const dismissedTime = localStorage.getItem('mobile-pwa-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-lg shadow-lg border border-white/20 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-start gap-3">
          <Smartphone className="w-6 h-6 mt-1 flex-shrink-0" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Install JournOwl App</h3>
            <p className="text-xs text-white/90 mb-3">
              Get the full experience! Install JournOwl as an app for offline access, faster loading, and native notifications.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleInstallClick}
                size="sm"
                className="bg-white text-purple-600 hover:bg-white/90 text-xs px-3 py-1 h-8 font-medium"
              >
                <Download className="w-3 h-3 mr-1" />
                {deferredPrompt ? 'Install Now' : 'Install Guide'}
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 text-xs px-3 py-1 h-8"
              >
                Later
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