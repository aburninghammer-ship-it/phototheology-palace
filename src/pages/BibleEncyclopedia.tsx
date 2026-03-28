import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { ENCYCLOPEDIA_TOUR } from "@/data/guidedTours";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { trackJeevesInteraction } from "@/hooks/useAnalyticsTracking";
import {
  Book,
  Search,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  Loader2,
  Sparkles,
  Flame,
  HelpCircle,
  Box,
  Tag,
  Triangle,
  Hash,
  PartyPopper,
  Scale,
  Crown,
  BookMarked,
  PawPrint,
  Shuffle
} from "lucide-react";

const categories = [
  { id: "themes", name: "Themes", icon: Flame, preview: "Covenant, Exile, Restoration", description: "Major theological themes and concepts" },
  { id: "questions", name: "Questions", icon: HelpCircle, preview: "Why did God..., What does...", description: "Common biblical questions answered" },
  { id: "people", name: "People", icon: Users, preview: "Moses, David, Paul", description: "Biographical information about biblical figures" },
  { id: "places", name: "Places", icon: MapPin, preview: "Jerusalem, Egypt, Babylon", description: "Biblical locations and geography" },
  { id: "objects", name: "Objects", icon: Box, preview: "Ark, Altar, Lampstand", description: "Sacred and significant items" },
  { id: "names", name: "Names", icon: Tag, preview: "Immanuel, Alpha, Omega", description: "Names and titles of God and Christ" },
  { id: "symbols", name: "Symbols", icon: Triangle, preview: "Lion, Lamb, Water", description: "Biblical symbolism and typology" },
  { id: "numbers", name: "Numbers", icon: Hash, preview: "7, 12, 40, 144,000", description: "Biblical numerology and significance" },
  { id: "feasts", name: "Feasts", icon: PartyPopper, preview: "Passover, Pentecost, Tabernacles", description: "Jewish festivals and their fulfillment" },
  { id: "laws", name: "Laws", icon: Scale, preview: "Ten Commandments, Ceremonial Laws", description: "Biblical laws and their application" },
  { id: "prophets", name: "Prophets", icon: Crown, preview: "Isaiah, Daniel, Revelation", description: "Prophetic books and messages" },
  { id: "doctrines", name: "Doctrines", icon: BookMarked, preview: "Sabbath, Sanctuary, State of the Dead", description: "Biblical doctrinal teachings and positions" },
  { id: "animals", name: "Animals", icon: PawPrint, preview: "Lion, Lamb, Serpent", description: "Animals and their biblical significance" },
];

const BibleEncyclopedia = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [urlSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<string>("themes");
  const [searchResults, setSearchResults] = useState("");
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const handleRandomEntry = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setSearchCategory(randomCategory.id);
    
    // Extract first example from preview
    const firstExample = randomCategory.preview.split(",")[0].trim();
    setSearchQuery(firstExample);
    
    toast({
      title: t('bibleEncyclopedia.randomEntry', 'Random Entry'),
      description: t('bibleEncyclopedia.exploringIn', 'Exploring {{example}} in {{category}}', { example: firstExample, category: randomCategory.name }),
    });
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults("");
    setMapImageUrl(null);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "encyclopedia",
          category: searchCategory,
          query: searchQuery,
        },
      });

      if (error) throw error;

      // Track the interaction
      trackJeevesInteraction(
        searchQuery,
        `encyclopedia-${searchCategory}`,
        data.content?.substring(0, 200),
        "Bible Encyclopedia"
      );

      setSearchResults(data.content || "No results found.");
      
      // Set map image if available (for maps category)
      if (data.mapImageUrl) {
        setMapImageUrl(data.mapImageUrl);
      }
    } catch (error: any) {
      console.error("Encyclopedia search error:", error);
      toast({
        title: t('bibleEncyclopedia.searchFailed', 'Search Failed'),
        description: error.message || t('bibleEncyclopedia.failedToSearch', 'Failed to search encyclopedia'),
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search from URL params (e.g., /encyclopedia?search=topic)
  useEffect(() => {
    if (initialSearchDone) return;
    const searchParam = urlSearchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
      setInitialSearchDone(true);
      // Trigger search after state updates
      setTimeout(async () => {
        setIsSearching(true);
        setSearchResults("");
        setMapImageUrl(null);
        try {
          const { data, error } = await supabase.functions.invoke("jeeves", {
            body: { mode: "encyclopedia", category: searchCategory, query: searchParam },
          });
          if (error) throw error;
          trackJeevesInteraction(searchParam, `encyclopedia-${searchCategory}`, data.content?.substring(0, 200), "Bible Encyclopedia");
          setSearchResults(data.content || "No results found.");
          if (data.mapImageUrl) setMapImageUrl(data.mapImageUrl);
        } catch (error: any) {
          console.error("Encyclopedia search error:", error);
          toast({ title: "Search Failed", description: error.message || "Failed to search encyclopedia", variant: "destructive" });
        } finally {
          setIsSearching(false);
        }
      }, 100);
    }
  }, [urlSearchParams, initialSearchDone]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-palace-purple/5 relative overflow-x-hidden">
      <Navigation />
      
      {/* Animated background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-palace-purple/10 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>
      
      <div className="pt-24 pb-32 md:pb-16 px-4 relative z-10">
        <div className="container mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <Card variant="glass" className="border-indigo-500/30">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center">
                  <Book className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                  {t('bibleEncyclopedia.title', 'Bible Encyclopedia')}
                </span>
              </CardTitle>
              <CardDescription className="text-lg">
                {t('bibleEncyclopedia.subtitle', 'AI-powered biblical reference integrating Phototheology principles through Jeeves')}
              </CardDescription>
              <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="mt-2 w-fit gap-1">
                <Book className="h-4 w-4" /> Guided Tour
              </Button>
            </CardHeader>
          </Card>
          {tourOpen && <GuidedTourOverlay steps={ENCYCLOPEDIA_TOUR} onClose={() => setTourOpen(false)} />}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {searchResults && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults("");
                  setMapImageUrl(null);
                }}
                className="gap-2 border-primary/30 hover:bg-primary/10"
              >
                <Search className="h-4 w-4" />
                {t('bibleEncyclopedia.newSearch', 'New Search')}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleRandomEntry}
              className="gap-2 border-white/20 hover:bg-white/10"
            >
              <Shuffle className="h-4 w-4" />
              {t('bibleEncyclopedia.randomEntry', 'Random Entry')}
            </Button>
          </div>

          {/* Search Categories */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = searchCategory === category.id;
              
              return (
                <Card
                  key={category.id}
                  variant="glass"
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    isActive ? "ring-2 ring-indigo-500 shadow-lg shadow-indigo-500/20" : ""
                  }`}
                  onClick={() => setSearchCategory(category.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className={`h-5 w-5 ${isActive ? "text-indigo-500" : ""}`} />
                      {t(`bibleEncyclopedia.category.${category.id}.name`, category.name)}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {t(`bibleEncyclopedia.category.${category.id}.description`, category.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">{t('bibleEncyclopedia.examples', 'Examples:')} </span>
                      {category.preview}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search Interface */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-500" />
                {t('bibleEncyclopedia.searchCategory', 'Search {{category}}', { category: categories.find(c => c.id === searchCategory)?.name })}
              </CardTitle>
              <CardDescription>
                {t(`bibleEncyclopedia.category.${searchCategory}.description`, categories.find(c => c.id === searchCategory)?.description)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t('bibleEncyclopedia.searchPlaceholder', 'Search {{category}}...', { category: searchCategory })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearch();
                    }
                  }}
                  disabled={isSearching}
                  className="bg-background/50 border-white/20"
                />
                <Button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {t('bibleEncyclopedia.searching', 'Searching...')}
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      {t('bibleEncyclopedia.search', 'Search')}
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Examples */}
              {!searchResults && (
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm font-semibold mb-2 text-muted-foreground">{t('bibleEncyclopedia.quickExamples', 'Quick Examples:')}</div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.find(c => c.id === searchCategory)?.preview.split(",").map((example, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-indigo-500/20 border-white/20" 
                        onClick={() => setSearchQuery(example.trim())}
                      >
                        {example.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {searchResults && (
                <div className="pt-6 border-t border-white/10">
                  {/* Map/Chart Image Display */}
                  {mapImageUrl && (searchCategory === "maps" || searchCategory === "charts") && (
                    <div className="mb-6 rounded-lg overflow-hidden border-2 border-indigo-500/20 shadow-lg">
                      <img 
                        src={mapImageUrl} 
                        alt={searchCategory === "maps" ? `Biblical map of ${searchQuery}` : `Prophetic chart for ${searchQuery}`}
                        className="w-full h-auto"
                      />
                    </div>
                  )}
                  
                  {/* Text Content */}
                  <div className="space-y-4 text-foreground">
                    {formatJeevesResponse(searchResults)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BibleEncyclopedia;