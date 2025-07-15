import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 min-h-screen">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Welcome back, Emma! ✨
        </h1>
        <p className="text-gray-600 text-lg">Ready to continue your journaling journey?</p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1">
            Level 12 • Mindful Writer
          </Badge>
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            28-day streak 🔥
          </Badge>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Entries</p>
                <p className="text-2xl font-bold">142</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm">Words Written</p>
                <p className="text-2xl font-bold">28,750</p>
              </div>
              <Zap className="w-8 h-8 text-pink-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm">Current Streak</p>
                <p className="text-2xl font-bold">28 days</p>
              </div>
              <Target className="w-8 h-8 text-emerald-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm">XP Points</p>
                <p className="text-2xl font-bold">11,450</p>
              </div>
              <Star className="w-8 h-8 text-amber-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            Achievements
          </TabsTrigger>
          <TabsTrigger value="goals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            Goals
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
            AI Insights
          </TabsTrigger>
        </TabsList>

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
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
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
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{entry.mood}</div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{entry.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{entry.date}</span>
                            <span>•</span>
                            <span>{entry.wordCount} words</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {entry.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
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
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Heart className="w-5 h-5" />
                Mood Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
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
    </div>
  );
}