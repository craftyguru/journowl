import { motion } from "framer-motion";
import DashboardStats from "./DashboardStats";
import JournalEntriesList from "./JournalEntriesList";
import AchievementsGrid from "./AchievementsGrid";
import GoalsTracker from "./GoalsTracker";
import QuickActions from "./QuickActions";

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

interface DashboardOverviewProps {
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

export default function DashboardOverview({
  user,
  stats,
  entries,
  achievements,
  goals,
  onNewEntry,
  onNewGoal,
  onEntrySelect,
  onEntryDelete
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions onNewEntry={onNewEntry} />

      {/* Stats Cards */}
      <DashboardStats stats={stats} user={user} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <JournalEntriesList
            entries={entries}
            onEntrySelect={onEntrySelect}
            onEntryDelete={onEntryDelete}
          />
        </motion.div>

        {/* Goals Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GoalsTracker goals={goals} onNewGoal={onNewGoal} />
        </motion.div>
      </div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <AchievementsGrid achievements={achievements} />
      </motion.div>
    </div>
  );
}