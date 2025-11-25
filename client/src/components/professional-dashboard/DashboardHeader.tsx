import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TypewriterTitle } from "./TypewriterTitle";

interface DashboardHeaderProps {
  user: any;
  stats: any;
}

export const DashboardHeader = ({ user, stats }: DashboardHeaderProps) => {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in mobile-fade-in">
      <Card className="gradient-bg text-white relative overflow-hidden min-h-[280px]">
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
          🌟
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -12, 0],
            rotate: [0, 180, 360],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-24 left-32 text-lg z-10"
        >
          💫
        </motion.div>

        <CardContent className="p-8 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-3 leading-tight">
              <TypewriterTitle text={`🦉 Welcome back, ${user?.username || 'Wise Writer'}!`} />
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
              className="text-white/90 mb-6 text-lg"
            >
              Your wise JournOwl companion is ready to help capture today's thoughts and memories! ✨
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.8 }}
              className="flex items-center space-x-4 flex-wrap gap-2"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-white/20 to-white/30 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20"
              >
                <span className="text-sm font-medium">🏆 Level {user?.level || 1}</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-orange-400/30 to-red-400/30 px-4 py-2 rounded-full backdrop-blur-sm border border-orange-300/30"
              >
                <span className="text-sm font-medium">🔥 {stats?.currentStreak || 0} day streak</span>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-r from-purple-400/30 to-pink-400/30 px-4 py-2 rounded-full backdrop-blur-sm border border-purple-300/30"
              >
                <span className="text-sm font-medium">📝 {stats?.totalEntries || 0} entries</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};
