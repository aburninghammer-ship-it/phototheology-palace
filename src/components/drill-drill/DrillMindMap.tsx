import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Save, Download, ChevronDown, ChevronRight, BookOpen, Eye, Sparkles, Search, Target, Telescope, Globe, Flame, Book, Loader2, RefreshCw } from "lucide-react";
import { DrillSession } from "@/pages/DrillDrill";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";

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

export const DrillMindMap = ({ session, onSave, onRefresh }: DrillMindMapProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [drillName, setDrillName] = useState("");
  const [expandedFloors, setExpandedFloors] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);
  const [expoundingRoomId, setExpoundingRoomId] = useState<string | null>(null);

  // Group responses by floor
  const responsesByFloor = session.responses.reduce((acc, resp) => {
    const floor = resp.floorNumber;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(resp);
    return acc;
  }, {} as Record<number, typeof session.responses>);

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
      toast.success("Response expounded!");
      
      // Note: In a real implementation, you'd update the session state
      // For now, we'll show the expounded text in the toast
      // You may want to add state management to store expanded responses
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

    Object.entries(responsesByFloor).forEach(([floor, responses]) => {
      text += `## Floor ${floor}\n\n`;
      responses.forEach(resp => {
        text += `### ${resp.roomTag} - ${resp.roomName}\n\n`;
        if (resp.jeevesResponse) {
          text += `${resp.jeevesResponse}\n\n`;
        }
      });
    });

    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drill-${session.verse.replace(/[^a-zA-Z0-9]/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported to Markdown!");
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
                      {responses.map(resp => (
                        <div key={resp.roomId} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{resp.roomTag}</Badge>
                              <span className="font-medium">{resp.roomName}</span>
                            </div>
                            {resp.jeevesResponse && resp.jeevesResponse !== "Skipped" && (
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
                            <div className="bg-background/50 rounded-lg p-4 text-sm">
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{resp.jeevesResponse}</ReactMarkdown>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
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
