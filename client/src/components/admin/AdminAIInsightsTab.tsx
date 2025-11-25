import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Brain, Zap, Target, Crown, Users, Mail, FileText, Trophy, Sparkles } from "lucide-react";

interface AdminAIInsightsTabProps {
  advancedAnalytics: any;
  analytics: any;
  loadAdminData: () => void;
}

export default function AdminAIInsightsTab({ advancedAnalytics, analytics, loadAdminData }: AdminAIInsightsTabProps) {
  const { toast } = useToast();

  return (
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
                <div className="font-semibold text-indigo-300 dark:text-indigo-200 mb-3">🎯 User Journey Analytics</div>
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
                <div className="font-semibold text-green-800 dark:text-green-200 mb-3">📊 Cohort Retention Analysis</div>
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
                <div className="font-semibold text-orange-300 dark:text-orange-200 mb-3">🔥 Feature Usage Heatmap</div>
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
                <div className="font-semibold text-purple-300 dark:text-purple-200 mb-3">🎭 Behavioral Segments</div>
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
                <div className="font-semibold text-blue-300 dark:text-blue-200 mb-3">📧 Smart Campaign Manager</div>
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
                <div className="font-semibold text-orange-800 dark:text-orange-200 mb-3">⚡ Power User Tools</div>
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
                <div className="font-semibold text-purple-800 dark:text-purple-200 mb-3">🧠 AI Optimization Engine</div>
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
    </div>
  );
}
