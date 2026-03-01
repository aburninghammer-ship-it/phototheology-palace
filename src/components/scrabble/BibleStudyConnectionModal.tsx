// PT Scrabble Bible Study Connection Modal
// Modal for explaining how a PT principle applies to the verse or previous insight

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Sparkles,
  Check,
  Cross,
  Book,
  Bot,
  Loader2,
  Link,
  User,
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
import { supabase } from '@/integrations/supabase/client';
import type { ScrabbleCard, PlacedCard, Connection, BoardPosition } from '@/types/scrabble';
import { calculateScoreWithTimeBonus, SCRABBLE_SCORING, getDirection } from '@/types/scrabble';
import type { SelectedVerse } from './VerseSelectionScreen';
import type { StudyLogEntry } from './StudyLog';
import { cn } from '@/lib/utils';

interface BibleStudyConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (connections: Connection[], explanation: string, isChristConnection: boolean, jeevesJudgment?: string, jeevesScore?: number, correctedExplanation?: string) => void;
  card: ScrabbleCard;
  position: BoardPosition;
  adjacentCards: PlacedCard[];
  seedVerse: SelectedVerse;
  previousEntry?: StudyLogEntry; // The previous player's insight to connect to
  jeevesAssistsUsed?: number; // How many Jeeves assists this player has used
  maxJeevesAssists?: number; // Max assists allowed (default 3)
}

// Simple, clear principle explanations for the timed game context
function getPrincipleExplanation(card: ScrabbleCard): string {
  const code = card.code.toUpperCase();

  // Dimensions
  if (code === 'LITERAL') return 'Read the text at face value. What does it plainly say in its original historical context?';
  if (code === 'CHRIST') return 'Find Jesus in this text. How does this passage point to Christ — His life, death, or ministry?';
  if (code === 'ME') return 'Make it personal. How does this text apply to your own life and walk with God?';
  if (code === 'CHURCH') return 'Think corporately. How does this passage apply to the church as a body of believers?';
  if (code === 'HEAVEN') return 'Look heavenward. How does this text connect to what is happening in heaven or the heavenly realm?';

  // Floor 1: Furnishing
  if (code === 'SR') return 'Break the passage into story beats. What are the key events in order?';
  if (code === 'IR') return 'Step into the scene with your senses. What do you see, hear, or feel in this text?';
  if (code === '24' || code === '24FPS') return 'Pick one vivid image from this text that captures its essence — like a movie frame.';
  if (code === 'BR') return 'Compress this passage into a single symbol or glyph that captures the main idea.';
  if (code === 'TR') return 'Translate the abstract truth in this text into a concrete, visual picture.';
  if (code === 'GR') return 'Mine for a gem — a rare truth most people miss when reading this passage.';

  // Floor 2: Investigation
  if (code === 'OR') return 'Be a detective. What do you observe — people, actions, repeated words, contrasts?';
  if (code === 'DC') return 'Define the key words. What do the original Hebrew/Greek terms mean? What context helps?';
  if (code === 'ST') return 'Find a symbol or type in this text. What does it represent and how does it point to Christ?';
  if (code === 'QR') return 'Ask questions of the text. Why this word? Why here? What else connects to it?';

  // Floor 3: Principles
  if (code === 'QA') return 'What big question about God, humanity, or salvation does this text answer?';
  if (code === 'PA') return 'What pattern do you see? Does this passage echo or parallel another passage in Scripture?';
  if (code === 'R66') return 'Trace a theme from this text through all 66 books. Where else does this idea appear?';
  if (code === '3A') return 'How does this text connect to the Three Angels\' Messages of Revelation 14?';
  if (code === 'CEC') return 'Find Christ in every chapter. How does this specific chapter reveal Jesus?';

  // Floor 4: Dimensions / Time Zones
  if (code === 'DR') return 'Read the text through all 5 dimensions: Literal, Christ, Personal, Church, and Heaven.';
  if (code === 'LR') return 'What is the plain, literal meaning of this text in its original setting?';
  // Christ's Offices (Concentration Room)
  if (code === 'CR-PR') return 'Find where Christ is functioning as Prophet — revealing, teaching, proclaiming, or foretelling.';
  if (code === 'CR-PT') return 'Find where Christ is functioning as Priest — sacrificing, interceding, atoning, or mediating.';
  if (code === 'CR-KI') return 'Find where Christ is functioning as King — ruling, judging, conquering, or commanding.';

  // Theme Spans (Theme Room)
  if (code === 'TRM-SA') return 'Identify how this text relates to the Sanctuary — God\'s dwelling, sacrifice, priesthood, or mediation.';
  if (code === 'TRM-LC') return 'Identify how this text relates to the Life of Christ — His incarnation, ministry, death, or resurrection.';
  if (code === 'TRM-GC') return 'Identify how this text relates to the Great Controversy — the cosmic conflict between Christ and Satan.';
  if (code === 'TRM-TP') return 'Identify how this text relates to Time-Prophecy — prophetic timelines and Daniel-Revelation sequences.';
  if (code === 'TRM-GO') return 'Identify how this text relates to the Gospel Floor — justification, righteousness by faith, grace alone.';
  if (code === 'TRM-HE') return 'Identify how this text relates to the Heaven Ceiling — eternal realities, new creation, and our ultimate hope.';
  if (code === 'H-PAST') return 'What was happening in heaven before this event? How does heaven\'s past connect here?';
  if (code === 'H-NOW') return 'What is Christ doing in heaven right now that relates to this text?';
  if (code === 'H-FUTURE') return 'What future heavenly event does this text point toward?';
  if (code === 'E-PAST') return 'What historical events on earth connect to this passage?';
  if (code === 'E-NOW') return 'How does this text apply to life on earth today?';
  if (code === 'E-FUTURE') return 'What future events on earth does this text foreshadow?';

  // Floor 5: Blueprint & Prophecy
  if (code === 'BL') return 'Connect this text to the sanctuary/tabernacle. What article or service does it relate to?';
  if (code === 'PR') return 'What prophetic significance does this text carry? What was or will be fulfilled?';
  // Feasts (Feasts Room)
  if (code === 'FE-PA') return 'Connect this text to Passover — the lamb slain, blood applied, and deliverance from death.';
  if (code === 'FE-UB') return 'Connect this text to Unleavened Bread — the removal of sin and the call to holy living.';
  if (code === 'FE-FF') return 'Connect this text to Firstfruits — the first sheaf of harvest and Christ\'s resurrection.';
  if (code === 'FE-PE') return 'Connect this text to Pentecost — the wheat harvest and the outpouring of the Holy Spirit.';
  if (code === 'FE-TR') return 'Connect this text to Trumpets — the call to awakening, gathering, and preparation for judgment.';
  if (code === 'FE-DA') return 'Connect this text to the Day of Atonement — the High Priest in the Most Holy Place, judgment, and cleansing.';
  if (code === 'FE-TA') return 'Connect this text to Tabernacles — the final harvest, God dwelling with His people, and ultimate rejoicing.';

  // Three Angels (Three Angels Room)
  if (code === '3A-1') return 'Connect this text to the First Angel — the everlasting gospel, worship the Creator, the judgment hour has come.';
  if (code === '3A-2') return 'Connect this text to the Second Angel — Babylon is fallen, apostate systems collapse.';
  if (code === '3A-3') return 'Connect this text to the Third Angel — warning against the beast and his mark, patient endurance of the saints.';

  // Time Prophecies (Mathematics Room)
  if (code === '@120') return 'Apply the @120 pattern: probation before judgment. God gives a grace period before judgment falls.';
  if (code === '@400') return 'Apply the @400 pattern: affliction before deliverance. Suffering has an exact duration and a promised end.';
  if (code === '@70Y') return 'Apply the @70y pattern: captivity followed by restoration. Judgment has limits and restoration comes on schedule.';
  if (code === '@490') return 'Apply the @490 pattern: Messiah and covenant confirmation. Christ arrived exactly on prophetic schedule.';
  if (code === '@1260') return 'Apply the @1260 pattern: truth suppressed under counterfeit authority. Persecution has God-ordained limits.';
  if (code === '@2300') return 'Apply the @2300 pattern: cosmic judgment and sanctuary cleansing. We live in the judgment hour.';

  // Connect-6 Genres
  if (code === 'C6-PR') return 'Find a prophecy that predicts, foreshadows, or fulfills the truth in this text.';
  if (code === 'C6-PA') return 'Find a parable of Jesus that illustrates or echoes the principle in this text.';
  if (code === 'C6-EP') return 'Find an apostolic letter that explains or applies the doctrine in this text.';
  if (code === 'C6-HI') return 'Find a biblical narrative or event that demonstrates this truth in action.';
  if (code === 'C6-GO') return 'Find a moment in Jesus\' life or teaching that embodies this truth.';
  if (code === 'C6-PO') return 'Find a psalm, proverb, or song that expresses this truth artistically.';

  // Floor 6: Cycles & Heavens
  if (code === '@AD') return 'Adamic Cycle: How does this text echo the Creation, Fall, or Seed promise of Genesis?';
  if (code === '@NO') return 'Noahic Cycle: How does this text echo judgment, the ark, or the rainbow covenant?';
  if (code === '@AB') return 'Abrahamic Cycle: How does this text echo covenant, faith, or the promised seed?';
  if (code === '@MO') return 'Mosaic Cycle: How does this text echo the Exodus, the Law, or the tabernacle?';
  if (code === '@CY') return 'Cyrusic Cycle: How does this text echo exile, return, or temple rebuilding?';
  if (code === '@CYC') return 'Cyrus-Christ Cycle: How does type meet antitype here — shadow meeting substance?';
  if (code === '@SP') return 'Spirit Cycle: How does this text echo Pentecost, the church age, or global mission?';
  if (code === '@RE') return 'Remnant Cycle: How does this text echo end-time witness, judgment, or the Second Coming?';
  if (code === '1H') return 'First Heaven: How does this text connect to the Babylonian destruction of Jerusalem and its restoration?';
  if (code === '2H') return 'Second Heaven: How does this text connect to 70 AD and the New Covenant order?';
  if (code === '3H') return 'Third Heaven: How does this text connect to the final judgment and new creation?';

  // Fallback — use the card's own description if available
  if (card.description) return `${card.name}: ${card.description}. Apply this lens to the text.`;
  return `Apply the ${card.name} principle to the text. What new insight emerges?`;
}

export function BibleStudyConnectionModal({
  isOpen,
  onClose,
  onSubmit,
  card,
  position,
  adjacentCards,
  seedVerse,
  previousEntry,
  jeevesAssistsUsed = 0,
  maxJeevesAssists = 3,
}: BibleStudyConnectionModalProps) {
  const [timeLeft, setTimeLeft] = useState<number>(SCRABBLE_SCORING.TIMER_SECONDS); // 2 minutes
  const [explanation, setExplanation] = useState('');
  const [isChristConnection, setIsChristConnection] = useState(false);
  const [isJudging, setIsJudging] = useState(false);
  const [jeevesJudgment, setJeevesJudgment] = useState<string | null>(null);
  const [showSeedVerse, setShowSeedVerse] = useState(false);

  // Determine if this is the first play (connect to verse) or subsequent (connect to previous)
  const isFirstPlay = !previousEntry;
  const principleExplanation = getPrincipleExplanation(card);

  // Timer countdown
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(SCRABBLE_SCORING.TIMER_SECONDS);
      setExplanation('');
      setIsChristConnection(false);
      setIsJudging(false);
      setJeevesJudgment(null);
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

  // Jeeves judging function — returns { commentary, score, corrected }
  const getJeevesJudgment = async (playerExplanation: string): Promise<{ commentary: string; score: number; corrected: string }> => {
    try {
      const scoreInstructions = `\n\nIMPORTANT: You MUST end your response with BOTH a corrected version and a score, each on their own line, in this exact format:\nCORRECTED: <the player's explanation rewritten into clear, grammatically correct sentences while preserving their meaning>\nSCORE: <number>\nwhere <number> is an integer from 1 to 10.\n- 1-4 = weak / incorrect / shallow / off-topic (player loses the card and their turn)\n- 5-6 = acceptable but surface-level\n- 7-8 = solid theological insight\n- 9-10 = exceptional, deeply connected, masterful\n\nCRITICAL: If you score BELOW 5, you MUST:\n1. Explain specifically WHY the answer fell short (was it off-topic? too vague? misapplied the principle? missed the verse context?)\n2. Give 1-2 concrete tips on how they COULD have connected "${card.name}" more effectively to the text.\n3. Offer a brief example of what a stronger answer might look like (just one sentence).\nThis helps the player learn and improve. Be honest but kind — coach, don't crush.`;

      const prompt = isFirstPlay
        ? `You are Jeeves, a wise Bible study assistant. A player is connecting the PT principle "${card.name}" to ${seedVerse.reference}.

THE VERSE: "${seedVerse.text}"

THE PRINCIPLE: ${card.name}
${card.description ? `DESCRIPTION: ${card.description}` : ''}

PLAYER'S EXPLANATION: "${playerExplanation}"

In 2-3 sentences, validate how well their explanation connects the PT principle to the verse. Be encouraging if the insight is strong, but be honest if it's weak or off-topic.${scoreInstructions}`
        : `You are Jeeves, a warm and scholarly Bible study companion. A player is building on the previous insight by connecting a new Phototheology principle.

SEED VERSE: ${seedVerse.reference} - "${seedVerse.text}"

PREVIOUS INSIGHT by ${previousEntry?.playerName}:
- Principle: ${previousEntry?.cardName} (${previousEntry?.cardCode})
- Their explanation: "${previousEntry?.explanation}"

NEW PRINCIPLE being applied: ${card.name}
${card.description ? `DESCRIPTION: ${card.description}` : ''}

PLAYER'S EXPLANATION: "${playerExplanation}"

In 2-3 crisp sentences:
1. Affirm what the player saw correctly (or explain what's missing if weak).
2. Show the specific theological thread connecting this answer to the PREVIOUS answer.
3. Add one brief additional insight they may have missed.
Keep it conversational, warm, and concise. Never use the word "dear".${scoreInstructions}`;

      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          message: prompt,
          context: 'scrabble_judgment',
        },
      });

      if (error) throw error;
      const raw = data?.content || data?.response || data?.message || '';

      // Parse corrected explanation and score from response
      const correctedMatch = raw.match(/CORRECTED:\s*(.+?)(?=\nSCORE:|\n*$)/is);
      const corrected = correctedMatch ? correctedMatch[1].trim() : playerExplanation;
      const scoreMatch = raw.match(/SCORE:\s*(\d+)/i);
      const score = scoreMatch ? Math.min(10, Math.max(1, parseInt(scoreMatch[1], 10))) : 6;
      const commentary = raw.replace(/\n?CORRECTED:\s*.+?(?=\nSCORE:|\n*$)/is, '').replace(/\n?SCORE:\s*\d+/i, '').trim() || 'Good connection!';

      return { commentary, score, corrected };
    } catch (err) {
      console.error('Error getting Jeeves judgment:', err);
      return {
        commentary: isFirstPlay
          ? `Good connection of "${card.name}" to the verse!`
          : `Nice way to build on ${previousEntry?.playerName}'s insight about ${previousEntry?.cardName}!`,
        score: 6, // Default pass on error
        corrected: playerExplanation, // Use original on error
      };
    }
  };

  // Handle submit - skip Jeeves for first card (race condition - first to submit wins)
  const handleSubmit = async () => {
    if (!explanation.trim()) return;

    // Create connections to all adjacent cards (or empty for first play)
    const connectionList: Connection[] = adjacentCards.length > 0
      ? adjacentCards.map(ac => ({
          targetCardId: ac.card.id,
          targetPosition: ac.position,
          direction: getDirection(position, ac.position) || 'up',
          explanation: explanation,
          isChristConnection: isChristConnection,
        }))
      : [{
          targetCardId: 'verse', // Connect to verse for first play
          targetPosition: position,
          direction: 'center' as any,
          explanation: explanation,
          isChristConnection: isChristConnection,
        }];

    // Only use Jeeves if assists remain
    const canUseJeeves = jeevesAssistsUsed < maxJeevesAssists;
    
    if (canUseJeeves) {
      setIsJudging(true);
      const { commentary, score, corrected } = await getJeevesJudgment(explanation);
      setJeevesJudgment(commentary);
      setIsJudging(false);
      onSubmit(connectionList, corrected, isChristConnection, commentary, score, corrected);
    } else {
      // No Jeeves assists left — auto-approve with default score
      onSubmit(connectionList, explanation, isChristConnection, undefined, 6);
    }
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
              <>Explain how <strong>{card.name}</strong> helps you understand <strong>{seedVerse.reference}</strong></>
            ) : (
              <>Connect <strong>{card.name}</strong> to {previousEntry?.playerName}'s insight about <strong>{previousEntry?.cardName}</strong></>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* What to connect to - Verse (first play) or Previous Insight (subsequent) */}
          {isFirstPlay ? (
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
          ) : (
            /* Subsequent Play: Show the previous insight to build upon */
            <div className="space-y-3">
              {/* Verse reference with expandable text */}
              <div className="bg-muted/50 rounded border text-xs overflow-hidden">
                <div
                  className="p-2 flex items-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setShowSeedVerse(!showSeedVerse)}
                >
                  <Book className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="text-muted-foreground">Studying: </span>
                  <span className="font-medium">{seedVerse.reference}</span>
                  <span className="text-muted-foreground ml-auto">{showSeedVerse ? 'hide' : 'tap to view verse'}</span>
                </div>
                {showSeedVerse && (
                  <div className="px-3 pb-2 border-t border-border">
                    <p className="text-sm italic leading-relaxed pt-2 text-foreground/80">"{seedVerse.text}"</p>
                  </div>
                )}
              </div>

              {/* Previous insight to connect to */}
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600 dark:text-green-400">{previousEntry?.playerName}</span>
                  <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{previousEntry?.cardCode}</span>
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full text-green-600 dark:text-green-400 ml-auto">
                    Build on this
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{previousEntry?.cardName}</p>
                <p className="text-sm leading-relaxed">"{previousEntry?.explanation}"</p>
              </div>
            </div>
          )}

          {/* Principle Explanation */}
          <div className="flex items-start gap-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <ScrabbleTile card={card} size="sm" />
            <div className="flex-1">
              <p className="font-semibold text-sm mb-1">{card.name} <span className="font-mono text-xs text-muted-foreground">({card.code})</span></p>
              <p className="text-sm leading-relaxed">{principleExplanation}</p>
            </div>
          </div>

          {/* Custom Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation" className="flex items-center justify-between">
              <span>Your Explanation</span>
              {explanation.trim() && <Check className="h-4 w-4 text-green-500" />}
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
              disabled={isJudging}
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

          {/* Jeeves assists remaining indicator */}
          {jeevesAssistsUsed < maxJeevesAssists ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
              <Bot className="h-3.5 w-3.5" />
              <span>Jeeves assists remaining: <strong className="text-foreground">{maxJeevesAssists - jeevesAssistsUsed}</strong> of {maxJeevesAssists}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-amber-500 px-1">
              <Bot className="h-3.5 w-3.5" />
              <span>No Jeeves assists remaining — you're on your own!</span>
            </div>
          )}

          {/* Submit button */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isJudging}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!explanation.trim() || isJudging}
              className="flex-1"
            >
              {isJudging ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Jeeves is judging...
                </>
              ) : jeevesAssistsUsed >= maxJeevesAssists ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit (No Jeeves)
                </>
              ) : explanation.trim() ? (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Submit for Judgment
                </>
              ) : (
                'Enter an explanation'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
