import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Search,
  Users,
  Lightbulb,
  ChevronRight,
  Library,
  BookMarked,
  Sparkles
} from "lucide-react";
import {
  bibleStoryLibrary,
  searchStories,
  getTotalStoryCount,
  type BibleStory,
  type BookStories
} from "@/data/bibleStoryLibrary";
import { ResearchAudioCommentary } from "@/components/audio/ResearchAudioCommentary";

interface StoryLibraryProps {
  onClose?: () => void;
}

export function StoryLibrary({ onClose }: StoryLibraryProps) {
  const [selectedBook, setSelectedBook] = useState<BookStories | null>(null);
  const [selectedStory, setSelectedStory] = useState<BibleStory | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BibleStory[]>([]);

  const oldTestamentBooks = bibleStoryLibrary.filter(b => b.testament === "old");
  const newTestamentBooks = bibleStoryLibrary.filter(b => b.testament === "new");
  const totalStories = getTotalStoryCount();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchStories(query));
      setSelectedBook(null);
      setSelectedStory(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectBook = (book: BookStories) => {
    setSelectedBook(book);
    setSelectedStory(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectStory = (story: BibleStory) => {
    setSelectedStory(story);
  };

  const handleBack = () => {
    if (selectedStory) {
      setSelectedStory(null);
    } else if (selectedBook) {
      setSelectedBook(null);
    }
  };

  // Story Detail View
  if (selectedStory) {
    const briefText = [
      `Title: ${selectedStory.title}`,
      `Reference: ${selectedStory.reference}`,
      `Summary: ${selectedStory.summary}`,
      `Characters: ${selectedStory.characters.join(", ")}`,
      `Themes: ${selectedStory.themes.join(", ")}`,
      selectedStory.lessonLearned ? `Lesson: ${selectedStory.lessonLearned}` : "",
    ].filter(Boolean).join("\n\n");

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Stories
          </Button>
          <CardTitle className="text-2xl">{selectedStory.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {selectedStory.reference}
          </CardDescription>
          <ResearchAudioCommentary briefText={briefText} />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-primary" />
              Story Summary
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {selectedStory.summary}
            </p>
          </div>

          {/* Characters */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Characters
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedStory.characters.map((character) => (
                <Badge key={character} variant="secondary">
                  {character}
                </Badge>
              ))}
            </div>
          </div>

          {/* Themes */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Themes
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedStory.themes.map((theme) => (
                <Badge key={theme} variant="outline" className="bg-amber-500/10 border-amber-500/30">
                  {theme}
                </Badge>
              ))}
            </div>
          </div>

          {/* Lesson Learned */}
          {selectedStory.lessonLearned && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Lesson Learned
              </h4>
              <p className="text-muted-foreground italic">
                {selectedStory.lessonLearned}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Book Stories List View
  if (selectedBook) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Books
          </Button>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {selectedBook.book}
          </CardTitle>
          <CardDescription>
            {selectedBook.stories.length} stories from {selectedBook.book}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {selectedBook.stories.map((story, index) => (
                <Card
                  key={story.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectStory(story)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <h4 className="font-medium truncate">{story.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {story.reference}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {story.summary}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Main Library View
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Library className="h-5 w-5 text-primary" />
              Bible Story Library
            </CardTitle>
            <CardDescription>
              {totalStories} stories across {bibleStoryLibrary.length} books
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search stories, characters, themes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Found {searchResults.length} stories
            </h4>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {searchResults.map((story) => (
                  <Card
                    key={story.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedStory(story)}
                  >
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm">{story.title}</h4>
                      <p className="text-xs text-muted-foreground">{story.reference}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Books List */}
        {searchResults.length === 0 && searchQuery.length < 2 && (
          <Tabs defaultValue="old" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="old">Old Testament</TabsTrigger>
              <TabsTrigger value="new">New Testament</TabsTrigger>
            </TabsList>

            <TabsContent value="old" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-2 pr-4">
                  {oldTestamentBooks.map((book) => (
                    <Button
                      key={book.book}
                      variant="outline"
                      className="justify-between h-auto py-3 px-4"
                      onClick={() => handleSelectBook(book)}
                    >
                      <span className="text-left truncate">{book.book}</span>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {book.stories.length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="new" className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="grid grid-cols-2 gap-2 pr-4">
                  {newTestamentBooks.map((book) => (
                    <Button
                      key={book.book}
                      variant="outline"
                      className="justify-between h-auto py-3 px-4"
                      onClick={() => handleSelectBook(book)}
                    >
                      <span className="text-left truncate">{book.book}</span>
                      <Badge variant="secondary" className="ml-2 flex-shrink-0">
                        {book.stories.length}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}

        {/* Empty state for no results */}
        {searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No stories found for "{searchQuery}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
