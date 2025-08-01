import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Trophy, Star, CheckCircle } from "lucide-react";
import type { Achievement } from "./types";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      uncommon: 'bg-green-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-yellow-500'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  const getRarityBorder = (rarity: string) => {
    const colors = {
      common: 'border-gray-200',
      uncommon: 'border-green-200',
      rare: 'border-blue-200',
      epic: 'border-purple-200',
      legendary: 'border-yellow-200'
    };
    return colors[rarity as keyof typeof colors] || 'border-gray-200';
  };

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Achievements
            </div>
            <Badge variant="secondary">
              {unlockedCount}/{totalCount}
            </Badge>
          </CardTitle>
          <Progress value={(unlockedCount / totalCount) * 100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, 6).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${getRarityBorder(achievement.rarity)} ${
                  achievement.unlockedAt ? 'bg-gradient-to-br from-green-50 to-green-100' : 'bg-gray-50'
                } relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
              >
                {achievement.unlockedAt && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </motion.div>
                )}
                
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full ${getRarityColor(achievement.rarity)} flex items-center justify-center text-white text-lg`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${achievement.unlockedAt ? 'text-green-800' : 'text-gray-600'}`}>
                      {achievement.title}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        achievement.rarity === 'legendary' ? 'border-yellow-400 text-yellow-700' :
                        achievement.rarity === 'epic' ? 'border-purple-400 text-purple-700' :
                        achievement.rarity === 'rare' ? 'border-blue-400 text-blue-700' :
                        achievement.rarity === 'uncommon' ? 'border-green-400 text-green-700' :
                        'border-gray-400 text-gray-700'
                      }`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                </div>
                
                <p className={`text-sm ${achievement.unlockedAt ? 'text-green-700' : 'text-gray-500'} mb-2`}>
                  {achievement.description}
                </p>
                
                {achievement.unlockedAt && (
                  <div className="text-xs text-green-600">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                
                {!achievement.unlockedAt && (
                  <motion.div
                    className="absolute inset-0 bg-gray-200/50 backdrop-blur-[1px]"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {achievements.length > 6 && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                And {achievements.length - 6} more achievements to unlock!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}