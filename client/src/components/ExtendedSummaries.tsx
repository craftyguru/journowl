import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Calendar, TrendingUp, Zap, Target, BookOpen } from "lucide-react";

interface WeeklySummaryData {
  title: string;
  summary: string;
  highlights: string[];
  mood_arc: string;
  recommendations: string[];
}

interface MonthlySummaryData {
  title: string;
  overview: string;
  top_themes: string[];
  growth_areas: string[];
  mood_evolution: string;
  next_month_focus: string[];
  stats: {
    total_entries: number;
    total_words: number;
    avg_mood: string;
  };
}

export function ExtendedSummaries() {
  const { data: weeklySummary, isLoading: weeklyLoading } = useQuery<WeeklySummaryData>({
    queryKey: ["/api/summaries/weekly"]
  });

  const { data: monthlySummary, isLoading: monthlyLoading } = useQuery<MonthlySummaryData>({
    queryKey: ["/api/summaries/monthly"]
  });

  return (
    <Tabs defaultValue="weekly" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="weekly" className="gap-2">
          <Calendar className="w-4 h-4" />
          Weekly
        </TabsTrigger>
        <TabsTrigger value="monthly" className="gap-2">
          <BookOpen className="w-4 h-4" />
          Monthly
        </TabsTrigger>
      </TabsList>

      {/* Weekly Summary */}
      <TabsContent value="weekly" className="space-y-4">
        {weeklyLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : weeklySummary ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overview Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  {weeklySummary.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 leading-relaxed">{weeklySummary.summary}</p>
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {weeklySummary.mood_arc}
                </div>
              </CardContent>
            </Card>

            {/* Highlights */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ✨ Key Highlights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weeklySummary.highlights.map((h, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-green-500 font-bold">•</span>
                      <span className="text-gray-700">{h}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💡 Recommendations for Next Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {weeklySummary.recommendations.map((r, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-purple-500 font-bold">→</span>
                      <span className="text-gray-700">{r}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </TabsContent>

      {/* Monthly Summary */}
      <TabsContent value="monthly" className="space-y-4">
        {monthlyLoading ? (
          <div className="space-y-3 animate-pulse">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : monthlySummary ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Overview */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📊 {monthlySummary.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-700 leading-relaxed">{monthlySummary.overview}</p>
                <p className="text-sm text-gray-600 italic">{monthlySummary.mood_evolution}</p>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{monthlySummary.stats.total_entries}</div>
                  <div className="text-xs text-blue-600">Entries</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{(monthlySummary.stats.total_words / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-green-600">Words</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
                <CardContent className="pt-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">📈</div>
                  <div className="text-xs text-purple-600">{monthlySummary.stats.avg_mood}</div>
                </CardContent>
              </Card>
            </div>

            {/* Themes */}
            <Card className="bg-gradient-to-br from-yellow-50 to-amber-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎯 Top Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {monthlySummary.top_themes.map((t, i) => (
                    <span key={i} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Growth Areas */}
            <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌱 Growth Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {monthlySummary.growth_areas.map((g, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-pink-500 font-bold">+</span>
                      <span className="text-gray-700">{g}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎪 Next Month Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {monthlySummary.next_month_focus.map((f, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-teal-500 font-bold">→</span>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
