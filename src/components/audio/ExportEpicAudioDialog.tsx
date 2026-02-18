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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Music, ListPlus, Plus, X, GripVertical } from "lucide-react";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { AMBIENT_TRACKS, downloadAudioFile } from "@/components/bible/ExportBibleAudioDialog";
import { useEpicPlaylists } from "@/hooks/useEpicPlaylists";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const MAX_CHAPTERS = 5;
const MUSIC_TRACKS = AMBIENT_TRACKS.filter((t) => t.id !== "none");

interface EpicChapter {
  book: string;
  chapter: number;
  audioUrl?: string;
}

interface ExportEpicAudioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The current (primary) epic audio URL */
  epicAudioUrl: string;
  /** Primary chapter info */
  book: string;
  chapter: number;
  /** Full queue of chapters currently loaded (optional) */
  queue?: EpicChapter[];
}

export const ExportEpicAudioDialog = ({
  open,
  onOpenChange,
  epicAudioUrl,
  book,
  chapter,
  queue = [],
}: ExportEpicAudioDialogProps) => {
  // ── Chapter selection ───────────────────────────────────────────────────
  // Pre-populate with the current chapter; user can add more from the queue
  const [selectedChapters, setSelectedChapters] = useState<EpicChapter[]>([
    { book, chapter, audioUrl: epicAudioUrl },
  ]);

  // ── Music playlist ──────────────────────────────────────────────────────
  const [musicPlaylist, setMusicPlaylist] = useState<string[]>(["none"]);
  const [musicVolume, setMusicVolume] = useState(15);

  // ── Playlist save ───────────────────────────────────────────────────────
  const [showNewPlaylist, setShowNewPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  const { mixAndDownload, isProcessing, progress, error } = useAudioMixer();
  const { playlists, createPlaylist, addToPlaylist } = useEpicPlaylists();

  // ── Helpers ─────────────────────────────────────────────────────────────
  const availableQueue = queue.filter(
    (q) => !selectedChapters.some((s) => s.book === q.book && s.chapter === q.chapter)
  );

  const addChapter = (q: EpicChapter) => {
    if (selectedChapters.length >= MAX_CHAPTERS) {
      toast.error(`You can export up to ${MAX_CHAPTERS} chapters at a time`);
      return;
    }
    setSelectedChapters((prev) => [...prev, q]);
  };

  const removeChapter = (idx: number) => {
    setSelectedChapters((prev) => prev.filter((_, i) => i !== idx));
  };

  const addMusicTrack = () => {
    setMusicPlaylist((prev) => [...prev, "none"]);
  };

  const removeMusicTrack = (idx: number) => {
    setMusicPlaylist((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateMusicTrack = (idx: number, trackId: string) => {
    setMusicPlaylist((prev) => prev.map((t, i) => (i === idx ? trackId : t)));
  };

  // ── Fetch audio URL for a chapter that doesn't have one yet ─────────────
  const resolveAudioUrl = async (ch: EpicChapter): Promise<string> => {
    if (ch.audioUrl) return ch.audioUrl;
    // Look up cached URL from database
    const { data } = await (supabase as any)
      .from("epic_commentaries")
      .select("audio_url")
      .eq("book", ch.book)
      .eq("chapter", ch.chapter)
      .eq("status", "ready")
      .maybeSingle();
    return data?.audio_url || "";
  };

  // ── Export ───────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (selectedChapters.length === 0) {
      toast.error("Select at least one chapter to export");
      return;
    }

    // Resolve all audio URLs
    toast.info("Preparing audio files…");
    const resolvedUrls: string[] = [];
    for (const ch of selectedChapters) {
      const url = await resolveAudioUrl(ch);
      if (!url) {
        toast.error(`No Epic audio available for ${ch.book} ${ch.chapter}`);
        return;
      }
      resolvedUrls.push(url);
    }

    const activeMusicUrls = musicPlaylist
      .filter((id) => id !== "none")
      .map((id) => AMBIENT_TRACKS.find((t) => t.id === id)?.url || "")
      .filter(Boolean);

    const chapterLabel =
      selectedChapters.length === 1
        ? `${selectedChapters[0].book}-${selectedChapters[0].chapter}`
        : `${selectedChapters[0].book}-${selectedChapters[0].chapter}_plus${selectedChapters.length - 1}more`;

    const filename = `Epic-${chapterLabel}.wav`;

    const blob = await mixAndDownload(resolvedUrls, activeMusicUrls, musicVolume / 100, filename);

    if (!blob) {
      toast.error(error || "Failed to process audio");
      return;
    }

    const downloaded = await downloadAudioFile(blob, filename);

    if (downloaded) {
      toast.success(`Downloaded Epic audio (${selectedChapters.length} chapter${selectedChapters.length > 1 ? "s" : ""})!`);
      onOpenChange(false);
    } else {
      toast.error("Download failed. Please try again.");
    }
  };

  // ── Save to playlist ─────────────────────────────────────────────────────
  const handleSaveToPlaylist = async () => {
    const firstTrack = musicPlaylist.find((id) => id !== "none") || "none";
    if (showNewPlaylist && newPlaylistName.trim()) {
      const playlist = await createPlaylist(newPlaylistName.trim(), undefined, firstTrack, musicVolume);
      if (playlist) {
        for (const ch of selectedChapters) {
          await addToPlaylist(playlist.id, ch.book, ch.chapter);
        }
        setNewPlaylistName("");
        setShowNewPlaylist(false);
      }
    } else if (selectedPlaylist) {
      for (const ch of selectedChapters) {
        await addToPlaylist(selectedPlaylist, ch.book, ch.chapter);
      }
    } else {
      toast.error("Select or create a playlist first");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Epic Audio
          </DialogTitle>
          <DialogDescription>
            Export up to {MAX_CHAPTERS} chapters with a custom background music playlist
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* ── Chapter selection ──────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              Chapters
              <Badge variant="secondary">{selectedChapters.length} / {MAX_CHAPTERS}</Badge>
            </Label>

            <div className="space-y-1.5">
              {selectedChapters.map((ch, idx) => (
                <div
                  key={`${ch.book}-${ch.chapter}`}
                  className="flex items-center gap-2 p-2 rounded-md bg-accent/20 border border-accent/30"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="flex-1 text-sm font-medium">
                    {ch.book} {ch.chapter}
                  </span>
                  {idx === 0 && (
                    <Badge variant="outline" className="text-xs shrink-0">Current</Badge>
                  )}
                  {idx > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => removeChapter(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {availableQueue.length > 0 && selectedChapters.length < MAX_CHAPTERS && (
              <Select
                value=""
                onValueChange={(val) => {
                  const [b, c] = val.split("|");
                  const found = availableQueue.find(
                    (q) => q.book === b && q.chapter === Number(c)
                  );
                  if (found) addChapter(found);
                }}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="+ Add chapter from queue…" />
                </SelectTrigger>
                <SelectContent>
                  {availableQueue.map((q) => (
                    <SelectItem key={`${q.book}-${q.chapter}`} value={`${q.book}|${q.chapter}`}>
                      {q.book} {q.chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* ── Music playlist ─────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Music className="h-4 w-4" />
              Music Playlist
              <span className="text-xs text-muted-foreground font-normal">(tracks chain to cover full length)</span>
            </Label>

            <div className="space-y-1.5">
              {musicPlaylist.map((trackId, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-5 text-right">{idx + 1}.</span>
                  <Select value={trackId} onValueChange={(val) => updateMusicTrack(idx, val)}>
                    <SelectTrigger className="flex-1 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Music</SelectItem>
                      {MUSIC_TRACKS.map((track) => (
                        <SelectItem key={track.id} value={track.id}>
                          {track.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {musicPlaylist.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeMusicTrack(idx)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={addMusicTrack}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Another Song
            </Button>
          </div>

          {/* ── Music Volume ───────────────────────────────────────────────── */}
          {musicPlaylist.some((id) => id !== "none") && (
            <div className="space-y-2">
              <Label className="text-sm">Music Volume: {musicVolume}%</Label>
              <Slider
                value={[musicVolume]}
                onValueChange={(v) => setMusicVolume(v[0])}
                min={5}
                max={50}
                step={5}
              />
            </div>
          )}

          {/* ── Save to Playlist ───────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <ListPlus className="h-4 w-4" />
              Save to Epic Playlist
            </Label>
            {!showNewPlaylist ? (
              <div className="flex gap-2">
                <Select value={selectedPlaylist} onValueChange={setSelectedPlaylist}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select playlist…" />
                  </SelectTrigger>
                  <SelectContent>
                    {playlists.map((pl) => (
                      <SelectItem key={pl.id} value={pl.id}>
                        {pl.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowNewPlaylist(true)}
                  title="Create new playlist"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="New playlist name…"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="flex-1"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveToPlaylist()}
                />
                <Button variant="outline" size="sm" onClick={() => setShowNewPlaylist(false)}>
                  Cancel
                </Button>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={handleSaveToPlaylist}
              disabled={!showNewPlaylist && !selectedPlaylist}
            >
              <ListPlus className="h-4 w-4 mr-2" />
              {showNewPlaylist ? "Create & Add" : "Add to Playlist"}
            </Button>
          </div>

          {/* ── Progress ───────────────────────────────────────────────────── */}
          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">
                {progress < 20
                  ? "Fetching audio files…"
                  : progress < 45
                  ? "Decoding audio…"
                  : progress < 65
                  ? "Loading music tracks…"
                  : progress < 80
                  ? "Mixing audio…"
                  : progress < 95
                  ? "Encoding WAV…"
                  : "Done!"}
              </p>
            </div>
          )}

          {/* ── Info ──────────────────────────────────────────────────────── */}
          <div className="p-3 rounded-lg bg-accent/30 border border-accent/20">
            <p className="text-xs text-muted-foreground">
              Chapters will be concatenated in order into a single high-quality WAV file.
              {musicPlaylist.some((id) => id !== "none") &&
                " Music tracks will chain sequentially to cover the full narration length."}
            </p>
          </div>
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleExport}
            disabled={isProcessing || selectedChapters.length === 0}
            className="flex-1"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing…
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download{selectedChapters.length > 1 ? ` (${selectedChapters.length} chapters)` : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
