import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb, Type, Brush, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import InteractiveJournal from "./interactive-journal";
import SmartJournalEditor from "./smart-journal-editor";

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
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const handleSaveEntry = (entryData: any) => {
    console.log('Saving entry:', entryData);
    // Here you would typically save to backend
    setShowSmartEditor(false);
    setSelectedEntry(null);
  };

  const openSmartEditor = (entry?: any) => {
    setSelectedEntry(entry);
    setShowSmartEditor(true);
  };

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
        <TabsList className="grid w-full grid-cols-5 bg-slate-800/90 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
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
                  onClick={() => openSmartEditor()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 text-lg"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Create Smart Entry
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
                      onClick={() => openSmartEditor(entry)}
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
                    onClick={() => openSmartEditor()}
                    variant="outline" 
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Smart Entry
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
                onClick={() => openSmartEditor()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Write New Entry
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
                    onClick={() => openSmartEditor(entry)}
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

        <TabsContent value="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Heart className="w-5 h-5 text-pink-400" />
                  Mood Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis domain={[1, 5]} stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #7C3AED', 
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }} 
                    />
                    <Area
                      type="monotone" 
                      dataKey="mood" 
                      stroke="#8B5CF6" 
                      fill="url(#moodGradient)" 
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <TrendingUp className="w-5 h-5" />
                Writing Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="entries" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Trophy className="w-5 h-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      achievement.unlocked
                        ? `border-${achievement.rarity === 'legendary' ? 'amber' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-300 bg-gradient-to-br from-${achievement.rarity === 'legendary' ? 'amber' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-50 to-${achievement.rarity === 'legendary' ? 'amber' : achievement.rarity === 'epic' ? 'purple' : achievement.rarity === 'rare' ? 'blue' : 'gray'}-100 shadow-md hover:shadow-lg`
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-1">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                      <Badge 
                        className={`text-xs ${
                          achievement.rarity === 'legendary' ? 'bg-amber-500 text-white' :
                          achievement.rarity === 'epic' ? 'bg-purple-500 text-white' :
                          achievement.rarity === 'rare' ? 'bg-blue-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Target className="w-5 h-5" />
                Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-white"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                      <Badge className="bg-purple-100 text-purple-700">
                        {goal.current}/{goal.target}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-purple-600 font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="bg-gray-200" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Brain className="w-5 h-5" />
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200"
                    >
                      <p className="text-purple-800">{insight}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Lightbulb className="w-5 h-5" />
                  Personalized Prompts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prompts.map((prompt, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-gray-50 to-white"
                    >
                      <p className="text-gray-700">{prompt}</p>
                    </motion.div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Generate New Prompts
                </Button>
              </CardContent>
            </Card>
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
    </div>
  );
}