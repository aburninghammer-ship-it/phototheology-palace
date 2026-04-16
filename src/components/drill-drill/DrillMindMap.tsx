import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Download, ChevronDown, ChevronRight, BookOpen, Eye, Sparkles, Search, Target, Telescope, Globe, Flame, Book, Loader2, RefreshCw, Cross, Heart, Layers, Share2 } from "lucide-react";
import { QuickShareButton } from "@/components/social/QuickShareButton";
import { DrillSession, DrillVariation, DrillResponse } from "@/pages/DrillDrill";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { FragmentDialogue } from "./FragmentDialogue";

interface DrillMindMapProps {
  session: DrillSession;
  onSave: (name: string) => void;
  onRefresh?: () => void;
}

const FLOOR_ICONS: Record<number, any> = {
  1: BookOpen,
  2: Search,
  3: Sparkles,
  4: Target,
  5: Telescope,
  6: Globe,
  7: Flame
};

const FLOOR_COLORS: Record<number, string> = {
  1: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
  2: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  3: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  4: "from-purple-500/20 to-violet-500/20 border-purple-500/30",
  5: "from-rose-500/20 to-pink-500/20 border-rose-500/30",
  6: "from-indigo-500/20 to-blue-500/20 border-indigo-500/30",
  7: "from-red-500/20 to-orange-500/20 border-red-500/30"
};

const VARIATION_ICONS: Record<string, any> = {
  "Christ-Centered": Cross,
  "Practical Application": Heart,
  "Cosmic Context": Layers
};

const VARIATION_COLORS: Record<string, string> = {
  "Christ-Centered": "text-rose-500",
  "Practical Application": "text-emerald-500",
  "Cosmic Context": "text-indigo-500"
};

export const DrillMindMap = ({ session, onSave, onRefresh }: DrillMindMapProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [drillName, setDrillName] = useState("");
  const [expandedFloors, setExpandedFloors] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [expoundingRoomId, setExpoundingRoomId] = useState<string | null>(null);
  const [expoundedResponses, setExpoundedResponses] = useState<Record<string, string>>({});
  const [activeVariation, setActiveVariation] = useState("0");

  // Get variations or create a single variation from responses
  const variations: DrillVariation[] = session.variations && session.variations.length > 0 
    ? session.variations 
    : [{
        theme: "Comprehensive Analysis",
        description: "Full palace analysis",
        responses: session.responses
      }];

  // Get current variation's responses
  const currentVariation = variations[parseInt(activeVariation)] || variations[0];
  const currentResponses = currentVariation?.responses || session.responses;

  // Group responses by floor
  const responsesByFloor = currentResponses.reduce((acc, resp) => {
    const floor = resp.floorNumber;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(resp);
    return acc;
  }, {} as Record<number, DrillResponse[]>);

  const toggleFloor = (floor: number) => {
    setExpandedFloors(prev => 
      prev.includes(floor) 
        ? prev.filter(f => f !== floor)
        : [...prev, floor]
    );
  };

  const handleSave = () => {
    if (!drillName.trim()) {
      toast.error("Please enter a name");
      return;
    }
    onSave(drillName);
    setSaveDialogOpen(false);
    setDrillName("");
  };

  const handleExpound = async (roomId: string, roomTag: string, roomName: string, floorNumber: number, previousResponse: string) => {
    setExpoundingRoomId(roomId);
    try {
      const { data, error } = await supabase.functions.invoke("drill-drill", {
        body: {
          action: "expound",
          verse: session.verse,
          verseText: session.verseText,
          difficulty: session.difficulty,
          room: {
            id: roomId,
            tag: roomTag,
            name: roomName,
            floorNumber,
            previousResponse
          }
        }
      });

      if (error) throw error;
      
      // Store the expounded response with variation index
      if (data?.expoundedText) {
        const key = `${activeVariation}-${roomId}`;
        setExpoundedResponses(prev => ({
          ...prev,
          [key]: data.expoundedText
        }));
        toast.success("Response expounded!");
      } else {
        console.error("No expounded text in response:", data);
        toast.error("No expounded content received");
      }
    } catch (error) {
      console.error("Expound error:", error);
      toast.error("Failed to expound");
    } finally {
      setExpoundingRoomId(null);
    }
  };

  const exportToText = () => {
    let text = `# Drill Drill: ${session.verse}\n\n`;
    if (session.verseText) {
      text += `> "${session.verseText}"\n\n`;
    }
    text += `---\n\n`;

    // Export all variations
    variations.forEach((variation, vIndex) => {
      text += `# Variation ${vIndex + 1}: ${variation.theme}\n`;
      text += `*${variation.description}*\n\n`;

      const varResponsesByFloor = variation.responses.reduce((acc, resp) => {
        const floor = resp.floorNumber;
        if (!acc[floor]) acc[floor] = [];
        acc[floor].push(resp);
        return acc;
      }, {} as Record<number, DrillResponse[]>);

      Object.entries(varResponsesByFloor).forEach(([floor, responses]) => {
        text += `## Floor ${floor}\n\n`;
        responses.forEach(resp => {
          text += `### ${resp.roomTag} - ${resp.roomName}\n\n`;
          if (resp.jeevesResponse) {
            text += `${resp.jeevesResponse}\n\n`;
          }
        });
      });

      text += `\n---\n\n`;
    });

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drill-${session.verse.replace(/[^a-zA-Z0-9]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported all variations to Markdown!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">{session.verse}</h2>
              {session.verseText && (
                <p className="text-muted-foreground italic mt-1 max-w-2xl">
                  "{session.verseText}"
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Your Drill</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder={`${session.verse} - My Drill`}
                      value={drillName}
                      onChange={(e) => setDrillName(e.target.value)}
                    />
                    <Button onClick={handleSave} className="w-full">
                      Save Drill
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" onClick={exportToText}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <QuickShareButton
                title={`🔍 Gather the Fragments: ${session.drillType === "thought" ? "Thought Drill" : session.verse}`}
                content={`I just completed a Phototheology drill on ${session.drillType === "thought" ? `"${session.thought?.slice(0, 100)}${session.thought && session.thought.length > 100 ? '...' : ''}"` : session.verse}!\n\n📊 Explored ${currentResponses.filter(r => r.completed).length} Palace rooms across ${Object.keys(responsesByFloor).length} floors.\n\n"Gather up the fragments that remain, that nothing be lost." - John 6:12`}
                type="study"
              />
              {onRefresh && (
                <Button variant="outline" onClick={onRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  New Combination
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variation Tabs - Only show if multiple variations */}
      {variations.length > 1 && (
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              3 Drill Variations
            </CardTitle>
            <CardDescription>
              Each variation explores the same rooms with different principle combinations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeVariation} onValueChange={setActiveVariation}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                {variations.map((variation, index) => {
                  const Icon = VARIATION_ICONS[variation.theme] || Sparkles;
                  const colorClass = VARIATION_COLORS[variation.theme] || "text-primary";
                  return (
                    <TabsTrigger key={index} value={index.toString()} className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${colorClass}`} />
                      <span className="hidden sm:inline">{variation.theme}</span>
                      <span className="sm:hidden">{index + 1}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
              
              {variations.map((variation, index) => (
                <TabsContent key={index} value={index.toString()} className="mt-0">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2">
                      {(() => {
                        const Icon = VARIATION_ICONS[variation.theme] || Sparkles;
                        const colorClass = VARIATION_COLORS[variation.theme] || "text-primary";
                        return <Icon className={`h-5 w-5 ${colorClass}`} />;
                      })()}
                      <h3 className="font-semibold">{variation.theme}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{variation.description}</p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Mind Map Tree */}
      <div className="space-y-4">
        {Object.entries(responsesByFloor).map(([floorNum, responses]) => {
          const floor = parseInt(floorNum);
          const Icon = FLOOR_ICONS[floor] || BookOpen;
          const colorClass = FLOOR_COLORS[floor] || "from-gray-500/20 to-gray-500/20 border-gray-500/30";
          const isExpanded = expandedFloors.includes(floor);

          return (
            <Collapsible key={floor} open={isExpanded} onOpenChange={() => toggleFloor(floor)}>
              <Card className={`bg-gradient-to-r ${colorClass} border`}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-background/20 transition-colors">
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-lg">Floor {floor}</CardTitle>
                      <Badge variant="outline">{responses.length} rooms</Badge>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4 pl-4 border-l-2 border-border/50">
                      {responses.map(resp => {
                        const expoundKey = `${activeVariation}-${resp.roomId}`;
                        return (
                          <div key={resp.roomId} className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{resp.roomTag}</Badge>
                                <span className="font-medium">{resp.roomName}</span>
                              </div>
                              {resp.jeevesResponse && resp.jeevesResponse !== "Skipped" && resp.jeevesResponse !== "Analysis pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleExpound(resp.roomId, resp.roomTag, resp.roomName, resp.floorNumber, resp.jeevesResponse!)}
                                  disabled={expoundingRoomId === resp.roomId}
                                >
                                  {expoundingRoomId === resp.roomId ? (
                                    <>
                                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      Expounding...
                                    </>
                                  ) : (
                                    <>
                                      <Book className="h-3 w-3 mr-1" />
                                      Expound
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                            {resp.jeevesResponse && resp.jeevesResponse !== "Skipped" && (
                              <div className="space-y-3">
                                <div className="bg-background/50 rounded-lg p-4 text-sm">
                                  <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <ReactMarkdown>{resp.jeevesResponse}</ReactMarkdown>
                                  </div>
                                </div>
                                
                                {/* Show expounded content if available */}
                                {expoundedResponses[expoundKey] && (
                                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-sm">
                                    <div className="flex items-center gap-2 mb-2 text-primary">
                                      <Sparkles className="h-4 w-4" />
                                      <span className="font-medium">Expounded Insight</span>
                                    </div>
                                    <div className="prose prose-sm dark:prose-invert max-w-none">
                                      <ReactMarkdown>{expoundedResponses[expoundKey]}</ReactMarkdown>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Interactive Dialogue */}
                                <FragmentDialogue
                                  roomCode={resp.roomTag}
                                  roomName={resp.roomName}
                                  initialInsight={resp.jeevesResponse}
                                  verseText={session.verseText || ""}
                                  verseReference={session.verse}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};