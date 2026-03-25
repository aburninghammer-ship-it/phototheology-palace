import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Megaphone, Loader2, Upload, Sparkles, ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// Palace rooms organized by floor
const PALACE_ROOMS = [
  { floor: 1, label: "Floor 1 — Furnishing", rooms: [
    { id: "SR", name: "Story Room", desc: "Narrative recall & sequence" },
    { id: "IR", name: "Imagination Room", desc: "Immersive scene-building" },
    { id: "24F", name: "24FPS", desc: "One image per chapter" },
    { id: "BR", name: "Bible Rendered", desc: "Panoramic book summaries" },
    { id: "TR", name: "Translation Room", desc: "Verses → visual images" },
    { id: "GR", name: "Gems Room", desc: "Striking insights & discoveries" },
  ]},
  { floor: 2, label: "Floor 2 — Investigation", rooms: [
    { id: "OR", name: "Observation Room", desc: "Detail logging without interpretation" },
    { id: "DC", name: "Def-Com Room", desc: "Definitions & commentary" },
    { id: "ST", name: "Symbols/Types", desc: "God's symbolic language & typology" },
    { id: "QR", name: "Questions Room", desc: "Intra/inter/PT questioning" },
    { id: "QA", name: "Q&A Chains", desc: "Scripture answering Scripture" },
  ]},
  { floor: 3, label: "Floor 3 — Freestyle", rooms: [
    { id: "NF", name: "Nature Freestyle", desc: "Creation as sermon illustration" },
    { id: "PF", name: "Personal Freestyle", desc: "Life experiences as object lessons" },
    { id: "BF", name: "Bible Freestyle", desc: "Verse genetics & connections" },
    { id: "HF", name: "History Freestyle", desc: "Secular history as teaching points" },
    { id: "LR", name: "Listening Room", desc: "Responsive, agile connections" },
  ]},
  { floor: 4, label: "Floor 4 — Next Level", rooms: [
    { id: "CR", name: "Concentration Room", desc: "Every text reveals Christ" },
    { id: "DR", name: "Dimensions Room", desc: "Literal, Christ, Me, Church, Heaven" },
    { id: "C6", name: "Connect 6", desc: "Genre classification" },
    { id: "TRm", name: "Theme Room", desc: "Sanctuary/GC/Gospel walls" },
    { id: "TZ", name: "Time Zone Room", desc: "6-zone grid (Earth/Heaven × Past/Present/Future)" },
    { id: "PRm", name: "Patterns Room", desc: "Recurring biblical motifs" },
    { id: "P", name: "Parallels Room", desc: "Mirrored actions across time" },
    { id: "FRt", name: "Fruit Room", desc: "Galatians 5:22-23 test" },
  ]},
  { floor: 5, label: "Floor 5 — Vision", rooms: [
    { id: "BL", name: "Blue Room (Sanctuary)", desc: "Sanctuary blueprint & furniture" },
    { id: "PR", name: "Prophecy Room", desc: "Daniel & Revelation timelines" },
    { id: "3A", name: "Three Angels' Room", desc: "Rev 14:6-12 capstone" },
  ]},
  { floor: 6, label: "Floor 6 — Three Heavens", rooms: [
    { id: "CYCLES", name: "Eight Cycles", desc: "@Ad → @Re placement" },
    { id: "HEAVENS", name: "Three Heavens", desc: "DoL¹/NE¹, DoL²/NE², DoL³/NE³" },
    { id: "JR", name: "Juice Room", desc: "Full-principle squeeze" },
  ]},
  { floor: 7, label: "Floor 7 — Spiritual", rooms: [
    { id: "FRm", name: "Fire Room", desc: "Emotional weight & conviction" },
    { id: "MR", name: "Meditation Room", desc: "Slow marination in truth" },
    { id: "SRm", name: "Speed Room", desc: "Rapid application drills" },
  ]},
];

const ALL_ROOM_IDS = PALACE_ROOMS.flatMap(f => f.rooms.map(r => r.id));

// AI-suggested rooms based on content keywords
function suggestRooms(text: string): string[] {
  const lower = text.toLowerCase();
  const suggested = new Set<string>();

  // Always include CR (Christ-centered)
  suggested.add("CR");

  if (/prophecy|daniel|revelation|beast|seal|trumpet/i.test(lower)) {
    suggested.add("PR"); suggested.add("3A"); suggested.add("BL");
  }
  if (/type|shadow|lamb|passover|sanctuary|tabernacle|temple/i.test(lower)) {
    suggested.add("ST"); suggested.add("BL");
  }
  if (/pattern|repeat|40 days|3 days|cycle/i.test(lower)) {
    suggested.add("PRm"); suggested.add("CYCLES");
  }
  if (/parallel|mirror|babel.*pentecost|exodus.*return/i.test(lower)) {
    suggested.add("P");
  }
  if (/greek|hebrew|definition|meaning|word/i.test(lower)) {
    suggested.add("DC");
  }
  if (/story|narrative|told|account/i.test(lower)) {
    suggested.add("SR"); suggested.add("IR");
  }
  if (/question|why|how|what if/i.test(lower)) {
    suggested.add("QR");
  }
  if (/dimension|literal|spiritual|church|heaven/i.test(lower)) {
    suggested.add("DR");
  }
  if (/history|empire|rome|babylon|nation/i.test(lower)) {
    suggested.add("HF"); suggested.add("HEAVENS");
  }
  if (/fruit|love|joy|peace|patience|character/i.test(lower)) {
    suggested.add("FRt");
  }
  if (/fire|cross|calvary|gethsemane|suffer/i.test(lower)) {
    suggested.add("FRm");
  }

  // Always add observation & gems
  suggested.add("OR");
  suggested.add("GR");

  return Array.from(suggested);
}

export default function Amplify() {
  const { user } = useAuth();
  const [studyText, setStudyText] = useState("");
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [suggestedOnce, setSuggestedOnce] = useState(false);
  const [report, setReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedFloors, setExpandedFloors] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  const handleSuggestRooms = useCallback(() => {
    if (studyText.length < 100) {
      toast.error("Please enter at least a full paragraph (100+ characters)");
      return;
    }
    const suggested = suggestRooms(studyText);
    setSelectedRooms(suggested);
    setSuggestedOnce(true);
    toast.success(`${suggested.length} rooms auto-selected based on your study`);
  }, [studyText]);

  const toggleRoom = (id: string) => {
    setSelectedRooms(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const toggleFloor = (floor: number) => {
    setExpandedFloors(prev =>
      prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor]
    );
  };

  const selectAllOnFloor = (floor: number) => {
    const floorRooms = PALACE_ROOMS.find(f => f.floor === floor)?.rooms.map(r => r.id) || [];
    const allSelected = floorRooms.every(id => selectedRooms.includes(id));
    if (allSelected) {
      setSelectedRooms(prev => prev.filter(id => !floorRooms.includes(id)));
    } else {
      setSelectedRooms(prev => [...new Set([...prev, ...floorRooms])]);
    }
  };

  const handleAmplify = async () => {
    if (studyText.length < 100) {
      toast.error("Study must be at least a full paragraph (100+ characters)");
      return;
    }
    if (selectedRooms.length === 0) {
      toast.error("Select at least one Palace room");
      return;
    }

    setIsGenerating(true);
    setReport("");

    try {
      const roomNames = selectedRooms.map(id => {
        for (const floor of PALACE_ROOMS) {
          const room = floor.rooms.find(r => r.id === id);
          if (room) return `${room.name} (${id}) — ${room.desc}`;
        }
        return id;
      });

      const { data, error } = await supabase.functions.invoke("amplify-study", {
        body: { studyText, rooms: roomNames }
      });

      if (error) {
        console.error("Amplify invoke error:", error);
        const msg = typeof error === "object" && error.message ? error.message : String(error);
        if (msg.includes("429")) {
          toast.error("Rate limited — please wait a moment and try again");
        } else if (msg.includes("402")) {
          toast.error("AI credits exhausted — please add funds in Settings");
        } else {
          toast.error("Failed to amplify study. Please try again.");
        }
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setReport(data?.report || "No report generated.");
      toast.success("Study amplified through the Palace!");
    } catch (err: any) {
      console.error("Amplify error:", err);
      toast.error("Failed to amplify study. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30">
            <Megaphone className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Amplify</h1>
            <p className="text-sm text-muted-foreground">
              Run any study through the Palace — unlock deeper layers with every room
            </p>
          </div>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Paste or type your study below
            </label>
            <Textarea
              value={studyText}
              onChange={(e) => {
                setStudyText(e.target.value);
                if (suggestedOnce) setSuggestedOnce(false);
              }}
              placeholder="Paste your Bible study, sermon notes, devotional, or any theological text here... (minimum one paragraph)"
              className="min-h-[160px] text-sm"
              maxLength={15000}
            />
            <div className="flex justify-between mt-1">
              <span className={cn(
                "text-xs",
                studyText.length < 100 ? "text-muted-foreground" : "text-emerald-500"
              )}>
                {studyText.length < 100
                  ? `${100 - studyText.length} more characters needed`
                  : "✓ Ready to amplify"}
              </span>
              <span className="text-xs text-muted-foreground">{studyText.length}/15,000</span>
            </div>
          </div>

          {/* Auto-suggest button */}
          <Button
            variant="outline"
            onClick={handleSuggestRooms}
            disabled={studyText.length < 100}
            className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Auto-detect best Palace rooms
          </Button>
        </div>

        {/* Room Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">
              Palace Rooms ({selectedRooms.length} selected)
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRooms([])}
              className="text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Clear
            </Button>
          </div>

          <div className="space-y-2">
            {PALACE_ROOMS.map((floor) => {
              const isExpanded = expandedFloors.includes(floor.floor);
              const floorRoomIds = floor.rooms.map(r => r.id);
              const selectedCount = floorRoomIds.filter(id => selectedRooms.includes(id)).length;

              return (
                <div key={floor.floor} className="border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFloor(floor.floor)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground">{floor.label}</span>
                      {selectedCount > 0 && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          {selectedCount}/{floor.rooms.length}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); selectAllOnFloor(floor.floor); }}
                        className="text-[10px] text-primary hover:underline"
                      >
                        {floorRoomIds.every(id => selectedRooms.includes(id)) ? "Deselect all" : "Select all"}
                      </button>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="p-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {floor.rooms.map((room) => {
                        const isSelected = selectedRooms.includes(room.id);
                        return (
                          <button
                            key={room.id}
                            onClick={() => toggleRoom(room.id)}
                            className={cn(
                              "text-left p-2 rounded-md border transition-all text-xs",
                              isSelected
                                ? "border-amber-500/50 bg-amber-500/10 text-foreground"
                                : "border-border/50 bg-card hover:bg-muted/50 text-muted-foreground"
                            )}
                          >
                            <div className="font-medium truncate">{room.name}</div>
                            <div className="text-[10px] opacity-70 truncate">{room.desc}</div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Amplify Button */}
        <Button
          onClick={handleAmplify}
          disabled={isGenerating || studyText.length < 100 || selectedRooms.length === 0}
          className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-base"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Amplifying through {selectedRooms.length} rooms...
            </>
          ) : (
            <>
              <Megaphone className="h-5 w-5 mr-2" />
              Amplify Study
            </>
          )}
        </Button>

        {/* Report Output */}
        {report && (
          <div className="mt-8 border border-amber-500/20 rounded-xl bg-card p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              Amplified Report
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
