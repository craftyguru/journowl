export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Data Deletion Instructions
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Request Account Deletion</h2>
            <p className="mb-4">
              At JournOwl, we respect your privacy and comply with all data protection regulations including GDPR and CCPA. You have the right to request deletion of your account and all associated data.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-2">How to Request Deletion:</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Log in to your JournOwl account</li>
              <li>Go to Settings → Account → Delete Account</li>
              <li>Confirm your identity by entering your password</li>
              <li>Review the information that will be deleted</li>
              <li>Click "Request Deletion" to submit your request</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">What Gets Deleted</h2>
            <p className="mb-2">When you request account deletion, we will delete:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your user account and profile information</li>
              <li>All journal entries and personal content</li>
              <li>Your statistics and achievements</li>
              <li>All associated metadata and preferences</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Deletion Timeline</h2>
            <p>
              We process deletion requests within <strong>30 days</strong> of submission. During this period, you can cancel the deletion request. After 30 days, your data will be permanently deleted from our servers and cannot be recovered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">What We Retain</h2>
            <p className="mb-2">For legal and regulatory compliance, we may retain:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Billing and payment records (as required by law)</li>
              <li>Audit logs (for security purposes)</li>
              <li>Anonymized usage data for analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
            <p>
              If you have questions about data deletion or need assistance, please contact our support team at:
            </p>
            <p className="mt-2 font-semibold">support@journowl.app</p>
          </section>

          <section className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-white mb-2">🔐 Privacy Protection</h3>
            <p>
              All deletion requests are processed securely and with your privacy as our top priority. We do not share your information with third parties during the deletion process.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
