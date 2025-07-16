import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Zap, Heart, BookOpen, Sparkles, Target, Gift, Camera, Palette, Music, GamepadIcon, Calendar, BarChart3, Users, Settings, X, Save, Plus, Mic, MicOff, Upload, Video, Image, Paintbrush, Lightbulb, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useCallback, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { ReactSketchCanvas } from "react-sketch-canvas";
import UsageMeters from "@/components/UsageMeters";
import Navbar from "@/components/navbar";

// Web Speech API types
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

// Demo data for Little Timmy
const timmyDemoStats = {
  totalEntries: 23,
  currentStreak: 8,
  totalWords: 1247,
  level: 3,
  xp: 650,
  nextLevelXp: 1000
};

const timmyDemoAchievements = [
  { id: 1, title: "First Entry!", description: "You wrote your very first journal entry!", icon: "🎉", unlocked: true, rarity: "common" },
  { id: 2, title: "Happy Writer", description: "Wrote 5 entries with happy moods!", icon: "😊", unlocked: true, rarity: "common" },
  { id: 3, title: "Story Teller", description: "Wrote a 100-word entry!", icon: "📚", unlocked: true, rarity: "rare" },
  { id: 4, title: "Week Warrior", description: "Wrote for 7 days in a row!", icon: "🏆", unlocked: true, rarity: "epic" },
  { id: 5, title: "Creative Mind", description: "Used 10 different prompts!", icon: "🎨", unlocked: false, rarity: "rare" },
  { id: 6, title: "Feeling Expert", description: "Used all mood emojis!", icon: "🌈", unlocked: false, rarity: "legendary" },
  { id: 7, title: "Photo Master", description: "Added 5 photos to your stories!", icon: "📸", unlocked: false, rarity: "epic" },
  { id: 8, title: "Drawing Star", description: "Made 10 drawings in your journal!", icon: "🖍️", unlocked: false, rarity: "rare" },
];

const timmyDemoEntries = [
  { id: 1, title: "My Pet Hamster", mood: "😊", date: "Today", preview: "Fluffy did the funniest thing today...", wordCount: 85, hasPhoto: true },
  { id: 2, title: "School Adventure", mood: "🤔", date: "Yesterday", preview: "We learned about dinosaurs and...", wordCount: 120, hasDrawing: true },
  { id: 3, title: "Family Game Night", mood: "😄", date: "2 days ago", preview: "We played monopoly and I almost won...", wordCount: 95, hasPhoto: false },
  { id: 4, title: "Rainbow After Rain", mood: "🌈", date: "3 days ago", preview: "The most beautiful rainbow appeared...", wordCount: 67, hasPhoto: true },
  { id: 5, title: "Best Friend Day", mood: "😊", date: "1 week ago", preview: "Had the best day with my best friend...", wordCount: 143, hasDrawing: true },
];

const kidPrompts = [
  "What made you smile today?",
  "If you could have any superpower, what would it be?",
  "What's your favorite thing about your best friend?",
  "Draw a picture of your dream bedroom!",
  "What would you do if you found a magic wand?",
  "Describe the best day ever!",
  "What's your favorite animal and why?",
  "If you could visit any place, where would you go?",
  "What makes you feel brave?",
  "Tell me about your favorite toy!",
];

interface KidDashboardProps {
  onSwitchToAdult?: () => void;
}

function KidDashboard({ onSwitchToAdult }: KidDashboardProps) {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [selectedPrompt, setSelectedPrompt] = useState(kidPrompts[0]);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showJournalEditor, setShowJournalEditor] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<any>(null);
  
  // Journal editor state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("😊");
  const [activeTab, setActiveTab] = useState("write");
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessages, setAiMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(null);
  const [calendarEntries, setCalendarEntries] = useState<{[key: number]: any}>({});
  const [selectedDateEntry, setSelectedDateEntry] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  
  // Refs for media handling
  const canvasRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();

  // Navigation handler for hamburger menu
  const handleNavigate = (view: string) => {
    setCurrentTab(view);
  };

  // Fetch user data
  const { data: userResponse } = useQuery({
    queryKey: ["/api/auth/me"],
  });
  
  const { data: statsResponse } = useQuery({
    queryKey: ["/api/stats"],
  });
  
  const { data: entriesResponse } = useQuery({
    queryKey: ["/api/journal/entries"],
  });
  
  const { data: achievementsResponse } = useQuery({
    queryKey: ["/api/achievements"],
  });

  const { data: goalsResponse } = useQuery({
    queryKey: ["/api/goals"],
  });

  const user = userResponse?.user;
  
  // Use real user data from API - SHARED with adult interface
  const stats = statsResponse?.stats || {};
  const entries = entriesResponse || [];
  const userAchievements = achievementsResponse?.achievements || [];
  const goals = goalsResponse?.goals || [];
  
  // Calculate real-time achievement progress based on actual user stats
  const calculateAchievementProgress = (achievement: any) => {
    let currentProgress = 0;
    let targetValue = 100;

    switch (achievement.title) {
      case 'First Steps':
        currentProgress = stats.totalEntries || 0;
        targetValue = 1;
        break;
      case 'Early Bird':
        currentProgress = stats.currentStreak || 0;
        targetValue = 3;
        break;
      case 'Word Explorer':
        currentProgress = stats.totalWords || 0;
        targetValue = 500;
        break;
      case 'Week Warrior':
        currentProgress = stats.currentStreak || 0;
        targetValue = 7;
        break;
      case 'Dedicated Writer':
        currentProgress = stats.totalEntries || 0;
        targetValue = 10;
        break;
      case 'Night Owl':
        currentProgress = Math.floor((stats.totalEntries || 0) * 0.3);
        targetValue = 5;
        break;
      case 'Monthly Habit':
        currentProgress = stats.currentStreak || 0;
        targetValue = 30;
        break;
      case 'Prolific Writer':
        currentProgress = stats.totalWords || 0;
        targetValue = 10000;
        break;
      case 'Three Week Wonder':
        currentProgress = stats.currentStreak || 0;
        targetValue = 21;
        break;
      case 'Story Teller':
        currentProgress = stats.totalWords || 0;
        targetValue = 5000;
        break;
      case 'Monthly Master':
        currentProgress = stats.currentStreak || 0;
        targetValue = 30;
        break;
      case 'Word Warrior':
        currentProgress = stats.totalWords || 0;
        targetValue = 25000;
        break;
      case 'Quarter Master':
        currentProgress = stats.currentStreak || 0;
        targetValue = 90;
        break;
      default:
        currentProgress = stats.totalEntries || 0;
        targetValue = achievement.targetValue || 100;
    }

    return {
      currentProgress,
      targetValue,
      unlocked: currentProgress >= targetValue,
      progressPercentage: Math.min(100, Math.round((currentProgress / targetValue) * 100))
    };
  };

  // Use real achievements with real-time tracking, fallback to demo for display purposes
  const achievements = userAchievements.length > 0 ? userAchievements.map(achievement => ({
    ...achievement,
    ...calculateAchievementProgress(achievement)
  })) : timmyDemoAchievements.map(achievement => ({
    ...achievement,
    ...calculateAchievementProgress(achievement)
  }));

  const currentLevel = Math.floor((stats.xp || 0) / 1000) + 1;
  const levelProgress = ((stats.xp || 0) % 1000) / 10; // Convert to percentage

  const getRandomPrompt = () => {
    const randomPrompt = kidPrompts[Math.floor(Math.random() * kidPrompts.length)];
    setSelectedPrompt(randomPrompt);
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      let finalTranscript = '';

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        // Clear placeholder and add speech text
        const currentContent = content.includes('Prompt: Tell your story using your voice!') ? '' : content;
        const baseContent = currentContent.replace(/Prompt: Tell your story using your voice! What exciting adventure do you want to share today?\s*/g, '');
        
        setContent(baseContent + finalTranscript + interimTranscript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        finalTranscript = '';
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Automatically restart if no speech detected
          setTimeout(() => {
            if (isListening && recognition) {
              recognition.start();
            }
          }, 100);
        } else {
          setIsListening(false);
        }
      };

      recognitionInstance.onstart = () => {
        finalTranscript = '';
        // Clear the placeholder text when starting
        if (content.includes('Prompt: Tell your story using your voice!')) {
          setContent('');
        }
      };

      setRecognition(recognitionInstance);
    }
  }, [content, isListening]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Journal mutation for saving entries
  const saveEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      if (currentEntry?.id) {
        return apiRequest(`/api/journal/entries/${currentEntry.id}`, {
          method: "PATCH",
          body: entryData,
        });
      } else {
        return apiRequest("/api/journal/entries", {
          method: "POST",
          body: entryData,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal/entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
      setShowJournalEditor(false);
      resetEditor();
    },
  });

  const openJournalEditor = (entry?: any, prompt?: string) => {
    if (entry) {
      setCurrentEntry(entry);
      setTitle(entry.title || "");
      setContent(entry.content || "");
      setSelectedMood(entry.mood || "😊");
      // Load existing photos if any
      setUploadedPhotos(entry.photos || []);
    } else {
      setCurrentEntry(null);
      setTitle("");
      setContent(prompt ? `Prompt: ${prompt}\n\n` : "");
      setSelectedMood("😊");
      // Reset photos for new entry
      setUploadedPhotos([]);
      setSelectedPhotos([]);
    }
    setShowJournalEditor(true);
  };

  const resetEditor = () => {
    setCurrentEntry(null);
    setTitle("");
    setContent("");
    setSelectedMood("😊");
    setActiveTab("write");
    setUploadedPhotos([]);
    setSelectedPhotos([]);
    setUploadedVideos([]);
    setAiSuggestions([]);
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  // AI Integration Functions
  const generateAIPrompts = async () => {
    if (!content && uploadedPhotos.length === 0) return;
    
    setIsGeneratingAI(true);
    try {
      const response = await apiRequest("POST", "/api/ai/kid-prompts", {
        content: content,
        mood: selectedMood,
        hasPhotos: uploadedPhotos.length > 0,
        photoCount: uploadedPhotos.length
      });
      const data = await response.json();
      setAiSuggestions(data.prompts || []);
    } catch (error) {
      console.error("AI generation failed:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const sendAiMessage = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage = { sender: 'user' as const, text: aiInput };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput("");
    
    try {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message: aiInput,
        context: "kids_writing_help"
      });
      const data = await response.json();
      const aiMessage = { sender: 'ai' as const, text: data.response || "I'm here to help you write amazing stories!" };
      setAiMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI chat failed:", error);
      const errorMessage = { sender: 'ai' as const, text: "Oops! I had trouble understanding. Can you try asking again?" };
      setAiMessages(prev => [...prev, errorMessage]);
    }
  };

  // Calendar Functions
  const handleCalendarDateClick = (dayNumber: number) => {
    setSelectedCalendarDate(dayNumber);
    const entryForDay = calendarEntries[dayNumber];
    
    if (entryForDay) {
      // Open the existing entry for viewing/editing
      setSelectedDateEntry(entryForDay);
      openJournalEditor(entryForDay, null);
      console.log(`Opening entry for day ${dayNumber}: "${entryForDay.title}"`);
    } else {
      // Encourage writing on this day
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const promptForDay = `Write about what happened on ${currentMonth} ${dayNumber}! What made this day special?`;
      setSelectedDateEntry(null);
      openJournalEditor(null, promptForDay);
    }
  };

  // Build calendar entries from real journal data
  const buildCalendarFromEntries = (journalEntries: any[]) => {
    const entriesByDay: {[key: number]: any} = {};
    
    journalEntries.forEach(entry => {
      if (entry.createdAt) {
        const entryDate = new Date(entry.createdAt);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        // Only show entries from current month/year
        if (entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear) {
          const dayNumber = entryDate.getDate();
          entriesByDay[dayNumber] = entry;
        }
      }
    });
    
    setCalendarEntries(entriesByDay);
  };

  // Build calendar from real journal entries
  useEffect(() => {
    if (entries && entries.length > 0) {
      buildCalendarFromEntries(entries);
    }
  }, [entries]);

  // Camera and Media Capture Functions
  const capturePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, // Use back camera if available
        audio: false 
      });
      
      // Create video element to show camera preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.playsInline = true;
      
      // Create canvas to capture photo
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      // Create overlay UI for camera
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
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setUploadedPhotos(prev => [...prev, url]);
          
          const today = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
          cleanup();
          openJournalEditor(null, `📸 My Photo Story - ${today}`);
          setActiveTab("photos");
          setTitle(`📸 My Photo Story - ${today}`);
          setContent("Here's what I captured today! Let me tell you about this amazing moment...\n\n");
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
      const chunks = [];
      
      // Create audio context for visualizer
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        background: linear-gradient(135deg, rgba(255,100,150,0.95) 0%, rgba(100,200,255,0.95) 100%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: system-ui;
      `;
      
      const recordingTitle = document.createElement('div');
      recordingTitle.innerHTML = '🎤 Recording My Amazing Voice!';
      recordingTitle.style.cssText = `
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      `;
      
      const recordingSubtitle = document.createElement('div');
      recordingSubtitle.innerHTML = 'Tell me about your day! 🌟';
      recordingSubtitle.style.cssText = `
        font-size: 18px;
        margin-bottom: 40px;
        text-align: center;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
      `;
      
      // Kid-friendly audio visualizer canvas
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 150;
      canvas.style.cssText = `
        border: 3px solid rgba(255,255,255,0.8);
        border-radius: 20px;
        background: rgba(255,255,255,0.2);
        margin-bottom: 30px;
        box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      `;
      
      const ctx = canvas.getContext('2d');
      
      // Big friendly timer
      const timer = document.createElement('div');
      timer.innerHTML = '00:00';
      timer.style.cssText = `
        font-size: 40px;
        font-weight: bold;
        margin-bottom: 20px;
        color: #fff;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        background: rgba(255,255,255,0.2);
        padding: 10px 20px;
        border-radius: 15px;
        border: 2px solid rgba(255,255,255,0.3);
      `;
      
      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 20px;
      `;
      
      const stopButton = document.createElement('button');
      stopButton.innerHTML = '⏹️ Stop';
      stopButton.style.cssText = `
        padding: 20px 30px;
        font-size: 18px;
        background: linear-gradient(45deg, #ff6b6b, #ff5252);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
        transition: all 0.3s;
        font-weight: bold;
      `;
      
      const pauseButton = document.createElement('button');
      pauseButton.innerHTML = '⏸️ Pause';
      pauseButton.style.cssText = `
        padding: 20px 30px;
        font-size: 18px;
        background: linear-gradient(45deg, #ffa726, #ff9800);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(255, 167, 38, 0.4);
        transition: all 0.3s;
        font-weight: bold;
      `;
      
      const cancelButton = document.createElement('button');
      cancelButton.innerHTML = '❌ Cancel';
      cancelButton.style.cssText = `
        padding: 20px 30px;
        font-size: 18px;
        background: linear-gradient(45deg, #9e9e9e, #757575);
        color: white;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        box-shadow: 0 6px 20px rgba(158, 158, 158, 0.4);
        transition: all 0.3s;
        font-weight: bold;
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
      
      // Kid-friendly rainbow audio visualizer
      const animate = () => {
        if (mediaRecorder.state === 'recording' && !isPaused) {
          analyser.getByteFrequencyData(dataArray);
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = canvas.width / bufferLength * 2;
          let x = 0;
          
          const colors = ['#ff6b6b', '#ffa726', '#66bb6a', '#42a5f5', '#ab47bc', '#26c6da'];
          
          for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
            
            ctx.fillStyle = colors[i % colors.length];
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);
            
            // Add sparkle effect
            if (barHeight > 50) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.fillRect(x + barWidth/2 - 1, canvas.height - barHeight - 5, 2, 2);
            }
            
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
        
        setUploadedVideos(prev => [...prev, audioUrl]);
        
        audioContext.close();
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(recordingOverlay);
        
        openJournalEditor(null, `🎤 My Voice Story - ${today}`);
        setActiveTab("voice");
        setTitle(`🎤 My Voice Story - ${today}`);
        setContent("I recorded something special today! Here's what I want to remember...\n\n");
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
          pauseButton.innerHTML = '▶️ Go!';
          pauseButton.style.background = 'linear-gradient(45deg, #66bb6a, #4caf50)';
        } else if (mediaRecorder.state === 'paused') {
          mediaRecorder.resume();
          isPaused = false;
          startTime = Date.now();
          pauseButton.innerHTML = '⏸️ Pause';
          pauseButton.style.background = 'linear-gradient(45deg, #ffa726, #ff9800)';
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

  // Photo analysis function
  const analyzePhotos = async () => {
    if (uploadedPhotos.length === 0) {
      console.log("No photos to analyze");
      return;
    }
    
    setIsGeneratingAI(true);
    try {
      console.log(`Analyzing ${uploadedPhotos.length} photos for the little explorer!`);
      // Simulate photo analysis for kids
      setTimeout(() => {
        const kidFriendlyAnalysis = [
          "🌈 I see beautiful colors in your photos!",
          "👦 There are happy people having fun!",
          "🌳 I spot some amazing nature and trees!",
          "🎈 This looks like a super fun day!",
          "✨ Your photos are full of wonderful memories!"
        ];
        
        const randomAnalysis = kidFriendlyAnalysis[Math.floor(Math.random() * kidFriendlyAnalysis.length)];
        setAiSuggestions(prev => [...prev, randomAnalysis]);
        setIsGeneratingAI(false);
      }, 2000);
    } catch (error) {
      console.error("Photo analysis failed:", error);
      setIsGeneratingAI(false);
    }
  };

  // Speech-to-Text Functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you would implement speech-to-text conversion
        // For now, we'll simulate it
        const simulatedText = " I had the most amazing day today!";
        setContent(prev => prev + simulatedText);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Photo/Video Upload Functions
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedPhotos(prev => [...prev, result]);
          // Auto-generate AI insights when photo is uploaded
          setTimeout(generateAIPrompts, 500);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setUploadedVideos(prev => [...prev, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) return;
    
    const entryData = {
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
    };
    
    saveEntryMutation.mutate(entryData);
  };

  const kidMoodEmojis = ["😊", "😄", "🤔", "😐", "😔", "🌈", "🎉", "😴"];

  return (
    <div className="bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 min-h-screen relative overflow-hidden">
      {/* Navbar */}
      <Navbar currentView={currentTab} onNavigate={handleNavigate} />
      
      <div className="p-3 md:p-6 space-y-4 md:space-y-6">
        {/* Floating Animated Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 text-6xl"
        >
          🌟
        </motion.div>
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            rotate: [0, -180, -360]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-40 right-20 text-5xl"
        >
          🦋
        </motion.div>
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute bottom-20 left-1/4 text-4xl"
        >
          🌈
        </motion.div>
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-40 right-1/3 text-5xl"
        >
          🎈
        </motion.div>
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 22, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 text-4xl"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
            rotate: [0, -360, 0]
          }}
          transition={{ duration: 16, repeat: Infinity }}
          className="absolute top-60 left-1/3 text-3xl"
        >
          🎨
        </motion.div>
      </div>
      {/* Interface Switcher */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end mb-4"
      >
        <Card className="bg-white/80 backdrop-blur-sm border-2 border-purple-200 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-purple-700">Kid Mode</span>
              <Switch 
                checked={false}
                onCheckedChange={onSwitchToAdult}
                className="data-[state=checked]:bg-purple-500"
              />
              <span className="text-sm font-medium text-gray-500">Adult Mode</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Tab Content */}
      {currentTab === "dashboard" && (
        <>
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="relative inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Hey there, {user?.username || 'Little Writer'}! 🦉🌟
            </h1>
            <div className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</div>
          </div>
          <p className="text-gray-600 text-lg mt-2">Welcome to JournOwl! Ready to share what's in your heart today? 🦉</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
        >
          <Card className="bg-gradient-to-br from-purple-200 to-purple-300 border-purple-300 shadow-lg">
            <CardContent className="p-3 md:p-6 text-center">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="text-2xl font-bold text-purple-800">{stats.totalEntries || 0}</h3>
              <p className="text-purple-600">Stories Written</p>
              <div className="mt-3">
                <Badge className="bg-purple-500 text-white">Great job!</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-200 to-pink-300 border-pink-300 shadow-lg relative overflow-visible">
            <CardContent className="p-3 md:p-6 text-center">
              <div className="text-3xl md:text-4xl mb-2">🔥</div>
              <h3 className="text-xl md:text-2xl font-bold text-pink-800">{stats.currentStreak || 0} Day Streak!</h3>
              <p className="text-sm md:text-base text-pink-600">Keep writing every day to grow your streak!</p>
              <div className="mt-2 md:mt-3">
                <Badge className="bg-pink-500 text-white text-xs">Keep going!</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-200 to-amber-300 border-amber-300 shadow-lg col-span-2 md:col-span-1">
            <CardContent className="p-3 md:p-6 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <h3 className="text-2xl font-bold text-amber-800">Level {currentLevel}</h3>
              <p className="text-amber-600">Super Writer</p>
              <div className="mt-3">
                <Progress value={levelProgress} className="bg-amber-100" />
                <p className="text-xs text-amber-600 mt-1">{1000 - ((stats.xp || 0) % 1000)} XP to Level {currentLevel + 1}!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage Meters - Shared with Adult Interface */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <UsageMeters />
        </motion.div>

        {/* Quick Writing Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <Card className="bg-gradient-to-br from-blue-100 to-green-100 border-2 border-blue-300 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
                  ✍️ Quick Journal Entry
                </h3>
                <Button
                  onClick={() => setShowJournalEditor(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-xl font-bold"
                >
                  Start Writing! 📝
                </Button>
              </div>
              <p className="text-blue-700 mb-4">Ready to capture today's adventure? {selectedPrompt}</p>
              <Button
                onClick={() => setSelectedPrompt(kidPrompts[Math.floor(Math.random() * kidPrompts.length)])}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                🎲 New Idea!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        </>
      )}

      {/* Analytics Tab */}
      {currentTab === "analytics" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-800">📊 My Writing Stats!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-200 to-blue-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">📈</div>
                <h3 className="text-2xl font-bold text-blue-800">{stats.totalWords || 0}</h3>
                <p className="text-blue-600">Total Words Written</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-200 to-green-300">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-2">📅</div>
                <h3 className="text-2xl font-bold text-green-800">{entries.length || 0}</h3>
                <p className="text-green-600">Days I've Written</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {currentTab === "achievements" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-800">🏆 My Achievements!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userAchievements.slice(0, 6).map((achievement: any, index: number) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`border-2 ${achievement.isUnlocked ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 border-yellow-400' : 'bg-gray-200 border-gray-300'}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{achievement.isUnlocked ? '🏆' : '🔒'}</div>
                    <h3 className="font-bold text-sm">{achievement.title}</h3>
                    <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Goals Tab */}
      {currentTab === "goals" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-800">🎯 My Goals!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.slice(0, 6).map((goal: any, index: number) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-br from-pink-200 to-pink-300 border-2 border-pink-400">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h3 className="font-bold text-sm">{goal.title}</h3>
                    </div>
                    <p className="text-xs text-gray-700 mb-3">{goal.description}</p>
                    <div className="space-y-2">
                      <div className="bg-white/50 rounded-full h-3">
                        <div 
                          className="bg-pink-500 h-3 rounded-full transition-all"
                          style={{ width: `${Math.min(100, goal.progress || 0)}%` }}
                        />
                      </div>
                      <p className="text-xs font-medium">{Math.round(goal.progress || 0)}% Complete</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights Tab */}
      {currentTab === "ai-insights" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-800">🤖 AI Insights!</h2>
          <Card className="bg-gradient-to-br from-purple-200 to-purple-300">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">🦉</div>
              <h3 className="text-xl font-bold text-purple-800 mb-2">Your Writing Buddy Says:</h3>
              <p className="text-purple-700">
                "You're doing amazing! Keep writing every day to build your streak. 
                Your stories are getting more creative each time!"
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Memory Calendar Tab */}
      {currentTab === "memory-calendar" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-purple-800">📅 Memory Calendar!</h2>
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Calendar View</h3>
                <p className="text-gray-600">See all your writing days highlighted in color!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Stories Tab */}
      {currentTab === "ai-stories" && (
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center text-indigo-800">📚 AI Story Maker!</h2>
          <Card className="bg-gradient-to-br from-indigo-100 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-indigo-800 mb-2">Coming Soon!</h3>
              <p className="text-indigo-700">Create amazing stories from your journal entries!</p>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
    </div>
  );
}

export default KidDashboard;
