import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Share2, Loader2, Trophy, Copy, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface ChallengeShareButtonProps {
  challengeEquation: string;
  challengeExplanation: string;
  jeevesSolution: string;
  verse?: string;
}

export const ChallengeShareButton = ({
  challengeEquation,
  challengeExplanation,
  jeevesSolution,
  verse
}: ChallengeShareButtonProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [grading, setGrading] = useState(false);
  const [response, setResponse] = useState(jeevesSolution);
  const [gradeResult, setGradeResult] = useState<{
    grade: number;
    highlights: string[];
    feedback: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const copyResponse = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      toast.success("Response copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy response");
    }
  };

  const handleShare = async () => {
    if (!user) {
      toast.error("Please sign in to share");
      return;
    }

    if (!response.trim()) {
      toast.error("Please enter your response");
      return;
    }

    setSharing(true);
    try {
      // Create community post
      const postTitle = verse 
        ? `Phototheology Challenge: ${verse}`
        : "Phototheology Equation Challenge";
      
      const postContent = `**Challenge Equation:**\n${challengeEquation}\n\n**My Response:**\n${response}`;

      const { data: post, error: postError } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: postTitle,
          content: postContent,
          category: 'challenge'
        })
        .select()
        .single();

      if (postError) throw postError;

      // Grade the response
      setGrading(true);
      const { data: gradeData, error: gradeError } = await supabase.functions.invoke(
        'grade-challenge-response',
        {
          body: {
            responseText: response,
            challengeEquation,
            challengeExplanation
          }
        }
      );

      if (gradeError) {
        console.error("Grading error:", gradeError);
        toast.error("Response shared but grading failed");
      } else {
        setGradeResult(gradeData);
        
        // Save grade to database
        await supabase
          .from('community_challenge_responses')
          .insert({
            post_id: post.id,
            user_id: user.id,
            response_text: response,
            jeeves_grade: gradeData,
            highlighted_parts: gradeData.highlights || [],
            grade_score: gradeData.grade || 0,
            graded_at: new Date().toISOString()
          });
      }

      toast.success("Response shared to community!");
      
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share response");
    } finally {
      setSharing(false);
      setGrading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full"
        size="lg"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share to Community
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Share Challenge Response</DialogTitle>
            <DialogDescription>
              Share your response with the community and get feedback from Jeeves
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Challenge Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Challenge:</p>
              <p className="font-mono text-sm">{challengeEquation}</p>
            </div>

            {/* Response Editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">
                  Your Response:
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={copyResponse}
                  className="h-8"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={10}
                placeholder="Edit or add to Jeeves' solution with your own insights..."
                className="w-full"
              />
            </div>

            {/* Grade Result */}
            {gradeResult && (
              <div className="bg-gradient-to-br from-palace-gold/10 to-palace-teal/10 border border-palace-teal/20 p-6 rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Trophy className="h-6 w-6 text-palace-gold" />
                  <div>
                    <h3 className="font-bold text-xl">Jeeves' Grade</h3>
                    <p className="text-3xl font-bold text-palace-teal">{gradeResult.grade}/100</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Powerful Insights:</h4>
                  <ul className="space-y-2">
                    {gradeResult.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-palace-teal mt-1">✓</span>
                        <span className="text-sm">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Feedback:</h4>
                  <div className="text-sm space-y-2">
                    {formatJeevesResponse(gradeResult.feedback)}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                disabled={sharing || grading}
                className="flex-1"
              >
                {sharing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {grading ? "Grading..." : "Sharing..."}
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share & Get Graded
                  </>
                )}
              </Button>
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                disabled={sharing || grading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};