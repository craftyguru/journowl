import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Lock, Eye, Database, Mail, Globe, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  const [currentSection, setCurrentSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: Shield },
    { id: 'collection', title: 'Data Collection', icon: Database },
    { id: 'usage', title: 'How We Use Data', icon: Eye },
    { id: 'security', title: 'Security', icon: Lock },
    { id: 'third-party', title: 'Third-Party Services', icon: Globe },
    { id: 'rights', title: 'Your Rights', icon: FileText },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  const renderContent = () => {
    switch (currentSection) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                🦉
              </motion.div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Privacy Overview
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At JournOwl, your privacy is our top priority. We understand that your journal entries contain your most personal thoughts and memories. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 to-pink-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Key Principles:</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✅ Your journal entries are encrypted and private</li>
                <li>✅ We never sell your personal data</li>
                <li>✅ You control your data and can export it anytime</li>
                <li>✅ We use industry-standard security measures</li>
              </ul>
            </div>
          </div>
        );
      case 'collection':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">What We Collect</h2>
            <div className="space-y-3">
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-300">Account Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email, username, profile picture, and account preferences</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">Journal Content</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your journal entries, photos, mood data, and writing analytics</p>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-300">Usage Data</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">App usage patterns, feature interactions, and performance metrics</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'usage':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">How We Use Your Data</h2>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-500">🎯</span>
                <div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">Personalization</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generate AI prompts tailored to your writing style and preferences</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-500">📊</span>
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-300">Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Provide insights about your writing patterns and mood trends</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-purple-500">🛠️</span>
                <div>
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300">Service Improvement</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Enhance app features and fix issues to improve your experience</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Security Measures</h2>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 to-orange-900/20 p-6 rounded-lg">
              <div className="grid gap-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-300">End-to-End Encryption</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your journal entries are encrypted before being stored</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-500" />
                  <div>
                    <h3 className="font-semibold text-orange-700 dark:text-orange-300">Secure Infrastructure</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hosted on secure cloud platforms with SSL certificates</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-pink-500" />
                  <div>
                    <h3 className="font-semibold text-pink-700 dark:text-pink-300">Access Controls</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Strict access controls and regular security audits</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'third-party':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Third-Party Services</h2>
            <div className="space-y-3">
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 to-purple-900/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">SendGrid (Email Service)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Used for sending welcome emails and account verification. We only share your email address.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 to-teal-900/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">Stripe (Payment Processing)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Handles subscription payments securely. We don't store your payment details.</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 to-cyan-900/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Supabase (Database)</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Secure database hosting with encryption and backup services.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'rights':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Your Privacy Rights</h2>
            <div className="grid gap-3">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 to-cyan-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">✅ Access Your Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download all your journal entries and personal data anytime</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 to-indigo-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">✅ Correct Your Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Update or correct any information in your account settings</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 to-pink-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">✅ Delete Your Data</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all associated data</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 to-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">✅ Control Marketing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Opt out of marketing emails while keeping account notifications</p>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">Contact Information</h2>
            <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 dark:from-pink-900/20 via-purple-900/20 to-indigo-900/20 p-6 rounded-lg">
              <div className="text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl"
                >
                  📧
                </motion.div>
                <div>
                  <h3 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Privacy Questions?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Contact our privacy team for any questions about your data</p>
                  <a 
                    href="mailto:privacy@journowl.app" 
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                  >
                    <Mail className="w-4 h-4" />
                    privacy@journowl.app
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Last updated: July 26, 2025</p>
              <p>Effective date: July 26, 2025</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed top-4 left-4 right-4 bottom-4 md:top-8 md:left-8 md:right-8 md:bottom-8 lg:top-16 lg:left-1/2 lg:right-auto lg:bottom-16 lg:transform lg:-translate-x-1/2 lg:w-5/6 lg:max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white">
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🦉
                </motion.span>
                <h1 className="text-2xl font-bold">Privacy Policy</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-full md:w-64 bg-gray-50 dark:bg-gray-800 p-4 overflow-y-auto border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
                <nav className="space-y-2 grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-0">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setCurrentSection(section.id)}
                        className={`w-full flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 text-left rounded-lg transition-all duration-200 ${
                          currentSection === section.id
                            ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="text-xs md:text-sm font-medium truncate">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderContent()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}