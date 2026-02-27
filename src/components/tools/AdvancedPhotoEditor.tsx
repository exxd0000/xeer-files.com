'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Contrast, Droplets, RotateCcw, Download, Undo2, Redo2 } from 'lucide-react';

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
}

const defaultAdjustments: Adjustments = { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0, sepia: 0, hueRotate: 0 };

const presetFilters = [
  { name: 'Normal', nameAr: 'عادي', adj: defaultAdjustments },
  { name: 'Vivid', nameAr: 'حيوي', adj: { ...defaultAdjustments, saturation: 130, contrast: 110 } },
  { name: 'Warm', nameAr: 'دافئ', adj: { ...defaultAdjustments, hueRotate: 15, saturation: 110 } },
  { name: 'Cool', nameAr: 'بارد', adj: { ...defaultAdjustments, hueRotate: -15, saturation: 90 } },
  { name: 'Vintage', nameAr: 'قديم', adj: { ...defaultAdjustments, sepia: 40, contrast: 90, saturation: 80 } },
  { name: 'B&W', nameAr: 'أبيض وأسود', adj: { ...defaultAdjustments, grayscale: 100 } },
  { name: 'Noir', nameAr: 'نوار', adj: { ...defaultAdjustments, grayscale: 100, contrast: 130 } },
  { name: 'Fade', nameAr: 'باهت', adj: { ...defaultAdjustments, contrast: 80, saturation: 80, brightness: 110 } },
];

interface Props { imageFile: File; onSave: (blob: Blob) => void; locale?: string; }

export function AdvancedPhotoEditor({ imageFile, onSave, locale = 'en' }: Props) {
  const isRtl = locale === 'ar';
  const t = (en: string, ar: string) => isRtl ? ar : en;

  const [imageUrl, setImageUrl] = useState('');
  const [adj, setAdj] = useState<Adjustments>(defaultAdjustments);
  const [history, setHistory] = useState<Adjustments[]>([defaultAdjustments]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [tab, setTab] = useState<'filters' | 'adjust'>('filters');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);
    const img = new Image(); img.onload = () => { imgRef.current = img; }; img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const getFilter = useCallback(() =>
    `brightness(${adj.brightness}%) contrast(${adj.contrast}%) saturate(${adj.saturation}%) blur(${adj.blur}px) grayscale(${adj.grayscale}%) sepia(${adj.sepia}%) hue-rotate(${adj.hueRotate}deg)`,
  [adj]);

  const update = (key: keyof Adjustments, val: number) => {
    const newAdj = { ...adj, [key]: val };
    setAdj(newAdj);
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(newAdj);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const applyPreset = (p: typeof presetFilters[0]) => {
    setAdj(p.adj);
    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(p.adj);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);
  };

  const undo = () => { if (historyIdx > 0) { setHistoryIdx(historyIdx - 1); setAdj(history[historyIdx - 1]); } };
  const redo = () => { if (historyIdx < history.length - 1) { setHistoryIdx(historyIdx + 1); setAdj(history[historyIdx + 1]); } };
  const reset = () => { setAdj(defaultAdjustments); setHistory([defaultAdjustments]); setHistoryIdx(0); };

  const save = () => {
    if (!imgRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current, ctx = canvas.getContext('2d')!, img = imgRef.current;
    canvas.width = img.width; canvas.height = img.height;
    ctx.filter = getFilter(); ctx.drawImage(img, 0, 0);
    canvas.toBlob(blob => { if (blob) onSave(blob); }, 'image/jpeg', 0.92);
  };

  const controls = [
    { key: 'brightness', icon: Sun, label: t('Brightness', 'السطوع'), min: 0, max: 200, def: 100 },
    { key: 'contrast', icon: Contrast, label: t('Contrast', 'التباين'), min: 0, max: 200, def: 100 },
    { key: 'saturation', icon: Droplets, label: t('Saturation', 'التشبع'), min: 0, max: 200, def: 100 },
  ];

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl overflow-hidden bg-gray-900">
        {imageUrl && <img src={imageUrl} alt="Preview" className="w-full max-h-[400px] object-contain" style={{ filter: getFilter() }} />}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={undo} disabled={historyIdx <= 0} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50"><Undo2 className="w-5 h-5" /></button>
          <button onClick={redo} disabled={historyIdx >= history.length - 1} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white disabled:opacity-50"><Redo2 className="w-5 h-5" /></button>
          <button onClick={reset} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white"><RotateCcw className="w-5 h-5" /></button>
        </div>
        <button onClick={save} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium">
          <Download className="w-5 h-5" />{t('Save', 'حفظ')}
        </button>
      </div>

      <div className="flex gap-2 p-1 bg-gray-800 rounded-lg">
        <button onClick={() => setTab('filters')} className={`flex-1 py-2 rounded-md font-medium ${tab === 'filters' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}>{t('Filters', 'الفلاتر')}</button>
        <button onClick={() => setTab('adjust')} className={`flex-1 py-2 rounded-md font-medium ${tab === 'adjust' ? 'bg-violet-600 text-white' : 'text-gray-400'}`}>{t('Adjust', 'التعديل')}</button>
      </div>

      {tab === 'filters' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-2">
          {presetFilters.map(p => (
            <button key={p.name} onClick={() => applyPreset(p)} className="rounded-lg overflow-hidden aspect-square bg-gray-800 border-2 border-transparent hover:border-violet-500 relative">
              {imageUrl && <img src={imageUrl} alt={p.name} className="w-full h-full object-cover" style={{ filter: `brightness(${p.adj.brightness}%) contrast(${p.adj.contrast}%) saturate(${p.adj.saturation}%) grayscale(${p.adj.grayscale}%) sepia(${p.adj.sepia}%)` }} />}
              <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center"><span className="text-xs text-white">{isRtl ? p.nameAr : p.name}</span></div>
            </button>
          ))}
        </motion.div>
      )}

      {tab === 'adjust' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {controls.map(({ key, icon: Icon, label, min, max, def }) => (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-400"><Icon className="w-4 h-4" /><span className="text-sm">{label}</span></div>
                <span className="text-sm text-violet-400">{adj[key as keyof Adjustments]}%</span>
              </div>
              <input type="range" min={min} max={max} value={adj[key as keyof Adjustments]} onChange={e => update(key as keyof Adjustments, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500" />
              <div className="flex justify-center"><button onClick={() => update(key as keyof Adjustments, def)} className="text-xs text-gray-500 hover:text-violet-400">{t('Reset', 'إعادة')}</button></div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
