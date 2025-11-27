import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Book, Search, Plus, Loader2, X } from "lucide-react";
import { searchBible, fetchChapter } from "@/services/bibleApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ScriptureLookupProps {
  onInsert: (text: string) => void;
}

interface Verse {
  book_name?: string;
  chapter?: number;
  verse?: number;
  text: string;
  reference?: string;
}

export function ScriptureLookup({ onInsert }: ScriptureLookupProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVerses, setSelectedVerses] = useState<Verse[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Try to parse as a reference first (e.g., "John 3:16")
      const refMatch = searchQuery.match(/^(\d?\s*[a-zA-Z]+)\s*(\d+)(?::(\d+)(?:-(\d+))?)?$/);
      
      if (refMatch) {
        const [, book, chapter, startVerse, endVerse] = refMatch;
        const chapterData = await fetchChapter(book.trim(), parseInt(chapter));
        
        if (chapterData.verses) {
          let verses = chapterData.verses;
          if (startVerse) {
            const start = parseInt(startVerse);
            const end = endVerse ? parseInt(endVerse) : start;
            verses = verses.filter(v => v.verse >= start && v.verse <= end);
          }
          setResults(verses.map(v => ({
            text: v.text,
            reference: `${book.trim()} ${chapter}:${v.verse}`
          })));
        }
      } else {
        // Fall back to word search
        const searchResults = await searchBible(searchQuery);
        setResults(searchResults.map((v: any) => ({
          text: v.text,
          reference: `${v.book_name || v.book || 'Unknown'} ${v.chapter}:${v.verse}`
        })));
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search Scripture");
    } finally {
      setLoading(false);
    }
  };

  const toggleVerse = (verse: Verse) => {
    const exists = selectedVerses.find(v => v.reference === verse.reference);
    if (exists) {
      setSelectedVerses(selectedVerses.filter(v => v.reference !== verse.reference));
    } else {
      setSelectedVerses([...selectedVerses, verse]);
    }
  };

  const insertSelected = () => {
    if (selectedVerses.length === 0) {
      toast.error("Select at least one verse");
      return;
    }

    const formatted = selectedVerses
      .map(v => `"${v.text}" — ${v.reference}`)
      .join("\n\n");
    
    onInsert(formatted);
    setOpen(false);
    setSelectedVerses([]);
    setResults([]);
    setSearchQuery("");
    toast.success("Scripture inserted!");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Book className="w-4 h-4" />
          Insert Scripture
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Scripture Lookup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search (e.g., 'John 3:16' or 'love')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {selectedVerses.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="py-2 px-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Selected ({selectedVerses.length})
                  <Button size="sm" onClick={insertSelected}>
                    <Plus className="w-4 h-4 mr-1" />
                    Insert Selected
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-3">
                <div className="flex flex-wrap gap-1">
                  {selectedVerses.map((v) => (
                    <Button
                      key={v.reference}
                      variant="secondary"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => toggleVerse(v)}
                    >
                      {v.reference}
                      <X className="w-3 h-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <ScrollArea className="h-[400px]">
            {results.length === 0 && !loading && (
              <div className="text-center text-muted-foreground py-8">
                <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Search for a verse reference or keyword</p>
                <p className="text-sm">Examples: "John 3:16", "Romans 8:28", "faith"</p>
              </div>
            )}

            <div className="space-y-2">
              {results.map((verse, idx) => {
                const isSelected = selectedVerses.some(v => v.reference === verse.reference);
                return (
                  <Card
                    key={idx}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleVerse(verse)}
                  >
                    <CardContent className="py-3 px-4">
                      <p className="text-sm font-medium text-primary mb-1">{verse.reference}</p>
                      <p className="text-sm text-foreground">{verse.text}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
