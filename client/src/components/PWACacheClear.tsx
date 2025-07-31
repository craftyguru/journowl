import { useState } from 'react';
import { forcePWARefresh } from '@/lib/pwa-utils';

export function PWACacheClear() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearCache = () => {
    setIsClearing(true);
    
    // Show immediate feedback
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideDown 0.3s ease-out;
    `;
    notification.textContent = '🔄 Clearing cache and updating app...';
    
    // Add animation keyframes
    if (!document.getElementById('cache-clear-styles')) {
      const styles = document.createElement('style');
      styles.id = 'cache-clear-styles';
      styles.textContent = `
        @keyframes slideDown {
          from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Clear cache and reload
    setTimeout(() => {
      forcePWARefresh();
    }, 1000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={handleClearCache}
        disabled={isClearing}
        className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
                   text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                   text-sm font-medium"
      >
        {isClearing ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Clearing...
          </>
        ) : (
          <>
            🔄 Clear Cache
          </>
        )}
      </button>
    </div>
  );
}