// PT Scrabble Seed Card Insight
// Shows the starting card with Jeeves-generated insight about its connection to the verse

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2, Lightbulb, ArrowRight, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrabbleTile } from './ScrabbleTile';
import { supabase } from '@/integrations/supabase/client';
import type { ScrabbleCard } from '@/types/scrabble';
import type { SelectedVerse } from './VerseSelectionScreen';

interface SeedCardInsightProps {
  seedCard: ScrabbleCard;
  verse: SelectedVerse;
  onContinue: () => void;
}

export function SeedCardInsight({ seedCard, verse, onContinue }: SeedCardInsightProps) {
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsight();
  }, [seedCard, verse]);

  const generateInsight = async () => {
    setIsLoading(true);
    try {
      const prompt = `Apply the Phototheology principle "${seedCard.name}" (${seedCard.code}) directly to ${verse.reference}:

"${verse.text}"

The principle "${seedCard.name}" is about: ${seedCard.description || seedCard.name}

In 2-3 sentences:
1. Briefly explain what the "${seedCard.name}" principle means
2. Show specifically how this principle unlocks meaning in the verse text - quote or reference specific words/phrases from the verse
3. Give one concrete insight that emerges when viewing this verse through this lens

Be specific and tie your explanation directly to the actual words of the scripture.`;

      const { data, error } = await supabase.functions.invoke('jeeves', {
        body: {
          message: prompt,
          context: 'scrabble_seed_insight',
        },
      });

      if (error) throw error;
      setInsight(data?.response || data?.message || null);
    } catch (err) {
      console.error('Error generating insight:', err);
      // Fallback insight
      setInsight(`Consider how "${seedCard.name}" provides a lens for understanding ${verse.reference}. This principle can reveal deeper meaning in the passage.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4"
    >
      <Card className="max-w-2xl w-full border-2 border-primary/30 shadow-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Your Starting Principle</h2>
            <p className="text-muted-foreground">
              This card is the foundation for your Bible study
            </p>
          </div>

          {/* Verse reminder */}
          <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <Book className="h-5 w-5 text-blue-500 shrink-0" />
            <div>
              <p className="font-medium text-blue-600 dark:text-blue-400">{verse.reference}</p>
              <p className="text-sm text-muted-foreground italic line-clamp-2">"{verse.text}"</p>
            </div>
          </div>

          {/* Seed card display */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0">
              <ScrabbleTile card={seedCard} size="lg" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold">{seedCard.name}</h3>
                <p className="text-sm text-muted-foreground">Code: {seedCard.code} | Floor {seedCard.floor}</p>
              </div>

              {seedCard.description && (
                <p className="text-sm text-foreground/80">{seedCard.description}</p>
              )}
            </div>
          </div>

          {/* Jeeves insight */}
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">How This Principle Applies</span>
              <Sparkles className="h-4 w-4 text-purple-500 ml-auto" />
            </div>

            {isLoading ? (
              <div className="flex items-center gap-3 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Jeeves is preparing an insight...</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{insight}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Your Goal</h4>
            <p className="text-sm text-muted-foreground">
              Build on this starting principle by placing cards from your hand that connect to it.
              Explain how each new principle relates to the verse and the cards already on the board.
            </p>
          </div>

          {/* Continue button */}
          <Button
            onClick={onContinue}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : (
              <>
                Start Building Connections
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
