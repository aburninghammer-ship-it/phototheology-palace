import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Shield, ListPlus, Check, Headphones } from "lucide-react";
import { usePlaylist } from "@/hooks/usePlaylist";
import { toast } from "sonner";
import { BIBLE_BOOKS } from "@/types/bible";

// ── Chapter counts per book ──────────────────────────────────────────────────
const CHAPTER_COUNTS: Record<string, number> = {
  Genesis: 50, Exodus: 40, Leviticus: 27, Numbers: 36, Deuteronomy: 34,
  Joshua: 24, Judges: 21, Ruth: 4, "1 Samuel": 31, "2 Samuel": 24,
  "1 Kings": 22, "2 Kings": 25, "1 Chronicles": 29, "2 Chronicles": 36,
  Ezra: 10, Nehemiah: 13, Esther: 10, Job: 42, Psalms: 150, Proverbs: 31,
  Ecclesiastes: 12, "Song of Solomon": 8, Isaiah: 66, Jeremiah: 52, Lamentations: 5,
  Ezekiel: 48, Daniel: 12, Hosea: 14, Joel: 3, Amos: 9,
  Obadiah: 1, Jonah: 4, Micah: 7, Nahum: 3, Habakkuk: 3,
  Zephaniah: 3, Haggai: 2, Zechariah: 14, Malachi: 4,
  Matthew: 28, Mark: 16, Luke: 24, John: 21, Acts: 28,
  Romans: 16, "1 Corinthians": 16, "2 Corinthians": 13, Galatians: 6, Ephesians: 6,
  Philippians: 4, Colossians: 4, "1 Thessalonians": 5, "2 Thessalonians": 3,
  "1 Timothy": 6, "2 Timothy": 4, Titus: 3, Philemon: 1,
  Hebrews: 13, James: 5, "1 Peter": 5, "2 Peter": 3,
  "1 John": 5, "2 John": 1, "3 John": 1, Jude: 1, Revelation: 22,
};

// ── Voice styles ─────────────────────────────────────────────────────────────
const VOICE_STYLES = [
  { id: "epic", label: "Epic Narrator", voice: "6v8IsT0UP1aaVwjGhVPn", description: "Cinematic, sweeping narration" },
  { id: "urban", label: "Modern Preacher", voice: "cgSgspJ2msm6clMCkdW9", description: "Raw, real-talk energy" },
  { id: "counselor", label: "Counselor", voice: "SAz9YHcvj6GT2YYXdXww", description: "Warm, empathetic guidance" },
  { id: "ancient", label: "Ancient Voice", voice: "onyx", description: "Authoritative, solemn tone" },
  { id: "preacher", label: "Preacher", voice: "shimmer", description: "Pulpit-ready conviction" },
  { id: "scholar", label: "Scholar", voice: "echo", description: "Analytical, scholarly depth" },
  { id: "kids", label: "🧒 Kids Adventure", voice: "pFZP5JQG7iQjIQuC4Bku", description: "Wonder-filled for ages 8–12" },
  { id: "mirror", label: "🪞 Mirror", voice: "SAz9YHcvj6GT2YYXdXww", description: "Personal application — the 'Me' dimension" },
  { id: "verse-by-verse", label: "Verse-by-Verse", voice: "nPczCjzI2devNBz1zQrb", description: "Detailed verse commentary" },
];

// ── AATS Avatars ─────────────────────────────────────────────────────────────
const AATS_AVATARS = [
  { id: "muslim", name: "Muslim", emoji: "☪️", totalDays: 56 },
  { id: "atheist", name: "Atheist", emoji: "🧪", totalDays: 56 },
  { id: "catholic", name: "Catholic", emoji: "⛪", totalDays: 56 },
  { id: "jw", name: "Jehovah's Witness", emoji: "📖", totalDays: 56 },
  { id: "mormon", name: "Mormon", emoji: "🏔️", totalDays: 56 },
  { id: "former-sda", name: "Former SDA", emoji: "🔍", totalDays: 56 },
  { id: "skeptical-exsda", name: "Skeptical Ex-SDA", emoji: "🔍", totalDays: 56 },
  { id: "progressive-christian", name: "Progressive Christian", emoji: "🌈", totalDays: 56 },
  { id: "pentecostal", name: "Pentecostal", emoji: "🔥", totalDays: 56 },
  { id: "evangelical", name: "Evangelical", emoji: "✝️", totalDays: 56 },
  { id: "scientist", name: "Scientist", emoji: "🔬", totalDays: 56 },
  { id: "agnostic", name: "Agnostic", emoji: "❓", totalDays: 56 },
  { id: "new-age", name: "New Ager", emoji: "🔮", totalDays: 56 },
  { id: "bhi", name: "Black Hebrew Israelite", emoji: "✊", totalDays: 56 },
  { id: "internet-skeptic", name: "Internet Skeptic", emoji: "💻", totalDays: 56 },
  { id: "philosopher", name: "Philosopher", emoji: "🏛️", totalDays: 56 },
  { id: "jewish", name: "Jewish Scholar", emoji: "✡️", totalDays: 56 },
  { id: "secular-scholar", name: "Secular Scholar", emoji: "🎓", totalDays: 56 },
  { id: "offshoot-sda", name: "Offshoot SDA", emoji: "🌿", totalDays: 56 },
  { id: "futurist", name: "Futurist", emoji: "🔮", totalDays: 56 },
  { id: "preterist", name: "Preterist", emoji: "📜", totalDays: 56 },
  { id: "anti-prophet", name: "Anti-Prophet Critic", emoji: "⚔️", totalDays: 56 },
];

export function AudioContentBuilder() {
  // ── Bible Commentary state ──
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");

  // ── AATS state ──
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedDay, setSelectedDay] = useState("");

  const { addItem, isFull, items } = usePlaylist();

  const chapterOptions = useMemo(() => {
    if (!selectedBook) return [];
    const count = CHAPTER_COUNTS[selectedBook] || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [selectedBook]);

  const selectedVoiceInfo = VOICE_STYLES.find(v => v.id === selectedVoice);
  const selectedAvatarInfo = AATS_AVATARS.find(a => a.id === selectedAvatar);

  // ── Build title for commentary ──
  const commentaryTitle = selectedBook && selectedChapter && selectedVoiceInfo
    ? `${selectedBook} ${selectedChapter} — ${selectedVoiceInfo.label} Commentary`
    : "";

  const commentaryInPlaylist = commentaryTitle && items.some(i => i.title === commentaryTitle);

  // ── Build title for AATS ──
  const aatsTitle = selectedAvatarInfo && selectedDay
    ? `Day ${selectedDay} — ${selectedAvatarInfo.name} AATS Training`
    : "";

  const aatsInPlaylist = aatsTitle && items.some(i => i.title === aatsTitle);

  const handleAddCommentary = async () => {
    if (!selectedBook || !selectedChapter || !selectedVoice) {
      toast.error("Select a book, chapter, and voice style");
      return;
    }
    const voiceInfo = VOICE_STYLES.find(v => v.id === selectedVoice)!;
    const title = `${selectedBook} ${selectedChapter} — ${voiceInfo.label} Commentary`;

    await addItem({
      title,
      description: `${voiceInfo.description} commentary on ${selectedBook} chapter ${selectedChapter}`,
      audio_type: "commentary",
      audio_meta: {
        book: selectedBook,
        chapter: parseInt(selectedChapter),
        voiceStyle: selectedVoice,
        voice: voiceInfo.voice,
        generationType: selectedVoice === "verse-by-verse" ? "verse-commentary" : "chapter-commentary",
      },
    });
  };

  const handleAddAATS = async () => {
    if (!selectedAvatar || !selectedDay) {
      toast.error("Select an avatar and training day");
      return;
    }
    const avatar = AATS_AVATARS.find(a => a.id === selectedAvatar)!;
    const title = `Day ${selectedDay} — ${avatar.name} AATS Training`;

    await addItem({
      title,
      description: `${avatar.emoji} Apologetics training day ${selectedDay} against ${avatar.name} arguments`,
      audio_type: "training",
      audio_meta: {
        avatarId: selectedAvatar,
        avatarName: avatar.name,
        day: parseInt(selectedDay),
        generationType: "aats-training",
      },
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 mb-8">
      {/* ── Bible Commentary Builder ────────────────────────────────────── */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Bible Audio Commentary
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose any book, chapter, and voice style
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Book */}
          <Select value={selectedBook} onValueChange={(v) => { setSelectedBook(v); setSelectedChapter(""); }}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select Book..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto z-[200]">
              {BIBLE_BOOKS.map(book => (
                <SelectItem key={book} value={book}>{book}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Chapter */}
          <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={!selectedBook}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={selectedBook ? "Select Chapter..." : "Pick a book first"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto z-[200]" position="popper" sideOffset={4}>
              {chapterOptions.map(ch => (
                <SelectItem key={ch} value={String(ch)}>Chapter {ch}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Voice */}
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select Voice Style..." />
            </SelectTrigger>
            <SelectContent className="z-[200]" position="popper" sideOffset={4}>
              {VOICE_STYLES.map(v => (
                <SelectItem key={v.id} value={v.id}>
                  {v.label} — {v.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preview + Add */}
          {commentaryTitle && (
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] truncate max-w-[200px]">
                <Headphones className="h-3 w-3 mr-1" />
                {commentaryTitle}
              </Badge>
            </div>
          )}

          <Button
            className="w-full gap-2"
            size="sm"
            onClick={handleAddCommentary}
            disabled={!selectedBook || !selectedChapter || !selectedVoice || isFull || !!commentaryInPlaylist}
          >
            {commentaryInPlaylist ? (
              <>
                <Check className="h-4 w-4" /> In Playlist
              </>
            ) : (
              <>
                <ListPlus className="h-4 w-4" /> Add to Playlist
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* ── AATS Training Builder ───────────────────────────────────────── */}
      <Card className="border-2 border-destructive/20 bg-gradient-to-br from-destructive/5 to-transparent">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            AATS Apologetics Training
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Choose any avatar and training day
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Avatar */}
          <Select value={selectedAvatar} onValueChange={(v) => { setSelectedAvatar(v); setSelectedDay(""); }}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select Avatar..." />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto z-[200]" position="popper" sideOffset={4}>
              {AATS_AVATARS.map(a => (
                <SelectItem key={a.id} value={a.id}>
                  {a.emoji} {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Day */}
          <Select value={selectedDay} onValueChange={setSelectedDay} disabled={!selectedAvatar}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder={selectedAvatar ? "Select Day..." : "Pick an avatar first"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto z-[200]" position="popper" sideOffset={4}>
              {selectedAvatarInfo && Array.from({ length: selectedAvatarInfo.totalDays }, (_, i) => i + 1).map(day => (
                <SelectItem key={day} value={String(day)}>
                  Day {day}{day <= 8 ? " — Week 1" : day <= 16 ? " — Week 2" : day <= 24 ? " — Week 3" : day <= 32 ? " — Week 4" : day <= 40 ? " — Week 5" : day <= 48 ? " — Week 6" : day <= 56 ? " — Week 7-8" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Preview + Add */}
          {aatsTitle && (
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="text-[10px] truncate max-w-[200px]">
                <Shield className="h-3 w-3 mr-1" />
                {aatsTitle}
              </Badge>
            </div>
          )}

          <Button
            className="w-full gap-2"
            size="sm"
            variant="destructive"
            onClick={handleAddAATS}
            disabled={!selectedAvatar || !selectedDay || isFull || !!aatsInPlaylist}
          >
            {aatsInPlaylist ? (
              <>
                <Check className="h-4 w-4" /> In Playlist
              </>
            ) : (
              <>
                <ListPlus className="h-4 w-4" /> Add to Playlist
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
