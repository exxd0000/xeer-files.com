import { en } from './translations/en';
import { ar } from './translations/ar';
import type { Locale } from '@/types';

export const translations: Record<string, typeof en> = {
  en,
  ar,
  // Add more languages as needed
  es: en, // Fallback to English for now
  fr: en,
  de: en,
  it: en,
  pt: en,
  ru: en,
  zh: en,
  ja: en,
  ko: en,
  tr: en,
  nl: en,
  pl: en,
  hi: en,
};

export const getTranslations = (locale: Locale) => {
  return translations[locale] || translations.en;
};

export type { TranslationKeys } from './translations/en';
