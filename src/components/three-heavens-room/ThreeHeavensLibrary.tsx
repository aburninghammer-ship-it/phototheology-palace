import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ChevronRight, Library, Sparkles, Cloud, AlertTriangle, CheckCircle } from "lucide-react";
import {
  threeHeavensExplanations,
  propheticPassages,
  threeCycles,
  prophetsClassified,
  threeTemples,
  dayOfLordLanguage,
  zechariahSequence,
  signOfJonah,
  fourKeysToUnderstandingProphecy,
  gerizimEbalPattern,
  searchProphecies,
  type PropheticPassage,
  type HeavenLevel
} from "@/data/threeHeavensLibrary";

interface ThreeHeavensLibraryProps {
  onClose?: () => void;
}

const HEAVEN_CONFIG: Record<HeavenLevel, { icon: string; color: string; bg: string; name: string }> = {
  "1H": { 
    icon: "🌍", 
    color: "text-blue-700 dark:text-blue-400", 
    bg: "bg-blue-500/10 border-blue-500/30",
    name: "First Heaven" 
  },
  "2H": { 
    icon: "⛪", 
    color: "text-purple-700 dark:text-purple-400", 
    bg: "bg-purple-500/10 border-purple-500/30",
    name: "Second Heaven" 
  },
  "3H": { 
    icon: "👑", 
    color: "text-amber-700 dark:text-amber-400", 
    bg: "bg-amber-500/10 border-amber-500/30",
    name: "Third Heaven" 
  }
};

type LibraryTab = "overview" | "cycles" | "prophets" | "horizons" | "passages" | "rules";

export function ThreeHeavensLibrary({ onClose }: ThreeHeavensLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("overview");
  const [selectedHorizon, setSelectedHorizon] = useState<HeavenLevel | null>(null);
  const [selectedPassage, setSelectedPassage] = useState<PropheticPassage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PropheticPassage[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
const results = searchProphecies(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Render passage detail view
  if (selectedPassage) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedPassage(null)}>
              ← Back to Library
            </Button>
            {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
          </div>
          <CardTitle className="mt-2">{selectedPassage.title}</CardTitle>
          <CardDescription>{selectedPassage.reference}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {/* Primary Text */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="italic text-sm">&ldquo;{selectedPassage.text}&rdquo;</p>
              </div>

              {/* Category & Context */}
              <div>
                <Badge variant="secondary" className="mb-2">{selectedPassage.category}</Badge>
                <p className="text-sm">{selectedPassage.primaryContext}</p>
              </div>

              {/* Three Heaven Fulfillments */}
              <div>
                <h4 className="font-semibold mb-3">Fulfillments Across the Three Heavens</h4>
                <div className="space-y-4">
                  {selectedPassage.fulfillments.map((f, i) => {
                    const config = HEAVEN_CONFIG[f.heaven];
                    return (
                      <div key={i} className={`p-4 rounded-lg border ${config.bg}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{config.icon}</span>
                          <span className={`font-bold ${config.color}`}>{config.name} ({f.heaven})</span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div><strong>Event:</strong> {f.event}</div>
                          <div><strong>Date:</strong> {f.date}</div>
                          <div><strong>Description:</strong> {f.description}</div>
                          <div><strong>Historical Connection:</strong> {f.historicalConnection}</div>
                          <div><strong>Spiritual Significance:</strong> {f.spiritualSignificance}</div>
                          {f.textualMarkers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {f.textualMarkers.map((m, j) => (
                                <Badge key={j} variant="outline" className="text-xs">{m}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interpretive Notes */}
              {selectedPassage.interpretiveNotes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Interpretive Notes</h4>
                  <ul className="space-y-1">
                    {selectedPassage.interpretiveNotes.map((note, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Sparkles className="h-3 w-3 mt-1 text-primary shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Render horizon detail view
  if (selectedHorizon) {
    const explanation = threeHeavensExplanations.find(e => e.level === selectedHorizon);
    const config = HEAVEN_CONFIG[selectedHorizon];
    const horizonPassages = propheticPassages.filter(p => 
      p.fulfillments.some(f => f.heaven === selectedHorizon)
    );

    if (!explanation) return null;

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedHorizon(null)}>
              ← Back to Overview
            </Button>
            {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <CardTitle className={config.color}>{explanation.fullName}</CardTitle>
              <CardDescription>{explanation.timeframe}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {/* Description */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm">{explanation.description}</p>
              </div>

              {/* Characteristics */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> Characteristics
                </h4>
                <ul className="space-y-1">
                  {explanation.characteristics.map((c, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Markers */}
              <div>
                <h4 className="font-semibold mb-2">Key Markers to Identify</h4>
                <div className="flex flex-wrap gap-2">
                  {explanation.keyMarkers.map((m, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                  ))}
                </div>
              </div>

              {/* Audience Clues */}
              <div>
                <h4 className="font-semibold mb-2">Audience Clues</h4>
                <ul className="space-y-1">
                  {explanation.audienceClues.map((c, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">→</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" /> Common Mistakes
                </h4>
                <ul className="space-y-1">
                  {explanation.commonMistakes.map((m, i) => (
                    <li key={i} className="text-sm">• {m}</li>
                  ))}
                </ul>
              </div>

              {/* Example Passages */}
              <div>
                <h4 className="font-semibold mb-3">Example Passages ({horizonPassages.length})</h4>
                <div className="space-y-2">
                  {horizonPassages.slice(0, 5).map(p => (
                    <div
                      key={p.id}
                      className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => setSelectedPassage(p)}
                    >
                      <div className="font-medium">{p.reference}</div>
                      <div className="text-sm text-muted-foreground">{p.title}</div>
                    </div>
                  ))}
                </div>
              </div>
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
              <Library className="h-5 w-5 text-purple-500" />
              Three Heavens Library
            </CardTitle>
            <CardDescription>
              Prophetic horizons: 1H, 2H, and 3H fulfillments
            </CardDescription>
          </div>
          {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prophecies, passages..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchQuery.length >= 2 && searchResults.length > 0 && (
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2">
              {searchResults.map(passage => (
                <div
                  key={passage.id}
                  className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setSelectedPassage(passage)}
                >
                  <div className="font-medium">{passage.reference}</div>
                  <div className="text-sm text-muted-foreground">{passage.title}</div>
                  <div className="flex gap-1 mt-1">
                    {passage.fulfillments.map((f, i) => {
                      const config = HEAVEN_CONFIG[f.heaven];
                      return (
                        <Badge key={i} className={config.bg} variant="outline">{f.heaven}</Badge>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No passages found for &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {/* Main Content */}
        {searchQuery.length < 2 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)}>
            <TabsList className="grid grid-cols-6 w-full mb-2">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="cycles" className="text-xs">3 Cycles</TabsTrigger>
              <TabsTrigger value="prophets" className="text-xs">Prophets</TabsTrigger>
              <TabsTrigger value="horizons" className="text-xs">Horizons</TabsTrigger>
              <TabsTrigger value="passages" className="text-xs">Passages</TabsTrigger>
              <TabsTrigger value="rules" className="text-xs">Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {/* Core Concept */}
                  <div className="p-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <Cloud className="h-4 w-4 text-purple-500" />
                      The Three Heavens Framework
                    </h4>
                    <p className="text-sm mb-3">
                      A prophecy must be <strong>ANCHORED</strong> in its PRIMARY horizon before any SECONDARY or TERTIARY application is allowed.
                    </p>
                    <div className="text-xs p-2 bg-amber-500/10 rounded border border-amber-500/20">
                      <strong>Core Rule:</strong> No anchoring → no expansion. No exceptions.
                    </div>
                  </div>

                  {/* The Three Horizons Quick View */}
                  <div className="space-y-3">
                    {threeHeavensExplanations.map(exp => {
                      const config = HEAVEN_CONFIG[exp.level];
                      return (
                        <div
                          key={exp.level}
                          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${config.bg}`}
                          onClick={() => setSelectedHorizon(exp.level)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{config.icon}</span>
                              <div>
                                <div className={`font-bold ${config.color}`}>{exp.level} — {exp.name}</div>
                                <div className="text-xs opacity-75">{exp.fullName}</div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 opacity-50" />
                          </div>
                          <p className="text-sm mt-2 opacity-80">{exp.timeframe}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="cycles">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {/* Master Chart */}
                  <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                    <h4 className="font-bold mb-3 text-amber-700 dark:text-amber-400">The Three Cycles of History</h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Each cycle follows the pattern: Sin → Day of the Lord → New Heaven & Earth
                    </p>
                  </div>

                  {threeCycles.map((cycle) => (
                    <div key={cycle.number} className={`p-4 rounded-lg border ${
                      cycle.number === 1 ? 'bg-blue-500/10 border-blue-500/30' :
                      cycle.number === 2 ? 'bg-purple-500/10 border-purple-500/30' :
                      'bg-amber-500/10 border-amber-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{cycle.number === 1 ? '1️⃣' : cycle.number === 2 ? '2️⃣' : '3️⃣'}</span>
                        <div>
                          <div className="font-bold">{cycle.name}</div>
                          <div className="text-xs opacity-75">{cycle.startDate} → {cycle.endDate}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div><strong>Day of Lord:</strong> {cycle.dayOfTheLord}</div>
                        <div><strong>Catalyst:</strong> {cycle.catalyst}</div>
                        <div><strong>Duration:</strong> {cycle.duration}</div>
                        <div><strong>New H&E:</strong> {cycle.newHeavenAndEarth}</div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cycle.keyProphets.slice(0, 4).map((p, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                        {cycle.keyProphets.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{cycle.keyProphets.length - 4}</Badge>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Three Temples */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-bold mb-3">The Three Temples</h4>
                    <div className="space-y-2">
                      {threeTemples.map((temple) => (
                        <div key={temple.number} className="p-3 bg-background rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold">{temple.name}</span>
                            <Badge variant="outline">{temple.builtDate}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div><strong>Glory:</strong> {temple.glory} ({temple.gloryReference})</div>
                            <div><strong>High Priest:</strong> {temple.highPriest}</div>
                            {temple.destroyedBy !== "N/A" && (
                              <div className="text-red-600">Destroyed: {temple.destroyedDate} by {temple.destroyedBy}</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Day of Lord Language Comparison */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-bold mb-3">Day of the Lord Language Across Cycles</h4>
                    <div className="text-xs space-y-1">
                      {dayOfLordLanguage.slice(0, 5).map((item, i) => (
                        <div key={i} className="grid grid-cols-4 gap-1 p-1 bg-background rounded">
                          <span className="font-medium">{item.description}</span>
                          <span className="text-blue-600">{item.cycle1Reference}</span>
                          <span className="text-purple-600">{item.cycle2Reference}</span>
                          <span className="text-amber-600">{item.cycle3Reference}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Same apocalyptic language describes local judgments AND final Day
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="prophets">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {/* Pre-Exilic Prophets */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-bold mb-2 text-blue-700 dark:text-blue-400">
                      Pre-Exilic Prophets (Before Babylon)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Point to: Babylonian destruction AND restoration
                    </p>
                    <div className="space-y-2">
                      {prophetsClassified.filter(p => p.era === 'pre-exilic').map((prophet) => (
                        <div key={prophet.name} className="p-2 bg-background rounded border">
                          <div className="font-medium">{prophet.name}</div>
                          <div className="text-xs text-muted-foreground">{prophet.primaryFocus}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prophet.pointsTo.map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Post-Exilic Prophets */}
                  <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="font-bold mb-2 text-purple-700 dark:text-purple-400">
                      Post-Exilic Prophets (After Babylon)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Point to: Messiah's coming AND Roman destruction
                    </p>
                    <div className="space-y-2">
                      {prophetsClassified.filter(p => p.era === 'post-exilic').map((prophet) => (
                        <div key={prophet.name} className="p-2 bg-background rounded border">
                          <div className="font-medium">{prophet.name}</div>
                          <div className="text-xs text-muted-foreground">{prophet.primaryFocus}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prophet.pointsTo.map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special: Post-Siege Books */}
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h4 className="font-bold mb-2 text-amber-700 dark:text-amber-400">
                      Post-Siege Books (After 70 AD)
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      Only apply primarily to final time
                    </p>
                    <div className="space-y-2">
                      {prophetsClassified.filter(p => p.era === 'special').map((prophet) => (
                        <div key={prophet.name} className="p-2 bg-background rounded border">
                          <div className="font-medium">{prophet.name}</div>
                          <div className="text-xs text-muted-foreground">{prophet.primaryFocus}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prophet.pointsTo.map((p, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Zechariah Sequence */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-bold mb-2">Zechariah's Sequential Prophecy</h4>
                    <div className="space-y-1 text-xs">
                      {zechariahSequence.map((item, i) => (
                        <div key={i} className="grid grid-cols-3 gap-2 p-1 bg-background rounded">
                          <span className="font-medium">Ch. {item.chapters}</span>
                          <span>{item.content}</span>
                          <span className="text-muted-foreground">{item.timeframe}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sign of Jonah */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-bold mb-2">The Sign of Jonah Pattern</h4>
                    <div className="space-y-2">
                      {signOfJonah.map((item, i) => (
                        <div key={i} className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-blue-500/10 rounded">
                            <strong>Jonah:</strong> {item.jonahExperience}
                          </div>
                          <div className="p-2 bg-purple-500/10 rounded">
                            <strong>Christ:</strong> {item.christFulfillment}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="horizons">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {threeHeavensExplanations.map(exp => {
                    const config = HEAVEN_CONFIG[exp.level];
                    return (
                      <div
                        key={exp.level}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${config.bg}`}
                        onClick={() => setSelectedHorizon(exp.level)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <div className={`font-bold ${config.color}`}>{exp.fullName}</div>
                            <div className="text-xs">{exp.timeframe}</div>
                          </div>
                        </div>
                        <p className="text-sm line-clamp-3">{exp.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {exp.keyMarkers.slice(0, 3).map((m, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{m}</Badge>
                          ))}
                          {exp.keyMarkers.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{exp.keyMarkers.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="passages">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-2">
                  {propheticPassages.map(passage => (
                    <div
                      key={passage.id}
                      className="p-3 bg-muted/50 rounded-lg border cursor-pointer hover:border-primary/30 transition-colors"
                      onClick={() => setSelectedPassage(passage)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{passage.reference}</div>
                          <div className="text-sm text-muted-foreground">{passage.title}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex gap-1 mt-2">
                        {passage.fulfillments.map((f, i) => {
                          const config = HEAVEN_CONFIG[f.heaven];
                          return (
                            <Badge key={i} className={config.bg} variant="outline">{f.heaven}</Badge>
                          );
                        })}
                        <Badge variant="secondary">{passage.category}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="rules">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {/* Four Keys */}
                  <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20">
                    <h4 className="font-bold mb-3 text-amber-700 dark:text-amber-400">
                      Four Keys to Understanding Prophecy
                    </h4>
                    <div className="space-y-3">
                      {fourKeysToUnderstandingProphecy.map((key) => (
                        <div key={key.number} className="p-3 bg-background rounded border">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-amber-600">Key {key.number}:</span>
                            <span className="font-medium">{key.title}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{key.description}</p>
                          <Badge variant="outline" className="text-xs mt-1">{key.scriptureReference}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-red-600">Core Governing Law</h4>
                    <p className="text-sm">
                      A prophecy must be ANCHORED in its PRIMARY horizon before any SECONDARY or TERTIARY application is allowed.
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• No anchoring → no expansion</li>
                      <li>• No exceptions</li>
                      <li>• No &quot;both/and&quot; hand-waving</li>
                    </ul>
                  </div>

                  {/* Gerizim/Ebal Pattern */}
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <h4 className="font-bold mb-2">Gerizim/Ebal Blessing-Curse Pattern</h4>
                    <div className="space-y-2">
                      {gerizimEbalPattern.map((pattern) => (
                        <div key={pattern.cycle} className={`p-2 rounded border ${
                          pattern.cycle === 1 ? 'bg-blue-500/5' :
                          pattern.cycle === 2 ? 'bg-purple-500/5' :
                          'bg-amber-500/5'
                        }`}>
                          <div className="font-medium text-sm">Cycle {pattern.cycle}: {pattern.condition}</div>
                          <div className="grid grid-cols-2 gap-2 text-xs mt-1">
                            <div className="text-green-600">Blessing: {pattern.blessing.slice(0, 2).join(', ')}</div>
                            <div className="text-red-600">Curse: {pattern.curse.slice(0, 2).join(', ')}</div>
                          </div>
                          <div className="text-xs mt-1">
                            <span className="text-red-700">Result:</span> {pattern.curseResult} →
                            <span className="text-green-700"> Restoration:</span> {pattern.restoration}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-blue-600">1H — First Heaven Rule</h4>
                    <p className="text-sm">
                      If a passage speaks directly to Israel returning, rebuilding, replanting, or reconstituting, it belongs here first.
                    </p>
                  </div>

                  <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-purple-600">2H — Second Heaven Rule</h4>
                    <p className="text-sm">
                      If Jesus says &quot;this generation&quot; or the temple is in view → check 2H first.
                    </p>
                  </div>

                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <h4 className="font-bold mb-2 text-amber-600">3H — Third Heaven Rule</h4>
                    <p className="text-sm">
                      3H NEVER replaces 1H or 2H — it consummates what they prefigure.
                    </p>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Decision Questions</h4>
                    <ol className="space-y-2 text-sm">
                      <li>1. Is the audience explicitly post-exilic Israel? → 1H</li>
                      <li>2. Is the temple standing or about to fall? → 2H</li>
                      <li>3. Is death abolished and God dwelling with humanity? → 3H</li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-2">No skipping steps.</p>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
