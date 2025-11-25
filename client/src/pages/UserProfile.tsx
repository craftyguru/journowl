import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, Trophy, Flame, BookOpen, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileData {
  id: number;
  username: string;
  bio?: string;
  avatar?: string;
  currentPlan: string;
  stats: {
    totalEntries: number;
    totalWords: number;
    currentStreak: number;
    longestStreak: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    icon: string;
  }>;
  rank?: number;
  totalUsers?: number;
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery<UserProfileData>({
    queryKey: [`/api/users/${userId}/profile`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-white">Profile not found</h2>
        <Button onClick={() => setLocation("/dashboard")} className="bg-purple-600 hover:bg-purple-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const shareProfile = () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(profileUrl);
    toast({ title: "Profile link copied!", description: profileUrl });
  };

  const getMedalIcon = (rank?: number) => {
    if (!rank) return "🏅";
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "🏅";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setLocation("/dashboard")}
            variant="ghost"
            className="text-white hover:bg-white/10"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={shareProfile}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid="button-share-profile"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="p-8 bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 mb-6">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-4xl">
              {profile.avatar || "🧑"}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{profile.username}</h1>
              {profile.rank && (
                <div className="flex items-center gap-2 text-2xl">
                  <span>{getMedalIcon(profile.rank)}</span>
                  <span className="text-purple-300">
                    Rank #{profile.rank}
                    {profile.totalUsers && ` of ${profile.totalUsers}`}
                  </span>
                </div>
              )}
              <div className="mt-2">
                <span className="px-3 py-1 rounded-full bg-purple-600/30 border border-purple-500/40 text-sm text-purple-200 capitalize">
                  {profile.currentPlan || "Free"} Plan
                </span>
              </div>
            </div>
          </div>

          {profile.bio && <p className="text-white/80 mb-6 text-lg italic">"{profile.bio}"</p>}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-white/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span className="text-xs text-blue-200">Entries</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.stats.totalEntries}</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-white/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-300" />
                <span className="text-xs text-green-200">Words</span>
              </div>
              <p className="text-2xl font-bold text-white">{(profile.stats.totalWords / 1000).toFixed(1)}k</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-white/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-red-300" />
                <span className="text-xs text-red-200">Current Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.stats.currentStreak} days</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-lg bg-white/5 border border-purple-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span className="text-xs text-yellow-200">Longest Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile.stats.longestStreak} days</p>
            </motion.div>
          </div>

          {/* Achievements */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="pt-6 border-t border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">🏆 Achievements</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {profile.achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex flex-col items-center gap-1"
                    data-testid={`achievement-${idx}`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center text-xl shadow-lg">
                      {achievement.icon}
                    </div>
                    <span className="text-xs text-center text-white/70 line-clamp-2">{achievement.title}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Share CTA */}
        <Card className="p-6 bg-gradient-to-r from-purple-600/50 to-pink-600/50 border border-purple-400/30 text-center">
          <p className="text-white mb-4">Share this profile and inspire others to journal more! 🦉</p>
          <Button
            onClick={shareProfile}
            className="w-full bg-purple-600 hover:bg-purple-700"
            data-testid="button-share-cta"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Copy Share Link
          </Button>
        </Card>
      </motion.div>
    </div>
  );
}
