import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClipboardList, Plus, CheckCircle2, BarChart3, Star } from "lucide-react";
import { format, parseISO, isFuture, isPast } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ChurchSurveysProps {
  churchId: string;
}

interface Survey {
  id: string;
  title: string;
  description: string | null;
  survey_type: string;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  is_anonymous: boolean;
  created_by: string | null;
  created_at: string;
}

interface SurveyQuestion {
  id: string;
  survey_id: string;
  question_text: string;
  question_type: string;
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
}

const QUESTION_TYPES = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "checkbox", label: "Checkbox (Multiple)" },
  { value: "rating", label: "Rating Scale (1-5)" },
  { value: "text", label: "Text Response" },
  { value: "yes_no", label: "Yes / No" },
];

export function ChurchSurveys({ churchId }: ChurchSurveysProps) {
  const { user } = useAuth();
  const { role } = useChurchMembership();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<Record<string, string | string[]>>({});

  const canManage = role === "admin" || role === "leader";

  // Fetch surveys
  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ["church-surveys", churchId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("church_surveys")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Survey[];
    },
    enabled: !!churchId,
  });

  // Fetch questions for selected survey
  const { data: questions = [] } = useQuery({
    queryKey: ["survey-questions", selectedSurvey?.id],
    queryFn: async () => {
      if (!selectedSurvey) return [];
      const { data, error } = await (supabase as any)
        .from("church_survey_questions")
        .select("*")
        .eq("survey_id", selectedSurvey.id)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as SurveyQuestion[];
    },
    enabled: !!selectedSurvey,
  });

  // Create survey mutation
  const createSurvey = useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      survey_type: string;
      is_anonymous: boolean;
      ends_at?: string;
      questions: { text: string; type: string; options?: string[] }[];
    }) => {
      // Create survey
      const { data: survey, error: surveyError } = await (supabase as any)
        .from("church_surveys")
        .insert({
          church_id: churchId,
          title: data.title,
          description: data.description,
          survey_type: data.survey_type,
          is_anonymous: data.is_anonymous,
          ends_at: data.ends_at || null,
          status: "active",
          created_by: user?.id,
        })
        .select()
        .single();

      if (surveyError) throw surveyError;

      // Create questions
      if (data.questions.length > 0) {
        const { error: questionsError } = await (supabase as any)
          .from("church_survey_questions")
          .insert(
            data.questions.map((q, i) => ({
              survey_id: survey.id,
              question_text: q.text,
              question_type: q.type,
              options: q.options || null,
              sort_order: i,
            }))
          );

        if (questionsError) throw questionsError;
      }

      return survey;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["church-surveys", churchId] });
      setIsCreateOpen(false);
      toast({ title: "Survey Created", description: "Your survey is now active." });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create survey.", variant: "destructive" });
      console.error(error);
    },
  });

  // Submit response mutation
  const submitResponses = useMutation({
    mutationFn: async () => {
      if (!selectedSurvey || !user) throw new Error("No survey selected");

      const responseData = Object.entries(responses).map(([questionId, value]) => ({
        survey_id: selectedSurvey.id,
        question_id: questionId,
        user_id: selectedSurvey.is_anonymous ? null : user.id,
        response_value: Array.isArray(value) ? value.join(",") : value,
        response_data: { value },
      }));

      const { error } = await (supabase as any)
        .from("church_survey_responses")
        .insert(responseData);

      if (error) throw error;
    },
    onSuccess: () => {
      setSelectedSurvey(null);
      setResponses({});
      toast({ title: "Response Submitted", description: "Thank you for your feedback!" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to submit response.", variant: "destructive" });
      console.error(error);
    },
  });

  const handleCreateSurvey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse questions from form
    const questionsData: { text: string; type: string; options?: string[] }[] = [];
    let i = 0;
    while (formData.get(`question_${i}_text`)) {
      const text = formData.get(`question_${i}_text`) as string;
      const type = formData.get(`question_${i}_type`) as string;
      const optionsStr = formData.get(`question_${i}_options`) as string;
      
      questionsData.push({
        text,
        type,
        options: optionsStr ? optionsStr.split(",").map(o => o.trim()) : undefined,
      });
      i++;
    }

    createSurvey.mutate({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      survey_type: formData.get("survey_type") as string,
      is_anonymous: formData.get("is_anonymous") === "true",
      ends_at: formData.get("ends_at") as string || undefined,
      questions: questionsData,
    });
  };

  const activeSurveys = surveys.filter(s => s.status === "active");
  const closedSurveys = surveys.filter(s => s.status === "closed");

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Loading surveys...</div>
        </CardContent>
      </Card>
    );
  }

  // Survey response view
  if (selectedSurvey) {
    return (
      <div className="space-y-6">
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedSurvey.title}</CardTitle>
                {selectedSurvey.description && (
                  <CardDescription>{selectedSurvey.description}</CardDescription>
                )}
              </div>
              <Button variant="outline" onClick={() => setSelectedSurvey(null)}>
                Back to Surveys
              </Button>
            </div>
            {selectedSurvey.is_anonymous && (
              <Badge variant="secondary">Anonymous Survey</Badge>
            )}
          </CardHeader>
        </Card>

        <form onSubmit={(e) => { e.preventDefault(); submitResponses.mutate(); }}>
          <div className="space-y-4">
            {questions.map((question, index) => (
              <Card key={question.id} variant="glass">
                <CardContent className="pt-6">
                  <Label className="text-base font-medium">
                    {index + 1}. {question.question_text}
                    {question.is_required && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  <div className="mt-4">
                    {question.question_type === "multiple_choice" && question.options && (
                      <RadioGroup
                        value={responses[question.id] as string || ""}
                        onValueChange={(value) =>
                          setResponses(prev => ({ ...prev, [question.id]: value }))
                        }
                      >
                        {question.options.map((option, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`${question.id}-${i}`} />
                            <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {question.question_type === "checkbox" && question.options && (
                      <div className="space-y-2">
                        {question.options.map((option, i) => {
                          const currentValues = (responses[question.id] as string[]) || [];
                          return (
                            <div key={i} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${question.id}-${i}`}
                                checked={currentValues.includes(option)}
                                onCheckedChange={(checked) => {
                                  const newValues = checked
                                    ? [...currentValues, option]
                                    : currentValues.filter(v => v !== option);
                                  setResponses(prev => ({ ...prev, [question.id]: newValues }));
                                }}
                              />
                              <Label htmlFor={`${question.id}-${i}`}>{option}</Label>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {question.question_type === "rating" && (
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Button
                            key={rating}
                            type="button"
                            variant={responses[question.id] === rating.toString() ? "default" : "outline"}
                            size="lg"
                            className="w-12 h-12"
                            onClick={() =>
                              setResponses(prev => ({ ...prev, [question.id]: rating.toString() }))
                            }
                          >
                            {rating}
                          </Button>
                        ))}
                      </div>
                    )}

                    {question.question_type === "yes_no" && (
                      <RadioGroup
                        value={responses[question.id] as string || ""}
                        onValueChange={(value) =>
                          setResponses(prev => ({ ...prev, [question.id]: value }))
                        }
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                          <Label htmlFor={`${question.id}-yes`}>Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id={`${question.id}-no`} />
                          <Label htmlFor={`${question.id}-no`}>No</Label>
                        </div>
                      </RadioGroup>
                    )}

                    {question.question_type === "text" && (
                      <Textarea
                        value={responses[question.id] as string || ""}
                        onChange={(e) =>
                          setResponses(prev => ({ ...prev, [question.id]: e.target.value }))
                        }
                        placeholder="Enter your response..."
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={submitResponses.isPending}>
              {submitResponses.isPending ? "Submitting..." : "Submit Response"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle>Surveys & Polls</CardTitle>
            </div>
            {canManage && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Survey
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Survey</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateSurvey} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Survey Title</Label>
                      <Input id="title" name="title" required placeholder="e.g., Church Service Feedback" />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" placeholder="Brief description..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="survey_type">Type</Label>
                        <Select name="survey_type" defaultValue="survey">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="survey">Survey</SelectItem>
                            <SelectItem value="poll">Quick Poll</SelectItem>
                            <SelectItem value="feedback">Feedback Form</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="ends_at">End Date (optional)</Label>
                        <Input id="ends_at" name="ends_at" type="date" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="is_anonymous" name="is_anonymous" value="true" />
                      <Label htmlFor="is_anonymous">Anonymous responses</Label>
                    </div>

                    <div className="border-t pt-4">
                      <Label className="text-base font-medium">Questions</Label>
                      <p className="text-sm text-muted-foreground mb-4">Add at least one question</p>

                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg space-y-3">
                          <Input name="question_0_text" placeholder="Question text" required />
                          <Select name="question_0_type" defaultValue="multiple_choice">
                            <SelectTrigger>
                              <SelectValue placeholder="Question type" />
                            </SelectTrigger>
                            <SelectContent>
                              {QUESTION_TYPES.map(type => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input 
                            name="question_0_options" 
                            placeholder="Options (comma separated, for multiple choice)"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={createSurvey.isPending}>
                      {createSurvey.isPending ? "Creating..." : "Create Survey"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          <CardDescription>Share your thoughts and help shape our church community</CardDescription>
        </CardHeader>
      </Card>

      {/* Active Surveys */}
      {activeSurveys.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Active Surveys</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {activeSurveys.map(survey => (
              <Card key={survey.id} variant="glass" className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedSurvey(survey)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="default" className="mb-2">
                        {survey.survey_type === "poll" ? "Quick Poll" : "Survey"}
                      </Badge>
                      <CardTitle className="text-lg">{survey.title}</CardTitle>
                      {survey.description && (
                        <CardDescription className="line-clamp-2">{survey.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                      {survey.ends_at && `Closes ${format(parseISO(survey.ends_at), "MMM d")}`}
                    </span>
                    {survey.is_anonymous && <Badge variant="outline">Anonymous</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {surveys.length === 0 && (
        <Card variant="glass">
          <CardContent className="py-12 text-center">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No surveys available yet.</p>
            {canManage && (
              <Button className="mt-4" onClick={() => setIsCreateOpen(true)}>
                Create First Survey
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
