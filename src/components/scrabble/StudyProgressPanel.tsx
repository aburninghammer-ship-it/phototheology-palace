// Study Progress Panel — Glassified with Jeeves connection commentary
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Bot, Cross, Link, Book, Sparkles, ArrowDown, Star, AlertTriangle, XCircle } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'glass-card rounded-xl overflow-hidden relative',
        className
      )}
    >
      <div className="glass-card-bubbles"><span /><span /><span /><span /><span /><span /><span /><span /></div>

      {/* Header */}
      <div
        className="relative z-10 flex items-center justify-between p-3 cursor-pointer hover:bg-primary/5 transition-colors border-b border-primary/10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-semibold text-sm">Study Progress</span>
          <span className="text-xs bg-primary/15 text-primary px-2.5 py-0.5 rounded-full font-medium">
            {entries.length} {entries.length === 1 ? 'insight' : 'insights'}
          </span>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden relative z-10"
          >
            {/* Seed verse */}
            {seedVerse && (
              <div className="px-3 pt-3 pb-1">
                <div className="p-3 glass-card-subtle rounded-lg border border-primary/20">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Book className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary tracking-wide">{seedVerse.reference}</span>
                  </div>
                  <p className="text-xs italic text-foreground/70 leading-relaxed">"{seedVerse.text}"</p>
                </div>
              </div>
            )}

            {/* Entries */}
            <ScrollArea className="max-h-72">
              <div className="px-3 pb-3 pt-2 space-y-1">
                {entries.length === 0 ? (
                  <div className="text-center py-6">
                    <Sparkles className="h-6 w-6 text-primary/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Play a card and explain its connection to start building the study!
                    </p>
                  </div>
                ) : (
                  entries.map((entry, index) => (
                    <div key={entry.id}>
                      {/* Connection arrow between entries */}
                      {index > 0 && (
                        <div className="flex justify-center py-1">
                          <div className="flex flex-col items-center">
                            <div className="w-px h-3 bg-primary/20" />
                            <ArrowDown className="h-3 w-3 text-primary/30" />
                          </div>
                        </div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className={cn(
                          'p-3 rounded-xl border backdrop-blur-sm',
                          entry.rejected
                            ? 'border-red-500/30 bg-red-500/5 opacity-70'
                            : entry.isChristConnection
                            ? 'border-purple-500/30 bg-purple-500/5 shadow-[0_0_12px_rgba(168,85,247,0.08)]'
                            : 'border-border/50 bg-card/50'
                        )}
                      >
                        {/* Rejected banner */}
                        {entry.rejected && (
                          <div className="flex items-center gap-1.5 mb-2 p-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                            <span className="text-[10px] font-bold text-red-500">Card lost — answer scored {entry.jeevesScore}/10</span>
                          </div>
                        )}

                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                              entry.rejected
                                ? 'bg-red-500/20 text-red-400'
                                : entry.isChristConnection
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-primary/15 text-primary'
                            )}>
                              {entry.rejected ? <AlertTriangle className="h-3 w-3" /> : index + 1}
                            </span>
                            <span className="text-xs font-semibold">{entry.playerName}</span>
                            {entry.isChristConnection && !entry.rejected && (
                              <span className="flex items-center gap-0.5 text-[10px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded-full">
                                <Cross className="h-2.5 w-2.5" /> Christ
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            {/* Score stars */}
                            {entry.jeevesScore != null && (
                              <span className={cn(
                                'flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                entry.jeevesScore >= 8 ? 'bg-green-500/15 text-green-500' :
                                entry.jeevesScore >= 5 ? 'bg-yellow-500/15 text-yellow-500' :
                                'bg-red-500/15 text-red-500'
                              )}>
                                <Star className="h-2.5 w-2.5" />
                                {entry.jeevesScore}
                              </span>
                            )}
                            <span className="text-[10px] font-mono bg-muted/80 px-2 py-0.5 rounded-md">{entry.cardCode}</span>
                          </div>
                        </div>

                        {/* Card name + connection type */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn("text-xs font-semibold", entry.rejected ? "text-red-400 line-through" : "text-primary")}>{entry.cardName}</span>
                          {entry.connectingTo && (
                            <span className={cn(
                              'text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-medium',
                              entry.connectingTo === 'verse'
                                ? 'bg-blue-500/10 text-blue-400'
                                : 'bg-green-500/10 text-green-400'
                            )}>
                              {entry.connectingTo === 'verse' ? (
                                <><Book className="h-2.5 w-2.5" /> seed verse</>
                              ) : (
                                <><Link className="h-2.5 w-2.5" /> chain</>
                              )}
                            </span>
                          )}
                        </div>

                        {/* Chain context */}
                        {entry.connectingTo === 'previous' && entry.previousPlayerName && (
                          <div className="mb-2 p-2 bg-green-500/5 border border-green-500/15 rounded-lg text-[10px] leading-relaxed">
                            <span className="text-muted-foreground">↳ Building on </span>
                            <span className="font-semibold text-green-500">{entry.previousPlayerName}</span>
                            <span className="text-muted-foreground">'s </span>
                            <span className="font-medium text-foreground/70">{entry.previousCardName}</span>
                          </div>
                        )}

                        {/* Player's answer */}
                        <p className="text-xs leading-relaxed text-foreground/85 mb-2">{entry.explanation}</p>

                        {/* Jeeves commentary */}
                        {entry.jeevesJudgment && (
                          <div className={cn(
                            "p-2.5 rounded-lg border",
                            entry.rejected
                              ? "bg-gradient-to-br from-red-500/10 to-orange-500/5 border-red-500/15"
                              : "bg-gradient-to-br from-blue-500/10 to-purple-500/5 border-blue-500/15"
                          )}>
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={cn(
                                "h-4 w-4 rounded-full flex items-center justify-center",
                                entry.rejected ? "bg-red-500/20" : "bg-blue-500/20"
                              )}>
                                <Bot className={cn("h-2.5 w-2.5", entry.rejected ? "text-red-400" : "text-blue-400")} />
                              </div>
                              <span className={cn("text-[10px] font-bold tracking-wide uppercase", entry.rejected ? "text-red-400" : "text-blue-400")}>Jeeves</span>
                            </div>
                            <p className="text-[11px] text-foreground/70 leading-relaxed">{entry.jeevesJudgment}</p>
                          </div>
                        )}

                        {/* Points */}
                        <div className="flex items-center justify-end gap-1 mt-2">
                          {entry.rejected ? (
                            <>
                              <XCircle className="h-3 w-3 text-red-500" />
                              <span className="text-[11px] font-bold text-red-500">0 pts — card lost</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3 text-yellow-500" />
                              <span className="text-[11px] font-bold text-yellow-500">+{entry.points} pts</span>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </div>
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
