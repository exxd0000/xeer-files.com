// Tool descriptions with detailed explanations in English and Arabic for ALL tools

export interface ToolDescription {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  howToUse: string[];
  howToUseAr: string[];
  tips: string[];
  tipsAr: string[];
  warnings?: string[];
  warningsAr?: string[];
}

export const toolDescriptions: Record<string, ToolDescription> = {
  // ═══════════════════════════════════════════════════════════
  // PDF TOOLS
  // ═══════════════════════════════════════════════════════════

  'merge': {
    id: 'merge',
    title: 'Merge PDF',
    titleAr: 'دمج PDF',
    description: 'Combine multiple PDF files into one document. Drag to reorder files before merging.',
    descriptionAr: 'دمج ملفات PDF متعددة في مستند واحد. اسحب لإعادة ترتيب الملفات قبل الدمج.',
    howToUse: ['Upload multiple PDF files', 'Drag to reorder if needed', 'Click Merge', 'Download merged PDF'],
    howToUseAr: ['ارفع ملفات PDF متعددة', 'اسحب لإعادة الترتيب إذا لزم', 'انقر دمج', 'حمّل PDF المدمج'],
    tips: ['Files merge in the order shown', 'Max 20 files per merge', 'Total size limit: 500MB'],
    tipsAr: ['الملفات تدمج بالترتيب المعروض', 'حد أقصى 20 ملف', 'الحجم الأقصى: 500 ميجا']
  },

  'split': {
    id: 'split',
    title: 'Split PDF',
    titleAr: 'تقسيم PDF',
    description: 'Separate PDF pages into individual files or custom ranges.',
    descriptionAr: 'فصل صفحات PDF إلى ملفات فردية أو نطاقات مخصصة.',
    howToUse: ['Upload PDF file', 'Choose split method', 'Specify pages/ranges', 'Download files as ZIP'],
    howToUseAr: ['ارفع ملف PDF', 'اختر طريقة التقسيم', 'حدد الصفحات/النطاقات', 'حمّل كملف ZIP'],
    tips: ['Use "1-3, 5, 7-10" format for ranges', 'All pages = each page separate', 'Extract = specific pages only'],
    tipsAr: ['استخدم صيغة "1-3, 5, 7-10"', 'كل الصفحات = كل صفحة منفصلة', 'استخراج = صفحات محددة فقط']
  },

  'organize': {
    id: 'organize',
    title: 'Organize PDF',
    titleAr: 'ترتيب PDF',
    description: 'Reorder, delete, or rotate pages in your PDF document.',
    descriptionAr: 'إعادة ترتيب أو حذف أو تدوير الصفحات في مستند PDF.',
    howToUse: ['Upload PDF', 'Drag pages to reorder', 'Select pages to delete/rotate', 'Download organized PDF'],
    howToUseAr: ['ارفع PDF', 'اسحب الصفحات للترتيب', 'حدد صفحات للحذف/التدوير', 'حمّل PDF المرتب'],
    tips: ['Click page to select', 'Shift+click for multiple', 'Changes preview in real-time'],
    tipsAr: ['انقر للتحديد', 'Shift+انقر لتحديد متعدد', 'المعاينة مباشرة']
  },

  'remove-pages': {
    id: 'remove-pages',
    title: 'Remove Pages',
    titleAr: 'حذف صفحات',
    description: 'Delete specific pages from your PDF document permanently.',
    descriptionAr: 'حذف صفحات محددة من مستند PDF بشكل دائم.',
    howToUse: ['Upload PDF', 'Enter page numbers to remove', 'Click Remove', 'Download new PDF'],
    howToUseAr: ['ارفع PDF', 'أدخل أرقام الصفحات', 'انقر حذف', 'حمّل PDF الجديد'],
    tips: ['Use "1, 3, 5-7" format', 'This action is permanent', 'Original file unchanged'],
    tipsAr: ['استخدم صيغة "1, 3, 5-7"', 'الإجراء دائم', 'الملف الأصلي لا يتغير']
  },

  'extract-pages': {
    id: 'extract-pages',
    title: 'Extract Pages',
    titleAr: 'استخراج صفحات',
    description: 'Extract specific pages from your PDF into a new document.',
    descriptionAr: 'استخراج صفحات محددة من PDF إلى مستند جديد.',
    howToUse: ['Upload PDF', 'Enter pages to extract', 'Click Extract', 'Download extracted PDF'],
    howToUseAr: ['ارفع PDF', 'أدخل الصفحات للاستخراج', 'انقر استخراج', 'حمّل PDF المستخرج'],
    tips: ['Use "1-5, 8, 10" format', 'Creates new PDF with selected pages', 'Order preserved'],
    tipsAr: ['استخدم صيغة "1-5, 8, 10"', 'ينشئ PDF جديد', 'الترتيب محفوظ']
  },

  'compress': {
    id: 'compress',
    title: 'Compress PDF',
    titleAr: 'ضغط PDF',
    description: 'Reduce PDF file size while maintaining quality. Choose compression level based on your needs.',
    descriptionAr: 'تقليل حجم ملف PDF مع الحفاظ على الجودة. اختر مستوى الضغط حسب احتياجاتك.',
    howToUse: ['Upload PDF file', 'Select compression level', 'Click Compress', 'Download smaller PDF'],
    howToUseAr: ['ارفع ملف PDF', 'اختر مستوى الضغط', 'انقر ضغط', 'حمّل PDF الأصغر'],
    tips: ['Low = best quality (10-20% reduction)', 'Medium = balanced (30-50%)', 'High = smaller file (50-70%)', 'Extreme = smallest (70-90%)'],
    tipsAr: ['منخفض = أفضل جودة (10-20%)', 'متوسط = متوازن (30-50%)', 'عالي = أصغر (50-70%)', 'أقصى = الأصغر (70-90%)'],
    warnings: ['High/Extreme may reduce image quality', 'Text remains sharp at all levels'],
    warningsAr: ['عالي/أقصى قد يقلل جودة الصور', 'النص يبقى واضحاً']
  },

  'jpg-to-pdf': {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    titleAr: 'JPG إلى PDF',
    description: 'Convert one or multiple images to a PDF document.',
    descriptionAr: 'تحويل صورة أو عدة صور إلى مستند PDF.',
    howToUse: ['Upload images', 'Arrange order if needed', 'Choose page size', 'Download PDF'],
    howToUseAr: ['ارفع الصور', 'رتب الترتيب إذا لزم', 'اختر حجم الصفحة', 'حمّل PDF'],
    tips: ['Supports JPG, PNG, GIF, WebP', 'Each image = one page', 'A4 is standard size'],
    tipsAr: ['يدعم JPG, PNG, GIF, WebP', 'كل صورة = صفحة', 'A4 هو الحجم القياسي']
  },

  'pdf-to-jpg': {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    titleAr: 'PDF إلى JPG',
    description: 'Convert PDF pages to JPG images. Each page becomes a separate image.',
    descriptionAr: 'تحويل صفحات PDF إلى صور JPG. كل صفحة تصبح صورة منفصلة.',
    howToUse: ['Upload PDF', 'Choose quality', 'Click Convert', 'Download images as ZIP'],
    howToUseAr: ['ارفع PDF', 'اختر الجودة', 'انقر تحويل', 'حمّل كـ ZIP'],
    tips: ['Higher quality = larger files', 'All pages converted', 'Output as ZIP archive'],
    tipsAr: ['جودة أعلى = ملفات أكبر', 'كل الصفحات تحول', 'الناتج كملف ZIP']
  },

  'edit': {
    id: 'edit',
    title: 'Edit PDF',
    titleAr: 'تحرير PDF',
    description: 'Add text, images, shapes, and annotations to your PDF.',
    descriptionAr: 'إضافة نص وصور وأشكال وتعليقات إلى PDF.',
    howToUse: ['Upload PDF', 'Use toolbar to add elements', 'Position and style', 'Save changes'],
    howToUseAr: ['ارفع PDF', 'استخدم الأدوات للإضافة', 'حدد الموقع والنمط', 'احفظ التغييرات'],
    tips: ['Double-click to edit text', 'Drag to move elements', 'Use layers panel'],
    tipsAr: ['انقر مرتين لتحرير النص', 'اسحب لتحريك العناصر', 'استخدم لوحة الطبقات']
  },

  'rotate': {
    id: 'rotate',
    title: 'Rotate PDF',
    titleAr: 'تدوير PDF',
    description: 'Rotate PDF pages by 90°, 180°, or 270°. Apply to all pages or specific ones.',
    descriptionAr: 'تدوير صفحات PDF بـ 90° أو 180° أو 270°. تطبيق على كل الصفحات أو صفحات محددة.',
    howToUse: ['Upload PDF', 'Select rotation angle', 'Choose pages to rotate', 'Download rotated PDF'],
    howToUseAr: ['ارفع PDF', 'اختر زاوية التدوير', 'اختر الصفحات', 'حمّل PDF المدوّر'],
    tips: ['90° = rotate right', '270° = rotate left', '180° = flip upside down'],
    tipsAr: ['90° = تدوير يمين', '270° = تدوير يسار', '180° = قلب']
  },

  'page-numbers': {
    id: 'page-numbers',
    title: 'Add Page Numbers',
    titleAr: 'إضافة أرقام الصفحات',
    description: 'Add page numbers to your PDF document with custom positioning and format.',
    descriptionAr: 'إضافة أرقام الصفحات إلى مستند PDF مع تخصيص الموقع والتنسيق.',
    howToUse: ['Upload PDF', 'Choose position', 'Select format', 'Download numbered PDF'],
    howToUseAr: ['ارفع PDF', 'اختر الموقع', 'اختر التنسيق', 'حمّل PDF المرقم'],
    tips: ['Format: 1,2,3 or I,II,III or Page 1 of 10', 'Start from any number', '6 position options'],
    tipsAr: ['التنسيق: 1,2,3 أو I,II,III أو صفحة 1 من 10', 'ابدأ من أي رقم', '6 خيارات للموقع']
  },

  'watermark': {
    id: 'watermark',
    title: 'Add Watermark',
    titleAr: 'إضافة علامة مائية',
    description: 'Add text or image watermark to your PDF pages.',
    descriptionAr: 'إضافة علامة مائية نصية أو صورة إلى صفحات PDF.',
    howToUse: ['Upload PDF', 'Choose text or image', 'Adjust opacity and position', 'Download watermarked PDF'],
    howToUseAr: ['ارفع PDF', 'اختر نص أو صورة', 'اضبط الشفافية والموقع', 'حمّل PDF بالعلامة'],
    tips: ['Lower opacity = subtle watermark', 'Diagonal covers more area', 'Use your logo as image'],
    tipsAr: ['شفافية أقل = علامة خفيفة', 'القطري يغطي أكثر', 'استخدم شعارك كصورة'],
    warnings: ['High opacity may hide content'],
    warningsAr: ['الشفافية العالية قد تحجب المحتوى']
  },

  'crop': {
    id: 'crop',
    title: 'Crop PDF',
    titleAr: 'قص PDF',
    description: 'Crop margins and resize PDF pages to remove unwanted areas.',
    descriptionAr: 'قص الهوامش وتغيير حجم صفحات PDF لإزالة المناطق غير المرغوبة.',
    howToUse: ['Upload PDF', 'Set crop margins', 'Preview changes', 'Download cropped PDF'],
    howToUseAr: ['ارفع PDF', 'حدد الهوامش', 'معاينة التغييرات', 'حمّل PDF المقصوص'],
    tips: ['Same margins for all sides', 'Preview before saving', 'Cannot be undone'],
    tipsAr: ['نفس الهوامش لكل الجوانب', 'معاينة قبل الحفظ', 'لا يمكن التراجع']
  },

  'protect': {
    id: 'protect',
    title: 'Protect PDF',
    titleAr: 'حماية PDF',
    description: 'Add password protection and set permissions for your PDF.',
    descriptionAr: 'إضافة حماية بكلمة مرور وتحديد صلاحيات PDF.',
    howToUse: ['Upload PDF', 'Set password', 'Choose permissions', 'Download protected PDF'],
    howToUseAr: ['ارفع PDF', 'حدد كلمة المرور', 'اختر الصلاحيات', 'حمّل PDF المحمي'],
    tips: ['Use 8+ characters', 'Include numbers and symbols', 'Save password securely'],
    tipsAr: ['استخدم 8+ حروف', 'أضف أرقام ورموز', 'احفظ كلمة المرور بأمان'],
    warnings: ['Cannot recover without password'],
    warningsAr: ['لا يمكن الاسترداد بدون كلمة المرور']
  },

  'unlock': {
    id: 'unlock',
    title: 'Unlock PDF',
    titleAr: 'فتح PDF',
    description: 'Remove password protection from PDF (requires knowing the password).',
    descriptionAr: 'إزالة حماية كلمة المرور من PDF (يتطلب معرفة كلمة المرور).',
    howToUse: ['Upload protected PDF', 'Enter password', 'Click Unlock', 'Download unlocked PDF'],
    howToUseAr: ['ارفع PDF المحمي', 'أدخل كلمة المرور', 'انقر فتح', 'حمّل PDF المفتوح'],
    tips: ['You must know the password', 'Creates new unprotected copy', 'Original unchanged'],
    tipsAr: ['يجب معرفة كلمة المرور', 'ينشئ نسخة غير محمية', 'الأصلي لا يتغير']
  },

  'sign': {
    id: 'sign',
    title: 'Sign PDF',
    titleAr: 'توقيع PDF',
    description: 'Add your digital signature to PDF documents.',
    descriptionAr: 'إضافة توقيعك الرقمي إلى مستندات PDF.',
    howToUse: ['Upload PDF', 'Draw or upload signature', 'Position on document', 'Download signed PDF'],
    howToUseAr: ['ارفع PDF', 'ارسم أو ارفع التوقيع', 'حدد الموقع', 'حمّل PDF الموقع'],
    tips: ['Draw with mouse/touch', 'Upload image of signature', 'Resize and position freely'],
    tipsAr: ['ارسم بالماوس/اللمس', 'ارفع صورة التوقيع', 'غيّر الحجم والموقع بحرية']
  },

  'redact': {
    id: 'redact',
    title: 'Redact PDF',
    titleAr: 'تنقيح PDF',
    description: 'Permanently remove sensitive information from PDF by blacking out text and images.',
    descriptionAr: 'إزالة المعلومات الحساسة نهائياً من PDF عن طريق التعتيم.',
    howToUse: ['Upload PDF', 'Select areas to redact', 'Apply redaction', 'Download redacted PDF'],
    howToUseAr: ['ارفع PDF', 'حدد المناطق للتنقيح', 'طبق التنقيح', 'حمّل PDF المنقح'],
    tips: ['Redaction is permanent', 'Information cannot be recovered', 'Use for sensitive data'],
    tipsAr: ['التنقيح دائم', 'لا يمكن استرداد المعلومات', 'استخدم للبيانات الحساسة'],
    warnings: ['This action cannot be undone'],
    warningsAr: ['لا يمكن التراجع عن هذا الإجراء']
  },

  // ═══════════════════════════════════════════════════════════
  // IMAGE TOOLS
  // ═══════════════════════════════════════════════════════════

  'compress-image': {
    id: 'compress-image',
    title: 'Compress Image',
    titleAr: 'ضغط الصورة',
    description: 'Reduce image file size while maintaining visual quality.',
    descriptionAr: 'تقليل حجم ملف الصورة مع الحفاظ على الجودة المرئية.',
    howToUse: ['Upload images', 'Select quality level', 'Click Compress', 'Download smaller images'],
    howToUseAr: ['ارفع الصور', 'اختر مستوى الجودة', 'انقر ضغط', 'حمّل الصور الأصغر'],
    tips: ['JPG best for photos', 'PNG best for graphics', 'WebP offers best compression'],
    tipsAr: ['JPG الأفضل للصور', 'PNG الأفضل للرسومات', 'WebP يوفر أفضل ضغط'],
    warnings: ['Very low quality may cause visible artifacts'],
    warningsAr: ['الجودة المنخفضة جداً قد تسبب تشويش']
  },

  'resize-image': {
    id: 'resize-image',
    title: 'Resize Image',
    titleAr: 'تغيير حجم الصورة',
    description: 'Resize images by percentage or exact pixel dimensions.',
    descriptionAr: 'تغيير حجم الصور بالنسبة المئوية أو بأبعاد بكسل محددة.',
    howToUse: ['Upload images', 'Choose method (% or px)', 'Set new size', 'Download resized images'],
    howToUseAr: ['ارفع الصور', 'اختر الطريقة (% أو px)', 'حدد الحجم الجديد', 'حمّل الصور'],
    tips: ['Lock aspect ratio to prevent distortion', 'Common sizes: 1920x1080, 1280x720', 'Percentage scales proportionally'],
    tipsAr: ['قفل النسبة لمنع التشوه', 'أحجام شائعة: 1920x1080', 'النسبة تحافظ على التناسب']
  },

  'crop-image': {
    id: 'crop-image',
    title: 'Crop Image',
    titleAr: 'قص الصورة',
    description: 'Crop images with preset aspect ratios or freeform selection.',
    descriptionAr: 'قص الصور بنسب محددة مسبقاً أو اختيار حر.',
    howToUse: ['Upload image', 'Select aspect ratio or freeform', 'Draw crop area', 'Download cropped image'],
    howToUseAr: ['ارفع الصورة', 'اختر النسبة أو حر', 'ارسم منطقة القص', 'حمّل الصورة'],
    tips: ['1:1 for profile pictures', '16:9 for widescreen', '4:3 for standard photos'],
    tipsAr: ['1:1 للصور الشخصية', '16:9 للشاشات العريضة', '4:3 للصور القياسية']
  },

  'rotate-image': {
    id: 'rotate-image',
    title: 'Rotate Image',
    titleAr: 'تدوير الصورة',
    description: 'Rotate images by 90°, 180°, 270° or custom angle.',
    descriptionAr: 'تدوير الصور بـ 90° أو 180° أو 270° أو زاوية مخصصة.',
    howToUse: ['Upload images', 'Select rotation angle', 'Preview result', 'Download rotated images'],
    howToUseAr: ['ارفع الصور', 'اختر زاوية التدوير', 'معاينة النتيجة', 'حمّل الصور'],
    tips: ['90° = clockwise', '270° = counter-clockwise', '180° = upside down'],
    tipsAr: ['90° = اتجاه عقارب الساعة', '270° = عكس عقارب الساعة', '180° = مقلوب']
  },

  'watermark-image': {
    id: 'watermark-image',
    title: 'Watermark Image',
    titleAr: 'علامة مائية للصورة',
    description: 'Add text or image watermark to protect your photos.',
    descriptionAr: 'إضافة علامة مائية نصية أو صورة لحماية صورك.',
    howToUse: ['Upload images', 'Add text or image watermark', 'Adjust position and opacity', 'Download'],
    howToUseAr: ['ارفع الصور', 'أضف علامة نصية أو صورة', 'اضبط الموقع والشفافية', 'حمّل'],
    tips: ['Use your logo', '30-50% opacity is subtle', 'Diagonal covers more area'],
    tipsAr: ['استخدم شعارك', '30-50% شفافية خفيفة', 'القطري يغطي أكثر']
  },

  'flip-image': {
    id: 'flip-image',
    title: 'Flip Image',
    titleAr: 'قلب الصورة',
    description: 'Flip images horizontally (mirror) or vertically.',
    descriptionAr: 'قلب الصور أفقياً (مرآة) أو عمودياً.',
    howToUse: ['Upload images', 'Choose flip direction', 'Click Flip', 'Download flipped images'],
    howToUseAr: ['ارفع الصور', 'اختر اتجاه القلب', 'انقر قلب', 'حمّل الصور'],
    tips: ['Horizontal = mirror effect', 'Vertical = upside down', 'Both = rotate 180°'],
    tipsAr: ['أفقي = تأثير المرآة', 'عمودي = مقلوب', 'كلاهما = تدوير 180°']
  },

  'convert-to-jpg': {
    id: 'convert-to-jpg',
    title: 'Convert to JPG',
    titleAr: 'تحويل إلى JPG',
    description: 'Convert PNG, GIF, WebP, BMP images to JPG format.',
    descriptionAr: 'تحويل صور PNG و GIF و WebP و BMP إلى صيغة JPG.',
    howToUse: ['Upload images', 'Set quality level', 'Click Convert', 'Download JPG files'],
    howToUseAr: ['ارفع الصور', 'حدد مستوى الجودة', 'انقر تحويل', 'حمّل ملفات JPG'],
    tips: ['JPG is best for photos', 'Transparency becomes white', 'Higher quality = larger size'],
    tipsAr: ['JPG الأفضل للصور', 'الشفافية تصبح بيضاء', 'جودة أعلى = حجم أكبر'],
    warnings: ['Transparency will be lost'],
    warningsAr: ['الشفافية ستفقد']
  },

  'convert-to-png': {
    id: 'convert-to-png',
    title: 'Convert to PNG',
    titleAr: 'تحويل إلى PNG',
    description: 'Convert JPG, GIF, WebP, BMP images to PNG format.',
    descriptionAr: 'تحويل صور JPG و GIF و WebP و BMP إلى صيغة PNG.',
    howToUse: ['Upload images', 'Click Convert', 'Download PNG files'],
    howToUseAr: ['ارفع الصور', 'انقر تحويل', 'حمّل ملفات PNG'],
    tips: ['PNG supports transparency', 'Best for graphics/logos', 'Larger than JPG'],
    tipsAr: ['PNG يدعم الشفافية', 'الأفضل للرسومات/الشعارات', 'أكبر من JPG']
  },

  'convert-to-webp': {
    id: 'convert-to-webp',
    title: 'Convert to WebP',
    titleAr: 'تحويل إلى WebP',
    description: 'Convert images to WebP format for better web performance.',
    descriptionAr: 'تحويل الصور إلى صيغة WebP لأداء أفضل على الويب.',
    howToUse: ['Upload images', 'Set quality', 'Click Convert', 'Download WebP files'],
    howToUseAr: ['ارفع الصور', 'حدد الجودة', 'انقر تحويل', 'حمّل ملفات WebP'],
    tips: ['WebP = best compression', 'Supports transparency', 'All modern browsers support it'],
    tipsAr: ['WebP = أفضل ضغط', 'يدعم الشفافية', 'كل المتصفحات الحديثة تدعمه']
  },

  'svg-to-png': {
    id: 'svg-to-png',
    title: 'SVG to PNG',
    titleAr: 'SVG إلى PNG',
    description: 'Convert vector SVG files to raster PNG images.',
    descriptionAr: 'تحويل ملفات SVG المتجهة إلى صور PNG.',
    howToUse: ['Upload SVG files', 'Set output size', 'Click Convert', 'Download PNG files'],
    howToUseAr: ['ارفع ملفات SVG', 'حدد حجم الإخراج', 'انقر تحويل', 'حمّل ملفات PNG'],
    tips: ['Set larger size for print quality', 'PNG maintains transparency', 'SVG scales infinitely'],
    tipsAr: ['حجم أكبر لجودة الطباعة', 'PNG يحافظ على الشفافية', 'SVG يتدرج بلا حدود']
  },

  'heic-to-jpg': {
    id: 'heic-to-jpg',
    title: 'HEIC to JPG',
    titleAr: 'HEIC إلى JPG',
    description: 'Convert iPhone HEIC/HEIF photos to JPG format.',
    descriptionAr: 'تحويل صور iPhone بصيغة HEIC/HEIF إلى JPG.',
    howToUse: ['Upload HEIC files', 'Set quality', 'Click Convert', 'Download JPG files'],
    howToUseAr: ['ارفع ملفات HEIC', 'حدد الجودة', 'انقر تحويل', 'حمّل ملفات JPG'],
    tips: ['HEIC is iPhone default format', 'JPG works everywhere', 'Maintains photo quality'],
    tipsAr: ['HEIC هي صيغة iPhone الافتراضية', 'JPG يعمل في كل مكان', 'يحافظ على جودة الصورة']
  },

  'photo-editor': {
    id: 'photo-editor',
    title: 'Photo Editor',
    titleAr: 'محرر الصور',
    description: 'Edit photos with filters, adjustments, and effects.',
    descriptionAr: 'تحرير الصور بالفلاتر والتعديلات والتأثيرات.',
    howToUse: ['Upload photo', 'Apply filters/adjustments', 'Preview in real-time', 'Download edited photo'],
    howToUseAr: ['ارفع الصورة', 'طبق الفلاتر/التعديلات', 'معاينة مباشرة', 'حمّل الصورة المحررة'],
    tips: ['Adjust brightness first', 'Use presets for quick edits', 'Reset to start over'],
    tipsAr: ['اضبط السطوع أولاً', 'استخدم القوالب للتحرير السريع', 'إعادة تعيين للبدء من جديد']
  },

  'meme-generator': {
    id: 'meme-generator',
    title: 'Meme Generator',
    titleAr: 'صانع الميمز',
    description: 'Create memes with custom top and bottom text.',
    descriptionAr: 'إنشاء ميمز بنص علوي وسفلي مخصص.',
    howToUse: ['Upload image', 'Add top/bottom text', 'Customize style', 'Download meme'],
    howToUseAr: ['ارفع صورة', 'أضف النص العلوي/السفلي', 'خصص النمط', 'حمّل الميم'],
    tips: ['Use Impact font for classic look', 'White text + black outline', 'Keep text short'],
    tipsAr: ['استخدم خط Impact للمظهر الكلاسيكي', 'نص أبيض + حدود سوداء', 'اجعل النص قصيراً']
  },

  'collage-maker': {
    id: 'collage-maker',
    title: 'Collage Maker',
    titleAr: 'صانع الكولاج',
    description: 'Create beautiful photo collages with multiple layouts.',
    descriptionAr: 'إنشاء كولاجات صور جميلة بتخطيطات متعددة.',
    howToUse: ['Upload multiple photos', 'Choose layout', 'Arrange photos', 'Download collage'],
    howToUseAr: ['ارفع عدة صور', 'اختر التخطيط', 'رتب الصور', 'حمّل الكولاج'],
    tips: ['2-9 photos work best', 'Drag to reposition', 'Add borders for style'],
    tipsAr: ['2-9 صور تعمل بشكل أفضل', 'اسحب لإعادة الموضع', 'أضف حدود للأناقة']
  },

  'gif-maker': {
    id: 'gif-maker',
    title: 'GIF Maker',
    titleAr: 'صانع GIF',
    description: 'Create animated GIFs from multiple images.',
    descriptionAr: 'إنشاء صور GIF متحركة من عدة صور.',
    howToUse: ['Upload images in order', 'Set frame delay', 'Enable loop', 'Download GIF'],
    howToUseAr: ['ارفع الصور بالترتيب', 'حدد تأخير الإطار', 'فعّل التكرار', 'حمّل GIF'],
    tips: ['More frames = smoother animation', '100-200ms delay is common', 'Keep file size reasonable'],
    tipsAr: ['إطارات أكثر = حركة أسلس', 'تأخير 100-200 مللي ثانية شائع', 'حافظ على حجم معقول']
  }
};

export const getToolDescription = (toolId: string): ToolDescription | null => {
  return toolDescriptions[toolId] || null;
};
