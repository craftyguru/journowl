import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Share2, Heart, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  isFollowing?: boolean;
}

export function SocialFeatures() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch following list
  const { data: following = [] } = useQuery({
    queryKey: ["/api/social/following"],
    queryFn: async () => {
      const res = await fetch("/api/social/following", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: async (userId: number) => {
      return apiRequest("POST", "/api/social/follow", { userId });
    },
    onSuccess: (data: any) => {
      toast({
        title: data.isFollowing ? "Following!" : "Unfollowed",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social/following"] });
    },
  });

  // Share achievement mutation
  const shareMutation = useMutation({
    mutationFn: async (achievementId: string) => {
      return apiRequest("POST", "/api/social/share-achievement", { achievementId });
    },
    onSuccess: () => {
      toast({
        title: "Shared!",
        description: "Your achievement was shared with followers",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Social Hub</h2>
        </div>

        {/* Following Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{following.length}</div>
            <div className="text-xs text-gray-600">Following</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-gray-600">Followers</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs text-gray-600">Shares</div>
          </div>
        </div>

        {/* Following List */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Following</h3>
          {following.length === 0 ? (
            <p className="text-gray-600 text-sm">Start following users to see their achievements!</p>
          ) : (
            <div className="space-y-2">
              {following.map((user: User) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  data-testid={`social-user-${user.id}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{user.username}</p>
                    <p className="text-xs text-gray-600">Level {user.level} • {user.xp} XP</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => followMutation.mutate(user.id)}
                    disabled={followMutation.isPending}
                    data-testid={`button-unfollow-${user.id}`}
                  >
                    Unfollow
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Achievement */}
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Share Achievements</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Share your unlocked badges and milestones with your followers!
          </p>
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            data-testid="button-share-achievements"
            onClick={() => {
              toast({
                title: "Share Feature",
                description: "Share your latest achievement with followers!",
              });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Latest Achievement
          </Button>
        </div>
      </Card>
    </div>
  );
}
