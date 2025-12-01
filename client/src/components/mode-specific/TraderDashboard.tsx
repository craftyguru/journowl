// Trader Mode Dashboard - Bias tracking, pattern recognition, decision logs

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, TrendingUp, Brain } from 'lucide-react';

export default function TraderDashboard({ user, stats, entries, onNewEntry }: any) {
  const biasCount = entries.filter((e: any) => e.content?.toLowerCase().includes('bias')).length;
  const decisionLogs = entries.filter((e: any) => e.content?.toLowerCase().includes('trade')).length;
  const patterns = entries.filter((e: any) => e.content?.toLowerCase().includes('pattern')).length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Trading Psychology Dashboard</h2>
        <p className="text-amber-300">Track your emotional discipline and patterns</p>
      </div>

      {/* Analysis Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Bias Tracking */}
        <Card className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border-amber-500/30 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <div>
              <p className="text-sm text-white/60">Biases Logged</p>
              <p className="text-2xl font-bold text-white">{biasCount}</p>
            </div>
          </div>
        </Card>

        {/* Decision Logs */}
        <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/30 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-sm text-white/60">Trade Entries</p>
              <p className="text-2xl font-bold text-white">{decisionLogs}</p>
            </div>
          </div>
        </Card>

        {/* Patterns Found */}
        <Card className="bg-gradient-to-br from-red-900/40 to-pink-900/40 border-red-500/30 p-4">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-red-500" />
            <div>
              <p className="text-sm text-white/60">Patterns Found</p>
              <p className="text-2xl font-bold text-white">{patterns}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Log Decision */}
      <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Log Trade Decision</h3>
        <p className="text-amber-100 mb-4">Document your reasoning and emotional state before trading</p>
        <Button onClick={onNewEntry} className="w-full bg-amber-600 hover:bg-amber-700">
          Log Decision
        </Button>
      </Card>

      {/* Recent Decisions */}
      {entries.length > 0 && (
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Decision Log</h3>
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
