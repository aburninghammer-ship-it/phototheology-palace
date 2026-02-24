import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Plus, Bell, Megaphone, AlertTriangle, PartyPopper, Info,
  Trash2, Edit, Pin, PinOff, Eye, EyeOff, Loader2
} from "lucide-react";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  is_active: boolean;
  is_pinned: boolean;
  expires_at: string | null;
  created_at: string;
}

interface AnnouncementsAdminProps {
  churchId: string;
}

const ANNOUNCEMENT_TYPES = [
  { value: 'info', label: 'Info', icon: Info, color: 'bg-blue-500' },
  { value: 'celebration', label: 'Celebration', icon: PartyPopper, color: 'bg-green-500' },
  { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'bg-amber-500' },
  { value: 'urgent', label: 'Urgent', icon: Megaphone, color: 'bg-red-500' },
];

export function AnnouncementsAdmin({ churchId }: AnnouncementsAdminProps) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [isPinned, setIsPinned] = useState(false);
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    loadAnnouncements();
  }, [churchId]);

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('church_announcements')
        .select('*')
        .eq('church_id', churchId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("info");
    setIsPinned(false);
    setExpiresAt("");
    setEditing(null);
  };

  const openEdit = (announcement: Announcement) => {
    setEditing(announcement);
    setTitle(announcement.title);
    setMessage(announcement.message);
    setType(announcement.type);
    setIsPinned(announcement.is_pinned);
    setExpiresAt(announcement.expires_at ? announcement.expires_at.slice(0, 16) : "");
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message are required");
      return;
    }

    setSaving(true);
    try {
      const announcementData = {
        church_id: churchId,
        title: title.trim(),
        message: message.trim(),
        type,
        is_pinned: isPinned,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        created_by: user?.id,
      };

      if (editing) {
        const { error } = await supabase
          .from('church_announcements')
          .update(announcementData)
          .eq('id', editing.id);
        if (error) throw error;
        toast.success("Announcement updated");
      } else {
        const { data: newAnnouncement, error } = await supabase
          .from('church_announcements')
          .insert(announcementData)
          .select()
          .single();
        if (error) throw error;
        toast.success("Announcement created");

        // Send email notifications to church members (fire-and-forget)
        if (newAnnouncement) {
          supabase.functions.invoke('send-church-notification-email', {
            body: {
              churchId,
              notificationType: 'announcement',
              referenceId: newAnnouncement.id,
              title: title.trim(),
              message: message.trim(),
            }
          }).then(res => {
            if (res.data?.sent > 0) {
              toast.success(`Email sent to ${res.data.sent} members`);
            }
          }).catch(err => console.error('Email notification error:', err));
        }
      }

      setDialogOpen(false);
      resetForm();
      loadAnnouncements();
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error("Failed to save announcement");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('church_announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id);
      if (error) throw error;
      loadAnnouncements();
      toast.success(announcement.is_active ? "Announcement hidden" : "Announcement visible");
    } catch (error) {
      toast.error("Failed to update announcement");
    }
  };

  const togglePinned = async (announcement: Announcement) => {
    try {
      const { error } = await supabase
        .from('church_announcements')
        .update({ is_pinned: !announcement.is_pinned })
        .eq('id', announcement.id);
      if (error) throw error;
      loadAnnouncements();
      toast.success(announcement.is_pinned ? "Unpinned" : "Pinned to top");
    } catch (error) {
      toast.error("Failed to update announcement");
    }
  };

  const deleteAnnouncement = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      const { error } = await supabase
        .from('church_announcements')
        .delete()
        .eq('id', id);
      if (error) throw error;
      loadAnnouncements();
      toast.success("Announcement deleted");
    } catch (error) {
      toast.error("Failed to delete announcement");
    }
  };

  const getTypeConfig = (typeValue: string) => 
    ANNOUNCEMENT_TYPES.find(t => t.value === typeValue) || ANNOUNCEMENT_TYPES[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Announcements</h3>
          <Badge variant="secondary">{announcements.length}</Badge>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editing ? "Edit Announcement" : "New Announcement"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Announcement title"
                />
              </div>

              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your announcement..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNOUNCEMENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          <div className="flex items-center gap-2">
                            <t.icon className="h-4 w-4" />
                            {t.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expires (optional)</Label>
                  <Input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="pinned"
                  checked={isPinned}
                  onCheckedChange={setIsPinned}
                />
                <Label htmlFor="pinned">Pin to top</Label>
              </div>

              <Button onClick={handleSubmit} disabled={saving} className="w-full">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {editing ? "Update" : "Create"} Announcement
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {announcements.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No announcements yet</p>
            <p className="text-sm">Create your first announcement to notify members</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((announcement) => {
            const typeConfig = getTypeConfig(announcement.type);
            const TypeIcon = typeConfig.icon;
            const isExpired = announcement.expires_at && new Date(announcement.expires_at) < new Date();

            return (
              <Card 
                key={announcement.id} 
                className={`${!announcement.is_active || isExpired ? 'opacity-60' : ''}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${typeConfig.color}/10`}>
                      <TypeIcon className={`h-4 w-4 ${typeConfig.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{announcement.title}</h4>
                        {announcement.is_pinned && (
                          <Pin className="h-3 w-3 text-primary flex-shrink-0" />
                        )}
                        {!announcement.is_active && (
                          <Badge variant="secondary" className="text-xs">Hidden</Badge>
                        )}
                        {isExpired && (
                          <Badge variant="destructive" className="text-xs">Expired</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {announcement.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created {format(new Date(announcement.created_at), 'MMM d, yyyy')}
                        {announcement.expires_at && (
                          <> · Expires {format(new Date(announcement.expires_at), 'MMM d, yyyy')}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => togglePinned(announcement)}
                        title={announcement.is_pinned ? "Unpin" : "Pin"}
                      >
                        {announcement.is_pinned ? (
                          <PinOff className="h-4 w-4" />
                        ) : (
                          <Pin className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(announcement)}
                        title={announcement.is_active ? "Hide" : "Show"}
                      >
                        {announcement.is_active ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(announcement)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAnnouncement(announcement.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
