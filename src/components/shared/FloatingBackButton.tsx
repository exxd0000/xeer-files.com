'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';

export function FloatingBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useAppStore();
  const isRtl = locale === 'ar';

  // Don't show on home page
  const isHomePage = pathname === '/' || pathname === '';

  if (isHomePage) {
    return null;
  }

  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back();
    } else {
      // If no history, go to home
      router.push('/');
    }
  };

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.8 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBack}
        className={`fixed bottom-6 ${isRtl ? 'right-6' : 'left-6'} z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30 transition-colors`}
        aria-label={isRtl ? 'رجوع' : 'Go back'}
      >
        <ArrowLeft className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
        <span className="text-sm font-medium">{isRtl ? 'رجوع' : 'Back'}</span>
      </motion.button>
    </AnimatePresence>
  );
}
