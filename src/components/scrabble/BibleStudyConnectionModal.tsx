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
}

// Generate suggestions based on actual PT principles from palaceData
function generateSuggestions(card: ScrabbleCard, verse: SelectedVerse): string[] {
  const suggestions: string[] = [];
  const cardCode = card.code.toUpperCase();

  // Floor 1: Furnishing (Memory & Visualization)
  if (cardCode === 'SR') { // Story Room
    suggestions.push(
      `Break ${verse.reference} into 3-7 memorable beats—what's the sequence of events?`,
      `Identify the story arc: where does it start, what's the turning point, how does it end?`,
      `Name each beat with a punchy noun or verb to make it stick in memory.`
    );
  }
  if (cardCode === 'IR') { // Imagination Room
    suggestions.push(
      `Step into ${verse.reference} using all 5 senses—what do you see, hear, feel, smell, taste?`,
      `Experience this passage as a lived moment, not just information.`,
      `What personal resonance emerges when you imagine yourself in this scene?`
    );
  }
  if (cardCode === '24') { // 24FPS Room
    suggestions.push(
      `What single visual image captures this chapter's most memorable element?`,
      `Create a mental "frame" for ${verse.reference}—quirky images stick better than dignified ones.`,
      `The image should be a trigger for instant recall, not a comprehensive summary.`
    );
  }
  if (cardCode === 'BR') { // Bible Rendered
    suggestions.push(
      `What simple glyph or symbol would compress the essence of this passage?`,
      `Think like a mapmaker—one symbol to represent this text's central movement.`,
      `Simplicity is power: /, ×, ↑, or a single word like SEED, KING, LAMB.`
    );
  }
  if (cardCode === 'TR') { // Translation Room
    suggestions.push(
      `Convert ${verse.reference} into a visual—what concrete image captures the abstract truth?`,
      `Pictures are remembered 6x better than words. What would you draw?`,
      `Respect the biblical metaphor—translate what's there, don't invent new imagery.`
    );
  }
  if (cardCode === 'GR') { // Gems Room
    suggestions.push(
      `What rare truth emerges when you combine ${verse.reference} with another unrelated text?`,
      `Mine for a gem—a crystallized truth most readers miss.`,
      `The best gems are anchored in multiple clear texts and have practical application.`
    );
  }

  // Floor 2: Investigation (Detective Work)
  if (cardCode === 'OR') { // Observation Room
    suggestions.push(
      `Be a detective: count people, objects, actions. What exactly is happening in ${verse.reference}?`,
      `Notice grammar, repetition, contrasts, and what's surprisingly NOT mentioned.`,
      `Write only what you see—no interpretation yet. Quantity reveals quality.`
    );
  }
  if (cardCode === 'DC') { // Def-Com Room
    suggestions.push(
      `What key terms need definition? Look up the original Greek/Hebrew meaning.`,
      `What cultural context would be obvious to original hearers but obscure to us?`,
      `What do trusted commentators say about ${verse.reference}?`
    );
  }
  if (cardCode === 'ST') { // Symbols/Types Room
    suggestions.push(
      `What symbol or type appears in ${verse.reference}? Track it through Scripture.`,
      `Build a symbol card: Symbol → Scope (texts) → Sign (meaning) → Christ-locus.`,
      `How does this symbol find its ultimate fulfillment in Jesus?`
    );
  }
  if (cardCode === 'QR') { // Questions Room
    suggestions.push(
      `Generate questions: INTRA (inside the passage), INTER (across Scripture), PALACE (PT framework).`,
      `Why this word? Why here? Why now? What other texts connect?`,
      `Good questions expose what you don't know—aim for 50+ questions per text.`
    );
  }

  // Floor 3: Principles (Interpretation Lenses)
  if (cardCode === 'QA') { // Q&A Room
    suggestions.push(
      `What fundamental question does ${verse.reference} address about God, humanity, or salvation?`,
      `Frame the passage as answering a catechism-style question.`,
      `What doctrinal truth is being established here?`
    );
  }

  // Floor 4: Dimensions
  if (cardCode === 'LR') { // Literal Room
    suggestions.push(
      `What is the plain historical/grammatical meaning of ${verse.reference}?`,
      `Before going deeper, understand the literal foundation.`,
      `What did this mean to the original audience in their context?`
    );
  }
  if (cardCode === 'CR') { // Christ Room
    suggestions.push(
      `How does ${verse.reference} point to Christ—explicitly or typologically?`,
      `Jesus is the central figure of all Scripture. Where is He here?`,
      `What aspect of Christ's person, work, or offices is revealed?`
    );
  }
  if (cardCode === 'DR') { // Dimensions Room
    suggestions.push(
      `Read ${verse.reference} through all 5 dimensions: Literal, Christ, Personal, Church, Heaven.`,
      `Each dimension reveals different applications of the same truth.`,
      `How does this passage speak to you individually and to the corporate body?`
    );
  }

  // Floor 5: Time & Space
  if (cardCode === 'C6') { // Cycle 6 Room
    suggestions.push(
      `Which cycle does ${verse.reference} fit into? (@Ad, @No, @Ab, @Mo, @Cy, @CyC, @Sp, @Re)`,
      `Identify the cycle pattern: Fall → Covenant → Sanctuary → Enemy → Restoration.`,
      `How does this passage repeat or escalate a previous cycle?`
    );
  }
  if (cardCode === 'TZ') { // Time Zones Room
    suggestions.push(
      `Where does ${verse.reference} fit? Earth-Past, Earth-Now, Earth-Future, Heaven-Past, Heaven-Now, or Heaven-Future?`,
      `Locate the passage in the 6 time zones of redemptive history.`,
      `What's happening simultaneously on earth and in heaven?`
    );
  }

  // Floor 6: Prophecy & Eschatology
  if (cardCode === 'BL') { // Blueprint Room
    suggestions.push(
      `How does ${verse.reference} connect to the sanctuary pattern?`,
      `The tabernacle is God's visual aid for salvation. What article or service applies?`,
      `Trace the sanctuary symbolism: outer court, holy place, most holy place.`
    );
  }
  if (cardCode === 'PR') { // Prophecy Room
    suggestions.push(
      `What prophetic significance does ${verse.reference} carry?`,
      `How does this passage fit into God's revealed timeline?`,
      `What was fulfilled? What awaits fulfillment?`
    );
  }
  if (cardCode === 'FE') { // Feasts Room
    suggestions.push(
      `Which of the 7 feasts (Passover, Unleavened, Firstfruits, Pentecost, Trumpets, Atonement, Tabernacles) connects to ${verse.reference}?`,
      `The feasts are prophetic markers. How does this text illuminate them?`,
      `What aspect of Christ's work does this feast/passage reveal?`
    );
  }

  // Cycles
  if (cardCode.startsWith('@')) {
    suggestions.push(
      `${verse.reference} fits within this covenant cycle—identify the Fall, Covenant, Sanctuary, Enemy, and Restoration elements.`,
      `How does this cycle echo previous cycles and anticipate future ones?`,
      `Christ is the center of every cycle. Where do you see Him here?`
    );
  }

  // Dimensions (1D-5D)
  if (/^[1-5]D$/i.test(cardCode)) {
    const dimExplanations: Record<string, string[]> = {
      '1D': [
        `What is the literal, historical meaning of ${verse.reference}?`,
        `Ground yourself in what the text plainly says before going deeper.`
      ],
      '2D': [
        `How does ${verse.reference} reveal Christ—His character, offices, or work?`,
        `This is the Christ dimension: where is Jesus in this text?`
      ],
      '3D': [
        `How does ${verse.reference} apply to you personally?`,
        `The Personal dimension: what is God saying to you individually?`
      ],
      '4D': [
        `How does ${verse.reference} apply to the church corporately?`,
        `The Church dimension: what does this mean for the body of believers?`
      ],
      '5D': [
        `How does ${verse.reference} connect to heavenly realities?`,
        `The Heaven dimension: what's happening in the throne room that relates to this text?`
      ],
    };
    const dims = dimExplanations[cardCode.toUpperCase()];
    if (dims) suggestions.push(...dims);
  }

  // Heavens (1H-3H)
  if (/^[1-3]H$/i.test(cardCode)) {
    const heavenExplanations: Record<string, string[]> = {
      '1H': [
        `First Heaven (atmospheric): How does ${verse.reference} speak to earthly, natural realities?`,
        `Weather, sky, birds—the visible realm around us.`
      ],
      '2H': [
        `Second Heaven (cosmic): How does ${verse.reference} connect to cosmic or spiritual realities?`,
        `Stars, planets, angelic realm—the cosmic theater.`
      ],
      '3H': [
        `Third Heaven (throne room): How does ${verse.reference} connect to God's throne?`,
        `Paradise, the divine presence—the ultimate destination.`
      ],
    };
    const heavens = heavenExplanations[cardCode.toUpperCase()];
    if (heavens) suggestions.push(...heavens);
  }

  // Math Room
  if (cardCode === 'MATH') {
    suggestions.push(
      `What numerical patterns appear in ${verse.reference}? Numbers in Scripture are often significant.`,
      `Look for: 7 (completion), 12 (government), 40 (testing), 3 (divine), 4 (earth).`,
      `How do the numbers in this text reveal deeper meaning?`
    );
  }

  // Default suggestions using card's own description
  if (suggestions.length === 0 && card.description) {
    suggestions.push(
      `Apply the ${card.name} principle: ${card.description}`,
      `How does the ${card.name} (${card.code}) method unlock ${verse.reference}?`,
      `Use the ${card.name} lens to discover new insights in this passage.`
    );
  }

  // Fallback if still empty
  if (suggestions.length === 0) {
    suggestions.push(
      `How does the ${card.name} principle apply to ${verse.reference}?`,
      `What new insight emerges when viewing this passage through ${card.code}?`,
      `Connect the ${card.name} method to the truth revealed here.`
    );
  }

  return suggestions.slice(0, 3);
}

export function BibleStudyConnectionModal({
  isOpen,
  onClose,
  onSubmit,
  card,
  position,
  adjacentCards,
  seedVerse,
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
  // If no adjacent cards (first play), give 1 base point
  const potentialConnections = Math.max(1, adjacentCards.length);
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
            Explain how <strong>{card.name}</strong> connects to <strong>{seedVerse.reference}</strong>
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
