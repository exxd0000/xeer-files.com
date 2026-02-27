'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        <section className="section">
          <div className="page-container">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="heading-1 mb-4">Terms of Service</h1>
                <p className="text-muted-foreground mb-8">
                  Last updated: February 26, 2026
                </p>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h2>1. Agreement to Terms</h2>
                  <p>
                    By accessing or using Xeer Files (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                  </p>

                  <h2>2. Description of Service</h2>
                  <p>
                    Xeer Files provides online PDF processing tools including, but not limited to: merging, splitting, compressing, converting, editing, and organizing PDF documents. We offer both free and premium subscription tiers.
                  </p>

                  <h2>3. User Accounts</h2>
                  <p>
                    While many features are available without an account, some features require registration. You are responsible for:
                  </p>
                  <ul>
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Notifying us of any unauthorized use</li>
                  </ul>

                  <h2>4. Acceptable Use</h2>
                  <p>You agree NOT to:</p>
                  <ul>
                    <li>Use the Service for any illegal purpose</li>
                    <li>Upload malicious files or malware</li>
                    <li>Attempt to bypass usage limits or security measures</li>
                    <li>Interfere with the Service&apos;s operation</li>
                    <li>Reverse engineer our software</li>
                    <li>Resell or redistribute the Service</li>
                  </ul>

                  <h2>5. File Processing</h2>
                  <p>
                    Files uploaded to Xeer Files are processed according to your instructions. We do not access, review, or use your files for any purpose other than providing the requested service. All files are automatically deleted within 20 minutes of processing.
                  </p>

                  <h2>6. Premium Subscriptions</h2>
                  <h3>6.1 Billing</h3>
                  <p>
                    Premium subscriptions are billed monthly or annually. Payments are processed securely through Stripe.
                  </p>
                  <h3>6.2 Cancellation</h3>
                  <p>
                    You may cancel your subscription at any time. Access continues until the end of your billing period.
                  </p>
                  <h3>6.3 Refunds</h3>
                  <p>
                    We offer a 7-day money-back guarantee for new subscribers. Contact support for refund requests.
                  </p>

                  <h2>7. Redeem Codes</h2>
                  <p>
                    Redeem codes are subject to availability and may have expiration dates or usage limits. Codes cannot be exchanged for cash and are non-transferable.
                  </p>

                  <h2>8. Intellectual Property</h2>
                  <p>
                    The Service and its original content, features, and functionality are owned by Xeer Files and are protected by copyright, trademark, and other intellectual property laws.
                  </p>

                  <h2>9. Limitation of Liability</h2>
                  <p>
                    Xeer Files is provided &quot;as is&quot; without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service.
                  </p>

                  <h2>10. Changes to Terms</h2>
                  <p>
                    We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms.
                  </p>

                  <h2>11. Governing Law</h2>
                  <p>
                    These Terms shall be governed by the laws of the State of Delaware, United States, without regard to conflict of law provisions.
                  </p>

                  <h2>12. Contact</h2>
                  <p>
                    For questions about these Terms, contact us at:<br />
                    Email: legal@xeer-files.com
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
