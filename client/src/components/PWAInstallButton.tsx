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
    const _isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
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

    // If we have the native prompt, use it
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setIsInstalled(true);
        setDeferredPrompt(null);
        setIsInstallable(false);
        return;
      } catch (error) {
        console.error('PWA Debug: Error during install prompt:', error);
      }
    }

    // Show explanation and manual instructions
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    if (isDevelopment()) {
      showDevelopmentMessage();
    } else if (isIOS) {
      showIOSInstructions();
    } else if (isAndroid) {
      showAndroidInstructions(!!deferredPrompt);
    } else if (isMobile) {
      showGenericMobileInstructions();
    } else {
      showDesktopInstructions();
    }
  };

  const isDevelopment = () =>
    window.location.hostname.includes('replit.dev') ||
    window.location.hostname === 'localhost';

  // Instruction functions unchanged, use as you have above

  const showDevelopmentMessage = () => { /* ... */ };
  const showIOSInstructions = () => { /* ... */ };
  const showAndroidInstructions = (hasPrompt: boolean) => { /* ... */ };
  const showGenericMobileInstructions = () => { /* ... */ };
  const showDesktopInstructions = () => { /* ... */ };

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
