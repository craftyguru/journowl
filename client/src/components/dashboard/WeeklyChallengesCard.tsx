import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Zap, Trophy, Lock } from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  description: string;
  icon: string;
  difficulty: string;
  rewardXp: number;
  progress?: number;
  isCompleted?: boolean;
}

interface WeeklyChallengesCardProps {
  challenges: Challenge[];
  onChallengeClick?: (challenge: Challenge) => void;
}

export function WeeklyChallengesCard({ challenges = [], onChallengeClick }: WeeklyChallengesCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      hard: "bg-red-100 text-red-800 border-red-200"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="mb-6 border-purple-200 bg-gradient-to-br from-purple-50 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Weekly Challenges
            </div>
            <Badge variant="secondary" className="text-xs">
              {challenges.filter(c => c.isCompleted).length}/{challenges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No challenges this week yet</p>
              <p className="text-sm">Check back soon for new weekly quests!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {challenges.map((challenge, idx) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => onChallengeClick?.(challenge)}
                  className="p-4 rounded-lg border-2 border-purple-200 bg-white hover:shadow-lg transition-all cursor-pointer relative overflow-hidden group"
                >
                  {challenge.isCompleted && (
                    <div className="absolute top-0 right-0 w-full h-full bg-green-500 bg-opacity-10 rounded-lg" />
                  )}
                  
                  <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{challenge.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900">{challenge.title}</h4>
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                        
                        {!challenge.isCompleted ? (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-amber-600 font-semibold flex items-center gap-1">
                                <Zap className="w-3 h-3" /> +{challenge.rewardXp} XP
                              </span>
                            </div>
                            <Progress value={(challenge.progress || 0) * 10} className="h-2" />
                          </div>
                        ) : (
                          <div className="text-xs font-semibold text-green-600 flex items-center gap-1">
                            ✅ Completed!
                          </div>
                        )}
                      </div>
                    </div>
                    {challenge.isCompleted && (
                      <Trophy className="w-5 h-5 text-amber-500 mt-1" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
