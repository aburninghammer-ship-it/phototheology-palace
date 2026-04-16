import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reginald audio greeting on the Welcome page.
 * - First-time users: ~30s intro covering the suite
 * - Returning users: ~15s welcome-back
 * Audio is generated once via ElevenLabs and cached server-side.
 */
export const ReginaldGreeting = () => {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoplayAttemptedRef = useRef(false);

  // Derive greeting type synchronously — no effect needed
  const greetingType = useMemo<"first_time" | "returning">(() => {
    if (!user) return "first_time";
    const heard = localStorage.getItem(`reginald_greeting_${user.id}`);
    return heard ? "returning" : "first_time";
  }, [user]);

  const playGreeting = useCallback(async () => {
    if (!user || isLoading) return;
    setIsLoading(true);

    try {
      // Try cached URL first
      const { data: cachedData } = await supabase.functions.invoke("reginald-greeting", {
        body: { type: greetingType },
      });

      let audioUrl: string;

      if (cachedData?.audioUrl) {
        // Cached signed URL returned as JSON
        audioUrl = cachedData.audioUrl;
      } else {
        // Raw audio returned — need to use fetch directly
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reginald-greeting`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ type: greetingType }),
          }
        );

        if (!response.ok) throw new Error("Failed to fetch greeting audio");

        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("audio")) {
          const blob = await response.blob();
          audioUrl = URL.createObjectURL(blob);
        } else {
          const json = await response.json();
          if (json.audioUrl) {
            audioUrl = json.audioUrl;
          } else {
            throw new Error(json.error || "No audio returned");
          }
        }
      }

      // Play the audio
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setHasPlayed(true);
        // Mark first-time greeting as heard
        if (greetingType === "first_time" && user) {
          localStorage.setItem(`reginald_greeting_${user.id}`, "true");
        }
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
      };

      await audio.play();
    } catch (err) {
      console.error("Reginald greeting error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user, greetingType, isLoading]);

  const stopGreeting = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  // No auto-play — user must tap play manually

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-amber-950/30 to-amber-900/20 border border-amber-500/20 max-w-md mx-auto"
    >
      {/* Avatar */}
      <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-500/40 shadow-lg">
        <img
          src={reginaldAvatar}
          alt="Reginald"
          className="h-full w-full object-cover object-top"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">
          {greetingType === "first_time"
            ? "Reginald has a message for you"
            : "Welcome back!"}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {greetingType === "first_time"
            ? "Tap play to hear your personal welcome"
            : "Tap play to hear from Reginald"}
        </p>
      </div>

      {/* Play/Stop Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={isPlaying ? stopGreeting : playGreeting}
        disabled={isLoading}
        className="h-10 w-10 rounded-full border-amber-500/40 hover:bg-amber-500/20 flex-shrink-0"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
            </motion.div>
          ) : isPlaying ? (
            <motion.div
              key="stop"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <VolumeX className="h-4 w-4 text-amber-400" />
            </motion.div>
          ) : (
            <motion.div
              key="play"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <Volume2 className="h-4 w-4 text-amber-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
};
