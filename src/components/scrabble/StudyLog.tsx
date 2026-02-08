// Scrabble PT Study Log
// Shows all submitted explanations so players can build on each other's insights

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, User, ChevronLeft, ChevronRight, Sparkles, Cross } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface StudyLogEntry {
  id: string;
  playerName: string;
  cardCode: string;
  cardName: string;
  explanation: string;
  isChristConnection: boolean;
  points: number;
  timestamp: string;
}

interface StudyLogProps {
  entries: StudyLogEntry[];
  className?: string;
}

export function StudyLog({ entries, className }: StudyLogProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-0 top-20 bottom-44 z-40 flex transition-all duration-300',
        isCollapsed ? 'w-10' : 'w-80',
        className
      )}
    >
      {/* Collapse toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-50 h-6 w-6 rounded-full bg-background border shadow-sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Collapsed state */}
      {isCollapsed && (
        <div className="w-10 h-full bg-background/80 backdrop-blur border-r flex flex-col items-center py-4 gap-2">
          <ScrollText className="h-5 w-5 text-primary" />
          <span className="text-xs font-bold writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
            Study Log ({entries.length})
          </span>
        </div>
      )}

      {/* Expanded state */}
      {!isCollapsed && (
        <div className="w-80 h-full bg-background/95 backdrop-blur border-r flex flex-col">
          {/* Header */}
          <div className="p-3 border-b flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-primary" />
            <span className="font-semibold">Study Log</span>
            <span className="text-xs text-muted-foreground ml-auto">{entries.length} entries</span>
          </div>

          {/* Entries */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'p-3 rounded-lg border bg-card',
                    entry.isChristConnection && 'border-purple-500/50 bg-purple-500/5'
                  )}
                >
                  {/* Player and card */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium">{entry.playerName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                        {entry.cardCode}
                      </span>
                      {entry.isChristConnection && (
                        <Cross className="h-3 w-3 text-purple-500" />
                      )}
                    </div>
                  </div>

                  {/* Card name */}
                  <p className="text-xs text-muted-foreground mb-1">{entry.cardName}</p>

                  {/* Explanation */}
                  <p className="text-sm leading-relaxed">{entry.explanation}</p>

                  {/* Points */}
                  <div className="flex items-center justify-end gap-1 mt-2">
                    <Sparkles className="h-3 w-3 text-yellow-500" />
                    <span className="text-xs font-medium text-yellow-500">+{entry.points}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Hint */}
          <div className="p-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Each card must build on the previous point while tying in a new principle!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
