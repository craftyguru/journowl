import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { AlertCircle, Zap, Lock, CheckCircle, Clock, X } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface FeatureToggle {
  name: string;
  enabled: boolean;
  userSegment: string;
  rolloutPercentage: number;
}

interface SystemAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  severity: string;
  timestamp: string;
  resolved: boolean;
}

export function AdminControlsPanel() {
  const { data: toggles = [] } = useQuery<FeatureToggle[]>({
    queryKey: ["/api/admin/feature-toggles"]
  });

  const { data: alerts = [] } = useQuery<SystemAlert[]>({
    queryKey: ["/api/admin/system-alerts"]
  });

  const toggleMutation = useMutation({
    mutationFn: async (data: { name: string; enabled: boolean; segment: string; rollout: number }) => {
      const response = await fetch("/api/admin/feature-toggles/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/feature-toggles"] });
    }
  });

  const resolveMutation = useMutation({
    mutationFn: async (alertId: string) => {
      const response = await fetch(`/api/admin/system-alerts/${alertId}/resolve`, {
        method: "POST",
        credentials: "include"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/system-alerts"] });
    }
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 border-red-500/50 text-red-300";
      case "high":
        return "bg-orange-500/20 border-orange-500/50 text-orange-300";
      case "medium":
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
      default:
        return "bg-blue-500/20 border-blue-500/50 text-blue-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Alerts */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-lg font-bold text-white">System Alerts</h3>
          <Badge variant="destructive">{alerts.filter(a => !a.resolved).length}</Badge>
        </div>

        {alerts.length === 0 ? (
          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300">All systems operational</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert: any) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-white mb-1">{alert.title}</h4>
                  <p className="text-sm text-white/70">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-white/60">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </div>
                {!alert.resolved && (
                  <Button
                    onClick={() => resolveMutation.mutate(alert.id)}
                    disabled={resolveMutation.isPending}
                    size="sm"
                    variant="ghost"
                    data-testid={`button-resolve-alert-${alert.id}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Feature Toggles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-white">Feature Controls</h3>
          <span className="text-xs text-white/60">({toggles.length} features)</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {toggles.map((toggle: any, idx: number) => (
            <motion.div
              key={toggle.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm capitalize">{toggle.name.replace("-", " ")}</CardTitle>
                    <Switch
                      checked={toggle.enabled}
                      onCheckedChange={(enabled) =>
                        toggleMutation.mutate({
                          name: toggle.name,
                          enabled,
                          segment: toggle.userSegment,
                          rollout: toggle.rolloutPercentage
                        })
                      }
                      disabled={toggleMutation.isPending}
                      data-testid={`toggle-feature-${toggle.name}`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* User Segment */}
                  <div>
                    <label className="text-xs text-white/60">Target Segment</label>
                    <Select
                      value={toggle.userSegment}
                      onValueChange={(segment) =>
                        toggleMutation.mutate({
                          name: toggle.name,
                          enabled: toggle.enabled,
                          segment,
                          rollout: toggle.rolloutPercentage
                        })
                      }
                    >
                      <SelectTrigger className="h-8 text-xs bg-white/5 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="free">Free Only</SelectItem>
                        <SelectItem value="pro">Pro+</SelectItem>
                        <SelectItem value="power">Power Only</SelectItem>
                        <SelectItem value="admin">Admin Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Rollout Percentage */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs text-white/60">Rollout</label>
                      <span className="text-xs font-semibold text-white">{toggle.rolloutPercentage}%</span>
                    </div>
                    <Slider
                      value={[toggle.rolloutPercentage]}
                      onValueChange={([rollout]) =>
                        toggleMutation.mutate({
                          name: toggle.name,
                          enabled: toggle.enabled,
                          segment: toggle.userSegment,
                          rollout
                        })
                      }
                      min={0}
                      max={100}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Status */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2 text-xs">
                      {toggle.enabled ? (
                        <>
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-green-300">Enabled</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-400 rounded-full" />
                          <span className="text-red-300">Disabled</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
