import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
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
  { id: "doctrines", name: "Doctrines", icon: BookMarked, preview: "Sabbath, Sanctuary, State of the Dead", description: "Seventh-day Adventist doctrinal positions" },
  { id: "animals", name: "Animals", icon: PawPrint, preview: "Lion, Lamb, Serpent", description: "Animals and their biblical significance" },
];

const BibleEncyclopedia = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<string>("themes");
  const [searchResults, setSearchResults] = useState("");
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleRandomEntry = () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setSearchCategory(randomCategory.id);
    
    // Extract first example from preview
    const firstExample = randomCategory.preview.split(",")[0].trim();
    setSearchQuery(firstExample);
    
    toast({
      title: "Random Entry",
      description: `Exploring ${firstExample} in ${randomCategory.name}`,
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

      setSearchResults(data.content || "No results found.");
      
      // Set map image if available (for maps category)
      if (data.mapImageUrl) {
        setMapImageUrl(data.mapImageUrl);
      }
    } catch (error: any) {
      console.error("Encyclopedia search error:", error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search encyclopedia",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/30">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Book className="h-8 w-8 text-primary" />
                Bible Encyclopedia
              </CardTitle>
              <CardDescription className="text-lg">
                AI-powered biblical reference integrating Phototheology principles through Jeeves
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Random Entry Button */}
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={handleRandomEntry}
              className="gap-2"
            >
              <Shuffle className="h-4 w-4" />
              Random Entry
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
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    isActive ? "ring-2 ring-primary shadow-lg" : ""
                  }`}
                  onClick={() => setSearchCategory(category.id)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground">
                      <span className="font-semibold">Examples: </span>
                      {category.preview}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Search Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search {categories.find(c => c.id === searchCategory)?.name}
              </CardTitle>
              <CardDescription>
                {categories.find(c => c.id === searchCategory)?.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={`Search ${searchCategory}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      handleSearch();
                    }
                  }}
                  disabled={isSearching}
                />
                <Button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isSearching}
                  className="gradient-palace text-white"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </>
                  )}
                </Button>
              </div>

              {/* Quick Examples */}
              {!searchResults && (
                <div className="pt-4 border-t">
                  <div className="text-sm font-semibold mb-2 text-muted-foreground">Quick Examples:</div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.find(c => c.id === searchCategory)?.preview.split(",").map((example, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary/10" 
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
                <div className="pt-6 border-t">
                  {/* Map/Chart Image Display */}
                  {mapImageUrl && (searchCategory === "maps" || searchCategory === "charts") && (
                    <div className="mb-6 rounded-lg overflow-hidden border-2 border-primary/20 shadow-lg">
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
