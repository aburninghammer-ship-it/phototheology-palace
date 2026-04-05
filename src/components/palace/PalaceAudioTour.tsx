import { useState, useRef, useEffect, useCallback } from "react";
import { VideoExportButton } from "./VideoExportButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Play, Pause, SkipForward, SkipBack, Volume2, Loader2,
  Headphones, BookOpen, Flame, Eye, Gem, Brain, Crown,
  Telescope, Heart, Sparkles, Clock, Target, Layers, Scale,
  Link2, Scroll, Search, Film, Image as ImageIcon, ChevronLeft,
  Share2, Copy, Check, Facebook, Twitter, Mail
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ALL_TOURS, getTourTiers, buildAllSegments, getTotalSeconds } from "@/data/tourScripts";
import type { TourDefinition, TourSegment } from "@/data/tourScripts";
import type { TourTier } from "@/data/tourScripts";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";
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

const PRODUCTION_URL = "https://phototheologybible.com";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

function getShareUrl(tourId: string) {
  return `${PRODUCTION_URL}/palace/tour?tour=${tourId}`;
}

function getOgShareUrl(tourId: string) {
  return `${SUPABASE_URL}/functions/v1/og-palace-tour?tour=${tourId}`;
}

function ShareTourButton({ tour, size = "icon" }: { tour: TourDefinition; size?: "icon" | "sm" }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = getShareUrl(tour.id);
  const ogUrl = getOgShareUrl(tour.id);
  const shareText = `🎧 Take the "${tour.title}" Palace Tour — ${tour.subtitle}\n"${tour.verseText}"\n\n— Phototheology Palace`;

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const openIntent = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
  };

  const handleFacebook = () => openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`);
  const handleTwitter = () => openIntent(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(`🎧 ${tour.title} — Palace Audio Tour`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`;
  };
  const handleWhatsApp = () => openIntent(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${tour.title} — Palace Audio Tour`, text: shareText, url: shareUrl });
      } catch { /* cancelled */ }
    }
  };

  const triggerButton = size === "sm" ? (
    <Button variant="ghost" size="sm" onClick={handleOpen} className="gap-1.5 text-white/80 hover:text-white hover:bg-white/20">
      <Share2 className="h-3.5 w-3.5" /> Share
    </Button>
  ) : (
    <Button variant="ghost" size="icon" onClick={handleOpen} className="h-8 w-8 text-muted-foreground hover:text-foreground">
      <Share2 className="h-4 w-4" />
    </Button>
  );

  return (
    <>
      {triggerButton}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" /> Share This Tour
            </DialogTitle>
            <DialogDescription>
              Share "{tour.title}" with friends and Bible study groups
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Preview */}
            <div className="border border-border/50 bg-muted/30 rounded-lg p-3 space-y-1">
              <p className="font-medium text-sm">{tour.emoji} {tour.title}</p>
              <p className="text-xs text-muted-foreground">{tour.subtitle}</p>
              <p className="text-xs italic text-muted-foreground">"{tour.verseText}"</p>
            </div>

            {/* Social buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium block">Share To</label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleFacebook}>
                  <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                </Button>
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleTwitter}>
                  <Twitter className="h-4 w-4 text-sky-500" /> X / Twitter
                </Button>
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleWhatsApp}>
                  <span className="w-4 text-center text-sm">💬</span> WhatsApp
                </Button>
                <Button variant="outline" size="sm" className="gap-2 justify-start" onClick={handleEmail}>
                  <Mail className="h-4 w-4" /> Email
                </Button>
              </div>
            </div>

            {/* Copy + Native share */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 gap-2" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy Link & Text"}
              </Button>
              {typeof navigator.share === "function" && (
                <Button variant="default" className="flex-1 gap-2" onClick={handleNativeShare}>
                  <Share2 className="h-4 w-4" /> More...
                </Button>
              )}
            </div>

            {/* Video export for native social media playback */}
            <div className="border border-purple-500/20 bg-purple-500/5 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-purple-400 flex items-center gap-1.5">
                🎬 Share as native video on social media
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                Export the tour as a video file with branded visuals & audio. 
                Upload directly to Facebook, Instagram, or YouTube — people can listen without needing an account!
              </p>
              <VideoExportButton tour={tour} />
            </div>

            {/* Link display */}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Share Link</label>
              <input type="text" value={shareUrl} readOnly className="w-full px-3 py-2 text-xs border rounded-md bg-muted" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TourSelector({ onSelect }: { onSelect: (tour: TourDefinition) => void }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold mb-1">🎧 Palace Audio Tours</h3>
        <p className="text-sm text-muted-foreground">
          Jeeves &amp; Reginald guide you through the Palace — pick your depth
        </p>
      </div>

      {TOUR_TIERS.map((tier) => (
        <div key={tier.label} className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <h4 className="text-sm font-bold text-foreground">{tier.label}</h4>
            <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${tier.badgeColor}`}>
              {tier.badge}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground px-1 -mt-1">{tier.description}</p>
          <div className="grid gap-2">
            {tier.tours.map((tour) => (
              <Card
                key={tour.id}
                className="cursor-pointer hover:border-primary/50 transition-all hover:shadow-md"
                onClick={() => onSelect(tour)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <div className="text-2xl">{tour.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm">{tour.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{tour.subtitle}</p>
                    <p className="text-[11px] text-primary font-medium mt-0.5 italic truncate">
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
      ))}
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
  const activeRequestRef = useRef(0);
  const segmentAudioCacheRef = useRef<Map<number, string>>(new Map());
  const segmentAudioRequestRef = useRef<Map<number, Promise<string>>>(new Map());

  const currentSegment = allSegments[currentIndex];
  const totalSegments = allSegments.length;
  const overallProgress = (completedSegments.size / totalSegments) * 100;

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      segmentAudioCacheRef.current.clear();
      segmentAudioRequestRef.current.clear();
    };
  }, []);

  const cleanupAudio = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setAudioProgress(0);
    setAudioDuration(0);
  }, []);

  const fetchSegmentAudioUrl = useCallback(async (index: number, regenerate = false) => {
    if (index < 0 || index >= allSegments.length) {
      throw new Error(`Invalid tour segment index: ${index}`);
    }

    if (!regenerate) {
      const cachedUrl = segmentAudioCacheRef.current.get(index);
      if (cachedUrl) return cachedUrl;

      const inFlightRequest = segmentAudioRequestRef.current.get(index);
      if (inFlightRequest) return inFlightRequest;
    }

    const segment = allSegments[index];
    const request = supabase.functions.invoke("generate-palace-tour-audio", {
      body: {
        segmentId: segment.id,
        guide: segment.guide,
        script: segment.script,
        tourId: tour.id,
        regenerate,
      },
    }).then(({ data, error }) => {
      if (error) throw error;
      const audioUrl = data?.audioUrl;
      if (!audioUrl) throw new Error("No audio URL returned");
      segmentAudioCacheRef.current.set(index, audioUrl);
      return audioUrl as string;
    }).finally(() => {
      segmentAudioRequestRef.current.delete(index);
    });

    segmentAudioRequestRef.current.set(index, request);
    return request;
  }, [allSegments, tour.id]);

  const preloadSegment = useCallback((index: number) => {
    if (index < 0 || index >= totalSegments) return;
    if (segmentAudioCacheRef.current.has(index) || segmentAudioRequestRef.current.has(index)) return;

    void fetchSegmentAudioUrl(index).catch((err) => {
      console.warn("Tour preload failed for segment:", allSegments[index]?.id, err);
    });
  }, [allSegments, fetchSegmentAudioUrl, totalSegments]);

  const playSegment = useCallback(async (index: number) => {
    cleanupAudio();
    setIsLoading(true);
    setCurrentIndex(index);
    const requestId = activeRequestRef.current + 1;
    activeRequestRef.current = requestId;

    const segment = allSegments[index];
    const audio = audioRef.current;

    if (!audio) {
      setIsLoading(false);
      return;
    }

    try {
      const audioUrl = await fetchSegmentAudioUrl(index);

      if (activeRequestRef.current !== requestId) return;

      audio.onloadedmetadata = null;
      audio.onplay = null;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audio.currentTime = 0;
      audio.src = audioUrl;
      audio.load();

      audio.onloadedmetadata = () => setAudioDuration(audio.duration);

      audio.onplay = () => {
        if (activeRequestRef.current !== requestId) return;
        setIsPlaying(true);
        setIsLoading(false);
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = setInterval(() => {
          if (audioRef.current) setAudioProgress(audioRef.current.currentTime);
        }, 250);
        preloadSegment(index + 1);
      };

      audio.onended = () => {
        if (activeRequestRef.current !== requestId) return;
        setIsPlaying(false);
        setCompletedSegments(prev => {
          const next = new Set(prev);
          next.add(index);
          return next;
        });
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        if (index < totalSegments - 1) {
          preloadSegment(index + 1);
          setTimeout(() => playSegment(index + 1), 150);
        }
      };

      audio.onerror = (e) => {
        if (activeRequestRef.current !== requestId) return;
        console.error("Audio playback error for segment:", segment.id, e);
        setIsPlaying(false);
        setIsLoading(false);
        if (index < totalSegments - 1) {
          preloadSegment(index + 1);
          setTimeout(() => playSegment(index + 1), 500);
        }
      };

      await audio.play();
    } catch (err) {
      if (activeRequestRef.current !== requestId) return;
      console.error("Tour audio error for segment:", segment?.id, err);
      setIsLoading(false);
      if (index < totalSegments - 1) {
        preloadSegment(index + 1);
        setTimeout(() => playSegment(index + 1), 750);
      }
    }
  }, [allSegments, cleanupAudio, fetchSegmentAudioUrl, preloadSegment, totalSegments]);

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
            <span>•</span>
            <button
              className="underline hover:text-white transition-colors"
              onClick={() => {
                // Dispatch custom event for immersive mode
                const event = new CustomEvent("immerse-tour", {
                  detail: {
                    title: tour.title,
                    segments: allSegments,
                    currentIndex,
                  },
                });
                window.dispatchEvent(event);
              }}
            >
              🌙 Immerse
            </button>
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
