// PT Scrabble Connection Modal
// Modal for explaining how card connects to the verse (first play) or previous insight

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Sparkles,
  Check,
  Cross,
  Book,
  User,
  Link,
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
import type { SelectedVerse } from './VerseSelectionScreen';
import type { StudyLogEntry } from './StudyLog';
import { cn } from '@/lib/utils';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (connections: Connection[], explanation: string, isChristConnection: boolean) => void;
  card: ScrabbleCard;
  position: BoardPosition;
  adjacentCards: PlacedCard[];
  seedVerse?: SelectedVerse; // The verse being studied
  previousEntry?: StudyLogEntry; // Previous player's insight to connect to
}

export function ConnectionModal({
  isOpen,
  onClose,
  onSubmit,
  card,
  position,
  adjacentCards,
  seedVerse,
  previousEntry,
}: ConnectionModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(SCRABBLE_SCORING.TIMER_SECONDS);
  const [explanation, setExplanation] = useState('');
  const [isChristConnection, setIsChristConnection] = useState(false);

  // Determine if this is first play (connect to verse) or subsequent (connect to previous)
  const isFirstPlay = !previousEntry;

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(SCRABBLE_SCORING.TIMER_SECONDS);
      setExplanation('');
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

  // Handle submit
  const handleSubmit = () => {
    if (!explanation.trim()) return;

    // Create connection - either to verse (first play) or to previous insight
    const connectionList: Connection[] = [{
      targetCardId: isFirstPlay ? 'verse' : (previousEntry?.id || 'previous'),
      targetPosition: position,
      direction: 'center' as any,
      explanation: explanation,
      isChristConnection: isChristConnection,
    }];

    onSubmit(connectionList, explanation, isChristConnection);
  };

  // Calculate potential score with time bonus
  const hasExplanation = explanation.trim().length > 0;
  const scoreBreakdown = hasExplanation
    ? calculateScoreWithTimeBonus(1, isChristConnection, timeLeft)
    : { baseScore: 0, timeBonus: 0, total: 0 };

  const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 30 ? 'text-yellow-500' : 'text-green-500';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {isFirstPlay ? (
                <Book className="h-5 w-5 text-primary" />
              ) : (
                <Link className="h-5 w-5 text-primary" />
              )}
              {isFirstPlay ? 'Connect to the Verse' : 'Build on Previous Insight'}
            </span>
            <div className={cn('flex items-center gap-2 font-mono', timerColor)}>
              <Clock className="h-5 w-5" />
              <span className="text-2xl">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {isFirstPlay ? (
              <>Explain how <strong>{card.name}</strong> helps you understand the verse</>
            ) : (
              <>Connect <strong>{card.name}</strong> to {previousEntry?.playerName}'s insight</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* What to connect to - Verse (first play) or Previous Insight */}
          {isFirstPlay && seedVerse ? (
            /* First Play: Show the seed verse */
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{seedVerse.reference}</span>
                <span className="text-xs px-2 py-0.5 bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400">
                  Connect to this
                </span>
              </div>
              <p className="text-sm italic leading-relaxed">"{seedVerse.text}"</p>
            </div>
          ) : previousEntry ? (
            /* Subsequent Play: Show the previous insight */
            <div className="space-y-3">
              {/* Small verse reference */}
              {seedVerse && (
                <div className="p-2 bg-muted/50 rounded border text-xs">
                  <span className="text-muted-foreground">Studying: </span>
                  <span className="font-medium">{seedVerse.reference}</span>
                </div>
              )}

              {/* Previous insight to connect to */}
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600 dark:text-green-400">{previousEntry.playerName}</span>
                  <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{previousEntry.cardCode}</span>
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full text-green-600 dark:text-green-400 ml-auto">
                    Build on this
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{previousEntry.cardName}</p>
                <p className="text-sm leading-relaxed">"{previousEntry.explanation}"</p>
              </div>
            </div>
          ) : seedVerse ? (
            /* Fallback: Show verse if no previous entry */
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-primary/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Book className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">{seedVerse.reference}</span>
              </div>
              <p className="text-sm italic leading-relaxed">"{seedVerse.text}"</p>
            </div>
          ) : null}

          {/* Your card */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <ScrabbleTile card={card} size="sm" />
            <div>
              <p className="font-medium">Applying: {card.name}</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          </div>

          {/* Explanation input */}
          <div className="space-y-2">
            <Label htmlFor="explanation" className="flex items-center justify-between">
              <span>Your Explanation</span>
              {hasExplanation && <Check className="h-4 w-4 text-green-500" />}
            </Label>
            <Textarea
              id="explanation"
              placeholder={isFirstPlay
                ? `How does the text relate to ${card.name}?`
                : `How does the text relate to ${card.name}, building on ${previousEntry?.playerName}'s insight?`
              }
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
              className="text-sm"
            />
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
              disabled={!hasExplanation}
              className="flex-1"
            >
              {hasExplanation ? 'Submit' : 'Enter an explanation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
