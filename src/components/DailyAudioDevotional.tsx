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
      <Card className="border-amber-400/40 bg-gradient-to-br from-amber-950/40 to-amber-900/30 shadow-lg shadow-amber-500/10">
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
        </CardContent>
      </Card>
    );
  }

  if (!devotional) return null;

  return (
    <Card className="border-amber-400/40 bg-gradient-to-br from-amber-950/50 to-amber-900/30 overflow-hidden shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/20">
      {/* Progress bar */}
      {isPlaying && (
        <div className="h-1.5 bg-amber-900/30">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-amber-400/20">
              <Volume2 className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-amber-400 uppercase tracking-wider">
              Daily Audio Devotional
            </span>
          </div>
          <Badge variant="outline" className="text-amber-300 border-amber-300/40 text-xs sm:text-sm bg-amber-400/10">
            Day {devotional.day_number}
          </Badge>
        </div>
        <CardTitle className="text-lg sm:text-xl text-foreground leading-snug pt-1">
          {devotional.title}
        </CardTitle>
        {devotional.scripture_reference && (
          <p className="text-sm sm:text-base text-amber-300/80 italic">
            {devotional.scripture_reference}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        {/* Play button + duration */}
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlay}
            size="default"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2 px-5 py-2.5 text-sm sm:text-base shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/30"
            disabled={!devotional.audio_url}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isPlaying ? "Pause" : "Listen Now"}
          </Button>

          {devotional.audio_duration_seconds && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              {formatDuration(devotional.audio_duration_seconds)}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowText(!showText)}
            className="ml-auto text-amber-400/80 hover:text-amber-300 gap-1.5 text-sm"
          >
            <BookOpen className="h-4 w-4" />
            {showText ? "Hide" : "Read"}
          </Button>
        </div>

        {/* Expandable text */}
        {showText && (
          <div className="text-sm sm:text-base text-muted-foreground space-y-3 pt-3 border-t border-amber-200/15">
            {devotional.scripture_text && (
              <blockquote className="border-l-2 border-amber-400/50 pl-3 italic text-amber-200/80 leading-relaxed">
                "{devotional.scripture_text}"
              </blockquote>
            )}
            <p className="whitespace-pre-line leading-relaxed">{devotional.devotional_text}</p>
            {devotional.prayer && (
              <p className="italic text-amber-300/70 pt-1">🙏 {devotional.prayer}</p>
            )}
          </div>
        )}

        {/* SMS subscription */}
        {user && (
          <div className="pt-3 border-t border-amber-200/15">
            {loadingSub ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : subscription?.is_active ? (
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-green-400 flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5" /> SMS active
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm text-muted-foreground"
                  onClick={() => unsubscribe.mutate()}
                >
                  <PhoneOff className="h-3.5 w-3.5 mr-1" /> Pause SMS
                </Button>
              </div>
            ) : showSmsForm ? (
              <div className="space-y-2.5">
                <Label className="text-xs sm:text-sm text-muted-foreground">
                  Get this devotional sent to your phone daily
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-sm sm:text-base h-9 sm:h-10"
                  />
                  <Button size="sm" className="h-9 sm:h-10 px-4" onClick={handleSubscribe} disabled={subscribe.isPending}>
                    {subscribe.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="default"
                className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 border-amber-400/30 hover:border-amber-400/50 hover:bg-amber-400/10 w-full py-2.5"
                onClick={() => setShowSmsForm(true)}
              >
                <Phone className="h-4 w-4 mr-1.5" />
                Get daily devotional via SMS
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
