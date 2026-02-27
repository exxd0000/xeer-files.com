import type { PlanLimits, UserPlan } from '@/types';

// App Mode: 'free' = all features free, 'freemium' = free + premium tiers
export const APP_MODE: 'free' | 'freemium' = 'free';

export const planLimits: Record<UserPlan, PlanLimits> = {
  free: {
    maxFileSize: 500, // MB - generous for free
    maxJobSize: 2000, // MB
    dailyOperations: -1, // unlimited
    dailyOCR: -1, // unlimited
    ocrMaxPages: -1, // unlimited
    mergeMaxFiles: -1, // unlimited
    dailyAIRequests: 50, // reasonable limit
    aiMaxChars: 100000,
    queuePriority: 'high',
    showAds: false, // no ads
  },
  premium: {
    maxFileSize: 500,
    maxJobSize: 2000,
    dailyOperations: -1,
    dailyOCR: -1,
    ocrMaxPages: -1,
    mergeMaxFiles: -1,
    dailyAIRequests: -1,
    aiMaxChars: -1,
    queuePriority: 'high',
    showAds: false,
  },
  family_lifetime: {
    maxFileSize: 500,
    maxJobSize: 2000,
    dailyOperations: -1,
    dailyOCR: -1,
    ocrMaxPages: -1,
    mergeMaxFiles: -1,
    dailyAIRequests: -1,
    aiMaxChars: -1,
    queuePriority: 'high',
    showAds: false,
  },
};

// For free mode, everyone gets the same generous limits
export const getEffectiveLimits = (): PlanLimits => {
  return planLimits.free;
};

export const FILE_EXPIRY_MINUTES = 20;
export const COUNTDOWN_WARNING_MINUTES = 5;

// Feature flags
export const FEATURES = {
  showPricing: false, // Set to true if APP_MODE is 'freemium'
  showLogin: false, // No login required for free mode
  showAds: false,
  requireAuth: false,
};
