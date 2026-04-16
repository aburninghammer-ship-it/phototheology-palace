import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookMarked,
  Layers,
  Hash,
} from "lucide-react";
import {
  bibleRenderedSets,
  BibleRenderedSet,
  getBibleRenderedCategories,
  getSetsByCategory,
  getSetsByTestament,
  getTotalChapters,
  getTotalRenders,
} from "@/data/bibleRenderedSets";
import { getBibleRenderedImage } from "@/assets/bible-rendered";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type ViewMode = "grid" | "list" | "detail";
type TestamentFilter = "all" | "old" | "new";

export function BibleRenderedBrowser() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedSet, setSelectedSet] = useState<BibleRenderedSet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [testamentFilter, setTestamentFilter] = useState<TestamentFilter>("all");

  const categories = getBibleRenderedCategories();

  // Filter sets based on search, category, and testament
  const filteredSets = useMemo(() => {
    let sets = [...bibleRenderedSets];

    // Filter by testament
    if (testamentFilter !== "all") {
      sets = sets.filter((s) => s.testament === testamentFilter);
    }

    // Filter by category
    if (selectedCategory) {
      sets = sets.filter((s) => s.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      sets = sets.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.range.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.symbols.some((sym) => sym.toLowerCase().includes(query)) ||
          s.category.toLowerCase().includes(query)
      );
    }

    return sets;
  }, [searchQuery, selectedCategory, testamentFilter]);

  // Navigate between sets in detail view
  const navigateSet = (direction: "prev" | "next") => {
    if (!selectedSet) return;
    const currentIndex = filteredSets.findIndex((s) => s.number === selectedSet.number);
    if (currentIndex === -1) return;

    const newIndex =
      direction === "prev"
        ? Math.max(0, currentIndex - 1)
        : Math.min(filteredSets.length - 1, currentIndex + 1);

    setSelectedSet(filteredSets[newIndex]);
  };

  // Render individual set card
  const SetCard = ({ set, compact = false }: { set: BibleRenderedSet; compact?: boolean }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all hover:shadow-md hover:border-primary/30 overflow-hidden",
          compact ? "p-2" : "",
          set.testament === "new" && "bg-blue-50/50 dark:bg-blue-950/20"
        )}
        onClick={() => setSelectedSet(set)}
      >
        <CardContent className={compact ? "p-2" : "p-4"}>
          <div className="flex items-start gap-3">
            {getBibleRenderedImage(set.number) ? (
              <img
                src={getBibleRenderedImage(set.number)}
                alt={`Set ${set.number}: ${set.name}`}
                className={cn(
                  "rounded-lg object-cover",
                  compact ? "w-10 h-10" : "w-14 h-14"
                )}
              />
            ) : (
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg bg-primary/10",
                  compact ? "w-10 h-10 text-xl" : "w-14 h-14 text-2xl"
                )}
              >
                {set.symbol}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  #{set.number}
                </Badge>
                <Badge variant={set.testament === "new" ? "default" : "secondary"} className="text-xs">
                  {set.testament === "new" ? "NT" : "OT"}
                </Badge>
              </div>
              <h3 className={cn("font-semibold truncate", compact ? "text-sm" : "text-base")}>
                {set.name}
              </h3>
              <p className={cn("text-primary font-medium truncate", compact ? "text-xs" : "text-sm")}>
                {set.range}
              </p>
              {!compact && (
                <>
                  <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{set.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{set.chapters} chapters</span>
                    <span>•</span>
                    <span>{set.renders} renders</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Render detail view for selected set
  const SetDetail = ({ set }: { set: BibleRenderedSet }) => {
    const currentIndex = filteredSets.findIndex((s) => s.number === set.number);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < filteredSets.length - 1;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        <Card className={cn("border-2", set.testament === "new" ? "border-blue-300 dark:border-blue-700" : "border-primary/30")}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {getBibleRenderedImage(set.number) ? (
                  <img
                    src={getBibleRenderedImage(set.number)}
                    alt={`Set ${set.number}: ${set.name}`}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center text-4xl">
                    {set.symbol}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>Set #{set.number}</Badge>
                    <Badge variant="outline">{set.category}</Badge>
                    <Badge variant={set.testament === "new" ? "default" : "secondary"}>
                      {set.testament === "new" ? "New Testament" : "Old Testament"}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{set.name}</CardTitle>
                  <CardDescription className="text-lg text-primary font-semibold mt-1">
                    {set.range}
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSet(null)}>
                Back
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Full Image Display */}
            {getBibleRenderedImage(set.number) && (
              <div className="flex justify-center">
                <img
                  src={getBibleRenderedImage(set.number)}
                  alt={`Set ${set.number}: ${set.name}`}
                  className="max-w-full max-h-64 rounded-xl object-contain shadow-lg"
                />
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Hash className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{set.number}</p>
                <p className="text-xs text-muted-foreground">Set Number</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <BookOpen className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{set.chapters}</p>
                <p className="text-xs text-muted-foreground">Chapters</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Layers className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{set.renders}</p>
                <p className="text-xs text-muted-foreground">Renders</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <BookMarked className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{set.symbols.length}</p>
                <p className="text-xs text-muted-foreground">Symbols</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{set.description}</p>
            </div>

            {/* Symbol Pack */}
            <div>
              <h4 className="font-semibold mb-2">Symbol Pack</h4>
              <div className="flex flex-wrap gap-2">
                {set.symbols.map((sym, i) => (
                  <Badge key={i} variant="outline" className="py-1 px-3">
                    {sym}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => navigateSet("prev")}
                disabled={!hasPrev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous Set
              </Button>
              <span className="text-sm text-muted-foreground self-center">
                {currentIndex + 1} of {filteredSets.length}
              </span>
              <Button
                variant="outline"
                onClick={() => navigateSet("next")}
                disabled={!hasNext}
              >
                Next Set
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Bible Rendered Browser
          </CardTitle>
          <CardDescription>
            Explore all 51 render sets covering {getTotalChapters()} chapters with {getTotalRenders()} renders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and View Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sets by name, range, symbols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Testament Filter */}
          <Tabs
            value={testamentFilter}
            onValueChange={(v) => setTestamentFilter(v as TestamentFilter)}
          >
            <TabsList>
              <TabsTrigger value="all">All ({bibleRenderedSets.length})</TabsTrigger>
              <TabsTrigger value="old">
                Old Testament ({getSetsByTestament("old").length})
              </TabsTrigger>
              <TabsTrigger value="new">
                New Testament ({getSetsByTestament("new").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              <Filter className="h-3 w-3 mr-1" />
              All Categories
            </Button>
            {categories.map((cat) => {
              const count = getSetsByCategory(cat).length;
              return (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                >
                  {cat} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredSets.length} of {bibleRenderedSets.length} sets
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {selectedSet ? (
          <SetDetail key="detail" set={selectedSet} />
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSets.map((set) => (
                  <SetCard key={set.number} set={set} />
                ))}
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredSets.map((set) => (
                    <SetCard key={set.number} set={set} compact />
                  ))}
                </div>
              </ScrollArea>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredSets.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No sets found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory(null);
              setTestamentFilter("all");
            }}
          >
            Clear filters
          </Button>
        </Card>
      )}
    </div>
  );
}

export default BibleRenderedBrowser;
