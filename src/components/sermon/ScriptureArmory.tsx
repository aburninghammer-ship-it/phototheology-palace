import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Swords, BookOpen, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { sanitizeHtml } from "@/lib/sanitize";

interface ScriptureArmoryProps {
  stones: string[];
  themePassage: string;
  armory: Record<number, ArmoryVerse[]>;
  setArmory: (armory: Record<number, ArmoryVerse[]>) => void;
}

export interface ArmoryVerse {
  reference: string;
  text: string;
  reason: string;
}

export const ScriptureArmory = ({ stones, themePassage, armory, setArmory }: ScriptureArmoryProps) => {
  const [loading, setLoading] = useState(false);
  const [loadingStone, setLoadingStone] = useState<number | null>(null);
  const [expandedStones, setExpandedStones] = useState<number[]>([]);
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);

  const generateArmoryForStone = async (stoneIndex: number) => {
    setLoadingStone(stoneIndex);
    try {
      const stoneText = stones[stoneIndex].replace(/<[^>]*>/g, '');
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "scripture-armory",
          stone: stoneText,
          themePassage: themePassage.replace(/<[^>]*>/g, ''),
          stoneNumber: stoneIndex + 1,
        },
      });

      if (error) throw error;

      if (data.verses && Array.isArray(data.verses)) {
        setArmory({
          ...armory,
          [stoneIndex]: data.verses,
        });
        setExpandedStones([...expandedStones, stoneIndex]);
        toast.success(`Scripture Armory loaded for Stone ${stoneIndex + 1}!`);
      }
    } catch (error) {
      console.error("Error generating armory:", error);
      toast.error("Failed to generate Scripture Armory");
    } finally {
      setLoadingStone(null);
    }
  };

  const generateAllArmory = async () => {
    setLoading(true);
    try {
      for (let i = 0; i < stones.length; i++) {
        if (!armory[i]) {
          await generateArmoryForStone(i);
        }
      }
      setExpandedStones(stones.map((_, i) => i));
      toast.success("Scripture Armory complete for all stones!");
    } catch (error) {
      console.error("Error generating full armory:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (index: number) => {
    if (expandedStones.includes(index)) {
      setExpandedStones(expandedStones.filter(i => i !== index));
    } else {
      setExpandedStones([...expandedStones, index]);
    }
  };

  const copyVerse = (reference: string, text: string) => {
    const copyText = `${reference} - "${text}"`;
    navigator.clipboard.writeText(copyText);
    setCopiedVerse(reference);
    setTimeout(() => setCopiedVerse(null), 2000);
    toast.success("Verse copied!");
  };

  if (stones.length === 0) {
    return (
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="py-6 text-center">
          <Swords className="w-12 h-12 mx-auto text-amber-400 mb-3" />
          <p className="text-amber-800">Add smooth stones first to build your Scripture Armory</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900">
          <Swords className="w-5 h-5" />
          Scripture Armory
        </CardTitle>
        <p className="text-sm text-amber-700">
          3-7 powerful backing verses for each of your smooth stones
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={generateAllArmory}
          disabled={loading || stones.length === 0}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Armory...
            </>
          ) : (
            <>
              <Swords className="mr-2 h-4 w-4" />
              Generate Full Armory
            </>
          )}
        </Button>

        <div className="space-y-3">
          {stones.map((stone, idx) => (
            <div key={idx} className="border border-amber-200 rounded-lg overflow-hidden bg-white/80">
              <div 
                className="p-3 cursor-pointer hover:bg-amber-50/50 transition-colors flex items-start justify-between gap-2"
                onClick={() => armory[idx] ? toggleExpanded(idx) : generateArmoryForStone(idx)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                      Stone {idx + 1}
                    </Badge>
                    {armory[idx] && (
                      <Badge variant="outline" className="text-xs">
                        {armory[idx].length} verses
                      </Badge>
                    )}
                  </div>
                  <div 
                    className="text-sm text-muted-foreground line-clamp-2 prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(stone) }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  {loadingStone === idx ? (
                    <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                  ) : armory[idx] ? (
                    expandedStones.includes(idx) ? (
                      <ChevronUp className="h-4 w-4 text-amber-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-amber-600" />
                    )
                  ) : (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-amber-600 hover:text-amber-700 h-7 px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateArmoryForStone(idx);
                      }}
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Load
                    </Button>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expandedStones.includes(idx) && armory[idx] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="border-t border-amber-100 max-h-[300px] overflow-y-auto">
                      <div className="p-3 space-y-2">
                        {armory[idx].map((verse, vIdx) => (
                          <div 
                            key={vIdx}
                            className="p-2 bg-amber-50/50 rounded border border-amber-100 hover:border-amber-200 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-amber-900">{verse.reference}</p>
                                <p className="text-sm text-muted-foreground mt-1 italic">"{verse.text}"</p>
                                <p className="text-xs text-amber-700 mt-1">
                                  <strong>Why:</strong> {verse.reason}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 w-7 p-0 flex-shrink-0"
                                onClick={() => copyVerse(verse.reference, verse.text)}
                              >
                                {copiedVerse === verse.reference ? (
                                  <Check className="h-3 w-3 text-green-600" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
