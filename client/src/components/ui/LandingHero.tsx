import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, Heart, TrendingUp, Zap, BookOpen, Brain, 
  Camera, Palette, Calendar, Lock, Trophy, Star,
  PenTool, BarChart3, Users, Smile, Target, Award,
  ArrowRight, Play, CheckCircle, Globe, Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(147, 51, 234, 0.3) 0%, transparent 50%), linear-gradient(135deg, #1e1b4b 0%, #581c87 50%, #be185d 100%)`
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-xl opacity-30`}
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(45deg, 
                hsl(${Math.random() * 60 + 240}, 70%, 60%), 
                hsl(${Math.random() * 60 + 300}, 70%, 60%))`
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Sparkle Effects */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20 pt-32">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* JournOwl Brand Title - Most Prominent */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl mb-4 leading-relaxed" 
                style={{ fontFamily: '"Rock Salt", cursive', textShadow: '0 0 20px rgba(251, 191, 36, 0.3)', lineHeight: '1.2' }}>
              <svg className="inline-block w-16 h-16 md:w-20 md:h-20 mr-3 mb-2" viewBox="0 0 100 100" fill="none">
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
              JournOwl
            </h1>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl font-bold"
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
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm"
          >
            <svg className="inline-block w-8 h-8 animate-bounce" viewBox="0 0 100 100" fill="none">
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
            <span className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent font-semibold" 
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
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
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
            className="text-lg md:text-xl max-w-4xl mx-auto mb-8 leading-relaxed font-semibold"
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
            className="flex items-center justify-center gap-4 mb-12"
          >
            <div className="flex -space-x-3">
              {['👩‍💼', '👨‍💻', '🧒', '👩‍🎨', '👨‍🏫'].map((emoji, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl border-4 border-white shadow-lg"
                >
                  {emoji}
                </motion.div>
              ))}
            </div>
            <div className="text-gray-300">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" 
                      style={{ fontFamily: '"Rock Salt", cursive' }}>4.9/5</span>
                <span className="text-sm bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-medium" 
                      style={{ fontFamily: '"Rock Salt", cursive' }}>from 2,847+ happy writers</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={onGetStarted}
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                style={{ fontFamily: '"Rock Salt", cursive' }}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Your Wise Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemo}
                className="px-8 py-4 text-lg font-semibold border-2 border-purple-400/50 text-purple-200 hover:bg-purple-500/10 rounded-xl backdrop-blur-sm transition-all duration-300"
                style={{ fontFamily: '"Rock Salt", cursive' }}
              >
                <Play className="w-5 h-5 mr-2" />
                View Live Demo
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Feature Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-20"
        >
          <motion.h2 
            className="text-5xl font-bold text-center mb-6"
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
            className="text-2xl text-center mb-12 max-w-4xl mx-auto font-opensans leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className="text-emerald-300 font-semibold">📝 From beginner to professional writer,</span>{" "}
            <span className="text-amber-300 font-semibold">our platform adapts to your needs</span>{" "}
            <span className="text-pink-300 font-semibold">🎯 with AI-powered insights!</span>
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
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
                  <CardContent className="p-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-6">
                        <motion.div 
                          className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-125 transition-all duration-500 group-hover:rotate-6`}
                          whileHover={{ y: -5 }}
                        >
                          <feature.icon className="w-7 h-7 text-white drop-shadow-lg" />
                        </motion.div>
                        <div className="flex-1">
                          <motion.h3 
                            className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-3 font-inter"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1.02 }}
                          >
                            {feature.title}
                          </motion.h3>
                          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-cyan-300 border border-cyan-400/30 font-bold text-sm px-3 py-1">
                            ✨ {feature.stats}
                          </Badge>
                        </div>
                      </div>
                      <motion.p 
                        className="text-gray-200 leading-relaxed font-medium text-lg font-opensans tracking-wide"
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
          className="mb-20"
        >
          <motion.h3 
            className="text-4xl font-bold text-center mb-12 font-roboto"
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {capabilities.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + categoryIndex * 0.2 }}
                className="bg-gradient-to-br from-gray-900/90 to-black/80 backdrop-blur-lg rounded-xl p-6 border-2 border-purple-500/40 hover:border-cyan-400/60 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
              >
                <motion.h4 
                  className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent font-inter"
                  whileHover={{ scale: 1.05 }}
                >
                  🌟 {category.category}
                </motion.h4>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.6 + categoryIndex * 0.2 + itemIndex * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`p-2 rounded-lg ${item.highlight ? 'bg-purple-500/30' : 'bg-white/15'}`}>
                        <item.icon className={`w-4 h-4 ${item.highlight ? 'text-purple-300' : 'text-gray-200'}`} />
                      </div>
                      <span className={`${item.highlight ? 'text-white font-semibold' : 'text-gray-100 font-medium'}`}>
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
            {/* Epic Header */}
            <div className="bg-gradient-to-r from-purple-600/80 via-pink-600/80 to-cyan-600/80 p-6 border-b-2 border-purple-400/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <motion.div 
                      className="w-4 h-4 rounded-full bg-red-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-4 h-4 rounded-full bg-yellow-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-4 h-4 rounded-full bg-green-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                  </div>
                  <span className="text-white font-bold text-xl font-inter">🌟 MoodJournal - Complete Experience</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <motion.div 
                    className="flex items-center gap-2 bg-green-500/30 px-3 py-1 rounded-full border border-green-400/50"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium">🤖 AI Assistant Online</span>
                  </motion.div>
                  <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/50 font-bold">
                    ✨ Live Demo
                  </Badge>
                </div>
              </div>
            </div>

            {/* Comprehensive App Showcase */}
            <div className="p-10">
              {/* Tab Navigation */}
              <motion.div 
                className="flex justify-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 2.8 }}
              >
                <div className="flex bg-gray-800/50 backdrop-blur-lg rounded-2xl p-2 border border-purple-500/30">
                  {[
                    { id: 'write', name: '✍️ Write', icon: PenTool, color: 'from-purple-500 to-pink-500' },
                    { id: 'analyze', name: '📊 Analytics', icon: BarChart3, color: 'from-cyan-500 to-blue-500' },
                    { id: 'ai', name: '🤖 AI Magic', icon: Brain, color: 'from-green-500 to-emerald-500' },
                    { id: 'rewards', name: '🏆 Rewards', icon: Trophy, color: 'from-yellow-500 to-orange-500' }
                  ].map((tab, i) => (
                    <motion.button
                      key={tab.id}
                      className={`px-6 py-3 rounded-xl text-white font-bold transition-all duration-300 bg-gradient-to-r ${tab.color} hover:scale-105 hover:shadow-lg`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 3 + i * 0.1 }}
                    >
                      <tab.icon className="w-5 h-5 inline mr-2" />
                      {tab.name}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Main Showcase Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                
                {/* Smart Writing Assistant - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.2 }}
                  className="lg:col-span-2 bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-8 border-2 border-purple-500/50 hover:border-cyan-400/60 transition-all duration-500 shadow-2xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <PenTool className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-inter">
                        ✨ Smart AI Writing Assistant
                      </h4>
                      <p className="text-gray-300 font-opensans">Real-time suggestions as you write</p>
                    </div>
                  </div>
                  
                  {/* Enhanced Editor Simulation */}
                  <div className="bg-gray-900/60 rounded-xl p-6 border border-purple-400/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-300 font-medium font-inter">📝 Today's Entry - March 15, 2024</span>
                      <div className="flex gap-2">
                        <Badge className="bg-green-500/20 text-green-300 border-0">🟢 Auto-Save</Badge>
                        <Badge className="bg-blue-500/20 text-blue-300 border-0">📊 524 words</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4 mb-6">
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "100%" }}
                        transition={{ duration: 2, delay: 3.5 }}
                        className="h-5 bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-cyan-400/40 rounded-lg flex items-center px-3"
                      >
                        <span className="text-white text-sm font-opensans">Today was absolutely amazing! I finally got to try that new cafe...</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "85%" }}
                        transition={{ duration: 2, delay: 4 }}
                        className="h-5 bg-gradient-to-r from-purple-400/40 via-pink-400/40 to-cyan-400/40 rounded-lg flex items-center px-3"
                      >
                        <span className="text-white text-sm font-opensans">The coffee was incredible and the atmosphere was so peaceful...</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "70%" }}
                        transition={{ duration: 2, delay: 4.5 }}
                        className="h-5 bg-gradient-to-r from-emerald-400/40 via-cyan-400/40 to-blue-400/40 rounded-lg animate-pulse"
                      >
                        <div className="flex items-center px-3 h-full">
                          <span className="text-white text-sm font-opensans">I feel so grateful for</span>
                          <div className="w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Multiple AI Suggestions */}
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 5 }}
                        className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5" />
                          <div>
                            <div className="text-white font-bold text-sm">💡 AI Writing Suggestion</div>
                            <div className="text-gray-200 text-sm font-opensans">Try expanding on what made this moment special - your emotions, the details...</div>
                          </div>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 5.3 }}
                        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
                          <div>
                            <div className="text-white font-bold text-sm">🎯 Mood Insight</div>
                            <div className="text-gray-200 text-sm font-opensans">Your writing shows joy and gratitude - perfect for a happiness entry!</div>
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
                className="mt-12 text-center bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-cyan-900/30 rounded-3xl p-8 border-2 border-gradient-to-r border-purple-500/50"
              >
                <motion.h3
                  className="text-4xl font-bold mb-4 font-montserrat"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                    🚀 Ready to Transform Your Writing?
                  </span>
                </motion.h3>
                <motion.p
                  className="text-xl text-gray-200 mb-8 font-opensans"
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                >
                  <span className="text-cyan-300 font-bold">Join thousands of writers</span> who've discovered the power of AI-assisted journaling!
                </motion.p>
                
                <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleDemo}
                      className="px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white border-0 rounded-2xl text-lg font-bold shadow-2xl shadow-purple-500/30 transition-all duration-300 font-inter"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      🎯 Try Full Interactive Demo
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={onGetStarted}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 text-white border-0 rounded-2xl text-lg font-bold shadow-2xl shadow-cyan-500/30 transition-all duration-300 font-inter"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      ✨ Start Writing Now - FREE!
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      variant="outline"
                      className="px-8 py-4 border-2 border-yellow-400/60 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-300 rounded-2xl text-lg font-bold backdrop-blur-sm transition-all duration-300 font-inter"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      🎨 Explore More Features
                    </Button>
                  </motion.div>
                </div>
                
                {/* Feature Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 9.5 }}
                  className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4"
                >
                  {[
                    { icon: '🤖', text: 'AI-Powered', color: 'text-purple-300' },
                    { icon: '📊', text: 'Smart Analytics', color: 'text-cyan-300' },
                    { icon: '🎯', text: 'Goal Tracking', color: 'text-green-300' },
                    { icon: '🏆', text: 'Achievements', color: 'text-yellow-300' }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2 justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 9.7 + i * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                      <span className={`font-bold text-sm ${feature.color} font-inter`}>{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
