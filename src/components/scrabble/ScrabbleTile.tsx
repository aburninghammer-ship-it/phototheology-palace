// PT Scrabble Tile Component
// Displays a single card tile on the board or in hand

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ScrabbleCard, PlacedCard } from '@/types/scrabble';
import { FLOOR_GRADIENTS } from '@/types/scrabble';

interface ScrabbleTileProps {
  card: ScrabbleCard;
  placedCard?: PlacedCard;
  size?: 'sm' | 'md' | 'lg';
  isSelected?: boolean;
  isValidPosition?: boolean;
  isInHand?: boolean;
  onClick?: () => void;
  showConnections?: boolean;
  verseReference?: string;
  className?: string;
}

export function ScrabbleTile({
  card,
  placedCard,
  size = 'md',
  isSelected = false,
  isValidPosition = false,
  isInHand = false,
  onClick,
  showConnections = false,
  verseReference,
  className,
}: ScrabbleTileProps) {
  const gradient = FLOOR_GRADIENTS[card.floor] || FLOOR_GRADIENTS[1];

  // Get icon component
  const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.BookOpen;

  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-16 text-[8px]',
    md: 'w-20 h-28 text-xs',
    lg: 'w-28 h-40 text-sm',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const codeSizes = {
    sm: 'text-[10px]',
    md: 'text-sm',
    lg: 'text-lg',
  };

  return (
    <motion.div
      className={cn(
        'relative rounded-lg border-2 flex flex-col items-center justify-center gap-1 p-1 cursor-pointer transition-all',
        `bg-gradient-to-br ${gradient.from} ${gradient.to}`,
        gradient.border,
        sizeClasses[size],
        isSelected && 'ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]',
        isValidPosition && 'ring-2 ring-green-400 animate-pulse',
        isInHand && 'hover:scale-110 hover:-translate-y-2',
        onClick && 'cursor-pointer',
        className
      )}
      style={isSelected ? { boxShadow: `0 0 20px ${gradient.glow}` } : undefined}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05 } : undefined}
      whileTap={onClick ? { scale: 0.95 } : undefined}
      initial={isInHand ? { scale: 0, rotateY: 180 } : undefined}
      animate={isInHand ? { scale: 1, rotateY: 0 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Floor indicator */}
      <div className="absolute top-1 left-1 text-[8px] opacity-60">
        F{card.floor}
      </div>

      {/* Icon */}
      <IconComponent
        className={cn(iconSizes[size], 'opacity-80')}
        style={{ color: gradient.glow.replace('rgba(', 'rgb(').replace(',0.5)', ')') }}
      />

      {/* Code */}
      <span className={cn(
        'font-bold',
        codeSizes[size],
        `bg-gradient-to-r ${gradient.text} bg-clip-text text-transparent`
      )}>
        {card.code}
      </span>

      {/* Name (only on md and lg) */}
      {size !== 'sm' && (
        <span className="text-center text-muted-foreground leading-tight px-1 line-clamp-2">
          {card.name}
        </span>
      )}

      {/* Verse reference badge */}
      {verseReference && size !== 'sm' && (
        <span className="text-[7px] text-center text-muted-foreground/70 px-1 leading-tight line-clamp-1 mt-0.5">
          📖 {verseReference}
        </span>
      )}

      {/* Player name badge (for placed cards) */}
      {placedCard && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-background/90 border border-border rounded px-1.5 py-0.5 text-[8px] whitespace-nowrap">
          {placedCard.playerName}
        </div>
      )}

      {/* Connection indicators */}
      {showConnections && placedCard?.connections && (
        <>
          {placedCard.connections.some(c => c.direction === 'up') && (
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          {placedCard.connections.some(c => c.direction === 'down') && (
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          {placedCard.connections.some(c => c.direction === 'left') && (
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
          {placedCard.connections.some(c => c.direction === 'right') && (
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          )}
        </>
      )}
    </motion.div>
  );
}

// Empty tile placeholder for valid positions
interface EmptyTileProps {
  onClick?: () => void;
  isHighlighted?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyTile({ onClick, isHighlighted = false, size = 'md' }: EmptyTileProps) {
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-20 h-28',
    lg: 'w-28 h-40',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  return (
    <motion.div
      className={cn(
        'rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 cursor-pointer transition-all',
        sizeClasses[size],
        isHighlighted
          ? 'border-green-400 bg-green-400/20 shadow-[0_0_20px_rgba(74,222,128,0.4)]'
          : 'border-border/30 bg-background/20 hover:border-border/60'
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isHighlighted ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 10px rgba(74,222,128,0.3)',
          '0 0 25px rgba(74,222,128,0.5)',
          '0 0 10px rgba(74,222,128,0.3)',
        ],
      } : undefined}
      transition={isHighlighted ? {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      } : undefined}
    >
      <LucideIcons.Plus className={cn(
        iconSizes[size],
        isHighlighted ? 'text-green-400' : 'text-muted-foreground opacity-40'
      )} />
      {isHighlighted && size !== 'sm' && (
        <span className="text-[10px] text-green-400 font-medium">Place here</span>
      )}
    </motion.div>
  );
}
