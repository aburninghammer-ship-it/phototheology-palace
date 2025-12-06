import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Play, Pause, Square, BookOpen, ChevronUp, ChevronDown, X
} from "lucide-react";
import { useGlobalAudio } from "@/contexts/GlobalAudioContext";
import { useNavigate } from "react-router-dom";

export const GlobalMiniPlayer: React.FC = () => {
  const { 
    bibleAudioState, 
    showMiniPlayer, 
    setShowMiniPlayer,
    pauseBibleReading,
    resumeBibleReading,
    stopBibleReading 
  } = useGlobalAudio();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (!bibleAudioState || !showMiniPlayer) return null;

  const { isPlaying, isPaused, sequences, currentSeqIdx, currentItemIdx, sequenceName } = bibleAudioState;
  const currentSequence = sequences[currentSeqIdx];
  const currentItem = currentSequence?.items?.[currentItemIdx];

  const handleTogglePlay = () => {
    if (isPlaying && !isPaused) {
      pauseBibleReading();
    } else {
      resumeBibleReading();
    }
  };

  const handleGoToPlayer = () => {
    navigate("/read-me-the-bible");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50"
      >
        <div className="bg-card/95 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl shadow-primary/10 overflow-hidden">
          {/* Collapsed View */}
          <div className="flex items-center gap-3 p-3">
            {/* Album Art / Icon */}
            <div className="shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0" onClick={handleGoToPlayer}>
              <p className="text-sm font-medium truncate cursor-pointer hover:text-primary transition-colors">
                {sequenceName || "Bible Reading"}
              </p>
              {currentItem && (
                <p className="text-xs text-muted-foreground truncate">
                  {currentItem.book} {currentItem.chapter}:{currentItem.startVerse}
                  {currentItem.endVerse !== currentItem.startVerse && `-${currentItem.endVerse}`}
                </p>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                onClick={handleTogglePlay}
              >
                {isPlaying && !isPaused ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-destructive"
                onClick={stopBibleReading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Playing indicator */}
          {isPlaying && !isPaused && (
            <div className="h-1 bg-primary/20">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
