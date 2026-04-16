import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HandHeart, Calendar, Users, Plus, Loader2, CheckCircle2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { toast } from "sonner";

interface VolunteerHubProps { churchId: string; }

const CATEGORIES = ["worship","av_tech","greeting","music","childrens","youth","outreach","hospitality","prayer","administration","general"];

export function VolunteerHub({ churchId }: VolunteerHubProps) {
  const { user } = useAuth();
  const { role } = useChurchMembership();
  const isLeader = role === "admin" || role === "leader";
  const [loading, setLoading] = useState(true);
  const [ministries, setMinistries] = useState<any[]>([]);
  const [mySignups, setMySignups] = useState<Set<string>>(new Set());
  const [selectedMinistry, setSelectedMinistry] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newMinistry, setNewMinistry] = useState({ name: "", description: "", category: "general" });

  useEffect(() => { if (churchId) loadData(); }, [churchId]);

  const loadData = async () => {
    try {
      const [minRes, signupRes] = await Promise.all([
        (supabase as any).from("church_ministries").select("*").eq("church_id", churchId).eq("is_active", true).order("name"),
        (supabase as any).from("church_ministry_signups").select("slot_id").eq("user_id", user!.id).eq("status", "confirmed"),
      ]);
      setMinistries(minRes.data || []);
      setMySignups(new Set(signupRes.data?.map((s: any) => s.slot_id) || []));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const loadSlots = async (ministry: any) => {
    setSelectedMinistry(ministry);
    const today = new Date().toISOString().split("T")[0];
    const { data } = await (supabase as any).from("church_ministry_slots")
      .select("*").eq("ministry_id", ministry.id).gte("slot_date", today).order("slot_date");
    setSlots(data || []);
  };

  const handleSignUp = async (slotId: string, ministryId: string) => {
    try {
      const { error } = await (supabase as any).from("church_ministry_signups").insert({
        slot_id: slotId, user_id: user!.id, ministry_id: ministryId,
      });
      if (error) throw error;
      toast.success("Signed up! Thank you for serving.");
      setMySignups(new Set([...mySignups, slotId]));
    } catch (err: any) {
      if (err.code === "23505") toast.error("Already signed up for this slot.");
      else toast.error("Failed to sign up");
    }
  };

  const handleCreateMinistry = async () => {
    if (!newMinistry.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      await (supabase as any).from("church_ministries").insert({
        church_id: churchId, created_by: user!.id, ...newMinistry,
      });
      toast.success("Ministry created!");
      setShowCreate(false);
      setNewMinistry({ name: "", description: "", category: "general" });
      loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HandHeart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Volunteer Ministries</CardTitle>
            </div>
            {isLeader && (
              <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Ministry</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Ministry</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label>Name</Label><Input value={newMinistry.name} onChange={(e) => setNewMinistry({ ...newMinistry, name: e.target.value })} placeholder="e.g., Sound Team" /></div>
                    <div><Label>Description</Label><Textarea value={newMinistry.description} onChange={(e) => setNewMinistry({ ...newMinistry, description: e.target.value })} /></div>
                    <div><Label>Category</Label>
                      <Select value={newMinistry.category} onValueChange={(v) => setNewMinistry({ ...newMinistry, category: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace("_"," ")}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateMinistry} disabled={saving} className="w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Create</Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {ministries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No ministries set up yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {ministries.map((m) => (
                <Card key={m.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => loadSlots(m)}>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{m.name}</h4>
                    {m.description && <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{m.description}</p>}
                    <Badge variant="outline" className="mt-2 text-[10px]">{m.category.replace("_"," ")}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Ministry Slots */}
      {selectedMinistry && (
        <Card variant="glass">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{selectedMinistry.name} — Upcoming Slots</CardTitle>
          </CardHeader>
          <CardContent>
            {slots.length === 0 ? (
              <p className="text-center text-muted-foreground py-4 text-sm">No upcoming slots.</p>
            ) : (
              <div className="space-y-2">
                {slots.map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                    <div>
                      <p className="text-sm font-medium">{slot.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(slot.slot_date).toLocaleDateString()}</span>
                        {slot.start_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{slot.start_time}</span>}
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{slot.volunteers_filled}/{slot.volunteers_needed}</span>
                      </div>
                    </div>
                    {mySignups.has(slot.id) ? (
                      <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" />Signed Up</Badge>
                    ) : slot.volunteers_filled >= slot.volunteers_needed ? (
                      <Badge variant="outline">Full</Badge>
                    ) : (
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); handleSignUp(slot.id, selectedMinistry.id); }}>Sign Up</Button>
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
