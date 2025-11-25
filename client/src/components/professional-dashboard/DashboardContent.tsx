import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Sparkles } from "lucide-react";
import RecentEntries from "@/components/recent-entries";
import MoodTracker from "@/components/mood-tracker";
import ProgressCard from "@/components/progress-card";
import InteractiveCalendar from "@/components/shared/interactive-calendar";
import { type JournalEntry, type Achievement } from "@/lib/types";

interface DashboardContentProps {
  activeTab: "dashboard" | "calendar";
  entries: JournalEntry[];
  achievements: Achievement[];
  insightResponse: { insight: string } | undefined;
  onOpenNewEntry: () => void;
  onEditEntry: (entry: JournalEntry) => void;
  onDateSelect: (date: Date) => void;
  onTrackMood: () => void;
}

export const DashboardContent = ({
  activeTab,
  entries,
  achievements,
  insightResponse,
  onOpenNewEntry,
  onEditEntry,
  onDateSelect,
  onTrackMood,
}: DashboardContentProps) => {
  if (activeTab === "calendar") {
    return (
      <div className="h-[80vh]">
        <InteractiveCalendar 
          entries={entries.map(entry => ({
            ...entry,
            date: new Date(entry.createdAt)
          }))}
          onDateSelect={onDateSelect}
          onEntryEdit={onEditEntry as any}
        />
      </div>
    );
  }

  return (
    <>
      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onOpenNewEntry}
            className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-4 h-auto font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Edit className="w-5 h-5 mr-2" />
            New Journal Entry
          </Button>
          <Button
            onClick={onOpenNewEntry}
            className="flex-1 bg-secondary hover:bg-secondary/90 text-white px-6 py-4 h-auto font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <span className="text-xl mr-2">😊</span>
            Track Mood
          </Button>
          <Button
            onClick={onOpenNewEntry}
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
          <RecentEntries onEditEntry={onEditEntry} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProgressCard />
          <MoodTracker onTrackMood={onTrackMood} />
          
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
    </>
  );
};
