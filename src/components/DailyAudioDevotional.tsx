import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, BookOpen, Phone, PhoneOff, Loader2, Volume2 } from "lucide-react";
import { useTodayDevotional, useDevotionalSmsSubscription } from "@/hooks/useDailyAudioDevotional";
import { useAuth } from "@/hooks/useAuth";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { globalAudioManager } from "@/lib/globalAudioManager";
import { setupMediaSession, updateMediaSessionPlaybackState, clearMediaSession } from "@/lib/mediaSessionHelper";

export function DailyAudioDevotional() {
  const { user } = useAuth();
  const { data: devotional, isLoading: loadingDev } = useTodayDevotional();
  const { subscription, isLoading: loadingSub, subscribe, unsubscribe } = useDevotionalSmsSubscription();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSmsForm, setShowSmsForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showText, setShowText] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        globalAudioManager.unregister(audioRef.current);
        audioRef.current.pause();
        clearMediaSession();
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (!devotional?.audio_url) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      globalAudioManager.unregister(audioRef.current);
      setIsPlaying(false);
      notifyTTSStopped();
      updateMediaSessionPlaybackState("paused");
      return;
    }

    // Stop all other audio first
    globalAudioManager.stopAll();

    if (!audioRef.current || audioRef.current.src !== devotional.audio_url) {
      audioRef.current = new Audio(devotional.audio_url);

      audioRef.current.ontimeupdate = () => {
        if (audioRef.current && audioRef.current.duration) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          progressRef.current = pct;
          setProgress(pct);
        }
      };

      audioRef.current.onended = () => {
        globalAudioManager.unregister(audioRef.current!);
        setIsPlaying(false);
        setProgress(0);
        notifyTTSStopped();
        clearMediaSession();
      };

      audioRef.current.onerror = () => {
        globalAudioManager.unregister(audioRef.current!);
        setIsPlaying(false);
        notifyTTSStopped();
        clearMediaSession();
      };
    }

    audioRef.current.play().then(() => {
      globalAudioManager.register(audioRef.current!);
      setIsPlaying(true);
      notifyTTSStarted();
      setupMediaSession({
        title: devotional.title,
        artist: "Phototheology Palace",
        album: "Daily Devotional",
        onPlay: () => audioRef.current?.play(),
        onPause: () => audioRef.current?.pause(),
      });
      updateMediaSessionPlaybackState("playing");
    }).catch(console.error);
  }, [devotional, isPlaying]);

  const handleSubscribe = () => {
    if (!phoneNumber.trim()) return;
    subscribe.mutate({ phoneNumber: phoneNumber.replace(/\D/g, "") });
    setShowSmsForm(false);
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  if (loadingDev) {
    return (
      <Card className="border-amber-200/30 bg-gradient-to-br from-amber-950/30 to-amber-900/20">
        <CardContent className="py-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
        </CardContent>
      </Card>
    );
  }

  if (!devotional) return null;

  return (
    <Card className="border-amber-200/30 bg-gradient-to-br from-amber-950/30 to-amber-900/20 overflow-hidden">
      {/* Progress bar */}
      {isPlaying && (
        <div className="h-1 bg-amber-900/30">
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400/80 uppercase tracking-wider">
              Daily Audio Devotional
            </span>
          </div>
          <Badge variant="outline" className="text-amber-300 border-amber-300/30 text-xs">
            Day {devotional.day_number}
          </Badge>
        </div>
        <CardTitle className="text-base text-foreground leading-snug">
          {devotional.title}
        </CardTitle>
        {devotional.scripture_reference && (
          <p className="text-sm text-amber-300/70 italic">
            {devotional.scripture_reference}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Play button + duration */}
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlay}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold gap-2"
            disabled={!devotional.audio_url}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isPlaying ? "Pause" : "Listen"}
          </Button>

          {devotional.audio_duration_seconds && (
            <span className="text-xs text-muted-foreground">
              {formatDuration(devotional.audio_duration_seconds)}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowText(!showText)}
            className="ml-auto text-amber-400/70 hover:text-amber-300 gap-1"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {showText ? "Hide" : "Read"}
          </Button>
        </div>

        {/* Expandable text */}
        {showText && (
          <div className="text-sm text-muted-foreground space-y-2 pt-2 border-t border-amber-200/10">
            {devotional.scripture_text && (
              <blockquote className="border-l-2 border-amber-400/40 pl-3 italic text-amber-200/70">
                "{devotional.scripture_text}"
              </blockquote>
            )}
            <p className="whitespace-pre-line leading-relaxed">{devotional.devotional_text}</p>
            {devotional.prayer && (
              <p className="italic text-amber-300/60 pt-1">🙏 {devotional.prayer}</p>
            )}
          </div>
        )}

        {/* SMS subscription */}
        {user && (
          <div className="pt-2 border-t border-amber-200/10">
            {loadingSub ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : subscription?.is_active ? (
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> SMS active
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  onClick={() => unsubscribe.mutate()}
                >
                  <PhoneOff className="h-3 w-3 mr-1" /> Pause SMS
                </Button>
              </div>
            ) : showSmsForm ? (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Get this devotional sent to your phone daily
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-sm h-8"
                  />
                  <Button size="sm" className="h-8" onClick={handleSubscribe} disabled={subscribe.isPending}>
                    {subscribe.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Subscribe"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-amber-400/70 hover:text-amber-300 w-full"
                onClick={() => setShowSmsForm(true)}
              >
                <Phone className="h-3 w-3 mr-1" />
                Get daily devotional via SMS
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
