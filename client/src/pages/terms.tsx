import { motion } from 'framer-motion';
import { Shield, Lock, Heart, AlertTriangle, CreditCard, Gavel, Info, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function TermsOfService() {
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
            JournOwl Terms of Service
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              📋
            </motion.span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Terms and conditions for using JournOwl
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
          <div className="flex gap-3 mb-6">
            <Button asChild variant="outline">
              <Link href="/">← Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl space-y-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Acceptance */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By using JournOwl ("the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          {/* Account Registration */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Lock className="w-6 h-6" />
              2. Account Registration
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>You must register with accurate and complete information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Only one account per user is permitted</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>You are responsible for all activity on your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>You must keep your login credentials secure and confidential</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>You must be at least 13 years old to create an account</span>
              </li>
            </ul>
          </section>

          {/* Permitted Use */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Heart className="w-6 h-6" />
              3. Permitted Use
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>JournOwl is for personal, non-commercial use only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You may create, edit, and manage your personal journal entries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You may use AI features for personal insight and writing assistance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span>You may export your personal data and journal entries</span>
              </li>
            </ul>
          </section>

          {/* Prohibited Actions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              4. Prohibited Actions
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No scraping, copying, or redistributing content or code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No unauthorized automation, bots, or third-party apps</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No using the app for illegal, abusive, or harmful purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No sharing login credentials or account access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No attempts to circumvent security measures or access controls</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No harassment, spam, or inappropriate content</span>
              </li>
            </ul>
          </section>

          {/* Platform Restrictions */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Info className="w-6 h-6" />
              5. Platform Restrictions
            </h2>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <p className="text-amber-800 dark:text-amber-200">
                JournOwl may only be used on authorized platforms (our official website, Android/iOS app, PWA). 
                Any attempt to clone, modify, or run JournOwl on unapproved platforms or environments is strictly prohibited.
              </p>
            </div>
          </section>

          {/* AI Services */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">6. AI Services & Data Processing</h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>AI features use your journal content to provide personalized insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Your data is processed securely and never shared with unauthorized parties</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>AI prompts and usage are tracked for billing and service optimization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>You retain ownership of your journal content and personal data</span>
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">7. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All content, code, branding, designs, and features of JournOwl are the exclusive property of JournOwl 
              and may not be used, copied, or distributed without explicit written permission.
            </p>
          </section>

          {/* Subscription & Billing */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <CreditCard className="w-6 h-6" />
              8. Subscription & Billing
            </h2>
            <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Free accounts include basic features and limited AI prompts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <span>Premium subscriptions unlock advanced features and unlimited AI access</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span>Billing is processed securely through Stripe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500 mt-1">•</span>
                <span>Subscriptions auto-renew unless cancelled</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span>Refunds are handled according to our refund policy</span>
              </li>
            </ul>
          </section>

          {/* Account Termination */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
              <Gavel className="w-6 h-6" />
              9. Account Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to terminate accounts for any violation of these Terms. 
              You may also delete your account at any time through your account settings.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Gavel className="w-6 h-6" />
              10. Limitation of Liability
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              JournOwl is provided "as is" without warranty of any kind. We are not liable for any damages arising 
              from your use of the service, including but not limited to data loss, service interruption, or any 
              other direct or indirect damages.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300">11. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users of significant 
              changes via email or through the service. Continued use of JournOwl after any changes constitutes 
              acceptance of the modified Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Phone className="w-6 h-6" />
              Contact Information
            </h2>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-purple-800 dark:text-purple-200 mb-2">
                Questions about these Terms of Service?
              </p>
              <div className="space-y-1 text-purple-700 dark:text-purple-300">
                <p><strong>Email:</strong> legal@journowl.app</p>
                <p><strong>Support:</strong> support@journowl.app</p>
                <p><strong>Website:</strong> https://journowl.app</p>
              </div>
            </div>
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