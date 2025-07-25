import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, Users, Target } from "lucide-react";
import DashboardOverview from "./DashboardOverview";
import AnalyticsTab from "./AnalyticsTab";
import ReferralTab from "./ReferralTab";

interface User {
  id: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  xp?: number;
  level?: number;
}

interface Stats {
  totalEntries: number;
  currentStreak: number;
  totalWords: number;
  averageMood: number;
  longestStreak: number;
  wordsThisWeek: number;
}

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
  photos?: Array<string> | Array<{ url: string; timestamp: string }>;
  drawings?: Array<any>;
  tags?: string[];
  date?: string;
  wordCount?: number;
  photoAnalysis?: any;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  unlockedAt: string | Date | null;
  type: string;
}

interface Goal {
  id: number;
  title: string;
  description: string;
  type: string;
  targetValue: number;
  currentValue: number;
  difficulty: string;
  isCompleted: boolean;
}

interface DashboardTabsProps {
  user: User;
  stats: Stats;
  entries: JournalEntry[];
  achievements: Achievement[];
  goals: Goal[];
  onNewEntry: () => void;
  onNewGoal: () => void;
  onEntrySelect: (entry: JournalEntry) => void;
  onEntryDelete?: (entryId: number) => void;
}

export default function DashboardTabs({
  user,
  stats,
  entries,
  achievements,
  goals,
  onNewEntry,
  onNewGoal,
  onEntrySelect,
  onEntryDelete
}: DashboardTabsProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-purple-500/20">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="referral" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200"
          >
            <Users className="w-4 h-4 mr-2" />
            Referral
          </TabsTrigger>
          <TabsTrigger 
            value="goals" 
            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200"
          >
            <Target className="w-4 h-4 mr-2" />
            Goals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" data-tabs-content>
          <DashboardOverview
            user={user}
            stats={stats}
            entries={entries}
            achievements={achievements}
            goals={goals}
            onNewEntry={onNewEntry}
            onNewGoal={onNewGoal}
            onEntrySelect={onEntrySelect}
            onEntryDelete={onEntryDelete}
          />
        </TabsContent>

        <TabsContent value="analytics" data-tabs-content>
          <AnalyticsTab entries={entries} stats={stats} />
        </TabsContent>

        <TabsContent value="referral" data-tabs-content>
          <ReferralTab user={user} />
        </TabsContent>

        <TabsContent value="goals" data-tabs-content>
          <div className="space-y-6">
            {/* Goals content will be implemented here */}
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Goals Tab</h3>
              <p className="text-sm text-muted-foreground">Goals management interface coming soon!</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}