import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, ArrowLeft, Sparkles, BookOpen, Target, TrendingUp, Brain, Heart } from "lucide-react";

const tourSteps = [
  {
    title: "Welcome to JournOwl! 🦉",
    content: "Your AI-powered journaling companion is ready to help you track moods, achieve goals, and discover insights from your writing journey.",
    icon: "🦉",
    color: "from-purple-400 to-pink-600"
  },
  {
    title: "Smart Journal Editor 📝",
    content: "Write with our advanced editor featuring AI prompts, photo uploads, mood tracking, and rich formatting options.",
    icon: "📝",
    color: "from-blue-400 to-cyan-600"
  },
  {
    title: "Mood Tracking 😊",
    content: "Select your mood with each entry and watch your emotional patterns emerge in beautiful analytics and calendar views.",
    icon: "😊",
    color: "from-green-400 to-emerald-600"
  },
  {
    title: "Goals & Achievements 🎯",
    content: "Set trackable goals, earn achievements, and level up your journaling with our comprehensive XP system.",
    icon: "🎯",
    color: "from-amber-400 to-orange-600"
  },
  {
    title: "AI Insights 🤖",
    content: "Discover personalized writing prompts, mood analysis, and meaningful patterns in your journaling journey.",
    icon: "🤖",
    color: "from-violet-400 to-purple-600"
  },
  {
    title: "Analytics Dashboard 📊",
    content: "View your progress with interactive charts, streak tracking, word counts, and comprehensive mood analytics.",
    icon: "📊",
    color: "from-teal-400 to-cyan-600"
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
    <div className="fixed left-4 bottom-4 z-50">
      <motion.button
        whileHover={{ scale: 1.1, rotate: -10 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-tr from-pink-400 to-purple-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl border-4 border-white relative overflow-hidden"
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
            className="absolute left-20 bottom-0 w-96"
          >
            <Card className="shadow-2xl border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
              <CardHeader className="relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${currentTourStep.color} opacity-10`} />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${currentTourStep.color} rounded-full flex items-center justify-center text-2xl shadow-lg`}>
                      {currentTourStep.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-800">
                        {currentTourStep.title}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
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
                <p className="text-gray-700 leading-relaxed">
                  {currentTourStep.content}
                </p>

                {/* Quick feature highlights */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Key Features
                  </h4>
                  <ul className="space-y-1 text-sm text-blue-700">
                    <li>• 🦉 <strong>Smart AI Assistant</strong> - Personalized writing prompts</li>
                    <li>• 📱 <strong>Multi-Device Sync</strong> - Write anywhere, anytime</li>
                    <li>• 🎯 <strong>Goal Tracking</strong> - 10+ trackable achievement types</li>
                    <li>• 📊 <strong>Rich Analytics</strong> - Mood patterns and insights</li>
                    <li>• 🔒 <strong>Privacy First</strong> - Your data stays secure</li>
                  </ul>
                </div>

                {/* Navigation and actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
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