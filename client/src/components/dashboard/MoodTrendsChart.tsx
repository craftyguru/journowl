import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Activity } from "lucide-react";

interface MoodData {
  date: string;
  mood: string;
  value: number;
}

interface MoodTrendsChartProps {
  data: MoodData[];
}

export function MoodTrendsChart({ data = [] }: MoodTrendsChartProps) {
  const moodEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    anxious: "😰",
    calm: "😌",
    excited: "🤩",
    neutral: "😐",
    angry: "😠",
    grateful: "🙏"
  };

  const chartData = data.slice(-30).map(item => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: item.value,
    mood: item.mood,
    full: moodEmojis[item.mood] || "😊"
  }));

  const getMoodStats = () => {
    if (data.length === 0) return null;
    const values = data.map(d => d.value);
    const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
    const recent = data[data.length - 1]?.mood || "neutral";
    return { avg, recent };
  };

  const stats = getMoodStats();

  const moodColors: Record<string, string> = {
    happy: "#fbbf24",
    sad: "#60a5fa",
    anxious: "#f87171",
    calm: "#6ee7b7",
    excited: "#a78bfa",
    neutral: "#d1d5db",
    angry: "#ef4444",
    grateful: "#ec4899"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="mb-6 border-blue-200 bg-gradient-to-br from-blue-50 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Mood Trends
            </div>
            {stats && (
              <div className="text-sm font-normal text-gray-600">
                Avg: <span className="font-semibold text-blue-600">{stats.avg}/5</span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2 text-sm">Start tracking your mood to see trends</p>
              <p className="text-xs">Add mood tags to your journal entries to build your mood history</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Trend Line Chart */}
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[0, 5]}
                      stroke="#9ca3af"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                      formatter={(value: any) => [`${value}/5`, "Mood"]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Mood Distribution Bar Chart */}
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Mood Distribution (Last 30 Days)</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart 
                    data={chartData}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis 
                      domain={[0, 5]}
                      stroke="#9ca3af"
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                      formatter={(value: any) => `${value}/5`}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#6366f1"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Mood Summary */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg border border-blue-200">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Recent Mood</p>
                    <p className="text-3xl">{moodEmojis[stats?.recent || "neutral"]}</p>
                    <p className="text-sm font-semibold text-gray-800 capitalize">{stats?.recent || "neutral"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Average Mood</p>
                    <p className="text-3xl font-bold text-blue-600">{stats?.avg}</p>
                    <p className="text-xs text-gray-600">out of 5</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
