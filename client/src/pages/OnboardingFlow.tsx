import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Sparkles, Target, Users, Zap } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to JournOwl 🦉",
      description: "Your AI-powered journaling companion for self-discovery and growth",
      icon: Sparkles,
      content: "Write freely, reflect deeply, and unlock insights with AI.",
    },
    {
      title: "Set Your Goal",
      description: "Choose what you want to achieve",
      icon: Target,
      options: [
        "Daily habit formation",
        "Emotional clarity",
        "Personal growth",
        "Creative expression",
      ],
    },
    {
      title: "Join the Community",
      description: "Connect with other journalers",
      icon: Users,
      content: "Share achievements, build streaks, and inspire others.",
    },
    {
      title: "Unlock Premium",
      description: "Enhance your journaling",
      icon: Zap,
      features: [
        "Unlimited AI prompts",
        "Advanced analytics",
        "Custom AI personality",
        "Team collaboration",
      ],
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 bg-white/10 backdrop-blur-xl border border-white/20">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 flex justify-center"
              >
                <Icon className="w-16 h-16 text-purple-400" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-2">
                {current.title}
              </h2>
              <p className="text-gray-300 mb-6">{current.description}</p>

              {current.content && (
                <p className="text-sm text-gray-400 mb-8">{current.content}</p>
              )}

              {current.options && (
                <div className="space-y-2 mb-8">
                  {current.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="w-full p-3 rounded-lg bg-gradient-to-r from-purple-500/30 to-pink-500/30 hover:from-purple-500/50 hover:to-pink-500/50 text-white transition-all border border-white/10"
                      data-testid={`onboarding-option-${i}`}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </div>
              )}

              {current.features && (
                <div className="space-y-2 mb-8 text-left">
                  {current.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-300">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      {feat}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                {step > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                    className="flex-1"
                    data-testid="button-prev-step"
                  >
                    Back
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (step === steps.length - 1) {
                      onComplete();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  data-testid={`button-${step === steps.length - 1 ? 'complete' : 'next'}-step`}
                >
                  {step === steps.length - 1 ? 'Get Started' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="mt-6 flex gap-2 justify-center">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${
                      i === step ? 'w-6 bg-purple-400' : 'w-2 bg-gray-400'
                    }`}
                    data-testid={`step-indicator-${i}`}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
