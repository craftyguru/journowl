import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Flame, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string;
  daysUntilStreakLost: number;
}

export function StreakNotifications({ streak = 0 }: { streak?: number }) {
  const { toast } = useToast();

  const showStreakNotification = () => {
    if (streak > 0 && streak % 5 === 0) {
      toast({
        title: `${streak} Day Streak! 🔥`,
        description: "Amazing consistency! Keep it up to unlock streak badges.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 shadow-md border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">Streak Tracker</h2>
          </div>

          {/* Current Streak */}
          <div className="mb-6 p-4 bg-white rounded-lg border-2 border-orange-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700 font-medium">Current Streak</span>
              <span className="text-3xl font-bold text-orange-600">{streak} 🔥</span>
            </div>
            <p className="text-sm text-gray-600">
              {streak === 0
                ? "Start journaling today to begin your streak!"
                : `Keep writing daily to maintain your streak!`}
            </p>
          </div>

          {/* Streak Milestones */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Milestones</h3>
            <div className="grid grid-cols-3 gap-2">
              {[7, 14, 30].map((milestone) => (
                <motion.div
                  key={milestone}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-lg text-center transition-all ${
                    streak >= milestone
                      ? "bg-green-100 border-2 border-green-400"
                      : "bg-gray-100 border-2 border-gray-200 opacity-50"
                  }`}
                  data-testid={`milestone-${milestone}`}
                >
                  <div className="font-bold text-gray-900">{milestone}</div>
                  <div className="text-xs text-gray-600">Days</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Streak Warning */}
          {streak > 0 && streak <= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-yellow-900 text-sm">
                  Don't lose your streak!
                </p>
                <p className="text-xs text-yellow-800">Write an entry today to keep it going</p>
              </div>
            </motion.div>
          )}

          {/* Streak Bonus Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <p className="font-semibold text-blue-900 text-sm">Streak Bonuses</p>
            </div>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Every 7-day milestone: +50 XP</li>
              <li>• Every 14-day milestone: +100 XP + Badge</li>
              <li>• Every 30-day milestone: +250 XP + Special Badge</li>
            </ul>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
