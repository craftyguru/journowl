import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, FileText, TrendingUp, Star } from "lucide-react";
import type { Stats } from "./types";

interface StatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  // Calculate XP based on entries and words (simple formula)
  const calculateXP = () => {
    const entries = stats?.totalEntries || 0;
    const words = stats?.totalWords || 0;
    return (entries * 50) + Math.floor(words / 10);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* ENTRIES Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-none shadow-lg rounded-3xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white bg-opacity-20 rounded-xl p-2">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <CardContent className="pt-16 pb-6">
            <div className="text-3xl font-bold mb-2">{stats?.totalEntries || 0}</div>
            <div className="text-white text-opacity-90 text-sm font-medium tracking-wide">ENTRIES</div>
            <div className="mt-3 space-y-1">
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>This week:</span>
                <span>+6</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Best day:</span>
                <span>Thu</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Avg/week:</span>
                <span>7.5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* WORDS Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-none shadow-lg rounded-3xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white bg-opacity-20 rounded-xl p-2">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <CardContent className="pt-16 pb-6">
            <div className="text-3xl font-bold mb-2">{stats?.totalWords || 0}</div>
            <div className="text-white text-opacity-90 text-sm font-medium tracking-wide">WORDS</div>
            <div className="mt-3 space-y-1">
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Avg/entry:</span>
                <span>5</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Best entry:</span>
                <span>17 words</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Goal:</span>
                <span>1000+ words</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* STREAK Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg rounded-3xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white bg-opacity-20 rounded-xl p-2">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <CardContent className="pt-16 pb-6">
            <div className="text-3xl font-bold mb-2">{stats?.currentStreak || 0}</div>
            <div className="text-white text-opacity-90 text-sm font-medium tracking-wide">STREAK</div>
            <div className="mt-3 space-y-1">
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>days strong 🔥</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Best streak:</span>
                <span>3 days</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>This month:</span>
                <span>6 entries</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Target:</span>
                <span>30-day streak</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* XP Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none shadow-lg rounded-3xl relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white bg-opacity-20 rounded-xl p-2">
            <Star className="h-6 w-6 text-white" />
          </div>
          <CardContent className="pt-16 pb-6">
            <div className="text-3xl font-bold mb-2">{calculateXP()}</div>
            <div className="text-white text-opacity-90 text-sm font-medium tracking-wide">XP</div>
            <div className="mt-3 space-y-1">
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Level 1 ✨</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>To next level:</span>
                <span>440 XP</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Progress:</span>
                <span>56%</span>
              </div>
              <div className="text-white text-opacity-70 text-xs flex justify-between">
                <span>Rank:</span>
                <span>Beginner</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}