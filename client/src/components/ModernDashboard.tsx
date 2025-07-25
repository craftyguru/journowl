import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Camera } from "lucide-react";

// Import modular components (temporarily comment out for fixing)
// import DashboardTabs from "./dashboard/DashboardTabs";
import SmartJournalEditor from "./smart-journal-editor";
import UnifiedJournal from "./unified-journal";
import InteractiveCalendar from "./interactive-calendar";
import PromptPurchase from "./PromptPurchase";
import UsageMeters from "./UsageMeters";
import { SupportChatBubble } from "./SupportChatBubble";
import NewGoalForm from "./NewGoalForm";

// Typewriter hook for animated text
const useTypewriter = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
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

  React.useEffect(() => {
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

// Type definitions for API responses
interface User {
  id: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
  profileImageUrl?: string;
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

interface ModernDashboardProps {
  onNavigate?: (tab: string) => void;
}

export default function ModernDashboard({ onNavigate }: ModernDashboardProps) {
  const queryClient = useQueryClient();
  
  // State management
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showSmartEditor, setShowSmartEditor] = useState(false);
  const [showUnifiedJournal, setShowUnifiedJournal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);

  // Fetch data from API endpoints with proper typing
  const { data: user } = useQuery<User>({
    queryKey: ['/api/auth/me'],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 15 * 60 * 1000,
    retry: false,
  });

  const { data: stats } = useQuery<Stats>({
    queryKey: ['/api/journal/stats'],
    staleTime: 5 * 60 * 1000,
  });

  const { data: entries = [] } = useQuery<JournalEntry[]>({
    queryKey: ['/api/journal/entries'],
    staleTime: 2 * 60 * 1000,
  });

  const { data: achievements = [] } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
    staleTime: 10 * 60 * 1000,
  });

  const { data: goals = [] } = useQuery<Goal[]>({
    queryKey: ['/api/goals'],
    staleTime: 5 * 60 * 1000,
  });

  // Event handlers
  const handleNewEntry = () => {
    setSelectedEntry(null);
    setShowSmartEditor(true);
  };

  const handleNewGoal = () => {
    setShowNewGoalModal(true);
  };

  const handleEntrySelect = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setShowSmartEditor(true);
  };

  const handleEntryDelete = async (entryId: number) => {
    try {
      const response = await fetch(`/api/journal/entries/${entryId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh entries after deletion
        queryClient.invalidateQueries({ queryKey: ['/api/journal/entries'] });
        queryClient.invalidateQueries({ queryKey: ['/api/journal/stats'] });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const handleSaveEntry = (entryData: any) => {
    // Refresh entries after saving
    queryClient.invalidateQueries({ queryKey: ['/api/journal/entries'] });
    queryClient.invalidateQueries({ queryKey: ['/api/journal/stats'] });
    setShowSmartEditor(false);
    setShowUnifiedJournal(false);
    setSelectedEntry(null);
  };

  const capturePhoto = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Handle photo capture logic here
      console.log('Photo capture initiated:', mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const recordAudio = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Handle audio recording logic here
      console.log('Audio recording initiated:', mediaStream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">
                <TypewriterTitle text="🦉 JournOwl Dashboard" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <UsageMeters />
              <PromptPurchase />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-300">
                  Welcome, {(user as any)?.firstName || (user as any)?.username || 'Journaler'}!
                </span>
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {((user as any)?.firstName?.[0] || (user as any)?.username?.[0] || 'J').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Overview */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
                <h3 className="text-sm text-gray-400 mb-1">Total Entries</h3>
                <p className="text-2xl font-bold text-white">{(stats as Stats)?.totalEntries || 0}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-6 border border-blue-400/20">
                <h3 className="text-sm text-gray-400 mb-1">Current Streak</h3>
                <p className="text-2xl font-bold text-white">{(stats as Stats)?.currentStreak || 0} days</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-6 border border-green-400/20">
                <h3 className="text-sm text-gray-400 mb-1">Total Words</h3>
                <p className="text-2xl font-bold text-white">{(stats as Stats)?.totalWords || 0}</p>
              </div>
              <div className="bg-slate-800/60 rounded-xl p-6 border border-yellow-400/20">
                <h3 className="text-sm text-gray-400 mb-1">Achievements</h3>
                <p className="text-2xl font-bold text-white">{achievements.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
            <h3 className="text-lg font-bold text-white mb-4">🚀 Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleNewEntry} 
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                ✍️ Write New Entry
              </Button>
              <Button 
                onClick={handleNewGoal} 
                variant="outline" 
                className="w-full border-purple-400 text-purple-300 hover:bg-purple-900"
              >
                🎯 Create New Goal
              </Button>
              <Button 
                onClick={() => setShowCalendar(true)} 
                variant="outline" 
                className="w-full border-blue-400 text-blue-300 hover:bg-blue-900"
              >
                📅 View Calendar
              </Button>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
            <h3 className="text-lg font-bold text-white mb-4">📝 Recent Entries</h3>
            <div className="space-y-3">
              {entries.slice(0, 3).map((entry: JournalEntry) => (
                <div 
                  key={entry.id} 
                  className="p-3 bg-slate-700/50 rounded-lg cursor-pointer hover:bg-slate-700/70 transition-colors"
                  onClick={() => handleEntrySelect(entry)}
                >
                  <h4 className="font-medium text-white text-sm truncate">{entry.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-purple-600/20 text-purple-300 px-2 py-1 rounded">
                      {entry.mood}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEntryDelete(entry.id);
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {entries.length === 0 && (
                <p className="text-gray-400 text-sm">No entries yet. Start writing!</p>
              )}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20">
            <h3 className="text-lg font-bold text-white mb-4">🎯 Active Goals</h3>
            <div className="space-y-3">
              {goals.slice(0, 3).map((goal: Goal) => (
                <div key={goal.id} className="p-3 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium text-white text-sm">{goal.title}</h4>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{goal.currentValue}/{goal.targetValue}</span>
                      <span>{Math.round((goal.currentValue / goal.targetValue) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-gray-400 text-sm">No goals set. Create your first goal!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Overlays */}
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

      <AnimatePresence>
        {showCalendar && (
          <InteractiveCalendar
            entries={entries as JournalEntry[]}
            onClose={() => setShowCalendar(false)}
            onEntrySelect={handleEntrySelect}
          />
        )}
      </AnimatePresence>

      {/* New Goal Modal */}
      <Dialog open={showNewGoalModal} onOpenChange={setShowNewGoalModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-700">
              🎯 Create New Goal
            </DialogTitle>
          </DialogHeader>
          <NewGoalForm onClose={() => setShowNewGoalModal(false)} />
        </DialogContent>
      </Dialog>

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

      {/* Support Chat */}
      <SupportChatBubble />
    </div>
  );
}

// New Goal Form Component
function NewGoalForm({ onClose }: { onClose: () => void }) {
  const [goalType, setGoalType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const trackableGoalTypes = [
    { value: "streak", label: "📅 Daily Writing Streak", description: "Track consecutive days of journaling", unit: "days" },
    { value: "words", label: "📝 Word Count Goal", description: "Reach a specific word count", unit: "words" },
    { value: "entries", label: "📚 Journal Entries", description: "Write a certain number of entries", unit: "entries" },
    { value: "mood", label: "😊 Mood Tracking", description: "Track mood for consecutive days", unit: "days" },
    { value: "photos", label: "📸 Photo Journaling", description: "Add photos to journal entries", unit: "photos" },
    { value: "reflection", label: "🧘 Deep Reflection", description: "Write thoughtful, reflective entries", unit: "entries" },
    { value: "creative", label: "🎨 Creative Writing", description: "Focus on creative expression", unit: "entries" },
    { value: "gratitude", label: "🙏 Gratitude Practice", description: "Write gratitude-focused entries", unit: "entries" },
    { value: "reading_time", label: "⏰ Reading Time", description: "Spend time reading past entries", unit: "minutes" },
    { value: "consistency", label: "⚡ Weekly Consistency", description: "Write at least X times per week", unit: "weeks" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating goal:", { goalType, title, description, targetValue, difficulty });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="goalType">Goal Type</Label>
          <Select value={goalType} onValueChange={setGoalType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a goal type" />
            </SelectTrigger>
            <SelectContent>
              {trackableGoalTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">🟢 Easy</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="hard">🔴 Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Goal Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your goal a name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you want to achieve"
          className="min-h-[80px]"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetValue">Target Value</Label>
        <Input
          id="targetValue"
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder="How many do you want to achieve?"
        />
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Create Goal
        </Button>
      </DialogFooter>
    </form>
  );
}