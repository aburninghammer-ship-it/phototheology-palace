// PT Scrabble Board Component
// Displays the 2D grid board with pan/zoom

import { useMemo, useState, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, Hand, MousePointerClick, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrabbleTile, EmptyTile } from './ScrabbleTile';
import type { PlacedCard, BoardPosition, ScrabbleCard } from '@/types/scrabble';
import { positionKey, parsePositionKey, getValidPlacements } from '@/types/scrabble';
import { cn } from '@/lib/utils';

interface ScrabbleBoardProps {
  boardState: Record<string, PlacedCard>;
  selectedCard?: ScrabbleCard | null;
  onPositionClick?: (position: BoardPosition) => void;
  onCardClick?: (placedCard: PlacedCard) => void;
  validPositions?: BoardPosition[];
  verseReference?: string;
  verseText?: string;
  className?: string;
}

export function ScrabbleBoard({
  boardState,
  selectedCard,
  onPositionClick,
  onCardClick,
  validPositions: externalValidPositions,
  verseReference,
  verseText,
  className,
}: ScrabbleBoardProps) {
  const [hoveredPosition, setHoveredPosition] = useState<string | null>(null);

  // Calculate valid positions
  const validPositions = useMemo(() => {
    if (externalValidPositions) return externalValidPositions;
    return getValidPlacements(boardState);
  }, [boardState, externalValidPositions]);

  const validPositionKeys = useMemo(() =>
    new Set(validPositions.map(p => positionKey(p))),
    [validPositions]
  );

  // Calculate board bounds
  const bounds = useMemo(() => {
    const positions = Object.keys(boardState).map(parsePositionKey);
    if (positions.length === 0) {
      return { minX: -2, maxX: 2, minY: -2, maxY: 2 };
    }

    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);

    // Add padding around the board
    return {
      minX: Math.min(...xs) - 2,
      maxX: Math.max(...xs) + 2,
      minY: Math.min(...ys) - 2,
      maxY: Math.max(...ys) + 2,
    };
  }, [boardState]);

  // Generate grid cells
  const gridCells = useMemo(() => {
    const cells: { x: number; y: number; key: string; placedCard?: PlacedCard; isValid: boolean }[] = [];

    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      for (let x = bounds.minX; x <= bounds.maxX; x++) {
        const key = positionKey({ x, y });
        const placedCard = boardState[key];
        const isValid = validPositionKeys.has(key);

        // Only include cells that have a card or are valid positions
        if (placedCard || isValid) {
          cells.push({ x, y, key, placedCard, isValid });
        }
      }
    }

    return cells;
  }, [bounds, boardState, validPositionKeys]);

  const handleCellClick = useCallback((position: BoardPosition) => {
    if (onPositionClick && validPositionKeys.has(positionKey(position))) {
      onPositionClick(position);
    }
  }, [onPositionClick, validPositionKeys]);

  const gridWidth = bounds.maxX - bounds.minX + 1;
  const gridHeight = bounds.maxY - bounds.minY + 1;

  return (
    <div className={cn('relative w-full h-full bg-background/50 rounded-lg overflow-hidden', className)}>
      {/* Highlighted verse banner on the board */}
      {verseReference && (
        <div className="absolute top-0 left-0 right-0 z-20 px-3 py-2">
          <div className="glass-card rounded-xl px-4 py-3 relative overflow-hidden">
            <div className="glass-card-bubbles"><span /><span /><span /><span /><span /><span /><span /><span /></div>
            <div className="relative z-10">
              <span className="font-bold text-primary text-sm drop-shadow-sm">📖 {verseReference}</span>
              {verseText && (
                <p className="text-xs text-foreground/70 italic leading-relaxed mt-1 line-clamp-2">"{verseText}"</p>
              )}
            </div>
          </div>
        </div>
      )}
      <TransformWrapper
        initialScale={1}
        minScale={0.3}
        maxScale={2}
        centerOnInit
        limitToBounds={false}
        panning={{ velocityDisabled: true }}
        doubleClick={{ disabled: true }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-1">
              <Button size="icon" variant="secondary" onClick={() => zoomIn()}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={() => zoomOut()}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" onClick={() => resetTransform()}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%' }}
              contentStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '100%',
                minHeight: '100%',
              }}
            >
              {/* Grid container */}
              <div
                className="relative p-8"
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${gridWidth}, 88px)`,
                  gridTemplateRows: `repeat(${gridHeight}, 120px)`,
                  gap: '8px',
                }}
              >
                {gridCells.map(({ x, y, key, placedCard, isValid }) => {
                  const gridCol = x - bounds.minX + 1;
                  const gridRow = y - bounds.minY + 1;

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-center"
                      style={{
                        gridColumn: gridCol,
                        gridRow: gridRow,
                      }}
                      onMouseEnter={() => setHoveredPosition(key)}
                      onMouseLeave={() => setHoveredPosition(null)}
                    >
                      {placedCard ? (
                        <ScrabbleTile
                          card={placedCard.card}
                          placedCard={placedCard}
                          size="md"
                          showConnections
                          verseReference={verseReference}
                          onClick={onCardClick ? () => onCardClick(placedCard) : undefined}
                        />
                      ) : isValid ? (
                        <EmptyTile
                          size="md"
                          isHighlighted={selectedCard !== null && selectedCard !== undefined}
                          onClick={() => handleCellClick({ x, y })}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Board stats */}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        {Object.keys(boardState).length} cards on board | {validPositions.length} valid positions
      </div>

      {/* Compact instruction hint */}
      <AnimatePresence>
        {!selectedCard && Object.keys(boardState).length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none z-20"
          >
            <div className="bg-background/90 border border-primary/40 rounded-lg px-4 py-2 shadow-lg flex items-center gap-2">
              <Hand className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {Object.keys(boardState).length === 0
                  ? 'Tap a card below to start'
                  : 'Tap a card below to place it'
                }
              </span>
              <motion.div
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <ArrowDown className="h-3.5 w-3.5 text-primary shrink-0" />
              </motion.div>
            </div>
          </motion.div>
        )}

        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20"
          >
            <div className="bg-green-500/90 text-white rounded-full px-4 py-2 shadow-lg flex items-center gap-2">
              <MousePointerClick className="h-4 w-4" />
              <span className="text-sm font-medium">Now click a green + spot to place your card</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
