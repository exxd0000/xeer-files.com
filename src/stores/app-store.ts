import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Locale, Theme, User, UploadedFile, DailyUsage } from '@/types';

interface AppState {
  // Locale
  locale: Locale;
  setLocale: (locale: Locale) => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;
  updateDailyUsage: (usage: Partial<DailyUsage>) => void;

  // Files
  files: UploadedFile[];
  addFiles: (files: UploadedFile[]) => void;
  removeFile: (id: string) => void;
  updateFile: (id: string, updates: Partial<UploadedFile>) => void;
  clearFiles: () => void;
  reorderFiles: (fromIndex: number, toIndex: number) => void;

  // Processing state
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  processingProgress: number;
  setProcessingProgress: (progress: number) => void;

  // Cookie consent
  cookieConsent: boolean | null;
  setCookieConsent: (consent: boolean) => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Locale
      locale: 'en',
      setLocale: (locale) => set({ locale }),

      // Theme
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      // User
      user: null,
      setUser: (user) => set({ user }),
      updateDailyUsage: (usage) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              dailyUsage: { ...user.dailyUsage, ...usage },
            },
          });
        }
      },

      // Files
      files: [],
      addFiles: (files) => set((state) => ({ files: [...state.files, ...files] })),
      removeFile: (id) => set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
      updateFile: (id, updates) =>
        set((state) => ({
          files: state.files.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      clearFiles: () => set({ files: [] }),
      reorderFiles: (fromIndex, toIndex) =>
        set((state) => {
          const newFiles = [...state.files];
          const [removed] = newFiles.splice(fromIndex, 1);
          newFiles.splice(toIndex, 0, removed);
          return { files: newFiles };
        }),

      // Processing
      isProcessing: false,
      setIsProcessing: (isProcessing) => set({ isProcessing }),
      processingProgress: 0,
      setProcessingProgress: (processingProgress) => set({ processingProgress }),

      // Cookie consent
      cookieConsent: null,
      setCookieConsent: (cookieConsent) => set({ cookieConsent }),

      // Mobile menu
      isMobileMenuOpen: false,
      setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
    }),
    {
      name: 'xeer-files-storage',
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        cookieConsent: state.cookieConsent,
      }),
    }
  )
);
