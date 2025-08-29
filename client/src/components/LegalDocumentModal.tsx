import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, FileText, Lock } from 'lucide-react';

interface LegalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  documentType: 'terms' | 'privacy';
}

export function LegalDocumentModal({ isOpen, onClose, onAgree, documentType }: LegalDocumentModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollThreshold = scrollHeight - clientHeight - 20;
    if (scrollTop >= scrollThreshold) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAgree = () => {
    onAgree();
    onClose();
  };

  const documentConfig = {
    terms: {
      title: 'Terms of Service',
      icon: <FileText className="w-6 h-6" />,
      color: 'blue',
      emoji: '📋'
    },
    privacy: {
      title: 'Privacy Policy', 
      icon: <Lock className="w-6 h-6" />,
      color: 'purple',
      emoji: '🔒'
    }
  };

  const config = documentConfig[documentType];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b bg-${config.color}-50 dark:bg-${config.color}-900/20`}>
              <div className="flex items-center gap-3">
                {config.icon}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {config.emoji} {config.title}
                </h2>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div 
              className="flex-1 overflow-y-auto p-6 max-h-[60vh]" 
              onScroll={handleScroll}
            >
              {documentType === 'terms' ? (
                <TermsContent />
              ) : (
                <PrivacyContent />
              )}
              
              {/* End marker */}
              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border-2 border-green-300 dark:border-green-700">
                <h3 className="text-lg font-bold text-green-700 dark:text-green-300">
                  🎉 You've reached the end!
                </h3>
                <p className="text-green-600 dark:text-green-400 text-sm">
                  You can now agree to this document.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
              {!hasScrolledToBottom && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    📜 Please scroll to the bottom to read the complete document.
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 justify-end">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button 
                  onClick={handleAgree}
                  disabled={!hasScrolledToBottom}
                  className={`bg-${config.color}-600 hover:bg-${config.color}-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {hasScrolledToBottom ? `✅ I Agree to ${config.title}` : '📜 Scroll to Bottom First'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TermsContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">1. Acceptance of Terms</h3>
        <p>By creating an account and using JournOwl, you agree to these Terms of Service and our Privacy Policy.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">2. Description of Service</h3>
        <p>JournOwl is a digital journaling platform that provides AI-powered insights, writing prompts, and analytics to enhance your journaling experience.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">3. User Accounts</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>You must be at least 13 years old to create an account</li>
          <li>You are responsible for maintaining account security</li>
          <li>One account per person</li>
          <li>Provide accurate registration information</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">4. Acceptable Use</h3>
        <p>You may use JournOwl for personal journaling and self-reflection. Prohibited activities include:</p>
        <ul className="list-disc ml-6 space-y-2 mt-2">
          <li>Sharing accounts or login credentials</li>
          <li>Using automated tools or bots</li>
          <li>Attempting to reverse engineer the platform</li>
          <li>Using the service for illegal activities</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">5. Privacy and Data</h3>
        <p>Your journal entries are private and encrypted. We use AI to provide insights but never share your personal data with third parties.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">6. Subscription and Billing</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Free accounts include basic features</li>
          <li>Premium subscriptions unlock advanced AI features</li>
          <li>Billing is processed securely through Stripe</li>
          <li>Subscriptions auto-renew unless cancelled</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">7. Termination</h3>
        <p>Either party may terminate the agreement at any time. You can delete your account through settings.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">8. Limitation of Liability</h3>
        <p>JournOwl is provided "as is" without warranties. Our liability is limited to the amount you have paid for our services.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">9. Contact Information</h3>
        <p>For questions about these Terms, contact us at: <strong>support@journowl.app</strong></p>
        <p className="text-sm text-gray-500 mt-4">Last updated: July 22, 2025</p>
      </section>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="space-y-6 text-gray-700 dark:text-gray-300">
      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">1. Information We Collect</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Account information (email, username)</li>
          <li>Journal entries and uploaded media</li>
          <li>Usage analytics and preferences</li>
          <li>Payment information (processed by Stripe)</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">2. How We Use Your Information</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide journaling and AI features</li>
          <li>Send service-related communications</li>
          <li>Improve our platform and user experience</li>
          <li>Process payments and subscriptions</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">3. Data Security</h3>
        <p>Your journal entries are encrypted and stored securely. We use industry-standard security measures to protect your data.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">4. Third-Party Services</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>OpenAI for AI features (content processing only)</li>
          <li>SendGrid for email delivery</li>
          <li>Stripe for payment processing</li>
          <li>Supabase for secure data storage</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">5. Data Sharing</h3>
        <p>We never sell or share your personal data with third parties for marketing purposes. Data is only shared as necessary to provide our services.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">6. Your Rights</h3>
        <ul className="list-disc ml-6 space-y-2">
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and data</li>
          <li>Export your journal entries</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">7. Cookies and Tracking</h3>
        <p>We use essential cookies for authentication and preferences. No third-party tracking cookies are used.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">8. Changes to Privacy Policy</h3>
        <p>We'll notify you of any changes to this Privacy Policy via email or app notification.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">9. Contact Us</h3>
        <p>For privacy-related questions, contact us at: <strong>privacy@journowl.app</strong></p>
        <p className="text-sm text-gray-500 mt-4">Last updated: July 22, 2025</p>
      </section>
    </div>
  );
}