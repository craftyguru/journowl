import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Flame, BookOpen, AlertCircle } from "lucide-react";

interface ReminderData {
  reminder: string | null;
  type: "first_entry" | "missed_days" | "maintain_streak" | "none";
  daysSince?: number;
  streak?: number;
}

export function ReminderNotification() {
  const [dismissed, setDismissed] = useState(false);
  const { data: reminder } = useQuery<ReminderData>({
    queryKey: ["/api/notifications/check-reminders"],
    refetchInterval: 60000 // Check every minute
  });

  if (dismissed || !reminder?.reminder) return null;

  const getIcon = () => {
    switch (reminder.type) {
      case "maintain_streak":
        return <Flame className="w-5 h-5 text-red-500" />;
      case "missed_days":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case "first_entry":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  const getBackground = () => {
    switch (reminder.type) {
      case "maintain_streak":
        return "from-red-500/20 to-orange-500/20 border-red-500/30";
      case "missed_days":
        return "from-orange-500/20 to-yellow-500/20 border-orange-500/30";
      case "first_entry":
        return "from-blue-500/20 to-cyan-500/20 border-blue-500/30";
      default:
        return "from-purple-500/20 to-pink-500/20 border-purple-500/30";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6"
      >
        <Card className={`bg-gradient-to-r ${getBackground()} p-4 flex items-start gap-4`}>
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{reminder.reminder}</p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 text-white/60 hover:text-white transition"
            data-testid="button-dismiss-reminder"
          >
            <X className="w-4 h-4" />
          </button>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
