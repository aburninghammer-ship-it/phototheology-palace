import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, BookOpen, Lightbulb, Link2 } from "lucide-react";
import { motion } from "framer-motion";

interface PrincipleCard {
  code: string;
  name: string;
  question: string;
  floor: number;
  floorColor: string;
}

interface Props {
  card: PrincipleCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Jeeves commentary database - expands on each principle
const JEEVES_COMMENTARY: Record<string, {
  explanation: string;
  example: string;
  palaceLocation: string;
  connections: string[];
  practicalTip: string;
}> = {
  "SR": {
    explanation: "The Story Room trains you to collect and memorize Bible stories in sequence, turning narratives into vivid mental movies. Each story becomes a scene etched in imagination.",
    example: "For Joseph's story: coat of many colors → pit → caravan → prison → palace. This visual sequence makes recall instant and reliable.",
    palaceLocation: "Floor 1 - Furnishing (Width)",
    connections: ["IR (Imagination Room)", "24FPS", "BR (Bible Rendered)"],
    practicalTip: "Start with Genesis 1-11. Memorize 10 major stories as image sequences before moving to deeper analysis."
  },
  "OR": {
    explanation: "The Observation Room is the detective's notebook. You log details without rushing to meaning—notice phrases, repetitions, contrasts, and actions like collecting fingerprints.",
    example: "In Luke 15:20, notice: 'yet a great way off' (father watching), 'ran' (culturally shocking), 'fell on his neck' (before confession). Each detail builds the emotional portrait.",
    palaceLocation: "Floor 2 - Investigation (Width)",
    connections: ["DC (Def-Com)", "QR (Questions)", "@T (Symbols/Types)"],
    practicalTip: "Write 30-50 observations per passage without interpreting. Train your eye to see what casual readers miss."
  },
  "DR-2D": {
    explanation: "The Christological Dimension reveals how every text points to, foreshadows, or fulfills Christ. This is the central lens of Phototheology—'These are they which testify of me' (John 5:39).",
    example: "Exodus 12:13 - The Passover lamb's blood → Christ's blood (1 Cor 5:7). Applied to doorposts → applied by faith. Timing at Passover → Jesus crucified at Passover.",
    palaceLocation: "Floor 4 - Next Level (Depth)",
    connections: ["CR (Concentration)", "BL (Blue Room)", "@CyC (Cyrus-Christ Cycle)"],
    practicalTip: "Always ask: Where is Christ in this text? Look for types, shadows, prophecies, and character parallels."
  },
  "@Mo": {
    explanation: "The Mosaic Cycle maps texts through the pattern: Fall (Egypt bondage) → Covenant (Sinai) → Sanctuary (Tabernacle) → Enemy (wilderness) → Restoration (Canaan).",
    example: "Hebrews 9:11-14 shows Christ fulfilling the Mosaic cycle: earthly priesthood → heavenly High Priest; animal blood → His own blood; yearly repetition → eternal redemption.",
    palaceLocation: "Floor 6 - Three Heavens (Depth)",
    connections: ["BL (Blue Room)", "Feast Room", "@CyC (transition to Christ)"],
    practicalTip: "When studying law, priesthood, or tabernacle texts, always map to the Mosaic Cycle and trace forward to Christ's fulfillment."
  },
  // Add more as needed - this is a starter set
  "DEFAULT": {
    explanation: "This principle is part of the Phototheology Palace system, designed to help you interpret Scripture with structure, memory, and Christ-centered focus.",
    example: "Apply this principle by asking the card's guiding question and building connections to other rooms and floors.",
    palaceLocation: "See card badge for floor location",
    connections: ["Cross-reference with other principles on the same floor"],
    practicalTip: "Start with easier principles (Floors 1-2) before advancing to deeper floors (4-6)."
  }
};

export function JeevesCommentaryDialog({ card, open, onOpenChange }: Props) {
  if (!card) return null;
  
  const commentary = JEEVES_COMMENTARY[card.code] || JEEVES_COMMENTARY["DEFAULT"];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="glass" className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">{card.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="font-mono">{card.code}</Badge>
                <Badge variant="secondary">Floor {card.floor}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Core Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
            >
              <div className="flex items-start gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                <h4 className="font-semibold">Core Question</h4>
              </div>
              <p className="text-sm text-muted-foreground italic">
                "{card.question}"
              </p>
            </motion.div>

            {/* Jeeves Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2"
            >
              <h4 className="font-semibold flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                Jeeves Explains
              </h4>
              <p className="text-sm leading-relaxed">
                {commentary.explanation}
              </p>
            </motion.div>

            {/* Example */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg space-y-2"
            >
              <h4 className="font-semibold text-green-700 dark:text-green-400">📖 Biblical Example</h4>
              <p className="text-sm leading-relaxed">
                {commentary.example}
              </p>
            </motion.div>

            {/* Palace Location */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg space-y-2"
            >
              <h4 className="font-semibold text-blue-700 dark:text-blue-400">🏛️ Palace Location</h4>
              <p className="text-sm">
                {commentary.palaceLocation}
              </p>
            </motion.div>

            {/* Connected Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-2"
            >
              <h4 className="font-semibold flex items-center gap-2">
                <Link2 className="h-4 w-4 text-primary" />
                Connected Principles
              </h4>
              <div className="flex flex-wrap gap-2">
                {commentary.connections.map((conn, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {conn}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Practical Tip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg space-y-2"
            >
              <h4 className="font-semibold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" />
                Practical Tip
              </h4>
              <p className="text-sm leading-relaxed">
                {commentary.practicalTip}
              </p>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
