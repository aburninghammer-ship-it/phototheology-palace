import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Megaphone, Trash2, AlertTriangle, CheckCircle, Sparkles, Plus } from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export function AnnouncementManager() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  
  // New announcement form
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<string>("update");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    checkOwnership();
    fetchAllAnnouncements();
  }, [user?.id]);

  const checkOwnership = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'owner')
      .single();
    
    setIsOwner(!!data);
  };

  const fetchAllAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async () => {
    if (!title.trim() || !message.trim()) {
      toast({ title: "Please fill in title and message", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: title.trim(),
          message: message.trim(),
          type,
          created_by: user?.id
        });

      if (error) throw error;

      toast({ title: "Announcement created!" });
      setTitle("");
      setMessage("");
      setType("update");
      fetchAllAnnouncements();
    } catch (error: any) {
      toast({ title: "Error creating announcement", description: error.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const toggleActive = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !currentState })
        .eq('id', id);

      if (error) throw error;
      fetchAllAnnouncements();
    } catch (error: any) {
      toast({ title: "Error updating announcement", variant: "destructive" });
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: "Announcement deleted" });
      fetchAllAnnouncements();
    } catch (error: any) {
      toast({ title: "Error deleting announcement", variant: "destructive" });
    }
  };

  if (!isOwner) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Only the palace owner can manage announcements.
        </CardContent>
      </Card>
    );
  }

  const typeIcons: Record<string, any> = {
    info: Megaphone,
    warning: AlertTriangle,
    success: CheckCircle,
    update: Sparkles
  };

  return (
    <div className="space-y-6">
      {/* Create New Announcement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Announcement
          </CardTitle>
          <CardDescription>
            Send a banner message to all users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="App Update"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update">🎉 Update</SelectItem>
                  <SelectItem value="info">📢 Info</SelectItem>
                  <SelectItem value="success">✅ Success</SelectItem>
                  <SelectItem value="warning">⚠️ Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="We've added new features..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={createAnnouncement} disabled={creating}>
            {creating ? "Creating..." : "Create Announcement"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>All Announcements</CardTitle>
          <CardDescription>
            Manage existing announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : announcements.length === 0 ? (
            <p className="text-muted-foreground">No announcements yet.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => {
                const Icon = typeIcons[ann.type] || Megaphone;
                return (
                  <div
                    key={ann.id}
                    className={`flex items-center justify-between gap-4 p-4 rounded-lg border ${
                      ann.is_active ? "bg-card" : "bg-muted/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                      <div className="min-w-0">
                        <p className="font-medium truncate">{ann.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{ann.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(ann.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`active-${ann.id}`} className="text-xs">
                          Active
                        </Label>
                        <Switch
                          id={`active-${ann.id}`}
                          checked={ann.is_active}
                          onCheckedChange={() => toggleActive(ann.id, ann.is_active)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteAnnouncement(ann.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
