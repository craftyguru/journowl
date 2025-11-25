import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Trophy, Flame, BookOpen, Users, Target } from "lucide-react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "milestone" | "streak" | "social" | "writing" | "consistency";
}

interface LevelData {
  level: number;
  levelName: string;
  nextLevel: number;
  nextLevelName: string;
  entriesUntilNextLevel: number;
  progressToNextLevel: number;
  totalProgress: number;
}

export function AchievementBadges() {
  const { data: stats } = useQuery<LevelData>({
    queryKey: ["/api/achievements/stats"]
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"]
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "milestone":
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case "streak":
        return <Flame className="w-4 h-4 text-red-500" />;
      case "writing":
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case "social":
        return <Users className="w-4 h-4 text-pink-500" />;
      case "consistency":
        return <Target className="w-4 h-4 text-green-500" />;
      default:
        return null;
    }
  };

  const categories = ["milestone", "streak", "writing", "social", "consistency"];

  return (
    <div className="space-y-4">
      {/* Level Section */}
      {stats && (
        <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">{stats.levelName}</h3>
              <p className="text-sm text-white/70">Level {stats.level}</p>
            </div>
            <div className="text-5xl">{stats.level}</div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/70">
              <span>{stats.entriesUntilNextLevel} entries to next level</span>
              <span>{stats.progressToNextLevel}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                initial={{ width: 0 }}
                animate={{ width: `${stats.progressToNextLevel}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-white/60">Next: {stats.nextLevelName}</p>
          </div>
        </Card>
      )}

      {/* Achievements Grid */}
      <Card className="bg-white/5 border-white/10 p-6">
        <Tabs defaultValue="milestone" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10 border border-white/20">
            <TabsTrigger value="milestone" className="text-xs" data-testid="tab-milestone">🎯</TabsTrigger>
            <TabsTrigger value="streak" className="text-xs" data-testid="tab-streak">🔥</TabsTrigger>
            <TabsTrigger value="writing" className="text-xs" data-testid="tab-writing">📖</TabsTrigger>
            <TabsTrigger value="social" className="text-xs" data-testid="tab-social">👥</TabsTrigger>
            <TabsTrigger value="consistency" className="text-xs" data-testid="tab-consistency">⭐</TabsTrigger>
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {achievements
                  .filter((a) => a.category === category)
                  .map((achievement, idx) => {
                    const isUnlocked = achievements.some((a) => a.id === achievement.id);
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`relative p-4 rounded-lg border text-center transition-all ${
                          isUnlocked
                            ? "bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-500/50"
                            : "bg-white/5 border-white/20 opacity-60"
                        }`}
                        data-testid={`achievement-${achievement.id}`}
                      >
                        {/* Locked badge */}
                        {!isUnlocked && (
                          <div className="absolute top-1 right-1 text-xs bg-white/20 px-2 py-1 rounded">
                            🔒
                          </div>
                        )}

                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h4 className="text-xs font-bold text-white">{achievement.name}</h4>
                        <p className="text-xs text-white/70 mt-1">{achievement.description}</p>

                        {isUnlocked && (
                          <motion.div
                            className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}
