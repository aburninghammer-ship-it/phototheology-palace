import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Music, Volume2, BookOpen, Share2 } from "lucide-react";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Verse } from "@/types/bible";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";

// Mobile-friendly download function
export const downloadAudioFile = async (blob: Blob, filename: string): Promise<boolean> => {
  // Try native share API first (mobile), but don't let failures block download
  try {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], filename, { type: 'audio/wav' });
      const shareData = { files: [file], title: filename };
      
      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    }
  } catch (shareError) {
    // Share cancelled or failed — fall through to standard download
    console.log("Share API unavailable or cancelled, using standard download", shareError);
  }

  try {
    const url = URL.createObjectURL(blob);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      window.open(url, '_blank');
      toast.info("Tap and hold the audio to save it to your device", { duration: 5000 });
      return true;
    }
    
    // Standard download for desktop and Android
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
    
    return true;
  } catch (error) {
    console.error("Download error:", error);
    return false;
  }
};

// System ambient tracks
export const AMBIENT_TRACKS = [
  { id: "none", name: "No Music", url: "" },
  { id: "flight", name: "Flight", url: "/audio/flight.mp3" },
  { id: "wings-of-stillness", name: "Wings of Stillness", url: "/audio/wings-of-stillness.mp3" },
  { id: "dreams-of-joseph", name: "Dreams of Joseph", url: "/audio/dreams-of-joseph.mp3" },
  { id: "the-ride", name: "The Ride", url: "/audio/the-ride.mp3" },
  { id: "fly", name: "Fly", url: "/audio/fly.mp3" },
  { id: "follow", name: "Follow", url: "/audio/follow.mp3" },
  { id: "amazing-grace-epic", name: "Amazing Grace (Epic)", url: "/audio/amazing-grace-epic.mp3" },
  { id: "when-he-cometh", name: "When He Cometh", url: "/audio/when-he-cometh.mp3" },
  { id: "white-horse", name: "White Horse", url: "/audio/white-horse.mp3" },
  { id: "eternal-echoes", name: "Eternal Echoes", url: "/audio/eternal-echoes.mp3" },
  { id: "passover1", name: "Passover", url: "/music/Passover1.mp3" },
  { id: "warrior", name: "Warrior", url: "/music/Warrior.mp3" },
];

interface ExportBibleAudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: string;
  chapter: number;
  verses: Verse[];
}

export const ExportBibleAudioDialog = ({
  open,
  onOpenChange,
  book,
  chapter,
  verses,
}: ExportBibleAudioDialogProps) => {
  const [selectedVoice, setSelectedVoice] = useState<VoiceId>("onyx");
  const [selectedTrack, setSelectedTrack] = useState("none");
  const [musicVolume, setMusicVolume] = useState(15);
  const [includeCommentary, setIncludeCommentary] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");

  const { mixAndDownload, isProcessing, progress } = useAudioMixer();

  const generateTTS = useCallback(async (text: string, voice: VoiceId): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice },
      });

      if (error) throw error;
      return data?.audioContent || null;
    } catch (e) {
      console.error("TTS generation error:", e);
      return null;
    }
  }, []);

  const handleExport = async () => {
    if (verses.length === 0) {
      toast.error("No verses to export");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus("Generating audio for verses...");

    try {
      const audioSegments: { audioContent: string }[] = [];

      // Generate TTS for each verse
      for (let i = 0; i < verses.length; i++) {
        setGenerationProgress((i / verses.length) * 70);
        setGenerationStatus(`Generating verse ${i + 1} of ${verses.length}...`);

        const verseText = `Verse ${verses[i].verse}. ${verses[i].text}`;
        const audioContent = await generateTTS(verseText, selectedVoice);

        if (audioContent) {
          audioSegments.push({ audioContent });
        } else {
          console.warn(`Failed to generate audio for verse ${verses[i].verse}`);
        }
      }

      if (audioSegments.length === 0) {
        throw new Error("Failed to generate any audio");
      }

      setGenerationProgress(75);
      setGenerationStatus("Mixing audio with background music...");

      // Get selected music URL
      const musicUrl = AMBIENT_TRACKS.find(t => t.id === selectedTrack)?.url || "";

      // Mix audio - convert base64 to data URL for the mixer
      const firstSegment = audioSegments[0]?.audioContent || "";
      const speechUrl = `data:audio/mp3;base64,${firstSegment}`;
      const mixedBlob = await mixAndDownload(
        speechUrl,
        musicUrl,
        musicVolume / 100,
        `${book}_chapter_${chapter}.wav`
      );

      if (!mixedBlob) {
        throw new Error("Failed to mix audio");
      }

      setGenerationProgress(100);
      setGenerationStatus("Download ready!");

      // Create filename
      const filename = `${book}-${chapter}.wav`;

      // Try mobile-friendly download methods
      const downloaded = await downloadAudioFile(mixedBlob, filename);
      
      if (downloaded) {
        toast.success(`Downloaded ${book} ${chapter} audio!`);
        onOpenChange(false);
      } else {
        toast.error("Download failed. Please try again.");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to export audio");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setGenerationStatus("");
    }
  };

  const handleShare = async () => {
    if (!navigator.share) {
      toast.error("Sharing not supported on this device");
      return;
    }

    // For now, just share the chapter reference
    try {
      await navigator.share({
        title: `${book} ${chapter}`,
        text: `Listen to ${book} chapter ${chapter} with Phototheology`,
        url: window.location.href,
      });
    } catch (e) {
      // User cancelled sharing
    }
  };

  const totalProgress = isGenerating ? generationProgress : (isProcessing ? 70 + progress * 0.3 : 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export {book} {chapter}
          </DialogTitle>
          <DialogDescription>
            Download this chapter as an audio file with optional background music
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Voice Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Narrator Voice
            </Label>
            <Select value={selectedVoice} onValueChange={(v) => setSelectedVoice(v as VoiceId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OPENAI_VOICES.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {OPENAI_VOICES.find(v => v.id === selectedVoice)?.description}
            </p>
          </div>

          {/* Background Music */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Background Music
            </Label>
            <Select value={selectedTrack} onValueChange={setSelectedTrack}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AMBIENT_TRACKS.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Music Volume */}
          {selectedTrack !== "none" && (
            <div className="space-y-2">
              <Label>Music Volume: {musicVolume}%</Label>
              <Slider
                value={[musicVolume]}
                onValueChange={(v) => setMusicVolume(v[0])}
                min={5}
                max={50}
                step={5}
              />
            </div>
          )}

          {/* Include Commentary (future feature) */}
          <div className="flex items-center justify-between">
            <Label htmlFor="commentary" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Include Commentary
            </Label>
            <Switch
              id="commentary"
              checked={includeCommentary}
              onCheckedChange={setIncludeCommentary}
              disabled // Future feature
            />
          </div>
          {includeCommentary && (
            <p className="text-xs text-muted-foreground">
              Commentary will be generated and included after the Bible reading
            </p>
          )}

          {/* Progress */}
          {(isGenerating || isProcessing) && (
            <div className="space-y-2">
              <Progress value={totalProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {generationStatus || "Processing..."}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 rounded-lg bg-accent/30 border border-accent/20">
            <p className="text-xs text-muted-foreground">
              <strong>{verses.length}</strong> verses will be exported as a high-quality WAV file.
              This may take a few minutes depending on chapter length.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            disabled={isGenerating || isProcessing}
            className="flex-1"
          >
            {isGenerating || isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Audio
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
