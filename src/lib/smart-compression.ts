import imageCompression from 'browser-image-compression';

export interface CompressionResult {
  blob: Blob;
  url: string;
  originalSize: number;
  compressedSize: number;
  savings: number;
  savingsPercent: number;
  format: string;
  width: number;
  height: number;
}

const qualitySettings = {
  low: { maxSizeMB: 10, quality: 0.9 },
  medium: { maxSizeMB: 5, quality: 0.7 },
  high: { maxSizeMB: 2, quality: 0.5 },
  extreme: { maxSizeMB: 0.5, quality: 0.3 },
};

export async function smartCompressImage(
  file: File,
  quality: 'low' | 'medium' | 'high' | 'extreme'
): Promise<CompressionResult> {
  const settings = qualitySettings[quality];
  const originalSize = file.size;

  // Determine output format - convert PNG to JPEG for better compression (unless it has transparency)
  const outputType = file.type === 'image/png' ? 'image/jpeg' : file.type || 'image/jpeg';

  const compressedFile = await imageCompression(file, {
    maxSizeMB: settings.maxSizeMB,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: settings.quality,
    fileType: outputType,
  });

  const compressedSize = compressedFile.size;
  const savings = originalSize - compressedSize;
  const savingsPercent = Math.round((savings / originalSize) * 100);

  // Get image dimensions
  const img = new window.Image();
  const url = URL.createObjectURL(compressedFile);

  return new Promise((resolve) => {
    img.onload = () => {
      resolve({
        blob: compressedFile,
        url,
        originalSize,
        compressedSize,
        savings,
        savingsPercent: Math.max(0, savingsPercent),
        format: outputType,
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => {
      resolve({
        blob: compressedFile,
        url,
        originalSize,
        compressedSize,
        savings,
        savingsPercent: Math.max(0, savingsPercent),
        format: outputType,
        width: 0,
        height: 0,
      });
    };
    img.src = url;
  });
}

export function estimateCompressedSize(
  originalSize: number,
  quality: 'low' | 'medium' | 'high' | 'extreme'
): { min: number; max: number; expected: number } {
  const reductions = {
    low: { min: 0.05, max: 0.2, expected: 0.1 },
    medium: { min: 0.2, max: 0.5, expected: 0.35 },
    high: { min: 0.4, max: 0.7, expected: 0.55 },
    extreme: { min: 0.6, max: 0.9, expected: 0.75 },
  };
  const r = reductions[quality];
  return {
    min: Math.round(originalSize * (1 - r.max)),
    max: Math.round(originalSize * (1 - r.min)),
    expected: Math.round(originalSize * (1 - r.expected)),
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getCompressionRecommendation(fileSize: number): {
  recommended: 'low' | 'medium' | 'high' | 'extreme';
  reason: string;
  reasonAr: string;
} {
  const sizeMB = fileSize / (1024 * 1024);
  if (sizeMB < 1) return { recommended: 'low', reason: 'File is small. Minimal compression recommended.', reasonAr: 'الملف صغير. يُنصح بضغط بسيط.' };
  if (sizeMB < 5) return { recommended: 'medium', reason: 'Medium compression for good balance.', reasonAr: 'ضغط متوسط لتوازن جيد.' };
  if (sizeMB < 20) return { recommended: 'high', reason: 'Large file. High compression recommended.', reasonAr: 'ملف كبير. يُنصح بضغط عالي.' };
  return { recommended: 'extreme', reason: 'Very large file. Maximum compression.', reasonAr: 'ملف كبير جداً. أقصى ضغط.' };
}
