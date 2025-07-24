import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

class PWAManager {
  private static instance: PWAManager;
  private deferredPrompt: BeforeInstallPromptEvent | null = null;
  private isInstalled = false;
  private isDismissed = false;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.initialize();
  }

  static getInstance(): PWAManager {
    if (!PWAManager.instance) {
      PWAManager.instance = new PWAManager();
    }
    return PWAManager.instance;
  }

  private initialize() {
    // Check if already installed
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if already dismissed
    this.isDismissed = sessionStorage.getItem('pwa-dismissed') === 'true';
    
    if (this.isInstalled || this.isDismissed) {
      return;
    }

    // Listen for beforeinstallprompt - single listener
    window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
  }

  private handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault();
    this.deferredPrompt = e as BeforeInstallPromptEvent;
    this.notifyListeners();
  };

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  isInstallable(): boolean {
    return !this.isInstalled && !this.isDismissed && !!this.deferredPrompt;
  }

  isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  isProductionOrDev(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'journowl.app' || 
           hostname === 'localhost' || 
           hostname.includes('replit.dev');
  }

  async install(): Promise<boolean> {
    if (!this.deferredPrompt) return false;

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.isInstalled = true;
      } else {
        this.isDismissed = true;
        sessionStorage.setItem('pwa-dismissed', 'true');
      }
      
      this.deferredPrompt = null;
      this.notifyListeners();
      return outcome === 'accepted';
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  }

  dismiss() {
    this.isDismissed = true;
    sessionStorage.setItem('pwa-dismissed', 'true');
    this.notifyListeners();
  }
}

// Hook for React components
export function usePWAInstall() {
  const [, forceUpdate] = useState({});
  const manager = PWAManager.getInstance();

  useEffect(() => {
    const unsubscribe = manager.subscribe(() => {
      forceUpdate({});
    });
    return () => {
      unsubscribe();
    };
  }, [manager]);

  return {
    isInstallable: manager.isInstallable(),
    isMobile: manager.isMobileDevice(),
    isProductionOrDev: manager.isProductionOrDev(),
    install: () => manager.install(),
    dismiss: () => manager.dismiss()
  };
}

// Professional install button for navbar/desktop
export function PWAInstallButton() {
  const { isInstallable, isMobile, install } = usePWAInstall();

  // Only show on desktop when installable
  if (isMobile || !isInstallable) return null;

  return (
    <Button
      onClick={install}
      variant="outline"
      size="sm"
      className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0"
      aria-label="Install JournOwl app"
    >
      <Download className="w-4 h-4" />
      Install App
    </Button>
  );
}

// Mobile install prompt - simple and professional
export function PWAMobilePrompt() {
  const { isInstallable, isMobile, isProductionOrDev, install, dismiss } = usePWAInstall();

  // Only show on mobile when installable and on correct domain
  if (!isMobile || !isInstallable || !isProductionOrDev) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg shadow-lg border border-white/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <span className="text-xl">🦉</span>
            </div>
            <div>
              <h3 className="font-semibold">Install JournOwl</h3>
              <p className="text-xs text-purple-100">Native app experience</p>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={install}
            className="flex-1 bg-white text-purple-600 hover:bg-purple-50 font-medium text-sm h-9"
            aria-label="Install JournOwl as native app"
          >
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button
            onClick={dismiss}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 h-9 px-3"
            aria-label="Dismiss install prompt"
          >
            Later
          </Button>
        </div>
      </div>
    </div>
  );
}