import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { toast } from "sonner";
import { format, isPast, isFuture } from "date-fns";
import {
  Loader2, Plus, ClipboardList, CheckCircle, Clock, BarChart3,
  ThumbsUp, ThumbsDown, MessageSquare, ChevronRight, Users, X
} from "lucide-react";

interface ChurchSurveysProps {
  churchId: string;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  survey_type: string;
  target_audience: string;
  is_anonymous: boolean;
  show_results_to_all: boolean;
  starts_at: string;
  ends_at: string | null;
  status: string;
  created_at: string;
}

interface Question {
  id: string;
  survey_id: string;
  question_text: string;
  question_type: string;
  options: string[];
  is_required: boolean;
  display_order: number;
  min_value: number;
  max_value: number;
  min_label: string | null;
  max_label: string | null;
}

interface Answer {
  question_id: string;
  answer_text?: string;
  answer_option?: string;
  answer_options?: string[];
  answer_number?: number;
}

export function ChurchSurveys({ churchId }: ChurchSurveysProps) {
  const { user } = useAuth();
  const { role } = useChurchMembership();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const isLeader = role === 'admin' || role === 'leader' || role === 'pastor';

  useEffect(() => {
    loadSurveys();
  }, [churchId]);

  const loadSurveys = async () => {
    try {
      const { data, error } = await (supabase
        .from('church_surveys')
        .select('*')
        .eq('church_id', churchId)
        .eq('status', 'active')
        .order('created_at', { ascending: false }) as any);

      if (error) throw error;
      setSurveys(data || []);
    } catch (error) {
      console.error('Error loading surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSurveyQuestions = async (surveyId: string) => {
    try {
      const { data, error } = await (supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('display_order', { ascending: true }) as any);

      if (error) throw error;
      setQuestions(data || []);

      // Check if user has already responded
      if (user) {
        const { data: existing } = await (supabase
          .from('survey_responses')
          .select('id')
          .eq('survey_id', surveyId)
          .eq('user_id', user.id)
          .single() as any);
        
        setHasResponded(!!existing);
      }

      // Initialize answers
      setAnswers((data || []).map((q: Question) => ({
        question_id: q.id,
      })));
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const loadResults = async (surveyId: string) => {
    try {
      const { data, error } = await (supabase.rpc as any)('get_survey_results', {
        p_survey_id: surveyId
      });

      if (error) throw error;
      setResults(data || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error loading results:', error);
      toast.error('Failed to load results');
    }
  };

  const handleSelectSurvey = async (survey: Survey) => {
    setSelectedSurvey(survey);
    setShowResults(false);
    await loadSurveyQuestions(survey.id);
  };

  const updateAnswer = (questionId: string, update: Partial<Answer>) => {
    setAnswers(prev => prev.map(a => 
      a.question_id === questionId ? { ...a, ...update } : a
    ));
  };

  const submitResponse = async () => {
    if (!selectedSurvey || !user) return;

    setSubmitting(true);
    try {
      // Create response
      const { data: response, error: responseError } = await (supabase
        .from('survey_responses')
        .insert({
          survey_id: selectedSurvey.id,
          user_id: selectedSurvey.is_anonymous ? null : user.id,
        })
        .select()
        .single() as any);

      if (responseError) throw responseError;

      // Insert answers
      const answersToInsert = answers.filter(a => 
        a.answer_text || a.answer_option || a.answer_options?.length || a.answer_number
      ).map(a => ({
        response_id: response.id,
        question_id: a.question_id,
        answer_text: a.answer_text || null,
        answer_option: a.answer_option || null,
        answer_options: a.answer_options || null,
        answer_number: a.answer_number || null,
      }));

      if (answersToInsert.length > 0) {
        const { error: answersError } = await (supabase
          .from('survey_answers')
          .insert(answersToInsert) as any);

        if (answersError) throw answersError;
      }

      toast.success('Response submitted!');
      setHasResponded(true);

      if (selectedSurvey.show_results_to_all) {
        await loadResults(selectedSurvey.id);
      }
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast.error(error.message || 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Surveys & Polls
          </h2>
          <p className="text-muted-foreground">
            Share your feedback and participate in church decisions
          </p>
        </div>
      </div>

      {/* Survey Detail View */}
      <AnimatePresence mode="wait">
        {selectedSurvey ? (
          <motion.div
            key="survey-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedSurvey(null);
                setShowResults(false);
              }}
              className="mb-4"
            >
              <X className="h-4 w-4 mr-2" />
              Back to Surveys
            </Button>

            <Card className="backdrop-blur-xl bg-white/10 border-white/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{selectedSurvey.title}</CardTitle>
                    {selectedSurvey.description && (
                      <CardDescription className="mt-2">
                        {selectedSurvey.description}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedSurvey.is_anonymous && (
                      <Badge variant="secondary">Anonymous</Badge>
                    )}
                    <Badge>
                      {selectedSurvey.survey_type === 'poll' ? 'Poll' : 'Survey'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Show Results */}
                {showResults ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-green-500">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Thank you for your response!</span>
                    </div>

                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Results
                    </h3>

                    {results.map((result, idx) => (
                      <div key={idx} className="space-y-3 p-4 rounded-lg bg-white/5">
                        <p className="font-medium">{result.question_text}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.total_responses} response(s)
                        </p>

                        {result.question_type === 'multiple_choice' || result.question_type === 'yes_no' ? (
                          <div className="space-y-2">
                            {result.results?.map((opt: any, i: number) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                  <span>{opt.option}</span>
                                  <span>{opt.count} vote(s)</span>
                                </div>
                                <Progress 
                                  value={result.total_responses > 0 
                                    ? (opt.count / result.total_responses) * 100 
                                    : 0
                                  } 
                                  className="h-2"
                                />
                              </div>
                            ))}
                          </div>
                        ) : result.question_type === 'rating' || result.question_type === 'scale' ? (
                          <div className="text-center">
                            <div className="text-3xl font-bold text-primary">
                              {result.results?.average?.toFixed(1) || 'N/A'}
                            </div>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : hasResponded ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Already Submitted</h3>
                    <p className="text-muted-foreground mb-4">
                      You have already submitted your response to this survey.
                    </p>
                    {selectedSurvey.show_results_to_all && (
                      <Button onClick={() => loadResults(selectedSurvey.id)}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    )}
                  </div>
                ) : (
                  /* Questions Form */
                  <div className="space-y-6">
                    {questions.map((question, idx) => (
                      <div key={question.id} className="space-y-3 p-4 rounded-lg bg-white/5">
                        <Label className="text-base font-medium">
                          {idx + 1}. {question.question_text}
                          {question.is_required && <span className="text-red-500 ml-1">*</span>}
                        </Label>

                        {question.question_type === 'multiple_choice' && (
                          <RadioGroup
                            value={answers.find(a => a.question_id === question.id)?.answer_option || ''}
                            onValueChange={(value) => updateAnswer(question.id, { answer_option: value })}
                          >
                            {question.options.map((option, i) => (
                              <div key={i} className="flex items-center space-x-2">
                                <RadioGroupItem value={option} id={question.id + "-" + i} />
                                <Label htmlFor={question.id + "-" + i}>{option}</Label>
                              </div>
                            ))}
                          </RadioGroup>
                        )}

                        {question.question_type === 'yes_no' && (
                          <RadioGroup
                            value={answers.find(a => a.question_id === question.id)?.answer_option || ''}
                            onValueChange={(value) => updateAnswer(question.id, { answer_option: value })}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Yes" id={question.id + "-yes"} />
                              <Label htmlFor={question.id + "-yes"}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="No" id={question.id + "-no"} />
                              <Label htmlFor={question.id + "-no"}>No</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Maybe" id={question.id + "-maybe"} />
                              <Label htmlFor={question.id + "-maybe"}>Maybe</Label>
                            </div>
                          </RadioGroup>
                        )}

                        {question.question_type === 'checkbox' && (
                          <div className="space-y-2">
                            {question.options.map((option, i) => {
                              const currentOptions = answers.find(a => a.question_id === question.id)?.answer_options || [];
                              return (
                                <div key={i} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={question.id + "-" + i}
                                    checked={currentOptions.includes(option)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        updateAnswer(question.id, { answer_options: [...currentOptions, option] });
                                      } else {
                                        updateAnswer(question.id, { answer_options: currentOptions.filter(o => o !== option) });
                                      }
                                    }}
                                  />
                                  <Label htmlFor={question.id + "-" + i}>{option}</Label>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {(question.question_type === 'rating' || question.question_type === 'scale') && (
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>{question.min_label || question.min_value}</span>
                              <span>{question.max_label || question.max_value}</span>
                            </div>
                            <Slider
                              min={question.min_value}
                              max={question.max_value}
                              step={1}
                              value={[answers.find(a => a.question_id === question.id)?.answer_number || question.min_value]}
                              onValueChange={(value) => updateAnswer(question.id, { answer_number: value[0] })}
                            />
                            <div className="text-center font-bold text-lg">
                              {answers.find(a => a.question_id === question.id)?.answer_number || question.min_value}
                            </div>
                          </div>
                        )}

                        {question.question_type === 'text' && (
                          <Input
                            placeholder="Your answer..."
                            value={answers.find(a => a.question_id === question.id)?.answer_text || ''}
                            onChange={(e) => updateAnswer(question.id, { answer_text: e.target.value })}
                          />
                        )}

                        {question.question_type === 'long_text' && (
                          <Textarea
                            placeholder="Your answer..."
                            rows={4}
                            value={answers.find(a => a.question_id === question.id)?.answer_text || ''}
                            onChange={(e) => updateAnswer(question.id, { answer_text: e.target.value })}
                          />
                        )}
                      </div>
                    ))}

                    <Button
                      onClick={submitResponse}
                      disabled={submitting}
                      className="w-full"
                      size="lg"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Submit Response
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          /* Survey List */
          <motion.div
            key="survey-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {surveys.length === 0 ? (
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardContent className="py-12 text-center">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Active Surveys</h3>
                  <p className="text-muted-foreground">
                    There are no surveys or polls available right now.
                    Check back later!
                  </p>
                </CardContent>
              </Card>
            ) : (
              surveys.map((survey) => (
                <motion.div
                  key={survey.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <Card
                    className="backdrop-blur-xl bg-white/10 border-white/20 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => handleSelectSurvey(survey)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{survey.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {survey.survey_type === 'poll' ? 'Poll' : 'Survey'}
                            </Badge>
                            {survey.is_anonymous && (
                              <Badge variant="outline" className="text-xs">Anonymous</Badge>
                            )}
                          </div>
                          {survey.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {survey.description}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {survey.ends_at 
                                ? "Ends " + format(new Date(survey.ends_at), "MMM d")
                                : "No deadline"
                              }
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
