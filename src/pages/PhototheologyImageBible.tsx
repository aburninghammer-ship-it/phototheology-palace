import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Layers,
  Search,
  Sparkles,
  Brain,
  BookMarked,
  Maximize2,
  Minimize2,
} from "lucide-react";
import {
  imageBibleBooks,
  getTotalChapters,
  getBookByName,
  searchChapters,
  type ChapterCard,
  type BookData,
} from "@/data/imageBibleData";
import { motion, AnimatePresence } from "framer-motion";

// Flashcard Component
interface FlashcardProps {
  chapter: ChapterCard;
  isFlipped: boolean;
  onFlip: () => void;
  size?: "normal" | "large";
  memoryTestMode?: boolean;
}

function Flashcard({ chapter, isFlipped, onFlip, size = "normal", memoryTestMode = false }: FlashcardProps) {
  const isLarge = size === "large";
  const hasImage = !!chapter.imageUrl;

  return (
    <div
      className={`relative cursor-pointer perspective-1000 ${isLarge ? "h-[500px]" : "h-64"}`}
      onClick={onFlip}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Visual (Image or Icon) */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl ${
            hasImage ? "" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {hasImage ? (
            <div className="relative w-full h-full">
              <img
                src={chapter.imageUrl}
                alt={`${chapter.book} ${chapter.chapter} - ${chapter.theme}`}
                className="w-full h-full object-cover"
              />
              {!memoryTestMode && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-1 mb-2">
                      {chapter.book} {chapter.chapter}
                    </Badge>
                    <h3 className={`${isLarge ? "text-3xl" : "text-xl"} font-bold`}>
                      {chapter.theme}
                    </h3>
                    <p className="text-white/70 text-sm mt-2">Tap to see theme</p>
                  </div>
                </>
              )}
              {memoryTestMode && (
                <div className="absolute bottom-4 left-0 right-0 text-center">
                  <p className="text-white/70 text-sm bg-black/50 px-3 py-1 rounded-full inline-block">
                    What chapter is this? Tap to reveal
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-white">
              <div className={`${isLarge ? "text-9xl" : "text-6xl"} mb-4`}>
                {chapter.visualIcon}
              </div>
              {!memoryTestMode && (
                <>
                  <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-1 mb-2">
                    {chapter.book} {chapter.chapter}
                  </Badge>
                  <h3 className={`${isLarge ? "text-3xl" : "text-xl"} font-bold text-center`}>
                    {chapter.theme}
                  </h3>
                  <p className="text-white/70 text-sm mt-2">Tap to see theme</p>
                </>
              )}
              {memoryTestMode && (
                <p className="text-white/70 text-sm mt-4">What chapter is this? Tap to reveal</p>
              )}
            </div>
          )}
        </div>

        {/* Back - Theme Summary */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 flex flex-col text-white shadow-2xl`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              {chapter.book} {chapter.chapter}
            </Badge>
            <span className="text-2xl">{chapter.visualIcon}</span>
          </div>

          <h3 className={`${isLarge ? "text-2xl" : "text-lg"} font-bold mb-3`}>
            {chapter.theme}
          </h3>

          <ScrollArea className="flex-1">
            <p className={`${isLarge ? "text-base" : "text-sm"} leading-relaxed opacity-90`}>
              {chapter.summary}
            </p>
          </ScrollArea>

          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
              <BookMarked className="h-4 w-4" />
              <span>{chapter.keyVerse}</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span className="text-sm font-medium italic">"{chapter.memoryHook}"</span>
            </div>
          </div>

          <p className="text-white/70 text-sm mt-3 text-center">Tap to see image</p>
        </div>
      </motion.div>
    </div>
  );
}

// Mini Card for Grid View
interface MiniCardProps {
  chapter: ChapterCard;
  onClick: () => void;
  isSelected?: boolean;
}

function MiniCard({ chapter, onClick, isSelected }: MiniCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:scale-105 ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-3 text-center">
        <div className="text-3xl mb-1">{chapter.visualIcon}</div>
        <div className="text-xs font-medium truncate">{chapter.book} {chapter.chapter}</div>
        <div className="text-xs text-muted-foreground truncate">{chapter.theme}</div>
      </CardContent>
    </Card>
  );
}

export default function PhototheologyImageBible() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"browse" | "study" | "grid">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [memoryTestMode, setMemoryTestMode] = useState(false);

  const totalChapters = getTotalChapters();

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchChapters(searchQuery);
  }, [searchQuery]);

  // Get current chapter for study mode
  const currentChapters = selectedBook?.chapters || [];
  const currentChapter = currentChapters[currentChapterIndex];

  // Navigation in study mode
  const goToNext = () => {
    if (currentChapterIndex < currentChapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const goToPrev = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const selectChapter = (chapter: ChapterCard) => {
    const book = getBookByName(chapter.book);
    if (book) {
      setSelectedBook(book);
      const index = book.chapters.findIndex(c => c.chapter === chapter.chapter);
      setCurrentChapterIndex(index >= 0 ? index : 0);
      setViewMode("study");
      setIsFlipped(false);
    }
  };

  const startStudyMode = (book: BookData) => {
    setSelectedBook(book);
    setCurrentChapterIndex(0);
    setViewMode("study");
    setIsFlipped(false);
  };

  const exitStudyMode = () => {
    setViewMode("browse");
    setSelectedBook(null);
    setCurrentChapterIndex(0);
    setIsFlipped(false);
  };

  // Fullscreen study view
  if (viewMode === "study" && isFullscreen && currentChapter) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Button variant="ghost" onClick={() => setIsFullscreen(false)} className="text-white">
            <Minimize2 className="h-5 w-5 mr-2" />
            Exit Fullscreen
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-white text-lg font-medium">
              {memoryTestMode ? "Memory Test Mode" : `${currentChapter.book} ${currentChapter.chapter} - ${currentChapter.theme}`}
            </div>
            <Button
              variant={memoryTestMode ? "default" : "outline"}
              size="sm"
              onClick={() => setMemoryTestMode(!memoryTestMode)}
              className={memoryTestMode ? "bg-purple-600 hover:bg-purple-700" : "border-white/20 text-white hover:bg-white/10"}
            >
              {memoryTestMode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {memoryTestMode ? "Show Labels" : "Memory Test"}
            </Button>
          </div>
          <div className="text-white/60">
            {currentChapterIndex + 1} / {currentChapters.length}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              chapter={currentChapter}
              isFlipped={isFlipped}
              onFlip={() => setIsFlipped(!isFlipped)}
              size="large"
              memoryTestMode={memoryTestMode}
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 p-6 border-t border-white/10">
          <Button
            onClick={goToPrev}
            disabled={currentChapterIndex === 0}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-6 w-6 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => setIsFlipped(!isFlipped)}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Flip Card
          </Button>
          <Button
            onClick={goToNext}
            disabled={currentChapterIndex === currentChapters.length - 1}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Next
            <ChevronRight className="h-6 w-6 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
                Phototheology Image Bible
              </h1>
              <p className="text-muted-foreground mt-1">
                Every chapter visualized as a memory device
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {totalChapters} Chapters
          </Badge>
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-2" disabled={!selectedBook}>
              <Eye className="h-4 w-4" />
              Study
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              At a Glance
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Browse View */}
        {viewMode === "browse" && (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search themes, summaries, verses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search Results ({searchResults.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {searchResults.slice(0, 12).map((chapter) => (
                      <MiniCard
                        key={`${chapter.book}-${chapter.chapter}`}
                        chapter={chapter}
                        onClick={() => selectChapter(chapter)}
                      />
                    ))}
                  </div>
                  {searchResults.length > 12 && (
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      +{searchResults.length - 12} more results
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Books Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {imageBibleBooks.map((book) => (
                <Card
                  key={book.name}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                  onClick={() => startStudyMode(book)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant={book.testament === "OT" ? "secondary" : "default"}>
                        {book.testament === "OT" ? "Old Testament" : "New Testament"}
                      </Badge>
                      <Badge variant="outline">{book.totalChapters} chapters</Badge>
                    </div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      {book.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Preview of first 6 chapters */}
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      {book.chapters.slice(0, 6).map((chapter) => (
                        <div
                          key={chapter.chapter}
                          className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center text-2xl"
                          title={`${chapter.book} ${chapter.chapter}: ${chapter.theme}`}
                        >
                          {chapter.visualIcon.split("")[0]}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      Study This Book
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Complete Bible Badge */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
              <CardContent className="py-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400">Complete 66-Book Bible!</h3>
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-muted-foreground">
                  All 1,189 chapters from Genesis to Revelation with unique visual memory icons.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Study View */}
        {viewMode === "study" && selectedBook && currentChapter && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={exitStudyMode}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Books
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-lg">
                  {selectedBook.name}
                </Badge>
                <Badge>
                  {currentChapterIndex + 1} / {currentChapters.length}
                </Badge>
                <Button
                  variant={memoryTestMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMemoryTestMode(!memoryTestMode)}
                >
                  {memoryTestMode ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                  {memoryTestMode ? "Show" : "Test"}
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsFullscreen(true)}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>

            {/* Flashcard */}
            <div className="max-w-lg mx-auto">
              <Flashcard
                chapter={currentChapter}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(!isFlipped)}
                size="large"
                memoryTestMode={memoryTestMode}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={goToPrev}
                disabled={currentChapterIndex === 0}
                variant="outline"
                size="lg"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              <Button
                onClick={() => setIsFlipped(!isFlipped)}
                variant="default"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Flip Card
              </Button>
              <Button
                onClick={goToNext}
                disabled={currentChapterIndex === currentChapters.length - 1}
                variant="outline"
                size="lg"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Chapter Quick Select */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Jump to Chapter</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-24">
                  <div className="flex flex-wrap gap-2">
                    {currentChapters.map((chapter, index) => (
                      <Button
                        key={chapter.chapter}
                        variant={index === currentChapterIndex ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentChapterIndex(index);
                          setIsFlipped(false);
                        }}
                        className="w-12"
                      >
                        {chapter.chapter}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Grid View - At a Glance */}
        {viewMode === "grid" && (
          <div className="space-y-8">
            {imageBibleBooks.map((book) => (
              <div key={book.name}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{book.name}</h2>
                  <Badge variant="outline">{book.totalChapters} chapters</Badge>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {book.chapters.map((chapter) => (
                    <div
                      key={`${book.name}-${chapter.chapter}`}
                      className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform hover:shadow-lg group relative"
                      onClick={() => selectChapter(chapter)}
                      title={`${chapter.book} ${chapter.chapter}: ${chapter.theme}`}
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">
                        {chapter.visualIcon.split("")[0]}
                      </span>
                      <span className="text-xs font-medium mt-1">{chapter.chapter}</span>

                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        {chapter.theme}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Card */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              Memory Tips
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Each chapter has a unique visual icon - no two chapters look alike!</li>
              <li>Study the icon first, then flip to learn the theme and summary</li>
              <li>Use the "At a Glance" view to quickly scan entire books</li>
              <li>The memory hook gives you a quick phrase to recall the chapter</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
