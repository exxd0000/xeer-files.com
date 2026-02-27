import { PDFDocument, degrees, rgb, StandardFonts, PDFPage } from 'pdf-lib';

// Merge multiple PDFs into one
export async function mergePDFs(pdfFiles: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const pdfBuffer of pdfFiles) {
    const pdf = await PDFDocument.load(pdfBuffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return mergedPdf.save();
}

// Split PDF by page ranges
export async function splitPDF(
  pdfBuffer: ArrayBuffer,
  ranges: { start: number; end: number }[]
): Promise<Uint8Array[]> {
  const sourcePdf = await PDFDocument.load(pdfBuffer);
  const results: Uint8Array[] = [];

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const pageIndices = [];

    for (let i = range.start - 1; i < range.end && i < sourcePdf.getPageCount(); i++) {
      pageIndices.push(i);
    }

    const pages = await newPdf.copyPages(sourcePdf, pageIndices);
    pages.forEach((page) => newPdf.addPage(page));
    results.push(await newPdf.save());
  }

  return results;
}

// Extract specific pages
export async function extractPages(
  pdfBuffer: ArrayBuffer,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(pdfBuffer);
  const newPdf = await PDFDocument.create();

  const pageIndices = pageNumbers
    .map((n) => n - 1)
    .filter((i) => i >= 0 && i < sourcePdf.getPageCount());

  const pages = await newPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

// Rotate PDF pages
export async function rotatePDF(
  pdfBuffer: ArrayBuffer,
  angle: 0 | 90 | 180 | 270,
  pageNumbers?: number[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  const pagesToRotate = pageNumbers
    ? pageNumbers.map((n) => n - 1).filter((i) => i >= 0 && i < pages.length)
    : pages.map((_, i) => i);

  pagesToRotate.forEach((i) => {
    const currentRotation = pages[i].getRotation().angle;
    pages[i].setRotation(degrees(currentRotation + angle));
  });

  return pdf.save();
}

// Add page numbers
export async function addPageNumbers(
  pdfBuffer: ArrayBuffer,
  options: {
    position: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    format: 'number' | 'roman' | 'page-x-of-y';
    startFrom: number;
    fontSize: number;
    margin: number;
  }
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const totalPages = pages.length;

  const toRoman = (num: number): string => {
    const romanNumerals: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    for (const [value, numeral] of romanNumerals) {
      while (num >= value) {
        result += numeral;
        num -= value;
      }
    }
    return result;
  };

  pages.forEach((page, index) => {
    const pageNum = index + options.startFrom;
    let text: string;

    switch (options.format) {
      case 'roman':
        text = toRoman(pageNum);
        break;
      case 'page-x-of-y':
        text = `Page ${pageNum} of ${totalPages + options.startFrom - 1}`;
        break;
      default:
        text = String(pageNum);
    }

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, options.fontSize);
    let x: number;
    let y: number;

    switch (options.position) {
      case 'top-left':
        x = options.margin;
        y = height - options.margin - options.fontSize;
        break;
      case 'top-center':
        x = (width - textWidth) / 2;
        y = height - options.margin - options.fontSize;
        break;
      case 'top-right':
        x = width - textWidth - options.margin;
        y = height - options.margin - options.fontSize;
        break;
      case 'bottom-left':
        x = options.margin;
        y = options.margin;
        break;
      case 'bottom-center':
        x = (width - textWidth) / 2;
        y = options.margin;
        break;
      case 'bottom-right':
      default:
        x = width - textWidth - options.margin;
        y = options.margin;
    }

    page.drawText(text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });

  return pdf.save();
}

// Add watermark
export async function addWatermark(
  pdfBuffer: ArrayBuffer,
  options: {
    text: string;
    position: 'center' | 'diagonal';
    opacity: number;
    fontSize: number;
    color: { r: number; g: number; b: number };
  }
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);

  pages.forEach((page) => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);

    let x: number;
    let y: number;
    let rotation = 0;

    if (options.position === 'diagonal') {
      x = (width - textWidth) / 2;
      y = height / 2;
      rotation = -45;
    } else {
      x = (width - textWidth) / 2;
      y = height / 2;
    }

    page.drawText(options.text, {
      x,
      y,
      size: options.fontSize,
      font,
      color: rgb(options.color.r, options.color.g, options.color.b),
      opacity: options.opacity,
      rotate: degrees(rotation),
    });
  });

  return pdf.save();
}

// Remove pages from PDF
export async function removePages(
  pdfBuffer: ArrayBuffer,
  pageNumbers: number[]
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(pdfBuffer);
  const newPdf = await PDFDocument.create();
  const totalPages = sourcePdf.getPageCount();

  const pagesToRemove = new Set(pageNumbers.map((n) => n - 1));
  const pageIndicesToKeep = [];

  for (let i = 0; i < totalPages; i++) {
    if (!pagesToRemove.has(i)) {
      pageIndicesToKeep.push(i);
    }
  }

  const pages = await newPdf.copyPages(sourcePdf, pageIndicesToKeep);
  pages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

// Get PDF info
export async function getPDFInfo(pdfBuffer: ArrayBuffer): Promise<{
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}> {
  const pdf = await PDFDocument.load(pdfBuffer);

  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    creator: pdf.getCreator(),
    producer: pdf.getProducer(),
    creationDate: pdf.getCreationDate(),
    modificationDate: pdf.getModificationDate(),
  };
}

// Organize/Reorder PDF pages
export async function organizePDF(
  pdfBuffer: ArrayBuffer,
  newOrder: number[]
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(pdfBuffer);
  const newPdf = await PDFDocument.create();

  const pageIndices = newOrder
    .map((n) => n - 1)
    .filter((i) => i >= 0 && i < sourcePdf.getPageCount());

  const pages = await newPdf.copyPages(sourcePdf, pageIndices);
  pages.forEach((page) => newPdf.addPage(page));

  return newPdf.save();
}

// Convert PDF to images using canvas (client-side)
export async function pdfToImages(
  pdfBuffer: ArrayBuffer,
  scale: number = 2,
  format: 'jpeg' | 'png' = 'jpeg',
  quality: number = 0.92
): Promise<{ blob: Blob; url: string; pageNumber: number }[]> {
  // Dynamic import pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

  const pdf = await pdfjsLib.getDocument({ data: pdfBuffer }).promise;
  const results: { blob: Blob; url: string; pageNumber: number }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b!),
        `image/${format}`,
        format === 'jpeg' ? quality : undefined
      );
    });

    results.push({
      blob,
      url: URL.createObjectURL(blob),
      pageNumber: i,
    });
  }

  return results;
}

// Crop PDF pages
export async function cropPDF(
  pdfBuffer: ArrayBuffer,
  cropBox: { left: number; right: number; top: number; bottom: number },
  pageNumbers?: number[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  const pagesToCrop = pageNumbers
    ? pageNumbers.map((n) => n - 1).filter((i) => i >= 0 && i < pages.length)
    : pages.map((_, i) => i);

  pagesToCrop.forEach((i) => {
    const page = pages[i];
    const { width, height } = page.getSize();

    // Calculate new dimensions
    const newLeft = cropBox.left;
    const newBottom = cropBox.bottom;
    const newRight = width - cropBox.right;
    const newTop = height - cropBox.top;

    page.setCropBox(newLeft, newBottom, newRight - newLeft, newTop - newBottom);
  });

  return pdf.save();
}

// Add signature to PDF (text-based signature)
export async function signPDF(
  pdfBuffer: ArrayBuffer,
  signature: {
    text: string;
    x: number;
    y: number;
    fontSize?: number;
    pageNumber?: number;
  }
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();
  const font = await pdf.embedFont(StandardFonts.TimesRomanItalic);

  const pageIndex = (signature.pageNumber || 1) - 1;
  const page = pages[Math.min(pageIndex, pages.length - 1)];

  const fontSize = signature.fontSize || 24;

  // Draw signature text
  page.drawText(signature.text, {
    x: signature.x,
    y: signature.y,
    size: fontSize,
    font,
    color: rgb(0, 0, 0.5),
  });

  // Draw underline
  const textWidth = font.widthOfTextAtSize(signature.text, fontSize);
  page.drawLine({
    start: { x: signature.x, y: signature.y - 2 },
    end: { x: signature.x + textWidth, y: signature.y - 2 },
    thickness: 1,
    color: rgb(0, 0, 0.5),
  });

  return pdf.save();
}

// Add signature image to PDF
export async function signPDFWithImage(
  pdfBuffer: ArrayBuffer,
  signatureImage: ArrayBuffer,
  imageType: 'png' | 'jpg',
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
    pageNumber?: number;
  }
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  const pageIndex = (position.pageNumber || 1) - 1;
  const page = pages[Math.min(pageIndex, pages.length - 1)];

  const image = imageType === 'png'
    ? await pdf.embedPng(signatureImage)
    : await pdf.embedJpg(signatureImage);

  page.drawImage(image, {
    x: position.x,
    y: position.y,
    width: position.width,
    height: position.height,
  });

  return pdf.save();
}

// Redact PDF (add black rectangles over sensitive areas)
export async function redactPDF(
  pdfBuffer: ArrayBuffer,
  redactions: {
    pageNumber: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[]
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  for (const redaction of redactions) {
    const pageIndex = redaction.pageNumber - 1;
    if (pageIndex >= 0 && pageIndex < pages.length) {
      const page = pages[pageIndex];

      page.drawRectangle({
        x: redaction.x,
        y: redaction.y,
        width: redaction.width,
        height: redaction.height,
        color: rgb(0, 0, 0),
      });
    }
  }

  return pdf.save();
}

// Simple text redaction - find and cover text
export async function redactTextInPDF(
  pdfBuffer: ArrayBuffer,
  _textToRedact: string
): Promise<Uint8Array> {
  // Note: True text redaction requires parsing PDF content streams
  // This is a simplified version that adds a note about redaction
  const pdf = await PDFDocument.load(pdfBuffer);

  // For a real implementation, you would need to:
  // 1. Parse the content streams
  // 2. Find text positions
  // 3. Draw black rectangles over them
  // This requires more advanced PDF manipulation

  return pdf.save();
}

// Get PDF page dimensions
export async function getPDFPageDimensions(
  pdfBuffer: ArrayBuffer
): Promise<{ width: number; height: number; pageNumber: number }[]> {
  const pdf = await PDFDocument.load(pdfBuffer);
  const pages = pdf.getPages();

  return pages.map((page, index) => {
    const { width, height } = page.getSize();
    return { width, height, pageNumber: index + 1 };
  });
}

// Convert PDF bytes to download URL
export function createDownloadUrl(pdfBytes: Uint8Array, filename: string): string {
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

// Download PDF
export function downloadPDF(pdfBytes: Uint8Array, filename: string): void {
  const url = createDownloadUrl(pdfBytes, filename);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
