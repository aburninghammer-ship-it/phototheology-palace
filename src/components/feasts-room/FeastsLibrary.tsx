import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  ChevronRight,
  Sparkles,
  Calendar,
  Cross,
  CheckCircle2,
  Clock,
  Wheat,
  Leaf
} from "lucide-react";
import {
  biblicalFeasts,
  feastGroups,
  searchFeasts,
  getSpringFeasts,
  getFallFeasts,
  getTotalFeastsCount,
  getFeastById,
  feastTimeline,
  type BiblicalFeast,
  type FeastGroup
} from "@/data/feastsLibrary";

interface FeastsLibraryProps {
  onClose?: () => void;
}

export function FeastsLibrary({ onClose }: FeastsLibraryProps) {
  const [selectedFeast, setSelectedFeast] = useState<BiblicalFeast | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BiblicalFeast[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "spring" | "fall">("overview");

  const totalFeasts = getTotalFeastsCount();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchFeasts(query));
      setSelectedFeast(null);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectFeast = (feast: BiblicalFeast) => {
    setSelectedFeast(feast);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleBack = () => {
    setSelectedFeast(null);
  };

  // Feast Detail View
  if (selectedFeast) {
    const isFulfilled = selectedFeast.season === "spring";
    
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Feasts
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-6 rounded-xl border">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedFeast.name}</h2>
                <p className="text-lg text-muted-foreground italic">{selectedFeast.hebrewName}</p>
                <p className="text-sm text-muted-foreground mt-1">"{selectedFeast.hebrewMeaning}"</p>
              </div>
              <Badge variant={isFulfilled ? "default" : "secondary"} className="text-sm">
                {isFulfilled ? (
                  <><CheckCircle2 className="h-3 w-3 mr-1" /> Fulfilled</>
                ) : (
                  <><Clock className="h-3 w-3 mr-1" /> Awaiting</>
                )}
              </Badge>
            </div>
            <div className="flex gap-4 mt-4 text-sm">
              <Badge variant="outline">
                <Calendar className="h-3 w-3 mr-1" />
                Month {selectedFeast.month}, Day {selectedFeast.day}
              </Badge>
              <Badge variant="outline">{selectedFeast.duration}</Badge>
              <Badge variant="outline" className={isFulfilled ? "bg-green-500/10" : "bg-amber-500/10"}>
                {isFulfilled ? <Leaf className="h-3 w-3 mr-1" /> : <Wheat className="h-3 w-3 mr-1" />}
                {selectedFeast.season === "spring" ? "Spring Feast" : "Fall Feast"}
              </Badge>
            </div>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {/* Agricultural Context */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-amber-500" />
                  Agricultural Context
                </h4>
                <p className="text-muted-foreground leading-relaxed">{selectedFeast.agriculturalContext}</p>
              </div>

              {/* Historical Commemoration */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  Historical Commemoration
                </h4>
                <p className="text-muted-foreground leading-relaxed">{selectedFeast.historicalCommemoration}</p>
              </div>

              {/* Christ Fulfillment */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 rounded-lg border border-yellow-500/20">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Cross className="h-4 w-4 text-yellow-600" />
                  Christ Fulfillment
                </h4>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">{selectedFeast.christFulfillment.event}</span>
                    <Badge variant="outline" className="ml-2">{selectedFeast.christFulfillment.date}</Badge>
                  </div>
                  <p className="text-muted-foreground">{selectedFeast.christFulfillment.description}</p>
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">Fulfillment Details:</p>
                    <ul className="space-y-1">
                      {selectedFeast.christFulfillment.fulfillmentDetails.map((detail, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 mt-1 text-green-500 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h4 className="font-semibold mb-2">Instructions from Leviticus 23</h4>
                <ul className="space-y-1">
                  {selectedFeast.instructions.map((instruction, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rituals */}
              {selectedFeast.rituals.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Key Rituals & Symbolism</h4>
                  <div className="space-y-4">
                    {selectedFeast.rituals.map((ritual, i) => (
                      <Card key={i} className="bg-muted/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{ritual.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                          <p><span className="font-medium">Description:</span> {ritual.description}</p>
                          <p><span className="font-medium">Symbolism:</span> {ritual.symbolism}</p>
                          <p className="text-primary"><span className="font-medium">Christ Connection:</span> {ritual.christConnection}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Prophetic Significance */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Prophetic Significance
                </h4>
                <p className="text-muted-foreground leading-relaxed">{selectedFeast.propheticSignificance}</p>
              </div>

              {/* Church Application */}
              <div>
                <h4 className="font-semibold mb-2">Church Application Today</h4>
                <ul className="space-y-1">
                  {selectedFeast.churchApplication.map((app, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <ChevronRight className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                      {app}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Verses */}
              <div>
                <h4 className="font-semibold mb-2">Key Verses</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFeast.keyVerses.map((verse, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/5">{verse}</Badge>
                  ))}
                </div>
              </div>

              {/* Proof Texts */}
              <div>
                <h4 className="font-semibold mb-2">Christ Fulfillment Proof Texts</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFeast.christFulfillment.proofTexts.map((verse, i) => (
                    <Badge key={i} variant="secondary">{verse}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Main Library View
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search feasts by name, Hebrew name, or theme..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="text-sm">
          {totalFeasts} Biblical Feasts
        </Badge>
        <Badge variant="outline" className="bg-green-500/10">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          4 Fulfilled (Spring)
        </Badge>
        <Badge variant="outline" className="bg-amber-500/10">
          <Clock className="h-3 w-3 mr-1" />
          3 Awaiting (Fall)
        </Badge>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 ? (
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Search Results ({searchResults.length})</h4>
          <ScrollArea className="h-[400px]">
            <div className="space-y-2">
              {searchResults.map((feast) => (
                <FeastCard key={feast.id} feast={feast} onClick={() => handleSelectFeast(feast)} />
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spring">Spring Feasts</TabsTrigger>
            <TabsTrigger value="fall">Fall Feasts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Prophetic Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  God's Prophetic Calendar
                </CardTitle>
                <CardDescription>
                  The 7 feasts of Leviticus 23 reveal Christ's complete redemptive work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-amber-500 to-orange-500" />
                  <div className="space-y-4 pl-10">
                    {feastTimeline.map((item, i) => {
                      const feast = getFeastById(item.feast);
                      return (
                        <div 
                          key={i} 
                          className="relative cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                          onClick={() => feast && handleSelectFeast(feast)}
                        >
                          <div className={`absolute -left-8 top-2 w-4 h-4 rounded-full border-2 ${
                            item.fulfilled 
                              ? "bg-green-500 border-green-600" 
                              : "bg-amber-500 border-amber-600"
                          }`} />
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <p className="font-medium">{feast?.name || item.feast}</p>
                              <p className="text-sm text-muted-foreground">{item.event}</p>
                            </div>
                            <Badge variant={item.fulfilled ? "default" : "secondary"}>
                              {item.year}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feast Groups */}
            {feastGroups.map((group) => (
              <Card key={group.id} className={group.season === "spring" ? "border-green-500/30" : "border-amber-500/30"}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <p className="text-sm text-muted-foreground italic">{group.hebrewName}</p>
                    </div>
                    <Badge variant={group.season === "spring" ? "default" : "secondary"}>
                      {group.season === "spring" ? "1st Coming" : "2nd Coming"}
                    </Badge>
                  </div>
                  <CardDescription>{group.theme}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{group.prophetic}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {group.feasts.map((feastId) => {
                      const feast = getFeastById(feastId);
                      if (!feast) return null;
                      return (
                        <Button
                          key={feastId}
                          variant="outline"
                          className="justify-start h-auto py-2"
                          onClick={() => handleSelectFeast(feast)}
                        >
                          <div className="text-left">
                            <p className="font-medium">{feast.name}</p>
                            <p className="text-xs text-muted-foreground">{feast.hebrewName}</p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="spring" className="mt-4">
            <div className="space-y-3">
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20 mb-4">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  Spring Feasts - First Coming of Christ
                </h4>
                <p className="text-sm text-muted-foreground">
                  All spring feasts were fulfilled at Christ's first coming, on the exact days they were celebrated.
                </p>
              </div>
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {getSpringFeasts().map((feast) => (
                    <FeastCard key={feast.id} feast={feast} onClick={() => handleSelectFeast(feast)} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="fall" className="mt-4">
            <div className="space-y-3">
              <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 mb-4">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Wheat className="h-4 w-4 text-amber-600" />
                  Fall Feasts - Second Coming of Christ
                </h4>
                <p className="text-sm text-muted-foreground">
                  The fall feasts await fulfillment at Christ's second coming. The gap between spring and fall represents the church age.
                </p>
              </div>
              <ScrollArea className="h-[350px]">
                <div className="space-y-2">
                  {getFallFeasts().map((feast) => (
                    <FeastCard key={feast.id} feast={feast} onClick={() => handleSelectFeast(feast)} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Feast Card Component
function FeastCard({ feast, onClick }: { feast: BiblicalFeast; onClick: () => void }) {
  const isFulfilled = feast.season === "spring";
  
  return (
    <Card 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{feast.name}</h4>
              <Badge variant="outline" className="text-xs">{feast.hebrewName}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{feast.christFulfillment.event}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary" className="text-xs">
                Month {feast.month}, Day {feast.day}
              </Badge>
              <Badge variant={isFulfilled ? "default" : "secondary"} className="text-xs">
                {isFulfilled ? "Fulfilled" : "Awaiting"}
              </Badge>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
