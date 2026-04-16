import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface RoomConnection {
  roomCode: string;
  roomName: string;
  floor: number;
  insight: string;
  confidence: number;
}

interface VerseRoomMapping {
  verse: number;
  verseText: string;
  rooms: RoomConnection[];
  christCenter: string;
}

interface CrossRoomLinkingProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

const FLOOR_COLORS = [
  "",
  "from-amber-500 to-orange-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-violet-500",
  "from-red-500 to-rose-500",
  "from-indigo-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-amber-500",
];

export const CrossRoomLinking = ({ book, chapter, verse, verseText }: CrossRoomLinkingProps) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<VerseRoomMapping | null>(null);
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);
  const { toast } = useToast();

  const analyzeVerse = async () => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "cross-room-linking",
          book,
          chapter,
          verse,
          verseText,
        },
      });

      if (error) throw error;

      const content = response?.content || "";
      let cleanedContent = content
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');
      
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setData(JSON.parse(jsonMatch[0]));
        toast({ title: "Cross-Room Analysis Complete" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const groupedByFloor = data?.rooms?.reduce((acc, room) => {
    const floor = room.floor || 1;
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(room);
    return acc;
  }, {} as Record<number, RoomConnection[]>) || {};

  return (
    <Card className="shadow-elegant">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Cross-Room Linking
        </CardTitle>
        <CardDescription className="text-white/90">
          See how this verse connects to multiple Palace rooms
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        <div className="p-3 rounded-lg bg-muted/50 border">
          <p className="text-sm font-medium">{book} {chapter}:{verse}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{verseText}</p>
        </div>

        <Button
          onClick={analyzeVerse}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Mapping to Palace Rooms...
            </>
          ) : (
            <>
              <Layers className="h-4 w-4 mr-2" />
              Analyze Room Connections
            </>
          )}
        </Button>

        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Christ Center */}
              {data.christCenter && (
                <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                    ✝️ Christ Center
                  </p>
                  <p className="text-sm">{data.christCenter}</p>
                </div>
              )}

              {/* Rooms by Floor */}
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {Object.entries(groupedByFloor).map(([floor, rooms]) => (
                    <div key={floor} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedFloor(expandedFloor === Number(floor) ? null : Number(floor))}
                        className={`w-full p-3 flex items-center justify-between bg-gradient-to-r ${FLOOR_COLORS[Number(floor)]} text-white`}
                      >
                        <span className="font-medium">Floor {floor}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-white/20">
                            {rooms.length} rooms
                          </Badge>
                          {expandedFloor === Number(floor) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedFloor === Number(floor) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 space-y-2 bg-card">
                              {rooms.map((room, idx) => (
                                <div key={idx} className="p-2 rounded bg-muted/50 border">
                                  <div className="flex items-center justify-between mb-1">
                                    <Badge variant="outline">{room.roomCode}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {room.confidence}% match
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium">{room.roomName}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{room.insight}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Summary */}
              <div className="flex flex-wrap gap-1">
                {data.rooms?.map((room, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {room.roomCode}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
