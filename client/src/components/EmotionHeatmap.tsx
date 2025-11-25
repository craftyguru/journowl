import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Zap } from "lucide-react";

export function EmotionHeatmap() {
  const { data: heatmap } = useQuery({ queryKey: ["/api/emotion-heatmap"] });

  return (
    <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4" />
          🔥 Emotion Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {heatmap?.moodDistribution && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={heatmap.moodDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mood" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 10 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                <Bar dataKey="count" fill="#ef4444" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-white/60 mt-3 text-center">
              Dominant mood: <span className="font-semibold text-white">{heatmap.predominantMood}</span>
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
