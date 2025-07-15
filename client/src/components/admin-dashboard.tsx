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
          <TabsList className="grid w-full grid-cols-4 bg-white/50 dark:bg-gray-800/50">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Campaigns
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

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Total Users</span>
                      <span className="font-bold text-purple-600">{analytics.totalUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Active Users (30 days)</span>
                      <span className="font-bold text-green-600">{analytics.activeUsers || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Admin Users</span>
                      <span className="font-bold text-blue-600">
                        {users.filter(u => u.role === 'admin').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Database Status</span>
                      <Badge variant="default" className="bg-green-500">Online</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Email Service</span>
                      <Badge variant="secondary">
                        {import.meta.env.VITE_SENDGRID_API_KEY ? 'Configured' : 'Not Configured'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>OAuth Services</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Email Campaigns Tab */}
          <TabsContent value="email">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Campaign */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Create Email Campaign</CardTitle>
                  <CardDescription>Send emails to your users</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      value={campaignForm.title}
                      onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                      placeholder="Welcome Newsletter"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Email Subject</Label>
                    <Input
                      id="subject"
                      value={campaignForm.subject}
                      onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                      placeholder="Welcome to MoodJournal!"
                    />
                  </div>

                  <div>
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select 
                      value={campaignForm.targetAudience} 
                      onValueChange={(value) => setCampaignForm({...campaignForm, targetAudience: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="active">Active Users</SelectItem>
                        <SelectItem value="inactive">Inactive Users</SelectItem>
                        <SelectItem value="admins">Admin Users</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="content">Email Content</Label>
                    <Textarea
                      id="content"
                      value={campaignForm.content}
                      onChange={(e) => setCampaignForm({...campaignForm, content: e.target.value})}
                      placeholder="Welcome to MoodJournal! We're excited to have you..."
                      rows={6}
                    />
                  </div>

                  <Button onClick={createEmailCampaign} className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </CardContent>
              </Card>

              {/* Campaign List */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Recent Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">No campaigns created yet</p>
                    ) : (
                      campaigns.map((campaign) => (
                        <div key={campaign.id} className="p-4 border rounded-lg bg-white/50 dark:bg-gray-700/50">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{campaign.title}</h3>
                            <Badge variant={
                              campaign.status === 'sent' ? 'default' :
                              campaign.status === 'sending' ? 'secondary' :
                              campaign.status === 'failed' ? 'destructive' : 'outline'
                            }>
                              {campaign.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {campaign.subject}
                          </p>
                          <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{campaign.targetAudience} • {campaign.recipientCount} recipients</span>
                            <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                          </div>
                          {campaign.status === 'draft' && (
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onClick={() => sendEmailCampaign(campaign.id)}
                            >
                              <Send className="mr-2 h-3 w-3" />
                              Send Now
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Monitor user actions and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityLogs.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No recent activity</p>
                  ) : (
                    activityLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg bg-white/50 dark:bg-gray-700/50">
                        <div>
                          <span className="font-medium">{log.action}</span>
                          {log.details && (
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              {JSON.stringify(log.details)}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}