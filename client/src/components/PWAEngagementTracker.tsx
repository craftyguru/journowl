import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface PWAEngagementTrackerProps {
  onEngagementMet?: () => void;
}

export function PWAEngagementTracker({ onEngagementMet }: PWAEngagementTrackerProps) {
  const [engagementTime, setEngagementTime] = useState(0);
  const [visitCount, setVisitCount] = useState(0);
  const [beforeInstallPromptFired, setBeforeInstallPromptFired] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  useEffect(() => {
    // Only show on mobile Chrome/Edge on production
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isChrome = /Chrome|CriOS|Edg/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;

    if (!isMobile || !isChrome || !isProduction || isInstalled) {
      return;
    }

    // Track visits
    const visits = parseInt(localStorage.getItem('pwa-visit-count') || '0');
    const newVisitCount = visits + 1;
    setVisitCount(newVisitCount);
    localStorage.setItem('pwa-visit-count', newVisitCount.toString());

    // Track engagement time
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setEngagementTime(elapsed);
      
      // Show tracker after 10 seconds
      if (elapsed === 10) {
        setShowTracker(true);
      }
      
      // Check for engagement threshold (60 seconds + 3 visits)
      if (elapsed >= 60 && newVisitCount >= 3 && !beforeInstallPromptFired) {
        onEngagementMet?.();
      }
    }, 1000);

    // Listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA Engagement: beforeinstallprompt fired after', engagementTime, 'seconds and', newVisitCount, 'visits');
      setBeforeInstallPromptFired(true);
      onEngagementMet?.();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [onEngagementMet, engagementTime, beforeInstallPromptFired]);

  if (!showTracker) return null;

  const engagementMet = engagementTime >= 60 && visitCount >= 3;
  const timeRemaining = Math.max(0, 60 - engagementTime);

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg shadow-lg border border-white/20 text-xs">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4" />
          <span className="font-medium">PWA Install Eligibility</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Engagement Time:</span>
            <div className="flex items-center gap-1">
              {engagementTime >= 60 ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <Clock className="w-3 h-3 text-yellow-400" />
              )}
              <span>{engagementTime}s / 60s</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Site Visits:</span>
            <div className="flex items-center gap-1">
              {visitCount >= 3 ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-yellow-400" />
              )}
              <span>{visitCount} / 3</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Install Prompt:</span>
            <div className="flex items-center gap-1">
              {beforeInstallPromptFired ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <AlertCircle className="w-3 h-3 text-yellow-400" />
              )}
              <span>{beforeInstallPromptFired ? 'Ready!' : 'Waiting...'}</span>
            </div>
          </div>
        </div>
        
        {engagementMet ? (
          <div className="mt-2 p-2 bg-green-500/20 rounded border border-green-400/30">
            <p className="text-green-100 text-xs">
              ✅ Requirements met! Install prompt should appear soon.
              If not, use browser menu → "Add to Home screen"
            </p>
          </div>
        ) : (
          <div className="mt-2 p-2 bg-yellow-500/20 rounded border border-yellow-400/30">
            <p className="text-yellow-100 text-xs">
              {timeRemaining > 0 ? (
                `⏳ Keep browsing for ${timeRemaining}s more to unlock install prompt`
              ) : (
                `📱 Visit the site ${3 - visitCount} more times to unlock install`
              )}
            </p>
          </div>
        )}
        
        <Button
          onClick={() => setShowTracker(false)}
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-white hover:bg-white/20 text-xs h-6"
        >
          Hide Tracker
        </Button>
      </div>
    </div>
  );
}