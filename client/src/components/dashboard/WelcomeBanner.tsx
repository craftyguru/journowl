import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { TypewriterTitle } from "./TypewriterComponents";
import { BookOpen, Calendar, Sparkles } from "lucide-react";
import type { User } from "./types";

interface WelcomeBannerProps {
  user: User;
  onOpenJournal: () => void;
  onOpenCalendar: () => void;
  onOpenStories: () => void;
}

export function WelcomeBanner({ user, onOpenJournal, onOpenCalendar, onOpenStories }: WelcomeBannerProps) {
  return (
    <Card className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white mb-6 border-none shadow-2xl relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-orange-400/20"></div>
      
      {/* Flying Animated Owls */}
      <motion.div
        animate={{ 
          x: [0, 300, 0], 
          y: [0, -20, -40, -20, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-8 left-4 text-4xl z-20"
      >
        🦉
      </motion.div>
      
      <motion.div
        animate={{ 
          x: [400, 0, 400], 
          y: [0, -30, -60, -30, 0],
          rotate: [0, -5, 5, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 3
        }}
        className="absolute top-12 right-8 text-3xl z-20"
      >
        🦉
      </motion.div>
      
      <motion.div
        animate={{ 
          x: [0, 150, 300, 150, 0], 
          y: [100, 80, 60, 80, 100],
          rotate: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 6
        }}
        className="absolute bottom-16 left-12 text-2xl z-20"
      >
        🦉
      </motion.div>
      
      {/* Floating Magical Elements */}
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute top-16 right-20 text-2xl z-10"
      >
        ✨
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          x: [0, 5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 right-16 text-xl z-10"
      >
        ⭐
      </motion.div>
      
      <motion.div
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 180, 360],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-32 left-64 text-xl z-10"
      >
        🌟
      </motion.div>
      
      <CardHeader className="relative z-30 pt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <motion.h1 
              className="text-3xl sm:text-4xl font-bold mb-2" 
              style={{ fontFamily: '"Rock Salt", cursive' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <TypewriterTitle text={`Welcome back, ${user?.firstName || user?.username || 'Writer'}! 🦉`} />
            </motion.h1>
            <motion.p 
              className="text-white/90 text-lg sm:text-xl max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              😊 Today is perfect for journaling! Capture thoughts, analyze photos with AI, unlock insights!
            </motion.p>
          </div>
          
          {/* Centered Write Button */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex justify-center w-full sm:w-auto"
          >
            <motion.button
              whileHover={{ scale: 1.08, rotate: 1 }}
              whileTap={{ scale: 0.92 }}
              onClick={onOpenJournal}
              className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 hover:from-yellow-200 hover:via-yellow-300 hover:to-orange-300 text-black font-black px-6 py-2 sm:px-8 sm:py-3 rounded-full shadow-xl transition-all duration-300 flex items-center gap-2 text-sm sm:text-base border-2 border-white/20"
              style={{ 
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                boxShadow: '0 8px 25px rgba(255,193,7,0.4), inset 0 1px 0 rgba(255,255,255,0.6)'
              }}
            >
              <motion.span 
                className="text-base sm:text-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
              >
                📝
              </motion.span>
              Open Journal Book
            </motion.button>
          </motion.div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-30 pb-8">
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <Button
              onClick={onOpenCalendar}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendar
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.6, duration: 0.6 }}
          >
            <Button
              onClick={onOpenStories}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Stories
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}