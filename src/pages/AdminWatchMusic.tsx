import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Music,
  Play,
  Pause,
  Trash2,
  Upload,
  Plus,
  Loader2,
  Volume2,
  GripVertical,
  Power,
  PowerOff,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface WatchTrack {
  id: string;
  name: string;
  file_url: string;
  storage_path: string | null;
  mood: string | null;
  sort_order: number;
  is_active: boolean;
  category: string;
  assigned_sessions: string[];
  created_at: string;
}

function PreviewPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) {
      const a = new Audio(src);
      a.volume = 0.35;
      a.onended = () => setPlaying(false);
      audioRef.current = a;
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={toggle}>
      {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  );
}

export default function AdminWatchMusic() {
  const navigate = useNavigate();
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  const [tracks, setTracks] = useState<WatchTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadMood, setUploadMood] = useState("");
  const [assignInput, setAssignInput] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchTracks = useCallback(async () => {
    const { data, error } = await supabase
      .from("watch_music_tracks")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) {
      console.error("[AdminWatchMusic] fetch error:", error);
      toast.error("Failed to load tracks");
    } else {
      setTracks((data as WatchTrack[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!adminLoading) fetchTracks();
  }, [adminLoading, fetchTracks]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const name = uploadName || file.name.replace(/\.[^/.]+$/, "");
      const ext = file.name.split(".").pop() || "mp3";
      const storagePath = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("watch-music")
        .upload(storagePath, file, { contentType: file.type || `audio/${ext}` });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("watch-music")
        .getPublicUrl(storagePath);

      // Insert into DB
      const maxOrder = tracks.length > 0 ? Math.max(...tracks.map((t) => t.sort_order)) + 1 : 0;
      const { error: insertError } = await supabase.from("watch_music_tracks").insert({
        name,
        file_url: urlData.publicUrl,
        storage_path: storagePath,
        mood: uploadMood || "meditative",
        sort_order: maxOrder,
        is_active: true,
        category: "watch",
      });

      if (insertError) throw insertError;

      toast.success(`"${name}" uploaded successfully`);
      setUploadName("");
      setUploadMood("");
      if (fileRef.current) fileRef.current.value = "";
      fetchTracks();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (track: WatchTrack) => {
    const { error } = await supabase
      .from("watch_music_tracks")
      .update({ is_active: !track.is_active })
      .eq("id", track.id);
    if (error) {
      toast.error("Failed to update track");
    } else {
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, is_active: !t.is_active } : t))
      );
    }
  };

  const handleDelete = async (track: WatchTrack) => {
    // Delete from storage if uploaded
    if (track.storage_path) {
      await supabase.storage.from("watch-music").remove([track.storage_path]);
    }
    const { error } = await supabase.from("watch_music_tracks").delete().eq("id", track.id);
    if (error) {
      toast.error("Failed to delete track");
    } else {
      setTracks((prev) => prev.filter((t) => t.id !== track.id));
      toast.success("Track deleted");
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const updated = [...tracks];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Update sort orders
    const promises = updated.map((t, i) =>
      supabase.from("watch_music_tracks").update({ sort_order: i }).eq("id", t.id)
    );
    await Promise.all(promises);
    setTracks(updated.map((t, i) => ({ ...t, sort_order: i })));
  };

  const handleMoveDown = async (index: number) => {
    if (index >= tracks.length - 1) return;
    const updated = [...tracks];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    const promises = updated.map((t, i) =>
      supabase.from("watch_music_tracks").update({ sort_order: i }).eq("id", t.id)
    );
    await Promise.all(promises);
    setTracks(updated.map((t, i) => ({ ...t, sort_order: i })));
  };

  const handleAssignSession = async (track: WatchTrack) => {
    const input = assignInput[track.id]?.trim();
    if (!input) return;
    const newSessions = [...(track.assigned_sessions || []), input];
    const { error } = await supabase
      .from("watch_music_tracks")
      .update({ assigned_sessions: newSessions })
      .eq("id", track.id);
    if (error) {
      toast.error("Failed to assign session");
    } else {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === track.id ? { ...t, assigned_sessions: newSessions } : t
        )
      );
      setAssignInput((prev) => ({ ...prev, [track.id]: "" }));
      toast.success(`Assigned "${input}" to ${track.name}`);
    }
  };

  const handleRemoveSession = async (track: WatchTrack, session: string) => {
    const newSessions = (track.assigned_sessions || []).filter((s) => s !== session);
    const { error } = await supabase
      .from("watch_music_tracks")
      .update({ assigned_sessions: newSessions })
      .eq("id", track.id);
    if (error) {
      toast.error("Failed to remove assignment");
    } else {
      setTracks((prev) =>
        prev.map((t) =>
          t.id === track.id ? { ...t, assigned_sessions: newSessions } : t
        )
      );
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Admin access required</p>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Music className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Watch Music Admin</h1>
        <Badge variant="outline" className="ml-auto text-xs">
          {tracks.filter((t) => t.is_active).length} active
        </Badge>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        <Card className="p-4 space-y-3 border-primary/20">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Upload className="h-4 w-4" /> Upload New Watch Track
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Track Name</Label>
              <Input
                placeholder="Still Waters III"
                value={uploadName}
                onChange={(e) => setUploadName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Mood</Label>
              <Input
                placeholder="meditative, peaceful…"
                value={uploadMood}
                onChange={(e) => setUploadMood(e.target.value)}
              />
            </div>
          </div>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Choose Audio File
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleUpload}
          />
        </Card>

        {/* Track List */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Volume2 className="h-4 w-4" /> Watch Meditation Tracks ({tracks.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Active tracks rotate randomly during Morning & Night Watch meditations. Use arrows to reorder. Assign specific session keys to map a track to a session.
          </p>

          {tracks.map((track, index) => (
            <Card
              key={track.id}
              className={`p-4 space-y-2 ${!track.is_active ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-3">
                {/* Reorder controls */}
                <div className="flex flex-col gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    <span className="text-xs">▲</span>
                  </Button>
                  <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => handleMoveDown(index)}
                    disabled={index >= tracks.length - 1}
                  >
                    <span className="text-xs">▼</span>
                  </Button>
                </div>

                {/* Preview */}
                <PreviewPlayer src={track.file_url} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {track.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {track.mood || "—"} • Order: {track.sort_order}
                    {track.storage_path ? " • Uploaded" : " • Preset"}
                  </p>
                </div>

                {/* Active toggle */}
                <div className="flex items-center gap-1.5">
                  {track.is_active ? (
                    <Power className="h-3.5 w-3.5 text-green-500" />
                  ) : (
                    <PowerOff className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <Switch
                    checked={track.is_active}
                    onCheckedChange={() => handleToggleActive(track)}
                  />
                </div>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{track.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove this track from Watch meditations.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(track)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Session assignments */}
              <div className="pl-10 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Sessions:</span>
                  {(track.assigned_sessions || []).length === 0 && (
                    <span className="text-xs text-muted-foreground italic">All (default rotation)</span>
                  )}
                  {(track.assigned_sessions || []).map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-destructive/20"
                      onClick={() => handleRemoveSession(track, s)}
                    >
                      {s} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. genesis-day-1, night-day-3"
                    className="h-7 text-xs max-w-xs"
                    value={assignInput[track.id] || ""}
                    onChange={(e) =>
                      setAssignInput((prev) => ({ ...prev, [track.id]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === "Enter" && handleAssignSession(track)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleAssignSession(track)}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {tracks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No watch music tracks found. Upload one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
