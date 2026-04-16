import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookMarked, Plus, Globe, Lock, Users, Heart, MessageCircle, Loader2, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface StudyThreadsProps { churchId: string; }

const VISIBILITY_ICONS: Record<string, any> = { public: Globe, private: Lock, followers: Users };
const ENTRY_TYPES = ["note","reflection","question","insight","prayer","gem"];

export function StudyThreads({ churchId }: StudyThreadsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myThreads, setMyThreads] = useState<any[]>([]);
  const [followedFeed, setFollowedFeed] = useState<any[]>([]);
  const [publicThreads, setPublicThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", description: "", visibility: "public" });
  const [newEntry, setNewEntry] = useState({ title: "", content: "", entry_type: "note", verse_reference: "" });
  const [commentText, setCommentText] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [likedEntries, setLikedEntries] = useState<Set<string>>(new Set());

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    try {
      const [myRes, followedRes, publicRes] = await Promise.all([
        (supabase as any).from("user_study_threads").select("*").eq("user_id", user!.id).order("updated_at", { ascending: false }),
        (supabase as any).from("user_study_threads").select("*")
          .in("user_id", (await supabase.from("user_follows").select("following_id").eq("follower_id", user!.id)).data?.map((f: any) => f.following_id) || [])
          .in("visibility", ["public", "followers"]).order("updated_at", { ascending: false }).limit(20),
        (supabase as any).from("user_study_threads").select("*").eq("visibility", "public").neq("user_id", user!.id).order("updated_at", { ascending: false }).limit(20),
      ]);

      const allThreads = [...(myRes.data || []), ...(followedRes.data || []), ...(publicRes.data || [])];
      const userIds = [...new Set(allThreads.map((t: any) => t.user_id))];
      const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds.length > 0 ? userIds : ["none"]);
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      const enrich = (threads: any[]) => threads.map((t: any) => ({ ...t, profile: profileMap.get(t.user_id) }));
      setMyThreads(enrich(myRes.data || []));
      setFollowedFeed(enrich(followedRes.data || []));
      setPublicThreads(enrich(publicRes.data || []));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const createThread = async () => {
    if (!newThread.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const { data, error } = await (supabase as any).from("user_study_threads").insert({ user_id: user!.id, ...newThread }).select().single();
      if (error) throw error;
      toast.success("Study thread created!");
      setShowCreate(false);
      setNewThread({ title: "", description: "", visibility: "public" });
      loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const openThread = async (thread: any) => {
    setSelectedThread(thread);
    const { data } = await (supabase as any).from("user_study_entries")
      .select("*").eq("thread_id", thread.id).order("created_at", { ascending: false });

    if (data) {
      const entryIds = data.map((e: any) => e.id);
      const { data: likes } = await (supabase as any).from("user_study_entry_likes")
        .select("entry_id").eq("user_id", user!.id).in("entry_id", entryIds.length > 0 ? entryIds : ["none"]);
      setLikedEntries(new Set(likes?.map((l: any) => l.entry_id) || []));

      const userIds = [...new Set(data.map((e: any) => e.user_id))] as string[];
      const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds.length > 0 ? userIds : ["none"]);
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      setEntries(data.map((e: any) => ({ ...e, profile: profileMap.get(e.user_id) })));
    }
  };

  const addEntry = async () => {
    if (!newEntry.content) { toast.error("Content is required"); return; }
    setSaving(true);
    try {
      await (supabase as any).from("user_study_entries").insert({
        thread_id: selectedThread.id, user_id: user!.id, ...newEntry,
        verse_reference: newEntry.verse_reference || null, title: newEntry.title || null,
      });
      await (supabase as any).from("user_study_threads").update({
        entry_count: (selectedThread.entry_count || 0) + 1, updated_at: new Date().toISOString(),
      }).eq("id", selectedThread.id);
      toast.success("Entry added!");
      setShowAddEntry(false);
      setNewEntry({ title: "", content: "", entry_type: "note", verse_reference: "" });
      openThread(selectedThread);
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const toggleLike = async (entryId: string) => {
    try {
      if (likedEntries.has(entryId)) {
        await (supabase as any).from("user_study_entry_likes").delete().eq("entry_id", entryId).eq("user_id", user!.id);
        setLikedEntries((prev) => { const next = new Set(prev); next.delete(entryId); return next; });
      } else {
        await (supabase as any).from("user_study_entry_likes").insert({ entry_id: entryId, user_id: user!.id });
        setLikedEntries((prev) => new Set([...prev, entryId]));
      }
    } catch (err) { console.error(err); }
  };

  const loadComments = async (entryId: string) => {
    setCommentingOn(commentingOn === entryId ? null : entryId);
    if (comments[entryId]) return;
    const { data } = await (supabase as any).from("user_study_entry_comments")
      .select("*").eq("entry_id", entryId).order("created_at");
    if (data) {
      const userIds = [...new Set(data.map((c: any) => c.user_id))] as string[];
      const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds.length > 0 ? userIds : ["none"]);
      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
      setComments((prev) => ({ ...prev, [entryId]: data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })) }));
    }
  };

  const addComment = async (entryId: string) => {
    if (!commentText.trim()) return;
    try {
      await (supabase as any).from("user_study_entry_comments").insert({ entry_id: entryId, user_id: user!.id, content: commentText });
      setCommentText("");
      const { data } = await (supabase as any).from("user_study_entry_comments").select("*").eq("entry_id", entryId).order("created_at");
      if (data) {
        const userIds = [...new Set(data.map((c: any) => c.user_id))] as string[];
        const { data: profiles } = await supabase.from("profiles").select("id, display_name, avatar_url").in("id", userIds.length > 0 ? userIds : ["none"]);
        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
        setComments((prev) => ({ ...prev, [entryId]: data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })) }));
      }
      toast.success("Comment added!");
    } catch (err) { toast.error("Failed to add comment"); }
  };

  const renderThreadList = (threads: any[], emptyMsg: string) => (
    threads.length === 0 ? (
      <p className="text-center text-muted-foreground py-4 text-sm">{emptyMsg}</p>
    ) : (
      <div className="space-y-2">
        {threads.map((t) => {
          const VisIcon = VISIBILITY_ICONS[t.visibility] || Globe;
          return (
            <div key={t.id} className="p-3 rounded-lg bg-card/50 hover:bg-card/80 cursor-pointer transition-colors" onClick={() => openThread(t)}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={t.profile?.avatar_url} />
                    <AvatarFallback className="text-xs">{(t.profile?.display_name || "?")[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-sm font-medium">{t.title}</h4>
                    <p className="text-xs text-muted-foreground">{t.profile?.display_name || "You"} · {t.entry_count || 0} entries</p>
                  </div>
                </div>
                <VisIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>
          );
        })}
      </div>
    )
  );

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  if (selectedThread) {
    const isOwner = selectedThread.user_id === user?.id;
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedThread(null)} className="mb-2">Back to Threads</Button>
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
              <p className="text-center text-muted-foreground py-8">No entries yet.{isOwner && " Add your first study entry!"}</p>
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
                    <p className="text-sm">{e.content}</p>
                    {e.verse_reference && <p className="text-xs text-primary font-medium">{e.verse_reference}</p>}
                    <div className="flex items-center gap-3 pt-2">
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => toggleLike(e.id)}>
                        <Heart className={`h-3.5 w-3.5 ${likedEntries.has(e.id) ? "fill-red-500 text-red-500" : ""}`} />
                        {e.likes_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => loadComments(e.id)}>
                        <MessageCircle className="h-3.5 w-3.5" />
                        Comments
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
                          <Input placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="text-xs h-8" onKeyDown={(ev) => ev.key === "Enter" && addComment(e.id)} />
                          <Button size="sm" className="h-8" onClick={() => addComment(e.id)}><Send className="h-3 w-3" /></Button>
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

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Study Threads</CardTitle>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Thread</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Study Thread</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={newThread.title} onChange={(e) => setNewThread({ ...newThread, title: e.target.value })} placeholder="e.g., My Romans Study" /></div>
                  <div><Label>Description</Label><Textarea value={newThread.description} onChange={(e) => setNewThread({ ...newThread, description: e.target.value })} /></div>
                  <div><Label>Visibility</Label>
                    <Select value={newThread.visibility} onValueChange={(v) => setNewThread({ ...newThread, visibility: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public — Anyone can see</SelectItem>
                        <SelectItem value="followers">Followers Only</SelectItem>
                        <SelectItem value="private">Private — Only you</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={createThread} disabled={saving} className="w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Create Thread</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mine" className="space-y-3">
            <TabsList className="bg-card/30">
              <TabsTrigger value="mine">My Threads</TabsTrigger>
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>
            <TabsContent value="mine">{renderThreadList(myThreads, "Create your first study thread!")}</TabsContent>
            <TabsContent value="following">{renderThreadList(followedFeed, "Follow members to see their study threads.")}</TabsContent>
            <TabsContent value="discover">{renderThreadList(publicThreads, "No public threads yet.")}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
