'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RefundPage() {
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
                <h1 className="heading-1 mb-4">Refund Policy</h1>
                <p className="text-muted-foreground mb-8">
                  Last updated: February 26, 2026
                </p>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <h2>7-Day Money-Back Guarantee</h2>
                  <p>
                    We offer a 7-day money-back guarantee for all new Premium subscriptions. If you&apos;re not satisfied with Xeer Files Premium within the first 7 days of your subscription, you can request a full refund.
                  </p>

                  <h2>Eligibility</h2>
                  <p>To be eligible for a refund, you must:</p>
                  <ul>
                    <li>Request the refund within 7 days of your initial purchase</li>
                    <li>Be a first-time Premium subscriber</li>
                    <li>Not have previously received a refund from Xeer Files</li>
                  </ul>

                  <h2>How to Request a Refund</h2>
                  <p>To request a refund:</p>
                  <ol>
                    <li>Email us at <a href="mailto:support@xeer-files.com">support@xeer-files.com</a> with subject line &quot;Refund Request&quot;</li>
                    <li>Include your account email address</li>
                    <li>Provide a brief reason for the refund (optional but helpful)</li>
                  </ol>
                  <p>
                    We aim to process refund requests within 3-5 business days. The refund will be credited to your original payment method.
                  </p>

                  <h2>After the 7-Day Period</h2>
                  <p>
                    After the 7-day period, refunds are handled on a case-by-case basis. Contact our support team to discuss your situation.
                  </p>

                  <h2>Subscription Cancellation</h2>
                  <p>
                    You can cancel your subscription at any time from your Account settings. When you cancel:
                  </p>
                  <ul>
                    <li>You will retain access to Premium features until the end of your current billing period</li>
                    <li>No further charges will be made to your payment method</li>
                    <li>Your account will automatically revert to the Free plan at the end of the billing period</li>
                  </ul>

                  <h2>Redeem Codes</h2>
                  <p>
                    Premium access obtained through redeem codes is generally non-refundable. However, if you encounter issues with a redeem code, please contact our support team.
                  </p>

                  <h2>Partial Refunds</h2>
                  <p>
                    We do not offer partial refunds for unused portions of subscription periods after the 7-day guarantee window.
                  </p>

                  <h2>Chargebacks</h2>
                  <p>
                    We recommend contacting our support team before initiating a chargeback with your bank or credit card company. Chargebacks may result in account suspension.
                  </p>

                  <h2>Contact Us</h2>
                  <p>
                    For refund-related questions, contact us at:<br />
                    Email: support@xeer-files.com<br />
                    Response time: Within 24 hours
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
