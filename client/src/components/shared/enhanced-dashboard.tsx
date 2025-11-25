import React, { useState, useEffect, lazy, Suspense } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

// Eagerly loaded critical components
import { WelcomeBanner } from "../dashboard/WelcomeBanner";
import { StatsCards } from "../dashboard/StatsCards";
import { JournalTabs } from "../dashboard/JournalTabs";
import { UsageMetersSection } from "../dashboard/UsageMetersSection";
import { CameraCapture } from "../dashboard/CameraCapture";
import { NewGoalForm, GoalDetailsView, EditGoalForm } from "../dashboard/GoalComponents";
import { TypewriterTitle } from "../dashboard/TypewriterComponents";
import { VoiceJournal } from "../VoiceJournal";
import { WeeklySummary } from "../WeeklySummary";
import { AICoaching } from "../AICoaching";
import { PDFExport } from "../PDFExport";
import { SharedJournals } from "../SharedJournals";
import { ExtendedSummaries } from "../ExtendedSummaries";
import { SocialFeed } from "../SocialFeed";
import { GlobalLeaderboard } from "../GlobalLeaderboard";
import { WeatherMoodPrompt } from "../WeatherMoodPrompt";
import { AchievementBadges } from "../AchievementBadges";
import { ReminderNotification } from "../ReminderNotification";
import { TournamentsList } from "../TournamentsList";
import { StreakNotificationWidget } from "../StreakNotificationWidget";
import { DailyChallenges } from "../DailyChallenges";

// Lazy-loaded heavy tab components for code splitting
const AchievementsSection = lazy(() => import("../dashboard/AchievementsSection").then(m => ({ default: m.AchievementsSection })));
const GoalsSection = lazy(() => import("../dashboard/GoalsSection").then(m => ({ default: m.GoalsSection })));
const AnalyticsSection = lazy(() => import("../dashboard/AnalyticsSection").then(m => ({ default: m.AnalyticsSection })));
const AdvancedAnalytics = lazy(() => import("../dashboard/AdvancedAnalytics").then(m => ({ default: m.AdvancedAnalytics })));
const InsightsSection = lazy(() => import("../dashboard/InsightsSection").then(m => ({ default: m.InsightsSection })));
const CalendarSection = lazy(() => import("../dashboard/CalendarSection").then(m => ({ default: m.CalendarSection })));
const WeeklyChallengesCard = lazy(() => import("../dashboard/WeeklyChallengesCard").then(m => ({ default: m.WeeklyChallengesCard })));
const MoodTrendsChart = lazy(() => import("../dashboard/MoodTrendsChart").then(m => ({ default: m.MoodTrendsChart })));
const EmailRemindersPanel = lazy(() => import("../dashboard/EmailRemindersPanel").then(m => ({ default: m.EmailRemindersPanel })));
const ChallengeLeaderboard = lazy(() => import("../dashboard/ChallengeLeaderboard").then(m => ({ default: m.ChallengeLeaderboard })));
const AchievementBadges = lazy(() => import("../dashboard/AchievementBadges").then(m => ({ default: m.AchievementBadges })));
const SocialFeatures = lazy(() => import("../dashboard/SocialFeatures").then(m => ({ default: m.SocialFeatures })));
const StreakNotifications = lazy(() => import("../dashboard/StreakNotifications").then(m => ({ default: m.StreakNotifications })));

// Import hooks and data
import { useDashboardData } from "@/hooks/useDashboardData";
import { defaultAchievements } from "@/data/defaultAchievements";
import { defaultGoals } from "@/data/defaultGoals";
import { defaultChallenges } from "@/data/defaultChallenges";
import { useQuery } from "@tanstack/react-query";

// Lazy-loaded journal components
const InteractiveJournal = lazy(() => import("../journal/interactive-journal"));
const SmartJournalEditor = lazy(() => import("../smart-journal-editor"));
const UnifiedJournal = lazy(() => import("../journal/journal-entry-modal"));
const InteractiveCalendar = lazy(() => import("./interactive-calendar"));
const PromptPurchase = lazy(() => import("../PromptPurchase"));
const UsageMeters = lazy(() => import("../UsageMeters"));
const AIStoryMaker = lazy(() => import("../kid-dashboard/AIStoryMaker").then(m => ({ default: m.AIStoryMaker })));

// Eager-loaded critical utilities
import { MergedHelpSupportBubble } from "../MergedHelpSupportBubble";
import ErrorBoundary from "../shared/ErrorBoundary";
import { EnhancedErrorBoundary } from "../shared/EnhancedErrorBoundary";
import { useToast } from "@/hooks/use-toast";

// Loading skeleton component
const TabLoadingFallback = () => (
  <div className="space-y-6">
    <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse" />
    <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg animate-pulse" />
  </div>
);

import type { EnhancedDashboardProps, JournalEntry } from "../dashboard/types";

function EnhancedDashboard({ 
  onSwitchToKid, 
  initialTab = "journal", 
  onJournalStateChange 
}: EnhancedDashboardProps) {
  const { toast } = useToast();
  
  // State management
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
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  
  // Analytics Modal States
  const [showWordCloudModal, setShowWordCloudModal] = useState(false);
  const [showTimeHeatmapModal, setShowTimeHeatmapModal] = useState(false);
  const [showTopicAnalysisModal, setShowTopicAnalysisModal] = useState(false);
  const [wordCloudData, setWordCloudData] = useState<Array<{word: string, count: number}>>([]);
  const [timeAnalysisData, setTimeAnalysisData] = useState<any>(null);
  const [topicAnalysisData, setTopicAnalysisData] = useState<any>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch dashboard data
  const { user, stats, entries, achievements, goals, insights, subscription, promptUsage } = useDashboardData();
  
  // Fetch weekly challenges
  const { data: challenges = defaultChallenges } = useQuery({
    queryKey: ['/api/challenges'],
    queryFn: async () => {
      const res = await fetch('/api/challenges', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch challenges');
      return res.json();
    },
    staleTime: 5 * 60 * 1000
  });
  
  // Fetch mood trends data
  const { data: moodTrends = [] } = useQuery({
    queryKey: ['/api/mood-trends'],
    queryFn: async () => {
      const res = await fetch('/api/mood-trends', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch mood trends');
      return res.json();
    },
    staleTime: 10 * 60 * 1000
  });

  // Process achievements with real-time unlock checking
  const achievementsArray = Array.isArray(achievements) ? achievements : 
                           Array.isArray(defaultAchievements) ? defaultAchievements : [];
  const processedAchievements = achievementsArray.map((achievement: any) => {
    const shouldUnlock = 
      (achievement.title === "First Steps" && (stats?.totalEntries || 0) >= 1) ||
      (achievement.title === "Daily Writer" && (stats?.currentStreak || 0) >= 3) ||
      (achievement.title === "Word Explorer" && (stats?.totalWords || 0) >= 100) ||
      (achievement.title === "Weekly Warrior" && (stats?.currentStreak || 0) >= 7) ||
      (achievement.title === "Storyteller" && (stats?.totalWords || 0) >= 500) ||
      (achievement.title === "Monthly Champion" && (stats?.currentStreak || 0) >= 30) ||
      (achievement.title === "Novel Writer" && (stats?.totalWords || 0) >= 10000) ||
      (achievement.title === "Memory Keeper" && (stats?.totalEntries || 0) >= 100) ||
      (achievement.title === "Master Chronicler" && (stats?.totalWords || 0) >= 50000);
      
    return {
      ...achievement,
      unlockedAt: shouldUnlock && !achievement.unlockedAt ? new Date().toISOString() : achievement.unlockedAt
    };
  });

  // Notify parent about journal state changes
  useEffect(() => {
    onJournalStateChange?.(showUnifiedJournal);
  }, [showUnifiedJournal, onJournalStateChange]);

  // Update active tab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Scroll to top when dashboard component first mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Auto-scroll to top on first login and show intro tutorial
  useEffect(() => {
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

  // Auto-scroll to tab navigation when tab changes
  useEffect(() => {
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

  // Event handlers
  const handleSaveEntry = async (entryData: any) => {
    try {
      console.log('🎯 Enhanced Dashboard handleSaveEntry called!');
      console.log('Saving entry:', entryData);
      
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
      
      // Invalidate and refetch the journal entries
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
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    } catch (error: any) {
      console.error("Failed to delete journal entry:", error);
    }
  };

  const handleGoalCreate = () => {
    setShowNewGoalModal(true);
  };

  const handleGoalView = (goal: any) => {
    setSelectedGoal(goal);
    setShowGoalDetailsModal(true);
  };

  const handleGoalEdit = (goal: any) => {
    setSelectedGoal(goal);
    setShowEditGoalModal(true);
  };

  const handleGoalDelete = async (goalId: number) => {
    try {
      await apiRequest("DELETE", `/api/goals/${goalId}`);
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
    } catch (error) {
      console.error("Failed to delete goal:", error);
    }
  };

  const handleCameraCapture = (file: File, type: 'photo' | 'video') => {
    console.log('Camera captured:', { file, type });
    // Handle the captured media here
    setShowCameraCapture(false);
  };

  const handleRefreshInsights = async () => {
    try {
      await apiRequest("POST", "/api/insights/refresh");
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
    } catch (error) {
      console.error("Failed to refresh insights:", error);
    }
  };

  const handleWordCloudClick = () => {
    setShowWordCloudModal(true);
    // Generate word cloud data from entries
    const words: Record<string, number> = {};
    const entriesArray = Array.isArray(entries) ? entries : [];
    entriesArray.forEach(entry => {
      const content = entry.content || '';
      const cleanWords = content.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3);
      
      cleanWords.forEach(word => {
        words[word] = (words[word] || 0) + 1;
      });
    });
    
    const wordArray = Object.entries(words)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .map(([word, count]) => ({ word, count }));
    
    setWordCloudData(wordArray);
  };

  const handleTimeHeatmapClick = () => {
    setShowTimeHeatmapModal(true);
    // Generate time analysis data
    setTimeAnalysisData({ /* time analysis data */ });
  };

  const handleTopicAnalysisClick = () => {
    setShowTopicAnalysisModal(true);
    // Generate topic analysis data
    setTopicAnalysisData({ /* topic analysis data */ });
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'journal':
        return (
          <div className="space-y-6">
            <StreakNotificationWidget />
            <div className="flex justify-end">
              <Button
                onClick={() => setShowPDFExport(true)}
                variant="outline"
                size="sm"
                className="gap-2"
                data-testid="button-export-pdf"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
            </div>
            <WeatherMoodPrompt />
            <ExtendedSummaries />
            <WeeklySummary />
            <AICoaching />
            <VoiceJournal onEntryCreated={() => {
              queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
              queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
              queryClient.invalidateQueries({ queryKey: ["/api/journal/summaries"] });
              queryClient.invalidateQueries({ queryKey: ["/api/summaries/weekly"] });
              queryClient.invalidateQueries({ queryKey: ["/api/summaries/monthly"] });
            }} />
            <Suspense fallback={<TabLoadingFallback />}>
              <InteractiveJournal 
                onOpenSmartEditor={openSmartEditor}
                onOpenUnifiedJournal={openUnifiedJournal}
              />
            </Suspense>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <AdvancedAnalytics />
            </Suspense>
            <Suspense fallback={<TabLoadingFallback />}>
              <AnalyticsSection
                entries={Array.isArray(entries) ? entries : []}
                stats={stats || {}}
                onWordCloudClick={handleWordCloudClick}
                onTimeHeatmapClick={handleTimeHeatmapClick}
                onTopicAnalysisClick={handleTopicAnalysisClick}
              />
            </Suspense>
          </div>
        );

      case 'achievements':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <AchievementBadges />
          </Suspense>
        );

      case 'goals':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <GoalsSection
              goals={Array.isArray(goals) ? goals : []}
              onCreateGoal={handleGoalCreate}
              onEditGoal={handleGoalEdit}
              onDeleteGoal={handleGoalDelete}
              onViewGoal={handleGoalView}
            />
          </Suspense>
        );

      case 'thoughts':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <InsightsSection
              insights={insights || []}
              onRefreshInsights={handleRefreshInsights}
            />
          </Suspense>
        );

      case 'calendar':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <CalendarSection
              entries={entries}
              onDateSelect={handleDateSelect}
              onEntryEdit={handleEntryEdit}
            />
          </Suspense>
        );

      case 'stories':
        return (
          <div className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <AIStoryMaker 
                entries={Array.isArray(entries) ? entries : []} 
                stats={stats || {}}
              />
            </Suspense>
          </div>
        );

      case 'challenges':
        return (
          <div className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <DailyChallenges />
            </Suspense>
            <Suspense fallback={<TabLoadingFallback />}>
              <TournamentsList />
            </Suspense>
            <GlobalLeaderboard />
            <Suspense fallback={<TabLoadingFallback />}>
              <WeeklyChallengesCard 
                challenges={challenges} 
                onChallengeClick={(challenge) => console.log('Challenge clicked:', challenge)}
              />
              <MoodTrendsChart data={moodTrends} />
              <AchievementBadges />
              <EmailRemindersPanel />
            </Suspense>
          </div>
        );

      case 'social':
        return (
          <div className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <SocialFeed />
            </Suspense>
          </div>
        );

      case 'streaks':
        return (
          <div className="space-y-6">
            <Suspense fallback={<TabLoadingFallback />}>
              <StreakNotifications streak={stats?.currentStreak || 0} />
            </Suspense>
          </div>
        );

      case 'shared':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <SharedJournals />
          </Suspense>
        );

      case 'referral':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h2 className="text-2xl font-bold mb-4">Invite Friends & Earn Rewards</h2>
              <p className="text-gray-600 mb-6">Share JournOwl with friends and get bonus prompts when they join!</p>
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <code className="text-sm">https://journowl.app/invite/your-code</code>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">👥</div>
                  <div className="font-semibold">Friends Invited</div>
                  <div className="text-2xl font-bold text-blue-600">0</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="font-semibold">Bonus Prompts</div>
                  <div className="text-2xl font-bold text-green-600">0</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-semibold">Referral Level</div>
                  <div className="text-2xl font-bold text-purple-600">1</div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-20" data-testid="dashboard-container">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Stats Cards */}
        <StatsCards stats={stats || {}} />

        {/* Usage Meters */}
        <UsageMetersSection
          subscription={subscription || { tier: 'free', status: 'active' }}
          promptUsage={promptUsage || { promptsRemaining: 100, promptsUsedThisMonth: 0 }}
          onUpgrade={() => setShowPromptPurchase(true)}
        />
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-2 sm:px-4 pb-24 max-w-7xl">
        {renderTabContent()}
      </div>

      {/* Fixed Bottom Navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40" 
        data-testid="navigation-tabs"
        role="navigation"
        aria-label="Dashboard tabs"
      >
        <JournalTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            toast({
              title: "Tab Changed",
              description: `Switched to ${tab} view`,
              duration: 2000,
            });
          }}
        >
          <div></div>
        </JournalTabs>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showSmartEditor && (
          <SmartJournalEditor
            entry={selectedEntry}
            onClose={() => setShowSmartEditor(false)}
            onSave={handleSaveEntry}
          />
        )}

        {showUnifiedJournal && (
          <UnifiedJournal
            isOpen={showUnifiedJournal}
            onClose={() => setShowUnifiedJournal(false)}
            entry={selectedEntry}
          />
        )}

        {showPromptPurchase && (
          <PromptPurchase />
        )}

        {showNewGoalModal && (
          <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <NewGoalForm
                onClose={() => setShowNewGoalModal(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {showGoalDetailsModal && selectedGoal && (
          <Dialog open={showGoalDetailsModal} onOpenChange={setShowGoalDetailsModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Goal Details</DialogTitle>
              </DialogHeader>
              <GoalDetailsView
                goal={selectedGoal}
                onClose={() => setShowGoalDetailsModal(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {showEditGoalModal && selectedGoal && (
          <Dialog open={showEditGoalModal} onOpenChange={setShowEditGoalModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Goal</DialogTitle>
              </DialogHeader>
              <EditGoalForm
                goal={selectedGoal}
                onClose={() => setShowEditGoalModal(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {showWordCloudModal && (
          <Dialog open={showWordCloudModal} onOpenChange={setShowWordCloudModal}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Word Cloud Analysis</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {wordCloudData.map((item, index) => (
                    <div
                      key={index}
                      className="p-2 bg-blue-100 rounded text-center"
                      style={{ fontSize: `${Math.max(12, item.count * 2)}px` }}
                    >
                      {item.word}
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Camera Capture Component */}
      <CameraCapture
        isOpen={showCameraCapture}
        onClose={() => setShowCameraCapture(false)}
        onCapture={handleCameraCapture}
      />

      {/* PDF Export Component */}
      <PDFExport
        entries={Array.isArray(entries) ? entries : []}
        isOpen={showPDFExport}
        onClose={() => setShowPDFExport(false)}
      />
    </div>
    </EnhancedErrorBoundary>
  );
}

export default EnhancedDashboard;
