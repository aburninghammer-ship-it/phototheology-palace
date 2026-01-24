import { useState, useEffect } from "react";
import { Verse } from "@/types/bible";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getVerseWithStrongs, getStrongsEntry, StrongsEntry } from "@/services/strongsApi";
import { Loader2 } from "lucide-react";

interface ResearchVersesPanelProps {
  verses: Verse[];
  selectedVerse: number | null;
  onVerseSelect: (verse: number) => void;
  loading?: boolean;
  translation?: string;
  book?: string;
  chapter?: number;
}

interface StrongsWord {
  text: string;
  strongs?: string;
}

// Component for a clickable word with Strong's popup
const StrongsWordPopup = ({
  word,
  isHebrew
}: {
  word: StrongsWord;
  isHebrew: boolean;
}) => {
  const [entry, setEntry] = useState<StrongsEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchEntry = async () => {
    if (!word.strongs || entry) return;
    setLoading(true);
    try {
      const data = await getStrongsEntry(word.strongs);
      setEntry(data);
    } catch (error) {
      console.error("Failed to fetch Strong's entry:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && word.strongs && !entry) {
      fetchEntry();
    }
  }, [open]);

  if (!word.strongs) {
    return <span className="mx-0.5">{word.text}</span>;
  }

  const colorClass = isHebrew
    ? "text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
    : "text-teal-400 hover:text-teal-300 hover:bg-teal-500/20";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "mx-0.5 px-1 py-0.5 rounded-md cursor-pointer transition-all underline decoration-dotted underline-offset-4",
            colorClass
          )}
        >
          {word.text}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-80 p-4 border-2 backdrop-blur-xl",
          isHebrew
            ? "bg-purple-950/95 border-purple-500/50 shadow-lg shadow-purple-500/20"
            : "bg-teal-950/95 border-teal-500/50 shadow-lg shadow-teal-500/20"
        )}
        side="top"
      >
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : entry ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={cn(
                "font-mono text-sm",
                isHebrew ? "bg-purple-500 text-white" : "bg-teal-500 text-white"
              )}>
                {entry.number}
              </Badge>
              <Badge variant="outline" className={cn(
                "text-xs",
                isHebrew ? "border-purple-400 text-purple-300" : "border-teal-400 text-teal-300"
              )}>
                {entry.language}
              </Badge>
            </div>
            <div className="text-center py-2">
              <p className="text-3xl font-serif">{entry.word}</p>
              <p className="text-sm text-muted-foreground italic mt-1">
                {entry.transliteration} ({entry.pronunciation})
              </p>
            </div>
            <div className="border-t border-white/10 pt-3">
              <p className="text-sm text-foreground/90 leading-relaxed">{entry.definition}</p>
            </div>
            {entry.usage && entry.usage.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {entry.usage.slice(0, 5).map((u, i) => (
                  <Badge key={i} variant="outline" className="text-xs bg-white/5">
                    {u}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p className="font-mono text-lg mb-2">{word.strongs}</p>
            <p className="text-sm">Definition not found</p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export const ResearchVersesPanel = ({
  verses,
  selectedVerse,
  onVerseSelect,
  loading = false,
  translation = "kjv",
  book = "",
  chapter = 1
}: ResearchVersesPanelProps) => {
  const [strongsData, setStrongsData] = useState<Record<number, StrongsWord[]>>({});
  const [loadingStrongs, setLoadingStrongs] = useState<Record<number, boolean>>({});
  const isKJVS = translation === "kjvs";

  // Determine if book is Old Testament (Hebrew) or New Testament (Greek)
  const oldTestamentBooks = [
    'genesis', 'exodus', 'leviticus', 'numbers', 'deuteronomy',
    'joshua', 'judges', 'ruth', '1 samuel', '2 samuel', '1 kings', '2 kings',
    '1 chronicles', '2 chronicles', 'ezra', 'nehemiah', 'esther', 'job',
    'psalm', 'psalms', 'proverbs', 'ecclesiastes', 'song of solomon',
    'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel',
    'hosea', 'joel', 'amos', 'obadiah', 'jonah', 'micah', 'nahum',
    'habakkuk', 'zephaniah', 'haggai', 'zechariah', 'malachi'
  ];
  const isHebrew = oldTestamentBooks.includes(book.toLowerCase());

  // Fetch Strong's data for a verse
  const fetchStrongsForVerse = async (verseNum: number) => {
    if (strongsData[verseNum] || loadingStrongs[verseNum]) return;

    setLoadingStrongs(prev => ({ ...prev, [verseNum]: true }));
    try {
      const data = await getVerseWithStrongs(book, chapter, verseNum);
      if (data && data.words) {
        setStrongsData(prev => ({ ...prev, [verseNum]: data.words }));
      }
    } catch (error) {
      console.error(`Failed to fetch Strong's for ${book} ${chapter}:${verseNum}`, error);
    } finally {
      setLoadingStrongs(prev => ({ ...prev, [verseNum]: false }));
    }
  };

  // Fetch Strong's data when in KJVS mode
  useEffect(() => {
    if (isKJVS && verses.length > 0) {
      // Fetch first 10 verses initially
      verses.slice(0, 10).forEach(verse => {
        fetchStrongsForVerse(verse.verse);
      });
    }
  }, [isKJVS, book, chapter, verses]);

  // Fetch more as user scrolls/selects
  useEffect(() => {
    if (isKJVS && selectedVerse) {
      // Fetch selected verse and surrounding verses
      const versesToFetch = [selectedVerse - 1, selectedVerse, selectedVerse + 1].filter(v => v > 0);
      versesToFetch.forEach(v => fetchStrongsForVerse(v));
    }
  }, [selectedVerse, isKJVS]);

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton className="h-4 w-8 shrink-0" />
            <Skeleton className="h-4 flex-1" />
          </div>
        ))}
      </div>
    );
  }

  if (!verses.length) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm">
        No verses found
      </div>
    );
  }

  return (
    <div className="p-3 space-y-1.5">
      {/* KJVS Mode Info Banner */}
      {isKJVS && (
        <div className={cn(
          "mb-4 p-3 rounded-xl border text-xs",
          isHebrew
            ? "bg-purple-500/10 border-purple-500/30 text-purple-300"
            : "bg-teal-500/10 border-teal-500/30 text-teal-300"
        )}>
          <span className="font-semibold">Strong's Mode:</span> Click any{" "}
          <span className={cn(
            "underline decoration-dotted",
            isHebrew ? "text-purple-400" : "text-teal-400"
          )}>
            highlighted word
          </span>{" "}
          to see its {isHebrew ? "Hebrew" : "Greek"} definition
        </div>
      )}

      {verses.map((verse) => {
        const isSelected = selectedVerse === verse.verse;
        const words = strongsData[verse.verse];
        const isLoadingVerse = loadingStrongs[verse.verse];

        return (
          <div
            key={verse.verse}
            className={cn(
              "group flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 text-sm leading-relaxed",
              isSelected
                ? "bg-gradient-to-r from-palace-blue/20 via-palace-purple/15 to-palace-teal/20 border border-palace-blue/40 shadow-md shadow-palace-blue/10"
                : "hover:bg-palace-purple/10 hover:border-palace-purple/20 border border-transparent"
            )}
            onClick={() => onVerseSelect(verse.verse)}
          >
            <span
              className={cn(
                "font-bold shrink-0 w-8 text-right font-serif",
                isSelected
                  ? "bg-gradient-palace bg-clip-text text-transparent"
                  : "text-palace-purple/70 group-hover:text-palace-purple"
              )}
            >
              {verse.verse}
            </span>
            <span className={cn(
              "flex-1 font-serif flex flex-wrap items-baseline",
              isSelected && "font-medium text-foreground"
            )}>
              {isKJVS && words ? (
                // Render clickable words with Strong's popups
                words.map((word, idx) => (
                  <StrongsWordPopup
                    key={idx}
                    word={word}
                    isHebrew={isHebrew}
                  />
                ))
              ) : isKJVS && isLoadingVerse ? (
                // Loading state for Strong's
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading Strong's data...
                </span>
              ) : (
                // Regular text display
                verse.text
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};
