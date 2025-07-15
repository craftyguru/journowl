import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, BookOpen, TrendingUp, Activity, Star, Target, Clock, Award, Brain, Heart } from "lucide-react";
import { motion } from "framer-motion";

const analyticsData = [
  { name: 'Jan', users: 120, entries: 890, activeUsers: 85 },
  { name: 'Feb', users: 150, entries: 1200, activeUsers: 112 },
  { name: 'Mar', users: 180, entries: 1580, activeUsers: 145 },
  { name: 'Apr', users: 220, entries: 1920, activeUsers: 178 },
  { name: 'May', users: 280, entries: 2350, activeUsers: 225 },
  { name: 'Jun', users: 340, entries: 2880, activeUsers: 285 },
];

const userGrowthData = [
  { name: 'Week 1', users: 45, growth: 12 },
  { name: 'Week 2', users: 58, growth: 15 },
  { name: 'Week 3', users: 72, growth: 18 },
  { name: 'Week 4', users: 89, growth: 22 },
];

const moodDistribution = [
  { mood: '😊 Happy', value: 35, color: '#10B981' },
  { mood: '😐 Neutral', value: 25, color: '#6B7280' },
  { mood: '🤔 Thoughtful', value: 20, color: '#8B5CF6' },
  { mood: '😔 Sad', value: 12, color: '#EF4444' },
  { mood: '😄 Excited', value: 8, color: '#F59E0B' },
];

const topUsers = [
  { id: 1, name: 'Emma Johnson', entries: 45, streak: 28, level: 12, avatar: '👩‍💼' },
  { id: 2, name: 'Alex Chen', entries: 38, streak: 22, level: 10, avatar: '👨‍💻' },
  { id: 3, name: 'Sofia Rodriguez', entries: 35, streak: 20, level: 9, avatar: '👩‍🎨' },
  { id: 4, name: 'Little Timmy', entries: 28, streak: 15, level: 7, avatar: '🧒' },
  { id: 5, name: 'Dr. Sarah Wilson', entries: 25, streak: 18, level: 8, avatar: '👩‍⚕️' },
];

const recentActivity = [
  { user: 'Emma Johnson', action: 'Completed 30-day streak', time: '2 min ago', type: 'achievement' },
  { user: 'Alex Chen', action: 'Wrote 500-word entry', time: '5 min ago', type: 'entry' },
  { user: 'Sofia Rodriguez', action: 'Unlocked "Mindful Writer" badge', time: '12 min ago', type: 'achievement' },
  { user: 'Little Timmy', action: 'Completed kid-friendly prompt', time: '18 min ago', type: 'entry' },
  { user: 'Dr. Sarah Wilson', action: 'Reached Level 8', time: '25 min ago', type: 'level' },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-300 mt-2">Monitor and manage your MoodJournal community</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            <Users className="w-4 h-4 mr-2" />
            Manage Users
          </Button>
          <Button variant="outline" className="border-purple-500/50 text-purple-300">
            <BookOpen className="w-4 h-4 mr-2" />
            View Prompts
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">2,847</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-white">18,425</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +28% this month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl">
                <BookOpen className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-white">1,924</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <Activity className="w-3 h-3 mr-1" />
                  +8% this week
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Words/Entry</p>
                <p className="text-3xl font-bold text-white">287</p>
                <p className="text-green-400 text-sm flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% this month
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl">
                <Brain className="w-6 h-6 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 backdrop-blur-sm border border-white/10">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
            Top Users
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
            Live Activity
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500">
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                User Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#8B5CF6" 
                    fill="url(#userGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                Mood Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                      border: '1px solid rgba(139, 92, 246, 0.5)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{user.avatar}</div>
                      <div>
                        <h3 className="text-white font-semibold">{user.name}</h3>
                        <p className="text-gray-400 text-sm">{user.entries} entries • Level {user.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
                        {user.streak} day streak
                      </Badge>
                      <Button size="sm" variant="outline" className="border-purple-500/50 text-purple-300">
                        View Profile
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-white/5 backdrop-blur-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Live Activity Feed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'achievement' ? 'bg-amber-400' :
                      activity.type === 'entry' ? 'bg-purple-400' : 'bg-emerald-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className={`
                      ${activity.type === 'achievement' ? 'border-amber-500/50 text-amber-400' :
                        activity.type === 'entry' ? 'border-purple-500/50 text-purple-400' :
                        'border-emerald-500/50 text-emerald-400'}
                    `}>
                      {activity.type}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  AI-Generated Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <h4 className="text-purple-400 font-semibold mb-2">Weekly Trend</h4>
                  <p className="text-gray-300 text-sm">
                    Users are 35% more likely to journal in the evening hours, with peak activity between 7-9 PM.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <h4 className="text-emerald-400 font-semibold mb-2">Engagement Boost</h4>
                  <p className="text-gray-300 text-sm">
                    Gratitude prompts show 40% higher completion rates compared to other categories.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <h4 className="text-amber-400 font-semibold mb-2">User Retention</h4>
                  <p className="text-gray-300 text-sm">
                    Users who complete their first week have a 78% chance of reaching a 30-day streak.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-pink-400" />
                  Platform Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Monthly Active Users</span>
                    <span className="text-white">1,924 / 2,000</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '96.2%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">User Satisfaction</span>
                    <span className="text-white">4.8 / 5.0</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Feature Adoption</span>
                    <span className="text-white">85%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}