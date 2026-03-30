import { useState, useEffect } from "react";
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
import { Loader2, Download, Music, ListPlus, Plus, X, GripVertical, MessageSquare, Copy, Check, Share2 } from "lucide-react";
import { useAudioMixer } from "@/hooks/useAudioMixer";
import { AMBIENT_TRACKS, downloadAudioFile } from "@/components/bible/ExportBibleAudioDialog";
import { useEpicPlaylists } from "@/hooks/useEpicPlaylists";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShareToCommunity, type SharedContent } from "@/components/community/ShareToCommunity";
import { useAuth } from "@/hooks/useAuth";

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
  /** The active commentary mode name (e.g. "Epic", "Modern", "Counselor") */
  modeName?: string;
}

export const ExportEpicAudioDialog = ({
  open,
  onOpenChange,
  epicAudioUrl,
  book,
  chapter,
  queue = [],
  modeName = "Epic",
}: ExportEpicAudioDialogProps) => {
  // ── Chapter selection ───────────────────────────────────────────────────
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

  const [exportedBlob, setExportedBlob] = useState<Blob | null>(null);
  const [exportedFilename, setExportedFilename] = useState("");
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [textCopied, setTextCopied] = useState(false);
  const [communityShareContent, setCommunityShareContent] = useState<SharedContent | null>(null);
  const [uploadingToCommunity, setUploadingToCommunity] = useState(false);
  const { user } = useAuth();

  // Reset to the current chapter whenever the dialog opens or the primary chapter changes
  useEffect(() => {
    if (open) {
      setSelectedChapters([{ book, chapter, audioUrl: epicAudioUrl }]);
      setExportedBlob(null);
      setExportedFilename("");
      setShowSharePanel(false);
    }
  }, [open, book, chapter, epicAudioUrl]);

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
    // If we already have a full URL, use it directly
    if (ch.audioUrl && ch.audioUrl.startsWith("http")) return ch.audioUrl;

    // Look up cached storage path from epic_commentaries (get latest version)
    const { data: rows } = await supabase
      .from("epic_commentaries" as any)
      .select("audio_storage_path")
      .eq("book", ch.book)
      .eq("chapter", ch.chapter)
      .eq("status", "ready")
      .order("version", { ascending: false })
      .limit(1) as unknown as { data: { audio_storage_path: string }[] | null };

    const data = rows?.[0] ?? null;

    if (data?.audio_storage_path) {
      const { data: signedData } = await supabase.storage
        .from("epic-audio")
        .createSignedUrl(data.audio_storage_path, 3600);
      if (signedData?.signedUrl) return signedData.signedUrl;
    }

    // Fallback: check chapter_commentary_cache table
    const { data: cached } = await supabase
      .from("chapter_commentary_cache")
      .select("audio_storage_path")
      .eq("book", ch.book)
      .eq("chapter", ch.chapter)
      .maybeSingle();

    if (cached?.audio_storage_path) {
      const { data: signedData } = await supabase.storage
        .from("epic-audio")
        .createSignedUrl(cached.audio_storage_path, 3600);
      if (signedData?.signedUrl) return signedData.signedUrl;
    }

    return "";
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
        toast.error(`No ${modeName} audio available for ${ch.book} ${ch.chapter}`);
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

    const filename = `${modeName}-${chapterLabel}.wav`;

    const blob = await mixAndDownload(resolvedUrls, activeMusicUrls, musicVolume / 100, filename);

    if (!blob) {
      toast.error(error || "Failed to process audio");
      return;
    }

    const downloaded = await downloadAudioFile(blob, filename);

    if (downloaded) {
      toast.success(`Downloaded ${modeName} audio (${selectedChapters.length} chapter${selectedChapters.length > 1 ? "s" : ""})!`);
      setExportedBlob(blob);
      setExportedFilename(filename);
      setShowSharePanel(true);
    } else {
      toast.error("Download failed. Please try again.");
    }
  };

  // ── Text share helpers ───────────────────────────────────────────────────
  const buildShareMessage = () => {
    const appUrl = window.location.origin;
    const chapterList = selectedChapters.map((c) => `${c.book} ${c.chapter}`).join(", ");
    return `🎙️ ${modeName} Bible Commentary — ${chapterList}\n\nI just exported a cinematic audio Bible study using the Phototheology Palace method!\n\n✨ Try it yourself: ${appUrl}/audio-bible\n\n🏰 Phototheology — Turn your mind into a Bible palace!`;
  };

  const handleCopyShareMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildShareMessage());
      setTextCopied(true);
      toast.success("Message copied! Ready to share.");
      setTimeout(() => setTextCopied(false), 2000);
    } catch {
      toast.error("Failed to copy message");
    }
  };

  const handleSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(buildShareMessage())}`, "_blank");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(buildShareMessage())}`, "_blank");
  };

  // ── Share to community ──────────────────────────────────────────────
  const handleShareToCommunity = async () => {
    if (!exportedBlob || !user) return;
    setUploadingToCommunity(true);
    try {
      const timestamp = Date.now();
      const path = `${user.id}/${timestamp}-${exportedFilename}`;
      const { error: uploadError } = await supabase.storage
        .from("community-audio")
        .upload(path, exportedBlob, { contentType: "audio/wav" });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("community-audio")
        .getPublicUrl(path);

      const chapterList = selectedChapters.map((c) => `${c.book} ${c.chapter}`).join(", ");
      setCommunityShareContent({
        type: "audio_commentary",
        id: `${timestamp}`,
        title: `${modeName} Commentary — ${chapterList}`,
        preview: `${modeName} audio commentary covering ${chapterList}`,
        metadata: {
          audioUrl: urlData.publicUrl,
          chapters: selectedChapters.map((c) => ({ book: c.book, chapter: c.chapter })),
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload audio");
    } finally {
      setUploadingToCommunity(false);
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
            Export {modeName} Audio
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

        {/* ── Share via Text (shown after export) ───────────────────────── */}
        {showSharePanel && (
          <div className="rounded-lg border border-accent/40 bg-accent/10 p-4 space-y-3">
            <p className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Share with Friends
            </p>
            <div className="bg-background rounded border p-3 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {buildShareMessage()}
            </div>
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleCopyShareMessage}
              >
                {textCopied ? (
                  <><Check className="h-4 w-4 text-green-600" /><span>Copied!</span></>
                ) : (
                  <><Copy className="h-4 w-4" /><span>Copy Message</span></>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={handleSMS}
              >
                <MessageSquare className="h-4 w-4" />
                Send via SMS
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                style={{ color: "#25D366" }}
                onClick={handleWhatsApp}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send via WhatsApp
              </Button>
              {user && !communityShareContent && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
                  onClick={handleShareToCommunity}
                  disabled={uploadingToCommunity}
                >
                  {uploadingToCommunity ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /><span>Uploading…</span></>
                  ) : (
                    <><Share2 className="h-4 w-4" /><span>Share to Community</span></>
                  )}
                </Button>
              )}
              {communityShareContent && user && (
                <ShareToCommunity
                  content={communityShareContent}
                  userId={user.id}
                  trigger={
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start gap-2 border-green-500/30 text-green-600 hover:bg-green-500/10"
                    >
                      <Share2 className="h-4 w-4" />
                      Post to Community Feed
                    </Button>
                  }
                />
              )}
            </div>
          </div>
        )}

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
                {showSharePanel ? "Re-download" : `Download${selectedChapters.length > 1 ? ` (${selectedChapters.length} chapters)` : ""}`}
              </>
            )}
          </Button>
          {showSharePanel && (
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Done
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
