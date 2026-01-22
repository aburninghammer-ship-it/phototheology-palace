/**
 * Audio Bible Page
 * Listen to Bible chapters with optional Phototheology Commentary
 */

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Navigation } from "@/components/Navigation";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAudioBible } from "@/hooks/useAudioBible";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { READING_SERIES, getThemes, CommentaryTier, fetchChapterVerses } from "@/services/audioBibleService";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Volume2,
  BookOpen,
  MessageSquare,
  Loader2,
  Headphones,
  ListMusic,
  Plus,
  X,
  BookText,
  Layers,
} from "lucide-react";

interface Theme {
  id: string;
  name: string;
  display_name: string;
  description: string;
  icon: string;
  category: string;
  verse_count: number;
}

interface ChapterSelection {
  book: string;
  chapter: number;
}

type SelectionMode = "chapter" | "book" | "custom";
type CommentaryMode = "verse" | "chapter";

export default function AudioBible() {
  const [searchParams] = useSearchParams();
  const { preferences } = useUserPreferences();

  // Audio Bible hook
  const {
    isPlaying,
    isPaused,
    isLoading,
    isIdle,
    currentBook,
    currentChapter,
    currentVerse,
    currentVerseText,
    currentVerseIndex,
    totalVerses,
    isPlayingCommentary,
    currentCommentary,
    voice,
    setVoice,
    commentaryVoice,
    setCommentaryVoice,
    speed,
    setSpeed,
    volume,
    setVolume,
    commentaryTier,
    setCommentaryTier,
    includeCommentary,
    setIncludeCommentary,
    commentaryMode,
    setCommentaryMode,
    unlock,
    playChapter,
    pause,
    resume,
    stop,
    skipNext,
    skipPrevious,
    voices,
  } = useAudioBible({
    onVerseChange: (book, chapter, verse) => {
      console.log(`[AudioBible] Now playing ${book} ${chapter}:${verse}`);
    },
    onChapterComplete: (book, chapter) => {
      console.log(`[AudioBible] Completed ${book} ${chapter}`);
    },
  });

  // Selection state
  const [selectedBook, setSelectedBook] = useState("Genesis");
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("chapter");
  // commentaryMode now comes from useAudioBible hook
  const [customChapters, setCustomChapters] = useState<ChapterSelection[]>([]);
  const [customBook, setCustomBook] = useState("Genesis");
  const [customChapter, setCustomChapter] = useState(1);
  const [themes, setThemes] = useState<Theme[]>([]);
  
  // Custom playlist add mode state
  const [customAddMode, setCustomAddMode] = useState<"single" | "chapter-range" | "book-range">("single");
  const [rangeStartChapter, setRangeStartChapter] = useState(1);
  const [rangeEndChapter, setRangeEndChapter] = useState(5);
  const [rangeStartBook, setRangeStartBook] = useState("Genesis");
  const [rangeEndBook, setRangeEndBook] = useState("Genesis");

  // Load themes on mount
  useEffect(() => {
    loadThemes();
  }, []);

  // Handle URL params
  useEffect(() => {
    const book = searchParams.get("book");
    const chapter = searchParams.get("chapter");
    if (book) setSelectedBook(book);
    if (chapter) setSelectedChapter(parseInt(chapter, 10));
  }, [searchParams]);

  const loadThemes = async () => {
    const data = await getThemes();
    setThemes(data);
  };

  // Get chapter count for selected book
  const getChapterCount = (bookName: string = selectedBook) => {
    const book = BIBLE_BOOK_METADATA.find((b) => b.name === bookName);
    return book?.chapters || 1;
  };

  // Handle play for single chapter
  const handlePlayChapter = async () => {
    await unlock();
    const verses = await fetchChapterVerses(selectedBook, selectedChapter);
    if (verses.length > 0) {
      playChapter(selectedBook, selectedChapter, verses);
    }
  };

  // Handle play for whole book
  const handlePlayBook = async () => {
    await unlock();
    // Start with chapter 1
    const verses = await fetchChapterVerses(selectedBook, 1);
    if (verses.length > 0) {
      playChapter(selectedBook, 1, verses);
      // TODO: Queue remaining chapters
    }
  };

  // Handle play for custom selection
  const handlePlayCustom = async () => {
    if (customChapters.length === 0) return;
    await unlock();
    const first = customChapters[0];
    const verses = await fetchChapterVerses(first.book, first.chapter);
    if (verses.length > 0) {
      playChapter(first.book, first.chapter, verses);
      // TODO: Queue remaining chapters
    }
  };

  // Add chapter to custom list
  const addCustomChapter = () => {
    const exists = customChapters.some(
      (c) => c.book === customBook && c.chapter === customChapter
    );
    if (!exists) {
      setCustomChapters([...customChapters, { book: customBook, chapter: customChapter }]);
    }
  };

  // Add chapter range to custom list
  const addChapterRange = () => {
    const newChapters: ChapterSelection[] = [];
    for (let ch = rangeStartChapter; ch <= rangeEndChapter; ch++) {
      const exists = customChapters.some(
        (c) => c.book === customBook && c.chapter === ch
      );
      if (!exists) {
        newChapters.push({ book: customBook, chapter: ch });
      }
    }
    setCustomChapters([...customChapters, ...newChapters]);
  };

  // Add book range to custom list
  const addBookRange = () => {
    const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook);
    const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
    const newChapters: ChapterSelection[] = [];
    
    for (let bookIdx = startIdx; bookIdx <= endIdx; bookIdx++) {
      const book = BIBLE_BOOK_METADATA[bookIdx];
      for (let ch = 1; ch <= book.chapters; ch++) {
        const exists = customChapters.some(
          (c) => c.book === book.name && c.chapter === ch
        );
        if (!exists) {
          newChapters.push({ book: book.name, chapter: ch });
        }
      }
    }
    setCustomChapters([...customChapters, ...newChapters]);
  };

  // Get book range chapter count
  const getBookRangeChapterCount = () => {
    const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook);
    const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
    let count = 0;
    for (let i = startIdx; i <= endIdx; i++) {
      count += BIBLE_BOOK_METADATA[i].chapters;
    }
    return count;
  };

  // Get book range book count
  const getBookRangeBookCount = () => {
    const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook);
    const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
    return endIdx - startIdx + 1;
  };

  // Remove chapter from custom list
  const removeCustomChapter = (index: number) => {
    setCustomChapters(customChapters.filter((_, i) => i !== index));
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (isPaused) {
      resume();
    } else if (isPlaying) {
      pause();
    }
  };

  // Handle series play
  const handlePlaySeries = async (series: typeof READING_SERIES[0]) => {
    await unlock();
    const firstItem = series.items[0];
    const verses = await fetchChapterVerses(firstItem.book, firstItem.chapter);
    if (verses.length > 0) {
      playChapter(firstItem.book, firstItem.chapter, verses);
    }
  };

  const progress = totalVerses > 0 ? ((currentVerseIndex + 1) / totalVerses) * 100 : 0;

  return (
    <div className="min-h-screen gradient-subtle">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      <div className="pt-24 pb-32 px-3 sm:px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <div className="glass-card mb-8 p-6 rounded-2xl">
            <div className="flex items-center gap-4">
              <img
                src="/pwa-192x192.png"
                alt="Phototheology"
                className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
              />
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold mb-1 bg-gradient-palace bg-clip-text text-transparent">
                  Audio Bible & Commentary
                </h1>
                <p className="text-muted-foreground">
                  Listen to Scripture with Phototheology Commentary
                </p>
              </div>
            </div>
          </div>

          {/* Now Playing Card (when active) */}
          {!isIdle && (
            <Card className="mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {isPlayingCommentary ? "Phototheology Commentary" : "Now Playing"}
                    </p>
                    <h2 className="text-2xl font-bold">
                      {currentBook} {currentChapter}:{currentVerse}
                    </h2>
                  </div>
                  <Badge variant={isPlayingCommentary ? "secondary" : "default"} className="text-sm px-3 py-1">
                    {isPlayingCommentary ? `${commentaryTier} commentary` : "Scripture"}
                  </Badge>
                </div>

                {/* Current text - Always visible */}
                <div className="bg-background/80 rounded-xl p-4 mb-6 min-h-[100px] max-h-[200px] overflow-y-auto border">
                  {isPlayingCommentary ? (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        Phototheology Commentary
                      </p>
                      {currentCommentary ? (
                        <p className="text-base leading-relaxed">
                          {currentCommentary}
                        </p>
                      ) : (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Generating commentary...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
                        {currentBook} {currentChapter}:{currentVerse}
                      </p>
                      <p className="text-lg leading-relaxed font-serif">
                        "{currentVerseText}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Verse {currentVerseIndex + 1} of {totalVerses}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Button variant="outline" size="icon" onClick={skipPrevious} className="h-12 w-12 rounded-full">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    className="rounded-full h-16 w-16 shadow-lg [&_svg]:!size-7"
                    onClick={handlePlayPause}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-7 w-7" />
                    ) : (
                      <Play className="h-7 w-7 ml-1 fill-current" />
                    )}
                  </Button>
                  <Button variant="outline" size="icon" onClick={skipNext} className="h-12 w-12 rounded-full">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={stop} className="h-12 w-12 rounded-full">
                    <Square className="h-4 w-4" />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-3 max-w-xs mx-auto">
                  <Volume2 className="h-5 w-5 text-muted-foreground" />
                  <Slider
                    value={[volume]}
                    onValueChange={([v]) => setVolume(v)}
                    min={0}
                    max={1}
                    step={0.1}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-10 text-right">{Math.round(volume * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Selection */}
            <div className="space-y-6">
              {/* Selection Mode Tabs */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    What to Listen
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectionMode} onValueChange={(v) => setSelectionMode(v as SelectionMode)}>
                    <TabsList className="grid w-full grid-cols-3 mb-4">
                      <TabsTrigger value="chapter">
                        <BookText className="h-4 w-4 mr-1" />
                        Chapter
                      </TabsTrigger>
                      <TabsTrigger value="book">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Whole Book
                      </TabsTrigger>
                      <TabsTrigger value="custom">
                        <Layers className="h-4 w-4 mr-1" />
                        Custom
                      </TabsTrigger>
                    </TabsList>

                    {/* Single Chapter */}
                    <TabsContent value="chapter" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Book</Label>
                          <Select value={selectedBook} onValueChange={setSelectedBook}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-64">
                                {BIBLE_BOOK_METADATA.map((book) => (
                                  <SelectItem key={book.name} value={book.name}>
                                    {book.name}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Chapter</Label>
                          <Select
                            value={selectedChapter.toString()}
                            onValueChange={(v) => setSelectedChapter(parseInt(v, 10))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-64">
                                {Array.from({ length: getChapterCount() }, (_, i) => i + 1).map((ch) => (
                                  <SelectItem key={ch} value={ch.toString()}>
                                    Chapter {ch}
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button size="lg" className="w-full" onClick={handlePlayChapter} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                        Play {selectedBook} {selectedChapter}
                      </Button>
                    </TabsContent>

                    {/* Whole Book */}
                    <TabsContent value="book" className="space-y-4">
                      <div className="space-y-2">
                        <Label>Book</Label>
                        <Select value={selectedBook} onValueChange={setSelectedBook}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <ScrollArea className="h-64">
                              {BIBLE_BOOK_METADATA.map((book) => (
                                <SelectItem key={book.name} value={book.name}>
                                  {book.name} ({book.chapters} chapters)
                                </SelectItem>
                              ))}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Listen to all {getChapterCount()} chapters of {selectedBook}
                      </p>
                      <Button size="lg" className="w-full" onClick={handlePlayBook} disabled={isLoading}>
                        {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                        Play Entire {selectedBook}
                      </Button>
                    </TabsContent>

                    {/* Custom Selection */}
                    <TabsContent value="custom" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Build a custom playlist: single chapters, chapter ranges, or book ranges
                      </p>
                      
                      {/* Add Mode Selector */}
                      <Tabs value={customAddMode} onValueChange={(v) => setCustomAddMode(v as "single" | "chapter-range" | "book-range")} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 h-auto">
                          <TabsTrigger value="single" className="text-xs py-2">
                            Single Chapter
                          </TabsTrigger>
                          <TabsTrigger value="chapter-range" className="text-xs py-2">
                            Chapter Range
                          </TabsTrigger>
                          <TabsTrigger value="book-range" className="text-xs py-2">
                            Book Range
                          </TabsTrigger>
                        </TabsList>
                        
                        {/* Single Chapter Mode */}
                        <TabsContent value="single" className="mt-3">
                          <div className="flex gap-2">
                            <Select value={customBook} onValueChange={setCustomBook}>
                              <SelectTrigger className="flex-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-64">
                                  {BIBLE_BOOK_METADATA.map((book) => (
                                    <SelectItem key={book.name} value={book.name}>
                                      {book.name}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <Select
                              value={customChapter.toString()}
                              onValueChange={(v) => setCustomChapter(parseInt(v, 10))}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <ScrollArea className="h-64">
                                  {Array.from({ length: getChapterCount(customBook) }, (_, i) => i + 1).map((ch) => (
                                    <SelectItem key={ch} value={ch.toString()}>
                                      {ch}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={addCustomChapter}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TabsContent>

                        {/* Chapter Range Mode */}
                        <TabsContent value="chapter-range" className="mt-3 space-y-2">
                          <Select value={customBook} onValueChange={(v) => {
                            setCustomBook(v);
                            setRangeStartChapter(1);
                            const maxCh = BIBLE_BOOK_METADATA.find(b => b.name === v)?.chapters || 1;
                            setRangeEndChapter(Math.min(5, maxCh));
                          }}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <ScrollArea className="h-64">
                                {BIBLE_BOOK_METADATA.map((book) => (
                                  <SelectItem key={book.name} value={book.name}>
                                    {book.name} ({book.chapters} ch)
                                  </SelectItem>
                                ))}
                              </ScrollArea>
                            </SelectContent>
                          </Select>
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">From Chapter</Label>
                              <Select
                                value={rangeStartChapter.toString()}
                                onValueChange={(v) => {
                                  const start = parseInt(v, 10);
                                  setRangeStartChapter(start);
                                  if (rangeEndChapter < start) setRangeEndChapter(start);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <ScrollArea className="h-48">
                                    {Array.from({ length: getChapterCount(customBook) }, (_, i) => i + 1).map((ch) => (
                                      <SelectItem key={ch} value={ch.toString()}>
                                        {ch}
                                      </SelectItem>
                                    ))}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            </div>
                            <span className="mt-5 text-muted-foreground">→</span>
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">To Chapter</Label>
                              <Select
                                value={rangeEndChapter.toString()}
                                onValueChange={(v) => setRangeEndChapter(parseInt(v, 10))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <ScrollArea className="h-48">
                                    {Array.from({ length: getChapterCount(customBook) - rangeStartChapter + 1 }, (_, i) => i + rangeStartChapter).map((ch) => (
                                      <SelectItem key={ch} value={ch.toString()}>
                                        {ch}
                                      </SelectItem>
                                    ))}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button variant="outline" size="icon" className="mt-5" onClick={addChapterRange}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {rangeEndChapter - rangeStartChapter + 1} chapters will be added
                          </p>
                        </TabsContent>

                        {/* Book Range Mode */}
                        <TabsContent value="book-range" className="mt-3 space-y-2">
                          <div className="flex gap-2 items-center">
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">From Book</Label>
                              <Select
                                value={rangeStartBook}
                                onValueChange={(v) => {
                                  setRangeStartBook(v);
                                  const startIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === v);
                                  const endIdx = BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeEndBook);
                                  if (endIdx < startIdx) setRangeEndBook(v);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <ScrollArea className="h-64">
                                    {BIBLE_BOOK_METADATA.map((book) => (
                                      <SelectItem key={book.name} value={book.name}>
                                        {book.name}
                                      </SelectItem>
                                    ))}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            </div>
                            <span className="mt-5 text-muted-foreground">→</span>
                            <div className="flex-1">
                              <Label className="text-xs text-muted-foreground">To Book</Label>
                              <Select
                                value={rangeEndBook}
                                onValueChange={(v) => setRangeEndBook(v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <ScrollArea className="h-64">
                                    {BIBLE_BOOK_METADATA.filter((_, idx) => idx >= BIBLE_BOOK_METADATA.findIndex(b => b.name === rangeStartBook)).map((book) => (
                                      <SelectItem key={book.name} value={book.name}>
                                        {book.name}
                                      </SelectItem>
                                    ))}
                                  </ScrollArea>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button variant="outline" size="icon" className="mt-5" onClick={addBookRange}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {getBookRangeChapterCount()} chapters across {getBookRangeBookCount()} books
                          </p>
                        </TabsContent>
                      </Tabs>

                      {/* Custom chapters list */}
                      {customChapters.length > 0 && (
                        <div className="space-y-2 pt-2 border-t">
                          <div className="flex items-center justify-between">
                            <Label>Your Playlist ({customChapters.length} chapters)</Label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-muted-foreground h-6"
                              onClick={() => setCustomChapters([])}
                            >
                              Clear All
                            </Button>
                          </div>
                          <ScrollArea className="max-h-32">
                            <div className="flex flex-wrap gap-1.5">
                              {customChapters.map((ch, i) => (
                                <Badge key={i} variant="secondary" className="pr-1 text-xs">
                                  {ch.book} {ch.chapter}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-3 w-3 p-0 ml-1 hover:bg-destructive/20"
                                    onClick={() => removeCustomChapter(i)}
                                  >
                                    <X className="h-2 w-2" />
                                  </Button>
                                </Badge>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      <Button
                        size="lg"
                        className="w-full"
                        onClick={handlePlayCustom}
                        disabled={isLoading || customChapters.length === 0}
                      >
                        {isLoading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                        Play {customChapters.length} Chapter{customChapters.length !== 1 ? "s" : ""}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Reading Series */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListMusic className="h-5 w-5 text-primary" />
                    Pre-Built Series
                  </CardTitle>
                  <CardDescription>Curated multi-chapter journeys</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {READING_SERIES.map((series) => (
                      <div
                        key={series.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => handlePlaySeries(series)}
                      >
                        <div>
                          <h3 className="font-medium text-sm">{series.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {series.description} • {series.items.length} chapters
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Listening Mode */}
              <Card className="glass-card border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    Listening Mode
                  </CardTitle>
                  <CardDescription>Choose how you want to listen</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bible Only vs With Commentary */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={!includeCommentary ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-1"
                      onClick={() => setIncludeCommentary(false)}
                    >
                      <BookOpen className="h-6 w-6 mb-1" />
                      <span className="font-semibold">Bible Only</span>
                      <span className="text-xs opacity-80">Just Scripture</span>
                    </Button>
                    <Button
                      variant={includeCommentary ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-1"
                      onClick={() => setIncludeCommentary(true)}
                    >
                      <MessageSquare className="h-6 w-6 mb-1" />
                      <span className="font-semibold">With Commentary</span>
                      <span className="text-xs opacity-80">Phototheology insights</span>
                    </Button>
                  </div>

                  {/* Commentary Options (only show if enabled) */}
                  {includeCommentary && (
                    <>
                      {/* Commentary Mode: Verse by Verse or Chapter Summary */}
                      <div className="space-y-2 pt-2">
                        <Label>Commentary Style</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={commentaryMode === "verse" ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryMode("verse")}
                          >
                            <span className="font-medium">Verse by Verse</span>
                            <span className="text-xs opacity-80">After each verse</span>
                          </Button>
                          <Button
                            variant={commentaryMode === "chapter" ? "default" : "outline"}
                            size="sm"
                            className="h-auto py-2 flex-col"
                            onClick={() => setCommentaryMode("chapter")}
                          >
                            <span className="font-medium">Chapter Summary</span>
                            <span className="text-xs opacity-80">After whole chapter</span>
                          </Button>
                        </div>
                      </div>

                      {/* Commentary Depth */}
                      <div className="space-y-2">
                        <Label>Commentary Depth</Label>
                        <Select
                          value={commentaryTier}
                          onValueChange={(v) => setCommentaryTier(v as CommentaryTier)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="surface">Surface</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="scholarly">Scholarly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Audio Settings */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Audio Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Bible Voice Selection */}
                  <div className="space-y-2">
                    <Label>Bible Voice</Label>
                    <Select value={voice} onValueChange={(v) => setVoice(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name} - {v.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Commentary Voice Selection */}
                  {includeCommentary && (
                    <div className="space-y-2">
                      <Label>Commentary Voice</Label>
                      <Select value={commentaryVoice} onValueChange={(v) => setCommentaryVoice(v as any)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {voices.map((v) => (
                            <SelectItem key={v.id} value={v.id}>
                              {v.name} - {v.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Speed Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Playback Speed</Label>
                      <span className="text-sm font-medium">{speed}x</span>
                    </div>
                    <Slider
                      value={[speed]}
                      onValueChange={([v]) => setSpeed(v)}
                      min={0.5}
                      max={2}
                      step={0.25}
                    />
                  </div>

                  {/* Volume Control */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Volume</Label>
                      <span className="text-sm font-medium">{Math.round(volume * 100)}%</span>
                    </div>
                    <Slider
                      value={[volume]}
                      onValueChange={([v]) => setVolume(v)}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Themes (if available) */}
              {themes.length > 0 && (
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Themes</CardTitle>
                    <CardDescription>Verses by topic</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.slice(0, 8).map((theme) => (
                        <div
                          key={theme.id}
                          className="p-2 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer text-center"
                        >
                          <span className="text-xl block">{theme.icon}</span>
                          <span className="text-xs">{theme.display_name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
