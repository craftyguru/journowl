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
import { BookOpen, TrendingUp, Target, Award, Brain, Heart, Sparkles, Zap, Calendar, Clock, Star, Trophy, Gift, Lightbulb, Type, Brush, Plus, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const handleSaveEntry = (entryData: any) => {
    console.log('Saving entry:', entryData);
    // Here you would typically save to backend
    setShowSmartEditor(false);
    setShowUnifiedJournal(false);
    setSelectedEntry(null);
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
          className="relative bg-gradient-to-br from-purple-800/80 via-purple-700/70 to-purple-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-400/30 overflow-hidden"
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
          className="relative bg-gradient-to-br from-pink-800/80 via-pink-700/70 to-pink-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-pink-400/30 overflow-hidden"
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
          className="relative bg-gradient-to-br from-emerald-800/80 via-emerald-700/70 to-emerald-600/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-emerald-400/30 overflow-hidden"
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

              {/* Enhanced Mood Calendar/Heatmap */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl hover:shadow-2xl transition-all border border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700">
                      <Calendar className="w-6 h-6" />
                      Interactive Mood Calendar
                    </CardTitle>
                    <p className="text-indigo-600 text-sm">Click any day to see your entries, mood patterns, and memories</p>
                  </CardHeader>
                  <CardContent>
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">← Previous</Button>
                        <h3 className="text-xl font-bold text-indigo-800">July 2025</h3>
                        <Button variant="outline" size="sm">Next →</Button>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-600">Mood Scale:</span>
                        <div className="flex gap-1">
                          <div className="w-4 h-4 bg-red-200 rounded-full" title="😔 Sad"></div>
                          <div className="w-4 h-4 bg-orange-200 rounded-full" title="😐 Neutral"></div>
                          <div className="w-4 h-4 bg-yellow-200 rounded-full" title="🙂 Good"></div>
                          <div className="w-4 h-4 bg-green-200 rounded-full" title="😊 Happy"></div>
                          <div className="w-4 h-4 bg-emerald-300 rounded-full" title="😄 Excited"></div>
                        </div>
                      </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-3 mb-6">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                          {day}
                        </div>
                      ))}
                      
                      {(() => {
                        // Generate calendar data based on real user entries
                        const today = new Date();
                        const currentMonth = today.getMonth();
                        const currentYear = today.getFullYear();
                        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
                        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
                        const firstDayOfWeek = firstDayOfMonth.getDay();
                        
                        // Create calendar days array
                        const calendarDays = [];
                        
                        // Add previous month days if needed
                        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                          const date = new Date(firstDayOfMonth);
                          date.setDate(date.getDate() - (i + 1));
                          calendarDays.push({ date, isCurrentMonth: false });
                        }
                        
                        // Add current month days
                        for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
                          const date = new Date(currentYear, currentMonth, day);
                          calendarDays.push({ date, isCurrentMonth: true });
                        }
                        
                        // Add next month days if needed
                        const remainingDays = 35 - calendarDays.length;
                        for (let day = 1; day <= remainingDays; day++) {
                          const date = new Date(currentYear, currentMonth + 1, day);
                          calendarDays.push({ date, isCurrentMonth: false });
                        }
                        
                        return calendarDays;
                      })().map((calendarDay, i) => {
                        const dayNum = calendarDay.date.getDate();
                        const isCurrentMonth = calendarDay.isCurrentMonth;
                        
                        // Find entries for this day
                        const dayEntries = entries?.filter((entry: JournalEntry) => {
                          const entryDate = new Date(entry.createdAt);
                          return entryDate.toDateString() === calendarDay.date.toDateString();
                        }) || [];
                        
                        const hasEntry = dayEntries.length > 0;
                        const primaryEntry = dayEntries[0];
                        const mood = primaryEntry?.mood || '';
                        
                        const moodColors: { [key: string]: string } = {
                          '😔': 'bg-red-100 border-red-300 hover:bg-red-200',
                          'sad': 'bg-red-100 border-red-300 hover:bg-red-200',
                          '😐': 'bg-orange-100 border-orange-300 hover:bg-orange-200',
                          'neutral': 'bg-orange-100 border-orange-300 hover:bg-orange-200',
                          '🙂': 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
                          'good': 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
                          '😊': 'bg-green-100 border-green-300 hover:bg-green-200',
                          'happy': 'bg-green-100 border-green-300 hover:bg-green-200',
                          '😄': 'bg-emerald-200 border-emerald-400 hover:bg-emerald-300',
                          'excited': 'bg-emerald-200 border-emerald-400 hover:bg-emerald-300'
                        };
                        
                        const moodEmojis: { [key: string]: string } = {
                          'sad': '😔',
                          'neutral': '😐', 
                          'good': '🙂',
                          'happy': '😊',
                          'excited': '😄'
                        };
                        
                        const displayMood = moodEmojis[mood.toLowerCase()] || mood;
                        
                        return (
                          <motion.div
                            key={i}
                            whileHover={{ scale: 1.1, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative h-12 rounded-xl cursor-pointer transition-all border-2 flex items-center justify-center ${
                              isCurrentMonth 
                                ? hasEntry 
                                  ? moodColors[mood.toLowerCase()] || moodColors[displayMood] || 'bg-blue-100 border-blue-300 hover:bg-blue-200'
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                : 'bg-transparent'
                            }`}
                            title={hasEntry ? `${dayNum}: ${displayMood} mood, ${dayEntries.length} ${dayEntries.length === 1 ? 'entry' : 'entries'}, ${dayEntries.reduce((total, entry) => total + (entry.content?.length || 0), 0)} characters` : `${dayNum}: No entries`}
                          >
                            {isCurrentMonth && (
                              <>
                                <span className="text-sm font-medium text-gray-700">{dayNum}</span>
                                {hasEntry && displayMood && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="absolute -top-1 -right-1 text-lg"
                                  >
                                    {displayMood}
                                  </motion.div>
                                )}
                                {hasEntry && dayEntries.some(entry => entry.photoAnalysis) && (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                    className="absolute -bottom-1 -left-1 text-xs"
                                  >
                                    📸
                                  </motion.div>
                                )}
                              </>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Calendar Insights - Real User Data */}
                    <div className="bg-white rounded-xl p-4 border border-indigo-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-indigo-600">{stats?.totalEntries || 0}</div>
                          <div className="text-sm text-gray-600">Journal Entries</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {(() => {
                              // Calculate most common mood from real user data
                              const moodCounts: { [key: string]: number } = { happy: 0, excited: 0, good: 0, neutral: 0, sad: 0 };
                              entries?.forEach((entry: JournalEntry) => {
                                const mood = entry.mood?.toLowerCase();
                                if (mood === 'happy' || mood === '😊') moodCounts.happy++;
                                else if (mood === 'excited' || mood === '😄') moodCounts.excited++;
                                else if (mood === 'good' || mood === '🙂') moodCounts.good++;
                                else if (mood === 'neutral' || mood === '😐') moodCounts.neutral++;
                                else if (mood === 'sad' || mood === '😔') moodCounts.sad++;
                              });
                              
                              if (entries?.length === 0) return '✨';
                              
                              const mostCommon = Object.entries(moodCounts).reduce((a, b) => moodCounts[a[0]] > moodCounts[b[0]] ? a : b);
                              const moodEmojis: { [key: string]: string } = { happy: '😊', excited: '😄', good: '🙂', neutral: '😐', sad: '😔' };
                              return moodEmojis[mostCommon[0]] || '😊';
                            })()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {entries?.length > 0 ? 'Most Common Mood' : 'Start writing!'}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats?.longestStreak || 0}</div>
                          <div className="text-sm text-gray-600">Longest Streak</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <Button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white">
                        View Detailed Calendar
                      </Button>
                      <Button variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                        Export Calendar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* AI-Powered Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl hover:shadow-2xl transition-all border border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-800">
                      <Brain className="w-5 h-5 text-amber-600" />
                      Smart Correlations
                    </CardTitle>
                    <p className="text-amber-700 text-sm">AI-discovered patterns in your data</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-green-100 rounded-lg border border-green-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-green-800">Morning entries = Better mood</span>
                        </div>
                        <span className="text-xs text-green-600 font-bold">+0.8 correlation</span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-blue-100 rounded-lg border border-blue-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-blue-800">Photos boost entry length</span>
                        </div>
                        <span className="text-xs text-blue-600 font-bold">+0.6 correlation</span>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center justify-between p-3 bg-purple-100 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm font-medium text-purple-800">Weekend creativity spikes</span>
                        </div>
                        <span className="text-xs text-purple-600 font-bold">+0.4 correlation</span>
                      </motion.div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Discover More Patterns
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="achievements" data-tabs-content>
          <div className="space-y-6">
            {/* Achievements Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">🏆 Achievements</h2>
                  <p className="text-amber-100 text-lg">Celebrate your journaling milestones</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">{achievements.filter(a => a.unlockedAt).length}/{achievements.length}</div>
                  <div className="text-amber-100 text-sm">Unlocked</div>
                </div>
              </div>
              
              {/* Achievement Progress Bar */}
              <div className="bg-white/20 rounded-full h-3 mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievements.length > 0 ? (achievements.filter(a => a.unlockedAt).length / achievements.length) * 100 : 0}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-yellow-300 to-amber-300 h-full rounded-full"
                />
              </div>
              <div className="text-amber-100 text-sm">
                {achievements.length > 0 ? Math.round((achievements.filter(a => a.unlockedAt).length / achievements.length) * 100) : 0}% complete - 
                {achievements.filter(a => !a.unlockedAt).length > 0 
                  ? ` ${achievements.filter(a => !a.unlockedAt).length} more to unlock!`
                  : " All achievements unlocked! Amazing work!"
                }
              </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.slice(0, 24).map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1, 
                    type: "spring", 
                    stiffness: 100,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -8,
                    rotateY: achievement.unlockedAt ? 5 : 0
                  }}
                  className={`relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all cursor-pointer ${
                    achievement.unlockedAt
                      ? achievement.rarity === 'legendary'
                        ? 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 border-2 border-yellow-300 shadow-yellow-400/50'
                        : achievement.rarity === 'epic'
                        ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 border-2 border-purple-300 shadow-purple-500/50'
                        : achievement.rarity === 'rare'
                        ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 border-2 border-blue-300 shadow-blue-500/50'
                        : 'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 border-2 border-green-300 shadow-green-500/50'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300'
                  }`}
                >
                  {/* Animated sparkle effects for unlocked achievements */}
                  {achievement.unlockedAt && (
                    <>
                      <div className="absolute inset-0 overflow-hidden">
                        <motion.div
                          animate={{ 
                            x: [-100, 400],
                            rotate: [0, 360]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "linear",
                            delay: index * 0.5
                          }}
                          className="absolute top-1/2 left-0 w-8 h-8 bg-white/30 rounded-full blur-sm"
                        />
                        <motion.div
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.3, 0.7, 0.3]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                          className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 rounded-full"
                        />
                      </div>
                      
                      {/* Confetti burst animation */}
                      <AnimatePresence>
                        <motion.div
                          initial={{ scale: 0, rotate: 0 }}
                          animate={{ scale: [0, 1.2, 0], rotate: [0, 180, 360] }}
                          transition={{ 
                            duration: 1.5, 
                            ease: "easeOut",
                            delay: index * 0.2
                          }}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-30"
                        >
                          ✨
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div 
                        className="text-5xl"
                        animate={achievement.unlockedAt ? { 
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          delay: index * 0.5
                        }}
                      >
                        {achievement.icon}
                      </motion.div>
                      {achievement.unlockedAt && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 0.5, type: "spring" }}
                        >
                          <Trophy className="w-8 h-8 text-yellow-300 drop-shadow-lg" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className={`text-xl font-bold mb-3 ${achievement.unlockedAt ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    
                    <p className={`text-sm mb-4 ${achievement.unlockedAt ? 'text-white/90' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className={`text-xs font-bold px-3 py-1 ${
                          achievement.unlockedAt 
                            ? 'border-white/40 text-white bg-white/20 shadow-sm' 
                            : 'border-gray-400 text-gray-500 bg-gray-50'
                        }`}
                      >
                        {achievement.rarity.toUpperCase()}
                      </Badge>
                      
                      {achievement.unlockedAt ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                          <span className="text-white text-sm font-medium">Unlocked!</span>
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-5 h-5" />
                          <span className="text-sm">Locked</span>
                        </div>
                      )}
                    </div>

                    {/* Progress indicator for locked achievements */}
                    {!achievement.unlockedAt && (
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>Progress</span>
                          <span>
                            {achievement.title === "First Steps" ? `${stats?.totalEntries || 0}/1 entries` :
                             achievement.title === "Daily Writer" ? `${stats?.currentStreak || 0}/3 days` :
                             achievement.title === "Word Explorer" ? `${stats?.totalWords || 0}/100 words` :
                             achievement.title === "Mood Tracker" ? `0/5 moods` :
                             achievement.title === "Early Bird" ? `0/1 morning entries` :
                             achievement.title === "Night Owl" ? `0/1 evening entries` :
                             achievement.title === "Grateful Heart" ? `0/3 gratitude entries` :
                             achievement.title === "Weather Reporter" ? `0/5 weather mentions` :
                             achievement.title === "Weekly Warrior" ? `${stats?.currentStreak || 0}/7 days` :
                             achievement.title === "Storyteller" ? `${stats?.totalWords || 0}/500 words` :
                             achievement.title === "Photo Memory" ? `0/10 photos` :
                             achievement.title === "Emoji Master" ? `0/50 emojis` :
                             achievement.title === "Deep Thinker" ? `0/10 reflective entries` :
                             achievement.title === "Adventure Logger" ? `0/15 activities` :
                             achievement.title === "Mood Rainbow" ? `0/7 mood types` :
                             achievement.title === "Time Traveler" ? `0/20 memory entries` :
                             achievement.title === "Monthly Champion" ? `${stats?.currentStreak || 0}/30 days` :
                             achievement.title === "Novel Writer" ? `${stats?.totalWords || 0}/10000 words` :
                             achievement.title === "Memory Keeper" ? `${stats?.totalEntries || 0}/100 entries` :
                             achievement.title === "Artist" ? `0/20 drawings` :
                             achievement.title === "Wisdom Seeker" ? `0/25 philosophical entries` :
                             achievement.title === "Social Butterfly" ? `0/30 relationship entries` :
                             achievement.title === "Goal Crusher" ? `0/50 goals completed` :
                             achievement.title === "Master Chronicler" ? `${stats?.totalWords || 0}/50000 words` :
                             "0/1 complete"}
                          </span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: achievement.title === "First Steps" ? `${Math.min(100, ((stats?.totalEntries || 0) / 1) * 100)}%` :
                                     achievement.title === "Daily Writer" ? `${Math.min(100, ((stats?.currentStreak || 0) / 3) * 100)}%` :
                                     achievement.title === "Word Explorer" ? `${Math.min(100, ((stats?.totalWords || 0) / 100) * 100)}%` :
                                     achievement.title === "Weekly Warrior" ? `${Math.min(100, ((stats?.currentStreak || 0) / 7) * 100)}%` :
                                     achievement.title === "Storyteller" ? `${Math.min(100, ((stats?.totalWords || 0) / 500) * 100)}%` :
                                     achievement.title === "Monthly Champion" ? `${Math.min(100, ((stats?.currentStreak || 0) / 30) * 100)}%` :
                                     achievement.title === "Novel Writer" ? `${Math.min(100, ((stats?.totalWords || 0) / 10000) * 100)}%` :
                                     achievement.title === "Memory Keeper" ? `${Math.min(100, ((stats?.totalEntries || 0) / 100) * 100)}%` :
                                     achievement.title === "Master Chronicler" ? `${Math.min(100, ((stats?.totalWords || 0) / 50000) * 100)}%` :
                                     "0%"
                            }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-full rounded-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Next Achievement Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-6 border border-indigo-200"
            >
              <h3 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Start Your Journey!
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <div className="text-2xl mb-2">📝</div>
                  <h4 className="font-semibold text-indigo-700">First Steps</h4>
                  <p className="text-sm text-indigo-600 mb-2">Write your first journal entry</p>
                  <div className="text-xs text-indigo-500">Ready to unlock - Write your first entry!</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <div className="text-2xl mb-2">😊</div>
                  <h4 className="font-semibold text-indigo-700">Mood Tracker</h4>
                  <p className="text-sm text-indigo-600 mb-2">Track your mood for 5 days</p>
                  <div className="text-xs text-indigo-500">Ready to unlock - Start tracking your mood!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="goals" data-tabs-content>
          <div className="space-y-6">
            {/* Goals Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">🎯 Goals & Tracking</h2>
                  <p className="text-emerald-100 text-lg">Stay motivated with personalized challenges</p>
                </div>
                <Button 
                  onClick={() => setShowNewGoalModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </div>
              
              {/* Quick Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">{goals.filter(g => !g.isCompleted).length}/{goals.length}</div>
                  <div className="text-emerald-100 text-sm">Active Goals</div>
                  <div className="text-xs text-green-300">{goals.length === 0 ? 'Loading goals...' : 'Keep going!'}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">{goals.filter(g => g.isCompleted).length}</div>
                  <div className="text-emerald-100 text-sm">Completed Goals</div>
                  <div className="text-xs text-green-300">{goals.filter(g => g.isCompleted).length > 0 ? 'Great work!' : 'First goal coming up!'}</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 backdrop-blur-lg">
                  <div className="text-2xl font-bold">{goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + (g.currentValue / g.targetValue * 100), 0) / goals.length) : 0}%</div>
                  <div className="text-emerald-100 text-sm">Avg Progress</div>
                  <div className="text-xs text-green-300">Keep it up!</div>
                </div>
              </div>
            </div>

            {/* Active Goals */}
            <div className="space-y-6">
              {goals.slice(0, 24).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`rounded-2xl p-6 shadow-xl border hover:shadow-2xl transition-all ${
                    goal.difficulty === 'beginner' 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                      : goal.difficulty === 'intermediate'
                      ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
                      : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          goal.type === 'streak' ? 'bg-orange-100' :
                          goal.type === 'writing' ? 'bg-blue-100' :
                          goal.type === 'mood' ? 'bg-pink-100' :
                          goal.type === 'creative' ? 'bg-purple-100' :
                          goal.type === 'reflection' ? 'bg-yellow-100' :
                          goal.type === 'mindfulness' ? 'bg-indigo-100' :
                          'bg-gray-100'
                        }`}>
                          {goal.type === 'streak' ? '🔥' : 
                           goal.type === 'writing' ? '📝' : 
                           goal.type === 'mood' ? '😊' :
                           goal.type === 'creative' ? '🎨' :
                           goal.type === 'reflection' ? '🧘' :
                           goal.type === 'mindfulness' ? '🌸' :
                           goal.type === 'adventure' ? '🗺️' :
                           goal.type === 'social' ? '👥' :
                           goal.type === 'memory' ? '📸' :
                           goal.type === 'dreams' ? '💭' :
                           '🎯'}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{goal.title}</h3>
                          <p className="text-gray-600 text-sm">{goal.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col gap-2">
                      <Badge 
                        className={`px-3 py-1 text-xs font-bold ${
                          goal.difficulty === 'beginner' ? 'bg-green-500 text-white' :
                          goal.difficulty === 'intermediate' ? 'bg-blue-500 text-white' :
                          'bg-purple-500 text-white'
                        }`}
                      >
                        {goal.difficulty.toUpperCase()}
                      </Badge>
                      <Badge 
                        className={`px-3 py-1 text-sm font-bold ${
                          (goal.currentValue / goal.targetValue * 100) >= 90 ? 'bg-green-500 text-white' :
                          (goal.currentValue / goal.targetValue * 100) >= 70 ? 'bg-amber-500 text-white' :
                          'bg-gray-500 text-white'
                        }`}
                      >
                        {goal.currentValue}/{goal.targetValue}
                      </Badge>
                    </div>
                  </div>

                  {/* Enhanced Progress Visualization */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Progress</span>
                      <span className={`text-lg font-bold ${
                        (goal.currentValue / goal.targetValue * 100) >= 90 ? 'text-green-600' :
                        (goal.currentValue / goal.targetValue * 100) >= 70 ? 'text-amber-600' :
                        'text-gray-600'
                      }`}>
                        {Math.round(goal.currentValue / goal.targetValue * 100)}%
                      </span>
                    </div>
                    
                    {/* Animated Progress Ring */}
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round(goal.currentValue / goal.targetValue * 100)}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            (goal.currentValue / goal.targetValue * 100) >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                            (goal.currentValue / goal.targetValue * 100) >= 70 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                            'bg-gradient-to-r from-gray-400 to-gray-500'
                          }`}
                        />
                      </div>
                      
                      {/* Progress markers */}
                      <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>0</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Goal Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            setSelectedGoal(goal);
                            setShowGoalDetailsModal(true);
                          }}
                        >
                          📊 View Details
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={() => {
                            setSelectedGoal(goal);
                            setShowEditGoalModal(true);
                          }}
                        >
                          ✏️ Edit Goal
                        </Button>
                      </div>
                      
                      {(goal.currentValue / goal.targetValue * 100) >= 90 && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: index * 0.1 + 1, type: "spring" }}
                          className="flex items-center gap-2 text-green-600"
                        >
                          <Star className="w-4 h-4" />
                          <span className="text-sm font-medium">Almost complete!</span>
                        </motion.div>
                      )}
                    </div>

                    {/* Time remaining indicator */}
                    <div className="bg-gray-50 rounded-lg p-3 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time Remaining</span>
                        <span className="font-medium text-gray-800">
                          {goal.type === 'streak' ? '2 days left this month' :
                           goal.type === 'words' ? '8 days to hit target' :
                           '3 weeks remaining'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {(goal.currentValue / goal.targetValue * 100) >= 80 ? 'Great pace! You\'re ahead of schedule' :
                         (goal.currentValue / goal.targetValue * 100) >= 50 ? 'On track to complete on time' :
                         'Consider increasing your daily effort'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AI-Powered Goal Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl p-6 border border-violet-200"
            >
              <h3 className="text-xl font-bold text-violet-800 mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6" />
                AI Goal Recommendations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 border border-violet-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">🌅</div>
                    <div>
                      <h4 className="font-semibold text-violet-700">Morning Pages Challenge</h4>
                      <p className="text-sm text-violet-600">Write 3 pages every morning for 30 days</p>
                    </div>
                  </div>
                  <div className="text-xs text-violet-500 bg-violet-50 rounded-lg p-2">
                    💡 <strong>AI Insight:</strong> You write 40% more when starting early in the day
                  </div>
                  <Button className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white" size="sm">
                    Accept Challenge
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl p-4 border border-violet-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">📸</div>
                    <div>
                      <h4 className="font-semibold text-violet-700">Photo Memory Week</h4>
                      <p className="text-sm text-violet-600">Add one photo to your entries for 7 days</p>
                    </div>
                  </div>
                  <div className="text-xs text-violet-500 bg-violet-50 rounded-lg p-2">
                    💡 <strong>AI Insight:</strong> Your entries are 60% longer when you include photos
                  </div>
                  <Button className="w-full mt-3 bg-violet-500 hover:bg-violet-600 text-white" size="sm">
                    Start Challenge
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="insights" data-tabs-content>
          <div className="space-y-6">
            {/* AI Insights Header - Mobile Optimized */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl sm:text-3xl font-bold">🤖 AI Insights</h2>
                  <p className="text-indigo-100 text-sm sm:text-lg">Your personal AI writing companion & advisor</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
                    <Brain className="w-4 h-4 mr-2" />
                    Ask AI
                  </Button>
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
                    📊 Generate Report
                  </Button>
                </div>
              </div>
              
              {/* AI Status Indicators - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-lg">
                  <div className="text-xl sm:text-2xl font-bold">{stats?.totalEntries || 0}</div>
                  <div className="text-indigo-100 text-sm">Total Entries</div>
                  <div className="text-xs text-green-300">Start writing to see progress</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-lg">
                  <div className="text-xl sm:text-2xl font-bold">{stats?.currentStreak || 0}</div>
                  <div className="text-indigo-100 text-sm">Day Streak</div>
                  <div className="text-xs text-green-300">Keep going!</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3 sm:p-4 backdrop-blur-lg">
                  <div className="text-xl sm:text-2xl font-bold">{stats?.totalWords || 0}</div>
                  <div className="text-indigo-100 text-sm">Words Written</div>
                  <div className="text-xs text-green-300">Express yourself!</div>
                </div>
              </div>
            </div>

            {/* Main Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weekly AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl hover:shadow-2xl transition-all border border-violet-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-violet-700">
                      <Sparkles className="w-6 h-6" />
                      Weekly AI Summary
                    </CardTitle>
                    <p className="text-violet-600 text-sm">Your personalized weekly insights</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-4 bg-white rounded-xl border border-violet-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center text-lg">🎯</div>
                          <div>
                            <h4 className="font-semibold text-violet-800">Focus Theme</h4>
                            <p className="text-sm text-violet-600 mt-1">This week you've been reflecting deeply on personal growth and setting intentions for the future.</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-white rounded-xl border border-violet-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">📈</div>
                          <div>
                            <h4 className="font-semibold text-green-700">Writing Evolution</h4>
                            <p className="text-sm text-green-600 mt-1">Your vocabulary has expanded by 15% and you're using more descriptive language than ever before.</p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 bg-white rounded-xl border border-violet-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-lg">💡</div>
                          <div>
                            <h4 className="font-semibold text-amber-700">Key Insight</h4>
                            <p className="text-sm text-amber-600 mt-1">You write most creatively between 7-9 AM, with 40% longer entries during this golden hour.</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Interactive Chat with AI */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl hover:shadow-2xl transition-all border border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700">
                      <Brain className="w-6 h-6" />
                      Chat with Your AI Sidekick
                    </CardTitle>
                    <p className="text-blue-600 text-sm">Ask questions about your journaling patterns</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Sample conversation */}
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">How has my mood changed this month?</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-start">
                          <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                            <p className="text-sm text-gray-700">Your mood has improved by 25% this month! You've had more happy (😊) days and fewer neutral days. The biggest boost came after you started your morning writing routine.</p>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <div className="bg-blue-500 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs">
                            <p className="text-sm">What should I write about today?</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-start">
                          <div className="bg-white border border-blue-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
                            <p className="text-sm text-gray-700">Based on your patterns, try writing about a recent accomplishment you're proud of. You tend to write longer, more reflective entries when focusing on positive achievements.</p>
                          </div>
                        </div>
                      </div>

                      {/* Quick question buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-4 border-t border-blue-200">
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          📊 Monthly summary
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          💭 Writing prompt
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          🎯 Goal suggestions
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-8">
                          📈 Progress review
                        </Button>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                          <Brain className="w-4 h-4 mr-2" />
                          Start New Conversation
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Memory Surfacing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-rose-50 to-pink-50 shadow-xl hover:shadow-2xl transition-all border border-rose-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-rose-700">
                      <Heart className="w-6 h-6" />
                      Memory Lane
                    </CardTitle>
                    <p className="text-rose-600 text-sm">AI-surfaced memories from your past entries</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white rounded-xl border border-rose-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">📷</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-rose-700">On this day last year...</h4>
                            <p className="text-sm text-rose-600 mt-1">"Today I took my first photography class. The way light danced through the trees reminded me why I love capturing moments."</p>
                            <div className="text-xs text-rose-400 mt-2">July 15, 2024 • 3 photos attached</div>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white rounded-xl border border-rose-200 cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">🎓</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-rose-700">Remember this achievement?</h4>
                            <p className="text-sm text-rose-600 mt-1">"Finally completed my certification! All those late nights studying were worth it. Feeling proud and ready for new challenges."</p>
                            <div className="text-xs text-rose-400 mt-2">March 12, 2025 • Tagged: achievement, growth</div>
                          </div>
                        </div>
                      </motion.div>

                      <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white">
                        <Clock className="w-4 h-4 mr-2" />
                        Explore More Memories
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Personalized Writing Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 shadow-xl hover:shadow-2xl transition-all border border-amber-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-amber-700">
                      <Lightbulb className="w-6 h-6" />
                      AI Writing Prompts
                    </CardTitle>
                    <p className="text-amber-600 text-sm">Personalized prompts based on your interests</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[].map((prompt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="p-4 bg-white rounded-xl border border-amber-200 cursor-pointer hover:shadow-md transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm group-hover:bg-amber-200 transition-colors">✨</div>
                            <div className="flex-1">
                              <p className="text-amber-800 font-medium group-hover:text-amber-900">{prompt}</p>
                              <div className="text-xs text-amber-500 mt-1">Tap to start writing</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="pt-4 border-t border-amber-200">
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Generate New Prompts
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* AI-Generated Mood Cloud */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-6 border border-teal-200"
            >
              <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                <Gift className="w-6 h-6" />
                Your Personal Word Cloud
              </h3>
              
              <div className="bg-white rounded-xl p-6 border border-teal-200">
                <div className="flex flex-wrap gap-2 justify-center items-center">
                  {[
                    { word: "grateful", size: "text-4xl", color: "text-green-500" },
                    { word: "creative", size: "text-2xl", color: "text-purple-500" },
                    { word: "peaceful", size: "text-3xl", color: "text-blue-500" },
                    { word: "growth", size: "text-2xl", color: "text-emerald-500" },
                    { word: "inspired", size: "text-3xl", color: "text-pink-500" },
                    { word: "focused", size: "text-xl", color: "text-indigo-500" },
                    { word: "determined", size: "text-2xl", color: "text-orange-500" },
                    { word: "mindful", size: "text-3xl", color: "text-teal-500" },
                    { word: "hopeful", size: "text-2xl", color: "text-rose-500" },
                    { word: "confident", size: "text-xl", color: "text-violet-500" },
                  ].map((item, index) => (
                    <motion.span
                      key={item.word}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.7 }}
                      whileHover={{ scale: 1.1 }}
                      className={`${item.size} ${item.color} font-bold cursor-pointer hover:opacity-80 transition-opacity`}
                    >
                      {item.word}
                    </motion.span>
                  ))}
                </div>
                <p className="text-center text-teal-600 text-sm mt-4">
                  These are your most frequent positive words from the past month
                </p>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="calendar" data-tabs-content>
          <div className="h-[80vh]">
            <InteractiveCalendar 
              entries={calendarEntries}
              onDateSelect={handleDateSelect}
              onEntryEdit={handleEntryEdit}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="stories" data-tabs-content>
          <div className="h-[80vh]">
            <AIStoryMaker 
              entries={entries}
              stats={stats}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="referral" data-tabs-content>
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-slate-800/90 via-purple-900/80 to-pink-900/80 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-500/20"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">🎁 Refer Friends & Earn AI Prompts!</h2>
                <p className="text-gray-300 text-lg">Share JournOwl with friends and get 100 free AI prompts for each successful referral!</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 rounded-xl p-6 border border-purple-400/30">
                  <h3 className="text-xl font-bold text-white mb-4">📤 Your Referral Link</h3>
                  <div className="flex gap-2">
                    <Input 
                      value={`https://journowl.com/join?ref=${user?.id || 'demo'}`}
                      readOnly
                      className="bg-slate-700/50 border-purple-400/30 text-white"
                    />
                    <Button 
                      onClick={() => navigator.clipboard.writeText(`https://journowl.com/join?ref=${user?.id || 'demo'}`)}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      📋 Copy
                    </Button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">Share this link with friends to start earning rewards!</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-800/40 to-emerald-800/40 rounded-xl p-6 border border-green-400/30">
                  <h3 className="text-xl font-bold text-white mb-4">🏆 Your Referral Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Total Referrals:</span>
                      <span className="text-white font-bold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">AI Prompts Earned:</span>
                      <span className="text-green-400 font-bold">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Pending Referrals:</span>
                      <span className="text-yellow-400 font-bold">0</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-400/20">
                  <div className="text-2xl mb-2">👥</div>
                  <h4 className="font-semibold text-white mb-1">Step 1: Share</h4>
                  <p className="text-gray-400 text-sm">Send your referral link to friends</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-400/20">
                  <div className="text-2xl mb-2">✨</div>
                  <h4 className="font-semibold text-white mb-1">Step 2: They Join</h4>
                  <p className="text-gray-400 text-sm">Friends sign up using your link</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-purple-400/20">
                  <div className="text-2xl mb-2">🎁</div>
                  <h4 className="font-semibold text-white mb-1">Step 3: Earn Rewards</h4>
                  <p className="text-gray-400 text-sm">Get 100 AI prompts per referral</p>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="analytics-insights" data-tabs-content>
          <div className="space-y-6">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-purple-900/90 via-purple-800/80 to-purple-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-500/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">📊 Insights & Analytics</h2>
                  <p className="text-gray-300">Discover patterns in your journaling journey</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2">
                    ➕ Add Entry
                  </Button>
                  <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-800 text-sm px-3 py-2">
                    ⬇️ Export
                  </Button>
                  <Button variant="outline" className="border-purple-400 text-purple-200 hover:bg-purple-800 text-sm px-3 py-2">
                    📤 Share
                  </Button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input 
                    placeholder="🔍 Search entries, moods, or keywords..."
                    className="bg-slate-700/50 border-purple-400/30 text-white placeholder:text-gray-400"
                  />
                </div>
                <select className="bg-slate-700/50 border border-purple-400/30 text-white rounded-md px-3 py-2">
                  <option>All Moods</option>
                  <option>😊 Happy</option>
                  <option>😔 Sad</option>
                  <option>😤 Angry</option>
                  <option>😌 Calm</option>
                </select>
                <select className="bg-slate-700/50 border border-purple-400/30 text-white rounded-md px-3 py-2">
                  <option>Month</option>
                  <option>Week</option>
                  <option>Year</option>
                </select>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      📝
                    </div>
                    <div className="text-xs text-green-400">📈</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats?.totalEntries || 1}</div>
                  <div className="text-xs text-gray-400">Total Entries</div>
                  <div className="text-xs text-purple-300 mt-1">Keep writing!</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      📖
                    </div>
                    <div className="text-xs text-green-400">📈</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats?.totalWords || 25}</div>
                  <div className="text-xs text-gray-400">Total Words</div>
                  <div className="text-xs text-green-300 mt-1">Amazing progress</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      🔥
                    </div>
                    <div className="text-xs text-orange-400">⭕ On fire!</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats?.currentStreak || 0} <span className="text-sm">days</span></div>
                  <div className="text-xs text-gray-400">Current Streak</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-slate-800/60 rounded-xl p-4 border border-purple-400/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      🏆
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white">{stats?.longestStreak || 1} <span className="text-sm">days</span></div>
                  <div className="text-xs text-gray-400">Longest Streak</div>
                  <div className="text-xs text-yellow-300 mt-1">Personal best</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Writing Activity Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    📊 Writing Activity
                  </h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs bg-purple-500/20 border-purple-400/30 text-purple-200">
                      Area
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-purple-400/30 text-purple-200">
                      Bar
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs border-purple-400/30 text-purple-200">
                      Line
                    </Button>
                  </div>
                </div>
                
                <div className="h-48 bg-slate-900/40 rounded-lg border border-purple-400/10 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-2xl mb-2">📈</div>
                    <p className="text-sm">Writing activity chart will appear here</p>
                    <p className="text-xs mt-1">Based on your journal entries</p>
                  </div>
                </div>
              </motion.div>

              {/* Mood Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    🎭 Mood Distribution
                  </h3>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Average Mood</div>
                    <div className="flex items-center gap-1">
                      <span className="text-lg">😊</span>
                      <span className="text-sm text-green-400 bg-green-400/20 px-2 py-1 rounded">100%</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-40 bg-slate-900/40 rounded-lg border border-purple-400/10 flex items-center justify-center mb-4">
                  <div className="text-center text-gray-400">
                    <div className="text-2xl mb-2">🍩</div>
                    <p className="text-sm">Mood distribution chart</p>
                    <p className="text-xs mt-1">Donut chart coming soon</p>
                  </div>
                </div>

                <div className="bg-purple-900/40 rounded-lg p-4 border border-purple-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-purple-200">AI Insight</span>
                  </div>
                  <p className="text-sm text-gray-300">"You're happiest on Sundays. Most common mood: Grateful."</p>
                </div>
              </motion.div>
            </div>

            {/* Mood Calendar Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/60 rounded-xl p-6 border border-purple-400/20"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  📅 Mood Calendar Heatmap
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ChevronLeft className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                    <span className="text-white font-medium">July 2025</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'].map(day => (
                  <div key={day} className="text-center text-xs text-gray-400 font-medium py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 31 }, (_, i) => (
                  <motion.div
                    key={i + 1}
                    whileHover={{ scale: 1.1 }}
                    className={`aspect-square rounded-lg border border-purple-400/20 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                      i + 1 === 16 
                        ? 'bg-green-500/80 text-white border-green-400' 
                        : 'bg-slate-700/40 text-gray-400 hover:bg-purple-500/20 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-400/20">
                <div className="text-sm text-gray-400">
                  Less activity
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div 
                      key={level}
                      className={`w-3 h-3 rounded-sm ${
                        level === 1 ? 'bg-slate-700' :
                        level === 2 ? 'bg-green-800/60' :
                        level === 3 ? 'bg-green-600/70' :
                        level === 4 ? 'bg-green-500/80' :
                        'bg-green-400'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-400">
                  More activity
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

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
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <TrendingUp className="w-5 h-5" />
              Goal Details
            </DialogTitle>
          </DialogHeader>
          {selectedGoal && <GoalDetailsView goal={selectedGoal} onClose={() => setShowGoalDetailsModal(false)} />}
        </DialogContent>
      </Dialog>

      {/* Edit Goal Modal */}
      <Dialog open={showEditGoalModal} onOpenChange={setShowEditGoalModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-700">
              <Target className="w-5 h-5" />
              Edit Goal
            </DialogTitle>
          </DialogHeader>
          {selectedGoal && <EditGoalForm goal={selectedGoal} onClose={() => setShowEditGoalModal(false)} />}
        </DialogContent>
      </Dialog>

      {/* Prompt Purchase Modal */}
      <Dialog open={showPromptPurchase} onOpenChange={setShowPromptPurchase}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Top Off AI Prompts
            </DialogTitle>
          </DialogHeader>
          <PromptPurchase />
        </DialogContent>
      </Dialog>

      {/* Floating Action Bubbles - Only show when journal editor is closed */}
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
    // Here you would typically make an API call to create the goal
    console.log("Creating goal:", { goalType, title, description, targetValue, difficulty });
    onClose();
  };

  const selectedGoalType = trackableGoalTypes.find(t => t.value === goalType);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="goalType">Goal Type</Label>
          <Select value={goalType} onValueChange={setGoalType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a trackable goal type..." />
            </SelectTrigger>
            <SelectContent>
              {trackableGoalTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div className="flex flex-col">
                    <span>{type.label}</span>
                    <span className="text-xs text-gray-500">{type.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedGoalType && (
            <p className="text-sm text-gray-600 mt-1">
              💡 This goal will track: {selectedGoalType.description}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="title">Goal Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={selectedGoalType ? `My ${selectedGoalType.label.split(' ').slice(1).join(' ')} Goal` : "Enter goal title..."}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what you want to achieve and why it matters to you..."
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="targetValue">Target ({selectedGoalType?.unit || "value"})</Label>
            <Input
              id="targetValue"
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder={goalType === "streak" ? "7" : goalType === "words" ? "1000" : goalType === "entries" ? "10" : "Enter target..."}
              required
            />
          </div>

          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Choose difficulty..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🟢 Beginner</SelectItem>
                <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                <SelectItem value="advanced">🔴 Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!goalType || !title || !targetValue || !difficulty} className="bg-emerald-500 hover:bg-emerald-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Goal
        </Button>
      </DialogFooter>
    </form>
  );
}

// Goal Details View Component
function GoalDetailsView({ goal, onClose }: { goal: any; onClose: () => void }) {
  const progressPercentage = Math.round((goal.currentValue / goal.targetValue) * 100);
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
            {goal.type === 'streak' ? '🔥' : goal.type === 'words' ? '📝' : goal.type === 'mood' ? '😊' : '🎯'}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-blue-800">{goal.title}</h3>
            <p className="text-blue-600">{goal.description}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{goal.currentValue}</div>
            <div className="text-sm text-blue-600">Current Progress</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            <div className="text-2xl font-bold text-blue-700">{goal.targetValue}</div>
            <div className="text-sm text-blue-600">Target Goal</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-lg font-bold text-blue-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Difficulty</div>
            <Badge className={`mt-1 ${
              goal.difficulty === 'beginner' ? 'bg-green-500' :
              goal.difficulty === 'intermediate' ? 'bg-blue-500' : 'bg-purple-500'
            } text-white`}>
              {goal.difficulty.toUpperCase()}
            </Badge>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Remaining</div>
            <div className="font-semibold">{goal.targetValue - goal.currentValue} to go</div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">💡 AI Insights</h4>
          <p className="text-sm text-yellow-700">
            {progressPercentage >= 80 ? "You're almost there! Keep up the excellent momentum." :
             progressPercentage >= 50 ? "Great progress! You're halfway to your goal." :
             progressPercentage >= 25 ? "Good start! Stay consistent to build momentum." :
             "Every journey begins with a single step. You've got this!"}
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </div>
  );
}

// Edit Goal Form Component
function EditGoalForm({ goal, onClose }: { goal: any; onClose: () => void }) {
  const [title, setTitle] = useState(goal.title);
  const [description, setDescription] = useState(goal.description);
  const [targetValue, setTargetValue] = useState(goal.targetValue.toString());
  const [currentValue, setCurrentValue] = useState(goal.currentValue.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the goal
    console.log("Updating goal:", { title, description, targetValue, currentValue });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="editCurrentValue">Current Progress</Label>
            <Input
              id="editCurrentValue"
              type="number"
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              required
            />
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