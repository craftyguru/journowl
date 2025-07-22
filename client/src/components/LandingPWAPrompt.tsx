import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function LandingPWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallHelper, setShowInstallHelper] = useState(false);
  const [installHelperType, setInstallHelperType] = useState<'ios' | 'android' | 'desktop'>('android');

  useEffect(() => {
    // Only show on mobile devices on production domain
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    // Check for existing global deferredPrompt first
    if ((window as any).deferredPrompt) {
      console.log('PWA: Using existing global deferredPrompt');
      setDeferredPrompt((window as any).deferredPrompt);
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: beforeinstallprompt event fired - auto-install ready!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      (window as any).deferredPrompt = e;
      
      // Show our custom prompt immediately when install is available
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000); // Show faster when auto-install available
      }
    };

    // Listen for custom PWA installable event from index.html
    const handlePWAInstallable = (e: CustomEvent) => {
      console.log('PWA: Custom installable event received');
      setDeferredPrompt(e.detail);
      if (isMobile && isProduction && !isInstalled) {
        setTimeout(() => setShowPrompt(true), 2000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    window.addEventListener('pwa-installable', handlePWAInstallable as EventListener);

    // Even if no beforeinstallprompt, show manual instructions on mobile
    if (isMobile && isProduction && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 4000); // Show after 4 seconds if no install prompt
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      window.removeEventListener('pwa-installable', handlePWAInstallable as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    console.log('PWA: Install button clicked - attempting auto-install');
    console.log('PWA: deferredPrompt available:', !!deferredPrompt);
    console.log('PWA: Global deferredPrompt available:', !!(window as any).deferredPrompt);
    
    // Try global deferredPrompt first
    const promptToUse = deferredPrompt || (window as any).deferredPrompt;
    
    if (promptToUse) {
      try {
        console.log('PWA: Triggering automatic browser installation');
        await promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;
        console.log('PWA: Installation result:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA: Installation successful!');
          setShowPrompt(false);
          setDeferredPrompt(null);
          (window as any).deferredPrompt = null;
          return;
        }
      } catch (error) {
        console.error('PWA: Auto-install failed:', error);
      }
    } else {
      console.log('PWA: No install prompt available, showing manual instructions');
    }

    // Show beautiful animated install helper instead of generic alert
    showAnimatedInstallHelper();
  };

  const showAnimatedInstallHelper = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      setInstallHelperType('ios');
    } else if (isAndroid) {
      setInstallHelperType('android');
    } else {
      setInstallHelperType('desktop');
    }
    
    setShowPrompt(false);
    setShowInstallHelper(true);
  };

  const InstallHelper = () => {
    const getHelperContent = () => {
      switch (installHelperType) {
        case 'ios':
          return {
            title: '📱 Install JournOwl on iPhone',
            gradient: 'from-pink-500 via-purple-500 to-indigo-500',
            icon: '🍎',
            steps: [
              { icon: '⬆️', text: 'Tap the Share button at the bottom', highlight: true },
              { icon: '➕', text: 'Scroll down and tap "Add to Home Screen"' },
              { icon: '✨', text: 'Tap "Add" to install JournOwl!' }
            ]
          };
        case 'android':
          return {
            title: '🤖 Install JournOwl on Android',
            gradient: 'from-green-500 via-emerald-500 to-teal-500',
            icon: '🤖',
            steps: [
              { icon: '⋮', text: 'Tap the menu (3 dots) in your browser', highlight: true },
              { icon: '📲', text: 'Look for "Install app" or "Add to Home screen"' },
              { icon: '🚀', text: 'Tap "Install" and JournOwl appears on your home screen!' }
            ]
          };
        default:
          return {
            title: '💻 Install JournOwl on Desktop',
            gradient: 'from-blue-500 via-cyan-500 to-purple-500',
            icon: '💻',
            steps: [
              { icon: '⬇️', text: 'Look for install icon in your browser address bar', highlight: true },
              { icon: '📋', text: 'Or go to browser Menu → Install JournOwl' },
              { icon: '🎯', text: 'Creates a desktop app for JournOwl!' }
            ]
          };
      }
    };

    const content = getHelperContent();

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      >
        <motion.div
          initial={{ rotateY: -15, rotateX: 15 }}
          animate={{ rotateY: 0, rotateX: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`bg-gradient-to-br ${content.gradient} p-6 rounded-3xl shadow-2xl max-w-md w-full text-white relative overflow-hidden`}
        >
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce" />
          
          {/* Header */}
          <div className="relative z-10 text-center mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-3"
            >
              {content.icon}
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">{content.title}</h2>
            <p className="text-white/90 text-sm">Follow these simple steps to get JournOwl on your device!</p>
          </div>

          {/* Steps */}
          <div className="relative z-10 space-y-4 mb-6">
            {content.steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                className={`flex items-center space-x-3 p-3 rounded-xl ${
                  step.highlight 
                    ? 'bg-white/20 border-2 border-white/30' 
                    : 'bg-white/10'
                } backdrop-blur-sm`}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.3 }}
                  className="text-2xl"
                >
                  {step.icon}
                </motion.div>
                <p className="text-white font-medium">{step.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="relative z-10 flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInstallHelper(false)}
              className="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-4 rounded-xl backdrop-blur-sm border border-white/30 transition-all duration-300"
            >
              Got it! 👍
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInstallHelper(false)}
              className="bg-white text-gray-800 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              ✨ Close
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-2xl border border-white/20 p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-full">
                  <span className="text-2xl">🦉</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Install JournOwl</h3>
                  <p className="text-sm text-purple-100">Get the app experience!</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm text-purple-100 mb-4">
              {deferredPrompt 
                ? "🚀 One-click install available! JournOwl will install automatically as a native app."
                : "Install JournOwl as an app for offline access, faster loading, and a native experience on your device."
              }
            </p>
            
            <div className="flex space-x-2">
              <Button
                onClick={handleInstall}
                className="flex-1 bg-white text-purple-600 hover:bg-purple-50 font-bold text-sm"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                🚀 Auto-Install Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
            </div>
          </div>
        </motion.div>
      )}
      
      {showInstallHelper && <InstallHelper />}
    </AnimatePresence>
  );
}