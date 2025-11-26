import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Sparkles, ArrowRight, Home } from "lucide-react";
import { toast } from "sonner";
import PTDiscoveryDialog from "@/components/memory/PTDiscoveryDialog";
import { usePTAnalysis } from "@/hooks/usePTAnalysis";
import { Progress } from "@/components/ui/progress";

export default function MemoryGameComplete() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { analyzeVerse, updateVersePTInsights, saveCrossReferences, analyzing } = usePTAnalysis();
  
  const [verses, setVerses] = useState<any[]>([]);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [showPTDialog, setShowPTDialog] = useState(false);
  const [currentPTInsights, setCurrentPTInsights] = useState<any>(null);
  const [currentVerse, setCurrentVerse] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  // Get game results from location state
  const gameResults = location.state?.results;

  useEffect(() => {
    if (listId) {
      loadVersesToAnalyze();
    }
  }, [listId]);

  const loadVersesToAnalyze = async () => {
    try {
      const { data, error } = await supabase
        .from("memory_verse_list_items")
        .select("*")
        .eq("list_id", listId)
        .eq("pt_discovered", false)
        .order("order_index");

      if (error) throw error;
      
      if (data && data.length > 0) {
        setVerses(data);
        // Start analyzing the first verse
        analyzeNextVerse(data, 0);
      } else {
        setCompleted(true);
      }
    } catch (error) {
      console.error("Error loading verses:", error);
      toast.error("Failed to load verses");
    }
  };

  const analyzeNextVerse = async (verseList: any[], index: number) => {
    if (index >= verseList.length) {
      setCompleted(true);
      return;
    }

    const verse = verseList[index];
    setCurrentVerse(verse);
    
    toast.loading("Analyzing verse with PT principles...", { id: "analyzing" });
    
    const insights = await analyzeVerse(verse.verse_reference, verse.verse_text);
    
    toast.dismiss("analyzing");
    
    if (insights) {
      setCurrentPTInsights(insights);
      await updateVersePTInsights(verse.id, insights);
      await saveCrossReferences(insights, verse.verse_reference);
      setShowPTDialog(true);
    } else {
      // If analysis fails, skip to next
      setCurrentVerseIndex(index + 1);
      analyzeNextVerse(verseList, index + 1);
    }
  };

  const handleNextVerse = () => {
    setShowPTDialog(false);
    const nextIndex = currentVerseIndex + 1;
    setCurrentVerseIndex(nextIndex);
    
    if (nextIndex < verses.length) {
      analyzeNextVerse(verses, nextIndex);
    } else {
      setCompleted(true);
    }
  };

  const handleViewCrossReference = (verseRef: string) => {
    // TODO: Implement cross-reference viewer
    toast.info(`Cross-reference: ${verseRef}`);
  };

  if (!completed && verses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {!completed ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Sparkles className="h-16 w-16 text-primary mx-auto" />
                <h2 className="text-2xl font-bold">Unlocking PT Insights</h2>
                <p className="text-muted-foreground">
                  Analyzing verse {currentVerseIndex + 1} of {verses.length}
                </p>
                <Progress value={((currentVerseIndex) / verses.length) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <Trophy className="h-20 w-20 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Great Work!</h2>
              <p className="text-muted-foreground mb-6">
                {gameResults ? `You scored ${gameResults.score}/${gameResults.total}` : 'Game completed!'}
              </p>
              
              {verses.length > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  You've unlocked {verses.length} new PT insight{verses.length !== 1 ? 's' : ''}!
                </p>
              )}

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/memory")}>
                  <Home className="h-4 w-4 mr-2" />
                  Back to Memory
                </Button>
                <Button onClick={() => navigate(`/memory/play/${listId}`)}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {currentVerse && currentPTInsights && (
        <PTDiscoveryDialog
          open={showPTDialog}
          onOpenChange={(open) => {
            if (!open) handleNextVerse();
          }}
          verseReference={currentVerse.verse_reference}
          verseText={currentVerse.verse_text}
          ptInsights={currentPTInsights}
          onViewCrossReference={handleViewCrossReference}
        />
      )}
    </div>
  );
}
