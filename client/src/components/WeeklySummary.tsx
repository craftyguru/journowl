import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Sparkles } from "lucide-react";

export function WeeklySummary() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ["/api/journal/summaries"],
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-indigo-500/20 rounded w-1/3"></div>
          <div className="h-4 bg-indigo-500/10 rounded w-full"></div>
          <div className="h-4 bg-indigo-500/10 rounded w-5/6"></div>
        </div>
      </Card>
    );
  }

  if (!summary || !summary.insights) {
    return null;
  }

  const { insights, moodArc, keyThemes, journeyLine } = summary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 3 }}>
            <Sparkles className="w-6 h-6 text-indigo-300" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white">Weekly Insights</h3>
          <span className="text-sm text-indigo-300 ml-auto">Last 7 days</span>
        </div>

        {/* Mood Arc */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-300" />
            <span className="text-sm font-semibold text-indigo-200">Mood Journey</span>
          </div>
          <p className="text-white/90">{moodArc}</p>
        </div>

        {/* Key Insights */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-semibold text-purple-200">Key Insights</span>
          </div>

          {insights?.map((insight: string, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-lg bg-white/5 border border-purple-500/20 hover:border-purple-500/40 transition"
            >
              <p className="text-white/80 text-sm">{insight}</p>
            </motion.div>
          ))}
        </div>

        {/* Key Themes */}
        {keyThemes && keyThemes.length > 0 && (
          <div className="mt-6 pt-6 border-t border-indigo-500/20">
            <p className="text-xs font-semibold text-indigo-300 mb-3">Key Themes</p>
            <div className="flex flex-wrap gap-2">
              {keyThemes.map((theme: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-xs text-indigo-200"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Journey Line */}
        {journeyLine && (
          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <p className="text-xs font-semibold text-purple-300 mb-2">Your Journey This Week</p>
            <p className="text-white/70 text-sm italic">{journeyLine}</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
