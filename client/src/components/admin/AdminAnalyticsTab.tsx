import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, Eye, BarChart3, Users } from "lucide-react";

interface AdminAnalyticsTabProps {
  analytics: any;
}

export default function AdminAnalyticsTab({ analytics }: AdminAnalyticsTabProps) {
  return (
    <>
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
    </>
  );
}
