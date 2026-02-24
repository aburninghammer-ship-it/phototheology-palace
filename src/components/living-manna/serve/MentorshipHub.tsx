import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, Loader2, MessageCircle, CheckCircle2, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MentorshipHubProps { churchId: string; }

const STATUS_COLORS: Record<string,string> = { active:"bg-green-500/10 text-green-600", pending:"bg-yellow-500/10 text-yellow-600", paused:"bg-gray-500/10 text-gray-500", completed:"bg-blue-500/10 text-blue-600" };

export function MentorshipHub({ churchId }: MentorshipHubProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [selectedMentorship, setSelectedMentorship] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionNotes, setSessionNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => { if (user && churchId) loadData(); }, [user, churchId]);

  const loadData = async () => {
    try {
      const { data } = await (supabase as any).from("church_mentorships")
        .select("*").eq("church_id", churchId)
        .or(`mentor_id.eq.${user!.id},mentee_id.eq.${user!.id}`)
        .in("status", ["active", "pending"]);

      if (data) {
        const userIds = [...new Set(data.flatMap((m: any) => [m.mentor_id, m.mentee_id]))] as string[];
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds);
        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
        setMentorships(data.map((m: any) => ({
          ...m,
          mentorProfile: profileMap.get(m.mentor_id),
          menteeProfile: profileMap.get(m.mentee_id),
          isMentor: m.mentor_id === user!.id,
        })));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadSessions = async (mentorship: any) => {
    setSelectedMentorship(mentorship);
    const { data } = await (supabase as any).from("church_mentorship_sessions")
      .select("*").eq("mentorship_id", mentorship.id).order("session_number");
    setSessions(data || []);
  };

  const saveSessionNotes = async (sessionId: string) => {
    setSavingNotes(true);
    try {
      const field = selectedMentorship.isMentor ? "mentor_notes" : "mentee_notes";
      await (supabase as any).from("church_mentorship_sessions")
        .update({ [field]: sessionNotes, completed_at: new Date().toISOString() })
        .eq("id", sessionId);
      toast.success("Notes saved!");
      setSessionNotes("");
      loadSessions(selectedMentorship);
    } catch (err) { toast.error("Failed to save notes"); } finally { setSavingNotes(false); }
  };

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">My Mentorships</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {mentorships.length === 0 ? (
            <div className="text-center py-8">
              <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No active mentorship pairings.</p>
              <p className="text-xs text-muted-foreground mt-1">Church leaders can set up mentorship pairs.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mentorships.map((m) => {
                const partner = m.isMentor ? m.menteeProfile : m.mentorProfile;
                const progressPct = m.total_milestones > 0 ? (m.current_milestone / m.total_milestones) * 100 : 0;
                return (
                  <Card key={m.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => loadSessions(m)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={partner?.avatar_url} />
                          <AvatarFallback>{(partner?.display_name || "?")[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{partner?.display_name || "Member"}</h4>
                            <Badge variant="outline" className="text-[10px]">{m.isMentor ? "Your Mentee" : "Your Mentor"}</Badge>
                            <Badge variant="outline" className={`text-[10px] ${STATUS_COLORS[m.status]}`}>{m.status}</Badge>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{m.current_milestone}/{m.total_milestones} milestones</span>
                            </div>
                            <Progress value={progressPct} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sessions */}
      {selectedMentorship && (
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No sessions created yet. Leaders will set these up.</p>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-card/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-medium">Session {s.session_number}{s.topic ? `: ${s.topic}` : ""}</h5>
                      {s.completed_at ? (
                        <Badge variant="secondary" className="gap-1 text-[10px]"><CheckCircle2 className="h-3 w-3" />Done</Badge>
                      ) : s.milestone_reached ? (
                        <Badge variant="secondary" className="gap-1 text-[10px]"><Trophy className="h-3 w-3" />Milestone</Badge>
                      ) : null}
                    </div>
                    {s.conversation_guide && (
                      <p className="text-xs text-muted-foreground"><MessageCircle className="h-3 w-3 inline mr-1" />{s.conversation_guide}</p>
                    )}
                    {!s.completed_at && (
                      <div className="space-y-1">
                        <Textarea
                          placeholder="Add your notes for this session..."
                          value={sessionNotes}
                          onChange={(e) => setSessionNotes(e.target.value)}
                          className="text-xs min-h-[60px]"
                        />
                        <Button size="sm" onClick={() => saveSessionNotes(s.id)} disabled={savingNotes || !sessionNotes}>
                          {savingNotes ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}Save Notes
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
