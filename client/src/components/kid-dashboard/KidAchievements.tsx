import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState } from "react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  unlocked: boolean;
  currentProgress?: number;
  targetValue?: number;
  progressPercentage?: number;
}

interface KidAchievementsProps {
  achievements: Achievement[];
}

export function KidAchievements({ achievements }: KidAchievementsProps) {
  const [showAllAchievements, setShowAllAchievements] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-white shadow-lg border-2 border-amber-200">
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Trophy className="w-6 h-6" />
            My Awesome Badges!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.slice(0, showAllAchievements ? achievements.length : 6).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`p-4 rounded-lg text-center transition-all cursor-pointer ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                }`}
              >
                <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-amber-800' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-amber-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                <div className="mt-2">
                  {achievement.unlocked ? (
                    <Badge className="bg-amber-500 text-white text-xs">Unlocked! 🎉</Badge>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">{achievement.currentProgress || 0}/{achievement.targetValue || 100}</span>
                        <span className="text-gray-600">{achievement.progressPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-orange-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${achievement.progressPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {achievements.length > 6 && (
            <div className="text-center mt-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowAllAchievements(!showAllAchievements)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg"
                >
                  {showAllAchievements ? "Show Less 🔼" : "Show More Badges! 🔽"}
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
