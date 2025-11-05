export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">Home</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Privacy Policy</span>
        </nav>

        {/* Page header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              When you contact us through our contact form, we collect the following information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Project type information</li>
              <li>Your message content</li>
              <li>Your consent preferences for privacy and marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>To respond to your inquiries and provide customer support</li>
              <li>To communicate with you about your project requirements</li>
              <li>To send you updates about our services (only if you have consented)</li>
              <li>To improve our services and website functionality</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-gray-700 mb-4">
              Under GDPR, we process your personal data based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Consent:</strong> When you provide explicit consent for marketing communications</li>
              <li><strong>Legitimate Interest:</strong> To respond to your inquiries and provide requested services</li>
              <li><strong>Contract Performance:</strong> To fulfill any service agreements we may enter into</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Contact form submissions: 3 years from the date of submission</li>
              <li>Marketing consent: Until you withdraw consent or 3 years of inactivity</li>
              <li>Service-related communications: For the duration of our business relationship plus 1 year</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Your Rights Under GDPR</h2>
            <p className="text-gray-700 mb-4">
              As a data subject, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure database storage with access controls</li>
              <li>Regular security updates and monitoring</li>
              <li>Limited access to personal data on a need-to-know basis</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              Our website uses essential cookies for functionality. We do not use tracking cookies or third-party analytics 
              without your explicit consent. You can manage your cookie preferences through our cookie banner.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Third-Party Services</h2>
            <p className="text-gray-700 mb-4">
              We may use third-party services for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Email delivery (with appropriate data processing agreements)</li>
              <li>Website hosting and infrastructure</li>
              <li>Database services</li>
            </ul>
            <p className="text-gray-700 mb-4">
              All third-party processors are GDPR-compliant and have appropriate data processing agreements in place.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              For any privacy-related questions or to exercise your rights, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">
                <strong>Email:</strong> privacy@example.com
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Address:</strong> Brussels, Belgium
              </p>
              <p className="text-gray-700">
                <strong>Response Time:</strong> We will respond to your request within 30 days as required by GDPR.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this privacy policy from time to time. We will notify you of any material changes by 
              posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>
        </div>

        {/* Back to contact */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <a 
            href="/contact"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            ← Back to Contact
          </a>
        </div>
      </main>
    </div>
  )
}