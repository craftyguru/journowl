// HR Admin Console - Organization policies, compliance, analytics

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, BarChart3, Users, Lock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function HRAdminConsole({ user, stats, entries, onNewEntry }: any) {
  const [activeTab, setActiveTab] = useState<'overview' | 'policies' | 'compliance' | 'analytics'>('overview');

  const totalEmployees = Math.floor(Math.random() * 100) + 20;
  const activeUsers = Math.floor(totalEmployees * 0.65);
  const complianceScore = 95;
  const dataExportsThisMonth = 3;

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">HR Administration Console</h2>
        <p className="text-indigo-300">Organization settings, compliance, and analytics</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10">
        {(['overview', 'policies', 'compliance', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-white/60 hover:text-white'
            }`}
            data-testid={`tab-${tab}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-3">
            <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-500/30 p-4">
              <div className="space-y-2">
                <p className="text-xs text-white/60 uppercase">Total Employees</p>
                <p className="text-2xl font-bold text-white">{totalEmployees}</p>
                <p className="text-xs text-indigo-300">Organization</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30 p-4">
              <div className="space-y-2">
                <p className="text-xs text-white/60 uppercase">Active Users</p>
                <p className="text-2xl font-bold text-white">{activeUsers}</p>
                <p className="text-xs text-purple-300">{Math.round((activeUsers/totalEmployees)*100)}% engaged</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-violet-900/40 to-purple-900/40 border-violet-500/30 p-4">
              <div className="space-y-2">
                <p className="text-xs text-white/60 uppercase">Compliance</p>
                <p className="text-2xl font-bold text-white">{complianceScore}%</p>
                <p className="text-xs text-violet-300">GDPR/CCPA</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-500/30 p-4">
              <div className="space-y-2">
                <p className="text-xs text-white/60 uppercase">Data Exports</p>
                <p className="text-2xl font-bold text-white">{dataExportsThisMonth}</p>
                <p className="text-xs text-emerald-300">This month</p>
              </div>
            </Card>
          </div>

          <Card className="bg-slate-800/50 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Organization Health</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Employee Participation</span>
                  <span className="text-indigo-300 font-semibold">65%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-indigo-500 h-3 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Retention Index</span>
                  <span className="text-purple-300 font-semibold">78%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-purple-500 h-3 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Data Privacy Score</span>
                  <span className="text-emerald-300 font-semibold">95%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-emerald-500 h-3 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* POLICIES TAB */}
      {activeTab === 'policies' && (
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Organization Policies
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-semibold">AI Features</p>
                  <p className="text-sm text-white/60">Enable/disable AI coaching for your organization</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-semibold">PII Redaction</p>
                  <p className="text-sm text-white/60">Automatically redact personal identifiable information</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Manager Analytics</p>
                  <p className="text-sm text-white/60">Allow managers to see anonymized team insights</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-white font-semibold">Slack Notifications</p>
                  <p className="text-sm text-white/60">Send weekly wellness summaries to HR</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                </label>
              </div>
            </div>
            <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700" data-testid="button-save-policies">
              Save Policies
            </Button>
          </Card>
        </div>
      )}

      {/* COMPLIANCE TAB */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Compliance & Audit
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex gap-3">
                  <div className="text-emerald-400 font-semibold">✓</div>
                  <div>
                    <p className="text-white font-semibold">GDPR Compliant</p>
                    <p className="text-sm text-white/60">Right to deletion & data export enabled</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex gap-3">
                  <div className="text-emerald-400 font-semibold">✓</div>
                  <div>
                    <p className="text-white font-semibold">CCPA Compliant</p>
                    <p className="text-sm text-white/60">Personal data export & deletion available</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex gap-3">
                  <div className="text-emerald-400 font-semibold">✓</div>
                  <div>
                    <p className="text-white font-semibold">Audit Logging Active</p>
                    <p className="text-sm text-white/60">All actions logged for compliance verification</p>
                  </div>
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700 mt-4" data-testid="button-view-audit-logs">
                View Audit Logs
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Organization Analytics
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white font-semibold mb-2">Participation Trend (30 days)</p>
                <div className="h-24 bg-slate-900/50 rounded-lg p-4 flex items-end gap-1">
                  {[45, 52, 58, 62, 65, 68, 70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 80, 81, 81, 82].map((val, i) => (
                    <div key={i} className="flex-1 bg-indigo-500 rounded-t" style={{ height: `${(val/100)*100}%` }}></div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-white/60 text-sm">Avg Session Duration</p>
                  <p className="text-2xl font-bold text-white mt-1">8.5 min</p>
                </div>
                <div className="p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-white/60 text-sm">Entries Per User</p>
                  <p className="text-2xl font-bold text-white mt-1">12.3</p>
                </div>
              </div>

              <Button className="w-full bg-violet-600 hover:bg-violet-700 mt-4" data-testid="button-export-analytics">
                Export Full Report
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
