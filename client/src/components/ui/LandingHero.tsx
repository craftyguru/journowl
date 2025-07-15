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
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-20">
        
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-6 py-3 mb-8 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 backdrop-blur-sm"
          >
            <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            <span className="text-purple-200 font-medium">The Future of Journaling is Here</span>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-0">
              AI-Powered
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-amber-300 bg-clip-text text-transparent">
              Write. Reflect.
            </span>
            <br />
            <motion.span 
              className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Transform.
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-8 leading-relaxed"
          >
            The most advanced journaling app with AI insights, photo analysis, mood tracking, 
            and gamified progress. Transform your thoughts into actionable self-discovery.
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
                <span className="text-lg font-semibold text-purple-300">4.9/5</span>
                <span className="text-sm opacity-75">from 2,847+ happy writers</span>
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
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Your Journey
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
          <h2 className="text-4xl font-bold text-center text-white mb-4">
            Everything You Need to <span className="text-purple-300">Level Up</span> Your Writing
          </h2>
          <p className="text-xl text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            From beginner to professional writer, our platform adapts to your needs
          </p>

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
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-purple-400/40 transition-all duration-300 h-full overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <Badge variant="secondary" className={`${feature.textColor} bg-opacity-20 border-0`}>
                          {feature.stats}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
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
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            <span className="text-emerald-400">50+</span> Powerful Features
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {capabilities.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + categoryIndex * 0.2 }}
                className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
              >
                <h4 className="text-xl font-bold text-purple-300 mb-6">{category.category}</h4>
                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 1.6 + categoryIndex * 0.2 + itemIndex * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`p-2 rounded-lg ${item.highlight ? 'bg-purple-500/20' : 'bg-white/10'}`}>
                        <item.icon className={`w-4 h-4 ${item.highlight ? 'text-purple-400' : 'text-gray-400'}`} />
                      </div>
                      <span className={`${item.highlight ? 'text-white font-medium' : 'text-gray-300'}`}>
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

        {/* Demo Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Try It Now - <span className="text-cyan-400">No Signup Required</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "Admin Dashboard", desc: "Analytics & Management", color: "from-purple-500 to-violet-600" },
              { icon: PenTool, title: "Professional Writer", desc: "Advanced Features", color: "from-emerald-500 to-teal-600" },
              { icon: Heart, title: "Kid-Friendly Mode", desc: "Safe & Fun Interface", color: "from-pink-500 to-rose-600" }
            ].map((demo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                onClick={handleDemo}
                className="cursor-pointer group"
              >
                <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 hover:border-cyan-400/40 transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${demo.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <demo.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{demo.title}</h4>
                    <p className="text-gray-400 text-sm mb-4">{demo.desc}</p>
                    <div className="flex items-center justify-center gap-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-medium">Try Now</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
