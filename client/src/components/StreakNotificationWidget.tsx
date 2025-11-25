import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Flame, Trophy, Target, AlertCircle } from "lucide-react";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string;
  daysUntilBroken: number;
  nextMilestone: number;
}

export function StreakNotificationWidget() {
  const { data: streakData } = useQuery<StreakData>({
    queryKey: ["/api/stats"]
  });

  if (!streakData?.currentStreak || streakData.currentStreak === 0) {
    return null;
  }

  const isMilestone = [7, 14, 30, 60, 100, 365].includes(streakData.currentStreak);
  const streakPercentage = (streakData.currentStreak / (streakData.nextMilestone || 100)) * 100;

  const getMilestoneIcon = () => {
    if (streakData.currentStreak >= 100) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (streakData.currentStreak >= 30) return <Target className="w-6 h-6 text-purple-400" />;
    return <Flame className="w-6 h-6 text-red-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className={`bg-gradient-to-r ${
          isMilestone
            ? "from-yellow-500/20 to-orange-500/20 border-yellow-500/50"
            : "from-red-500/20 to-orange-500/20 border-red-500/50"
        } p-6`}
        data-testid="streak-widget"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              {getMilestoneIcon()}
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-white">{streakData.currentStreak}-Day Streak! 🔥</h3>
              {isMilestone && (
                <p className="text-sm text-yellow-300 font-semibold">🎉 Milestone Achievement!</p>
              )}
              <p className="text-xs text-white/70">
                Personal best: {streakData.longestStreak} days
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{streakData.currentStreak}</p>
            <p className="text-xs text-white/60">days</p>
          </div>
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/70">
            <span>Next milestone in {streakData.nextMilestone - streakData.currentStreak} days</span>
            <span>{Math.round(streakPercentage)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${
                isMilestone ? "from-yellow-400 to-orange-400" : "from-red-400 to-orange-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${streakPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Warning if about to break */}
        {streakData.daysUntilBroken <= 1 && (
          <div className="mt-4 p-3 bg-red-500/30 border border-red-500/50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-200">
              Write today to keep your streak alive!
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
