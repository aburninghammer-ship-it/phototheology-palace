import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, BookOpen, Sparkles, Link2, Bot, FileText, Building2, RefreshCw, Layers, Landmark, ArrowUpRight, Dna, Maximize2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { usePalaceData } from "@/hooks/usePalaceData";
import { cn } from "@/lib/utils";

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
      {/* Tab Navigation - Glassy */}
      <div className="bg-background/40 backdrop-blur-xl rounded-xl border border-white/10 p-2 shadow-lg shadow-palace-purple/5">
        <div className="grid grid-cols-3 gap-1">
          {TABS.slice(0, 3).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 mt-1">
          {TABS.slice(3, 6).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-1 mt-1">
          {TABS.slice(6, 9).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verse Reference - Glassy */}
      <div className="bg-background/30 backdrop-blur-xl rounded-xl border border-white/10 p-3 shadow-lg shadow-palace-blue/5">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
            {book} {chapter}:{verse}
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="text-sm italic text-muted-foreground line-clamp-3 font-serif">
          "{verseText}"
        </p>
      </div>

      {/* Content Area - Glassy with Glow */}
      <div className="bg-background/30 backdrop-blur-xl rounded-xl border border-white/10 p-3 shadow-lg shadow-palace-purple/10 ring-1 ring-inset ring-white/5">
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
            <p className="text-xs text-muted-foreground mb-2">Palace Rooms & Floors</p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {palaceFloors?.map((floor) => (
                <div key={floor.number} className="bg-background/40 rounded-lg p-2 border border-white/5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-[10px] bg-palace-purple/20 border-palace-purple/30">
                      Floor {floor.number}
                    </Badge>
                    <span className="text-xs font-medium">{floor.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {floor.rooms.map((room) => (
                      <Badge 
                        key={room.id} 
                        variant="secondary" 
                        className="text-[10px] cursor-pointer hover:bg-primary/20 transition-colors"
                      >
                        {room.tag} - {room.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "cycles" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">8 Redemptive Cycles</p>
            {["@Ad (Adamic)", "@No (Noahic)", "@Ab (Abrahamic)", "@Mo (Mosaic)", "@Cy (Cyrusic)", "@CyC (Cyrus-Christ)", "@Sp (Spirit)", "@Re (Remnant)"].map((cycle) => (
              <Badge key={cycle} variant="outline" className="mr-1 mb-1 text-xs bg-palace-teal/10 border-palace-teal/30">
                {cycle}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2">
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
                { label: "1H (DoL¹/NE¹)", desc: "Babylonian → Cyrusic Restoration" },
                { label: "2H (DoL²/NE²)", desc: "70 AD → New-Covenant Order" },
                { label: "3H (DoL³/NE³)", desc: "Final → Literal New Creation" },
              ].map((heaven) => (
                <div key={heaven.label} className="bg-background/40 rounded-lg p-2 border border-white/5">
                  <Badge variant="secondary" className="text-[10px] bg-palace-blue/20">{heaven.label}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">{heaven.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "sanct" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Sanctuary Blueprint</p>
            {["Altar", "Laver", "Table", "Lampstand", "Incense", "Ark", "Veil", "Gate"].map((item) => (
              <Badge key={item} variant="outline" className="mr-1 mb-1 text-xs bg-palace-orange/10 border-palace-orange/30">
                {item}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="w-full mt-2">
              <Landmark className="h-3.5 w-3.5 mr-2" />
              Analyze Sanctuary Connection
            </Button>
          </div>
        )}

        {activeTab === "5asc" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Five Ascensions</p>
            {["Asc-1: Text", "Asc-2: Chapter", "Asc-3: Book", "Asc-4: Cycle", "Asc-5: Heaven"].map((asc) => (
              <div key={asc} className="bg-background/40 rounded-lg p-2 border border-white/5">
                <span className="text-xs">{asc}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "links" && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Cross-References for {book} {chapter}:{verse}</p>
            <Button variant="outline" size="sm" className="w-full">
              <Link2 className="h-3.5 w-3.5 mr-2" />
              Find Cross-References
            </Button>
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
