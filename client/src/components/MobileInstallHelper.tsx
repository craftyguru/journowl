import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

export function MobileInstallHelper() {
  const [showHelper, setShowHelper] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if we should show the install helper
    const isDismissed = localStorage.getItem('pwa-helper-dismissed') === 'true';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isHTTPS = window.location.protocol === 'https:';
    const isProduction = window.location.hostname === 'journowl.app';

    console.log('Install Helper Check:', {
      isDismissed,
      isInstalled,
      isMobile,
      isHTTPS,
      isProduction,
      hostname: window.location.hostname
    });

    // Show helper if on mobile, HTTPS, not installed, not dismissed, but NOT on production domain
    if (isMobile && isHTTPS && !isInstalled && !isDismissed && !isProduction) {
      setTimeout(() => setShowHelper(true), 3000); // Show after 3 seconds
    }
  }, []);

  const handleDismiss = () => {
    setShowHelper(false);
    setDismissed(true);
    localStorage.setItem('pwa-helper-dismissed', 'true');
  };

  const openProductionSite = () => {
    window.open('https://journowl.app', '_blank');
  };

  if (!showHelper || dismissed) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-2xl">
              🦉
            </div>
            <div>
              <h3 className="font-bold text-lg">Install JournOwl App</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get the full mobile experience</p>
            </div>
          </div>
          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              📱 For Mobile Installation
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You're currently on the development version. To install the mobile app, you need to visit the production site.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Installation Steps:</h4>
            {isAndroid && (
              <div className="text-sm space-y-2">
                <p className="font-medium">For Android (Chrome/Edge):</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Visit the production site (button below)</li>
                  <li>Use the app for 30-60 seconds</li>
                  <li>Look for "Install" prompt at bottom</li>
                  <li>Or tap menu ⋮ → "Add to Home screen"</li>
                </ol>
              </div>
            )}
            
            {isIOS && (
              <div className="text-sm space-y-2">
                <p className="font-medium">For iPhone/iPad (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                  <li>Visit the production site (button below)</li>
                  <li>Tap Share button ⬆️</li>
                  <li>Scroll down to "Add to Home Screen"</li>
                  <li>Tap "Add" to install</li>
                </ol>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="flex-1"
            >
              Not now
            </Button>
            <Button
              onClick={openProductionSite}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Open Production Site
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}