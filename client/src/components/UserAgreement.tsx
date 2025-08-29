import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Shield, Lock, Heart, Sparkles, ExternalLink, FileText } from 'lucide-react';

interface UserAgreementProps {
  onAccept: () => void;
  onDecline: () => void;
  isOpen: boolean;
}

export function UserAgreement({ onAccept, onDecline, isOpen }: UserAgreementProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [showTermsIframe, setShowTermsIframe] = useState(false);
  const [showPrivacyIframe, setShowPrivacyIframe] = useState(false);
  const [termsScrolledToBottom, setTermsScrolledToBottom] = useState(false);
  const [privacyScrolledToBottom, setPrivacyScrolledToBottom] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollThreshold = scrollHeight - clientHeight - 10; // Very strict scroll requirement
    if (scrollTop >= scrollThreshold) {
      setHasScrolledToBottom(true);
    }
  };

  const canAccept = agreedToTerms && agreedToPrivacy && termsScrolledToBottom && privacyScrolledToBottom;

  const handleIframeScroll = (type: 'terms' | 'privacy') => (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollThreshold = scrollHeight - clientHeight - 10;
    if (scrollTop >= scrollThreshold) {
      if (type === 'terms') {
        setTermsScrolledToBottom(true);
      } else {
        setPrivacyScrolledToBottom(true);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-purple-200 dark:border-purple-700"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, type: "spring", damping: 20 }}
          >
            {/* Animated header with floating emojis */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      x: [0, Math.random() * 20 - 10, 0],
                      rotate: [0, Math.random() * 20 - 10, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  >
                    {['🦉', '📝', '✨', '🌟', '🎨', '💫'][Math.floor(Math.random() * 6)]}
                  </motion.div>
                ))}
              </div>
              
              <div className="relative flex items-center justify-between p-6 border-b border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-800 dark:to-blue-800">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent flex items-center gap-3">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🦉
                    </motion.span>
                    JournOwl Terms & Privacy
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                  </h2>
                  <p className="text-purple-600 dark:text-purple-300 mt-1 font-medium">
                    📋 Let's keep your journey safe & secure! 🔒
                  </p>
                </motion.div>
                <motion.button
                  onClick={onDecline}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
        
            <div className="flex-1 overflow-y-auto p-6 max-h-[60vh]" onScroll={handleScroll}>
              <div className="space-y-6 text-sm">
                <motion.div 
                  className="bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-pink-900/30 p-6 rounded-xl border-2 border-dashed border-purple-300 dark:border-purple-600 relative overflow-hidden"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="absolute top-2 right-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="text-2xl"
                    >
                      🌟
                    </motion.span>
                  </div>
                  <h3 className="font-bold text-xl text-purple-800 dark:text-purple-200 mb-3 flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎉
                    </motion.span>
                    Welcome to JournOwl Family!
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      🦉
                    </motion.span>
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 leading-relaxed">
                    🌈 You're about to join thousands of amazing journalers! By creating your account, you're agreeing to our 
                    friendly <a href="/terms" target="_blank" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold">Terms of Service</a> and <a href="/privacy-policy" target="_blank" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-semibold">Privacy Policy</a>. 
                    📖 Please read them carefully before accepting! ⏰
                  </p>
                </motion.div>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Shield className="w-5 h-5" />
                    📖 Read Our Full Legal Documents
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setShowTermsIframe(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <FileText className="w-4 h-4" />
                        📋 Read Terms of Service
                        <span className="text-xs opacity-75">(opens in popup)</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => setShowPrivacyIframe(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <Lock className="w-4 h-4" />
                        🔒 Read Privacy Policy
                        <span className="text-xs opacity-75">(opens in popup)</span>
                      </Button>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                      ✨ Please read both documents completely and scroll to the bottom before you can agree to them.
                    </p>
                  </div>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Heart className="w-5 h-5" />
                    ✨ Key Points Summary
                  </h3>
                  <ul className="space-y-2 text-green-700 dark:text-green-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">🔸</span>
                      <span>JournOwl is for personal journaling and self-reflection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">🔸</span>
                      <span>Your journal entries are private and encrypted</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">🔸</span>
                      <span>AI features help with insights and writing prompts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">🔸</span>
                      <span>We never sell or share your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">🔸</span>
                      <span>Must be 13+ years old to create an account</span>
                    </li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Heart className="w-5 h-5" />
                    3. Permitted Use ✅
                  </h3>
                  <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>💚 JournOwl is for personal, non-commercial use only</li>
                    <li>💚 You may create, edit, and manage your personal journal entries</li>
                    <li>💚 You may use AI features for personal insight and writing assistance</li>
                    <li>💚 You may not copy, distribute, or reverse-engineer any part of our app</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-600 dark:text-red-400">
                    <X className="w-5 h-5" />
                    4. Prohibited Actions ❌
                  </h3>
                  <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>🚫 No scraping, copying, or redistributing content or code</li>
                    <li>🚫 No unauthorized automation, bots, or third-party apps</li>
                    <li>🚫 No using the app for illegal, abusive, or harmful purposes</li>
                    <li>🚫 No sharing login credentials or account access</li>
                    <li>🚫 No attempts to circumvent security measures or access controls</li>
                    <li>🚫 No harassment, spam, or inappropriate content</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Sparkles className="w-5 h-5" />
                    5. Platform Restrictions 🖥️
                  </h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    🔗 JournOwl may only be used on authorized platforms (our official website, Android/iOS app, PWA). 
                    Any attempt to clone, modify, or run JournOwl on unapproved platforms or environments is strictly prohibited.
                  </p>
                </motion.section>

                {/* Continue with remaining sections... */}
                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">6. AI Services & Data Processing 🤖</h3>
                  <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>🤖 AI features use your journal content to provide personalized insights</li>
                    <li>🔒 Your data is processed securely and never shared with unauthorized parties</li>
                    <li>📊 AI prompts and usage are tracked for billing and service optimization</li>
                    <li>👑 You retain ownership of your journal content and personal data</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">7. Intellectual Property 🎨</h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    🎨 All content, code, branding, designs, and features of JournOwl are the exclusive property of JournOwl 
                    and may not be used, copied, or distributed without explicit written permission.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">8. Privacy & Data Protection 🛡️</h3>
                  <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>📧 We collect minimal data necessary for service functionality</li>
                    <li>🔐 Your journal entries are encrypted and stored securely</li>
                    <li>📨 We use SendGrid for email communications</li>
                    <li>💳 We use Stripe for secure payment processing</li>
                    <li>🚫 We never sell or share your personal data with third parties</li>
                    <li>🗑️ You can request data deletion at any time</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">9. Subscription & Billing 💳</h3>
                  <ul className="space-y-2 ml-4 text-gray-700 dark:text-gray-300">
                    <li>🆓 Free accounts include basic features and limited AI prompts</li>
                    <li>⭐ Premium subscriptions unlock advanced features and unlimited AI access</li>
                    <li>🔒 Billing is processed securely through Stripe</li>
                    <li>🔄 Subscriptions auto-renew unless cancelled</li>
                    <li>💰 Refunds are handled according to our refund policy</li>
                  </ul>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-red-600 dark:text-red-400">10. Account Termination ⚠️</h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    ⚖️ We reserve the right to terminate accounts for any violation of these Terms. 
                    You may also delete your account at any time through your account settings.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">11. Limitation of Liability ⚖️</h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    📋 JournOwl is provided "as is" without warranties. We are not responsible for any data loss, 
                    service interruptions, or user misconduct. Our liability is limited to the amount you have paid for our services.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">12. Changes to Terms 📝</h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    📢 We may update these Terms and will notify users via email or app notifications. 
                    Continued use of the service constitutes acceptance of updated terms.
                  </p>
                </motion.section>

                <motion.section
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700"
                >
                  <h3 className="text-lg font-semibold mb-3 text-green-700 dark:text-green-300">13. Contact Information 📧</h3>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    📬 For questions about these Terms or our service, contact us at: <strong className="text-purple-600 dark:text-purple-400">support@journowl.app</strong>
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                    📅 Last updated: July 22, 2025
                  </p>
                </motion.section>

                {/* Clear "End of Document" indicator */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.7 }}
                  className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-lg p-4 text-center"
                >
                  <h3 className="text-lg font-bold text-green-700 dark:text-green-300 mb-2">
                    🎉 You've reached the end!
                  </h3>
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    ✅ You can now scroll up to check the agreement boxes and create your account.
                  </p>
                </motion.div>
              </div>
            </div>

            <motion.div 
              className="p-6 border-t border-purple-200 dark:border-purple-700 space-y-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {!hasScrolledToBottom && (
                <motion.div 
                  className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-3"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-2">
                    📜 <strong>Please scroll to the bottom</strong> to read all terms before you can agree to them.
                  </p>
                </motion.div>
              )}

              <div className="space-y-3">
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <Checkbox
                    id="terms-agreement"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    disabled={!hasScrolledToBottom || !termsScrolledToBottom}
                    className={`border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 ${(hasScrolledToBottom && termsScrolledToBottom) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  />
                  <label 
                    htmlFor="terms-agreement" 
                    className={`text-sm text-gray-700 dark:text-gray-300 ${(hasScrolledToBottom && termsScrolledToBottom) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    ✅ I have read and agree to the Terms of Service 
                    {termsScrolledToBottom ? ' ✓' : ' (📋 Open and read first)'}
                  </label>
                </motion.div>
                
                <motion.div 
                  className="flex items-center space-x-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <Checkbox
                    id="privacy-agreement"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                    disabled={!hasScrolledToBottom || !privacyScrolledToBottom}
                    className={`border-purple-400 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500 ${(hasScrolledToBottom && privacyScrolledToBottom) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  />
                  <label 
                    htmlFor="privacy-agreement" 
                    className={`text-sm text-gray-700 dark:text-gray-300 ${(hasScrolledToBottom && privacyScrolledToBottom) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                  >
                    🛡️ I acknowledge the Privacy Policy and data processing practices
                    {privacyScrolledToBottom ? ' ✓' : ' (🔒 Open and read first)'}
                  </label>
                </motion.div>
              </div>

              {!agreedToTerms || !agreedToPrivacy ? (
                <motion.p 
                  className="text-xs text-purple-600 dark:text-purple-400 italic bg-purple-50 dark:bg-purple-900/20 p-2 rounded border border-purple-200 dark:border-purple-700"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ✅ Please check both agreement boxes above to continue
                </motion.p>
              ) : null}

              <div className="flex gap-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1"
                >
                  <Button
                    onClick={onDecline}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    ❌ Decline
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: canAccept ? 1.02 : 1 }}
                  whileTap={{ scale: canAccept ? 0.98 : 1 }}
                  className="flex-1"
                >
                  <Button
                    onClick={onAccept}
                    disabled={!canAccept}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white disabled:from-gray-400 disabled:to-gray-400 shadow-lg disabled:shadow-none"
                  >
                    {canAccept ? '🎉 Accept & Continue' : '⏳ Complete Steps Above'}
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Terms of Service Iframe Modal */}
      {showTermsIframe && (
        <motion.div 
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-600" />
                Terms of Service
              </h2>
              <Button
                onClick={() => setShowTermsIframe(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {!termsScrolledToBottom && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-700 p-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
                    📜 Please scroll to the bottom to fully read the Terms of Service
                  </p>
                </div>
              )}
              <div 
                className="h-full overflow-y-auto p-6" 
                onScroll={handleIframeScroll('terms')}
              >
                <iframe
                  src="/terms"
                  className="w-full h-[600px] border border-gray-300 dark:border-gray-600 rounded-lg"
                  title="Terms of Service"
                />
                {termsScrolledToBottom && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-center">
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      ✅ You have read the complete Terms of Service
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setShowTermsIframe(false)}
                className="w-full"
                disabled={!termsScrolledToBottom}
              >
                {termsScrolledToBottom ? "Close Terms" : "Scroll to bottom to continue"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Privacy Policy Iframe Modal */}
      {showPrivacyIframe && (
        <motion.div 
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 dark:border-gray-700"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Lock className="w-6 h-6 text-purple-600" />
                Privacy Policy
              </h2>
              <Button
                onClick={() => setShowPrivacyIframe(false)}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {!privacyScrolledToBottom && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-700 p-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
                    📜 Please scroll to the bottom to fully read the Privacy Policy
                  </p>
                </div>
              )}
              <div 
                className="h-full overflow-y-auto p-6" 
                onScroll={handleIframeScroll('privacy')}
              >
                <iframe
                  src="/privacy-policy"
                  className="w-full h-[600px] border border-gray-300 dark:border-gray-600 rounded-lg"
                  title="Privacy Policy"
                />
                {privacyScrolledToBottom && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg text-center">
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      ✅ You have read the complete Privacy Policy
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setShowPrivacyIframe(false)}
                className="w-full"
                disabled={!privacyScrolledToBottom}
              >
                {privacyScrolledToBottom ? "Close Privacy Policy" : "Scroll to bottom to continue"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}