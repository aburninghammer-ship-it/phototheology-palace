import { Verse } from "@/types/bible";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ResearchVersesPanelProps {
  verses: Verse[];
  selectedVerse: number | null;
  onVerseSelect: (verse: number) => void;
  loading?: boolean;
}

export const ResearchVersesPanel = ({
  verses,
  selectedVerse,
  onVerseSelect,
  loading = false
}: ResearchVersesPanelProps) => {
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
      {verses.map((verse) => {
        const isSelected = selectedVerse === verse.verse;
        
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
              "flex-1 font-serif",
              isSelected && "font-medium text-foreground"
            )}>
              {verse.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
