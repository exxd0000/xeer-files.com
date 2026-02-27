// Tool types
export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: ToolCategory;
  isPremium: boolean;
  isAI: boolean;
  processingType: 'client' | 'worker';
  maxFileSize: {
    free: number; // in MB
    premium: number;
  };
  acceptedFormats: string[];
  outputFormat: string;
}

export type ToolCategory =
  | 'organize'
  | 'optimize'
  | 'convert-to-pdf'
  | 'convert-from-pdf'
  | 'edit'
  | 'security'
  | 'image-optimize'
  | 'image-edit'
  | 'image-convert'
  | 'image-create';

export interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
}

// File & Job types
export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'ready' | 'processing' | 'done' | 'error';
  error?: string;
  pageCount?: number;
}

export interface Job {
  id: string;
  userId?: string;
  toolId: string;
  status: JobStatus;
  priority: 'low' | 'normal' | 'high';
  inputFiles: string[];
  outputFiles: string[];
  options: Record<string, unknown>;
  progress: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt: Date;
  retries: number;
  error?: string;
}

export type JobStatus =
  | 'queued'
  | 'processing'
  | 'done'
  | 'failed'
  | 'expired'
  | 'deleted';

// User & Subscription types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  plan: UserPlan;
  planExpiresAt?: Date;
  dailyUsage: DailyUsage;
  createdAt: Date;
}

export type UserPlan = 'free' | 'premium' | 'family_lifetime';

export interface DailyUsage {
  date: string;
  operations: number;
  ocrOperations: number;
  aiRequests: number;
  totalFileSize: number;
}

export interface PlanLimits {
  maxFileSize: number; // MB
  maxJobSize: number; // MB
  dailyOperations: number;
  dailyOCR: number;
  ocrMaxPages: number;
  mergeMaxFiles: number;
  dailyAIRequests: number;
  aiMaxChars: number;
  queuePriority: 'low' | 'normal' | 'high';
  showAds: boolean;
}

// Access codes
export interface AccessCode {
  id: string;
  code: string;
  planType: UserPlan;
  maxUses: number;
  usedCount: number;
  expiresAt?: Date;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
}

// Internationalization
export type Locale =
  | 'en' | 'ar' | 'es' | 'fr' | 'de'
  | 'it' | 'pt' | 'ru' | 'zh' | 'ja'
  | 'ko' | 'tr' | 'nl' | 'pl' | 'hi';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

// Analytics events
export interface AnalyticsEvent {
  name: string;
  params?: Record<string, string | number | boolean>;
}

// Theme
export type Theme = 'light' | 'dark';

// API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// Processing options for each tool
export interface MergeOptions {
  order: string[]; // file IDs in order
}

export interface SplitOptions {
  mode: 'all' | 'ranges' | 'extract';
  ranges?: string; // e.g., "1-3,5,7-10"
  extractPages?: number[];
}

export interface CompressOptions {
  level: 'low' | 'medium' | 'high' | 'extreme';
}

export interface ConvertOptions {
  outputFormat: string;
  quality?: 'low' | 'medium' | 'high';
}

export interface RotateOptions {
  angle: 0 | 90 | 180 | 270;
  pages?: 'all' | number[];
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'diagonal';
  opacity: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  rotation?: number;
  pages?: 'all' | 'odd' | 'even' | number[];
}

export interface PageNumberOptions {
  position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  format: 'number' | 'roman' | 'page-x-of-y';
  startFrom: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  margin: number;
  pages?: 'all' | 'odd' | 'even' | number[];
}

export interface ProtectOptions {
  password: string;
  permissions?: {
    print: boolean;
    copy: boolean;
    modify: boolean;
  };
}

export interface OCROptions {
  language: string;
  outputFormat: 'pdf' | 'pdf-searchable' | 'txt';
}

export interface AIOptions {
  action: 'summarize' | 'key-points' | 'chat' | 'translate' | 'extract';
  prompt?: string;
  targetLanguage?: string;
}
