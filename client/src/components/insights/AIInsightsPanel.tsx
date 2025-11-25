import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Trophy } from "lucide-react";

interface AIInsightsPanelProps {
  stats: any;
  aiQuestion: string;
  setAiQuestion: (q: string) => void;
  isAskingAI: boolean;
  aiResponse: string;
  onAskAI: () => void;
}

export const AIInsightsPanel = ({ stats, aiQuestion, setAiQuestion, isAskingAI, aiResponse, onAskAI }: AIInsightsPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-900/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            🤖 AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Smart Summaries */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">📊 Smart Summaries</h3>
              {[
                { icon: "📈", text: "Your writing is more positive on weekends", color: "emerald" },
                { icon: "🔥", text: `Longest streak started on March 12th (${stats.longestStreak} days)`, color: "orange" },
                { icon: "🌙", text: "Mood dips after 9pm—try journaling earlier", color: "purple" },
                { icon: "📚", text: `Most productive day: ${stats.bestMoodDay} with ${stats.mostPhotos} photos`, color: "blue" }
              ].map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                  className={`p-4 rounded-lg border-l-4 border-${insight.color}-500 bg-${insight.color}-50 dark:bg-${insight.color}-900/20`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{insight.icon}</span>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{insight.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Ask AI Anything */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">🎯 Ask AI Anything</h3>
              <div className="space-y-3">
                <div className="relative">
                  <Input
                    placeholder="What was my best week? Show me all happy days..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isAskingAI && aiQuestion.trim()) {
                        onAskAI();
                      }
                    }}
                    className="pr-12"
                  />
                  <Button 
                    size="sm" 
                    onClick={onAskAI}
                    disabled={isAskingAI || !aiQuestion.trim()}
                    className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50"
                  >
                    {isAskingAI ? (
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                
                {/* Quick Questions */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "What was my best week?",
                    "Show me sad days",
                    "When do I write most?",
                    "Mood patterns?"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAiQuestion(question);
                        setTimeout(() => onAskAI(), 100);
                      }}
                      disabled={isAskingAI}
                      className="text-xs"
                    >
                      {question}
                    </Button>
                  ))}
                </div>

                {/* AI Response */}
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-800 dark:text-indigo-200">AI Analysis</span>
                  </div>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    {isAskingAI ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full" />
                        <span>Analyzing your journal data...</span>
                      </div>
                    ) : aiResponse ? (
                      aiResponse
                    ) : stats.totalEntries > 0 ? (
                      `You've written ${stats.totalEntries} ${stats.totalEntries === 1 ? 'entry' : 'entries'} with ${stats.totalWords} words total. Your current streak is ${stats.currentStreak} ${stats.currentStreak === 1 ? 'day' : 'days'} - ask me anything about your journaling patterns!`
                    ) : (
                      "Start writing your first entry to see personalized AI analysis of your patterns, mood trends, and writing habits."
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800 dark:text-amber-200">Next Milestone</span>
              </div>
              <Badge className="bg-amber-100 text-amber-800 border-0">
                {stats.totalEntries < 5 ? `${5 - stats.totalEntries} entries to go!` : 
                 stats.totalEntries < 10 ? `${10 - stats.totalEntries} entries to go!` : 
                 stats.totalEntries < 25 ? `${25 - stats.totalEntries} entries to go!` : 
                 `${50 - stats.totalEntries} entries to go!`}
              </Badge>
            </div>
            <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full" style={{ 
                width: `${stats.totalEntries < 5 ? (stats.totalEntries / 5 * 100) : 
                       stats.totalEntries < 10 ? (stats.totalEntries / 10 * 100) : 
                       stats.totalEntries < 25 ? (stats.totalEntries / 25 * 100) : 
                       (stats.totalEntries / 50 * 100)}%` 
              }}></div>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {stats.totalEntries < 5 ? '📝 5 entries for First Steps Badge!' : 
               stats.totalEntries < 10 ? '🌟 10 entries for Regular Writer Badge!' : 
               stats.totalEntries < 25 ? '🏆 25 entries for Dedicated Writer Badge!' : 
               '👑 50 entries for Gold Badge! You\'re almost there - keep writing!'}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
