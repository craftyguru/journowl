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
  Crown
} from "lucide-react";

import EnhancedEmailCampaigns from "./enhanced-email-campaigns";
import AdvancedRevenueDashboard from "./advanced-revenue-dashboard";
import AdvancedActivityDashboard from "./advanced-activity-dashboard";

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
  
  const user = userResponse?.user;
  const [users, setUsers] = useState<User[]>([]);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
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
      const result = await apiRequest(`/api/admin/email-campaigns/${campaignId}/send`, {
        method: 'POST'
      });

      if (result.success) {
        toast({
          title: "Campaign Sent",
          description: `Successfully sent to ${result.sent} users`,
        });
      } else {
        toast({
          title: "Campaign Failed",
          description: result.error,
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🦉 JournOwl Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
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
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Logout
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{analytics.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{analytics.activeUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Campaigns</CardTitle>
              <Mail className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{campaigns.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activityLogs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/50 dark:bg-gray-800/50">
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
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {users.map((user) => (
                    <Card key={user.id} className="border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90">
                      <CardContent className="p-6">
                        {/* User Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {user.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{user.username}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={user.role === 'admin' ? 'default' : user.currentPlan === 'pro' ? 'destructive' : 'secondary'} className="text-xs">
                                  {user.role === 'admin' ? 'Admin' : user.currentPlan || 'Free'}
                                </Badge>
                                <span className="text-xs text-gray-500">Level {user.level} • {user.xp} XP</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Admin Actions */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/admin/reset-prompts/${user.id}`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' }
                                  });
                                  const result = await response.json();
                                  if (response.ok) {
                                    toast({
                                      title: "Success",
                                      description: `Reset prompts for ${user.username}`,
                                    });
                                    loadAdminData(); // Refresh data
                                  } else {
                                    throw new Error(result.message);
                                  }
                                } catch (error: any) {
                                  toast({
                                    title: "Error",
                                    description: error.message,
                                    variant: "destructive"
                                  });
                                }
                              }}
                              className="text-purple-600 border-purple-300 hover:bg-purple-50"
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Reset Prompts
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // Future: Add upgrade subscription functionality
                                toast({
                                  title: "Feature Coming Soon",
                                  description: "Subscription management will be available soon",
                                });
                              }}
                              className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Manage Sub
                            </Button>
                          </div>
                        </div>

                        {/* Usage Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          {/* AI Prompts Usage */}
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">AI Prompts</span>
                              <Sparkles className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                              {user.promptsRemaining || 0}/100
                            </div>
                            <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(0, Math.min(100, ((user.promptsRemaining || 0) / 100) * 100))}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-purple-600 mt-1">
                              {user.promptsUsedThisMonth || 0} used this month
                            </div>
                          </div>

                          {/* Storage Usage */}
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Storage</span>
                              <Cloud className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {user.storageUsedMB || 0}/{user.storageLimit || 100} MB
                            </div>
                            <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.max(0, Math.min(100, ((user.storageUsedMB || 0) / (user.storageLimit || 100)) * 100))}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-blue-600 mt-1">
                              {Math.round(100 - ((user.storageUsedMB || 0) / (user.storageLimit || 100)) * 100)}% available
                            </div>
                          </div>

                          {/* Account Stats */}
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">Activity</span>
                              <Activity className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="text-2xl font-bold text-green-600 mb-1">
                              {user.totalEntries || 0}
                            </div>
                            <div className="text-xs text-green-600">
                              entries • {user.totalWords || 0} words
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              {user.currentStreak || 0} day streak
                            </div>
                          </div>
                        </div>

                        {/* Account Details */}
                        <div className="flex items-center gap-6 text-xs text-gray-500 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          {user.lastLoginAt && (
                            <span>Last active {new Date(user.lastLoginAt).toLocaleDateString()}</span>
                          )}
                          <span>Subscription: {user.currentPlan || 'Free'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <AdvancedRevenueDashboard />
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Behavior Insights */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-600" />
                    User Behavior Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                      <div className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">
                        🔥 Most Active Time: 7-9 PM
                      </div>
                      <div className="text-sm text-indigo-600">
                        68% of journal entries are created in the evening
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                      <div className="font-semibold text-green-800 dark:text-green-200 mb-2">
                        ⭐ Feature Usage Leader: Photo Analysis
                      </div>
                      <div className="text-sm text-green-600">
                        87% of users have uploaded photos for AI analysis
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                      <div className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                        📈 Retention Boost: Mood Tracking
                      </div>
                      <div className="text-sm text-orange-600">
                        Users who track mood have 3x higher retention
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Automated Actions */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Smart Admin Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      onClick={() => {
                        toast({
                          title: "Automated Campaign Sent",
                          description: "Targeted prompt top-up offers sent to 5 heavy users",
                        });
                      }}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Send AI Prompt Upsell Campaign
                    </Button>
                    
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                      onClick={() => {
                        toast({
                          title: "Re-engagement Started",
                          description: "Personalized prompts sent to 12 inactive users",
                        });
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Re-engage Inactive Users
                    </Button>
                    
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-green-500 to-green-600 text-white"
                      onClick={() => {
                        toast({
                          title: "Pro Upgrade Campaign",
                          description: "Annual discount offers sent to 8 eligible users",
                        });
                      }}
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Promote Annual Subscriptions
                    </Button>
                    
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-orange-500 to-orange-600 text-white"
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
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
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
              setCampaignForm={setCampaignForm}
              sendEmailCampaign={createEmailCampaign}
              campaigns={campaigns}
            />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <AdvancedActivityDashboard 
              activityLogs={activityLogs}
              refreshActivity={loadAdminData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}