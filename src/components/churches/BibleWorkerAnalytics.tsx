import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, Users, UserCheck, Loader2, Droplets } from "lucide-react";
import { format } from "date-fns";

interface BibleWorkerAnalyticsProps {
  churchId: string;
}

interface WorkerStats {
  workerId: string;
  workerName: string;
  candidates: {
    id: string;
    name: string;
    email: string | null;
    stage: string;
    completedLessons: number;
    lastActive: string | null;
  }[];
}

export function BibleWorkerAnalytics({ churchId }: BibleWorkerAnalyticsProps) {
  // Fetch candidates with bible_worker_id
  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: ["bw-analytics-candidates", churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("baptism_candidates")
        .select("id, name, email, stage, bible_worker_id, created_at")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!churchId,
  });

  // Fetch progress for all candidates
  const { data: progressData } = useQuery({
    queryKey: ["bw-analytics-progress", churchId],
    queryFn: async () => {
      if (!candidates?.length) return [];
      const candidateIds = candidates.map(c => c.id);
      const { data, error } = await supabase
        .from("baptism_candidate_progress")
        .select("candidate_id, state, last_active_at")
        .in("candidate_id", candidateIds);
      if (error) throw error;
      return data;
    },
    enabled: !!candidates?.length,
  });

  // Fetch bible worker profiles
  const { data: workerProfiles } = useQuery({
    queryKey: ["bw-analytics-profiles", churchId],
    queryFn: async () => {
      if (!candidates?.length) return [];
      const workerIds = [...new Set(candidates.map(c => c.bible_worker_id).filter(Boolean))] as string[];
      if (!workerIds.length) return [];

      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .in("id", workerIds);
      if (error) throw error;
      return data;
    },
    enabled: !!candidates?.length,
  });

  // Fetch ministry leaders with bible_worker role
  const { data: bibleWorkers } = useQuery({
    queryKey: ["bw-analytics-leaders", churchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ministry_leaders")
        .select("user_id, is_active")
        .eq("church_id", churchId)
        .eq("role", "bible_worker")
        .eq("is_active", true);
      if (error) throw error;

      if (!data?.length) return [];

      const userIds = data.map(d => d.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, username")
        .in("id", userIds);
      return profiles || [];
    },
    enabled: !!churchId,
  });

  if (candidatesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Build worker stats
  const getWorkerName = (id: string) => {
    const profile = workerProfiles?.find(p => p.id === id);
    return profile?.display_name || profile?.username || "Unknown Worker";
  };

  const getCandidateCompleted = (candidateId: string) => {
    return progressData?.filter(p => p.candidate_id === candidateId && p.state === "completed").length || 0;
  };

  const getCandidateLastActive = (candidateId: string) => {
    const activities = progressData
      ?.filter(p => p.candidate_id === candidateId && p.last_active_at)
      .map(p => p.last_active_at!)
      .sort()
      .reverse();
    return activities?.[0] || null;
  };

  // Group candidates by bible worker
  const workerStatsMap = new Map<string, WorkerStats>();

  // Include all registered bible workers (even if no candidates yet)
  bibleWorkers?.forEach(bw => {
    workerStatsMap.set(bw.id, {
      workerId: bw.id,
      workerName: bw.display_name || bw.username || "Unknown",
      candidates: [],
    });
  });

  candidates?.forEach(c => {
    const workerId = c.bible_worker_id || "unassigned";
    if (!workerStatsMap.has(workerId)) {
      workerStatsMap.set(workerId, {
        workerId,
        workerName: workerId === "unassigned" ? "Unassigned" : getWorkerName(workerId),
        candidates: [],
      });
    }
    workerStatsMap.get(workerId)!.candidates.push({
      id: c.id,
      name: c.name,
      email: c.email,
      stage: c.stage,
      completedLessons: getCandidateCompleted(c.id),
      lastActive: getCandidateLastActive(c.id),
    });
  });

  const workerStats = Array.from(workerStatsMap.values()).sort((a, b) => {
    if (a.workerId === "unassigned") return 1;
    if (b.workerId === "unassigned") return -1;
    return b.candidates.length - a.candidates.length;
  });

  const totalCandidates = candidates?.length || 0;
  const assignedCandidates = candidates?.filter(c => c.bible_worker_id).length || 0;
  const totalWorkers = bibleWorkers?.length || 0;
  const baptizedCount = candidates?.filter(c => c.stage === "baptized").length || 0;

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "interested": return "bg-muted text-muted-foreground";
      case "studying": return "bg-blue-500/10 text-blue-600 border-blue-500/30";
      case "ready": return "bg-green-500/10 text-green-600 border-green-500/30";
      case "scheduled": return "bg-purple-500/10 text-purple-600 border-purple-500/30";
      case "baptized": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Bible Workers</span>
            </div>
            <div className="text-2xl font-bold">{totalWorkers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Students</span>
            </div>
            <div className="text-2xl font-bold">{totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Assigned</span>
            </div>
            <div className="text-2xl font-bold">{assignedCandidates}/{totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Baptized</span>
            </div>
            <div className="text-2xl font-bold text-emerald-500">{baptizedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Worker-to-Candidate Breakdown */}
      {workerStats.map((worker) => (
        <Card key={worker.workerId}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{worker.workerName}</CardTitle>
                  <CardDescription>
                    {worker.candidates.length} candidate{worker.candidates.length !== 1 ? "s" : ""}
                    {worker.workerId === "unassigned" && " — need to be assigned to a Bible worker"}
                  </CardDescription>
                </div>
              </div>
              {worker.workerId !== "unassigned" && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                  Bible Worker
                </Badge>
              )}
            </div>
          </CardHeader>
          {worker.candidates.length > 0 && (
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Last Active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {worker.candidates.map((candidate) => {
                    const progressPercent = Math.round((candidate.completedLessons / 28) * 100);
                    return (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">{candidate.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {candidate.email || "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercent} className="w-20 h-2" />
                            <span className="text-sm text-muted-foreground">
                              {candidate.completedLessons}/28
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStageColor(candidate.stage)}>
                            {candidate.stage}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {candidate.lastActive
                            ? format(new Date(candidate.lastActive), "MMM d, yyyy")
                            : "Never"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          )}
        </Card>
      ))}

      {workerStats.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No Bible workers or baptism candidates yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
