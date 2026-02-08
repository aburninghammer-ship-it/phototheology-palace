// PT Scrabble Bible Study Connection Modal
// Modal for explaining how a PT principle applies to the central verse

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Sparkles,
  Check,
  Cross,
  Lightbulb,
  Book,
  ChevronDown,
  ChevronUp,
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
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { ScrabbleTile } from './ScrabbleTile';
import type { ScrabbleCard, PlacedCard, Connection, BoardPosition } from '@/types/scrabble';
import { calculateScoreWithTimeBonus, SCRABBLE_SCORING, getDirection } from '@/types/scrabble';
import type { SelectedVerse } from './VerseSelectionScreen';
import { cn } from '@/lib/utils';

interface BibleStudyConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (connections: Connection[], explanation: string, isChristConnection: boolean) => void;
  card: ScrabbleCard;
  position: BoardPosition;
  adjacentCards: PlacedCard[];
  seedVerse: SelectedVerse;
  isFirstCard?: boolean; // True if this is the first card on the board
}

// Generate AI-suggested explanations based on card and verse
function generateSuggestions(card: ScrabbleCard, verse: SelectedVerse): string[] {
  const suggestions: string[] = [];
  const cardCode = card.code.toLowerCase();
  const cardName = card.name.toLowerCase();
  
  // Story Room suggestions
  if (cardCode === 'sr' || cardName.includes('story')) {
    suggestions.push(
      `The story in ${verse.reference} reveals a narrative pattern that echoes throughout Scripture.`,
      `This passage tells a story of God's redemptive action toward His people.`,
      `We can visualize the scene in ${verse.reference} to better remember and understand its meaning.`
    );
  }
  
  // Observation Room suggestions
  if (cardCode === 'or' || cardName.includes('observation')) {
    suggestions.push(
      `Key details to notice in ${verse.reference}: the specific words, actions, and context.`,
      `Observing carefully, we see that every detail in this passage has significance.`,
      `What stands out in ${verse.reference} that we might otherwise miss?`
    );
  }
  
  // Concentration Room (Christ-centered) suggestions
  if (cardCode === 'cr' || cardName.includes('concentration') || cardName.includes('christ')) {
    suggestions.push(
      `${verse.reference} points to Christ as the ultimate fulfillment of this truth.`,
      `Jesus is the central figure—every aspect of this passage connects to His person and work.`,
      `Through the Concentration Room lens, we see Christ revealed in ${verse.reference}.`
    );
  }
  
  // Dimensions suggestions
  if (cardCode.includes('d') && /^\d/.test(cardCode)) {
    const dimNum = cardCode[0];
    const dimExplanations: Record<string, string> = {
      '1': `The literal meaning of ${verse.reference} is the foundation for deeper understanding.`,
      '2': `This passage reveals Christ personally—His character, His work, His love.`,
      '3': `Personally, ${verse.reference} applies to my life by teaching me to...`,
      '4': `For the church, ${verse.reference} teaches us about our corporate identity and mission.`,
      '5': `Looking heavenward, ${verse.reference} connects to the cosmic reality of God's throne.`,
    };
    if (dimExplanations[dimNum]) {
      suggestions.push(dimExplanations[dimNum]);
    }
  }
  
  // Cycle suggestions
  if (cardCode.startsWith('@')) {
    suggestions.push(
      `${verse.reference} fits within this covenant cycle, showing God's consistent pattern of redemption.`,
      `We see echoes of this cycle throughout salvation history, including in ${verse.reference}.`,
      `The cycle pattern (Fall → Covenant → Sanctuary → Enemy → Restoration) illuminates this passage.`
    );
  }
  
  // Sanctuary/Blue Room suggestions
  if (cardCode === 'bl' || cardName.includes('sanctuary') || cardName.includes('blue')) {
    suggestions.push(
      `${verse.reference} connects to the sanctuary pattern that reveals God's plan of salvation.`,
      `Through the sanctuary lens, we see how this passage points to Christ's ministry.`,
      `The sanctuary furniture helps us understand the deeper meaning of ${verse.reference}.`
    );
  }
  
  // Prophecy suggestions
  if (cardCode === 'pr' || cardName.includes('prophecy')) {
    suggestions.push(
      `${verse.reference} has prophetic significance that points to end-time events.`,
      `Through the prophetic lens, we see how this passage fits into God's master plan.`,
      `The prophetic timeline helps us understand when and how this applies.`
    );
  }

  // Questions Room suggestions
  if (cardCode === 'qr' || cardCode === '?' || cardName.includes('question')) {
    suggestions.push(
      `What questions does ${verse.reference} answer? What new questions does it raise?`,
      `Asking "who, what, when, where, why, how" unlocks deeper meaning in this passage.`,
      `Interrogating the text: Why did God include this? What was the original audience meant to learn?`
    );
  }

  // Gems Room suggestions
  if (cardCode === 'gr' || cardName.includes('gem')) {
    suggestions.push(
      `The gem in ${verse.reference} is a truth we can carry with us always.`,
      `This passage contains a powerful insight worth preserving and sharing.`,
      `What memorable truth can we extract from ${verse.reference}?`
    );
  }

  // Fire Room suggestions
  if (cardCode === 'frm' || cardName.includes('fire')) {
    suggestions.push(
      `${verse.reference} moves the heart—let it burn within you as you meditate on it.`,
      `The emotional weight of this passage should transform how we live.`,
      `This truth is not just information but transformation—feel it deeply.`
    );
  }

  // Default suggestions if none match
  if (suggestions.length === 0) {
    suggestions.push(
      `The ${card.name} principle helps us understand ${verse.reference} more deeply.`,
      `Applying ${card.code} to this passage reveals new insights about God's character.`,
      `Through the ${card.name} lens, ${verse.reference} takes on richer meaning.`
    );
  }

  return suggestions.slice(0, 3); // Return max 3 suggestions
}

export function BibleStudyConnectionModal({
  isOpen,
  onClose,
  onSubmit,
  card,
  position,
  adjacentCards,
  seedVerse,
  isFirstCard = false,
}: BibleStudyConnectionModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(SCRABBLE_SCORING.TIMER_SECONDS); // 2 minutes
  const [explanation, setExplanation] = useState('');
  const [isChristConnection, setIsChristConnection] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = generateSuggestions(card, seedVerse);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(SCRABBLE_SCORING.TIMER_SECONDS);
      setExplanation('');
      setIsChristConnection(false);
      setShowSuggestions(true);
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

  // Handle suggestion click
  const handleUseSuggestion = (suggestion: string) => {
    setExplanation(suggestion);
    setShowSuggestions(false);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!explanation.trim()) return;

    // Create connections to all adjacent cards
    const connectionList: Connection[] = adjacentCards.map(ac => ({
      targetCardId: ac.card.id,
      targetPosition: ac.position,
      direction: getDirection(position, ac.position) || 'up',
      explanation: explanation,
      isChristConnection: isChristConnection,
    }));

    onSubmit(connectionList, explanation, isChristConnection);
  };

  // Calculate potential score with time bonus
  // First card gets 1 base point (no connections to score from)
  const potentialConnections = isFirstCard ? 1 : adjacentCards.length;
  const scoreBreakdown = explanation.trim()
    ? calculateScoreWithTimeBonus(potentialConnections, isChristConnection, timeLeft)
    : { baseScore: 0, timeBonus: 0, total: 0 };

  const timerColor = timeLeft <= 10 ? 'text-red-500' : timeLeft <= 30 ? 'text-yellow-500' : 'text-green-500';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Explain Connection
            </span>
            <div className={cn('flex items-center gap-2 font-mono', timerColor)}>
              <Clock className="h-5 w-5" />
              <span className="text-2xl">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </DialogTitle>
          <DialogDescription>
            {isFirstCard
              ? <>You're starting! Explain how <strong>{card.name}</strong> applies to <strong>{seedVerse.reference}</strong></>
              : <>Explain how <strong>{card.name}</strong> connects to the verse and adjacent cards</>
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Seed Verse Display */}
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-primary/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Book className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">{seedVerse.reference}</span>
            </div>
            <p className="text-sm italic leading-relaxed">"{seedVerse.text}"</p>
          </div>

          {/* Your Card */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <ScrabbleTile card={card} size="sm" />
            <div className="flex-1">
              <p className="font-medium">Applying: {card.name} ({card.code})</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          </div>

          {/* AI Suggestions */}
          <Collapsible open={showSuggestions} onOpenChange={setShowSuggestions}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Suggested Explanations
                </span>
                {showSuggestions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              {suggestions.map((suggestion, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleUseSuggestion(suggestion)}
                  className="w-full p-3 text-left text-sm border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>{suggestion}</span>
                  </div>
                </motion.button>
              ))}
              <p className="text-xs text-muted-foreground text-center pt-1">
                Click a suggestion to use it, or write your own below
              </p>
            </CollapsibleContent>
          </Collapsible>

          {/* Custom Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation" className="flex items-center justify-between">
              <span>Your Explanation</span>
              {explanation.trim() && <Check className="h-4 w-4 text-green-500" />}
            </Label>
            <Textarea
              id="explanation"
              placeholder={`How does the ${card.name} principle help you understand ${seedVerse.reference}?`}
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
                  Your explanation explicitly connects to Jesus Christ (2x points)
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
                  <span className="text-green-500"> +{scoreBreakdown.timeBonus} speed bonus</span>
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
              disabled={!explanation.trim()}
              className="flex-1"
            >
              {explanation.trim() ? 'Submit' : 'Enter an explanation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
