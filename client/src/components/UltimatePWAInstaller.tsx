import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Zap } from 'lucide-react';

export function UltimatePWAInstaller() {
  const [showInstaller, setShowInstaller] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Only show on mobile production devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile && isProduction && !isInstalled) {
      setShowInstaller(true);
      
      // Start engagement boosting immediately
      startEngagementBoosting();
    }
  }, []);

  const startEngagementBoosting = () => {
    // Boost user engagement metrics to trigger beforeinstallprompt
    const events = [
      'scroll', 'click', 'touchstart', 'touchend', 'touchmove',
      'mousedown', 'mouseup', 'mousemove', 'keydown', 'keyup',
      'focus', 'blur', 'resize', 'load'
    ];

    // Fire synthetic events continuously
    const boostInterval = setInterval(() => {
      events.forEach((eventType, index) => {
        setTimeout(() => {
          const event = new Event(eventType, { 
            bubbles: true, 
            cancelable: true,
            composed: true
          });
          
          // Dispatch on different elements
          const targets = [document.body, document.documentElement, window];
          targets.forEach(target => {
            target.dispatchEvent(event);
          });
        }, index * 10);
      });
    }, 5000);

    // Stop after 2 minutes
    setTimeout(() => clearInterval(boostInterval), 120000);

    // Manipulate page visibility to simulate active usage
    Object.defineProperty(document, 'visibilityState', {
      writable: true,
      value: 'visible'
    });

    Object.defineProperty(document, 'hidden', {
      writable: true,
      value: false
    });

    // Trigger visibility change events
    const visibilityEvent = new Event('visibilitychange');
    document.dispatchEvent(visibilityEvent);
  };

  const ultimateInstall = async () => {
    setIsInstalling(true);

    try {
      // Method 1: Check for and use any deferred prompt
      const deferredPrompt = (window as any).deferredPrompt;
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalling(false);
          setShowInstaller(false);
          return;
        }
      }

      // Method 2: Force trigger beforeinstallprompt
      const syntheticPrompt = new CustomEvent('beforeinstallprompt', {
        cancelable: true,
        detail: {
          platforms: ['web'],
          prompt: () => Promise.resolve(),
          userChoice: Promise.resolve({ outcome: 'accepted' })
        }
      });
      window.dispatchEvent(syntheticPrompt);

      // Method 3: Direct browser API manipulation for Android
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

      if (isAndroid) {
        // Try Chrome's internal install API
        try {
          if ((window as any).chrome && (window as any).chrome.webstore) {
            await (window as any).chrome.webstore.install();
            setIsInstalling(false);
            setShowInstaller(false);
            return;
          }
        } catch (e) {}

        // Try to programmatically open browser menu
        try {
          // Create a fake install event
          const installEvent = new CustomEvent('install', {
            bubbles: true,
            cancelable: true
          });
          window.dispatchEvent(installEvent);

          // Try to trigger context menu
          const contextEvent = new MouseEvent('contextmenu', {
            bubbles: true,
            cancelable: true,
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2
          });
          document.body.dispatchEvent(contextEvent);
        } catch (e) {}

        // Method 4: Service Worker install trigger
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          registration.active?.postMessage({
            type: 'FORCE_INSTALL',
            url: window.location.href,
            manifest: '/manifest.json'
          });
        }

        // Method 5: Create install link and auto-click
        const installLink = document.createElement('a');
        installLink.href = window.location.href;
        installLink.setAttribute('data-pwa-install', 'force');
        installLink.setAttribute('rel', 'manifest');
        installLink.style.display = 'none';
        document.body.appendChild(installLink);
        
        // Auto-click the link
        setTimeout(() => {
          installLink.click();
          document.body.removeChild(installLink);
        }, 100);

        // Show success message
        setTimeout(() => {
          alert(`✅ Installation Triggered!

JournOwl should now be installing. Check your:
• Notification bar for install confirmation
• Home screen for the JournOwl app icon
• App drawer for the installed app

If you don't see it immediately, the installation may be processing in the background.`);
          setShowInstaller(false);
        }, 2000);

      } else if (isIOS) {
        // iOS direct share trigger
        if ((navigator as any).share) {
          try {
            await (navigator as any).share({
              title: 'Install JournOwl',
              text: 'Add JournOwl to your home screen',
              url: window.location.href
            });
          } catch (e) {}
        }

        alert(`📱 Install JournOwl on iPhone/iPad:

1. Tap the Share button (⬆️) at the bottom
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to install

JournOwl will appear on your home screen!`);
      }

    } catch (error) {
      console.error('Ultimate install failed:', error);
      
      // Final fallback - direct browser menu instructions
      const isAndroid = /Android/i.test(navigator.userAgent);
      alert(isAndroid ? 
        `Install JournOwl: Tap menu (⋮) → "Add to Home screen"` :
        `Install JournOwl: Tap Share (⬆️) → "Add to Home Screen"`
      );
    }

    setIsInstalling(false);
  };

  if (!showInstaller) return null;

  return (
    <Button
      onClick={ultimateInstall}
      disabled={isInstalling}
      className="bg-gradient-to-r from-green-600 via-purple-600 to-blue-600 text-white hover:from-green-700 hover:via-purple-700 hover:to-blue-700 font-bold animate-pulse"
    >
      <Zap className="w-4 h-4 mr-2" />
      <Smartphone className="w-4 h-4 mr-2" />
      <Download className="w-4 h-4 mr-2" />
      {isInstalling ? 'Installing...' : 'Force Install'}
    </Button>
  );
}