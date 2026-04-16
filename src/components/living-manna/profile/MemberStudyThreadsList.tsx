import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookMarked, Globe, Lock, Users, Loader2, Heart, MessageCircle, Send, Plus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MemberStudyThreadsListProps {
  userId: string;
}

const VISIBILITY_ICONS: Record<string, any> = { public: Globe, private: Lock, followers: Users };
const ENTRY_TYPES = ["note", "reflection", "question", "insight", "prayer", "gem"];

export function MemberStudyThreadsList({ userId }: MemberStudyThreadsListProps) {
  const { user } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [likedEntries, setLikedEntries] = useState<Set<string>>(new Set());
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: "", content: "", entry_type: "note", verse_reference: "" });

  const isOwner = user?.id === userId;

  useEffect(() => { loadThreads(); }, [userId]);

  const loadThreads = async () => {
    try {
      const { data } = await (supabase as any).from("user_study_threads")
        .select("*").eq("user_id", userId).order("updated_at", { ascending: false });
      setThreads(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openThread = async (thread: any) => {
    setSelectedThread(thread);
    const { data } = await (supabase as any).from("user_study_entries")
      .select("*").eq("thread_id", thread.id).order("created_at", { ascending: false });
    if (data) {
      const entryIds = data.map((e: any) => e.id);
      if (user && entryIds.length > 0) {
        const { data: likes } = await (supabase as any).from("user_study_entry_likes")
          .select("entry_id").eq("user_id", user.id).in("entry_id", entryIds);
        setLikedEntries(new Set(likes?.map((l: any) => l.entry_id) || []));
      }
      const userIds = [...new Set(data.map((e: any) => e.user_id))] as string[];
      let profileMap = new Map();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds);
        profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }
      setEntries(data.map((e: any) => ({ ...e, profile: profileMap.get(e.user_id) })));
    }
  };

  const toggleLike = async (entryId: string) => {
    if (!user) return;
    try {
      if (likedEntries.has(entryId)) {
        await (supabase as any).from("user_study_entry_likes").delete().eq("entry_id", entryId).eq("user_id", user.id);
        setLikedEntries((prev) => { const next = new Set(prev); next.delete(entryId); return next; });
      } else {
        await (supabase as any).from("user_study_entry_likes").insert({ entry_id: entryId, user_id: user.id });
        setLikedEntries((prev) => new Set([...prev, entryId]));
      }
    } catch (err) { console.error(err); }
  };

  const loadEntryComments = async (entryId: string) => {
    setCommentingOn(commentingOn === entryId ? null : entryId);
    if (comments[entryId]) return;
    const { data } = await (supabase as any).from("user_study_entry_comments")
      .select("*").eq("entry_id", entryId).order("created_at");
    if (data) {
      const userIds = [...new Set(data.map((c: any) => c.user_id))] as string[];
      let profileMap = new Map();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds);
        profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }
      setComments((prev) => ({ ...prev, [entryId]: data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })) }));
    }
  };

  const handleAddComment = async (entryId: string) => {
    if (!commentText.trim() || !user) return;
    await (supabase as any).from("user_study_entry_comments").insert({ entry_id: entryId, user_id: user.id, content: commentText });
    setCommentText("");
    const { data } = await (supabase as any).from("user_study_entry_comments").select("*").eq("entry_id", entryId).order("created_at");
    if (data) {
      const userIds = [...new Set(data.map((c: any) => c.user_id))] as string[];
      let profileMap = new Map();
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds);
        profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      }
      setComments((prev) => ({ ...prev, [entryId]: data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })) }));
    }
    toast.success("Comment added!");
  };

  const addEntry = async () => {
    if (!newEntry.content) { toast.error("Content is required"); return; }
    setSaving(true);
    try {
      await (supabase as any).from("user_study_entries").insert({
        thread_id: selectedThread.id, user_id: user!.id, ...newEntry,
        verse_reference: newEntry.verse_reference || null, title: newEntry.title || null,
      });
      toast.success("Entry added!");
      setShowAddEntry(false);
      setNewEntry({ title: "", content: "", entry_type: "note", verse_reference: "" });
      openThread(selectedThread);
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  // Thread detail view
  if (selectedThread) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedThread(null)} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Threads
        </Button>
        <Card variant="glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedThread.title}</CardTitle>
                {selectedThread.description && <p className="text-sm text-muted-foreground mt-1">{selectedThread.description}</p>}
              </div>
              {isOwner && (
                <Dialog open={showAddEntry} onOpenChange={setShowAddEntry}>
                  <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Entry</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>New Study Entry</DialogTitle></DialogHeader>
                    <div className="space-y-3">
                      <div><Label>Title (optional)</Label><Input value={newEntry.title} onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })} /></div>
                      <div><Label>Content</Label><Textarea value={newEntry.content} onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })} className="min-h-[100px]" /></div>
                      <div><Label>Type</Label>
                        <Select value={newEntry.entry_type} onValueChange={(v) => setNewEntry({ ...newEntry, entry_type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{ENTRY_TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div><Label>Verse Reference</Label><Input value={newEntry.verse_reference} onChange={(e) => setNewEntry({ ...newEntry, verse_reference: e.target.value })} placeholder="e.g., John 3:16" /></div>
                      <Button onClick={addEntry} disabled={saving} className="w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Post Entry</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No entries yet.</p>
            ) : (
              <div className="space-y-4">
                {entries.map((e) => (
                  <div key={e.id} className="p-4 rounded-lg bg-card/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={e.profile?.avatar_url} />
                          <AvatarFallback className="text-[10px]">{(e.profile?.display_name || "?")[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{e.profile?.display_name}</span>
                        <Badge variant="outline" className="text-[10px]">{e.entry_type}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleDateString()}</span>
                    </div>
                    {e.title && <h5 className="font-medium text-sm">{e.title}</h5>}
                    <p className="text-sm whitespace-pre-wrap">{e.content}</p>
                    {e.verse_reference && <p className="text-xs text-primary font-medium">{e.verse_reference}</p>}
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => toggleLike(e.id)}>
                        <Heart className={`h-3.5 w-3.5 ${likedEntries.has(e.id) ? "fill-red-500 text-red-500" : ""}`} />
                        {e.likes_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => loadEntryComments(e.id)}>
                        <MessageCircle className="h-3.5 w-3.5" /> Comments
                      </Button>
                    </div>
                    {commentingOn === e.id && (
                      <div className="space-y-2 pt-2 border-t">
                        {(comments[e.id] || []).map((c: any) => (
                          <div key={c.id} className="flex items-start gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarFallback className="text-[8px]">{(c.profile?.display_name || "?")[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="text-xs font-medium">{c.profile?.display_name}</span>
                              <p className="text-xs text-muted-foreground">{c.content}</p>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input placeholder="Write a comment..." value={commentText} onChange={(ev) => setCommentText(ev.target.value)} className="text-xs h-8" onKeyDown={(ev) => ev.key === "Enter" && handleAddComment(e.id)} />
                          <Button size="sm" className="h-8" onClick={() => handleAddComment(e.id)}><Send className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Thread list view
  return (
    <div className="space-y-4">
      {threads.length === 0 ? (
        <Card variant="glass">
          <CardContent className="p-8 text-center">
            <BookMarked className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isOwner ? "You haven't created any study threads yet." : "No study threads to show."}
            </p>
          </CardContent>
        </Card>
      ) : (
        threads.map((t) => {
          const VisIcon = VISIBILITY_ICONS[t.visibility] || Globe;
          return (
            <Card key={t.id} variant="glass" className="cursor-pointer hover:border-primary/30 transition-colors" onClick={() => openThread(t)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium">{t.title}</h4>
                    {t.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{t.entry_count || 0} entries</p>
                  </div>
                  <VisIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
