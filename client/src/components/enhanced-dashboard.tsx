import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  BookOpen, Plus, Camera, Mic, Sparkles, Brain, TrendingUp, 
  Target, Star, Heart, Clock, Calendar, Award, Trophy,
  Flame, Camera as CameraIcon, Brush, ChevronRight, Edit, Trash2
} from "lucide-react";
import SmartJournalEditor from "./smart-journal-editor";
import UnifiedJournal from "./unified-journal";
import InteractiveCalendar from "./interactive-calendar";
import PromptPurchase from "./PromptPurchase";
import UsageMeters from "./UsageMeters";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { AIStoryMaker } from "./kid-dashboard";

interface EnhancedDashboardProps {
  currentView?: string;
  onSwitchToKid?: () => void;
  onNavigate?: (view: string) => void;
}

export default function EnhancedDashboard({ currentView = "dashboard", onSwitchToKid, onNavigate }: EnhancedDashboardProps) {
  const [showSmartEditor, setShowSmartEditor] = useState(false);
  const [showUnifiedJournal, setShowUnifiedJournal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showPromptPurchase, setShowPromptPurchase] = useState(false);

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ["/api/auth/me"],
    staleTime: 15 * 60 * 1000,
    retry: false,
  });

  // Fetch user stats
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    staleTime: 30 * 1000,
  });

  // Fetch journal entries
  const { data: entries = [] } = useQuery({
    queryKey: ["/api/journal/entries"],
    staleTime: 60 * 1000,
  });

  // Fetch achievements 
  const { data: achievements = [] } = useQuery({
    queryKey: ["/api/achievements"],
    staleTime: 60 * 1000,
  });

  // Fetch goals
  const { data: goals = [] } = useQuery({
    queryKey: ["/api/goals"],
    staleTime: 60 * 1000,
  });

  const openUnifiedJournal = (entry?: any) => {
    setSelectedEntry(entry || null);
    setShowUnifiedJournal(true);
  };

  const handleSaveEntry = async (entryData: any) => {
    // Handle saving entry logic
    console.log("Saving entry:", entryData);
  };

  const handleDateSelect = (date: Date) => {
    console.log("Date selected:", date);
  };

  const capturePhoto = () => {
    console.log("Capturing photo...");
  };

  const recordAudio = () => {
    console.log("Recording audio...");
  };

  const calendarEntries = entries?.map((entry: any) => ({
    ...entry,
    date: new Date(entry.createdAt)
  })) || [];

  const handleEntryEdit = (entry: any) => {
    setSelectedEntry(entry);
    setShowUnifiedJournal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Header Stats */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6"
        >
          {/* Entries Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative bg-gradient-to-br from-blue-800/80 via-blue-700/70 to-blue-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-blue-400/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-300 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-blue-200 text-xs uppercase tracking-wider">Total</div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.totalEntries || 0}</div>
              <div className="text-blue-300 text-sm">Journal Entries</div>
            </div>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative bg-gradient-to-br from-red-800/80 via-red-700/70 to-red-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-red-400/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-red-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-300 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div className="text-red-200 text-xs uppercase tracking-wider">Days</div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.currentStreak || 0}</div>
              <div className="text-red-300 text-sm">Day Streak 🔥</div>
            </div>
          </motion.div>

          {/* Words Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative bg-gradient-to-br from-green-800/80 via-green-700/70 to-green-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-green-400/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-300 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="text-green-200 text-xs uppercase tracking-wider">Total</div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats?.totalWords?.toLocaleString() || 0}</div>
              <div className="text-green-300 text-sm">Words Written</div>
            </div>
          </motion.div>

          {/* XP Card */}
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5 }}
            className="relative bg-gradient-to-br from-amber-800/80 via-amber-700/70 to-amber-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-amber-400/30 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-amber-200 text-xs uppercase tracking-wider">XP</div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{user?.xp || 0}</div>
              <div className="text-amber-300 text-sm">Level {user?.level || 1} ✨</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Usage Meters - Always Visible */}
        <div className="mb-6">
          <UsageMeters />
        </div>

        {/* Horizontal Tab Navigation */}
        <div className="mb-6">
          <div className="relative w-full">
            <div className="flex overflow-x-auto scrollbar-hide bg-slate-800/95 backdrop-blur-lg border-2 border-purple-500/30 shadow-2xl rounded-lg p-2 gap-2">
              <button 
                onClick={() => onNavigate?.('dashboard')}
                className={`flex-shrink-0 min-w-[140px] h-12 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-transparent ${
                  currentView === 'dashboard' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                📊 Dashboard
              </button>
              <button 
                onClick={() => onNavigate?.('analytics')}
                className={`flex-shrink-0 min-w-[140px] h-12 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-transparent ${
                  currentView === 'analytics' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                📊 Analytics
              </button>
              <button 
                onClick={() => onNavigate?.('achievements')}
                className={`flex-shrink-0 min-w-[140px] h-12 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-transparent ${
                  currentView === 'achievements' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                🏆 Achievements
              </button>
              <button 
                onClick={() => onNavigate?.('goals')}
                className={`flex-shrink-0 min-w-[140px] h-12 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-transparent ${
                  currentView === 'goals' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                🎯 Goals
              </button>
              <button 
                onClick={() => onNavigate?.('stories')}
                className={`flex-shrink-0 min-w-[140px] h-12 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-transparent ${
                  currentView === 'stories' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                📚 AI Stories
              </button>
              <button 
                onClick={() => onNavigate?.('calendar')}
                className={`flex-shrink-0 min-w-[140px] h-12 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border-2 border-transparent ${
                  currentView === 'calendar' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg border-white/20' 
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/20'
                }`}
              >
                📅 Memory Calendar
              </button>
            </div>
            
            {/* Mobile scroll indicator */}
            <div className="md:hidden absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-1 px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-400/30">
                <span className="text-xs text-purple-300">←</span>
                <span className="text-xs text-purple-200 font-medium">Swipe</span>
                <span className="text-xs text-purple-300">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content based on currentView */}
        <div className="space-y-6">
          {currentView === "dashboard" && (
            <div className="space-y-6">
              {/* Smart Journal Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-2xl border border-purple-500/20"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">Smart Journal</h2>
                    <p className="text-gray-300 text-sm sm:text-base leading-tight">Your AI-powered writing companion with photo analysis and intelligent prompts</p>
                  </div>
                  <Button 
                    onClick={() => openUnifiedJournal()}
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 text-sm sm:text-base lg:text-lg"
                  >
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Open Journal Book
                  </Button>
                </div>
              </motion.div>

              {/* Recent Entries */}
              <Card className="bg-slate-800/95 backdrop-blur-lg border-purple-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Recent Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {entries?.length > 0 ? entries.slice(0, 5).map((entry: any, index: number) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => openUnifiedJournal(entry)}
                        className="p-4 bg-slate-700/50 rounded-lg border border-purple-500/20 hover:border-purple-400/40 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium group-hover:text-purple-300 transition-colors">{entry.title}</h4>
                            <p className="text-gray-400 text-sm mt-1 line-clamp-2">{entry.content}</p>
                            <div className="flex items-center gap-4 mt-3 text-xs">
                              <span className="text-purple-400">{new Date(entry.createdAt).toLocaleDateString()}</span>
                              {entry.mood && <span className="text-gray-500">Mood: {entry.mood}</span>}
                              <span className="text-gray-500">{entry.content?.length || 0} chars</span>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-3">📝</div>
                        <h3 className="text-white font-semibold mb-2">No entries yet</h3>
                        <p className="text-gray-400 text-sm mb-4">Start your journaling journey by creating your first entry</p>
                        <Button 
                          onClick={() => openUnifiedJournal()}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Write First Entry
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button 
                      onClick={() => openUnifiedJournal()}
                      variant="outline" 
                      className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Open Your Journal Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
              {/* Analytics content here */}
              <Card className="bg-slate-800/95 backdrop-blur-lg border-purple-500/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Writing Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">Detailed analytics coming soon...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {currentView === "achievements" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Achievements</h2>
              {/* Achievements content here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements?.map((achievement: any) => (
                  <Card key={achievement.id} className="bg-slate-800/95 backdrop-blur-lg border-purple-500/20 shadow-2xl">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-2">{achievement.icon}</div>
                        <h3 className="text-white font-semibold">{achievement.title}</h3>
                        <p className="text-gray-400 text-sm">{achievement.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentView === "goals" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Goals</h2>
              {/* Goals content here */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals?.map((goal: any) => (
                  <Card key={goal.id} className="bg-slate-800/95 backdrop-blur-lg border-purple-500/20 shadow-2xl">
                    <CardContent className="p-4">
                      <h3 className="text-white font-semibold">{goal.title}</h3>
                      <p className="text-gray-400 text-sm">{goal.description}</p>
                      <div className="mt-3 bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentView === "stories" && (
            <div className="h-[80vh]">
              <AIStoryMaker 
                entries={entries}
                stats={stats}
              />
            </div>
          )}

          {currentView === "calendar" && (
            <div className="h-[80vh]">
              <InteractiveCalendar 
                entries={calendarEntries}
                onDateSelect={handleDateSelect}
                onEntryEdit={handleEntryEdit}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
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

      {/* Floating Action Bubbles */}
      {!showSmartEditor && !showUnifiedJournal && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-6 z-50">
          <motion.button
            onClick={capturePhoto}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl border-4 border-white transition-all duration-200"
            title="Take Photo"
          >
            📸
          </motion.button>
          
          <motion.button
            onClick={recordAudio}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl border-4 border-white transition-all duration-200"
            title="Record Audio"
          >
            🎤
          </motion.button>
        </div>
      )}
    </div>
  );
}