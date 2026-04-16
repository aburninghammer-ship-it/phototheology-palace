import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { fetchChapter, Translation } from "@/services/bibleApi";
import { Chapter, BIBLE_BOOKS } from "@/types/bible";
import { InterlinearPanel } from "@/components/bible/research/InterlinearPanel";
import { ResearchToolsNav } from "@/components/bible/research/ResearchToolsNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Languages, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const InterlinearBible = () => {
  const { book = "Genesis", chapter: chapterParam = "1" } = useParams();
  const navigate = useNavigate();
  const chapter = parseInt(chapterParam);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchChapter(book, chapter, "kjv" as Translation);
        setChapterData(data);
      } catch (err) {
        console.error("Failed to load chapter:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [book, chapter]);

  const navigateChapter = (dir: "prev" | "next") => {
    const newChapter = dir === "prev" ? chapter - 1 : chapter + 1;
    if (newChapter >= 1) {
      navigate(`/interlinear/${book}/${newChapter}`);
      setSelectedVerse(1);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Interlinear Bible — ${book} ${chapter} | Phototheology`}</title>
        <meta name="description" content={`Word-by-word Hebrew/Greek interlinear analysis of ${book} ${chapter} with Strong's numbers and transliterations.`} />
      </Helmet>

      <div className={cn(
        "h-screen flex flex-col",
        isDark ? "bg-[hsl(225,40%,8%)]" : "bg-gradient-to-br from-slate-50 via-amber-50/20 to-white"
      )}>
        {/* Header */}
        <div className={cn(
          "h-14 border-b flex items-center justify-between px-4 shrink-0 backdrop-blur-xl",
          isDark
            ? "border-[hsl(32,70%,45%)/0.3] bg-[hsl(230,35%,12%)/0.95]"
            : "border-amber-200/50 bg-white/90"
        )}>
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)]">
              <Languages className="h-4 w-4 text-white" />
            </div>
            <h1 className={cn(
              "font-serif text-xl font-semibold",
              isDark ? "text-[hsl(45,80%,70%)]" : "text-amber-900"
            )}>
              Interlinear Bible
            </h1>

            <Select value={book} onValueChange={(b) => navigate(`/interlinear/${b}/1`)}>
              <SelectTrigger className="w-40 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {BIBLE_BOOKS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className={cn("font-semibold", isDark ? "text-[hsl(45,60%,65%)]" : "text-amber-700")}>
              Chapter {chapter}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateChapter("prev")} disabled={chapter <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateChapter("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate(`/bible/${book}/${chapter}`)}>
              <BookOpen className="h-4 w-4 mr-1" />
              Normal View
            </Button>
          </div>
          <ResearchToolsNav />
        </div>

        {/* Content */}
        <ScrollArea className="flex-1">
          <InterlinearPanel
            verses={chapterData?.verses || []}
            selectedVerse={selectedVerse}
            onVerseSelect={setSelectedVerse}
            loading={loading}
            book={book}
            chapter={chapter}
          />
        </ScrollArea>
      </div>
    </>
  );
};

export default InterlinearBible;
