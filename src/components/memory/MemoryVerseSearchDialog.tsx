import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Search, Loader2, Sparkles, Plus } from "lucide-react";
import { searchBible, fetchChapter } from "@/services/bibleApi";
import { BIBLE_BOOK_METADATA } from "@/data/bibleBooks";
import { Verse } from "@/types/bible";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface MemoryVerseSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddVerse: (verse: { reference: string; text: string }) => void;
}

export function MemoryVerseSearchDialog({
  open,
  onOpenChange,
  onAddVerse,
}: MemoryVerseSearchDialogProps) {
  const [search, setSearch] = useState("");
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const { toast } = useToast();

  // Jeeves search
  const [jeevesQuery, setJeevesQuery] = useState("");
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [jeevesVerses, setJeevesVerses] = useState<Array<{ reference: string; text: string; explanation?: string }>>([]);

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

  const handleAddVerse = (verse: Verse) => {
    onAddVerse({
      reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
      text: verse.text,
    });
    toast({
      title: "Verse Added",
      description: `${verse.book} ${verse.chapter}:${verse.verse} added to your list`,
    });
  };

  const handleJeevesSearch = async () => {
    if (!jeevesQuery.trim()) {
      toast({
        title: "Enter a Request",
        description: "Please describe what verses you're looking for",
        variant: "destructive",
      });
      return;
    }

    setJeevesLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          action: "find_verses",
          query: jeevesQuery,
        },
      });

      if (error) throw error;

      if (data?.verses && Array.isArray(data.verses)) {
        setJeevesVerses(data.verses);
        if (data.verses.length === 0) {
          toast({
            title: "No Results",
            description: "Jeeves couldn't find verses matching your request. Try rephrasing your query.",
          });
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Jeeves search error:", error);
      toast({
        title: "Search Failed",
        description: "Jeeves encountered an error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setJeevesLoading(false);
    }
  };

  const handleAddJeevesVerse = (verse: { reference: string; text: string }) => {
    onAddVerse(verse);
    toast({
      title: "Verse Added",
      description: `${verse.reference} added to your list`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Add Verses to Memory List</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="jeeves" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="jeeves" className="gap-2">
              <Sparkles className="w-4 h-4" />
              Ask Jeeves
            </TabsTrigger>
            <TabsTrigger value="browse" className="gap-2">
              <Book className="w-4 h-4" />
              Browse & Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jeeves" className="flex-1 flex flex-col space-y-4 mt-4 min-h-0 overflow-hidden">
            <div className="space-y-3 flex-shrink-0">
              <p className="text-sm text-muted-foreground">
                Tell Jeeves what kind of verses you want to memorize. For example:
                "Find 10 verses about the beasts in Daniel and Revelation" or "Give me verses about the sanctuary"
              </p>
              <Textarea
                placeholder="Example: Find verses about the 2300-day prophecy, or verses about the state of the dead..."
                value={jeevesQuery}
                onChange={(e) => setJeevesQuery(e.target.value)}
                className="min-h-[100px]"
              />
              <Button
                onClick={handleJeevesSearch}
                disabled={jeevesLoading}
                className="w-full gap-2"
              >
                {jeevesLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Jeeves is searching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Ask Jeeves to Find Verses
                  </>
                )}
              </Button>
            </div>

            {jeevesVerses.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0">
                <h3 className="font-semibold mb-2 text-sm flex-shrink-0">
                  Jeeves found {jeevesVerses.length} verses:
                </h3>
                <ScrollArea className="flex-1 border rounded-md">
                  <div className="p-4 space-y-3">
                    {jeevesVerses.map((verse, idx) => (
                      <Card key={idx} className="p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="font-semibold text-sm text-primary">
                              {verse.reference}
                            </div>
                            <div className="text-sm">{verse.text}</div>
                            {verse.explanation && (
                              <div className="text-xs text-muted-foreground italic">
                                💡 {verse.explanation}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddJeevesVerse(verse)}
                            className="gap-2 flex-shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          <TabsContent value="browse" className="flex-1 flex flex-col space-y-4 mt-4 min-h-0 overflow-hidden">
            <div className="flex gap-2 flex-shrink-0">
              <Input
                placeholder="Search by reference (e.g., John 3:16) or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Show search results if we have them, otherwise show browse UI */}
            {verses.length > 0 ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2 flex-shrink-0">
                  <h3 className="font-semibold text-sm">
                    {selectedBook && selectedChapter 
                      ? `${selectedBook} ${selectedChapter}` 
                      : `Search Results (${verses.length} verses)`}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setVerses([]);
                      setSelectedBook("");
                      setSelectedChapter("");
                      setSearch("");
                    }}
                  >
                    Clear Results
                  </Button>
                </div>
                <ScrollArea className="flex-1 border rounded-md">
                  <div className="p-4 space-y-3">
                    {verses.map((verse, idx) => (
                      <Card
                        key={idx}
                        className="p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-primary mb-1">
                              {verse.book} {verse.chapter}:{verse.verse}
                            </div>
                            <div className="text-sm">{verse.text}</div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddVerse(verse)}
                            className="gap-2 flex-shrink-0"
                          >
                            <Plus className="w-3 h-3" />
                            Add
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
                <div className="flex flex-col min-h-0">
                  <h3 className="font-semibold mb-2 text-sm flex-shrink-0">Books</h3>
                  <ScrollArea className="flex-1 border rounded-md">
                    <div className="p-2">
                      {BIBLE_BOOK_METADATA.map((book) => (
                        <Button
                          key={book.code}
                          variant={selectedBook === book.name ? "secondary" : "ghost"}
                          className="w-full justify-start mb-1 h-8 text-sm"
                          onClick={() => setSelectedBook(book.name)}
                        >
                          {book.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {selectedBook && (
                  <div className="flex flex-col min-h-0">
                    <h3 className="font-semibold mb-2 text-sm flex-shrink-0">
                      {selectedBook} Chapters
                    </h3>
                    <ScrollArea className="flex-1 border rounded-md">
                      <div className="p-2">
                        {Array.from(
                          {
                            length:
                              BIBLE_BOOK_METADATA.find((b) => b.name === selectedBook)
                                ?.chapters || 0,
                          },
                          (_, i) => i + 1
                        ).map((chapter) => (
                          <Button
                            key={chapter}
                            variant={
                              selectedChapter === chapter.toString()
                                ? "secondary"
                                : "ghost"
                            }
                            className="w-full justify-start mb-1 h-8 text-sm"
                            onClick={() => handleBookSelect(selectedBook, chapter)}
                          >
                            Chapter {chapter}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
