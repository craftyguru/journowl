import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Sparkles, 
  Camera, 
  Heart, 
  Trophy, 
  Users, 
  Palette,
  BookOpen,
  Star,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Zap,
  Target,
  Gift
} from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  features: string[];
  demo?: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to JournOwl! 🦉",
    description: "Your wise writing companion is here to make journaling magical, fun, and insightful!",
    icon: <BookOpen className="h-8 w-8" />,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-pink-500",
    features: [
      "AI-powered writing insights",
      "Beautiful, customizable interface", 
      "Smart photo analysis",
      "Progress tracking & achievements"
    ]
  },
  {
    id: 2,
    title: "Smart Journal Editor ✨",
    description: "Write with style! Customize fonts, colors, and let AI help spark your creativity.",
    icon: <PenTool className="h-8 w-8" />,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-cyan-500",
    features: [
      "10+ beautiful fonts",
      "Custom colors & themes",
      "AI writing prompts",
      "Real-time word count"
    ],
    demo: (
      <div className="bg-gray-900 rounded-lg p-4 text-white text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="font-mono">
          <span className="text-purple-400">Today was amazing!</span>
          <span className="text-gray-400 ml-2">| 245 words</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    title: "AI Photo Magic 📸",
    description: "Upload photos and watch AI analyze emotions, objects, and create writing prompts!",
    icon: <Camera className="h-8 w-8" />,
    color: "text-green-600", 
    bgGradient: "from-green-500 to-emerald-500",
    features: [
      "Automatic photo analysis",
      "Emotion & object detection",
      "Smart tagging system",
      "Photo-based writing prompts"
    ],
    demo: (
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-3">
        <div className="w-16 h-16 bg-gray-300 rounded-lg mb-2 flex items-center justify-center">
          <Camera className="h-6 w-6 text-gray-600" />
        </div>
        <div className="text-xs space-y-1">
          <div className="text-green-700 font-medium">AI Detected:</div>
          <div className="flex gap-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">Happy</Badge>
            <Badge variant="secondary" className="text-xs">Sunset</Badge>
            <Badge variant="secondary" className="text-xs">Beach</Badge>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    title: "Mood Tracking 💝",
    description: "Track your emotional journey with beautiful mood indicators and insights.",
    icon: <Heart className="h-8 w-8" />,
    color: "text-pink-600",
    bgGradient: "from-pink-500 to-rose-500", 
    features: [
      "Daily mood selection",
      "Emotional trend analysis",
      "Mood-based insights",
      "Beautiful visualizations"
    ],
    demo: (
      <div className="flex gap-2 justify-center">
        {["😊", "😔", "😍", "😌", "🤔"].map((emoji, i) => (
          <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${i === 0 ? 'bg-yellow-200 ring-2 ring-yellow-400' : 'bg-gray-100'}`}>
            {emoji}
          </div>
        ))}
      </div>
    )
  },
  {
    id: 5,
    title: "Achievements & XP 🏆",
    description: "Level up your journaling! Earn XP, unlock achievements, and track your progress.",
    icon: <Trophy className="h-8 w-8" />,
    color: "text-yellow-600",
    bgGradient: "from-yellow-500 to-orange-500",
    features: [
      "XP system & levels",
      "24 unique achievements", 
      "Streak tracking",
      "Progress visualization"
    ],
    demo: (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium">Level 3 • 1,247 XP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    )
  },
  {
    id: 6,
    title: "AI Insights & Analytics 🧠",
    description: "Get personalized insights about your writing patterns, themes, and growth.",
    icon: <Sparkles className="h-8 w-8" />,
    color: "text-indigo-600",
    bgGradient: "from-indigo-500 to-purple-500",
    features: [
      "Writing pattern analysis",
      "Theme identification",
      "Personal growth insights",
      "Trend visualizations"
    ]
  }
];

interface WelcomeTutorialProps {
  onComplete: () => void;
  userEmail?: string;
}

export function WelcomeTutorial({ onComplete, userEmail }: WelcomeTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (isCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 z-50"
      >
        <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-bold text-white mb-4"
            >
              Welcome to JournOwl! 🦉
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/80 mb-6"
            >
              You're all set to start your journaling journey! We've sent a welcome email to {userEmail} with helpful tips.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button 
                onClick={handleComplete}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-8 py-3 rounded-xl"
              >
                Start Journaling! <Zap className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const step = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 z-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <Card className="max-w-2xl w-full bg-white/10 backdrop-blur-lg border-white/20 relative">
        <CardContent className="p-8">
          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {tutorialSteps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-white' : 'bg-white/30'
                  }`}
                  animate={{ scale: index === currentStep ? 1.2 : 1 }}
                />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              {/* Icon with gradient background */}
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className={`w-20 h-20 bg-gradient-to-r ${step.bgGradient} rounded-full flex items-center justify-center mx-auto mb-6 text-white`}
              >
                {step.icon}
              </motion.div>

              {/* Title */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-white mb-4"
              >
                {step.title}
              </motion.h2>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-white/80 mb-6"
              >
                {step.description}
              </motion.p>

              {/* Demo component */}
              {step.demo && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 flex justify-center"
                >
                  {step.demo}
                </motion.div>
              )}

              {/* Features list */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8"
              >
                {step.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-2 text-white/80"
                  >
                    <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-white/60 text-sm">
              {currentStep + 1} of {tutorialSteps.length}
            </div>

            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {currentStep === tutorialSteps.length - 1 ? (
                <>
                  Get Started! <Star className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}