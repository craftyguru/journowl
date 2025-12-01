// Mode-specific onboarding flows
// Each mode has tailored questions to set up retention loops

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { InterfaceMode } from '@/lib/modes';

interface ModeOnboardingProps {
  mode: InterfaceMode;
  onComplete: (answers: Record<string, string>) => void;
}

const MODE_FLOWS: Record<InterfaceMode, any> = {
  wellness: {
    title: 'Personal Wellness Setup',
    questions: [
      {
        id: 'reflection_time',
        question: 'When do you tend to reflect most?',
        type: 'select',
        options: ['Morning', 'Afternoon', 'Evening', 'Night', 'Varies']
      },
      {
        id: 'emotion_focus',
        question: 'What emotion would you like to understand better?',
        type: 'text',
        placeholder: 'e.g., anxiety, sadness, confusion'
      },
      {
        id: 'ai_tone',
        question: 'AI tone preference:',
        type: 'select',
        options: ['Supportive & warm', 'Neutral & objective']
      }
    ]
  },

  productivity: {
    title: 'Productive Creator Setup',
    questions: [
      {
        id: 'writing_purpose',
        question: 'What are you writing for?',
        type: 'select',
        options: ['Building a body of work', 'Daily practice', 'Processing ideas', 'Creative projects']
      },
      {
        id: 'output_focus',
        question: 'Focus on:',
        type: 'select',
        options: ['Word count & velocity', 'Writing quality', 'Consistency', 'All of the above']
      },
      {
        id: 'goal_wordcount',
        question: 'Daily word count goal:',
        type: 'text',
        placeholder: 'e.g., 500, 1000, no limit'
      }
    ]
  },

  trader: {
    title: 'Trader/Analyst Setup',
    questions: [
      {
        id: 'market_focus',
        question: 'What market do you trade?',
        type: 'select',
        options: ['Stocks', 'Crypto', 'Options', 'Forex', 'Multiple']
      },
      {
        id: 'bias_tracking',
        question: 'Enable bias tracking?',
        type: 'select',
        options: ['Yes - detailed insights', 'Yes - basic tracking', 'No - focus on outcomes']
      },
      {
        id: 'psychology_focus',
        question: 'Focus areas:',
        type: 'select',
        options: ['Emotional discipline', 'Pattern recognition', 'Risk psychology', 'All']
      }
    ]
  },

  team: {
    title: 'Corporate Wellness Setup',
    questions: [
      {
        id: 'user_role',
        question: 'What\'s your role in this initiative?',
        type: 'select',
        options: ['HR Administrator', 'Team Manager', 'Employee/Team Member', 'Executive/Leadership']
      },
      {
        id: 'wellness_goals',
        question: 'What are your primary wellness goals?',
        type: 'select',
        options: ['Employee engagement & retention', 'Mental health support', 'Compliance & reporting', 'Team morale & culture']
      },
      {
        id: 'privacy_commitment',
        question: 'Privacy is critical. We guarantee:',
        type: 'select',
        options: ['Individual entries always private', 'Only anonymized data shared with organization']
      }
    ]
  },

  therapy: {
    title: 'Therapy Setup',
    questions: [
      {
        id: 'user_type',
        question: 'Are you:',
        type: 'select',
        options: ['A therapist', 'A client', 'Both']
      },
      {
        id: 'shared_journals',
        question: 'Shared journal with therapist?',
        type: 'select',
        options: ['Yes - therapist-assigned', 'No - personal only']
      },
      {
        id: 'reflection_depth',
        question: 'Reflection support:',
        type: 'select',
        options: ['Gentle prompts', 'Deeper questions', 'Pattern tracking']
      }
    ]
  }
};

export function ModeOnboarding({ mode, onComplete }: ModeOnboardingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const flow = MODE_FLOWS[mode];

  if (!flow) {
    onComplete({});
    return null;
  }

  const question = flow.questions[currentQuestion];
  const isLast = currentQuestion === flow.questions.length - 1;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [question.id]: answer });

    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-purple-500/30 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">{flow.title}</h2>
        <p className="text-white/60 text-sm">
          Question {currentQuestion + 1} of {flow.questions.length}
        </p>

        <div className="mt-8 space-y-6">
          <h3 className="text-xl text-white">{question.question}</h3>

          {question.type === 'select' ? (
            <div className="space-y-3">
              {question.options.map((option: string) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 px-4 border-white/20 hover:border-purple-500 hover:bg-purple-500/10"
                  data-testid={`option-${option.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <input
              type="text"
              placeholder={question.placeholder}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  handleAnswer(e.currentTarget.value);
                }
              }}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:border-purple-500 focus:outline-none"
              autoFocus
              data-testid="input-answer"
            />
          )}
        </div>

        <div className="mt-8 flex gap-3">
          {currentQuestion > 0 && (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              variant="ghost"
              className="text-white/60"
              data-testid="button-back"
            >
              Back
            </Button>
          )}
          <Button
            onClick={() => handleAnswer('')}
            variant="ghost"
            className="text-white/60 ml-auto"
            data-testid="button-skip"
          >
            Skip
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
