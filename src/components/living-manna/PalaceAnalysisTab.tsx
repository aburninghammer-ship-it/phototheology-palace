import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Loader2, Castle, Layers, Search, Globe, ChevronDown,
  BookOpen, Telescope, Flame, Heart, Sparkles, CheckCircle2,
  Zap, Target
} from "lucide-react";

interface PalaceAnalysisTabProps {
  packetId: string;
  sermonText: string;
  sermonTitle: string;
}

interface AnalysisRecord {
  id: string;
  analysis_mode: string;
  selected_rooms: string[];
  selected_floor: number | null;
  status: string;
  analysis_result: any;
  created_at: string;
}

const MODE_INFO = {
  full_sweep: {
    icon: Castle,
    label: "Full Palace Sweep",
    description: "Analyze through ALL 8 Floors and every room — comprehensive Phototheological breakdown",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  room_specific: {
    icon: Search,
    label: "Room-Specific Analysis",
    description: "Pick specific rooms and get deep, targeted analysis",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  floor_drill: {
    icon: Layers,
    label: "Floor-by-Floor Drill",
    description: "Analyze one floor at a time — go deep on each level",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  cycle_heaven: {
    icon: Globe,
    label: "Cycle & Heaven Placement",
    description: "Map into the 8 Cycles (@Ad→@Re) and Three Heavens (1H/2H/3H)",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
};

const ALL_ROOMS = [
  { code: "SR", name: "Story Room", floor: 1 },
  { code: "IR", name: "Imagination Room", floor: 1 },
  { code: "24F", name: "24FPS Room", floor: 1 },
  { code: "BR", name: "Bible Rendered", floor: 1 },
  { code: "TR", name: "Translation Room", floor: 1 },
  { code: "GR", name: "Gems Room", floor: 1 },
  { code: "OR", name: "Observation Room", floor: 2 },
  { code: "DC", name: "Def-Com Room", floor: 2 },
  { code: "ST", name: "Symbols/Types", floor: 2 },
  { code: "QR", name: "Questions Room", floor: 2 },
  { code: "QA", name: "Q&A Room", floor: 2 },
  { code: "NF", name: "Nature Freestyle", floor: 3 },
  { code: "PF", name: "Personal Freestyle", floor: 3 },
  { code: "BF", name: "Bible Freestyle", floor: 3 },
  { code: "HF", name: "History Freestyle", floor: 3 },
  { code: "CR", name: "Concentration Room", floor: 4 },
  { code: "DR", name: "Dimensions Room", floor: 4 },
  { code: "TRm", name: "Theme Room", floor: 4 },
  { code: "TZ", name: "Time Zone Room", floor: 4 },
  { code: "PRm", name: "Patterns Room", floor: 4 },
  { code: "P‖", name: "Parallels Room", floor: 4 },
  { code: "FRt", name: "Fruit Room", floor: 4 },
  { code: "CEC", name: "Christ Every Chapter", floor: 4 },
  { code: "BL", name: "Blue Room (Sanctuary)", floor: 5 },
  { code: "PR", name: "Prophecy Room", floor: 5 },
  { code: "3A", name: "Three Angels' Room", floor: 5 },
  { code: "Feasts", name: "Feasts Room", floor: 5 },
  { code: "@Ad", name: "Adamic Cycle", floor: 6 },
  { code: "@Mo", name: "Mosaic Cycle", floor: 6 },
  { code: "@CyC", name: "Cyrus-Christ Cycle", floor: 6 },
  { code: "@Sp", name: "Spirit Cycle", floor: 6 },
  { code: "@Re", name: "Remnant Cycle", floor: 6 },
  { code: "FRm", name: "Fire Room", floor: 7 },
  { code: "MR", name: "Meditation Room", floor: 7 },
];

const FLOOR_NAMES: Record<number, string> = {
  1: "Furnishing Floor",
  2: "Investigation Floor",
  3: "Freestyle Floor",
  4: "Next Level Floor",
  5: "Vision Floor",
  6: "Three Heavens Floor",
  7: "Spiritual Floor",
  8: "Master Floor",
};

export function PalaceAnalysisTab({ packetId, sermonText, sermonTitle }: PalaceAnalysisTabProps) {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Mode selection state
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<number>(1);

  useEffect(() => {
    loadAnalyses();
  }, [packetId, user]);

  // Poll generating analyses
  useEffect(() => {
    const generatingAnalyses = analyses.filter(a => a.status === "generating");
    if (generatingAnalyses.length > 0) {
      const interval = setInterval(loadAnalyses, 3000);
      return () => clearInterval(interval);
    }
  }, [analyses]);

  const loadAnalyses = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("sermon_palace_analyses")
      .select("*")
      .eq("packet_id", packetId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setAnalyses(data);
    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!user || !selectedMode) return;
    if (selectedMode === "room_specific" && selectedRooms.length === 0) {
      toast.error("Select at least one room");
      return;
    }

    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-sermon-palace", {
        body: {
          packetId,
          userId: user.id,
          analysisMode: selectedMode,
          selectedRooms: selectedMode === "room_specific" ? selectedRooms : [],
          selectedFloor: selectedMode === "floor_drill" ? selectedFloor : null,
          sermonText,
          sermonTitle,
        },
      });

      if (error) throw error;
      if (data?.analysisId) {
        toast.success("🏰 Palace analysis started! Results coming shortly...");
        setSelectedMode(null);
        setSelectedRooms([]);
        loadAnalyses();
      }
    } catch (err: any) {
      console.error("Analysis error:", err);
      toast.error("Failed to start analysis");
    } finally {
      setGenerating(false);
    }
  };

  const toggleRoom = (code: string) => {
    setSelectedRooms(prev =>
      prev.includes(code) ? prev.filter(r => r !== code) : [...prev, code]
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Castle className="h-4 w-4 text-primary" />
            Run Palace Analysis
          </CardTitle>
          <CardDescription className="text-xs">
            Analyze this sermon through the Phototheology Palace framework
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mode Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MODE_INFO).map(([mode, info]) => {
              const Icon = info.icon;
              const isSelected = selectedMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(isSelected ? null : mode)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? `${info.bg} border-current ${info.color} ring-1 ring-current`
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-4 w-4 ${isSelected ? info.color : "text-muted-foreground"}`} />
                    <span className="text-xs font-medium">{info.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">{info.description}</p>
                </button>
              );
            })}
          </div>

          {/* Room Picker (for room_specific mode) */}
          {selectedMode === "room_specific" && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium">Select Rooms to Analyze:</p>
              <div className="flex flex-wrap gap-1.5">
                {ALL_ROOMS.map(room => (
                  <button
                    key={room.code}
                    onClick={() => toggleRoom(room.code)}
                    className={`px-2 py-1 rounded text-[10px] border transition-all ${
                      selectedRooms.includes(room.code)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/30 border-border hover:bg-muted"
                    }`}
                  >
                    {room.code} — {room.name}
                  </button>
                ))}
              </div>
              {selectedRooms.length > 0 && (
                <p className="text-[10px] text-muted-foreground">{selectedRooms.length} rooms selected</p>
              )}
            </div>
          )}

          {/* Floor Picker (for floor_drill mode) */}
          {selectedMode === "floor_drill" && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-xs font-medium">Select Floor:</p>
              <Select value={String(selectedFloor)} onValueChange={v => setSelectedFloor(Number(v))}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(FLOOR_NAMES).map(([num, name]) => (
                    <SelectItem key={num} value={num} className="text-xs">
                      Floor {num}: {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Generate Button */}
          {selectedMode && (
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full"
              size="sm"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              Run {MODE_INFO[selectedMode as keyof typeof MODE_INFO]?.label}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Previous Analyses */}
      {analyses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Your Palace Analyses ({analyses.length})
          </h3>

          {analyses.map(analysis => (
            <PalaceAnalysisResult key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}

      {analyses.length === 0 && !selectedMode && (
        <Card>
          <CardContent className="p-8 text-center">
            <Castle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Select a mode above to run your first Palace analysis on this sermon
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Analysis Result Renderer ───────────────────────────────────
function PalaceAnalysisResult({ analysis }: { analysis: AnalysisRecord }) {
  const [open, setOpen] = useState(analysis.status === "generating");
  const modeInfo = MODE_INFO[analysis.analysis_mode as keyof typeof MODE_INFO];
  const Icon = modeInfo?.icon || Castle;
  const result = analysis.analysis_result;

  if (analysis.status === "generating") {
    return (
      <Card className="border-primary/20">
        <CardContent className="p-6 flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm font-medium">Running {modeInfo?.label}...</p>
          <Progress value={40} className="w-48" />
          <p className="text-[10px] text-muted-foreground">
            {analysis.analysis_mode === "full_sweep" ? "This may take 60-90 seconds" : "Usually 30-60 seconds"}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (analysis.status === "error") {
    return (
      <Card className="border-destructive/30">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-destructive">Analysis failed. Try again.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${modeInfo?.color || "text-primary"}`} />
                <CardTitle className="text-sm">{modeInfo?.label}</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </Badge>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <ScrollArea className="max-h-[600px]">
              {analysis.analysis_mode === "full_sweep" && <FullSweepView result={result} />}
              {analysis.analysis_mode === "room_specific" && <RoomSpecificView result={result} />}
              {analysis.analysis_mode === "floor_drill" && <FloorDrillView result={result} />}
              {analysis.analysis_mode === "cycle_heaven" && <CycleHeavenView result={result} />}
            </ScrollArea>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// ─── Mode-Specific Views ────────────────────────────────────────

function FullSweepView({ result }: { result: any }) {
  if (!result?.floors) return <p className="text-xs text-muted-foreground">No data</p>;
  return (
    <div className="space-y-4">
      {result.christ_thread && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
          <p className="text-xs font-medium text-primary mb-1">✝️ Christ Thread</p>
          <p className="text-sm">{result.christ_thread}</p>
        </div>
      )}
      {result.floors?.map((floor: any, i: number) => (
        <Collapsible key={i}>
          <CollapsibleTrigger className="w-full">
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <span className="text-xs font-medium">Floor {floor.floor_number}: {floor.floor_name}</span>
              <Badge variant="outline" className="text-[10px]">{floor.rooms?.length || 0} rooms</Badge>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2 space-y-2">
            {floor.rooms?.map((room: any, j: number) => (
              <RoomCard key={j} room={room} />
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
      {result.palace_summary && (
        <div className="bg-muted/30 rounded-lg p-3 mt-3">
          <p className="text-xs font-medium mb-1">Palace Summary</p>
          <p className="text-sm">{result.palace_summary}</p>
        </div>
      )}
    </div>
  );
}

function RoomSpecificView({ result }: { result: any }) {
  if (!result?.rooms) return <p className="text-xs text-muted-foreground">No data</p>;
  return (
    <div className="space-y-3">
      {result.rooms?.map((room: any, i: number) => (
        <div key={i} className="border rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="text-[10px]">{room.code}</Badge>
            <span className="text-sm font-medium">{room.name}</span>
          </div>
          <p className="text-sm leading-relaxed whitespace-pre-line">{room.deep_analysis}</p>
          {room.key_scriptures?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {room.key_scriptures.map((s: string, j: number) => (
                <Badge key={j} variant="outline" className="text-[10px]">{s}</Badge>
              ))}
            </div>
          )}
          {room.actionable_application && (
            <div className="bg-green-500/5 border border-green-500/10 rounded p-2 mt-1">
              <p className="text-[10px] font-medium text-green-600">🎯 Action Step</p>
              <p className="text-xs">{room.actionable_application}</p>
            </div>
          )}
          {room.teaching_angle && (
            <div className="bg-blue-500/5 border border-blue-500/10 rounded p-2">
              <p className="text-[10px] font-medium text-blue-600">🎓 Teaching Angle</p>
              <p className="text-xs">{room.teaching_angle}</p>
            </div>
          )}
        </div>
      ))}
      {result.synthesis && (
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs font-medium mb-1">Synthesis</p>
          <p className="text-sm">{result.synthesis}</p>
        </div>
      )}
    </div>
  );
}

function FloorDrillView({ result }: { result: any }) {
  if (!result?.rooms) return <p className="text-xs text-muted-foreground">No data</p>;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Layers className="h-4 w-4 text-amber-500" />
        <span className="text-sm font-medium">Floor {result.floor_number}: {result.floor_name}</span>
      </div>
      {result.rooms?.map((room: any, i: number) => (
        <RoomCard key={i} room={room} expanded />
      ))}
      {result.floor_summary && (
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-lg p-3">
          <p className="text-xs font-medium text-amber-600 mb-1">Floor Summary</p>
          <p className="text-sm">{result.floor_summary}</p>
        </div>
      )}
      {result.next_floor_preview && (
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs font-medium mb-1">🔮 Next Floor Preview</p>
          <p className="text-xs text-muted-foreground">{result.next_floor_preview}</p>
        </div>
      )}
    </div>
  );
}

function CycleHeavenView({ result }: { result: any }) {
  if (!result) return <p className="text-xs text-muted-foreground">No data</p>;
  return (
    <div className="space-y-4">
      {/* Primary Cycle */}
      {result.primary_cycle && (
        <Card className="border-green-500/20">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">
                {result.primary_cycle.code}
              </Badge>
              <span className="text-sm font-medium">{result.primary_cycle.name} Cycle</span>
            </div>
            <p className="text-sm">{result.primary_cycle.rationale}</p>
            {result.primary_cycle.sermon_elements?.map((el: string, i: number) => (
              <Badge key={i} variant="outline" className="text-[10px] mr-1">{el}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Secondary Cycles */}
      {result.secondary_cycles?.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2">Secondary Cycles</p>
          <div className="space-y-2">
            {result.secondary_cycles.map((c: any, i: number) => (
              <div key={i} className="flex gap-2 items-start border rounded p-2">
                <Badge variant="secondary" className="text-[10px] shrink-0">{c.code}</Badge>
                <p className="text-xs">{c.connection}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Heaven Placement */}
      {result.heaven_placement && (
        <Card className="border-purple-500/20">
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 text-xs">
                {result.heaven_placement.primary_heaven}
              </Badge>
              <span className="text-sm font-medium">Heaven Placement</span>
            </div>
            <p className="text-sm">{result.heaven_placement.primary_rationale}</p>
            {result.heaven_placement.echoes_in_other_heavens?.map((e: any, i: number) => (
              <div key={i} className="text-xs text-muted-foreground">
                <span className="font-medium">{e.heaven}:</span> {e.echo}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Five-Part Rhythm */}
      {result.five_part_rhythm && (
        <div>
          <p className="text-xs font-medium mb-2">Five-Part Rhythm</p>
          <div className="grid grid-cols-1 gap-1.5">
            {Object.entries(result.five_part_rhythm).map(([key, val]) => (
              <div key={key} className="flex gap-2 items-start bg-muted/30 rounded p-2">
                <Badge variant="outline" className="text-[10px] capitalize shrink-0">{key}</Badge>
                <p className="text-xs">{val as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ascension Mapping */}
      {result.ascension_mapping && (
        <div>
          <p className="text-xs font-medium mb-2">Five Ascensions</p>
          <div className="space-y-1.5">
            {Object.entries(result.ascension_mapping).map(([key, val]) => (
              <div key={key} className="flex gap-2 items-start border-l-2 border-primary/30 pl-2">
                <span className="text-[10px] font-medium text-muted-foreground capitalize w-16 shrink-0">
                  {key.replace("_level", "")}
                </span>
                <p className="text-xs">{val as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cosmic Summary */}
      {result.cosmic_summary && (
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs font-medium mb-1">🌌 Cosmic Summary</p>
          <p className="text-sm leading-relaxed whitespace-pre-line">{result.cosmic_summary}</p>
        </div>
      )}
    </div>
  );
}

// ─── Shared Room Card ───────────────────────────────────────────
function RoomCard({ room, expanded }: { room: any; expanded?: boolean }) {
  return (
    <div className="border rounded-lg p-2.5 space-y-1.5">
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="text-[10px]">{room.code}</Badge>
        <span className="text-xs font-medium">{room.name}</span>
        {room.difficulty_rating && (
          <Badge variant="outline" className="text-[10px] ml-auto">{room.difficulty_rating}</Badge>
        )}
      </div>
      <p className={`text-xs leading-relaxed whitespace-pre-line ${expanded ? "" : "line-clamp-4"}`}>
        {room.analysis || room.deep_analysis}
      </p>
      {room.key_scriptures?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {room.key_scriptures.map((s: string, i: number) => (
            <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>
          ))}
        </div>
      )}
      {room.actionable_application && (
        <div className="bg-green-500/5 border border-green-500/10 rounded p-1.5">
          <p className="text-[10px] text-green-600">🎯 {room.actionable_application}</p>
        </div>
      )}
    </div>
  );
}
