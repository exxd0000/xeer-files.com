'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function CookiesPage() {
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
                <h1 className="heading-1 mb-4">Cookie Policy</h1>
                <p className="text-muted-foreground mb-8">
                  Last updated: February 26, 2026
                </p>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h2>What Are Cookies</h2>
                  <p>
                    Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences and how you interact with it.
                  </p>

                  <h2>How We Use Cookies</h2>
                  <p>Xeer Files uses cookies for the following purposes:</p>

                  <h3>Essential Cookies</h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable core functionality such as:
                  </p>
                  <ul>
                    <li>User authentication and session management</li>
                    <li>Security and fraud prevention</li>
                    <li>Language and theme preferences</li>
                    <li>Cookie consent preferences</li>
                  </ul>

                  <h3>Analytics Cookies</h3>
                  <p>
                    We use Google Analytics to understand how visitors interact with our website. These cookies collect information anonymously, including:
                  </p>
                  <ul>
                    <li>Pages visited and time spent</li>
                    <li>Browser and device information</li>
                    <li>Referring websites</li>
                    <li>Geographic location (country level)</li>
                  </ul>
                  <p>
                    We have configured Google Analytics to anonymize IP addresses and not collect personal data.
                  </p>

                  <h3>Functional Cookies</h3>
                  <p>
                    These cookies remember your preferences to provide a more personalized experience:
                  </p>
                  <ul>
                    <li>Language preference</li>
                    <li>Theme preference (light/dark mode)</li>
                    <li>Recently used tools</li>
                  </ul>

                  <h2>Cookies We Use</h2>
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Cookie Name</th>
                        <th>Purpose</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>xeer-files-storage</td>
                        <td>Stores user preferences</td>
                        <td>1 year</td>
                      </tr>
                      <tr>
                        <td>sb-access-token</td>
                        <td>Authentication</td>
                        <td>Session</td>
                      </tr>
                      <tr>
                        <td>_ga, _gid</td>
                        <td>Google Analytics</td>
                        <td>2 years / 24 hours</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2>Managing Cookies</h2>
                  <p>
                    You can control cookies through:
                  </p>
                  <ul>
                    <li><strong>Our Cookie Banner:</strong> Accept or decline non-essential cookies when first visiting</li>
                    <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies</li>
                    <li><strong>Account Settings:</strong> Manage analytics preferences in your account</li>
                  </ul>

                  <h2>Third-Party Cookies</h2>
                  <p>
                    We use the following third-party services that may set cookies:
                  </p>
                  <ul>
                    <li>Google Analytics (analytics)</li>
                    <li>Stripe (payment processing)</li>
                    <li>Cloudflare (security)</li>
                  </ul>

                  <h2>Updates to This Policy</h2>
                  <p>
                    We may update this Cookie Policy from time to time. Check this page periodically for updates.
                  </p>

                  <h2>Contact</h2>
                  <p>
                    For questions about our use of cookies, contact us at:<br />
                    Email: privacy@xeer-files.com
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
