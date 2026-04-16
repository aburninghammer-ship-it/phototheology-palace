import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Loader2, BookText, Search, Sparkles, Globe, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface WordStudyResult {
  word: string;
  originalLanguage: "Hebrew" | "Greek";
  transliteration: string;
  strongsNumber: string;
  definition: string;
  rootMeaning: string;
  usageCount: number;
  relatedWords: { word: string; meaning: string }[];
  keyOccurrences: { reference: string; context: string }[];
  theologicalSignificance: string;
  ptConnection: string;
}

interface InteractiveWordStudyProps {
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
}

export const InteractiveWordStudy = ({ book, chapter, verse, verseText }: InteractiveWordStudyProps) => {
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [result, setResult] = useState<WordStudyResult | null>(null);
  const [suggestedWords, setSuggestedWords] = useState<string[]>([]);
  const { toast } = useToast();

  // Extract key words from verse (simplified - in production would use NLP)
  const extractKeyWords = () => {
    const words = verseText
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length > 3)
      .filter(w => !["the", "and", "that", "this", "with", "from", "have", "been", "were", "they", "their", "shall", "unto"].includes(w.toLowerCase()));
    setSuggestedWords([...new Set(words)].slice(0, 8));
  };

  const studyWord = async (word: string) => {
    if (!word.trim()) return;
    
    setLoading(true);
    setSearchWord(word);
    try {
      const { data: response, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "word-study",
          word,
          book,
          chapter,
          verse,
          verseText,
        },
      });

      if (error) throw error;

      const content = response?.content || "";
      let cleanedContent = content
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');
      
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]));
        toast({ title: "Word Study Complete", description: `Analyzed "${word}"` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <BookText className="h-5 w-5" />
          Interactive Word Study
        </CardTitle>
        <CardDescription className="text-white/90">
          Deep dive into Hebrew & Greek keywords
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter a word to study..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && studyWord(searchWord)}
          />
          <Button
            onClick={() => studyWord(searchWord)}
            disabled={loading || !searchWord.trim()}
            className="shrink-0"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Suggested Words */}
        {suggestedWords.length === 0 && (
          <Button variant="outline" size="sm" onClick={extractKeyWords} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Suggest Key Words from Verse
          </Button>
        )}
        
        {suggestedWords.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Click a word to study:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedWords.map((word, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => studyWord(word)}
                >
                  {word}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <ScrollArea className="h-[350px]">
                {/* Header */}
                <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <Badge>{result.originalLanguage}</Badge>
                    <Badge variant="outline">{result.strongsNumber}</Badge>
                  </div>
                  <p className="text-lg font-bold">{result.word}</p>
                  <p className="text-sm italic text-muted-foreground">{result.transliteration}</p>
                </div>

                {/* Definition */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Definition</h4>
                    <p className="text-sm">{result.definition}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground mb-1">Root Meaning</h4>
                    <p className="text-sm">{result.rootMeaning}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <History className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Used {result.usageCount} times in Scripture</span>
                  </div>

                  {/* Related Words */}
                  {result.relatedWords?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">Related Words</h4>
                      <div className="flex flex-wrap gap-1">
                        {result.relatedWords.map((rw, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={() => studyWord(rw.word)}
                          >
                            {rw.word}: {rw.meaning}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Occurrences */}
                  {result.keyOccurrences?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-2">Key Occurrences</h4>
                      <div className="space-y-2">
                        {result.keyOccurrences.map((occ, idx) => (
                          <div key={idx} className="p-2 rounded bg-muted/50 border text-xs">
                            <Badge variant="outline" className="mb-1">{occ.reference}</Badge>
                            <p className="text-muted-foreground">{occ.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Theological Significance */}
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">
                      Theological Significance
                    </h4>
                    <p className="text-sm">{result.theologicalSignificance}</p>
                  </div>

                  {/* PT Connection */}
                  <div className="p-3 rounded-lg gradient-palace-subtle border">
                    <h4 className="text-xs font-semibold mb-1">Palace Connection</h4>
                    <p className="text-sm">{result.ptConnection}</p>
                  </div>
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
