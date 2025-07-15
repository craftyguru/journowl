import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users, 
  Sparkles, 
  Crown,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdvancedRevenueDashboard() {
  return (
    <div className="space-y-6">
      {/* Revenue Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Today's Revenue</p>
                <p className="text-2xl font-bold text-green-700">$48.50</p>
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +18% from yesterday
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">This Month</p>
                <p className="text-2xl font-bold text-blue-700">$1,247</p>
                <p className="text-xs text-blue-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +23% from last month
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Revenue</p>
                <p className="text-2xl font-bold text-purple-700">$8,923</p>
                <p className="text-xs text-purple-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  All time high
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Monthly Goal</p>
                <p className="text-2xl font-bold text-orange-700">74%</p>
                <p className="text-xs text-orange-600">$1,247 / $1,685</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-indigo-600" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>Income sources and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* AI Prompt Sales */}
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">AI Prompt Top-ups</div>
                    <div className="text-sm text-gray-600">$2.99 each</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-purple-600">$743.17</div>
                  <div className="text-sm text-gray-600">247 sales</div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +34%
                  </Badge>
                </div>
              </div>

              {/* Pro Subscriptions */}
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Pro Subscriptions</div>
                    <div className="text-sm text-gray-600">$9.99/month</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">$419.58</div>
                  <div className="text-sm text-gray-600">42 active</div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </div>

              {/* Annual Upgrades */}
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Annual Upgrades</div>
                    <div className="text-sm text-gray-600">$89.99/year (10% off)</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">$269.97</div>
                  <div className="text-sm text-gray-600">3 conversions</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +67%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Key Metrics
            </CardTitle>
            <CardDescription>Financial performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* ARPU */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Average Revenue Per User</div>
                  <div className="text-sm text-gray-600">Monthly ARPU</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">$18.45</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +$2.34 vs last month
                  </div>
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Conversion Rate</div>
                  <div className="text-sm text-gray-600">Free to paid conversion</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">14.2%</div>
                  <div className="text-sm text-blue-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +1.8% vs last month
                  </div>
                </div>
              </div>

              {/* Customer LTV */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Customer Lifetime Value</div>
                  <div className="text-sm text-gray-600">Estimated LTV</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">$127.60</div>
                  <div className="text-sm text-purple-600 flex items-center">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +$14.20 vs last month
                  </div>
                </div>
              </div>

              {/* Churn Rate */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Monthly Churn Rate</div>
                  <div className="text-sm text-gray-600">Subscription cancellations</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-red-600">2.3%</div>
                  <div className="text-sm text-green-600 flex items-center">
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                    -0.8% vs last month
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Opportunities & Forecasting */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Opportunities */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <Target className="h-5 w-5" />
              Growth Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="font-medium text-sm text-orange-800 dark:text-orange-200">
                  💡 Upsell Heavy Users
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  23 users near AI prompt limit
                </div>
                <div className="text-xs text-orange-700 font-medium">
                  Potential: +$68.77
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="font-medium text-sm text-orange-800 dark:text-orange-200">
                  🎯 Annual Conversion
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  18 monthly subscribers eligible
                </div>
                <div className="text-xs text-orange-700 font-medium">
                  Potential: +$215.64
                </div>
              </div>

              <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="font-medium text-sm text-orange-800 dark:text-orange-200">
                  🚀 Feature Upsell
                </div>
                <div className="text-xs text-orange-600 mt-1">
                  Advanced analytics interest
                </div>
                <div className="text-xs text-orange-700 font-medium">
                  Potential: +$149.85
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Forecast */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="h-5 w-5" />
              Revenue Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$1,685</div>
                <div className="text-sm text-blue-700">Projected Month End</div>
                <div className="text-xs text-blue-600">Based on current trends</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Current Progress</span>
                  <span className="font-medium">74%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '74%' }}></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-gray-600">Days Left</div>
                    <div className="font-medium">8 days</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Needed Daily</div>
                    <div className="font-medium">$54.75</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Sparkles className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                size="sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Send Upsell Campaign
              </Button>
              
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                size="sm"
              >
                <Crown className="w-4 h-4 mr-2" />
                Promote Annual Plans
              </Button>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white"
                size="sm"
              >
                <Target className="w-4 h-4 mr-2" />
                Feature Usage Analysis
              </Button>

              <Button 
                variant="outline"
                className="w-full border-purple-300 text-purple-600"
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Export Revenue Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}