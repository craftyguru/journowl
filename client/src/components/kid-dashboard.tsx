import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Star, Trophy, Zap, Heart, BookOpen, Sparkles, Target, Gift } from "lucide-react";

const achievements = [
  { id: 1, title: "First Entry!", description: "You wrote your very first journal entry!", icon: "🎉", unlocked: true },
  { id: 2, title: "Happy Writer", description: "Wrote 5 entries with happy moods!", icon: "😊", unlocked: true },
  { id: 3, title: "Story Teller", description: "Wrote a 100-word entry!", icon: "📚", unlocked: true },
  { id: 4, title: "Week Warrior", description: "Wrote for 7 days in a row!", icon: "🏆", unlocked: false },
  { id: 5, title: "Creative Mind", description: "Used 10 different prompts!", icon: "🎨", unlocked: false },
  { id: 6, title: "Feeling Expert", description: "Used all mood emojis!", icon: "🌈", unlocked: false },
];

const kidPrompts = [
  "What made you smile today?",
  "If you could have any superpower, what would it be?",
  "What's your favorite thing about your best friend?",
  "Draw a picture of your dream bedroom!",
  "What would you do if you found a magic wand?",
];

const recentEntries = [
  { id: 1, title: "My Pet Hamster", mood: "😊", date: "Today", preview: "Fluffy did the funniest thing today..." },
  { id: 2, title: "School Adventure", mood: "🤔", date: "Yesterday", preview: "We learned about dinosaurs and..." },
  { id: 3, title: "Family Game Night", mood: "😄", date: "2 days ago", preview: "We played monopoly and I almost won..." },
];

export default function KidDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 min-h-screen">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Hey there, Little Writer! 🌟
          </h1>
          <div className="absolute -top-4 -right-4 text-2xl animate-bounce">✨</div>
        </div>
        <p className="text-gray-600 text-lg mt-2">Ready to share what's in your heart today?</p>
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
            <h3 className="text-2xl font-bold text-purple-800">12</h3>
            <p className="text-purple-600">Stories Written</p>
            <div className="mt-3">
              <Badge className="bg-purple-500 text-white">Great job!</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-200 to-pink-300 border-pink-300 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="text-2xl font-bold text-pink-800">5</h3>
            <p className="text-pink-600">Day Streak</p>
            <div className="mt-3">
              <Badge className="bg-pink-500 text-white">Keep going!</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-200 to-amber-300 border-amber-300 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-2xl font-bold text-amber-800">Level 3</h3>
            <p className="text-amber-600">Super Writer</p>
            <div className="mt-3">
              <Progress value={65} className="bg-amber-100" />
              <p className="text-xs text-amber-600 mt-1">35 XP to Level 4!</p>
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
                  <p className="text-purple-700 text-lg">"What made you smile today?"</p>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-lg">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Start Writing
                  </Button>
                  <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
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
                {recentEntries.map((entry, index) => (
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
              {achievements.map((achievement, index) => (
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