import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Radio, Play, Square, Archive, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SermonOutlineUpload } from "./SermonOutlineUpload";
import { LiveSermonController } from "./LiveSermonController";
import { format } from "date-fns";

interface LiveSermonSession {
  id: string;
  title: string;
  sermon_date: string;
  youtube_url: string | null;
  status: string;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
}

interface LiveSermonDashboardProps {
  churchId: string;
}

export function LiveSermonDashboard({ churchId }: LiveSermonDashboardProps) {
  const [sessions, setSessions] = useState<LiveSermonSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, [churchId]);

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from("live_sermon_sessions")
        .select("id, title, sermon_date, youtube_url, status, started_at, ended_at, created_at")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSessions(data || []);

      // Check for any live session
      const liveSession = data?.find(s => s.status === "live");
      if (liveSession) {
        setActiveSession(liveSession.id);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = async (sessionId: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId);
      const { error } = await supabase
        .from("live_sermon_sessions")
        .update({ status: "live", started_at: new Date().toISOString() })
        .eq("id", sessionId);

      if (error) throw error;

      // Notify all church members via notifications table
      const { data: members } = await supabase
        .from("church_members")
        .select("user_id")
        .eq("church_id", churchId);

      if (members && members.length > 0) {
        const { data: currentUser } = await supabase.auth.getUser();
        const hostId = currentUser?.user?.id;

        const notifications = members
          .filter(m => m.user_id !== hostId)
          .map(m => ({
            user_id: m.user_id,
            type: "live_sermon",
            title: "🔴 Live Sermon Now!",
            message: `"${session?.title || 'A sermon'}" is now live. Join the study!`,
            link: "/living-manna",
            is_read: false,
          }));

        if (notifications.length > 0) {
          await supabase.from("notifications").insert(notifications);
        }
      }

      toast.success("You're live! Study cards will be generated as you preach.");
      setActiveSession(sessionId);
      loadSessions();
    } catch (error: any) {
      toast.error(error.message || "Failed to go live");
    }
  };

  const handleEndSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from("live_sermon_sessions")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", sessionId);

      if (error) throw error;

      toast.success("Session ended. Study cards are saved for your congregation.");
      setActiveSession(null);
      loadSessions();
    } catch (error: any) {
      toast.error(error.message || "Failed to end session");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-red-500 animate-pulse">● LIVE</Badge>;
      case "ended":
        return <Badge variant="secondary">Ended</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  if (activeSession) {
    return (
      <LiveSermonController
        sessionId={activeSession}
        onEnd={() => handleEndSession(activeSession)}
        onBack={() => setActiveSession(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="new">
        <TabsList>
          <TabsTrigger value="new">New Session</TabsTrigger>
          <TabsTrigger value="sessions">Past Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4">
          <SermonOutlineUpload
            churchId={churchId}
            onSessionCreated={(id) => {
              loadSessions();
              toast.success("Session created! Click 'Go Live' when ready.");
            }}
          />
        </TabsContent>

        <TabsContent value="sessions" className="mt-4">
          <div className="grid gap-4">
            {loading ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  Loading sessions...
                </CardContent>
              </Card>
            ) : sessions.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No sermon sessions yet. Create your first one above.
                </CardContent>
              </Card>
            ) : (
              sessions.map((session) => (
                <Card key={session.id} className={session.status === "live" ? "border-red-500" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(session.sermon_date), "MMMM d, yyyy")}
                        </p>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {session.status === "draft" && (
                        <Button size="sm" onClick={() => handleGoLive(session.id)}>
                          <Play className="h-4 w-4 mr-1" />
                          Go Live
                        </Button>
                      )}
                      {session.status === "live" && (
                        <>
                          <Button size="sm" onClick={() => setActiveSession(session.id)}>
                            <Radio className="h-4 w-4 mr-1" />
                            View Dashboard
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleEndSession(session.id)}>
                            <Square className="h-4 w-4 mr-1" />
                            End
                          </Button>
                        </>
                      )}
                      {session.status === "ended" && (
                        <Button size="sm" variant="outline" onClick={() => setActiveSession(session.id)}>
                          <Archive className="h-4 w-4 mr-1" />
                          View Study Cards
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
