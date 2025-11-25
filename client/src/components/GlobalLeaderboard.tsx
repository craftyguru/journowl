import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Trophy, Flame, BookOpen, Target } from "lucide-react";

interface LeaderboardEntry {
  userId: number;
  username: string;
  avatar?: string;
  score: number;
  rank?: number;
  badge?: string;
}

export function GlobalLeaderboard() {
  const [, setLocation] = useLocation();

  const { data: allTimeData } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/all-time"],
    retry: 1,
  });

  const { data: weeklyData } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/weekly"],
    retry: 1,
  });

  const { data: streakData } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/streaks"],
    retry: 1,
  });

  const { data: wordsData } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard/words"],
    retry: 1,
  });

  const renderLeaderboard = (data: LeaderboardEntry[] | undefined, icon: string) => {
    if (!data || data.length === 0) {
      return <p className="text-white/60 text-center py-8">No data yet</p>;
    }

    return (
      <div className="space-y-2">
        {data.map((entry, idx) => (
          <motion.div
            key={`${entry.userId}-${idx}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setLocation(`/profile/${entry.userId}`)}
            className="p-3 rounded-lg bg-white/5 border border-purple-500/20 hover:border-purple-500/40 hover:bg-white/10 transition flex items-center justify-between cursor-pointer"
            data-testid={`leaderboard-entry-${idx}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                {idx + 1}
              </div>
              <div>
                <p className="text-white font-semibold">{entry.username}</p>
                {entry.badge && <span className="text-xs text-purple-300">{entry.badge}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {icon && <span className="text-lg">{icon}</span>}
              <span className="text-white font-bold text-lg">{entry.score}</span>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-2xl font-bold text-white">Global Rankings</h3>
          <span className="text-sm text-purple-300 ml-auto">🔥 Live Rankings</span>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-purple-500/20">
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:bg-purple-600 text-xs sm:text-sm"
              data-testid="tab-weekly"
            >
              <Flame className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Weekly</span>
            </TabsTrigger>
            <TabsTrigger
              value="alltime"
              className="data-[state=active]:bg-purple-600 text-xs sm:text-sm"
              data-testid="tab-alltime"
            >
              <Trophy className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">All-Time</span>
            </TabsTrigger>
            <TabsTrigger
              value="streaks"
              className="data-[state=active]:bg-purple-600 text-xs sm:text-sm"
              data-testid="tab-streaks"
            >
              <Flame className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Streaks</span>
            </TabsTrigger>
            <TabsTrigger
              value="words"
              className="data-[state=active]:bg-purple-600 text-xs sm:text-sm"
              data-testid="tab-words"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">Writers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="mt-4">
            {renderLeaderboard(weeklyData, "🔥")}
          </TabsContent>

          <TabsContent value="alltime" className="mt-4">
            {renderLeaderboard(allTimeData, "👑")}
          </TabsContent>

          <TabsContent value="streaks" className="mt-4">
            {renderLeaderboard(streakData, "🎯")}
          </TabsContent>

          <TabsContent value="words" className="mt-4">
            {renderLeaderboard(wordsData, "📝")}
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 text-center">
          <p className="text-xs text-purple-300">Rankings update every 24 hours</p>
        </div>
      </Card>
    </motion.div>
  );
}
