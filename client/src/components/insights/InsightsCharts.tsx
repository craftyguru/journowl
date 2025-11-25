import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChartIcon, Brain } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from "recharts";

interface InsightsChartsProps {
  chartType: "area" | "bar" | "line";
  setChartType: (type: "area" | "bar" | "line") => void;
  dailyChartData: any[];
  moodChartData: any[];
  stats: any;
}

const MOOD_COLORS = {
  '😊': '#10B981', '🤔': '#8B5CF6', '😄': '#F59E0B',
  '😐': '#6B7280', '🎉': '#F97316', '😔': '#EF4444'
};

const CHART_COLORS = ['#8B5CF6', '#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#F97316'];

export const InsightsCharts = ({ chartType, setChartType, dailyChartData, moodChartData, stats }: InsightsChartsProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Daily Writing Activity */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                📝 Writing Activity
              </CardTitle>
              <div className="flex gap-2">
                {["area", "bar", "line"].map((type) => (
                  <Button
                    key={type}
                    variant={chartType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setChartType(type as any)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              {chartType === "area" ? (
                <AreaChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                          <p className="font-medium">{label}</p>
                          <p className="text-purple-600">Words: {data.wordCount}</p>
                          <p className="text-gray-600">Entries: {data.entries}</p>
                          {data.mood && <p className="text-lg">{data.mood}</p>}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Area type="monotone" dataKey="wordCount" stroke="#8B5CF6" fill="url(#colorGradient)" />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              ) : chartType === "bar" ? (
                <BarChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="wordCount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={dailyChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="wordCount" stroke="#8B5CF6" strokeWidth={3} dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mood Distribution */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-pink-500" />
              🎭 Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={moodChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {moodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood as keyof typeof MOOD_COLORS] || CHART_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border">
                          <p className="text-2xl mb-1">{data.mood}</p>
                          <p className="font-medium">{data.count} entries ({data.percentage}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Mood</div>
                  <div className="text-3xl">{stats.averageMood}</div>
                </div>
                {moodChartData.map((mood, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{mood.mood}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{(mood as any).count}</span>
                    </div>
                    <Badge variant="secondary" className="bg-opacity-20">
                      {mood.percentage}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">AI Insight</span>
              </div>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                "You're happiest on {stats.bestMoodDay}s. Most common mood: {stats.averageMood} Grateful."
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
