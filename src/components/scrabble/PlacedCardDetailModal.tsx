// Modal to show details of a placed card when clicked
// Shows the PT principle info, who placed it, and connection explanations

import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cross, BookOpen, Link2, User, Clock, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { PlacedCard } from '@/types/scrabble';
import { FLOOR_GRADIENTS } from '@/types/scrabble';

interface PlacedCardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  placedCard: PlacedCard | null;
  isSeedCard?: boolean;
  seedVerseText?: string;
}

export function PlacedCardDetailModal({
  isOpen,
  onClose,
  placedCard,
  isSeedCard = false,
  seedVerseText,
}: PlacedCardDetailModalProps) {
  if (!placedCard) return null;

  const { card, playerName, connections, timestamp } = placedCard;
  const gradient = FLOOR_GRADIENTS[card.floor] || FLOOR_GRADIENTS[1];
  const IconComponent = (LucideIcons as any)[card.icon] || LucideIcons.BookOpen;
  const hasChristConnection = connections.some(c => c.isChristConnection);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {/* Card icon with gradient background */}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient.from} ${gradient.to} ${gradient.border} border-2`}
            >
              <IconComponent
                className="h-6 w-6"
                style={{ color: gradient.glow.replace('rgba(', 'rgb(').replace(',0.5)', ')') }}
              />
            </div>
            <div>
              <span className={`bg-gradient-to-r ${gradient.text} bg-clip-text text-transparent font-bold`}>
                {card.code}
              </span>
              <span className="mx-2 text-muted-foreground">—</span>
              <span>{card.name}</span>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Details about the {card.name} card placed on the board
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Floor & Category */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              Floor {card.floor}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {card.category}
            </Badge>
            {isSeedCard && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Starting Card
              </Badge>
            )}
            {hasChristConnection && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                <Cross className="h-3 w-3 mr-1" />
                Christ Connection
              </Badge>
            )}
          </div>

          {/* Description */}
          {card.description && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>
          )}

          {/* Placed by info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{isSeedCard ? 'System' : playerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{new Date(timestamp).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Seed card special section */}
          {isSeedCard && seedVerseText && (
            <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                <BookOpen className="h-4 w-4" />
                <span>Study Verse</span>
              </div>
              <p className="text-sm italic text-muted-foreground">"{seedVerseText}"</p>
              <p className="text-xs text-muted-foreground">
                This is the seed card for your study. Place PT principle cards around it and explain how each connects to this verse.
              </p>
            </div>
          )}

          {/* Connections */}
          {connections.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-medium">
                <Link2 className="h-4 w-4 text-primary" />
                <span>Connections ({connections.length})</span>
              </div>
              <div className="space-y-2">
                {connections.map((conn, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      conn.isChristConnection
                        ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/30'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {conn.direction}
                      </Badge>
                      {conn.isChristConnection && (
                        <Cross className="h-3 w-3 text-purple-500" />
                      )}
                    </div>
                    <p className="text-sm">{conn.explanation}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
