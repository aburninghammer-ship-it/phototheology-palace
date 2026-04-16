import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Search,
  ChevronRight,
  Library,
  Sparkles,
  MessageCircleQuestion,
  MessageCircleReply,
  Link2
} from "lucide-react";
import {
  questionAnswerLibrary,
  searchQA,
  getQAByCategory,
  getRelatedQA,
  type QAEntry
} from "@/data/questionAnswerLibrary";

interface QALibraryProps {
  onClose?: () => void;
}

// Category definitions for Q&A
const qaCategories = [
  { id: "salvation", name: "Salvation", icon: "🛡️", description: "Questions about being saved" },
  { id: "theology", name: "Theology", icon: "📖", description: "Questions about God and doctrine" },
  { id: "practical", name: "Practical", icon: "🔧", description: "Day-to-day Christian living" },
  { id: "doctrine", name: "Doctrine", icon: "📜", description: "Core biblical teachings" },
  { id: "character", name: "Character", icon: "💪", description: "Spiritual growth and virtue" },
  { id: "prophecy", name: "Prophecy", icon: "🔮", description: "End-time and prophetic questions" }
] as const;

export function QALibrary({ onClose }: QALibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<typeof qaCategories[number] | null>(null);
  const [selectedQA, setSelectedQA] = useState<QAEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<QAEntry[]>([]);

  const totalQA = questionAnswerLibrary.length;

  const getCategoriesWithCounts = () => {
    return qaCategories.map(category => ({
      category,
      count: questionAnswerLibrary.filter(qa => qa.category === category.id).length
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchQA(query));
      setSelectedCategory(null);
      setSelectedQA(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCategory = (category: typeof qaCategories[number]) => {
    setSelectedCategory(category);
    setSelectedQA(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectQA = (qa: QAEntry) => {
    setSelectedQA(qa);
  };

  const handleBack = () => {
    if (selectedQA) {
      setSelectedQA(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Q&A Detail View
  if (selectedQA) {
    const relatedQA = getRelatedQA(selectedQA);
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Questions
        </Button>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold flex items-start gap-2">
            <MessageCircleQuestion className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
            <span>{selectedQA.question}</span>
          </h3>
          <Badge variant="outline" className="capitalize">
            {qaCategories.find(c => c.id === selectedQA.category)?.icon} {selectedQA.category}
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Question Source */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageCircleQuestion className="h-4 w-4 text-orange-500" />
              Question Source
            </h4>
            <p className="text-muted-foreground italic mb-2">"{selectedQA.questionSource.text}"</p>
            <Badge variant="secondary">
              {selectedQA.questionSource.book} {selectedQA.questionSource.chapter}:{selectedQA.questionSource.verses}
            </Badge>
          </div>

          {/* Answer */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <MessageCircleReply className="h-4 w-4 text-primary" />
              The Answer
            </h4>
            <p className="text-lg font-medium text-foreground mb-3">{selectedQA.answer}</p>
            <p className="text-muted-foreground italic mb-2">"{selectedQA.answerSource.text}"</p>
            <Badge variant="secondary">
              {selectedQA.answerSource.book} {selectedQA.answerSource.chapter}:{selectedQA.answerSource.verses}
            </Badge>
          </div>

          {/* Explanation */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Deeper Understanding
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {selectedQA.explanation}
            </p>
          </div>

          {/* Related Verses */}
          {selectedQA.relatedVerses && selectedQA.relatedVerses.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                Related Verses
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedQA.relatedVerses.map((verse) => (
                  <Badge key={verse} variant="secondary">
                    {verse}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Q&A */}
          {relatedQA.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-purple-500" />
                Related Questions
              </h4>
              <div className="space-y-2">
                {relatedQA.map((qa) => (
                  <Card
                    key={qa.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelectQA(qa)}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm font-medium">{qa.question}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Category Questions List View
  if (selectedCategory) {
    const questionsInCategory = getQAByCategory(selectedCategory.id as QAEntry["category"]);
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Categories
        </Button>
        
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <span className="text-xl">{selectedCategory.icon}</span>
            {selectedCategory.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {questionsInCategory.length} questions about {selectedCategory.name.toLowerCase()}
          </p>
        </div>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {questionsInCategory.map((qa, index) => (
              <Card
                key={qa.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleSelectQA(qa)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <h4 className="font-medium">{qa.question}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {qa.answer}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {qa.answerSource.book} {qa.answerSource.chapter}:{qa.answerSource.verses}
                        </Badge>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Main Library View
  const categoriesWithCounts = getCategoriesWithCounts();

  return (
    <div className="space-y-4">
      {/* Header - only show if onClose is provided (standalone mode) */}
      {onClose && (
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Library className="h-5 w-5 text-orange-500" />
              Q&A Chain Library
            </h3>
            <p className="text-sm text-muted-foreground">
              {totalQA} questions across {qaCategories.length} categories
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      )}
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search questions, answers, verses..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            Found {searchResults.length} Q&A entries
          </h4>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 pr-4">
              {searchResults.map((qa) => (
                <Card
                  key={qa.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => setSelectedQA(qa)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <span>{qaCategories.find(c => c.id === qa.category)?.icon}</span>
                      <div>
                        <h4 className="font-medium text-sm">{qa.question}</h4>
                        <p className="text-xs text-muted-foreground capitalize">
                          {qa.category}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Categories Grid */}
      {searchResults.length === 0 && searchQuery.length < 2 && (
        <ScrollArea className="h-[450px]">
          <div className="grid grid-cols-2 gap-3 pr-4">
            {categoriesWithCounts.map(({ category, count }) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleSelectCategory(category)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <Badge variant="secondary">{count}</Badge>
                  </div>
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Empty state for no results */}
      {searchQuery.length >= 2 && searchResults.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No Q&A entries found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
