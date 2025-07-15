import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, TrendingUp, Zap, BookOpen, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface LandingHeroProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Express your feelings with beautiful emojis and track your emotional journey",
    color: "text-pink-400"
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Get personalized insights and prompts powered by advanced AI",
    color: "text-purple-400"
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics", 
    description: "Visualize your growth with beautiful charts and streak tracking",
    color: "text-emerald-400"
  },
  {
    icon: Zap,
    title: "Gamification",
    description: "Level up, earn XP, and unlock achievements as you journal",
    color: "text-amber-400"
  }
];

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 text-center">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">AI-Powered Journaling</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent mb-6 leading-tight">
            Transform Your
            <br />
            <span className="animate-pulse">Mind & Mood</span>
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border-2 border-white">👩‍💼</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold border-2 border-white">👩‍💻</div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold border-2 border-white">🧒</div>
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-purple-400 font-semibold">2,847</span> writers already transforming their lives
            </div>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Discover the power of journaling with AI insights, mood tracking, and gamified progress. 
            Your personal wellness companion awaits.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          <Button
            onClick={onGetStarted}
            className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Start Your Journey
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = window.location.href + '?demo=true'}
            className="px-8 py-4 text-lg font-semibold border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10 rounded-xl backdrop-blur-sm transition-all duration-300"
          >
            <Heart className="w-5 h-5 mr-2" />
            View Live Demos
          </Button>
        </motion.div>

        {/* Live Demo Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="text-center mb-6">
            <p className="text-gray-300 text-lg mb-4">See it in action - Choose your experience:</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-purple-300 hover:bg-white/10 transition-all cursor-pointer">
                👩‍💼 Admin Dashboard
              </div>
              <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-emerald-300 hover:bg-white/10 transition-all cursor-pointer">
                👩‍💻 Professional Writer
              </div>
              <div className="px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-pink-300 hover:bg-white/10 transition-all cursor-pointer">
                🧒 Kid-Friendly Mode
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="group"
            >
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300 h-full group-hover:shadow-xl group-hover:shadow-purple-500/10">
                <CardContent className="p-6 text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 mb-4 ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-xl animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-500/20 rounded-full blur-xl animate-float delay-500"></div>
        <div className="absolute top-32 right-1/4 w-12 h-12 bg-emerald-500/30 rounded-full blur-lg animate-float delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-24 h-24 bg-blue-500/20 rounded-full blur-xl animate-float delay-700"></div>
        
        {/* Sparkle effects */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white rounded-full animate-sparkle opacity-60"></div>
        <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-sparkle delay-200 opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/5 w-2 h-2 bg-pink-400 rounded-full animate-sparkle delay-500 opacity-70"></div>
      </div>
    </div>
  );
}