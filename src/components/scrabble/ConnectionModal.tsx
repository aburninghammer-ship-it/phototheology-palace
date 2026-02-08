// PT Scrabble Connection Modal
// Modal for explaining connections when placing a card

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  Check,
  Cross,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleCard, PlacedCard, Connection, BoardPosition } from '@/types/scrabble';
import { calculateScoreWithTimeBonus, SCRABBLE_SCORING, getDirection } from '@/types/scrabble';
import { findSharedTags } from '@/data/scrabbleCards';
import { cn } from '@/lib/utils';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (connections: Connection[], explanation: string, isChristConnection: boolean) => void;
  card: ScrabbleCard;
  position: BoardPosition;
  adjacentCards: PlacedCard[];
}

export function ConnectionModal({
  isOpen,
  onClose,
  onSubmit,
  card,
  position,
  adjacentCards,
}: ConnectionModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(SCRABBLE_SCORING.TIMER_SECONDS);
  const [connections, setConnections] = useState<Record<string, string>>({});
  const [isChristConnection, setIsChristConnection] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(SCRABBLE_SCORING.TIMER_SECONDS);
      setConnections({});
      setIsChristConnection(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  // Get direction icon (8 directions including diagonals)
  const getDirectionIcon = (dir: Connection['direction']) => {
    switch (dir) {
      case 'up': return <ArrowUp className="h-4 w-4" />;
      case 'down': return <ArrowDown className="h-4 w-4" />;
      case 'left': return <ArrowLeft className="h-4 w-4" />;
      case 'right': return <ArrowRight className="h-4 w-4" />;
      case 'up-left': return <ArrowUpLeft className="h-4 w-4" />;
      case 'up-right': return <ArrowUpRight className="h-4 w-4" />;
      case 'down-left': return <ArrowDownLeft className="h-4 w-4" />;
      case 'down-right': return <ArrowDownRight className="h-4 w-4" />;
      default: return <ArrowUp className="h-4 w-4" />;
    }
  };

  // Get shared tags as hints
  const getConnectionHints = useCallback((adjacentCard: PlacedCard): string[] => {
    return findSharedTags(card, adjacentCard.card);
  }, [card]);

  // Handle submit
  const handleSubmit = () => {
    const connectionList: Connection[] = adjacentCards
      .filter(ac => connections[ac.moveId]?.trim())
      .map(ac => ({
        targetCardId: ac.card.id,
        targetPosition: ac.position,
        direction: getDirection(position, ac.position) || 'up',
        explanation: connections[ac.moveId],
        isChristConnection: isChristConnection,
      }));

    if (connectionList.length === 0) {
      return; // Must have at least one connection
    }

    const mainExplanation = Object.values(connections).filter(Boolean).join(' | ');
    onSubmit(connectionList, mainExplanation, isChristConnection);
  };

  // Calculate potential score with time bonus
  const potentialConnections = adjacentCards.filter(ac => connections[ac.moveId]?.trim()).length;
  const scoreBreakdown = potentialConnections > 0
    ? calculateScoreWithTimeBonus(potentialConnections, isChristConnection, timeLeft)
    : { baseScore: 0, timeBonus: 0, total: 0 };

  const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 30 ? 'text-yellow-500' : 'text-green-500';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Explain Your Connections</span>
            <div className={cn('flex items-center gap-2 font-mono', timerColor)}>
              <Clock className="h-5 w-5" />
              <span className="text-2xl">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            Explain how your card connects to adjacent cards. Faster = more points!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Your card */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <ScrabbleTile card={card} size="sm" />
            <div>
              <p className="font-medium">Placing: {card.name}</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          </div>

          {/* Adjacent cards to connect to */}
          <div className="space-y-4">
            {adjacentCards.map(ac => {
              const direction = getDirection(position, ac.position);
              const hints = getConnectionHints(ac);
              const hasConnection = !!connections[ac.moveId]?.trim();

              return (
                <motion.div
                  key={ac.moveId}
                  className={cn(
                    'p-4 rounded-lg border transition-colors',
                    hasConnection ? 'border-green-500 bg-green-500/5' : 'border-border'
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start gap-4">
                    {/* Direction indicator */}
                    <div className="flex flex-col items-center gap-1">
                      {getDirectionIcon(direction || 'up')}
                      <span className="text-xs text-muted-foreground capitalize">
                        {direction}
                      </span>
                    </div>

                    {/* Adjacent card */}
                    <ScrabbleTile card={ac.card} size="sm" />

                    {/* Connection input */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium">
                          Connect to {ac.card.name}
                        </Label>
                        {hasConnection && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </div>

                      {/* Hints */}
                      {hints.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {hints.slice(0, 3).map(hint => (
                            <span
                              key={hint}
                              className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                            >
                              {hint}
                            </span>
                          ))}
                        </div>
                      )}

                      <Textarea
                        placeholder="How does your card connect to this one?"
                        value={connections[ac.moveId] || ''}
                        onChange={(e) => setConnections(prev => ({
                          ...prev,
                          [ac.moveId]: e.target.value,
                        }))}
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Christ Connection toggle */}
          <div className="flex items-center justify-between p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-3">
              <Cross className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="christ-connection" className="font-medium">
                  Christ Connection
                </Label>
                <p className="text-xs text-muted-foreground">
                  Explicit connection to Jesus Christ (2x points)
                </p>
              </div>
            </div>
            <Switch
              id="christ-connection"
              checked={isChristConnection}
              onCheckedChange={setIsChristConnection}
            />
          </div>

          {/* Score preview */}
          <div className="flex items-center justify-between p-4 bg-yellow-500/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Points</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-yellow-500">{scoreBreakdown.total}</span>
              <span className="text-sm text-muted-foreground ml-1">points</span>
              <p className="text-xs text-muted-foreground">
                {scoreBreakdown.baseScore} base
                {isChristConnection ? ' (2× Christ)' : ''}
                {scoreBreakdown.timeBonus > 0 && (
                  <span className="text-green-500"> +{scoreBreakdown.timeBonus} speed</span>
                )}
              </p>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={potentialConnections === 0}
              className="flex-1"
            >
              {potentialConnections > 0 ? `Submit (${potentialConnections} connection${potentialConnections !== 1 ? 's' : ''})` : 'Explain a connection'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
