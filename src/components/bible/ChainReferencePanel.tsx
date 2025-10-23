import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Link2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Verse } from "@/types/bible";

interface ChainReferenceResult {
  verse: number;
  parable: string;
  connection: string;
  expounded: string;
}

interface ChainReferencePanelProps {
  book: string;
  chapter: number;
  verses: Verse[];
  onHighlight: (verseNumbers: number[]) => void;
}

export const ChainReferencePanel = ({ book, chapter, verses, onHighlight }: ChainReferencePanelProps) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ChainReferenceResult[]>([]);
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);
  const { toast } = useToast();

  const analyzeParables = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-reference",
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
          description: "Failed to parse parable connections",
          variant: "destructive",
        });
        return;
      }

      setResults(parsedResults);
      onHighlight(parsedResults.map(r => r.verse));

      toast({
        title: "Analysis Complete",
        description: `Found ${parsedResults.length} parable connections`,
      });
    } catch (error: any) {
      console.error("Chain reference error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to analyze parables",
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
          Find parable connections in this chapter
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <Button
          onClick={analyzeParables}
          disabled={loading}
          className="w-full gradient-royal text-white shadow-blue mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing parables...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Find Parable Connections
            </>
          )}
        </Button>

        <ScrollArea className="h-[500px]">
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
                      {result.parable}
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
                Click "Find Parable Connections" to discover how verses in this chapter
                connect to Jesus's parables
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
