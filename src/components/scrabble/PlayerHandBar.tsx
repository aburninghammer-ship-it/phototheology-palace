// PT Scrabble Player Hand Bar
// Bottom bar showing player's cards

import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleCard } from '@/types/scrabble';
import { cn } from '@/lib/utils';

interface PlayerHandBarProps {
  cards: ScrabbleCard[];
  selectedCard?: ScrabbleCard | null;
  onCardSelect: (card: ScrabbleCard) => void;
  onRefresh?: () => void;
  disabled?: boolean;
  score?: number;
  verseReference?: string;
  className?: string;
}

export function PlayerHandBar({
  cards,
  selectedCard,
  onCardSelect,
  onRefresh,
  disabled = false,
  score = 0,
  verseReference,
  className,
}: PlayerHandBarProps) {
  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-gradient-to-t from-background via-background/95 to-transparent',
      'border-t border-border/50',
      'pb-safe',
      className
    )}>
      {/* Score display */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Hand className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {cards.length} cards in hand
            </span>
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

      {/* Cards */}
      <div className="overflow-x-auto px-4 pb-4">
        <div className="flex gap-2 min-w-max">
          <AnimatePresence mode="popLayout">
            {cards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground text-sm py-8 text-center w-full"
              >
                No cards in hand. Wait for game to start!
              </motion.div>
            ) : (
              cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0, x: -20 }}
                  animate={{ scale: 1, x: 0 }}
                  exit={{ scale: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <ScrabbleTile
                    card={card}
                    size="md"
                    isSelected={selectedCard?.id === card.id}
                    isInHand
                    verseReference={verseReference}
                    onClick={disabled ? undefined : () => onCardSelect(card)}
                    className={cn(
                      disabled && 'opacity-50 cursor-not-allowed',
                      !disabled && 'hover:z-10'
                    )}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Selected card hint */}
      <AnimatePresence>
        {selectedCard && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-medium"
          >
            Tap a valid position on the board to place {selectedCard.code}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
