import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description: string;
  progress: number;
  target: number;
  category: string;
  difficulty: string;
}

interface Stats {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
}

interface KidGoalsProps {
  goals: Goal[];
  stats: Stats;
}

export function KidGoals({ goals, stats }: KidGoalsProps) {
  const mapGoalProgress = (goal: Goal): { current: number; target: number } => {
    let actualCurrentValue = 0;
    let actualTargetValue = (goal as any).targetValue || 100;

    switch (goal.title) {
      case 'Getting Started':
      case 'First Steps':
        actualCurrentValue = Math.min(stats.totalEntries || 0, actualTargetValue);
        break;
      case 'Early Bird':
        actualCurrentValue = Math.min(stats.currentStreak || 0, actualTargetValue);
        break;
      case 'Word Explorer':
      case 'Word Warrior':
      case 'Prolific Writer':
        actualCurrentValue = Math.min(stats.totalWords || 0, actualTargetValue);
        break;
      case 'Week Warrior':
      case 'Dedicated Writer':
      case 'Monthly Habit':
      case 'Three Week Wonder':
      case 'Monthly Master':
        actualCurrentValue = Math.min(stats.currentStreak || 0, actualTargetValue);
        break;
      case 'Momentum Builder':
        actualCurrentValue = Math.min(stats.totalEntries || 0, actualTargetValue);
        break;
      case 'Night Owl':
        actualCurrentValue = Math.floor((stats.totalEntries || 0) * 0.3);
        break;
      case 'Story Teller':
        actualCurrentValue = Math.min(stats.totalWords || 0, actualTargetValue);
        break;
      case 'Novelist Dreams':
        actualCurrentValue = Math.min(stats.totalWords || 0, actualTargetValue);
        break;
      case 'Quarter Master':
        actualCurrentValue = Math.min(stats.currentStreak || 0, actualTargetValue);
        break;
      default:
        actualCurrentValue = Math.min(stats.totalEntries || 0, actualTargetValue);
    }

    return { current: actualCurrentValue, target: actualTargetValue };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="bg-white shadow-lg border-2 border-emerald-200">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Target className="w-6 h-6" />
            My Amazing Goals!
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((goal, index) => {
              const { current: actualCurrentValue, target: actualTargetValue } = mapGoalProgress(goal);
              const progressPercentage = actualTargetValue > 0 ? Math.min(100, Math.round((actualCurrentValue / actualTargetValue) * 100)) : 0;
              const isCompleted = progressPercentage >= 100;
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 shadow-md hover:shadow-lg'
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{isCompleted ? '🎯' : '⭐'}</span>
                    <h4 className={`font-semibold text-sm ${isCompleted ? 'text-emerald-800' : 'text-gray-700'}`}>
                      {goal.title}
                    </h4>
                  </div>
                  <p className={`text-xs mb-3 ${isCompleted ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {goal.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{actualCurrentValue}/{actualTargetValue}</span>
                      <span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'text-gray-600'}`}>
                        {progressPercentage}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className={`h-2 ${isCompleted ? 'bg-emerald-100' : 'bg-gray-100'}`}
                    />
                    {isCompleted && (
                      <Badge className="w-full justify-center bg-emerald-500 text-white text-xs">
                        🎉 Goal Completed!
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
