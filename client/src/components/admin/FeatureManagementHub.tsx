import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  AlertCircle,
  Loader2
} from "lucide-react";

interface Metrics {
  challenges: any;
  tournaments: any;
  achievements: any;
  emails: any;
  referrals: any;
  leaderboards: any;
  streaks: any;
  social: any;
  totalEngagement: number;
  systemHealth: number;
}

export function FeatureManagementHub() {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: metrics, isLoading } = useQuery<Metrics>({
    queryKey: ["/api/admin/metrics/all"]
  });

  const features = metrics ? [
    {
      name: "Daily Challenges",
      icon: <Target className="w-5 h-5" />,
      active: true,
      users: metrics.challenges.activeUsers || 0,
      description: "8 micro-challenges for daily engagement",
      stats: [
        { label: "Completion Rate", value: `${metrics.challenges.completionRate || 0}%` },
        { label: "Avg Points/Day", value: metrics.challenges.avgPointsPerDay || 0 },
        { label: "Active Participants", value: metrics.challenges.activeUsers || 0 }
      ]
    },
    {
      name: "Tournaments",
      icon: <Trophy className="w-5 h-5" />,
      active: true,
      users: metrics.tournaments.totalParticipants || 0,
      description: "Weekly, monthly, and seasonal competitions",
      stats: [
        { label: "Active Tournaments", value: metrics.tournaments.activeTournaments || 0 },
        { label: "Total Participants", value: metrics.tournaments.totalParticipants || 0 },
        { label: "Prize Pool/Month", value: "$500" }
      ]
    },
    {
      name: "Achievement Badges",
      icon: <CheckCircle2 className="w-5 h-5" />,
      active: true,
      users: metrics.achievements.usersWithBadges || 0,
      description: "11 badges across 5 categories with 8-level progression",
      stats: [
        { label: "Unlocked Badges", value: metrics.achievements.totalUnlocked || 0 },
        { label: "Users with Badges", value: metrics.achievements.usersWithBadges || 0 },
        { label: "Categories", value: "5" }
      ]
    },
    {
      name: "Email Reminders",
      icon: <Mail className="w-5 h-5" />,
      active: true,
      users: metrics.emails.campaigns || 0,
      description: "SendGrid integration for streak & milestone emails",
      stats: [
        { label: "Emails Sent", value: metrics.emails.totalSent || 0 },
        { label: "Open Rate", value: `${metrics.emails.openRate || 0}%` },
        { label: "Click Rate", value: `${metrics.emails.clickRate || 0}%` }
      ]
    },
    {
      name: "Referral System",
      icon: <Gift className="w-5 h-5" />,
      active: true,
      users: metrics.referrals.totalReferrals || 0,
      description: "Viral growth with unique codes and tier rewards",
      stats: [
        { label: "Total Referrals", value: metrics.referrals.totalReferrals || 0 },
        { label: "Successful Redeems", value: metrics.referrals.successful || 0 },
        { label: "Bonus Prompts Distributed", value: metrics.referrals.bonusDistributed || 0 }
      ]
    },
    {
      name: "Global Leaderboards",
      icon: <BarChart3 className="w-5 h-5" />,
      active: true,
      users: metrics.leaderboards.activeCompetitors || 0,
      description: "4 leaderboard types: Weekly, All-Time, Streaks, Words",
      stats: [
        { label: "Active Competitors", value: metrics.leaderboards.activeCompetitors || 0 },
        { label: "Weekly Updates", value: metrics.leaderboards.weeklyUpdates || 0 },
        { label: "Top Score", value: metrics.leaderboards.topScore || 0 }
      ]
    },
    {
      name: "Streak Notifications",
      icon: <Flame className="w-5 h-5" />,
      active: true,
      users: metrics.streaks.activeStreaks || 0,
      description: "Real-time streak tracking and milestone alerts",
      stats: [
        { label: "Active Streaks", value: metrics.streaks.activeStreaks || 0 },
        { label: "100+ Day Streaks", value: metrics.streaks.longStreaks || 0 },
        { label: "Milestones Hit", value: metrics.streaks.milestonesHit || 0 }
      ]
    },
    {
      name: "Social Feed",
      icon: <Users className="w-5 h-5" />,
      active: true,
      users: metrics.social.activeConnections || 0,
      description: "Follow/unfollow system with activity feeds",
      stats: [
        { label: "Active Connections", value: metrics.social.activeConnections || 0 },
        { label: "Feed Posts", value: metrics.social.feedPosts || 0 },
        { label: "Engagement Rate", value: `${metrics.social.engagementRate || 0}%` }
      ]
    }
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  const totalUsers = features.reduce((sum: number, f: any) => sum + f.users, 0);
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
            <div className="text-3xl font-bold text-white">{metrics?.systemHealth || 0}%</div>
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
            {features.map((feature: any, idx: number) => (
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
                      {feature.stats.map((stat: any, i: number) => (
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
              <CardTitle>Daily Challenges - Live Data</CardTitle>
              <CardDescription>Real user engagement metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Completion Rate", value: `${metrics?.challenges.completionRate || 0}%` },
                  { label: "Active Users", value: metrics?.challenges.activeUsers || 0 },
                  { label: "Avg Points/Day", value: metrics?.challenges.avgPointsPerDay || 0 },
                  { label: "Difficulty: Easy/Med/Hard", value: "3/3/2" }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs use real data */}
        <TabsContent value="tournaments">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Tournament Management - Live Data</CardTitle>
              <CardDescription>{metrics?.tournaments.activeTournaments || 0} active tournaments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {metrics?.tournaments.tournaments?.map((t: any) => (
                <div key={t.name} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/60">{t.participants} participants • {t.prize}</p>
                  </div>
                  <Eye className="w-4 h-4 text-white/40" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Achievement Badges - Live Data</CardTitle>
              <CardDescription>Real unlock statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Unlocked", value: metrics?.achievements.totalUnlocked || 0 },
                  { label: "Users with Badges", value: metrics?.achievements.usersWithBadges || 0 },
                  { label: "Milestones", value: "5" },
                  { label: "Streaks", value: "2" }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emails">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Email Reminder System - Live Data</CardTitle>
              <CardDescription>SendGrid metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Emails Sent", value: metrics?.emails.totalSent || 0 },
                  { label: "Open Rate", value: `${metrics?.emails.openRate || 0}%` },
                  { label: "Click Rate", value: `${metrics?.emails.clickRate || 0}%` },
                  { label: "Campaigns", value: metrics?.emails.campaigns || 0 }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Referral Growth System - Live Data</CardTitle>
              <CardDescription>Real referral metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Total Referrals", value: metrics?.referrals.totalReferrals || 0 },
                  { label: "Redeemed", value: metrics?.referrals.successful || 0 },
                  { label: "Bonus Prompts", value: metrics?.referrals.bonusDistributed || 0 }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboards">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Global Leaderboards - Live Data</CardTitle>
              <CardDescription>Real competition metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Active Competitors", value: metrics?.leaderboards.activeCompetitors || 0 },
                  { label: "Weekly Updates", value: metrics?.leaderboards.weeklyUpdates || 0 },
                  { label: "Top Score", value: metrics?.leaderboards.topScore || 0 }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle>Social Features - Live Data</CardTitle>
              <CardDescription>Real engagement statistics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Active Connections", value: metrics?.social.activeConnections || 0 },
                  { label: "Feed Posts", value: metrics?.social.feedPosts || 0 },
                  { label: "Engagement Rate", value: `${metrics?.social.engagementRate || 0}%` }
                ].map((stat) => (
                  <div key={stat.label} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-white/60">{stat.label}</p>
                    <p className="text-lg font-bold text-white">{stat.value}</p>
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
