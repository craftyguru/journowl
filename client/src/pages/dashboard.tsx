import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import JournalEntryModal from "@/components/journal-entry-modal";
import RecentEntries from "@/components/recent-entries";
import MoodTracker from "@/components/mood-tracker";
import ProgressCard from "@/components/progress-card";
import { type JournalEntry, type UserStats, type Achievement } from "@/lib/types";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>();

  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getCurrentUser,
  });

  const { data: statsResponse } = useQuery<{ stats: UserStats; achievements: Achievement[] }>({
    queryKey: ["/api/stats"],
  });

  const { data: insightResponse } = useQuery<{ insight: string }>({
    queryKey: ["/api/ai/insight"],
  });

  const user = userResponse?.user;
  const stats = statsResponse?.stats;
  const achievements = statsResponse?.achievements || [];

  const openNewEntry = () => {
    setEditingEntry(undefined);
    setIsModalOpen(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8 animate-fade-in">
        <Card className="gradient-bg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <CardContent className="p-8 relative z-10">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username}! 👋
            </h2>
            <p className="text-white/90 mb-4">Ready to capture your thoughts today?</p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Level {user?.level || 1}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-medium">{stats?.currentStreak || 0} day streak 🔥</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={openNewEntry}
            className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-4 h-auto font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Edit className="w-5 h-5 mr-2" />
            New Journal Entry
          </Button>
          <Button
            onClick={openNewEntry}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-white px-6 py-4 h-auto font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl mr-2">😊</span>
            Track Mood
          </Button>
          <Button
            onClick={openNewEntry}
            className="flex-1 bg-accent hover:bg-accent/90 text-white px-6 py-4 h-auto font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI Prompt
          </Button>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Entries */}
        <div className="lg:col-span-2">
          <RecentEntries onEditEntry={openEditEntry} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProgressCard />
          <MoodTracker onTrackMood={openNewEntry} />
          
          {/* Recent Achievements */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No achievements yet. Keep journaling!</p>
                ) : (
                  achievements.slice(0, 3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                      <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{achievement.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{achievement.title}</p>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      {insightResponse?.insight && (
        <div className="mt-8">
          <Card className="gradient-bg from-purple-500 to-pink-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">AI Insights</h3>
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-white/90 mb-4">{insightResponse.insight}</p>
              <Button
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                Get New Insight
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={openNewEntry}
        className="fixed bottom-6 right-6 z-50 gradient-bg text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        entry={editingEntry}
      />
    </div>
  );
}
