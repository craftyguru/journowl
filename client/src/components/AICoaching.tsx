import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, Target, TrendingUp, AlertCircle } from "lucide-react";

interface CoachingData {
  prompt: string;
  tip: string;
  focus: "growth" | "support" | "reflection";
  recommendations: string[];
  moodTrend: "improving" | "declining" | "stable";
}

export function AICoaching() {
  const { data: coaching, isLoading } = useQuery<CoachingData>({
    queryKey: ["/api/coaching/daily-prompt"],
    refetchInterval: 86400000, // Refetch daily
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/30">
        <div className="h-32 bg-white/5 rounded-lg animate-pulse" />
      </Card>
    );
  }

  if (!coaching) {
    return null;
  }

  const getFocusIcon = (focus: string) => {
    switch (focus) {
      case "growth":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "support":
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
      case "reflection":
        return <Target className="w-5 h-5 text-purple-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getTrendEmoji = (trend: string) => {
    switch (trend) {
      case "improving":
        return "📈";
      case "declining":
        return "📉";
      default:
        return "➡️";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main Coaching Card */}
      <Card className="p-6 bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/30 hover:border-amber-500/50 transition">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✨</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-white font-bold text-lg">Your Daily Coaching</h3>
              {getFocusIcon(coaching.focus)}
            </div>
            <p className="text-white/80 mb-4 leading-relaxed">{coaching.prompt}</p>
            <div className="p-3 rounded-lg bg-white/5 border border-amber-500/20">
              <p className="text-sm text-amber-200 font-semibold">💡 Tip:</p>
              <p className="text-sm text-white/70 mt-1">{coaching.tip}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mood Trend Indicator */}
      <Card className="p-4 bg-white/5 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTrendEmoji(coaching.moodTrend)}</span>
            <div>
              <p className="text-xs text-white/60">Mood Trend</p>
              <p className="text-white font-semibold capitalize">{coaching.moodTrend}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-300 hover:text-purple-200"
            data-testid="button-view-analytics"
          >
            View Analytics →
          </Button>
        </div>
      </Card>

      {/* Growth Recommendations */}
      {coaching.recommendations.length > 0 && (
        <Card className="p-4 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h4 className="text-white font-semibold text-sm">Growth Recommendations</h4>
          </div>
          <ul className="space-y-2">
            {coaching.recommendations.map((rec, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-2 text-sm text-white/70"
                data-testid={`recommendation-${idx}`}
              >
                <span className="text-green-400 font-bold mt-1">→</span>
                <span>{rec}</span>
              </motion.li>
            ))}
          </ul>
        </Card>
      )}
    </motion.div>
  );
}
