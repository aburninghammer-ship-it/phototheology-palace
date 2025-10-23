import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Link2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Verse } from "@/types/bible";

interface ChainReferenceResult {
  verse: number;
  principle: string;
  connection: string;
  expounded: string;
}

interface ChainReferencePanelProps {
  book: string;
  chapter: number;
  verses: Verse[];
  onHighlight: (verseNumbers: number[]) => void;
}

const PRINCIPLES = [
  { value: "parables", label: "Parables of Jesus" },
  { value: "prophecy", label: "Prophecy Connections" },
  { value: "life-of-christ", label: "Life of Christ Wall" },
  { value: "70-weeks", label: "70 Week Connections" },
  { value: "2d", label: "2D Christ Dimension" },
  { value: "3d", label: "3D Kingdom Dimension" },
  { value: "sanctuary", label: "Sanctuary Principles" },
  { value: "feasts", label: "Feast Connections" },
  { value: "types", label: "Types & Shadows" },
  { value: "covenant", label: "Covenant Themes" },
];

export const ChainReferencePanel = ({ book, chapter, verses, onHighlight }: ChainReferencePanelProps) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ChainReferenceResult[]>([]);
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("parables");
  const { toast } = useToast();

  const analyzePrinciple = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-reference",
          principle: selectedPrinciple,
          book,
          chapter,
          verses: verses.map(v => ({ verse: v.verse, text: v.text })),
        },
      });

      if (error) throw error;

      // Parse the AI response to extract JSON
      let parsedResults: ChainReferenceResult[] = [];
      try {
        const content = data.content;
        // Try to extract JSON from markdown code blocks or plain text
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        toast({
          title: "Error",
          description: "Failed to parse principle connections",
          variant: "destructive",
        });
        return;
      }

      setResults(parsedResults);
      onHighlight(parsedResults.map(r => r.verse));

      const principleLabel = PRINCIPLES.find(p => p.value === selectedPrinciple)?.label;
      toast({
        title: "Analysis Complete",
        description: `Found ${parsedResults.length} ${principleLabel} connections`,
      });
    } catch (error: any) {
      console.error("Chain reference error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze principle",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-elegant">
      <CardHeader className="gradient-palace text-white">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Chain Reference Mode
        </CardTitle>
        <CardDescription className="text-white/90">
          Find principle connections in this chapter
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Principle to Analyze</label>
          <Select value={selectedPrinciple} onValueChange={setSelectedPrinciple}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a principle" />
            </SelectTrigger>
            <SelectContent>
              {PRINCIPLES.map((principle) => (
                <SelectItem key={principle.value} value={principle.value}>
                  {principle.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={analyzePrinciple}
          disabled={loading}
          className="w-full gradient-royal text-white shadow-blue"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing {PRINCIPLES.find(p => p.value === selectedPrinciple)?.label}...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Find Connections
            </>
          )}
        </Button>

        <ScrollArea className="h-[450px]">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result) => (
                <div
                  key={result.verse}
                  className="p-4 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="gradient-palace text-white">
                      Verse {result.verse}
                    </Badge>
                    <span className="text-sm font-semibold text-primary">
                      {result.principle}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed mb-3">
                    {result.connection}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedVerse(expandedVerse === result.verse ? null : result.verse)}
                    className="w-full justify-between"
                  >
                    <span className="text-xs font-semibold">Expound</span>
                    {expandedVerse === result.verse ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  {expandedVerse === result.verse && (
                    <div className="mt-3 pt-3 border-t text-sm text-muted-foreground leading-relaxed">
                      {result.expounded.split('\n\n').map((para, idx) => (
                        <p key={idx} className="mb-2">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Link2 className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">
                Select a principle and click "Find Connections" to discover how verses 
                in this chapter connect to that biblical principle
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
