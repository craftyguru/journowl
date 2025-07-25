import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Calendar, Clock, Search } from "lucide-react";

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  photos?: Array<string> | Array<{ url: string; timestamp: string }>;
  drawings?: Array<any>;
  tags?: string[];
  date?: string;
  wordCount?: number;
  photoAnalysis?: any;
}

interface Stats {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
  averageMood: number;
  longestStreak: number;
  wordsThisWeek: number;
}

interface AnalyticsTabProps {
  entries: JournalEntry[];
  stats: Stats;
}

export default function AnalyticsTab({ entries, stats }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-purple-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-500/20"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">📊 Insights & Analytics</h2>
            <p className="text-gray-300">Discover patterns in your journaling journey</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2">
              ➕ Add Entry
            </Button>
            <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-800 text-sm px-3 py-2">
              ⬇️ Export
            </Button>
            <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-800 text-sm px-3 py-2">
              📤 Share
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="🔍 Search entries, moods, or keywords..."
              className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-400"
            />
          </div>
          <select className="bg-slate-700/50 border border-purple-400/30 text-white rounded-md px-3 py-2">
            <option>All Moods</option>
            <option>😊 Happy</option>
            <option>😔 Sad</option>
            <option>😤 Angry</option>
            <option>😌 Calm</option>
          </select>
          <select className="bg-slate-700/50 border border-purple-400/30 text-white rounded-md px-3 py-2">
            <option>Month</option>
            <option>Week</option>
            <option>Year</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                📝
              </div>
              <div className="text-xs text-green-400">📈</div>
            </div>
            <div className="text-2xl font-bold text-white">{stats?.totalEntries || 1}</div>
            <div className="text-xs text-gray-400">Total Entries</div>
            <div className="text-xs text-purple-300 mt-1">Keep writing!</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                🔥
              </div>
              <div className="text-xs text-green-400">📈</div>
            </div>
            <div className="text-2xl font-bold text-white">{stats?.currentStreak || 0}</div>
            <div className="text-xs text-gray-400">Day Streak</div>
            <div className="text-xs text-green-300 mt-1">On fire!</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                📊
              </div>
              <div className="text-xs text-green-400">📈</div>
            </div>
            <div className="text-2xl font-bold text-white">{(stats?.totalWords || 0).toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total Words</div>
            <div className="text-xs text-blue-300 mt-1">Impressive!</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                😊
              </div>
              <div className="text-xs text-green-400">📈</div>
            </div>
            <div className="text-2xl font-bold text-white">{stats?.averageMood || 5}/10</div>
            <div className="text-xs text-gray-400">Avg Mood</div>
            <div className="text-xs text-yellow-300 mt-1">Positive!</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Writing Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              📊 Writing Activity
            </h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs bg-purple-500/20 border-purple-400/30 text-purple-200">
                Area
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-purple-400/30 text-purple-200">
                Bar
              </Button>
              <Button size="sm" variant="outline" className="text-xs border-purple-400/30 text-purple-200">
                Line
              </Button>
            </div>
          </div>
          
          <div className="h-48 bg-slate-900/40 rounded-lg border border-purple-400/10 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-sm">Writing activity chart will appear here</p>
              <p className="text-xs mt-1">Based on your journal entries</p>
            </div>
          </div>
        </motion.div>

        {/* Mood Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              🎭 Mood Distribution
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-400">Average Mood</div>
              <div className="flex items-center gap-1">
                <span className="text-lg">😊</span>
                <span className="text-sm text-green-400 bg-green-400/20 px-2 py-1 rounded">100%</span>
              </div>
            </div>
          </div>
          
          <div className="h-40 bg-slate-900/40 rounded-lg border border-purple-400/10 flex items-center justify-center mb-4">
            <div className="text-center text-gray-400">
              <div className="text-2xl mb-2">🍩</div>
              <p className="text-sm">Mood distribution chart</p>
              <p className="text-xs mt-1">Donut chart coming soon</p>
            </div>
          </div>

          <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-400/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-purple-200">AI Insight</span>
            </div>
            <p className="text-sm text-gray-300">"You're happiest on Sundays. Most common mood: Grateful."</p>
          </div>
        </motion.div>
      </div>

      {/* Mood Calendar Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            📅 Mood Calendar Heatmap
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                <Calendar className="w-4 h-4" />
              </Button>
              <span className="text-white font-medium">July 2025</span>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map(day => (
            <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => (
            <motion.div
              key={i + 1}
              whileHover={{ scale: 1.1 }}
              className={`aspect-square rounded-lg border border-purple-400/20 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                i + 1 === 16 
                  ? 'bg-green-500/80 text-white border-green-400' 
                  : 'bg-slate-700/40 text-gray-400 hover:bg-purple-500/20 hover:text-white'
              }`}
            >
              {i + 1}
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-400/20">
          <div className="text-sm text-gray-400">
            Less activity
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(level => (
              <div 
                key={level}
                className={`w-3 h-3 rounded-sm ${
                  level === 1 ? 'bg-slate-700' :
                  level === 2 ? 'bg-green-800/60' :
                  level === 3 ? 'bg-green-600/70' :
                  level === 4 ? 'bg-green-500/80' :
                  'bg-green-400'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-400">
            More activity
          </div>
        </div>
      </motion.div>
    </div>
  );
}