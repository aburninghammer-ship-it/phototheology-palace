import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MessageSquare, Sparkles, X, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { RoomInsightChat } from "./RoomInsightChat";
import { DimensionFilter } from "./DimensionFilter";

// Helper function to parse room insights from commentary
const parseRoomInsights = (commentary: string) => {
  const rooms: Array<{ code: string; name: string; content: string }> = [];
  
  // Split by room codes (e.g., "SR (Story Room)", "IR (Imagination Room)")
  const roomPattern = /([A-Z@]+(?:\d+)?)\s*\(([^)]+)\)[\s\n]*([^]*?)(?=(?:[A-Z@]+(?:\d+)?)\s*\([^)]+\)|$)/g;
  let match;
  
  while ((match = roomPattern.exec(commentary)) !== null) {
    const [, code, name, content] = match;
    if (content.trim()) {
      rooms.push({
        code: code.trim(),
        name: name.trim(),
        content: content.trim()
      });
    }
  }
  
  // If no rooms found, return the whole commentary as a general insight
  if (rooms.length === 0) {
    return [{
      code: "GEN",
      name: "General Insights",
      content: commentary
    }];
  }
  
  return rooms;
};

const PRINCIPLE_OPTIONS = [
  // Floor 1 - Furnishing (Memory & Visualization)
  { id: "sr", label: "Story Room (SR)", color: "gradient-palace" },
  { id: "ir", label: "Imagination Room (IR)", color: "gradient-ocean" },
  { id: "24fps", label: "24FPS Room (24)", color: "gradient-royal" },
  { id: "br", label: "Bible Rendered (BR)", color: "gradient-sunset" },
  { id: "tr", label: "Translation Room (TR)", color: "gradient-warmth" },
  { id: "gr", label: "Gems Room (GR)", color: "gradient-palace" },
  
  // Floor 2 - Investigation (Detective Work)
  { id: "or", label: "Observation Room (OR)", color: "gradient-ocean" },
  { id: "dc", label: "Def-Com Room (DC)", color: "gradient-royal" },
  { id: "st", label: "Symbols/Types (@T)", color: "gradient-sunset" },
  { id: "qr", label: "Questions Room (?)", color: "gradient-warmth" },
  { id: "qa", label: "Q&A Chains (?!)", color: "gradient-palace" },
  
  // Floor 3 - Freestyle (Connections)
  { id: "nf", label: "Nature Freestyle (NF)", color: "gradient-ocean" },
  { id: "pf", label: "Personal Freestyle (PF)", color: "gradient-royal" },
  { id: "bf", label: "Bible Freestyle - Verse Genetics (BF)", color: "gradient-sunset" },
  { id: "hf", label: "History/Social Freestyle (HF)", color: "gradient-warmth" },
  { id: "lr", label: "Listening Room (LR)", color: "gradient-palace" },
  
  // Floor 4 - Next Level (Christ-Centered Depth)
  { id: "cr", label: "Concentration Room (CR)", color: "gradient-ocean" },
  { id: "dr", label: "Dimensions Room (DR)", color: "gradient-royal" },
  { id: "c6", label: "Connect-6 (C6)", color: "gradient-sunset" },
  { id: "trm", label: "Theme Room (TRm)", color: "gradient-warmth" },
  { id: "tz", label: "Time Zone (TZ)", color: "gradient-palace" },
  { id: "prm", label: "Patterns Room (PRm)", color: "gradient-ocean" },
  { id: "p||", label: "Parallels Room (P‖)", color: "gradient-royal" },
  { id: "frt", label: "Fruit Room (FRt)", color: "gradient-sunset" },
  { id: "cec", label: "Christ in Every Chapter (CEC)", color: "gradient-warmth" },
  { id: "r66", label: "Room 66 (R66)", color: "gradient-palace" },
  
  // Floor 5 - Vision (Prophecy & Sanctuary)
  { id: "bl", label: "Blue Room - Sanctuary (BL)", color: "gradient-ocean" },
  { id: "pr", label: "Prophecy Room (PR)", color: "gradient-royal" },
  { id: "3a", label: "Three Angels (3A)", color: "gradient-sunset" },
  { id: "fe", label: "Feasts Room (FE)", color: "gradient-warmth" },
  
  // Floor 6 - Three Heavens (Cycles & Cosmic Context)
  { id: "1h", label: "First Heaven (1H) - DoL¹/NE¹", color: "gradient-palace" },
  { id: "2h", label: "Second Heaven (2H) - DoL²/NE²", color: "gradient-ocean" },
  { id: "3h", label: "Third Heaven (3H) - DoL³/NE³", color: "gradient-royal" },
  { id: "ad", label: "Adamic Cycle (@Ad)", color: "gradient-sunset" },
  { id: "no", label: "Noahic Cycle (@No)", color: "gradient-warmth" },
  { id: "ab", label: "Abrahamic Cycle (@Ab)", color: "gradient-palace" },
  { id: "mo", label: "Mosaic Cycle (@Mo)", color: "gradient-ocean" },
  { id: "cy", label: "Cyrusic Cycle (@Cy)", color: "gradient-royal" },
  { id: "cyc", label: "Cyrus-Christ Cycle (@CyC)", color: "gradient-sunset" },
  { id: "sp", label: "Holy Spirit Cycle (@Sp)", color: "gradient-warmth" },
  { id: "re", label: "Remnant Cycle (@Re)", color: "gradient-palace" },
  // Note: Juice Room (JR) intentionally excluded - only for whole books, not verses
  
  // Time Zones (Six Zones)
  { id: "heaven-past", label: "Heaven-Past", color: "gradient-sunset" },
  { id: "heaven-now", label: "Heaven-Now", color: "gradient-warmth" },
  { id: "heaven-future", label: "Heaven-Future", color: "gradient-palace" },
  { id: "earth-past", label: "Earth-Past", color: "gradient-ocean" },
  { id: "earth-now", label: "Earth-Now", color: "gradient-royal" },
  { id: "earth-future", label: "Earth-Future", color: "gradient-sunset" },
  
  // Sanctuary Articles
  { id: "gate", label: "Gate", color: "gradient-warmth" },
  { id: "altar", label: "Altar of Sacrifice", color: "gradient-palace" },
  { id: "laver", label: "Laver", color: "gradient-ocean" },
  { id: "lampstand", label: "Golden Lampstand", color: "gradient-royal" },
  { id: "table", label: "Table of Shewbread", color: "gradient-sunset" },
  { id: "incense", label: "Altar of Incense", color: "gradient-warmth" },
  { id: "veil", label: "Veil", color: "gradient-palace" },
  { id: "ark", label: "Ark of the Covenant", color: "gradient-ocean" },
  
  // Feasts
  { id: "passover", label: "Passover", color: "gradient-royal" },
  { id: "unleavened-bread", label: "Unleavened Bread", color: "gradient-sunset" },
  { id: "firstfruits", label: "Firstfruits", color: "gradient-warmth" },
  { id: "pentecost", label: "Pentecost", color: "gradient-palace" },
  { id: "trumpets", label: "Trumpets", color: "gradient-ocean" },
  { id: "atonement", label: "Day of Atonement", color: "gradient-royal" },
  { id: "tabernacles", label: "Feast of Tabernacles", color: "gradient-sunset" },
  
  // Walls (Theme Room Structure)
  { id: "sanctuary-wall", label: "Sanctuary Wall", color: "gradient-warmth" },
  { id: "life-of-christ-wall", label: "Life of Christ Wall", color: "gradient-palace" },
  { id: "great-controversy-wall", label: "Great Controversy Wall", color: "gradient-ocean" },
  { id: "time-prophecy-wall", label: "Time Prophecy Wall", color: "gradient-royal" },
  
  // Floor 7 - Spiritual & Emotional (Transformation)
  { id: "frm", label: "Fire Room (FRm)", color: "gradient-royal" },
  { id: "mr", label: "Meditation Room (MR)", color: "gradient-sunset" },
  { id: "srm", label: "Speed Room (SRm)", color: "gradient-warmth" },
  
  // Expansions
  { id: "exp-w", label: "Width Expansion (Exp-W)", color: "gradient-palace" },
  { id: "exp-t", label: "Time Expansion (Exp-T)", color: "gradient-ocean" },
  { id: "exp-d", label: "Depth Expansion (Exp-D)", color: "gradient-royal" },
  { id: "exp-h", label: "Height Expansion (Exp-H)", color: "gradient-sunset" },
  
  // Ascensions
  { id: "asc-1", label: "Text Ascension (Asc-1)", color: "gradient-warmth" },
  { id: "asc-2", label: "Chapter Ascension (Asc-2)", color: "gradient-palace" },
  { id: "asc-3", label: "Book Ascension (Asc-3)", color: "gradient-ocean" },
  { id: "asc-4", label: "Cycle Ascension (Asc-4)", color: "gradient-royal" },
  { id: "asc-5", label: "Heaven Ascension (Asc-5)", color: "gradient-sunset" },
];

const COMMENTARY_OPTIONS = [
  { value: "clarke", label: "Adam Clarke's Commentary" },
  { value: "barnes", label: "Albert Barnes' Notes" },
  { value: "gill", label: "John Gill's Exposition" },
  { value: "henry", label: "Matthew Henry's Concise" },
  { value: "jfb", label: "Jamieson-Fausset-Brown" },
  { value: "keil-delitzsch", label: "Keil & Delitzsch (OT)" },
  { value: "wesley", label: "John Wesley's Notes" },
  { value: "pulpit", label: "The Pulpit Commentary" },
  { value: "cambridge", label: "Cambridge Bible for Schools" },
  { value: "ellicott", label: "Ellicott's Commentary" },
  { value: "benson", label: "Benson Commentary" },
  { value: "sop", label: "Spirit of Prophecy (SOP)" },
];

interface CommentaryPanelProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  onClose: () => void;
}

export const CommentaryPanel = ({ book, chapter, verse, verseText, onClose }: CommentaryPanelProps) => {
  const [selectedPrinciples, setSelectedPrinciples] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentary, setCommentary] = useState<string | null>(null);
  const [usedPrinciples, setUsedPrinciples] = useState<string[]>([]);
  const [analysisMode, setAnalysisMode] = useState<"revealed" | "applied">("applied");
  const [selectedCommentary, setSelectedCommentary] = useState<string>("clarke");
  const [commentaryMode, setCommentaryMode] = useState(false);
  const [availableCommentaries, setAvailableCommentaries] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(true);
  const [activeDimensions, setActiveDimensions] = useState<string[]>(["2D"]); // Default to Christ dimension
  const { toast } = useToast();

  // Check which commentaries are available for this specific verse
  useEffect(() => {
    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "check-commentary-availability",
            book,
            chapter,
            verseText: { verse, text: verseText },
          },
        });

        if (error) throw error;
        setAvailableCommentaries(data.available || []);
      } catch (error) {
        console.error("Error checking commentary availability:", error);
        // Default to all if check fails
        setAvailableCommentaries(COMMENTARY_OPTIONS.map(c => c.value));
      } finally {
        setCheckingAvailability(false);
      }
    };
    
    checkAvailability();
  }, [book, chapter, verse, verseText]);

  const togglePrinciple = (id: string) => {
    setSelectedPrinciples(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const generateCommentary = async (refresh = false, useClassicCommentary = false) => {
    if (analysisMode === "applied" && selectedPrinciples.length === 0 && !refresh && !useClassicCommentary) {
      toast({
        title: "Select Principles",
        description: "Please select at least one principle for applied analysis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setCommentaryMode(useClassicCommentary);
    try {
      // Determine the correct mode
      let mode = analysisMode === "revealed" ? "commentary-revealed" : "commentary-applied";
      if (useClassicCommentary) {
        mode = selectedCommentary === "sop" ? "commentary-sop" : "commentary-classic";
      }

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode,
          book,
          chapter,
          verseText: { verse, text: verseText },
          selectedPrinciples: (analysisMode === "applied" && !refresh && !useClassicCommentary) 
            ? selectedPrinciples.map(id => PRINCIPLE_OPTIONS.find(p => p.id === id)?.label)
            : undefined,
          classicCommentary: useClassicCommentary && selectedCommentary !== "sop" ? selectedCommentary : undefined,
        },
      });

      if (error) throw error;
      setCommentary(data.content);
      setUsedPrinciples(data.principlesUsed || []);
    } catch (error: any) {
      console.error("Commentary error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate commentary",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant animate-scale-in">
      <CardHeader className="gradient-ocean text-white">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Jeeves Commentary
            </CardTitle>
            <CardDescription className="text-white/90">
              {book} {chapter}:{verse}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Dimension Filter */}
          <DimensionFilter
            activeDimensions={activeDimensions}
            onToggle={(dim) => {
              setActiveDimensions(prev =>
                prev.includes(dim) ? prev.filter(d => d !== dim) : [...prev, dim]
              );
            }}
          />
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Analysis Mode:</h4>
            <div className="flex gap-2 mb-4">
              <Button
                variant={analysisMode === "revealed" ? "default" : "outline"}
                onClick={() => {
                  setAnalysisMode("revealed");
                  setCommentary(null);
                }}
                className="flex-1"
              >
                Revealed Principles
              </Button>
              <Button
                variant={analysisMode === "applied" ? "default" : "outline"}
                onClick={() => {
                  setAnalysisMode("applied");
                  setCommentary(null);
                }}
                className="flex-1"
              >
                Applied Principles
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {analysisMode === "revealed" 
                ? "Identify which principles and dimensions are revealed in this text" 
                : "Select principles to apply to this verse, or let AI randomly select"}
            </p>
          </div>

          {analysisMode === "applied" && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Select Analysis Lenses:</h4>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2 pr-4">
                  {PRINCIPLE_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-border hover:border-primary cursor-pointer transition-all hover-lift"
                    >
                      <Checkbox
                        checked={selectedPrinciples.includes(option.id)}
                        onCheckedChange={() => togglePrinciple(option.id)}
                      />
                      <Badge className={`${option.color} text-white shadow-sm text-xs`}>
                        {option.label}
                      </Badge>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex gap-2">
              <Button
                onClick={() => generateCommentary(false, false)}
                disabled={loading || (analysisMode === "applied" && selectedPrinciples.length === 0)}
                className="flex-1 gradient-royal text-white shadow-blue"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {analysisMode === "revealed" ? "Analyze" : "Generate"}
                  </>
                )}
              </Button>
              
              {commentary && !commentaryMode && (
                <Button
                  onClick={() => generateCommentary(true, false)}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {analysisMode === "revealed" ? "Re-analyze" : "Random Refresh"}
                </Button>
              )}
            </div>

            <div className="border-t pt-3">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Classic Commentaries
                {checkingAvailability && (
                  <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                )}
              </h4>
              <div className="flex gap-2">
                <Select value={selectedCommentary} onValueChange={setSelectedCommentary}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a commentary" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMENTARY_OPTIONS.map((option) => {
                      const isAvailable = availableCommentaries.includes(option.value);
                      return (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          disabled={loading}
                          className="font-semibold"
                        >
                          {option.label}
                          {!checkingAvailability && (
                            <span className="ml-2">
                              {isAvailable ? "✓" : "—"}
                            </span>
                          )}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => generateCommentary(false, true)}
                  disabled={loading}
                  variant="outline"
                  className="whitespace-nowrap"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4 mr-2" />
                  )}
                  Load
                </Button>
              </div>
            </div>
          </div>
        </div>

        {commentary && (
          <ScrollArea className="h-[500px] mt-4">
            <div className="p-6 rounded-lg bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-2 border-primary/20 shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span className="font-bold text-lg bg-gradient-palace bg-clip-text text-transparent">Room Insights</span>
                </div>
                {usedPrinciples.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {usedPrinciples.map((principle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs gradient-palace text-white">
                        {principle}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {parseRoomInsights(commentary).map((room, idx) => (
                  <RoomInsightChat
                    key={idx}
                    roomCode={room.code}
                    roomName={room.name}
                    roomContent={room.content}
                    book={book}
                    chapter={chapter}
                    verse={verse}
                    verseText={verseText}
                  />
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
