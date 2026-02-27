'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
} from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { getTranslations } from '@/i18n';
import { locales } from '@/config/locales';
import { toolCategories, getToolsByCategory } from '@/config/tools';

export function Header() {
  const { locale, setLocale, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const t = getTranslations(locale);
  const [showTools, setShowTools] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const isRtl = locale === 'ar';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#1a1a1a]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-violet-400 text-lg sm:text-xl tracking-[0.15em] font-light uppercase">
              XEER FILES
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm tracking-wider text-[#8a8a8a] hover:text-violet-400 transition-colors uppercase"
                onMouseEnter={() => setShowTools(true)}
                onMouseLeave={() => setShowTools(false)}
              >
                {t.nav.tools}
                <ChevronDown className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showTools && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[720px] p-6 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-2xl"
                    onMouseEnter={() => setShowTools(true)}
                    onMouseLeave={() => setShowTools(false)}
                  >
                    <div className="grid grid-cols-3 gap-6">
                      {toolCategories.slice(0, 6).map((category) => (
                        <div key={category.id}>
                          <h3 className="text-sm font-medium text-violet-400 mb-3 tracking-wider uppercase">
                            {category.name}
                          </h3>
                          <ul className="space-y-2">
                            {getToolsByCategory(category.id).slice(0, 4).map((tool) => (
                              <li key={tool.id}>
                                <Link
                                  href={`/tool/${tool.slug}`}
                                  className="flex items-center gap-2 text-sm text-[#666] hover:text-violet-400 transition-colors"
                                >
                                  <span
                                    className="w-1.5 h-1.5 rounded-full bg-violet-500/50"
                                  />
                                  {tool.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#1a1a1a]">
                      <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-white transition-colors tracking-wider"
                      >
                        {t.tools.viewAll}
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/help"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm tracking-wider text-[#8a8a8a] hover:text-violet-400 transition-colors uppercase"
            >
              {t.nav.help}
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#8a8a8a] hover:text-violet-400 transition-colors"
                onClick={() => setShowLanguages(!showLanguages)}
                onBlur={() => setTimeout(() => setShowLanguages(false), 200)}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline uppercase tracking-wider">{locale}</span>
              </button>

              <AnimatePresence>
                {showLanguages && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 py-2 rounded-xl bg-[#0a0a0a] border border-[#1a1a1a] shadow-xl max-h-80 overflow-auto"
                  >
                    {locales.map((loc) => (
                      <button
                        key={loc.code}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#151515] transition-colors ${
                          locale === loc.code ? 'text-violet-400' : 'text-[#8a8a8a]'
                        }`}
                        onClick={() => {
                          setLocale(loc.code);
                          setShowLanguages(false);
                        }}
                      >
                        <span className="text-lg">{loc.flag}</span>
                        <span>{loc.nativeName}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-lg text-violet-400 hover:bg-[#1a1a1a] transition-colors"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#1a1a1a] bg-[#0a0a0a]"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-2">
              <Link
                href="/tools"
                className="block px-4 py-3 rounded-lg text-sm tracking-wider text-[#8a8a8a] hover:text-violet-400 hover:bg-[#151515] transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.tools}
              </Link>
              <Link
                href="/help"
                className="block px-4 py-3 rounded-lg text-sm tracking-wider text-[#8a8a8a] hover:text-violet-400 hover:bg-[#151515] transition-colors uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.help}
              </Link>

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-[#1a1a1a]">
                <p className="px-4 py-2 text-xs text-[#555] tracking-wider uppercase">
                  {isRtl ? 'اللغة' : 'Language'}
                </p>
                <div className="grid grid-cols-2 gap-2 px-4">
                  {locales.slice(0, 6).map((loc) => (
                    <button
                      key={loc.code}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        locale === loc.code
                          ? 'text-violet-400 bg-[#151515]'
                          : 'text-[#8a8a8a] hover:bg-[#151515]'
                      }`}
                      onClick={() => {
                        setLocale(loc.code);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span>{loc.flag}</span>
                      <span className="truncate">{loc.nativeName}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
