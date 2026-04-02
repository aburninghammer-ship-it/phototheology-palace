import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, BookOpen, Phone, PhoneOff, Loader2, Volume2, Share2, MessageCircle, Copy, Check, Facebook, Twitter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTodayDevotional, useDevotionalSmsSubscription } from "@/hooks/useDailyAudioDevotional";
import { useAuth } from "@/hooks/useAuth";
import { notifyTTSStarted, notifyTTSStopped } from "@/hooks/useAudioDucking";
import { globalAudioManager } from "@/lib/globalAudioManager";
import { setupMediaSession, updateMediaSessionPlaybackState, clearMediaSession } from "@/lib/mediaSessionHelper";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const SUITE_URL = "https://phototheologybible.com";

const openIntent = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer,width=600,height=500");
};

export function DailyAudioDevotional() {
  const { user } = useAuth();
  const { data: devotional, isLoading: loadingDev } = useTodayDevotional();
  const { subscription, isLoading: loadingSub, subscribe, unsubscribe } = useDevotionalSmsSubscription();
  const [searchParams] = useSearchParams();

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSmsForm, setShowSmsForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showText, setShowText] = useState(false);
  const [playingIntro, setPlayingIntro] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<number>(0);
  const hasDevotional = Boolean(devotional);
  const hasAudio = Boolean(devotional?.audio_url);
  const introUrl = searchParams.get("intro");

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        globalAudioManager.unregister(audioRef.current);
        audioRef.current.pause();
      }
      if (introAudioRef.current) {
        introAudioRef.current.pause();
      }
      clearMediaSession();
    };
  }, []);

  const getShareText = useCallback(() => {
    if (!devotional) return "";
    const excerpt = devotional.devotional_text?.slice(0, 200)?.replace(/\n/g, " ") || "";
    return `📖 "${devotional.title}"\n\n${devotional.scripture_reference}\n\n${excerpt}…\n\n#Phototheology #BibleStudy\n✨ Listen & explore: ${SUITE_URL}`;
  }, [devotional]);

  const handleCopy = useCallback(async () => {
    if (!devotional) return;
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      toast.success("Devotional copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [devotional, getShareText]);

  const handleTwitterShare = useCallback(() => {
    const text = getShareText();
    openIntent(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`);
  }, [getShareText]);

  const handleFacebookShare = useCallback(() => {
    openIntent(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SUITE_URL)}&quote=${encodeURIComponent(getShareText())}`);
  }, [getShareText]);

  const handleSmsShare = useCallback(() => {
    if (!devotional) return;
    const text = getShareText();
    // sms: works on both iOS and Android
    window.location.href = `sms:?body=${encodeURIComponent(text)}`;
  }, [devotional, getShareText]);

  const handleNativeShare = useCallback(async () => {
    if (!devotional) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: devotional.title,
          text: getShareText(),
          url: SUITE_URL,
        });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    handleCopy();
  }, [devotional, getShareText, handleCopy]);

  const playMainAudio = useCallback(() => {
    if (!devotional?.audio_url) return;

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
      setPlayingIntro(false);
      setupMediaSession({
        title: devotional.title,
        artist: "Phototheology Palace",
        album: "Daily Devotional",
        onPlay: () => audioRef.current?.play(),
        onPause: () => audioRef.current?.pause(),
      });
      updateMediaSessionPlaybackState("playing");
    }).catch(console.error);
  }, [devotional]);

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

    if (playingIntro && introAudioRef.current) {
      introAudioRef.current.pause();
      setPlayingIntro(false);
      setIsPlaying(false);
      notifyTTSStopped();
      return;
    }

    globalAudioManager.stopAll();
    setIsPlaying(true);
    notifyTTSStarted();

    if (introUrl) {
      setPlayingIntro(true);
      introAudioRef.current = new Audio(introUrl);
      introAudioRef.current.onended = () => {
        setPlayingIntro(false);
        playMainAudio();
      };
      introAudioRef.current.onerror = () => {
        setPlayingIntro(false);
        playMainAudio();
      };
      introAudioRef.current.play().catch(() => {
        setPlayingIntro(false);
        playMainAudio();
      });
    } else {
      playMainAudio();
    }
  }, [devotional, isPlaying, playingIntro, introUrl, playMainAudio]);

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

  return (
    <Card className="border-amber-400/40 bg-gradient-to-br from-amber-950/50 to-amber-900/30 overflow-hidden shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/20">
      {isPlaying && (
        <div className="h-1.5 bg-amber-900/30">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-full bg-amber-400/20">
              <Volume2 className="h-4 w-4 text-amber-400" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-amber-400 uppercase tracking-wider">
              Daily Audio Devotional
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasDevotional && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-400/70 hover:text-amber-300">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">Share this devotional</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleNativeShare} className="gap-2">
                    <Share2 className="h-4 w-4" /> Share via…
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSmsShare} className="gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" /> Text Message
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleTwitterShare} className="gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" /> X / Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleFacebookShare} className="gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" /> Facebook
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCopy} className="gap-2">
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {hasDevotional ? (
              <Badge variant="outline" className="text-amber-300 border-amber-300/40 text-xs sm:text-sm bg-amber-400/10">
                Day {devotional.day_number}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-amber-300 border-amber-300/40 text-xs sm:text-sm bg-amber-400/10">
                Coming Soon
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className="text-lg sm:text-xl text-foreground leading-snug pt-1">
          {devotional?.title ?? "Get daily audio devotionals on your phone"}
        </CardTitle>
        {devotional?.scripture_reference ? (
          <p className="text-sm sm:text-base text-amber-300/80 italic">
            {devotional.scripture_reference}
          </p>
        ) : (
          <p className="text-sm sm:text-base text-amber-200/80 leading-relaxed">
            Today's audio is still being prepared, but you can already subscribe for daily devotional SMS delivery.
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={togglePlay}
            size="default"
            className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2 px-5 py-2.5 text-sm sm:text-base shadow-md shadow-amber-500/20 transition-all hover:shadow-lg hover:shadow-amber-500/30"
            disabled={!hasAudio}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            {isPlaying ? "Pause" : hasAudio ? "Listen Now" : "Audio Pending"}
          </Button>

          {devotional?.audio_duration_seconds && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              {formatDuration(devotional.audio_duration_seconds)}
            </span>
          )}

          {hasDevotional && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowText(!showText)}
              className="ml-auto text-amber-400/80 hover:text-amber-300 gap-1.5 text-sm"
            >
              <BookOpen className="h-4 w-4" />
              {showText ? "Hide" : "Read"}
            </Button>
          )}
        </div>

        {showText && devotional && (
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

        {user && (
          <div className="pt-3 border-t border-amber-200/15">
            {loadingSub ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : subscription?.is_active ? (
              <div className="flex items-center justify-between gap-3">
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
              <div className="space-y-2">
                <div className="bg-amber-500/15 border border-amber-400/30 rounded-lg p-3 text-center">
                  <p className="text-xs sm:text-sm text-amber-200 mb-2 font-medium">
                    📲 Never miss a devotional — get it sent to your phone every morning!
                  </p>
                  <Button
                    size="default"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold gap-2 px-6 py-2.5 text-sm sm:text-base shadow-md shadow-amber-500/20 w-full"
                    onClick={() => setShowSmsForm(true)}
                  >
                    <Phone className="h-4 w-4" />
                    Subscribe to Daily SMS Devotional
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
