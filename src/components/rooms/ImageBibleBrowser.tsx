import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
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
  ArrowLeft,
} from "lucide-react";
import {
  imageBibleBooks,
  getTotalChapters,
  getBookByName,
  searchChapters,
  type ChapterCard,
  type BookData,
} from "@/data/imageBibleData";
import { motion } from "framer-motion";
import { useImageBibleImages, getChapterImageUrl } from "@/hooks/useImageBibleImages";

interface ImageBibleBrowserProps {
  onClose?: () => void;
}

// Flashcard Component
function Flashcard({
  chapter,
  isFlipped,
  onFlip,
  size = "normal",
  memoryTestMode = false,
  dynamicImageUrl,
  hideReference = false,
}: {
  chapter: ChapterCard;
  isFlipped: boolean;
  onFlip: () => void;
  size?: "normal" | "large";
  memoryTestMode?: boolean;
  dynamicImageUrl?: string;
  hideReference?: boolean;
}) {
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
        {/* Front */}
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

        {/* Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-6 flex flex-col text-white shadow-2xl"
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

// Test Session type
interface TestSession {
  chapters: ChapterCard[];
  currentIndex: number;
  correct: number;
  incorrect: number;
  answers: { chapter: ChapterCard; correct: boolean }[];
  isComplete: boolean;
}

export function ImageBibleBrowser({ onClose }: ImageBibleBrowserProps) {
  const { t } = useTranslation();
  const [selectedBook, setSelectedBook] = useState<BookData | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<"browse" | "study" | "grid" | "test">("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [memoryTestMode, setMemoryTestMode] = useState(false);

  // Test Mode State
  const [selectedBooksForTest, setSelectedBooksForTest] = useState<string[]>([]);
  const [chapterRange, setChapterRange] = useState<{ start: number; end: number }>({ start: 1, end: 150 });
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [testIsFlipped, setTestIsFlipped] = useState(false);
  const [showTestSetup, setShowTestSetup] = useState(true);

  const { data: imageMap } = useImageBibleImages();
  const totalChapters = getTotalChapters();

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    return searchChapters(searchQuery);
  }, [searchQuery]);

  const currentChapters = selectedBook?.chapters || [];
  const currentChapter = currentChapters[currentChapterIndex];

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

  // Test functions
  const toggleBookForTest = (bookName: string) => {
    setSelectedBooksForTest(prev =>
      prev.includes(bookName) ? prev.filter(b => b !== bookName) : [...prev, bookName]
    );
  };

  const selectAllBooks = () => setSelectedBooksForTest(imageBibleBooks.map(b => b.name));
  const selectOTBooks = () => setSelectedBooksForTest(imageBibleBooks.filter(b => b.testament === "OT").map(b => b.name));
  const selectNTBooks = () => setSelectedBooksForTest(imageBibleBooks.filter(b => b.testament === "NT").map(b => b.name));
  const clearBookSelection = () => setSelectedBooksForTest([]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startTest = (shuffle: boolean = true) => {
    let chapters: ChapterCard[] = [];
    selectedBooksForTest.forEach(bookName => {
      const book = imageBibleBooks.find(b => b.name === bookName);
      if (book) {
        chapters = [...chapters, ...book.chapters.filter(
          c => c.chapter >= chapterRange.start && c.chapter <= chapterRange.end
        )];
      }
    });
    if (chapters.length === 0) return;
    setTestSession({
      chapters: shuffle ? shuffleArray(chapters) : chapters,
      currentIndex: 0, correct: 0, incorrect: 0, answers: [], isComplete: false,
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
          <Button onClick={goToPrev} disabled={currentChapterIndex === 0} variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            <ChevronLeft className="h-6 w-6 mr-2" />
            {t('imageBible.previous')}
          </Button>
          <Button onClick={() => setIsFlipped(!isFlipped)} variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            <RotateCcw className="h-5 w-5 mr-2" />
            {t('imageBible.flipCard')}
          </Button>
          <Button onClick={goToNext} disabled={currentChapterIndex === currentChapters.length - 1} variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
            {t('imageBible.next')}
            <ChevronRight className="h-6 w-6 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              {t('imageBible.title')}
            </CardTitle>
            <CardDescription>
              {t('imageBible.chaptersCount', { count: totalChapters })} &mdash; {t('imageBible.subtitle')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse" className="flex items-center gap-1 text-xs">
              <Layers className="h-3.5 w-3.5" />
              {t('imageBible.browse')}
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-1 text-xs">
              <Eye className="h-3.5 w-3.5" />
              {t('imageBible.study')}
            </TabsTrigger>
            <TabsTrigger value="grid" className="flex items-center gap-1 text-xs">
              <Grid3X3 className="h-3.5 w-3.5" />
              {t('imageBible.atAGlance')}
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-1 text-xs">
              <Target className="h-3.5 w-3.5" />
              {t('imageBible.test')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Browse View */}
        {viewMode === "browse" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('imageBible.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {searchResults.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {searchResults.slice(0, 8).map((chapter) => (
                  <Card
                    key={`${chapter.book}-${chapter.chapter}`}
                    className="cursor-pointer hover:scale-105 transition-all"
                    onClick={() => selectChapter(chapter)}
                  >
                    <CardContent className="p-3 text-center">
                      <div className="text-3xl mb-1">{chapter.visualIcon}</div>
                      <div className="text-xs font-medium truncate">{chapter.book} {chapter.chapter}</div>
                      <div className="text-xs text-muted-foreground truncate">{chapter.theme}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {searchResults.length === 0 && (
              <ScrollArea className="h-[500px]">
                <div className="grid md:grid-cols-2 gap-4 pr-4">
                  {imageBibleBooks.map((book) => (
                    <Card
                      key={book.name}
                      className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                      onClick={() => startStudyMode(book)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={book.testament === "OT" ? "secondary" : "default"}>
                            {book.testament === "OT" ? t('imageBible.oldTestament') : t('imageBible.newTestament')}
                          </Badge>
                          <Badge variant="outline">{book.totalChapters} ch</Badge>
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          {book.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-6 gap-1.5 mb-3">
                          {book.chapters.slice(0, 6).map((chapter) => {
                            const imageUrl = getChapterImageUrl(imageMap, chapter.book, chapter.chapter);
                            return (
                              <div
                                key={chapter.chapter}
                                className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg flex items-center justify-center overflow-hidden"
                                title={`${chapter.book} ${chapter.chapter}: ${chapter.theme}`}
                              >
                                {imageUrl ? (
                                  <img src={imageUrl} alt={`${chapter.book} ${chapter.chapter}`} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-lg">{chapter.visualIcon}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        <Button className="w-full" variant="outline" size="sm">
                          <Eye className="h-3.5 w-3.5 mr-2" />
                          {t('imageBible.studyThisBook')}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}

        {/* Study View - No Book */}
        {viewMode === "study" && !selectedBook && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('imageBible.selectBookToStudy')}</h2>
            <p className="text-muted-foreground mb-4 text-sm">{t('imageBible.selectBookDescription')}</p>
            <Button onClick={() => setViewMode("browse")} variant="default">
              <Layers className="h-4 w-4 mr-2" />
              {t('imageBible.browseBooks')}
            </Button>
          </div>
        )}

        {/* Study View - Book Selected */}
        {viewMode === "study" && selectedBook && currentChapter && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={exitStudyMode}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedBook.name}</Badge>
                <Badge>{currentChapterIndex + 1} / {currentChapters.length}</Badge>
                <Button
                  variant={memoryTestMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setMemoryTestMode(!memoryTestMode)}
                >
                  {memoryTestMode ? <Eye className="h-3.5 w-3.5 mr-1" /> : <EyeOff className="h-3.5 w-3.5 mr-1" />}
                  {memoryTestMode ? t('imageBible.show') : t('imageBible.test')}
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsFullscreen(true)}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>

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

            <div className="flex items-center justify-center gap-3">
              <Button onClick={goToPrev} disabled={currentChapterIndex === 0} variant="outline">
                <ChevronLeft className="h-5 w-5 mr-1" />
                {t('imageBible.previous')}
              </Button>
              <Button onClick={() => setIsFlipped(!isFlipped)} variant="default">
                <RotateCcw className="h-4 w-4 mr-1" />
                {t('imageBible.flipCard')}
              </Button>
              <Button onClick={goToNext} disabled={currentChapterIndex === currentChapters.length - 1} variant="outline">
                {t('imageBible.next')}
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </div>

            <ScrollArea className="h-20">
              <div className="flex flex-wrap gap-1.5">
                {currentChapters.map((chapter, index) => (
                  <Button
                    key={chapter.chapter}
                    variant={index === currentChapterIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setCurrentChapterIndex(index); setIsFlipped(false); }}
                    className="w-10 h-8 text-xs"
                  >
                    {chapter.chapter}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <ScrollArea className="h-[500px]">
            <div className="space-y-6 pr-4">
              {imageBibleBooks.map((book) => (
                <div key={book.name}>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{book.name}</h3>
                    <Badge variant="outline" className="text-xs">{book.totalChapters}</Badge>
                  </div>
                  <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
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
                              <img src={imageUrl} alt={`${chapter.book} ${chapter.chapter}`} className="w-full h-full object-cover absolute inset-0" />
                              <span className="absolute bottom-0.5 right-1 text-[10px] font-bold text-white bg-black/60 px-1 rounded">
                                {chapter.chapter}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg group-hover:scale-110 transition-transform leading-none">
                                {chapter.visualIcon}
                              </span>
                              <span className="text-[10px] font-medium mt-0.5">{chapter.chapter}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Test Mode */}
        {viewMode === "test" && (
          <div className="space-y-4">
            {showTestSetup && !testSession && (
              <>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={selectAllBooks}>{t('imageBible.selectAll')}</Button>
                  <Button variant="outline" size="sm" onClick={selectOTBooks}>{t('imageBible.oldTestament')}</Button>
                  <Button variant="outline" size="sm" onClick={selectNTBooks}>{t('imageBible.newTestament')}</Button>
                  <Button variant="outline" size="sm" onClick={clearBookSelection}>{t('imageBible.clearAll')}</Button>
                </div>

                <ScrollArea className="h-48">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pr-4">
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
                          <Checkbox checked={selectedBooksForTest.includes(book.name)} className="pointer-events-none" />
                        </div>
                        <div className="text-xs font-medium truncate">{book.name}</div>
                        <div className="text-[10px] text-muted-foreground">{book.totalChapters} ch</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('imageBible.from')}</span>
                    <Input type="number" min={1} max={150} value={chapterRange.start} onChange={(e) => setChapterRange({ ...chapterRange, start: parseInt(e.target.value) || 1 })} className="w-20" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{t('imageBible.to')}</span>
                    <Input type="number" min={1} max={150} value={chapterRange.end} onChange={(e) => setChapterRange({ ...chapterRange, end: parseInt(e.target.value) || 150 })} className="w-20" />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedBooksForTest.length} books, {testChaptersCount} chapters
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => startTest(true)} disabled={testChaptersCount === 0} size="sm" className="gap-1">
                      <Shuffle className="h-3.5 w-3.5" />
                      Shuffled
                    </Button>
                    <Button onClick={() => startTest(false)} disabled={testChaptersCount === 0} variant="outline" size="sm" className="gap-1">
                      <Play className="h-3.5 w-3.5" />
                      In Order
                    </Button>
                  </div>
                </div>
              </>
            )}

            {/* Active Test */}
            {testSession && !testSession.isComplete && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{testSession.currentIndex + 1} / {testSession.chapters.length}</Badge>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">{testSession.correct}</span>
                      <XCircle className="h-4 w-4 text-red-500 ml-1" />
                      <span className="text-red-600 font-medium">{testSession.incorrect}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={resetTest}>{t('imageBible.endTest')}</Button>
                </div>
                <Progress value={(testSession.currentIndex / testSession.chapters.length) * 100} className="h-2" />

                <div className="max-w-lg mx-auto">
                  <Flashcard
                    chapter={testSession.chapters[testSession.currentIndex]}
                    isFlipped={testIsFlipped}
                    onFlip={() => setTestIsFlipped(!testIsFlipped)}
                    size="large"
                    memoryTestMode={!testIsFlipped}
                    hideReference={!testIsFlipped}
                    dynamicImageUrl={getChapterImageUrl(imageMap, testSession.chapters[testSession.currentIndex].book, testSession.chapters[testSession.currentIndex].chapter)}
                  />
                </div>

                <div className="flex items-center justify-center gap-3">
                  {!testIsFlipped ? (
                    <Button onClick={() => setTestIsFlipped(true)} size="lg">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      {t('imageBible.revealAnswer')}
                    </Button>
                  ) : (
                    <>
                      <Button onClick={() => markTestAnswer(false)} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <XCircle className="h-5 w-5 mr-1" />
                        {t('imageBible.incorrect')}
                      </Button>
                      <Button onClick={() => markTestAnswer(true)} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        {t('imageBible.correct')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Test Results */}
            {testSession?.isComplete && (
              <div className="text-center space-y-4">
                <Trophy className="h-12 w-12 mx-auto text-amber-500" />
                <h2 className="text-2xl font-bold">{t('imageBible.testComplete')}</h2>
                <div className="flex items-center justify-center gap-6">
                  <div><div className="text-3xl font-bold text-green-600">{testSession.correct}</div><div className="text-xs text-muted-foreground">{t('imageBible.correct')}</div></div>
                  <div><div className="text-3xl font-bold text-red-600">{testSession.incorrect}</div><div className="text-xs text-muted-foreground">{t('imageBible.incorrect')}</div></div>
                  <div><div className="text-3xl font-bold text-primary">{Math.round((testSession.correct / testSession.chapters.length) * 100)}%</div><div className="text-xs text-muted-foreground">{t('imageBible.score')}</div></div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Button onClick={resetTest} variant="outline">{t('imageBible.newTest')}</Button>
                  <Button onClick={() => startTest(true)}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    {t('imageBible.retrySameTest')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
