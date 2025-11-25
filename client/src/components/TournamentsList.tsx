import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Trophy, Flame, Target, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Tournament {
  id: string;
  name: string;
  description: string;
  type: "weekly" | "monthly" | "seasonal";
  prize: string;
  participants: number;
  endDate: string;
  leaderboard: { userId: number; username: string; score: number; rank: number }[];
}

export function TournamentsList() {
  const { data: tournaments = [] } = useQuery<Tournament[]>({
    queryKey: ["/api/tournaments/active"]
  });

  const joinMutation = useMutation({
    mutationFn: async (tournamentId: string) => {
      const response = await fetch(`/api/tournaments/${tournamentId}/join`, {
        method: "POST",
        credentials: "include"
      });
      return response.json();
    }
  });

  const getTournamentIcon = (type: string) => {
    switch (type) {
      case "weekly":
        return <Flame className="w-5 h-5 text-red-500" />;
      case "monthly":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "seasonal":
        return <Target className="w-5 h-5 text-purple-500" />;
      default:
        return null;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  return (
    <div className="space-y-4">
      {tournaments.map((tournament, idx) => (
        <motion.div
          key={tournament.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-500/30 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getTournamentIcon(tournament.type)}
                <div>
                  <h3 className="text-lg font-bold text-white">{tournament.name}</h3>
                  <p className="text-sm text-white/70">{tournament.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-yellow-300">{tournament.prize}</p>
                <p className="text-xs text-white/60">{getDaysRemaining(tournament.endDate)} days left</p>
              </div>
            </div>

            {/* Participants & Join */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/70">
                <Users className="w-4 h-4" />
                <span className="text-sm">{tournament.participants} participants</span>
              </div>
              <Button
                onClick={() => joinMutation.mutate(tournament.id)}
                disabled={joinMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 text-sm"
                data-testid={`button-join-${tournament.id}`}
              >
                {joinMutation.isPending ? "Joining..." : "Join Now"}
              </Button>
            </div>

            {/* Leaderboard Preview */}
            {tournament.leaderboard.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-500/20">
                <p className="text-xs font-semibold text-white/60 mb-2">Top Competitors</p>
                <div className="space-y-2">
                  {tournament.leaderboard.slice(0, 3).map((entry) => (
                    <div
                      key={entry.userId}
                      className="flex items-center justify-between text-sm"
                      data-testid={`leaderboard-entry-${entry.rank}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white/80 w-6">#{entry.rank}</span>
                        <span className="text-white/70">{entry.username}</span>
                      </div>
                      <span className="text-purple-300 font-semibold">{entry.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
