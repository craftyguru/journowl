import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Star } from "lucide-react";
import { useState } from "react";

interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

const BADGE_DEFINITIONS: AchievementBadge[] = [
  {
    id: "first-entry",
    title: "Journeyer",
    description: "Write your first journal entry",
    icon: "✍️",
    rarity: "common",
    progress: 1,
    maxProgress: 1,
    unlockedAt: new Date().toISOString(),
  },
  {
    id: "7-day-streak",
    title: "Dedicated",
    description: "Maintain a 7-day writing streak",
    icon: "🔥",
    rarity: "rare",
    progress: 0,
    maxProgress: 7,
  },
  {
    id: "mood-master",
    title: "Mood Master",
    description: "Track mood in 20 entries",
    icon: "😊",
    rarity: "rare",
    progress: 0,
    maxProgress: 20,
  },
  {
    id: "photo-artist",
    title: "Photo Artist",
    description: "Add photos to 10 entries",
    icon: "📸",
    rarity: "epic",
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "prolific-writer",
    title: "Prolific Writer",
    description: "Write 50,000+ total words",
    icon: "📚",
    rarity: "epic",
    progress: 0,
    maxProgress: 50000,
  },
  {
    id: "challenge-master",
    title: "Challenge Master",
    description: "Complete 25 challenges",
    icon: "⚡",
    rarity: "legendary",
    progress: 0,
    maxProgress: 25,
  },
  {
    id: "ai-enthusiast",
    title: "AI Enthusiast",
    description: "Use 100 AI prompts",
    icon: "🤖",
    rarity: "epic",
    progress: 0,
    maxProgress: 100,
  },
  {
    id: "consistency-champion",
    title: "Consistency Champion",
    description: "Maintain a 30-day streak",
    icon: "🏆",
    rarity: "legendary",
    progress: 0,
    maxProgress: 30,
  },
];

const RARITY_COLORS = {
  common: "bg-gray-100 border-gray-300 text-gray-900",
  rare: "bg-blue-100 border-blue-400 text-blue-900",
  epic: "bg-purple-100 border-purple-400 text-purple-900",
  legendary: "bg-yellow-100 border-yellow-400 text-yellow-900",
};

export function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);

  // Fetch user achievements
  const { data: userBadges = [] } = useQuery({
    queryKey: ["/api/achievements/badges"],
    queryFn: async () => {
      const res = await fetch("/api/achievements/badges", { credentials: "include" });
      if (!res.ok) return BADGE_DEFINITIONS;
      return res.json();
    },
  });

  const badges = Array.isArray(userBadges) && userBadges.length > 0 ? userBadges : BADGE_DEFINITIONS;
  const unlockedCount = badges.filter((b: AchievementBadge) => b.unlockedAt).length;
  const totalBadges = badges.length;

  return (
    <div className="space-y-6">
      <Card className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-600" />
            <h2 className="text-2xl font-bold text-gray-900">Achievement Badges</h2>
          </div>
          <Badge className="bg-purple-600 text-white px-3 py-1">
            {unlockedCount}/{totalBadges}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Badge Progress</span>
            <span className="text-lg font-bold text-purple-600">{Math.round((unlockedCount / totalBadges) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge: AchievementBadge) => {
            const isUnlocked = !!badge.unlockedAt;
            const colorClass = RARITY_COLORS[badge.rarity];

            return (
              <button
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`relative p-4 rounded-lg border-2 transition-all transform hover:scale-105 cursor-pointer ${
                  isUnlocked ? colorClass : "bg-gray-50 border-gray-300 opacity-60"
                }`}
                data-testid={`badge-${badge.id}`}
              >
                <div className="text-4xl mb-2 text-center">{badge.icon}</div>
                <p className="text-xs font-bold text-center line-clamp-2">{badge.title}</p>

                {!isUnlocked && (
                  <div className="absolute top-2 right-2">
                    <Lock className="w-4 h-4 text-gray-500" />
                  </div>
                )}

                {!isUnlocked && badge.maxProgress > 0 && (
                  <div className="mt-2 w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${Math.min((badge.progress / badge.maxProgress) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Badge Details Modal */}
        {selectedBadge && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="bg-white rounded-2xl p-8 max-w-md shadow-xl">
              <button
                onClick={() => setSelectedBadge(null)}
                className="float-right text-gray-500 hover:text-gray-700 mb-4"
              >
                ✕
              </button>

              <div className="text-6xl text-center mb-4">{selectedBadge.icon}</div>
              <h3 className="text-2xl font-bold text-center mb-2">{selectedBadge.title}</h3>

              <Badge className={`mx-auto block w-fit mb-4 ${RARITY_COLORS[selectedBadge.rarity]}`}>
                {selectedBadge.rarity.toUpperCase()}
              </Badge>

              <p className="text-gray-600 text-center mb-6">{selectedBadge.description}</p>

              {!selectedBadge.unlockedAt && selectedBadge.maxProgress > 0 && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    Progress: {selectedBadge.progress} / {selectedBadge.maxProgress}
                  </p>
                  <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600"
                      style={{ width: `${Math.min((selectedBadge.progress / selectedBadge.maxProgress) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {selectedBadge.unlockedAt && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-green-900 font-semibold">✨ Unlocked!</p>
                </div>
              )}

              <button
                onClick={() => setSelectedBadge(null)}
                className="w-full mt-6 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}
