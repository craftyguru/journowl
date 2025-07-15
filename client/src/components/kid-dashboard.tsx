import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Trophy, Zap, Heart, BookOpen, Sparkles, Target, Gift, Camera, Palette, Music, GamepadIcon, Calendar, BarChart3, Users, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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
  
  // Check if demo mode is enabled via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isDemoMode = urlParams.get('demo') === 'true';
  
  // Use Timmy's demo data when ?demo=true, real data otherwise
  const stats = isDemoMode ? timmyDemoStats : (statsResponse?.stats || {});
  const entries = isDemoMode ? timmyDemoEntries : (entriesResponse || []);
  const userAchievements = isDemoMode ? timmyDemoAchievements : (achievementsResponse?.achievements || []);

  const currentLevel = Math.floor((stats.xp || 0) / 1000) + 1;
  const levelProgress = ((stats.xp || 0) % 1000) / 10; // Convert to percentage

  const getRandomPrompt = () => {
    const randomPrompt = kidPrompts[Math.floor(Math.random() * kidPrompts.length)];
    setSelectedPrompt(randomPrompt);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 min-h-screen">
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
            Hey there, {isDemoMode ? 'Little Timmy' : (user?.username || 'Little Writer')}! 🦉🌟
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-gradient-to-br from-purple-200 to-purple-300 border-purple-300 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">📝</div>
            <h3 className="text-2xl font-bold text-purple-800">{stats.totalEntries || 0}</h3>
            <p className="text-purple-600">Stories Written</p>
            <div className="mt-3">
              <Badge className="bg-purple-500 text-white">Great job!</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-200 to-pink-300 border-pink-300 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="text-2xl font-bold text-pink-800">{stats.currentStreak || 0}</h3>
            <p className="text-pink-600">Day Streak</p>
            <div className="mt-3">
              <Badge className="bg-pink-500 text-white">Keep going!</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-200 to-amber-300 border-amber-300 shadow-lg">
          <CardContent className="p-6 text-center">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Write */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white shadow-lg border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="w-6 h-6" />
                Start Writing!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border-2 border-dashed border-purple-300">
                  <h4 className="font-semibold text-purple-800 mb-2">Today's Fun Prompt:</h4>
                  <p className="text-purple-700 text-lg">"{selectedPrompt}"</p>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Writing
                  </Button>
                  <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50" onClick={getRandomPrompt}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    New Prompt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Entries */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white shadow-lg border-2 border-blue-200">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpen className="w-6 h-6" />
                My Stories
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {entries.slice(0, 3).map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{entry.mood}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-800">{entry.title}</h4>
                        <p className="text-blue-600 text-sm">{entry.preview}</p>
                        <p className="text-blue-500 text-xs mt-1">{entry.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Achievements Section */}
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

      {/* Fun Prompts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-white shadow-lg border-2 border-emerald-200">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Heart className="w-6 h-6" />
              Fun Ideas to Write About!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {kidPrompts.map((prompt, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 hover:shadow-md transition-all cursor-pointer"
                >
                  <p className="text-emerald-700 font-medium">{prompt}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer Encouragement */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center p-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl border-2 border-purple-300"
      >
        <div className="text-3xl mb-2">🌟</div>
        <h3 className="text-lg font-semibold text-purple-800 mb-1">You're doing amazing!</h3>
        <p className="text-purple-600">Keep writing and sharing your wonderful thoughts. Every story makes you a better writer!</p>
      </motion.div>
    </div>
  );
}