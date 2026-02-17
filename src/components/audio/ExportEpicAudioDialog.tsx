import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Music } from "lucide-react";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { AMBIENT_TRACKS, downloadAudioFile } from "@/components/bible/ExportBibleAudioDialog";
import { toast } from "sonner";

interface ExportEpicAudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  epicAudioUrl: string;
  book: string;
  chapter: number;
}

export const ExportEpicAudioDialog = ({
  open,
  onOpenChange,
  epicAudioUrl,
  book,
  chapter,
}: ExportEpicAudioDialogProps) => {
  const [selectedTrack, setSelectedTrack] = useState("none");
  const [musicVolume, setMusicVolume] = useState(15);

  const { mixAndDownload, isProcessing, progress, error } = useAudioMixer();

  const handleExport = async () => {
    if (!epicAudioUrl) {
      toast.error("No Epic audio available to export");
      return;
    }

    const musicUrl = AMBIENT_TRACKS.find((t) => t.id === selectedTrack)?.url || "";
    const filename = `Epic-${book}-${chapter}.wav`;

    const blob = await mixAndDownload(
      epicAudioUrl,
      musicUrl,
      musicVolume / 100,
      filename
    );

    if (!blob) {
      toast.error(error || "Failed to process audio");
      return;
    }

    const downloaded = await downloadAudioFile(blob, filename);

    if (downloaded) {
      toast.success(`Downloaded Epic ${book} ${chapter} audio!`);
      onOpenChange(false);
    } else {
      toast.error("Download failed. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Epic {book} {chapter}
          </DialogTitle>
          <DialogDescription>
            Download this Epic commentary as an audio file with optional background music
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
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

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {progress < 30
                  ? "Fetching audio..."
                  : progress < 50
                  ? "Decoding audio..."
                  : progress < 80
                  ? "Mixing audio..."
                  : progress < 100
                  ? "Encoding WAV..."
                  : "Done!"}
              </p>
            </div>
          )}

          {/* Info */}
          <div className="p-3 rounded-lg bg-accent/30 border border-accent/20">
            <p className="text-xs text-muted-foreground">
              Epic commentary will be exported as a high-quality WAV file.
              {selectedTrack !== "none" && " Background music will be mixed in and looped to match the commentary length."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleExport}
            disabled={isProcessing || !epicAudioUrl}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Audio
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
