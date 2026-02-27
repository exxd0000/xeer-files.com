'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Lightbulb, AlertTriangle } from 'lucide-react';
import { getToolDescription } from '@/config/tool-descriptions';

interface Props {
  toolId: string;
  locale: string;
}

export function ToolDescription({ toolId, locale }: Props) {
  const [open, setOpen] = useState(false);
  const isRtl = locale === 'ar';
  const desc = getToolDescription(toolId);

  if (!desc) return null;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden mb-6">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-left">
            <h3 className="text-white font-medium">{isRtl ? 'كيف تعمل هذه الأداة؟' : 'How does this tool work?'}</h3>
            <p className="text-xs text-gray-500">{isRtl ? 'انقر لعرض الشرح' : 'Click to see instructions'}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="w-5 h-5 text-violet-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-6 pt-2 space-y-6 border-t border-gray-800">
              {/* Description */}
              <div>
                <p className="text-gray-300 leading-relaxed">{isRtl ? desc.descriptionAr : desc.description}</p>
              </div>

              {/* How to Use */}
              <div>
                <h4 className="text-violet-400 font-medium mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-xs">📋</span>
                  {isRtl ? 'خطوات الاستخدام' : 'How to Use'}
                </h4>
                <ol className="space-y-2">
                  {(isRtl ? desc.howToUseAr : desc.howToUse).map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 text-xs flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="text-gray-400 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              <div>
                <h4 className="text-amber-400 font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  {isRtl ? 'نصائح' : 'Tips'}
                </h4>
                <ul className="space-y-2">
                  {(isRtl ? desc.tipsAr : desc.tips).map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                      <span className="text-amber-400">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warnings */}
              {desc.warnings && desc.warnings.length > 0 && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <h4 className="text-red-400 font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {isRtl ? 'تحذيرات' : 'Warnings'}
                  </h4>
                  <ul className="space-y-1">
                    {(isRtl ? desc.warningsAr : desc.warnings)?.map((w, i) => (
                      <li key={i} className="text-sm text-red-300">• {w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
