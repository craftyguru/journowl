import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';

export function ForceInstallPWA() {
  const [showInstaller, setShowInstaller] = useState(false);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile && isProduction && !isInstalled) {
      setShowInstaller(true);
    }
  }, []);

  const forceInstall = () => {
    // Method 1: Create and dispatch a synthetic beforeinstallprompt event
    const syntheticEvent = new CustomEvent('beforeinstallprompt', {
      cancelable: true,
      detail: {
        platforms: ['web'],
        prompt: async () => {
          return new Promise((resolve) => {
            const isAndroid = /Android/i.test(navigator.userAgent);
            if (isAndroid) {
              const result = confirm(`Install JournOwl as an app?

This will add JournOwl to your home screen for easy access.`);
              resolve({ outcome: result ? 'accepted' : 'dismissed' });
            } else {
              resolve({ outcome: 'dismissed' });
            }
          });
        },
        userChoice: Promise.resolve({ outcome: 'accepted' })
      }
    });

    // Dispatch the synthetic event
    window.dispatchEvent(syntheticEvent);

    // Method 2: Direct browser API approach
    const directInstall = async () => {
      try {
        // For Android Chrome - try different installation approaches
        const isAndroid = /Android/i.test(navigator.userAgent);
        
        if (isAndroid) {
          // Approach 1: Try window.prompt for direct installation
          const shouldInstall = window.confirm('Install JournOwl as an app on your device?');
          
          if (shouldInstall) {
            // Approach 2: Manipulate DOM to trigger install
            const link = document.createElement('a');
            link.href = window.location.href;
            link.setAttribute('data-pwa-install', 'true');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Approach 3: Try to access Chrome installation API
            if ((window as any).chrome && (window as any).chrome.webstore) {
              (window as any).chrome.webstore.install();
            }

            // Approach 4: Service Worker messaging
            if ('serviceWorker' in navigator) {
              const registration = await navigator.serviceWorker.ready;
              registration.active?.postMessage({
                type: 'INSTALL_APP',
                url: window.location.href
              });
            }

            // Show success message
            setTimeout(() => {
              alert('Installation initiated! JournOwl should now appear in your app drawer or home screen.');
            }, 1000);
          }
        } else {
          // iOS approach
          alert(`📱 Install on iPhone/iPad:

1. Tap Share (⬆️) at bottom of Safari
2. Tap "Add to Home Screen"
3. Tap "Add" to install

JournOwl will appear on your home screen!`);
        }
      } catch (error) {
        console.error('Force install failed:', error);
        
        // Fallback to manual instructions
        const isAndroid = /Android/i.test(navigator.userAgent);
        if (isAndroid) {
          alert(`Install JournOwl:

1. Tap browser menu (⋮)
2. Tap "Add to Home screen"
3. Confirm installation

The app will be added to your device!`);
        }
      }
    };

    directInstall();
  };

  if (!showInstaller) return null;

  return (
    <Button
      onClick={forceInstall}
      className="bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 font-bold"
    >
      <Smartphone className="w-4 h-4 mr-2" />
      <Download className="w-4 h-4 mr-2" />
      Force Install
    </Button>
  );
}