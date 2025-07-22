import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function PWADebugHelper() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const updateDebugInfo = () => {
      const info = {
        // Device detection
        userAgent: navigator.userAgent,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isAndroid: /Android/i.test(navigator.userAgent),
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isChrome: /Chrome/i.test(navigator.userAgent),
        
        // Domain and environment
        hostname: window.location.hostname,
        isProduction: window.location.hostname === 'journowl.app',
        protocol: window.location.protocol,
        
        // PWA status
        isInstalled: window.matchMedia('(display-mode: standalone)').matches,
        hasServiceWorker: 'serviceWorker' in navigator,
        hasBeforeInstallPrompt: !!(window as any).deferredPrompt,
        
        // Session storage
        promptShown: sessionStorage.getItem('pwa-prompt-shown'),
        installAttempted: sessionStorage.getItem('pwa-install-attempted'),
        pwaInstalled: sessionStorage.getItem('pwa-installed'),
        
        // Browser support
        hasPushManager: 'PushManager' in window,
        hasNotifications: 'Notification' in window,
        
        // Manifest check
        manifestLink: document.querySelector('link[rel="manifest"]')?.getAttribute('href'),
        
        // Current time for debugging
        timestamp: new Date().toLocaleTimeString()
      };
      setDebugInfo(info);
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000); // Update every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const clearStorage = () => {
    sessionStorage.removeItem('pwa-prompt-shown');
    sessionStorage.removeItem('pwa-install-attempted');
    sessionStorage.removeItem('pwa-installed');
    setDebugInfo({ ...debugInfo, 
      promptShown: null, 
      installAttempted: null, 
      pwaInstalled: null 
    });
  };

  if (!showDebug) {
    return (
      <Button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white text-xs"
        size="sm"
      >
        PWA Debug
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-2xl max-w-md text-xs max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">PWA Debug Info</h3>
        <Button
          onClick={() => setShowDebug(false)}
          className="bg-gray-700 hover:bg-gray-600 text-white h-6 w-6 p-0"
          size="sm"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="text-green-400 font-bold">Device & Browser:</div>
        <div>Mobile: {debugInfo.isMobile ? '✅' : '❌'}</div>
        <div>Android: {debugInfo.isAndroid ? '✅' : '❌'}</div>
        <div>iOS: {debugInfo.isIOS ? '✅' : '❌'}</div>
        <div>Chrome: {debugInfo.isChrome ? '✅' : '❌'}</div>
        
        <div className="text-blue-400 font-bold mt-3">Environment:</div>
        <div>Domain: {debugInfo.hostname}</div>
        <div>Production: {debugInfo.isProduction ? '✅' : '❌'}</div>
        <div>HTTPS: {debugInfo.protocol === 'https:' ? '✅' : '❌'}</div>
        
        <div className="text-purple-400 font-bold mt-3">PWA Status:</div>
        <div>Installed: {debugInfo.isInstalled ? '✅' : '❌'}</div>
        <div>Service Worker: {debugInfo.hasServiceWorker ? '✅' : '❌'}</div>
        <div>Install Prompt: {debugInfo.hasBeforeInstallPrompt ? '✅' : '❌'}</div>
        <div>Manifest: {debugInfo.manifestLink ? '✅' : '❌'}</div>
        
        <div className="text-yellow-400 font-bold mt-3">Session State:</div>
        <div>Prompt Shown: {debugInfo.promptShown || 'No'}</div>
        <div>Install Attempted: {debugInfo.installAttempted || 'No'}</div>
        <div>PWA Installed: {debugInfo.pwaInstalled || 'No'}</div>
        
        <div className="mt-3 flex space-x-2">
          <Button
            onClick={clearStorage}
            className="bg-orange-600 hover:bg-orange-700 text-white text-xs"
            size="sm"
          >
            Reset State
          </Button>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
            size="sm"
          >
            Reload
          </Button>
        </div>
        
        <div className="text-xs text-gray-400 mt-2">
          Updated: {debugInfo.timestamp}
        </div>
      </div>
    </div>
  );
}