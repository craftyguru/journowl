// Therapy Mode Dashboard - Shared journals, session tracking, supervised reflection

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Calendar, Lightbulb } from 'lucide-react';

export default function TherapyDashboard({ user, stats, entries, onNewEntry }: any) {
  const sharedEntries = entries.filter((e: any) => e.isPrivate === false).length;
  const reflectionScore = Math.min(100, entries.length * 20);
  const lastEntryDate = entries.length > 0 ? new Date(entries[0].createdAt) : null;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Therapeutic Journal</h2>
        <p className="text-sky-300">A safe space for deep reflection and healing</p>
      </div>

      {/* Progress Metrics */}
      <div className="grid grid-cols-3 gap-4">
        {/* Shared Entries */}
        <Card className="bg-gradient-to-br from-sky-900/40 to-blue-900/40 border-sky-500/30 p-4">
          <div className="flex items-center gap-3">
            <Share2 className="w-6 h-6 text-sky-500" />
            <div>
              <p className="text-sm text-white/60">Shared Entries</p>
              <p className="text-2xl font-bold text-white">{sharedEntries}</p>
            </div>
          </div>
        </Card>

        {/* Last Session */}
        <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-500/30 p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-sm text-white/60">Last Entry</p>
              <p className="text-2xl font-bold text-white">{lastEntryDate ? lastEntryDate.toLocaleDateString().split('/')[1] : '-'}</p>
            </div>
          </div>
        </Card>

        {/* Reflection Score */}
        <Card className="bg-gradient-to-br from-cyan-900/40 to-teal-900/40 border-cyan-500/30 p-4">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-cyan-500" />
            <div>
              <p className="text-sm text-white/60">Reflection Depth</p>
              <p className="text-2xl font-bold text-white">{reflectionScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Session Prep */}
      <Card className="bg-gradient-to-br from-sky-500/20 to-blue-500/20 border-sky-500/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Prepare for Next Session</h3>
        <p className="text-sky-100 mb-4">Document your thoughts and feelings for deeper therapeutic work</p>
        <Button onClick={onNewEntry} className="w-full bg-sky-600 hover:bg-sky-700">
          New Reflection
        </Button>
      </Card>

      {/* Therapeutic Insights */}
      <Card className="bg-gradient-to-br from-sky-500/20 to-cyan-500/20 border-sky-500/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Session Insights</h3>
        <div className="space-y-3 text-sky-100 text-sm">
          <p>• Your reflections show increasing self-awareness</p>
          <p>• Key themes emerging: patterns worth exploring in session</p>
          <p>• Consider bringing recent insights to your next appointment</p>
        </div>
      </Card>

      {/* Recent Reflections */}
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
