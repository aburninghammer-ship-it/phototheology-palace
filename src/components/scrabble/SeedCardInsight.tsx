// PT Scrabble Seed Card Selection
// Let user choose from multiple starting cards, then show Jeeves insight

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, Lightbulb, ArrowRight, Book, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrabbleTile } from './ScrabbleTile';
import { supabase } from '@/integrations/supabase/client';
import type { ScrabbleCard } from '@/types/scrabble';
import type { SelectedVerse } from './VerseSelectionScreen';
import { cn } from '@/lib/utils';

interface SeedCardInsightProps {
  cardOptions: ScrabbleCard[]; // 3 card options to choose from
  verse: SelectedVerse;
  onCardSelected: (card: ScrabbleCard) => void;
  onRefreshOptions?: () => void;
}

export function SeedCardInsight({ cardOptions, verse, onCardSelected, onRefreshOptions }: SeedCardInsightProps) {
  const [selectedCard, setSelectedCard] = useState<ScrabbleCard | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generate insight when card is selected
  useEffect(() => {
    if (selectedCard) {
      generateInsight(selectedCard);
    }
  }, [selectedCard]);

  const generateInsight = async (card: ScrabbleCard) => {
    setIsLoading(true);
    setInsight(null);

    try {
      const prompt = `You are applying the Phototheology principle "${card.name}" to ${verse.reference}.

THE VERSE:
"${verse.text}"

THE PRINCIPLE: ${card.name}
${card.description ? `DESCRIPTION: ${card.description}` : ''}

Write 2-3 sentences that:
1. Show how "${card.name}" specifically illuminates this verse
2. Quote or reference actual words/phrases from the verse text
3. Reveal an insight that emerges when viewing through this interpretive lens

Be specific - reference the actual scripture words.`;

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
      setInsight(`The "${card.name}" principle provides a lens for understanding ${verse.reference}. Consider how ${card.description || 'this approach'} reveals deeper meaning in the passage.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (selectedCard) {
      onCardSelected(selectedCard);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur flex items-center justify-center p-4 overflow-y-auto"
    >
      <Card className="max-w-3xl w-full border-2 border-primary/30 shadow-2xl my-8">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Choose Your Starting Principle</h2>
            <p className="text-muted-foreground">
              Select which PT principle to apply to your verse
            </p>
          </div>

          {/* Verse display */}
          <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Book className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-blue-600 dark:text-blue-400">{verse.reference}</span>
            </div>
            <p className="text-sm italic leading-relaxed">"{verse.text}"</p>
          </div>

          {/* Card options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Select a starting principle:</p>
              {onRefreshOptions && (
                <Button variant="ghost" size="sm" onClick={onRefreshOptions}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Different options
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cardOptions.map((card) => (
                <motion.button
                  key={card.id}
                  onClick={() => setSelectedCard(card)}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    selectedCard?.id === card.id
                      ? 'border-primary bg-primary/10 shadow-lg'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <ScrabbleTile card={card} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{card.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                        {card.description || `Floor ${card.floor} principle`}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Insight section - shows after card selection */}
          <AnimatePresence mode="wait">
            {selectedCard && (
              <motion.div
                key={selectedCard.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/30"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span className="font-semibold">How This Principle Applies</span>
                  <Sparkles className="h-4 w-4 text-purple-500 ml-auto" />
                </div>

                {isLoading ? (
                  <div className="flex items-center gap-3 py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Connecting "{selectedCard.name}" to {verse.reference}...
                    </span>
                  </div>
                ) : insight ? (
                  <p className="text-sm leading-relaxed">{insight}</p>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructions */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Your Goal</h4>
            <p className="text-sm text-muted-foreground">
              Build on this starting principle by placing more cards that connect to it.
              Explain how each new principle relates to the verse and adjacent cards.
            </p>
          </div>

          {/* Continue button */}
          <Button
            onClick={handleContinue}
            className="w-full"
            size="lg"
            disabled={!selectedCard || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing...
              </>
            ) : selectedCard ? (
              <>
                Start with "{selectedCard.name}"
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              'Select a principle above'
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
