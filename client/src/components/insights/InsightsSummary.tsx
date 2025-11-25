import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Flame, Trophy, TrendingUp } from "lucide-react";

interface InsightsSummaryProps {
  stats: any;
}

export const InsightsSummary = ({ stats }: InsightsSummaryProps) => {
  const statCards = [
    { 
      title: "Total Entries", 
      value: stats.totalEntries, 
      icon: BookOpen, 
      color: "from-purple-500 to-violet-600",
      suffix: "",
      subtitle: "Keep writing!"
    },
    { 
      title: "Total Words", 
      value: (stats?.totalWords || 0).toLocaleString(), 
      icon: Target, 
      color: "from-emerald-500 to-teal-600",
      suffix: "",
      subtitle: "Amazing progress"
    },
    { 
      title: "Current Streak", 
      value: stats.currentStreak, 
      icon: Flame, 
      color: "from-orange-500 to-red-500",
      suffix: " days",
      subtitle: "🔥 On fire!"
    },
    { 
      title: "Longest Streak", 
      value: stats.longestStreak, 
      icon: Trophy, 
      color: "from-amber-500 to-yellow-500",
      suffix: " days",
      subtitle: "Personal best!"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="group"
        >
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-900/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <div className="flex items-baseline gap-1">
                  <motion.span 
                    className="text-3xl font-bold text-gray-900 dark:text-white"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-400">{stat.suffix}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subtitle}</p>
              </div>
            </CardContent>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};
