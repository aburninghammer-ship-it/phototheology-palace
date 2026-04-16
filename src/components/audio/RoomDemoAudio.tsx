import { useState, useRef } from "react";
import { Headphones, Loader2, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { globalAudioManager } from "@/lib/globalAudioManager";
import { useAudioExploration } from "@/hooks/useAudioExploration";

interface RoomDemoAudioProps {
  roomId: string;
  roomName: string;
  roomPurpose: string;
  roomMethod: string;
  floorNumber: number;
  floorName: string;
}

export function RoomDemoAudio({
  roomId,
  roomName,
  roomPurpose,
  roomMethod,
  floorNumber,
  floorName,
}: RoomDemoAudioProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [script, setScript] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { markRoomListened, hasListenedRoom } = useAudioExploration();
  const listened = hasListenedRoom(floorNumber, roomId);

  const handlePlay = async () => {
    // If already playing, pause
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If audio already loaded, resume
    if (audioRef.current && audioRef.current.src) {
      globalAudioManager.stopAllExcept(audioRef.current);
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-audio-guide", {
        body: {
          type: "room_demo",
          contextId: roomId,
          contextName: roomName,
          contextPurpose: roomPurpose,
          contextMethod: roomMethod,
          floorName,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setScript(data.script || "");

      if (data.audioAvailable && data.audioBase64) {
        const audioUrl = `data:audio/mpeg;base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        globalAudioManager.stopAllExcept(audio);
        globalAudioManager.register(audio);

        audio.onended = () => {
          setIsPlaying(false);
          globalAudioManager.unregister(audio);
          markRoomListened(floorNumber, roomId);
        };

        audio.onpause = () => setIsPlaying(false);
        audio.onplay = () => setIsPlaying(true);

        await audio.play();
        setIsPlaying(true);
        markRoomListened(floorNumber, roomId);
      } else {
        toast.info("Script generated but audio unavailable. Check the transcript below.");
        markRoomListened(floorNumber, roomId);
      }
    } catch (err: any) {
      console.error("Room demo audio error:", err);
      toast.error("Failed to generate room demo");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePlay}
        disabled={isLoading}
        className="text-xs border-primary/30 text-primary hover:bg-primary/10 gap-1.5"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generating demo...
          </>
        ) : isPlaying ? (
          <>
            <Pause className="h-3.5 w-3.5" />
            Pause Demo
          </>
        ) : (
          <>
            <Headphones className="h-3.5 w-3.5" />
            {listened ? "Replay Demo" : "🎧 Watch Me Use It"}
          </>
        )}
      </Button>

      {script && !isPlaying && !isLoading && (
        <details className="text-xs text-muted-foreground">
          <summary className="cursor-pointer hover:text-foreground transition-colors">
            View transcript
          </summary>
          <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/50 whitespace-pre-wrap leading-relaxed">
            {script}
          </div>
        </details>
      )}
    </div>
  );
}
