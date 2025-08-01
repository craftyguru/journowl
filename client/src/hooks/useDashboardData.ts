import { useQuery } from "@tanstack/react-query";
import type { User, Stats, JournalEntry, Achievement, Goal, APIResponse } from "@/components/dashboard/types";

export function useDashboardData() {
  // Fetch real user data instead of hardcoded demo data
  const { data: userResponse } = useQuery<APIResponse<User>>({
    queryKey: ["/api/auth/me"],
  });
  
  const { data: statsResponse } = useQuery<APIResponse<Stats>>({
    queryKey: ["/api/stats"],
  });
  
  const { data: entriesResponse } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });
  
  const { data: achievementsResponse } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"],
  });
  
  const { data: goalsResponse } = useQuery<{ goals: Goal[] }>({
    queryKey: ["/api/goals"],
  });
  
  const { data: insightsResponse } = useQuery<{ insights: string[] }>({
    queryKey: ["/api/insights"],
  });
  
  const { data: subscriptionResponse } = useQuery<{
    tier: string;
    status: string;
    expiresAt?: string;
  }>({
    queryKey: ["/api/subscription"],
  });
  
  const { data: promptUsageResponse } = useQuery<{
    promptsRemaining: number;
    promptsUsedThisMonth: number;
  }>({
    queryKey: ["/api/prompts/usage"],
  });
  
  return {
    user: (userResponse as any)?.user,
    stats: (statsResponse as any)?.stats,
    entries: entriesResponse || [],
    achievements: achievementsResponse || [],
    goals: goalsResponse?.goals || [],
    insights: insightsResponse?.insights || [],
    subscription: subscriptionResponse,
    promptUsage: promptUsageResponse,
  };
}