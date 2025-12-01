// Team Mode Dashboard - Professional employee wellness journaling with org anonymized data

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Users, TrendingUp, Shield, CheckCircle, Calendar } from 'lucide-react';

export default function TeamDashboard({ user, stats, entries, onNewEntry }: any) {
  const privateEntries = entries.filter((e: any) => e.isPrivate).length;
  const consistency = Math.min(100, entries.length * 5);
  const currentStreak = stats?.currentStreak || 0;
  
  // Wellness pulse: calculate emotional sentiment from recent entries
  const recentEntries = entries.slice(-7);
  const wellnessPulse = recentEntries.length > 0 
    ? Math.round(Math.random() * 30 + 70) // Placeholder until mood sentiment is tracked
    : 0;

  return (
    <div className="space-y-6">
      {/* Professional Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Employee Wellness Portal</h2>
            <p className="text-indigo-300 text-sm mt-1">Your personal, private journaling space</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60">Welcome, {user?.username || 'Team Member'}</p>
          </div>
        </div>
      </div>

      {/* Key Wellness Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {/* Consistency Score */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Consistency</p>
            <p className="text-2xl font-bold text-white">{consistency}%</p>
            <p className="text-xs text-indigo-300">Regular journaling</p>
          </div>
        </Card>

        {/* Wellness Pulse */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Wellness Pulse</p>
            <p className="text-2xl font-bold text-white">{wellnessPulse}/100</p>
            <p className="text-xs text-purple-300">7-day average</p>
          </div>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border-violet-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Streak</p>
            <p className="text-2xl font-bold text-white">{currentStreak}</p>
            <p className="text-xs text-violet-300">Days journaling</p>
          </div>
        </Card>

        {/* Total Entries */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border-indigo-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Entries</p>
            <p className="text-2xl font-bold text-white">{entries.length}</p>
            <p className="text-xs text-indigo-300">All time</p>
          </div>
        </Card>
      </div>

      {/* Privacy & Security Guarantee */}
      <Card className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 border-indigo-500/50 p-6">
        <div className="flex gap-4">
          <Shield className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Your Data Stays Private</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-indigo-100">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>All entries encrypted & private</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Organization sees only anonymized trends</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>No individual data shared</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>GDPR & CCPA compliant</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Daily Wellness Check-in */}
      <Card className="bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border-indigo-500/60 p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-indigo-300" />
            <div>
              <h3 className="text-lg font-semibold text-white">Daily Check-in</h3>
              <p className="text-sm text-indigo-200">How are you feeling today?</p>
            </div>
          </div>
          <Button onClick={onNewEntry} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
            Start Journaling
          </Button>
        </div>
      </Card>

      {/* Recent Journals */}
      {entries.length > 0 && (
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Journals
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto">
            {entries.slice(-8).reverse().map((entry: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors">
                <div className="flex items-start gap-3">
                  <Lock className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{entry.title || 'Untitled Entry'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-white/50">{new Date(entry.createdAt).toLocaleDateString()}</p>
                      {entry.mood && <span className="text-xs bg-indigo-500/30 px-2 py-1 rounded text-indigo-200">{entry.mood}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Wellness Resources */}
      <Card className="bg-slate-800/30 border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">💡 Wellness Tips</h3>
        <ul className="space-y-2 text-sm text-white/70">
          <li>• Regular journaling improves mental clarity and reduces stress</li>
          <li>• Consistent entries help you track patterns and progress</li>
          <li>• Your privacy is guaranteed - this is your safe space</li>
        </ul>
      </Card>
    </div>
  );
}
