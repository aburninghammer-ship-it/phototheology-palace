import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Search, Loader2 } from "lucide-react";
import { searchBible, fetchChapter } from "@/services/bibleApi";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { Verse } from "@/types/bible";
import { useToast } from "@/hooks/use-toast";

interface ScriptureInsertDialogProps {
  onInsert: (text: string) => void;
}

export const ScriptureInsertDialog = ({ onInsert }: ScriptureInsertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const results = await searchBible(search);
      setVerses(results);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search scripture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookSelect = async (bookName: string, chapter: number) => {
    setLoading(true);
    try {
      const result = await fetchChapter(bookName, chapter);
      setVerses(result.verses);
      setSelectedBook(bookName);
      setSelectedChapter(chapter.toString());
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Could not load chapter",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInsertVerse = (verse: Verse) => {
    const formatted = `\n\n**${verse.book} ${verse.chapter}:${verse.verse}**\n"${verse.text}"\n\n`;
    onInsert(formatted);
    setOpen(false);
    toast({
      title: "Scripture Inserted",
      description: `${verse.book} ${verse.chapter}:${verse.verse} added to your study`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Book className="w-4 h-4" />
          Insert Scripture
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Insert Scripture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by reference (e.g., John 3:16) or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Books</h3>
              <ScrollArea className="h-[300px] border rounded-md p-2">
                {BIBLE_BOOK_METADATA.map((book) => (
                  <Button
                    key={book.code}
                    variant={selectedBook === book.name ? "secondary" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => setSelectedBook(book.name)}
                  >
                    {book.name}
                  </Button>
                ))}
              </ScrollArea>
            </div>

            {selectedBook && (
              <div>
                <h3 className="font-semibold mb-2">Chapters</h3>
                <ScrollArea className="h-[300px] border rounded-md p-2">
                  {Array.from(
                    { length: BIBLE_BOOK_METADATA.find(b => b.name === selectedBook)?.chapters || 0 },
                    (_, i) => i + 1
                  ).map((chapter) => (
                    <Button
                      key={chapter}
                      variant={selectedChapter === chapter.toString() ? "secondary" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => handleBookSelect(selectedBook, chapter)}
                    >
                      Chapter {chapter}
                    </Button>
                  ))}
                </ScrollArea>
              </div>
            )}
          </div>

          {verses.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Verses</h3>
              <ScrollArea className="h-[200px] border rounded-md p-4">
                {verses.map((verse, idx) => (
                  <div
                    key={idx}
                    className="mb-3 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handleInsertVerse(verse)}
                  >
                    <div className="font-semibold text-sm text-primary mb-1">
                      {verse.book} {verse.chapter}:{verse.verse}
                    </div>
                    <div className="text-sm">{verse.text}</div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
