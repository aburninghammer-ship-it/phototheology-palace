import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
  Trophy,
  Target,
  Shuffle,
  CheckCircle2,
  XCircle,
  Play,
  BarChart3,
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
import { useImageBibleImages, getChapterImageUrl } from "@/hooks/useImageBibleImages";

// Flashcard Component
interface FlashcardProps {
  chapter: ChapterCard;
  isFlipped: boolean;
  onFlip: () => void;
  size?: "normal" | "large";
  memoryTestMode?: boolean;
  dynamicImageUrl?: string;
  hideReference?: boolean;
}

function Flashcard({ chapter, isFlipped, onFlip, size = "normal", memoryTestMode = false, dynamicImageUrl, hideReference = false }: FlashcardProps) {
  const { t } = useTranslation();
  const isLarge = size === "large";
  const hasImage = !!(dynamicImageUrl || chapter.imageUrl);

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
        {/* Front - Image/Icon */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-2xl ${
            hasImage ? "bg-white dark:bg-slate-800" : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
          }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          {hasImage ? (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
              <img
                src={dynamicImageUrl || chapter.imageUrl}
                alt={`${chapter.book} ${chapter.chapter} - ${chapter.theme}`}
                className="w-full h-full object-contain"
              />
              {!hideReference && (
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-black/60 text-white border-transparent text-sm px-3 py-1">
                    {chapter.book} {chapter.chapter}
                  </Badge>
                </div>
              )}
              <div className="absolute bottom-4 right-4">
                <span className="text-xs text-muted-foreground bg-white/80 dark:bg-black/60 dark:text-white/70 px-2 py-1 rounded">
                  {t('imageBible.tapToSeeTheme')}
                </span>
              </div>
              {memoryTestMode && (
                <div className="absolute top-4 left-0 right-0 text-center">
                  <p className="text-white text-lg bg-black/70 px-4 py-2 rounded-full inline-block font-semibold">
                    {t('imageBible.whatIsHappening')}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-white">
              <div className={`${isLarge ? "text-8xl" : "text-5xl"} mb-4`}>
                {chapter.visualIcon}
              </div>
              {!hideReference && (
                <Badge className="bg-white/20 text-white border-white/30 text-lg px-4 py-1 mb-2">
                  {chapter.book} {chapter.chapter}
                </Badge>
              )}
              <p className="text-white/70 text-sm mt-2">{t('imageBible.tapToSeeTheme')}</p>
              {memoryTestMode && (
                <p className="text-white text-lg mt-4 font-semibold">{t('imageBible.whatIsHappening')}</p>
              )}
            </div>
          )}
        </div>

        {/* Back - Theme and Summary */}
        <div
          className={`absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 flex flex-col text-white shadow-2xl`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              {chapter.book} {chapter.chapter}
            </Badge>
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

          <p className="text-white/70 text-sm mt-3 text-center">{t('imageBible.tapToSeeImage')}</p>
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

// Test Mode Types
interface TestSession {
  chapters: ChapterCard[];
  currentIndex: number;
  correct: number;
  incorrect: number;
  answers: { chapter: ChapterCard; correct: boolean }[];
  isComplete: boolean;
}

export default function PhototheologyImageBible() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"browse" | "study" | "grid" | "test">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [memoryTestMode, setMemoryTestMode] = useState(false);

  // Test Mode State
  const [selectedBooksForTest, setSelectedBooksForTest] = useState<string[]>([]);
  const [chapterRange, setChapterRange] = useState<{ start: number; end: number }>({ start: 1, end: 50 });
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [testIsFlipped, setTestIsFlipped] = useState(false);
  const [showTestSetup, setShowTestSetup] = useState(true);

  // Fetch dynamically generated images from storage
  const { data: imageMap } = useImageBibleImages();

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

  // Test Mode Functions
  const toggleBookForTest = (bookName: string) => {
    setSelectedBooksForTest(prev =>
      prev.includes(bookName)
        ? prev.filter(b => b !== bookName)
        : [...prev, bookName]
    );
  };

  const selectAllBooks = () => {
    setSelectedBooksForTest(imageBibleBooks.map(b => b.name));
  };

  const selectOTBooks = () => {
    setSelectedBooksForTest(imageBibleBooks.filter(b => b.testament === "OT").map(b => b.name));
  };

  const selectNTBooks = () => {
    setSelectedBooksForTest(imageBibleBooks.filter(b => b.testament === "NT").map(b => b.name));
  };

  const clearBookSelection = () => {
    setSelectedBooksForTest([]);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startTest = (shuffle: boolean = true) => {
    // Gather chapters from selected books
    let chapters: ChapterCard[] = [];

    selectedBooksForTest.forEach(bookName => {
      const book = imageBibleBooks.find(b => b.name === bookName);
      if (book) {
        // Apply chapter range filter
        const filteredChapters = book.chapters.filter(
          c => c.chapter >= chapterRange.start && c.chapter <= chapterRange.end
        );
        chapters = [...chapters, ...filteredChapters];
      }
    });

    if (chapters.length === 0) return;

    // Shuffle if requested
    const testChapters = shuffle ? shuffleArray(chapters) : chapters;

    setTestSession({
      chapters: testChapters,
      currentIndex: 0,
      correct: 0,
      incorrect: 0,
      answers: [],
      isComplete: false,
    });
    setTestIsFlipped(false);
    setShowTestSetup(false);
  };

  const markTestAnswer = (correct: boolean) => {
    if (!testSession) return;

    const currentTestChapter = testSession.chapters[testSession.currentIndex];
    const newAnswers = [...testSession.answers, { chapter: currentTestChapter, correct }];
    const isLastQuestion = testSession.currentIndex >= testSession.chapters.length - 1;

    setTestSession({
      ...testSession,
      correct: correct ? testSession.correct + 1 : testSession.correct,
      incorrect: correct ? testSession.incorrect : testSession.incorrect + 1,
      answers: newAnswers,
      currentIndex: isLastQuestion ? testSession.currentIndex : testSession.currentIndex + 1,
      isComplete: isLastQuestion,
    });
    setTestIsFlipped(false);
  };

  const nextTestQuestion = () => {
    if (!testSession || testSession.currentIndex >= testSession.chapters.length - 1) return;
    setTestSession({
      ...testSession,
      currentIndex: testSession.currentIndex + 1,
    });
    setTestIsFlipped(false);
  };

  const resetTest = () => {
    setTestSession(null);
    setShowTestSetup(true);
    setTestIsFlipped(false);
  };

  const testChaptersCount = useMemo(() => {
    let count = 0;
    selectedBooksForTest.forEach(bookName => {
      const book = imageBibleBooks.find(b => b.name === bookName);
      if (book) {
        count += book.chapters.filter(
          c => c.chapter >= chapterRange.start && c.chapter <= chapterRange.end
        ).length;
      }
    });
    return count;
  }, [selectedBooksForTest, chapterRange]);

  // Fullscreen study view
  if (viewMode === "study" && isFullscreen && currentChapter) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Button variant="ghost" onClick={() => setIsFullscreen(false)} className="text-white">
            <Minimize2 className="h-5 w-5 mr-2" />
            {t('imageBible.exitFullscreen')}
          </Button>
          <div className="flex items-center gap-4">
            <div className="text-white text-lg font-medium">
              {memoryTestMode ? t('imageBible.memoryTestMode') : `${currentChapter.book} ${currentChapter.chapter} - ${currentChapter.theme}`}
            </div>
            <Button
              variant={memoryTestMode ? "default" : "outline"}
              size="sm"
              onClick={() => setMemoryTestMode(!memoryTestMode)}
              className={memoryTestMode ? "bg-purple-600 hover:bg-purple-700" : "border-white/20 text-white hover:bg-white/10"}
            >
              {memoryTestMode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
              {memoryTestMode ? t('imageBible.showLabels') : t('imageBible.memoryTest')}
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
              dynamicImageUrl={getChapterImageUrl(imageMap, currentChapter.book, currentChapter.chapter)}
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
            {t('imageBible.previous')}
          </Button>
          <Button
            onClick={() => setIsFlipped(!isFlipped)}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            {t('imageBible.flipCard')}
          </Button>
          <Button
            onClick={goToNext}
            disabled={currentChapterIndex === currentChapters.length - 1}
            variant="outline"
            size="lg"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {t('imageBible.next')}
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
              {t('imageBible.back')}
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-purple-600" />
                {t('imageBible.title')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('imageBible.subtitle')}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {t('imageBible.chaptersCount', { count: totalChapters })}
          </Badge>
        </div>

        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="mb-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              {t('imageBible.browse')}
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {t('imageBible.study')}
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              {t('imageBible.atAGlance')}
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('imageBible.test')}
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
                placeholder={t('imageBible.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('imageBible.searchResults', { count: searchResults.length })}</CardTitle>
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
                      {t('imageBible.moreResults', { count: searchResults.length - 12 })}
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
                        {book.testament === "OT" ? t('imageBible.oldTestament') : t('imageBible.newTestament')}
                      </Badge>
                      <Badge variant="outline">{t('imageBible.chaptersCount', { count: book.totalChapters })}</Badge>
                    </div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      {book.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Preview of first 6 chapters with FULL emoji icons */}
                    <div className="grid grid-cols-6 gap-2 mb-4">
                      {book.chapters.slice(0, 6).map((chapter) => {
                        const imageUrl = getChapterImageUrl(imageMap, chapter.book, chapter.chapter);
                        return (
                          <div
                            key={chapter.chapter}
                            className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center overflow-hidden"
                            title={`${chapter.book} ${chapter.chapter}: ${chapter.theme}`}
                          >
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={`${chapter.book} ${chapter.chapter}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl">{chapter.visualIcon}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <Button className="w-full" variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      {t('imageBible.studyThisBook')}
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
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-400">{t('imageBible.completeBible')}</h3>
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-muted-foreground">
                  {t('imageBible.completeBibleDescription')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Study View - No Book Selected */}
        {viewMode === "study" && !selectedBook && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">{t('imageBible.selectBookToStudy')}</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {t('imageBible.selectBookDescription')}
            </p>
            <Button onClick={() => setViewMode("browse")} variant="default" size="lg">
              <Layers className="h-5 w-5 mr-2" />
              {t('imageBible.browseBooks')}
            </Button>
          </div>
        )}

        {/* Study View */}
        {viewMode === "study" && selectedBook && currentChapter && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={exitStudyMode}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('imageBible.backToBooks')}
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
                  {memoryTestMode ? t('imageBible.show') : t('imageBible.test')}
                </Button>
              </div>
              <Button variant="outline" onClick={() => setIsFullscreen(true)}>
                <Maximize2 className="h-4 w-4 mr-2" />
                {t('imageBible.fullscreen')}
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
                dynamicImageUrl={getChapterImageUrl(imageMap, currentChapter.book, currentChapter.chapter)}
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
                {t('imageBible.previous')}
              </Button>
              <Button
                onClick={() => setIsFlipped(!isFlipped)}
                variant="default"
                size="lg"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('imageBible.flipCard')}
              </Button>
              <Button
                onClick={goToNext}
                disabled={currentChapterIndex === currentChapters.length - 1}
                variant="outline"
                size="lg"
              >
                {t('imageBible.next')}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>

            {/* Chapter Quick Select */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('imageBible.jumpToChapter')}</CardTitle>
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

        {/* Grid View - At a Glance with generated images */}
        {viewMode === "grid" && (
          <div className="space-y-8">
            {imageBibleBooks.map((book) => (
              <div key={book.name}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold">{book.name}</h2>
                  <Badge variant="outline">{t('imageBible.chaptersCount', { count: book.totalChapters })}</Badge>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                  {book.chapters.map((chapter) => {
                    const imageUrl = getChapterImageUrl(imageMap, chapter.book, chapter.chapter);
                    return (
                      <div
                        key={`${book.name}-${chapter.chapter}`}
                        className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform hover:shadow-lg group relative overflow-hidden"
                        onClick={() => selectChapter(chapter)}
                        title={`${chapter.book} ${chapter.chapter}: ${chapter.theme}`}
                      >
                        {imageUrl ? (
                          <>
                            <img
                              src={imageUrl}
                              alt={`${chapter.book} ${chapter.chapter}`}
                              className="w-full h-full object-cover absolute inset-0"
                            />
                            <span className="absolute bottom-0.5 right-1 text-[10px] sm:text-xs font-bold text-white bg-black/60 px-1 rounded">
                              {chapter.chapter}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform leading-none">
                              {chapter.visualIcon}
                            </span>
                            <span className="text-[10px] sm:text-xs font-medium mt-0.5">{chapter.chapter}</span>
                          </>
                        )}

                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                          {chapter.theme}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Test Mode */}
        {viewMode === "test" && (
          <div className="space-y-6">
            {showTestSetup && !testSession && (
              <>
                {/* Test Setup */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Target className="h-7 w-7 text-primary" />
                      {t('imageBible.testYourMemory')}
                    </CardTitle>
                    <CardDescription>
                      {t('imageBible.testDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Quick Selection Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllBooks}>
                        {t('imageBible.selectAll')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={selectOTBooks}>
                        {t('imageBible.oldTestament')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={selectNTBooks}>
                        {t('imageBible.newTestament')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearBookSelection}>
                        {t('imageBible.clearAll')}
                      </Button>
                    </div>

                    {/* Book Selection Grid */}
                    <div>
                      <h4 className="font-semibold mb-3">{t('imageBible.selectBooks')}</h4>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {imageBibleBooks.map((book) => (
                          <div
                            key={book.name}
                            className={`p-2 rounded-lg border cursor-pointer transition-all text-center ${
                              selectedBooksForTest.includes(book.name)
                                ? "bg-primary/10 border-primary"
                                : "bg-background hover:bg-muted"
                            }`}
                            onClick={() => toggleBookForTest(book.name)}
                          >
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Checkbox
                                checked={selectedBooksForTest.includes(book.name)}
                                className="pointer-events-none"
                              />
                            </div>
                            <div className="text-xs font-medium truncate">{book.name}</div>
                            <div className="text-[10px] text-muted-foreground">{book.totalChapters} ch</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chapter Range */}
                    <div>
                      <h4 className="font-semibold mb-3">{t('imageBible.chapterRangeOptional')}</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('imageBible.from')}</span>
                          <Input
                            type="number"
                            min={1}
                            max={150}
                            value={chapterRange.start}
                            onChange={(e) => setChapterRange({ ...chapterRange, start: parseInt(e.target.value) || 1 })}
                            className="w-20"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{t('imageBible.to')}</span>
                          <Input
                            type="number"
                            min={1}
                            max={150}
                            value={chapterRange.end}
                            onChange={(e) => setChapterRange({ ...chapterRange, end: parseInt(e.target.value) || 150 })}
                            className="w-20"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('imageBible.chapterRangeHelp')}
                      </p>
                    </div>

                    {/* Test Info */}
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{t('imageBible.testSummary')}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('imageBible.testSummaryDetail', { books: selectedBooksForTest.length, chapters: testChaptersCount })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startTest(true)}
                            disabled={testChaptersCount === 0}
                            className="gap-2"
                          >
                            <Shuffle className="h-4 w-4" />
                            {t('imageBible.startShuffled')}
                          </Button>
                          <Button
                            onClick={() => startTest(false)}
                            disabled={testChaptersCount === 0}
                            variant="outline"
                            className="gap-2"
                          >
                            <Play className="h-4 w-4" />
                            {t('imageBible.startInOrder')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Tips */}
                <Card className="bg-amber-50 dark:bg-amber-900/20">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="h-5 w-5 text-amber-600" />
                      {t('imageBible.testTips')}
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>{t('imageBible.testTip1')}</li>
                      <li>{t('imageBible.testTip2')}</li>
                      <li>{t('imageBible.testTip3')}</li>
                      <li>{t('imageBible.testTip4')}</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Active Test */}
            {testSession && !testSession.isComplete && (
              <div className="space-y-6">
                {/* Progress Header */}
                <Card>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="text-lg px-3 py-1">
                          {testSession.currentIndex + 1} / {testSession.chapters.length}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-green-600 font-medium">{testSession.correct}</span>
                          <XCircle className="h-4 w-4 text-red-500 ml-2" />
                          <span className="text-red-600 font-medium">{testSession.incorrect}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={resetTest}>
                        {t('imageBible.endTest')}
                      </Button>
                    </div>
                    <Progress
                      value={(testSession.currentIndex / testSession.chapters.length) * 100}
                      className="h-2"
                    />
                  </CardContent>
                </Card>

                {/* Test Flashcard */}
                <div className="max-w-lg mx-auto">
                  <Flashcard
                    chapter={testSession.chapters[testSession.currentIndex]}
                    isFlipped={testIsFlipped}
                    onFlip={() => setTestIsFlipped(!testIsFlipped)}
                    size="large"
                    memoryTestMode={!testIsFlipped}
                    hideReference={!testIsFlipped}
                    dynamicImageUrl={getChapterImageUrl(
                      imageMap,
                      testSession.chapters[testSession.currentIndex].book,
                      testSession.chapters[testSession.currentIndex].chapter
                    )}
                  />
                </div>

                {/* Test Controls */}
                <div className="flex items-center justify-center gap-4">
                  {!testIsFlipped ? (
                    <Button onClick={() => setTestIsFlipped(true)} size="lg" className="px-8">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      {t('imageBible.revealAnswer')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => markTestAnswer(false)}
                        variant="outline"
                        size="lg"
                        className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <XCircle className="h-5 w-5 mr-2" />
                        {t('imageBible.incorrect')}
                      </Button>
                      <Button
                        onClick={() => markTestAnswer(true)}
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        {t('imageBible.correct')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Test Results */}
            {testSession?.isComplete && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <CardContent className="py-8 text-center">
                    <Trophy className="h-16 w-16 mx-auto mb-4 text-amber-500" />
                    <h2 className="text-3xl font-bold mb-2">{t('imageBible.testComplete')}</h2>
                    <div className="flex items-center justify-center gap-6 mt-4">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-green-600">{testSession.correct}</div>
                        <div className="text-sm text-muted-foreground">{t('imageBible.correct')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-red-600">{testSession.incorrect}</div>
                        <div className="text-sm text-muted-foreground">{t('imageBible.incorrect')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">
                          {Math.round((testSession.correct / testSession.chapters.length) * 100)}%
                        </div>
                        <div className="text-sm text-muted-foreground">{t('imageBible.score')}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <Button onClick={resetTest} variant="outline" size="lg">
                        {t('imageBible.newTest')}
                      </Button>
                      <Button onClick={() => startTest(true)} size="lg">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        {t('imageBible.retrySameTest')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Missed Questions */}
                {testSession.answers.filter(a => !a.correct).length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        {t('imageBible.reviewMissedQuestions')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {testSession.answers
                          .filter(a => !a.correct)
                          .map((answer, idx) => {
                            const missedImageUrl = getChapterImageUrl(imageMap, answer.chapter.book, answer.chapter.chapter);
                            return (
                              <div
                                key={idx}
                                className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center"
                              >
                                {missedImageUrl ? (
                                  <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden">
                                    <img
                                      src={missedImageUrl}
                                      alt={`${answer.chapter.book} ${answer.chapter.chapter}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="text-3xl mb-2">{answer.chapter.visualIcon}</div>
                                )}
                                <div className="text-sm font-medium">{answer.chapter.book} {answer.chapter.chapter}</div>
                                <div className="text-xs text-muted-foreground truncate">{answer.chapter.theme}</div>
                              </div>
                            );
                          })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tips Card (not shown in test mode) */}
        {viewMode !== "test" && (
          <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                {t('imageBible.memoryTips')}
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>{t('imageBible.memoryTip1')}</li>
                <li>{t('imageBible.memoryTip2')}</li>
                <li>{t('imageBible.memoryTip3')}</li>
                <li>{t('imageBible.memoryTip4')}</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
