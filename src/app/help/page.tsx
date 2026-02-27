'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  HelpCircle,
  Search,
  ChevronRight,
  MessageCircle,
  Mail,
  Book,
  FileQuestion,
  Shield,
  Clock,
  CreditCard,
  Globe,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const categories = [
  {
    icon: FileQuestion,
    title: 'Getting Started',
    description: 'Learn the basics of using Xeer Files',
    articles: ['How to merge PDF files', 'How to split PDF files', 'How to compress PDF'],
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    description: 'Learn about our security measures',
    articles: ['File encryption', 'Auto-deletion policy', 'Data privacy'],
  },
  {
    icon: CreditCard,
    title: 'Billing & Plans',
    description: 'Pricing, payments, and subscriptions',
    articles: ['Upgrade to Premium', 'Payment methods', 'Cancel subscription'],
  },
  {
    icon: Clock,
    title: 'File Management',
    description: 'Managing your uploaded files',
    articles: ['File expiration', 'Download files', 'Delete files'],
  },
];

const faqs = [
  {
    q: 'How long are my files stored?',
    a: 'All files are automatically deleted 20 minutes after processing. You can also delete them immediately using the "Delete Now" button.',
  },
  {
    q: 'What is the maximum file size?',
    a: 'Free users can upload files up to 25MB. Premium users can upload files up to 500MB.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes! All transfers are encrypted with SSL, and files are processed securely. We never store your files permanently.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel your subscription anytime from your Account settings. Your premium access will continue until the end of your billing period.',
  },
  {
    q: 'Do you offer refunds?',
    a: 'Yes, we offer a 7-day money-back guarantee. Contact our support team for assistance.',
  },
  {
    q: 'Can I use Xeer Files on mobile?',
    a: 'Yes! Xeer Files is fully responsive and works great on all devices - desktop, tablet, and mobile.',
  },
  {
    q: 'What languages are supported?',
    a: 'We support 15 languages including English, Arabic, Spanish, French, German, and more.',
  },
  {
    q: 'How do redeem codes work?',
    a: 'If you have a redeem code, visit the /redeem page and enter your code to unlock premium features.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 py-16 md:py-24">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/25">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="heading-1 mb-4">
                <span className="gradient-text">Help Center</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Find answers to your questions and learn how to use Xeer Files
              </p>

              {/* Search */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="page-container">
            <h2 className="heading-3 mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <Link
                          href="#"
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                          {article}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section bg-muted/30">
          <div className="page-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Quick answers to common questions
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl border border-border bg-card overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span className="font-medium">{faq.q}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4 text-muted-foreground">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section">
          <div className="page-container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-2 mb-4">Still need help?</h2>
              <p className="text-muted-foreground mb-8">
                Our support team is here to assist you
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get help via email within 24 hours
                  </p>
                  <a
                    href="mailto:support@xeer-files.com"
                    className="text-primary hover:underline"
                  >
                    support@xeer-files.com
                  </a>
                </div>
                <div className="p-8 rounded-2xl bg-card border border-border">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with us for instant support
                  </p>
                  <button className="text-primary hover:underline">
                    Start Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
