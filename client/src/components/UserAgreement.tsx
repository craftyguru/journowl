import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface UserAgreementProps {
  onAccept: () => void;
  onDecline: () => void;
  isOpen: boolean;
}

export function UserAgreement({ onAccept, onDecline, isOpen }: UserAgreementProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToBottom(true);
    }
  };

  const canAccept = hasScrolledToBottom && agreedToTerms && agreedToPrivacy;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">JournOwl Terms of Service & Privacy Policy</h2>
          <Button
            onClick={onDecline}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1 p-6" onScrollCapture={handleScroll}>
          <div className="space-y-6 text-sm">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Welcome to JournOwl</h3>
              <p className="text-blue-700 dark:text-blue-300">
                By creating an account, you agree to these Terms of Service and our Privacy Policy. 
                Please read them carefully before proceeding.
              </p>
            </div>

            <section>
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="mb-2">
                By using JournOwl ("the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Account Registration</h3>
              <ul className="space-y-2 ml-4">
                <li>• You must register with accurate and complete information</li>
                <li>• Only one account per user is permitted</li>
                <li>• You are responsible for all activity on your account</li>
                <li>• You must keep your login credentials secure and confidential</li>
                <li>• You must be at least 13 years old to create an account</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Permitted Use</h3>
              <ul className="space-y-2 ml-4">
                <li>• JournOwl is for personal, non-commercial use only</li>
                <li>• You may create, edit, and manage your personal journal entries</li>
                <li>• You may use AI features for personal insight and writing assistance</li>
                <li>• You may not copy, distribute, or reverse-engineer any part of our app</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Prohibited Actions</h3>
              <ul className="space-y-2 ml-4">
                <li>• No scraping, copying, or redistributing content or code</li>
                <li>• No unauthorized automation, bots, or third-party apps</li>
                <li>• No using the app for illegal, abusive, or harmful purposes</li>
                <li>• No sharing login credentials or account access</li>
                <li>• No attempts to circumvent security measures or access controls</li>
                <li>• No harassment, spam, or inappropriate content</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Platform Restrictions</h3>
              <p className="mb-2">
                JournOwl may only be used on authorized platforms (our official website, Android/iOS app, PWA). 
                Any attempt to clone, modify, or run JournOwl on unapproved platforms or environments is strictly prohibited.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. AI Services & Data Processing</h3>
              <ul className="space-y-2 ml-4">
                <li>• AI features use your journal content to provide personalized insights</li>
                <li>• Your data is processed securely and never shared with unauthorized parties</li>
                <li>• AI prompts and usage are tracked for billing and service optimization</li>
                <li>• You retain ownership of your journal content and personal data</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Intellectual Property</h3>
              <p className="mb-2">
                All content, code, branding, designs, and features of JournOwl are the exclusive property of JournOwl 
                and may not be used, copied, or distributed without explicit written permission.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Privacy & Data Protection</h3>
              <ul className="space-y-2 ml-4">
                <li>• We collect minimal data necessary for service functionality</li>
                <li>• Your journal entries are encrypted and stored securely</li>
                <li>• We use SendGrid for email communications</li>
                <li>• We use Stripe for secure payment processing</li>
                <li>• We never sell or share your personal data with third parties</li>
                <li>• You can request data deletion at any time</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. Subscription & Billing</h3>
              <ul className="space-y-2 ml-4">
                <li>• Free accounts include basic features and limited AI prompts</li>
                <li>• Premium subscriptions unlock advanced features and unlimited AI access</li>
                <li>• Billing is processed securely through Stripe</li>
                <li>• Subscriptions auto-renew unless cancelled</li>
                <li>• Refunds are handled according to our refund policy</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Account Termination</h3>
              <p className="mb-2">
                We reserve the right to terminate accounts for any violation of these Terms. 
                You may also delete your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">11. Limitation of Liability</h3>
              <p className="mb-2">
                JournOwl is provided "as is" without warranties. We are not responsible for any data loss, 
                service interruptions, or user misconduct. Our liability is limited to the amount you have paid for our services.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">12. Changes to Terms</h3>
              <p className="mb-2">
                We may update these Terms and will notify users via email or app notifications. 
                Continued use of the service constitutes acceptance of updated terms.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">13. Contact Information</h3>
              <p className="mb-2">
                For questions about these Terms or our service, contact us at: <strong>support@journowl.app</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-4">
                Last updated: July 22, 2025
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 border-t space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms-agreement"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                disabled={!hasScrolledToBottom}
              />
              <label 
                htmlFor="terms-agreement" 
                className={`text-sm ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                I have read and agree to the Terms of Service
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy-agreement"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                disabled={!hasScrolledToBottom}
              />
              <label 
                htmlFor="privacy-agreement" 
                className={`text-sm ${!hasScrolledToBottom ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}
              >
                I acknowledge the Privacy Policy and data processing practices
              </label>
            </div>
          </div>

          {!hasScrolledToBottom && (
            <p className="text-xs text-gray-500 italic">
              Please scroll to the bottom to enable the agreement checkboxes
            </p>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onDecline}
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
            <Button
              onClick={onAccept}
              disabled={!canAccept}
              className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}