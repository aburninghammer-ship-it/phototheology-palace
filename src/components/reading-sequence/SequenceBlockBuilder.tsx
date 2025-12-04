import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, Trash2, BookOpen, ChevronDown, ChevronUp, Mic, Volume2 } from "lucide-react";
import { BIBLE_BOOKS } from "@/types/bible";
import { ReadingSequenceBlock, SequenceItem, CommentaryDepth, CommentaryMode } from "@/types/readingSequence";
import { OPENAI_VOICES, VoiceId } from "@/hooks/useTextToSpeech";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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

type SelectionMode = "single" | "chapters" | "book" | "books";

export const SequenceBlockBuilder = ({ block, onChange, onRemove }: SequenceBlockBuilderProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("single");
  const [newBook, setNewBook] = useState<string>("");
  const [newChapter, setNewChapter] = useState<number>(1);
  const [endChapter, setEndChapter] = useState<number>(1);
  const [endBook, setEndBook] = useState<string>("");

  // Debug: Log when block changes
  console.log("SequenceBlockBuilder render, items:", block.items.length);

  const addSingleChapter = () => {
    console.log("addSingleChapter called:", { newBook, newChapter });
    if (!newBook) {
      console.log("No book selected");
      return;
    }
    const newItem: SequenceItem = {
      id: crypto.randomUUID(),
      book: newBook,
      chapter: newChapter,
      order: block.items.length,
    };
    console.log("Adding item:", newItem);
    onChange({
      ...block,
      items: [...block.items, newItem],
    });
    toast.success(`Added ${newBook} ${newChapter}`);
    // Keep book selected, just increment chapter for convenience
    const maxCh = CHAPTER_COUNTS[newBook] || 1;
    if (newChapter < maxCh) {
      setNewChapter(newChapter + 1);
    }
  };

  const addChapterRange = () => {
    console.log("addChapterRange called:", { newBook, newChapter, endChapter });
    if (!newBook) {
      console.log("No book selected");
      return;
    }
    if (endChapter < newChapter) {
      console.log("End chapter less than start");
      return;
    }
    const newItems: SequenceItem[] = [];
    for (let ch = newChapter; ch <= endChapter; ch++) {
      newItems.push({
        id: crypto.randomUUID(),
        book: newBook,
        chapter: ch,
        order: block.items.length + newItems.length,
      });
    }
    console.log("Adding items:", newItems.length);
    onChange({
      ...block,
      items: [...block.items, ...newItems],
    });
    toast.success(`Added ${newItems.length} chapters from ${newBook}`);
    // Keep the book selected but reset chapters for next selection
    const maxCh = CHAPTER_COUNTS[newBook] || 1;
    setNewChapter(1);
    setEndChapter(maxCh);
  };

  const addWholeBook = () => {
    if (!newBook) return;
    const chapterCount = CHAPTER_COUNTS[newBook] || 1;
    const newItems: SequenceItem[] = [];
    for (let ch = 1; ch <= chapterCount; ch++) {
      newItems.push({
        id: crypto.randomUUID(),
        book: newBook,
        chapter: ch,
        order: block.items.length + newItems.length,
      });
    }
    onChange({
      ...block,
      items: [...block.items, ...newItems],
    });
    toast.success(`Added all ${chapterCount} chapters of ${newBook}`);
  };

  const addBookRange = () => {
    console.log("addBookRange called:", { newBook, endBook });
    if (!newBook || !endBook) {
      console.log("Missing book selection", { newBook, endBook });
      return;
    }
    const startIdx = BIBLE_BOOKS.indexOf(newBook);
    const endIdx = BIBLE_BOOKS.indexOf(endBook);
    console.log("Book indices:", { startIdx, endIdx });
    if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
      console.log("Invalid book range");
      return;
    }

    const newItems: SequenceItem[] = [];
    for (let bookIdx = startIdx; bookIdx <= endIdx; bookIdx++) {
      const bookName = BIBLE_BOOKS[bookIdx];
      const chapterCount = CHAPTER_COUNTS[bookName] || 1;
      for (let ch = 1; ch <= chapterCount; ch++) {
        newItems.push({
          id: crypto.randomUUID(),
          book: bookName,
          chapter: ch,
          order: block.items.length + newItems.length,
        });
      }
    }
    console.log("Adding book range items:", newItems.length);
    onChange({
      ...block,
      items: [...block.items, ...newItems],
    });
    const bookCount = endIdx - startIdx + 1;
    toast.success(`Added ${newItems.length} chapters from ${bookCount} books (${newBook} to ${endBook})`);
  };

  const handleAdd = () => {
    console.log("handleAdd called, selectionMode:", selectionMode);
    switch (selectionMode) {
      case "single":
        addSingleChapter();
        break;
      case "chapters":
        addChapterRange();
        break;
      case "book":
        addWholeBook();
        break;
      case "books":
        addBookRange();
        break;
    }
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

  // Get count summary for display
  const getItemsSummary = () => {
    const bookCounts: Record<string, number> = {};
    block.items.forEach(item => {
      bookCounts[item.book] = (bookCounts[item.book] || 0) + 1;
    });
    const books = Object.keys(bookCounts);
    if (books.length === 0) return null;
    if (books.length === 1) {
      const count = bookCounts[books[0]];
      const total = CHAPTER_COUNTS[books[0]] || 1;
      if (count === total) return `${books[0]} (whole book)`;
      return `${count} chapter${count !== 1 ? "s" : ""} from ${books[0]}`;
    }
    return `${block.items.length} chapters from ${books.length} books`;
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
                    {getItemsSummary()}
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
              <div className="space-y-3 p-3 bg-muted/30 rounded-lg max-h-[300px] overflow-y-auto">
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

            {/* Selection Mode Tabs */}
            <div className="space-y-3">
              {block.commentaryOnly && (
                <div className="text-sm text-muted-foreground bg-muted/30 p-2 rounded-md flex items-center gap-2">
                  <span className="text-primary">📖</span>
                  Commentary Only mode: Commentary will be generated one chapter at a time during playback
                </div>
              )}
              
              <Tabs value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
                <TabsList className="grid w-full grid-cols-4 h-9">
                  <TabsTrigger value="single" className="text-xs">Single Chapter</TabsTrigger>
                  <TabsTrigger value="chapters" className="text-xs">Chapter Range</TabsTrigger>
                  <TabsTrigger value="book" className="text-xs">Whole Book</TabsTrigger>
                  <TabsTrigger value="books" className="text-xs">Book Range</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Single Chapter */}
              {selectionMode === "single" && (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Book</Label>
                    <Select value={newBook} onValueChange={setNewBook}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select book" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-popover">
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
                      <SelectContent className="max-h-[200px] bg-popover">
                        {Array.from({ length: CHAPTER_COUNTS[newBook] || 1 }, (_, i) => i + 1).map((ch) => (
                          <SelectItem key={ch} value={String(ch)}>
                            {ch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={addSingleChapter} 
                    disabled={!newBook} 
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              )}

              {/* Chapter Range */}
              {selectionMode === "chapters" && (
                <div className="flex gap-2 items-end flex-wrap">
                  <div className="flex-1 min-w-[150px]">
                    <Label className="text-xs text-muted-foreground">Book</Label>
                    <Select value={newBook} onValueChange={(v) => {
                      setNewBook(v);
                      setNewChapter(1);
                      setEndChapter(CHAPTER_COUNTS[v] || 1);
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select book" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-popover">
                        {BIBLE_BOOKS.map((book) => (
                          <SelectItem key={book} value={book}>
                            {book}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20">
                    <Label className="text-xs text-muted-foreground">From Ch.</Label>
                    <Select
                      value={String(newChapter)}
                      onValueChange={(v) => setNewChapter(parseInt(v))}
                      disabled={!newBook}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-popover">
                        {Array.from({ length: CHAPTER_COUNTS[newBook] || 1 }, (_, i) => i + 1).map((ch) => (
                          <SelectItem key={ch} value={String(ch)}>
                            {ch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-20">
                    <Label className="text-xs text-muted-foreground">To Ch.</Label>
                    <Select
                      value={String(endChapter)}
                      onValueChange={(v) => setEndChapter(parseInt(v))}
                      disabled={!newBook}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] bg-popover">
                        {Array.from({ length: CHAPTER_COUNTS[newBook] || 1 }, (_, i) => i + 1)
                          .filter(ch => ch >= newChapter)
                          .map((ch) => (
                            <SelectItem key={ch} value={String(ch)}>
                              {ch}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAdd} disabled={!newBook || endChapter < newChapter} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add {endChapter - newChapter + 1} Chapters
                  </Button>
                </div>
              )}

              {/* Whole Book */}
              {selectionMode === "book" && (
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Book</Label>
                    <Select value={newBook} onValueChange={setNewBook}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select book" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-popover">
                        {BIBLE_BOOKS.map((book) => (
                          <SelectItem key={book} value={book}>
                            {book} ({CHAPTER_COUNTS[book]} chapters)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAdd} disabled={!newBook} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add {newBook ? `${CHAPTER_COUNTS[newBook]} Chapters` : "Book"}
                  </Button>
                </div>
              )}

              {/* Book Range */}
              {selectionMode === "books" && (
                <div className="flex gap-2 items-end flex-wrap">
                  <div className="flex-1 min-w-[150px]">
                    <Label className="text-xs text-muted-foreground">From Book</Label>
                    <Select value={newBook} onValueChange={setNewBook}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start book" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-popover">
                        {BIBLE_BOOKS.map((book) => (
                          <SelectItem key={book} value={book}>
                            {book}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <Label className="text-xs text-muted-foreground">To Book</Label>
                    <Select value={endBook} onValueChange={setEndBook} disabled={!newBook}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select end book" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] bg-popover">
                        {BIBLE_BOOKS
                          .filter((_, idx) => idx >= BIBLE_BOOKS.indexOf(newBook))
                          .map((book) => (
                            <SelectItem key={book} value={book}>
                              {book}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" onClick={handleAdd} disabled={!newBook || !endBook} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Books
                  </Button>
                </div>
              )}
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
                  <SelectContent className="max-h-[250px] bg-popover">
                    {OPENAI_VOICES.map((voice) => (
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
                  <SelectContent className="bg-popover">
                    <SelectItem value="0.75">0.75x (Slow)</SelectItem>
                    <SelectItem value="1">1x (Normal)</SelectItem>
                    <SelectItem value="1.25">1.25x (Fast)</SelectItem>
                    <SelectItem value="1.5">1.5x (Faster)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Background Music Toggle */}
            <div className="flex items-center justify-between pt-2 border-t">
              <Label className="text-sm flex items-center gap-2">
                🎵 Background Music
              </Label>
              <Switch
                checked={block.backgroundMusic || false}
                onCheckedChange={(checked) => onChange({ ...block, backgroundMusic: checked })}
              />
            </div>

            {/* Jeeves Commentary Toggle */}
            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-2">
                  🎩 Jeeves Commentary Mode
                  <span className="text-xs text-muted-foreground">(insert commentary during reading)</span>
                </Label>
                <Switch
                  checked={block.includeJeevesCommentary}
                  onCheckedChange={(checked) => onChange({ ...block, includeJeevesCommentary: checked })}
                />
              </div>
              
                  {/* Commentary Options - shown when enabled */}
              {block.includeJeevesCommentary && (
                <div className="space-y-3 p-3 bg-muted/30 rounded-lg">
                  {/* Commentary Only Toggle */}
                  <div className="flex items-center justify-between p-2 bg-background/50 rounded-md border border-primary/20">
                    <Label className="text-sm flex items-center gap-2 cursor-pointer" htmlFor="commentary-only">
                      <span className="text-primary">📖</span>
                      <div className="flex flex-col">
                        <span className="font-medium">Commentary Only</span>
                        <span className="text-xs text-muted-foreground">Skip verse reading, play only commentary</span>
                      </div>
                    </Label>
                    <Switch
                      id="commentary-only"
                      checked={block.commentaryOnly || false}
                      onCheckedChange={(checked) => onChange({ 
                        ...block, 
                        commentaryOnly: checked,
                        // Commentary-only mode REQUIRES Jeeves commentary to be enabled
                        includeJeevesCommentary: checked ? true : block.includeJeevesCommentary
                      })}
                    />
                  </div>
                  
                  {/* Commentary Mode Selection */}
                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      📖 Commentary Style
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        variant={block.commentaryMode !== "verse" ? "default" : "outline"}
                        size="sm"
                        className="h-auto py-2 flex flex-col items-start"
                        onClick={() => onChange({ ...block, commentaryMode: "chapter" })}
                      >
                        <span className="font-medium">Chapter-by-Chapter</span>
                        <span className="text-xs opacity-70 font-normal">Commentary after each chapter</span>
                      </Button>
                      <Button
                        type="button"
                        variant={block.commentaryMode === "verse" ? "default" : "outline"}
                        size="sm"
                        className="h-auto py-2 flex flex-col items-start"
                        onClick={() => onChange({ ...block, commentaryMode: "verse" })}
                      >
                        <span className="font-medium">Verse-by-Verse</span>
                        <span className="text-xs opacity-70 font-normal">Commentary after each verse</span>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mic className="h-3 w-3" /> Commentary Voice
                      </Label>
                      <Select
                        value={block.commentaryVoice || "daniel"}
                        onValueChange={(v) => onChange({ ...block, commentaryVoice: v as VoiceId })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px] bg-popover">
                  {OPENAI_VOICES.map((voice) => (
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
                        📊 Commentary Depth
                      </Label>
                      <Select
                        value={block.commentaryDepth || "surface"}
                        onValueChange={(v) => onChange({ ...block, commentaryDepth: v as CommentaryDepth })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover">
                          <SelectItem value="surface">
                            <span className="font-medium">Surface</span>
                            <span className="text-xs text-muted-foreground ml-2">Brief overview</span>
                          </SelectItem>
                          <SelectItem value="intermediate">
                            <span className="font-medium">Intermediate</span>
                            <span className="text-xs text-muted-foreground ml-2">Thorough analysis</span>
                          </SelectItem>
                          <SelectItem value="depth">
                            <span className="font-medium">Scholarly</span>
                            <span className="text-xs text-muted-foreground ml-2">Deep study</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
