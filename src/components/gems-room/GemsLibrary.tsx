import { useState, useEffect } from "react";
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
  Gem,
  Cross,
  Link2,
  Share2,
  Crown,
  Loader2,
  Trash2,
} from "lucide-react";
import { QuickShareButton } from "@/components/social/QuickShareButton";
import { ShareToCommunity } from "@/components/community/ShareToCommunity";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  gemsLibrary,
  getGemsByCategory,
  getGemsByDepth,
  searchGems,
  getAllGemTags,
  type Gem as GemType
} from "@/data/gemsLibrary";

interface GemsLibraryProps {
  onClose?: () => void;
}

const categoryInfo: Record<GemType["category"], { icon: string; name: string; description: string }> = {
  typology: { icon: "🔮", name: "Typology", description: "Old Testament shadows pointing to Christ" },
  parallel: { icon: "🪞", name: "Parallels", description: "OT/NT connections and patterns" },
  prophecy: { icon: "📜", name: "Prophecy", description: "Fulfilled messianic prophecies" },
  wordplay: { icon: "✨", name: "Wordplay", description: "Hebrew/Greek linguistic gems" },
  numerics: { icon: "🔢", name: "Numerics", description: "Biblical number patterns" },
  chiasm: { icon: "📐", name: "Chiasm", description: "Literary structures in Scripture" },
  symbol: { icon: "🔗", name: "Symbols", description: "Symbolic numbers and patterns" }
};

const depthInfo: Record<GemType["depth"], { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "bg-green-500/20 text-green-700 border-green-500/30" },
  intermediate: { label: "Intermediate", color: "bg-amber-500/20 text-amber-700 border-amber-500/30" },
  advanced: { label: "Advanced", color: "bg-purple-500/20 text-purple-700 border-purple-500/30" }
};

const getAllCategories = (): GemType["category"][] => {
  return ["typology", "parallel", "prophecy", "wordplay", "numerics", "chiasm", "symbol"];
};

interface SavedGem {
  id: string;
  gem_title: string;
  gem_notes: string;
  verse_reference: string;
  created_at: string;
  conversation_history?: { selectedText: string; question: string; response: string }[];
}

export function GemsLibrary({ onClose }: GemsLibraryProps) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<GemType["category"] | null>(null);
  const [selectedGem, setSelectedGem] = useState<GemType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GemType[]>([]);
  const [viewMode, setViewMode] = useState<"library" | "saved">("library");
  const [savedGems, setSavedGems] = useState<SavedGem[]>([]);
  const [savedGemsLoading, setSavedGemsLoading] = useState(false);
  const [selectedSavedGem, setSelectedSavedGem] = useState<SavedGem | null>(null);

  // Fetch user's saved gems from deck_studies
  useEffect(() => {
    if (!user) return;
    const fetchSavedGems = async () => {
      setSavedGemsLoading(true);
      try {
        const { data, error } = await supabase
          .from("deck_studies")
          .select("id, gem_title, gem_notes, verse_reference, created_at, conversation_history")
          .eq("user_id", user.id)
          .eq("is_gem", true)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setSavedGems((data as SavedGem[]) || []);
      } catch (err) {
        console.error("Error fetching saved gems:", err);
      } finally {
        setSavedGemsLoading(false);
      }
    };
    fetchSavedGems();
  }, [user]);

  const handleDeleteSavedGem = async (gemId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("deck_studies")
        .delete()
        .eq("id", gemId)
        .eq("user_id", user.id);
      if (error) throw error;
      setSavedGems((prev) => prev.filter((g) => g.id !== gemId));
      if (selectedSavedGem?.id === gemId) setSelectedSavedGem(null);
      toast.success("Gem deleted");
    } catch (err) {
      console.error("Error deleting saved gem:", err);
      toast.error("Failed to delete gem");
    }
  };

  const allCategories = getAllCategories();
  const totalGems = gemsLibrary.length;

  const getCategoryCounts = () => {
    return allCategories.map(cat => ({
      category: cat,
      count: getGemsByCategory(cat).length,
      ...categoryInfo[cat]
    }));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchGems(query));
      setSelectedCategory(null);
      setSelectedGem(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCategory = (category: GemType["category"]) => {
    setSelectedCategory(category);
    setSelectedGem(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSelectGem = (gem: GemType) => {
    setSelectedGem(gem);
  };

  const handleBack = () => {
    if (selectedSavedGem) {
      setSelectedSavedGem(null);
    } else if (selectedGem) {
      setSelectedGem(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  // Saved Gem Detail View
  if (selectedSavedGem) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit">
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to My Gems
            </Button>
            <div className="flex items-center gap-2">
              {user && (
                <ShareToCommunity
                  content={{
                    type: "gem",
                    id: selectedSavedGem.id,
                    title: selectedSavedGem.gem_title,
                    preview: selectedSavedGem.gem_notes,
                    metadata: { verses: selectedSavedGem.verse_reference },
                  }}
                  userId={user.id}
                />
              )}
              <QuickShareButton
                title={`${selectedSavedGem.gem_title}`}
                content={selectedSavedGem.gem_notes}
                type="gem"
              />
            </div>
          </div>
          <CardTitle className="text-xl mt-2">{selectedSavedGem.gem_title}</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
              My Gem
            </Badge>
            <span className="text-xs text-muted-foreground">
              Saved {new Date(selectedSavedGem.created_at).toLocaleDateString()}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <Sparkles className="h-4 w-4" />
              The Gem
            </h4>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {selectedSavedGem.gem_notes}
            </p>
          </div>

          {/* Jeeves Expansions if any */}
          {selectedSavedGem.conversation_history && selectedSavedGem.conversation_history.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Jeeves Insights ({selectedSavedGem.conversation_history.length})
              </h4>
              <div className="space-y-3">
                {selectedSavedGem.conversation_history.map((exp, i) => (
                  <div key={i} className="p-3 rounded-lg bg-accent/30 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Q: {exp.question}
                    </p>
                    <p className="text-sm whitespace-pre-wrap">{exp.response}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Gem Detail View
  if (selectedGem) {
    const depth = depthInfo[selectedGem.depth];

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit">
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to Gems
            </Button>
            <QuickShareButton
              title={`💎 Biblical Gem: ${selectedGem.title}`}
              content={`${selectedGem.insight}\n\n📖 ${selectedGem.oldTestament.book} ${selectedGem.oldTestament.chapter}:${selectedGem.oldTestament.verses}${selectedGem.newTestament ? ` ↔ ${selectedGem.newTestament.book} ${selectedGem.newTestament.chapter}:${selectedGem.newTestament.verses}` : ''}`}
              type="gem"
            />
          </div>
          <CardTitle className="text-xl mt-2">{selectedGem.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">
              {categoryInfo[selectedGem.category]?.icon} {categoryInfo[selectedGem.category]?.name}
            </Badge>
            <Badge className={depth.color}>{depth.label}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Old Testament Reference */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700">
              <BookOpen className="h-4 w-4" />
              Old Testament
            </h4>
            <Badge variant="secondary" className="mb-2">
              {selectedGem.oldTestament.book} {selectedGem.oldTestament.chapter}:{selectedGem.oldTestament.verses}
            </Badge>
            {selectedGem.oldTestament.text && (
              <p className="text-sm text-muted-foreground italic">
                "{selectedGem.oldTestament.text}"
              </p>
            )}
          </div>

          {/* New Testament Reference */}
          {selectedGem.newTestament && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                <Cross className="h-4 w-4" />
                New Testament
              </h4>
              <Badge variant="secondary" className="mb-2">
                {selectedGem.newTestament.book} {selectedGem.newTestament.chapter}:{selectedGem.newTestament.verses}
              </Badge>
              {selectedGem.newTestament.text && (
                <p className="text-sm text-muted-foreground italic">
                  "{selectedGem.newTestament.text}"
                </p>
              )}
            </div>
          )}

          {/* The Insight */}
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              The Gem
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {selectedGem.insight}
            </p>
          </div>

          {/* Tags */}
          {selectedGem.tags && selectedGem.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-amber-500" />
                Related Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedGem.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Category Gems List View
  if (selectedCategory) {
    const gemsInCategory = getGemsByCategory(selectedCategory);
    const catInfo = categoryInfo[selectedCategory];

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBack} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Categories
          </Button>
          <CardTitle className="flex items-center gap-2">
            <span className="text-xl">{catInfo.icon}</span>
            {catInfo.name}
          </CardTitle>
          <CardDescription>
            {gemsInCategory.length} gems in {catInfo.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-3">
              {gemsInCategory.map((gem, index) => {
                const depth = depthInfo[gem.depth];
                return (
                  <Card
                    key={gem.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleSelectGem(gem)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Gem className="h-4 w-4 text-primary" />
                            <h4 className="font-medium text-sm">{gem.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {gem.insight}
                          </p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <Badge className={`text-xs ${depth.color}`}>{depth.label}</Badge>
                            <Badge variant="secondary" className="text-xs">
                              {gem.oldTestament.book} {gem.oldTestament.chapter}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Main Library View
  const categoryCounts = getCategoryCounts();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-primary" />
              Biblical Gems Library
            </CardTitle>
            <CardDescription>
              {viewMode === "library"
                ? `${totalGems} gems across ${allCategories.length} categories`
                : `${savedGems.length} gems you've discovered`}
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
        {/* View Mode Tabs */}
        <div className="flex gap-2 mt-2">
          <Button
            variant={viewMode === "library" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("library")}
            className="flex-1"
          >
            <Library className="h-4 w-4 mr-1.5" />
            Library
          </Button>
          <Button
            variant={viewMode === "saved" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("saved")}
            className="flex-1"
          >
            <Crown className="h-4 w-4 mr-1.5" />
            My Gems {savedGems.length > 0 && `(${savedGems.length})`}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {viewMode === "saved" ? (
          /* My Saved Gems View */
          savedGemsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : savedGems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gem className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">No gems saved yet</p>
              <p className="text-sm mt-1">Use "Give Me a Gem" to discover and save biblical insights!</p>
            </div>
          ) : (
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-3">
                {savedGems.map((gem) => (
                  <Card
                    key={gem.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => setSelectedSavedGem(gem)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Gem className="h-4 w-4 text-emerald-500" />
                            <h4 className="font-medium text-sm">{gem.gem_title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {gem.gem_notes}
                          </p>
                          <div className="flex gap-2 mt-2 items-center">
                            <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-700 border-emerald-500/30">
                              Saved
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(gem.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleDeleteSavedGem(gem.id); }}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )
        ) : (
          /* Library View */
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gems, verses, topics..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Found {searchResults.length} gems
                </h4>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2 pr-4">
                    {searchResults.map((gem) => (
                      <Card
                        key={gem.id}
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => setSelectedGem(gem)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <span>{categoryInfo[gem.category]?.icon}</span>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">{gem.title}</h4>
                              <p className="text-xs text-muted-foreground">
                                {categoryInfo[gem.category]?.name} • {gem.oldTestament.book}
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
                  {categoryCounts.map(({ category, count, icon, name, description }) => (
                    <Card
                      key={category}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => handleSelectCategory(category)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{icon}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                        <h4 className="font-medium text-sm">{name}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {description}
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
                <p>No gems found for "{searchQuery}"</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
