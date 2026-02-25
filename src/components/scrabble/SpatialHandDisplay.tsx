// PT Scrabble Spatial Hand Display
// Shows cards arranged spatially to preview their board positions

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleCard, BoardPosition } from '@/types/scrabble';
import { cn } from '@/lib/utils';

export interface CardWithPosition {
  card: ScrabbleCard;
  position: BoardPosition;
  direction: string;
}

interface SpatialHandDisplayProps {
  cards: CardWithPosition[];
  onCardSelect: (card: ScrabbleCard, position: BoardPosition) => void;
  onRefresh?: () => void;
  disabled?: boolean;
  score?: number;
  verseReference?: string;
  className?: string;
}

export function SpatialHandDisplay({
  cards,
  onCardSelect,
  onRefresh,
  disabled = false,
  score = 0,
  verseReference,
  className,
}: SpatialHandDisplayProps) {

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-gradient-to-t from-background via-background/95 to-transparent',
      'border-t border-border/50',
      'pb-safe',
      className
    )}>
      {/* Header with score and refresh */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{cards.length}</span> cards ready to place
          </div>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              className="h-7 px-2 text-xs gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              Refresh
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="text-lg font-bold text-yellow-500">{score} pts</span>
        </div>
      </div>

      {/* Instruction */}
      <div className="text-center text-sm text-muted-foreground mb-2 px-4">
        Tap a card to place it and explain how it connects to the verse
      </div>

      {/* Spatial card layout - arranged in an arc */}
      <div className="relative px-4 pb-6 pt-2">
        <div className="flex justify-center items-end gap-1 sm:gap-2 overflow-x-auto">
          <AnimatePresence mode="popLayout">
            {cards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-sm py-8 text-center"
              >
                No cards available. Game complete!
              </motion.div>
            ) : (
              cards.map((cardWithPos, index) => {
                return (
                  <motion.div
                    key={cardWithPos.card.id}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className="flex flex-col items-center"
                  >
                    <ScrabbleTile
                      card={cardWithPos.card}
                      size="md"
                      isInHand
                      verseReference={verseReference}
                      onClick={disabled ? undefined : () => onCardSelect(cardWithPos.card, cardWithPos.position)}
                      className={cn(
                        disabled && 'opacity-50 cursor-not-allowed',
                        !disabled && 'hover:z-10 hover:ring-2 hover:ring-green-400 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]',
                        'transition-all'
                      )}
                    />
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
