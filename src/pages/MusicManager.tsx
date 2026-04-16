import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Music,
  Play,
  Pause,
  Trash2,
  Heart,
  Upload,
  Plus,
  Headphones,
  Moon,
  Sun,
  Loader2,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserMusic } from "@/hooks/useUserMusic";
import { useLocalMusic } from "@/hooks/useLocalMusic";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// ── All preset track lists ──────────────────────────────────────────────────

const WATCH_TRACKS = [
  { id: "still-water-mind", name: "Still Water Mind", file: "/audio/still-water-mind.mp3", usage: "Watch Meditation" },
  { id: "still-water-mind-2", name: "Still Water Mind II", file: "/audio/still-water-mind-2.mp3", usage: "Watch Meditation" },
  { id: "still-waters-quiet-soul", name: "Still Waters Quiet Soul", file: "/audio/still-waters-quiet-soul.mp3", usage: "Watch Meditation" },
  { id: "weightless-river", name: "Weightless River", file: "/audio/weightless-river.mp3", usage: "Watch Meditation" },
];

const STUDY_TRACKS = [
  { id: "flight", name: "Flight", file: "/audio/flight.mp3", mood: "uplifting, ambient" },
  { id: "wings-of-stillness", name: "Wings of Stillness", file: "/audio/wings-of-stillness.mp3", mood: "gentle, meditative" },
  { id: "dreams-of-joseph", name: "Dreams of Joseph", file: "/audio/dreams-of-joseph.mp3", mood: "orchestral, narrative" },
  { id: "the-ride", name: "The Ride", file: "/audio/the-ride.mp3", mood: "uplifting, journey" },
  { id: "fly", name: "Fly", file: "/audio/fly.mp3", mood: "soaring, ambient" },
  { id: "follow", name: "Follow", file: "/audio/follow.mp3", mood: "gentle, guiding" },
  { id: "amazing-grace-epic", name: "Amazing Grace (Epic Remix)", file: "/audio/amazing-grace-epic.mp3", mood: "epic, hymn" },
  { id: "when-he-cometh", name: "When He Cometh", file: "/audio/when-he-cometh.mp3", mood: "hopeful, hymn" },
  { id: "white-horse", name: "White Horse", file: "/audio/white-horse.mp3", mood: "triumphant, prophetic" },
  { id: "eternal-echoes", name: "Eternal Echoes", file: "/audio/eternal-echoes.mp3", mood: "contemplative, ambient" },
  { id: "moon-of-the-still-waters", name: "Moon Of The Still Waters", file: "/music/Moon_Of_The_Still_Waters.mp3", mood: "calm, serene" },
];

const EXTRA_TRACKS = [
  { id: "ambient-celestial-pad", name: "Celestial Pad", file: "/audio/ambient-celestial-pad.mp3", mood: "ambient" },
  { id: "ambient-deep-drone", name: "Deep Drone", file: "/audio/ambient-deep-drone.mp3", mood: "ambient" },
  { id: "ambient-gentle-rain", name: "Gentle Rain", file: "/audio/ambient-gentle-rain.mp3", mood: "ambient" },
  { id: "ambient-soft-wind", name: "Soft Wind", file: "/audio/ambient-soft-wind.mp3", mood: "ambient" },
  { id: "breath-of-your-presence", name: "Breath of Your Presence", file: "/audio/breath-of-your-presence.mp3", mood: "devotional" },
  { id: "breath-of-your-presence-2", name: "Breath of Your Presence II", file: "/audio/breath-of-your-presence-2.mp3", mood: "devotional" },
  { id: "moses-in-the-desert", name: "Moses in the Desert", file: "/audio/moses-in-the-desert.mp3", mood: "cinematic" },
  { id: "still-waters-gentle-word", name: "Still Waters Gentle Word", file: "/audio/still-waters-gentle-word.mp3", mood: "meditative" },
  { id: "still-waters-gentle-word-2", name: "Still Waters Gentle Word II", file: "/audio/still-waters-gentle-word-2.mp3", mood: "meditative" },
  { id: "still-waters-quiet-soul-2", name: "Still Waters Quiet Soul II", file: "/audio/still-waters-quiet-soul-2.mp3", mood: "meditative" },
  { id: "weightless-river-2", name: "Weightless River II", file: "/audio/weightless-river-2.mp3", mood: "meditative" },
];

// ── Inline player ───────────────────────────────────────────────────────────

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

// ── Preset Track Row ────────────────────────────────────────────────────────

function PresetRow({ name, file, sub }: { name: string; file: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "hsl(var(--muted) / 0.4)" }}>
      <PreviewPlayer src={file} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function MusicManager() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userTracks, isLoading: cloudLoading, uploading: cloudUploading, uploadMusic, deleteMusic, toggleFavorite } = useUserMusic();
  const { localTracks, isLoading: localLoading, uploading: localUploading, uploadLocalMusic, removeLocalTrack, toggleFavorite: toggleLocalFav } = useLocalMusic();

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadName, setUploadName] = useState("");
  const [uploadMood, setUploadMood] = useState("");
  const [uploadTarget, setUploadTarget] = useState<"cloud" | "local">("local");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = uploadName || file.name.replace(/\.[^/.]+$/, "");

    if (uploadTarget === "cloud" && user) {
      await uploadMusic(file, name, uploadMood || undefined);
    } else {
      await uploadLocalMusic(file, name, uploadMood || undefined);
    }
    setUploadName("");
    setUploadMood("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Music className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-bold text-foreground">Music Manager</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Upload Section */}
        <Card className="p-4 space-y-3 border-primary/20">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Upload className="h-4 w-4" /> Upload Your Own Music
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Track Name</Label>
              <Input placeholder="My track" value={uploadName} onChange={e => setUploadName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Mood (optional)</Label>
              <Input placeholder="peaceful, uplifting…" value={uploadMood} onChange={e => setUploadMood(e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {user && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={uploadTarget === "local"} onChange={() => setUploadTarget("local")} className="accent-primary" />
                  Device only
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input type="radio" checked={uploadTarget === "cloud"} onChange={() => setUploadTarget("cloud")} className="accent-primary" />
                  Cloud (synced)
                </label>
              </div>
            )}
            <Button size="sm" className="gap-2" onClick={() => fileRef.current?.click()} disabled={cloudUploading || localUploading}>
              {(cloudUploading || localUploading) ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Choose File
            </Button>
            <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </Card>

        {/* Tabs for categories */}
        <Tabs defaultValue="watch" className="w-full">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="watch" className="gap-1 text-xs"><Moon className="h-3.5 w-3.5" /> Watch</TabsTrigger>
            <TabsTrigger value="study" className="gap-1 text-xs"><Headphones className="h-3.5 w-3.5" /> Study</TabsTrigger>
            <TabsTrigger value="extra" className="gap-1 text-xs"><Music className="h-3.5 w-3.5" /> Extra</TabsTrigger>
            <TabsTrigger value="my" className="gap-1 text-xs"><Heart className="h-3.5 w-3.5" /> My Music</TabsTrigger>
          </TabsList>

          {/* Watch Meditation Tracks */}
          <TabsContent value="watch" className="space-y-2 mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              These 4 tracks rotate randomly during Morning & Night Watch meditations.
            </p>
            {WATCH_TRACKS.map(t => (
              <PresetRow key={t.id} name={t.name} file={t.file} sub={t.usage} />
            ))}
          </TabsContent>

          {/* Study / Ambient Tracks */}
          <TabsContent value="study" className="space-y-2 mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              These tracks power the Ambient Music Player during Bible study sessions.
            </p>
            {STUDY_TRACKS.map(t => (
              <PresetRow key={t.id} name={t.name} file={t.file} sub={t.mood} />
            ))}
          </TabsContent>

          {/* Extra / Unused Tracks */}
          <TabsContent value="extra" className="space-y-2 mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Additional ambient tracks available in the public audio folder.
            </p>
            {EXTRA_TRACKS.map(t => (
              <PresetRow key={t.id} name={t.name} file={t.file} sub={t.mood} />
            ))}
          </TabsContent>

          {/* User's Own Music */}
          <TabsContent value="my" className="space-y-2 mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Your uploaded tracks — stored on your device or synced to the cloud.
            </p>

            {(cloudLoading || localLoading) && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {!cloudLoading && !localLoading && localTracks.length === 0 && userTracks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No custom tracks yet. Use the upload section above to add your own music.
              </div>
            )}

            {/* Local tracks */}
            {localTracks.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "hsl(var(--muted) / 0.4)" }}>
                {t.blobUrl && <PreviewPlayer src={t.blobUrl} />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Device • {t.mood || "custom"}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleLocalFav(t.id)}>
                  <Heart className={`h-4 w-4 ${t.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeLocalTrack(t.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {/* Cloud tracks */}
            {userTracks.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: "hsl(var(--muted) / 0.4)" }}>
                <PreviewPlayer src={t.file_url} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">Cloud • {t.mood || t.category}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleFavorite(t)}>
                  <Heart className={`h-4 w-4 ${t.is_favorite ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteMusic(t)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
