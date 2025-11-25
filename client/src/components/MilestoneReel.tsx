import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  icon: string;
  message: string;
  animation: string;
}

export function MilestoneReel() {
  const { data: milestones = [] } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"]
  });

  return (
    <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border-yellow-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Milestones Achieved
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {milestones.length === 0 ? (
            <p className="text-xs text-white/60">Keep writing to unlock milestones!</p>
          ) : (
            milestones.map((m, idx) => (
              <motion.div
                key={m.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
                className="p-2 bg-white/10 rounded border border-yellow-500/30 flex items-center gap-2"
                data-testid={`milestone-${m.id}`}
              >
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{m.title}</p>
                  <p className="text-xs text-white/60">{m.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
