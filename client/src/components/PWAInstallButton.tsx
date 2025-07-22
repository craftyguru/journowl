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

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isInstalled);

    if (isInstalled) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Debug: beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA Debug: app installed event');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
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
        
        if (outcome === 'accepted') {
          setIsInstalled(true);
        }
        
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
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isDevelopment()) {
      showDevelopmentMessage();
    } else if (isIOS) {
      showIOSInstructions();
    } else if (isAndroid) {
      showAndroidInstructions(deferredPrompt);
    } else if (isMobile) {
      showGenericMobileInstructions();
    } else {
      showDesktopInstructions();
    }
  };

  const isDevelopment = () => {
    return window.location.hostname.includes('replit.dev') || window.location.hostname === 'localhost';
  };

  const showDevelopmentMessage = () => {
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
  };

  const showIOSInstructions = () => {
    alert(`📱 Install JournOwl on iPhone/iPad:

Steps:
1. Tap the Share button (⬆️) at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to install JournOwl as an app

Note: iOS Safari doesn't support automatic install prompts. Manual installation is the only way on iPhone/iPad.

Once installed, JournOwl will appear on your home screen like a native app!`);
  };

  const showAndroidInstructions = (hasPrompt: boolean) => {
    alert(`🔍 PWA Install Button Analysis:

WHY THE BUTTON SEEMS TO "DO NOTHING":
❌ The beforeinstallprompt event hasn't fired yet
❌ Chrome requires 30-60+ seconds of active browsing
❌ Must visit the site multiple times over several days
❌ Cannot be in private/incognito mode
❌ Must show "user engagement signals"

CURRENT STATUS:
• beforeinstallprompt event: ${hasPrompt ? '✅ FIRED' : '❌ NOT FIRED'}
• Browser: ${navigator.userAgent.includes('Chrome') ? 'Chrome ✅' : 'Other browser'}
• Domain: ${window.location.hostname === 'journowl.app' ? 'Production ✅' : 'Development'}

MANUAL INSTALLATION (WORKS NOW):
1. Tap browser menu (⋮) 
2. Look for "Add to Home screen" or "Install app"
3. Tap it to install JournOwl

The install button will work automatically once browser engagement requirements are met!`);
  };

  const showGenericMobileInstructions = () => {
    alert(`📱 Install JournOwl:

For your mobile browser:
1. Open browser menu (usually ⋮ or ≡)
2. Look for "Add to Home screen" or "Install app"
3. Follow the installation prompts

The app will be added to your home screen!`);
  };

  const showDesktopInstructions = () => {
    alert(`💻 Install JournOwl on Desktop:

CHROME/EDGE:
• Look for install icon (⬇️) in address bar (right side)
• Click it to install

MANUAL METHOD:
• Chrome menu (⋮) → "Install JournOwl"
• Or "More tools" → "Create shortcut"

The app will install and open like a native desktop app!`);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

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