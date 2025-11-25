import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "streak" | "achievement" | "milestone" | "reminder";
  title: string;
  message: string;
  icon: string;
  timestamp: number;
  read: boolean;
}

interface StatsData {
  stats: {
    currentStreak?: number;
    longestStreak?: number;
  };
}

export function NotificationCenter() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const { data: streakData } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
    refetchInterval: 60000,
  });

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // Check for streak milestones and achievements
  useEffect(() => {
    if (!streakData?.stats) return;

    const currentStreak = streakData.stats.currentStreak || 0;
    const streakMilestones = [7, 14, 30, 60, 100];

    streakMilestones.forEach((milestone) => {
      if (currentStreak === milestone && !notifications.some(n => n.id === `streak-${milestone}`)) {
        const newNotification: Notification = {
          id: `streak-${milestone}`,
          type: "streak",
          title: `🔥 ${milestone}-Day Streak!`,
          message: `Amazing! You've journaled for ${milestone} days in a row!`,
          icon: "🔥",
          timestamp: Date.now(),
          read: false
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        
        // Send browser notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(newNotification.title, {
            body: newNotification.message,
            icon: "🔥",
            tag: newNotification.id
          });
        }
        
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      }
    });
  }, [streakData?.stats?.currentStreak, notifications, toast]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="icon"
        className="relative text-white hover:bg-white/10"
        data-testid="button-notification-bell"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute right-0 top-12 w-80 bg-gradient-to-br from-purple-900 to-black border border-purple-500/30 rounded-xl shadow-2xl z-50"
            data-testid="notification-dropdown"
          >
            {/* Header */}
            <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </h3>
              {notifications.length > 0 && (
                <Button
                  onClick={clearAll}
                  variant="ghost"
                  size="sm"
                  className="text-xs text-purple-300 hover:text-white"
                  data-testid="button-clear-notifications"
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-white/60">
                  <p>No notifications yet</p>
                  <p className="text-sm mt-1">Keep up your streak to unlock achievements!</p>
                </div>
              ) : (
                <div className="divide-y divide-purple-500/10">
                  {notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => markAsRead(notif.id)}
                      className={`p-4 cursor-pointer transition ${
                        notif.read ? "bg-white/5" : "bg-purple-600/20"
                      } hover:bg-purple-600/30`}
                      data-testid={`notification-item-${notif.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <span className="text-2xl">{notif.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm">{notif.title}</p>
                            <p className="text-white/70 text-xs mt-1">{notif.message}</p>
                            <p className="text-white/50 text-xs mt-2">
                              {new Date(notif.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notif.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-white/50 hover:text-white h-auto p-1"
                          data-testid={`button-close-notification-${notif.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          data-testid="notification-backdrop"
        />
      )}
    </div>
  );
}
