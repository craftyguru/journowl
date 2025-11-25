import { motion } from "framer-motion";

interface JournalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function JournalTabs({ activeTab, onTabChange, children }: JournalTabsProps) {
  const tabs = [
    { id: "journal", label: "Journal", icon: "✍️" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "achievements", label: "Achievements", icon: "🏆" },
    { id: "goals", label: "Goals", icon: "🎯" },
    { id: "challenges", label: "Challenges", icon: "⚡" },
    { id: "streaks", label: "Streaks", icon: "🔥" },
    { id: "social", label: "Social", icon: "👥" },
    { id: "thoughts", label: "AI Thoughts", icon: "🧠" },
    { id: "calendar", label: "Memory Calendar", icon: "📅" },
    { id: "stories", label: "AI Stories", icon: "✨" },
    { id: "referral", label: "Referral", icon: "🎁" }
  ];

  return (
    <div className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2">
        <div className="grid grid-cols-11 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center py-3 px-2 text-center transition-all duration-200
                ${activeTab === tab.id 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="text-xs font-medium leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}