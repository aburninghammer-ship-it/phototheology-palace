import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import magicEyeImage from "@/assets/magic-eye.png";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const MagicEyeHero = () => {
  const [showReveal, setShowReveal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Show reveal button after 30 seconds for accessibility
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!revealed) {
        setShowReveal(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [revealed]);

  const handleReveal = () => {
    setRevealed(true);
    setShowDialog(true);
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Can You See What{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Others Miss?
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-4">
            Most people read the Bible like a flat image. Phototheology reveals the hidden depth—
            <span className="font-semibold text-foreground"> the patterns, the structure, the story beneath the surface.</span>
          </p>
        </motion.div>

        {/* Magic Eye Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-4xl mx-auto mb-8"
        >
          {/* Instructions */}
          <div className="text-center mb-6 space-y-3">
            <p className="text-lg text-muted-foreground">
              Focus on the image below. At first it looks chaotic—just colors and noise.
            </p>
            <p className="text-lg font-semibold text-foreground">
              But if you hold your gaze, a hidden pattern emerges...
            </p>
            <div className="flex flex-col items-center gap-2 text-primary">
              <p className="text-base font-medium">A sanctuary…</p>
              <p className="text-base font-medium">A palace…</p>
              <p className="text-base font-medium">A structure suddenly coming into focus.</p>
            </div>
          </div>

          {/* Magic Eye Image */}
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-primary/20">
            <motion.div
              animate={{
                boxShadow: revealed
                  ? "0 0 40px rgba(var(--primary), 0.3)"
                  : "0 0 0px rgba(var(--primary), 0)",
              }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={magicEyeImage}
                alt="Magic Eye - Find the hidden sanctuary"
                className="w-full h-auto"
                style={{
                  minHeight: "300px",
                }}
              />
              
              {/* Reveal overlay */}
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-br from-primary/90 to-accent/90 flex items-center justify-center"
                  >
                    <div className="text-center text-primary-foreground p-8">
                      <Building2 className="h-24 w-24 mx-auto mb-4" />
                      <p className="text-2xl font-bold">The Sanctuary</p>
                      <p className="text-lg mt-2">The hidden structure revealed</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Accessibility reveal button */}
            <AnimatePresence>
              {showReveal && !revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-4 right-4"
                >
                  <Button
                    onClick={handleReveal}
                    variant="secondary"
                    size="sm"
                    className="shadow-lg"
                  >
                    <EyeOff className="mr-2 h-4 w-4" />
                    Can't see it? Reveal
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <p className="text-xl font-bold text-foreground italic">
              Once you see it, you can never unsee it.
            </p>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleReveal}
            className="text-lg px-8 py-6 gradient-palace shadow-xl"
          >
            <Eye className="mr-2 h-5 w-5" />
            I Can See It - Open Phototheology
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>

      {/* Reveal Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-center mb-4">
              Now Imagine Doing This With the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Entire Bible
              </span>
            </DialogTitle>
            <DialogDescription className="text-lg space-y-4">
              <p className="text-foreground">
                That moment when the hidden image suddenly appears—
                that snap of clarity, that shift in perspective—
                is <span className="font-bold text-primary">exactly what Phototheology does to Scripture</span>.
              </p>

              <div className="space-y-3 text-muted-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p>
                    <span className="line-through">random verses</span> → <span className="font-semibold text-foreground">visible patterns</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p>
                    <span className="line-through">confusing stories</span> → <span className="font-semibold text-foreground">clear structure</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p>
                    <span className="line-through">unclear themes</span> → <span className="font-semibold text-foreground">crisp images</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p>
                    <span className="line-through">disconnected details</span> → <span className="font-semibold text-foreground">a unified palace of meaning</span>
                  </p>
                </div>
              </div>

              <p className="text-foreground font-semibold text-center text-xl pt-4">
                What was once invisible becomes obvious.
                <br />
                <span className="text-primary">This is how your mind was designed to read the Bible.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button
                  size="lg"
                  onClick={() => {
                    setShowDialog(false);
                    navigate(user ? "/palace" : "/auth");
                  }}
                  className="flex-1 gradient-palace"
                >
                  Start Your Free Trial
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="flex-1"
                >
                  Continue Reading
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

import { Building2 } from "lucide-react";
