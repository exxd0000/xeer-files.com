'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ToolCard } from './ToolCard';
import { tools, toolCategories } from '@/config/tools';
import type { ToolCategory } from '@/types';

interface ToolGridProps {
  showFilter?: boolean;
  maxItems?: number;
  category?: ToolCategory;
}

export function ToolGrid({ showFilter = true, maxItems, category }: ToolGridProps) {
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>(
    category || 'all'
  );

  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter((tool) => tool.category === activeCategory);

  const displayedTools = maxItems ? filteredTools.slice(0, maxItems) : filteredTools;

  return (
    <div>
      {/* Category Filter */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {toolCategories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Tools Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      >
        {displayedTools.map((tool, index) => (
          <ToolCard key={tool.id} tool={tool} index={index} />
        ))}
      </motion.div>
    </div>
  );
}
