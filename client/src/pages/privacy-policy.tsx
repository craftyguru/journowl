import { motion } from 'framer-motion';
import { Shield, Lock, Heart, Database, Mail, CreditCard, Eye, Trash2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function PrivacyPolicy() {
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
            JournOwl Privacy Policy
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🔒
            </motion.span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            How we protect and handle your personal information
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last updated: July 22, 2025
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button asChild variant="outline" className="mb-6">
            <Link href="/">← Back to Home</Link>
          </Button>
        </motion.div>

        {/* Content */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl space-y-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Introduction */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Introduction
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At JournOwl, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, 
              and handle your personal information when you use our AI-powered journaling platform.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Database className="w-6 h-6" />
              Information We Collect
            </h2>
            <div className="space-y-3 ml-4">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Account Information</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                  <li>Email address and username</li>
                  <li>Password (encrypted and hashed)</li>
                  <li>Profile information (first name, last name, profile picture)</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Journal Content</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                  <li>Journal entries and writing content</li>
                  <li>Photos and uploaded media</li>
                  <li>Mood tracking data</li>
                  <li>Tags and metadata</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Usage Data</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 ml-4 space-y-1">
                  <li>AI prompt usage and interactions</li>
                  <li>Feature usage statistics</li>
                  <li>Login and session information</li>
                  <li>Device and browser information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              How We Use Your Information
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Provide Services:</strong> Process and store your journal entries, provide AI insights and prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Personalization:</strong> Generate personalized content and recommendations based on your writing patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Communication:</strong> Send welcome emails, verification messages, and important account updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Analytics:</strong> Track usage patterns to improve our service and user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Security:</strong> Protect against fraud, abuse, and unauthorized access</span>
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              Data Security & Encryption
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>End-to-End Encryption:</strong> Your journal entries are encrypted both in transit and at rest</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Secure Infrastructure:</strong> Hosted on enterprise-grade servers with advanced security measures</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Password Protection:</strong> Passwords are hashed using bcrypt with strong salt rounds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span><strong>Regular Audits:</strong> We regularly review and update our security practices</span>
              </li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Eye className="w-6 h-6" />
              Third-Party Services
            </h2>
            <div className="space-y-3 ml-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">SendGrid (Email Services)</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    We use SendGrid to send welcome emails, verification messages, and important account notifications. 
                    Only your email address and name are shared with SendGrid for delivery purposes.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Stripe (Payment Processing)</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    For Pro subscriptions and AI prompt purchases, we use Stripe for secure payment processing. 
                    We do not store credit card information on our servers.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">Supabase (Database Hosting)</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Your data is securely stored in Supabase's PostgreSQL database with enterprise-grade security and encryption.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Data Sharing Policy
            </h2>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 font-semibold mb-2">
                🚫 We NEVER sell or share your personal data
              </p>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Your journal entries, personal information, and usage data are never sold, shared, or provided to third parties 
                for marketing or commercial purposes. Your privacy is paramount to us.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Your Privacy Rights
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Access:</strong> Request a copy of all personal data we have about you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Correction:</strong> Update or correct any inaccurate personal information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Deletion:</strong> Request complete deletion of your account and all associated data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Portability:</strong> Export your journal entries and data in a readable format</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time</span>
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Trash2 className="w-6 h-6" />
              Data Retention
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We retain your personal data only for as long as necessary to provide our services and comply with legal obligations. 
              When you delete your account, we will permanently delete your journal entries, personal information, and associated 
              data within 30 days, except where required by law to retain certain information.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Contact Us
            </h2>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-purple-800 dark:text-purple-200 mb-2">
                Have questions about this Privacy Policy or your data?
              </p>
              <div className="space-y-1 text-purple-700 dark:text-purple-300">
                <p><strong>Email:</strong> privacy@journowl.app</p>
                <p><strong>Support:</strong> support@journowl.app</p>
                <p><strong>Website:</strong> https://journowl.app</p>
              </div>
            </div>
          </section>

          {/* Updates */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">Policy Updates</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. When we do, we will notify you via email and update 
              the "Last updated" date at the top of this page. Continued use of JournOwl after any changes constitutes 
              acceptance of the updated Privacy Policy.
            </p>
          </section>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-gray-500 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>© 2025 JournOwl. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}