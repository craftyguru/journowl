import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

interface LandingHeroProps {
  onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

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
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-xl opacity-20"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
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
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Sparkle Effects */}
        {[...Array(15)].map((_, i) => (
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
      <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Hero Header with Owls */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            {/* Title with Animated Owls */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative flex items-center justify-center mb-6"
            >
              {/* Left Animated Owl */}
              <motion.div
                initial={{ opacity: 0, x: -100, rotate: -15 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  rotate: [0, 10, -5, 0],
                  y: [0, -10, 5, 0]
                }}
                transition={{ 
                  duration: 2, 
                  delay: 0.5,
                  rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute left-[-80px] sm:left-[-120px] md:left-[-150px] top-1/2 transform -translate-y-1/2"
              >
                <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
                  <motion.circle 
                    cx="50" cy="45" r="20" fill="#8B4513"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.circle 
                    cx="44" cy="40" r="3" fill="white"
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.circle 
                    cx="56" cy="40" r="3" fill="white"
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <circle cx="44" cy="40" r="1.5" fill="black"/>
                  <circle cx="56" cy="40" r="1.5" fill="black"/>
                  <path d="M46 46 L50 50 L54 46" stroke="#FF8C00" strokeWidth="2" fill="none"/>
                  <motion.path 
                    d="M35 35 L25 25" stroke="#8B4513" strokeWidth="3"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ transformOrigin: "35px 35px" }}
                  />
                  <motion.path 
                    d="M65 35 L75 25" stroke="#8B4513" strokeWidth="3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ transformOrigin: "65px 35px" }}
                  />
                  <ellipse cx="50" cy="60" rx="12" ry="6" fill="#D2691E"/>
                  <motion.circle
                    cx="35" cy="25" r="2" fill="#FFD700"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </svg>
              </motion.div>

              {/* Center Title */}
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-2xl leading-tight" 
                  style={{ fontFamily: '"Rock Salt", cursive', textShadow: '0 0 20px rgba(251, 191, 36, 0.3)' }}>
                <svg className="inline-block w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mr-3 mb-2" viewBox="0 0 100 100" fill="none">
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

              {/* Right Animated Owl */}
              <motion.div
                initial={{ opacity: 0, x: 100, rotate: 15 }}
                animate={{ 
                  opacity: 1, 
                  x: 0, 
                  rotate: [0, -10, 5, 0],
                  y: [0, 5, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  delay: 0.7,
                  rotate: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute right-[-80px] sm:right-[-120px] md:right-[-150px] top-1/2 transform -translate-y-1/2"
              >
                <svg className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none">
                  <motion.circle 
                    cx="50" cy="45" r="20" fill="#654321"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <motion.circle 
                    cx="44" cy="40" r="3" fill="white"
                    animate={{ scale: [1, 0.7, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.circle 
                    cx="56" cy="40" r="3" fill="white"
                    animate={{ scale: [1, 0.7, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
                  />
                  <circle cx="44" cy="40" r="1.5" fill="black"/>
                  <circle cx="56" cy="40" r="1.5" fill="black"/>
                  <path d="M46 46 L50 50 L54 46" stroke="#FF6B35" strokeWidth="2" fill="none"/>
                  <motion.path 
                    d="M35 35 L25 25" stroke="#654321" strokeWidth="3"
                    animate={{ rotate: [0, 15, -5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    style={{ transformOrigin: "35px 35px" }}
                  />
                  <motion.path 
                    d="M65 35 L75 25" stroke="#654321" strokeWidth="3"
                    animate={{ rotate: [0, -15, 5, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity }}
                    style={{ transformOrigin: "65px 35px" }}
                  />
                  <ellipse cx="50" cy="60" rx="12" ry="6" fill="#8B4513"/>
                  <motion.circle
                    cx="65" cy="25" r="2" fill="#FF69B4"
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }}
                  />
                </svg>
              </motion.div>
            </motion.div>

            {/* Subtitle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-2xl md:text-3xl font-bold mb-8"
              style={{ fontFamily: '"Rock Salt", cursive' }}
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                Your Wise Writing Companion
              </span>
            </motion.div>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed text-gray-300"
            >
              Experience AI-powered journaling with photo analysis, mood tracking, and personalized insights 
              that help you grow wiser every day.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
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
        </div>
      </div>
    </div>
  );
}