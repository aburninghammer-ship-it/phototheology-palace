import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { ChevronRight, ChevronDown, BookOpen, X, PanelLeftClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AtAGlanceSidebarProps {
  onClose: () => void;
}

export const AtAGlanceSidebar = ({ onClose }: AtAGlanceSidebarProps) => {
  const { t } = useTranslation();
  const { book: currentBook = "John", chapter: chapterParam = "3" } = useParams();
  const currentChapter = parseInt(chapterParam);
  const navigate = useNavigate();
  const [expandedBook, setExpandedBook] = useState<string | null>(currentBook);

  const otBooks = BIBLE_BOOK_METADATA.filter(b => b.position <= 39);
  const ntBooks = BIBLE_BOOK_METADATA.filter(b => b.position >= 40);

  const handleSelect = (bookName: string, ch: number) => {
    navigate(`/bible/${encodeURIComponent(bookName)}/${ch}`);
  };

  const renderBooks = (books: typeof BIBLE_BOOK_METADATA, label: string) => (
    <div className="mb-1">
      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/70 bg-primary/5 border-b border-primary/10">
        {label}
      </div>
      {books.map((book) => {
        const isActive = book.name === currentBook;
        const isExpanded = expandedBook === book.name;

        return (
          <div key={book.code}>
            <button
              onClick={() => setExpandedBook(isExpanded ? null : book.name)}
              className={cn(
                "w-full flex items-center gap-1.5 px-3 py-1.5 text-left text-xs transition-colors hover:bg-muted/60",
                isActive && "bg-primary/10 text-primary font-semibold"
              )}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
              )}
              <span className="truncate flex-1">{book.name}</span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{book.chapters}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 py-1.5 flex flex-wrap gap-1 bg-muted/30 border-b border-muted/50">
                    {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => {
                      const isCurrent = isActive && ch === currentChapter;
                      return (
                        <Button
                          key={ch}
                          variant={isCurrent ? "default" : "ghost"}
                          size="sm"
                          className={cn(
                            "h-7 w-8 p-0 text-xs font-medium",
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-primary/10 hover:text-primary"
                          )}
                          onClick={() => handleSelect(book.name, ch)}
                        >
                          {ch}
                        </Button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="h-full flex flex-col border-r border-border/50 bg-background/95 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">{t('bible.atAGlance', 'At a Glance')}</span>
        </div>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onClose}>
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>

      {/* Book list */}
      <ScrollArea className="flex-1">
        {renderBooks(otBooks, t('bible.oldTestament', 'Old Testament'))}
        {renderBooks(ntBooks, t('bible.newTestament', 'New Testament'))}
      </ScrollArea>
    </div>
  );
};
