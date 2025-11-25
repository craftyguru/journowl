import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Plus, Flame } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface Buddy {
  id: string;
  buddyId: number;
  status: string;
  streakChallenge: boolean;
}

export function BuddySystem() {
  const { data: buddies = [] } = useQuery<Buddy[]>({ queryKey: ["/api/buddies"] });

  const challengeMutation = useMutation({
    mutationFn: async (buddyId: string) => {
      const res = await fetch(`/api/buddies/${buddyId}/challenge`, { method: "POST", credentials: "include" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/buddies"] });
    }
  });

  return (
    <Card className="bg-gradient-to-br from-lime-500/20 to-green-500/20 border-lime-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          👥 Buddy System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {buddies.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-xs text-white/60">No buddies yet</p>
          </div>
        ) : (
          buddies.map((buddy, idx) => (
            <motion.div
              key={buddy.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-2 bg-white/5 rounded border border-lime-500/20 flex justify-between items-center"
              data-testid={`buddy-${buddy.id}`}
            >
              <div>
                <p className="text-xs font-semibold text-white">Buddy #{buddy.buddyId}</p>
                <p className="text-xs text-white/60">{buddy.status}</p>
              </div>
              <Button
                size="sm"
                onClick={() => challengeMutation.mutate(buddy.id)}
                disabled={buddy.streakChallenge}
                variant="ghost"
                data-testid={`button-challenge-${buddy.id}`}
              >
                <Flame className="w-3 h-3 text-orange-400" />
              </Button>
            </motion.div>
          ))
        )}

        <Button className="w-full bg-lime-600 hover:bg-lime-700 text-sm gap-2" data-testid="button-find-buddy">
          <Plus className="w-4 h-4" />
          Find a Buddy
        </Button>
      </CardContent>
    </Card>
  );
}
