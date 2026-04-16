import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, ExternalLink, Search, Star, BookOpen, Video, Headphones, Link2, Loader2, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { toast } from "sonner";

interface ResourceLibraryProps { churchId: string; }

const TYPE_ICONS: Record<string, any> = {
  pdf: FileText, book: BookOpen, study_guide: BookOpen, video: Video, audio: Headphones, link: Link2, other: FileText,
};

export function ResourceLibrary({ churchId }: ResourceLibraryProps) {
  const { user } = useAuth();
  const { role } = useChurchMembership();
  const isLeader = role === "admin" || role === "leader";
  const [loading, setLoading] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newResource, setNewResource] = useState({ title: "", description: "", resource_type: "link", external_url: "", author: "", category_id: "" });

  useEffect(() => { if (churchId) loadData(); }, [churchId]);

  const loadData = async () => {
    try {
      const [resRes, catRes] = await Promise.all([
        (supabase as any).from("church_resources").select("*").eq("church_id", churchId).order("created_at", { ascending: false }),
        (supabase as any).from("church_resource_categories").select("*").eq("church_id", churchId).order("sort_order"),
      ]);
      setResources(resRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newResource.title) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const { error } = await (supabase as any).from("church_resources").insert({
        church_id: churchId, uploaded_by: user!.id, ...newResource,
        category_id: newResource.category_id || null,
      });
      if (error) throw error;
      toast.success("Resource added!");
      setShowAdd(false);
      setNewResource({ title: "", description: "", resource_type: "link", external_url: "", author: "", category_id: "" });
      loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const filtered = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "all" || r.category_id === selectedCategory;
    return matchesSearch && matchesCat;
  });

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Resource Library</CardTitle>
            </div>
            {isLeader && (
              <Dialog open={showAdd} onOpenChange={setShowAdd}>
                <DialogTrigger asChild>
                  <Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Resource</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Resource</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Title</Label><Input value={newResource.title} onChange={(e) => setNewResource({ ...newResource, title: e.target.value })} /></div>
                    <div><Label>Description</Label><Textarea value={newResource.description} onChange={(e) => setNewResource({ ...newResource, description: e.target.value })} /></div>
                    <div><Label>Type</Label>
                      <Select value={newResource.resource_type} onValueChange={(v) => setNewResource({ ...newResource, resource_type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["pdf","book","study_guide","video","audio","link","other"].map((t) => <SelectItem key={t} value={t}>{t.replace("_"," ")}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>URL</Label><Input value={newResource.external_url} onChange={(e) => setNewResource({ ...newResource, external_url: e.target.value })} placeholder="https://..." /></div>
                    <div><Label>Author</Label><Input value={newResource.author} onChange={(e) => setNewResource({ ...newResource, author: e.target.value })} /></div>
                    {categories.length > 0 && (
                      <div><Label>Category</Label>
                        <Select value={newResource.category_id} onValueChange={(v) => setNewResource({ ...newResource, category_id: v })}>
                          <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                          <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button onClick={handleAdd} disabled={saving} className="w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Add Resource</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            {categories.length > 0 && (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No resources found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filtered.map((r) => {
                const Icon = TYPE_ICONS[r.resource_type] || FileText;
                return (
                  <Card key={r.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10"><Icon className="h-5 w-5 text-primary" /></div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{r.title}</h4>
                          {r.author && <p className="text-xs text-muted-foreground">by {r.author}</p>}
                          {r.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{r.description}</p>}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-[10px]">{r.resource_type.replace("_"," ")}</Badge>
                            {r.is_pastors_pick && <Badge variant="secondary" className="text-[10px] gap-1"><Star className="h-2.5 w-2.5" />Pastor's Pick</Badge>}
                          </div>
                        </div>
                        {(r.external_url || r.file_url) && (
                          <Button variant="ghost" size="icon" asChild>
                            <a href={r.external_url || r.file_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
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
