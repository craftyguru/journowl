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
import { Star, Trophy, Zap, Heart, BookOpen, Sparkles, Target, Gift, Camera, Palette, Music, GamepadIcon, Calendar, BarChart3, Users, Settings, X, Save, Plus, Mic, MicOff, Upload, Video, Image, Paintbrush, Lightbulb, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useCallback, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { ReactSketchCanvas } from "react-sketch-canvas";

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

export default function KidDashboard({ onSwitchToAdult }: KidDashboardProps) {
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
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiMessages, setAiMessages] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number | null>(null);
  const [calendarEntries, setCalendarEntries] = useState<{[key: number]: boolean}>({});
  
  // Refs for media handling
  const canvasRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const queryClient = useQueryClient();

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

  const user = userResponse?.user;
  
  // Use real user data from API
  const stats = statsResponse || {};
  const entries = entriesResponse || [];
  const userAchievements = achievementsResponse?.achievements || [];

  const currentLevel = Math.floor((stats.xp || 0) / 1000) + 1;
  const levelProgress = ((stats.xp || 0) % 1000) / 10; // Convert to percentage

  const getRandomPrompt = () => {
    const randomPrompt = kidPrompts[Math.floor(Math.random() * kidPrompts.length)];
    setSelectedPrompt(randomPrompt);
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
    } else {
      setCurrentEntry(null);
      setTitle("");
      setContent(prompt ? `Prompt: ${prompt}\n\n` : "");
      setSelectedMood("😊");
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
    const hasEntry = calendarEntries[dayNumber];
    
    if (hasEntry) {
      // Show celebration for visiting a day with an entry
      console.log(`Viewing entry for day ${dayNumber}!`);
    } else {
      // Encourage writing on this day
      const promptForDay = `Write about what happened on the ${dayNumber}th! What made this day special?`;
      openJournalEditor(null, promptForDay);
    }
  };

  const markCalendarEntry = (dayNumber: number) => {
    setCalendarEntries(prev => ({
      ...prev,
      [dayNumber]: true
    }));
  };

  // Initialize calendar with some demo entries
  const initializeCalendar = () => {
    const demoEntries: {[key: number]: boolean} = {};
    // Mark some random days as having entries
    [2, 7, 12, 16, 23, 25, 27].forEach(day => {
      demoEntries[day] = true;
    });
    setCalendarEntries(demoEntries);
  };

  // Initialize calendar on component mount
  useEffect(() => {
    initializeCalendar();
  }, []);

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
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 min-h-screen relative overflow-hidden">
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

        <Card className="bg-gradient-to-br from-pink-200 to-pink-300 border-pink-300 shadow-lg">
          <CardContent className="p-3 md:p-6 text-center">
            <div className="text-3xl md:text-4xl mb-2">🔥</div>
            <h3 className="text-xl md:text-2xl font-bold text-pink-800">{stats.currentStreak || 0}</h3>
            <p className="text-sm md:text-base text-pink-600">Day Streak</p>
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

      {/* 6-Tab Navigation System */}
      <div className="w-full relative z-10">
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="flex w-full overflow-x-auto scrollbar-hide bg-white/90 backdrop-blur-lg border-3 border-purple-300 shadow-2xl rounded-2xl p-2 gap-2 md:grid md:grid-cols-6 md:gap-1 mb-6">
            <TabsTrigger 
              value="write" 
              className="flex-shrink-0 min-w-[100px] h-12 px-3 py-2 text-sm font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-blue-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 hover:text-white hover:bg-green-400/50 transition-all duration-200 border-2 border-transparent data-[state=active]:border-white/40"
            >
              ✍️ Write
            </TabsTrigger>
            <TabsTrigger 
              value="achievements" 
              className="flex-shrink-0 min-w-[100px] h-12 px-3 py-2 text-sm font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 hover:text-white hover:bg-yellow-400/50 transition-all duration-200 border-2 border-transparent data-[state=active]:border-white/40"
            >
              🏆 Badges
            </TabsTrigger>
            <TabsTrigger 
              value="calendar" 
              className="flex-shrink-0 min-w-[100px] h-12 px-3 py-2 text-sm font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-indigo-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 hover:text-white hover:bg-purple-400/50 transition-all duration-200 border-2 border-transparent data-[state=active]:border-white/40"
            >
              📅 Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="flex-shrink-0 min-w-[100px] h-12 px-3 py-2 text-sm font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 hover:text-white hover:bg-pink-400/50 transition-all duration-200 border-2 border-transparent data-[state=active]:border-white/40"
            >
              📸 Photos
            </TabsTrigger>
            <TabsTrigger 
              value="ai" 
              className="flex-shrink-0 min-w-[100px] h-12 px-3 py-2 text-sm font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-red-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 hover:text-white hover:bg-orange-400/50 transition-all duration-200 border-2 border-transparent data-[state=active]:border-white/40"
            >
              🤖 AI Help
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="flex-shrink-0 min-w-[100px] h-12 px-3 py-2 text-sm font-bold rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-400 data-[state=active]:to-cyan-400 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-600 hover:text-white hover:bg-teal-400/50 transition-all duration-200 border-2 border-transparent data-[state=active]:border-white/40"
            >
              📊 My Stats
            </TabsTrigger>
          </TabsList>

          {/* Write Tab */}
          <TabsContent value="write" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Super Fun Writing Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                {/* Floating Animation Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-3xl z-10"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-1 -left-1 text-2xl z-10"
                >
                  🌟
                </motion.div>

                <Card className="bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 border-4 border-rainbow shadow-2xl overflow-hidden relative">
                  <CardHeader className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 text-white relative overflow-hidden">
                    <motion.div
                      animate={{ x: [-20, 20, -20] }}
                      transition={{ duration: 6, repeat: Infinity }}
                      className="absolute top-2 left-4 text-2xl"
                    >
                      🎨
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute top-2 right-4 text-2xl"
                    >
                      🚀
                    </motion.div>
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold z-10 relative">
                      <Sparkles className="w-8 h-8" />
                      Start Your Amazing Story!
                      <Sparkles className="w-8 h-8" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Interactive Prompt Selector */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="relative p-6 bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 rounded-3xl border-3 border-rainbow shadow-lg"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute top-2 right-2 text-2xl"
                      >
                        🎭
                      </motion.div>
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div
                          animate={{ bounce: [0, -5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-3xl"
                        >
                          💡
                        </motion.div>
                        <span className="font-bold text-xl text-purple-800">Today's Magic Prompt:</span>
                      </div>
                      <p className="text-purple-700 text-xl font-medium mb-4 leading-relaxed">
                        "{selectedPrompt}"
                      </p>
                      <div className="flex gap-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button 
                            className="w-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 hover:from-green-500 hover:via-blue-600 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-2xl shadow-xl border-2 border-white"
                            onClick={() => openJournalEditor(null, selectedPrompt)}
                          >
                            <BookOpen className="w-5 h-5 mr-2" />
                            Start Writing! 🎉
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button 
                            variant="outline" 
                            className="border-3 border-purple-400 bg-white text-purple-700 hover:bg-purple-50 font-bold py-4 px-6 rounded-2xl shadow-lg"
                            onClick={getRandomPrompt}
                          >
                            <Sparkles className="w-5 h-5 mr-2" />
                            ✨ New Magic!
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Fun Writing Tools */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        className="bg-gradient-to-br from-pink-200 to-red-200 p-4 rounded-2xl border-3 border-pink-400 cursor-pointer shadow-lg"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎨</div>
                          <p className="font-bold text-pink-800">Draw & Write</p>
                          <p className="text-pink-600 text-sm">Add drawings!</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02, rotate: -1 }}
                        className="bg-gradient-to-br from-blue-200 to-cyan-200 p-4 rounded-2xl border-3 border-blue-400 cursor-pointer shadow-lg"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">📸</div>
                          <p className="font-bold text-blue-800">Photo Story</p>
                          <p className="text-blue-600 text-sm">Add pictures!</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02, rotate: 1 }}
                        className="bg-gradient-to-br from-green-200 to-emerald-200 p-4 rounded-2xl border-3 border-green-400 cursor-pointer shadow-lg"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">🎤</div>
                          <p className="font-bold text-green-800">Voice Story</p>
                          <p className="text-green-600 text-sm">Talk to write!</p>
                        </div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02, rotate: -1 }}
                        className="bg-gradient-to-br from-orange-200 to-yellow-200 p-4 rounded-2xl border-3 border-orange-400 cursor-pointer shadow-lg"
                      >
                        <div className="text-center">
                          <div className="text-3xl mb-2">🤖</div>
                          <p className="font-bold text-orange-800">AI Helper</p>
                          <p className="text-orange-600 text-sm">Get ideas!</p>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* My Amazing Stories */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-2xl z-10"
                >
                  📚
                </motion.div>
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-1 -left-1 text-2xl z-10"
                >
                  ⭐
                </motion.div>

                <Card className="bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 border-4 border-rainbow shadow-2xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 text-white relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute top-2 left-4 text-2xl"
                    >
                      📖
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute top-2 right-4 text-2xl"
                    >
                      🌟
                    </motion.div>
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl font-bold z-10 relative">
                      <BookOpen className="w-8 h-8" />
                      My Amazing Stories!
                      <Heart className="w-8 h-8" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {entries.length > 0 ? (
                      <div className="space-y-4">
                        {entries.slice(0, 3).map((entry, index) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="p-4 rounded-2xl bg-gradient-to-r from-white via-blue-50 to-cyan-50 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <motion.div 
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-4xl"
                              >
                                {entry.mood}
                              </motion.div>
                              <div className="flex-1">
                                <h4 className="font-bold text-blue-800 text-lg mb-1">{entry.title}</h4>
                                <p className="text-blue-600 text-sm mb-2">{entry.preview}</p>
                                <div className="flex items-center gap-3">
                                  <Badge className="bg-blue-500 text-white font-bold">
                                    {entry.date}
                                  </Badge>
                                  <div className="flex gap-1">
                                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-bold">
                                      📝 {entry.wordCount || 0} words
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.2 }}
                                className="text-2xl"
                              >
                                ➡️
                              </motion.div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <motion.div
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0] 
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="text-8xl mb-4"
                        >
                          📖
                        </motion.div>
                        <h3 className="text-2xl font-bold text-blue-800 mb-3">No stories yet!</h3>
                        <p className="text-blue-600 text-lg mb-6">Time to create your first amazing adventure!</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => openJournalEditor()}
                            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-xl border-2 border-white"
                          >
                            <Plus className="w-5 h-5 mr-2" />
                            🌟 Write My First Story!
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white shadow-lg border-2 border-amber-200">
                <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Trophy className="w-6 h-6" />
                    My Awesome Badges!
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userAchievements.slice(0, showAllAchievements ? userAchievements.length : 6).map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`p-4 rounded-lg text-center transition-all cursor-pointer ${
                          achievement.unlocked
                            ? 'bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 shadow-md hover:shadow-lg'
                            : 'bg-gray-100 border-2 border-gray-200 opacity-60'
                        }`}
                      >
                        <div className={`text-3xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                          {achievement.icon}
                        </div>
                        <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-amber-800' : 'text-gray-500'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-xs mt-1 ${achievement.unlocked ? 'text-amber-600' : 'text-gray-400'}`}>
                          {achievement.description}
                        </p>
                        {achievement.unlocked && (
                          <Badge className="mt-2 bg-amber-500 text-white text-xs">Unlocked!</Badge>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-purple-800 mb-2">My Writing Calendar</h3>
                <p className="text-purple-600 mb-4">Track your amazing writing adventures!</p>
              </div>

              {/* Interactive Calendar Grid */}
              <div className="bg-white rounded-3xl p-4 md:p-6 border-3 border-purple-300 shadow-xl">
                <div className="grid grid-cols-7 gap-2 md:gap-3 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center font-bold text-purple-700 py-1 md:py-2 text-xs md:text-sm">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2 md:gap-3">
                  {[...Array(30)].map((_, i) => {
                    const dayNumber = i + 1;
                    const hasEntry = calendarEntries[dayNumber];
                    const isToday = dayNumber === new Date().getDate();
                    const isSelected = selectedCalendarDate === dayNumber;
                    
                    return (
                      <motion.div 
                        key={i}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCalendarDateClick(dayNumber)}
                        className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-xs md:text-sm font-bold cursor-pointer transition-all min-h-[40px] ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-400 to-pink-400 border-purple-500 shadow-xl scale-105"
                            : isToday 
                              ? "bg-gradient-to-br from-yellow-300 to-orange-300 border-orange-400 shadow-lg" 
                              : hasEntry 
                                ? "bg-gradient-to-br from-green-200 to-emerald-200 border-green-400 shadow-md" 
                                : "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 hover:from-purple-200 hover:to-pink-200 hover:shadow-md"
                        }`}
                      >
                        <span className={
                          isSelected 
                            ? "text-white" 
                            : isToday 
                              ? "text-orange-800" 
                              : hasEntry 
                                ? "text-green-800" 
                                : "text-purple-700"
                        }>
                          {dayNumber}
                        </span>
                        {hasEntry && (
                          <motion.span 
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xs"
                          >
                            ✨
                          </motion.span>
                        )}
                        {isToday && (
                          <motion.span 
                            animate={{ bounce: [0, -2, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="text-xs"
                          >
                            📝
                          </motion.span>
                        )}
                        {isSelected && <span className="text-xs text-white">👆</span>}
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Interactive Calendar Legend */}
                <div className="flex justify-center gap-3 md:gap-4 mt-6 flex-wrap">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-5 h-5 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-lg border-2 border-orange-400 shadow-sm"
                    ></motion.div>
                    <span className="text-xs md:text-sm text-purple-700 font-medium">📝 Today</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-5 h-5 bg-gradient-to-br from-green-200 to-emerald-200 rounded-lg border-2 border-green-400 shadow-sm"
                    ></motion.div>
                    <span className="text-xs md:text-sm text-purple-700 font-medium">✨ Story Written</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-5 h-5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 shadow-sm"></div>
                    <span className="text-xs md:text-sm text-purple-700 font-medium">📅 Available</span>
                  </motion.div>
                </div>

                {/* Interactive Calendar Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openJournalEditor(null, "Write about your day today!")}
                    className="bg-gradient-to-r from-green-400 to-cyan-400 p-4 rounded-2xl border-3 border-green-500 cursor-pointer shadow-lg text-center"
                  >
                    <div className="text-2xl mb-2">✍️</div>
                    <p className="text-white font-bold text-sm">Write Today!</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCalendarDate(null)}
                    className="bg-gradient-to-r from-purple-400 to-pink-400 p-4 rounded-2xl border-3 border-purple-500 cursor-pointer shadow-lg text-center"
                  >
                    <div className="text-2xl mb-2">🔄</div>
                    <p className="text-white font-bold text-sm">Clear Selection</p>
                  </motion.div>
                </div>
              </div>

              {/* Writing Streak Counter */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-gradient-to-r from-pink-200 to-purple-200 rounded-2xl p-6 border-3 border-pink-300 text-center mt-6"
              >
                <div className="text-4xl mb-2">🔥</div>
                <h4 className="text-xl font-bold text-purple-800 mb-1">{stats.currentStreak || 0} Day Streak!</h4>
                <p className="text-purple-600">Keep writing every day to grow your streak!</p>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  📸
                </motion.div>
                <h3 className="text-3xl font-bold text-pink-800 mb-2">Photo Story Magic!</h3>
                <p className="text-pink-600 text-lg mb-6">Turn your pictures into amazing stories!</p>
              </div>

              {/* Interactive Photo Tools */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Upload Photos Section */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 rounded-3xl border-4 border-pink-400 shadow-2xl relative overflow-hidden"
                >
                  <motion.div
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    ✨
                  </motion.div>
                  <div className="text-center">
                    <motion.div
                      animate={{ bounce: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      🎨
                    </motion.div>
                    <h4 className="text-xl font-bold text-pink-800 mb-3">Upload Your Photos</h4>
                    <p className="text-pink-600 mb-4">Add pictures from your adventures!</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl">
                        <Camera className="w-5 h-5 mr-2" />
                        📱 Upload Photos!
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* AI Photo Analysis */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-200 via-cyan-200 to-blue-200 p-6 rounded-3xl border-4 border-green-400 shadow-2xl relative overflow-hidden"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    🤖
                  </motion.div>
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      🔍
                    </motion.div>
                    <h4 className="text-xl font-bold text-green-800 mb-3">AI Photo Detective</h4>
                    <p className="text-green-600 mb-4">Let AI tell you what's in your photos!</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 hover:from-green-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl">
                        <Lightbulb className="w-5 h-5 mr-2" />
                        🕵️ Analyze Photos!
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Fun Photo Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-yellow-200 to-orange-200 p-4 rounded-2xl border-3 border-yellow-400 cursor-pointer shadow-lg text-center"
                >
                  <div className="text-4xl mb-2">🌈</div>
                  <p className="font-bold text-yellow-800 text-sm">Add Filters</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-purple-200 to-pink-200 p-4 rounded-2xl border-3 border-purple-400 cursor-pointer shadow-lg text-center"
                >
                  <div className="text-4xl mb-2">🎭</div>
                  <p className="font-bold text-purple-800 text-sm">Add Stickers</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-blue-200 to-cyan-200 p-4 rounded-2xl border-3 border-blue-400 cursor-pointer shadow-lg text-center"
                >
                  <div className="text-4xl mb-2">✏️</div>
                  <p className="font-bold text-blue-800 text-sm">Draw on Photos</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-green-200 to-emerald-200 p-4 rounded-2xl border-3 border-green-400 cursor-pointer shadow-lg text-center"
                >
                  <div className="text-4xl mb-2">📝</div>
                  <p className="font-bold text-green-800 text-sm">Add Text</p>
                </motion.div>
              </div>

              {/* Photo Gallery */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border-4 border-rainbow shadow-2xl"
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="text-3xl"
                  >
                    🎪
                  </motion.div>
                  <h4 className="text-2xl font-bold text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    My Photo Collection
                  </h4>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-3xl"
                  >
                    🖼️
                  </motion.div>
                </div>
                
                {uploadedPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedPhotos.map((photo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        className="relative group rounded-2xl overflow-hidden border-4 border-pink-300 shadow-lg cursor-pointer"
                      >
                        <img 
                          src={photo} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 left-2 right-2 text-center">
                            <span className="text-white font-bold text-sm">✨ Click to Edit ✨</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-center py-12"
                  >
                    <div className="text-8xl mb-4">📷</div>
                    <h5 className="text-xl font-bold text-gray-600 mb-2">No photos yet!</h5>
                    <p className="text-gray-500 mb-6">Upload your first photo to start the magic!</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-rainbow to-purple-600 text-white font-bold py-3 px-8 rounded-2xl shadow-xl">
                        <Camera className="w-5 h-5 mr-2" />
                        🌟 Add Your First Photo!
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* AI Help Tab */}
          <TabsContent value="ai" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-8xl mb-4"
                >
                  🤖
                </motion.div>
                <h3 className="text-3xl font-bold text-orange-800 mb-2">AI Writing Buddy!</h3>
                <p className="text-orange-600 text-lg mb-6">Your smart friend who helps you write amazing stories!</p>
              </div>

              {/* AI Chat Interface */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 rounded-3xl p-6 border-4 border-orange-400 shadow-2xl mb-6 relative overflow-hidden"
              >
                <motion.div
                  animate={{ x: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-2 right-2 text-2xl"
                >
                  ✨
                </motion.div>
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ bounce: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl"
                  >
                    🧠
                  </motion.div>
                  <div>
                    <h4 className="text-2xl font-bold text-orange-800">Ask Me Anything!</h4>
                    <p className="text-orange-600">I love helping kids with their stories!</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-white rounded-2xl p-4 mb-4 max-h-64 overflow-y-auto border-2 border-orange-300">
                  {aiMessages.length > 0 ? (
                    <div className="space-y-3">
                      {aiMessages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs p-3 rounded-2xl ${
                            message.sender === 'user' 
                              ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white' 
                              : 'bg-gradient-to-r from-orange-200 to-yellow-200 text-orange-800 border-2 border-orange-300'
                          }`}>
                            {message.sender === 'ai' && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm">🤖</span>
                                <span className="font-bold text-xs">AI Buddy</span>
                              </div>
                            )}
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-4xl mb-3"
                      >
                        💭
                      </motion.div>
                      <p className="text-orange-600 font-medium">Ask me anything about writing stories!</p>
                      <p className="text-orange-500 text-sm">I can help with ideas, characters, plots, and more!</p>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="What should I write about? 🤔"
                    className="flex-1 p-3 rounded-2xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-orange-800 placeholder-orange-400 font-medium"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={sendAiMessage}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Quick AI Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Story Ideas */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-200 to-pink-200 p-6 rounded-3xl border-4 border-purple-400 shadow-xl"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >
                      💡
                    </motion.div>
                    <h4 className="text-xl font-bold text-purple-800 mb-3">Get Story Ideas</h4>
                    <p className="text-purple-600 mb-4">Need inspiration for your next adventure?</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg">
                        🌟 Get Ideas!
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Character Creator */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-green-200 to-cyan-200 p-6 rounded-3xl border-4 border-green-400 shadow-xl"
                >
                  <div className="text-center">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >
                      🦸
                    </motion.div>
                    <h4 className="text-xl font-bold text-green-800 mb-3">Create Characters</h4>
                    <p className="text-green-600 mb-4">Build amazing heroes and friends!</p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg">
                        👥 Make Characters!
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Fun Quick Prompts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-6 border-4 border-rainbow shadow-2xl mt-6"
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ bounce: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl mb-2"
                  >
                    🎲
                  </motion.div>
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Quick Story Starters
                  </h4>
                  <p className="text-gray-600">Click any button to get instant writing ideas!</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-blue-200 to-cyan-200 p-4 rounded-2xl border-3 border-blue-400 cursor-pointer shadow-lg text-center"
                  >
                    <div className="text-3xl mb-2">🐉</div>
                    <p className="font-bold text-blue-800 text-sm">Dragons</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-pink-200 to-purple-200 p-4 rounded-2xl border-3 border-pink-400 cursor-pointer shadow-lg text-center"
                  >
                    <div className="text-3xl mb-2">🧚‍♀️</div>
                    <p className="font-bold text-pink-800 text-sm">Fairies</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-green-200 to-emerald-200 p-4 rounded-2xl border-3 border-green-400 cursor-pointer shadow-lg text-center"
                  >
                    <div className="text-3xl mb-2">🚀</div>
                    <p className="font-bold text-green-800 text-sm">Space</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-br from-yellow-200 to-orange-200 p-4 rounded-2xl border-3 border-yellow-400 cursor-pointer shadow-lg text-center"
                  >
                    <div className="text-3xl mb-2">🏰</div>
                    <p className="font-bold text-yellow-800 text-sm">Castles</p>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-8"
            >
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-teal-800 mb-2">My Writing Stats</h3>
              <p className="text-teal-600 mb-4">See how awesome you're doing!</p>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl border-2 border-teal-300">
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-xl font-bold text-teal-800">{stats.totalEntries || 0}</div>
                  <div className="text-teal-600 text-sm">Stories</div>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-4 rounded-2xl border-2 border-orange-300">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-xl font-bold text-orange-800">{stats.currentStreak || 0}</div>
                  <div className="text-orange-600 text-sm">Day Streak</div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Kid-Friendly Journal Editor Modal */}
      <AnimatePresence>
        {showJournalEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="w-full max-w-4xl max-h-[95vh] bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col border-4 border-rainbow"
              style={{
                background: `linear-gradient(135deg, 
                  #fef3c7 0%, 
                  #fed7d7 25%, 
                  #e0e7ff 50%, 
                  #dcfce7 75%, 
                  #fef3c7 100%)`,
                borderImage: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57) 1',
              }}
            >
              {/* Fun Header */}
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-6 text-center relative overflow-hidden">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-2 left-4 text-3xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-2 right-4 text-3xl"
                >
                  🌟
                </motion.div>
                <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
                  {currentEntry ? "✏️ Edit Your Story" : "📝 Write Your Story!"}
                </h2>
                <p className="text-pink-100">Share your thoughts and let your creativity shine!</p>
                
                <Button
                  onClick={() => setShowJournalEditor(false)}
                  variant="ghost"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Editor Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Mood Selector */}
                <div className="mb-6">
                  <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    How are you feeling today?
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {kidMoodEmojis.map((emoji) => (
                      <motion.button
                        key={emoji}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`text-4xl p-3 rounded-2xl border-3 transition-all ${
                          selectedMood === emoji 
                            ? "bg-gradient-to-br from-yellow-200 to-orange-200 border-orange-400 shadow-lg transform scale-110" 
                            : "bg-white/80 border-gray-300 hover:bg-gradient-to-br hover:from-yellow-100 hover:to-orange-100"
                        }`}
                        onClick={() => setSelectedMood(emoji)}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Title Input */}
                <div className="mb-6">
                  <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    What's your story about?
                  </Label>
                  <Input
                    placeholder="Give your story a fun title!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl p-4 rounded-2xl border-3 border-purple-300 bg-white/80 font-bold text-purple-800 placeholder:text-purple-400"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  />
                </div>

                {/* Multi-Tab Interface */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-1">
                    <TabsTrigger value="write" className="text-purple-700 font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="draw" className="text-purple-700 font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <Paintbrush className="w-4 h-4 mr-2" />
                      Draw
                    </TabsTrigger>
                    <TabsTrigger value="voice" className="text-purple-700 font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <Mic className="w-4 h-4 mr-2" />
                      Voice
                    </TabsTrigger>
                    <TabsTrigger value="photos" className="text-purple-700 font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <Camera className="w-4 h-4 mr-2" />
                      Photos
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="text-purple-700 font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      AI Help
                    </TabsTrigger>
                  </TabsList>

                  {/* Writing Tab */}
                  <TabsContent value="write" className="mt-4">
                    <div>
                      <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Tell your story!
                      </Label>
                      <Textarea
                        placeholder="Write about your day, your dreams, your adventures... Let your imagination run wild!"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px] text-lg p-4 rounded-2xl border-3 border-purple-300 bg-white/80 text-purple-800 placeholder:text-purple-400 resize-none"
                        style={{ fontFamily: 'Comic Sans MS, cursive' }}
                      />
                      
                      {/* Word Count */}
                      <div className="mt-2 text-center">
                        <Badge className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-4 py-2 text-lg">
                          {content.split(' ').filter(word => word.length > 0).length} words ✨
                        </Badge>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Drawing Tab */}
                  <TabsContent value="draw" className="mt-4">
                    <div>
                      <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                        <Paintbrush className="w-5 h-5" />
                        Draw your story!
                      </Label>
                      <div className="bg-white rounded-2xl border-3 border-purple-300 p-4">
                        <ReactSketchCanvas
                          ref={canvasRef}
                          style={{
                            border: "2px dashed #a855f7",
                            borderRadius: "16px",
                            cursor: "crosshair"
                          }}
                          width="100%"
                          height="300px"
                          strokeWidth={4}
                          strokeColor="#7c3aed"
                          canvasColor="white"
                        />
                        <div className="flex gap-2 mt-4 justify-center">
                          <Button
                            onClick={clearCanvas}
                            variant="outline"
                            className="border-purple-300 text-purple-600 hover:bg-purple-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Voice Tab */}
                  <TabsContent value="voice" className="mt-4">
                    <div>
                      <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                        <Mic className="w-5 h-5" />
                        Speak your story!
                      </Label>
                      <div className="bg-white rounded-2xl border-3 border-purple-300 p-8 text-center">
                        <motion.div
                          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="text-6xl mb-4"
                        >
                          {isRecording ? "🎤" : "🎙️"}
                        </motion.div>
                        <p className="text-purple-700 text-lg mb-6">
                          {isRecording ? "Listening... Speak your story!" : "Click to start recording your voice"}
                        </p>
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          className={`px-8 py-4 text-lg font-bold rounded-2xl ${
                            isRecording 
                              ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600" 
                              : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                          } text-white`}
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="w-5 h-5 mr-2" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="w-5 h-5 mr-2" />
                              Start Recording
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Photos Tab */}
                  <TabsContent value="photos" className="mt-4">
                    <div>
                      <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Add photos and videos!
                      </Label>
                      
                      {/* Upload Buttons */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div
                          onClick={() => photoInputRef.current?.click()}
                          className="bg-gradient-to-br from-pink-100 to-purple-100 border-3 border-dashed border-pink-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-gradient-to-br hover:from-pink-200 hover:to-purple-200 transition-all"
                        >
                          <Image className="w-12 h-12 mx-auto mb-3 text-pink-600" />
                          <p className="text-pink-700 font-bold">Upload Photos</p>
                          <p className="text-pink-600 text-sm">JPG, PNG files</p>
                        </div>
                        
                        <div
                          onClick={() => videoInputRef.current?.click()}
                          className="bg-gradient-to-br from-blue-100 to-cyan-100 border-3 border-dashed border-blue-300 rounded-2xl p-6 text-center cursor-pointer hover:bg-gradient-to-br hover:from-blue-200 hover:to-cyan-200 transition-all"
                        >
                          <Video className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                          <p className="text-blue-700 font-bold">Upload Videos</p>
                          <p className="text-blue-600 text-sm">MP4, MOV files</p>
                        </div>
                      </div>

                      {/* Hidden File Inputs */}
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoUpload}
                        className="hidden"
                      />

                      {/* Uploaded Media Preview */}
                      {(uploadedPhotos.length > 0 || uploadedVideos.length > 0) && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {uploadedPhotos.map((photo, index) => (
                            <div key={index} className="relative">
                              <img
                                src={photo}
                                alt={`Upload ${index + 1}`}
                                className="w-full h-24 object-cover rounded-xl border-2 border-purple-300"
                              />
                              <Button
                                onClick={() => setUploadedPhotos(prev => prev.filter((_, i) => i !== index))}
                                variant="ghost"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          {uploadedVideos.map((video, index) => (
                            <div key={index} className="relative">
                              <video
                                src={video}
                                className="w-full h-24 object-cover rounded-xl border-2 border-blue-300"
                                controls
                              />
                              <Button
                                onClick={() => setUploadedVideos(prev => prev.filter((_, i) => i !== index))}
                                variant="ghost"
                                className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* AI Help Tab */}
                  <TabsContent value="ai" className="mt-4">
                    <div>
                      <Label className="text-lg font-bold text-purple-700 mb-3 block flex items-center gap-2">
                        <Lightbulb className="w-5 h-5" />
                        AI Writing Helper!
                      </Label>
                      
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-3 border-yellow-300 p-6">
                        <div className="text-center mb-4">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-4xl mb-2"
                          >
                            🤖
                          </motion.div>
                          <p className="text-orange-700 font-bold mb-2">Your AI Writing Buddy!</p>
                          <p className="text-orange-600 text-sm mb-4">
                            I can help you think of ideas based on your photos, mood, and what you've written so far!
                          </p>
                        </div>

                        <Button
                          onClick={generateAIPrompts}
                          disabled={isGeneratingAI || (!content && uploadedPhotos.length === 0)}
                          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl mb-4"
                        >
                          {isGeneratingAI ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                          ) : (
                            <Sparkles className="w-5 h-5 mr-2" />
                          )}
                          {isGeneratingAI ? "Thinking..." : "Get Writing Ideas!"}
                        </Button>

                        {/* AI Suggestions */}
                        {aiSuggestions.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="font-bold text-orange-700">💡 Here are some fun ideas:</h4>
                            {aiSuggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/80 rounded-xl p-3 border-2 border-yellow-200 cursor-pointer hover:bg-white transition-all"
                                onClick={() => setContent(prev => prev + (prev ? "\n\n" : "") + suggestion)}
                              >
                                <p className="text-orange-700 font-medium">{suggestion}</p>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Action Buttons */}
              <div className="p-6 bg-gradient-to-r from-purple-100 to-pink-100 border-t-4 border-purple-300">
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setShowJournalEditor(false)}
                    variant="outline"
                    className="px-8 py-3 text-lg font-bold border-3 border-gray-400 text-gray-600 hover:bg-gray-100 rounded-2xl"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!title.trim() || !content.trim() || saveEntryMutation.isPending}
                    className="px-8 py-3 text-lg font-bold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-2xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Comic Sans MS, cursive' }}
                  >
                    {saveEntryMutation.isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        Save My Story! 🎉
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}