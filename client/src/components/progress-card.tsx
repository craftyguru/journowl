import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { type UserStats } from "@/lib/types";

export default function ProgressCard() {
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  const { data: statsResponse } = useQuery<{ stats: UserStats }>({
    queryKey: ["/api/stats"],
  });

  const user = userResponse?.user;
  const stats = statsResponse?.stats;

  if (!user || !stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentLevelXP = (user.level - 1) * 1000;
  const nextLevelXP = user.level * 1000;
  const progressPercent = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  const xpToNext = nextLevelXP - user.xp;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Level {user.level}</span>
              <span className="text-sm text-muted-foreground">{user.xp} XP</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {xpToNext} XP to next level
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{stats.totalEntries}</p>
              <p className="text-xs text-muted-foreground">Total Entries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-secondary">
                {stats.totalEntries > 0 ? Math.round(stats.totalWords / stats.totalEntries) : 0}
              </p>
              <p className="text-xs text-muted-foreground">Avg Words</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
