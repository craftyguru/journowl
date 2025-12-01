export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              JournOwl ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our journaling platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="mb-2"><strong>Personal Information:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Email address</li>
              <li>Username and password</li>
              <li>Profile information (name, avatar, bio)</li>
              <li>Journal entries and personal content</li>
            </ul>
            
            <p className="mt-4 mb-2"><strong>Automatically Collected Information:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage analytics and patterns</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our service</li>
              <li>To process your account registration and manage your account</li>
              <li>To provide customer support</li>
              <li>To improve and optimize our service</li>
              <li>To detect and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your password is encrypted, and sensitive data is transmitted using SSL/TLS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">5. Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">7. Third-Party Integrations</h2>
            <p>
              We may integrate with third-party services (e.g., email providers, payment processors, OAuth providers). These services have their own privacy policies. We recommend reviewing them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services or fulfill the purposes outlined in this policy. You can request deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at support@journowl.app
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-400">Last Updated: December 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
