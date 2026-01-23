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
    <div className="p-3 space-y-1">
      {verses.map((verse) => {
        const isSelected = selectedVerse === verse.verse;
        
        return (
          <div
            key={verse.verse}
            className={cn(
              "flex gap-2 p-2 rounded-md cursor-pointer transition-colors text-sm leading-relaxed",
              isSelected 
                ? "bg-primary/15 border border-primary/30" 
                : "hover:bg-muted/50"
            )}
            onClick={() => onVerseSelect(verse.verse)}
          >
            <span 
              className={cn(
                "font-semibold shrink-0 w-8 text-right",
                isSelected ? "text-primary" : "text-primary/70"
              )}
            >
              {verse.verse}
            </span>
            <span className={cn(
              "flex-1",
              isSelected && "font-medium"
            )}>
              {verse.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
