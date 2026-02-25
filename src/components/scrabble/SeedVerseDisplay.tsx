// PT Scrabble Seed Verse Display
// Persistent display of the central verse being studied

import { useState } from 'react';
import { Book, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SelectedVerse } from './VerseSelectionScreen';
import { cn } from '@/lib/utils';

interface SeedVerseDisplayProps {
  verse: SelectedVerse;
  className?: string;
  compact?: boolean;
}

export function SeedVerseDisplay({ verse, className, compact = false }: SeedVerseDisplayProps) {
  const [showFullVerse, setShowFullVerse] = useState(!compact);

  if (compact) {
    // Always show at least a truncated preview of the verse text
    const truncatedText = verse.text.length > 120 ? verse.text.slice(0, 120) + '…' : verse.text;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-primary/30 rounded-lg overflow-hidden',
          className
        )}
      >
        {/* Reference header with always-visible preview */}
        <div
          onClick={() => setShowFullVerse(!showFullVerse)}
          className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-primary/5 transition-colors"
        >
          <Book className="h-4 w-4 text-primary shrink-0" />
          <span className="font-medium text-sm text-primary">📖 {verse.reference}</span>
          <span className="flex-1" />
          {verse.text.length > 120 && (
            showFullVerse ? (
              <ChevronUp className="h-4 w-4 text-primary shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-primary shrink-0" />
            )
          )}
        </div>

        {/* Always-visible verse preview */}
        <div className="px-3 pb-2 border-t border-primary/20 bg-primary/5">
          <p className="text-sm italic leading-relaxed text-foreground/80">
            "{showFullVerse ? verse.text : truncatedText}"
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-primary/30 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Clickable reference header */}
      <div
        onClick={() => setShowFullVerse(!showFullVerse)}
        className="flex items-center gap-2 p-4 cursor-pointer hover:bg-primary/5 transition-colors"
      >
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
          <Book className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-primary">Studying: {verse.reference}</h3>
          <p className="text-xs text-muted-foreground">
            {showFullVerse ? 'Click to hide verse' : 'Click to view full verse'}
          </p>
        </div>
        <Sparkles className="h-4 w-4 text-yellow-500 shrink-0" />
        {showFullVerse ? (
          <ChevronUp className="h-5 w-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary shrink-0" />
        )}
      </div>

      {/* Expandable verse text */}
      <AnimatePresence>
        {showFullVerse && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-primary/20">
              <p className="text-sm italic leading-relaxed text-foreground/80">
                "{verse.text}"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
