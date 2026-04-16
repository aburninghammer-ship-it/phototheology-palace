import { useState, useRef, useEffect } from "react";
import { Volume2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { globalAudioManager } from "@/lib/globalAudioManager";
import { useAudioExploration } from "@/hooks/useAudioExploration";
import { cn } from "@/lib/utils";

interface TabActivationClipProps {
  tabId: string;
  tabName: string;
  tabPurpose?: string;
}

export function TabActivationClip({ tabId, tabName, tabPurpose }: TabActivationClipProps) {
  const { hasListenedTab, markTabListened } = useAudioExploration();
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [visible, setVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const alreadyListened = hasListenedTab(tabId);

  // Never auto-show — audio should only play when user explicitly requests it
  if (true) return null;

  const handlePlay = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-audio-guide", {
        body: {
          type: "tab_activation",
          contextId: tabId,
          contextName: tabName,
          contextPurpose: tabPurpose || `Explore the ${tabName} feature`,
        },
      });

      if (error) throw error;

      if (data?.audioAvailable && data?.audioBase64) {
        const audioUrl = `data:audio/mpeg;base64,${data.audioBase64}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        globalAudioManager.stopAllExcept(audio);
        globalAudioManager.register(audio);

        audio.onended = () => {
          setIsPlaying(false);
          globalAudioManager.unregister(audio);
          markTabListened(tabId);
          setVisible(false);
        };

        await audio.play();
        setIsPlaying(true);
      } else {
        markTabListened(tabId);
        setVisible(false);
      }
    } catch (err) {
      console.error("Tab activation clip error:", err);
      markTabListened(tabId);
      setVisible(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      globalAudioManager.unregister(audioRef.current);
    }
    markTabListened(tabId);
    setDismissed(true);
    setVisible(false);
  };

  return (
    <div
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-50",
        "bg-card/95 backdrop-blur-sm border border-primary/30 rounded-xl shadow-lg",
        "px-4 py-3 flex items-center gap-3 max-w-sm",
        "animate-in slide-in-from-bottom-4 fade-in duration-500"
      )}
    >
      <Button
        size="sm"
        onClick={handlePlay}
        disabled={isLoading || isPlaying}
        className="shrink-0 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30"
        variant="outline"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Volume2 className="h-4 w-4 animate-pulse" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">
          {isPlaying ? "Jeeves is speaking..." : `🎧 Hear what ${tabName} unlocks`}
        </p>
        <p className="text-[10px] text-muted-foreground">First-visit intro • ~60 sec</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0"
        onClick={handleDismiss}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
