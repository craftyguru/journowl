import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Users, Shield, CreditCard, AlertTriangle, Gavel, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const [currentSection, setCurrentSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'accounts', title: 'Account Registration', icon: Users },
    { id: 'usage', title: 'Permitted Use', icon: Shield },
    { id: 'restrictions', title: 'Prohibited Actions', icon: AlertTriangle },
    { id: 'billing', title: 'Billing & Payments', icon: CreditCard },
    { id: 'termination', title: 'Account Termination', icon: Gavel },
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
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                Terms of Service
              </h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Welcome to JournOwl! These Terms of Service govern your use of our AI-powered journaling platform. By using JournOwl, you agree to these terms and our commitment to helping you capture and understand your personal journey.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 to-teal-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Agreement Highlights:</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>✅ You retain ownership of your journal content</li>
                <li>✅ We provide AI-powered journaling tools and insights</li>
                <li>✅ You're responsible for maintaining account security</li>
                <li>✅ Subscription terms are clearly defined</li>
              </ul>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p><strong>Effective Date:</strong> July 26, 2025</p>
              <p><strong>Last Updated:</strong> July 26, 2025</p>
            </div>
          </div>
        );
      case 'accounts':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Account Registration</h2>
            <div className="space-y-3">
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">✅ Account Creation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You must provide accurate, current information when creating your account. You're responsible for maintaining the security of your account credentials.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">📧 Email Verification</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Account verification via email is required to access full features. You must use a valid email address that you control.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">🔒 Account Security</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You're responsible for all activities under your account. Use strong passwords and notify us immediately of any unauthorized access.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'usage':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Permitted Use</h2>
            <div className="grid gap-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="text-blue-500">📝</span>
                <div>
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300">Personal Journaling</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use JournOwl for personal reflection, memory keeping, and self-improvement</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-500">🤖</span>
                <div>
                  <h3 className="font-semibold text-green-700 dark:text-green-300">AI Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Access AI prompts, insights, and analytics within your subscription limits</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-purple-500">📊</span>
                <div>
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300">Data Export</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Export your journal entries and personal data at any time</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <span className="text-orange-500">🔗</span>
                <div>
                  <h3 className="font-semibold text-orange-700 dark:text-orange-300">Sharing Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Share selected content using our built-in sharing tools (you control what's shared)</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'restrictions':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Prohibited Actions</h2>
            <div className="space-y-3">
              <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-red-700 dark:text-red-300 mb-2">🚫 Platform Misuse</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Don't attempt to reverse engineer or copy our AI algorithms</li>
                    <li>• Don't create multiple accounts to bypass subscription limits</li>
                    <li>• Don't share account credentials with others</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ Content Restrictions</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Don't upload illegal, harmful, or abusive content</li>
                    <li>• Don't violate others' intellectual property rights</li>
                    <li>• Don't use the platform for commercial data collection</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">🔧 Technical Restrictions</h3>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Don't attempt to hack, disrupt, or overload our servers</li>
                    <li>• Don't use automated tools to access the platform</li>
                    <li>• Don't interfere with other users' accounts or data</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'billing':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Billing & Payments</h2>
            <div className="space-y-3">
              <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 to-purple-900/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-indigo-700 dark:text-indigo-300 mb-2">💳 Subscription Plans</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Free Tier:</strong> Basic journaling with limited AI prompts</p>
                    <p><strong>Pro ($9.99/month):</strong> Unlimited AI prompts and advanced analytics</p>
                    <p><strong>Power ($19.99/month):</strong> All features plus priority support</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 to-teal-900/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">🔄 Billing Cycle</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Subscriptions renew automatically each month</p>
                    <p>• Additional AI prompts: $2.99 for 100 prompts</p>
                    <p>• Cancel anytime - no long-term commitments</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 to-cyan-900/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">💰 Refund Policy</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Refunds are available within 7 days of purchase for subscription issues. AI prompt purchases are non-refundable once used.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'termination':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-400">Account Termination</h2>
            <div className="grid gap-3">
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 to-cyan-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-700 dark:text-teal-300 mb-2">✅ Voluntary Cancellation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can cancel your account at any time. Your data will be available for 30 days after cancellation for export.
                </p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 to-red-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">⚠️ Account Suspension</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We may suspend accounts that violate these terms. You'll receive notice and opportunity to address violations when possible.
                </p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 to-pink-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">📁 Data Retention</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  After account deletion, your data is permanently removed within 30 days. Make sure to export any content you want to keep.
                </p>
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
                  📞
                </motion.div>
                <div>
                  <h3 className="font-semibold text-pink-700 dark:text-pink-300 mb-2">Questions About Terms?</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Contact our legal team for questions about these terms of service
                  </p>
                  <div className="space-y-3">
                    <a 
                      href="mailto:legal@journowl.app" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                    >
                      <Mail className="w-4 h-4" />
                      legal@journowl.app
                    </a>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <p>For general support: support@journowl.app</p>
                    </div>
                  </div>
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
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white">
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  🦉
                </motion.span>
                <h1 className="text-2xl font-bold">Terms of Service</h1>
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
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
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