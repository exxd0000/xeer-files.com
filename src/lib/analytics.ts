// Google Analytics 4 utility functions
// Measurement ID should be set via NEXT_PUBLIC_GA_MEASUREMENT_ID

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'consent',
      targetIdOrAction: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window === 'undefined' || !GA_MEASUREMENT_ID) return;

  // Load gtag script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: true,
  });
};

// Page view tracking
export const pageView = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Event tracking
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
};

// Consent Mode v2
export const updateConsent = (granted: boolean) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
  });
};

// Custom events for Xeer Files
export const analytics = {
  // File events
  fileUploadStart: (toolId: string, fileCount: number) => {
    trackEvent('file_upload_start', {
      tool_name: toolId,
      file_count: fileCount,
    });
  },

  fileUploadSuccess: (toolId: string, fileSize: number) => {
    trackEvent('file_upload_success', {
      tool_name: toolId,
      file_size: fileSize,
    });
  },

  // Tool events
  toolProcessStart: (toolId: string, planType: string) => {
    trackEvent('tool_process_start', {
      tool_name: toolId,
      plan_type: planType,
    });
  },

  toolProcessSuccess: (toolId: string, duration: number) => {
    trackEvent('tool_process_success', {
      tool_name: toolId,
      duration_ms: duration,
    });
  },

  toolProcessFail: (toolId: string, error: string) => {
    trackEvent('tool_process_fail', {
      tool_name: toolId,
      error_message: error,
    });
  },

  // Download events
  fileDownload: (toolId: string, fileSize: number) => {
    trackEvent('file_download', {
      tool_name: toolId,
      file_size: fileSize,
    });
  },

  deleteNowClick: (toolId: string) => {
    trackEvent('delete_now_click', {
      tool_name: toolId,
    });
  },

  // Premium events
  premiumCtaClick: (location: string) => {
    trackEvent('premium_cta_click', {
      location,
    });
  },

  checkoutStart: (planId: string, price: number) => {
    trackEvent('checkout_start', {
      plan_id: planId,
      price,
    });
  },

  checkoutSuccess: (planId: string, price: number) => {
    trackEvent('purchase', {
      transaction_id: `txn_${Date.now()}`,
      value: price,
      currency: 'USD',
      items: [{ item_id: planId, item_name: `Premium ${planId}` }],
    });
  },

  checkoutFail: (planId: string, error: string) => {
    trackEvent('checkout_fail', {
      plan_id: planId,
      error_message: error,
    });
  },

  // Redeem events
  redeemSuccess: (codeType: string) => {
    trackEvent('redeem_success', {
      code_type: codeType,
    });
  },

  redeemFail: (error: string) => {
    trackEvent('redeem_fail', {
      error_message: error,
    });
  },

  // AI events
  aiRequestStart: (action: string) => {
    trackEvent('ai_request_start', {
      ai_action: action,
    });
  },

  aiRequestSuccess: (action: string, charCount: number) => {
    trackEvent('ai_request_success', {
      ai_action: action,
      char_count: charCount,
    });
  },

  aiRequestFail: (action: string, error: string) => {
    trackEvent('ai_request_fail', {
      ai_action: action,
      error_message: error,
    });
  },

  // User preference events
  languageChanged: (newLanguage: string) => {
    trackEvent('language_changed', {
      language: newLanguage,
    });
  },

  darkModeToggle: (isDark: boolean) => {
    trackEvent('darkmode_toggle', {
      is_dark: isDark,
    });
  },

  // Ad impression (for free users)
  adImpression: (adLocation: string) => {
    trackEvent('ad_impression', {
      ad_location: adLocation,
    });
  },
};
