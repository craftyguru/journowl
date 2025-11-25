import { motion } from "framer-motion";

interface Stats {
  totalEntries?: number;
  currentStreak?: number;
  totalWords?: number;
  xp?: number;
}

interface Achievement {
  id: number;
  title: string;
  icon: string;
  rarity: string;
  unlocked: boolean;
}

interface KidStatsProps {
  stats: Stats;
  achievements: Achievement[];
  currentLevel: number;
  levelProgress: number;
}

export function KidStats({
  stats,
  achievements,
  currentLevel,
  levelProgress,
}: KidStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="text-center mb-6">
        <div className="text-6xl mb-4 animate-bounce">📊✨</div>
        <h3 className="text-2xl font-bold text-purple-800 mb-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          My Amazing Writing Dashboard! 🌟
        </h3>
        <p className="text-purple-600 mb-4">Look how awesome you're doing! 🎉</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-pink-200 to-purple-200 p-4 rounded-2xl border-3 border-pink-300 shadow-lg"
        >
          <div className="text-3xl mb-2 animate-pulse">📚</div>
          <div className="text-2xl font-bold text-purple-800">{stats.totalEntries || 0}</div>
          <div className="text-purple-600 text-sm font-bold">Amazing Stories!</div>
          <div className="text-xs text-purple-500 mt-1">Keep writing! 🖍️</div>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-orange-200 to-red-200 p-4 rounded-2xl border-3 border-orange-300 shadow-lg"
        >
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-red-800">{stats.currentStreak || 0}</div>
          <div className="text-red-600 text-sm font-bold">Day Super Streak!</div>
          <div className="text-xs text-red-500 mt-1">You're on fire! 🚀</div>
        </motion.div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-teal-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          🎯 My Progress Meters
        </h4>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-2xl border-2 border-green-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-green-800 flex items-center gap-1">
                ✏️ Words Written
              </span>
              <span className="text-green-700 font-bold">{stats.totalWords || 0} words!</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-4 border-2 border-green-400">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${Math.min(((stats.totalWords || 0) / 1000) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="text-xs text-green-600 mt-1">Goal: 1000 words! 🎯</div>
          </div>

          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-2xl border-2 border-yellow-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-orange-800 flex items-center gap-1">
                ⭐ Level {currentLevel}
              </span>
              <span className="text-orange-700 font-bold">{stats.xp || 0} XP</span>
            </div>
            <div className="w-full bg-yellow-200 rounded-full h-4 border-2 border-yellow-400">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${levelProgress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-ping"></div>
              </div>
            </div>
            <div className="text-xs text-orange-600 mt-1">Next level in {1000 - (((stats.xp || 0) % 1000))} XP! 🚀</div>
          </div>

          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-2xl border-2 border-purple-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-purple-800 flex items-center gap-1">
                🏆 Streak Power
              </span>
              <span className="text-purple-700 font-bold">{stats.currentStreak || 0} days!</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-4 border-2 border-purple-400">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${Math.min(((stats.currentStreak || 0) / 30) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-bounce"></div>
              </div>
            </div>
            <div className="text-xs text-purple-600 mt-1">Goal: 30 day streak! 💪</div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-indigo-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          🎨 Fun Writing Facts
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="bg-gradient-to-br from-cyan-200 to-blue-200 p-3 rounded-xl border-2 border-cyan-300 text-center"
          >
            <div className="text-2xl mb-1">🌈</div>
            <div className="text-lg font-bold text-blue-800">{stats.totalEntries || 0}</div>
            <div className="text-xs text-blue-600">Colorful Stories</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="bg-gradient-to-br from-emerald-200 to-green-200 p-3 rounded-xl border-2 border-emerald-300 text-center"
          >
            <div className="text-2xl mb-1">🎭</div>
            <div className="text-lg font-bold text-green-800">{Math.floor((stats.totalWords || 0) / 50)}</div>
            <div className="text-xs text-green-600">Happy Moments</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="bg-gradient-to-br from-amber-200 to-yellow-200 p-3 rounded-xl border-2 border-amber-300 text-center"
          >
            <div className="text-2xl mb-1">🎪</div>
            <div className="text-lg font-bold text-yellow-800">{Math.ceil((stats.totalWords || 0) / 20)}</div>
            <div className="text-xs text-yellow-600">Fun Adventures</div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="bg-gradient-to-br from-rose-200 to-pink-200 p-3 rounded-xl border-2 border-rose-300 text-center"
          >
            <div className="text-2xl mb-1">🎈</div>
            <div className="text-lg font-bold text-pink-800">{(stats.currentStreak || 0) * 3}</div>
            <div className="text-xs text-pink-600">Writing Points</div>
          </motion.div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-violet-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          🏅 My Super Badges
        </h4>
        <div className="grid grid-cols-4 gap-2">
          {achievements.filter(a => a.unlocked).slice(0, 8).map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-3 rounded-xl text-center border-2 ${
                achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-300 to-gold-300 border-yellow-500' :
                achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-300 to-violet-300 border-purple-500' :
                achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-300 to-indigo-300 border-blue-500' :
                'bg-gradient-to-br from-green-300 to-emerald-300 border-green-500'
              }`}
            >
              <div className="text-xl mb-1">{achievement.icon}</div>
              <div className="text-xs font-bold text-gray-800">{achievement.title}</div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-teal-800 mb-3 flex items-center gap-2" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          😊 My Feeling Rainbow
        </h4>
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-2xl border-2 border-pink-300">
          <div className="flex justify-around items-end h-20">
            {['😊', '😄', '🤔', '😢', '😴'].map((mood, index) => (
              <motion.div
                key={mood}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 60}%` }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-t from-purple-400 to-pink-400 rounded-t-lg w-8 flex items-end justify-center pb-1"
              >
                <span className="text-sm">{mood}</span>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-2 text-xs text-purple-600">Your feelings make stories special! 🌈</div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-yellow-200 to-orange-200 p-4 rounded-2xl border-3 border-yellow-400 text-center"
      >
        <div className="text-2xl mb-2">🌟</div>
        <p className="text-orange-800 font-bold text-sm" style={{ fontFamily: 'Comic Sans MS, cursive' }}>
          You're an amazing writer! Keep sharing your wonderful stories! 🦉✨
        </p>
      </motion.div>
    </motion.div>
  );
}
