import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Shield, Zap, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'features' | 'privacy' | 'technical';
  icon: any;
}

const faqData: FAQItem[] = [
  {
    question: "What is JournOwl and how does it work?",
    answer: "JournOwl is an AI-powered journaling platform that helps you capture thoughts, analyze emotions, and unlock insights from your daily experiences. It combines traditional journaling with advanced AI analysis to provide personalized writing prompts, mood tracking, and meaningful insights about your personal growth journey.",
    category: 'general',
    icon: BookOpen
  },
  {
    question: "Is my journal data private and secure?",
    answer: "Absolutely! Your privacy is our top priority. All journal entries are encrypted and securely stored. We never share your personal content with third parties. You have full control over your data and can export or delete it anytime. Our servers use industry-standard security measures including SSL encryption and secure database protocols.",
    category: 'privacy',
    icon: Shield
  },
  {
    question: "How does the AI writing assistant work?",
    answer: "Our AI analyzes your writing patterns, mood, and preferences to generate personalized journal prompts and insights. It can analyze uploaded photos to suggest writing topics, track emotional patterns over time, and provide meaningful feedback about your personal growth. The AI learns from your journaling style to become more helpful over time.",
    category: 'features',
    icon: Zap
  },
  {
    question: "Can I use JournOwl on my mobile device?",
    answer: "Yes! JournOwl is a Progressive Web App (PWA) that works seamlessly on all devices. You can install it on your phone like a native app for offline writing, quick access, and push notifications. It synchronizes across all your devices so you can write anywhere, anytime.",
    category: 'technical',
    icon: Globe
  },
  {
    question: "What happens to my data if I delete my account?",
    answer: "If you choose to delete your account, all your personal data including journal entries, photos, and analytics will be permanently removed from our servers within 30 days. We provide export options so you can download your data before deletion. This process is irreversible and ensures complete data removal.",
    category: 'privacy',
    icon: Shield
  },
  {
    question: "How do achievements and XP work?",
    answer: "JournOwl gamifies your journaling experience with XP points, achievements, and streaks. You earn XP for writing entries, maintaining daily streaks, and reaching milestones. Achievements unlock as you progress, celebrating everything from your first entry to writing 50,000 words. This system encourages consistent journaling habits.",
    category: 'features',
    icon: Zap
  },
  {
    question: "Can I export my journal entries?",
    answer: "Yes! You can export your journal entries in multiple formats including PDF, plain text, and JSON. The export includes all your content, photos, mood data, and analytics. This ensures you always have access to your memories and can migrate to other platforms if needed.",
    category: 'general',
    icon: BookOpen
  },
  {
    question: "Is JournOwl free to use?",
    answer: "JournOwl offers a generous free tier with essential journaling features, basic AI prompts, and core analytics. Premium features include unlimited AI prompts, advanced analytics, priority support, and enhanced export options. We believe everyone should have access to the mental health benefits of journaling.",
    category: 'general',
    icon: BookOpen
  }
];

const categories = [
  { id: 'general', name: 'General', icon: HelpCircle },
  { id: 'features', name: 'Features', icon: Zap },
  { id: 'privacy', name: 'Privacy', icon: Shield },
  { id: 'technical', name: 'Technical', icon: Globe }
];

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const filteredFAQs = faqData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center justify-center gap-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🦉
            </motion.span>
            Frequently Asked Questions
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ❓
            </motion.span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about JournOwl
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {filteredFAQs.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openItems.has(index);
            
            return (
              <Card
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300"
              >
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleItem(index)}
                >
                  <CardTitle className="flex items-center justify-between text-left">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-gray-800 dark:text-gray-200">{item.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    )}
                  </CardTitle>
                </CardHeader>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardContent className="pt-0">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {item.answer}
                        </p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </motion.div>

        {/* Contact Support */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-700/50">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our support team is here to help you get the most out of JournOwl
              </p>
              <a
                href="mailto:support@journowl.app"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}