import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookOpen, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BiblePracticeTileProps {
  verseReference: string;
  bibleText: string;
  roomName: string;
  roomPrinciple: string;
  onClose?: () => void;
}

export function BiblePracticeTile({ 
  verseReference, 
  bibleText, 
  roomName, 
  roomPrinciple,
  onClose 
}: BiblePracticeTileProps) {
  const [practiceText, setPracticeText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showBible, setShowBible] = useState(true);

  const handleAnalyze = async () => {
    if (!practiceText.trim()) {
      toast.error("Please enter your practice work first");
      return;
    }

    try {
      setAnalyzing(true);
      setFeedback(null);

      console.log('Submitting practice for analysis:', verseReference);

      const { data, error } = await supabase.functions.invoke('analyze-practice', {
        body: {
          verseReference,
          exerciseContent: practiceText,
          roomName,
          roomPrinciple,
          bibleText
        }
      });

      if (error) {
        console.error('Error analyzing practice:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.feedback) {
        setFeedback(data.feedback);
        toast.success("Analysis complete!");
      } else {
        throw new Error('No feedback received');
      }

    } catch (error: any) {
      console.error('Error in handleAnalyze:', error);
      toast.error(error.message || "Failed to analyze practice work");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle>Bible Practice with AI Feedback</CardTitle>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
        <CardDescription>
          Study the text, practice the {roomName} principle, then get AI feedback
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Bible Text Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground">
              📖 {verseReference}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBible(!showBible)}
            >
              {showBible ? "Hide Text" : "Show Text"}
            </Button>
          </div>
          
          {showBible && (
            <ScrollArea className="h-48 rounded-lg border bg-muted/30 p-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {bibleText || "Loading Bible text..."}
              </p>
            </ScrollArea>
          )}
        </div>

        {/* Practice Work Section */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">
            ✍️ Your Practice Work
          </h3>
          <Textarea
            value={practiceText}
            onChange={(e) => setPracticeText(e.target.value)}
            placeholder={`Apply the ${roomName} principle here...\n\nExample: ${roomPrinciple.substring(0, 150)}...`}
            rows={8}
            className="resize-none"
            disabled={analyzing}
          />
        </div>

        {/* Analysis Button */}
        <Button
          onClick={handleAnalyze}
          disabled={analyzing || !practiceText.trim()}
          className="w-full"
          size="lg"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Get AI Feedback
            </>
          )}
        </Button>

        {/* Feedback Section */}
        {feedback && (
          <Alert className="border-primary/20 bg-primary/5">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold text-sm">🎓 Mentor Feedback:</p>
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {feedback}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <Alert>
          <AlertDescription className="text-xs">
            <strong>How it works:</strong> Read the Bible text above, write your practice applying the {roomName} principle, then click "Get AI Feedback" for personalized mentoring on your work.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
