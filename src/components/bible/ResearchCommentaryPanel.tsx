import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, BookOpen, Sparkles, Link2, Bot, FileText, Building2, RefreshCw, Layers, Landmark, ArrowUpRight, Dna, Maximize2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePalaceData } from "@/hooks/usePalaceData";
import { cn } from "@/lib/utils";

// Glowing box class helper
const glowBox = "bg-background/30 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg shadow-palace-purple/10 ring-1 ring-inset ring-white/5 ring-offset-1 ring-offset-palace-blue/5 hover:shadow-palace-blue/20 hover:border-palace-blue/30 transition-all duration-300";

interface ResearchCommentaryPanelProps {
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string;
  activeTab: string;
}

const TABS = [
  { id: "jeeves", label: "Jeeves", icon: Bot },
  { id: "links", label: "Links", icon: Link2 },
  { id: "genetics", label: "Genetics", icon: Dna },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "palace", label: "Palace", icon: Building2 },
  { id: "cycles", label: "Cycles", icon: RefreshCw },
  { id: "3h", label: "3H", icon: Layers },
  { id: "sanct", label: "Sanct.", icon: Landmark },
  { id: "5asc", label: "5Asc", icon: ArrowUpRight },
];

export const ResearchCommentaryPanel = ({
  book,
  chapter,
  verse,
  verseText,
}: ResearchCommentaryPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [commentary, setCommentary] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [activeTab, setActiveTab] = useState("jeeves");
  const { palaceFloors } = usePalaceData();
  
  // Palace room analysis state
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [palaceAnalysis, setPalaceAnalysis] = useState<string>("");
  const [palaceLoading, setPalaceLoading] = useState(false);

  // Cross-references state
  const [crossRefs, setCrossRefs] = useState<Array<{ reference: string; text: string; theme: string }>>([]);
  const [crossRefsLoading, setCrossRefsLoading] = useState(false);

  const toggleRoom = (roomTag: string) => {
    setSelectedRooms(prev => 
      prev.includes(roomTag) 
        ? prev.filter(r => r !== roomTag)
        : [...prev, roomTag]
    );
  };

  const analyzePalaceRooms = async () => {
    if (selectedRooms.length === 0) {
      toast.error("Select at least one room");
      return;
    }
    setPalaceLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("pt-verse-analysis", {
        body: { 
          book, chapter, verse, verseText, 
          rooms: selectedRooms, 
          analysisType: "palace" 
        }
      });
      if (error) throw error;
      setPalaceAnalysis(data.analysis || "No analysis available.");
      toast.success("Analysis complete");
    } catch (error) {
      console.error("Palace analysis error:", error);
      toast.error("Failed to analyze");
    } finally {
      setPalaceLoading(false);
    }
  };

  const fetchCommentary = async () => {
    if (!verse) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-jeeves-commentary", {
        body: { book, chapter, verse, verseText, commentaryLevel: "depth" }
      });

      if (error) throw error;
      setCommentary(data.commentary || "No commentary available.");
    } catch (error) {
      console.error("Failed to fetch commentary:", error);
      toast.error("Failed to load commentary");
    } finally {
      setLoading(false);
    }
  };

  const askQuestion = async () => {
    if (!question.trim() || !verse) return;

    const newHistory = [...chatHistory, { role: "user", content: question }];
    setChatHistory(newHistory);
    setQuestion("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves-verse-assistant", {
        body: { book, chapter, verse, verseText, question, conversationHistory: chatHistory }
      });

      if (error) throw error;
      setChatHistory([...newHistory, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Failed to ask Jeeves:", error);
      toast.error("Failed to get response");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cross-references for current verse
  const fetchCrossReferences = async () => {
    if (!verse || !verseText) return;

    setCrossRefsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "cross-references",
          book,
          chapter,
          verse,
          verseText,
          prompt: `Find 5-8 cross-references for ${book} ${chapter}:${verse}: "${verseText}". Return as JSON array with objects containing: reference (e.g. "Romans 8:28"), text (the verse text), theme (why it connects). Focus on thematic, linguistic, and theological connections.`
        }
      });

      if (error) throw error;

      // Parse the response - Jeeves should return JSON
      let refs = [];
      if (data?.response) {
        try {
          // Try to extract JSON from response
          const jsonMatch = data.response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            refs = JSON.parse(jsonMatch[0]);
          }
        } catch (parseErr) {
          // If JSON parsing fails, try to extract references manually
          console.log("Parsing cross-references from text response");
          const lines = data.response.split('\n').filter((l: string) => l.includes(':'));
          refs = lines.slice(0, 8).map((line: string) => {
            const match = line.match(/([1-3]?\s?[A-Za-z]+\s+\d+:\d+(?:-\d+)?)/);
            return {
              reference: match ? match[1] : line.substring(0, 30),
              text: line,
              theme: "Related passage"
            };
          });
        }
      }

      setCrossRefs(refs);
      if (refs.length > 0) {
        toast.success(`Found ${refs.length} cross-references`);
      } else {
        toast.info("No cross-references found");
      }
    } catch (error) {
      console.error("Failed to fetch cross-references:", error);
      toast.error("Failed to load cross-references");

      // Fallback - provide some common cross-references based on book
      const fallbackRefs = getFallbackCrossRefs(book, chapter, verse);
      setCrossRefs(fallbackRefs);
    } finally {
      setCrossRefsLoading(false);
    }
  };

  // Fallback cross-references for common verses
  const getFallbackCrossRefs = (book: string, chapter: number, verse: number) => {
    const key = `${book.toLowerCase()}-${chapter}-${verse}`;
    const crossRefData: Record<string, Array<{ reference: string; text: string; theme: string }>> = {
      "john-3-16": [
        { reference: "Romans 5:8", text: "But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.", theme: "God's love demonstrated" },
        { reference: "1 John 4:9", text: "In this was manifested the love of God toward us...", theme: "God's love manifested" },
        { reference: "Ephesians 2:4-5", text: "But God, who is rich in mercy, for his great love...", theme: "Rich in mercy" },
        { reference: "Romans 6:23", text: "For the wages of sin is death; but the gift of God is eternal life...", theme: "Gift of eternal life" },
      ],
      "genesis-1-1": [
        { reference: "John 1:1-3", text: "In the beginning was the Word, and the Word was with God...", theme: "The Word in creation" },
        { reference: "Colossians 1:16", text: "For by him were all things created...", theme: "Christ as Creator" },
        { reference: "Hebrews 11:3", text: "Through faith we understand that the worlds were framed by the word of God...", theme: "Creation by faith" },
        { reference: "Psalm 33:6", text: "By the word of the LORD were the heavens made...", theme: "Creation by God's word" },
      ],
    };
    return crossRefData[key] || [
      { reference: "2 Timothy 3:16", text: "All scripture is given by inspiration of God...", theme: "Scripture connection" },
      { reference: "Psalm 119:105", text: "Thy word is a lamp unto my feet, and a light unto my path.", theme: "Word as guide" },
    ];
  };

  if (!verse) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a verse to view commentary</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      {/* Verse Reference - Glowing Box */}
      <div className={cn(glowBox, "p-3")}>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-gradient-palace text-white border-0 shadow-md shadow-palace-purple/20">
            {book} {chapter}:{verse}
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-palace-blue/20">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-sm italic text-muted-foreground line-clamp-3 font-serif">
          "{verseText}"
        </p>
      </div>

      {/* Content Area - Glowing Box */}
      <div className={cn(glowBox, "p-3")}>
        {activeTab === "jeeves" && (
          <div className="space-y-3">
            {chatHistory.length > 0 && (
              <div className="space-y-2 max-h-[250px] overflow-y-auto">
                {chatHistory.map((msg, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "p-2.5 rounded-lg text-sm",
                      msg.role === "user" 
                        ? "bg-primary/10 ml-4 border border-primary/20" 
                        : "bg-muted/50 mr-4 border border-white/5"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1 mb-1 text-xs text-primary">
                        <Bot className="h-3 w-3" />
                        Jeeves
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}

            {!chatHistory.length && (
              <>
                {commentary ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{commentary}</p>
                  </div>
                ) : (
                  <Button onClick={fetchCommentary} disabled={loading} className="w-full" variant="outline">
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Bot className="h-4 w-4 mr-2" />}
                    Generate Jeeves Commentary
                  </Button>
                )}
              </>
            )}

            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask Jeeves about this verse..."
                className="flex-1 text-sm bg-background/50 border-white/10"
                onKeyDown={(e) => e.key === "Enter" && askQuestion()}
              />
              <Button size="icon" onClick={askQuestion} disabled={loading || !question.trim()}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {activeTab === "palace" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Select rooms to analyze · {selectedRooms.length} selected</p>
              {selectedRooms.length > 0 && (
                <button onClick={() => setSelectedRooms([])} className="text-[10px] text-palace-teal hover:underline">Clear</button>
              )}
            </div>
            
            {/* Palace Analysis Result */}
            {palaceAnalysis && (
              <div className={cn(glowBox, "p-3 max-h-[200px] overflow-y-auto")}>
                <p className="text-xs font-semibold text-primary mb-1.5">Analysis Result</p>
                <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">{palaceAnalysis}</p>
              </div>
            )}
            
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
              {palaceFloors?.map((floor) => (
                <div key={floor.number} className={cn(glowBox, "p-2.5")}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-[10px] bg-gradient-palace text-white border-0 shadow-sm shadow-palace-purple/30">
                      F{floor.number}
                    </Badge>
                    <span className="text-xs font-semibold text-foreground">{floor.name}</span>
                    <span className="text-[10px] text-muted-foreground">· {floor.subtitle}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {floor.rooms.map((room) => {
                      const isSelected = selectedRooms.includes(room.tag);
                      return (
                        <button 
                          key={room.id} 
                          onClick={() => toggleRoom(room.tag)}
                          className={cn(
                            "flex items-center gap-1.5 p-1.5 rounded-md cursor-pointer transition-all duration-200 border text-left",
                            isSelected 
                              ? "bg-palace-blue/20 border-palace-blue/40 shadow-sm shadow-palace-blue/20 ring-1 ring-palace-blue/30" 
                              : "bg-background/50 border-white/5 hover:bg-primary/10 hover:border-primary/20"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-palace-teal shrink-0" />}
                          <Badge variant="outline" className={cn(
                            "text-[9px] px-1 py-0 font-mono",
                            isSelected ? "bg-palace-blue/30 border-palace-blue/50" : "bg-palace-blue/10 border-palace-blue/20"
                          )}>
                            {room.tag}
                          </Badge>
                          <span className="text-[10px] text-foreground truncate">{room.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 bg-gradient-palace text-white border-0 hover:opacity-90 shadow-md shadow-palace-purple/30"
              onClick={analyzePalaceRooms}
              disabled={palaceLoading || selectedRooms.length === 0}
            >
              {palaceLoading ? <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" /> : <Building2 className="h-3.5 w-3.5 mr-2" />}
              Analyze {selectedRooms.length > 0 ? `${selectedRooms.length} Rooms` : "with Palace Principles"}
            </Button>
          </div>
        )}

        {activeTab === "cycles" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">8 Redemptive Cycles</p>
            <div className="flex flex-wrap gap-1.5">
              {["@Ad (Adamic)", "@No (Noahic)", "@Ab (Abrahamic)", "@Mo (Mosaic)", "@Cy (Cyrusic)", "@CyC (Cyrus-Christ)", "@Sp (Spirit)", "@Re (Remnant)"].map((cycle) => (
                <Badge key={cycle} variant="outline" className="text-xs bg-palace-teal/15 border-palace-teal/40 shadow-sm shadow-palace-teal/20 hover:bg-palace-teal/25 cursor-pointer transition-colors">
                  {cycle}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 shadow-sm shadow-palace-teal/20 hover:shadow-palace-teal/40 border-palace-teal/30">
              <RefreshCw className="h-3.5 w-3.5 mr-2" />
              Map to Cycles
            </Button>
          </div>
        )}

        {activeTab === "3h" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Three Heavens Framework</p>
            <div className="space-y-1.5">
              {[
                { label: "1H (DoL¹/NE¹)", desc: "Babylonian → Cyrusic Restoration", color: "palace-purple" },
                { label: "2H (DoL²/NE²)", desc: "70 AD → New-Covenant Order", color: "palace-blue" },
                { label: "3H (DoL³/NE³)", desc: "Final → Literal New Creation", color: "palace-teal" },
              ].map((heaven) => (
                <div key={heaven.label} className={cn(glowBox, "p-2.5 cursor-pointer")}>
                  <Badge variant="secondary" className="text-[10px] bg-gradient-palace text-white border-0">{heaven.label}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">{heaven.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sanct" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Sanctuary Blueprint</p>
            <div className="flex flex-wrap gap-1.5">
              {["Altar", "Laver", "Table", "Lampstand", "Incense", "Ark", "Veil", "Gate"].map((item) => (
                <Badge key={item} variant="outline" className="text-xs bg-palace-orange/15 border-palace-orange/40 shadow-sm shadow-palace-orange/20 hover:bg-palace-orange/25 cursor-pointer transition-colors">
                  {item}
                </Badge>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-2 shadow-sm shadow-palace-orange/20 hover:shadow-palace-orange/40 border-palace-orange/30">
              <Landmark className="h-3.5 w-3.5 mr-2" />
              Analyze Sanctuary Connection
            </Button>
          </div>
        )}

        {activeTab === "5asc" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Five Ascensions</p>
            <div className="space-y-1.5">
              {[
                { asc: "Asc-1: Text", color: "purple" },
                { asc: "Asc-2: Chapter", color: "blue" },
                { asc: "Asc-3: Book", color: "teal" },
                { asc: "Asc-4: Cycle", color: "orange" },
                { asc: "Asc-5: Heaven", color: "pink" },
              ].map((item) => (
                <div key={item.asc} className={cn(glowBox, "p-2.5 cursor-pointer")}>
                  <span className="text-xs font-medium">{item.asc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Cross-References for {book} {chapter}:{verse}</p>
              {crossRefs.length > 0 && (
                <Badge variant="outline" className="text-[10px] bg-palace-blue/10 border-palace-blue/30">
                  {crossRefs.length} found
                </Badge>
              )}
            </div>

            {/* Cross-References List */}
            {crossRefs.length > 0 && (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {crossRefs.map((ref, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      glowBox,
                      "p-3 cursor-pointer hover:border-palace-blue/40 transition-all"
                    )}
                    onClick={() => {
                      // Could navigate to this reference
                      toast.info(`View ${ref.reference}`);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge className="text-xs bg-gradient-palace text-white border-0 shadow-sm">
                        {ref.reference}
                      </Badge>
                      <span className="text-[10px] text-palace-teal">{ref.theme}</span>
                    </div>
                    <p className="text-xs text-foreground/80 italic line-clamp-2 font-serif">
                      "{ref.text}"
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Loading State */}
            {crossRefsLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-palace-blue" />
                <span className="ml-2 text-sm text-muted-foreground">Finding cross-references...</span>
              </div>
            )}

            {/* Fetch Button */}
            {!crossRefsLoading && (
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-gradient-ocean text-white border-0 hover:opacity-90 shadow-md shadow-palace-blue/30"
                onClick={fetchCrossReferences}
              >
                <Link2 className="h-3.5 w-3.5 mr-2" />
                {crossRefs.length > 0 ? "Refresh Cross-References" : "Find Cross-References"}
              </Button>
            )}
          </div>
        )}

        {activeTab === "genetics" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Verse Genetics - Related verses</p>
            <Button variant="outline" size="sm" className="w-full">
              <Dna className="h-3.5 w-3.5 mr-2" />
              Analyze Verse Genetics
            </Button>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Personal Notes</p>
            <textarea 
              placeholder="Add your notes for this verse..."
              className="w-full h-24 text-sm bg-background/50 border border-white/10 rounded-lg p-2 resize-none"
            />
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="h-3.5 w-3.5 mr-2" />
              Save Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
