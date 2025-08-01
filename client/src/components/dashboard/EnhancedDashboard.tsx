import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Import modular components
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsCards } from "./StatsCards";
import { JournalTabs } from "./JournalTabs";
import { UsageMetersSection } from "./UsageMetersSection";
import { AchievementsSection } from "./AchievementsSection";
import { GoalsSection } from "./GoalsSection";
import { AnalyticsSection } from "./AnalyticsSection";
import { InsightsSection } from "./InsightsSection";
import { CalendarSection } from "./CalendarSection";
import { CameraCapture } from "./CameraCapture";
import { NewGoalForm, GoalDetailsView, EditGoalForm } from "./GoalComponents";
import { TypewriterTitle } from "./TypewriterComponents";

// Import hooks and data
import { useDashboardData } from "@/hooks/useDashboardData";
import { defaultAchievements } from "@/data/defaultAchievements";
import { defaultGoals } from "@/data/defaultGoals";

// Import existing components that weren't refactored
import InteractiveJournal from "../interactive-journal";
import SmartJournalEditor from "../smart-journal-editor";
import UnifiedJournal from "../unified-journal";
import InteractiveCalendar from "../interactive-calendar";
import PromptPurchase from "../PromptPurchase";
import UsageMeters from "../UsageMeters";
import { AIStoryMaker } from "../kid-dashboard";
import { MergedHelpSupportBubble } from "../MergedHelpSupportBubble";
import ErrorBoundary from "../ErrorBoundary";

import type { EnhancedDashboardProps, JournalEntry } from "./types";

function EnhancedDashboard({ 
  onSwitchToKid, 
  initialTab = "journal", 
  onJournalStateChange 
}: EnhancedDashboardProps) {
  
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

  // Process achievements with real-time unlock checking
  const processedAchievements = (achievements || defaultAchievements).map((achievement: any) => {
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
    entries.forEach(entry => {
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
            <InteractiveJournal />
          </div>
        );

      case 'analytics':
        return (
          <AnalyticsSection
            entries={entries}
            stats={stats || {}}
            onWordCloudClick={handleWordCloudClick}
            onTimeHeatmapClick={handleTimeHeatmapClick}
            onTopicAnalysisClick={handleTopicAnalysisClick}
          />
        );

      case 'achievements':
        return (
          <AchievementsSection achievements={processedAchievements} />
        );

      case 'goals':
        return (
          <GoalsSection
            goals={goals || []}
            onCreateGoal={handleGoalCreate}
            onEditGoal={handleGoalEdit}
            onDeleteGoal={handleGoalDelete}
            onViewGoal={handleGoalView}
          />
        );

      case 'insights':
        return (
          <InsightsSection
            insights={insights || []}
            onRefreshInsights={handleRefreshInsights}
          />
        );

      case 'calendar':
        return (
          <CalendarSection
            entries={entries}
            onDateSelect={handleDateSelect}
            onEntryEdit={handleEntryEdit}
          />
        );

      case 'stories':
        return (
          <div className="space-y-6">
            <AIStoryMaker 
              entries={entries} 
              stats={stats || {}}
            />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Banner */}
        <WelcomeBanner
          user={user}
          onOpenJournal={openUnifiedJournal}
          onOpenCalendar={() => setActiveTab('calendar')}
          onOpenStories={() => setActiveTab('stories')}
        />

        {/* Stats Cards */}
        <StatsCards stats={stats || {}} />

        {/* Usage Meters */}
        <UsageMetersSection
          subscription={subscription || { tier: 'free', status: 'active' }}
          promptUsage={promptUsage || { promptsRemaining: 100, promptsUsedThisMonth: 0 }}
          onUpgrade={() => setShowPromptPurchase(true)}
        />

        {/* Tabbed Interface */}
        <JournalTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {renderTabContent()}
        </JournalTabs>

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
              entry={selectedEntry}
              onClose={() => setShowUnifiedJournal(false)}
              onSave={handleSaveEntry}
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
        </AnimatePresence>

        {/* Camera Capture Component */}
        <CameraCapture
          isOpen={showCameraCapture}
          onClose={() => setShowCameraCapture(false)}
          onCapture={handleCameraCapture}
        />

        {/* Analytics Modals */}
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
      </div>
    </div>
  );
}

// Main Enhanced Dashboard Export with Merged Help & Support
export default function EnhancedDashboardWithSupport({ 
  onSwitchToKid, 
  initialTab = "journal", 
  isJournalOpen = false 
}: EnhancedDashboardProps) {
  const [journalOpen, setJournalOpen] = useState(isJournalOpen);

  const handleJournalStateChange = (isOpen: boolean) => {
    setJournalOpen(isOpen);
  };

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}