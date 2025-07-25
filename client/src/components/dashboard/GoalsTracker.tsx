import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Target, Plus, CheckCircle, Clock } from "lucide-react";

interface Goal {
  id: number;
  title: string;
  description: string;
  type: string;
  targetValue: number;
  currentValue: number;
  difficulty: string;
  isCompleted: boolean;
}

interface GoalsTrackerProps {
  goals: Goal[];
  onNewGoal: () => void;
}

export default function GoalsTracker({ goals, onNewGoal }: GoalsTrackerProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getGoalIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      'streak': '📅',
      'words': '📝',
      'entries': '📚',
      'mood': '😊',
      'photos': '📸',
      'reflection': '🧘',
      'creative': '🎨',
      'gratitude': '🙏',
      'reading_time': '⏰',
      'consistency': '⚡'
    };
    return iconMap[type] || '🎯';
  };

  const activeGoals = goals?.filter(g => !g.isCompleted) || [];
  const completedGoals = goals?.filter(g => g.isCompleted) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Goals
            <Badge variant="secondary" className="ml-2">
              {completedGoals.length}/{goals?.length || 0}
            </Badge>
          </CardTitle>
          <Button onClick={onNewGoal} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Goal
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active Goals
              </h4>
              <div className="space-y-3">
                {activeGoals.map((goal, index) => {
                  const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                  
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{getGoalIcon(goal.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                              {goal.title}
                            </h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getDifficultyColor(goal.difficulty)}`}
                            >
                              {goal.difficulty}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-blue-600 dark:text-blue-300 mb-3">
                            {goal.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-blue-700 dark:text-blue-300">
                                Progress: {goal.currentValue} / {goal.targetValue}
                              </span>
                              <span className="font-semibold text-blue-800 dark:text-blue-200">
                                {Math.round(progress)}%
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Completed Goals
              </h4>
              <div className="space-y-3">
                {completedGoals.slice(0, 3).map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (activeGoals.length + index) * 0.1 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{getGoalIcon(goal.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-green-800 dark:text-green-200">
                            {goal.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300">
                              Completed
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* No Goals State */}
          {(!goals || goals.length === 0) && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">No goals yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Set your first journaling goal to track your progress!
              </p>
              <Button onClick={onNewGoal} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}