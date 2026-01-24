import { useState, useEffect } from "react";
import { Verse, Chapter } from "@/types/bible";
import { fetchChapter, Translation, BIBLE_TRANSLATIONS } from "@/services/bibleApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResearchParallelPanelProps {
  book: string;
  chapter: number;
  selectedVerse: number | null;
  onVerseSelect: (verse: number) => void;
}

interface TranslationColumn {
  id: string;
  translation: Translation;
  data: Chapter | null;
  loading: boolean;
}

// Free translations available
const FREE_TRANSLATIONS: Translation[] = ["kjv", "asv", "web", "ylt", "darby", "bbe"];

export const ResearchParallelPanel = ({
  book,
  chapter,
  selectedVerse,
  onVerseSelect
}: ResearchParallelPanelProps) => {
  const [columns, setColumns] = useState<TranslationColumn[]>([
    { id: "1", translation: "kjv", data: null, loading: true },
    { id: "2", translation: "asv", data: null, loading: true },
  ]);

  // Load all translations when book/chapter changes
  useEffect(() => {
    const loadAllTranslations = async () => {
      // Set all columns to loading state first
      setColumns(prev => prev.map(col => ({ ...col, loading: true })));
      
      // Get current columns to load
      setColumns(prev => {
        // Load each translation in parallel
        prev.forEach(async (col) => {
          try {
            const data = await fetchChapter(book, chapter, col.translation);
            setColumns(current => current.map(c => 
              c.id === col.id ? { ...c, data, loading: false } : c
            ));
          } catch (error) {
            console.error(`Failed to load ${col.translation}:`, error);
            setColumns(current => current.map(c => 
              c.id === col.id ? { ...c, data: null, loading: false } : c
            ));
          }
        });
        return prev;
      });
    };
    
    loadAllTranslations();
  }, [book, chapter]);

  const loadTranslation = async (colId: string, translation: Translation) => {
    setColumns(prev => prev.map(col => 
      col.id === colId ? { ...col, translation, loading: true } : col
    ));

    try {
      const data = await fetchChapter(book, chapter, translation);
      setColumns(prev => prev.map(col => 
        col.id === colId ? { ...col, data, loading: false } : col
      ));
    } catch (error) {
      console.error(`Failed to load ${translation}:`, error);
      setColumns(prev => prev.map(col => 
        col.id === colId ? { ...col, loading: false } : col
      ));
    }
  };

  const addColumn = () => {
    if (columns.length >= 4) return;
    const usedTranslations = columns.map(c => c.translation);
    const nextTranslation = FREE_TRANSLATIONS.find(t => !usedTranslations.includes(t)) || "web";
    const newCol: TranslationColumn = {
      id: Date.now().toString(),
      translation: nextTranslation,
      data: null,
      loading: true
    };
    setColumns([...columns, newCol]);
    
    // Load the new translation
    fetchChapter(book, chapter, nextTranslation).then(data => {
      setColumns(prev => prev.map(col => 
        col.id === newCol.id ? { ...col, data, loading: false } : col
      ));
    });
  };

  const removeColumn = (colId: string) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter(col => col.id !== colId));
  };

  const maxVerses = Math.max(...columns.map(col => col.data?.verses.length || 0));

  return (
    <div className="h-full flex flex-col">
      {/* Column Headers */}
      <div className="flex border-b border-white/10 shrink-0">
        {columns.map((col, idx) => (
          <div 
            key={col.id}
            className={cn(
              "flex-1 p-2 flex items-center justify-between gap-2 min-w-0",
              idx > 0 && "border-l border-white/10"
            )}
          >
            <Select 
              value={col.translation} 
              onValueChange={(v) => loadTranslation(col.id, v as Translation)}
            >
              <SelectTrigger className="h-7 text-xs bg-white/5 border-white/10 w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FREE_TRANSLATIONS.map((t) => (
                  <SelectItem key={t} value={t} className="text-xs">
                    {t.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {columns.length > 1 && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 shrink-0"
                onClick={() => removeColumn(col.id)}
              >
                <Minus className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        
        {columns.length < 4 && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-full px-2 border-l border-white/10"
            onClick={addColumn}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Parallel Verses */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-white/5">
          {Array.from({ length: maxVerses }, (_, i) => i + 1).map((verseNum) => (
            <div 
              key={verseNum}
              className={cn(
                "flex cursor-pointer transition-colors",
                selectedVerse === verseNum 
                  ? "bg-primary/15" 
                  : "hover:bg-white/5"
              )}
              onClick={() => onVerseSelect(verseNum)}
            >
              {columns.map((col, idx) => {
                const verse = col.data?.verses.find(v => v.verse === verseNum);
                
                return (
                  <div 
                    key={col.id}
                    className={cn(
                      "flex-1 p-2 min-w-0",
                      idx > 0 && "border-l border-white/10"
                    )}
                  >
                    {col.loading ? (
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-6" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ) : verse ? (
                      <div className="flex gap-2 text-xs">
                        <span className={cn(
                          "font-semibold shrink-0 w-5 text-right",
                          selectedVerse === verseNum ? "text-primary" : "text-primary/70"
                        )}>
                          {verse.verse}
                        </span>
                        <span className="leading-relaxed">{verse.text}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Verse not available
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer Info */}
      <div className="p-2 border-t border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          <span>{book} {chapter}</span>
          <Badge variant="outline" className="text-[10px]">
            {maxVerses} verses
          </Badge>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          {columns.length} translation{columns.length > 1 ? "s" : ""}
        </Badge>
      </div>
    </div>
  );
};
