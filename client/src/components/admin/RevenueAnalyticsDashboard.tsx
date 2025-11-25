import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, PieChart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell } from "recharts";

interface RevenueMetrics {
  mrr: number;
  arr: number;
  totalUsers: number;
  freeUsers: number;
  proUsers: number;
  powerUsers: number;
  churnRate: number;
  upgradeRate: number;
  downgradeRate: number;
  averageRevenuePerUser: number;
  lifeTimeValue: number;
  netRevenue: number;
  trends: Array<{ date: string; mrr: number; users: number }>;
  topFeatures: Array<{ name: string; adoptionRate: number; revenue: number }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export function RevenueAnalyticsDashboard() {
  const { data: metrics } = useQuery<RevenueMetrics>({
    queryKey: ["/api/admin/revenue-metrics"]
  });

  if (!metrics) return null;

  const tierData = [
    { name: "Free", value: metrics.freeUsers, color: "#6b7280" },
    { name: "Pro", value: metrics.proUsers, color: "#3b82f6" },
    { name: "Power", value: metrics.powerUsers, color: "#8b5cf6" }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-green-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              MRR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${metrics.mrr.toLocaleString()}</div>
            <p className="text-xs text-green-200 mt-1">Monthly Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-300">ARR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${metrics.arr.toLocaleString()}</div>
            <p className="text-xs text-blue-200 mt-1">Annual Recurring Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-purple-300">ARPU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${metrics.averageRevenuePerUser.toFixed(2)}</div>
            <p className="text-xs text-purple-200 mt-1">Avg Revenue Per User</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-orange-300">LTV</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${metrics.lifeTimeValue.toFixed(2)}</div>
            <p className="text-xs text-orange-200 mt-1">Customer Lifetime Value</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Health Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-300">{metrics.churnRate}%</div>
            <p className="text-xs text-white/60 mt-1">Monthly churn</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Upgrade Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-300">{metrics.upgradeRate}%</div>
            <p className="text-xs text-white/60 mt-1">Free to paid conversion</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Downgrade Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-300">{metrics.downgradeRate}%</div>
            <p className="text-xs text-white/60 mt-1">Paid tier downgrades</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* MRR Trend */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm">12-Month MRR Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                <Line
                  type="monotone"
                  dataKey="mrr"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tier Distribution */}
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm">Subscription Tier Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie data={tierData}>
                {tierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Revenue Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-sm">Top Revenue-Driving Features</CardTitle>
            <CardDescription>Feature adoption & revenue attribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics.topFeatures}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="rgba(255,255,255,0.5)" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.2)" }} />
                <Bar dataKey="revenue" fill="#3b82f6" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Counts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Free Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{metrics.freeUsers.toLocaleString()}</div>
            <p className="text-xs text-white/60 mt-1">{((metrics.freeUsers / metrics.totalUsers) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pro Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-300">{metrics.proUsers.toLocaleString()}</div>
            <p className="text-xs text-white/60 mt-1">{((metrics.proUsers / metrics.totalUsers) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Power Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-300">{metrics.powerUsers.toLocaleString()}</div>
            <p className="text-xs text-white/60 mt-1">{((metrics.powerUsers / metrics.totalUsers) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
