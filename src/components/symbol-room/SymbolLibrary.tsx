import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  Link2,
  Cross
} from "lucide-react";
import {
  bibleSymbolLibrary,
  symbolCategories,
  searchSymbols,
  getSymbolsByCategory,
  getTotalSymbolCount,
  getCategoriesWithCounts,
  type BibleSymbol,
  type SymbolCategory,
  type SymbolCategoryInfo
} from "@/data/bibleSymbolLibrary";

interface SymbolLibraryProps {
  onClose?: () => void;
}

export function SymbolLibrary({ onClose }: SymbolLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<SymbolCategoryInfo | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<BibleSymbol | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BibleSymbol[]>([]);

  const categoriesWithCounts = getCategoriesWithCounts();
  const totalSymbols = getTotalSymbolCount();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchSymbols(query));
      setSelectedCategory(null);
      setSelectedSymbol(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCategory = (category: SymbolCategoryInfo) => {
    setSelectedCategory(category);
    setSelectedSymbol(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectSymbol = (symbol: BibleSymbol) => {
    setSelectedSymbol(symbol);
  };

  const handleBack = () => {
    if (selectedSymbol) {
      setSelectedSymbol(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Symbol Detail View
  if (selectedSymbol) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Symbols
          </Button>
          <CardTitle className="text-2xl">{selectedSymbol.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Badge variant="outline">
              {symbolCategories.find(c => c.id === selectedSymbol.category)?.name}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meaning */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Symbolic Meaning
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {selectedSymbol.meaning}
            </p>
          </div>

          {/* Key Verses */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Key Verses
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedSymbol.keyVerses.map((verse) => (
                <Badge key={verse} variant="secondary">
                  {verse}
                </Badge>
              ))}
            </div>
          </div>

          {/* Christ Connection */}
          {selectedSymbol.christConnection && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Cross className="h-4 w-4 text-primary" />
                Connection to Christ
              </h4>
              <p className="text-muted-foreground italic">
                {selectedSymbol.christConnection}
              </p>
            </div>
          )}

          {/* Related Symbols */}
          {selectedSymbol.relatedSymbols && selectedSymbol.relatedSymbols.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-amber-500" />
                Related Symbols
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedSymbol.relatedSymbols.map((symbol) => (
                  <Badge key={symbol} variant="outline" className="bg-amber-500/10 border-amber-500/30">
                    {symbol}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Category Symbols List View
  if (selectedCategory) {
    const symbolsInCategory = getSymbolsByCategory(selectedCategory.id);
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Categories
          </Button>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{selectedCategory.icon}</span>
            {selectedCategory.name}
          </CardTitle>
          <CardDescription>
            {symbolsInCategory.length} symbols in {selectedCategory.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {symbolsInCategory.map((symbol, index) => (
                <Card
                  key={symbol.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleSelectSymbol(symbol)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {index + 1}
                          </Badge>
                          <h4 className="font-medium truncate">{symbol.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {symbol.meaning}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {symbol.keyVerses.slice(0, 2).map((verse) => (
                            <Badge key={verse} variant="secondary" className="text-xs">
                              {verse}
                            </Badge>
                          ))}
                          {symbol.keyVerses.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{symbol.keyVerses.length - 2} more
                            </Badge>
                          )}
                        </div>
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
              Bible Symbol Library
            </CardTitle>
            <CardDescription>
              {totalSymbols} symbols across {symbolCategories.length} categories
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
            placeholder="Search symbols, meanings, verses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Found {searchResults.length} symbols
            </h4>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2 pr-4">
                {searchResults.map((symbol) => (
                  <Card
                    key={symbol.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedSymbol(symbol)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <span>{symbolCategories.find(c => c.id === symbol.category)?.icon}</span>
                        <div>
                          <h4 className="font-medium text-sm">{symbol.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {symbolCategories.find(c => c.id === symbol.category)?.name}
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
            <p>No symbols found for "{searchQuery}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
