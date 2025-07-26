import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Heart, TrendingUp, Zap, BookOpen, Brain, 
  Camera, Palette, Calendar, Lock, Trophy, Star,
  PenTool, BarChart3, Users, Smile, Target, Award,
  ArrowRight, Play, CheckCircle, Globe, Lightbulb,
  Mail, Github, Twitter, FileText, Shield, Download, Bookmark, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PWAMobilePrompt } from "@/components/PWAManager";
import LandingHeader from "@/components/LandingHeader";

interface LandingHeroProps {
  onGetStarted: () => void;
}

const mainFeatures = [
  {
    icon: Brain,
    title: "AI-Powered Writing Assistant",
    description: "Get intelligent writing prompts, insights, and suggestions tailored to your mood and memories",
    color: "from-purple-500 to-violet-600",
    textColor: "text-purple-400",
    stats: "95% smarter prompts"
  },
  {
    icon: Camera,
    title: "Photo Memory Analysis",
    description: "Upload photos and let AI extract emotions, activities, and generate personalized journal prompts",
    color: "from-pink-500 to-rose-600", 
    textColor: "text-pink-400",
    stats: "Analyze unlimited photos"
  },
  {
    icon: TrendingUp,
    title: "Advanced Analytics",
    description: "Beautiful charts showing mood trends, writing streaks, and personal growth over time",
    color: "from-emerald-500 to-teal-600",
    textColor: "text-emerald-400",
    stats: "Track 20+ metrics"
  },
  {
    icon: Trophy,
    title: "Gamified Experience", 
    description: "Level up, earn XP, unlock achievements, and maintain writing streaks that motivate daily journaling",
    color: "from-amber-500 to-orange-600",
    textColor: "text-amber-400",
    stats: "50+ achievements"
  }
];

const capabilities = [
  {
    category: "Smart Writing",
    items: [
      { icon: PenTool, text: "Rich markdown editor", highlight: true },
      { icon: Palette, text: "Custom fonts & colors" },
      { icon: Brain, text: "AI writing suggestions" },
      { icon: Lightbulb, text: "Context-aware prompts" }
    ]
  },
  {
    category: "Multimedia",
    items: [
      { icon: Camera, text: "Photo upload & analysis", highlight: true },
      { icon: Smile, text: "Mood tracking with emojis" },
      { icon: Lock, text: "Private & secure entries" },
      { icon: Star, text: "Tag and organize content" }
    ]
  },
  {
    category: "Analytics",
    items: [
      { icon: BarChart3, text: "Detailed progress charts", highlight: true },
      { icon: Calendar, text: "Interactive calendar view" },
      { icon: Target, text: "Goal setting & tracking" },
      { icon: Award, text: "Achievement system" }
    ]
  }
];

const testimonials = [
  { name: "Sarah M.", role: "Teacher", quote: "My students love the kid-friendly mode!", mood: "😊" },
  { name: "David Chen", role: "Executive", quote: "Analytics helped me understand my patterns", mood: "🤔" },
  { name: "Maria L.", role: "Writer", quote: "AI prompts sparked my creativity again", mood: "✨" }
];

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % mainFeatures.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDemo = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("demo", "true");
    window.location.href = url.toString();
  };

  const handleSignIn = () => {
    const url = new URL(window.location.href);
    url.pathname = '/login';
    window.location.href = url.toString();
  };

  const handleSignUp = () => {
    const url = new URL(window.location.href);
    url.pathname = '/register';
    window.location.href = url.toString();
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden"
    >
      {/* Landing Header */}
      <LandingHeader onSignIn={handleSignIn} onSignUp={handleSignUp} />
      
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-0" />

      {/* Animated Owls on Both Sides */}
      {/* Left Owl */}
      <motion.div
        className="absolute left-4 sm:left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-10 hidden md:block"
        animate={{ 
          scale: [1, 1.3, 0.9, 1.2, 1],
          rotate: [0, 5, -5, 3, 0],
          y: [0, -10, 5, -8, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="45" r="25" fill="#8B4513"/>
          <circle cx="42" cy="40" r="4" fill="white"/>
          <circle cx="58" cy="40" r="4" fill="white"/>
          <circle cx="42" cy="40" r="2" fill="black"/>
          <circle cx="58" cy="40" r="2" fill="black"/>
          <path d="M46 48 L50 52 L54 48" stroke="#FF8C00" strokeWidth="2" fill="none"/>
          <path d="M35 35 L25 25" stroke="#8B4513" strokeWidth="3"/>
          <path d="M65 35 L75 25" stroke="#8B4513" strokeWidth="3"/>
          <ellipse cx="50" cy="65" rx="15" ry="8" fill="#D2691E"/>
        </svg>
        {/* Glowing effect around left owl */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-xl"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Sparkles around left owl */}
        <motion.div
          className="absolute -top-2 -left-2 text-yellow-400"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.5, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute -bottom-2 -right-2 text-orange-400"
          animate={{ 
            rotate: [360, 0],
            scale: [1.2, 0.8, 1.2]
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
        >
          ⭐
        </motion.div>
      </motion.div>

      {/* Right Owl */}
      <motion.div
        className="absolute right-4 sm:right-8 lg:right-16 top-1/2 transform -translate-y-1/2 z-10 hidden md:block"
        animate={{ 
          scale: [1.2, 0.9, 1.4, 1, 1.2],
          rotate: [0, -5, 5, -3, 0],
          y: [0, 8, -12, 6, 0]
        }}
        transition={{ 
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <svg className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="45" r="25" fill="#8B4513"/>
          <circle cx="42" cy="40" r="4" fill="white"/>
          <circle cx="58" cy="40" r="4" fill="white"/>
          <circle cx="42" cy="40" r="2" fill="black"/>
          <circle cx="58" cy="40" r="2" fill="black"/>
          <path d="M46 48 L50 52 L54 48" stroke="#FF8C00" strokeWidth="2" fill="none"/>
          <path d="M35 35 L25 25" stroke="#8B4513" strokeWidth="3"/>
          <path d="M65 35 L75 25" stroke="#8B4513" strokeWidth="3"/>
          <ellipse cx="50" cy="65" rx="15" ry="8" fill="#D2691E"/>
        </svg>
        {/* Glowing effect around right owl */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-500/30 blur-xl"
          animate={{ opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
        {/* Sparkles around right owl */}
        <motion.div
          className="absolute -top-3 -right-1 text-purple-400"
          animate={{ 
            rotate: [0, 360],
            scale: [1.3, 0.7, 1.3]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
        >
          💫
        </motion.div>
        <motion.div
          className="absolute -bottom-1 -left-3 text-pink-400"
          animate={{ 
            rotate: [360, 0],
            scale: [0.8, 1.4, 0.8]
          }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1.5 }}
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Mobile Owls - Top Corners */}
      {/* Top Left Mobile Owl */}
      <motion.div
        className="absolute top-20 left-4 z-10 md:hidden"
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 8, -8, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg className="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="45" r="25" fill="#8B4513"/>
          <circle cx="42" cy="40" r="4" fill="white"/>
          <circle cx="58" cy="40" r="4" fill="white"/>
          <circle cx="42" cy="40" r="2" fill="black"/>
          <circle cx="58" cy="40" r="2" fill="black"/>
          <path d="M46 48 L50 52 L54 48" stroke="#FF8C00" strokeWidth="2" fill="none"/>
          <path d="M35 35 L25 25" stroke="#8B4513" strokeWidth="3"/>
          <path d="M65 35 L75 25" stroke="#8B4513" strokeWidth="3"/>
          <ellipse cx="50" cy="65" rx="15" ry="8" fill="#D2691E"/>
        </svg>
        <motion.div
          className="absolute -top-1 -right-1 text-xs"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.div>
      </motion.div>

      {/* Top Right Mobile Owl */}
      <motion.div
        className="absolute top-20 right-4 z-10 md:hidden"
        animate={{ 
          scale: [1.1, 0.9, 1.1],
          rotate: [0, -8, 8, 0]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <svg className="w-8 h-8 sm:w-12 sm:h-12" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="45" r="25" fill="#8B4513"/>
          <circle cx="42" cy="40" r="4" fill="white"/>
          <circle cx="58" cy="40" r="4" fill="white"/>
          <circle cx="42" cy="40" r="2" fill="black"/>
          <circle cx="58" cy="40" r="2" fill="black"/>
          <path d="M46 48 L50 52 L54 48" stroke="#FF8C00" strokeWidth="2" fill="none"/>
          <path d="M35 35 L25 25" stroke="#8B4513" strokeWidth="3"/>
          <path d="M65 35 L75 25" stroke="#8B4513" strokeWidth="3"/>
          <ellipse cx="50" cy="65" rx="15" ry="8" fill="#D2691E"/>
        </svg>
        <motion.div
          className="absolute -bottom-1 -left-1 text-xs"
          animate={{ scale: [1.2, 0.8, 1.2] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: 1 }}
        >
          💫
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-20 mobile-container py-8 sm:py-12 lg:py-20 pt-16 sm:pt-24 lg:pt-32">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          {/* JournOwl Brand Title - Most Prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-4 sm:mb-6 lg:mb-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-2 sm:mb-4 leading-tight" 
                style={{ fontFamily: '"Rock Salt", cursive', textShadow: '0 0 20px rgba(251, 191, 36, 0.3)', lineHeight: '1.2' }}>
              JournOwl
            </h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold"
              style={{ fontFamily: '"Rock Salt", cursive' }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                Your Wise Writing Companion
              </span>
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6 lg:mb-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm"
          >

            <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent font-semibold text-xs sm:text-sm" 
                  style={{ fontFamily: '"Rock Salt", cursive' }}>
              AI-Powered Smart Journaling
            </span>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-0">
              ✨ Magical
            </Badge>
          </motion.div>

          {/* Action Words */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight"
            style={{ fontFamily: '"Rock Salt", cursive' }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent drop-shadow-lg">
              Write. Reflect.
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-lg"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Transform.
            </motion.span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto mb-4 sm:mb-6 lg:mb-8 leading-relaxed font-semibold px-4"
            style={{ fontFamily: '"Rock Salt", cursive' }}
          >
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-md">
              Combines the wisdom of an owl with the power of AI. 
              Experience smart journaling with photo analysis, mood tracking, and personalized insights 
              that help you grow wiser every day.
            </span>
          </motion.p>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 lg:mb-12"
          >
            <div className="flex -space-x-3">
              {['👩‍💼', '👨‍💻', '🧒', '👩‍🎨', '👨‍🏫'].map((emoji, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm sm:text-lg lg:text-xl border-2 sm:border-4 border-white shadow-lg"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
            <div className="text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" 
                      style={{ fontFamily: '"Rock Salt", cursive' }}>4.9/5</span>
                <span className="text-xs sm:text-sm bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-medium" 
                      style={{ fontFamily: '"Rock Salt", cursive' }}>from 2,847+ happy writers</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons - DRAMATICALLY ENHANCED */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 lg:mb-20"
          >
            {/* PRIMARY BUTTON - SUPER PROMINENT */}
            <motion.div
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                boxShadow: ["0 0 20px rgba(139, 69, 19, 0.3)", "0 0 40px rgba(139, 69, 19, 0.6)", "0 0 20px rgba(139, 69, 19, 0.3)"]
              }}
              transition={{ 
                boxShadow: { duration: 2, repeat: Infinity },
                hover: { duration: 0.2 }
              }}
              className="relative"
            >
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-xl opacity-75 animate-pulse"></div>
              
              <Button
                onClick={onGetStarted}
                size="lg"
                className="relative px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-white border-4 border-white/40 rounded-2xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 w-full sm:w-auto transform hover:rotate-1"
                style={{ fontFamily: '"Rock Salt", cursive', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
              >
                <motion.div 
                  className="flex items-center gap-3"
                  animate={{ x: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 animate-bounce" />
                  <span className="text-lg sm:text-xl font-black tracking-wide">
                    🚀 START YOUR WISE JOURNEY! 🦉
                  </span>
                  <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
                </motion.div>
              </Button>
            </motion.div>

            {/* SECONDARY BUTTON - ALSO PROMINENT */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                borderColor: ["rgba(147, 51, 234, 0.5)", "rgba(59, 130, 246, 0.8)", "rgba(147, 51, 234, 0.5)"]
              }}
              transition={{ 
                borderColor: { duration: 2, repeat: Infinity },
                hover: { duration: 0.2 }
              }}
              className="relative"
            >
              {/* Subtle glow for secondary */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemo}
                className="relative px-8 sm:px-12 py-4 sm:py-6 text-lg sm:text-xl font-bold border-4 border-purple-400 bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-white hover:bg-gradient-to-r hover:from-purple-800/70 hover:to-blue-800/70 rounded-2xl backdrop-blur-md transition-all duration-300 w-full sm:w-auto shadow-xl hover:shadow-purple-500/30"
                style={{ fontFamily: '"Rock Salt", cursive', textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
              >
                <motion.div 
                  className="flex items-center gap-3"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Play className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 animate-bounce" />
                  <span className="text-lg sm:text-xl font-bold tracking-wide">
                    ✨ VIEW LIVE DEMO 🎬
                  </span>
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-8 sm:mb-12 lg:mb-20"
        >
          <motion.h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-3 sm:mb-4 lg:mb-6"
            style={{ fontFamily: '"Rock Salt", cursive' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">
              🚀 Everything You Need to 
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
              Level Up Your Writing ✨
            </span>
          </motion.h2>
          <motion.p 
            className="text-sm sm:text-base md:text-lg lg:text-2xl text-center mb-6 sm:mb-8 lg:mb-12 max-w-4xl mx-auto font-opensans leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-emerald-300 font-semibold">📝 From beginner to professional writer,</span>{" "}
            <span className="text-amber-300 font-semibold">our platform adapts to your needs</span>{" "}
            <span className="text-pink-300 font-semibold">🎯 with AI-powered insights!</span>
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-12">
            {mainFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 + index * 0.2 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <Card className="bg-gradient-to-br from-gray-900/95 to-black/90 backdrop-blur-lg border-2 border-purple-500/30 hover:border-cyan-400/60 transition-all duration-500 h-full overflow-hidden shadow-2xl hover:shadow-purple-500/20 group-hover:scale-105">
                  <CardContent className="p-4 sm:p-6 lg:p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
                        <motion.div 
                          className={`p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-125 transition-all duration-500 group-hover:rotate-6`}
                          whileHover={{ y: -5 }}
                        >
                          <feature.icon className="w-4 h-4 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white drop-shadow-lg" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.h3 
                            className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-2 sm:mb-3 font-inter"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1.02 }}
                          >
                            {feature.title}
                          </motion.h3>
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-cyan-300 border border-cyan-400/30 font-bold text-xs sm:text-sm px-2 sm:px-3 py-1">
                            ✨ {feature.stats}
                          </Badge>
                        </div>
                      </div>
                      <motion.p 
                        className="text-gray-200 leading-relaxed font-medium text-sm sm:text-base lg:text-lg font-opensans tracking-wide"
                        initial={{ opacity: 0.9 }}
                        whileHover={{ opacity: 1, x: 5 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                  </CardContent>
                  
                  {/* Animated border gradient */}
                  <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`absolute inset-0 rounded-lg bg-gradient-to-r ${feature.color} opacity-20 blur-xl`}></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Capabilities Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mb-8 sm:mb-12 lg:mb-20"
        >
          <motion.h3 
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 font-roboto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              🎯 50+ Powerful Features
            </span>
            <br />
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Built for Every Writer ✍️
            </span>
          </motion.h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {capabilities.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + categoryIndex * 0.2 }}
                className="bg-gradient-to-br from-gray-900/90 to-black/80 backdrop-blur-lg rounded-xl p-4 sm:p-6 border-2 border-purple-500/40 hover:border-cyan-400/60 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
              >
                <motion.h4 
                  className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 lg:mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent font-inter"
                  whileHover={{ scale: 1.05 }}
                >
                  🌟 {category.category}
                </motion.h4>
                <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.6 + categoryIndex * 0.2 + itemIndex * 0.1 }}
                      className="flex items-center gap-2 sm:gap-3"
                    >
                      <div className={`p-1.5 sm:p-2 rounded-lg ${item.highlight ? 'bg-purple-500/30' : 'bg-white/15'}`}>
                        <item.icon className={`w-3 h-3 sm:w-4 sm:h-4 ${item.highlight ? 'text-purple-300' : 'text-gray-200'}`} />
                      </div>
                      <span className={`text-sm sm:text-base ${item.highlight ? 'text-white font-semibold' : 'text-gray-100 font-medium'}`}>
                        {item.text}
                      </span>
                      {item.highlight && <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto" />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center mb-20"
        >
          <h3 className="text-3xl font-bold text-white mb-12">
            Loved by <span className="text-pink-400">Writers Worldwide</span>
          </h3>
          
          <div className="relative max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20"
              >
                <div className="text-6xl mb-4">{testimonials[currentTestimonial].mood}</div>
                <blockquote className="text-xl text-gray-200 mb-4 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                <div className="text-purple-300 font-semibold">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-gray-400 text-sm">
                  {testimonials[currentTestimonial].role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Ultimate App Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-center mb-20"
        >
          <motion.h3 
            className="text-6xl font-bold text-center mb-6 font-montserrat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.2 }}
          >
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              🚀 Experience the Magic
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent text-4xl">
              ✨ Interactive Live Preview ✨
            </span>
          </motion.h3>
          <motion.p 
            className="text-2xl text-center mb-16 max-w-5xl mx-auto font-opensans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
          >
            <span className="text-cyan-300 font-bold">🎯 See every feature in action!</span>{" "}
            <span className="text-yellow-300 font-bold">🎨 AI analysis, mood tracking, achievements,</span>{" "}
            <span className="text-pink-300 font-bold">📊 analytics, and so much more!</span>
          </motion.p>
          
          {/* Revolutionary App Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.6 }}
            className="max-w-7xl mx-auto bg-gradient-to-br from-gray-900/95 to-black/90 backdrop-blur-xl rounded-3xl border-2 border-purple-500/40 shadow-2xl overflow-hidden"
          >
            {/* Epic Header - Mobile Optimized */}
            <div className="bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-cyan-600/80 p-3 sm:p-4 lg:p-6 border-b-2 border-purple-400/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="flex gap-1 sm:gap-2">
                    <motion.div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm sm:text-lg lg:text-xl font-inter">🌟 MoodJournal - Complete Experience</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-white/90">
                  <motion.div 
                    className="flex items-center gap-1 sm:gap-2 bg-green-500/30 px-2 sm:px-3 py-1 rounded-full border border-green-400/50"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium">🤖 AI Assistant Online</span>
                  </motion.div>
                  <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/50 font-bold text-xs sm:text-sm">
                    ✨ Live Demo
                  </Badge>
                </div>
              </div>
            </div>

            {/* Comprehensive App Showcase */}
            <div className="p-3 sm:p-6 lg:p-10">
              {/* Tab Navigation - Mobile Optimized */}
              <motion.div 
                className="flex justify-center mb-6 sm:mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.8 }}
              >
                <div className="grid grid-cols-2 sm:flex bg-gray-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-1 sm:p-2 border border-purple-500/30 gap-1 sm:gap-0 w-full max-w-md sm:max-w-none sm:w-auto">
                  {[
                    { id: 'write', name: '✍️ Write', icon: PenTool, color: 'from-purple-500 to-pink-500' },
                    { id: 'analyze', name: '📊 Analytics', icon: BarChart3, color: 'from-cyan-500 to-blue-500' },
                    { id: 'ai', name: '🤖 AI Magic', icon: Brain, color: 'from-green-500 to-emerald-500' },
                    { id: 'rewards', name: '🏆 Rewards', icon: Trophy, color: 'from-yellow-500 to-orange-500' }
                  ].map((tab, i) => (
                    <motion.button
                      key={tab.id}
                      className={`px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-white font-bold transition-all duration-300 bg-gradient-to-r ${tab.color} hover:scale-105 hover:shadow-lg text-xs sm:text-sm lg:text-base`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 3 + i * 0.1 }}
                    >
                      <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 inline mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{tab.name}</span>
                      <span className="sm:hidden">{tab.name.split(' ')[1] || tab.name.split(' ')[0]}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Main Showcase Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
                
                {/* Smart Writing Assistant - Mobile Optimized */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.2 }}
                  className="lg:col-span-2 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-purple-500/50 hover:border-cyan-400/60 transition-all duration-500 shadow-2xl"
                >
                  <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                    <motion.div 
                      className="p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <PenTool className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-inter">
                        ✨ Smart AI Writing Assistant
                      </h4>
                      <p className="text-sm sm:text-base text-gray-300 font-opensans">Real-time suggestions as you write</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Editor Simulation */}
                  <div className="bg-gray-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-purple-400/30 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <span className="text-gray-300 font-medium font-inter text-xs sm:text-sm">📝 Today's Entry - March 15, 2024</span>
                      <div className="flex gap-1 sm:gap-2">
                        <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">🟢 Auto-Save</Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-0 text-xs">📊 524 words</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-4 sm:mb-6">
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        transition={{ duration: 2, delay: 3.5 }}
                        className="min-h-[2rem] sm:min-h-[2.5rem] bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-cyan-400/40 rounded-md sm:rounded-lg flex items-center px-2 sm:px-3"
                      >
                        <span className="text-white text-xs sm:text-sm font-opensans leading-relaxed">Today was absolutely amazing! I finally got to try that new cafe...</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "85%" }}
                        transition={{ duration: 2, delay: 4 }}
                        className="min-h-[2rem] sm:min-h-[2.5rem] bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-cyan-400/40 rounded-md sm:rounded-lg flex items-center px-2 sm:px-3"
                      >
                        <span className="text-white text-xs sm:text-sm font-opensans leading-relaxed">The coffee was incredible and the atmosphere was so peaceful...</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "70%" }}
                        transition={{ duration: 2, delay: 4.5 }}
                        className="min-h-[2rem] sm:min-h-[2.5rem] bg-gradient-to-r from-emerald-400/40 via-cyan-400/40 to-blue-400/40 rounded-md sm:rounded-lg animate-pulse"
                      >
                        <div className="flex items-center px-2 sm:px-3 h-full">
                          <span className="text-white text-xs sm:text-sm font-opensans leading-relaxed">I feel so grateful for</span>
                          <div className="w-1 sm:w-2 h-3 sm:h-4 bg-cyan-400 ml-1 animate-pulse" />
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Multiple AI Suggestions */}
                    <div className="space-y-2 sm:space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 5 }}
                        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-bold text-xs sm:text-sm">💡 AI Writing Suggestion</div>
                            <div className="text-gray-200 text-xs sm:text-sm font-opensans leading-relaxed">Try expanding on what made this moment special - your emotions, the details...</div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 5.3 }}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-bold text-xs sm:text-sm">🎯 Mood Insight</div>
                            <div className="text-gray-200 text-xs sm:text-sm font-opensans leading-relaxed">Your writing shows joy and gratitude - perfect for a happiness entry!</div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Live Analytics Dashboard */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.4 }}
                  className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-2xl p-6 border-2 border-cyan-500/50 hover:border-green-400/60 transition-all duration-500 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500"
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      <BarChart3 className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent font-inter">
                        📊 Live Analytics
                      </h4>
                      <p className="text-gray-300 text-sm font-opensans">Real-time insights</p>
                    </div>
                  </div>
                  
                  {/* Mood Trend Chart */}
                  <div className="bg-gray-900/60 rounded-xl p-4 mb-4 border border-cyan-400/30">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-cyan-300 font-bold text-sm">🎭 This Week's Mood</span>
                      <span className="text-emerald-400 font-bold text-xs">📈 Trending Up!</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { emoji: '😊', value: 85, color: 'from-green-400 to-emerald-500' },
                        { emoji: '🤔', value: 45, color: 'from-yellow-400 to-orange-500' },
                        { emoji: '😄', value: 92, color: 'from-pink-400 to-purple-500' },
                        { emoji: '😐', value: 30, color: 'from-gray-400 to-gray-500' },
                        { emoji: '🎉', value: 78, color: 'from-cyan-400 to-blue-500' }
                      ].map((mood, i) => (
                        <motion.div
                          key={i}
                          initial={{ width: 0 }}
                          animate={{ width: `${mood.value}%` }}
                          transition={{ duration: 1.5, delay: 5.5 + i * 0.2 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-xl">{mood.emoji}</span>
                          <div className="flex-1 bg-gray-700/50 rounded-full h-3 overflow-hidden">
                            <motion.div 
                              className={`h-full bg-gradient-to-r ${mood.color} rounded-full shadow-lg`}
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 1, delay: 5.5 + i * 0.2 }}
                            />
                          </div>
                          <span className="text-white text-xs font-bold w-8">{mood.value}%</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: '📝', label: 'Entries', value: '47', color: 'text-purple-300' },
                      { icon: '🔥', label: 'Streak', value: '12', color: 'text-orange-300' },
                      { icon: '📊', label: 'Words', value: '8.2k', color: 'text-green-300' },
                      { icon: '🎯', label: 'Goals', value: '3/5', color: 'text-cyan-300' }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 6.5 + i * 0.1 }}
                        className="bg-gray-800/60 rounded-lg p-3 border border-cyan-400/30 text-center hover:scale-105 transition-transform"
                      >
                        <div className="text-lg mb-1">{stat.icon}</div>
                        <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-gray-400 text-xs font-opensans">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Bottom Feature Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* AI Photo Analysis */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.6 }}
                  className="bg-gradient-to-br from-pink-900/40 to-red-900/40 rounded-2xl p-6 border-2 border-pink-500/50 hover:border-yellow-400/60 transition-all duration-500 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-red-500"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <Camera className="w-6 h-6 text-white" />
                    </motion.div>
                    <h4 className="text-lg font-bold bg-gradient-to-r from-pink-300 to-red-300 bg-clip-text text-transparent font-inter">
                      📸 AI Photo Magic
                    </h4>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-pink-400/30">
                    <div className="w-full h-24 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ 
                          background: [
                            'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 100%)',
                            'linear-gradient(45deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.3) 100%)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <Camera className="w-10 h-10 text-white/80" />
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 7 }}
                    >
                      <div className="text-white font-bold text-sm mb-2">🤖 AI Analysis Complete:</div>
                      <div className="text-gray-200 text-xs mb-3 font-opensans">Beach sunset, friends laughing, pure joy detected!</div>
                      <div className="flex flex-wrap gap-1">
                        <Badge className="bg-yellow-500/20 text-yellow-300 border-0 text-xs">😊 Happy</Badge>
                        <Badge className="bg-orange-500/20 text-orange-300 border-0 text-xs">🌅 Sunset</Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-0 text-xs">👥 Friends</Badge>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Achievement System */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.8 }}
                  className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 rounded-2xl p-6 border-2 border-yellow-500/50 hover:border-purple-400/60 transition-all duration-500 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500"
                      whileHover={{ scale: 1.1, rotate: -10 }}
                    >
                      <Trophy className="w-6 h-6 text-white" />
                    </motion.div>
                    <h4 className="text-lg font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-inter">
                      🏆 Achievements
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { icon: "🔥", title: "7-Day Streak!", desc: "Keep the momentum!", color: "from-red-500/20 to-orange-500/20", border: "border-red-400/50", new: true },
                      { icon: "📚", title: "Story Master", desc: "100+ entries written", color: "from-purple-500/20 to-pink-500/20", border: "border-purple-400/50", new: false },
                      { icon: "🎯", title: "Goal Achiever", desc: "5 goals completed", color: "from-green-500/20 to-emerald-500/20", border: "border-green-400/50", new: false }
                    ].map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 7.5 + i * 0.2 }}
                        className={`flex items-center gap-3 bg-gradient-to-r ${achievement.color} rounded-lg p-3 border ${achievement.border} relative overflow-hidden`}
                      >
                        {achievement.new && (
                          <motion.div
                            className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold px-2 py-1 rounded-bl-lg"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            NEW!
                          </motion.div>
                        )}
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <div className="text-white font-bold text-sm">{achievement.title}</div>
                          <div className="text-gray-300 text-xs font-opensans">{achievement.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Smart Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 4.0 }}
                  className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 rounded-2xl p-6 border-2 border-green-500/50 hover:border-cyan-400/60 transition-all duration-500 shadow-2xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500"
                      whileHover={{ scale: 1.1 }}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <h4 className="text-lg font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent font-inter">
                      🧠 AI Insights
                    </h4>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-4 border border-green-400/30">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 8 }}
                      className="space-y-3"
                    >
                      <div className="text-green-300 font-bold text-sm">🎯 Today's Insight:</div>
                      <div className="text-white text-sm font-opensans leading-relaxed">
                        "Your writing shows increased positivity this week! You mention gratitude 40% more than usual."
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-green-400 rounded-full"
                              animate={{ scale: [1, 1.3, 1] }}
                              transition={{ duration: 1, delay: 8.5 + i * 0.1, repeat: Infinity }}
                            />
                          ))}
                        </div>
                        <span className="text-green-300 text-xs font-bold">Analyzing patterns...</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Epic Call-to-Action Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 9 }}
                className="mt-8 sm:mt-10 lg:mt-12 text-center bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-gradient-to-r border-purple-500/50"
              >
                <motion.h3
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 font-montserrat"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    🚀 Ready to Transform Your Writing?
                  </span>
                </motion.h3>
                <motion.p
                  className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 sm:mb-8 font-opensans px-2"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  <span className="text-cyan-300 font-bold">Join thousands of writers</span> who've discovered the power of AI-assisted journaling!
                </motion.p>
                
                <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:gap-6 justify-center items-center">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      onClick={handleDemo}
                      className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg font-bold shadow-2xl shadow-purple-500/30 transition-all duration-300 font-inter"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      🎯 Try Full Interactive Demo
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      onClick={onGetStarted}
                      className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white border-0 rounded-xl sm:rounded-2xl text-sm sm:text-base lg:text-lg font-bold shadow-2xl shadow-cyan-500/30 transition-all duration-300 font-inter"
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      ✨ Start Writing Now - FREE!
                    </Button>
                  </motion.div>
                  

                </div>
                
                {/* Feature Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 9.5 }}
                  className="mt-6 sm:mt-8 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
                >
                  {[
                    { icon: '🤖', text: 'AI-Powered', color: 'text-purple-300' },
                    { icon: '📊', text: 'Smart Analytics', color: 'text-cyan-300' },
                    { icon: '🎯', text: 'Goal Tracking', color: 'text-green-300' },
                    { icon: '🏆', text: 'Achievements', color: 'text-yellow-300' }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-1 sm:gap-2 justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 9.7 + i * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-lg sm:text-xl lg:text-2xl">{feature.icon}</span>
                      <span className={`font-bold text-xs sm:text-sm ${feature.color} font-inter`}>{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Landing Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 10 }}
        className="relative bg-black/40 backdrop-blur-sm border-t border-white/10 mt-16 sm:mt-20 z-20"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {/* Brand Column */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">🦉</div>
                <div>
                  <h3 
                    className="text-lg sm:text-xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                    style={{ fontFamily: '"Rock Salt", cursive' }}
                  >
                    JournOwl
                  </h3>
                  <p className="text-xs text-gray-400">
                    Your Wise Writing Companion
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                AI-powered journaling platform that helps you capture thoughts, analyze emotions, and unlock insights from your daily experiences.
              </p>
            </div>

            {/* Features Column */}
            <div className="col-span-1">
              <h4 className="font-semibold text-white mb-3 sm:mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <Brain className="w-3 h-3" />
                  AI Writing Assistant
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="w-3 h-3" />
                  Smart Analytics
                </li>
                <li className="flex items-center gap-2">
                  <Trophy className="w-3 h-3" />
                  Achievement System
                </li>
                <li className="flex items-center gap-2">
                  <Camera className="w-3 h-3" />
                  Photo Analysis
                </li>
                <li className="flex items-center gap-2">
                  <Download className="w-3 h-3" />
                  Export Options
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="col-span-1">
              <h4 className="font-semibold text-white mb-3 sm:mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                    <HelpCircle className="w-3 h-3" />
                    FAQ & Help
                  </a>
                </li>
                <li>
                  <a href="/terms" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                    <FileText className="w-3 h-3" />
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Shield className="w-3 h-3" />
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Bookmark className="w-3 h-3" />
                    Knowledge Base
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect Column */}
            <div className="col-span-1">
              <h4 className="font-semibold text-white mb-3 sm:mb-4">Connect</h4>
              <div className="space-y-3">
                <a 
                  href="mailto:support@journowl.app" 
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  support@journowl.app
                </a>
                <div className="flex gap-3">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Github className="w-4 h-4" />
                  </a>
                </div>
                <div className="pt-2">
                  <Badge variant="secondary" className="text-xs">
                    Available as PWA
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 text-center sm:text-left">
              © 2025 JournOwl. All rights reserved. Built with wisdom and care.
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Made with ❤️ for writers</span>
              <span className="hidden sm:inline">•</span>
              <span>Version 2.0</span>
            </div>
          </div>
        </div>
      </motion.footer>

      {/* PWA Install Prompt for Mobile Users */}
      <PWAMobilePrompt />
    </div>
  );
}
