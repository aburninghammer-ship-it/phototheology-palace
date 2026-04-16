import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Verse } from "@/types/bible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Languages, BookOpen, Info, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InterlinearWord {
  original: string;
  transliteration: string;
  strongs: string;
  pos: string;
  english: string;
  definition: string;
}

interface InterlinearData {
  language: string;
  direction: string;
  words: InterlinearWord[];
}

interface InterlinearPanelProps {
  verses: Verse[];
  selectedVerse: number | null;
  onVerseSelect: (verse: number) => void;
  loading?: boolean;
  book: string;
  chapter: number;
}

// Cache interlinear results in memory
const interlinearCache = new Map<string, InterlinearData>();

const InterlinearWordBlock = ({ word, isDark }: { word: InterlinearWord; isDark: boolean }) => {
  const navigate = useNavigate();

  const handleStrongsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (word.strongs) {
      navigate(`/bible-lexicon?q=${encodeURIComponent(word.strongs)}`);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "flex flex-col items-center px-2 py-2 rounded-lg border cursor-pointer transition-all hover:scale-105",
            isDark
              ? "bg-[hsl(230,30%,15%)/0.8] border-[hsl(32,60%,50%)/0.3] hover:border-[hsl(32,70%,55%)/0.6] hover:shadow-[0_0_12px_hsl(32,80%,50%/0.3)]"
              : "bg-white/80 border-amber-200/60 hover:border-amber-400 hover:shadow-md shadow-amber-100/50"
          )}>
            {/* Original language word */}
            <span className={cn(
              "text-lg font-bold leading-tight",
              isDark ? "text-[hsl(45,80%,75%)]" : "text-amber-900"
            )}>
              {word.original}
            </span>

            {/* Transliteration */}
            <span className={cn(
              "text-[11px] italic mt-0.5",
              isDark ? "text-[hsl(200,60%,65%)]" : "text-cyan-700"
            )}>
              {word.transliteration}
            </span>

            {/* English gloss */}
            <span className={cn(
              "text-xs font-medium mt-1 text-center leading-tight",
              isDark ? "text-[hsl(0,0%,80%)]" : "text-slate-700"
            )}>
              {word.english}
            </span>

            {/* Strong's number - clickable to Lexicon */}
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] mt-1 h-4 px-1.5 cursor-pointer hover:scale-110 transition-transform",
                isDark
                  ? "border-[hsl(142,50%,40%)/0.4] text-[hsl(142,55%,60%)] bg-[hsl(142,40%,20%)/0.2] hover:bg-[hsl(142,40%,25%)/0.4]"
                  : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
              )}
              onClick={handleStrongsClick}
            >
              {word.strongs} ↗
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className={cn(
          "max-w-xs p-3",
          isDark ? "bg-slate-900 border-amber-500/30" : "bg-white border-amber-200"
        )}>
          <div className="space-y-1">
            <p className="font-bold text-sm">{word.original} — {word.transliteration}</p>
            <p className="text-xs"><span className="font-semibold">Strong's:</span> {word.strongs}</p>
            <p className="text-xs"><span className="font-semibold">Part of Speech:</span> {word.pos}</p>
            <p className="text-xs"><span className="font-semibold">Definition:</span> {word.definition}</p>
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Click Strong's badge to open Lexicon
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const InterlinearVerse = ({
  verse,
  book,
  chapter,
  isSelected,
  onSelect,
  isDark,
}: {
  verse: Verse;
  book: string;
  chapter: number;
  isSelected: boolean;
  onSelect: () => void;
  isDark: boolean;
}) => {
  const [data, setData] = useState<InterlinearData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `${book}-${chapter}-${verse.verse}`;

  useEffect(() => {
    if (!isSelected) return;

    const cached = interlinearCache.get(cacheKey);
    if (cached) {
      setData(cached);
      return;
    }

    const fetchInterlinear = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: result, error: fnError } = await supabase.functions.invoke("interlinear-analysis", {
          body: { book, chapter, verse: verse.verse, verseText: verse.text },
        });

        if (fnError) throw fnError;
        if (result.error) throw new Error(result.error);

        const interlinearResult: InterlinearData = {
          language: result.language,
          direction: result.direction,
          words: result.words || [],
        };

        interlinearCache.set(cacheKey, interlinearResult);
        setData(interlinearResult);
      } catch (err: any) {
        console.error("Interlinear fetch error:", err);
        setError(err.message || "Failed to load interlinear data");
      } finally {
        setLoading(false);
      }
    };

    fetchInterlinear();
  }, [isSelected, cacheKey, book, chapter, verse.verse, verse.text]);

  return (
    <div
      className={cn(
        "p-4 border-b cursor-pointer transition-all duration-200",
        isSelected
          ? isDark
            ? "bg-[hsl(32,50%,20%)/0.2] border-[hsl(32,70%,50%)/0.4]"
            : "bg-amber-50/50 border-amber-200"
          : isDark
            ? "border-[hsl(230,30%,20%)/0.3] hover:bg-[hsl(230,30%,18%)/0.5]"
            : "border-slate-100 hover:bg-slate-50/50"
      )}
      onClick={onSelect}
    >
      {/* Verse number + KJV text */}
      <div className="flex gap-2 mb-2">
        <span className={cn(
          "font-serif font-bold text-sm flex-shrink-0 mt-0.5",
          isSelected
            ? isDark ? "text-[hsl(32,80%,60%)]" : "text-amber-600"
            : isDark ? "text-[hsl(0,0%,50%)]" : "text-slate-400"
        )}>
          {verse.verse}
        </span>
        <p className={cn(
          "text-sm leading-relaxed",
          isDark ? "text-[hsl(0,0%,75%)]" : "text-slate-600"
        )}>
          {verse.text}
        </p>
      </div>

      {/* Interlinear display */}
      {isSelected && (
        <div className="mt-3">
          {loading && (
            <div className="flex items-center justify-center py-6 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
              <span className={cn("text-sm", isDark ? "text-[hsl(45,60%,70%)]" : "text-amber-700")}>
                Loading interlinear data...
              </span>
            </div>
          )}

          {error && (
            <div className={cn(
              "p-3 rounded-lg text-sm text-center",
              isDark ? "bg-red-900/20 text-red-400" : "bg-red-50 text-red-600"
            )}>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  interlinearCache.delete(cacheKey);
                  setData(null);
                  setError(null);
                }}
              >
                Retry
              </Button>
            </div>
          )}

          {data && data.words.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Languages className={cn("h-4 w-4", isDark ? "text-[hsl(45,70%,65%)]" : "text-amber-600")} />
                <Badge className={cn(
                  "text-xs",
                  isDark
                    ? "bg-[hsl(32,60%,30%)/0.3] border-[hsl(32,60%,50%)/0.4] text-[hsl(45,70%,70%)]"
                    : "bg-amber-100 border-amber-300 text-amber-800"
                )}>
                  {data.language} Interlinear
                </Badge>
                {data.direction === "rtl" && (
                  <Badge variant="outline" className="text-[10px]">
                    ← Right to Left
                  </Badge>
                )}
              </div>

              <div className={cn(
                "flex flex-wrap gap-2",
                data.direction === "rtl" ? "flex-row-reverse" : "flex-row"
              )}>
                {data.words.map((word, idx) => (
                  <InterlinearWordBlock key={idx} word={word} isDark={isDark} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const InterlinearPanel = ({
  verses,
  selectedVerse,
  onVerseSelect,
  loading,
  book,
  chapter,
}: InterlinearPanelProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-2">
      {/* Info banner */}
      <div className={cn(
        "mx-2 mb-3 p-3 rounded-lg border flex items-start gap-2",
        isDark
          ? "bg-[hsl(200,40%,15%)/0.3] border-[hsl(200,60%,50%)/0.3]"
          : "bg-cyan-50/50 border-cyan-200"
      )}>
        <Info className={cn("h-4 w-4 mt-0.5 flex-shrink-0", isDark ? "text-[hsl(200,60%,60%)]" : "text-cyan-600")} />
        <p className={cn("text-xs", isDark ? "text-[hsl(200,50%,70%)]" : "text-cyan-700")}>
          Click any verse to load its word-by-word interlinear analysis. Click a <strong>Strong's badge</strong> to open the Lexicon for that word.
        </p>
      </div>

      {verses.map((verse) => (
        <InterlinearVerse
          key={verse.verse}
          verse={verse}
          book={book}
          chapter={chapter}
          isSelected={selectedVerse === verse.verse}
          onSelect={() => onVerseSelect(verse.verse)}
          isDark={isDark}
        />
      ))}
    </div>
  );
};
