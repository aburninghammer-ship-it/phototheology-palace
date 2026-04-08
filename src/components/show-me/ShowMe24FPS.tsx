import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShowMe24FPSProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
}

// Genesis 1-24 chapter frames — one memorable image per chapter
const genesisFrames = [
  { chapter: 1, image: "🌍", title: "Creation", summary: "God creates heavens, earth, light, sky, seas, plants, stars, animals, and man in 6 days. Rests on the 7th." },
  { chapter: 2, image: "🌳", title: "Garden Planted", summary: "God forms Adam from dust, plants Eden, creates Eve from Adam's rib. Marriage instituted." },
  { chapter: 3, image: "🐍", title: "The Fall", summary: "Serpent deceives Eve. Both eat forbidden fruit. Curse pronounced. Promise of the Seed (3:15)." },
  { chapter: 4, image: "🩸", title: "Cain & Abel", summary: "Two brothers, two offerings. Abel's accepted, Cain's rejected. First murder. Mark of Cain." },
  { chapter: 5, image: "📜", title: "The Genealogy", summary: "Adam to Noah — ten generations. Enoch walks with God and is taken. Methuselah lives 969 years." },
  { chapter: 6, image: "⚒️", title: "Ark Blueprint", summary: "Wickedness fills earth. God grieves. Noah finds grace. Ark dimensions given. Covenant promised." },
  { chapter: 7, image: "🌊", title: "The Flood", summary: "Noah enters the ark. Rain 40 days. All flesh destroyed. Waters prevail 150 days." },
  { chapter: 8, image: "🕊️", title: "Dove Returns", summary: "Waters recede. Dove sent out three times. Noah exits ark. Altar built. God promises seasons." },
  { chapter: 9, image: "🌈", title: "Rainbow Covenant", summary: "God blesses Noah. Rainbow = covenant sign. Noah plants vineyard. Ham's sin. Canaan cursed." },
  { chapter: 10, image: "🗺️", title: "Table of Nations", summary: "Sons of Noah spread across earth. 70 nations listed. Nimrod the mighty hunter." },
  { chapter: 11, image: "🗼", title: "Tower of Babel", summary: "One language, one ambition. Tower to heaven. God confuses languages. Nations scattered. Abram's lineage." },
  { chapter: 12, image: "🏕️", title: "Abram's Call", summary: "God calls Abram: 'Get thee out.' Promise of land, nation, blessing. Abram goes to Egypt." },
  { chapter: 13, image: "👀", title: "Lot Chooses", summary: "Abram and Lot separate. Lot chooses Sodom's green valley. God promises Abram all the land." },
  { chapter: 14, image: "⚔️", title: "Abram the Warrior", summary: "Four kings vs. five. Lot captured. Abram rescues with 318 men. Melchizedek blesses him." },
  { chapter: 15, image: "⭐", title: "Stars & Covenant", summary: "'Count the stars.' Abram believes → credited as righteousness. Smoking furnace passes between pieces." },
  { chapter: 16, image: "👶", title: "Hagar & Ishmael", summary: "Sarai gives Hagar. Conflict. Angel finds Hagar at a well. Ishmael born. 'God who sees me.'" },
  { chapter: 17, image: "✂️", title: "Circumcision Covenant", summary: "Abram → Abraham. Sarai → Sarah. Circumcision sign. Promise of Isaac. Abraham laughs." },
  { chapter: 18, image: "🍞", title: "Three Visitors", summary: "Abraham hosts three strangers at Mamre. Sarah laughs. Abraham bargains for Sodom — 50 down to 10." },
  { chapter: 19, image: "🔥", title: "Sodom Destroyed", summary: "Two angels in Sodom. Lot escapes. Fire and brimstone. Lot's wife looks back → pillar of salt." },
  { chapter: 20, image: "👑", title: "Abraham & Abimelech", summary: "Abraham says Sarah is his sister. God warns Abimelech in a dream. Sarah restored." },
  { chapter: 21, image: "😂", title: "Isaac Born", summary: "Sarah bears Isaac — laughter fulfilled. Hagar and Ishmael sent away. Well of Beersheba." },
  { chapter: 22, image: "🔪", title: "The Binding", summary: "God tests Abraham: 'Offer Isaac.' Knife raised. Angel stops. Ram in thicket. 'God will provide.'" },
  { chapter: 23, image: "🪦", title: "Sarah's Burial", summary: "Sarah dies at 127. Abraham buys cave of Machpelah from Ephron. First land purchase in Canaan." },
  { chapter: 24, image: "💍", title: "Bride for Isaac", summary: "Servant sent to find a wife. Rebekah at the well. Signs confirmed. She rides to meet Isaac." },
];

export function ShowMe24FPS({ open, onOpenChange, onUse }: ShowMe24FPSProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [hasUsed, setHasUsed] = useState(false);
  const [direction, setDirection] = useState(0);

  const frame = genesisFrames[currentFrame];

  const goNext = () => {
    if (currentFrame < genesisFrames.length - 1) {
      setDirection(1);
      setCurrentFrame((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentFrame > 0) {
      setDirection(-1);
      setCurrentFrame((i) => i - 1);
    }
  };

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && !hasUsed) {
      onUse();
      setHasUsed(true);
    }
    if (!isOpen) {
      setCurrentFrame(0);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg p-0 overflow-hidden bg-card border-sky-500/20">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            🎞️ 24 Frames Per Second
            <Badge variant="outline" className="border-sky-500/30 text-sky-400 text-xs">
              Genesis 1–24
            </Badge>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            One image per chapter. Flip through Genesis like a movie.
          </p>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Frame display */}
          <div className="relative min-h-[220px] flex flex-col items-center justify-center rounded-xl bg-background/50 border border-sky-500/10 p-6 mb-4 overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentFrame}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center text-center"
              >
                <span className="text-6xl mb-3">{frame.image}</span>
                <div className="text-xs text-muted-foreground mb-1">
                  Chapter {frame.chapter}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {frame.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                  {frame.summary}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={goPrev}
              disabled={currentFrame === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>

            <div className="flex items-center gap-1">
              {genesisFrames.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentFrame ? 1 : -1);
                    setCurrentFrame(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentFrame
                      ? "bg-sky-400 scale-125"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              disabled={currentFrame === genesisFrames.length - 1}
              className="gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress */}
          <div className="mt-3 text-center text-xs text-muted-foreground">
            Frame {currentFrame + 1} of {genesisFrames.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
