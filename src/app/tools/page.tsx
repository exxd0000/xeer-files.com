'use client';

import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { useAppStore } from '@/stores/app-store';
import { getTranslations } from '@/i18n';

export default function ToolsPage() {
  const { locale } = useAppStore();
  const t = getTranslations(locale);

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
              <h1 className="heading-1 mb-4">
                <span className="gradient-text">{t.tools.all}</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Everything you need to work with PDF files. All tools are free and easy to use.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="section">
          <div className="page-container">
            <ToolGrid showFilter={true} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
