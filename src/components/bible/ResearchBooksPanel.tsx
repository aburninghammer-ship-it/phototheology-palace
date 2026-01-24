import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ResearchBooksPanelProps {
  currentBook: string;
  currentChapter: number;
  onSelect: (book: string, chapter: number) => void;
  compact?: boolean;
}

export const ResearchBooksPanel = ({
  currentBook,
  currentChapter,
  onSelect,
  compact = false
}: ResearchBooksPanelProps) => {
  const [expandedBook, setExpandedBook] = useState<string | null>(currentBook);

  // OT books are positions 1-39, NT books are 40-66
  const otBooks = BIBLE_BOOK_METADATA.filter(b => b.position <= 39);
  const ntBooks = BIBLE_BOOK_METADATA.filter(b => b.position >= 40);

  const renderBookGroup = (books: typeof BIBLE_BOOK_METADATA, title: string) => (
    <div className="mb-2">
      <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
        {title}
      </div>
      {books.map((book) => {
        const isCurrentBook = book.name === currentBook;
        const isExpanded = expandedBook === book.name;
        
        return (
          <Collapsible 
            key={book.code} 
            open={isExpanded}
            onOpenChange={() => setExpandedBook(isExpanded ? null : book.name)}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "w-full justify-start h-7 text-xs font-normal px-2",
                  isCurrentBook && "bg-primary/10 text-primary font-medium"
                )}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3 mr-1 shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-1 shrink-0" />
                )}
                <span className="truncate">{compact ? book.code : book.name}</span>
                {!compact && (
                  <span className="ml-auto text-muted-foreground text-[10px]">
                    {book.chapters}
                  </span>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="pl-4 pr-2 py-1 flex flex-wrap gap-1">
                {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
                  <Button
                    key={ch}
                    variant={isCurrentBook && ch === currentChapter ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-6 w-7 p-0 text-xs",
                      isCurrentBook && ch === currentChapter && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onSelect(book.name, ch)}
                  >
                    {ch}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );

  return (
    <div className="py-1">
      {renderBookGroup(otBooks, "Old Testament")}
      {renderBookGroup(ntBooks, "New Testament")}
    </div>
  );
};
