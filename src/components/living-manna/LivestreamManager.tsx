import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Video, Plus, Play, ExternalLink, Calendar, Trash2, KeyRound } from "lucide-react";
import { StreamKeyVault } from "./StreamKeyVault";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Livestream {
  id: string;
  title: string;
  platform: string;
  embed_url: string;
  is_live: boolean;
  scheduled_at: string | null;
  ended_at: string | null;
  created_at: string;
}

interface LivestreamManagerProps {
  churchId: string;
}

export function LivestreamManager({ churchId }: LivestreamManagerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [livestreams, setLivestreams] = useState<Livestream[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStream, setNewStream] = useState({
    title: "",
    platform: "youtube",
    embed_url: "",
    scheduled_at: "",
  });

  useEffect(() => {
    loadLivestreams();
  }, [churchId]);

  const loadLivestreams = async () => {
    try {
      const { data, error } = await supabase
        .from("church_livestreams")
        .select("*")
        .eq("church_id", churchId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLivestreams(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading livestreams",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createLivestream = async () => {
    if (!newStream.title || !newStream.embed_url) {
      toast({
        title: "Missing fields",
        description: "Please enter a title and embed URL",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from("church_livestreams")
        .insert({
          church_id: churchId,
          title: newStream.title,
          platform: newStream.platform,
          embed_url: newStream.embed_url,
          scheduled_at: newStream.scheduled_at || null,
          created_by: user?.id,
        });

      if (error) throw error;
      toast({
        title: "Livestream created",
        description: "Your livestream has been added.",
      });
      setDialogOpen(false);
      setNewStream({ title: "", platform: "youtube", embed_url: "", scheduled_at: "" });
      loadLivestreams();
    } catch (error: any) {
      toast({
        title: "Error creating livestream",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const toggleLiveStatus = async (id: string, isLive: boolean) => {
    try {
      const { error } = await supabase
        .from("church_livestreams")
        .update({ 
          is_live: !isLive,
          ended_at: isLive ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (error) throw error;
      loadLivestreams();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteLivestream = async (id: string) => {
    try {
      const { error } = await supabase
        .from("church_livestreams")
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadLivestreams();
    } catch (error: any) {
      toast({
        title: "Error deleting livestream",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getEmbedHtml = (stream: Livestream) => {
    const url = stream.embed_url;
    if (stream.platform === "youtube") {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)?.[1];
      if (videoId) {
        return `<iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    if (stream.platform === "vimeo") {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      if (videoId) {
        return `<iframe width="100%" height="200" src="https://player.vimeo.com/video/${videoId}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      }
    }
    return null;
  };

  const platformColors: Record<string, string> = {
    youtube: "bg-red-500/10 text-red-600 border-red-500/30",
    zoom: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    vimeo: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
    facebook: "bg-indigo-500/10 text-indigo-600 border-indigo-500/30",
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <StreamKeyVault churchId={churchId} />

      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle>Livestreams</CardTitle>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Livestream
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Livestream</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={newStream.title}
                      onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                      placeholder="Sunday Worship Service"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Select
                      value={newStream.platform}
                      onValueChange={(value) => setNewStream({ ...newStream, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="vimeo">Vimeo</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Embed URL or Video Link</Label>
                    <Input
                      value={newStream.embed_url}
                      onChange={(e) => setNewStream({ ...newStream, embed_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Scheduled Date/Time (Optional)</Label>
                    <Input
                      type="datetime-local"
                      value={newStream.scheduled_at}
                      onChange={(e) => setNewStream({ ...newStream, scheduled_at: e.target.value })}
                    />
                  </div>
                  <Button onClick={createLivestream} disabled={creating} className="w-full">
                    {creating ? "Creating..." : "Add Livestream"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <CardDescription>Embed YouTube, Zoom, Vimeo, or Facebook livestreams</CardDescription>
        </CardHeader>
        <CardContent>
          {livestreams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No livestreams added yet. Click "Add Livestream" to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {livestreams.map((stream) => {
                const embedHtml = getEmbedHtml(stream);
                return (
                  <Card key={stream.id} className="overflow-hidden">
                    {embedHtml ? (
                      <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
                    ) : (
                      <div className="h-48 bg-muted flex items-center justify-center">
                        <Video className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-medium">{stream.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={platformColors[stream.platform]}>
                              {stream.platform}
                            </Badge>
                            {stream.is_live && (
                              <Badge variant="destructive" className="animate-pulse">
                                LIVE
                              </Badge>
                            )}
                          </div>
                          {stream.scheduled_at && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(stream.scheduled_at), "PPp")}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant={stream.is_live ? "destructive" : "default"}
                            size="sm"
                            onClick={() => toggleLiveStatus(stream.id, stream.is_live)}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {stream.is_live ? "End" : "Go Live"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(stream.embed_url, "_blank")}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteLivestream(stream.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
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
    </div>
  );
}
