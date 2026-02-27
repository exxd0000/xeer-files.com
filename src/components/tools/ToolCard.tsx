'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Merge,
  Split,
  Minimize2,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  RotateCw,
  Hash,
  Droplet,
  Lock,
  Unlock,
  PenTool,
  Scissors,
  Eye,
  Wrench,
  ScanLine,
  GitCompare,
  Type,
  Languages,
  MessageSquare,
  Database,
  FileCode,
  Archive,
  Eraser,
  Crop,
} from 'lucide-react';
import type { Tool } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  merge: Merge,
  split: Split,
  compress: Minimize2,
  organize: FileText,
  remove: Eraser,
  extract: Scissors,
  word: FileText,
  excel: FileSpreadsheet,
  powerpoint: Presentation,
  image: Image,
  html: FileCode,
  rotate: RotateCw,
  numbers: Hash,
  watermark: Droplet,
  lock: Lock,
  unlock: Unlock,
  signature: PenTool,
  redact: Eye,
  compare: GitCompare,
  repair: Wrench,
  ocr: ScanLine,
  archive: Archive,
  ai: Type,
  translate: Languages,
  chat: MessageSquare,
  'extract-data': Database,
  crop: Crop,
  edit: PenTool,
};

interface ToolCardProps {
  tool: Tool;
  index?: number;
}

export function ToolCard({ tool, index = 0 }: ToolCardProps) {
  const Icon = iconMap[tool.icon] || FileText;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/tool/${tool.slug}`} className="block">
        <div className="tool-card group h-full">
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${tool.color}15` }}
          >
            <Icon className="w-7 h-7" style={{ color: tool.color }} />
          </div>

          {/* Content */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            {tool.isAI && (
              <span className="badge-ai text-[10px]">AI</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {tool.description}
          </p>

          {/* Processing indicator */}
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: tool.processingType === 'client' ? '#27AE60' : '#3498DB',
              }}
            />
            {tool.processingType === 'client' ? 'Browser processing' : 'Cloud processing'}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
