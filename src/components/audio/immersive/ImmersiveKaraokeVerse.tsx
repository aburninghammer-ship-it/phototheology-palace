/**
 * ImmersiveKaraokeVerse - Word-by-word highlight synced to audio timing
 * Splits verse text into words, highlights progressively based on estimated timing
 */
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ImmersiveKaraokeVerseProps {
  verse: { verse: number; text: string };
  isActive: boolean;
  isPast: boolean;
  /** 0-1 progress through this specific verse */
  verseProgress: number;
  onClick: () => void;
  innerRef?: React.Ref<HTMLDivElement>;
}

export function ImmersiveKaraokeVerse({
  verse,
  isActive,
  isPast,
  verseProgress,
  onClick,
  innerRef,
}: ImmersiveKaraokeVerseProps) {
  const words = useMemo(() => verse.text.split(/(\s+)/), [verse.text]);

  // Calculate which word index we're at based on progress
  const totalWords = words.filter(w => w.trim()).length;
  const activeWordIdx = isActive
    ? Math.min(Math.floor(verseProgress * totalWords), totalWords - 1)
    : -1;

  let wordCount = 0;

  return (
    <motion.div
      ref={innerRef}
      animate={isActive ? { scale: 1.01 } : { scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "py-4 px-5 rounded-xl transition-all duration-700 cursor-pointer",
        isActive
          ? "bg-primary/10 border border-primary/25 shadow-xl shadow-primary/5"
          : isPast
            ? "opacity-40"
            : "opacity-30"
      )}
      onClick={onClick}
    >
      <span className={cn(
        "inline-block w-8 text-right mr-4 text-xs font-mono align-top mt-1",
        isActive ? "text-primary font-bold" : "text-muted-foreground"
      )}>
        {verse.verse}
      </span>
      <span className="text-lg leading-relaxed inline">
        {words.map((word, i) => {
          const isWhitespace = !word.trim();
          if (isWhitespace) {
            return <span key={i}>{word}</span>;
          }

          const currentWordIdx = wordCount;
          wordCount++;

          if (!isActive) {
            return (
              <span key={i} className={cn(
                isPast ? "text-foreground/50" : "text-foreground/50"
              )}>
                {word}
              </span>
            );
          }

          const isSpoken = currentWordIdx <= activeWordIdx;
          const isCurrent = currentWordIdx === activeWordIdx;

          return (
            <span
              key={i}
              className={cn(
                "transition-all duration-200",
                isCurrent
                  ? "text-primary font-semibold scale-[1.02] inline-block"
                  : isSpoken
                    ? "text-foreground font-medium"
                    : "text-foreground/35"
              )}
            >
              {word}
            </span>
          );
        })}
      </span>
    </motion.div>
  );
}
