import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Loader2, PenLine } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useContentModeration } from "@/hooks/useContentModeration";

interface PersonalPageComposerProps {
  onPostCreated: () => void;
}

const ENTRY_TYPES = ["note", "reflection", "question", "insight", "prayer", "gem"];

export function PersonalPageComposer({ onPostCreated }: PersonalPageComposerProps) {
  const { user } = useAuth();
  const { moderateContent, moderating } = useContentModeration();
  const [myThreads, setMyThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadVisibility, setNewThreadVisibility] = useState("public");
  const [entryType, setEntryType] = useState("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) loadThreads();
  }, [user]);

  const loadThreads = async () => {
    const { data } = await (supabase as any).from("user_study_threads")
      .select("id, title, visibility")
      .eq("user_id", user!.id)
      .order("updated_at", { ascending: false });
    setMyThreads(data || []);
    if (data && data.length > 0 && !selectedThreadId) {
      setSelectedThreadId(data[0].id);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) { toast.error("Write something first"); return; }
    setSaving(true);

    try {
      // Moderate content before posting
      const contentToCheck = `${title} ${content} ${verseReference}`;
      const isAllowed = await moderateContent(contentToCheck);
      if (!isAllowed) { setSaving(false); return; }
      let threadId = selectedThreadId;

      // Create new thread if needed
      if (showNewThread || !threadId) {
        if (!newThreadTitle.trim()) { toast.error("Thread title is required"); setSaving(false); return; }
        const { data: thread, error: threadErr } = await (supabase as any).from("user_study_threads")
          .insert({ user_id: user!.id, title: newThreadTitle, visibility: newThreadVisibility })
          .select().single();
        if (threadErr) throw threadErr;
        threadId = thread.id;
      }

      // Create entry
      await (supabase as any).from("user_study_entries").insert({
        thread_id: threadId,
        user_id: user!.id,
        entry_type: entryType,
        title: title || null,
        content,
        verse_reference: verseReference || null,
      });

      // Update thread entry count
      await (supabase as any).from("user_study_threads")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", threadId);

      toast.success("Post published!");
      setTitle("");
      setContent("");
      setVerseReference("");
      setEntryType("note");
      setShowNewThread(false);
      setNewThreadTitle("");
      setOpen(false);
      loadThreads();
      onPostCreated();
    } catch (err: any) {
      toast.error(err.message || "Failed to post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card variant="glass" className="cursor-pointer hover:border-primary/30 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PenLine className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Share a devotion, study, or reflection...</span>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Thread Selector */}
          {myThreads.length > 0 && !showNewThread ? (
            <div>
              <Label>Post to Thread</Label>
              <div className="flex gap-2">
                <Select value={selectedThreadId} onValueChange={setSelectedThreadId}>
                  <SelectTrigger className="flex-1"><SelectValue placeholder="Select a thread" /></SelectTrigger>
                  <SelectContent>
                    {myThreads.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={() => setShowNewThread(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>New Thread</Label>
              <Input
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="e.g., My Daily Devotions"
              />
              <Select value={newThreadVisibility} onValueChange={setNewThreadVisibility}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="followers">Followers Only</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
              {myThreads.length > 0 && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setShowNewThread(false)}>
                  Use existing thread instead
                </Button>
              )}
            </div>
          )}

          {/* Entry Type */}
          <div>
            <Label>Type</Label>
            <Select value={entryType} onValueChange={setEntryType}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ENTRY_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <Label>Title (optional)</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give your post a title..." />
          </div>

          {/* Content */}
          <div>
            <Label>Content</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, insights, or prayer..."
              className="min-h-[120px]"
            />
          </div>

          {/* Verse Reference */}
          <div>
            <Label>Verse Reference (optional)</Label>
            <Input value={verseReference} onChange={(e) => setVerseReference(e.target.value)} placeholder="e.g., John 3:16" />
          </div>

          <Button onClick={handlePost} disabled={saving || moderating || !content.trim()} className="w-full">
            {(saving || moderating) ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {moderating ? "Checking content..." : "Publish Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
