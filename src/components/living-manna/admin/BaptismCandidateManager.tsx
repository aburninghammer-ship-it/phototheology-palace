import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Users, AlertTriangle, CheckCircle2, Clock, Calendar, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface BaptismCandidateManagerProps {
  churchId: string;
}

interface Candidate {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  stage: string;
  scheduled_baptism_date: string | null;
  baptism_class_completed: boolean;
  pastoral_interview_date: string | null;
  created_at: string;
}

interface CandidateProgress {
  candidate_id: string;
  completed_count: number;
  total_lessons: number;
  has_flags: boolean;
  last_active: string | null;
}

interface ReadinessAssessment {
  id: string;
  candidate_id: string;
  knowledge_score: number | null;
  practice_score: number | null;
  heart_score: number | null;
  mentor_notes: string | null;
  recommendation: string | null;
  assessed_at: string;
}

export function BaptismCandidateManager({ churchId }: BaptismCandidateManagerProps) {
  const queryClient = useQueryClient();
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [assessmentForm, setAssessmentForm] = useState({
    knowledge_score: 0,
    practice_score: 0,
    heart_score: 0,
    mentor_notes: "",
    recommendation: "continue" as "continue" | "review" | "ready_for_interview",
  });

  // Fetch all candidates for this church
  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ["baptism-candidates-admin", churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("baptism_candidates")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Candidate[];
    },
    enabled: !!churchId,
  });

  // Fetch progress for all candidates
  const { data: progressData } = useQuery({
    queryKey: ["baptism-progress-admin", churchId],
    queryFn: async () => {
      if (!candidates?.length) return [];

      const candidateIds = candidates.map(c => c.id);
      const { data, error } = await supabase
        .from("baptism_candidate_progress")
        .select("candidate_id, state, pastoral_flags, last_active_at")
        .in("candidate_id", candidateIds);

      if (error) throw error;

      // Aggregate progress per candidate
      const progressMap = new Map<string, CandidateProgress>();

      for (const candidate of candidates) {
        const candidateProgress = data?.filter(p => p.candidate_id === candidate.id) || [];
        const completed = candidateProgress.filter(p => p.state === "completed").length;
        const hasFlags = candidateProgress.some(p =>
          p.pastoral_flags && Array.isArray(p.pastoral_flags) && p.pastoral_flags.length > 0
        );
        const lastActive = candidateProgress
          .map(p => p.last_active_at)
          .filter(Boolean)
          .sort()
          .reverse()[0] || null;

        progressMap.set(candidate.id, {
          candidate_id: candidate.id,
          completed_count: completed,
          total_lessons: 28,
          has_flags: hasFlags,
          last_active: lastActive,
        });
      }

      return Array.from(progressMap.values());
    },
    enabled: !!candidates?.length,
  });

  // Fetch readiness assessments
  const { data: assessments } = useQuery({
    queryKey: ["baptism-assessments-admin", selectedCandidate?.id],
    queryFn: async () => {
      if (!selectedCandidate) return [];
      const { data, error } = await supabase
        .from("baptism_readiness_assessments")
        .select("*")
        .eq("candidate_id", selectedCandidate.id)
        .order("assessed_at", { ascending: false });
      if (error) throw error;
      return data as ReadinessAssessment[];
    },
    enabled: !!selectedCandidate,
  });

  // Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCandidate) throw new Error("No candidate selected");
      const { error } = await supabase
        .from("baptism_readiness_assessments")
        .insert({
          candidate_id: selectedCandidate.id,
          knowledge_score: assessmentForm.knowledge_score,
          practice_score: assessmentForm.practice_score,
          heart_score: assessmentForm.heart_score,
          mentor_notes: assessmentForm.mentor_notes,
          recommendation: assessmentForm.recommendation,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Assessment saved");
      setAssessmentDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["baptism-assessments-admin"] });
      setAssessmentForm({
        knowledge_score: 0,
        practice_score: 0,
        heart_score: 0,
        mentor_notes: "",
        recommendation: "continue",
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to save assessment");
    },
  });

  // Update candidate stage
  const updateStageMutation = useMutation({
    mutationFn: async ({ candidateId, stage }: { candidateId: string; stage: string }) => {
      const { error } = await supabase
        .from("baptism_candidates")
        .update({ stage })
        .eq("id", candidateId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Stage updated");
      queryClient.invalidateQueries({ queryKey: ["baptism-candidates-admin"] });
    },
  });

  const getCandidateProgress = (candidateId: string): CandidateProgress | undefined => {
    return progressData?.find(p => p.candidate_id === candidateId);
  };

  const getProgressColor = (completed: number, total: number) => {
    const percent = (completed / total) * 100;
    if (percent >= 100) return "bg-green-500";
    if (percent >= 50) return "bg-blue-500";
    if (percent > 0) return "bg-yellow-500";
    return "bg-gray-300";
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "interested": return "bg-gray-500";
      case "studying": return "bg-blue-500";
      case "ready": return "bg-green-500";
      case "scheduled": return "bg-purple-500";
      case "baptized": return "bg-emerald-600";
      default: return "bg-gray-500";
    }
  };

  if (candidatesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Baptism Candidates</CardTitle>
                <CardDescription>
                  Manage and track baptism candidates through the 28 Fundamental Beliefs
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => queryClient.invalidateQueries({ queryKey: ["baptism-candidates-admin"] })}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{candidates?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Candidates</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-500">
              {candidates?.filter(c => c.stage === "studying").length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Currently Studying</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">
              {candidates?.filter(c => c.stage === "ready").length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Ready for Interview</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-500">
              {progressData?.filter(p => p.has_flags).length || 0}
            </div>
            <div className="text-sm text-muted-foreground">Need Attention</div>
          </CardContent>
        </Card>
      </div>

      {/* Candidates Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Flags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates?.map((candidate) => {
                const progress = getCandidateProgress(candidate.id);
                const progressPercent = progress
                  ? Math.round((progress.completed_count / progress.total_lessons) * 100)
                  : 0;

                return (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-muted-foreground">{candidate.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={progressPercent} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">
                          {progress?.completed_count || 0}/28
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={candidate.stage}
                        onValueChange={(value) => updateStageMutation.mutate({
                          candidateId: candidate.id,
                          stage: value,
                        })}
                      >
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="interested">Interested</SelectItem>
                          <SelectItem value="studying">Studying</SelectItem>
                          <SelectItem value="ready">Ready</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="baptized">Baptized</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {progress?.last_active ? (
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(progress.last_active), "MMM d")}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {progress?.has_flags ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Needs Attention
                        </Badge>
                      ) : progress?.completed_count === 28 ? (
                        <Badge className="bg-green-500 gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          On Track
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setAssessmentDialogOpen(true);
                        }}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Assess
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {(!candidates || candidates.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No baptism candidates yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assessment Dialog */}
      <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Readiness Assessment</DialogTitle>
            <DialogDescription>
              Evaluate {selectedCandidate?.name}'s readiness for baptism
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Knowledge Score */}
            <div>
              <label className="text-sm font-medium">Knowledge Score (0-100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={assessmentForm.knowledge_score}
                onChange={(e) => setAssessmentForm({
                  ...assessmentForm,
                  knowledge_score: parseInt(e.target.value) || 0,
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Understanding of the 28 Fundamental Beliefs
              </p>
            </div>

            {/* Heart Score */}
            <div>
              <label className="text-sm font-medium">Heart Score (0-100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={assessmentForm.heart_score}
                onChange={(e) => setAssessmentForm({
                  ...assessmentForm,
                  heart_score: parseInt(e.target.value) || 0,
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Spiritual conviction and commitment
              </p>
            </div>

            {/* Practice Score */}
            <div>
              <label className="text-sm font-medium">Practice Score (0-100)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={assessmentForm.practice_score}
                onChange={(e) => setAssessmentForm({
                  ...assessmentForm,
                  practice_score: parseInt(e.target.value) || 0,
                })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Living out the faith in daily life
              </p>
            </div>

            {/* Recommendation */}
            <div>
              <label className="text-sm font-medium">Recommendation</label>
              <Select
                value={assessmentForm.recommendation}
                onValueChange={(value: any) => setAssessmentForm({
                  ...assessmentForm,
                  recommendation: value,
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="continue">Continue Studies</SelectItem>
                  <SelectItem value="review">Needs Review</SelectItem>
                  <SelectItem value="ready_for_interview">Ready for Interview</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium">Mentor Notes</label>
              <Textarea
                placeholder="Add any observations or recommendations..."
                value={assessmentForm.mentor_notes}
                onChange={(e) => setAssessmentForm({
                  ...assessmentForm,
                  mentor_notes: e.target.value,
                })}
                rows={3}
              />
            </div>

            {/* Previous Assessments */}
            {assessments && assessments.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Previous Assessments</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {assessments.slice(0, 3).map((a) => (
                    <div key={a.id} className="text-xs p-2 rounded bg-muted">
                      <div className="flex justify-between">
                        <span>{format(new Date(a.assessed_at), "MMM d, yyyy")}</span>
                        <Badge variant="outline" className="text-xs">
                          {a.recommendation?.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground mt-1">
                        K: {a.knowledge_score}% | H: {a.heart_score}% | P: {a.practice_score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAssessmentDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createAssessmentMutation.mutate()}
              disabled={createAssessmentMutation.isPending}
            >
              {createAssessmentMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Save Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
