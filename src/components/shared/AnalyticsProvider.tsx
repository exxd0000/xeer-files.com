'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { initGA, pageView, updateConsent } from '@/lib/analytics';
import { useAppStore } from '@/stores/app-store';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cookieConsent } = useAppStore();

  // Initialize GA on mount
  useEffect(() => {
    initGA();
  }, []);

  // Update consent when cookie consent changes
  useEffect(() => {
    if (cookieConsent !== null) {
      updateConsent(cookieConsent);
    }
  }, [cookieConsent]);

  // Track page views
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageView(url);
    }
  }, [pathname, searchParams]);

  return <>{children}</>;
}
