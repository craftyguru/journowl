import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function LandingPWAPrompt() {
  // PWA install prompt disabled by user request
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallHelper, setShowInstallHelper] = useState(false);
  const [installHelperType, setInstallHelperType] = useState<'ios' | 'android' | 'desktop'>('android');

  useEffect(() => {
    // PWA install prompt disabled by user request - prevent flashing
    console.log('PWA: Install prompts disabled by user request');
    // Clear any existing session storage that might trigger prompts
    sessionStorage.removeItem('pwa-prompt-shown');
    sessionStorage.removeItem('pwa-install-attempted');
    sessionStorage.removeItem('pwa-installed');
  }, []);

  const handleInstall = async () => {
    console.log('PWA: Install button clicked - attempting native installation');
    console.log('PWA: deferredPrompt available:', !!deferredPrompt);
    console.log('PWA: Global deferredPrompt available:', !!(window as any).deferredPrompt);
    
    // Mark that user has interacted with install
    sessionStorage.setItem('pwa-install-attempted', 'true');
    
    // Try global deferredPrompt first
    const promptToUse = deferredPrompt || (window as any).deferredPrompt;
    
    if (promptToUse) {
      try {
        console.log('PWA: Triggering native browser installation dialog');
        await promptToUse.prompt();
        const { outcome } = await promptToUse.userChoice;
        console.log('PWA: Installation result:', outcome);
        
        if (outcome === 'accepted') {
          console.log('PWA: App successfully installed as native Android app!');
          setShowPrompt(false);
          setDeferredPrompt(null);
          (window as any).deferredPrompt = null;
          sessionStorage.setItem('pwa-installed', 'true');
          
          // Show success message for native installation
          alert('🎉 JournOwl app installed successfully! You can now find it in your apps drawer and home screen.');
          return;
        } else {
          console.log('PWA: User dismissed native install prompt');
          setShowPrompt(false);
          return;
        }
      } catch (error) {
        console.error('PWA: Native install failed:', error);
      }
    }

    // Only show manual instructions if native installation is not available
    console.log('PWA: Native installation not available, showing manual instructions');
    showAnimatedInstallHelper();
  }

  // Add test button for development (only visible on localhost/replit)
  const handleTestPrompt = () => {
    console.log('PWA: Test button clicked - clearing storage and showing prompt');
    sessionStorage.removeItem('pwa-prompt-shown');
    sessionStorage.removeItem('pwa-install-attempted');
    sessionStorage.removeItem('pwa-installed');
    setShowPrompt(true);
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
              { icon: '🔍', text: 'Look for install icon (⬇️) in address bar first!', highlight: true },
              { icon: '⋮', text: 'If no icon, tap menu (3 dots) → "Add to Home screen"' },
              { icon: '🎯', text: 'Or try different browser (Chrome works best!)' },
              { icon: '✨', text: 'Visit site multiple times to enable install options' }
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
    <>
      {/* PWA Prompts disabled by user request - no more flashing */}
      <AnimatePresence>
        {false && (
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
    </>
  );
}