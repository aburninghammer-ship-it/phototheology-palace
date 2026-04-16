import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, ChevronRight, Library, Sparkles, Cross, Crown, Clock, CheckCircle, CircleDashed, Calendar, Eye, History } from "lucide-react";
import { prophecyLibrary, getPropheciesByCategory, searchProphecies, getMessianicProphecies, getTimeProphecies, type Prophecy } from "@/data/prophecyLibrary";

interface ProphecyLibraryProps { onClose?: () => void; }

const categoryConfig: Record<Prophecy["category"], { icon: string; label: string; gradient: string }> = {
  messianic: { icon: "👑", label: "Messianic", gradient: "from-amber-500 to-yellow-600" },
  national: { icon: "🏛️", label: "National", gradient: "from-blue-500 to-indigo-600" },
  "end-times": { icon: "🌅", label: "End Times", gradient: "from-purple-500 to-violet-600" },
  "near-term": { icon: "📍", label: "Near Term", gradient: "from-green-500 to-emerald-600" },
  dual: { icon: "🔀", label: "Dual Fulfillment", gradient: "from-teal-500 to-cyan-600" },
  "time-prophecy": { icon: "⏰", label: "Time Prophecy", gradient: "from-orange-500 to-red-600" }
};

const timeframeConfig: Record<Prophecy["timeframe"], { icon: React.ReactNode; label: string; color: string }> = {
  fulfilled: { icon: <CheckCircle className="h-3 w-3" />, label: "Fulfilled", color: "text-green-600 bg-green-500/10 border-green-500/30" },
  "being-fulfilled": { icon: <Clock className="h-3 w-3" />, label: "Being Fulfilled", color: "text-amber-600 bg-amber-500/10 border-amber-500/30" },
  future: { icon: <CircleDashed className="h-3 w-3" />, label: "Future", color: "text-blue-600 bg-blue-500/10 border-blue-500/30" }
};

type LibraryTab = "all" | "messianic" | "time" | "endtimes";

export function ProphecyLibrary({ onClose }: ProphecyLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("all");
  const [selectedProphecy, setSelectedProphecy] = useState<Prophecy | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Prophecy[]>([]);

  const handleSearch = (query: string) => { setSearchQuery(query); if (query.length >= 2) { setSearchResults(searchProphecies(query)); setSelectedProphecy(null); } else { setSearchResults([]); } };
  const clearSelection = () => { setSelectedProphecy(null); setSearchQuery(""); setSearchResults([]); };

  if (selectedProphecy) {
    const config = categoryConfig[selectedProphecy.category];
    const tfConfig = timeframeConfig[selectedProphecy.timeframe];
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedProphecy(null)} className="w-fit mb-2"><ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back</Button>
          <div className="flex items-center gap-3"><span className="text-3xl">{config.icon}</span><div><CardTitle className="text-xl">{selectedProphecy.title}</CardTitle><p className="text-sm text-muted-foreground">{selectedProphecy.source.book} {selectedProphecy.source.chapter}:{selectedProphecy.source.verses}</p></div></div>
          <div className="flex flex-wrap gap-2 mt-2"><Badge className={`bg-gradient-to-r ${config.gradient} text-white`}>{config.label}</Badge><Badge variant="outline" className={tfConfig.color}>{tfConfig.icon}<span className="ml-1">{tfConfig.label}</span></Badge></div>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-5">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />The Prophecy</h4><p className="text-sm italic text-muted-foreground">"{selectedProphecy.prophecy}"</p><Badge variant="secondary" className="mt-2">{selectedProphecy.source.book} {selectedProphecy.source.chapter}:{selectedProphecy.source.verses}</Badge></div>
            {selectedProphecy.fulfillment && (<div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" />Fulfillment</h4><p className="text-sm text-muted-foreground mb-2">{selectedProphecy.fulfillment.description}</p><Badge variant="secondary">{selectedProphecy.fulfillment.book} {selectedProphecy.fulfillment.chapter}:{selectedProphecy.fulfillment.verses}</Badge></div>)}
            <div><h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Explanation</h4><p className="text-sm text-muted-foreground">{selectedProphecy.explanation}</p></div>
            {selectedProphecy.historicistView && (<div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><History className="h-4 w-4 text-purple-600" />Historicist Interpretation</h4><p className="text-sm text-muted-foreground">{selectedProphecy.historicistView}</p></div>)}
            {(selectedProphecy.dateGiven || selectedProphecy.dateFulfilled) && (<div className="grid grid-cols-2 gap-4">{selectedProphecy.dateGiven && (<div><h5 className="font-semibold text-sm flex items-center gap-1"><Calendar className="h-3 w-3" />Date Given</h5><p className="text-xs text-muted-foreground">{selectedProphecy.dateGiven}</p></div>)}{selectedProphecy.dateFulfilled && (<div><h5 className="font-semibold text-sm flex items-center gap-1"><CheckCircle className="h-3 w-3" />Date Fulfilled</h5><p className="text-xs text-muted-foreground">{selectedProphecy.dateFulfilled}</p></div>)}</div>)}
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Crown className="h-4 w-4 text-amber-500" />Significance</h4><p className="text-sm text-muted-foreground">{selectedProphecy.significance}</p></div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  if (searchResults.length > 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4"><Button variant="ghost" size="sm" onClick={clearSelection} className="w-fit mb-2"><ChevronRight className="h-4 w-4 rotate-180 mr-1" />Clear Search</Button><CardTitle>Search Results</CardTitle><CardDescription>Found {searchResults.length} prophecies for "{searchQuery}"</CardDescription></CardHeader>
        <ScrollArea className="h-[500px]"><CardContent className="space-y-2 pr-4">{searchResults.map((p) => { const config = categoryConfig[p.category]; return (<Card key={p.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedProphecy(p)}><CardContent className="p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-xl">{config.icon}</span><div><h4 className="font-medium">{p.title}</h4><p className="text-xs text-muted-foreground">{p.source.book} {p.source.chapter}:{p.source.verses}</p></div></div><Badge className={`bg-gradient-to-r ${config.gradient} text-white text-xs`}>{config.label}</Badge></div></CardContent></Card>); })}</CardContent></ScrollArea>
      </Card>
    );
  }

  const ProphecyList = ({ prophecies }: { prophecies: Prophecy[] }) => (<div className="space-y-3">{prophecies.map((p) => { const config = categoryConfig[p.category]; const tfConfig = timeframeConfig[p.timeframe]; return (<Card key={p.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedProphecy(p)}><CardContent className="p-4"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2"><span className="text-xl">{config.icon}</span><h4 className="font-semibold">{p.title}</h4></div><Badge variant="outline" className={`text-xs ${tfConfig.color}`}>{tfConfig.icon}<span className="ml-1">{tfConfig.label}</span></Badge></div><p className="text-sm text-muted-foreground italic line-clamp-2">"{p.prophecy}"</p><div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground"><BookOpen className="h-3 w-3" />{p.source.book} {p.source.chapter}:{p.source.verses}</div></CardContent></Card>); })}</div>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4"><div className="flex items-center justify-between"><div><CardTitle className="flex items-center gap-2"><Library className="h-5 w-5 text-purple-600" />Prophecy Library</CardTitle><CardDescription>{prophecyLibrary.length} prophecies with fulfillments and interpretations</CardDescription></div>{onClose && (<Button variant="ghost" size="sm" onClick={onClose}>Close</Button>)}</div></CardHeader>
      <CardContent className="space-y-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search prophecies, fulfillments..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" /></div>
        {searchQuery.length >= 2 && searchResults.length === 0 && (<div className="text-center py-8 text-muted-foreground"><Search className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No prophecies found for "{searchQuery}"</p></div>)}
        {searchQuery.length < 2 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)}>
            <TabsList className="grid grid-cols-4 w-full"><TabsTrigger value="all" className="text-xs"><span className="hidden sm:inline">All</span><span className="sm:hidden">📚</span></TabsTrigger><TabsTrigger value="messianic" className="text-xs"><span className="hidden sm:inline">Messianic</span><span className="sm:hidden">👑</span></TabsTrigger><TabsTrigger value="time" className="text-xs"><span className="hidden sm:inline">Time</span><span className="sm:hidden">⏰</span></TabsTrigger><TabsTrigger value="endtimes" className="text-xs"><span className="hidden sm:inline">End Times</span><span className="sm:hidden">🌅</span></TabsTrigger></TabsList>
            <TabsContent value="all"><ScrollArea className="h-[400px]"><div className="pr-4"><div className="grid grid-cols-2 gap-3 mb-4">{Object.entries(categoryConfig).slice(0, 4).map(([key, config]) => { const count = getPropheciesByCategory(key as Prophecy["category"]).length; return (<Card key={key} className="bg-gradient-to-br from-background to-accent/5"><CardContent className="p-3 text-center"><span className="text-2xl">{config.icon}</span><div className="text-lg font-bold mt-1">{count}</div><div className="text-xs text-muted-foreground">{config.label}</div></CardContent></Card>); })}</div><ProphecyList prophecies={prophecyLibrary} /></div></ScrollArea></TabsContent>
            <TabsContent value="messianic"><ScrollArea className="h-[400px]"><div className="pr-4"><div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-4"><h4 className="font-semibold text-amber-700 flex items-center gap-2"><Crown className="h-4 w-4" />Prophecies About Christ</h4><p className="text-xs text-muted-foreground mt-1">Predictions about the Messiah—His birth, life, death, and resurrection—all fulfilled in Jesus.</p></div><ProphecyList prophecies={getMessianicProphecies()} /></div></ScrollArea></TabsContent>
            <TabsContent value="time"><ScrollArea className="h-[400px]"><div className="pr-4"><div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4"><h4 className="font-semibold text-orange-700 flex items-center gap-2"><Clock className="h-4 w-4" />Prophetic Timelines</h4><p className="text-xs text-muted-foreground mt-1">Prophecies with specific time periods—days, weeks, years—that can be calculated and verified historically.</p></div><ProphecyList prophecies={getTimeProphecies()} /></div></ScrollArea></TabsContent>
            <TabsContent value="endtimes"><ScrollArea className="h-[400px]"><div className="pr-4"><div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 mb-4"><h4 className="font-semibold text-purple-700 flex items-center gap-2"><Eye className="h-4 w-4" />End-Time Events</h4><p className="text-xs text-muted-foreground mt-1">Prophecies about the final events of earth's history—signs, judgments, Christ's return, and eternity.</p></div><ProphecyList prophecies={getPropheciesByCategory("end-times")} /></div></ScrollArea></TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
