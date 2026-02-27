'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, Lightbulb } from 'lucide-react';
import { estimateCompressedSize, formatFileSize, getCompressionRecommendation } from '@/lib/smart-compression';

interface FileSizeEstimateProps {
  originalSize: number;
  compressionLevel: 'low' | 'medium' | 'high' | 'extreme';
  locale?: string;
}

export function FileSizeEstimate({ originalSize, compressionLevel, locale = 'en' }: FileSizeEstimateProps) {
  const isRtl = locale === 'ar';
  const t = (en: string, ar: string) => isRtl ? ar : en;

  const estimate = useMemo(() => estimateCompressedSize(originalSize, compressionLevel), [originalSize, compressionLevel]);
  const recommendation = useMemo(() => getCompressionRecommendation(originalSize), [originalSize]);
  const savingsPercent = Math.round(((originalSize - estimate.expected) / originalSize) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400">
          <TrendingDown className="w-4 h-4" />
          <span className="text-sm">{t('Estimated Size', 'الحجم المتوقع')}</span>
        </div>
        <span className="text-violet-400 font-medium">{formatFileSize(estimate.expected)}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">{t('Savings', 'التوفير')}</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${savingsPercent}%` }}
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400" />
          </div>
          <span className="text-green-400 font-medium text-sm">-{savingsPercent}%</span>
        </div>
      </div>

      {recommendation.recommended !== compressionLevel && (
        <div className="flex items-start gap-2 p-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
          <Lightbulb className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-violet-300">{isRtl ? recommendation.reasonAr : recommendation.reason}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500">{t('Original', 'الأصلي')}</p>
          <p className="text-sm text-gray-300">{formatFileSize(originalSize)}</p>
        </div>
        <div className="text-xl text-gray-600">→</div>
        <div className="text-center">
          <p className="text-xs text-gray-500">{t('After', 'بعد')}</p>
          <p className="text-sm text-violet-400 font-medium">{formatFileSize(estimate.expected)}</p>
        </div>
      </div>
    </motion.div>
  );
}
