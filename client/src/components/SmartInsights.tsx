import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function SmartInsights() {
  const { data: insights } = useQuery({
    queryKey: ["/api/insights/writing"]
  });

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Writing Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {insights?.insights?.map((insight: string, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-2 bg-white/5 rounded border border-white/10"
          >
            <p className="text-xs text-white/70">✨ {insight}</p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
