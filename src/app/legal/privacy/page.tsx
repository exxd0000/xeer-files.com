'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
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
                <h1 className="heading-1 mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-8">
                  Last updated: February 26, 2026
                </p>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h2>1. Introduction</h2>
                  <p>
                    Xeer Files (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our PDF processing services at xeer-files.com.
                  </p>

                  <h2>2. Information We Collect</h2>
                  <h3>2.1 Files You Upload</h3>
                  <p>
                    When you use our services, you may upload PDF and other document files. These files are:
                  </p>
                  <ul>
                    <li>Processed temporarily on our servers or in your browser</li>
                    <li>Automatically deleted within 20 minutes of processing</li>
                    <li>Never stored permanently or shared with third parties</li>
                    <li>Not used for any purpose other than providing the requested service</li>
                  </ul>

                  <h3>2.2 Account Information</h3>
                  <p>
                    If you create an account, we collect:
                  </p>
                  <ul>
                    <li>Email address</li>
                    <li>Password (encrypted)</li>
                    <li>Account preferences</li>
                  </ul>

                  <h3>2.3 Usage Data</h3>
                  <p>
                    We automatically collect:
                  </p>
                  <ul>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Pages visited</li>
                    <li>Time and date of visits</li>
                    <li>Anonymized IP address</li>
                  </ul>

                  <h2>3. How We Use Your Information</h2>
                  <p>We use collected information to:</p>
                  <ul>
                    <li>Provide and maintain our services</li>
                    <li>Process your PDF files as requested</li>
                    <li>Manage your account and subscription</li>
                    <li>Improve our services and user experience</li>
                    <li>Send service-related communications</li>
                  </ul>

                  <h2>4. Data Retention</h2>
                  <p>
                    <strong>File Retention:</strong> All uploaded and processed files are automatically and permanently deleted within 20 minutes of processing. You can also delete files immediately using the &quot;Delete Now&quot; button.
                  </p>
                  <p>
                    <strong>Account Data:</strong> Account information is retained as long as your account is active. You can request account deletion at any time.
                  </p>

                  <h2>5. Data Security</h2>
                  <p>We implement robust security measures including:</p>
                  <ul>
                    <li>SSL/TLS encryption for all data transfers</li>
                    <li>Secure cloud infrastructure</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                  </ul>

                  <h2>6. Third-Party Services</h2>
                  <p>We use the following third-party services:</p>
                  <ul>
                    <li>Supabase for authentication and data storage</li>
                    <li>Stripe for payment processing</li>
                    <li>Google Analytics for anonymized usage analytics</li>
                    <li>Cloudflare for security and performance</li>
                  </ul>

                  <h2>7. Your Rights (GDPR/CCPA)</h2>
                  <p>You have the right to:</p>
                  <ul>
                    <li>Access your personal data</li>
                    <li>Correct inaccurate data</li>
                    <li>Request deletion of your data</li>
                    <li>Export your data</li>
                    <li>Opt-out of analytics tracking</li>
                  </ul>

                  <h2>8. Cookies</h2>
                  <p>
                    We use essential cookies for site functionality and optional analytics cookies. You can manage cookie preferences through our cookie consent banner.
                  </p>

                  <h2>9. Children&apos;s Privacy</h2>
                  <p>
                    Our services are not intended for children under 13. We do not knowingly collect information from children under 13.
                  </p>

                  <h2>10. Changes to This Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of significant changes via email or site notification.
                  </p>

                  <h2>11. Contact Us</h2>
                  <p>
                    For privacy-related questions, contact us at:<br />
                    Email: privacy@xeer-files.com<br />
                    Address: Xeer Files Inc.
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
