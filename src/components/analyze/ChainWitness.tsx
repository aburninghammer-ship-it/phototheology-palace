import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Loader2, ChevronDown, ChevronUp, BookOpen, Sparkles, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ChainWitnessProps {
  userThought: string;
  disabled?: boolean;
}

interface ScriptureVerse {
  reference: string;
  text: string;
  connection?: string;
  ptCodes?: string[];
}

export const ChainWitness = ({ userThought, disabled }: ChainWitnessProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [verses, setVerses] = useState<ScriptureVerse[]>([]);
  const [chainDepth, setChainDepth] = useState<"short" | "full">("short");
  const [expandedVerse, setExpandedVerse] = useState<number | null>(null);

  const generateChain = async () => {
    if (!userThought.trim()) {
      toast.error("Please enter your thoughts first");
      return;
    }

    setIsLoading(true);
    setIsExpanded(true);
    setExpandedVerse(null);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "chain-witness",
          message: userThought,
          chainDepth,
        },
      });

      if (error) throw error;

      if (data?.verses && Array.isArray(data.verses)) {
        setVerses(data.verses);
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Chain witness error:", error);
      toast.error("Failed to generate Scripture chain");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVerseExpansion = (index: number) => {
    setExpandedVerse(expandedVerse === index ? null : index);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-amber-500/20">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Link2 className="h-4 w-4 text-amber-400" />
              <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Chain Witness
              </span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Chain Depth Toggle */}
              <div className="flex items-center gap-1 bg-background/50 rounded-full p-0.5">
                <button
                  onClick={() => setChainDepth("short")}
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    chainDepth === "short"
                      ? "bg-amber-500/30 text-amber-300"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  5
                </button>
                <button
                  onClick={() => setChainDepth("full")}
                  className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                    chainDepth === "full"
                      ? "bg-amber-500/30 text-amber-300"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  9
                </button>
              </div>
              <Button
                onClick={generateChain}
                disabled={disabled || isLoading || !userThought.trim()}
                size="sm"
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30"
              >
                {isLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate
                  </>
                )}
              </Button>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Scripture that supports, echoes, or reinforces your ideas
          </p>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
                    <p className="text-sm text-muted-foreground">
                      Gathering witnesses...
                    </p>
                  </div>
                </motion.div>
              ) : verses.length > 0 ? (
                <motion.div
                  key="verses"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {verses.map((verse, index) => (
                        <motion.div
                          key={`${verse.reference}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/30 border border-amber-500/10 hover:border-amber-500/30 transition-colors">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center mt-0.5">
                              <BookOpen className="h-3 w-3 text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge
                                  variant="outline"
                                  className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs"
                                >
                                  {verse.reference}
                                </Badge>
                                {verse.ptCodes && verse.ptCodes.length > 0 && (
                                  <div className="flex gap-1 flex-wrap">
                                    {verse.ptCodes.map((code, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {code}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-foreground/90 leading-relaxed italic">
                                "{verse.text}"
                              </p>
                              
                              {/* Connection explanation toggle */}
                              {verse.connection && (
                                <div className="mt-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleVerseExpansion(index)}
                                    className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                  >
                                    <Info className="h-3 w-3 mr-1" />
                                    {expandedVerse === index ? "Hide Connection" : "How This Connects"}
                                    {expandedVerse === index ? (
                                      <ChevronUp className="h-3 w-3 ml-1" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    )}
                                  </Button>
                                  
                                  <AnimatePresence>
                                    {expandedVerse === index && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="mt-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                                          <p className="text-sm text-foreground/80 leading-relaxed">
                                            {verse.connection}
                                          </p>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                          {index < verses.length - 1 && (
                            <div className="flex justify-center py-1">
                              <div className="w-px h-4 bg-amber-500/30" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                  <p className="text-xs text-muted-foreground/60 text-center mt-4 italic">
                    "In the mouth of two or three witnesses every word shall be established."
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-6"
                >
                  <BookOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click "Generate" to find supporting Scripture
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
