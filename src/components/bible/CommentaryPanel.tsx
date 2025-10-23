import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageSquare, Sparkles, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PRINCIPLE_OPTIONS = [
  // Floor 1 - Furnishing
  { id: "sr", label: "Story Room (SR)", color: "gradient-palace" },
  { id: "ir", label: "Imagination Room (IR)", color: "gradient-ocean" },
  { id: "24fps", label: "24FPS Room", color: "gradient-royal" },
  { id: "br", label: "Bible Rendered (BR)", color: "gradient-sunset" },
  { id: "tr", label: "Translation Room (TR)", color: "gradient-warmth" },
  { id: "gr", label: "Gems Room (GR)", color: "gradient-palace" },
  
  // Floor 2 - Investigation
  { id: "or", label: "Observation Room (OR)", color: "gradient-ocean" },
  { id: "dc", label: "Def-Com Room (DC)", color: "gradient-royal" },
  { id: "st", label: "Symbols/Types (ST)", color: "gradient-sunset" },
  { id: "qr", label: "Questions Room (QR)", color: "gradient-warmth" },
  { id: "qa", label: "Q&A Chains (QA)", color: "gradient-palace" },
  
  // Floor 3 - Freestyle
  { id: "nf", label: "Nature Freestyle (NF)", color: "gradient-ocean" },
  { id: "pf", label: "Personal Freestyle (PF)", color: "gradient-royal" },
  { id: "bf", label: "Bible Freestyle (BF)", color: "gradient-sunset" },
  { id: "hf", label: "History Freestyle (HF)", color: "gradient-warmth" },
  { id: "lr", label: "Listening Room (LR)", color: "gradient-palace" },
  
  // Floor 4 - Next Level
  { id: "cr", label: "Concentration Room (CR)", color: "gradient-ocean" },
  { id: "dr", label: "Dimensions Room (DR)", color: "gradient-royal" },
  { id: "c6", label: "Connect-6 (C6)", color: "gradient-sunset" },
  { id: "trm", label: "Theme Room (TRm)", color: "gradient-warmth" },
  { id: "tz", label: "Time Zone (TZ)", color: "gradient-palace" },
  { id: "prm", label: "Patterns Room (PRm)", color: "gradient-ocean" },
  { id: "p||", label: "Parallels Room (P‖)", color: "gradient-royal" },
  { id: "frt", label: "Fruit Room (FRt)", color: "gradient-sunset" },
  
  // Floor 5 - Vision
  { id: "bl", label: "Blue Room - Sanctuary (BL)", color: "gradient-warmth" },
  { id: "pr", label: "Prophecy Room (PR)", color: "gradient-palace" },
  { id: "3a", label: "Three Angels (3A)", color: "gradient-ocean" },
  { id: "fe", label: "Feasts Room (FE)", color: "gradient-royal" },
  { id: "cec", label: "Christ in Every Chapter (CEC)", color: "gradient-sunset" },
  { id: "r66", label: "Room 66 (R66)", color: "gradient-warmth" },
  
  // Floor 6 - Three Heavens & Cycles
  { id: "123h", label: "Three Heavens (1H/2H/3H)", color: "gradient-palace" },
  { id: "cycles", label: "Eight Cycles (@)", color: "gradient-ocean" },
  { id: "jr", label: "Juice Room (JR)", color: "gradient-royal" },
  
  // Floor 7 - Spiritual & Emotional
  { id: "frm", label: "Fire Room (FRm)", color: "gradient-sunset" },
  { id: "mr", label: "Meditation Room (MR)", color: "gradient-warmth" },
  { id: "srm", label: "Speed Room (SRm)", color: "gradient-palace" },
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
  const { toast } = useToast();

  const togglePrinciple = (id: string) => {
    setSelectedPrinciples(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const generateCommentary = async (refresh = false, includeSOP = false) => {
    if (analysisMode === "applied" && selectedPrinciples.length === 0 && !refresh) {
      toast({
        title: "Select Principles",
        description: "Please select at least one principle for applied analysis",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: analysisMode === "revealed" ? "commentary-revealed" : "commentary-applied",
          book,
          chapter,
          verseText: { verse, text: verseText },
          selectedPrinciples: (analysisMode === "applied" && !refresh) 
            ? selectedPrinciples.map(id => PRINCIPLE_OPTIONS.find(p => p.id === id)?.label)
            : undefined,
          includeSOP: includeSOP,
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
            
            <Button
              onClick={() => generateCommentary(false, true)}
              disabled={loading || (analysisMode === "applied" && selectedPrinciples.length === 0)}
              variant="outline"
              className="flex-1"
              title="Include Spirit of Prophecy commentary"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              + SOP
            </Button>
            
            {commentary && (
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
        </div>

        {commentary && (
          <ScrollArea className="h-[400px] mt-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Jeeves says:</span>
                </div>
                {usedPrinciples.length > 0 && (
                  <div className="flex gap-1">
                    {usedPrinciples.map((principle, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {principle}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="prose prose-sm max-w-none text-foreground">
                {commentary.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
