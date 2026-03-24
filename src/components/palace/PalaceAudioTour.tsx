import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Volume2, Loader2,
  Headphones, BookOpen, Flame, Eye, Gem, Brain, Crown,
  Telescope, Heart, Sparkles, Clock, Target, Layers, Scale,
  Link2, Scroll, Search, Film, Image as ImageIcon, ChevronLeft,
  Share2, Copy, Check
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ALL_TOURS, buildAllSegments, getTotalSeconds } from "@/data/tourScripts";
import type { TourDefinition, TourSegment } from "@/data/tourScripts";
import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";

const FLOOR_COLORS: Record<number, string> = {
  0: "from-slate-500 to-slate-600",
  1: "from-violet-500 to-purple-600",
  2: "from-blue-500 to-sky-600",
  3: "from-emerald-500 to-green-600",
  4: "from-amber-500 to-orange-600",
  5: "from-indigo-600 to-purple-700",
  6: "from-fuchsia-500 to-pink-600",
  7: "from-red-500 to-rose-600",
  8: "from-yellow-400 to-amber-500",
};

const ROOM_ICONS: Record<string, typeof BookOpen> = {
  INTRO: Headphones, SR: BookOpen, IR: Eye, "24F": Film, BR: ImageIcon,
  TR: Scroll, GR: Gem, OR: Eye, DC: BookOpen, ST: Target, QR: Brain,
  QA: Link2, NF: Sparkles, PF: Heart, BF: BookOpen, HF: Clock, LR: Brain,
  CR: Crown, DR: Layers, C6: BookOpen, TRm: Target, TZ: Clock,
  PRm: Layers, "P||": Scale, FRt: Heart, CEC: Crown, R66: BookOpen,
  BL: Telescope, PR: Telescope, "3A": Sparkles, FE: Crown,
  "3H": Sparkles, CY: Sparkles, JR: Sparkles,
  FRm: Flame, MR: Brain, SRm: Sparkles, "∞": Crown, OUTRO: Headphones,
};

function getShareUrl(tourId: string) {
  return `${window.location.origin}/palace/tour?tour=${tourId}`;
}

function ShareTourButton({ tour, size = "icon" }: { tour: TourDefinition; size?: "icon" | "sm" }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getShareUrl(tour.id);
    const text = `🎧 Take the "${tour.title}" Palace Tour — ${tour.subtitle}\n"${tour.verseText}"`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${tour.title} — Palace Audio Tour`, text, url });
        return;
      } catch { /* cancelled */ }
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Tour link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (size === "sm") {
    return (
      <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5 text-white/80 hover:text-white hover:bg-white/20">
        {copied ? <Check className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
        {copied ? "Copied!" : "Share"}
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleShare} className="h-8 w-8 text-muted-foreground hover:text-foreground">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
    </Button>
  );
}

function TourSelector({ onSelect }: { onSelect: (tour: TourDefinition) => void }) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-1">🎧 Palace Audio Tours</h3>
        <p className="text-sm text-muted-foreground">
          Jeeves &amp; Reginald guide you through every room using a single passage
        </p>
      </div>
      <div className="grid gap-3">
        {ALL_TOURS.map((tour) => (
          <Card
            key={tour.id}
            className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
            onClick={() => onSelect(tour)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className="text-3xl">{tour.emoji}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-base">{tour.title}</h4>
                <p className="text-sm text-muted-foreground">{tour.subtitle}</p>
                <p className="text-xs text-primary font-medium mt-1 italic">
                  "{tour.verseText}"
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ShareTourButton tour={tour} />
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  ~{Math.round(getTotalSeconds(tour) / 60)} min
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TourPlayer({ tour, onBack }: { tour: TourDefinition; onBack: () => void }) {
  const allSegments = buildAllSegments(tour);
  const totalEstimated = getTotalSeconds(tour);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [completedSegments, setCompletedSegments] = useState<Set<number>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentSegment = allSegments[currentIndex];
  const totalSegments = allSegments.length;
  const overallProgress = (completedSegments.size / totalSegments) * 100;

  const cleanupAudio = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioDuration(0);
  }, []);

  const playSegment = useCallback(async (index: number) => {
    cleanupAudio();
    setIsLoading(true);
    setCurrentIndex(index);

    const segment = allSegments[index];

    try {
      const { data, error } = await supabase.functions.invoke("generate-palace-tour-audio", {
        body: {
          segmentId: segment.id,
          guide: segment.guide,
          script: segment.script,
          tourId: tour.id,
        },
      });

      if (error) throw error;

      const audioUrl = data?.audioUrl;
      if (!audioUrl) throw new Error("No audio URL returned");

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadedmetadata = () => setAudioDuration(audio.duration);

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        progressIntervalRef.current = setInterval(() => {
          if (audio) setAudioProgress(audio.currentTime);
        }, 250);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCompletedSegments(prev => { const next = new Set(prev); next.add(index); return next; });
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        if (index < totalSegments - 1) {
          setTimeout(() => playSegment(index + 1), 500);
        }
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };

      await audio.play();
    } catch (err) {
      console.error("Tour audio error:", err);
      setIsLoading(false);
    }
  }, [cleanupAudio, totalSegments, allSegments, tour.id]);

  const togglePlayPause = useCallback(() => {
    if (isLoading) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    } else if (audioRef.current && audioRef.current.src) {
      audioRef.current.play();
      setIsPlaying(true);
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) setAudioProgress(audioRef.current.currentTime);
      }, 250);
    } else {
      playSegment(currentIndex);
    }
  }, [isPlaying, isLoading, currentIndex, playSegment]);

  const skipNext = useCallback(() => {
    if (currentIndex < totalSegments - 1) playSegment(currentIndex + 1);
  }, [currentIndex, totalSegments, playSegment]);

  const skipPrev = useCallback(() => {
    if (currentIndex > 0) playSegment(currentIndex - 1);
  }, [currentIndex, playSegment]);

  useEffect(() => {
    return () => cleanupAudio();
  }, [cleanupAudio]);

  useEffect(() => {
    const activeEl = document.getElementById(`tour-seg-${currentIndex}`);
    if (activeEl) activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [currentIndex]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const Icon = ROOM_ICONS[currentSegment.roomCode] || BookOpen;

  return (
    <Card className="overflow-hidden border-primary/20">
      <CardContent className="p-0">
        {/* Back button + Now Playing Header */}
        <div className={`relative bg-gradient-to-r ${FLOOR_COLORS[currentSegment.floor] || FLOOR_COLORS[0]} p-4 md:p-6 text-white`}>
          <button
            onClick={() => { cleanupAudio(); onBack(); }}
            className="flex items-center gap-1 text-xs text-white/70 hover:text-white mb-3 transition-colors"
          >
            <ChevronLeft className="h-3 w-3" /> All Tours
          </button>
          <div className="absolute top-4 right-4">
            <ShareTourButton tour={tour} size="sm" />
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                  {currentSegment.floor === 0 ? "Welcome" : `Floor ${currentSegment.floor}`}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0">
                  {currentSegment.guide === "jeeves" ? "🎩 Jeeves" : "🎩 Reginald"}
                </Badge>
              </div>
              <h3 className="font-bold text-lg truncate">{currentSegment.title}</h3>
              <p className="text-white/80 text-sm">{currentSegment.roomName} — {currentSegment.floorName}</p>
            </div>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white/40">
                {currentSegment.guide === "reginald" ? (
                  <img src={reginaldAvatar} alt="Reginald" className="h-full w-full object-cover object-top" />
                ) : (
                  <div className="h-full w-full bg-blue-900 flex items-center justify-center text-lg">🎩</div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={audioDuration > 0 ? (audioProgress / audioDuration) * 100 : 0} className="h-1.5 bg-white/20" />
            <div className="flex justify-between text-xs text-white/70 mt-1">
              <span>{formatTime(audioProgress)}</span>
              <span>{formatTime(audioDuration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-3">
            <Button variant="ghost" size="icon" onClick={skipPrev} disabled={currentIndex === 0 || isLoading} className="text-white hover:bg-white/20 h-10 w-10">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button size="icon" onClick={togglePlayPause} disabled={isLoading} className="h-14 w-14 rounded-full bg-white text-foreground hover:bg-white/90 shadow-lg">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={skipNext} disabled={currentIndex === totalSegments - 1 || isLoading} className="text-white hover:bg-white/20 h-10 w-10">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-white/70">
            <Volume2 className="h-3 w-3" />
            <span>{currentIndex + 1} of {totalSegments} segments</span>
            <span>•</span>
            <span>~{Math.round(totalEstimated / 60)} min total</span>
          </div>
        </div>

        <div className="p-4 bg-muted/30 border-b">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            "{currentSegment.script.substring(0, 200)}..."
          </p>
        </div>

        <ScrollArea className="h-[320px]">
          <div className="p-2 space-y-1">
            {allSegments.map((seg, i) => {
              const SegIcon = ROOM_ICONS[seg.roomCode] || BookOpen;
              const isActive = i === currentIndex;
              const isCompleted = completedSegments.has(i);

              return (
                <button
                  key={seg.id}
                  id={`tour-seg-${i}`}
                  onClick={() => playSegment(i)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                    isActive ? "bg-primary/10 border border-primary/30"
                    : isCompleted ? "bg-muted/50 opacity-70"
                    : "hover:bg-muted/30"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${FLOOR_COLORS[seg.floor] || FLOOR_COLORS[0]} text-white flex-shrink-0`}>
                    <SegIcon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{seg.title}</span>
                      {isCompleted && <span className="text-xs">✓</span>}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{seg.guide === "jeeves" ? "Jeeves" : "Reginald"}</span>
                      <span>•</span>
                      <span>{seg.roomName}</span>
                      <span>•</span>
                      <span>~{seg.estimatedSeconds}s</span>
                    </div>
                  </div>
                  {isActive && isPlaying && (
                    <div className="flex gap-0.5">
                      {[1,2,3].map(n => (
                        <motion.div
                          key={n}
                          className="w-0.5 bg-primary rounded-full"
                          animate={{ height: [4, 12, 4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: n * 0.2 }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-3 border-t bg-muted/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Tour Progress</span>
            <span>{completedSegments.size}/{totalSegments} segments</span>
          </div>
          <Progress value={overallProgress} className="h-1.5" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PalaceAudioTour() {
  const [selectedTour, setSelectedTour] = useState<TourDefinition | null>(null);

  // Auto-select tour from URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tourId = params.get("tour");
    if (tourId && !selectedTour) {
      const found = ALL_TOURS.find(t => t.id === tourId);
      if (found) setSelectedTour(found);
    }
  }, []);

  if (selectedTour) {
    return <TourPlayer tour={selectedTour} onBack={() => setSelectedTour(null)} />;
  }

  return <TourSelector onSelect={setSelectedTour} />;
}
