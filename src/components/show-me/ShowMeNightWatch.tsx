import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Moon, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { callJeeves } from "@/lib/jeevesClient";
import { supabase } from "@/integrations/supabase/client";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import type { ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { toast } from "sonner";

interface ShowMeNightWatchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
}

export function ShowMeNightWatch({ open, onOpenChange, onUse }: ShowMeNightWatchProps) {
  const [loading, setLoading] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [track, setTrack] = useState<ImmersiveTrack | null>(null);

  const handleBegin = async () => {
    setLoading(true);
    try {
      onUse();

      // Step 1: Generate the meditation script via Jeeves
      const { data: scriptData, error: scriptError } = await callJeeves(
        {
          mode: "night-watch",
          message: "The Cross — Matthew 27:32-50",
          passage: "Matthew 27:32-50",
          theme: "The Cross",
        },
        "show-me"
      );
      if (scriptError) throw scriptError;

      const script =
        typeof scriptData === "string"
          ? scriptData
          : (scriptData as any)?.response || (scriptData as any)?.script || "";

      if (!script) throw new Error("No meditation script generated");

      // Step 2: Convert to audio via watch-tts
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke("watch-tts", {
        body: { text: script, voice: "onyx" },
      });
      if (ttsError) throw ttsError;

      const audioUrl = ttsData?.audioUrl || ttsData?.audio_url || ttsData?.url;
      if (!audioUrl) throw new Error("No audio URL returned");

      setTrack({
        id: "showme-night-watch",
        title: "The Cross",
        subtitle: "Matthew 27:32-50",
        type: "devotional",
        audioUrl,
        sessionDurationSec: 15 * 60, // 15 minutes
        ambientMode: "ambient-sounds", // Use admin-uploaded watch music tracks
      });
      setPlayerOpen(true);
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to generate meditation. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 bg-card/95 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 flex-shrink-0" />

          <div className="p-6 text-center">
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center rounded-full bg-indigo-500/20 p-6 mb-6"
            >
              <Moon className="h-10 w-10 text-indigo-400" />
            </motion.div>

            <h2 className="text-xl font-bold mb-2">Night Watch</h2>
            <p className="text-sm text-muted-foreground mb-2">The Cross — Matthew 27:32-50</p>
            <p className="text-xs text-muted-foreground/70 mb-6">
              A guided 15-minute meditation at the foot of the cross. Close your eyes. Let the Word do the work.
            </p>

            <Button
              size="lg"
              onClick={handleBegin}
              disabled={loading}
              className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing meditation...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Begin Meditation
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {track && (
        <ImmersiveAudioPlayer
          isOpen={playerOpen}
          onClose={() => setPlayerOpen(false)}
          tracks={[track]}
          currentIndex={0}
          onNextTrack={() => {}}
          onPrevTrack={() => {}}
          hasNext={false}
          hasPrev={false}
          ambientMusicEnabled={true}
          ambientVolume={0.25}
          continuousPlay={false}
          onSetAmbientMusic={() => {}}
          onSetAmbientVolume={() => {}}
          onSetContinuousPlay={() => {}}
        />
      )}
    </>
  );
}
