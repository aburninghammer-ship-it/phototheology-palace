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
  Sparkles
} from "lucide-react";

const BibleEncyclopedia = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<"events" | "maps" | "prophecy" | "charts" | "people">("events");
  const [searchResults, setSearchResults] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults("");

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
                Comprehensive biblical reference with perspectives from multiple faith traditions
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search Categories */}
          <div className="grid gap-3 md:grid-cols-5">
            <Button
              variant={searchCategory === "events" ? "default" : "outline"}
              className={searchCategory === "events" ? "gradient-palace text-white" : ""}
              onClick={() => setSearchCategory("events")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Events
            </Button>
            <Button
              variant={searchCategory === "maps" ? "default" : "outline"}
              className={searchCategory === "maps" ? "gradient-palace text-white" : ""}
              onClick={() => setSearchCategory("maps")}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Maps
            </Button>
            <Button
              variant={searchCategory === "prophecy" ? "default" : "outline"}
              className={searchCategory === "prophecy" ? "gradient-palace text-white" : ""}
              onClick={() => setSearchCategory("prophecy")}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Prophecy
            </Button>
            <Button
              variant={searchCategory === "charts" ? "default" : "outline"}
              className={searchCategory === "charts" ? "gradient-palace text-white" : ""}
              onClick={() => setSearchCategory("charts")}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Charts
            </Button>
            <Button
              variant={searchCategory === "people" ? "default" : "outline"}
              className={searchCategory === "people" ? "gradient-palace text-white" : ""}
              onClick={() => setSearchCategory("people")}
            >
              <Users className="h-4 w-4 mr-2" />
              People
            </Button>
          </div>

          {/* Search Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {searchCategory === "events" && "Search Biblical Events"}
                {searchCategory === "maps" && "Search Places & Geography"}
                {searchCategory === "prophecy" && "Search Prophetic Events (SDA Understanding)"}
                {searchCategory === "charts" && "Search Timelines & Charts"}
                {searchCategory === "people" && "Search Biblical People"}
              </CardTitle>
              <CardDescription>
                {searchCategory === "events" && "Major events, miracles, and historical moments in scripture"}
                {searchCategory === "maps" && "Biblical locations, journeys, and geographical context"}
                {searchCategory === "prophecy" && "Prophetic timelines and end-time events from an SDA perspective"}
                {searchCategory === "charts" && "Visual timelines, genealogies, and comparative charts"}
                {searchCategory === "people" && "Biographical information about biblical figures"}
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
                    {searchCategory === "events" && (
                      <>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Exodus from Egypt"); }}>Exodus from Egypt</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Babylonian Captivity"); }}>Babylonian Captivity</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Pentecost"); }}>Pentecost</Badge>
                      </>
                    )}
                    {searchCategory === "maps" && (
                      <>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Jerusalem in Jesus' time"); }}>Jerusalem in Jesus' time</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Paul's missionary journeys"); }}>Paul's journeys</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("The Promised Land"); }}>Promised Land</Badge>
                      </>
                    )}
                    {searchCategory === "prophecy" && (
                      <>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("70 weeks prophecy"); }}>70 weeks prophecy</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("2300 day prophecy"); }}>2300 days</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Mark of the Beast"); }}>Mark of the Beast</Badge>
                      </>
                    )}
                    {searchCategory === "charts" && (
                      <>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Daniel 2 timeline"); }}>Daniel 2 timeline</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Kings of Israel and Judah"); }}>Kings chart</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Sanctuary services"); }}>Sanctuary services</Badge>
                      </>
                    )}
                    {searchCategory === "people" && (
                      <>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("King David"); }}>King David</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Apostle Paul"); }}>Apostle Paul</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Prophet Daniel"); }}>Prophet Daniel</Badge>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Results */}
              {searchResults && (
                <div className="pt-6 border-t">
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
