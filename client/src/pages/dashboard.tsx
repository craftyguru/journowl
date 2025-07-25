import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Sparkles, Calendar } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import UnifiedJournal from "@/components/unified-journal";
import RecentEntries from "@/components/recent-entries";
import MoodTracker from "@/components/mood-tracker";
import ProgressCard from "@/components/progress-card";
import InteractiveCalendar from "@/components/interactive-calendar";
import { type JournalEntry, type UserStats, type Achievement } from "@/lib/types";
import { motion } from "framer-motion";

// Typewriter hook for animated text
const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
};

// TypewriterTitle component
const TypewriterTitle = ({ text }: { text: string }) => {
  const displayText = useTypewriter(text, 80);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span>
      {displayText}
      {showCursor && <span className="animate-pulse text-yellow-300">|</span>}
    </span>
  );
};

export default function Dashboard() {
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>();
  const [activeTab, setActiveTab] = useState<"dashboard" | "calendar">("dashboard");
  const queryClient = useQueryClient();

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

  const { data: entriesResponse } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });

  const user = userResponse?.user;
  const stats = statsResponse?.stats;
  const achievements = statsResponse?.achievements || [];
  const entries = entriesResponse || [];

  const openNewEntry = () => {
    setEditingEntry(undefined);
    setIsJournalOpen(true);
  };

  const openEditEntry = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsJournalOpen(true);
  };

  const closeJournal = () => {
    setIsJournalOpen(false);
    setEditingEntry(undefined);
  };

  const handleJournalSave = async (entryData: any) => {
    try {
      console.log('🎯 Dashboard handleJournalSave called!');
      console.log('Saving entry:', entryData);
      
      // Check if user is authenticated first
      if (!user) {
        console.error('User not authenticated');
        alert('Please refresh the page and log in again');
        return;
      }

      // Remove unnecessary fields that might cause issues
      const cleanedData = {
        title: entryData.title || "Untitled Entry",
        content: entryData.content || "",
        mood: entryData.mood || "😊",
        fontFamily: entryData.fontFamily || "Inter",
        fontSize: entryData.fontSize || 16,
        textColor: entryData.textColor || "#1f2937",
        backgroundColor: entryData.backgroundColor || "#ffffff",
        isPrivate: entryData.isPrivate || false,
        tags: entryData.tags || [],
        photos: entryData.photos || [],
        drawings: entryData.drawings || []
      };

      console.log('Sending API request with data:', cleanedData);

      let response;
      if (editingEntry) {
        // Update existing entry
        console.log('Updating existing entry:', editingEntry.id);
        response = await apiRequest("PUT", `/api/journal/entries/${editingEntry.id}`, cleanedData);
      } else {
        // Create new entry
        console.log('Creating new entry');
        console.log('Making POST request to /api/journal/entries');
        console.log('User authenticated, user ID:', user?.id);
        console.log('About to make apiRequest with method POST to /api/journal/entries');
        console.log('ApiRequest function available:', typeof apiRequest);
        
        try {
          response = await apiRequest("POST", "/api/journal/entries", cleanedData);
          console.log('ApiRequest completed successfully');
        } catch (apiError) {
          console.error('ApiRequest failed with error:', apiError);
          console.error('Error type:', typeof apiError);
          console.error('Error message:', apiError?.message);
          console.error('Error stack:', apiError?.stack);
          throw apiError;
        }
      }

      console.log('API response received:', response.status, response.statusText);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      // Invalidate and refetch the journal entries
      console.log('🔄 Invalidating queries to refresh dashboard...');
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      console.log('✅ Entry saved successfully, closing journal');
      closeJournal();
    } catch (error) {
      console.error('Error saving entry:', error);
      
      // Show user-friendly error message
      if (error.message.includes('401')) {
        alert('Authentication expired. Please refresh the page and log in again.');
      } else {
        alert(`Failed to save entry: ${error.message}`);
      }
      
      // Keep the journal open so user can try again
    }
  };

  const handleDateSelect = (date: Date) => {
    // Open journal for selected date
    openNewEntry();
  };

  const handleEntryEdit = (entry: JournalEntry) => {
    openEditEntry(entry);
  };

  return (
    <div className="mobile-container mobile-safe-area py-4 sm:py-6 lg:py-8">
      {/* Enhanced Welcome Section with Animated Owls */}
      <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in mobile-fade-in">
        <Card className="gradient-bg text-white relative overflow-hidden min-h-[280px]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-orange-400/20"></div>
          
          {/* Flying Animated Owls */}
          <motion.div
            animate={{ 
              x: [0, 300, 0], 
              y: [0, -20, -40, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-8 left-4 text-4xl z-20"
          >
            🦉
          </motion.div>
          
          <motion.div
            animate={{ 
              x: [400, 0, 400], 
              y: [0, -30, -60, -30, 0],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 3
            }}
            className="absolute top-12 right-8 text-3xl z-20"
          >
            🦉
          </motion.div>
          
          <motion.div
            animate={{ 
              x: [0, 150, 300, 150, 0], 
              y: [100, 80, 60, 80, 100],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 6
            }}
            className="absolute bottom-16 left-12 text-2xl z-20"
          >
            🦉
          </motion.div>
          
          {/* Floating Magical Elements */}
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-16 right-20 text-2xl z-10"
          >
            ✨
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              x: [0, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-20 right-16 text-xl z-10"
          >
            🌟
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 180, 360],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute top-24 left-32 text-lg z-10"
          >
            💫
          </motion.div>

          <CardContent className="p-8 relative z-30">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-3 leading-tight">
                <TypewriterTitle text={`🦉 Welcome back, ${user?.username || 'Wise Writer'}!`} />
              </h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="text-white/90 mb-6 text-lg"
              >
                Your wise JournOwl companion is ready to help capture today's thoughts and memories! ✨
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3, duration: 0.8 }}
                className="flex items-center space-x-4 flex-wrap gap-2"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-white/20 to-white/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
                >
                  <span className="text-sm font-medium">🏆 Level {user?.level || 1}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-orange-400/30 to-red-400/30 px-4 py-2 rounded-full backdrop-blur-sm border border-orange-300/30"
                >
                  <span className="text-sm font-medium">🔥 {stats?.currentStreak || 0} day streak</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-purple-400/30 to-pink-400/30 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-300/30"
                >
                  <span className="text-sm font-medium">📝 {stats?.totalEntries || 0} entries</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex bg-white rounded-lg p-1 shadow-sm border">
          <Button
            onClick={() => setActiveTab("dashboard")}
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`flex-1 ${activeTab === "dashboard" ? "gradient-bg text-white" : ""}`}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            onClick={() => setActiveTab("calendar")}
            variant={activeTab === "calendar" ? "default" : "ghost"}
            className={`flex-1 ${activeTab === "calendar" ? "gradient-bg text-white" : ""}`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Memory Calendar
          </Button>
        </div>
      </div>

      {activeTab === "dashboard" && (
        <>
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
        </>
      )}

      {activeTab === "calendar" && (
        <div className="h-[80vh]">
          <InteractiveCalendar 
            entries={entries.map(entry => ({
              ...entry,
              date: new Date(entry.createdAt)
            }))}
            onDateSelect={handleDateSelect}
            onEntryEdit={handleEntryEdit as any}
          />
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

      {/* Unified Journal */}
      {isJournalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 overflow-auto">
            <UnifiedJournal
              entry={editingEntry}
              onSave={handleJournalSave}
              onClose={closeJournal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
