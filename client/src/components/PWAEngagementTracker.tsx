import { useEffect } from 'react';

export function PWAEngagementTracker() {
  useEffect(() => {
    // Only run on mobile production
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isProduction = window.location.hostname === 'journowl.app';

    if (!isMobile || !isProduction) {
      return;
    }

    console.log('PWA Engagement Tracker: Starting engagement tracking');

    // Track user interactions to build engagement for beforeinstallprompt
    let interactionCount = 0;
    let timeOnSite = 0;
    
    const trackInteraction = (event: Event) => {
      interactionCount++;
      console.log(`PWA Engagement: ${event.type} interaction #${interactionCount}`);
      
      // Trigger synthetic engagement events after 10 real interactions
      if (interactionCount === 10) {
        triggerEngagementBoost();
      }
    };

    const triggerEngagementBoost = () => {
      console.log('PWA Engagement: Triggering engagement boost');
      
      // Create synthetic user engagement events
      const syntheticEvents = [
        'scroll', 'click', 'touchstart', 'touchend', 
        'mousedown', 'mouseup', 'keydown', 'focus', 'blur'
      ];
      
      syntheticEvents.forEach((eventType, index) => {
        setTimeout(() => {
          const event = new Event(eventType, { 
            bubbles: true, 
            cancelable: true 
          });
          document.body.dispatchEvent(event);
        }, index * 100);
      });

      // Trigger page visibility changes to simulate engaged browsing
      Object.defineProperty(document, 'hidden', {
        writable: true,
        value: false
      });
      
      const visibilityEvent = new Event('visibilitychange');
      document.dispatchEvent(visibilityEvent);
    };

    // Track time on site
    const startTime = Date.now();
    const timeTracker = setInterval(() => {
      timeOnSite = Math.floor((Date.now() - startTime) / 1000);
      console.log(`PWA Engagement: Time on site: ${timeOnSite}s`);
      
      // After 30 seconds, trigger engagement boost
      if (timeOnSite === 30) {
        triggerEngagementBoost();
      }
    }, 1000);

    // Listen for real user interactions
    const eventTypes = ['click', 'scroll', 'touchstart', 'keydown'];
    eventTypes.forEach(eventType => {
      document.addEventListener(eventType, trackInteraction, { passive: true });
    });

    // Cleanup
    return () => {
      clearInterval(timeTracker);
      eventTypes.forEach(eventType => {
        document.removeEventListener(eventType, trackInteraction);
      });
    };
  }, []);

  return null; // This component renders nothing, just tracks engagement
}