import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
    } catch (error) {
      console.error("Failed to analyze verse:", error);
      toast.error("Failed to analyze Strong's numbers");
    } finally {
      setLoading(false);
    }
  };

  if (!verse) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select a verse to view word definitions</p>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Strong's number (e.g., H1234, G5678)"
          className="flex-1 text-sm"
        />
        <Button size="icon" variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Verse Reference */}
      <div className="bg-muted/50 rounded-lg p-3">
        <Badge variant="secondary" className="text-xs mb-2">
          {book} {chapter}:{verse}
        </Badge>
        <p className="text-sm italic text-muted-foreground line-clamp-2">
          "{verseText}"
        </p>
      </div>

      {/* Analyze Button */}
      {words.length === 0 && (
        <Button
          onClick={analyzeVerse}
          disabled={loading}
          className="w-full"
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <BookOpen className="h-4 w-4 mr-2" />
          )}
          Analyze Hebrew/Greek Words
        </Button>
      )}

      {/* Words List */}
      {words.length > 0 && (
        <div className="space-y-3">
          {words.map((word, idx) => (
            <div key={idx} className="bg-muted/30 rounded-lg p-3 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{word.word}</span>
                <Badge variant="outline" className="text-xs font-mono">
                  {word.strongsNumber}
                </Badge>
              </div>
              {word.transliteration && (
                <p className="text-xs text-muted-foreground italic">
                  {word.transliteration} {word.pronunciation && `(${word.pronunciation})`}
                </p>
              )}
              <p className="text-sm">{word.definition}</p>
            </div>
          ))}
        </div>
      )}

      {/* Dictionary Type Info */}
      <div className="text-xs text-muted-foreground bg-muted/20 rounded-lg p-2">
        {activeDictionary === "strongs" && (
          <p><strong>Strong's Concordance:</strong> Standard Hebrew/Greek reference with numbered entries.</p>
        )}
        {activeDictionary === "thayers" && (
          <p><strong>Thayer's Lexicon:</strong> Detailed Greek lexicon with theological context.</p>
        )}
        {activeDictionary === "bdb" && (
          <p><strong>Brown-Driver-Briggs:</strong> Comprehensive Hebrew/Aramaic lexicon.</p>
        )}
      </div>
    </div>
  );
};
