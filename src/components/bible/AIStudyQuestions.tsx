import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, HelpCircle, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface StudyQuestion {
  question: string;
  type: "observation" | "interpretation" | "application" | "integration";
  floor: number;
  roomCode: string;
  hint?: string;
  sampleAnswer?: string;
}

interface AIStudyQuestionsProps {
  book: string;
  chapter: number;
  verse?: number;
  verseText?: string;
  chapterText?: string;
}

const FLOOR_LEVELS = [
  { value: "1", label: "Floor 1: Beginner (Furnishing)", description: "Memory & visualization focus" },
  { value: "2", label: "Floor 2: Investigator (Investigation)", description: "Detective work & observation" },
  { value: "3", label: "Floor 3: Connector (Freestyle)", description: "Making spontaneous connections" },
  { value: "4", label: "Floor 4: Advanced (Next Level)", description: "Christ-centered depth" },
  { value: "5", label: "Floor 5: Prophetic (Vision)", description: "Prophecy & sanctuary" },
  { value: "6", label: "Floor 6: Cosmic (Three Heavens)", description: "Cycles & cosmic context" },
  { value: "7", label: "Floor 7: Spiritual (Emotional)", description: "Heart transformation" },
];

const TYPE_COLORS: Record<string, string> = {
  observation: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  interpretation: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  application: "bg-green-500/20 text-green-700 dark:text-green-300",
  integration: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

export const AIStudyQuestions = ({ book, chapter, verse, verseText, chapterText }: AIStudyQuestionsProps) => {
  const [loading, setLoading] = useState(false);
  const [floorLevel, setFloorLevel] = useState("1");
  const [questions, setQuestions] = useState<StudyQuestion[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
  const { toast } = useToast();

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "study-questions",
          book,
          chapter,
          verse,
          verseText,
          chapterText,
          floorLevel: parseInt(floorLevel),
        },
      });

      if (error) throw error;

      const content = response?.content || "";
      let cleanedContent = content
        .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '');
      
      const jsonMatch = cleanedContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setQuestions(parsed);
        setExpandedQuestion(null);
        setUserAnswers({});
        setCompletedQuestions([]);
        toast({ title: "Study Questions Generated", description: `${parsed.length} questions for Floor ${floorLevel}` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const markComplete = (index: number) => {
    if (!completedQuestions.includes(index)) {
      setCompletedQuestions([...completedQuestions, index]);
      toast({ title: "Question Completed!", description: "Great work on your study!" });
    }
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          AI Study Questions
        </CardTitle>
        <CardDescription className="text-white/90">
          Tailored questions based on your floor level
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Floor Level Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Study Level</label>
          <Select value={floorLevel} onValueChange={setFloorLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLOOR_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  <div>
                    <p className="font-medium">{level.label}</p>
                    <p className="text-xs text-muted-foreground">{level.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Context Display */}
        <div className="p-2 rounded bg-muted/50 border text-xs">
          <span className="font-medium">{book} {chapter}</span>
          {verse && <span>:{verse}</span>}
        </div>

        <Button
          onClick={generateQuestions}
          disabled={loading}
          className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Questions...
            </>
          ) : (
            <>
              <Lightbulb className="h-4 w-4 mr-2" />
              Generate Study Questions
            </>
          )}
        </Button>

        {/* Progress */}
        {questions.length > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <Badge variant="outline">
              {completedQuestions.length} / {questions.length} completed
            </Badge>
          </div>
        )}

        <AnimatePresence>
          {questions.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ScrollArea className="h-[350px]">
                <div className="space-y-3">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        completedQuestions.includes(index) ? "border-green-500/50 bg-green-500/5" : ""
                      }`}
                    >
                      <button
                        onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                        className="w-full p-3 flex items-start gap-3 text-left hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {completedQuestions.includes(index) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge className={TYPE_COLORS[q.type] || ""} variant="outline">
                              {q.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {q.roomCode}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium">{q.question}</p>
                        </div>
                        {expandedQuestion === index ? (
                          <ChevronUp className="h-4 w-4 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 shrink-0" />
                        )}
                      </button>

                      <AnimatePresence>
                        {expandedQuestion === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 pt-0 space-y-3 border-t bg-card">
                              {q.hint && (
                                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30 text-xs">
                                  <span className="font-semibold">💡 Hint: </span>
                                  {q.hint}
                                </div>
                              )}

                              <Textarea
                                placeholder="Write your answer here..."
                                value={userAnswers[index] || ""}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [index]: e.target.value })}
                                rows={3}
                                className="text-sm"
                              />

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => markComplete(index)}
                                  disabled={completedQuestions.includes(index)}
                                >
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Mark Complete
                                </Button>
                              </div>

                              {q.sampleAnswer && completedQuestions.includes(index) && (
                                <div className="p-2 rounded bg-green-500/10 border border-green-500/30 text-xs">
                                  <span className="font-semibold">Sample Answer: </span>
                                  {q.sampleAnswer}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
