'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, locale } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply RTL for Arabic
    if (locale === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', locale);
    }
  }, [theme, locale]);

  return <>{children}</>;
}
