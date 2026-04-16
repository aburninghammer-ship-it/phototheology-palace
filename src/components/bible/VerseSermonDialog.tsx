import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sparkles,
  Loader2,
  ChevronDown,
  Mic,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FullStarter {
  starterTitle: string;
  starterParagraph?: string;
  bigIdea: string;
  palaceAnchors?: string[];
  roomRefs?: string[];
  internalTemplate?: {
    governingPrinciple?: string;
    christologicalAxis?: string;
    falseCenterExposed?: string;
    gospelResolution?: string;
  };
}

interface VerseSermonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verseRef: string;
  verseText: string;
}

// PT Palace Rooms from Floors 3-7
const PT_ROOMS = [
  // Floor 3 - Freestyle
  { id: "NF", label: "Nature Freestyle", floor: 3, description: "See lessons in creation" },
  { id: "PF", label: "Personal Freestyle", floor: 3, description: "Life as object lesson" },
  { id: "BF", label: "Bible Freestyle", floor: 3, description: "Verse genetics connections" },
  { id: "HF", label: "History Freestyle", floor: 3, description: "Culture & events as lessons" },
  { id: "LR", label: "Listening Room", floor: 3, description: "Responsive connections" },
  // Floor 4 - Next Level
  { id: "CR", label: "Concentration", floor: 4, description: "Christ in every text" },
  { id: "DR", label: "Dimensions", floor: 4, description: "5 layers of meaning" },
  { id: "C6", label: "Connect 6", floor: 4, description: "Genre classification" },
  { id: "TRm", label: "Theme Room", floor: 4, description: "Walls of salvation history" },
  { id: "TZ", label: "Time Zone", floor: 4, description: "Past, present, future" },
  { id: "PRm", label: "Patterns", floor: 4, description: "Recurring motifs" },
  { id: "P‖", label: "Parallels", floor: 4, description: "Mirrored actions" },
  { id: "FRt", label: "Fruit Room", floor: 4, description: "Character test" },
  // Floor 5 - Vision
  { id: "BL", label: "Blue Room", floor: 5, description: "Sanctuary blueprint" },
  { id: "PR", label: "Prophecy", floor: 5, description: "Prophetic timelines" },
  { id: "3A", label: "Three Angels", floor: 5, description: "Final gospel message" },
  // Floor 6 - Cycles & Heavens
  { id: "@Cy", label: "Cycles", floor: 6, description: "8 redemptive cycles" },
  { id: "3H", label: "Three Heavens", floor: 6, description: "Cosmic stage" },
  { id: "JR", label: "Juice Room", floor: 6, description: "Full extraction" },
  // Floor 7 - Spiritual/Emotional
  { id: "FRm", label: "Fire Room", floor: 7, description: "Emotional weight" },
  { id: "MR", label: "Meditation", floor: 7, description: "Slow marination" },
  { id: "SRm", label: "Speed Room", floor: 7, description: "Rapid application" },
];

const FLOOR_COLORS: Record<number, string> = {
  3: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300",
  4: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
  5: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300",
  6: "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300",
  7: "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300",
};

export function VerseSermonDialog({
  open,
  onOpenChange,
  verseRef,
  verseText,
}: VerseSermonDialogProps) {
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);
  const [starter, setStarter] = useState<FullStarter | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { toast } = useToast();

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedRooms([]);
      setStarter(null);
      setExpandedSection(null);
    }
  }, [open]);

  const toggleRoom = (roomId: string) => {
    setSelectedRooms(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId);
      }
      if (prev.length >= 3) {
        toast({
          title: "Maximum 3 rooms",
          description: "Select up to 3 PT rooms to focus your sermon idea.",
        });
        return prev;
      }
      return [...prev, roomId];
    });
  };

  const generateStarter = async () => {
    if (selectedRooms.length === 0) {
      toast({
        title: "Select rooms",
        description: "Please select at least one PT room.",
      });
      return;
    }

    setGenerating(true);
    setStarter(null);

    try {
      const roomLabels = selectedRooms.map(id => PT_ROOMS.find(r => r.id === id)?.label).filter(Boolean);
      
      const { data, error } = await supabase.functions.invoke("generate-sermon-starter", {
        body: {
          topic: verseRef,
          level: "Intermediate",
          anchorScriptures: [verseRef],
          ptRooms: selectedRooms,
          roomLabels: roomLabels,
        },
      });

      if (error) throw error;

      if (data?.success && data?.starter) {
        setStarter(data.starter);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error generating starter:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate sermon starter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Group rooms by floor
  const roomsByFloor = PT_ROOMS.reduce((acc, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {} as Record<number, typeof PT_ROOMS>);

  const floorNames: Record<number, string> = {
    3: "Freestyle Floor",
    4: "Next Level Floor",
    5: "Vision Floor",
    6: "Cycles & Heavens",
    7: "Spiritual/Emotional",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-amber-500" />
            <span>Sermon Idea Starters</span>
          </DialogTitle>
          <DialogDescription>
            {verseRef} — "{verseText.substring(0, 80)}{verseText.length > 80 ? "..." : ""}"
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-2">
          <div className="space-y-4">
            {/* Room Selection by Floor */}
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Select 1-3 PT Palace rooms to shape your sermon idea:
              </p>
              
              {Object.entries(roomsByFloor).map(([floor, rooms]) => (
                <div key={floor} className="mb-4">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">
                    Floor {floor}: {floorNames[Number(floor)]}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {rooms.map((room) => {
                      const isSelected = selectedRooms.includes(room.id);
                      return (
                        <label
                          key={room.id}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-sm ${
                            isSelected
                              ? FLOOR_COLORS[room.floor]
                              : "bg-muted/30 border-border hover:bg-muted/50"
                          }`}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRoom(room.id)}
                            className="h-3.5 w-3.5"
                          />
                          <span className="font-medium">{room.id}</span>
                          <span className="text-muted-foreground hidden sm:inline">
                            {room.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedRooms.length > 0 && (
                <Button
                  onClick={generateStarter}
                  disabled={generating}
                  className="w-full mt-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Sermon Idea ({selectedRooms.join(", ")})
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {generating && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3 p-4"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Jeeves is generating sermon ideas...</span>
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </motion.div>
              )}

              {!generating && starter && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4 p-1 border-t pt-4"
                >
                  {/* Title */}
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <h3 className="font-semibold text-lg">{starter.starterTitle}</h3>
                  </div>

                  {/* Big Idea */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                      💡 {starter.bigIdea}
                    </p>
                  </div>

                  {/* Starter Paragraph */}
                  {starter.starterParagraph && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {starter.starterParagraph}
                    </p>
                  )}

                  {/* Palace Anchors */}
                  {starter.palaceAnchors && starter.palaceAnchors.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {starter.palaceAnchors.map((anchor, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {anchor}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Room Refs */}
                  {starter.roomRefs && starter.roomRefs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {starter.roomRefs.map((ref) => (
                        <Badge
                          key={ref}
                          variant="outline"
                          className="text-xs bg-primary/10"
                        >
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Internal Template Section */}
                  {starter.internalTemplate && (
                    <div
                      className="pt-3 border-t cursor-pointer"
                      onClick={() =>
                        setExpandedSection(expandedSection === "template" ? null : "template")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Theological Framework</h4>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedSection === "template" ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <AnimatePresence>
                        {expandedSection === "template" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 space-y-2 text-sm"
                          >
                            {starter.internalTemplate.governingPrinciple && (
                              <div>
                                <span className="text-muted-foreground">Governing Principle: </span>
                                <span>{starter.internalTemplate.governingPrinciple}</span>
                              </div>
                            )}
                            {starter.internalTemplate.christologicalAxis && (
                              <div>
                                <span className="text-muted-foreground">Christ Connection: </span>
                                <span>{starter.internalTemplate.christologicalAxis}</span>
                              </div>
                            )}
                            {starter.internalTemplate.falseCenterExposed && (
                              <div>
                                <span className="text-muted-foreground">False Center Exposed: </span>
                                <span>{starter.internalTemplate.falseCenterExposed}</span>
                              </div>
                            )}
                            {starter.internalTemplate.gospelResolution && (
                              <div>
                                <span className="text-muted-foreground">Gospel Resolution: </span>
                                <span>{starter.internalTemplate.gospelResolution}</span>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}

              {!generating && !starter && selectedRooms.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Mic className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Select PT rooms above to generate sermon ideas</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
