// PT Scrabble Jeeves Feedback Panel
// Shows Jeeves' recap, polished version, and gem after card placement

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Gem, ChevronRight, X, Loader2, Check, AlertTriangle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import type { StudyLogEntry } from './StudyLog';
import type { SelectedVerse } from './VerseSelectionScreen';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';

interface JeevesFeedbackPanelProps {
  entry: StudyLogEntry | null;
  seedVerse: SelectedVerse | null;
  onDismiss: () => void;
  isVisible: boolean;
}

interface JeevesFeedback {
  recap: string;
  polished: string;
  gem: string;
}

export function JeevesFeedbackPanel({
  entry,
  seedVerse,
  onDismiss,
  isVisible,
}: JeevesFeedbackPanelProps) {
  const [feedback, setFeedback] = useState<JeevesFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Jeeves feedback when entry changes
  useEffect(() => {
    if (!entry || !seedVerse || !isVisible) {
      setFeedback(null);
      return;
    }

    const fetchFeedback = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const prompt = `You are Jeeves, a brilliant and warm Phototheology Bible study scholar. A student just placed a card in PT Scrabble. Your job is NOT to repeat what they said — your job is to AMPLIFY it with deeper theological insight.

Context:
- **Verse**: ${seedVerse.reference} — "${seedVerse.text}"
- **PT Principle**: ${entry.cardName} (${entry.cardCode})
- **Student's Answer**: "${entry.explanation}"
${entry.isChristConnection ? '- Christ Connection made' : ''}

Provide three things in JSON:

1. **recap** (1-2 sentences): Affirm the STRONGEST part of their insight. Name the specific theological move they made. Do NOT simply restate their words.

2. **polished** (2-3 sentences): Take their core idea and ELEVATE it — add theological depth, sharpen the language, connect it to the broader biblical narrative, or reveal a layer they touched but didn't fully unpack. This should read like a scholar expanding on a student's promising observation. NEVER just rephrase what they already said.

3. **gem** (1-2 sentences): Offer a FRESH insight they did NOT mention — a cross-reference to another passage, a Hebrew/Greek word study connection, a typological parallel, or a Christological thread. This should genuinely surprise and delight them.

CRITICAL: Each section must add NEW information beyond what the student wrote. If you find yourself rewording their answer, stop and dig deeper.

Respond ONLY with valid JSON:
{"recap": "...", "polished": "...", "gem": "..."}`;

        const { data, error: fetchError } = await supabase.functions.invoke('jeeves', {
          body: {
            message: prompt,
            context: 'scrabble_feedback',
          },
        });

        if (fetchError) throw fetchError;

        // Parse response - handle both direct JSON and string response
        // Jeeves edge function returns { content: "..." } format
        let parsedFeedback: JeevesFeedback;
        const response = data?.content || data?.response || data?.message || data;

        if (typeof response === 'string') {
          // Try to extract JSON from the response
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedFeedback = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('Could not parse Jeeves response');
          }
        } else if (typeof response === 'object' && response.recap) {
          parsedFeedback = response;
        } else {
          throw new Error('Invalid response format');
        }

        setFeedback(parsedFeedback);
      } catch (err) {
        console.error('Error getting Jeeves feedback:', err);
        setError('Jeeves is thinking deeply... try again in a moment.');
        // Provide fallback feedback
        setFeedback({
          recap: `You applied the ${entry.cardName} principle to ${seedVerse.reference}. Good connection!`,
          polished: entry.explanation,
          gem: `Keep exploring how ${entry.cardName} reveals Christ in this passage.`,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [entry?.id, seedVerse?.reference, isVisible]);

  if (!isVisible || !entry) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-20 bottom-44 z-40 w-80 md:w-96 bg-background/95 backdrop-blur border-l shadow-xl flex flex-col"
      >
        {/* Header */}
        <div className={cn(
          "p-4 border-b",
          entry.rejected
            ? "bg-gradient-to-r from-red-500/15 to-orange-500/10"
            : "bg-gradient-to-r from-blue-500/10 to-purple-500/10"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                entry.rejected ? "bg-red-500/20" : "bg-blue-500/20"
              )}>
                {entry.rejected ? (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                ) : (
                  <Bot className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {entry.rejected ? 'Card Rejected!' : "Jeeves' Feedback"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {entry.rejected
                    ? 'Your answer scored below 5 — card lost'
                    : `Your ${entry.cardName} insight`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Score badge */}
              {entry.jeevesScore != null && (
                <div className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold",
                  entry.jeevesScore >= 8 ? "bg-green-500/20 text-green-500" :
                  entry.jeevesScore >= 5 ? "bg-yellow-500/20 text-yellow-500" :
                  "bg-red-500/20 text-red-500"
                )}>
                  <Star className="h-3.5 w-3.5" />
                  {entry.jeevesScore}/10
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={onDismiss} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Jeeves is reviewing your insight...</p>
            </div>
          ) : feedback ? (
            <div className="space-y-4">
              {/* Your original answer */}
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Your answer:</span>
                  <span className="text-xs font-mono bg-primary/20 px-1.5 py-0.5 rounded">{entry.cardCode}</span>
                </div>
                <p className="text-sm italic">"{entry.explanation}"</p>
              </div>

              {/* Copy All */}
              <div className="flex justify-end">
                <CopyButton
                  text={`What you got right:\n${feedback.recap}\n\nPolished insight:\n${feedback.polished}\n\nBonus gem:\n${feedback.gem}`}
                  label="Copy All"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                />
              </div>

              {/* Jeeves Recap */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 bg-green-500/10 rounded-lg border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">What you got right</span>
                  </div>
                  <CopyButton text={feedback.recap} size="sm" className="h-6 text-[10px] text-muted-foreground" />
                </div>
                <p className="text-sm leading-relaxed">{feedback.recap}</p>
              </motion.div>

              {/* Polished Version */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Polished insight</span>
                  </div>
                  <CopyButton text={feedback.polished} size="sm" className="h-6 text-[10px] text-muted-foreground" />
                </div>
                <p className="text-sm leading-relaxed">{feedback.polished}</p>
              </motion.div>

              {/* Bonus Gem */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Gem className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Bonus gem</span>
                  </div>
                  <CopyButton text={feedback.gem} size="sm" className="h-6 text-[10px] text-muted-foreground" />
                </div>
                <p className="text-sm leading-relaxed">{feedback.gem}</p>
              </motion.div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          ) : null}
        </ScrollArea>

        {/* Continue Button */}
        <div className="p-4 border-t">
          <Button
            onClick={onDismiss}
            className="w-full"
            disabled={isLoading}
          >
            <span>Continue to Next Card</span>
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {isLoading ? 'Please wait for feedback...' : 'Ready to place your next card!'}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
