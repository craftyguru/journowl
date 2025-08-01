import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Target, Plus, Clock, CheckCircle, Trash2 } from "lucide-react";
import type { Goal } from "./types";

interface GoalsSectionProps {
  goals: Goal[];
  onCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: number) => void;
  onViewGoal: (goal: Goal) => void;
}

export function GoalsSection({ 
  goals, 
  onCreateGoal, 
  onEditGoal, 
  onDeleteGoal, 
  onViewGoal 
}: GoalsSectionProps) {
  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: 'bg-green-100 text-green-800 border-green-200',
      Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Hard: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Personal Goals
            </CardTitle>
            <Button
              onClick={onCreateGoal}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Goal
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Goals Set</h3>
              <p className="text-gray-500 mb-4">
                Create your first goal to start tracking your journaling progress!
              </p>
              <Button onClick={onCreateGoal} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal, index) => {
                const progress = Math.min((goal.currentValue / goal.targetValue) * 100, 100);
                
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                      goal.isCompleted 
                        ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-semibold ${goal.isCompleted ? 'text-green-800' : 'text-gray-800'}`}>
                            {goal.title}
                          </h4>
                          {goal.isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getDifficultyColor(goal.difficulty)}>
                            {goal.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {goal.type}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 ml-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewGoal(goal)}
                          className="h-8 w-8 p-0"
                        >
                          <Target className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteGoal(goal.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className={`font-medium ${goal.isCompleted ? 'text-green-600' : 'text-gray-800'}`}>
                          {goal.currentValue} / {goal.targetValue}
                        </span>
                      </div>
                      <Progress 
                        value={progress} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{progress.toFixed(0)}% complete</span>
                        {goal.isCompleted && (
                          <span className="text-green-600 font-medium">✅ Completed!</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}