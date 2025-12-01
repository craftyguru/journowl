// Team Mode Dashboard - Private journaling, org insights, anonymized data

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Users, TrendingUp } from 'lucide-react';

export default function TeamDashboard({ user, stats, entries, onNewEntry }: any) {
  const privateEntries = entries.filter((e: any) => e.isPrivate).length;
  const teamEngagement = Math.min(100, stats?.totalEntries ? (stats.totalEntries * 15) : 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Team Wellness Dashboard</h2>
        <p className="text-indigo-300">Your private journaling space. Organization sees only anonymized insights.</p>
      </div>

      {/* Privacy Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Private Entries */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 p-4">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-indigo-500" />
            <div>
              <p className="text-sm text-white/60">Private Entries</p>
              <p className="text-2xl font-bold text-white">{privateEntries}</p>
            </div>
          </div>
        </Card>

        {/* Team Engagement */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 border-purple-500/30 p-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-500" />
            <div>
              <p className="text-sm text-white/60">Team Engagement</p>
              <p className="text-2xl font-bold text-white">{teamEngagement}%</p>
            </div>
          </div>
        </Card>

        {/* Wellness Index */}
        <Card className="bg-gradient-to-br from-violet-900/40 to-indigo-900/40 border-violet-500/30 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-violet-500" />
            <div>
              <p className="text-sm text-white/60">Wellness Score</p>
              <p className="text-2xl font-bold text-white">{Math.min(100, stats?.totalEntries || 0) * 10}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy Assurance */}
      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 p-6">
        <div className="flex gap-4">
          <Lock className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Your Privacy Is Protected</h3>
            <p className="text-indigo-100 text-sm">All your journal entries remain completely private. The organization sees only anonymized wellness trends, never your personal content.</p>
          </div>
        </div>
      </Card>

      {/* New Entry */}
      <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Reflect Today</h3>
        <p className="text-indigo-100 mb-4">How's your wellbeing as a member of the team?</p>
        <Button onClick={onNewEntry} className="w-full bg-indigo-600 hover:bg-indigo-700">
          Journal Now
        </Button>
      </Card>

      {/* Recent Entries */}
      {entries.length > 0 && (
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Entries</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {entries.slice(-5).reverse().map((entry: any, idx: number) => (
              <div key={idx} className="p-3 bg-slate-900/50 rounded-lg flex items-center gap-2">
                {entry.isPrivate && <Lock className="w-4 h-4 text-indigo-400" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 truncate">{entry.title}</p>
                  <p className="text-xs text-white/40">{new Date(entry.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
