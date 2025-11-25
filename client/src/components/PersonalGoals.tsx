import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Target, CheckCircle2, Plus } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  completed: boolean;
}

export function PersonalGoals() {
  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ["/api/goals"]
  });

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Target className="w-4 h-4" />
          Personal Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.map((goal, idx) => {
          const progress = (goal.current / goal.target) * 100;
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10"
              data-testid={`goal-${goal.id}`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">{goal.title}</h4>
                {goal.completed && <CheckCircle2 className="w-4 h-4 text-green-400" />}
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-xs text-white/60 mt-2">{goal.current} / {goal.target} {goal.unit}</p>
            </motion.div>
          );
        })}
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm gap-2" data-testid="button-add-goal">
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </CardContent>
    </Card>
  );
}
