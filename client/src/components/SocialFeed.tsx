import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart, MessageSquare, Share2, Flame, Trophy, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Activity {
  id: string;
  userId: number;
  type: "entry" | "achievement" | "streak";
  title: string;
  description: string;
  createdAt: string;
  metadata?: any;
  username?: string;
  avatar?: string;
}

export function SocialFeed() {
  const { data: personalFeed = [], isLoading: personalLoading } = useQuery<Activity[]>({
    queryKey: ["/api/social/feed/personal"]
  });

  const { data: globalFeed = [], isLoading: globalLoading } = useQuery<Activity[]>({
    queryKey: ["/api/social/feed/global"]
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "entry":
        return <BookOpen className="w-5 h-5 text-blue-500" />;
      case "achievement":
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case "streak":
        return <Flame className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "entry":
        return "from-blue-50 to-cyan-50";
      case "achievement":
        return "from-yellow-50 to-amber-50";
      case "streak":
        return "from-red-50 to-orange-50";
      default:
        return "from-gray-50 to-slate-50";
    }
  };

  const renderFeed = (activities: Activity[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-3 animate-pulse">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg" />
          ))}
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <Card className="p-12 bg-white/5 border-white/10 text-center">
          <p className="text-white/70">No activity yet. Follow friends to see their updates!</p>
        </Card>
      );
    }

    return (
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className={`bg-gradient-to-br ${getActivityColor(activity.type)} border-0 shadow-md hover:shadow-lg transition`}
              data-testid={`activity-${activity.id}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                      {activity.username?.[0].toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {activity.username || "User"}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200/50">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-gray-600 hover:text-red-600 gap-1"
                    data-testid={`like-${activity.id}`}
                  >
                    <Heart className="w-3 h-3" />
                    Like
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-gray-600 hover:text-blue-600 gap-1"
                    data-testid={`comment-${activity.id}`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    Comment
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-gray-600 hover:text-green-600 gap-1"
                    data-testid={`share-${activity.id}`}
                  >
                    <Share2 className="w-3 h-3" />
                    Share
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Following</TabsTrigger>
        <TabsTrigger value="global">Global</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="mt-4">
        {renderFeed(personalFeed, personalLoading)}
      </TabsContent>

      <TabsContent value="global" className="mt-4">
        {renderFeed(globalFeed, globalLoading)}
      </TabsContent>
    </Tabs>
  );
}
