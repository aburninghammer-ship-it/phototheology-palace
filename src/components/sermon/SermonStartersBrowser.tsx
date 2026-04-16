import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  BookOpen,
  Calendar,
  Church,
  Telescope,
  Heart,
  Sparkles,
  ChevronRight,
  Building2,
  ExternalLink,
  Loader2,
  Wand2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface SermonTopic {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  tags: string[];
  anchor_scriptures: string[];
  category: string | null;
  is_featured: boolean;
}

interface FullStarter {
  starterTitle: string;
  starterParagraph?: string;
  bigIdea: string;
  palaceAnchors?: string[];
  floors?: Record<string, unknown>;
  roomRefs?: string[];
  internalTemplate?: {
    palaceFloor?: string;
    roomsActivated?: string[];
    governingPrinciple?: string;
    christologicalAxis?: string;
    falseCenterExposed?: string;
    gospelResolution?: string;
  };
}

// Map UI categories to edge function categories
const CATEGORIES = [
  { id: "Themes", label: "Themes", icon: BookOpen, apiCategory: "everlasting-gospel" },
  { id: "Occasions", label: "Occasions", icon: Calendar, apiCategory: null },
  { id: "Doctrine", label: "Doctrine", icon: Church, apiCategory: "sanctuary" },
  { id: "Prophecy", label: "Prophecy", icon: Telescope, apiCategory: "prophecy" },
  { id: "Christian Living", label: "Christian Living", icon: Heart, apiCategory: "righteousness-by-faith" },
];

export function SermonStartersBrowser() {
  const [topics, setTopics] = useState<SermonTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [generatedStarter, setGeneratedStarter] = useState<FullStarter | null>(null);
  const [generating, setGenerating] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sermon_topics")
        .select("*")
        .order("title");

      if (error) {
        console.error("Error fetching topics:", error);
      } else {
        setTopics((data as SermonTopic[]) || []);
      }
      setLoading(false);
    };

    fetchTopics();
  }, []);

  // Generate starter when verse AND category are both provided
  useEffect(() => {
    const generateStarter = async () => {
      if (!searchQuery.trim() || !selectedCategory) {
        setGeneratedStarter(null);
        return;
      }

      // Check if input looks like a verse reference
      const versePattern = /^[1-3]?\s*[a-zA-Z]+\s*\d+:\d+/i;
      if (!versePattern.test(searchQuery.trim())) {
        return;
      }

      setGenerating(true);
      setGeneratedStarter(null);

      try {
        const categoryConfig = CATEGORIES.find(c => c.id === selectedCategory);
        
        const { data, error } = await supabase.functions.invoke("generate-sermon-starter", {
          body: {
            topic: searchQuery.trim(),
            level: "Intermediate",
            anchorScriptures: [searchQuery.trim()],
            category: categoryConfig?.apiCategory || null,
          },
        });

        if (error) throw error;

        if (data?.success && data?.starter) {
          setGeneratedStarter(data.starter);
        } else if (data?.error) {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Error generating starter:", error);
        toast({
          title: "Generation Failed",
          description: "Could not generate sermon starter. Please try again.",
          variant: "destructive",
        });
      } finally {
        setGenerating(false);
      }
    };

    const debounce = setTimeout(generateStarter, 1000);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedCategory, toast]);

  const filteredTopics = useMemo(() => {
    let result = topics;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          t.anchor_scriptures.some((s) => s.toLowerCase().includes(query))
      );
    }

    if (selectedCategory) {
      result = result.filter((t) => t.category === selectedCategory);
    }

    return result;
  }, [topics, searchQuery, selectedCategory]);

  const featuredTopics = useMemo(
    () => topics.filter((t) => t.is_featured).slice(0, 4),
    [topics]
  );

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setGeneratedStarter(null);
    setExpandedSection(null);
  };

  const showGeneratedResults = searchQuery.trim() && selectedCategory && (generating || generatedStarter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="p-2 rounded-full bg-white/10">
            <Building2 className="h-6 w-6 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sermon Idea Starters</h2>
        <p className="text-purple-200 text-sm max-w-lg mx-auto">
          Enter a scripture reference and select a category to generate PhotoTheology sermon scaffolds.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        <Input
          type="text"
          placeholder="Enter a verse (e.g., John 3:16)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
        />
        {searchQuery && selectedCategory && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {generating ? (
              <Loader2 className="h-4 w-4 text-white/60 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 text-amber-400" />
            )}
          </div>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <Button
              key={cat.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(isActive ? null : cat.id)}
              className={
                isActive
                  ? "bg-white text-purple-900"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }
            >
              <Icon className="h-3 w-3 mr-1" />
              {cat.label}
            </Button>
          );
        })}
        {(selectedCategory || searchQuery) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            Clear
          </Button>
        )}
      </div>

      {/* AI Generated Starter */}
      <AnimatePresence mode="wait">
        {showGeneratedResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-white/80">
              <Wand2 className="h-4 w-4 text-amber-400" />
              <span className="text-sm font-medium">
                Jeeves Generated Starter for "{searchQuery}" ({selectedCategory})
              </span>
            </div>

            {generating ? (
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 bg-white/10" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/10" />
                  <Skeleton className="h-4 w-2/3 bg-white/10" />
                  <div className="pt-2 space-y-2">
                    <Skeleton className="h-20 w-full bg-white/10" />
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ) : generatedStarter ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
                      {generatedStarter.starterTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Big Idea */}
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <p className="text-amber-200 text-sm font-medium">
                        💡 {generatedStarter.bigIdea}
                      </p>
                    </div>

                    {/* Starter Paragraph */}
                    {generatedStarter.starterParagraph && (
                      <p className="text-purple-200 text-sm leading-relaxed">
                        {generatedStarter.starterParagraph}
                      </p>
                    )}

                    {/* Palace Anchors */}
                    {generatedStarter.palaceAnchors && generatedStarter.palaceAnchors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {generatedStarter.palaceAnchors.map((anchor, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30"
                          >
                            {anchor}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Room Refs */}
                    {generatedStarter.roomRefs && generatedStarter.roomRefs.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {generatedStarter.roomRefs.map((ref) => (
                          <Badge
                            key={ref}
                            variant="secondary"
                            className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/30"
                          >
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Internal Template Section */}
                    {generatedStarter.internalTemplate && (
                      <div
                        className="pt-3 border-t border-white/10 cursor-pointer"
                        onClick={() => setExpandedSection(expandedSection === "template" ? null : "template")}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white/80">
                            Theological Framework
                          </h4>
                          <ChevronDown
                            className={`h-4 w-4 text-white/40 transition-transform ${
                              expandedSection === "template" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        <AnimatePresence>
                          {expandedSection === "template" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 space-y-2"
                            >
                              {generatedStarter.internalTemplate.governingPrinciple && (
                                <div className="text-xs">
                                  <span className="text-white/50">Governing Principle: </span>
                                  <span className="text-white/80">{generatedStarter.internalTemplate.governingPrinciple}</span>
                                </div>
                              )}
                              {generatedStarter.internalTemplate.christologicalAxis && (
                                <div className="text-xs">
                                  <span className="text-white/50">Christ Connection: </span>
                                  <span className="text-white/80">{generatedStarter.internalTemplate.christologicalAxis}</span>
                                </div>
                              )}
                              {generatedStarter.internalTemplate.falseCenterExposed && (
                                <div className="text-xs">
                                  <span className="text-white/50">False Center Exposed: </span>
                                  <span className="text-white/80">{generatedStarter.internalTemplate.falseCenterExposed}</span>
                                </div>
                              )}
                              {generatedStarter.internalTemplate.gospelResolution && (
                                <div className="text-xs">
                                  <span className="text-white/50">Gospel Resolution: </span>
                                  <span className="text-white/80">{generatedStarter.internalTemplate.gospelResolution}</span>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* Floors Section */}
                    {generatedStarter.floors && Object.keys(generatedStarter.floors).length > 0 && (
                      <div
                        className="pt-3 border-t border-white/10 cursor-pointer"
                        onClick={() => setExpandedSection(expandedSection === "floors" ? null : "floors")}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-white/80">
                            8-Floor PhotoTheology Scaffold
                          </h4>
                          <ChevronDown
                            className={`h-4 w-4 text-white/40 transition-transform ${
                              expandedSection === "floors" ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                        <AnimatePresence>
                          {expandedSection === "floors" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 grid gap-2"
                            >
                              {Object.entries(generatedStarter.floors).map(([floor, content]) => {
                                const floorData = content as Record<string, unknown>;
                                return (
                                  <div
                                    key={floor}
                                    className="p-2 rounded bg-white/5 text-xs"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge
                                        variant="outline"
                                        className="shrink-0 bg-purple-500/20 text-purple-300 border-purple-500/30"
                                      >
                                        {floor.replace("floor", "Floor ")}
                                      </Badge>
                                      {floorData?.roomUsed && (
                                        <span className="text-amber-300">{String(floorData.roomUsed)}</span>
                                      )}
                                    </div>
                                    {floorData?.keyWords && Array.isArray(floorData.keyWords) && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {(floorData.keyWords as string[]).slice(0, 5).map((word, i) => (
                                          <span key={i} className="text-white/60 bg-white/5 px-1 rounded">
                                            {word}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Featured Topics - show when no active generation */}
      {!showGeneratedResults && featuredTopics.length > 0 && !searchQuery && !selectedCategory && (
        <div>
          <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Featured Topics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {featuredTopics.map((topic, i) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/sermon-topics/${topic.slug}`} target="_blank">
                  <Card className="h-full bg-white/10 border-white/20 hover:bg-white/20 transition-all group">
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm text-white flex items-center justify-between">
                        <span className="truncate">{topic.title}</span>
                        <ExternalLink className="h-3 w-3 text-white/40 group-hover:text-white shrink-0" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="flex flex-wrap gap-1">
                        {topic.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/10 text-white/70">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Topic List - show when not generating */}
      {!showGeneratedResults && (
        <div>
          <h3 className="text-sm font-medium text-white/80 mb-3">
            {searchQuery || selectedCategory ? "Results" : "All Topics"}
            <span className="text-white/40 ml-2">({filteredTopics.length})</span>
          </h3>
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-white/10" />
                ))}
              </div>
            ) : filteredTopics.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/60 text-sm mb-3">No topics found matching your criteria.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="bg-white/10 border-white/20 text-white"
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTopics.map((topic, i) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  >
                    <Link to={`/sermon-topics/${topic.slug}`} target="_blank">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/15 transition-all group">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white text-sm truncate">{topic.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            {topic.category && (
                              <Badge variant="outline" className="text-xs border-white/20 text-white/60">
                                {topic.category}
                              </Badge>
                            )}
                            {topic.anchor_scriptures.length > 0 && (
                              <span className="text-xs text-white/40 truncate">
                                {topic.anchor_scriptures[0]}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white shrink-0 ml-2" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* View All Link */}
      <div className="text-center pt-2">
        <Link to="/sermon-topics" target="_blank">
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Building2 className="h-4 w-4 mr-2" />
            View Full Topics Hub
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
