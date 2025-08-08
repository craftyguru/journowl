import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb, Type, Brush, Plus, CheckCircle, ChevronLeft, ChevronRight, BarChart3, Trash2, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import InteractiveJournal from "./interactive-journal";
import SmartJournalEditor from "./smart-journal-editor";
import UnifiedJournal from "./unified-journal";
import InteractiveCalendar from "./interactive-calendar";
import PromptPurchase from "./PromptPurchase";
import UsageMeters from "./UsageMeters";
import { AIStoryMaker } from "./kid-dashboard";
import { MergedHelpSupportBubble } from "./MergedHelpSupportBubble";
import { TypewriterTitle } from "./dashboard/TypewriterComponents";
import { NewGoalForm, GoalDetailsView, EditGoalForm } from "./dashboard/GoalComponents";
import type { User, Stats, JournalEntry, Achievement, Goal, APIResponse, EnhancedDashboardProps } from "./dashboard/types";

// Creative Tools Suite Placeholder
const CreativeToolsSuite = ({ entries, stats }: { entries: any[], stats: any }) => (
  <div className="text-center py-8">
    <div className="text-4xl mb-4">🎨</div>
    <h3 className="text-xl font-bold text-gray-600 mb-2">Creative Tools Suite</h3>
    <p className="text-gray-500">Coming Soon!</p>
  </div>
);

function EnhancedDashboard({ onSwitchToKid, initialTab = "journal", onJournalStateChange }: EnhancedDashboardProps & { onJournalStateChange?: (isOpen: boolean) => void }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSmartEditor, setShowSmartEditor] = useState(false);
  const [showUnifiedJournal, setShowUnifiedJournal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showPromptPurchase, setShowPromptPurchase] = useState(false);
  const [showIntroTutorial, setShowIntroTutorial] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  
  // Analytics Modal States
  const [showWordCloudModal, setShowWordCloudModal] = useState(false);
  const [showTimeHeatmapModal, setShowTimeHeatmapModal] = useState(false);
  const [showTopicAnalysisModal, setShowTopicAnalysisModal] = useState(false);
  const [wordCloudData, setWordCloudData] = useState<Array<{word: string, count: number}>>([]);
  const [timeAnalysisData, setTimeAnalysisData] = useState<any>(null);
  const [topicAnalysisData, setTopicAnalysisData] = useState<any>(null);
  
  const queryClient = useQueryClient();
  
  // Notify parent about journal state changes
  useEffect(() => {
    onJournalStateChange?.(showUnifiedJournal);
  }, [showUnifiedJournal, onJournalStateChange]);
  
  // Helper function for theme colors
  const getThemeColor = (theme: string) => {
    const colors: Record<string, string> = {
      'Personal Growth': '#10b981',
      'Daily Life': '#3b82f6',
      'Relationships': '#f59e0b',
      'Dreams & Goals': '#8b5cf6',
      'Emotions & Feelings': '#ec4899',
      'Health & Wellness': '#06b6d4'
    };
    return colors[theme] || '#6b7280';
  };

  // Update active tab when initialTab prop changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Scroll to top when dashboard component first mounts
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Auto-scroll to top on first login and show intro tutorial
  React.useEffect(() => {
    const lastLoginTime = localStorage.getItem('lastDashboardLogin');
    const currentTime = Date.now();
    const isFirstLoginToday = !lastLoginTime || currentTime - parseInt(lastLoginTime) > 24 * 60 * 60 * 1000;

    if (isFirstLoginToday) {
      setIsFirstLogin(true);
      setShowIntroTutorial(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      localStorage.setItem('lastDashboardLogin', currentTime.toString());
    }
  }, []);

  // Auto-scroll to tab navigation when tab changes (for mobile navigation)
  React.useEffect(() => {
    const scrollToTabNavigation = () => {
      const tabsNavigation = document.querySelector('[role="tablist"]');
      if (tabsNavigation) {
        tabsNavigation.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start'
        });
      }
    };
    
    const timer = setTimeout(scrollToTabNavigation, 150);
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  // Fetch real user data
  const { data: userResponse } = useQuery<APIResponse<User>>({
    queryKey: ["/api/auth/me"],
  });
  
  const { data: statsResponse } = useQuery<APIResponse<Stats>>({
    queryKey: ["/api/stats"],
  });
  
  const { data: entriesResponse } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal/entries"],
  });
  
  const { data: achievementsResponse } = useQuery<APIResponse<Achievement[]>>({
    queryKey: ["/api/achievements"],
  });

  const { data: goalsResponse } = useQuery<APIResponse<Goal[]>>({
    queryKey: ["/api/goals"],
  });

  const { data: insightsResponse } = useQuery<APIResponse<any>>({
    queryKey: ["/api/insights"],
  });

  const { data: promptUsage } = useQuery<APIResponse<any>>({
    queryKey: ["/api/prompts/usage"],
  });
  
  const user = (userResponse as any)?.user || userResponse;
  
  const stats: Stats = (statsResponse as any)?.stats || statsResponse || {
    totalEntries: 0,
    currentStreak: 0,
    totalWords: 0,
    averageMood: 0,
    longestStreak: 0,
    wordsThisWeek: 0
  };

  const entries: JournalEntry[] = entriesResponse || [];
  
  // Default achievements - all start locked
  const defaultAchievements = [
    { id: 1, title: "First Steps", description: "Write your first journal entry", icon: "📝", rarity: "common", unlockedAt: null, type: "milestone" },
    { id: 2, title: "Daily Writer", description: "Write for 3 consecutive days", icon: "📅", rarity: "common", unlockedAt: null, type: "streak" },
    { id: 3, title: "Word Explorer", description: "Write 100 words in a single entry", icon: "📚", rarity: "common", unlockedAt: null, type: "writing" },
    { id: 4, title: "Mood Tracker", description: "Track your mood for 5 days", icon: "😊", rarity: "common", unlockedAt: null, type: "mood" },
    { id: 5, title: "Early Bird", description: "Write an entry before 9 AM", icon: "🌅", rarity: "common", unlockedAt: null, type: "time" },
    { id: 6, title: "Night Owl", description: "Write an entry after 10 PM", icon: "🌙", rarity: "common", unlockedAt: null, type: "time" },
    { id: 7, title: "Weekly Warrior", description: "Write every day for a week", icon: "⚔️", rarity: "rare", unlockedAt: null, type: "streak" },
    { id: 8, title: "Monthly Champion", description: "Write every day for 30 days", icon: "🏆", rarity: "epic", unlockedAt: null, type: "streak" }
  ];

  // Process achievements with real-time unlock checking
  const processedAchievements = ((achievementsResponse as any)?.achievements || achievementsResponse || defaultAchievements).map((achievement: Achievement) => {
    const shouldUnlock = 
      (achievement.title === "First Steps" && (stats?.totalEntries || 0) >= 1) ||
      (achievement.title === "Daily Writer" && (stats?.currentStreak || 0) >= 3) ||
      (achievement.title === "Word Explorer" && (stats?.totalWords || 0) >= 100) ||
      (achievement.title === "Weekly Warrior" && (stats?.currentStreak || 0) >= 7) ||
      (achievement.title === "Monthly Champion" && (stats?.currentStreak || 0) >= 30);
      
    return {
      ...achievement,
      unlockedAt: shouldUnlock && !achievement.unlockedAt ? new Date().toISOString() : achievement.unlockedAt
    };
  });

  const achievements: Achievement[] = processedAchievements;
  
  // Default goals - all start at zero progress
  const defaultGoals = [
    { id: 1, title: "Daily Writing", description: "Write at least one journal entry every day", type: "streak", targetValue: 7, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 2, title: "Word Count Goal", description: "Write at least 100 words per entry", type: "writing", targetValue: 100, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 3, title: "Mood Tracking", description: "Track your mood for 5 consecutive days", type: "mood", targetValue: 5, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 4, title: "Weekly Consistency", description: "Maintain a 7-day writing streak", type: "streak", targetValue: 7, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 5, title: "Monthly Champion", description: "Write every day for 30 days", type: "streak", targetValue: 30, currentValue: 0, difficulty: "advanced", isCompleted: false }
  ];

  const goals = (goalsResponse as any)?.goals || goalsResponse || defaultGoals;
  const insights = (insightsResponse as any)?.insights || insightsResponse || [];

  const handleSaveEntry = async (entryData: any) => {
    try {
      console.log('🎯 Enhanced Dashboard handleSaveEntry called!');
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }

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
      
      const response = await apiRequest("POST", "/api/journal/entries", cleanedData);
      console.log('API response received:', response.status);

      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      console.log('✅ Entry saved successfully, closing journal');
      setShowSmartEditor(false);
      setShowUnifiedJournal(false);
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const openSmartEditor = (entry?: any) => {
    setSelectedEntry(entry);
    setShowSmartEditor(true);
  };

  const openUnifiedJournal = (entry?: any) => {
    setSelectedEntry(entry);
    setShowUnifiedJournal(true);
  };

  const handleDateSelect = (date: Date) => {
    openUnifiedJournal();
  };

  const handleEntryEdit = (entry: any) => {
    openUnifiedJournal(entry);
  };

  const handleEntryDelete = async (entryId: number) => {
    try {
      const response = await fetch(`/api/journal/entries/${entryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
    } catch (error: any) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleGoalComplete = async (goalId: number) => {
    try {
      const response = await apiRequest("PATCH", `/api/goals/${goalId}`, {
        isCompleted: true
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      
    } catch (error) {
      console.error('Error completing goal:', error);
    }
  };

  // Create display entries with enhanced features
  const displayEntries = entries.map((entry, index) => {
    return {
      ...entry,
      isPinned: index === 0,
      isPrivate: index === 3,
      tags: entry.tags || []
    };
  });

  return (
    <div className="relative p-6 space-y-6 bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/20 min-h-screen overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-40 left-1/3 w-40 h-40 bg-gradient-to-r from-emerald-500/15 to-teal-500/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full blur-lg animate-bounce delay-500"></div>
      </div>
      
      {/* Interface Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-4 relative z-10"
      >
        <Card className="bg-slate-800/90 backdrop-blur-sm border border-purple-500/30 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-300">Adult Mode</span>
              <Switch 
                checked={false}
                onCheckedChange={onSwitchToKid}
                className="data-[state=checked]:bg-purple-500"
              />
              <span className="text-sm font-medium text-purple-300">Kid Mode</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mobile-Optimized Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center bg-gradient-to-br from-pink-400 via-orange-500 via-red-500 to-purple-600 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl border border-orange-300/30 overflow-hidden min-h-[160px] sm:min-h-[180px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-pink-600/30 via-orange-600/30 to-purple-700/30"></div>
        <div className="absolute top-2 left-4 w-8 h-8 bg-yellow-400/40 rounded-full blur-lg animate-pulse"></div>
        <div className="absolute bottom-2 right-4 w-6 h-6 bg-pink-400/40 rounded-full blur-md animate-bounce"></div>
        <div className="absolute top-6 right-8 w-4 h-4 bg-orange-400/50 rounded-full blur-sm animate-pulse delay-1000"></div>
        
        <motion.div
          className="absolute top-2 left-1/2 transform -translate-x-1/2"
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -10, 10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-2xl sm:text-3xl">🦉</div>
        </motion.div>
        
        <div className="relative z-10 mt-8 sm:mt-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TypewriterTitle />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white text-sm sm:text-base font-medium mt-2"
          >
            {user?.username ? `Welcome back, ${user.username}!` : 'Your daily journaling adventure awaits'}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
            className="flex justify-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm"
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
              <span className="text-white font-semibold">📅 {stats?.currentStreak || 0} day streak</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1">
              <span className="text-white font-semibold">📝 {stats?.totalEntries || 0} entries</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Based on Active Tab */}
      {activeTab === "journal" && (
        <div className="space-y-6">
          {/* Quick Actions Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-400" />
              Your Journal
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => openUnifiedJournal()}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-lg shadow-lg transition-all duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Write New Entry
              </Button>
              <Button
                onClick={() => openSmartEditor()}
                variant="outline"
                className="flex-1 border-purple-400/30 text-purple-300 hover:bg-purple-500/20 py-3 rounded-lg transition-all duration-200"
              >
                <Brain className="w-5 h-5 mr-2" />
                Smart Editor
              </Button>
            </div>
          </motion.div>

          {/* Recent Entries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📚 Recent Entries
            </h3>
            
            {displayEntries.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {displayEntries.slice(0, 6).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-slate-900/40 rounded-lg p-4 border border-purple-400/10 hover:border-purple-400/30 transition-all duration-200 cursor-pointer group"
                    onClick={() => handleEntryEdit(entry)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white text-sm truncate pr-2">
                        {entry.title || "Untitled Entry"}
                      </h4>
                      {entry.isPinned && (
                        <div className="text-yellow-400 text-xs">📌</div>
                      )}
                    </div>
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                      {entry.content?.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.mood || "😊"}</span>
                        <span className="text-gray-400 text-xs">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEntryDelete(entry.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📝</div>
                <h4 className="text-xl font-bold text-gray-400 mb-2">No entries yet</h4>
                <p className="text-gray-500 mb-4">Start your journaling journey today!</p>
                <Button
                  onClick={() => openUnifiedJournal()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Your First Entry
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Writing Analytics
            </h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-400/20">
                <div className="text-2xl font-bold text-purple-400">{stats?.totalEntries || 0}</div>
                <div className="text-sm text-gray-400">Total Entries</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-400/20">
                <div className="text-2xl font-bold text-blue-400">{stats?.currentStreak || 0}</div>
                <div className="text-sm text-gray-400">Current Streak</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/20">
                <div className="text-2xl font-bold text-green-400">{stats?.totalWords || 0}</div>
                <div className="text-sm text-gray-400">Total Words</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-400/20">
                <div className="text-2xl font-bold text-yellow-400">{stats?.longestStreak || 0}</div>
                <div className="text-sm text-gray-400">Best Streak</div>
              </div>
            </div>
            
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Analytics Dashboard</h3>
              <p className="text-gray-500">Detailed charts and insights coming soon!</p>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Achievements
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    achievement.unlockedAt 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-400/20' 
                      : 'bg-slate-900/40 border-gray-600/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-2xl ${!achievement.unlockedAt ? 'grayscale' : ''}`}>
                      {achievement.icon}
                    </span>
                    <div>
                      <h3 className={`font-bold ${achievement.unlockedAt ? 'text-yellow-400' : 'text-gray-400'}`}>
                        {achievement.title}
                      </h3>
                      <Badge variant={achievement.unlockedAt ? "default" : "secondary"} className="text-xs">
                        {achievement.rarity}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">
                    {achievement.description}
                  </p>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-yellow-400">
                      Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "goals" && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Personal Goals
              </h2>
              <Button
                onClick={() => setShowNewGoalModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Goal
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    goal.isCompleted 
                      ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/20' 
                      : 'bg-slate-900/40 border-purple-400/10 hover:border-purple-400/30'
                  }`}
                  onClick={() => {
                    setSelectedGoal(goal);
                    setShowGoalDetailsModal(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold ${goal.isCompleted ? 'text-green-400' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <Badge variant={goal.isCompleted ? "default" : "secondary"}>
                      {goal.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 mb-3">
                    {goal.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white">
                        {goal.currentValue}/{goal.targetValue}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.currentValue / goal.targetValue) * 100} 
                      className="h-2"
                    />
                  </div>
                  {!goal.isCompleted && goal.currentValue >= goal.targetValue && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGoalComplete(goal.id);
                      }}
                      className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "insights" && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              AI Insights
            </h2>
            
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">AI-Powered Insights</h3>
              <p className="text-gray-500 mb-4">Get personalized insights about your journal entries</p>
              <Button
                onClick={() => setShowPromptPurchase(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Insights
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {activeTab === "calendar" && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-400" />
              Memory Calendar
            </h2>
            <InteractiveCalendar
              entries={displayEntries}
              onDateSelect={handleDateSelect}
            />
          </motion.div>
        </div>
      )}

      {activeTab === "stories" && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-400" />
              AI Stories
            </h2>
            <CreativeToolsSuite entries={displayEntries} stats={stats} />
          </motion.div>
        </div>
      )}

      {/* Smart Journal Editor Modal */}
      <AnimatePresence>
        {showSmartEditor && (
          <SmartJournalEditor
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onClose={() => {
              setShowSmartEditor(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Unified Journal Book Experience */}
      <AnimatePresence>
        {showUnifiedJournal && (
          <UnifiedJournal
            entry={selectedEntry}
            onSave={handleSaveEntry}
            onClose={() => {
              setShowUnifiedJournal(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* New Goal Modal */}
      <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              <Target className="w-5 h-5" />
              Create New Goal
            </DialogTitle>
          </DialogHeader>
          <NewGoalForm onClose={() => setShowNewGoalModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Goal Details Modal */}
      <Dialog open={showGoalDetailsModal} onOpenChange={setShowGoalDetailsModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              <Target className="w-5 h-5" />
              Goal Details
            </DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <GoalDetailsView 
              goal={selectedGoal} 
              onEdit={() => {
                setShowGoalDetailsModal(false);
                setShowEditGoalModal(true);
              }}
              onClose={() => setShowGoalDetailsModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Goal Modal */}
      <Dialog open={showEditGoalModal} onOpenChange={setShowEditGoalModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              <Target className="w-5 h-5" />
              Edit Goal
            </DialogTitle>
          </DialogHeader>
          {selectedGoal && (
            <EditGoalForm 
              goal={selectedGoal}
              onClose={() => setShowEditGoalModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Prompt Purchase Modal */}
      <AnimatePresence>
        {showPromptPurchase && (
          <PromptPurchase onClose={() => setShowPromptPurchase(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// Main Enhanced Dashboard Export with Merged Help & Support
export default function EnhancedDashboardWithSupport({ onSwitchToKid, initialTab = "journal", isJournalOpen = false }: EnhancedDashboardProps) {
  const [journalOpen, setJournalOpen] = useState(isJournalOpen);

  const handleJournalStateChange = (isOpen: boolean) => {
    setJournalOpen(isOpen);
  };

  return (
    <div className="relative">
      <EnhancedDashboard 
        onSwitchToKid={onSwitchToKid} 
        initialTab={initialTab} 
        onJournalStateChange={handleJournalStateChange} 
      />
      
      {/* Fixed positioned support bubble in bottom right */}
      <div className="fixed bottom-6 right-6 z-50">
        <MergedHelpSupportBubble hideWhenJournalOpen={journalOpen} />
      </div>
    </div>
  );
}