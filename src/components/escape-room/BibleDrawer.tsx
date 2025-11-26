import { useState } from "react";
import { Book, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BibleDrawer({ open, onOpenChange }: BibleDrawerProps) {
  const [search, setSearch] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!search.trim()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        body: { book: search, chapter: 1 }
      });

      if (error) throw error;
      if (data?.verses) {
        setVerses(data.verses);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error("Could not find that reference");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookSelect = async (bookName: string, chapter: number) => {
    setSelectedBook(bookName);
    setSelectedChapter(chapter);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('bible-api', {
        body: { book: bookName, chapter }
      });

      if (error) throw error;
      if (data?.verses) {
        setVerses(data.verses);
      }
    } catch (error) {
      console.error('Book select error:', error);
      toast.error("Could not load chapter");
    } finally {
      setIsLoading(false);
    }
  };

  const currentBook = BIBLE_BOOK_METADATA.find(b => b.name === selectedBook);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="h-full w-full sm:w-[500px] fixed right-0 top-0 rounded-l-lg">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <DrawerTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Bible Reference
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-hidden flex flex-col p-4">
          {/* Search */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search reference (e.g. John 3)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          {!selectedBook ? (
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {BIBLE_BOOK_METADATA.map((book) => (
                  <div key={book.code} className="border rounded-lg p-3">
                    <h3 className="font-semibold mb-2">{book.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: book.chapters }, (_, i) => i + 1).map((ch) => (
                        <Button
                          key={ch}
                          variant="outline"
                          size="sm"
                          onClick={() => handleBookSelect(book.name, ch)}
                          className="h-8 w-8 p-0"
                        >
                          {ch}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  {selectedBook} {selectedChapter}
                </h3>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBook(null);
                      setSelectedChapter(null);
                      setVerses([]);
                    }}
                  >
                    Back to Books
                  </Button>
                  {selectedChapter && selectedChapter > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookSelect(selectedBook, selectedChapter - 1)}
                    >
                      ← Ch {selectedChapter - 1}
                    </Button>
                  )}
                  {currentBook && selectedChapter && selectedChapter < currentBook.chapters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBookSelect(selectedBook, selectedChapter + 1)}
                    >
                      Ch {selectedChapter + 1} →
                    </Button>
                  )}
                </div>
              </div>

              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : verses.length > 0 ? (
                  <div className="space-y-2">
                    {verses.map((verse) => (
                      <div
                        key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                        className="p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-semibold text-primary mr-2">
                          {verse.verse}
                        </span>
                        <span className="text-foreground">{verse.text}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a chapter to view verses
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
