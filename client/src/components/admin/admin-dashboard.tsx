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
import AdminAIInsightsTab from "./AdminAIInsightsTab";
import AdminAnalyticsTab from "./AdminAnalyticsTab";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-black dark:via-gray-900 dark:to-black p-2 sm:p-4 lg:p-6" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-1 sm:mb-2" data-testid="admin-title">
                🦉 JournOwl Admin Dashboard
              </h1>
              <p className="text-xs sm:text-base text-gray-300 dark:text-gray-400">
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
              data-testid="button-logout"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8" data-testid="admin-stats">
          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl" data-testid="stat-total-users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-base sm:text-2xl font-bold text-purple-400">{analytics.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl" data-testid="stat-active-users">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Active Users</CardTitle>
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-base sm:text-2xl font-bold text-green-400">{analytics.activeUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl" data-testid="stat-campaigns">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Email Campaigns</CardTitle>
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-base sm:text-2xl font-bold text-blue-400">{campaigns.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm border-gray-700 shadow-xl" data-testid="stat-activity">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">Recent Activity</CardTitle>
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
            </CardHeader>
            <CardContent className="pt-1 sm:pt-2">
              <div className="text-base sm:text-2xl font-bold text-orange-400">{activityLogs.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4 sm:space-y-6" data-testid="admin-tabs">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 bg-gray-800/80 dark:bg-gray-900/80 border-gray-700" data-testid="admin-tab-list">
            <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" data-testid="tab-users">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" data-testid="tab-analytics">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="revenue" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" data-testid="tab-revenue">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Revenue</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm" data-testid="tab-insights">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">AI Insights</span>
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
            <AdminAIInsightsTab advancedAnalytics={advancedAnalytics} analytics={analytics} loadAdminData={loadAdminData} />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AdminAnalyticsTab analytics={analytics} />
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