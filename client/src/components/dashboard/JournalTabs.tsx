import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  BarChart3, 
  Trophy, 
  Target, 
  Brain, 
  Calendar, 
  Sparkles 
} from "lucide-react";

interface JournalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function JournalTabs({ activeTab, onTabChange, children }: JournalTabsProps) {
  const tabs = [
    { id: "journal", label: "Journal", icon: "✍️", color: "from-purple-500 to-pink-500" },
    { id: "analytics", label: "Analytics", icon: "📊", color: "from-blue-500 to-cyan-500" },
    { id: "achievements", label: "Achievements", icon: "🏆", color: "from-yellow-500 to-orange-500" },
    { id: "goals", label: "Goals", icon: "🎯", color: "from-green-500 to-teal-500" },
    { id: "insights", label: "Insights", icon: "🧠", color: "from-indigo-500 to-purple-500" },
    { id: "calendar", label: "Calendar", icon: "📅", color: "from-rose-500 to-pink-500" },
    { id: "stories", label: "AI Stories", icon: "✨", color: "from-violet-500 to-purple-500" }
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="overflow-x-auto pb-2 mb-6">
        <TabsList className="grid grid-cols-7 w-full min-w-[800px] bg-gradient-to-r from-slate-100 to-slate-200 p-1 rounded-2xl shadow-lg border border-slate-300">
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`
                relative flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-semibold transition-all duration-300
                ${activeTab === tab.id 
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105 border-2 border-white/30` 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                }
              `}
            >
              <motion.span 
                className="text-lg"
                animate={{
                  scale: activeTab === tab.id ? [1, 1.2, 1] : [1, 1.1, 1],
                  rotate: activeTab === tab.id ? [0, 10, -10, 0] : 0,
                }}
                transition={{
                  duration: activeTab === tab.id ? 2 : 1.5,
                  repeat: activeTab === tab.id ? Infinity : 0,
                  repeatType: "reverse"
                }}
              >
                {tab.icon}
              </motion.span>
              <span className="relative text-xs sm:text-sm" style={{ fontFamily: '"Rock Salt", cursive' }}>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    className="absolute -inset-1 bg-white/20 rounded blur-sm"
                    animate={{
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                )}
              </span>
              <motion.div
                className="w-2 h-2 bg-yellow-300 rounded-full"
                animate={{
                  scale: activeTab === tab.id ? [1, 1.5, 1] : [0.8, 1.2, 0.8],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      
      {children}
    </Tabs>
  );
}