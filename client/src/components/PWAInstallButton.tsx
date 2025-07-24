import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const _isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(_isIOS);

    // Check if already installed (iOS and others)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;
    setIsInstalled(standalone);

    if (standalone) return;

    function handleBeforeInstallPrompt(e: Event) {
      console.log('PWA Debug: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    }

    function handleAppInstalled() {
      console.log('PWA Debug: app installed event');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', handleAppInstalled as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', handleAppInstalled as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('PWA Debug: Install button clicked');
    console.log('PWA Debug: deferredPrompt exists:', !!deferredPrompt);

    // If we have the native prompt, use it for direct installation
    if (deferredPrompt) {
      try {
        console.log('PWA Debug: Triggering native installation');
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
          console.log('PWA Debug: App installed successfully!');
          setIsInstalled(true);
          alert('🎉 JournOwl installed successfully! Find it in your apps or home screen.');
        } else {
          console.log('PWA Debug: User cancelled installation');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
        return;
      } catch (error) {
        console.error('PWA Debug: Error during native install:', error);
      }
    }

    // Only show manual instructions if native installation failed/unavailable
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isDevelopment()) {
      showDevelopmentMessage();
    } else if (isIOS) {
      showIOSInstructions();
    } else if (isAndroid) {
      showAndroidInstructions(false); // Native prompt not available
    } else if (isMobile) {
      showGenericMobileInstructions();
    } else {
      showDesktopInstructions();
    }
  };

  const isDevelopment = () =>
    window.location.hostname.includes('replit.dev') ||
    window.location.hostname === 'localhost';

  const showDevelopmentMessage = () => {
    alert(`🔧 DEVELOPMENT MODE DETECTED

PWA installation is only available on production domains (https://journowl.app).

On development domains, you can:
1. Test the app functionality
2. Deploy to production for full PWA features
3. Use browser dev tools to simulate PWA conditions`);
  };

  const showIOSInstructions = () => {
    alert(`📱 INSTALL JOURNOWL ON iOS:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm installation

JournOwl will appear on your home screen as a native app!`);
  };

  const showAndroidInstructions = (hasPrompt: boolean) => {
    if (hasPrompt) {
      alert(`📱 PWA INSTALL READY!

The browser is ready to install JournOwl as an app. Look for the install prompt or try the button again.

Manual install:
1. Tap menu (⋮) in your browser
2. Tap "Add to Home screen" or "Install app"
3. Tap "Install" to confirm`);
    } else {
      alert(`📱 INSTALL JOURNOWL ON ANDROID:

1. Tap the menu (⋮) in your browser
2. Tap "Add to Home screen" or "Install app"  
3. Tap "Install" to confirm

JournOwl will appear on your home screen like a native app!`);
    }
  };

  const showGenericMobileInstructions = () => {
    alert(`📱 INSTALL JOURNOWL AS AN APP:

Look for your browser's "Add to Home Screen" or "Install App" option in the menu.

This will add JournOwl to your home screen for quick access and offline use.`);
  };

  const showDesktopInstructions = () => {
    alert(`💻 INSTALL JOURNOWL ON DESKTOP:

Look for an install icon (⬇️) in your browser's address bar, or:

Chrome/Edge: Menu → More tools → Create shortcut → Check "Open as window"
Firefox: Menu → Page → Install This Site as App

This creates a desktop app version of JournOwl!`);
  };

  // Show the button if:
  // - Not already installed
  // - (Installable on this platform) OR (iOS and not standalone)
  if (isInstalled) return null;
  if (!isInstallable && !isIOS) return null;

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
    >
      <Smartphone className="w-4 h-4" />
      <Download className="w-4 h-4" />
      {isInstallable ? 'Install App' : 'Install Help'}
    </Button>
  );
}
