import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  BookOpen,
  Calendar,
  Church,
  Telescope,
  Heart,
  Sparkles,
  ChevronRight,
  Building2
} from "lucide-react";
import { motion } from "framer-motion";

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

const CATEGORIES = [
  { id: "Theme", label: "Themes", icon: BookOpen, color: "from-violet-500 to-purple-600" },
  { id: "Occasion", label: "Occasions", icon: Calendar, color: "from-amber-500 to-orange-600" },
  { id: "Doctrine", label: "Doctrine", icon: Church, color: "from-blue-500 to-indigo-600" },
  { id: "Prophecy", label: "Prophecy", icon: Telescope, color: "from-rose-500 to-red-600" },
  { id: "Christian Living", label: "Christian Living", icon: Heart, color: "from-emerald-500 to-teal-600" },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function SermonTopicsHub() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [topics, setTopics] = useState<SermonTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category") || null
  );
  const [selectedLetter, setSelectedLetter] = useState<string | null>(
    searchParams.get("letter") || null
  );

  // Fetch topics
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

  // Filter topics
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

    if (selectedLetter) {
      result = result.filter((t) =>
        t.title.toUpperCase().startsWith(selectedLetter)
      );
    }

    return result;
  }, [topics, searchQuery, selectedCategory, selectedLetter]);

  // Featured topics
  const featuredTopics = useMemo(
    () => topics.filter((t) => t.is_featured).slice(0, 6),
    [topics]
  );

  // Group by letter for A-Z index
  const topicsByLetter = useMemo(() => {
    const grouped: Record<string, SermonTopic[]> = {};
    topics.forEach((t) => {
      const letter = t.title[0].toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(t);
    });
    return grouped;
  }, [topics]);

  // Update URL params
  const updateFilters = (updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSelectedLetter(null);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-palace bg-clip-text text-transparent mb-4">
              {t('sermon.topics.title')}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {t('sermon.topics.description')}
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('sermon.topics.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateFilters({ q: e.target.value || null });
                }}
                className="pl-12 pr-4 py-6 text-lg rounded-full border-2 focus:border-primary"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Tiles */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('sermon.topics.browseByCategory')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    const newCategory = isActive ? null : cat.id;
                    setSelectedCategory(newCategory);
                    updateFilters({ category: newCategory });
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center mx-auto mb-3`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="font-medium">{cat.label}</span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* Featured Topics */}
        {featuredTopics.length > 0 && !searchQuery && !selectedCategory && !selectedLetter && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              {t('sermon.topics.featuredTopics')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/sermon-topics/${topic.slug}`}>
                    <Card className="h-full hover:border-primary/50 hover:shadow-lg transition-all group">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center justify-between">
                          <span>{topic.title}</span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {topic.summary || t('sermon.topics.defaultSummary')}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {topic.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
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
          </section>
        )}

        {/* A-Z Index */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{t('sermon.topics.azIndex')}</h2>
          <div className="flex flex-wrap gap-1 mb-6">
            {ALPHABET.map((letter) => {
              const hasTopics = topicsByLetter[letter]?.length > 0;
              const isActive = selectedLetter === letter;
              return (
                <Button
                  key={letter}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  disabled={!hasTopics}
                  onClick={() => {
                    const newLetter = isActive ? null : letter;
                    setSelectedLetter(newLetter);
                    updateFilters({ letter: newLetter });
                  }}
                  className="w-9 h-9 p-0"
                >
                  {letter}
                </Button>
              );
            })}
            {(selectedCategory || selectedLetter || searchQuery) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-2">
                {t('sermon.topics.clearFilters')}
              </Button>
            )}
          </div>
        </section>

        {/* Topic List */}
        <section>
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : filteredTopics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {t('sermon.topics.noTopicsFound')}
              </p>
              <Button variant="outline" onClick={clearFilters}>
                {t('sermon.topics.clearFilters')}
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                >
                  <Link to={`/sermon-topics/${topic.slug}`}>
                    <Card className="h-full hover:border-primary/50 hover:shadow-md transition-all group">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>{topic.title}</span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {topic.category && (
                            <Badge variant="outline" className="text-xs">
                              {topic.category}
                            </Badge>
                          )}
                          {topic.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        {topic.anchor_scriptures.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {topic.anchor_scriptures.slice(0, 2).join(", ")}
                            {topic.anchor_scriptures.length > 2 && "..."}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Stats */}
        {!loading && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {t('sermon.topics.showingCount', { showing: filteredTopics.length, total: topics.length })}
          </div>
        )}
      </div>
    </div>
  );
}
