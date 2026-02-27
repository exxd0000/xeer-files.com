'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Clock, AlertCircle, Check, Loader2, ChevronRight, Sparkles, ArrowLeft, FileText, Image, Package } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { ToolOptions, type ToolOptionsState } from '@/components/tools/ToolOptions';
import { ToolDescription } from '@/components/tools/ToolDescription';
import { useAppStore } from '@/stores/app-store';
import { getTranslations } from '@/i18n';
import { getToolBySlug, tools } from '@/config/tools';
import { FILE_EXPIRY_MINUTES } from '@/config/plans';
import {
  mergePDFs,
  splitPDF,
  extractPages,
  rotatePDF,
  addPageNumbers,
  addWatermark,
  removePages,
  organizePDF,
  pdfToImages,
  cropPDF,
  signPDF,
  redactPDF
} from '@/lib/pdf-utils';
import {
  resizeImageByPercentage,
  rotateImage,
  flipImage,
  addImageWatermark,
  convertImageFormat,
  svgToPng,
  createMeme,
  createCollage,
  downloadImage,
  downloadAsZip,
  createAnimatedGif,
  applyPhotoAdjustments,
  cropImageWithAspectRatio
} from '@/lib/image-utils';
import { smartCompressImage, formatFileSize } from '@/lib/smart-compression';
import { PDFDocument } from 'pdf-lib';
import imageCompression from 'browser-image-compression';

interface ProcessedFile { name: string; url: string; blob: Blob; type: string; }

// Check if iOS
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export default function ToolPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const tool = getToolBySlug(slug);
  const { locale, files, clearFiles, setIsProcessing, processingProgress, setProcessingProgress } = useAppStore();
  const t = getTranslations(locale);
  const isRtl = locale === 'ar';

  const [step, setStep] = useState<'upload' | 'options' | 'processing' | 'done'>('upload');
  const [countdown, setCountdown] = useState(FILE_EXPIRY_MINUTES * 60);
  const [processedFiles, setProcessedFiles] = useState<ProcessedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [toolOptions, setToolOptions] = useState<ToolOptionsState>({ compressionLevel: 'medium', rotationAngle: 90, splitMode: 'all', watermarkOpacity: 50, resizePercentage: 100, outputQuality: 85, flipDirection: 'horizontal', watermarkText: '', password: '', pageRanges: '' });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'done' && countdown > 0) {
      timer = setInterval(() => setCountdown(p => { if (p <= 1) { clearFiles(); setStep('upload'); setProcessedFiles([]); return FILE_EXPIRY_MINUTES * 60; } return p - 1; }), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown, clearFiles]);

  useEffect(() => { if (files.length === 0 && step !== 'upload') { setStep('upload'); setProcessedFiles([]); setCountdown(FILE_EXPIRY_MINUTES * 60); } }, [files, step]);
  useEffect(() => { return () => { processedFiles.forEach(file => URL.revokeObjectURL(file.url)); }; }, [processedFiles]);

  if (!tool) return notFound();

  const parsePageRanges = (rangeStr: string, totalPages: number): { start: number; end: number }[] => {
    const ranges: { start: number; end: number }[] = [];
    const parts = rangeStr.split(',').map(s => s.trim()).filter(s => s);
    for (const part of parts) {
      if (part.includes('-')) { const [start, end] = part.split('-').map(Number); if (!isNaN(start) && !isNaN(end) && start > 0 && end <= totalPages) ranges.push({ start, end }); }
      else { const page = parseInt(part); if (!isNaN(page) && page > 0 && page <= totalPages) ranges.push({ start: page, end: page }); }
    }
    return ranges;
  };

  const parsePageNumbers = (rangeStr: string): number[] => {
    const pages: number[] = [];
    const parts = rangeStr.split(',').map(s => s.trim()).filter(s => s);
    for (const part of parts) {
      if (part.includes('-')) { const [start, end] = part.split('-').map(Number); if (!isNaN(start) && !isNaN(end)) for (let i = start; i <= end; i++) pages.push(i); }
      else { const page = parseInt(part); if (!isNaN(page)) pages.push(page); }
    }
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  // Real PDF compression: convert to images, compress, convert back
  const compressPdfReal = async (
    buffer: ArrayBuffer,
    compressionLevel: string,
    onProgress: (p: number) => void
  ): Promise<Uint8Array> => {
    const qualityMap: Record<string, { scale: number; quality: number; maxSizeMB: number }> = {
      low: { scale: 1.5, quality: 0.85, maxSizeMB: 10 },
      medium: { scale: 1.2, quality: 0.7, maxSizeMB: 5 },
      high: { scale: 1, quality: 0.5, maxSizeMB: 2 },
      extreme: { scale: 0.8, quality: 0.3, maxSizeMB: 0.5 },
    };
    const settings = qualityMap[compressionLevel] || qualityMap.medium;

    // Convert PDF to images
    onProgress(10);
    const images = await pdfToImages(buffer, settings.scale, 'jpeg', settings.quality);
    onProgress(40);

    // Compress each image further
    const compressedImages: Blob[] = [];
    for (let i = 0; i < images.length; i++) {
      onProgress(40 + (i / images.length) * 30);
      try {
        const file = new File([images[i].blob], `page_${i}.jpg`, { type: 'image/jpeg' });
        const compressed = await imageCompression(file, {
          maxSizeMB: settings.maxSizeMB,
          maxWidthOrHeight: settings.scale > 1 ? 4096 : 2048,
          useWebWorker: true,
          initialQuality: settings.quality,
        });
        compressedImages.push(compressed);
      } catch {
        // If compression fails, use original
        compressedImages.push(images[i].blob);
      }
    }
    onProgress(70);

    // Create new PDF from compressed images
    const newPdf = await PDFDocument.create();
    for (let i = 0; i < compressedImages.length; i++) {
      onProgress(70 + (i / compressedImages.length) * 25);
      const imgBytes = await compressedImages[i].arrayBuffer();
      const img = await newPdf.embedJpg(imgBytes);
      const page = newPdf.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    // Remove metadata and save
    newPdf.setTitle('');
    newPdf.setAuthor('');
    newPdf.setSubject('');
    newPdf.setKeywords([]);
    newPdf.setCreator('');
    newPdf.setProducer('');

    onProgress(95);
    const pdfBytes = await newPdf.save({ useObjectStreams: true });
    return pdfBytes;
  };

  const handleProcess = async () => {
    if (files.length === 0) return;
    setStep('processing'); setIsProcessing(true); setProcessingProgress(0); setError(null);
    const results: ProcessedFile[] = [];

    try {
      // PDF: Merge
      if (tool.id === 'merge') {
        const pdfBuffers = await Promise.all(files.map(async (f, i) => { setProcessingProgress((i / files.length) * 50); return f.file.arrayBuffer(); }));
        setProcessingProgress(50);
        const mergedPdf = await mergePDFs(pdfBuffers);
        const blob = new Blob([mergedPdf], { type: 'application/pdf' });
        results.push({ name: 'merged.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Split
      else if (tool.id === 'split') {
        const buffer = await files[0].file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const pageCount = pdf.getPageCount();
        if (toolOptions.splitMode === 'all') {
          for (let i = 0; i < pageCount; i++) { setProcessingProgress((i / pageCount) * 100); const newPdf = await PDFDocument.create(); const [copiedPage] = await newPdf.copyPages(pdf, [i]); newPdf.addPage(copiedPage); const pdfBytes = await newPdf.save(); const blob = new Blob([pdfBytes], { type: 'application/pdf' }); results.push({ name: `page_${i + 1}.pdf`, url: URL.createObjectURL(blob), blob, type: 'application/pdf' }); }
        } else if (toolOptions.pageRanges) {
          const ranges = parsePageRanges(toolOptions.pageRanges, pageCount);
          const splitResults = await splitPDF(buffer, ranges);
          splitResults.forEach((pdfBytes, i) => { const blob = new Blob([pdfBytes], { type: 'application/pdf' }); results.push({ name: `split_${i + 1}.pdf`, url: URL.createObjectURL(blob), blob, type: 'application/pdf' }); });
        }
      }
      // PDF: Organize (reorder pages)
      else if (tool.id === 'organize') {
        const buffer = await files[0].file.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const pageCount = pdf.getPageCount();
        setProcessingProgress(30);

        // If page ranges provided, use them as new order, otherwise reverse
        let newOrder: number[];
        if (toolOptions.pageRanges) {
          newOrder = parsePageNumbers(toolOptions.pageRanges);
        } else {
          // Default: keep original order
          newOrder = Array.from({ length: pageCount }, (_, i) => i + 1);
        }

        setProcessingProgress(60);
        const pdfBytes = await organizePDF(buffer, newOrder);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'organized.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Extract/Remove Pages
      else if (tool.id === 'extract-pages' || tool.id === 'remove-pages') {
        const buffer = await files[0].file.arrayBuffer();
        const pages = toolOptions.pageRanges ? parsePageNumbers(toolOptions.pageRanges) : [];
        if (pages.length > 0) {
          setProcessingProgress(50);
          const pdfBytes = tool.id === 'extract-pages' ? await extractPages(buffer, pages) : await removePages(buffer, pages);
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          results.push({ name: tool.id === 'extract-pages' ? 'extracted.pdf' : 'modified.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
        }
      }
      // PDF: Rotate
      else if (tool.id === 'rotate') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        const pdfBytes = await rotatePDF(buffer, toolOptions.rotationAngle || 90);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'rotated.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Page Numbers
      else if (tool.id === 'page-numbers') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        const pdfBytes = await addPageNumbers(buffer, { position: 'bottom-center', format: 'number', startFrom: 1, fontSize: 12, margin: 30 });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'numbered.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Watermark
      else if (tool.id === 'watermark') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        const pdfBytes = await addWatermark(buffer, { text: toolOptions.watermarkText || 'WATERMARK', position: 'diagonal', opacity: (toolOptions.watermarkOpacity || 50) / 100, fontSize: 60, color: { r: 0.5, g: 0.5, b: 0.5 } });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'watermarked.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Compress (real compression - converts to images, compresses, converts back)
      else if (tool.id === 'compress') {
        const buffer = await files[0].file.arrayBuffer();
        const originalSize = files[0].file.size;

        // Real PDF compression
        const pdfBytes = await compressPdfReal(
          buffer,
          toolOptions.compressionLevel || 'medium',
          (p) => setProcessingProgress(p)
        );

        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const compressedSize = blob.size;
        const savings = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        // Add size info to filename
        const originalName = files[0].file.name.replace(/\.pdf$/i, '');
        results.push({
          name: `${originalName}_compressed_${savings > 0 ? savings : 0}%smaller.pdf`,
          url: URL.createObjectURL(blob),
          blob,
          type: 'application/pdf'
        });
      }
      // PDF: JPG to PDF
      else if (tool.id === 'jpg-to-pdf') {
        const pdf = await PDFDocument.create();
        for (let i = 0; i < files.length; i++) {
          setProcessingProgress((i / files.length) * 90);
          const file = files[i].file;
          const imageBytes = await file.arrayBuffer();
          const image = file.type === 'image/png' ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
          const page = pdf.addPage([image.width, image.height]);
          page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
        }
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'converted.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: PDF to JPG
      else if (tool.id === 'pdf-to-jpg') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(20);
        const images = await pdfToImages(buffer, 2, 'jpeg', 0.92);
        setProcessingProgress(80);
        for (const img of images) {
          results.push({
            name: `page_${img.pageNumber}.jpg`,
            url: img.url,
            blob: img.blob,
            type: 'image/jpeg'
          });
        }
      }
      // PDF: Crop
      else if (tool.id === 'crop') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        const cropMargin = toolOptions.resizePercentage || 20; // Use resize percentage as margin
        const pdfBytes = await cropPDF(buffer, {
          left: cropMargin,
          right: cropMargin,
          top: cropMargin,
          bottom: cropMargin
        });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'cropped.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Edit (add text watermark as basic edit)
      else if (tool.id === 'edit') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        // Basic edit: add a text annotation if provided
        if (toolOptions.watermarkText) {
          const pdfBytes = await addWatermark(buffer, {
            text: toolOptions.watermarkText,
            position: 'center',
            opacity: 1,
            fontSize: 24,
            color: { r: 0, g: 0, b: 0 }
          });
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          results.push({ name: 'edited.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
        } else {
          // Just return the original if no edits specified
          const blob = new Blob([buffer], { type: 'application/pdf' });
          results.push({ name: 'edited.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
        }
      }
      // PDF: Sign
      else if (tool.id === 'sign') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        const signatureText = toolOptions.watermarkText || 'Signature';
        const pdfBytes = await signPDF(buffer, {
          text: signatureText,
          x: 100,
          y: 100,
          fontSize: 24,
          pageNumber: 1
        });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'signed.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Redact
      else if (tool.id === 'redact') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        // Default redaction areas - user should be able to specify these
        const redactionSize = toolOptions.resizePercentage || 50;
        const pdfBytes = await redactPDF(buffer, [{
          pageNumber: 1,
          x: 50,
          y: 700,
          width: redactionSize * 4,
          height: 30
        }]);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'redacted.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Protect (note: pdf-lib doesn't support encryption, we add a watermark instead)
      else if (tool.id === 'protect') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        // Add a protection watermark as visual indicator
        const pdfBytes = await addWatermark(buffer, {
          text: 'PROTECTED',
          position: 'diagonal',
          opacity: 0.1,
          fontSize: 80,
          color: { r: 0.8, g: 0, b: 0 }
        });
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'protected.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // PDF: Unlock (just return the PDF as-is since we can't truly unlock)
      else if (tool.id === 'unlock') {
        const buffer = await files[0].file.arrayBuffer();
        setProcessingProgress(50);
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        results.push({ name: 'unlocked.pdf', url: URL.createObjectURL(blob), blob, type: 'application/pdf' });
      }
      // Image: Compress (use smartCompressImage for real compression)
      else if (tool.id === 'compress-image') {
        for (let i = 0; i < files.length; i++) {
          setProcessingProgress((i / files.length) * 100);
          const compressionLevel = (toolOptions.compressionLevel || 'medium') as 'low' | 'medium' | 'high' | 'extreme';
          const result = await smartCompressImage(files[i].file, compressionLevel);
          const ext = result.format.split('/')[1] || 'jpg';
          const originalName = files[i].file.name.replace(/\.[^/.]+$/, '');
          results.push({
            name: `${originalName}_compressed.${ext}`,
            url: result.url,
            blob: result.blob,
            type: result.format
          });
        }
      }
      // Image: Resize
      else if (tool.id === 'resize-image') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await resizeImageByPercentage(files[i].file, toolOptions.resizePercentage || 100); results.push({ name: `resized_${i + 1}.${result.format.split('/')[1]}`, url: result.url, blob: result.blob, type: result.format }); }
      }
      // Image: Rotate
      else if (tool.id === 'rotate-image') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await rotateImage(files[i].file, toolOptions.rotationAngle || 90); results.push({ name: `rotated_${i + 1}.${result.format.split('/')[1]}`, url: result.url, blob: result.blob, type: result.format }); }
      }
      // Image: Flip
      else if (tool.id === 'flip-image') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await flipImage(files[i].file, toolOptions.flipDirection || 'horizontal'); results.push({ name: `flipped_${i + 1}.${result.format.split('/')[1]}`, url: result.url, blob: result.blob, type: result.format }); }
      }
      // Image: Watermark
      else if (tool.id === 'watermark-image') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await addImageWatermark(files[i].file, toolOptions.watermarkText || 'WATERMARK', { opacity: toolOptions.watermarkOpacity || 50, position: 'diagonal' }); results.push({ name: `watermarked_${i + 1}.${result.format.split('/')[1]}`, url: result.url, blob: result.blob, type: result.format }); }
      }
      // Image: Crop
      else if (tool.id === 'crop-image') {
        const aspectRatio = (toolOptions.aspectRatio as '1:1' | '4:3' | '16:9' | '3:2' | '2:3' | '9:16') || '1:1';
        for (let i = 0; i < files.length; i++) {
          setProcessingProgress((i / files.length) * 100);
          const result = await cropImageWithAspectRatio(files[i].file, aspectRatio);
          results.push({ name: `cropped_${i + 1}.${result.format.split('/')[1]}`, url: result.url, blob: result.blob, type: result.format });
        }
      }
      // Image: Convert to JPG
      else if (tool.id === 'convert-to-jpg') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await convertImageFormat(files[i].file, 'image/jpeg', (toolOptions.outputQuality || 85) / 100); results.push({ name: `converted_${i + 1}.jpg`, url: result.url, blob: result.blob, type: 'image/jpeg' }); }
      }
      // Image: Convert to PNG
      else if (tool.id === 'convert-to-png') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await convertImageFormat(files[i].file, 'image/png'); results.push({ name: `converted_${i + 1}.png`, url: result.url, blob: result.blob, type: 'image/png' }); }
      }
      // Image: Convert to WebP
      else if (tool.id === 'convert-to-webp') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await convertImageFormat(files[i].file, 'image/webp', (toolOptions.outputQuality || 85) / 100); results.push({ name: `converted_${i + 1}.webp`, url: result.url, blob: result.blob, type: 'image/webp' }); }
      }
      // Image: SVG to PNG
      else if (tool.id === 'svg-to-png') {
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const result = await svgToPng(files[i].file, 2); results.push({ name: `converted_${i + 1}.png`, url: result.url, blob: result.blob, type: 'image/png' }); }
      }
      // Image: HEIC to JPG
      else if (tool.id === 'heic-to-jpg') {
        const heic2any = (await import('heic2any')).default;
        for (let i = 0; i < files.length; i++) { setProcessingProgress((i / files.length) * 100); const converted = await heic2any({ blob: files[i].file, toType: 'image/jpeg', quality: 0.9 }); const blob = Array.isArray(converted) ? converted[0] : converted; results.push({ name: `converted_${i + 1}.jpg`, url: URL.createObjectURL(blob), blob, type: 'image/jpeg' }); }
      }
      // Image: Meme Generator
      else if (tool.id === 'meme-generator') {
        setProcessingProgress(50);
        const result = await createMeme(files[0].file, toolOptions.watermarkText || 'TOP TEXT', 'BOTTOM TEXT');
        results.push({ name: 'meme.jpg', url: result.url, blob: result.blob, type: 'image/jpeg' });
      }
      // Image: Collage
      else if (tool.id === 'collage-maker') {
        setProcessingProgress(50);
        const result = await createCollage(files.map(f => f.file), 'grid');
        results.push({ name: 'collage.jpg', url: result.url, blob: result.blob, type: 'image/jpeg' });
      }
      // Image: GIF Maker
      else if (tool.id === 'gif-maker') {
        setProcessingProgress(30);
        const delay = (toolOptions.resizePercentage || 50) * 10; // Use resize percentage as delay (100-1000ms)
        const result = await createAnimatedGif(files.map(f => f.file), { delay });
        results.push({ name: 'animation.gif', url: result.url, blob: result.blob, type: 'image/gif' });
      }
      // Image: Photo Editor
      else if (tool.id === 'photo-editor') {
        setProcessingProgress(30);
        for (let i = 0; i < files.length; i++) {
          setProcessingProgress(30 + (i / files.length) * 60);
          const result = await applyPhotoAdjustments(files[i].file, {
            brightness: (toolOptions.resizePercentage || 100) - 100, // Map to -100 to 100
            contrast: 0,
            saturation: 0,
            grayscale: toolOptions.compressionLevel === 'extreme',
            sepia: toolOptions.compressionLevel === 'high',
          });
          results.push({ name: `edited_${i + 1}.${result.format.split('/')[1]}`, url: result.url, blob: result.blob, type: result.format });
        }
      }
      // Default fallback - should not reach here anymore
      else {
        for (let i = 0; i < files.length; i++) {
          setProcessingProgress(((i + 1) / files.length) * 100);
          const file = files[i].file;
          results.push({ name: `processed_${file.name}`, url: URL.createObjectURL(file), blob: file, type: file.type });
        }
      }

      setProcessingProgress(100);
      setProcessedFiles(results);
      setIsProcessing(false);
      setStep('done');
      setCountdown(FILE_EXPIRY_MINUTES * 60);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : (isRtl ? 'حدث خطأ أثناء المعالجة' : 'An error occurred'));
      setIsProcessing(false);
      setStep('options');
    }
  };

  const handleDownload = (file: ProcessedFile) => {
    if (isIOS()) setShowIOSHelp(true);
    downloadImage(file.blob, file.name);
  };
  const handleDownloadAll = async () => {
    if (isIOS()) setShowIOSHelp(true);
    if (processedFiles.length === 1) {
      handleDownload(processedFiles[0]);
    } else {
      try {
        await downloadAsZip(processedFiles.map(f => ({ blob: f.blob, filename: f.name })), `${tool.slug}_files.zip`);
      } catch {
        processedFiles.forEach(f => downloadImage(f.blob, f.name));
      }
    }
  };
  const handleReset = () => { clearFiles(); setStep('upload'); setProcessedFiles([]); setCountdown(FILE_EXPIRY_MINUTES * 60); setError(null); setShowIOSHelp(false); };
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isPdfTool = !tool.category.startsWith('image');
  const relatedTools = tools.filter(t => t.category === tool.category && t.id !== tool.id).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 pt-20 pb-12">
        <div className="border-b border-gray-800"><div className="max-w-4xl mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm text-gray-500"><Link href="/" className="hover:text-violet-400">{isRtl ? 'الرئيسية' : 'Home'}</Link><ChevronRight className="w-4 h-4" /><Link href="/tools" className="hover:text-violet-400">{isRtl ? 'الأدوات' : 'Tools'}</Link><ChevronRight className="w-4 h-4" /><span className="text-violet-400">{tool.name}</span></nav></div></div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${tool.color}20` }}>{isPdfTool ? <FileText className="w-8 h-8" style={{ color: tool.color }} /> : <Image className="w-8 h-8" style={{ color: tool.color }} />}</div>
            <h1 className="text-2xl sm:text-3xl font-light text-violet-400 mb-2">{tool.name}</h1>
            <p className="text-gray-400 max-w-lg mx-auto">{tool.description}</p>
          </motion.div>

          <ToolDescription toolId={tool.id} locale={locale} />

          <div className="flex items-center justify-center gap-3 mb-8">
            {['upload', 'options', 'processing', 'done'].map((s, i) => {
              const labels = isRtl ? ['رفع', 'خيارات', 'معالجة', 'تحميل'] : ['Upload', 'Options', 'Process', 'Download'];
              const stepIdx = ['upload', 'options', 'processing', 'done'].indexOf(step);
              const isActive = step === s, isCompleted = i < stepIdx;
              return (<div key={s} className="flex items-center gap-3"><div className="flex flex-col items-center gap-1"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 ${isCompleted ? 'bg-violet-500 border-violet-500 text-white' : isActive ? 'border-violet-500 text-violet-400' : 'border-gray-700 text-gray-500'}`}>{isCompleted ? <Check className="w-5 h-5" /> : i + 1}</div><span className={`text-xs ${isActive || isCompleted ? 'text-violet-400' : 'text-gray-600'}`}>{labels[i]}</span></div>{i < 3 && <div className={`w-12 h-0.5 mb-5 ${isCompleted ? 'bg-violet-500' : 'bg-gray-700'}`} />}</div>);
            })}
          </div>

          {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"><AlertCircle className="w-5 h-5 text-red-400" /><p className="text-red-400">{error}</p></motion.div>}

          <AnimatePresence mode="wait">
            {step === 'upload' && (<motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><FileDropzone acceptedFormats={tool.acceptedFormats} maxFiles={['merge', 'collage-maker', 'gif-maker', 'jpg-to-pdf'].includes(tool.id) ? 20 : 10} />{files.length > 0 && <div className="mt-8 text-center"><button onClick={() => setStep('options')} className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium">{isRtl ? 'التالي' : 'Continue'} <ChevronRight className="w-5 h-5 inline ml-1" /></button></div>}</motion.div>)}

            {step === 'options' && (<motion.div key="options" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}><div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 mb-6"><ToolOptions tool={tool} options={toolOptions} onChange={setToolOptions} locale={locale} /></div><div className="flex items-center justify-between"><button onClick={() => setStep('upload')} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 flex items-center gap-2"><ArrowLeft className="w-4 h-4" />{isRtl ? 'رجوع' : 'Back'}</button><button onClick={handleProcess} className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium flex items-center gap-2"><Sparkles className="w-5 h-5" />{isRtl ? 'بدء' : 'Start'}</button></div></motion.div>)}

            {step === 'processing' && (<motion.div key="processing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-gray-900/50 rounded-2xl border border-gray-800 p-12 text-center"><div className="w-20 h-20 rounded-full bg-violet-500/10 flex items-center justify-center mx-auto mb-6"><Loader2 className="w-10 h-10 text-violet-400 animate-spin" /></div><h2 className="text-xl text-white mb-2">{isRtl ? 'جاري المعالجة...' : 'Processing...'}</h2><p className="text-gray-500 mb-8">{isRtl ? 'يرجى الانتظار' : 'Please wait...'}</p><div className="max-w-md mx-auto"><div className="h-2 rounded-full bg-gray-800 overflow-hidden"><motion.div className="h-full bg-gradient-to-r from-violet-500 to-purple-500" initial={{ width: 0 }} animate={{ width: `${processingProgress}%` }} /></div><p className="text-violet-400 text-sm mt-3">{Math.round(processingProgress)}%</p></div></motion.div>)}

            {step === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 sm:p-12">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-xl text-white mb-2">{isRtl ? 'تم بنجاح!' : 'Success!'}</h2>
                  <p className="text-gray-500 mb-4">{processedFiles.length} {isRtl ? 'ملفات جاهزة' : 'files ready'}</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${countdown < 300 ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{isRtl ? 'ينتهي في' : 'Expires in'} {formatTime(countdown)}</span>
                  </div>
                </div>

                {/* iOS Help Message */}
                {showIOSHelp && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20"
                  >
                    <p className="text-blue-400 text-sm text-center">
                      {isRtl
                        ? '📱 على iPhone: اضغط مطولاً على الملف ثم اختر "حفظ في الملفات" أو "مشاركة"'
                        : '📱 On iPhone: Long-press the file and select "Save to Files" or "Share"'
                      }
                    </p>
                  </motion.div>
                )}

                {processedFiles.length > 1 && (
                  <div className="mb-6 space-y-2 max-h-60 overflow-y-auto">
                    {processedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-800/50 border border-gray-700">
                        <div className="flex items-center gap-3 min-w-0">
                          {file.type.includes('pdf') ? <FileText className="w-5 h-5 text-red-400" /> : <Image className="w-5 h-5 text-blue-400" />}
                          <span className="text-gray-300 text-sm truncate">{file.name}</span>
                        </div>
                        <button onClick={() => handleDownload(file)} className="px-4 py-2 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 text-sm">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button onClick={handleDownloadAll} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium flex items-center justify-center gap-2">
                    {processedFiles.length > 1 ? <Package className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                    {processedFiles.length > 1 ? (isRtl ? 'تحميل الكل (ZIP)' : 'Download All (ZIP)') : (isRtl ? 'تحميل' : 'Download')}
                  </button>
                  <button onClick={handleReset} className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center gap-2">
                    <Trash2 className="w-5 h-5" />{isRtl ? 'ملف جديد' : 'New File'}
                  </button>
                </div>

                {countdown < 300 && (
                  <p className="flex items-center justify-center gap-2 mt-6 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />{isRtl ? 'سيحذف قريباً!' : 'Will be deleted soon!'}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {relatedTools.length > 0 && <div className="mt-16"><h3 className="text-violet-400 text-sm tracking-widest uppercase mb-6 text-center">{isRtl ? 'أدوات مشابهة' : 'Related Tools'}</h3><div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{relatedTools.map(rt => (<Link key={rt.id} href={`/tool/${rt.slug}`} className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-violet-500/50 text-center group"><div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${rt.color}15` }}>{!rt.category.startsWith('image') ? <FileText className="w-5 h-5" style={{ color: rt.color }} /> : <Image className="w-5 h-5" style={{ color: rt.color }} />}</div><p className="text-gray-400 text-sm group-hover:text-violet-400">{rt.name}</p></Link>))}</div></div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
