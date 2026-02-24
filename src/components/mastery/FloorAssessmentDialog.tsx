import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Brain, Loader2, AlertTriangle, CheckCircle2, XCircle, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSequentialMastery } from "@/hooks/useSequentialMastery";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface FloorAssessmentDialogProps {
  floorNumber: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const FLOOR_QUESTIONS: Record<number, string[]> = {
  1: [
    "Recite the sequence of Genesis 1-11 from memory in vivid detail. Make me SEE it.",
    "Translate Psalm 23 into a complete visual journey. Every verse must become an image.",
    "Create a 24FPS symbol for Exodus 12. Explain why your symbol captures the essence.",
  ],
  2: [
    "Observe John 11:35. List 20 textual details most readers miss. Prove you're a detective.",
    "Define 'agape' vs 'phileo' in John 21. How does this change Peter's restoration scene?",
    "Write 10 questions about Genesis 22 that probe beneath the surface. Then answer them using ONLY Scripture.",
  ],
  3: [
    "You're stuck in traffic. RIGHT NOW, connect this to a Bible story and extract a principle. No time to think—GO.",
    "Explain how a tree in autumn teaches a Phototheology principle. Be specific, not generic.",
    "Current news headline of your choice: apply a Bible principle to it. Show me freestyle mastery.",
  ],
  4: [
    "Show me Christ in Leviticus 16. If you can't, you fail. (CR test)",
    "Identify the pattern connecting Noah's ark, Moses' basket, and Peter's sheet. Explain the progression.",
    "Babel vs Pentecost: parallel or type? Defend your answer with textual precision.",
  ],
  5: [
    "Map Daniel 7:13-14 onto the Three Angels' Messages. Show the sanctuary connection.",
    "Explain the 2300 days. If you get historicism wrong, you fail immediately.",
    "Which sanctuary furniture prefigures Christ's high priestly ministry? Prove it.",
  ],
  6: [
    "Isaiah 65-66: DoL\u00B9, DoL\u00B2, or DoL\u00B3? Defend your placement with contextual evidence.",
    "Trace the Adamic cycle through all 5 stages. Then show how it foreshadows the Remnant cycle.",
    "What heaven is Hebrews 12:26-28 describing? Wrong answer = you don't understand the framework.",
  ],
  7: [
    "How has the Fire Room changed you personally? Vague answers fail.",
    "Meditate on Isaiah 53:5 for 60 seconds. Now tell me what God showed you.",
    "Prove you've been transformed, not just educated. Evidence required.",
  ],
  8: [
    "Teach me a 12-verse chain connecting Genesis 3:15 to Revelation 20:10. No notes. GO.",
    "I claim Jesus didn't keep the Sabbath. Correct me using ONLY Scripture. Be precise.",
    "Show me Christ in all 66 books. You have 5 minutes. Summary form accepted, but it must be COMPLETE.",
    "Daniel 8 + Revelation 13: synthesize the prophetic timeline. Any error = fail.",
    "A student asks: 'How do I KNOW Phototheology works?' Answer with theological depth and lived proof.",
  ],
};

export const FloorAssessmentDialog: React.FC<FloorAssessmentDialogProps> = ({
  floorNumber,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const { canMaster, nextFloorToMaster, loading: masteryLoading, masteryMessage } = useSequentialMastery(floorNumber);

  const FLOOR_NAMES: Record<number, string> = {
    1: t('floorAssessment.floorName1'),
    2: t('floorAssessment.floorName2'),
    3: t('floorAssessment.floorName3'),
    4: t('floorAssessment.floorName4'),
    5: t('floorAssessment.floorName5'),
    6: t('floorAssessment.floorName6'),
    7: t('floorAssessment.floorName7'),
    8: t('floorAssessment.floorName8'),
  };

  const questions = FLOOR_QUESTIONS[floorNumber] || [];
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleNext = () => {
    if (!answers[currentQuestion]?.trim()) {
      toast({
        title: t('floorAssessment.answerRequired'),
        description: t('floorAssessment.answerRequiredDesc'),
        variant: "destructive",
      });
      return;
    }
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map((q, idx) => ({
        question: q,
        answer: answers[idx] || "",
      }));

      const { data, error } = await supabase.functions.invoke("grade-floor-assessment", {
        body: {
          floorNumber,
          answers: formattedAnswers,
        },
      });

      if (error) throw error;

      setResult(data);

      if (data.passed) {
        toast({
          title: floorNumber === 8 ? t('floorAssessment.blackMasterAchievedToast') : t('floorAssessment.floorPassedToast', { floor: floorNumber }),
          description: data.grandmaster_verdict,
          duration: 6000,
        });
        onSuccess();
      } else {
        toast({
          title: t('floorAssessment.notYetReady'),
          description: data.grandmaster_verdict,
          variant: "destructive",
          duration: 8000,
        });
      }
    } catch (error) {
      console.error("Assessment error:", error);
      toast({
        title: t('floorAssessment.submissionError'),
        description: t('floorAssessment.submissionErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPassed = result?.passed;
  const requiredScore = floorNumber === 8 ? 95 : 80;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6" />
            {t('floorAssessment.assessment', { floor: FLOOR_NAMES[floorNumber] })}
          </DialogTitle>
          <DialogDescription>
            {floorNumber === 8
              ? t('floorAssessment.blackMasterExamDesc')
              : t('floorAssessment.comprehensiveTestDesc', { floor: floorNumber, score: requiredScore })}
          </DialogDescription>
        </DialogHeader>

        {!canMaster && !masteryLoading && (
          <Alert className="border-amber-500/30 bg-amber-500/5">
            <Lock className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-600 dark:text-amber-400">{t('floorAssessment.sequentialMasteryRequired')}</AlertTitle>
            <AlertDescription className="text-muted-foreground space-y-3">
              <p>
                {t('floorAssessment.sequentialMasteryDesc')}
              </p>
              <p className="text-sm font-medium">{masteryMessage}</p>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/palace/floor/${nextFloorToMaster}`}>
                    {t('floorAssessment.goToFloor', { floor: nextFloorToMaster })}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                  {t('floorAssessment.close')}
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {canMaster && !result && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{t('floorAssessment.questionOf', { current: currentQuestion + 1, total: totalQuestions })}</span>
                <Badge variant="outline">{Math.round(progress)}%</Badge>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
              <p className="font-semibold mb-3 text-lg">{questions[currentQuestion]}</p>
              <Textarea
                value={answers[currentQuestion] || ""}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion]: e.target.value }))
                }
                placeholder={t('floorAssessment.answerPlaceholder')}
                className="min-h-[200px]"
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {t('floorAssessment.characters', { count: (answers[currentQuestion] || "").length })}
              </p>
            </div>

            {floorNumber === 8 && currentQuestion === 0 && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-destructive mb-1">{t('floorAssessment.blackMasterWarning')}</p>
                  <p className="text-muted-foreground">
                    {t('floorAssessment.blackMasterWarningDesc')}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0 || isSubmitting}
              >
                {t('floorAssessment.previous')}
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSubmitting || !answers[currentQuestion]?.trim()}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('floorAssessment.gradingByGrandmaster')}
                  </>
                ) : currentQuestion === totalQuestions - 1 ? (
                  t('floorAssessment.submitForGrading')
                ) : (
                  t('floorAssessment.nextQuestion')
                )}
              </Button>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div
              className={`p-6 rounded-lg border-2 ${
                isPassed
                  ? "border-green-500 bg-green-500/10"
                  : "border-red-500 bg-red-500/10"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {isPassed ? (
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-500" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">
                      {isPassed
                        ? floorNumber === 8
                          ? t('floorAssessment.blackMasterAchieved')
                          : t('floorAssessment.floorPassed', { floor: floorNumber })
                        : t('floorAssessment.notYetReady')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t('floorAssessment.score', { score: result.score, required: requiredScore })}
                    </p>
                  </div>
                </div>
              </div>
              <Progress value={result.score} className="h-3 mb-3" />
              <div className="p-3 rounded bg-background/50">
                <p className="text-sm font-medium mb-1">{t('floorAssessment.grandmastersVerdict')}</p>
                <p className="text-sm whitespace-pre-wrap">{result.grandmaster_verdict}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">{t('floorAssessment.detailedFeedback')}</h4>
              {result.question_scores?.map((qs: any, idx: number) => (
                <div key={idx} className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('floorAssessment.questionNumber', { number: idx + 1 })}</span>
                    <Badge variant={qs.score >= requiredScore ? "default" : "destructive"}>
                      {qs.score}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{questions[idx]}</p>
                  <p className="text-sm whitespace-pre-wrap mb-2">{qs.feedback}</p>
                  {qs.corrections && (
                    <div className="p-2 rounded bg-destructive/10 text-sm">
                      <p className="font-medium text-destructive mb-1">{t('floorAssessment.corrections')}</p>
                      <p className="text-xs">{qs.corrections}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!isPassed && (
              <Button
                onClick={() => {
                  setResult(null);
                  setCurrentQuestion(0);
                  setAnswers({});
                }}
                variant="outline"
                className="w-full"
              >
                {t('floorAssessment.retryAssessment')}
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
