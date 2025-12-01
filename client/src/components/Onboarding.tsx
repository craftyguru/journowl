import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, BookOpen, Zap, Users, Target, CheckCircle } from "lucide-react";
import { getModeOptions, type InterfaceMode } from "@/lib/modes";
import { ModeOnboarding } from "./mode-specific/ModeOnboarding";
import { apiRequest } from "@/lib/queryClient";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const modeOptions = getModeOptions();

  const steps = [
    {
      icon: <BookOpen className="w-12 h-12 text-blue-500" />,
      title: "Welcome to JournOwl",
      subtitle: "Your AI-powered journaling companion",
      description: "Write freely, reflect deeply, and discover yourself through the power of daily journaling.",
      cta: "Get Started"
    },
    {
      icon: null,
      title: "How do you want to use JournOwl?",
      subtitle: "Choose your interface mode",
      description: "Select the interface that best matches your journaling goals. You can change this anytime.",
      cta: "Next",
      type: "mode-selector"
    },
    {
      type: "mode-onboarding",
      mode: selectedMode as InterfaceMode
    },
    {
      icon: <Zap className="w-12 h-12 text-yellow-500" />,
      title: "AI-Powered Insights",
      subtitle: "Discover patterns in your thoughts",
      description: "Get personalized coaching, mood trends, and intelligent recommendations based on your entries.",
      cta: "Next"
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-green-500" />,
      title: "Ready to Begin",
      subtitle: "Your journal awaits",
      description: "Write your first entry today and start your transformation journey.",
      cta: "Start Journaling"
    }
  ];

  const current = steps[step];

  const handleNext = async () => {
    if (current.type === "mode-selector" && selectedMode) {
      try {
        await apiRequest('/api/user/interface-mode', {
          method: 'PATCH',
          body: JSON.stringify({ interfaceMode: selectedMode })
        });
        setStep(step + 1); // Go to mode-specific onboarding
      } catch (error) {
        console.error('Failed to save interface mode:', error);
        setStep(step + 1);
      }
      return;
    }

    if (current.type === "mode-onboarding") {
      onComplete();
      return;
    }
    
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center z-50 p-4"
      data-testid="onboarding-container"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/30 shadow-2xl">
            <div className="p-8 space-y-6">
              {/* Mode-Specific Onboarding */}
              {current.type === "mode-onboarding" && selectedMode ? (
                <ModeOnboarding
                  mode={selectedMode as InterfaceMode}
                  onComplete={() => handleNext()}
                />
              ) : current.type === "mode-selector" ? (
                <>
                  <div className="text-center space-y-3">
                    <h1 className="text-3xl font-bold text-white">{current.title}</h1>
                    <p className="text-purple-300 text-lg font-semibold">{current.subtitle}</p>
                    <p className="text-white/70 text-base leading-relaxed">{current.description}</p>
                  </div>

                  {/* Mode Options Grid */}
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                    {modeOptions.map(mode => (
                      <motion.button
                        key={mode.value}
                        onClick={() => setSelectedMode(mode.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedMode === mode.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-white/20 bg-white/5 hover:border-white/40'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-2">{mode.icon}</div>
                        <div className="text-sm font-semibold text-white">{mode.label}</div>
                        <div className="text-xs text-white/60">{mode.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Regular Onboarding Step */}
                  <div className="text-center space-y-3">
                    {current.icon && (
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="flex justify-center"
                      >
                        {current.icon}
                      </motion.div>
                    )}
                    <h1 className="text-3xl font-bold text-white">{current.title}</h1>
                    <p className="text-purple-300 text-lg font-semibold">{current.subtitle}</p>
                    <p className="text-white/70 text-base leading-relaxed">{current.description}</p>
                  </div>
                </>
              )}

              {/* Progress Dots */}
              <div className="flex gap-2 justify-center">
                {steps.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx === step ? "bg-purple-500 w-8" : "bg-white/20 w-2"
                    }`}
                    layoutId={`dot-${idx}`}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                {step > 0 && (
                  <Button
                    onClick={() => setStep(step - 1)}
                    variant="ghost"
                    className="flex-1 text-white/70 hover:text-white"
                    data-testid="button-back"
                  >
                    Back
                  </Button>
                )}
                {step < steps.length - 1 && (
                  <Button
                    onClick={handleSkip}
                    variant="ghost"
                    className="flex-1 text-white/70 hover:text-white"
                    data-testid="button-skip"
                  >
                    Skip
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={current.type === "mode-selector" && !selectedMode}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 gap-2 disabled:opacity-50"
                  data-testid="button-onboarding-next"
                >
                  {current.cta}
                  {step < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
