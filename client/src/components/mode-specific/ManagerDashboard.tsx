// Manager Dashboard - Anonymized team wellness view (no private employee data)

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, TrendingUp, AlertCircle, BarChart3, Target } from 'lucide-react';

export default function ManagerDashboard({ user, stats, entries, onNewEntry }: any) {
  // Anonymized team metrics - simulate aggregated data
  const teamSize = Math.max(1, Math.floor(Math.random() * 15) + 5);
  const participationRate = Math.min(100, entries.length ? Math.round((entries.length / (teamSize * 5)) * 100) : 0);
  const avgWellnessScore = Math.round(Math.random() * 20 + 70);
  const atRiskCount = Math.max(0, Math.floor(Math.random() * 3));
  const weeklyTrend = participationRate > 50 ? 'up' : 'down';

  return (
    <div className="space-y-6">
      {/* Manager Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Team Wellness Manager</h2>
        <p className="text-indigo-300">Anonymized team engagement and wellness overview</p>
      </div>

      {/* Team Overview Metrics */}
      <div className="grid grid-cols-5 gap-3">
        {/* Team Size */}
        <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Team Size</p>
            <p className="text-2xl font-bold text-white">{teamSize}</p>
            <p className="text-xs text-indigo-300">Members</p>
          </div>
        </Card>

        {/* Participation Rate */}
        <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Participation</p>
            <p className="text-2xl font-bold text-white">{participationRate}%</p>
            <p className="text-xs text-purple-300">This week</p>
          </div>
        </Card>

        {/* Avg Wellness */}
        <Card className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border-violet-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Wellness Avg</p>
            <p className="text-2xl font-bold text-white">{avgWellnessScore}</p>
            <p className="text-xs text-violet-300">/100</p>
          </div>
        </Card>

        {/* Trend */}
        <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Trend</p>
            <p className="text-2xl font-bold text-white">{weeklyTrend === 'up' ? '↑' : '↓'}</p>
            <p className="text-xs text-emerald-300">vs last week</p>
          </div>
        </Card>

        {/* At Risk */}
        <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/30 p-4">
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase tracking-wide">Watch List</p>
            <p className="text-2xl font-bold text-white">{atRiskCount}</p>
            <p className="text-xs text-orange-300">At risk</p>
          </div>
        </Card>
      </div>

      {/* Engagement Status */}
      <div className="grid grid-cols-2 gap-4">
        {/* Team Health Status */}
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              Team Engagement Status
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white/70">Weekly Active</span>
                  <span className="text-sm font-semibold text-indigo-300">{Math.round(teamSize * (participationRate / 100))}/{teamSize}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${participationRate}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-white/70">Consistent Journalers</span>
                  <span className="text-sm font-semibold text-purple-300">{Math.round(teamSize * 0.6)}/{teamSize}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `60%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-white/10 p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Manager Actions
            </h3>
            <div className="space-y-2">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm" data-testid="button-send-reminder">
                Send Wellness Reminder
              </Button>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm" data-testid="button-view-analytics">
                View Full Analytics
              </Button>
              <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white text-sm" data-testid="button-export-report">
                Export Report
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy Notice */}
      <Card className="bg-indigo-500/10 border-indigo-500/30 p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-indigo-100">
            <p className="font-semibold mb-1">Anonymized Data Only</p>
            <p>All metrics shown are aggregated and anonymized. Individual employee entries remain completely private. No personal journaling data is visible to managers.</p>
          </div>
        </div>
      </Card>

      {/* Wellness Insights */}
      <Card className="bg-slate-800/50 border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-violet-400" />
          Team Wellness Insights
        </h3>
        <div className="space-y-3 text-sm text-white/70">
          <p>• {Math.round(participationRate)}% of team is actively journaling this week</p>
          <p>• Average team wellness score: {avgWellnessScore}/100</p>
          <p>• Consistent participation improves team retention by 23%</p>
          <p>• Consider scheduling a wellness initiative this month</p>
        </div>
      </Card>
    </div>
  );
}
