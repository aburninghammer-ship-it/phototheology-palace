// Scrabble PT Study Log
// Shows all submitted explanations so players can build on each other's insights

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollText, User, ChevronLeft, ChevronRight, Sparkles, Cross, Bot, Book, Link } from 'lucide-react';
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
  jeevesJudgment?: string; // Jeeves' explanation of how this connects
  jeevesScore?: number; // 1-10 score from Jeeves. Below 5 = lose card & turn
  rejected?: boolean; // true if score < 5 — card lost, 0 points
  connectingTo?: 'verse' | 'previous'; // What this entry connects to
  previousPlayerName?: string; // Who they're building on
  previousCardName?: string; // What principle they're building on
  previousExplanation?: string; // The previous answer they're building on
}

interface StudyLogProps {
  entries: StudyLogEntry[];
  className?: string;
}

export function StudyLog({ entries, className }: StudyLogProps) {
  // Start collapsed by default - less intrusive
  const [isCollapsed, setIsCollapsed] = useState(true);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed left-0 top-20 bottom-44 z-30 flex transition-all duration-300',
        // Smaller on mobile, start collapsed
        isCollapsed ? 'w-10' : 'w-64 md:w-80',
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
        <div className="w-64 md:w-80 h-full bg-background/95 backdrop-blur border-r flex flex-col">
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

                  {/* Card name and connection type */}
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-muted-foreground">{entry.cardName}</p>
                    {entry.connectingTo && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted flex items-center gap-1">
                        {entry.connectingTo === 'verse' ? (
                          <><Book className="h-2.5 w-2.5" /> to verse</>
                        ) : (
                          <><Link className="h-2.5 w-2.5" /> to previous</>
                        )}
                      </span>
                    )}
                  </div>

                  {/* Chain context - show what they're building on */}
                  {entry.connectingTo === 'previous' && entry.previousPlayerName && (
                    <div className="mb-2 p-2 bg-green-500/5 border border-green-500/20 rounded text-xs">
                      <span className="text-muted-foreground">Building on </span>
                      <span className="font-medium text-green-600 dark:text-green-400">{entry.previousPlayerName}</span>
                      <span className="text-muted-foreground">'s </span>
                      <span className="font-mono text-green-600 dark:text-green-400">{entry.previousCardName}</span>
                      {entry.previousExplanation && (
                        <p className="mt-1 text-muted-foreground italic truncate">"{entry.previousExplanation}"</p>
                      )}
                    </div>
                  )}

                  {/* Explanation */}
                  <p className="text-sm leading-relaxed">{entry.explanation}</p>

                  {/* Jeeves Judgment */}
                  {entry.jeevesJudgment && (
                    <div className="mt-2 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="h-3 w-3 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Jeeves</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{entry.jeevesJudgment}</p>
                    </div>
                  )}

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
              First card: race to connect a principle to the verse! Then build on each other's insights.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
