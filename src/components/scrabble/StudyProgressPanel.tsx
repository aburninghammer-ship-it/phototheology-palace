// Study Progress Panel
// Shows the study building answer by answer — a running transcript of insights

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, User, Bot, Cross, Link, Book, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { StudyLogEntry } from './StudyLog';
import type { SelectedVerse } from './VerseSelectionScreen';
import { cn } from '@/lib/utils';

interface StudyProgressPanelProps {
  entries: StudyLogEntry[];
  seedVerse?: SelectedVerse | null;
  className?: string;
}

export function StudyProgressPanel({ entries, seedVerse, className }: StudyProgressPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-card border rounded-lg overflow-hidden shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="font-semibold text-sm">Study Progress</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {entries.length} {entries.length === 1 ? 'insight' : 'insights'}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            {/* Seed verse */}
            {seedVerse && (
              <div className="px-3 pb-2 border-t">
                <div className="p-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded mt-2">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Book className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary">{seedVerse.reference}</span>
                  </div>
                  <p className="text-xs italic text-foreground/70 leading-relaxed">"{seedVerse.text}"</p>
                </div>
              </div>
            )}

            {/* Entries building up */}
            <ScrollArea className="max-h-64">
              <div className="px-3 pb-3 space-y-2">
                {entries.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Play a card and explain its connection to start building the study!
                  </p>
                ) : (
                  entries.map((entry, index) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'p-2.5 rounded-lg border bg-background',
                        entry.isChristConnection && 'border-purple-500/40 bg-purple-500/5'
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold">
                            {index + 1}
                          </span>
                          <span className="text-xs font-medium">{entry.playerName}</span>
                          {entry.isChristConnection && <Cross className="h-3 w-3 text-purple-500" />}
                        </div>
                        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded">{entry.cardCode}</span>
                      </div>

                      {/* Card name + connection type */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs font-medium text-primary">{entry.cardName}</span>
                        {entry.connectingTo && (
                          <span className="text-[10px] px-1 py-0.5 rounded bg-muted flex items-center gap-0.5">
                            {entry.connectingTo === 'verse' ? (
                              <><Book className="h-2.5 w-2.5" /> verse</>
                            ) : (
                              <><Link className="h-2.5 w-2.5" /> chain</>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Chain context */}
                      {entry.connectingTo === 'previous' && entry.previousPlayerName && (
                        <div className="mb-1.5 p-1.5 bg-green-500/5 border border-green-500/20 rounded text-[10px]">
                          <span className="text-muted-foreground">↳ Building on </span>
                          <span className="font-medium text-green-600 dark:text-green-400">{entry.previousPlayerName}</span>
                          <span className="text-muted-foreground">'s {entry.previousCardName}</span>
                        </div>
                      )}

                      {/* Answer */}
                      <p className="text-xs leading-relaxed">{entry.explanation}</p>

                      {/* Jeeves */}
                      {entry.jeevesJudgment && (
                        <div className="mt-1.5 p-1.5 bg-blue-500/10 rounded border border-blue-500/20">
                          <div className="flex items-center gap-1 mb-0.5">
                            <Bot className="h-2.5 w-2.5 text-blue-500" />
                            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">Jeeves</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{entry.jeevesJudgment}</p>
                        </div>
                      )}

                      {/* Points */}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <Sparkles className="h-2.5 w-2.5 text-yellow-500" />
                        <span className="text-[10px] font-medium text-yellow-500">+{entry.points}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
