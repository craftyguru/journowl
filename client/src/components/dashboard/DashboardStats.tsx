import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Target, Award, Zap, Calendar, Star, Trophy } from "lucide-react";

interface Stats {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
  averageMood: number;
  longestStreak: number;
  wordsThisWeek: number;
}

interface User {
  id: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  xp?: number;
  level?: number;
}

interface DashboardStatsProps {
  stats: Stats;
  user: User;
}

export default function DashboardStats({ stats, user }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Entries */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Entries</p>
                <p className="text-3xl font-bold text-blue-600">{stats?.totalEntries || 0}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  Keep writing!
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Writing Streak */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 hover:border-orange-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                <p className="text-3xl font-bold text-orange-600">{stats?.currentStreak || 0}</p>
                <p className="text-xs text-gray-600 mt-1">
                  Best: {stats?.longestStreak || 0} days
                </p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Words */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20 hover:border-green-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Words</p>
                <p className="text-3xl font-bold text-green-600">{stats?.totalWords?.toLocaleString() || 0}</p>
                <p className="text-xs text-blue-600 mt-1">
                  This week: {stats?.wordsThisWeek?.toLocaleString() || 0}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Level & XP */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/30 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Level {user?.level || 1}</p>
                <p className="text-3xl font-bold text-purple-600">{user?.xp || 0} XP</p>
                <div className="mt-2">
                  <Progress 
                    value={((user?.xp || 0) % 1000) / 10} 
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    {1000 - ((user?.xp || 0) % 1000)} XP to next level
                  </p>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}