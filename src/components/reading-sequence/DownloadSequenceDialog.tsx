import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Download, Music, Volume2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserMusic } from "@/hooks/useUserMusic";
import { useAuth } from "@/hooks/useAuth";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { toast } from "sonner";

// System ambient tracks
const SYSTEM_TRACKS = [
  { name: "Peaceful Piano", url: "https://cdn.pixabay.com/audio/2024/11/10/audio_1d9d9c7b91.mp3" },
  { name: "Ambient Meditation", url: "https://cdn.pixabay.com/audio/2022/10/25/audio_384d4e3c50.mp3" },
  { name: "Soft Strings", url: "https://cdn.pixabay.com/audio/2024/02/14/audio_03d98fca20.mp3" },
];

interface DownloadSequenceDialogProps {
  sequences: ReadingSequenceBlock[];
  trigger?: React.ReactNode;
}

export function DownloadSequenceDialog({ sequences, trigger }: DownloadSequenceDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<string | null>(SYSTEM_TRACKS[0].url);
  const [musicVolume, setMusicVolume] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [audioSegments, setAudioSegments] = useState<{ audioUrl?: string; audioContent?: string }[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [generatedBlob, setGeneratedBlob] = useState<Blob | null>(null);

  const { user } = useAuth();
  const { userTracks } = useUserMusic();
  const { mixAndDownload, isProcessing, progress, error } = useAudioMixer();

  const activeSequences = sequences.filter((s) => s.enabled && s.items.length > 0);
  const allItems = activeSequences.flatMap((seq) =>
    seq.items.map((item) => ({ ...item, voice: seq.voice }))
  );

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setIsGenerating(false);
      setGenerationStep("");
      setAudioSegments([]);
      setGenerationProgress(0);
      setIsDone(false);
      setGeneratedBlob(null);
    }
  }, [open]);

  // Fetch chapter verses
  const fetchChapterVerses = async (book: string, chapter: number): Promise<{ verse: number; text: string }[]> => {
    try {
      const { data, error } = await supabase
        .from("bible_verses_tokenized")
        .select("verse_num, text_kjv")
        .eq("book", book)
        .eq("chapter", chapter)
        .order("verse_num");

      if (error || !data || data.length === 0) {
        // Fallback to API
        const response = await fetch(
          `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=kjv`
        );
        if (!response.ok) throw new Error("Failed to fetch verses");
        const apiData = await response.json();
        return apiData.verses?.map((v: any) => ({ verse: v.verse, text: v.text })) || [];
      }
      return data.map((v) => ({ verse: v.verse_num, text: v.text_kjv }));
    } catch (err) {
      console.error("Error fetching verses:", err);
      return [];
    }
  };

  // Generate TTS for a verse
  const generateVerseTTS = async (
    text: string,
    voice: string,
    book: string,
    chapter: number,
    verse: number
  ): Promise<{ audioUrl?: string; audioContent?: string } | null> => {
    try {
      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice, book, chapter, verse, useCache: true },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("TTS error:", err);
      return null;
    }
  };

  const handleGenerate = async () => {
    if (!selectedMusic) {
      toast.error("Please select background music");
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setAudioSegments([]);
    setIsDone(false);
    setGeneratedBlob(null);

    try {
      const segments: { audioUrl?: string; audioContent?: string }[] = [];
      let totalVerses = 0;
      let processedVerses = 0;

      // Count total verses
      setGenerationStep("Counting verses...");
      for (const item of allItems) {
        const verses = await fetchChapterVerses(item.book, item.chapter);
        const startVerse = item.startVerse || 1;
        const endVerse = item.endVerse || verses.length;
        totalVerses += endVerse - startVerse + 1;
      }

      setGenerationStep(`Generating audio for ${totalVerses} verses...`);

      // Generate TTS for each verse
      for (const item of allItems) {
        const verses = await fetchChapterVerses(item.book, item.chapter);
        const startVerse = item.startVerse || 1;
        const endVerse = item.endVerse || verses.length;

        const filteredVerses = verses.filter(
          (v) => v.verse >= startVerse && v.verse <= endVerse
        );

        for (const verse of filteredVerses) {
          setGenerationStep(`${item.book} ${item.chapter}:${verse.verse}`);
          
          const audio = await generateVerseTTS(
            verse.text,
            item.voice || "daniel",
            item.book,
            item.chapter,
            verse.verse
          );

          if (audio) {
            segments.push(audio);
          }

          processedVerses++;
          setGenerationProgress(Math.round((processedVerses / totalVerses) * 60));
        }
      }

      setAudioSegments(segments);
      setGenerationStep("Mixing audio with music...");
      setGenerationProgress(65);

      // Mix audio
      const blob = await mixAndDownload({
        musicUrl: selectedMusic,
        musicVolume: musicVolume / 100,
        segments,
        gapBetweenSegments: 0.8,
      });

      if (blob) {
        setGeneratedBlob(blob);
        setIsDone(true);
        setGenerationStep("Complete!");
        setGenerationProgress(100);
        toast.success("Audio generated successfully!");
      } else {
        throw new Error("Failed to mix audio");
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate audio");
      setGenerationStep("Error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedBlob) return;

    const sequenceName = activeSequences[0]?.items[0]?.book || "BibleReading";
    const fileName = `${sequenceName}_Reading_${new Date().toISOString().split("T")[0]}.wav`;

    const url = URL.createObjectURL(generatedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Download started!");
  };

  const totalChapters = allItems.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download Audio
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download Audio Reading
          </DialogTitle>
          <DialogDescription>
            Generate a combined audio file with Bible reading and background music.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Summary */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium">Your sequence includes:</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalChapters} chapter{totalChapters !== 1 ? "s" : ""} from{" "}
              {activeSequences.length} block{activeSequences.length !== 1 ? "s" : ""}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {allItems.slice(0, 5).map((item, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {item.book} {item.chapter}
                </Badge>
              ))}
              {allItems.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{allItems.length - 5} more
                </Badge>
              )}
            </div>
          </div>

          {/* Music Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Background Music
            </Label>
            <ScrollArea className="h-32 border rounded-md p-2">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground mb-2">System Tracks</p>
                {SYSTEM_TRACKS.map((track) => (
                  <Button
                    key={track.url}
                    variant={selectedMusic === track.url ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => setSelectedMusic(track.url)}
                  >
                    {track.name}
                  </Button>
                ))}
                
                {userTracks && userTracks.length > 0 && (
                  <>
                    <p className="text-xs font-medium text-muted-foreground mt-3 mb-2">Your Music</p>
                    {userTracks.map((track) => (
                      <Button
                        key={track.id}
                        variant={selectedMusic === track.file_url ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => setSelectedMusic(track.file_url)}
                      >
                        {track.name}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Volume */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Volume2 className="h-4 w-4" />
              Music Volume: {musicVolume}%
            </Label>
            <Slider
              value={[musicVolume]}
              max={50}
              step={5}
              onValueChange={(v) => setMusicVolume(v[0])}
            />
          </div>

          {/* Progress */}
          {(isGenerating || isProcessing || isDone) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {isDone ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : error ? (
                  <AlertCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span className="text-sm">{generationStep}</span>
              </div>
              <Progress value={isProcessing ? progress : generationProgress} />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isDone && generatedBlob ? (
            <Button onClick={handleDownload} className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download WAV
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || isProcessing || !selectedMusic}
              className="flex-1 gap-2"
            >
              {isGenerating || isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Music className="h-4 w-4" />
                  Generate Audio
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
