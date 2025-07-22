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

    // Check if PWA event was already fired before React component mounted
    if ((window as any).deferredPrompt) {
      console.log('PWA Debug: Found existing deferredPrompt on mount');
      setDeferredPrompt((window as any).deferredPrompt);
      setIsInstallable(true);
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Debug: beforeinstallprompt event fired in React component');
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

    // Always show helper button if not installed (for both dev and production)
    if (!isInstalled) {
      setTimeout(() => {
        console.log('PWA Debug: Showing helper button');
        console.log('PWA Debug: Current deferredPrompt:', !!deferredPrompt);
        console.log('PWA Debug: Global deferredPrompt:', !!(window as any).deferredPrompt);
        setShowDevHelper(true);
      }, 3000); // Show after 3 seconds to allow time for beforeinstallprompt
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    console.log('PWA Debug: Install button clicked!');
    console.log('PWA Debug: deferredPrompt exists:', !!deferredPrompt);
    console.log('PWA Debug: isInstallable:', isInstallable);
    console.log('PWA Debug: hostname:', window.location.hostname);
    
    // FIRST - Try to trigger the browser's install prompt if available
    if (deferredPrompt) {
      console.log('PWA Debug: Triggering install prompt');
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('PWA Debug: User choice outcome:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA Debug: User accepted the install prompt');
          setIsInstalled(true);
        } else {
          console.log('PWA Debug: User dismissed the install prompt');
        }
        
        setDeferredPrompt(null);
        setIsInstallable(false);
        return;
      } catch (error) {
        console.error('PWA Debug: Error during install prompt:', error);
      }
    }

    // CRITICAL EXPLANATION: Why the install button "does nothing"
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      alert(`🔍 PWA Install Button Analysis:

WHY THE BUTTON SEEMS TO "DO NOTHING":
❌ The beforeinstallprompt event hasn't fired yet
❌ Chrome requires 30-60+ seconds of active browsing
❌ Must visit the site multiple times over several days
❌ Cannot be in private/incognito mode
❌ Must show "user engagement signals"

CURRENT STATUS:
• beforeinstallprompt event: ${deferredPrompt ? '✅ FIRED' : '❌ NOT FIRED'}
• Browser: ${navigator.userAgent.includes('Chrome') ? 'Chrome ✅' : 'Other browser'}
• Domain: ${window.location.hostname === 'journowl.app' ? 'Production ✅' : 'Development'}

MANUAL INSTALLATION (WORKS NOW):
1. Tap browser menu (⋮) 
2. Look for "Add to Home screen" or "Install app"
3. Tap it to install JournOwl

The install button will work automatically once browser engagement requirements are met!`);
      return;
    }
    
    // SECOND - For mobile devices, try to open browser menu programmatically or show instructions
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      // Try to trigger mobile browser's Add to Home Screen
      try {
        // For Android Chrome, try to access the browser menu
        if ('getInstalledRelatedApps' in navigator) {
          const relatedApps = await (navigator as any).getInstalledRelatedApps();
          if (relatedApps.length === 0) {
            // App not installed, continue with manual instructions
          }
        }
        
        // Show platform-specific mobile instructions
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
          // For iOS, we must use manual instructions
          const confirmInstall = confirm(`📱 Install JournOwl on iPhone/iPad:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to install JournOwl as an app

Ready to try this now?`);
          
          if (confirmInstall) {
            // Try to show share sheet (Safari only)
            if ((navigator as any).share) {
              try {
                await (navigator as any).share({
                  title: 'JournOwl - Install App',
                  text: 'Install JournOwl as an app on your device',
                  url: window.location.href
                });
              } catch (err) {
                console.log('Share failed, user cancelled or not supported');
              }
            }
          }
        } else if (isAndroid) {
          const confirmInstall = confirm(`📱 Install JournOwl on Android:

OPTION 1: Browser Menu
• Tap menu (⋮) → "Add to Home screen"

OPTION 2: Address Bar  
• Look for install icon in address bar

Should I open the browser menu for you?`);
          
          if (confirmInstall) {
            // Try to show native menu on Android
            try {
              // Attempt to trigger context menu (limited browser support)
              document.body.addEventListener('contextmenu', function(e) {
                e.preventDefault();
              }, { once: true });
              
              // Fallback: Focus address bar to highlight install option
              if (window.location.hash !== '#install') {
                window.location.hash = '#install';
                setTimeout(() => {
                  window.location.hash = '';
                }, 100);
              }
            } catch (err) {
              console.log('Could not programmatically open menu');
            }
          }
        }
        return;
      } catch (error) {
        console.error('Mobile install attempt failed:', error);
      }
    }
    
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
      
      // Mobile-specific installation guidance
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        alert(`📱 Install JournOwl on iPhone/iPad:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"  
3. Tap "Add" to install JournOwl as an app

Note: iOS Safari doesn't support automatic install prompts. Manual installation is the only way on iPhone/iPad.`);
      } else if (isAndroid) {
        alert(`📱 Install JournOwl on Android:

OPTION 1 - Browser Menu:
1. Tap the menu (⋮) in your browser
2. Look for "Add to Home screen" or "Install app"
3. Tap it to install

OPTION 2 - Address Bar:
1. Look for a download/install icon in the address bar
2. Tap it to install

If you don't see these options, try:
• Use the app for 1-2 minutes first
• Visit the site multiple times
• Make sure you're using Chrome or Edge browser

Why no auto-prompt? Browsers require user engagement before showing install prompts.`);
      } else {
        alert(`💻 Install JournOwl on Desktop:

1. Look for install icon (⬇️) in address bar (Chrome/Edge)
2. Click it to install as desktop app

OR use browser menu:
• Chrome: Menu → More tools → Create shortcut
• Edge: Menu → Apps → Install this site as an app

Mobile users should visit journowl.app on their phone for app installation.`);
      }
      return;
    }

    console.log('PWA Debug: Triggering install prompt');
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('PWA Debug: User choice outcome:', outcome);
      
      if (outcome === 'accepted') {
        console.log('PWA Debug: User accepted the install prompt');
      } else {
        console.log('PWA Debug: User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('PWA Debug: Error during install prompt:', error);
      alert('PWA installation failed. Please try using your browser menu to add to home screen.');
    }
  };

  // Show button if installable OR show helper for install guidance
  if (isInstalled) {
    return null;
  }

  const isDev = window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost';
  const isProduction = window.location.hostname === 'journowl.app';
  
  // Always show button on production or if installable, hide only if no conditions met
  if (!isInstallable && !isDev && !isProduction && !showDevHelper) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600 cursor-pointer"
      style={{ pointerEvents: 'auto' }}
    >
      <Smartphone className="w-4 h-4" />
      <Download className="w-4 h-4" />
      {isInstallable ? 'Install App' : 'Install Help'}
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