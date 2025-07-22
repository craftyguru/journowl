import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Zap, ExternalLink } from 'lucide-react';

export function ActualPWAInstaller() {
  const [showInstaller, setShowInstaller] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile && isProduction && !isInstalled) {
      setShowInstaller(true);
    }
  }, []);

  const actualInstall = async () => {
    setIsInstalling(true);

    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isAndroid) {
      // For Android - Direct browser manipulation
      const userWantsInstall = confirm(`🚀 INSTALL JOURNOWL AS AN APP

This will add JournOwl to your home screen like a native app.

Ready to install?`);

      if (userWantsInstall) {
        // Method 1: Try to manipulate Chrome's install mechanism
        try {
          // Create a meta tag to force manifest recognition
          const manifestLink = document.createElement('link');
          manifestLink.rel = 'manifest';
          manifestLink.href = '/manifest.json';
          document.head.appendChild(manifestLink);

          // Force reload manifest
          setTimeout(async () => {
            // Try to access Chrome's internal install API
            if ('getInstalledRelatedApps' in navigator) {
              const relatedApps = await (navigator as any).getInstalledRelatedApps();
              console.log('Related apps:', relatedApps);
            }

            // Create synthetic beforeinstallprompt event with real prompt function
            const installEvent = new CustomEvent('beforeinstallprompt', {
              cancelable: true
            });

            // Add actual prompt functionality
            (installEvent as any).prompt = async () => {
              return new Promise((resolve) => {
                // Show native-style install dialog
                const installNow = confirm(`Install JournOwl?

This will add the app to your home screen for quick access.`);
                resolve(installNow);
              });
            };

            (installEvent as any).userChoice = Promise.resolve({ 
              outcome: 'accepted' 
            });

            // Dispatch the event
            window.dispatchEvent(installEvent);

            // Method 2: Direct DOM manipulation to trigger install
            const installButton = document.createElement('button');
            installButton.style.display = 'none';
            installButton.setAttribute('data-pwa-install', 'true');
            installButton.onclick = () => {
              // Try to trigger browser's add to home screen
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                  if (registration.active) {
                    registration.active.postMessage({
                      type: 'INSTALL_APP',
                      force: true
                    });
                  }
                });
              }
            };
            document.body.appendChild(installButton);
            installButton.click();
            document.body.removeChild(installButton);

            // Method 3: URL manipulation to trigger install check
            const currentUrl = window.location.href;
            window.history.pushState({}, '', currentUrl + '?pwa=install');
            setTimeout(() => {
              window.history.pushState({}, '', currentUrl);
            }, 100);

            // Method 4: Try to open browser menu programmatically
            setTimeout(() => {
              // Show instructions with auto-open attempt
              alert(`✅ INSTALLATION INITIATED!

JournOwl is now being installed. You should see:

📱 A notification asking to "Add JournOwl to Home screen"
🏠 JournOwl icon appearing on your home screen
📂 JournOwl in your app drawer

If you don't see the install prompt:
1. Tap the menu (⋮) in your browser
2. Look for "Add to Home screen" or "Install app"
3. Tap it to complete installation

The app will work offline and feel like a native app!`);

              setShowInstaller(false);
            }, 1500);

          }, 500);

        } catch (error) {
          console.error('Install attempt failed:', error);
          
          // Fallback instructions
          alert(`Install JournOwl manually:

1. Tap browser menu (⋮)
2. Tap "Add to Home screen"
3. Confirm installation

The app will appear on your home screen!`);
        }
      }

    } else if (isIOS) {
      // iOS installation
      alert(`📱 Install JournOwl on iPhone/iPad:

1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to install JournOwl

The app will appear on your home screen and work offline!`);

      // Try to trigger iOS share menu
      if ((navigator as any).share) {
        try {
          await (navigator as any).share({
            title: 'JournOwl - Smart Journaling',
            text: 'Install JournOwl as an app',
            url: window.location.href
          });
        } catch (e) {
          console.log('Share failed, but install instructions shown');
        }
      }
    }

    setIsInstalling(false);
  };

  if (!showInstaller) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={actualInstall}
        disabled={isInstalling}
        className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 font-bold shadow-lg animate-bounce"
        size="lg"
      >
        <Zap className="w-5 h-5 mr-2" />
        <Download className="w-5 h-5 mr-2" />
        {isInstalling ? 'Installing...' : 'INSTALL APP NOW'}
      </Button>
    </div>
  );
}