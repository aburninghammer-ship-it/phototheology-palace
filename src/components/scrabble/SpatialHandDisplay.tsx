// PT Scrabble Spatial Hand Display
// Shows cards arranged spatially to preview their board positions

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight, ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft } from 'lucide-react';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleCard, BoardPosition } from '@/types/scrabble';
import { cn } from '@/lib/utils';

export interface CardWithPosition {
  card: ScrabbleCard;
  position: BoardPosition;
  direction: string; // For display label
  isFirstCard?: boolean; // True if board is empty - any card can go first
}

interface SpatialHandDisplayProps {
  cards: CardWithPosition[];
  onCardSelect: (card: ScrabbleCard, position: BoardPosition) => void;
  disabled?: boolean;
  score?: number;
  className?: string;
}

// Direction to display position mapping (relative to center)
const DIRECTION_LAYOUT: Record<string, { x: number; y: number; label: string; icon: any }> = {
  'up': { x: 0, y: -1, label: 'Above', icon: ArrowUp },
  'up-right': { x: 1, y: -1, label: 'Upper Right', icon: ArrowUpRight },
  'right': { x: 1, y: 0, label: 'Right', icon: ArrowRight },
  'down-right': { x: 1, y: 1, label: 'Lower Right', icon: ArrowDownRight },
  'down': { x: 0, y: 1, label: 'Below', icon: ArrowDown },
  'down-left': { x: -1, y: 1, label: 'Lower Left', icon: ArrowDownLeft },
  'left': { x: -1, y: 0, label: 'Left', icon: ArrowLeft },
  'up-left': { x: -1, y: -1, label: 'Upper Left', icon: ArrowUpLeft },
};

export function SpatialHandDisplay({
  cards,
  onCardSelect,
  disabled = false,
  score = 0,
  className,
}: SpatialHandDisplayProps) {
  // Sort cards by direction for consistent layout
  const sortedCards = useMemo(() => {
    const directionOrder = ['up-left', 'up', 'up-right', 'left', 'right', 'down-left', 'down', 'down-right'];
    return [...cards].sort((a, b) => {
      const aIndex = directionOrder.indexOf(a.direction);
      const bIndex = directionOrder.indexOf(b.direction);
      return aIndex - bIndex;
    });
  }, [cards]);

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 z-40',
      'bg-gradient-to-t from-background via-background/95 to-transparent',
      'border-t border-border/50',
      'pb-safe',
      className
    )}>
      {/* Header with score */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{cards.length}</span> cards ready to place
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="text-lg font-bold text-yellow-500">{score} pts</span>
        </div>
      </div>

      {/* Instruction - different for first card vs subsequent */}
      <div className="text-center text-sm text-muted-foreground mb-2">
        {cards[0]?.isFirstCard
          ? "Pick any card to start! Explain how it applies to the verse."
          : "Tap a card to place it and explain the connection"}
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
              sortedCards.map((cardWithPos, index) => {
                const layout = DIRECTION_LAYOUT[cardWithPos.direction];
                const DirectionIcon = layout?.icon || ArrowUp;
                const isFirstCard = cardWithPos.isFirstCard;

                // Calculate vertical offset based on direction (arc effect) - flat for first cards
                const isTop = !isFirstCard && cardWithPos.direction.includes('up');
                const isMiddle = !isFirstCard && (cardWithPos.direction === 'left' || cardWithPos.direction === 'right');
                const verticalOffset = isFirstCard ? 0 : isTop ? -20 : isMiddle ? -10 : 0;

                return (
                  <motion.div
                    key={cardWithPos.card.id}
                    initial={{ scale: 0, y: 20 }}
                    animate={{ scale: 1, y: verticalOffset }}
                    exit={{ scale: 0, y: 20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className="flex flex-col items-center"
                  >
                    {/* Direction indicator - hidden for first card */}
                    {!isFirstCard && (
                      <div className="flex items-center gap-1 mb-1 text-xs text-muted-foreground">
                        <DirectionIcon className="h-3 w-3" />
                        <span className="hidden sm:inline">{layout?.label}</span>
                      </div>
                    )}

                    <ScrabbleTile
                      card={cardWithPos.card}
                      size="md"
                      isInHand
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
