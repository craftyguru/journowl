import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export function WritingStats() {
  const { data: stats = {} } = useQuery({
    queryKey: ["/api/writing/stats"]
  });

  const statCards = [
    { label: "Total Entries", value: stats.totalEntries, icon: "📝" },
    { label: "Total Words", value: stats.totalWords?.toLocaleString(), icon: "✍️" },
    { label: "Average Length", value: `${stats.averageLength} words`, icon: "📊" },
    { label: "Longest Entry", value: `${stats.longestEntry} words`, icon: "🏆" },
    { label: "Last 7 Days", value: `${stats.entriesLast7Days} entries`, icon: "📅" },
    { label: "Current Streak", value: `${stats.currentStreak} days`, icon: "🔥" }
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Writing Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {statCards.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-white/5 rounded-lg border border-white/10"
              data-testid={`stat-${card.label.toLowerCase().replace(/\s/g, "-")}`}
            >
              <p className="text-xs text-white/60">{card.label}</p>
              <p className="text-lg font-bold text-white mt-1">{card.value}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
