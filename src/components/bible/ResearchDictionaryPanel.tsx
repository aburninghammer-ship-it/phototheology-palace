import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, BookOpen, Sparkles, Languages } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResearchDictionaryPanelProps {
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string;
  activeDictionary: string;
}

interface StrongsWord {
  word: string;
  strongsNumber: string;
  originalWord?: string;
  definition: string;
  transliteration?: string;
  pronunciation?: string;
}

export const ResearchDictionaryPanel = ({
  book,
  chapter,
  verse,
  verseText,
  activeDictionary
}: ResearchDictionaryPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState<StrongsWord[]>([]);
  const [source, setSource] = useState<string>("");

  const analyzeVerse = async () => {
    if (!verse || !verseText) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-strongs", {
        body: {
          book,
          chapter,
          verse,
          text: verseText
        }
      });

      if (error) throw error;
      setWords(data.words || []);
      setSource(data.source || 'unknown');
      
      if (data.words?.length > 0) {
        toast.success(`Found ${data.words.length} words with Strong's numbers`);
      } else {
        toast.info("No Strong's data found for this verse");
      }
    } catch (error) {
      console.error("Failed to analyze verse:", error);
      toast.error("Failed to analyze Strong's numbers");
    } finally {
      setLoading(false);
    }
  };

  const isHebrew = (num: string) => num?.startsWith('H');
  const isGreek = (num: string) => num?.startsWith('G');

  if (!verse) {
    return (
      <div className="p-6 text-center">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-palace-orange/20 to-palace-yellow/20 border border-palace-orange/30 inline-block mb-3">
          <BookOpen className="h-10 w-10 text-palace-orange" />
        </div>
        <p className="text-sm text-muted-foreground">Select a verse to view word definitions</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Search Bar - Glassy */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Strong's (H1234, G5678)"
            className="pl-9 text-sm bg-background/50 border-palace-orange/30 focus:border-palace-orange/60"
          />
        </div>
        <Button size="icon" variant="outline" className="border-palace-orange/30 hover:bg-palace-orange/20 hover:border-palace-orange/50">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Verse Reference - Glassy with Glow */}
      <div className="bg-gradient-to-br from-palace-orange/10 to-palace-yellow/10 backdrop-blur-xl rounded-xl p-3 border border-palace-orange/20 shadow-lg shadow-palace-orange/10">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="text-xs bg-gradient-warmth text-white border-0 shadow-md shadow-palace-orange/30">
            {book} {chapter}:{verse}
          </Badge>
          {source && (
            <Badge variant="outline" className="text-[10px] bg-palace-teal/10 border-palace-teal/30 text-palace-teal">
              {source === 'database' ? '📚 Lexicon' : '🤖 AI'}
            </Badge>
          )}
        </div>
        <p className="text-sm italic text-muted-foreground line-clamp-2 font-serif">
          "{verseText}"
        </p>
      </div>

      {/* Analyze Button - Gradient */}
      {words.length === 0 && (
        <Button
          onClick={analyzeVerse}
          disabled={loading}
          className="w-full bg-gradient-warmth hover:opacity-90 text-white shadow-lg shadow-palace-orange/30"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Languages className="h-4 w-4 mr-2" />
          )}
          Analyze Hebrew/Greek Words
        </Button>
      )}

      {/* Words List - Colorful Cards */}
      {words.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {words.map((word, idx) => (
            <div 
              key={idx} 
              className={cn(
                "rounded-xl p-3 space-y-1.5 border backdrop-blur-xl transition-all hover:scale-[1.02]",
                isHebrew(word.strongsNumber) 
                  ? "bg-gradient-to-br from-palace-purple/20 to-palace-blue/10 border-palace-purple/30 shadow-md shadow-palace-purple/10" 
                  : "bg-gradient-to-br from-palace-teal/20 to-palace-green/10 border-palace-teal/30 shadow-md shadow-palace-teal/10"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{word.word}</span>
                <Badge 
                  className={cn(
                    "text-xs font-mono border-0 shadow-sm",
                    isHebrew(word.strongsNumber) 
                      ? "bg-gradient-palace text-white" 
                      : "bg-gradient-ocean text-white"
                  )}
                >
                  {word.strongsNumber}
                </Badge>
              </div>
              {word.originalWord && (
                <p className="text-lg font-serif text-foreground">
                  {word.originalWord}
                </p>
              )}
              {word.transliteration && (
                <p className="text-xs text-muted-foreground italic">
                  {word.transliteration} {word.pronunciation && `(${word.pronunciation})`}
                </p>
              )}
              <p className="text-sm text-foreground/90">{word.definition}</p>
            </div>
          ))}
        </div>
      )}

      {/* Reset Button */}
      {words.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setWords([])}
          className="w-full border-palace-orange/30 hover:bg-palace-orange/10"
        >
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          Analyze Another Verse
        </Button>
      )}

      {/* Dictionary Type Info - Glassy */}
      <div className="text-xs bg-gradient-to-r from-palace-purple/10 via-palace-blue/10 to-palace-teal/10 rounded-xl p-3 border border-white/10">
        {activeDictionary === "strongs" && (
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-md bg-palace-purple/20 shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-palace-purple" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Strong's Concordance</p>
              <p className="text-muted-foreground">Standard Hebrew/Greek reference with numbered entries.</p>
            </div>
          </div>
        )}
        {activeDictionary === "thayers" && (
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-md bg-palace-teal/20 shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-palace-teal" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Thayer's Lexicon</p>
              <p className="text-muted-foreground">Detailed Greek lexicon with theological context.</p>
            </div>
          </div>
        )}
        {activeDictionary === "bdb" && (
          <div className="flex items-start gap-2">
            <div className="p-1 rounded-md bg-palace-orange/20 shrink-0">
              <BookOpen className="h-3.5 w-3.5 text-palace-orange" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Brown-Driver-Briggs</p>
              <p className="text-muted-foreground">Comprehensive Hebrew/Aramaic lexicon.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
