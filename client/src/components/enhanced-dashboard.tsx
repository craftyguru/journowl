import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb, Type, Brush, Plus, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import InteractiveJournal from "./interactive-journal";
import SmartJournalEditor from "./smart-journal-editor";
import UnifiedJournal from "./unified-journal";
import InteractiveCalendar from "./interactive-calendar";

const moodData = [
  { day: 'Mon', mood: 4, entries: 1 },
  { day: 'Tue', mood: 5, entries: 2 },
  { day: 'Wed', mood: 3, entries: 1 },
  { day: 'Thu', mood: 4, entries: 3 },
  { day: 'Fri', mood: 5, entries: 2 },
  { day: 'Sat', mood: 4, entries: 1 },
  { day: 'Sun', mood: 5, entries: 2 },
];

const progressData = [
  { month: 'Jan', entries: 15, words: 3200 },
  { month: 'Feb', entries: 22, words: 4800 },
  { month: 'Mar', entries: 28, words: 6100 },
  { month: 'Apr', entries: 35, words: 7500 },
  { month: 'May', entries: 42, words: 9200 },
  { month: 'Jun', entries: 38, words: 8700 },
];

const achievements = [
  { id: 1, title: "First Steps", description: "Wrote your first journal entry", icon: "🎯", unlocked: true, rarity: "common" },
  { id: 2, title: "Consistent Writer", description: "7-day writing streak", icon: "🔥", unlocked: true, rarity: "rare" },
  { id: 3, title: "Wordsmith", description: "Wrote 1000+ words in a single entry", icon: "✍️", unlocked: true, rarity: "epic" },
  { id: 4, title: "Mood Master", description: "Used all mood types", icon: "🌈", unlocked: false, rarity: "legendary" },
  { id: 5, title: "AI Collaborator", description: "Used 50 AI prompts", icon: "🤖", unlocked: false, rarity: "rare" },
  { id: 6, title: "Reflection Guru", description: "30-day streak", icon: "🧘", unlocked: false, rarity: "legendary" },
];

const goals = [
  { id: 1, title: "Write Daily", description: "Write at least one entry every day", progress: 75, target: 30, current: 23, type: "streak" },
  { id: 2, title: "Word Count Champion", description: "Write 10,000 words this month", progress: 65, target: 10000, current: 6500, type: "words" },
  { id: 3, title: "Mood Tracker", description: "Track mood for 21 days", progress: 90, target: 21, current: 19, type: "consistency" },
];

const recentEntries = [
  { id: 1, title: "Morning Reflections", mood: "😊", date: "Today", wordCount: 287, tags: ["gratitude", "morning"] },
  { id: 2, title: "Work Breakthrough", mood: "🎉", date: "Yesterday", wordCount: 423, tags: ["career", "success"] },
  { id: 3, title: "Weekend Adventures", mood: "😄", date: "2 days ago", wordCount: 356, tags: ["fun", "family"] },
  { id: 4, title: "Quiet Contemplation", mood: "🤔", date: "3 days ago", wordCount: 198, tags: ["thoughts", "philosophy"] },
];

const aiInsights = [
  "Your writing style shows increased positivity over the past month",
  "You tend to write longer entries when discussing personal growth",
  "Evening entries often contain more reflective content",
  "Your vocabulary has expanded by 15% since starting"
];

const prompts = [
  "What are three things you're grateful for today?",
  "Describe a moment that changed your perspective",
  "What would you tell your younger self?",
  "Write about a challenge you overcame recently",
  "What does success mean to you right now?"
];

export default function EnhancedDashboard() {
  const [showSmartEditor, setShowSmartEditor] = useState(false);
  const [showUnifiedJournal, setShowUnifiedJournal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const handleSaveEntry = (entryData: any) => {
    console.log('Saving entry:', entryData);
    // Here you would typically save to backend
    setShowSmartEditor(false);
    setShowUnifiedJournal(false);
    setSelectedEntry(null);
  };

  const openSmartEditor = (entry?: any) => {
    setSelectedEntry(entry);
    setShowSmartEditor(true);
  };

  const openUnifiedJournal = (entry?: any) => {
    setSelectedEntry(entry);
    setShowUnifiedJournal(true);
  };

  const handleDateSelect = (date: Date) => {
    // Open journal for selected date
    openUnifiedJournal();
  };

  const handleEntryEdit = (entry: any) => {
    openUnifiedJournal(entry);
  };

  // Convert recentEntries to calendar format with varied dates
  const calendarEntries = recentEntries.map((entry, index) => {
    const date = new Date();
    date.setDate(date.getDate() - index); // Spread entries across recent days
    return {
      ...entry,
      date: date,
      createdAt: date.toISOString(),
      photos: index === 1 ? ["photo1.jpg", "photo2.jpg"] : [], // Add photos to some entries
      isPinned: index === 0, // Pin the first entry
      isPrivate: index === 3, // Make one entry private
      tags: ["mood", "reflection", "daily"]
    };
  });

  return (
    <div className="relative p-6 space-y-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/20 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center bg-gradient-to-r from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-purple-500/20 overflow-hidden"
      >
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-sm animate-pulse"></div>
        <div className="relative z-10">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent mb-3"
          >
            Welcome back, Emma! ✨
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg"
          >
            Ready to continue your creative journaling journey?
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-purple-300/30 hover:scale-105 transition-transform">
              Level 12 - Beautiful Writer ✨
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-300/30 hover:scale-105 transition-transform">
              🔥 28-day streak 🔥
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Artistic Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="relative bg-gradient-to-br from-purple-800/80 via-purple-700/70 to-purple-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-400/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-300 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-purple-200 text-xs uppercase tracking-wider">Entries</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">142</div>
            <div className="text-purple-300 text-sm">+3 this week</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="relative bg-gradient-to-br from-pink-800/80 via-pink-700/70 to-pink-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-pink-400/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-300 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-pink-200 text-xs uppercase tracking-wider">Words</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">28,750</div>
            <div className="text-pink-300 text-sm">+1,240 this week</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="relative bg-gradient-to-br from-emerald-800/80 via-emerald-700/70 to-emerald-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-emerald-400/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-emerald-200 text-xs uppercase tracking-wider">Streak</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">28</div>
            <div className="text-emerald-300 text-sm">days strong 🔥</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          className="relative bg-gradient-to-br from-amber-800/80 via-amber-700/70 to-amber-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-amber-400/30 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-amber-200 text-xs uppercase tracking-wider">XP</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">11,450</div>
            <div className="text-amber-300 text-sm">Level 12 ✨</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="journal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-slate-800/90 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
          <TabsTrigger value="journal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 transition-all">
            📖 Journal
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 transition-all">
            📊 Analytics
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 transition-all">
            🏆 Achievements
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 transition-all">
            🎯 Goals
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 transition-all">
            🤖 AI Insights
          </TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-gray-300 transition-all">
            📅 Memory Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="journal">
          <div className="space-y-6">
            {/* Smart Journal Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Smart Journal</h2>
                  <p className="text-gray-300">Your AI-powered writing companion with photo analysis and intelligent prompts</p>
                </div>
                <Button 
                  onClick={() => openUnifiedJournal()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Open Journal Book
                </Button>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI Photo Analysis</h3>
                <p className="text-gray-300 text-sm">Upload photos and AI extracts emotions, activities, and insights</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-lg rounded-xl p-4 border border-pink-500/20"
              >
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Rich Text Editor</h3>
                <p className="text-gray-300 text-sm">10+ fonts, custom colors, markdown support with live preview</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/20"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Smart Prompts</h3>
                <p className="text-gray-300 text-sm">AI generates personalized writing prompts based on your mood</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/20"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <Brush className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">Drawing Tools</h3>
                <p className="text-gray-300 text-sm">Built-in canvas for sketches and creative expression</p>
              </motion.div>
            </div>

            {/* Recent Smart Entries */}
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Smart Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEntries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => openUnifiedJournal(entry)}
                      className="p-4 rounded-lg border border-purple-200/20 bg-slate-800/50 hover:bg-slate-700/50 hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{entry.mood}</div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{entry.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span>{entry.date}</span>
                              <span>•</span>
                              <span>{entry.wordCount} words</span>
                              <span>•</span>
                              <span className="text-purple-400">AI Enhanced</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {entry.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-purple-400/20 text-purple-300 bg-purple-500/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => openUnifiedJournal()}
                    variant="outline" 
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Open Your Journal Book
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Sparkles className="w-5 h-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => openUnifiedJournal()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Open Journal Book
              </Button>
              <Button variant="outline" className="w-full border-purple-300 text-purple-600">
                <Brain className="w-4 h-4 mr-2" />
                Get AI Prompt
              </Button>
              <Button variant="outline" className="w-full border-emerald-300 text-emerald-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Progress
              </Button>
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Clock className="w-5 h-5" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openUnifiedJournal(entry)}
                    className="p-4 rounded-lg border border-purple-200/20 bg-slate-800/50 hover:bg-slate-700/50 hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{entry.mood}</div>
                        <div>
                          <h4 className="font-semibold text-white">{entry.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span>{entry.date}</span>
                            <span>•</span>
                            <span>{entry.wordCount} words</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {entry.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-purple-400/20 text-purple-300 bg-purple-500/10">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            {/* Enhanced Analytics Header with Quick Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold">📊 Analytics Dashboard</h2>
                  <p className="text-blue-100 text-lg">Discover patterns in your journaling journey</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
                    📥 Export
                  </Button>
                </div>
              </div>
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/20 rounded-xl p-4 backdrop-blur-lg border border-white/10"
                >
                  <div className="text-3xl font-bold">2,847</div>
                  <div className="text-blue-100 text-sm font-medium">Total Words</div>
                  <div className="text-xs text-green-300 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +15% this month
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/20 rounded-xl p-4 backdrop-blur-lg border border-white/10"
                >
                  <div className="text-3xl font-bold">4.2</div>
                  <div className="text-blue-100 text-sm font-medium">Avg Mood Score</div>
                  <div className="text-xs text-green-300 flex items-center gap-1 mt-1">
                    <Heart className="w-3 h-3" />
                    +0.3 improvement
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/20 rounded-xl p-4 backdrop-blur-lg border border-white/10"
                >
                  <div className="text-3xl font-bold">28</div>
                  <div className="text-blue-100 text-sm font-medium">Current Streak</div>
                  <div className="text-xs text-orange-300 flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3" />
                    Personal Best!
                  </div>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-white/20 rounded-xl p-4 backdrop-blur-lg border border-white/10"
                >
                  <div className="text-3xl font-bold">42</div>
                  <div className="text-blue-100 text-sm font-medium">Entries This Month</div>
                  <div className="text-xs text-green-300 flex items-center gap-1 mt-1">
                    <Plus className="w-3 h-3" />
                    +6 vs last month
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mood Trends - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Heart className="w-5 h-5 text-pink-400" />
                      Mood Journey
                    </CardTitle>
                    <p className="text-gray-300 text-sm">Track your emotional patterns</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={moodData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis domain={[1, 5]} stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #7C3AED', 
                            borderRadius: '12px',
                            color: '#F3F4F6',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                          }} 
                        />
                        <Area
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#8B5CF6" 
                          fill="url(#moodGradient)" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#EC4899' }}
                        />
                        <defs>
                          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="text-sm text-gray-400 mt-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span><strong className="text-pink-400">Insight:</strong> You're happiest on weekends!</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Writing Progress - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white shadow-xl hover:shadow-2xl transition-all border border-purple-100">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <TrendingUp className="w-5 h-5" />
                      Writing Growth
                    </CardTitle>
                    <p className="text-gray-500 text-sm">Your creative output over time</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }} 
                        />
                        <Bar 
                          dataKey="entries" 
                          fill="url(#entryGradient)" 
                          radius={[6, 6, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="entryGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#EC4899" stopOpacity={0.7}/>
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span><strong className="text-purple-600">Achievement:</strong> May was your most productive month!</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white shadow-xl hover:shadow-2xl transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700">
                      <Calendar className="w-5 h-5" />
                      Activity Heatmap
                    </CardTitle>
                    <p className="text-gray-500 text-sm">Your writing consistency pattern</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-4">
                      {Array.from({ length: 28 }, (_, i) => {
                        const intensity = Math.random();
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.2, y: -2 }}
                            className={`w-8 h-8 rounded-lg cursor-pointer transition-all ${
                              intensity > 0.7 ? 'bg-purple-600 shadow-lg' :
                              intensity > 0.4 ? 'bg-purple-400' :
                              intensity > 0.2 ? 'bg-purple-200' : 'bg-gray-100'
                            }`}
                            title={`Day ${i + 1}: ${Math.round(intensity * 5)} entries`}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Less active</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 bg-gray-100 rounded"></div>
                        <div className="w-3 h-3 bg-purple-200 rounded"></div>
                        <div className="w-3 h-3 bg-purple-400 rounded"></div>
                        <div className="w-3 h-3 bg-purple-600 rounded"></div>
                      </div>
                      <span>More active</span>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      View Detailed History
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI-Powered Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl hover:shadow-2xl transition-all border border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <Brain className="w-5 h-5 text-amber-600" />
                      Smart Correlations
                    </CardTitle>
                    <p className="text-amber-700 text-sm">AI-discovered patterns in your data</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-800">Morning entries = Better mood</span>
                        </div>
                        <span className="text-xs text-green-600 font-bold">+0.8 correlation</span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-blue-100 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-blue-800">Photos boost entry length</span>
                        </div>
                        <span className="text-xs text-blue-600 font-bold">+0.6 correlation</span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-purple-100 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium text-purple-800">Weekend creativity spikes</span>
                        </div>
                        <span className="text-xs text-purple-600 font-bold">+0.4 correlation</span>
                      </motion.div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Discover More Patterns
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-6">
            {/* Achievements Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">🏆 Achievements</h2>
                  <p className="text-amber-100 text-lg">Celebrate your journaling milestones</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">3/6</div>
                  <div className="text-amber-100 text-sm">Unlocked</div>
                </div>
              </div>
              
              {/* Achievement Progress Bar */}
              <div className="bg-white/20 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-yellow-300 to-amber-300 h-full rounded-full"
                />
              </div>
              <div className="text-amber-100 text-sm">50% complete - 3 more to unlock!</div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    rotateY: achievement.unlocked ? 5 : 0
                  }}
                  className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all cursor-pointer ${
                    achievement.unlocked
                      ? achievement.rarity === 'legendary'
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 border-2 border-yellow-300 shadow-yellow-400/50'
                        : achievement.rarity === 'epic'
                        ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-2 border-purple-300 shadow-purple-500/50'
                        : achievement.rarity === 'rare'
                        ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 border-2 border-blue-300 shadow-blue-500/50'
                        : 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 border-2 border-green-300 shadow-green-500/50'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {/* Animated sparkle effects for unlocked achievements */}
                  {achievement.unlocked && (
                    <>
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                          animate={{ 
                            x: [-100, 400],
                            rotate: [0, 360]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: index * 0.5
                          }}
                          className="absolute top-1/2 left-0 w-8 h-8 bg-white/30 rounded-full blur-sm"
                        />
                        <motion.div
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                          className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full"
                        />
                      </div>
                      
                      {/* Confetti burst animation */}
                      <AnimatePresence>
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360] }}
                          transition={{ 
                            duration: 1.5, 
                            ease: "easeOut",
                            delay: index * 0.2
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-30"
                        >
                          ✨
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className="text-5xl"
                        animate={achievement.unlocked ? { 
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {achievement.icon}
                      </motion.div>
                      {achievement.unlocked && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                        >
                          <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 ${achievement.unlocked ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-white/90' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-bold px-3 py-1 ${
                          achievement.unlocked 
                            ? 'border-white/40 text-white bg-white/20 shadow-sm' 
                            : 'border-gray-400 text-gray-500 bg-gray-50'
                        }`}
                      >
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                      
                      {achievement.unlocked ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                          <span className="text-white text-sm font-medium">Unlocked!</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm">Locked</span>
                        </div>
                      )}
                    </div>

                    {/* Progress indicator for locked achievements */}
                    {!achievement.unlocked && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Progress</span>
                          <span>2/5 complete</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "40%" }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-gray-400 to-gray-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next Achievement Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border border-indigo-200"
            >
              <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Almost There!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <div className="text-2xl mb-2">🌈</div>
                  <h4 className="font-semibold text-indigo-700">Mood Master</h4>
                  <p className="text-sm text-indigo-600 mb-2">Use all mood types</p>
                  <div className="text-xs text-indigo-500">6/8 moods used - Almost there!</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <div className="text-2xl mb-2">🧘</div>
                  <h4 className="font-semibold text-indigo-700">Reflection Guru</h4>
                  <p className="text-sm text-indigo-600 mb-2">30-day writing streak</p>
                  <div className="text-xs text-indigo-500">28/30 days - 2 more to go!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <div className="space-y-6">
            {/* Goals Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">🎯 Goals & Tracking</h2>
                  <p className="text-emerald-100 text-lg">Stay motivated with personalized challenges</p>
                </div>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </div>
              
              {/* Quick Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">3/3</div>
                  <div className="text-emerald-100 text-sm">Active Goals</div>
                  <div className="text-xs text-green-300">All on track!</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-emerald-100 text-sm">Completed This Month</div>
                  <div className="text-xs text-green-300">Personal best!</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-emerald-100 text-sm">Avg Success Rate</div>
                  <div className="text-xs text-green-300">Excellent!</div>
                </div>
              </div>
            </div>

            {/* Active Goals */}
            <div className="space-y-6">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          goal.type === 'streak' ? 'bg-orange-100' :
                          goal.type === 'words' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {goal.type === 'streak' ? '🔥' : goal.type === 'words' ? '📝' : '🎯'}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                          <p className="text-gray-600 text-sm">{goal.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge 
                        className={`px-3 py-1 text-sm font-bold ${
                          goal.progress >= 90 ? 'bg-green-500 text-white' :
                          goal.progress >= 70 ? 'bg-amber-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}
                      >
                        {goal.current}/{goal.target}
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Progress Visualization */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className={`text-lg font-bold ${
                        goal.progress >= 90 ? 'text-green-600' :
                        goal.progress >= 70 ? 'text-amber-600' :
                        'text-gray-600'
                      }`}>
                        {goal.progress}%
                      </span>
                    </div>
                    
                    {/* Animated Progress Ring */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            goal.progress >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            goal.progress >= 70 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                        />
                      </div>
                      
                      {/* Progress markers */}
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>0</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Goal Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          📊 View Details
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          ✏️ Edit Goal
                        </Button>
                      </div>
                      
                      {goal.progress >= 90 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 1, type: "spring" }}
                          className="flex items-center gap-2 text-green-600"
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">Almost complete!</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Time remaining indicator */}
                    <div className="bg-gray-50 rounded-lg p-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time Remaining</span>
                        <span className="font-medium text-gray-800">
                          {goal.type === 'streak' ? '2 days left this month' :
                           goal.type === 'words' ? '8 days to hit target' :
                           '3 weeks remaining'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {goal.progress >= 80 ? 'Great pace! You\'re ahead of schedule' :
                         goal.progress >= 50 ? 'On track to complete on time' :
                         'Consider increasing your daily effort'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI-Powered Goal Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-6 border border-violet-200"
            >
              <h3 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                AI Goal Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 border border-violet-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">🌅</div>
                    <div>
                      <h4 className="font-semibold text-violet-700">Morning Pages Challenge</h4>
                      <p className="text-sm text-violet-600">Write 3 pages every morning for 30 days</p>
                    </div>
                  </div>
                  <div className="text-xs text-violet-500 bg-violet-50 rounded-lg p-2">
                    💡 <strong>AI Insight:</strong> You write 40% more when starting early in the day
                  </div>
                  <Button className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white" size="sm">
                    Accept Challenge
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 border border-violet-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">📸</div>
                    <div>
                      <h4 className="font-semibold text-violet-700">Photo Memory Week</h4>
                      <p className="text-sm text-violet-600">Add one photo to your entries for 7 days</p>
                    </div>
                  </div>
                  <div className="text-xs text-violet-500 bg-violet-50 rounded-lg p-2">
                    💡 <strong>AI Insight:</strong> Your entries are 60% longer when you include photos
                  </div>
                  <Button className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white" size="sm">
                    Start Challenge
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            {/* AI Insights Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">🤖 AI Insights</h2>
                  <p className="text-indigo-100 text-lg">Your personal AI writing companion & advisor</p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    <Brain className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                    📊 Generate Report
                  </Button>
                </div>
              </div>
              
              {/* AI Status Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">247</div>
                  <div className="text-indigo-100 text-sm">AI Insights Generated</div>
                  <div className="text-xs text-green-300">+12 this week</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-indigo-100 text-sm">Accuracy Rating</div>
                  <div className="text-xs text-green-300">Highly precise</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">31</div>
                  <div className="text-indigo-100 text-sm">Prompts Used</div>
                  <div className="text-xs text-green-300">Creative boost!</div>
                </div>
              </div>
            </div>

            {/* Main Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl hover:shadow-2xl transition-all border border-violet-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-700">
                      <Sparkles className="w-6 h-6" />
                      Weekly AI Summary
                    </CardTitle>
                    <p className="text-violet-600 text-sm">Your personalized weekly insights</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-white rounded-xl border border-violet-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">🎯</div>
                          <div>
                            <h4 className="font-semibold text-violet-800">Focus Theme</h4>
                            <p className="text-sm text-violet-600 mt-1">This week you've been reflecting deeply on personal growth and setting intentions for the future.</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-white rounded-xl border border-violet-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">📈</div>
                          <div>
                            <h4 className="font-semibold text-green-700">Writing Evolution</h4>
                            <p className="text-sm text-green-600 mt-1">Your vocabulary has expanded by 15% and you're using more descriptive language than ever before.</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 bg-white rounded-xl border border-violet-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">💡</div>
                          <div>
                            <h4 className="font-semibold text-amber-700">Key Insight</h4>
                            <p className="text-sm text-amber-600 mt-1">You write most creatively between 7-9 AM, with 40% longer entries during this golden hour.</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interactive Chat with AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl hover:shadow-2xl transition-all border border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Brain className="w-6 h-6" />
                      Chat with Your AI Sidekick
                    </CardTitle>
                    <p className="text-blue-600 text-sm">Ask questions about your journaling patterns</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample conversation */}
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">How has my mood changed this month?</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-start">
                          <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                            <p className="text-sm text-gray-700">Your mood has improved by 25% this month! You've had more happy (😊) days and fewer neutral days. The biggest boost came after you started your morning writing routine.</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">What should I write about today?</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-start">
                          <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                            <p className="text-sm text-gray-700">Based on your patterns, try writing about a recent accomplishment you're proud of. You tend to write longer, more reflective entries when focusing on positive achievements.</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick question buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-blue-200">
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          📊 Monthly summary
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          💭 Writing prompt
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          🎯 Goal suggestions
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          📈 Progress review
                        </Button>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                          <Brain className="w-4 h-4 mr-2" />
                          Start New Conversation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Memory Surfacing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-rose-50 to-pink-50 shadow-xl hover:shadow-2xl transition-all border border-rose-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-700">
                      <Heart className="w-6 h-6" />
                      Memory Lane
                    </CardTitle>
                    <p className="text-rose-600 text-sm">AI-surfaced memories from your past entries</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white rounded-xl border border-rose-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">📷</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-rose-700">On this day last year...</h4>
                            <p className="text-sm text-rose-600 mt-1">"Today I took my first photography class. The way light danced through the trees reminded me why I love capturing moments."</p>
                            <div className="text-xs text-rose-400 mt-2">July 15, 2024 • 3 photos attached</div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white rounded-xl border border-rose-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🎓</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-rose-700">Remember this achievement?</h4>
                            <p className="text-sm text-rose-600 mt-1">"Finally completed my certification! All those late nights studying were worth it. Feeling proud and ready for new challenges."</p>
                            <div className="text-xs text-rose-400 mt-2">March 12, 2025 • Tagged: achievement, growth</div>
                          </div>
                        </div>
                      </motion.div>

                      <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                        <Clock className="w-4 h-4 mr-2" />
                        Explore More Memories
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Personalized Writing Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 shadow-xl hover:shadow-2xl transition-all border border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <Lightbulb className="w-6 h-6" />
                      AI Writing Prompts
                    </CardTitle>
                    <p className="text-amber-600 text-sm">Personalized prompts based on your interests</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {prompts.map((prompt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-4 bg-white rounded-xl border border-amber-200 cursor-pointer hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm group-hover:bg-amber-200 transition-colors">✨</div>
                            <div className="flex-1">
                              <p className="text-amber-800 font-medium group-hover:text-amber-900">{prompt}</p>
                              <div className="text-xs text-amber-500 mt-1">Tap to start writing</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-amber-200">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Generate New Prompts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI-Generated Mood Cloud */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-6 border border-teal-200"
            >
              <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6" />
                Your Personal Word Cloud
              </h3>
              
              <div className="bg-white rounded-xl p-6 border border-teal-200">
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {[
                    { word: "grateful", size: "text-4xl", color: "text-green-500" },
                    { word: "creative", size: "text-2xl", color: "text-purple-500" },
                    { word: "peaceful", size: "text-3xl", color: "text-blue-500" },
                    { word: "growth", size: "text-2xl", color: "text-emerald-500" },
                    { word: "inspired", size: "text-3xl", color: "text-pink-500" },
                    { word: "focused", size: "text-xl", color: "text-indigo-500" },
                    { word: "determined", size: "text-2xl", color: "text-orange-500" },
                    { word: "mindful", size: "text-3xl", color: "text-teal-500" },
                    { word: "hopeful", size: "text-2xl", color: "text-rose-500" },
                    { word: "confident", size: "text-xl", color: "text-violet-500" },
                  ].map((item, index) => (
                    <motion.span
                      key={item.word}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileHover={{ scale: 1.1 }}
                      className={`${item.size} ${item.color} font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      {item.word}
                    </motion.span>
                  ))}
                </div>
                <p className="text-center text-teal-600 text-sm mt-4">
                  These are your most frequent positive words from the past month
                </p>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="h-[80vh]">
            <InteractiveCalendar 
              entries={calendarEntries}
              onDateSelect={handleDateSelect}
              onEntryEdit={handleEntryEdit}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Smart Journal Editor Modal */}
      <AnimatePresence>
        {showSmartEditor && (
          <SmartJournalEditor
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onClose={() => {
              setShowSmartEditor(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Unified Journal Book Experience */}
      <AnimatePresence>
        {showUnifiedJournal && (
          <UnifiedJournal
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onClose={() => {
              setShowUnifiedJournal(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}