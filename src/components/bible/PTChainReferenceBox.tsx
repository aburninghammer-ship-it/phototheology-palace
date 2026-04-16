import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Link2, ChevronDown, ChevronUp, Search, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { motion, AnimatePresence } from "framer-motion";

interface CrossReference {
  reference: string;
  relationship: string;
  confidence: number;
  note: string;
}

interface ChainReferenceResult {
  verse: number;
  reference: string;
  principle: string;
  ptCodes: string[];
  connection: string;
  crossReferences: CrossReference[];
  expounded: string;
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
  { value: "cycles", label: "PT Cycles (@Ad-@Re)" },
  { value: "horizons", label: "Three Heavens (1H-3H)" },
];

interface PTChainReferenceBoxProps {
  initialVerse?: string;
}

export const PTChainReferenceBox = ({ initialVerse }: PTChainReferenceBoxProps) => {
  const [verseInput, setVerseInput] = useState(initialVerse || "");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ChainReferenceResult[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedPrinciple, setSelectedPrinciple] = useState<string>("types");
  const { toast } = useToast();

  // Update verse input when initialVerse prop changes
  useEffect(() => {
    if (initialVerse) {
      setVerseInput(initialVerse);
    }
  }, [initialVerse]);

  const analyzeVerse = async () => {
    if (!verseInput.trim()) {
      toast({
        title: "Enter a Verse",
        description: "Please enter a verse reference (e.g., John 3:16)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResults([]);
    try {
      console.log("PT Chain Reference: Calling jeeves with", { 
        mode: "pt-chain-verse", 
        principle: selectedPrinciple, 
        verse: verseInput 
      });
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "pt-chain-verse",
          principle: selectedPrinciple,
          verseReference: verseInput.trim(),
        },
      });

      if (error) {
        console.error("PT Chain Reference API error:", error);
        throw error;
      }

      console.log("PT Chain Reference: Raw response", data);

      let parsedResults: ChainReferenceResult[] = [];
      try {
        const content = data?.content || "";
        console.log("PT Chain Reference: Content to parse", content);
        
        if (!content) {
          throw new Error("Empty response from Jeeves");
        }
        
        let cleanedContent = content
          .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '');
        
        const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          parsedResults = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON array found in response");
        }
      } catch (parseError) {
        console.error("PT Chain Reference: Failed to parse:", parseError);
        toast({
          title: "Parsing Error",
          description: "Failed to parse chain references. Try again.",
          variant: "destructive",
        });
        return;
      }

      if (parsedResults.length === 0) {
        toast({
          title: "No Connections Found",
          description: `No ${PRINCIPLES.find(p => p.value === selectedPrinciple)?.label} connections found for this verse.`,
        });
        return;
      }

      setResults(parsedResults);
      const principleLabel = PRINCIPLES.find(p => p.value === selectedPrinciple)?.label;
      toast({
        title: "Chain References Found",
        description: `Found ${parsedResults.length} ${principleLabel} connections`,
      });
    } catch (error: any) {
      console.error("PT Chain Reference error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to find chain references. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="gradient-palace text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          PT Chain Reference
        </CardTitle>
        <CardDescription className="text-white/90">
          Enter a verse and discover principle-based cross-references
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Verse Reference</label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., John 3:16 or Genesis 22:8"
              value={verseInput}
              onChange={(e) => setVerseInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeVerse()}
              className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select Principle Lens</label>
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
          onClick={analyzeVerse}
          disabled={loading || !verseInput.trim()}
          className="w-full gradient-royal text-white shadow-blue disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Finding Chain References...
            </>
          ) : !verseInput.trim() ? (
            <>
              <Search className="h-4 w-4 mr-2" />
              Enter a Verse Above to Search
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Find Chain References
            </>
          )}
        </Button>

        <ScrollArea className="h-[400px]">
          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className="gradient-palace text-white">
                        {result.reference}
                      </Badge>
                      {result.ptCodes && result.ptCodes.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {result.ptCodes.map((code, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {code}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-primary">
                      {result.principle}
                    </span>
                  </div>
                  
                  <p className="text-sm text-foreground leading-relaxed mb-3">
                    {result.connection}
                  </p>

                  {result.crossReferences && result.crossReferences.length > 0 && (
                    <div className="mb-3 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground mb-1">Cross References:</p>
                      {result.crossReferences.map((ref, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs">
                          <Badge variant="secondary" className="text-xs">
                            {ref.reference}
                          </Badge>
                          <div className="flex-1">
                            <span className="font-medium text-primary">{ref.relationship}</span>
                            <span className="text-muted-foreground"> ({ref.confidence}%)</span>
                            <p className="text-muted-foreground mt-0.5">{ref.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className="w-full justify-between hover:bg-primary/10"
                  >
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {expandedIndex === index ? "Hide Explanation" : "How This Connects"}
                    </span>
                    {expandedIndex === index ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>

                  <AnimatePresence>
                    {expandedIndex === index && result.expounded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t text-sm text-muted-foreground leading-relaxed">
                          {formatJeevesResponse(result.expounded)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Link2 className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p className="text-sm">
                Enter a verse reference and select a principle to discover 
                how Scripture witnesses to Scripture through PT principles
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
