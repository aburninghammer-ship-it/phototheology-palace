// PT Scrabble Seed Verse Display
// Persistent display of the central verse being studied

import { Book, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SelectedVerse } from './VerseSelectionScreen';
import { cn } from '@/lib/utils';

interface SeedVerseDisplayProps {
  verse: SelectedVerse;
  className?: string;
  compact?: boolean;
}

export function SeedVerseDisplay({ verse, className, compact = false }: SeedVerseDisplayProps) {
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-primary/30 rounded-lg',
          className
        )}
      >
        <Book className="h-4 w-4 text-primary shrink-0" />
        <span className="font-medium text-sm text-primary">{verse.reference}</span>
        <span className="text-xs text-muted-foreground truncate hidden sm:inline">
          — {verse.text.slice(0, 60)}...
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 border border-primary/30 rounded-lg',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
          <Book className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-primary">{verse.reference}</h3>
          <p className="text-xs text-muted-foreground">Central Study Passage</p>
        </div>
        <Sparkles className="h-4 w-4 text-yellow-500 ml-auto" />
      </div>
      <p className="text-sm italic leading-relaxed text-foreground/80">
        "{verse.text}"
      </p>
    </motion.div>
  );
}
