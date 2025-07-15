import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, ArrowLeft, Sparkles, BookOpen, Target, TrendingUp, Brain, Heart } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome to JournOwl! 🦉",
    content: "Ready to start your wisdom-powered journaling journey? Let's explore each section and learn how to make the most of your experience!",
    icon: "🦉",
    color: "from-purple-400 to-pink-600",
    actionTip: "Click the tabs above to navigate between Journal, AI Insights, and Memory Calendar sections."
  },
  {
    title: "Smart Journal Tab 📝",
    content: "Click 'Open Journal Book' to start writing! Upload photos by dragging them in, select your mood, and watch AI generate personalized writing prompts based on your feelings.",
    icon: "📝",
    color: "from-blue-400 to-cyan-600",
    actionTip: "Try: Write your first entry → Upload a photo → Let AI analyze it for writing inspiration!"
  },
  {
    title: "AI Insights Magic 🤖",
    content: "Switch to the AI Insights tab to discover patterns in your writing! AI analyzes your entries to show mood trends, suggest topics, and reveal hidden insights about your journey.",
    icon: "🤖",
    color: "from-violet-400 to-purple-600",
    actionTip: "Write 3-5 entries first, then check this tab to see your personalized insights appear!"
  },
  {
    title: "Memory Calendar 📅",
    content: "Your Memory Calendar shows entries by date with colorful mood dots! Click any day to see your past entries, mood patterns, and photos from that time.",
    icon: "📅",
    color: "from-green-400 to-emerald-600",
    actionTip: "Each colored dot represents your mood that day - create a beautiful emotional rainbow over time!"
  },
  {
    title: "Goals & Achievements 🏆",
    content: "Scroll down to see your Goals and Achievements progress! Watch them unlock as you write - from 'First Steps' to 'Master Chronicler' level.",
    icon: "🏆",
    color: "from-amber-400 to-orange-600",
    actionTip: "Start writing to unlock your first achievement! Goals track streaks, word counts, and more."
  },
  {
    title: "Usage Meters & Upgrades ⚡",
    content: "At the top, monitor your AI prompts remaining and storage used. Free users get 100 AI prompts monthly - perfect for getting started!",
    icon: "⚡",
    color: "from-emerald-400 to-teal-600",
    actionTip: "Each AI prompt request (writing suggestions, photo analysis) uses one prompt from your monthly allowance."
  },
  {
    title: "Mobile-First Design 📱",
    content: "JournOwl works beautifully on mobile! Use the hamburger menu (☰) to access all features. Tap, swipe, and write anywhere you go.",
    icon: "📱",
    color: "from-pink-400 to-rose-600",
    actionTip: "On mobile: Use the menu button to navigate, and enjoy touch-optimized writing experience!"
  },
  {
    title: "Ready to Begin! 🚀",
    content: "You're all set! Start with your first journal entry - describe your day, upload a photo, or ask AI for writing prompts. Your journaling adventure begins now!",
    icon: "🚀",
    color: "from-cyan-400 to-blue-600",
    actionTip: "Click 'Open Journal Book' and write your first entry to begin your JournOwl journey!"
  }
];

export function HelpBubble() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="fixed left-2 sm:left-4 bottom-4 z-50">
      <motion.button
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-tr from-pink-400 to-purple-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl flex items-center justify-center text-2xl sm:text-3xl border-4 border-white relative overflow-hidden"
        onClick={() => setOpen(!open)}
        aria-label="Help and Guided Tour"
      >
        <motion.div
          animate={{ 
            background: [
              "linear-gradient(135deg, #ec4899, #8b5cf6)",
              "linear-gradient(135deg, #8b5cf6, #06b6d4)",
              "linear-gradient(135deg, #06b6d4, #10b981)",
              "linear-gradient(135deg, #10b981, #ec4899)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0"
        />
        <span className="relative z-10">🎈</span>
        
        {/* Pulsing ring animation */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-pink-400 opacity-20"
        />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.8 }}
            className="absolute left-0 sm:left-20 bottom-0 w-[95vw] max-w-sm sm:w-96"
          >
            <Card className="shadow-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${currentTourStep.color} opacity-10`} />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className={`w-12 h-12 bg-gradient-to-r ${currentTourStep.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    >
                      {currentTourStep.icon}
                    </motion.div>
                    <div>
                      <CardTitle className="text-base sm:text-lg font-bold text-gray-800">
                        {currentTourStep.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Step {currentStep + 1} of {tourSteps.length}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpen(false)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-700 leading-relaxed text-base font-medium"
                >
                  {currentTourStep.content}
                </motion.p>

                {/* Interactive Action Tip */}
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`bg-gradient-to-r ${currentTourStep.color.replace('from-', 'from-').replace('to-', 'to-')} bg-opacity-10 rounded-lg p-4 border-2 border-opacity-20 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse" />
                  <div className="relative z-10">
                    <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        💡
                      </motion.div>
                      How to Get Started
                    </h4>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">
                      {currentTourStep.actionTip}
                    </p>
                  </div>
                </motion.div>

                {/* Navigation and actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-1 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Back</span>
                      <span className="sm:hidden">←</span>
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={currentStep === tourSteps.length - 1}
                      size="sm"
                      className={`bg-gradient-to-r ${currentTourStep.color} text-white border-0 flex items-center gap-2`}
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1">
                    {tourSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentStep ? 'bg-purple-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Final step actions */}
                {currentStep === tourSteps.length - 1 && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">🎉 You're all set!</h4>
                    <p className="text-sm text-green-700 mb-3">
                      Ready to start your journaling journey? Create your first entry and unlock the power of AI-assisted reflection.
                    </p>
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                      onClick={() => setOpen(false)}
                    >
                      Start Journaling
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}