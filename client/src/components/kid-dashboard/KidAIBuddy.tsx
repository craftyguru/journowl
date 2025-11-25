import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface AIMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface KidAIBuddyProps {
  aiMessages: AIMessage[];
  aiInput: string;
  onAiInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export function KidAIBuddy({
  aiMessages,
  aiInput,
  onAiInputChange,
  onSendMessage,
}: KidAIBuddyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-8xl mb-4"
        >
          🤖
        </motion.div>
        <h3 className="text-3xl font-bold text-orange-800 mb-2">AI Writing Buddy!</h3>
        <p className="text-orange-600 text-lg mb-6">Your smart friend who helps you write amazing stories!</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 rounded-3xl p-6 border-4 border-orange-400 shadow-2xl mb-6 relative overflow-hidden"
      >
        <motion.div
          animate={{ x: [-5, 5, -5] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-2 right-2 text-2xl"
        >
          ✨
        </motion.div>
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            🧠
          </motion.div>
          <div>
            <h4 className="text-2xl font-bold text-orange-800">Ask Me Anything!</h4>
            <p className="text-orange-600">I love helping kids with their stories!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-4 max-h-64 overflow-y-auto border-2 border-orange-300">
          {aiMessages.length > 0 ? (
            <div className="space-y-3">
              {aiMessages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: message.sender === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs p-3 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white' 
                      : 'bg-gradient-to-r from-orange-200 to-yellow-200 text-orange-800 border-2 border-orange-300'
                  }`}>
                    {message.sender === 'ai' && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">🤖</span>
                        <span className="font-bold text-xs">AI Buddy</span>
                      </div>
                    )}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-4xl mb-3"
              >
                💭
              </motion.div>
              <p className="text-orange-600 font-medium">Ask me anything about writing stories!</p>
              <p className="text-orange-500 text-sm">I can help with ideas, characters, plots, and more!</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => onAiInputChange(e.target.value)}
            placeholder="What should I write about? 🤔"
            className="flex-1 p-3 rounded-2xl border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-orange-800 placeholder-orange-400 font-medium"
          />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={onSendMessage}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-2xl shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-200 to-pink-200 p-6 rounded-3xl border-4 border-purple-400 shadow-xl"
        >
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              💡
            </motion.div>
            <h4 className="text-xl font-bold text-purple-800 mb-3">Get Story Ideas</h4>
            <p className="text-purple-600 mb-4">Need inspiration for your next adventure?</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg">
                🌟 Get Ideas!
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-green-200 to-cyan-200 p-6 rounded-3xl border-4 border-green-400 shadow-xl"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🦸
            </motion.div>
            <h4 className="text-xl font-bold text-green-800 mb-3">Create Characters</h4>
            <p className="text-green-600 mb-4">Build amazing heroes and friends!</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg">
                👥 Make Characters!
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 border-4 border-rainbow shadow-2xl mt-6"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl mb-2"
          >
            🎲
          </motion.div>
          <h4 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Quick Story Starters
          </h4>
          <p className="text-gray-600">Click any button to get instant writing ideas!</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-blue-200 to-cyan-200 p-4 rounded-2xl border-3 border-blue-400 cursor-pointer shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🐉</div>
            <p className="font-bold text-blue-800 text-sm">Dragons</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-pink-200 to-purple-200 p-4 rounded-2xl border-3 border-pink-400 cursor-pointer shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🧚‍♀️</div>
            <p className="font-bold text-pink-800 text-sm">Fairies</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-green-200 to-emerald-200 p-4 rounded-2xl border-3 border-green-400 cursor-pointer shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🚀</div>
            <p className="font-bold text-green-800 text-sm">Space</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-br from-yellow-200 to-orange-200 p-4 rounded-2xl border-3 border-yellow-400 cursor-pointer shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🏰</div>
            <p className="font-bold text-yellow-800 text-sm">Castles</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
