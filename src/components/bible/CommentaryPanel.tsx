import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MessageSquare, Sparkles, X, BookOpen, Crown, RefreshCw, Download } from "lucide-react";
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

// Check if verse text is too short for deep analysis
const isVerseTooShort = (text: string): boolean => {
  const wordCount = text.trim().split(/\s+/).length;
  return wordCount < 4; // Less than 4 words is too short
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
  { id: "st", label: "Symbols/Types Room (ST)", color: "gradient-sunset" },
  { id: "qr", label: "Questions Room (QR)", color: "gradient-warmth" },
  { id: "qa", label: "Q&A Chains Room (QA)", color: "gradient-palace" },
  
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
  { id: "jr", label: "Juice Room (JR)", color: "gradient-royal" },
  
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
  // SDA Commentaries
  { value: "sop", label: "Spirit of Prophecy (EGW)" },
  { value: "sdabc", label: "SDA Bible Commentary" },
  { value: "uriah-smith", label: "Uriah Smith (Daniel & Revelation)" },
  { value: "jn-andrews", label: "J.N. Andrews (Prophecy)" },
  // Classic Commentaries
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
];

const WORD_LENGTH_OPTIONS = [
  { value: "short", label: "Short (~250 words)", maxWords: 250 },
  { value: "medium", label: "Medium (~450 words)", maxWords: 450 },
  { value: "long", label: "Long (~650 words)", maxWords: 650 },
];

const COMMENTARY_DEPTH_OPTIONS = [
  {
    value: "surface",
    label: "Surface",
    description: "Quick overview - key themes and basic meaning",
    icon: "📖",
    color: "bg-blue-500"
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Balanced analysis with context and application",
    icon: "📚",
    color: "bg-purple-500"
  },
  {
    value: "depth",
    label: "Deep Analysis",
    description: "Comprehensive study with Greek/Hebrew, cross-references, and theological depth",
    icon: "🔬",
    color: "bg-amber-500"
  },
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
  const [analysisMode, setAnalysisMode] = useState<"revealed" | "applied" | "deep-palace">("applied");
  const [selectedCommentary, setSelectedCommentary] = useState<string>("clarke");
  const [commentaryMode, setCommentaryMode] = useState(false);
  const [availableCommentaries, setAvailableCommentaries] = useState<string[]>([]);
  const [checkingAvailability, setCheckingAvailability] = useState(true);
  const [activeDimensions, setActiveDimensions] = useState<string[]>(["2D"]); // Default to Christ dimension
  const [deepPalaceLength, setDeepPalaceLength] = useState<string>("medium");
  const [showHiddenStructure, setShowHiddenStructure] = useState(false);
  const [commentaryDepth, setCommentaryDepth] = useState<"surface" | "intermediate" | "depth">("intermediate");
  const { toast } = useToast();

  // Check which commentaries are available for this specific verse
  useEffect(() => {
    const checkAvailability = async () => {
      setCheckingAvailability(true);
      try {
        console.log("[Commentary] Checking availability for", book, chapter, ":", verse);

        // Add timeout for availability check
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Availability check timed out")), 15000)
        );

        const fetchPromise = supabase.functions.invoke("jeeves", {
          body: {
            mode: "check-commentary-availability",
            book,
            chapter,
            verseText: { verse, text: verseText },
          },
        });

        const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

        if (error) {
          console.warn("[Commentary] Availability check error:", error);
          throw error;
        }

        console.log("[Commentary] Available commentaries:", data.available);
        setAvailableCommentaries(data.available || []);
      } catch (error) {
        console.error("[Commentary] Error checking commentary availability:", error);
        // If check fails, show empty array - don't show misleading checkmarks
        // Users can still try any commentary, it just won't have a ✓ indicator
        setAvailableCommentaries([]);
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

    // Failsafe: Check if verse is too short for Deep Palace mode
    if (analysisMode === "deep-palace" && isVerseTooShort(verseText)) {
      toast({
        title: "Verse Too Short",
        description: "Deep Palace Commentary requires a verse with adequate narrative or doctrinal components. Please choose a longer verse.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setCommentaryMode(useClassicCommentary);
    try {
      // Determine the correct mode
      let mode = analysisMode === "revealed" ? "commentary-revealed" : "commentary-applied";
      if (analysisMode === "deep-palace") {
        mode = "deep-palace-commentary";
      }
      if (useClassicCommentary) {
        // SDA commentaries have their own modes
        const sdaCommentaryModes: Record<string, string> = {
          "sop": "commentary-sop",
          "sdabc": "commentary-sdabc",
          "uriah-smith": "commentary-uriah-smith",
          "jn-andrews": "commentary-jn-andrews",
        };
        mode = sdaCommentaryModes[selectedCommentary] || "commentary-classic";
      }

      const lengthConfig = WORD_LENGTH_OPTIONS.find(l => l.value === deepPalaceLength);

      console.log("[Commentary] Calling Jeeves with mode:", mode);

      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      try {
        const { data, error } = await supabase.functions.invoke("jeeves", {
          body: {
            mode,
            book,
            chapter,
            verseText: { verse, text: verseText },
            selectedPrinciples: (analysisMode === "applied" && !refresh && !useClassicCommentary)
              ? selectedPrinciples.map(id => PRINCIPLE_OPTIONS.find(p => p.id === id)?.label)
              : undefined,
            classicCommentary: useClassicCommentary && !["sop", "sdabc", "uriah-smith", "jn-andrews"].includes(selectedCommentary) ? selectedCommentary : undefined,
            // Commentary depth level
            commentaryDepth,
            // Deep Palace specific options
            maxWords: analysisMode === "deep-palace" ? lengthConfig?.maxWords : undefined,
            showHiddenStructure: analysisMode === "deep-palace" ? showHiddenStructure : undefined,
            // 5-Dimension Filter - pass active dimensions to filter commentary layers
            activeDimensions: activeDimensions.length > 0 ? activeDimensions : undefined,
          },
        });

        clearTimeout(timeoutId);

        if (error) {
          console.error("[Commentary] Jeeves error:", error);
          throw new Error(error.message || "Jeeves service error");
        }

        if (!data) {
          throw new Error("No response from commentary service");
        }

        if (!data.content) {
          console.warn("[Commentary] Empty content in response:", data);
          throw new Error("Commentary service returned empty content");
        }

        console.log("[Commentary] Success - received", data.content.length, "characters");
        setCommentary(data.content);
        setUsedPrinciples(data.principlesUsed || []);
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          throw new Error("Request timed out - please try again");
        }
        throw fetchError;
      }
    } catch (error: any) {
      console.error("[Commentary] Error:", error);

      // Try fallback: Load from pre-generated database cache
      try {
        console.log("[Commentary] Trying database fallback...");
        const { data: cachedCommentary } = await supabase
          .from("bible_commentaries")
          .select("commentary_text")
          .eq("book", book)
          .eq("chapter", chapter)
          .eq("verse", verse)
          .maybeSingle();

        if (cachedCommentary?.commentary_text) {
          console.log("[Commentary] Found cached commentary in database");
          setCommentary(cachedCommentary.commentary_text);
          setUsedPrinciples([]);
          toast({
            title: "Loaded Cached Commentary",
            description: "Using pre-generated commentary (AI service temporarily unavailable)",
          });
          return;
        }
      } catch (cacheError) {
        console.error("[Commentary] Database fallback also failed:", cacheError);
      }

      // Provide more helpful error messages
      let errorMessage = "Failed to generate commentary";
      if (error.message?.includes("timeout") || error.message?.includes("timed out")) {
        errorMessage = "Request timed out - the server may be busy. Please try again.";
      } else if (error.message?.includes("rate limit")) {
        errorMessage = "Too many requests - please wait a moment and try again.";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Network error - please check your connection.";
      } else if (error.message?.includes("Edge Function")) {
        errorMessage = "AI service temporarily unavailable. Please try again in a few minutes.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Commentary Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="lg:sticky lg:top-24 shadow-elegant animate-scale-in lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
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

      <CardContent className="p-6">
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
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                variant={analysisMode === "revealed" ? "default" : "outline"}
                onClick={() => {
                  setAnalysisMode("revealed");
                  setCommentary(null);
                }}
                className="flex-1 min-w-[80px]"
                size="sm"
              >
                Revealed
              </Button>
              <Button
                variant={analysisMode === "applied" ? "default" : "outline"}
                onClick={() => {
                  setAnalysisMode("applied");
                  setCommentary(null);
                }}
                className="flex-1 min-w-[80px]"
                size="sm"
              >
                Applied
              </Button>
              <Button
                variant={analysisMode === "deep-palace" ? "default" : "outline"}
                onClick={() => {
                  setAnalysisMode("deep-palace");
                  setCommentary(null);
                }}
                className="flex-1 min-w-[80px] gradient-palace text-white"
                size="sm"
              >
                <Crown className="h-3 w-3 mr-1" />
                Deep Palace
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {analysisMode === "revealed"
                ? "Identify which principles and dimensions are revealed in this text"
                : analysisMode === "applied"
                ? "Select principles to apply to this verse, or let AI randomly select"
                : "Full Palace Commentary using 16+ principles (single verse only)"}
            </p>
          </div>

          {/* Commentary Depth Level */}
          <div className="p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Commentary Depth
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {COMMENTARY_DEPTH_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={commentaryDepth === option.value ? "default" : "outline"}
                  onClick={() => {
                    setCommentaryDepth(option.value as "surface" | "intermediate" | "depth");
                    setCommentary(null);
                  }}
                  className={`h-auto py-2 flex flex-col items-center gap-1 ${
                    commentaryDepth === option.value ? option.color + " text-white" : ""
                  }`}
                  size="sm"
                >
                  <span className="text-lg">{option.icon}</span>
                  <span className="text-xs font-medium">{option.label}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {COMMENTARY_DEPTH_OPTIONS.find(o => o.value === commentaryDepth)?.description}
            </p>
          </div>

          {/* Deep Palace Settings */}
          {analysisMode === "deep-palace" && (
            <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500/10 to-amber-500/10 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <Crown className="h-4 w-4" />
                Deep Palace Settings
              </div>
              
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Output Length:</label>
                <Select value={deepPalaceLength} onValueChange={setDeepPalaceLength}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WORD_LENGTH_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={showHiddenStructure}
                  onCheckedChange={(checked) => setShowHiddenStructure(!!checked)}
                />
                <span className="text-xs">Show Hidden Structure (reveal principles used)</span>
              </label>

              {isVerseTooShort(verseText) && (
                <p className="text-xs text-destructive">
                  ⚠️ This verse is too short for Deep Palace analysis. Please select a longer verse.
                </p>
              )}
            </div>
          )}

          {analysisMode === "applied" && (
            <div>
              <h4 className="text-sm font-semibold mb-3">Select Analysis Lenses:</h4>
              <ScrollArea className="max-h-[40vh]">
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
                disabled={
                  loading || 
                  (analysisMode === "applied" && selectedPrinciples.length === 0) ||
                  (analysisMode === "deep-palace" && isVerseTooShort(verseText))
                }
                className={`flex-1 ${analysisMode === "deep-palace" ? "gradient-palace" : "gradient-royal"} text-white shadow-blue`}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {analysisMode === "deep-palace" ? "Analyzing Palace..." : "Analyzing..."}
                  </>
                ) : (
                  <>
                    {analysisMode === "deep-palace" ? <Crown className="h-4 w-4 mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    {analysisMode === "revealed" ? "Analyze" : analysisMode === "deep-palace" ? "Deep Analyze" : "Generate"}
                  </>
                )}
              </Button>
              
              {commentary && !commentaryMode && (
                <Button
                  onClick={() => generateCommentary(true, false)}
                  disabled={loading || (analysisMode === "deep-palace" && isVerseTooShort(verseText))}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  {analysisMode === "deep-palace" ? "New Perspective" : analysisMode === "revealed" ? "Re-analyze" : "Random Refresh"}
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
              <div className="flex flex-col gap-2">
                <Select value={selectedCommentary} onValueChange={setSelectedCommentary}>
                  <SelectTrigger className="w-full min-w-0">
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
                  className="w-full whitespace-nowrap"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <BookOpen className="h-4 w-4 mr-2" />
                  )}
                  Load Commentary
                </Button>
              </div>
            </div>
          </div>
        </div>

        {commentary && (
          <ScrollArea className="max-h-[75vh] lg:max-h-[calc(100vh-14rem)] mt-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 dark:from-primary/5 dark:via-accent/5 dark:to-secondary/5 border-2 border-primary/30 dark:border-primary/20 shadow-lg">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-primary/10 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <span className="font-bold text-base bg-gradient-palace bg-clip-text text-transparent">Room Insights</span>
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

              <div className="space-y-6 break-words overflow-x-hidden">
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
