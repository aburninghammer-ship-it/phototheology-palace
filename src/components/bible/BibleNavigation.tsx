import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BIBLE_BOOKS } from "@/types/bible";
import { Search, BookOpen } from "lucide-react";

export const BibleNavigation = () => {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState("John");
  const [chapter, setChapter] = useState("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"reference" | "word">("reference");

  const handleNavigate = () => {
    if (selectedBook && chapter) {
      navigate(`/bible/${selectedBook}/${chapter}`);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/bible/search?q=${encodeURIComponent(searchQuery)}&mode=${searchMode}`);
    }
  };

  return (
    <Card className="p-6 gradient-dreamy border-2 border-primary/20 shadow-elegant">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="font-serif text-lg font-semibold">Navigate Bible</h3>
        </div>
        
        {/* Quick Navigation */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Select value={selectedBook} onValueChange={setSelectedBook}>
              <SelectTrigger>
                <SelectValue placeholder="Select book" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {BIBLE_BOOKS.map((book) => (
                  <SelectItem key={book} value={book}>
                    {book}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Input
            type="number"
            placeholder="Ch"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            min="1"
          />
        </div>
        
        <Button 
          onClick={handleNavigate}
          className="w-full gradient-palace text-white shadow-purple hover:shadow-glow"
        >
          Go to Chapter
        </Button>
        
        {/* Search */}
        <div className="pt-3 border-t border-border/50 space-y-3">
          <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as "reference" | "word")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reference">Reference</TabsTrigger>
              <TabsTrigger value="word">Word Search</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder={searchMode === "reference" ? "Search Bible (e.g., John 3:16)" : "Search for words (e.g., faith)"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </Card>
  );
};
