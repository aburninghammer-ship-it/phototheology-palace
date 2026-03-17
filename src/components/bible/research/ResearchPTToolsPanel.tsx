import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Building2, RotateCcw, Layers, Landmark, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResearchPTToolsPanelProps {
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string;
  activeTab: string;
}

// Palace Floors & Rooms data
const PALACE_FLOORS = [
  {
    floor: 1,
    name: "Furnishing Floor",
    expansion: "Width",
    rooms: [
      { code: "SR", name: "Story Room", desc: "Narrative memory" },
      { code: "IR", name: "Imagination Room", desc: "Immersive visualization" },
      { code: "24F", name: "24FPS Room", desc: "Chapter frames" },
      { code: "BR", name: "Bible Rendered", desc: "24-chapter blocks" },
      { code: "TR", name: "Translation Room", desc: "Word→image conversion" },
      { code: "GR", name: "Gems Room", desc: "Insights treasury" },
    ]
  },
  {
    floor: 2,
    name: "Investigation Floor",
    expansion: "Width",
    rooms: [
      { code: "OR", name: "Observation Room", desc: "Detail logging" },
      { code: "DC", name: "Def-Com Room", desc: "Definitions & commentary" },
      { code: "ST", name: "Symbols/Types", desc: "Typological patterns" },
      { code: "QR", name: "Questions Room", desc: "225 questions method" },
      { code: "QA", name: "Q&A Room", desc: "Scripture answers Scripture" },
    ]
  },
  {
    floor: 3,
    name: "Freestyle Floor",
    expansion: "Time",
    rooms: [
      { code: "NF", name: "Nature Freestyle", desc: "Creation connections" },
      { code: "PF", name: "Personal Freestyle", desc: "Life applications" },
      { code: "BF", name: "Bible Freestyle", desc: "Verse genetics" },
      { code: "HF", name: "History Freestyle", desc: "Historical parallels" },
      { code: "LR", name: "Listening Room", desc: "Active listening" },
    ]
  },
  {
    floor: 4,
    name: "Next Level Floor",
    expansion: "Depth",
    rooms: [
      { code: "CR", name: "Concentration Room", desc: "Christ-centered focus" },
      { code: "DR", name: "Dimensions Room", desc: "5D interpretation" },
      { code: "C6", name: "Connect 6 Room", desc: "Genre classification" },
      { code: "TRm", name: "Theme Room", desc: "Walls & ceilings" },
      { code: "TZ", name: "Time Zone Room", desc: "Past/present/future" },
      { code: "PRm", name: "Patterns Room", desc: "Recurring motifs" },
      { code: "P‖", name: "Parallels Room", desc: "Mirrored actions" },
      { code: "FRt", name: "Fruit Room", desc: "Character test" },
    ]
  },
  {
    floor: 5,
    name: "Vision Floor",
    expansion: "Depth",
    rooms: [
      { code: "BL", name: "Blue Room", desc: "Sanctuary blueprint" },
      { code: "PR", name: "Prophecy Room", desc: "Timeline telescope" },
      { code: "3A", name: "Three Angels", desc: "Final messages" },
      { code: "FR", name: "Feasts Room", desc: "Festival connections" },
    ]
  },
  {
    floor: 6,
    name: "Three Heavens Floor",
    expansion: "Depth",
    rooms: [
      { code: "JR", name: "Juice Room", desc: "Full extraction through all principles" },
    ]
  },
  {
    floor: 7,
    name: "Spiritual Floor",
    expansion: "Height",
    rooms: [
      { code: "FRm", name: "Fire Room", desc: "Emotional weight" },
      { code: "MR", name: "Meditation Room", desc: "Slow marination" },
      { code: "SRm", name: "Speed Room", desc: "Rapid application" },
    ]
  },
  {
    floor: 8,
    name: "Master Floor",
    expansion: "Height",
    rooms: [
      { code: "∞", name: "Reflexive Mastery", desc: "No rooms needed" },
    ]
  },
];

// 8 Cycles
const CYCLES = [
  { code: "@Ad", name: "Adamic", period: "Eden → Promise", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { code: "@No", name: "Noahic", period: "Flood → Covenant", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { code: "@Ab", name: "Abrahamic", period: "Call → Covenant People", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { code: "@Mo", name: "Mosaic", period: "Exodus → Sanctuary Nation", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { code: "@Cy", name: "Cyrusic", period: "Exile → Return & Rebuild", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { code: "@CyC", name: "Cyrus-Christ", period: "Type → Antitype", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { code: "@Sp", name: "Spirit", period: "Pentecost → Revivals", color: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" },
  { code: "@Re", name: "Remnant", period: "End-Time → Second Coming", color: "bg-red-500/20 text-red-400 border-red-500/30" },
];

// Three Heavens
const THREE_HEAVENS = [
  { 
    code: "1H", 
    name: "First Heaven", 
    dol: "DoL¹", 
    ne: "NE¹",
    desc: "Babylon destroys Jerusalem → Post-exilic restoration under Cyrus",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30"
  },
  { 
    code: "2H", 
    name: "Second Heaven", 
    dol: "DoL²", 
    ne: "NE²",
    desc: "70 AD destruction → New-Covenant/heavenly sanctuary order",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  { 
    code: "3H", 
    name: "Third Heaven", 
    dol: "DoL³", 
    ne: "NE³",
    desc: "Final cosmic judgment → Literal New Creation (Rev 21-22)",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
  },
];

// Sanctuary Items
const SANCTUARY_ITEMS = [
  { item: "Gate", meaning: "Entrance through Christ", position: "outer" },
  { item: "Altar of Burnt Offering", meaning: "The Cross - sacrifice", position: "outer" },
  { item: "Laver", meaning: "Baptism & cleansing", position: "outer" },
  { item: "Table of Showbread", meaning: "Word of God / Bread of Life", position: "holy" },
  { item: "Lampstand", meaning: "Light of the Spirit", position: "holy" },
  { item: "Altar of Incense", meaning: "Prayer & intercession", position: "holy" },
  { item: "Veil", meaning: "Christ's flesh (Heb 10:20)", position: "holy" },
  { item: "Ark of the Covenant", meaning: "God's throne & law", position: "most-holy" },
  { item: "Mercy Seat", meaning: "Atonement & grace", position: "most-holy" },
];

// Five Ascensions
const ASCENSIONS = [
  { level: 1, name: "Text", desc: "Word-level study: definitions, grammar, lexical nuance" },
  { level: 2, name: "Chapter", desc: "Place verse in chapter storyline context" },
  { level: 3, name: "Book", desc: "Fit chapter into book's overarching theme" },
  { level: 4, name: "Cycle", desc: "Place book within its covenant cycle (@Ad → @Re)" },
  { level: 5, name: "Heaven", desc: "Assign to correct Day-of-the-LORD horizon (1H/2H/3H)" },
];

export const ResearchPTToolsPanel = ({
  book,
  chapter,
  verse,
  verseText,
  activeTab
}: ResearchPTToolsPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
  const [selectedHeaven, setSelectedHeaven] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const toggleRoom = (code: string) => {
    setSelectedRooms(prev => 
      prev.includes(code) ? prev.filter(r => r !== code) : [...prev, code]
    );
  };

  const runPTAnalysis = async () => {
    if (!verse) {
      toast.error("Please select a verse first");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pt-verse-analysis", {
        body: {
          book,
          chapter,
          verse,
          verseText,
          rooms: selectedRooms,
          cycle: selectedCycle,
          heaven: selectedHeaven,
          analysisType: activeTab
        }
      });

      if (error) throw error;
      setAnalysisResult(data.analysis || "Analysis complete.");
    } catch (error) {
      console.error("PT Analysis failed:", error);
      toast.error("Analysis failed - using offline mode");
      setAnalysisResult(`PT Analysis for ${book} ${chapter}:${verse}\n\nRooms: ${selectedRooms.join(", ") || "None selected"}\nCycle: ${selectedCycle || "Not assigned"}\nHeaven: ${selectedHeaven || "Not assigned"}\n\nFull analysis requires connection.`);
    } finally {
      setLoading(false);
    }
  };

  if (!verse && activeTab !== "sanctuary" && activeTab !== "ascensions") {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Building2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a verse to use PT tools</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Verse Reference Header */}
      {verse && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="text-xs bg-primary/20 border-primary/30">
              {book} {chapter}:{verse}
            </Badge>
          </div>
          <p className="text-sm italic text-muted-foreground line-clamp-2">
            "{verseText}"
          </p>
        </div>
      )}

      {/* Palace Floors & Rooms */}
      {activeTab === "palace" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Select rooms to apply to this verse study:
          </p>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-2">
              {PALACE_FLOORS.map((floor) => (
                <div key={floor.floor} className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs bg-primary/10">
                      F{floor.floor}
                    </Badge>
                    <span className="text-xs font-medium">{floor.name}</span>
                    <Badge variant="outline" className="text-[10px] ml-auto">
                      {floor.expansion}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {floor.rooms.map((room) => (
                      <Button
                        key={room.code}
                        size="sm"
                        variant={selectedRooms.includes(room.code) ? "default" : "outline"}
                        className={cn(
                          "h-6 text-[10px] px-2",
                          selectedRooms.includes(room.code) && "bg-primary/80"
                        )}
                        onClick={() => toggleRoom(room.code)}
                        title={room.desc}
                      >
                        {room.code}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {selectedRooms.length > 0 && (
            <Button onClick={runPTAnalysis} disabled={loading} className="w-full" size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Building2 className="h-4 w-4 mr-2" />}
              Analyze with {selectedRooms.length} Room{selectedRooms.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>
      )}

      {/* 8 Cycles */}
      {activeTab === "cycles" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Place this passage in its covenant cycle:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {CYCLES.map((cycle) => (
              <Button
                key={cycle.code}
                size="sm"
                variant="outline"
                className={cn(
                  "h-auto py-2 flex-col items-start text-left",
                  selectedCycle === cycle.code && cycle.color
                )}
                onClick={() => setSelectedCycle(selectedCycle === cycle.code ? null : cycle.code)}
              >
                <div className="flex items-center gap-1 w-full">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {cycle.code}
                  </Badge>
                  <span className="text-xs font-medium">{cycle.name}</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  {cycle.period}
                </span>
              </Button>
            ))}
          </div>
          
          {selectedCycle && (
            <Button onClick={runPTAnalysis} disabled={loading} className="w-full" size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RotateCcw className="h-4 w-4 mr-2" />}
              Analyze in {selectedCycle} Cycle
            </Button>
          )}
        </div>
      )}

      {/* Three Heavens */}
      {activeTab === "heavens" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Identify the Day-of-the-LORD horizon:
          </p>
          <div className="space-y-2">
            {THREE_HEAVENS.map((heaven) => (
              <Button
                key={heaven.code}
                size="sm"
                variant="outline"
                className={cn(
                  "h-auto py-3 w-full flex-col items-start text-left",
                  selectedHeaven === heaven.code && heaven.color
                )}
                onClick={() => setSelectedHeaven(selectedHeaven === heaven.code ? null : heaven.code)}
              >
                <div className="flex items-center gap-2 w-full">
                  <Badge variant="outline" className="text-xs font-mono">
                    {heaven.code}
                  </Badge>
                  <span className="text-sm font-medium">{heaven.name}</span>
                  <div className="ml-auto flex gap-1">
                    <Badge variant="secondary" className="text-[10px]">{heaven.dol}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{heaven.ne}</Badge>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground mt-2">
                  {heaven.desc}
                </span>
              </Button>
            ))}
          </div>
          
          {selectedHeaven && (
            <Button onClick={runPTAnalysis} disabled={loading} className="w-full" size="sm">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Layers className="h-4 w-4 mr-2" />}
              Analyze in {selectedHeaven}
            </Button>
          )}
        </div>
      )}

      {/* Sanctuary Blueprint */}
      {activeTab === "sanctuary" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Map to sanctuary furniture & services:
          </p>
          
          {/* Sanctuary Diagram */}
          <div className="bg-white/5 rounded-lg p-3 border border-white/10 space-y-2">
            <div className="text-center text-xs text-muted-foreground mb-2">Most Holy Place</div>
            <div className="flex justify-center gap-2">
              {SANCTUARY_ITEMS.filter(i => i.position === "most-holy").map((item) => (
                <Badge key={item.item} variant="outline" className="text-[10px] bg-purple-500/10 border-purple-500/30">
                  {item.item}
                </Badge>
              ))}
            </div>
            
            <div className="border-t border-white/10 my-2" />
            <div className="text-center text-xs text-muted-foreground">Holy Place</div>
            <div className="flex flex-wrap justify-center gap-2">
              {SANCTUARY_ITEMS.filter(i => i.position === "holy").map((item) => (
                <Badge key={item.item} variant="outline" className="text-[10px] bg-blue-500/10 border-blue-500/30">
                  {item.item}
                </Badge>
              ))}
            </div>
            
            <div className="border-t border-white/10 my-2" />
            <div className="text-center text-xs text-muted-foreground">Outer Court</div>
            <div className="flex flex-wrap justify-center gap-2">
              {SANCTUARY_ITEMS.filter(i => i.position === "outer").map((item) => (
                <Badge key={item.item} variant="outline" className="text-[10px] bg-amber-500/10 border-amber-500/30">
                  {item.item}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={runPTAnalysis} disabled={loading || !verse} className="w-full" size="sm">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Landmark className="h-4 w-4 mr-2" />}
            Map to Sanctuary
          </Button>
        </div>
      )}

      {/* Five Ascensions */}
      {activeTab === "ascensions" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Navigate through levels of interpretation:
          </p>
          <div className="space-y-2">
            {ASCENSIONS.map((asc, idx) => (
              <div 
                key={asc.level}
                className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-start gap-3"
              >
                <div className="flex flex-col items-center">
                  <Badge variant="outline" className="text-xs bg-primary/20 border-primary/30 mb-1">
                    Asc-{asc.level}
                  </Badge>
                  {idx < ASCENSIONS.length - 1 && (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{asc.name}</p>
                  <p className="text-xs text-muted-foreground">{asc.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={runPTAnalysis} disabled={loading || !verse} className="w-full" size="sm">
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowUpRight className="h-4 w-4 mr-2" />}
            Run 5 Ascensions Analysis
          </Button>
        </div>
      )}

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-xs font-medium mb-2">Analysis Result:</p>
          <p className="text-sm whitespace-pre-wrap">{analysisResult}</p>
        </div>
      )}
    </div>
  );
};
