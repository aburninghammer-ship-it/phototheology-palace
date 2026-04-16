import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Headphones, Play, RotateCcw, Volume2, Sparkles } from "lucide-react";

const COMMENTARY_MODES = [
  { value: "epic", label: "Epic Narrator", description: "Cinematic, dramatic storytelling", icon: "🎬" },
  { value: "counselor", label: "Counselor", description: "Warm, empathetic, personal growth", icon: "💛" },
  { value: "urban", label: "Modern Preacher", description: "Bold, expressive, street-level truth", icon: "🔥" },
  { value: "ancient", label: "Ancient Scholar", description: "Measured, authoritative, timeless", icon: "📜" },
  { value: "preacher", label: "Preacher", description: "Clear, natural, pulpit energy", icon: "🎤" },
  { value: "scholar", label: "Scholar", description: "Calm, analytical, academic depth", icon: "🔬" },
  { value: "kids", label: "Kids", description: "Wonder-filled, ages 8-12", icon: "✨" },
];

// A small set of compelling starter chapters for new users
const SUGGESTED_CHAPTERS = [
  { book: "Genesis", chapter: 1, label: "Genesis 1 — Creation" },
  { book: "Exodus", chapter: 14, label: "Exodus 14 — Red Sea Crossing" },
  { book: "Psalms", chapter: 23, label: "Psalm 23 — The Shepherd" },
  { book: "Isaiah", chapter: 53, label: "Isaiah 53 — The Suffering Servant" },
  { book: "Daniel", chapter: 7, label: "Daniel 7 — Beasts & Thrones" },
  { book: "Matthew", chapter: 5, label: "Matthew 5 — Sermon on the Mount" },
  { book: "John", chapter: 3, label: "John 3 — Born Again" },
  { book: "Romans", chapter: 8, label: "Romans 8 — No Condemnation" },
  { book: "Revelation", chapter: 12, label: "Revelation 12 — The Woman & Dragon" },
];

interface LockInCommentaryPickerProps {
  passId: string;
  selectedBook?: string | null;
  selectedChapter?: number | null;
  selectedMode?: string | null;
  onSelectionSaved?: () => void;
}

export function LockInCommentaryPicker({
  passId,
  selectedBook,
  selectedChapter,
  selectedMode,
  onSelectionSaved,
}: LockInCommentaryPickerProps) {
  const [book, setBook] = useState(selectedBook || "");
  const [chapter, setChapter] = useState(selectedChapter?.toString() || "");
  const [mode, setMode] = useState(selectedMode || "");
  const [saving, setSaving] = useState(false);
  const hasExistingSelection = !!selectedBook && !!selectedChapter && !!selectedMode;

  const handleSave = async () => {
    if (!book || !chapter || !mode) {
      toast.error("Please select a chapter and commentary voice");
      return;
    }

    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from("lock_in_passes")
        .update({
          commentary_book: book,
          commentary_chapter: parseInt(chapter),
          commentary_mode: mode,
        })
        .eq("id", passId);

      if (error) throw error;
      toast.success("Commentary selection saved! 🎧 You can replay this all 5 days.");
      onSelectionSaved?.();
    } catch (err: any) {
      toast.error(err.message || "Failed to save selection");
    } finally {
      setSaving(false);
    }
  };

  const handleListen = () => {
    const targetBook = selectedBook || book;
    const targetChapter = selectedChapter || parseInt(chapter);
    const targetMode = selectedMode || mode;

    if (!targetBook || !targetChapter || !targetMode) return;

    // Navigate to COTA series with pre-selected chapter and mode
    window.location.href = `/cota-series?book=${encodeURIComponent(targetBook)}&chapter=${targetChapter}&mode=${targetMode}&lockin=true`;
  };

  if (hasExistingSelection) {
    const modeInfo = COMMENTARY_MODES.find(m => m.value === selectedMode);
    return (
      <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Headphones className="h-5 w-5 text-purple-500" />
            Your Commentary Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-purple-600 border-purple-500/30">
              {selectedBook} {selectedChapter}
            </Badge>
            <Badge variant="outline" className="text-purple-600 border-purple-500/30">
              {modeInfo?.icon} {modeInfo?.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            You can replay this commentary anytime during your 5-day pass.
          </p>
          <Button
            onClick={handleListen}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Listen Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-indigo-500/5">
      <CardHeader className="pb-2">
        <div className="mx-auto mb-2 p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 w-fit">
          <Headphones className="h-6 w-6 text-purple-500" />
        </div>
        <CardTitle className="text-lg text-center">Choose Your Commentary Experience</CardTitle>
        <p className="text-xs text-center text-muted-foreground mt-1">
          Pick ONE chapter and ONE voice. You can replay it all 5 days of your Lock-In Pass.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chapter Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Chapter</label>
          <Select value={`${book}|${chapter}`} onValueChange={(v) => {
            const [b, c] = v.split("|");
            setBook(b);
            setChapter(c);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a chapter..." />
            </SelectTrigger>
            <SelectContent>
              {SUGGESTED_CHAPTERS.map((ch) => (
                <SelectItem key={`${ch.book}|${ch.chapter}`} value={`${ch.book}|${ch.chapter}`}>
                  {ch.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Commentary Voice</label>
          <div className="grid grid-cols-2 gap-2">
            {COMMENTARY_MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`p-2.5 rounded-lg border text-left transition-all text-xs ${
                  mode === m.value
                    ? "border-purple-500 bg-purple-500/10 shadow-sm"
                    : "border-border hover:border-purple-500/40 hover:bg-purple-500/5"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span>{m.icon}</span>
                  <span className="font-medium">{m.label}</span>
                </div>
                <p className="text-muted-foreground text-[10px]">{m.description}</p>
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!book || !chapter || !mode || saving}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
        >
          {saving ? "Saving..." : (
            <>
              <Volume2 className="h-4 w-4 mr-2" />
              Lock In My Commentary
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
