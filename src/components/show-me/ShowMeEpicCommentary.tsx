import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Headphones, Loader2, Play } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ImmersiveAudioPlayer } from "@/components/audio/ImmersiveAudioPlayer";
import type { ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { toast } from "sonner";

interface ShowMeEpicCommentaryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUse: () => void;
}

export function ShowMeEpicCommentary({ open, onOpenChange, onUse }: ShowMeEpicCommentaryProps) {
  const [loading, setLoading] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [track, setTrack] = useState<ImmersiveTrack | null>(null);

  const handlePlay = async () => {
    setLoading(true);
    try {
      onUse();
      const { data, error } = await supabase.functions.invoke("generate-epic-commentary", {
        body: { book: "Genesis", chapter: 1 },
      });
      if (error) throw error;

      let audioUrl = data?.audioUrl || data?.audio_url;

      // New generation returns id but no audioUrl — fetch from the DB record
      if (!audioUrl && data?.id) {
        const { data: record } = await supabase
          .from("epic_commentaries")
          .select("audio_storage_path")
          .eq("id", data.id)
          .single();
        if (record?.audio_storage_path) {
          const { data: signedData } = await supabase.storage
            .from("epic-audio")
            .createSignedUrl(record.audio_storage_path, 3600);
          audioUrl = signedData?.signedUrl;
        }
      }

      if (!audioUrl) throw new Error("No audio returned");

      setTrack({
        id: "showme-genesis-1",
        title: "Genesis 1 — Epic Commentary",
        subtitle: "In the beginning...",
        type: "commentary",
        audioUrl,
        book: "Genesis",
        chapter: 1,
      });
      setPlayerOpen(true);
      onOpenChange(false);
    } catch (err) {
      toast.error("Failed to generate commentary. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-0 bg-card/95 backdrop-blur-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 flex-shrink-0" />

          <div className="p-6 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center justify-center rounded-full bg-amber-500/20 p-6 mb-6"
            >
              <Headphones className="h-10 w-10 text-amber-400" />
            </motion.div>

            <h2 className="text-xl font-bold mb-2">Epic Commentary</h2>
            <p className="text-sm text-muted-foreground mb-2">Genesis 1 — The Creation</p>
            <p className="text-xs text-muted-foreground/70 mb-6">
              Experience the opening chapter of the Bible narrated as a cinematic epic. This isn't a lecture — it's a revelation.
            </p>

            <Button
              size="lg"
              onClick={handlePlay}
              disabled={loading}
              className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Play Epic Commentary
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
          ambientVolume={0.3}
          continuousPlay={false}
          onSetAmbientMusic={() => {}}
          onSetAmbientVolume={() => {}}
          onSetContinuousPlay={() => {}}
        />
      )}
    </>
  );
}
