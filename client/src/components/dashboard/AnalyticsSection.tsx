import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Clock, PieChart, Type } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import type { JournalEntry, Stats } from "./types";

interface AnalyticsSectionProps {
  entries: JournalEntry[];
  stats: Stats;
  onWordCloudClick: () => void;
  onTimeHeatmapClick: () => void;
  onTopicAnalysisClick: () => void;
}

export function AnalyticsSection({ 
  entries, 
  stats, 
  onWordCloudClick,
  onTimeHeatmapClick,
  onTopicAnalysisClick 
}: AnalyticsSectionProps) {
  // Generate sample data for charts based on actual entries
  const generateMoodData = () => {
    const moodMap: Record<string, number> = {};
    entries.forEach(entry => {
      const mood = entry.mood || '😊';
      moodMap[mood] = (moodMap[mood] || 0) + 1;
    });
    
    return Object.entries(moodMap).map(([mood, count]) => ({
      mood,
      count,
      percentage: ((count / entries.length) * 100).toFixed(1)
    }));
  };

  const generateWeeklyData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayEntries = entries.filter(entry => 
        entry.createdAt?.startsWith(date)
      ).length;
      
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        entries: dayEntries,
        words: dayEntries * 150 // Estimate words per entry
      };
    });
  };

  const generateWritingTimeData = () => {
    const hours = Array.from({ length: 24 }, (_, hour) => {
      const entriesAtHour = entries.filter(entry => {
        if (!entry.createdAt) return false;
        const entryHour = new Date(entry.createdAt).getHours();
        return entryHour === hour;
      }).length;

      return {
        hour: hour.toString().padStart(2, '0') + ':00',
        entries: entriesAtHour
      };
    });

    return hours.filter(h => h.entries > 0);
  };

  const moodData = generateMoodData();
  const weeklyData = generateWeeklyData();
  const timeData = generateWritingTimeData();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">This Week</p>
                <p className="text-2xl font-bold text-blue-800">{stats?.wordsThisWeek || 0}</p>
                <p className="text-xs text-blue-600">Words written</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Best Streak</p>
                <p className="text-2xl font-bold text-green-800">{stats?.longestStreak || 0}</p>
                <p className="text-xs text-green-600">Days</p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Avg Mood</p>
                <p className="text-2xl font-bold text-purple-800">
                  {stats?.averageMood ? `${stats.averageMood.toFixed(1)}/10` : 'N/A'}
                </p>
                <p className="text-xs text-purple-600">Happiness</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Active Days</p>
                <p className="text-2xl font-bold text-orange-800">{entries.length}</p>
                <p className="text-xs text-orange-600">Total entries</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Writing Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Weekly Writing Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="entries" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="words" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Mood Distribution and Writing Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Mood Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={moodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ mood, percentage }) => `${mood} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {moodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No mood data available yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Writing Time Patterns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="entries" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No time pattern data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={onWordCloudClick}
          variant="outline"
          className="h-20 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Type className="w-6 h-6" />
          <span>Word Cloud Analysis</span>
        </Button>

        <Button
          onClick={onTimeHeatmapClick}
          variant="outline"
          className="h-20 flex-col gap-2 hover:bg-green-50 hover:border-green-300"
        >
          <Calendar className="w-6 h-6" />
          <span>Writing Heatmap</span>
        </Button>

        <Button
          onClick={onTopicAnalysisClick}
          variant="outline"
          className="h-20 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300"
        >
          <BarChart3 className="w-6 h-6" />
          <span>Topic Clustering</span>
        </Button>
      </div>
    </motion.div>
  );
}