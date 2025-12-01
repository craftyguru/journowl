// Wellness Mode Dashboard - Mood focus, reflection, self-discovery

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, TrendingUp, Flame } from 'lucide-react';

export default function WellnessDashboard({ user, stats, entries, onNewEntry }: any) {
  const moodTrend = entries.slice(-7).map(e => e.mood).reverse();
  const streak = stats?.currentStreak || 0;
  const wellnessScore = Math.min(100, stats?.totalEntries ? (stats.totalEntries * 10) : 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Welcome back, {user?.username}</h2>
        <p className="text-pink-300">Let's nurture your wellbeing today</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Wellness Score */}
        <Card className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border-pink-500/30 p-4">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <p className="text-sm text-white/60">Wellness Score</p>
              <p className="text-2xl font-bold text-white">{wellnessScore}</p>
            </div>
          </div>
        </Card>

        {/* Mood Streak */}
        <Card className="bg-gradient-to-br from-orange-900/40 to-pink-900/40 border-orange-500/30 p-4">
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-sm text-white/60">Writing Streak</p>
              <p className="text-2xl font-bold text-white">{streak} days</p>
            </div>
          </div>
        </Card>

        {/* Recent Trend */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-white/60">Total Entries</p>
              <p className="text-2xl font-bold text-white">{stats?.totalEntries || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Reflection Prompt */}
      <Card className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-pink-500/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Today's Reflection</h3>
        <p className="text-pink-100 mb-4">What brought you the most joy today?</p>
        <Button onClick={onNewEntry} className="w-full bg-pink-600 hover:bg-pink-700">
          Journal Now
        </Button>
      </Card>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Reflections</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {entries.slice(-5).reverse().map((entry: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-900/50 rounded-lg">
                <p className="text-sm text-white/80 truncate">{entry.title}</p>
                <p className="text-xs text-white/40">{new Date(entry.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
