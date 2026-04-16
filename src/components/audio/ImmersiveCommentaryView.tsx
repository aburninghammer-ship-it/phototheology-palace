/**
 * ImmersiveCommentaryView
 * Full-screen overlay showing Bible text with karaoke-style verse highlighting
 * synced to audio commentary playback.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Play, Pause, Volume2, BookOpen } from "lucide-react";
import { fetchChapterVerses } from "@/services/audioBibleService";
import { motion, AnimatePresence } from "framer-motion";

interface Verse {
  verse: number;
  text: string;
}

interface ImmersiveCommentaryViewProps {
  isOpen: boolean;
  onClose: () => void;
  book: string;
  chapter: number;
  audioRef: { current: HTMLAudioElement | null };
  isPlaying: boolean;
  isPaused: boolean;
  modeName: string;
  modeColor?: string;
  onTogglePlayPause: () => void;
}

export function ImmersiveCommentaryView({
  isOpen,
  onClose,
  book,
  chapter,
  audioRef,
  isPlaying,
  isPaused,
  modeName,
  onTogglePlayPause,
}: ImmersiveCommentaryViewProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const activeVerseRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  // Load verses when opened
  useEffect(() => {
    if (!isOpen || chapter <= 0) return;
    let cancelled = false;
    fetchChapterVerses(book, chapter).then((v) => {
      if (!cancelled) setVerses(v);
    });
    return () => { cancelled = true; };
  }, [isOpen, book, chapter]);

  // Track audio time and map to verse
  const updateTime = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || verses.length === 0) return;

    const dur = audio.duration || 0;
    const time = audio.currentTime || 0;
    setAudioDuration(dur);
    setCurrentTime(time);

    if (dur > 0) {
      // Proportional mapping: divide audio duration evenly across verses
      const verseLength = dur / verses.length;
      const idx = Math.min(Math.floor(time / verseLength), verses.length - 1);
      setActiveVerseIndex(idx);
    }

    rafRef.current = requestAnimationFrame(updateTime);
  }, [audioRef, verses]);

  useEffect(() => {
    if (isOpen && (isPlaying || isPaused)) {
      rafRef.current = requestAnimationFrame(updateTime);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, isPlaying, isPaused, updateTime]);

  // Auto-scroll to active verse
  useEffect(() => {
    if (activeVerseRef.current) {
      activeVerseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeVerseIndex]);

  // Escape key closes
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") { e.preventDefault(); onTogglePlayPause(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, onTogglePlayPause]);

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-background/98 backdrop-blur-sm flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-bold">{book} {chapter}</h2>
              <p className="text-xs text-muted-foreground">{modeName} Commentary — Immersive Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Verse {verses[activeVerseIndex]?.verse || "—"} of {verses.length}
            </Badge>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Verse Display */}
        <div className="flex-1 overflow-hidden relative">
          {verses.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {chapter <= 0 ? "Immersive mode is available for chapter commentaries" : "Loading verses..."}
            </div>
          ) : (
            <ScrollArea className="h-full" ref={scrollContainerRef}>
              <div className="max-w-2xl mx-auto px-6 py-8 space-y-1">
                {verses.map((v, idx) => {
                  const isActive = idx === activeVerseIndex;
                  const isPast = idx < activeVerseIndex;
                  const isFuture = idx > activeVerseIndex;

                  return (
                    <div
                      key={v.verse}
                      ref={isActive ? activeVerseRef : undefined}
                      className={`
                        py-3 px-4 rounded-lg transition-all duration-500 cursor-pointer
                        ${isActive
                          ? "bg-primary/15 border border-primary/30 scale-[1.01] shadow-lg shadow-primary/10"
                          : isPast
                            ? "opacity-50"
                            : isFuture
                              ? "opacity-40"
                              : ""
                        }
                      `}
                      onClick={() => {
                        // Allow clicking a verse to seek
                        if (audioRef.current && audioDuration > 0) {
                          const verseLength = audioDuration / verses.length;
                          audioRef.current.currentTime = idx * verseLength;
                        }
                      }}
                    >
                      <span className={`
                        inline-block w-8 text-right mr-3 text-xs font-mono
                        ${isActive ? "text-primary font-bold" : "text-muted-foreground"}
                      `}>
                        {v.verse}
                      </span>
                      <span className={`
                        text-base leading-relaxed
                        ${isActive
                          ? "text-foreground font-medium"
                          : isPast
                            ? "text-muted-foreground"
                            : "text-foreground/60"
                        }
                      `}>
                        {v.text}
                      </span>
                    </div>
                  );
                })}
                <div className="h-32" /> {/* bottom padding */}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="border-t border-border/50 px-6 py-4">
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">
              {formatTime(currentTime)}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                className="min-w-[120px]"
                onClick={onTogglePlayPause}
              >
                {isPaused ? (
                  <><Play className="h-5 w-5 mr-2" /> Play</>
                ) : (
                  <><Pause className="h-5 w-5 mr-2" /> Pause</>
                )}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {formatTime(audioDuration)}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
