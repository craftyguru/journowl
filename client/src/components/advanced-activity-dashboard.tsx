import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Users, 
  Eye, 
  FileText, 
  Camera, 
  Sparkles, 
  Clock, 
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  MapPin
} from "lucide-react";

interface ActivityLog {
  id: number;
  userId: number;
  username: string;
  email: string;
  action: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface AdvancedActivityDashboardProps {
  activityLogs: ActivityLog[];
  refreshActivity: () => void;
}

export default function AdvancedActivityDashboard({ 
  activityLogs, 
  refreshActivity 
}: AdvancedActivityDashboardProps) {
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("24h");

  useEffect(() => {
    let filtered = activityLogs;

    // Filter by action type
    if (filterType !== "all") {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by time
    const now = new Date();
    let timeThreshold = new Date();
    
    switch (timeFilter) {
      case "1h":
        timeThreshold.setHours(now.getHours() - 1);
        break;
      case "24h":
        timeThreshold.setDate(now.getDate() - 1);
        break;
      case "7d":
        timeThreshold.setDate(now.getDate() - 7);
        break;
      case "30d":
        timeThreshold.setDate(now.getDate() - 30);
        break;
    }

    if (timeFilter !== "all") {
      filtered = filtered.filter(log => 
        new Date(log.createdAt) >= timeThreshold
      );
    }

    setFilteredLogs(filtered.slice(0, 100)); // Limit to 100 recent entries
  }, [activityLogs, filterType, searchTerm, timeFilter]);

  const getActionIcon = (action: string) => {
    if (action.includes("login")) return <Users className="w-4 h-4 text-green-600" />;
    if (action.includes("journal") || action.includes("entry")) return <FileText className="w-4 h-4 text-blue-600" />;
    if (action.includes("photo") || action.includes("image")) return <Camera className="w-4 h-4 text-purple-600" />;
    if (action.includes("ai") || action.includes("prompt")) return <Sparkles className="w-4 h-4 text-orange-600" />;
    if (action.includes("subscription") || action.includes("payment")) return <TrendingUp className="w-4 h-4 text-green-600" />;
    return <Activity className="w-4 h-4 text-gray-600" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes("login")) return "bg-green-100 text-green-800";
    if (action.includes("journal") || action.includes("entry")) return "bg-blue-100 text-blue-800";
    if (action.includes("photo")) return "bg-purple-100 text-purple-800";
    if (action.includes("ai") || action.includes("prompt")) return "bg-orange-100 text-orange-800";
    if (action.includes("error") || action.includes("failed")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent?.includes("Mobile") || userAgent?.includes("iPhone") || userAgent?.includes("Android")) {
      return <Smartphone className="w-3 h-3" />;
    }
    return <Monitor className="w-3 h-3" />;
  };

  const activityStats = {
    totalToday: filteredLogs.filter(log => {
      const today = new Date();
      const logDate = new Date(log.createdAt);
      return logDate.toDateString() === today.toDateString();
    }).length,
    uniqueUsers: new Set(filteredLogs.map(log => log.userId)).size,
    journalEntries: filteredLogs.filter(log => log.action.includes("journal") || log.action.includes("entry")).length,
    aiPrompts: filteredLogs.filter(log => log.action.includes("ai") || log.action.includes("prompt")).length,
  };

  return (
    <div className="mobile-spacing space-y-4 sm:space-y-6">
      {/* Activity Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">Total Activity Today</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-700">{activityStats.totalToday}</p>
              </div>
              <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Users</p>
                <p className="text-2xl font-bold text-green-700">{activityStats.uniqueUsers}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Journal Entries</p>
                <p className="text-2xl font-bold text-purple-700">{activityStats.journalEntries}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">AI Prompts Used</p>
                <p className="text-2xl font-bold text-orange-700">{activityStats.aiPrompts}</p>
              </div>
              <Sparkles className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-600" />
            Activity Filters & Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium">Search Users/Actions</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activity..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Filter by Action</label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">User Logins</SelectItem>
                  <SelectItem value="journal">Journal Activity</SelectItem>
                  <SelectItem value="ai">AI Prompts</SelectItem>
                  <SelectItem value="photo">Photo Uploads</SelectItem>
                  <SelectItem value="subscription">Subscriptions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={refreshActivity} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Activity Feed */}
      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            Live Activity Feed
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {filteredLogs.length} events
            </Badge>
          </CardTitle>
          <CardDescription>Real-time user actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No activity found for current filters</p>
                <p className="text-xs">Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{log.username}</span>
                      <Badge className={`text-xs ${getActionColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {log.email}
                    </p>
                    
                    {log.details && (
                      <div className="text-xs text-gray-500 bg-white dark:bg-gray-900 rounded p-2 mb-2">
                        <strong>Details:</strong> {JSON.stringify(log.details, null, 2)}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                      
                      {log.ipAddress && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {log.ipAddress}
                        </div>
                      )}
                      
                      {log.userAgent && (
                        <div className="flex items-center gap-1">
                          {getDeviceIcon(log.userAgent)}
                          {log.userAgent.includes("Mobile") ? "Mobile" : "Desktop"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Actions */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Most Common Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                filteredLogs.reduce((acc, log) => {
                  acc[log.action] = (acc[log.action] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([action, count]) => (
                  <div key={action} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getActionIcon(action)}
                      <span className="font-medium text-sm">{action}</span>
                    </div>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Active Users */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Most Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(
                filteredLogs.reduce((acc, log) => {
                  const key = `${log.username} (${log.email})`;
                  acc[key] = (acc[key] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([user, count]) => (
                  <div key={user} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-medium text-sm">{user.split(' (')[0]}</span>
                      <div className="text-xs text-gray-500">{user.split(' (')[1]?.replace(')', '')}</div>
                    </div>
                    <Badge variant="secondary">{count} actions</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}