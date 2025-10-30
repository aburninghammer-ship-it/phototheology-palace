import { useState, useEffect } from "react";
import { Verse } from "@/types/bible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StrongsModal } from "./StrongsModal";
import { HebrewGreekAnalysisDialog } from "./HebrewGreekAnalysisDialog";
import { getVerseWithStrongs } from "@/services/strongsApi";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Bot, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StrongsVerseViewProps {
  verse: Verse;
  isSelected: boolean;
  onSelect: () => void;
  showPrinciples?: boolean;
  isHighlighted?: boolean;
  principles?: string[];
}

export const StrongsVerseView = ({ 
  verse, 
  isSelected, 
  onSelect, 
  showPrinciples, 
  isHighlighted,
  principles 
}: StrongsVerseViewProps) => {
  const [selectedStrongs, setSelectedStrongs] = useState<string | null>(null);
  const [strongsData, setStrongsData] = useState<{
    text: string;
    words: Array<{ text: string; strongs?: string; lemma?: string; transliteration?: string; part_of_speech?: string }>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jeevesLoading, setJeevesLoading] = useState(false);
  const [jeevesResponse, setJeevesResponse] = useState<string | null>(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);
  const [selectedWordForAnalysis, setSelectedWordForAnalysis] = useState<any>(null);
  const { toast } = useToast();
  
  const displayPrinciples = principles || ["2D", "@Ab", "Altar", "Passover"];
  const colors = ["gradient-palace", "gradient-ocean", "gradient-sunset", "gradient-warmth", "gradient-royal"];
  
  useEffect(() => {
    const fetchStrongsData = async () => {
      setIsLoading(true);
      try {
        const data = await getVerseWithStrongs(verse.book, verse.chapter, verse.verse);
        setStrongsData(data);
      } catch (error) {
        console.error('Error fetching Strong\'s data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStrongsData();
  }, [verse.book, verse.chapter, verse.verse]);

  const handleStrongsClick = (strongsNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStrongs(strongsNumber);
  };

  const handleAIAnalysisClick = (word: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedWordForAnalysis({
      strongsNumber: word.strongs,
      lemma: word.lemma || word.text,
      transliteration: word.transliteration || 'N/A',
      part_of_speech: word.part_of_speech || 'N/A',
      verseText: verse.text,
      book: verse.book,
      chapter: verse.chapter,
      verse: verse.verse
    });
    setAnalysisDialogOpen(true);
  };

  const handleAskJeevesForStrongs = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setJeevesLoading(true);
    setJeevesResponse(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "strongs-lookup",
          book: verse.book,
          chapter: verse.chapter,
          verse: verse.verse,
        },
      });

      if (error) throw error;

      setJeevesResponse(data.content);
      toast({
        title: "Strong's Data Retrieved",
        description: "Jeeves has fetched the concordance data for this verse",
      });
    } catch (error: any) {
      console.error("Jeeves Strong's lookup error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to get Strong's data from Jeeves",
        variant: "destructive",
      });
    } finally {
      setJeevesLoading(false);
    }
  };

  return (
    <>
      <div
        className={`group cursor-pointer transition-all duration-300 p-3 rounded-lg ${
          isSelected
            ? "bg-primary/10 border-2 border-primary shadow-lg"
            : isHighlighted
            ? "bg-accent/20 border-2 border-accent shadow-md animate-pulse-glow"
            : "hover:bg-muted/50 border-2 border-transparent"
        }`}
        onClick={onSelect}
      >
        <div className="flex gap-3">
          <span
            className={`font-serif font-bold text-sm flex-shrink-0 ${
              isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            } transition-colors`}
          >
            {verse.verse}
          </span>
          
          <div className="flex-1">
            <div className="text-foreground leading-relaxed">
              {isLoading ? (
                <p className="text-muted-foreground animate-pulse">{verse.text}</p>
              ) : strongsData?.words ? (
                <span>
                  {strongsData.words.map((word, idx) => (
                    <span key={idx} className="relative group/word">
                      {word.text}
                      {word.strongs && (
                        <>
                          <sup 
                            className="text-xs text-primary/70 hover:text-primary cursor-pointer font-semibold ml-0.5 transition-colors"
                            onClick={(e) => handleStrongsClick(word.strongs!, e)}
                            title={`Click to see Strong's ${word.strongs}`}
                          >
                            {word.strongs.replace(/[GH]/, "")}
                          </sup>
                          <span 
                            className="inline-block ml-1 cursor-pointer"
                            onClick={(e) => handleAIAnalysisClick(word, e)}
                            title="AI Analysis of this word"
                          >
                            <Sparkles 
                              className="w-3 h-3 opacity-0 group-hover/word:opacity-100 transition-opacity text-primary"
                            />
                          </span>
                        </>
                      )}
                      {idx < strongsData.words.length - 1 && " "}
                    </span>
                  ))}
                </span>
              ) : (
                <div>
                  <p className="mb-2">{verse.text}</p>
                  {verse.verse === 1 && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                        <div className="text-xs space-y-1">
                          <p className="font-semibold text-foreground">
                            ✨ Strong's Numbers Active
                          </p>
                          <p className="text-muted-foreground">
                            Strong's concordance data is currently available for these demonstration verses:
                          </p>
                          <ul className="list-disc list-inside text-muted-foreground ml-2 space-y-0.5">
                            <li><strong>Genesis 1:1</strong> - In the beginning God created</li>
                            <li><strong>Psalm 23:1</strong> - The LORD is my shepherd</li>
                            <li><strong>Isaiah 53:5</strong> - By his stripes we are healed</li>
                            <li><strong>Matthew 28:19</strong> - Go and teach all nations</li>
                            <li><strong>John 1:1, 3:3, 3:16, 14:6</strong> - Key Gospel verses</li>
                            <li><strong>Romans 3:23, 6:23</strong> - Sin and salvation</li>
                            <li><strong>Ephesians 2:8</strong> - Saved by grace through faith</li>
                            <li><strong>Philippians 4:13</strong> - I can do all things</li>
                            <li><strong>1 Corinthians 13:13</strong> - Faith, hope, and love</li>
                            <li><strong>Revelation 21:4</strong> - No more tears</li>
                          </ul>
                          <p className="text-muted-foreground mt-2">
                            When viewing these verses, click the superscript numbers to see original Hebrew/Greek definitions and usage. 
                            <span className="text-primary font-medium"> Full Bible concordance integration coming soon!</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {showPrinciples && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {displayPrinciples.map((principle, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className={`text-xs ${colors[idx % colors.length]} text-white`}
                  >
                    {idx === 0 && <Sparkles className="h-3 w-3 mr-1" />}
                    {principle}
                  </Badge>
                ))}
              </div>
            )}

            {strongsData?.words && !isLoading && (
              <div className="mt-2 text-xs text-primary/60 italic font-semibold flex items-center gap-2">
                <Sparkles className="h-3 w-3" />
                Hover over words & click ✨ for AI Hebrew/Greek analysis, or click numbers for definitions
              </div>
            )}

            {/* Jeeves Strong's Lookup Button */}
            {!strongsData?.words && !isLoading && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAskJeevesForStrongs}
                  disabled={jeevesLoading}
                  className="w-full"
                >
                  {jeevesLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Jeeves is fetching Strong's data...
                    </>
                  ) : (
                    <>
                      <Bot className="h-3 w-3 mr-2" />
                      Ask Jeeves for Strong's Numbers
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Jeeves Response */}
            {jeevesResponse && (
              <div className="mt-3 p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">Jeeves says:</span>
                </div>
                <div className="prose prose-sm max-w-none text-foreground">
                  <div dangerouslySetInnerHTML={{ __html: jeevesResponse.replace(/\n/g, '<br />') }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <StrongsModal
        strongsNumber={selectedStrongs || ""}
        isOpen={!!selectedStrongs}
        onClose={() => setSelectedStrongs(null)}
      />

      {selectedWordForAnalysis && (
        <HebrewGreekAnalysisDialog
          isOpen={analysisDialogOpen}
          onClose={() => {
            setAnalysisDialogOpen(false);
            setSelectedWordForAnalysis(null);
          }}
          wordData={selectedWordForAnalysis}
        />
      )}
    </>
  );
};
