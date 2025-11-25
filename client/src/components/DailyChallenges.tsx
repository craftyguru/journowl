import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
}

const difficultyColors = {
  easy: "bg-green-500/20 border-green-500/50",
  medium: "bg-yellow-500/20 border-yellow-500/50",
  hard: "bg-red-500/20 border-red-500/50"
};

const difficultyLabels = {
  easy: "Easy",
  medium: "Medium",
  hard: "Challenge"
};

export function DailyChallenges() {
  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges/daily"]
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/challenges/stats"]
  });

  const completeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const response = await fetch(`/api/challenges/${challengeId}/complete`, {
        method: "POST",
        credentials: "include"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/daily"] });
      queryClient.invalidateQueries({ queryKey: ["/api/challenges/stats"] });
    }
  });

  const completedCount = challenges.filter(c => c.completed).length;
  const totalReward = challenges
    .filter(c => c.completed)
    .reduce((sum, c) => sum + c.reward, 0);

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-6"
        data-testid="daily-challenges-header"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Today's Challenges</h3>
            <p className="text-sm text-white/70">Complete challenges to earn bonus prompts and streaks</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-2xl font-bold text-white">{totalReward}</span>
              <span className="text-sm text-white/60">pts</span>
            </div>
            <p className="text-sm text-white/70">{completedCount}/{challenges.length} completed</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-purple-400"
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / challenges.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Challenges Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {challenges.map((challenge, idx) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card
              className={`${difficultyColors[challenge.difficulty]} border p-4 relative overflow-hidden`}
              data-testid={`card-challenge-${challenge.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl mt-1">{challenge.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-white mb-1">{challenge.title}</h4>
                  <p className="text-xs text-white/70 mb-3">{challenge.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/60">
                      {difficultyLabels[challenge.difficulty]}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">+{challenge.reward}</span>
                      {challenge.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" data-testid={`icon-completed-${challenge.id}`} />
                      ) : (
                        <Button
                          onClick={() => completeMutation.mutate(challenge.id)}
                          disabled={completeMutation.isPending}
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white text-xs h-6 px-2"
                          data-testid={`button-complete-${challenge.id}`}
                        >
                          {completeMutation.isPending ? "..." : "Complete"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
