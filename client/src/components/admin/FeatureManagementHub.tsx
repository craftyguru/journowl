import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Gift,
  Users,
  Mail,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  Settings,
  Eye,
  Toggle2,
  AlertCircle
} from "lucide-react";

interface FeatureStats {
  name: string;
  icon: React.ReactNode;
  active: boolean;
  users: number;
  description: string;
  stats: { label: string; value: string | number }[];
}

export function FeatureManagementHub() {
  const [activeTab, setActiveTab] = useState("overview");

  const features: FeatureStats[] = [
    {
      name: "Daily Challenges",
      icon: <Target className="w-5 h-5" />,
      active: true,
      users: 347,
      description: "8 micro-challenges for daily engagement",
      stats: [
        { label: "Completion Rate", value: "64%" },
        { label: "Avg Points/Day", value: "42" },
        { label: "Active Participants", value: "347" }
      ]
    },
    {
      name: "Tournaments",
      icon: <Trophy className="w-5 h-5" />,
      active: true,
      users: 512,
      description: "Weekly, monthly, and seasonal competitions",
      stats: [
        { label: "Active Tournaments", value: "3" },
        { label: "Total Participants", value: "512" },
        { label: "Prize Pool/Month", value: "$500" }
      ]
    },
    {
      name: "Achievement Badges",
      icon: <CheckCircle2 className="w-5 h-5" />,
      active: true,
      users: 892,
      description: "11 badges across 5 categories with 8-level progression",
      stats: [
        { label: "Unlocked Badges", value: "1,247" },
        { label: "Users with Badges", value: "892" },
        { label: "Most Unlocked", value: "First Entry" }
      ]
    },
    {
      name: "Email Reminders",
      icon: <Mail className="w-5 h-5" />,
      active: true,
      users: 756,
      description: "SendGrid integration for streak & milestone emails",
      stats: [
        { label: "Emails Sent", value: "1,892" },
        { label: "Open Rate", value: "38%" },
        { label: "Click Rate", value: "12%" }
      ]
    },
    {
      name: "Referral System",
      icon: <Gift className="w-5 h-5" />,
      active: true,
      users: 634,
      description: "Viral growth with unique codes and tier rewards",
      stats: [
        { label: "Total Referrals", value: "1,456" },
        { label: "Successful Redeems", value: "234" },
        { label: "Bonus Prompts Distributed", value: "11,700" }
      ]
    },
    {
      name: "Global Leaderboards",
      icon: <BarChart3 className="w-5 h-5" />,
      active: true,
      users: 1203,
      description: "4 leaderboard types: Weekly, All-Time, Streaks, Words",
      stats: [
        { label: "Active Competitors", value: "1,203" },
        { label: "Weekly Updates", value: "52" },
        { label: "Top Score", value: "2,847 pts" }
      ]
    },
    {
      name: "Streak Notifications",
      icon: <Flame className="w-5 h-5" />,
      active: true,
      users: 1891,
      description: "Real-time streak tracking and milestone alerts",
      stats: [
        { label: "Active Streaks", value: "1,891" },
        { label: "100+ Day Streaks", value: "47" },
        { label: "Milestones Hit", value: "893" }
      ]
    },
    {
      name: "Social Feed",
      icon: <Users className="w-5 h-5" />,
      active: true,
      users: 967,
      description: "Follow/unfollow system with activity feeds",
      stats: [
        { label: "Active Connections", value: "3,456" },
        { label: "Feed Posts", value: "8,923" },
        { label: "Engagement Rate", value: "21%" }
      ]
    }
  ];

  const totalUsers = features.reduce((sum, f) => sum + f.users, 0);
  const activeFeatures = features.filter(f => f.active).length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-300">Active Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{activeFeatures}/{features.length}</div>
            <p className="text-xs text-blue-200 mt-1">All systems operational</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-purple-300">Total Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalUsers.toLocaleString()}</div>
            <p className="text-xs text-purple-200 mt-1">Active across all features</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-green-300">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">100%</div>
            <p className="text-xs text-green-200 mt-1">All services running</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Feature Management Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 bg-white/10 border border-white/20">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="challenges" className="text-xs">Challenges</TabsTrigger>
          <TabsTrigger value="tournaments" className="text-xs">Tournaments</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">Badges</TabsTrigger>
          <TabsTrigger value="emails" className="text-xs">Emails</TabsTrigger>
          <TabsTrigger value="referrals" className="text-xs">Referrals</TabsTrigger>
          <TabsTrigger value="leaderboards" className="text-xs">Leaderboards</TabsTrigger>
          <TabsTrigger value="social" className="text-xs">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">{feature.icon}</div>
                        <div>
                          <CardTitle className="text-sm">{feature.name}</CardTitle>
                          <CardDescription className="text-xs">{feature.description}</CardDescription>
                        </div>
                      </div>
                      {feature.active ? (
                        <Toggle2 className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {feature.stats.map((stat, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-white/60">{stat.label}</span>
                          <span className="font-semibold text-white">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Daily Challenges Management</CardTitle>
              <CardDescription>Configure and monitor 8 daily micro-challenges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["Completion Rate: 64%", "Active: 347 users", "Avg Points/Day: 42", "Easy: 3 | Medium: 3 | Hard: 2"].map((stat) => (
                  <div key={stat} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/70">{stat}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tournaments">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Tournament Management</CardTitle>
              <CardDescription>3 active tournaments with 512 participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {["Weekly Writing Challenge - 189 participants", "Monthly Consistency - 203 participants", "Seasonal Marathon - 120 participants"].map((t) => (
                <div key={t} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                  <p className="text-sm text-white/70">{t}</p>
                  <Eye className="w-4 h-4 text-white/40" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Achievement Badges</CardTitle>
              <CardDescription>11 badges | 1,247 unlocked | 892 users with badges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["🏆 Milestones", "🔥 Streaks", "✍️ Writing", "👥 Social", "⭐ Consistency"].map((cat) => (
                  <div key={cat} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/70">{cat}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Email Reminder System</CardTitle>
              <CardDescription>SendGrid integration | 1,892 sent | 38% open rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["Streak Milestones: 89", "2-Day Absence: 234", "Weekly Digest: 156", "Referral Alerts: 67"].map((stat) => (
                  <div key={stat} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/70">{stat}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Referral Growth System</CardTitle>
              <CardDescription>1,456 referrals | 234 redeemed | 11,700 bonus prompts distributed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {["Advocate (5+): 89", "Ambassador (20+): 34", "VIP (50+): 12"].map((tier) => (
                  <div key={tier} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/70">{tier}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboards">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Global Leaderboards</CardTitle>
              <CardDescription>4 types | 1,203 active competitors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {["Weekly Rankings", "All-Time Rankings", "Streak Leaders", "Word Count Champions"].map((board) => (
                  <div key={board} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between">
                    <p className="text-sm text-white/70">{board}</p>
                    <Settings className="w-4 h-4 text-white/40" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Social Features</CardTitle>
              <CardDescription>3,456 active connections | 8,923 feed posts | 21% engagement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["Follow/Unfollow: Active", "Personal Feed: Live", "Global Feed: Live", "Activity Logging: Enabled"].map((feature) => (
                  <div key={feature} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm text-white/70">{feature}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
