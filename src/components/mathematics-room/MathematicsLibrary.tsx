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
  Clock,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Key,
  BookOpenCheck
} from "lucide-react";
import {
  timeProphecies,
  scriptureConnectionGrid,
  genreLabels,
  functionQuestions,
  prophecyTimeline,
  getTotalPropheciesCount,
  getProphecyByCode,
  type TimeProphecy,
  type ProphecyScriptureGrid,
  type ScriptureGenre,
  type ProphecyCode
} from "@/data/mathematicsLibrary";

interface MathematicsLibraryProps {
  onClose?: () => void;
}

export function MathematicsLibrary({ onClose }: MathematicsLibraryProps) {
  const [selectedProphecy, setSelectedProphecy] = useState<ProphecyCode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "grid" | "principles">("overview");
  const [activeGenre, setActiveGenre] = useState<ScriptureGenre>("torah");

  const totalProphecies = getTotalPropheciesCount();

  const filteredProphecies = searchQuery.length >= 2
    ? timeProphecies.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : timeProphecies;

  const selectedGrid = selectedProphecy
    ? scriptureConnectionGrid.find(g => g.code === selectedProphecy)
    : null;

  const selectedTimeProphecy = selectedProphecy
    ? getProphecyByCode(selectedProphecy)
    : null;

  const handleSelectProphecy = (code: ProphecyCode) => {
    setSelectedProphecy(code);
    setSearchQuery("");
    setActiveTab("grid");
  };

  const handleBack = () => {
    setSelectedProphecy(null);
    setActiveTab("overview");
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      probation: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
      affliction: "bg-red-500/20 text-red-700 dark:text-red-300",
      captivity: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
      messianic: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
      persecution: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
      judgment: "bg-indigo-500/20 text-indigo-700 dark:text-indigo-300"
    };
    return colors[type] || "bg-muted";
  };

  const getCodeIcon = (code: ProphecyCode) => {
    const icons: Record<ProphecyCode, string> = {
      "@120": "⏳",
      "@400": "⛓️",
      "@70y": "🔄",
      "@490": "✝️",
      "@1260": "⚔️",
      "@2300": "⚖️"
    };
    return icons[code] || "📊";
  };

  // Detail View for Selected Prophecy
  if (selectedProphecy && selectedGrid) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to All Prophecies
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-xl border">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{getCodeIcon(selectedProphecy)}</span>
                  <div>
                    <Badge className="text-lg font-mono">{selectedProphecy}</Badge>
                    <h2 className="text-2xl font-bold mt-1">{selectedGrid.name}</h2>
                  </div>
                </div>
                <p className="text-muted-foreground italic mt-2">{selectedGrid.function}</p>
              </div>
            </div>
          </div>

          {/* Key Insight */}
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300">Key Insight</p>
                  <p className="text-lg">{selectedGrid.keyInsight}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scripture Corridors - 6x6 Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5" />
                6×6 Scripture Connection Grid
              </CardTitle>
              <CardDescription>
                One pattern across many genres — see how {selectedProphecy} functions throughout Scripture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeGenre} onValueChange={(v) => setActiveGenre(v as ScriptureGenre)}>
                <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-1 h-auto">
                  {(Object.keys(genreLabels) as ScriptureGenre[]).map(genre => (
                    <TabsTrigger
                      key={genre}
                      value={genre}
                      className="flex flex-col gap-1 py-2 text-xs"
                    >
                      <span className="text-lg">{genreLabels[genre].icon}</span>
                      <span>{genreLabels[genre].name.split(" ")[0]}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {(Object.keys(genreLabels) as ScriptureGenre[]).map(genre => (
                  <TabsContent key={genre} value={genre} className="mt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <span>{genreLabels[genre].icon}</span>
                        {genreLabels[genre].name}
                      </h4>
                      {selectedGrid.corridors[genre].map((connection, idx) => (
                        <Card key={idx} className="bg-muted/30">
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Badge variant="outline" className="font-mono flex-shrink-0">
                                {connection.reference}
                              </Badge>
                              <p className="text-sm text-muted-foreground">
                                {connection.description}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Why It Fits / Doesn't Fit */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Why This Fits {selectedProphecy}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedGrid.whyItFits}</p>
              </CardContent>
            </Card>

            <Card className="border-red-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  Why Others Don't Fit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedGrid.whyOthersDontFit}</p>
              </CardContent>
            </Card>
          </div>

          {/* Full Prophecy Details from TimeProphecy if available */}
          {selectedTimeProphecy && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Historical Fulfillment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Starting Point</p>
                    <p className="font-medium">{selectedTimeProphecy.startingPoint.event}</p>
                    <p className="text-sm text-muted-foreground">{selectedTimeProphecy.startingPoint.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Ending Point</p>
                    <p className="font-medium">{selectedTimeProphecy.endingPoint.event}</p>
                    <p className="text-sm text-muted-foreground">{selectedTimeProphecy.endingPoint.date}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Christ Connection</p>
                  <p className="text-sm">{selectedTimeProphecy.christConnection}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Main Library View
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            🔢 Mathematics Room Library
          </h3>
          <p className="text-muted-foreground">
            {totalProphecies} time prophecies with Scripture connections across all genres
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          6×6 Grid
        </Badge>
      </div>

      {/* Core Principle Banner */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-primary">Core Principle</p>
              <p className="text-sm">
                Time prophecies belong to <strong>FUNCTIONS</strong>, not books. Instead of asking 
                "Where is this prophecy mentioned?" ask "Where is this <em>time-function</em> operating?"
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prophecies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">📊 Overview</TabsTrigger>
          <TabsTrigger value="grid">📚 Browse</TabsTrigger>
          <TabsTrigger value="principles">❓ Questions</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Timeline */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prophecy Timeline</CardTitle>
              <CardDescription>The 6 fixed time prophecies in historical order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
                
                <div className="space-y-6">
                  {prophecyTimeline.map((item, idx) => {
                    const prophecy = timeProphecies.find(p => p.code === item.code);
                    return (
                      <div
                        key={idx}
                        className="relative pl-14 cursor-pointer group"
                        onClick={() => handleSelectProphecy(item.code as ProphecyCode)}
                      >
                        {/* Timeline dot */}
                        <div className="absolute left-4 top-1 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                          <span className="text-xs">{getCodeIcon(item.code as ProphecyCode)}</span>
                        </div>
                        
                        <Card className="group-hover:border-primary/50 transition-colors">
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className="font-mono">{item.code}</Badge>
                                  {prophecy && (
                                    <Badge variant="secondary" className={getTypeColor(prophecy.type)}>
                                      {prophecy.type}
                                    </Badge>
                                  )}
                                </div>
                                <p className="font-medium">{item.event}</p>
                                <p className="text-sm text-muted-foreground">{item.date}</p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Browse Tab - All Prophecies Grid */}
        <TabsContent value="grid" className="mt-4">
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-4">
              {filteredProphecies.map(prophecy => {
                const grid = scriptureConnectionGrid.find(g => g.code === prophecy.code);
                return (
                  <Card
                    key={prophecy.id}
                    className="cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleSelectProphecy(prophecy.code)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <span className="text-3xl">{getCodeIcon(prophecy.code)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge className="font-mono text-base">{prophecy.code}</Badge>
                            <Badge variant="secondary" className={getTypeColor(prophecy.type)}>
                              {prophecy.type}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{prophecy.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{prophecy.duration}</p>
                          {grid && (
                            <p className="text-xs text-primary mt-2 italic">
                              🔑 {grid.keyInsight}
                            </p>
                          )}
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

        {/* Principles Tab - Function Questions */}
        <TabsContent value="principles" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                The Function Questions
              </CardTitle>
              <CardDescription>
                When entering a passage anywhere in Scripture, ask these questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {functionQuestions.map((q, idx) => (
                <Card key={idx} className="bg-muted/30">
                  <CardContent className="pt-4">
                    <p className="font-semibold text-lg mb-2">{idx + 1}. {q.question}</p>
                    <p className="text-sm text-muted-foreground">{q.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="border-primary/30">
            <CardContent className="pt-4 text-center">
              <p className="text-lg font-medium">
                That's not just math.
              </p>
              <p className="text-xl font-bold text-primary">
                That's <em>biblical literacy at a prophetic level</em>.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}