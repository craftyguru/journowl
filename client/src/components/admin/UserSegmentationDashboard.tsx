import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, Target, Plus, Edit2, Trash2, Send } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

interface Segment {
  id: string;
  name: string;
  description: string;
  userCount: number;
  targetFeatures: string[];
  createdAt: string;
}

export function UserSegmentationDashboard() {
  const { data: segments = [] } = useQuery<Segment[]>({
    queryKey: ["/api/admin/user-segments"]
  });

  const targetMutation = useMutation({
    mutationFn: async (data: { segmentId: string; feature: string }) => {
      const response = await fetch("/api/admin/user-segments/target", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/user-segments"] });
    }
  });

  const totalSegmentedUsers = segments.reduce((sum, s) => sum + s.userCount, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-blue-300">Total Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{segments.length}</div>
            <p className="text-xs text-blue-200 mt-1">Active user segments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-purple-300">Segmented Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalSegmentedUsers.toLocaleString()}</div>
            <p className="text-xs text-purple-200 mt-1">Users in segments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-green-300">Targeting Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">100%</div>
            <p className="text-xs text-green-200 mt-1">All users covered</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create New Segment */}
      <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Custom Segment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
            <Plus className="w-4 h-4 mr-2" />
            New Segment
          </Button>
        </CardContent>
      </Card>

      {/* Segments List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          User Segments
        </h3>

        <div className="grid gap-4">
          {segments.map((segment: any, idx: number) => (
            <motion.div
              key={segment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 hover:border-slate-600/50 transition">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white/10 rounded-lg mt-1">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <CardTitle className="text-sm">{segment.name}</CardTitle>
                        <CardDescription className="text-xs">{segment.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" data-testid={`button-edit-segment-${segment.id}`}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" data-testid={`button-delete-segment-${segment.id}`}>
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* User Count */}
                  <div className="flex justify-between items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-sm text-white/60">Users in segment</span>
                    <span className="font-semibold text-white">{segment.userCount.toLocaleString()}</span>
                  </div>

                  {/* Target Features */}
                  <div>
                    <p className="text-xs text-white/60 mb-2">Target Features</p>
                    <div className="flex flex-wrap gap-2">
                      {segment.targetFeatures.map((feature: string) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Campaign Button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-sm gap-2"
                    onClick={() => targetMutation.mutate({ segmentId: segment.id, feature: "email-campaign" })}
                    disabled={targetMutation.isPending}
                    data-testid={`button-target-segment-${segment.id}`}
                  >
                    <Send className="w-4 h-4" />
                    Send Campaign to Segment
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
