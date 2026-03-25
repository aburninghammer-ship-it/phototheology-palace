import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Search, BookOpen, Sparkles, Languages, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getStrongsEntry } from "@/services/strongsApi";

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

interface LookupResult {
  strongsNumber: string;
  originalWord: string;
  transliteration: string;
  definition: string;
  language: 'Hebrew' | 'Greek';
}

export const ResearchDictionaryPanel = ({
  book,
  chapter,
  verse,
  verseText,
  activeDictionary
}: ResearchDictionaryPanelProps) => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [words, setWords] = useState<StrongsWord[]>([]);
  const [source, setSource] = useState<string>("");
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);

  // Auto-analyze when verse changes
  useEffect(() => {
    setWords([]);
    setSource("");
    setLookupResult(null);

    // Auto-analyze the verse when selected
    if (verse && verseText) {
      const timer = setTimeout(() => {
        analyzeVerseAuto();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [verse, activeDictionary]);

  // Auto-analyze function (doesn't require button click)
  const analyzeVerseAuto = async () => {
    if (!verse || !verseText) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-strongs", {
        body: {
          book,
          chapter,
          verse,
          text: verseText,
          dictionary: activeDictionary
        }
      });

      if (error) throw error;
      setWords(data.words || []);
      setSource(data.source || 'unknown');
    } catch (error) {
      console.error("Failed to auto-analyze verse:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lookup specific Strong's number
  const lookupStrongsNumber = async () => {
    const trimmed = searchTerm.trim().toUpperCase();
    if (!trimmed) {
      toast.error("Enter a Strong's number (e.g., H430, G2316)");
      return;
    }

    // Validate format
    if (!/^[HG]\d{1,5}$/.test(trimmed)) {
      toast.error("Invalid format. Use H#### for Hebrew or G#### for Greek");
      return;
    }

    setSearchLoading(true);
    setLookupResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("lookup-strongs", {
        body: {
          strongsNumber: trimmed,
          dictionary: activeDictionary
        }
      });

      if (error) throw error;

      if (data.result) {
        setLookupResult(data.result);
        toast.success(`Found ${trimmed}`);
      } else {
        toast.info(`No definition found for ${trimmed}`);
      }
    } catch (error) {
      console.error("Failed to lookup Strong's number:", error);
      toast.error("Failed to lookup - using AI fallback");

      // Fallback to AI lookup
      try {
        const { data, error: aiError } = await supabase.functions.invoke("jeeves", {
          body: {
            mode: "strongs-lookup",
            strongsNumber: trimmed,
            dictionary: activeDictionary
          }
        });

        if (!aiError && data?.result) {
          setLookupResult(data.result);
          toast.success(`Found ${trimmed} via AI`);
        }
      } catch (aiErr) {
        toast.error("Lookup failed. Please try again.");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const analyzeVerse = async () => {
    if (!verse || !verseText) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-strongs", {
        body: {
          book,
          chapter,
          verse,
          text: verseText,
          dictionary: activeDictionary // Pass dictionary type
        }
      });

      if (error) throw error;
      setWords(data.words || []);
      setSource(data.source || 'unknown');
      
      if (data.words?.length > 0) {
        const dictName = activeDictionary === 'strongs' ? "Strong's" : 
                        activeDictionary === 'thayers' ? "Thayer's" : "BDB";
        toast.success(`Found ${data.words.length} words with ${dictName} data`);
      } else {
        toast.info("No lexicon data found for this verse");
      }
    } catch (error) {
      console.error("Failed to analyze verse:", error);
      toast.error("Failed to analyze verse");
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
            onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && lookupStrongsNumber()}
            placeholder="Enter Strong's # (H430, G2316)"
            className="pl-9 text-sm bg-background/50 border-palace-orange/30 focus:border-palace-orange/60 font-mono"
          />
        </div>
        <Button
          size="icon"
          variant="outline"
          onClick={lookupStrongsNumber}
          disabled={searchLoading}
          className="border-palace-orange/30 hover:bg-palace-orange/20 hover:border-palace-orange/50"
        >
          {searchLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {/* Lookup Result Card */}
      {lookupResult && (
        <div className={cn(
          "rounded-xl p-4 space-y-2 border backdrop-blur-xl",
          lookupResult.language === 'Hebrew'
            ? "bg-gradient-to-br from-palace-purple/20 to-palace-blue/10 border-palace-purple/30 shadow-lg shadow-palace-purple/20"
            : "bg-gradient-to-br from-palace-teal/20 to-palace-green/10 border-palace-teal/30 shadow-lg shadow-palace-teal/20"
        )}>
          <div className="flex items-center justify-between">
            <Badge
              className={cn(
                "text-sm font-mono border-0 shadow-sm",
                lookupResult.language === 'Hebrew'
                  ? "bg-gradient-palace text-white"
                  : "bg-gradient-ocean text-white"
              )}
            >
              {lookupResult.strongsNumber}
            </Badge>
            <Badge variant="outline" className={cn(
              "text-xs",
              lookupResult.language === 'Hebrew'
                ? "border-palace-purple/50 text-palace-purple"
                : "border-palace-teal/50 text-palace-teal"
            )}>
              {lookupResult.language}
            </Badge>
          </div>
          <p className="text-2xl font-serif text-foreground text-center py-2">
            {lookupResult.originalWord}
          </p>
          <p className="text-sm text-center text-muted-foreground italic">
            {lookupResult.transliteration}
          </p>
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-foreground/90 leading-relaxed">{lookupResult.definition}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLookupResult(null)}
            className="w-full text-xs hover:bg-white/10"
          >
            Clear Result
          </Button>
        </div>
      )}

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

      {/* Loading State */}
      {loading && words.length === 0 && (
        <div className="flex items-center justify-center py-6">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-palace-orange mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Analyzing {activeDictionary === 'strongs' ? "Strong's" : activeDictionary === 'thayers' ? "Thayer's" : "BDB"} data...
            </p>
          </div>
        </div>
      )}

      {/* Re-analyze Button (shown when analysis failed or user wants to refresh) */}
      {!loading && words.length === 0 && (
        <Button
          onClick={analyzeVerse}
          disabled={loading}
          className="w-full bg-gradient-warmth hover:opacity-90 text-white shadow-lg shadow-palace-orange/30"
        >
          <Languages className="h-4 w-4 mr-2" />
          {activeDictionary === 'strongs' && "Analyze with Strong's Concordance"}
          {activeDictionary === 'thayers' && "Analyze with Thayer's Lexicon"}
          {activeDictionary === 'bdb' && "Analyze with BDB Lexicon"}
        </Button>
      )}

      {/* Words List - Clickable Cards with Popovers */}
      {words.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          <p className="text-xs text-muted-foreground mb-2 px-1">
            Click any word for detailed definition
          </p>
          {words.map((word, idx) => (
            <Popover key={idx}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "w-full text-left rounded-xl p-3 space-y-1.5 border backdrop-blur-xl transition-all hover:scale-[1.02] cursor-pointer",
                    isHebrew(word.strongsNumber)
                      ? "bg-gradient-to-br from-palace-purple/20 to-palace-blue/10 border-palace-purple/30 shadow-md shadow-palace-purple/10 hover:border-palace-purple/50"
                      : "bg-gradient-to-br from-palace-teal/20 to-palace-green/10 border-palace-teal/30 shadow-md shadow-palace-teal/10 hover:border-palace-teal/50"
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
                  <p className="text-sm text-foreground/90 line-clamp-2">{word.definition}</p>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className={cn(
                  "w-96 p-4 border-2 backdrop-blur-xl",
                  isHebrew(word.strongsNumber)
                    ? "bg-purple-950/95 border-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "bg-teal-950/95 border-teal-500/50 shadow-lg shadow-teal-500/20"
                )}
                side="left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={cn(
                      "font-mono text-sm",
                      isHebrew(word.strongsNumber) ? "bg-purple-500 text-white" : "bg-teal-500 text-white"
                    )}>
                      {word.strongsNumber}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      "text-xs",
                      isHebrew(word.strongsNumber) ? "border-purple-400 text-purple-300" : "border-teal-400 text-teal-300"
                    )}>
                      {isHebrew(word.strongsNumber) ? "Hebrew" : "Greek"}
                    </Badge>
                  </div>
                  <div className="text-center py-3 border-y border-white/10">
                    <p className="text-4xl font-serif mb-2">{word.originalWord}</p>
                    <p className="text-sm text-muted-foreground italic">
                      {word.transliteration} {word.pronunciation && `• ${word.pronunciation}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Definition</p>
                    <p className="text-sm text-foreground leading-relaxed">{word.definition}</p>
                  </div>
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-muted-foreground">
                      English: <span className="text-foreground font-medium">{word.word}</span>
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
