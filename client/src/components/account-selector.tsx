import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Crown, User, Baby, Sparkles, Star, Trophy, Heart, BookOpen } from "lucide-react";

interface AccountSelectorProps {
  onSelectAccount: (accountType: string, username: string) => void;
}

const testAccounts = [
  {
    type: "user",
    username: "emma.johnson",
    displayName: "Emma Johnson",
    role: "Professional Writer",
    description: "Advanced journaling with AI insights, goal tracking, and comprehensive analytics",
    avatar: "👩‍💻",
    features: ["AI-Powered Insights", "Advanced Analytics", "Goal Setting", "Mood Tracking", "Achievement System"],
    color: "from-emerald-500 to-teal-600",
    icon: User,
    stats: { entries: "142", streak: "28 days", level: "12" }
  },
  {
    type: "kid",
    username: "little.timmy",
    displayName: "Little Timmy",
    role: "Young Explorer",
    description: "Kid-friendly interface with fun prompts, colorful rewards, and safe journaling",
    avatar: "🧒",
    features: ["Fun Prompts", "Colorful Badges", "Safe Environment", "Simple Interface", "Parental Controls"],
    color: "from-pink-500 to-rose-500",
    icon: Baby,
    stats: { stories: "23", badges: "8", level: "3" }
  }
];

export default function AccountSelector({ onSelectAccount }: AccountSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center mobile-safe-area p-3 sm:p-6">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8 lg:mb-12"
        >
          <div className="flex flex-col sm:inline-flex sm:flex-row items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
              🦉 Choose Your JournOwl Experience
            </h1>
          </div>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg px-4">
            Select a demo account to explore the complete JournOwl experience
          </p>
        </motion.div>

        {/* Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
          {testAccounts.map((account, index) => (
            <motion.div
              key={account.type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group"
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group-hover:shadow-2xl group-hover:shadow-purple-500/25 h-full">
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${account.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{account.avatar}</div>
                      <div>
                        <h3 className="text-xl font-bold">{account.displayName}</h3>
                        <p className="text-white/80 text-sm">{account.role}</p>
                      </div>
                    </div>
                    <account.icon className="w-6 h-6 text-white/80" />
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {Object.entries(account.stats).map(([key, value]) => (
                      <div key={key} className="bg-white/10 rounded-lg p-2">
                        <p className="text-white/80 text-xs capitalize">{key}</p>
                        <p className="font-bold text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <p className="text-gray-300 mb-6 leading-relaxed">{account.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-6 flex-1">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      Key Features
                    </h4>
                    <div className="space-y-2">
                      {account.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => onSelectAccount(account.type, account.username)}
                    className={`w-full bg-gradient-to-r ${account.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300`}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Explore {account.displayName}'s Dashboard
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-gray-300 text-sm">
              Each account showcases different features and user experiences
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}