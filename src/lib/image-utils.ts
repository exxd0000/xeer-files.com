// Image processing utilities using Canvas API

export interface ImageProcessingResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  format: string;
}

// Helper to load image from file
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

// Helper to create canvas from image
export function createCanvas(
  img: HTMLImageElement,
  width?: number,
  height?: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement('canvas');
  canvas.width = width || img.width;
  canvas.height = height || img.height;
  const ctx = canvas.getContext('2d')!;
  return { canvas, ctx };
}

// Compress image
export async function compressImage(
  file: File,
  quality: number = 0.8,
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);
  ctx.drawImage(img, 0, 0);

  const format = outputFormat || (file.type.includes('png') ? 'image/png' : 'image/jpeg');

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format,
        });
      },
      format,
      format === 'image/png' ? undefined : quality
    );
  });
}

// Resize image by percentage
export async function resizeImageByPercentage(
  file: File,
  percentage: number,
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const newWidth = Math.round(img.width * (percentage / 100));
  const newHeight = Math.round(img.height * (percentage / 100));

  const { canvas, ctx } = createCanvas(img, newWidth, newHeight);
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: newWidth,
          height: newHeight,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Resize image by dimensions
export async function resizeImageByDimensions(
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true,
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);

  let newWidth = width;
  let newHeight = height;

  if (maintainAspectRatio) {
    const aspectRatio = img.width / img.height;
    if (width / height > aspectRatio) {
      newWidth = Math.round(height * aspectRatio);
    } else {
      newHeight = Math.round(width / aspectRatio);
    }
  }

  const { canvas, ctx } = createCanvas(img, newWidth, newHeight);
  ctx.drawImage(img, 0, 0, newWidth, newHeight);

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: newWidth,
          height: newHeight,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Rotate image
export async function rotateImage(
  file: File,
  angle: number,
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);

  const radians = (angle * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));

  const newWidth = Math.round(img.width * cos + img.height * sin);
  const newHeight = Math.round(img.width * sin + img.height * cos);

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(radians);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: newWidth,
          height: newHeight,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Flip image
export async function flipImage(
  file: File,
  direction: 'horizontal' | 'vertical',
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);

  if (direction === 'horizontal') {
    ctx.scale(-1, 1);
    ctx.drawImage(img, -img.width, 0);
  } else {
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, -img.height);
  }

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Crop image
export async function cropImage(
  file: File,
  x: number,
  y: number,
  width: number,
  height: number,
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width,
          height,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Add watermark
export async function addImageWatermark(
  file: File,
  text: string,
  options: {
    opacity: number;
    fontSize?: number;
    position?: 'center' | 'diagonal' | 'bottom-right';
    color?: string;
  },
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);

  ctx.drawImage(img, 0, 0);

  const fontSize = options.fontSize || Math.max(24, Math.min(img.width, img.height) / 15);
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillStyle = options.color || 'rgba(255, 255, 255, 0.5)';
  ctx.globalAlpha = options.opacity / 100;

  const textWidth = ctx.measureText(text).width;

  if (options.position === 'diagonal') {
    ctx.save();
    ctx.translate(img.width / 2, img.height / 2);
    ctx.rotate(-Math.PI / 4);

    // Draw text multiple times for diagonal pattern
    for (let i = -2; i <= 2; i++) {
      ctx.fillText(text, -textWidth / 2, i * fontSize * 3);
    }
    ctx.restore();
  } else if (options.position === 'bottom-right') {
    ctx.fillText(text, img.width - textWidth - 20, img.height - 20);
  } else {
    ctx.fillText(text, (img.width - textWidth) / 2, img.height / 2);
  }

  ctx.globalAlpha = 1;

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Convert image format
export async function convertImageFormat(
  file: File,
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp',
  quality: number = 0.92
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);

  // For JPEG, fill with white background (no transparency)
  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format: targetFormat,
        });
      },
      targetFormat,
      targetFormat === 'image/png' ? undefined : quality
    );
  });
}

// SVG to PNG
export async function svgToPng(
  file: File,
  scale: number = 1
): Promise<ImageProcessingResult> {
  const svgText = await file.text();
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  let width = parseInt(svgElement.getAttribute('width') || '300');
  let height = parseInt(svgElement.getAttribute('height') || '300');

  // Try to get dimensions from viewBox if not set
  const viewBox = svgElement.getAttribute('viewBox');
  if (viewBox) {
    const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
    if (!svgElement.getAttribute('width')) width = vbWidth;
    if (!svgElement.getAttribute('height')) height = vbHeight;
  }

  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const img = new Image();
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob(
        (blob) => {
          resolve({
            blob: blob!,
            url: URL.createObjectURL(blob!),
            width,
            height,
            format: 'image/png',
          });
        },
        'image/png'
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

// Create meme
export async function createMeme(
  file: File,
  topText: string,
  bottomText: string,
  options?: {
    fontSize?: number;
    fontFamily?: string;
    textColor?: string;
    strokeColor?: string;
  }
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);

  ctx.drawImage(img, 0, 0);

  const fontSize = options?.fontSize || Math.max(24, Math.min(img.width, img.height) / 10);
  const fontFamily = options?.fontFamily || 'Impact, sans-serif';

  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.fillStyle = options?.textColor || '#FFFFFF';
  ctx.strokeStyle = options?.strokeColor || '#000000';
  ctx.lineWidth = fontSize / 15;

  // Top text
  if (topText) {
    const topY = fontSize + 20;
    ctx.strokeText(topText.toUpperCase(), img.width / 2, topY);
    ctx.fillText(topText.toUpperCase(), img.width / 2, topY);
  }

  // Bottom text
  if (bottomText) {
    const bottomY = img.height - 20;
    ctx.strokeText(bottomText.toUpperCase(), img.width / 2, bottomY);
    ctx.fillText(bottomText.toUpperCase(), img.width / 2, bottomY);
  }

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format: 'image/jpeg',
        });
      },
      'image/jpeg',
      0.92
    );
  });
}

// Create collage
export async function createCollage(
  files: File[],
  layout: 'grid' | 'horizontal' | 'vertical' = 'grid',
  options?: {
    gap?: number;
    backgroundColor?: string;
    maxWidth?: number;
    maxHeight?: number;
  }
): Promise<ImageProcessingResult> {
  const images = await Promise.all(files.map(loadImage));
  const gap = options?.gap || 10;
  const bgColor = options?.backgroundColor || '#FFFFFF';

  let canvasWidth: number;
  let canvasHeight: number;
  const positions: { x: number; y: number; width: number; height: number }[] = [];

  if (layout === 'horizontal') {
    const maxHeight = options?.maxHeight || 400;
    let totalWidth = gap;

    images.forEach((img) => {
      const scale = maxHeight / img.height;
      const scaledWidth = img.width * scale;
      positions.push({
        x: totalWidth,
        y: gap,
        width: scaledWidth,
        height: maxHeight,
      });
      totalWidth += scaledWidth + gap;
    });

    canvasWidth = totalWidth;
    canvasHeight = maxHeight + gap * 2;
  } else if (layout === 'vertical') {
    const maxWidth = options?.maxWidth || 600;
    let totalHeight = gap;

    images.forEach((img) => {
      const scale = maxWidth / img.width;
      const scaledHeight = img.height * scale;
      positions.push({
        x: gap,
        y: totalHeight,
        width: maxWidth,
        height: scaledHeight,
      });
      totalHeight += scaledHeight + gap;
    });

    canvasWidth = maxWidth + gap * 2;
    canvasHeight = totalHeight;
  } else {
    // Grid layout
    const cols = Math.ceil(Math.sqrt(images.length));
    const rows = Math.ceil(images.length / cols);
    const cellSize = options?.maxWidth ? options.maxWidth / cols : 300;

    canvasWidth = cols * cellSize + (cols + 1) * gap;
    canvasHeight = rows * cellSize + (rows + 1) * gap;

    images.forEach((_, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      positions.push({
        x: gap + col * (cellSize + gap),
        y: gap + row * (cellSize + gap),
        width: cellSize,
        height: cellSize,
      });
    });
  }

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  images.forEach((img, index) => {
    const pos = positions[index];
    // Cover fit
    const scale = Math.max(pos.width / img.width, pos.height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = pos.x + (pos.width - scaledWidth) / 2;
    const y = pos.y + (pos.height - scaledHeight) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.rect(pos.x, pos.y, pos.width, pos.height);
    ctx.clip();
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    ctx.restore();
  });

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvasWidth,
          height: canvasHeight,
          format: 'image/jpeg',
        });
      },
      'image/jpeg',
      0.92
    );
  });
}

// Create GIF (simplified - creates an animated canvas)
export async function createGif(
  files: File[],
  frameDelay: number = 200
): Promise<{ frames: ImageProcessingResult[]; delay: number }> {
  const results: ImageProcessingResult[] = [];

  // Find max dimensions
  const images = await Promise.all(files.map(loadImage));
  const maxWidth = Math.max(...images.map((img) => img.width));
  const maxHeight = Math.max(...images.map((img) => img.height));

  for (const img of images) {
    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, maxWidth, maxHeight);

    // Center the image
    const x = (maxWidth - img.width) / 2;
    const y = (maxHeight - img.height) / 2;
    ctx.drawImage(img, x, y);

    const result = await new Promise<ImageProcessingResult>((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve({
            blob: blob!,
            url: URL.createObjectURL(blob!),
            width: maxWidth,
            height: maxHeight,
            format: 'image/png',
          });
        },
        'image/png'
      );
    });

    results.push(result);
  }

  return { frames: results, delay: frameDelay };
}

// Create animated GIF using gif.js
export async function createAnimatedGif(
  files: File[],
  options: {
    delay?: number;
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): Promise<ImageProcessingResult> {
  const images = await Promise.all(files.map(loadImage));

  // Calculate dimensions
  const maxWidth = options.width || Math.max(...images.map((img) => img.width));
  const maxHeight = options.height || Math.max(...images.map((img) => img.height));
  const delay = options.delay || 500;
  const quality = options.quality || 10;

  // Dynamic import gif.js
  const GIF = (await import('gif.js')).default;

  return new Promise((resolve, reject) => {
    const gif = new GIF({
      workers: 2,
      quality,
      width: maxWidth,
      height: maxHeight,
      workerScript: 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js',
    });

    // Add each image as a frame
    for (const img of images) {
      const canvas = document.createElement('canvas');
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      const ctx = canvas.getContext('2d')!;

      // Fill with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, maxWidth, maxHeight);

      // Center the image
      const x = (maxWidth - img.width) / 2;
      const y = (maxHeight - img.height) / 2;
      ctx.drawImage(img, x, y);

      gif.addFrame(canvas, { delay, copy: true });
    }

    gif.on('finished', (blob: Blob) => {
      resolve({
        blob,
        url: URL.createObjectURL(blob),
        width: maxWidth,
        height: maxHeight,
        format: 'image/gif',
      });
    });

    gif.on('error', reject);
    gif.render();
  });
}

// Enhanced photo editor with multiple adjustments
export async function applyPhotoAdjustments(
  file: File,
  adjustments: {
    brightness?: number; // -100 to 100
    contrast?: number; // -100 to 100
    saturation?: number; // -100 to 100
    hue?: number; // 0 to 360
    blur?: number; // 0 to 20
    sharpen?: number; // 0 to 100
    grayscale?: boolean;
    sepia?: boolean;
    invert?: boolean;
  }
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);

  // Build filter string
  const filters: string[] = [];

  if (adjustments.brightness !== undefined) {
    filters.push(`brightness(${100 + adjustments.brightness}%)`);
  }
  if (adjustments.contrast !== undefined) {
    filters.push(`contrast(${100 + adjustments.contrast}%)`);
  }
  if (adjustments.saturation !== undefined) {
    filters.push(`saturate(${100 + adjustments.saturation}%)`);
  }
  if (adjustments.hue !== undefined) {
    filters.push(`hue-rotate(${adjustments.hue}deg)`);
  }
  if (adjustments.blur !== undefined && adjustments.blur > 0) {
    filters.push(`blur(${adjustments.blur}px)`);
  }
  if (adjustments.grayscale) {
    filters.push('grayscale(100%)');
  }
  if (adjustments.sepia) {
    filters.push('sepia(100%)');
  }
  if (adjustments.invert) {
    filters.push('invert(100%)');
  }

  ctx.filter = filters.length > 0 ? filters.join(' ') : 'none';
  ctx.drawImage(img, 0, 0);
  ctx.filter = 'none';

  const format = file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Crop image with specific coordinates
export async function cropImageWithCoords(
  file: File,
  cropArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);

  const canvas = document.createElement('canvas');
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: cropArea.width,
          height: cropArea.height,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Crop image with aspect ratio
export async function cropImageWithAspectRatio(
  file: File,
  aspectRatio: '1:1' | '4:3' | '16:9' | '3:2' | '2:3' | '9:16',
  outputFormat?: string
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);

  const ratios: Record<string, number> = {
    '1:1': 1,
    '4:3': 4 / 3,
    '16:9': 16 / 9,
    '3:2': 3 / 2,
    '2:3': 2 / 3,
    '9:16': 9 / 16,
  };

  const targetRatio = ratios[aspectRatio];
  const currentRatio = img.width / img.height;

  let cropWidth: number;
  let cropHeight: number;
  let cropX: number;
  let cropY: number;

  if (currentRatio > targetRatio) {
    // Image is wider than target ratio
    cropHeight = img.height;
    cropWidth = img.height * targetRatio;
    cropX = (img.width - cropWidth) / 2;
    cropY = 0;
  } else {
    // Image is taller than target ratio
    cropWidth = img.width;
    cropHeight = img.width / targetRatio;
    cropX = 0;
    cropY = (img.height - cropHeight) / 2;
  }

  const canvas = document.createElement('canvas');
  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    img,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  const format = outputFormat || file.type || 'image/jpeg';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: cropWidth,
          height: cropHeight,
          format,
        });
      },
      format,
      0.92
    );
  });
}

// Apply photo filter
export async function applyPhotoFilter(
  file: File,
  filter: 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'saturate',
  intensity: number = 100
): Promise<ImageProcessingResult> {
  const img = await loadImage(file);
  const { canvas, ctx } = createCanvas(img);

  let filterValue = '';

  switch (filter) {
    case 'grayscale':
      filterValue = `grayscale(${intensity}%)`;
      break;
    case 'sepia':
      filterValue = `sepia(${intensity}%)`;
      break;
    case 'invert':
      filterValue = `invert(${intensity}%)`;
      break;
    case 'blur':
      filterValue = `blur(${intensity / 10}px)`;
      break;
    case 'brightness':
      filterValue = `brightness(${intensity}%)`;
      break;
    case 'contrast':
      filterValue = `contrast(${intensity}%)`;
      break;
    case 'saturate':
      filterValue = `saturate(${intensity}%)`;
      break;
  }

  ctx.filter = filterValue;
  ctx.drawImage(img, 0, 0);
  ctx.filter = 'none';

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        resolve({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: canvas.width,
          height: canvas.height,
          format: file.type || 'image/jpeg',
        });
      },
      file.type || 'image/jpeg',
      0.92
    );
  });
}

// Check if iOS
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Download image with iOS support
export function downloadImage(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);

  // For iOS Safari, we need a different approach
  if (isIOS()) {
    // Try using Web Share API first (best for iOS)
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: blob.type });
      const shareData = { files: [file] };

      if (navigator.canShare(shareData)) {
        navigator.share(shareData).catch(() => {
          // Fallback: open in new tab
          window.open(url, '_blank');
        });
        return;
      }
    }

    // Fallback for iOS: open blob in new tab
    // User can then long-press to save
    const newWindow = window.open(url, '_blank');
    if (!newWindow) {
      // If popup blocked, create visible link
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = `Download ${filename}`;
      link.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);padding:20px;background:#7c3aed;color:white;border-radius:12px;z-index:9999;text-decoration:none;';
      document.body.appendChild(link);

      // Auto-remove after click
      link.addEventListener('click', () => {
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
      });
    }
    return;
  }

  // Standard download for desktop browsers
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  // Cleanup after a delay
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

// Download multiple as zip (requires JSZip)
export async function downloadAsZip(
  results: { blob: Blob; filename: string }[],
  zipFilename: string
): Promise<void> {
  // Dynamic import JSZip
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  results.forEach(({ blob, filename }) => {
    zip.file(filename, blob);
  });

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadImage(zipBlob, zipFilename);
}
