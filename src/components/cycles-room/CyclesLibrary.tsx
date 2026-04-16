import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, ChevronRight, Library, Sparkles, RefreshCw, ArrowRight } from "lucide-react";
import { 
  cyclesLibrary, 
  getCycleEntries, 
  searchCyclesLibrary,
  getAllComparisons,
  type CycleEntry
} from "@/data/cyclesLibrary";
import { CycleCode } from "@/data/phototheologySystem";

interface CyclesLibraryProps {
  onClose?: () => void;
}

const CYCLE_CONFIG: Record<CycleCode, { icon: string; color: string; name: string }> = {
  "@Ad": { icon: "🌳", color: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400", name: "Adamic" },
  "@No": { icon: "🌊", color: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400", name: "Noahic" },
  "@Ab": { icon: "⭐", color: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400", name: "Abrahamic" },
  "@Mo": { icon: "📜", color: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-400", name: "Mosaic" },
  "@Cy": { icon: "🏛️", color: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-400", name: "Cyrusic" },
  "@CyC": { icon: "✝️", color: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400", name: "Cyrus-Christ" },
  "@Sp": { icon: "🔥", color: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-400", name: "Spirit" },
  "@Re": { icon: "👑", color: "bg-indigo-500/10 border-indigo-500/30 text-indigo-700 dark:text-indigo-400", name: "Remnant" }
};

const PHASE_CONFIG = {
  fall: { icon: "⬇️", color: "text-red-600", label: "Fall" },
  covenant: { icon: "📖", color: "text-blue-600", label: "Covenant" },
  sanctuary: { icon: "⛪", color: "text-purple-600", label: "Sanctuary" },
  enemy: { icon: "⚔️", color: "text-orange-600", label: "Enemy" },
  restoration: { icon: "🌅", color: "text-green-600", label: "Restoration" }
};

type LibraryTab = "overview" | "cycles" | "comparisons" | "phases";

export function CyclesLibrary({ onClose }: CyclesLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("overview");
  const [selectedCycle, setSelectedCycle] = useState<CycleCode | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<CycleEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CycleEntry[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      const results = searchCyclesLibrary(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  // Render entry detail view
  if (selectedEntry) {
    const config = CYCLE_CONFIG[selectedEntry.cycleCode];
    const phaseConfig = PHASE_CONFIG[selectedEntry.phase];
    
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(null)}>
              ← Back to Library
            </Button>
            {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl">{config.icon}</span>
            <CardTitle>{selectedEntry.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={config.color}>{selectedEntry.cycleCode}</Badge>
            <Badge variant="outline" className={phaseConfig.color}>
              {phaseConfig.icon} {phaseConfig.label} Phase
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-6">
              {/* Description */}
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Overview</h4>
                <p className="text-sm">{selectedEntry.description}</p>
              </div>

              {/* Key Texts */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Key Texts
                </h4>
                <div className="space-y-3">
                  {selectedEntry.keyTexts.map((kt, i) => (
                    <div key={i} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="font-medium text-primary">{kt.reference}</div>
                      <p className="text-sm italic mt-1">&ldquo;{kt.text}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connections */}
              <div>
                <h4 className="font-semibold mb-2">Connections & Themes</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.connections.map((conn, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {conn}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Christ Connection */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  ✝️ Christ Connection
                </h4>
                <p className="text-sm">{selectedEntry.christConnection}</p>
              </div>

              {/* Study Questions */}
              <div>
                <h4 className="font-semibold mb-3">Study Questions</h4>
                <ul className="space-y-2">
                  {selectedEntry.studyQuestions.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  // Render cycle detail view
  if (selectedCycle) {
    const config = CYCLE_CONFIG[selectedCycle];
    const entries = getCycleEntries(selectedCycle);

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={() => setSelectedCycle(null)}>
              ← Back to Overview
            </Button>
            {onClose && <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <CardTitle>{config.name} Cycle ({selectedCycle})</CardTitle>
              <CardDescription>Covenant cycle of redemption history</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-4">

              {/* Five Phases */}
              <h4 className="font-semibold flex items-center gap-2">
                <RefreshCw className="h-4 w-4" /> The Five Phases
              </h4>
              <div className="space-y-2">
                {(["fall", "covenant", "sanctuary", "enemy", "restoration"] as const).map(phase => {
                  const entry = entries.find(e => e.phase === phase);
                  const phaseConfig = PHASE_CONFIG[phase];
                  return (
                    <div
                      key={phase}
                      className="p-3 bg-muted/50 rounded-lg border hover:border-primary/30 cursor-pointer transition-all"
                      onClick={() => entry && setSelectedEntry(entry)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={phaseConfig.color}>{phaseConfig.icon}</span>
                          <span className="font-medium">{entry?.title || `${phaseConfig.label} Phase`}</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {entry && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>
                      )}
                    </div>
                  );
                })}
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
              <Library className="h-5 w-5 text-indigo-500" />
              8 Cycles Library
            </CardTitle>
            <CardDescription>
              {cyclesLibrary.length} entries across 8 covenant cycles of redemption
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
            placeholder="Search cycles, phases, verses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results */}
        {searchQuery.length >= 2 && searchResults.length > 0 && (
          <ScrollArea className="h-[50vh]">
            <div className="space-y-2">
              {searchResults.map(entry => {
                const config = CYCLE_CONFIG[entry.cycleCode];
                return (
                  <div
                    key={entry.id}
                    className="p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span className="font-medium">{entry.title}</span>
                      <Badge className={config.color} variant="outline">{entry.cycleCode}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.description}</p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}

        {searchQuery.length >= 2 && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No entries found for &quot;{searchQuery}&quot;</p>
          </div>
        )}

        {/* Main Content */}
        {searchQuery.length < 2 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)}>
            <TabsList className="grid grid-cols-4 w-full mb-2">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="cycles" className="text-xs">8 Cycles</TabsTrigger>
              <TabsTrigger value="phases" className="text-xs">5 Phases</TabsTrigger>
              <TabsTrigger value="comparisons" className="text-xs">Patterns</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {/* Core Concept */}
                  <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-500/20">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-indigo-500" />
                      The 8 Covenant Cycles
                    </h4>
                    <p className="text-sm mb-3">
                      History moves in repeating patterns. Each cycle follows the same five-part rhythm: 
                      <strong> Fall → Covenant → Sanctuary → Enemy → Restoration</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Understanding these cycles helps you locate any text within redemption history 
                      and see how God&apos;s plan unfolds through time.
                    </p>
                  </div>

                  {/* Quick Cycle Overview */}
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(CYCLE_CONFIG) as CycleCode[]).map(code => {
                      const config = CYCLE_CONFIG[code];
                      return (
                        <div
                          key={code}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${config.color}`}
                          onClick={() => setSelectedCycle(code)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{config.icon}</span>
                            <div>
                              <div className="font-medium text-sm">{config.name}</div>
                              <div className="text-xs opacity-75">{code}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* The Pattern */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-3">The Five-Phase Pattern</h4>
                    <div className="flex items-center justify-between text-xs">
                      {Object.entries(PHASE_CONFIG).map(([phase, config], i) => (
                        <div key={phase} className="flex items-center gap-1">
                          <div className="text-center">
                            <div className="text-lg">{config.icon}</div>
                            <div className={`font-medium ${config.color}`}>{config.label}</div>
                          </div>
                          {i < 4 && <ArrowRight className="h-3 w-3 text-muted-foreground mx-1" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="cycles">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-3">
                  {(Object.keys(CYCLE_CONFIG) as CycleCode[]).map(code => {
                    const config = CYCLE_CONFIG[code];
                    const entries = getCycleEntries(code);
                    return (
                      <div
                        key={code}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${config.color}`}
                        onClick={() => setSelectedCycle(code)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{config.icon}</span>
                            <div>
                              <div className="font-bold">{config.name} Cycle</div>
                              <div className="text-xs opacity-75">{code} • {entries.length} entries</div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 opacity-50" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="phases">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  {(["fall", "covenant", "sanctuary", "enemy", "restoration"] as const).map(phase => {
                    const phaseConfig = PHASE_CONFIG[phase];
                    const phaseEntries = cyclesLibrary.filter(e => e.phase === phase);
                    return (
                      <div key={phase} className="p-4 bg-muted/50 rounded-lg">
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${phaseConfig.color}`}>
                          {phaseConfig.icon} {phaseConfig.label} Phase
                          <Badge variant="secondary">{phaseEntries.length}</Badge>
                        </h4>
                        <div className="space-y-2">
                          {phaseEntries.slice(0, 4).map(entry => {
                            const config = CYCLE_CONFIG[entry.cycleCode];
                            return (
                              <div
                                key={entry.id}
                                className="p-2 bg-background rounded border cursor-pointer hover:border-primary/30 transition-colors"
                                onClick={() => setSelectedEntry(entry)}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{config.icon}</span>
                                  <span className="text-sm font-medium">{entry.title}</span>
                                  <Badge className={config.color} variant="outline">{entry.cycleCode}</Badge>
                                </div>
                              </div>
                            );
                          })}
                          {phaseEntries.length > 4 && (
                            <div className="text-xs text-muted-foreground text-center">
                              +{phaseEntries.length - 4} more entries
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="comparisons">
              <ScrollArea className="h-[50vh]">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    See how the same themes manifest across different cycles, revealing the unity of God&apos;s redemptive plan.
                  </p>
                  {getAllComparisons().map(comp => (
                    <div key={comp.id} className="p-4 bg-muted/50 rounded-lg border">
                      <h4 className="font-bold mb-2">{comp.theme}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{comp.description}</p>
                      <div className="space-y-2">
                        {comp.acrossCycles.map((item, i) => {
                          const config = CYCLE_CONFIG[item.cycle];
                          return (
                            <div key={i} className="flex items-start gap-2 text-sm">
                              <span>{config.icon}</span>
                              <div>
                                <Badge className={config.color} variant="outline">{item.cycle}</Badge>
                                <span className="ml-2">{item.manifestation}</span>
                                <span className="text-xs text-muted-foreground ml-1">({item.keyText})</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-3 p-2 bg-amber-500/10 rounded text-sm">
                        <Sparkles className="h-3 w-3 inline mr-1 text-amber-500" />
                        <span className="font-medium">Insight:</span> {comp.insight}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
