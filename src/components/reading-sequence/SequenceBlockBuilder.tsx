import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2, BookOpen, ChevronDown, ChevronUp, Mic, Volume2 } from "lucide-react";
import { BIBLE_BOOKS } from "@/types/bible";
import { ReadingSequenceBlock, SequenceItem } from "@/types/readingSequence";
import { ELEVENLABS_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SequenceBlockBuilderProps {
  block: ReadingSequenceBlock;
  onChange: (block: ReadingSequenceBlock) => void;
  onRemove?: () => void;
}

// Chapter counts per book
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

export const SequenceBlockBuilder = ({ block, onChange, onRemove }: SequenceBlockBuilderProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [newBook, setNewBook] = useState<string>("");
  const [newChapter, setNewChapter] = useState<number>(1);

  const addItem = () => {
    if (!newBook) return;
    const newItem: SequenceItem = {
      id: crypto.randomUUID(),
      book: newBook,
      chapter: newChapter,
      order: block.items.length,
    };
    onChange({
      ...block,
      items: [...block.items, newItem],
    });
    setNewChapter(1);
  };

  const removeItem = (id: string) => {
    onChange({
      ...block,
      items: block.items.filter(item => item.id !== id),
    });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= block.items.length) return;
    const newItems = [...block.items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    onChange({ ...block, items: newItems });
  };

  const updateItemVerses = (id: string, startVerse?: number, endVerse?: number) => {
    onChange({
      ...block,
      items: block.items.map(item =>
        item.id === id ? { ...item, startVerse, endVerse } : item
      ),
    });
  };

  return (
    <Card className={`glass-card border-2 transition-all backdrop-blur-xl ${block.enabled ? "border-primary/30 bg-card/50" : "border-muted/30 opacity-60 bg-muted/20"}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                checked={block.enabled}
                onCheckedChange={(checked) => onChange({ ...block, enabled: checked })}
              />
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Sequence {block.sequenceNumber}
                {block.items.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {block.items.length} chapter{block.items.length !== 1 ? "s" : ""}
                  </Badge>
                )}
              </CardTitle>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Chapter List */}
            {block.items.length > 0 && (
              <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                {block.items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 bg-background rounded-md border space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                      <span className="text-sm font-semibold flex-1">
                        {item.book} {item.chapter}
                        {(item.startVerse || item.endVerse) && (
                          <span className="text-primary ml-1">
                            :{item.startVerse || 1}-{item.endVerse || "end"}
                          </span>
                        )}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveItem(idx, "up")}
                          disabled={idx === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => moveItem(idx, "down")}
                          disabled={idx === block.items.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {/* Verse Range Selection */}
                    <div className="flex items-center gap-2 pl-6 pt-1 border-t border-dashed">
                      <span className="text-xs text-muted-foreground">Verses:</span>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          placeholder="Start (1)"
                          className="w-20 h-8 text-xs"
                          value={item.startVerse || ""}
                          onChange={(e) => updateItemVerses(item.id, e.target.value ? parseInt(e.target.value) : undefined, item.endVerse)}
                          min={1}
                        />
                        <span className="text-muted-foreground font-bold">→</span>
                        <Input
                          type="number"
                          placeholder="End (all)"
                          className="w-20 h-8 text-xs"
                          value={item.endVerse || ""}
                          onChange={(e) => updateItemVerses(item.id, item.startVerse, e.target.value ? parseInt(e.target.value) : undefined)}
                          min={item.startVerse || 1}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground italic">(leave blank for full chapter)</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Chapter */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Book</Label>
                <Select value={newBook} onValueChange={setNewBook}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {BIBLE_BOOKS.map((book) => (
                      <SelectItem key={book} value={book}>
                        {book}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label className="text-xs text-muted-foreground">Chapter</Label>
                <Select
                  value={String(newChapter)}
                  onValueChange={(v) => setNewChapter(parseInt(v))}
                  disabled={!newBook}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: CHAPTER_COUNTS[newBook] || 1 }, (_, i) => i + 1).map((ch) => (
                      <SelectItem key={ch} value={String(ch)}>
                        {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addItem} disabled={!newBook} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Voice & Speed Settings */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Mic className="h-3 w-3" /> Voice
                </Label>
                <Select
                  value={block.voice}
                  onValueChange={(v) => onChange({ ...block, voice: v as VoiceId })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[250px]">
                    {ELEVENLABS_VOICES.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        <span className="font-medium">{voice.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{voice.description}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground flex items-center gap-1">
                  <Volume2 className="h-3 w-3" /> Speed
                </Label>
                <Select
                  value={String(block.playbackSpeed)}
                  onValueChange={(v) => onChange({ ...block, playbackSpeed: parseFloat(v) })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.75">0.75x (Slow)</SelectItem>
                    <SelectItem value="1">1x (Normal)</SelectItem>
                    <SelectItem value="1.25">1.25x (Fast)</SelectItem>
                    <SelectItem value="1.5">1.5x (Faster)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Jeeves Commentary Toggle */}
            <div className="flex items-center justify-between pt-2">
              <Label className="text-sm flex items-center gap-2">
                🎩 Jeeves Commentary Mode
                <span className="text-xs text-muted-foreground">(insert commentary between chapters)</span>
              </Label>
              <Switch
                checked={block.includeJeevesCommentary}
                onCheckedChange={(checked) => onChange({ ...block, includeJeevesCommentary: checked })}
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
