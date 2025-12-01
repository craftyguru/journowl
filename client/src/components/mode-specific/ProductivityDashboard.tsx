// Productivity Mode Dashboard - Performance metrics, sprints, velocity

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Target } from 'lucide-react';

export default function ProductivityDashboard({ user, stats, entries, onNewEntry }: any) {
  const totalWords = entries.reduce((sum: number, e: any) => sum + (e.wordCount || 0), 0);
  const avgWordsPerEntry = entries.length > 0 ? Math.round(totalWords / entries.length) : 0;
  const today = new Date().toDateString();
  const todayEntries = entries.filter((e: any) => new Date(e.createdAt).toDateString() === today);
  const todayWords = todayEntries.reduce((sum: number, e: any) => sum + (e.wordCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Creator Dashboard</h2>
        <p className="text-cyan-300">Track your output and momentum</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Today's Words */}
        <Card className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border-cyan-500/30 p-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-500" />
            <div>
              <p className="text-sm text-white/60">Today's Words</p>
              <p className="text-2xl font-bold text-white">{todayWords}</p>
            </div>
          </div>
        </Card>

        {/* Avg per Entry */}
        <Card className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-white/60">Avg/Entry</p>
              <p className="text-2xl font-bold text-white">{avgWordsPerEntry}</p>
            </div>
          </div>
        </Card>

        {/* Total Written */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 p-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-indigo-500" />
            <div>
              <p className="text-sm text-white/60">Total Written</p>
              <p className="text-2xl font-bold text-white">{totalWords.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sprint Launcher */}
      <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Start a Writing Sprint</h3>
        <p className="text-cyan-100 mb-4">Focus your energy and track your output</p>
        <Button onClick={onNewEntry} className="w-full bg-cyan-600 hover:bg-cyan-700">
          New Sprint Entry
        </Button>
      </Card>

      {/* Velocity Chart */}
      {entries.length > 0 && (
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Writing Velocity (Last 7 Days)</h3>
          <div className="space-y-2 max-h-48">
            {entries.slice(-7).reverse().map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-white/40 w-12">{new Date(entry.createdAt).toLocaleDateString()}</span>
                <div className="flex-1 bg-slate-900 rounded-full h-8 flex items-center px-3">
                  <div className="text-xs text-cyan-400 font-semibold">{entry.wordCount || 0} words</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
