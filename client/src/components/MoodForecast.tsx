import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Forecast {
  date: string;
  predictedMood: string;
  confidence: number;
}

export function MoodForecast() {
  const { data: forecast = [] } = useQuery<Forecast[]>({ queryKey: ["/api/mood/forecast"] });

  const moodEmojis: any = { happy: "😊", good: "🙂", neutral: "😐", sad: "😢", angry: "😠" };

  return (
    <Card className="bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-teal-500/50">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          📊 Mood Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
          {forecast.slice(0, 5).map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-white/5 rounded text-xs">
              <span className="text-white/60">{new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}</span>
              <span className="text-lg">{moodEmojis[day.predictedMood] || "?"}</span>
              <span className="text-white/50">{day.confidence}%</span>
            </div>
          ))}
        </motion.div>

        {forecast.length > 0 && (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 8 }} />
              <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 8 }} />
              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)" }} />
              <Line type="monotone" dataKey="confidence" stroke="#06b6d4" strokeWidth={2} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
