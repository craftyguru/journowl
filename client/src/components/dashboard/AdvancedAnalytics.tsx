import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, Lightbulb, Target } from "lucide-react";

interface MoodAnalysis {
  trendDirection: "improving" | "declining" | "stable";
  confidence: number;
  insight: string;
  recommendation: string;
  predictedMood: string;
  weeklyInsight?: string;
  strengthAreas?: string[];
}

export function AdvancedAnalytics() {
  const { data: analysis, isLoading } = useQuery<MoodAnalysis>({
    queryKey: ["/api/analytics/mood-analysis"]
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const TrendIcon = analysis.trendDirection === "improving" ? TrendingUp : analysis.trendDirection === "declining" ? TrendingDown : Target;
  const trendColor = analysis.trendDirection === "improving" ? "text-green-500" : analysis.trendDirection === "declining" ? "text-red-500" : "text-blue-500";
  const bgColor = analysis.trendDirection === "improving" ? "from-green-50 to-emerald-50" : analysis.trendDirection === "declining" ? "from-red-50 to-rose-50" : "from-blue-50 to-cyan-50";

  return (
    <div className="space-y-6">
      {/* Trend Direction Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={`bg-gradient-to-br ${bgColor} border-0 shadow-lg`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold capitalize text-gray-800">
              {analysis.trendDirection}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${trendColor.replace("text", "bg")}`}
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-600">{analysis.confidence}%</span>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{analysis.insight}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Recommendation Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-purple-500" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{analysis.recommendation}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Predicted Mood Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Predicted Mood Tomorrow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center">
              {analysis.predictedMood}
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              Based on your recent patterns
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Insights */}
      {analysis.weeklyInsight && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📖 Weekly Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed italic">{analysis.weeklyInsight}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
