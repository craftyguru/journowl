import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Gift, MessageSquare, Settings, BarChart3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PromoCodeManager } from "@/components/PromoCodeManager";
import { AdminSupportChat } from "@/components/AdminSupportChat";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Check if user is admin
  const { data: userResponse } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false
  }) as { data: any };
  
  const currentUser = userResponse?.user || userResponse;

  // Redirect non-admin users
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardContent className="pt-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-slate-400">You don't have permission to access the admin dashboard.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
              Administrator
            </Badge>
          </div>
          <p className="text-slate-400">Manage your application, users, and system settings</p>
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit bg-slate-800/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="promo-codes" className="data-[state=active]:bg-purple-600">
              <Gift className="h-4 w-4 mr-2" />
              Promo Codes
            </TabsTrigger>
            <TabsTrigger value="support" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="h-4 w-4 mr-2" />
              Support Chat
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">2,453</div>
                  <p className="text-xs text-slate-400">+12% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Active Promo Codes</CardTitle>
                  <Gift className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">8</div>
                  <p className="text-xs text-slate-400">3 created this week</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">Support Tickets</CardTitle>
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">23</div>
                  <p className="text-xs text-slate-400">5 pending response</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-300">System Status</CardTitle>
                  <BarChart3 className="h-4 w-4 text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">Healthy</div>
                  <p className="text-xs text-slate-400">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-slate-300">New user registration</span>
                      </div>
                      <span className="text-xs text-slate-400">2m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-slate-300">Promo code used: WELCOME2024</span>
                      </div>
                      <span className="text-xs text-slate-400">5m ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm text-slate-300">Support ticket created</span>
                      </div>
                      <span className="text-xs text-slate-400">12m ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab("promo-codes")}
                      className="w-full flex items-center gap-2 p-3 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-lg text-left transition-colors"
                    >
                      <Gift className="h-4 w-4 text-purple-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Create Promo Code</div>
                        <div className="text-xs text-slate-400">Add new promotional offers</div>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setActiveTab("support")}
                      className="w-full flex items-center gap-2 p-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg text-left transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 text-blue-400" />
                      <div>
                        <div className="text-sm font-medium text-white">Support Chat</div>
                        <div className="text-xs text-slate-400">Respond to user inquiries</div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Promo Codes Tab */}
          <TabsContent value="promo-codes">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <PromoCodeManager />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Chat Tab */}
          <TabsContent value="support">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="pt-6">
                <AdminSupportChat />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Application Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-300">Maintenance Mode</div>
                          <div className="text-xs text-slate-400">Enable maintenance mode for system updates</div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-300">Email Notifications</div>
                          <div className="text-xs text-slate-400">Send admin notifications via email</div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-slate-300">Registration</div>
                          <div className="text-xs text-slate-400">Allow new user registrations</div>
                        </div>
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-400">
                      For detailed system configuration, contact the development team.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}