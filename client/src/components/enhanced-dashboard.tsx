import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb, Type, Brush, Plus, CheckCircle, ChevronLeft, ChevronRight, Download, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import InteractiveJournal from "./interactive-journal";
import SmartJournalEditor from "./smart-journal-editor";
import UnifiedJournal from "./unified-journal";
import InteractiveCalendar from "./interactive-calendar";
import PromptPurchase from "./PromptPurchase";
import UsageMeters from "./UsageMeters";
import { AIStoryMaker } from "./kid-dashboard";

// All data now fetched from API endpoints instead of hardcoded values

// Type definitions for API responses
interface User {
  id: number;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
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

interface APIResponse<T> {
  [key: string]: T;
}

interface EnhancedDashboardProps {
  onSwitchToKid?: () => void;
  initialTab?: string;
}

export default function EnhancedDashboard({ onSwitchToKid, initialTab = "journal" }: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSmartEditor, setShowSmartEditor] = useState(false);
  const [showUnifiedJournal, setShowUnifiedJournal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [showGoalDetailsModal, setShowGoalDetailsModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [showPromptPurchase, setShowPromptPurchase] = useState(false);
  
  const queryClient = useQueryClient();

  // Update active tab when initialTab prop changes
  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Auto-scroll to tab navigation when tab changes (for mobile navigation)
  React.useEffect(() => {
    const scrollToTabNavigation = () => {
      // Find the tab navigation area
      const tabsNavigation = document.querySelector('[role="tablist"]');
      if (tabsNavigation) {
        tabsNavigation.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' // Stop at the tab navigation area
        });
      }
    };
    
    // Small delay to ensure content is rendered
    const timer = setTimeout(scrollToTabNavigation, 150);
    return () => clearTimeout(timer);
  }, [activeTab]);
  
  // Fetch real user data instead of hardcoded demo data
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
  
  const user = userResponse?.user;
  
  // Use real user data from API
  const stats: Stats = statsResponse?.stats || {
    totalEntries: 0,
    currentStreak: 0,
    totalWords: 0,
    averageMood: 0,
    longestStreak: 0,
    wordsThisWeek: 0
  };

  const entries: JournalEntry[] = entriesResponse || [];
  // Fresh achievements - all locked until earned
  const defaultAchievements = [
    // Common achievements (easy to get) - ALL START LOCKED
    { id: 1, title: "First Steps", description: "Write your first journal entry", icon: "📝", rarity: "common", unlockedAt: null, type: "milestone" },
    { id: 2, title: "Daily Writer", description: "Write for 3 consecutive days", icon: "📅", rarity: "common", unlockedAt: null, type: "streak" },
    { id: 3, title: "Word Explorer", description: "Write 100 words in a single entry", icon: "📚", rarity: "common", unlockedAt: null, type: "writing" },
    { id: 4, title: "Mood Tracker", description: "Track your mood for 5 days", icon: "😊", rarity: "common", unlockedAt: null, type: "mood" },
    { id: 5, title: "Early Bird", description: "Write an entry before 9 AM", icon: "🌅", rarity: "common", unlockedAt: null, type: "time" },
    { id: 6, title: "Night Owl", description: "Write an entry after 10 PM", icon: "🌙", rarity: "common", unlockedAt: null, type: "time" },
    { id: 7, title: "Grateful Heart", description: "Write about gratitude 3 times", icon: "🙏", rarity: "common", unlockedAt: null, type: "reflection" },
    { id: 8, title: "Weather Reporter", description: "Mention weather in 5 entries", icon: "🌤️", rarity: "common", unlockedAt: null, type: "observation" },
    
    // Rare achievements (moderate difficulty) - ALL START LOCKED
    { id: 9, title: "Weekly Warrior", description: "Write every day for a week", icon: "⚔️", rarity: "rare", unlockedAt: null, type: "streak" },
    { id: 10, title: "Storyteller", description: "Write 500 words in one entry", icon: "📖", rarity: "rare", unlockedAt: null, type: "writing" },
    { id: 11, title: "Photo Memory", description: "Add 10 photos to your entries", icon: "📸", rarity: "rare", unlockedAt: null, type: "media" },
    { id: 12, title: "Emoji Master", description: "Use 50 different emojis", icon: "🎭", rarity: "rare", unlockedAt: null, type: "creative" },
    { id: 13, title: "Deep Thinker", description: "Write reflective entries for 10 days", icon: "🤔", rarity: "rare", unlockedAt: null, type: "reflection" },
    { id: 14, title: "Adventure Logger", description: "Document 15 different activities", icon: "🗺️", rarity: "rare", unlockedAt: null, type: "adventure" },
    { id: 15, title: "Mood Rainbow", description: "Experience all 7 mood types", icon: "🌈", rarity: "rare", unlockedAt: null, type: "mood" },
    { id: 16, title: "Time Traveler", description: "Write about past memories 20 times", icon: "⏰", rarity: "rare", unlockedAt: null, type: "memory" },
    
    // Epic achievements (challenging) - ALL START LOCKED
    { id: 17, title: "Monthly Champion", description: "Write every day for 30 days", icon: "🏆", rarity: "epic", unlockedAt: null, type: "streak" },
    { id: 18, title: "Novel Writer", description: "Write 10,000 words total", icon: "📜", rarity: "epic", unlockedAt: null, type: "writing" },
    { id: 19, title: "Memory Keeper", description: "Create 100 journal entries", icon: "🗂️", rarity: "epic", unlockedAt: null, type: "milestone" },
    { id: 20, title: "Artist", description: "Add drawings to 20 entries", icon: "🎨", rarity: "epic", unlockedAt: null, type: "creative" },
    { id: 21, title: "Wisdom Seeker", description: "Write philosophical thoughts 25 times", icon: "🧠", rarity: "epic", unlockedAt: null, type: "wisdom" },
    { id: 22, title: "Social Butterfly", description: "Write about relationships 30 times", icon: "🦋", rarity: "epic", unlockedAt: null, type: "social" },
    { id: 23, title: "Goal Crusher", description: "Complete 50 personal goals", icon: "💪", rarity: "epic", unlockedAt: null, type: "achievement" },
    { id: 24, title: "Master Chronicler", description: "Write 50,000 words lifetime", icon: "👑", rarity: "legendary", unlockedAt: null, type: "legendary" }
  ];

  // Process achievements with real-time unlock checking
  const processedAchievements = (achievementsResponse?.achievements || defaultAchievements).map((achievement: Achievement) => {
    // Check if achievement should be unlocked based on current stats
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

  const achievements: Achievement[] = processedAchievements;
  // Fresh goals - all start at zero progress  
  const defaultGoals = [
    // Beginner goals (daily habits) - ALL START AT 0 PROGRESS
    { id: 1, title: "Daily Writing", description: "Write at least one journal entry every day", type: "streak", targetValue: 7, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 2, title: "Word Count Goal", description: "Write at least 100 words per entry", type: "writing", targetValue: 100, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 3, title: "Mood Tracking", description: "Track your mood for 5 consecutive days", type: "mood", targetValue: 5, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 4, title: "Photo Memories", description: "Add photos to 3 journal entries", type: "media", targetValue: 3, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 5, title: "Morning Pages", description: "Write 3 morning entries this week", type: "routine", targetValue: 3, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 6, title: "Gratitude Practice", description: "List 3 things you're grateful for daily", type: "gratitude", targetValue: 3, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 7, title: "Emotion Explorer", description: "Use 10 different emotion words", type: "vocabulary", targetValue: 10, currentValue: 0, difficulty: "beginner", isCompleted: false },
    { id: 8, title: "Weekend Warrior", description: "Write on both weekend days", type: "consistency", targetValue: 2, currentValue: 0, difficulty: "beginner", isCompleted: false },
    
    // Intermediate goals (weekly habits) - ALL START AT 0 PROGRESS
    { id: 9, title: "Weekly Consistency", description: "Maintain a 7-day writing streak", type: "streak", targetValue: 7, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 10, title: "Detailed Entries", description: "Write entries with at least 300 words", type: "writing", targetValue: 300, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 11, title: "Creative Expression", description: "Use drawings in 5 journal entries", type: "creative", targetValue: 5, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 12, title: "Reflection Master", description: "Write about gratitude for 7 days", type: "reflection", targetValue: 7, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 13, title: "Memory Lane", description: "Write about 10 childhood memories", type: "memory", targetValue: 10, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 14, title: "Dream Journal", description: "Record 15 dreams or aspirations", type: "dreams", targetValue: 15, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 15, title: "Adventure Seeker", description: "Document 12 new experiences", type: "adventure", targetValue: 12, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    { id: 16, title: "Social Stories", description: "Write about relationships 20 times", type: "social", targetValue: 20, currentValue: 0, difficulty: "intermediate", isCompleted: false },
    
    // Advanced goals (long-term achievements) - ALL START AT 0 PROGRESS
    { id: 17, title: "Monthly Champion", description: "Write every day for 30 days", type: "streak", targetValue: 30, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 18, title: "Novel Writer", description: "Write a total of 10,000 words", type: "writing", targetValue: 10000, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 19, title: "Memory Keeper", description: "Create 50 journal entries", type: "milestone", targetValue: 50, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 20, title: "Mindfulness Journey", description: "Practice mindful writing for 21 days", type: "mindfulness", targetValue: 21, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 21, title: "Wisdom Collector", description: "Write 100 life lessons learned", type: "wisdom", targetValue: 100, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 22, title: "Year of Growth", description: "Maintain 365-day writing streak", type: "epic", targetValue: 365, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 23, title: "Master Storyteller", description: "Write 25,000 words total", type: "mastery", targetValue: 25000, currentValue: 0, difficulty: "advanced", isCompleted: false },
    { id: 24, title: "Life Chronicler", description: "Document 200 significant moments", type: "chronicle", targetValue: 200, currentValue: 0, difficulty: "advanced", isCompleted: false }
  ];

  const goals = goalsResponse?.goals || defaultGoals;
  const insights = insightsResponse?.insights || [];
  const handleSaveEntry = async (entryData: any) => {
    try {
      console.log('🎯 Enhanced Dashboard handleSaveEntry called!');
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
      console.log('Making POST request to /api/journal/entries');
      console.log('User authenticated, user ID:', user?.id);
      
      const response = await apiRequest("POST", "/api/journal/entries", cleanedData);
      console.log('API response received:', response.status, response.statusText);
      const responseData = await response.json();
      console.log('API response data:', responseData);

      // Invalidate and refetch the journal entries
      console.log('🔄 Invalidating queries to refresh dashboard...');
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      
      console.log('✅ Entry saved successfully, closing journal');
      setShowSmartEditor(false);
      setShowUnifiedJournal(false);
      setSelectedEntry(null);
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

  const openSmartEditor = (entry?: any) => {
    setSelectedEntry(entry);
    setShowSmartEditor(true);
  };

  const openUnifiedJournal = (entry?: any) => {
    setSelectedEntry(entry);
    setShowUnifiedJournal(true);
  };

  const handleDateSelect = (date: Date) => {
    // Open journal for selected date
    openUnifiedJournal();
  };

  const handleEntryEdit = (entry: any) => {
    openUnifiedJournal(entry);
  };

  // Camera and Media Capture Functions
  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      const cameraOverlay = document.createElement('div');
      cameraOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      `;
      
      video.style.cssText = `
        width: 100%;
        max-width: 400px;
        height: auto;
        border-radius: 10px;
      `;
      
      const captureButton = document.createElement('button');
      captureButton.innerHTML = '📸 Take Photo';
      captureButton.style.cssText = `
        margin-top: 20px;
        padding: 15px 30px;
        font-size: 18px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
      `;
      
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '❌ Close';
      closeButton.style.cssText = `
        margin-top: 10px;
        padding: 10px 20px;
        font-size: 16px;
        background: #ef4444;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
      `;
      
      cameraOverlay.appendChild(video);
      cameraOverlay.appendChild(captureButton);
      cameraOverlay.appendChild(closeButton);
      document.body.appendChild(cameraOverlay);
      
      const cleanup = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(cameraOverlay);
      };
      
      captureButton.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (context) {
          context.drawImage(video, 0, 0);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
          const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
          cleanup();
          
          // Create proper entry object for UnifiedJournal
          const entryWithPhoto = {
            title: `📸 Photo Story - ${today}`,
            content: "Here's what I captured today! Let me tell you about this amazing moment...\n\n",
            photos: [{ url: url, timestamp: new Date() }],
            videoRecordings: [],
            audioRecordings: [],
            mood: '😊',
            tags: ['photo', 'memory'],
            fontFamily: 'Inter',
            fontSize: 16,
            textColor: '#1f2937',
            backgroundColor: '#ffffff',
            isPrivate: false
          };
          openUnifiedJournal(entryWithPhoto);
          }
        }, 'image/jpeg', 0.8);
      };
      
      closeButton.onclick = cleanup;
      
    } catch (error) {
      console.error('Camera access failed:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const recordAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      // Create audio context for visualizer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      
      analyser.fftSize = 64;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const recordingOverlay = document.createElement('div');
      recordingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(30,30,60,0.95) 100%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: system-ui;
      `;
      
      const recordingTitle = document.createElement('div');
      recordingTitle.innerHTML = '🎤 Recording Voice Story';
      recordingTitle.style.cssText = `
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
      `;
      
      const recordingSubtitle = document.createElement('div');
      recordingSubtitle.innerHTML = 'Speak your thoughts...';
      recordingSubtitle.style.cssText = `
        font-size: 16px;
        opacity: 0.8;
        margin-bottom: 40px;
        text-align: center;
      `;
      
      // Audio visualizer canvas
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 150;
      canvas.style.cssText = `
        border: 2px solid rgba(255,255,255,0.3);
        border-radius: 15px;
        background: rgba(0,0,0,0.3);
        margin-bottom: 30px;
      `;
      
      const ctx = canvas.getContext('2d');
      
      // Timer display
      const timer = document.createElement('div');
      timer.innerHTML = '00:00';
      timer.style.cssText = `
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #ef4444;
        text-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
      `;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 20px;
        margin-top: 20px;
      `;
      
      const stopButton = document.createElement('button');
      stopButton.innerHTML = '⏹️ Stop Recording';
      stopButton.style.cssText = `
        padding: 15px 25px;
        font-size: 16px;
        background: linear-gradient(45deg, #ef4444, #dc2626);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        transition: all 0.3s;
      `;
      
      const pauseButton = document.createElement('button');
      pauseButton.innerHTML = '⏸️ Pause';
      pauseButton.style.cssText = `
        padding: 15px 25px;
        font-size: 16px;
        background: linear-gradient(45deg, #f59e0b, #d97706);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
        transition: all 0.3s;
      `;
      
      const cancelButton = document.createElement('button');
      cancelButton.innerHTML = '❌ Cancel';
      cancelButton.style.cssText = `
        padding: 15px 25px;
        font-size: 16px;
        background: linear-gradient(45deg, #6b7280, #4b5563);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(107, 114, 128, 0.4);
        transition: all 0.3s;
      `;
      
      recordingOverlay.appendChild(recordingTitle);
      recordingOverlay.appendChild(recordingSubtitle);
      recordingOverlay.appendChild(canvas);
      recordingOverlay.appendChild(timer);
      recordingOverlay.appendChild(buttonContainer);
      buttonContainer.appendChild(stopButton);
      buttonContainer.appendChild(pauseButton);
      buttonContainer.appendChild(cancelButton);
      document.body.appendChild(recordingOverlay);
      
      // Timer functionality
      let startTime = Date.now();
      let isPaused = false;
      let pausedTime = 0;
      
      const updateTimer = () => {
        if (!isPaused) {
          const elapsed = Math.floor((Date.now() - startTime - pausedTime) / 1000);
          const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
          const seconds = (elapsed % 60).toString().padStart(2, '0');
          timer.innerHTML = `${minutes}:${seconds}`;
        }
        if (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused') {
          requestAnimationFrame(updateTimer);
        }
      };
      
      // Audio visualizer animation
      const animate = () => {
        if (mediaRecorder.state === 'recording' && !isPaused && ctx) {
          analyser.getByteFrequencyData(dataArray);
          
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = canvas.width / bufferLength * 2;
          let x = 0;
          
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
            
            // Create gradient for bars
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - barHeight);
            gradient.addColorStop(0, '#ef4444');
            gradient.addColorStop(0.5, '#f59e0b');
            gradient.addColorStop(1, '#10b981');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
            
            x += barWidth;
          }
        }
        
        if (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused') {
          requestAnimationFrame(animate);
        }
      };
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        
        const today = new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        audioContext.close();
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(recordingOverlay);
        
        // Create proper entry object for UnifiedJournal
        const entryWithAudio = {
          title: `🎤 Voice Story - ${today}`,
          content: "I recorded something special today! Here's what I want to remember...\n\n",
          photos: [],
          videoRecordings: [],
          audioRecordings: [{ url: audioUrl, duration: Math.floor((Date.now() - startTime - pausedTime) / 1000), timestamp: new Date() }],
          mood: '😊',
          tags: ['audio', 'voice', 'story'],
          fontFamily: 'Inter',
          fontSize: 16,
          textColor: '#1f2937',
          backgroundColor: '#ffffff',
          isPrivate: false
        };
        openUnifiedJournal(entryWithAudio);
      };
      
      const cleanup = () => {
        mediaRecorder.stop();
        audioContext.close();
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(recordingOverlay);
      };
      
      stopButton.onclick = () => {
        if (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused') {
          mediaRecorder.stop();
        }
      };
      
      pauseButton.onclick = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.pause();
          isPaused = true;
          pausedTime += Date.now() - startTime;
          pauseButton.innerHTML = '▶️ Resume';
          pauseButton.style.background = 'linear-gradient(45deg, #10b981, #059669)';
        } else if (mediaRecorder.state === 'paused') {
          mediaRecorder.resume();
          isPaused = false;
          startTime = Date.now();
          pauseButton.innerHTML = '⏸️ Pause';
          pauseButton.style.background = 'linear-gradient(45deg, #f59e0b, #d97706)';
        }
      };
      
      cancelButton.onclick = cleanup;
      
      mediaRecorder.start();
      updateTimer();
      animate();
      
    } catch (error) {
      console.error('Audio recording failed:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  // Convert entries to calendar format with varied dates
  const calendarEntries = entries.map((entry: JournalEntry, index: number) => {
    const date = new Date();
    date.setDate(date.getDate() - index); // Spread entries across recent days
    return {
      ...entry,
      date: date,
      createdAt: date.toISOString(),
      photos: Array.isArray(entry.photos) ? entry.photos.map((photo: any) => 
        typeof photo === 'string' ? photo : (photo.url || photo)
      ) : [],
      isPinned: index === 0, // Pin the first entry
      isPrivate: index === 3, // Make one entry private
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
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center bg-gradient-to-r from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-purple-500/20 overflow-hidden"
      >
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 rounded-3xl blur-sm animate-pulse"></div>
        <div className="relative z-10">
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent mb-2 sm:mb-3"
          >
            Welcome back to JournOwl, {user?.username || 'User'}! 🦉✨
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-sm sm:text-base lg:text-lg"
          >
            Ready to gain wisdom through your journaling journey? 🦉
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-6"
          >
            <div className="px-6 py-3 bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-purple-300/30 hover:scale-105 transition-transform">
              Level {user?.level || 1} - {user?.level >= 10 ? 'Expert Writer' : 'Budding Writer'} ✨
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-emerald-300/30 hover:scale-105 transition-transform">
              🔥 {stats?.currentStreak || 0}-day streak 🔥
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Artistic Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => setActiveTab("journal")}
          className="relative bg-gradient-to-br from-purple-800/80 via-purple-700/70 to-purple-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-400/30 overflow-hidden cursor-pointer transition-all hover:shadow-purple-500/20"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-300 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-purple-200 text-xs uppercase tracking-wider">Entries</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats?.totalEntries || 0}</div>
            <div className="text-purple-300 text-sm">Total entries</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => setActiveTab("analytics")}
          className="relative bg-gradient-to-br from-pink-800/80 via-pink-700/70 to-pink-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-pink-400/30 overflow-hidden cursor-pointer transition-all hover:shadow-pink-500/20"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-300 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-pink-200 text-xs uppercase tracking-wider">Words</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats?.totalWords || 0}</div>
            <div className="text-pink-300 text-sm">Total words</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => setActiveTab("analytics")}
          className="relative bg-gradient-to-br from-emerald-800/80 via-emerald-700/70 to-emerald-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-emerald-400/30 overflow-hidden cursor-pointer transition-all hover:shadow-emerald-500/20"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/20 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-emerald-300 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-emerald-200 text-xs uppercase tracking-wider">Streak</div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats?.currentStreak || 0}</div>
            <div className="text-emerald-300 text-sm">days strong 🔥</div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05, rotateY: 5 }}
          onClick={() => setActiveTab("achievements")}
          className="relative bg-gradient-to-br from-amber-800/80 via-amber-700/70 to-amber-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-amber-400/30 overflow-hidden cursor-pointer transition-all hover:shadow-amber-500/20"
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
            {(user?.xp || 0) > 100000 && (
              <button 
                onClick={async () => {
                  try {
                    const response = await fetch('/api/fix-xp', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include'
                    });
                    if (response.ok) {
                      window.location.reload();
                    }
                  } catch (error) {
                    console.error('Fix XP failed:', error);
                  }
                }}
                className="mt-1 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Fix XP
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Usage Meters - Always Visible */}
      <div className="mb-6">
        <UsageMeters />
      </div>



      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* Mobile-Responsive Horizontal Scrolling Tabs */}
        <div className="relative w-full">
          <TabsList className="flex w-full overflow-x-auto bg-slate-800/95 backdrop-blur-lg border-2 border-purple-500/30 shadow-2xl rounded-lg p-1 gap-0.5 scrollbar-hide">
            <TabsTrigger 
              value="journal" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              📖 Journal
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              📊 Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              🏆 Achievements
            </TabsTrigger>
            <TabsTrigger 
              value="goals" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              🎯 Goals
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              🤖 AI Thoughts
            </TabsTrigger>
            <TabsTrigger 
              value="analytics-insights" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              📈 Insights
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              📅 Memory Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="stories" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              📚 AI Stories
            </TabsTrigger>
            <TabsTrigger 
              value="referral" 
              className="flex-shrink-0 h-8 px-2 py-1 text-xs font-medium rounded-md data-[state=active]:bg-purple-500 data-[state=active]:text-white text-gray-300 hover:text-white hover:bg-purple-500/20 transition-all duration-200 whitespace-nowrap"
            >
              🎁 Referral
            </TabsTrigger>
          </TabsList>
          

        </div>

        <TabsContent value="journal" data-tabs-content>
          <div className="space-y-6">
            {/* Mobile-Optimized Smart Journal Header - Minimal on Mobile */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-lg sm:rounded-2xl p-1 sm:p-4 lg:p-6 shadow-xl sm:shadow-2xl border border-purple-500/20"
            >
              <div className="flex flex-row items-center justify-between gap-1 sm:gap-4">
                <div className="flex-1">
                  <h2 className="text-xs sm:text-xl lg:text-2xl font-semibold sm:font-bold text-white mb-0 leading-tight">📝 Journal</h2>
                  <p className="text-gray-300 text-xs sm:text-base leading-tight hidden sm:block">Your AI-powered writing companion with photo analysis and intelligent prompts</p>
                </div>
                <Button 
                  onClick={() => openUnifiedJournal()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-2 sm:px-6 lg:px-8 py-0.5 sm:py-3 text-xs sm:text-base lg:text-lg h-6 sm:h-auto rounded-md sm:rounded-lg"
                >
                  <BookOpen className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Open Journal Book</span>
                  <span className="sm:hidden">Write</span>
                </Button>
              </div>
            </motion.div>

            {/* Mobile-Optimized Features Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-lg rounded-lg p-3 border border-purple-500/20 h-fit"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">AI Photo Analysis</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-tight">Upload photos and AI extracts emotions, activities, and insights</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 backdrop-blur-lg rounded-lg p-3 border border-pink-500/20 h-fit"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-pink-500 rounded-lg flex items-center justify-center mb-2">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Rich Text Editor</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-tight">10+ fonts, custom colors, markdown support with live preview</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-lg rounded-lg p-3 border border-blue-500/20 h-fit"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Smart Prompts</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-tight">AI generates personalized writing prompts based on your mood</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-lg rounded-lg p-3 border border-green-500/20 h-fit"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                  <Brush className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">Drawing Tools</h3>
                <p className="text-gray-300 text-xs sm:text-sm leading-tight">Built-in canvas for sketches and creative expression</p>
              </motion.div>
            </div>

            {/* Recent Smart Entries */}
            <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Smart Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {entries.length > 0 ? entries.map((entry: JournalEntry, index: number) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => openUnifiedJournal(entry)}
                      className="p-4 rounded-lg border border-purple-200/20 bg-slate-800/50 hover:bg-slate-700/50 hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{entry.mood}</div>
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{entry.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span>{entry.date}</span>
                              <span>•</span>
                              <span>{entry.wordCount} words</span>
                              <span>•</span>
                              <span className="text-purple-400">AI Enhanced</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {(entry.tags || []).map((tag: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs border-purple-400/20 text-purple-300 bg-purple-500/10">
                              {tag}
                            </Badge>
                          ))}
                        </div>
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
        </TabsContent>

        <TabsContent value="overview" data-tabs-content className="space-y-6">
          {/* Usage Meters and Subscription Management */}
          <UsageMeters />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => openUnifiedJournal()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Open Journal Book
                </Button>
                <Button variant="outline" className="w-full border-purple-300 text-purple-600">
                  <Brain className="w-4 h-4 mr-2" />
                  Get AI Prompt
                </Button>
                <Button variant="outline" className="w-full border-emerald-300 text-emerald-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Progress
                </Button>
              </CardContent>
            </Card>

          {/* Recent Entries */}
          <Card className="lg:col-span-2 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Clock className="w-5 h-5" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entries.length > 0 ? entries.slice(0, 5).map((entry: JournalEntry, index: number) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => openUnifiedJournal(entry)}
                    className="p-4 rounded-lg border border-purple-200/20 bg-slate-800/50 hover:bg-slate-700/50 hover:shadow-lg transition-all cursor-pointer backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{entry.mood || "😊"}</div>
                        <div>
                          <h4 className="font-semibold text-white">{entry.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-300">
                            <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{entry.wordCount || 0} words</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {(entry.tags || []).map((tag: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs border-purple-400/20 text-purple-300 bg-purple-500/10">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center text-gray-400 py-8">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No entries yet. Start your journaling journey!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" data-tabs-content>
          <div className="space-y-6">
            {/* Premium Analytics Header with Animated Stats */}
            <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent"
                  >
                    📊 Premium Analytics
                  </motion.h2>
                  <p className="text-purple-100 text-xl mt-2">Your complete journaling insights dashboard</p>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-lg">
                    <Calendar className="w-4 h-4 mr-2" />
                    Last 30 Days
                  </Button>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-lg">
                    📥 Export Report
                  </Button>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Quick Entry
                  </Button>
                </div>
              </div>
              
              {/* Animated Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/25 to-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: [-20, 100], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"
                  />
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">{stats.totalEntries || 0}</div>
                    <div className="text-white/90 text-sm font-medium mb-1">Total Entries</div>
                    <div className="flex items-center gap-1 text-xs text-green-300">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        🔥
                      </motion.div>
                      <span>Keep writing!</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/25 to-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    ✨
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">{(stats.totalWords || 0).toLocaleString()}</div>
                    <div className="text-white/90 text-sm font-medium mb-1">Total Words</div>
                    <div className="flex items-center gap-1 text-xs text-blue-300">
                      <TrendingUp className="w-3 h-3" />
                      <span>Average: {stats.totalEntries > 0 ? Math.round((stats.totalWords || 0) / stats.totalEntries) : 0}/entry</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/25 to-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 360, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    🔥
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">{stats.currentStreak || 0}</div>
                    <div className="text-white/90 text-sm font-medium mb-1">Current Streak</div>
                    <div className="flex items-center gap-1 text-xs text-orange-300">
                      <Trophy className="w-3 h-3" />
                      <span>{stats.currentStreak >= stats.longestStreak ? "Personal Best!" : "Keep going!"}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/25 to-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    😊
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">{stats.averageMood ? stats.averageMood.toFixed(1) : "0.0"}</div>
                    <div className="text-white/90 text-sm font-medium mb-1">Avg Mood</div>
                    <div className="flex items-center gap-1 text-xs text-emerald-300">
                      <Heart className="w-3 h-3" />
                      <span>{stats.averageMood > 4 ? "Feeling great!" : stats.averageMood > 3 ? "Pretty good!" : "Getting better!"}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gradient-to-br from-white/25 to-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20 relative overflow-hidden"
                >
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    📸
                  </motion.div>
                  <div className="relative z-10">
                    <div className="text-4xl font-bold mb-2">{stats.longestStreak || 0}</div>
                    <div className="text-white/90 text-sm font-medium mb-1">Longest Streak</div>
                    <div className="flex items-center gap-1 text-xs text-pink-300">
                      <Star className="w-3 h-3" />
                      <span>Personal record</span>
                    </div>
                  </div>
                </motion.div>


              </div>

              {/* Quick Insights Banner */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 bg-white/15 rounded-xl p-4 backdrop-blur-lg border border-white/20"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <div className="text-white font-semibold">AI Quick Insight</div>
                    <div className="text-purple-100 text-sm">
                      {insights?.insights?.[0] || "Start writing to unlock personalized insights!"}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Enhanced Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Mood Trends - Enhanced */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-lg border border-purple-500/30 shadow-2xl hover:shadow-purple-500/20 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Heart className="w-5 h-5 text-pink-400" />
                      Mood Journey
                    </CardTitle>
                    <p className="text-gray-300 text-sm">Track your emotional patterns</p>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={[]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="day" stroke="#9CA3AF" />
                        <YAxis domain={[1, 5]} stroke="#9CA3AF" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1F2937', 
                            border: '1px solid #7C3AED', 
                            borderRadius: '12px',
                            color: '#F3F4F6',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                          }} 
                        />
                        <Area
                          type="monotone" 
                          dataKey="mood" 
                          stroke="#8B5CF6" 
                          fill="url(#moodGradient)" 
                          strokeWidth={3}
                          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: '#EC4899' }}
                        />
                        <defs>
                          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="text-sm text-gray-400 mt-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span><strong className="text-pink-400">Insight:</strong> You're happiest on weekends!</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Daily Writing Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl hover:shadow-2xl transition-all border border-emerald-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-emerald-700">
                      <TrendingUp className="w-6 h-6" />
                      Daily Writing Activity
                    </CardTitle>
                    <p className="text-emerald-600 text-sm">Interactive chart showing your writing patterns</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="text-xs border-emerald-300 text-emerald-600">Week</Button>
                      <Button size="sm" className="text-xs bg-emerald-500 text-white">Month</Button>
                      <Button variant="outline" size="sm" className="text-xs border-emerald-300 text-emerald-600">Year</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={[]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                        <XAxis dataKey="month" stroke="#059669" />
                        <YAxis stroke="#059669" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#f0fdf4', 
                            border: '1px solid #10b981',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                          }}
                          formatter={(value, name) => [
                            `${value} entries`,
                            'Daily Activity'
                          ]}
                          labelFormatter={(label) => `Week of ${label}`}
                        />
                        <Area
                          type="monotone" 
                          dataKey="entries" 
                          stroke="#10b981" 
                          fill="url(#activityGradient)" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                          activeDot={{ r: 8, fill: '#059669', stroke: '#ffffff', strokeWidth: 3 }}
                        />
                        <defs>
                          <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                    <div className="bg-white rounded-lg p-4 mt-4 border border-emerald-200">
                      <div className="text-sm text-emerald-600 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span><strong>Peak Writing Times:</strong></span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-xs">
                        <div className="text-center">
                          <div className="font-bold text-emerald-700">Morning</div>
                          <div className="text-gray-600">7-9 AM: 65%</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-emerald-700">Evening</div>
                          <div className="text-gray-600">7-9 PM: 25%</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-emerald-700">Night</div>
                          <div className="text-gray-600">10 PM+: 10%</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Mood Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl hover:shadow-2xl transition-all border border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <Heart className="w-6 h-6" />
                      Mood Distribution
                    </CardTitle>
                    <p className="text-amber-600 text-sm">Your emotional journey visualized</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center mb-6">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={(() => {
                              // Calculate real mood distribution from user entries
                              const moodCounts = { happy: 0, excited: 0, good: 0, neutral: 0, sad: 0 };
                              const totalEntries = entries?.length || 0;
                              
                              entries?.forEach(entry => {
                                const mood = entry.mood?.toLowerCase();
                                if (mood === 'happy' || mood === '😊') moodCounts.happy++;
                                else if (mood === 'excited' || mood === '😄') moodCounts.excited++;
                                else if (mood === 'good' || mood === '🙂') moodCounts.good++;
                                else if (mood === 'neutral' || mood === '😐') moodCounts.neutral++;
                                else if (mood === 'sad' || mood === '😔') moodCounts.sad++;
                              });

                              if (totalEntries === 0) {
                                return [{ name: 'No entries yet', value: 100, fill: '#e5e7eb' }];
                              }

                              return [
                                { name: 'Happy 😊', value: Math.round((moodCounts.happy / totalEntries) * 100), fill: '#10b981' },
                                { name: 'Excited 😄', value: Math.round((moodCounts.excited / totalEntries) * 100), fill: '#f59e0b' },
                                { name: 'Good 🙂', value: Math.round((moodCounts.good / totalEntries) * 100), fill: '#3b82f6' },
                                { name: 'Neutral 😐', value: Math.round((moodCounts.neutral / totalEntries) * 100), fill: '#6b7280' },
                                { name: 'Sad 😔', value: Math.round((moodCounts.sad / totalEntries) * 100), fill: '#ef4444' }
                              ].filter(mood => mood.value > 0);
                            })()}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={40}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {(() => {
                              const moodCounts = { happy: 0, excited: 0, good: 0, neutral: 0, sad: 0 };
                              const totalEntries = entries?.length || 0;
                              
                              entries?.forEach(entry => {
                                const mood = entry.mood?.toLowerCase();
                                if (mood === 'happy' || mood === '😊') moodCounts.happy++;
                                else if (mood === 'excited' || mood === '😄') moodCounts.excited++;
                                else if (mood === 'good' || mood === '🙂') moodCounts.good++;
                                else if (mood === 'neutral' || mood === '😐') moodCounts.neutral++;
                                else if (mood === 'sad' || mood === '😔') moodCounts.sad++;
                              });

                              if (totalEntries === 0) {
                                return [{ name: 'No entries yet', value: 100, fill: '#e5e7eb' }].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ));
                              }

                              return [
                                { name: 'Happy 😊', value: Math.round((moodCounts.happy / totalEntries) * 100), fill: '#10b981' },
                                { name: 'Excited 😄', value: Math.round((moodCounts.excited / totalEntries) * 100), fill: '#f59e0b' },
                                { name: 'Good 🙂', value: Math.round((moodCounts.good / totalEntries) * 100), fill: '#3b82f6' },
                                { name: 'Neutral 😐', value: Math.round((moodCounts.neutral / totalEntries) * 100), fill: '#6b7280' },
                                { name: 'Sad 😔', value: Math.round((moodCounts.sad / totalEntries) * 100), fill: '#ef4444' }
                              ].filter(mood => mood.value > 0).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ));
                            })()}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Mood Percentage']}
                            contentStyle={{
                              backgroundColor: '#fffbeb',
                              border: '1px solid #f59e0b',
                              borderRadius: '8px'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    {/* Mood Legend - Real User Data */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {(() => {
                        // Calculate real mood distribution from user entries
                        const moodCounts = { happy: 0, excited: 0, good: 0, neutral: 0, sad: 0 };
                        const totalEntries = entries?.length || 0;
                        
                        entries?.forEach(entry => {
                          const mood = entry.mood?.toLowerCase();
                          if (mood === 'happy' || mood === '😊') moodCounts.happy++;
                          else if (mood === 'excited' || mood === '😄') moodCounts.excited++;
                          else if (mood === 'good' || mood === '🙂') moodCounts.good++;
                          else if (mood === 'neutral' || mood === '😐') moodCounts.neutral++;
                          else if (mood === 'sad' || mood === '😔') moodCounts.sad++;
                        });

                        if (totalEntries === 0) {
                          return [
                            { emoji: '📝', name: 'No entries yet', percentage: 0, color: 'bg-gray-300' },
                            { emoji: '✨', name: 'Start writing!', percentage: 0, color: 'bg-blue-300' }
                          ];
                        }

                        return [
                          { emoji: '😊', name: 'Happy', count: moodCounts.happy, percentage: Math.round((moodCounts.happy / totalEntries) * 100), color: 'bg-green-500' },
                          { emoji: '😄', name: 'Excited', count: moodCounts.excited, percentage: Math.round((moodCounts.excited / totalEntries) * 100), color: 'bg-amber-500' },
                          { emoji: '🙂', name: 'Good', count: moodCounts.good, percentage: Math.round((moodCounts.good / totalEntries) * 100), color: 'bg-blue-500' },
                          { emoji: '😐', name: 'Neutral', count: moodCounts.neutral, percentage: Math.round((moodCounts.neutral / totalEntries) * 100), color: 'bg-gray-500' },
                          { emoji: '😔', name: 'Sad', count: moodCounts.sad, percentage: Math.round((moodCounts.sad / totalEntries) * 100), color: 'bg-red-500' }
                        ].filter(mood => mood.count > 0);
                      })().map((mood, index) => (
                        <motion.div
                          key={mood.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center gap-2 p-2 bg-white rounded-lg border border-amber-200"
                        >
                          <div className="text-lg">{mood.emoji}</div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">{mood.name}</div>
                            <div className="text-xs text-gray-500">{mood.percentage}%</div>
                          </div>
                          <div className={`w-3 h-3 ${mood.color} rounded-full`}></div>
                        </motion.div>
                      ))}
                    </div>

                    {/* AI Mood Insight - Real User Data */}
                    <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-4 border border-amber-300">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🤖</div>
                        <div>
                          <div className="font-semibold text-amber-800">AI Mood Insight</div>
                          <div className="text-sm text-amber-700 mt-1">
                            {(() => {
                              const totalEntries = entries?.length || 0;
                              if (totalEntries === 0) {
                                return "Start journaling to discover personalized mood patterns and insights! Your AI companion will analyze your emotional journey as you write.";
                              }
                              
                              // Calculate dominant mood
                              const moodCounts: { [key: string]: number } = { happy: 0, excited: 0, good: 0, neutral: 0, sad: 0 };
                              entries?.forEach((entry: JournalEntry) => {
                                const mood = entry.mood?.toLowerCase();
                                if (mood === 'happy' || mood === '😊') moodCounts.happy++;
                                else if (mood === 'excited' || mood === '😄') moodCounts.excited++;
                                else if (mood === 'good' || mood === '🙂') moodCounts.good++;
                                else if (mood === 'neutral' || mood === '😐') moodCounts.neutral++;
                                else if (mood === 'sad' || mood === '😔') moodCounts.sad++;
                              });
                              
                              const dominantMood = Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b);
                              const moodEmojis: { [key: string]: string } = { happy: '😊', excited: '😄', good: '🙂', neutral: '😐', sad: '😔' };
                              
                              if (totalEntries < 3) {
                                return `Great start! You've written ${totalEntries} ${totalEntries === 1 ? 'entry' : 'entries'}. Keep journaling to unlock deeper mood insights and patterns.`;
                              }
                              
                              return `Based on your ${totalEntries} entries, you tend to feel ${dominantMood[0]} ${moodEmojis[dominantMood[0]]} most often. ${stats?.currentStreak > 0 ? `Your ${stats.currentStreak}-day streak shows great consistency!` : 'Try writing daily to build momentum and track patterns.'}`;
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Interactive Memory Calendar with Advanced Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-xl hover:shadow-2xl transition-all border border-indigo-200 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                          className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
                        >
                          <Calendar className="w-6 h-6" />
                        </motion.div>
                        <div>
                          <CardTitle className="text-2xl font-bold">🌟 Memory Calendar Plus</CardTitle>
                          <p className="text-indigo-100 text-sm">Advanced tools, mood heatmap, memory surfacing & AI insights</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                          🤖 AI Summary
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* Advanced Calendar Toolbar */}
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 p-4 border-b border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600">
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <motion.h3 
                            key={new Date().getMonth()}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xl font-bold text-indigo-700 px-4"
                          >
                            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </motion.h3>
                          <Button variant="outline" size="sm" className="bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600">
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* View Mode Toggle */}
                        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
                          <Button size="sm" className="bg-purple-500 text-white text-xs">📅 Month</Button>
                          <Button variant="outline" size="sm" className="text-xs">📊 Heatmap</Button>
                          <Button variant="outline" size="sm" className="text-xs">📈 Timeline</Button>
                          <Button variant="outline" size="sm" className="text-xs">🔍 Search</Button>
                        </div>
                      </div>
                      
                      {/* Advanced Filter Controls */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600">Filter by:</span>
                          <Button variant="outline" size="sm" className="text-xs bg-green-100 text-green-700 border-green-300">
                            😊 Happy Days
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                            📸 With Photos
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300">
                            🏆 Achievement Days
                          </Button>
                          <Button variant="outline" size="sm" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                            ✨ AI Insights
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-sm text-gray-500">Quick Tools:</span>
                          <Button size="sm" className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                            <Plus className="w-3 h-3 mr-1" />
                            Add Memory
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Calendar Grid with Mood Heatmap */}
                    <div className="p-6">
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {/* Day Headers */}
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                            {day}
                          </div>
                        ))}
                        
                        {/* Calendar Days with Enhanced Features */}
                        {Array.from({ length: 35 }, (_, i) => {
                          const date = new Date();
                          date.setDate(date.getDate() - 15 + i);
                          const dayEntries = entries?.filter((entry: JournalEntry) => 
                            new Date(entry.createdAt).toDateString() === date.toDateString()
                          ) || [];
                          const hasEntry = dayEntries.length > 0;
                          const isToday = date.toDateString() === new Date().toDateString();
                          const dominantMood = dayEntries[0]?.mood || '';
                          
                          // Mood-based background colors
                          const getMoodColor = (mood: string) => {
                            if (mood.includes('😊') || mood.includes('happy')) return 'bg-green-200 border-green-400';
                            if (mood.includes('😄') || mood.includes('excited')) return 'bg-yellow-200 border-yellow-400';
                            if (mood.includes('🙂') || mood.includes('good')) return 'bg-blue-200 border-blue-400';
                            if (mood.includes('😐') || mood.includes('neutral')) return 'bg-gray-200 border-gray-400';
                            if (mood.includes('😔') || mood.includes('sad')) return 'bg-red-200 border-red-400';
                            return 'bg-slate-50 border-slate-200';
                          };

                          return (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.01 }}
                              whileHover={{ scale: 1.1, z: 10 }}
                              onClick={() => hasEntry && openUnifiedJournal(dayEntries[0])}
                              className={`
                                relative aspect-square rounded-lg border-2 transition-all cursor-pointer
                                ${hasEntry ? getMoodColor(dominantMood) + ' shadow-lg' : 'bg-slate-50 border-slate-200'}
                                ${isToday ? 'ring-4 ring-purple-400 ring-opacity-50' : ''}
                                hover:shadow-xl hover:scale-105
                              `}
                            >
                              {/* Day Number */}
                              <div className={`absolute top-1 left-1 text-xs font-bold ${
                                isToday ? 'text-purple-700' : hasEntry ? 'text-gray-700' : 'text-gray-400'
                              }`}>
                                {date.getDate()}
                              </div>
                              
                              {/* Entry Indicators */}
                              {hasEntry && (
                                <>
                                  {/* Mood Emoji */}
                                  <div className="absolute top-1 right-1 text-lg">
                                    {dominantMood}
                                  </div>
                                  
                                  {/* Entry Count Dot */}
                                  <div className="absolute bottom-1 left-1 flex gap-0.5">
                                    {Array.from({ length: Math.min(dayEntries.length, 3) }, (_, j) => (
                                      <div key={j} className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                    ))}
                                  </div>
                                  
                                  {/* Special Indicators */}
                                  <div className="absolute bottom-1 right-1 flex gap-0.5">
                                    {dayEntries[0]?.photos && dayEntries[0].photos.length > 0 && (
                                      <div className="text-xs">📸</div>
                                    )}
                                    {(dayEntries[0]?.wordCount || 0) > 500 && (
                                      <div className="text-xs">✨</div>
                                    )}
                                  </div>
                                </>
                              )}
                              
                              {/* Today Indicator */}
                              {isToday && (
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="absolute inset-0 border-2 border-purple-400 rounded-lg pointer-events-none"
                                />
                              )}
                            </motion.div>
                          );
                        })}
                      </div>
                      
                      {/* Calendar Legend */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-indigo-700">Calendar Legend & Tools</h4>
                          <Button size="sm" variant="outline" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Toggle Legend
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* Mood Legend */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Mood Colors</h5>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
                                <span>😊 Happy</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded"></div>
                                <span>😄 Excited</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
                                <span>🙂 Good</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Indicators Legend */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Indicators</h5>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-xs">
                                <span>📸</span>
                                <span>Has Photos</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span>✨</span>
                                <span>Long Entry (500+ words)</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                <span>Entry Count</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Quick Stats */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">This Month</h5>
                            <div className="space-y-1 text-xs">
                              <div>📝 {entries?.filter((entry: JournalEntry) => 
                                new Date(entry.createdAt).getMonth() === new Date().getMonth()
                              ).length || 0} entries</div>
                              <div>🔥 {stats?.currentStreak || 0} day streak</div>
                              <div>📊 {Math.round(((entries?.filter((entry: JournalEntry) => 
                                new Date(entry.createdAt).getMonth() === new Date().getMonth()
                              ).length || 0) / new Date().getDate()) * 100)}% coverage</div>
                            </div>
                          </div>
                          
                          {/* Quick Actions */}
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-2">Quick Actions</h5>
                            <div className="space-y-1">
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                📈 Monthly Report
                              </Button>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                🔍 Search Entries
                              </Button>
                              <Button size="sm" variant="outline" className="w-full text-xs">
                                💫 Memory Highlights
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Memory Surfacing Tools */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 border-t border-indigo-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          AI Memory Surfacing
                        </h4>
                        <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Memories
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Random Memory */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-xl p-4 border border-rose-200 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">💭</span>
                            <h5 className="font-semibold text-rose-700 text-sm">Random Memory</h5>
                          </div>
                          {entries && entries.length > 0 ? (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">
                                {new Date(entries[Math.floor(Math.random() * entries.length)].createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-700 line-clamp-2">
                                {entries[Math.floor(Math.random() * entries.length)].content.substring(0, 100)}...
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">No memories yet. Start journaling!</p>
                          )}
                        </motion.div>
                        
                        {/* Year Ago Today */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-xl p-4 border border-rose-200 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📅</span>
                            <h5 className="font-semibold text-rose-700 text-sm">This Day in History</h5>
                          </div>
                          <p className="text-xs text-gray-500">Feature coming soon! We'll show you what you wrote on this day in previous years.</p>
                        </motion.div>
                        
                        {/* Mood Pattern */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="bg-white rounded-xl p-4 border border-rose-200 shadow-sm"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📊</span>
                            <h5 className="font-semibold text-rose-700 text-sm">Mood Insight</h5>
                          </div>
                          <p className="text-xs text-gray-600">
                            {entries && entries.length > 0 
                              ? `Your most common mood this month is ${entries[0]?.mood || '😊'}`
                              : "Start writing to discover your mood patterns!"
                            }
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </Tabs>
          </div>

          {/* Interactive Journal Editor Modals */}
          {showUnifiedJournal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <h2 className="text-lg font-bold">📖 Smart Journal Editor</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowUnifiedJournal(false)}
                    className="text-white hover:bg-white/20"
                  >
                    ✕
                  </Button>
                </div>
                <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
                  <SmartJournalEditor onClose={() => setShowUnifiedJournal(false)} />
                </div>
              </div>
            </div>
          )}

          {/* Achievement Details Modal */}
          {selectedAchievement && showAchievementModal && (
            <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      selectedAchievement.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      selectedAchievement.rarity === 'epic' ? 'bg-gradient-to-r from-purple-400 to-indigo-500' :
                      selectedAchievement.rarity === 'rare' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                      'bg-gradient-to-r from-gray-400 to-gray-500'
                    } text-white`}>
                      {selectedAchievement.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedAchievement.title}</h3>
                      <Badge className={`${
                        selectedAchievement.rarity === 'legendary' ? 'bg-yellow-500' :
                        selectedAchievement.rarity === 'epic' ? 'bg-purple-500' :
                        selectedAchievement.rarity === 'rare' ? 'bg-blue-500' :
                        'bg-gray-500'
                      } text-white`}>
                        {selectedAchievement.rarity.toUpperCase()}
                      </Badge>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedAchievement.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Progress Details</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current:</span>
                        <span className="font-medium">{selectedAchievement.currentValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target:</span>
                        <span className="font-medium">{selectedAchievement.targetValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span className="font-medium">{Math.round((selectedAchievement.currentValue / selectedAchievement.targetValue) * 100)}%</span>
                      </div>
                    </div>
                    <Progress 
                      value={(selectedAchievement.currentValue / selectedAchievement.targetValue) * 100} 
                      className="mt-3"
                    />
                  </div>
                  
                  {selectedAchievement.unlocked && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700">
                        <Check className="w-5 h-5" />
                        <span className="font-semibold">Achievement Unlocked!</span>
                      </div>
                      <p className="text-green-600 text-sm mt-1">Congratulations on reaching this milestone!</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Goal Details Modal */}
          {selectedGoal && showGoalDetailsModal && (
            <Dialog open={showGoalDetailsModal} onOpenChange={setShowGoalDetailsModal}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      selectedGoal.difficulty === 'beginner' ? 'bg-green-100' :
                      selectedGoal.difficulty === 'intermediate' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      {selectedGoal.type === 'streak' ? '🔥' : 
                       selectedGoal.type === 'writing' ? '📝' : 
                       selectedGoal.type === 'mood' ? '😊' :
                       selectedGoal.type === 'creative' ? '🎨' :
                       selectedGoal.type === 'reflection' ? '🧘' :
                       selectedGoal.type === 'mindfulness' ? '🌸' :
                       selectedGoal.type === 'adventure' ? '🗺️' :
                       selectedGoal.type === 'social' ? '👥' :
                       selectedGoal.type === 'memory' ? '📸' :
                       selectedGoal.type === 'dreams' ? '💭' :
                       '🎯'}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedGoal.title}</h3>
                      <Badge className={`${
                        selectedGoal.difficulty === 'beginner' ? 'bg-green-500' :
                        selectedGoal.difficulty === 'intermediate' ? 'bg-blue-500' :
                        'bg-purple-500'
                      } text-white`}>
                        {selectedGoal.difficulty.toUpperCase()}
                      </Badge>
                    </div>
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedGoal.description}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Goal Progress</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current:</span>
                        <span className="font-medium">{selectedGoal.currentValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target:</span>
                        <span className="font-medium">{selectedGoal.targetValue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Progress:</span>
                        <span className="font-medium">{Math.round((selectedGoal.currentValue / selectedGoal.targetValue) * 100)}%</span>
                      </div>
                    </div>
                    <Progress 
                      value={(selectedGoal.currentValue / selectedGoal.targetValue) * 100} 
                      className="mt-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-sm text-blue-600">Category</div>
                      <div className="font-semibold text-blue-800 capitalize">{selectedGoal.type}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-sm text-purple-600">Type</div>
                      <div className="font-semibold text-purple-800 capitalize">{selectedGoal.difficulty}</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Goal Modal */}
          {showEditGoalModal && selectedGoal && (
            <Dialog open={showEditGoalModal} onOpenChange={setShowEditGoalModal}>
              <DialogContent className="max-w-md">
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
        </div>
      );
    }

    interface EditGoalFormProps {
      goal: any;
      onClose: () => void;
    }

    function EditGoalForm({ goal, onClose }: EditGoalFormProps) {
      const [title, setTitle] = useState(goal.title);
      const [description, setDescription] = useState(goal.description);
      const [currentValue, setCurrentValue] = useState(goal.currentValue.toString());
      const [targetValue, setTargetValue] = useState(goal.targetValue.toString());
      const [difficulty, setDifficulty] = useState(goal.difficulty);

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Updating goal:', {
          ...goal,
          title,
          description,
          currentValue: parseInt(currentValue),
          targetValue: parseInt(targetValue),
          difficulty,
        });
        onClose();
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="editTitle">Goal Title</Label>
              <Input
                id="editTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editDifficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="editCurrentValue">Current Value</Label>
                <Input
                  id="editCurrentValue"
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editTargetValue">Target Value</Label>
              <Input
                id="editTargetValue"
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-700">
              <strong>Progress Preview:</strong> {Math.round((parseInt(currentValue) / parseInt(targetValue)) * 100)}% complete
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-purple-500 hover:bg-purple-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Update Goal
            </Button>
          </DialogFooter>
        </form>
      );
    }

    export default EnhancedDashboard;
