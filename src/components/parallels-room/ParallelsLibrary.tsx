import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  ChevronRight,
  BookOpen,
  ArrowLeftRight,
  Sparkles,
  TrendingUp,
  Lightbulb
} from "lucide-react";
import {
  parallelsLibrary,
  getParallelsByCategory,
  searchParallels,
  getAllCategories,
  type BiblicalParallel
} from "@/data/parallelsLibrary";

const CATEGORY_INFO: Record<BiblicalParallel['category'], { label: string; icon: string; color: string }> = {
  deliverance: { label: 'Deliverance', icon: '🔓', color: 'bg-blue-500/10 border-blue-500/30 text-blue-700' },
  judgment: { label: 'Judgment', icon: '⚖️', color: 'bg-red-500/10 border-red-500/30 text-red-700' },
  covenant: { label: 'Covenant', icon: '📜', color: 'bg-amber-500/10 border-amber-500/30 text-amber-700' },
  provision: { label: 'Provision', icon: '🍞', color: 'bg-green-500/10 border-green-500/30 text-green-700' },
  leadership: { label: 'Leadership', icon: '👑', color: 'bg-purple-500/10 border-purple-500/30 text-purple-700' },
  sacrifice: { label: 'Sacrifice', icon: '🩸', color: 'bg-rose-500/10 border-rose-500/30 text-rose-700' },
  creation: { label: 'Creation', icon: '🌍', color: 'bg-teal-500/10 border-teal-500/30 text-teal-700' }
};

export function ParallelsLibrary() {
  const [selectedParallel, setSelectedParallel] = useState<BiblicalParallel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = getAllCategories();
  const searchResults = searchQuery.length >= 2 ? searchParallels(searchQuery) : [];

  const displayedParallels = activeCategory === "all"
    ? parallelsLibrary
    : getParallelsByCategory(activeCategory as BiblicalParallel['category']);

  const handleBack = () => {
    setSelectedParallel(null);
  };

  // Detail View
  if (selectedParallel) {
    const categoryInfo = CATEGORY_INFO[selectedParallel.category];

    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Parallels
        </Button>

        <div className="space-y-4">
          {/* Header */}
          <div>
            <Badge className={categoryInfo.color}>
              {categoryInfo.icon} {categoryInfo.label}
            </Badge>
            <h3 className="text-xl font-bold mt-2">{selectedParallel.title}</h3>
          </div>

          {/* Two Events Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event A - Old Testament */}
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit mb-2">Old Testament</Badge>
                <CardTitle className="text-lg">{selectedParallel.eventA.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {selectedParallel.eventA.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedParallel.eventA.description}</p>
              </CardContent>
            </Card>

            {/* Event B - New Testament */}
            <Card className="bg-blue-500/5 border-blue-500/20">
              <CardHeader className="pb-2">
                <Badge variant="outline" className="w-fit mb-2">New Testament</Badge>
                <CardTitle className="text-lg">{selectedParallel.eventB.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {selectedParallel.eventB.reference}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedParallel.eventB.description}</p>
              </CardContent>
            </Card>
          </div>

          {/* Echoes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                The Echoes
              </CardTitle>
              <CardDescription>How these events mirror each other</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedParallel.echoes.map((echo, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-primary font-bold">•</span>
                    <span>{echo}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Escalation */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                The Escalation
              </CardTitle>
              <CardDescription>How the NT fulfillment surpasses the OT shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{selectedParallel.escalation}</p>
            </CardContent>
          </Card>

          {/* Lesson */}
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                The Lesson
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{selectedParallel.lesson}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Library View
  return (
    <div className="space-y-4">
      {/* Introduction */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🪞</div>
            <div>
              <h4 className="font-bold text-lg">Biblical Parallels</h4>
              <p className="text-sm text-muted-foreground">
                Parallels show how two events <strong>mirror</strong> each other, with the NT event escalating the OT.
                Unlike patterns (which repeat 3+ times), parallels are typological pairs — shadows and fulfillments.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search parallels..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {searchResults.length === 0 ? (
                <p className="text-sm text-muted-foreground">No parallels found</p>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((parallel) => (
                    <Button
                      key={parallel.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2"
                      onClick={() => {
                        setSelectedParallel(parallel);
                        setSearchQuery("");
                      }}
                    >
                      <div className="text-left">
                        <p className="font-medium">{parallel.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{parallel.category}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent p-0">
          <TabsTrigger
            value="all"
            className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            All ({parallelsLibrary.length})
          </TabsTrigger>
          {categories.map((cat) => {
            const info = CATEGORY_INFO[cat];
            const count = getParallelsByCategory(cat).length;
            return (
              <TabsTrigger
                key={cat}
                value={cat}
                className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {info.icon} {info.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Parallels List */}
        <TabsContent value={activeCategory} className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-3">
              {displayedParallels.map((parallel) => {
                const categoryInfo = CATEGORY_INFO[parallel.category];
                return (
                  <Card
                    key={parallel.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedParallel(parallel)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 text-3xl">
                          {categoryInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-sm">{parallel.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span className="bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                              {parallel.eventA.reference.split(';')[0]}
                            </span>
                            <ArrowLeftRight className="h-3 w-3" />
                            <span className="bg-blue-100 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                              {parallel.eventB.reference.split(';')[0]}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {parallel.lesson}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Stats Footer */}
      <div className="flex flex-wrap gap-2 justify-center pt-2">
        {categories.map((cat) => {
          const info = CATEGORY_INFO[cat];
          const count = getParallelsByCategory(cat).length;
          return (
            <Badge key={cat} variant="outline" className="text-xs">
              {info.icon} {count} {info.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
