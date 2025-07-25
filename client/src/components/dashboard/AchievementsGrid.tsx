import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Award, Lock } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  unlockedAt: string | Date | null;
  type: string;
}

interface AchievementsGridProps {
  achievements: Achievement[];
}

export default function AchievementsGrid({ achievements }: AchievementsGridProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const unlockedAchievements = achievements?.filter(a => a.unlockedAt) || [];
  const lockedAchievements = achievements?.filter(a => !a.unlockedAt) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Achievements
          <Badge variant="secondary" className="ml-2">
            {unlockedAchievements.length}/{achievements?.length || 0}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Unlocked Achievements */}
          {unlockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="relative p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>
                    {achievement.unlockedAt && (
                      <span className="text-xs text-green-500">
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Unlocked indicator */}
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Locked Achievements (show first 3) */}
          {lockedAchievements.slice(0, 3).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (unlockedAchievements.length + index) * 0.05 }}
              className="relative p-4 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border border-gray-200 dark:border-gray-600 rounded-lg opacity-60"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl grayscale">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">
                    {achievement.description}
                  </p>
                  <Badge 
                    variant="outline" 
                    className="text-xs bg-gray-100 text-gray-600 border-gray-300"
                  >
                    {achievement.rarity}
                  </Badge>
                </div>
              </div>
              
              {/* Locked indicator */}
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <Lock className="h-3 w-3 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {lockedAchievements.length > 3 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              +{lockedAchievements.length - 3} more achievements to unlock
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}