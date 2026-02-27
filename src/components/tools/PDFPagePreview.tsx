'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, RotateCw, Trash2, Loader2 } from 'lucide-react';

interface PageData { id: string; pageNumber: number; imageUrl: string; rotation: number; }

function SortablePage({ page, onRotate, onDelete }: { page: PageData; onRotate: () => void; onDelete: () => void; }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: page.id });
  const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 50 : 'auto' };

  return (
    <motion.div ref={setNodeRef} style={style} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className={`relative group bg-gray-800 rounded-xl overflow-hidden border-2 border-transparent hover:border-violet-500 ${isDragging ? 'shadow-2xl' : ''}`}>
      <div {...attributes} {...listeners} className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 cursor-grab z-10">
        <GripVertical className="w-4 h-4" />
      </div>
      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs font-medium z-10">{page.pageNumber}</div>
      <div className="aspect-[3/4]">
        <img src={page.imageUrl} alt={`Page ${page.pageNumber}`} className="w-full h-full object-contain bg-white" style={{ transform: `rotate(${page.rotation}deg)` }} draggable={false} />
      </div>
      <div className="absolute bottom-2 inset-x-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100">
        <button onClick={onRotate} className="p-2 rounded-lg bg-black/70 text-white hover:bg-violet-600"><RotateCw className="w-4 h-4" /></button>
        <button onClick={onDelete} className="p-2 rounded-lg bg-black/70 text-white hover:bg-red-600"><Trash2 className="w-4 h-4" /></button>
      </div>
    </motion.div>
  );
}

interface Props { file: File; onPagesChange: (pages: number[]) => void; locale?: string; }

export function PDFPagePreview({ file, onPagesChange, locale = 'en' }: Props) {
  const isRtl = locale === 'ar';
  const t = (en: string, ar: string) => isRtl ? ar : en;
  const [pages, setPages] = useState<PageData[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pageDataArray: PageData[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.4 });
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = viewport.width; canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        pageDataArray.push({ id: `page-${i}`, pageNumber: i, imageUrl: canvas.toDataURL('image/jpeg', 0.6), rotation: 0 });
      }
      setPages(pageDataArray);
      onPagesChange(pageDataArray.map(p => p.pageNumber));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [file, onPagesChange]);

  useEffect(() => { loadPages(); }, [loadPages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPages(items => {
        const oldIdx = items.findIndex(i => i.id === active.id);
        const newIdx = items.findIndex(i => i.id === over.id);
        const newItems = arrayMove(items, oldIdx, newIdx);
        onPagesChange(newItems.map(p => p.pageNumber));
        return newItems;
      });
    }
  };

  const rotatePage = (id: string) => setPages(items => items.map(i => i.id === id ? { ...i, rotation: (i.rotation + 90) % 360 } : i));
  const deletePage = (id: string) => setPages(items => { const newItems = items.filter(i => i.id !== id); onPagesChange(newItems.map(p => p.pageNumber)); return newItems; });

  if (loading) return <div className="flex flex-col items-center justify-center py-12"><Loader2 className="w-10 h-10 text-violet-400 animate-spin mb-4" /><p className="text-gray-400">{t('Loading pages...', 'جاري تحميل الصفحات...')}</p></div>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">{pages.length} {t('pages', 'صفحات')}</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={pages.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {pages.map(page => <SortablePage key={page.id} page={page} onRotate={() => rotatePage(page.id)} onDelete={() => deletePage(page.id)} />)}
          </div>
        </SortableContext>
      </DndContext>
      <p className="text-center text-xs text-gray-500">{t('Drag to reorder pages', 'اسحب لإعادة ترتيب الصفحات')}</p>
    </div>
  );
}
