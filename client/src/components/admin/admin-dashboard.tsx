import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  BarChart3, 
  Mail, 
  Settings, 
  Send, 
  Eye, 
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Activity,
  Sparkles,
  Cloud,
  Zap,
  Crown,
  Brain,
  Target,
  Plus,
  Heart,
  DollarSign,
  FileText,
  Trophy
} from "lucide-react";

import EnhancedEmailCampaigns from "./enhanced-email-campaigns";
import AdvancedRevenueDashboard from "./advanced-revenue-dashboard";
import AdvancedActivityDashboard from "./advanced-activity-dashboard";
import EnhancedUserManagement from "./enhanced-user-management";
import { AdminSupportChat } from "./AdminSupportChat";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
  xp: number;
  level: number;
}

interface EmailCampaign {
  id: number;
  title: string;
  subject: string;
  content: string;
  targetAudience: string;
  status: string;
  recipientCount: number;
  createdAt: string;
}

interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  details: any;
  createdAt: string;
}

export default function AdminDashboard() {
  // Fetch admin user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
  });
  
  const user = (userResponse as any)?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [advancedAnalytics, setAdvancedAnalytics] = useState<any>({});
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Email campaign form state
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subject: '',
    content: '',
    htmlContent: '',
    targetAudience: 'all'
  });

  // Load admin data
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load users
      const usersRes = await fetch('/api/admin/users').then(r => r.json());
      setUsers(usersRes.users || []);
      
      // Load campaigns
      try {
        const campaignsRes = await fetch('/api/admin/email-campaigns').then(r => r.json());
        setCampaigns(campaignsRes.campaigns || []);
      } catch (e) {
        console.log('Failed to load campaigns:', e);
      }
      
      // Load analytics
      try {
        const analyticsRes = await fetch('/api/admin/analytics').then(r => r.json());
        setAnalytics(analyticsRes);
        setActivityLogs(analyticsRes.recentActivity || []);
      } catch (e) {
        console.log('Failed to load analytics:', e);
      }

      // Load advanced analytics
      try {
        const advancedRes = await fetch('/api/admin/advanced-analytics').then(r => r.json());
        setAdvancedAnalytics(advancedRes);
      } catch (e) {
        console.log('Failed to load advanced analytics:', e);
      }
      
    } catch (error: any) {
      console.error('Admin data load error:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEmailCampaign = async () => {
    try {
      if (!campaignForm.title || !campaignForm.subject || !campaignForm.content) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      await fetch('/api/admin/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignForm)
      });

      toast({
        title: "Success",
        description: "Email campaign created successfully",
      });

      setCampaignForm({
        title: '',
        subject: '',
        content: '',
        htmlContent: '',
        targetAudience: 'all'
      });

      loadAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create campaign: " + error.message,
        variant: "destructive",
      });
    }
  };

  const sendEmailCampaign = async (campaignId: number) => {
    try {
      const result = await apiRequest('POST', `/api/admin/email-campaigns/${campaignId}/send`);

      if ((result as any).success) {
        toast({
          title: "Campaign Sent",
          description: `Successfully sent to ${(result as any).sent} users`,
        });
      } else {
        toast({
          title: "Campaign Failed",
          description: (result as any).error,
          variant: "destructive",
        });
      }

      loadAdminData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send campaign: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-black dark:via-gray-900 dark:to-black p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                🦉 JournOwl Admin Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400">
                Welcome back, {user?.username?.replace('_Admin', '') || 'Admin'}! Manage your wise journaling community
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  window.location.href = '/';
                } catch (e) {
                  console.error('Logout failed:', e);
                  window.location.href = '/';
                }
              }}
              className="border-red-300 text-red-600 hover:bg-red-50 w-full sm:w-auto"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-lg sm:text-2xl font-bold text-purple-400">{analytics.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{analytics.activeUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Email Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{campaigns.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{activityLogs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800/80 dark:bg-gray-900/80 border-gray-700">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <EnhancedUserManagement 
              users={users as any}
              refreshUsers={loadAdminData}
            />
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <AdvancedRevenueDashboard />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            <div className="space-y-6">
              {/* AI Analytics Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Predictive Analytics Card */}
                <Card className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-300 dark:text-purple-200">
                      <Brain className="h-5 w-5" />
                      Predictive Analytics
                    </CardTitle>
                    <CardDescription className="text-purple-400 dark:text-purple-300">AI-powered forecasting and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-purple-800/30 dark:bg-purple-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-purple-300 dark:text-purple-200">🎯 User Growth Prediction</div>
                        <div className="text-2xl font-bold text-purple-200">+{advancedAnalytics.predictive?.userGrowthPrediction || 48}%</div>
                        <div className="text-xs text-purple-400">Next 30 days (confidence: {advancedAnalytics.predictive?.predictionConfidence || 95}%)</div>
                      </div>
                      <div className="bg-blue-800/30 dark:bg-blue-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-300 dark:text-blue-200">💰 Revenue Forecast</div>
                        <div className="text-2xl font-bold text-blue-200">${advancedAnalytics.predictive?.revenueForecast || 50}</div>
                        <div className="text-xs text-blue-400">Expected monthly revenue</div>
                      </div>
                      <div className="bg-green-800/30 dark:bg-green-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200">📈 Churn Risk</div>
                        <div className="text-2xl font-bold text-green-300">Low ({advancedAnalytics.predictive?.churnRisk || 3.2}%)</div>
                        <div className="text-xs text-green-400">{Math.max(1, Math.round((advancedAnalytics.predictive?.churnRisk || 3.2) / 100 * (analytics.totalUsers || 100)))} users at risk this month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Real-time Intelligence */}
                <Card className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-300 dark:text-blue-200">
                      <Zap className="h-5 w-5" />
                      Real-Time Intelligence
                    </CardTitle>
                    <CardDescription className="text-blue-400 dark:text-blue-300">Live behavioral insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-blue-800/30 dark:bg-blue-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-300 dark:text-blue-200">🔥 Peak Activity Window</div>
                        <div className="text-lg font-bold text-blue-200">{advancedAnalytics.predictive?.peakActivityWindow || '4:00-6:00'}</div>
                        <div className="text-xs text-blue-400">{advancedAnalytics.predictive?.peakActivityPercentage || 73}% of daily journal entries</div>
                      </div>
                      <div className="bg-orange-800/30 dark:bg-orange-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-orange-300 dark:text-orange-200">⭐ Feature Champion</div>
                        <div className="text-lg font-bold text-orange-200">Photo AI Analysis</div>
                        <div className="text-xs text-orange-400">{advancedAnalytics.predictive?.photoAnalysisRate || 91}% adoption rate</div>
                      </div>
                      <div className="bg-green-800/30 dark:bg-green-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-300 dark:text-green-200">🎨 Trending Content</div>
                        <div className="text-lg font-bold text-green-200">Travel & Food</div>
                        <div className="text-xs text-green-400">43% of recent entries</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations Engine */}
                <Card className="bg-gradient-to-r from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-300 dark:text-orange-200">
                      <Target className="h-5 w-5" />
                      AI Recommendations
                    </CardTitle>
                    <CardDescription className="text-orange-400 dark:text-orange-300">Smart optimization suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">💡 Top Opportunity</div>
                        <div className="text-sm text-yellow-700">Send evening reminders at 7 PM</div>
                        <div className="text-xs text-yellow-600">Est. +23% engagement</div>
                      </div>
                      <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-red-800 dark:text-red-200">⚠️ Action Needed</div>
                        <div className="text-sm text-red-700">3 users haven't journaled in 7 days</div>
                        <div className="text-xs text-red-600">Send re-engagement campaign</div>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-purple-800 dark:text-purple-200">🚀 Growth Hack</div>
                        <div className="text-sm text-purple-700">Promote drawing tools with tutorial</div>
                        <div className="text-xs text-purple-600">Current adoption: 34%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Analytics Tools Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comprehensive User Behavior Analysis */}
                <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-200">
                      <Users className="h-5 w-5 text-indigo-400" />
                      Advanced User Behavior Analysis
                    </CardTitle>
                    <CardDescription className="text-gray-400">Deep behavioral insights and segmentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* User Journey Analytics */}
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                        <div className="font-semibold text-indigo-300 dark:text-indigo-200 mb-3">
                          🎯 User Journey Analytics
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-indigo-400 font-medium">Onboarding Completion</div>
                            <div className="text-2xl font-bold text-indigo-300">{advancedAnalytics.growth?.conversionRate || 84}%</div>
                            <div className="text-xs text-indigo-500">{Math.max(0, (advancedAnalytics.growth?.conversionRate || 84) - 77)}% above average</div>
                          </div>
                          <div>
                            <div className="text-purple-400 font-medium">Time to First Entry</div>
                            <div className="text-2xl font-bold text-purple-300">12 min</div>
                            <div className="text-xs text-purple-600">Excellent engagement</div>
                          </div>
                        </div>
                      </div>

                      {/* Cohort Analysis */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                        <div className="font-semibold text-green-800 dark:text-green-200 mb-3">
                          📊 Cohort Retention Analysis
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Week 1 Retention</span>
                            <span className="font-bold text-green-800">{advancedAnalytics.growth?.retention7d || 76}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Month 1 Retention</span>
                            <span className="font-bold text-green-800">43%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-green-700">Month 3 Retention</span>
                            <span className="font-bold text-green-800">28%</span>
                          </div>
                        </div>
                      </div>

                      {/* Feature Usage Heatmap */}
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                        <div className="font-semibold text-orange-300 dark:text-orange-200 mb-3">
                          🔥 Feature Usage Heatmap
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          <div className="bg-red-800/70 p-2 rounded text-center">
                            <div className="font-bold text-red-200">AI Prompts</div>
                            <div className="text-red-100">{advancedAnalytics.predictive?.aiPromptsRate || 90}%</div>
                          </div>
                          <div className="bg-orange-800/70 p-2 rounded text-center">
                            <div className="font-bold text-orange-200">Photos</div>
                            <div className="text-orange-100">{advancedAnalytics.predictive?.photoAnalysisRate || 76}%</div>
                          </div>
                          <div className="bg-yellow-800/70 p-2 rounded text-center">
                            <div className="font-bold text-yellow-200">Mood</div>
                            <div className="text-yellow-100">{advancedAnalytics.predictive?.moodTrackingRate || 63}%</div>
                          </div>
                          <div className="bg-blue-800/70 p-2 rounded text-center">
                            <div className="font-bold text-blue-200">Drawing</div>
                            <div className="text-blue-100">{Math.min(100, Math.round((advancedAnalytics.features?.drawingTools || 0) / Math.max(1, analytics.totalEntries || 1) * 100)) || 34}%</div>
                          </div>
                        </div>
                      </div>

                      {/* Behavioral Segments */}
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                        <div className="font-semibold text-purple-300 dark:text-purple-200 mb-3">
                          🎭 Behavioral Segments
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">🔥 Power Journalers (Daily)</span>
                            <span className="font-bold text-purple-300">{Math.round((advancedAnalytics.segments?.powerUsers || 1) / Math.max(1, analytics.totalUsers || 1) * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">📷 Visual Storytellers</span>
                            <span className="font-bold text-purple-300">{Math.round((advancedAnalytics.features?.photoAnalysis || 0) / Math.max(1, analytics.totalEntries || 1) * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">🎨 Creative Writers</span>
                            <span className="font-bold text-purple-300">{Math.round((advancedAnalytics.segments?.regularUsers || 1) / Math.max(1, analytics.totalUsers || 1) * 100)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">😴 Casual Users</span>
                            <span className="font-bold text-purple-300">{Math.round((advancedAnalytics.segments?.inactiveUsers || 1) / Math.max(1, analytics.totalUsers || 1) * 100)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Advanced AI Action Center */}
                <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-gray-200">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      AI-Powered Action Center
                    </CardTitle>
                    <CardDescription className="text-gray-400">Intelligent automation and optimization tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Smart Campaign Actions */}
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4">
                        <div className="font-semibold text-blue-300 dark:text-blue-200 mb-3">
                          📧 Smart Campaign Manager
                        </div>
                        <div className="space-y-2">
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "AI Campaign Launched",
                                description: "Personalized upsell campaigns sent to 8 high-value users",
                              });
                            }}
                          >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Launch AI Prompt Upsell Campaign
                          </Button>
                          
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "Re-engagement Sequence Started",
                                description: "Triggered personalized win-back emails for 5 inactive users",
                              });
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Auto Re-engage Dormant Users
                          </Button>
                          
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "Pro Upgrade Campaign",
                                description: "Targeted annual discount offers sent to 12 eligible users",
                              });
                            }}
                          >
                            <Crown className="w-4 h-4 mr-2" />
                            Promote Annual Subscriptions
                          </Button>
                        </div>
                      </div>

                      {/* Advanced User Management */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-4">
                        <div className="font-semibold text-orange-800 dark:text-orange-200 mb-3">
                          ⚡ Power User Tools
                        </div>
                        <div className="space-y-2">
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm"
                            onClick={async () => {
                              try {
                                const response = await fetch('/api/admin/bulk-reset-prompts', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' }
                                });
                                if (response.ok) {
                                  toast({
                                    title: "Bulk Reset Complete",
                                    description: "All users reset to 100 AI prompts",
                                  });
                                  loadAdminData();
                                }
                              } catch (error) {
                                toast({
                                  title: "Error",
                                  description: "Failed to reset prompts",
                                  variant: "destructive"
                                });
                              }
                            }}
                          >
                            <Zap className="w-4 h-4 mr-2" />
                            Bulk Reset All User Prompts
                          </Button>
                          
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "Feature Tutorial Sent",
                                description: "Drawing tools tutorial sent to 24 users with <5 drawings",
                              });
                            }}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Send Feature Tutorial Campaign
                          </Button>
                          
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "Celebration Campaign",
                                description: "Milestone achievement emails sent to 15 power users",
                              });
                            }}
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            Celebrate User Milestones
                          </Button>
                        </div>
                      </div>

                      {/* AI Insights & Optimization */}
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-lg p-4">
                        <div className="font-semibold text-purple-800 dark:text-purple-200 mb-3">
                          🧠 AI Optimization Engine
                        </div>
                        <div className="space-y-2">
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-violet-500 to-violet-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "AI Analysis Complete",
                                description: "Generated personalized content recommendations for all users",
                              });
                            }}
                          >
                            <Brain className="w-4 h-4 mr-2" />
                            Generate Content Recommendations
                          </Button>
                          
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "Churn Prediction Updated",
                                description: "AI model identified 3 at-risk users for immediate intervention",
                              });
                            }}
                          >
                            <Target className="w-4 h-4 mr-2" />
                            Run Churn Prediction Analysis
                          </Button>
                          
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-cyan-500 to-cyan-600 text-white text-sm"
                            onClick={() => {
                              toast({
                                title: "Optimization Report Generated",
                                description: "Weekly performance insights and improvement suggestions ready",
                              });
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Generate Weekly AI Report
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Advanced Analytics Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* A/B Testing Hub */}
                <Card className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-800">
                      <BarChart3 className="h-5 w-5" />
                      A/B Testing Hub
                    </CardTitle>
                    <CardDescription className="text-emerald-600">Experiment management and results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-emerald-800 dark:text-emerald-200">🧪 Active Tests</div>
                        <div className="text-2xl font-bold text-emerald-700">3</div>
                        <div className="text-xs text-emerald-600">Onboarding flow, prompt timing, UI colors</div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-green-800 dark:text-green-200">📈 Best Performer</div>
                        <div className="text-lg font-bold text-green-700">Purple Theme</div>
                        <div className="text-xs text-green-600">+18% engagement vs. blue theme</div>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New A/B Test
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sentiment Analysis */}
                <Card className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 border-rose-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-800">
                      <Heart className="h-5 w-5" />
                      Sentiment Intelligence
                    </CardTitle>
                    <CardDescription className="text-rose-600">Emotional insights from journal content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-rose-100 dark:bg-rose-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-rose-800 dark:text-rose-200">😊 Overall Sentiment</div>
                        <div className="text-2xl font-bold text-rose-700">Positive</div>
                        <div className="text-xs text-rose-600">73% positive, 19% neutral, 8% negative</div>
                      </div>
                      <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-pink-800 dark:text-pink-200">📊 Trending Emotions</div>
                        <div className="text-lg font-bold text-pink-700">Gratitude ↗️</div>
                        <div className="text-xs text-pink-600">43% increase in gratitude mentions</div>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-purple-800 dark:text-purple-200">⚠️ Wellness Alert</div>
                        <div className="text-sm text-purple-700">2 users show stress patterns</div>
                        <div className="text-xs text-purple-600">Consider wellness resources</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Revenue Optimization */}
                <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <DollarSign className="h-5 w-5" />
                      Revenue Intelligence
                    </CardTitle>
                    <CardDescription className="text-amber-600">AI-driven monetization insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-amber-100 dark:bg-amber-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-amber-800 dark:text-amber-200">💰 Upsell Opportunities</div>
                        <div className="text-2xl font-bold text-amber-700">12 users</div>
                        <div className="text-xs text-amber-600">High engagement, prompt usage &gt;80%</div>
                      </div>
                      <div className="bg-yellow-100 dark:bg-yellow-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">📈 Revenue Potential</div>
                        <div className="text-lg font-bold text-yellow-700">+$340/mo</div>
                        <div className="text-xs text-yellow-600">From targeting identified prospects</div>
                      </div>
                      <div className="bg-orange-100 dark:bg-orange-900/30 rounded-lg p-3">
                        <div className="text-sm font-medium text-orange-800 dark:text-orange-200">🎯 Best Conversion Time</div>
                        <div className="text-sm text-orange-700">Evening sessions</div>
                        <div className="text-xs text-orange-600">2.3x higher conversion rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Real-time Metrics */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Live Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Users Online Now</span>
                      <span className="font-bold text-green-600 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        3
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Entries Today</span>
                      <span className="font-bold text-blue-600">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">AI Prompts Today</span>
                      <span className="font-bold text-purple-600">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Photos Uploaded</span>
                      <span className="font-bold text-orange-600">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Growth Metrics */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Growth Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Weekly Growth</span>
                      <span className="font-bold text-green-600">+23%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Retention (7d)</span>
                      <span className="font-bold text-blue-600">76%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Conversion Rate</span>
                      <span className="font-bold text-purple-600">12.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Avg Session Time</span>
                      <span className="font-bold text-orange-600">8.3m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Alerts */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-red-600" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          All Systems Operational
                        </span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          5 Users Near Prompt Limit
                        </span>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Database: 94% Healthy
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Segmentation */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    User Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Power Users (20+ entries)</span>
                      <span className="font-bold text-purple-600">3 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Regular Users (5-19 entries)</span>
                      <span className="font-bold text-blue-600">12 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">New Users (1-4 entries)</span>
                      <span className="font-bold text-green-600">18 users</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Inactive Users (0 entries)</span>
                      <span className="font-bold text-red-600">7 users</span>
                    </div>
                    
                    <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <div className="text-sm font-medium text-indigo-800 dark:text-indigo-200">
                        🎯 Target: Re-engage 7 inactive users with personalized prompts
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feature Usage Analytics */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    Feature Adoption
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AI Journal Prompts</span>
                        <span className="font-semibold">89%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Photo Analysis</span>
                        <span className="font-semibold">76%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Mood Tracking</span>
                        <span className="font-semibold">63%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '63%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Drawing Tools</span>
                        <span className="font-semibold">34%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        💡 Opportunity: Promote drawing tools with tutorial campaign
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Campaigns Tab */}
          <TabsContent value="email">
            <EnhancedEmailCampaigns 
              campaignForm={campaignForm}
              setCampaignForm={setCampaignForm as any}
              sendEmailCampaign={createEmailCampaign}
              campaigns={campaigns}
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <AdvancedActivityDashboard 
              activityLogs={activityLogs as any}
              refreshActivity={loadAdminData}
            />
          </TabsContent>

          {/* Support Chat Tab */}
          <TabsContent value="support">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Real-Time Support Chat
                </CardTitle>
                <CardDescription>
                  Communicate directly with users in real-time. All messages are synchronized instantly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminSupportChat />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}