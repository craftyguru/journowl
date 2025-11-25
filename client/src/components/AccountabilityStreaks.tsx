import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, Flame } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface CheckIn {
  id: string;
  date: Date;
  completed: boolean;
  journalWritten: boolean;
}

export function AccountabilityStreaks() {
  const { data: checkIns = [] } = useQuery<CheckIn[]>({ queryKey: ["/api/accountability/check-ins"] });
  const currentStreak = checkIns.filter(c => c.completed && c.journalWritten).length;

  const checkInMutation = useMutation({
    mutationFn: async (journalWritten: boolean) => {
      const res = await fetch("/api/accountability/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ journalWritten, reflection: "Checked in!" })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/accountability/check-ins"] });
    }
  });

  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          🎯 Accountability Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center p-4 bg-white/10 rounded-lg"
        >
          <div className="text-4xl font-bold text-orange-300">{currentStreak}</div>
          <p className="text-xs text-white/60 mt-2">Days with check-in</p>
        </motion.div>

        <div className="space-y-2">
          {checkIns.slice(0, 3).map((checkIn, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs p-2 bg-white/5 rounded">
              {checkIn.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <div className="w-4 h-4 border border-white/30 rounded-full" />
              )}
              <span className="text-white/60">
                {new Date(checkIn.date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-orange-600 hover:bg-orange-700 text-sm gap-2"
          onClick={() => checkInMutation.mutate(true)}
          disabled={checkInMutation.isPending}
          data-testid="button-daily-checkin"
        >
          <CheckCircle2 className="w-4 h-4" />
          Daily Check-In
        </Button>
      </CardContent>
    </Card>
  );
}
