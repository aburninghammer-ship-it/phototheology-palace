import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Plus, Loader2, AlertTriangle, Calendar, HandHeart, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CareMinistryProps { churchId: string; }

const CARE_TYPES = ["meal_train","visit","transportation","childcare","errand","prayer","financial","other"];
const CARE_LABELS: Record<string,string> = { meal_train:"Meal Train", visit:"Visit", transportation:"Transportation", childcare:"Childcare", errand:"Errand", prayer:"Prayer", financial:"Financial Help", other:"Other" };
const STATUS_COLORS: Record<string,string> = { open:"bg-green-500/10 text-green-600", in_progress:"bg-blue-500/10 text-blue-600", fulfilled:"bg-gray-500/10 text-gray-600", closed:"bg-gray-500/10 text-gray-500" };

export function CareMinistry({ churchId }: CareMinistryProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [responding, setResponding] = useState<string | null>(null);
  const [responseDate, setResponseDate] = useState("");
  const [responseNotes, setResponseNotes] = useState("");
  const [newReq, setNewReq] = useState({ title: "", description: "", care_type: "meal_train", recipient_name: "", is_urgent: false, start_date: "", end_date: "" });

  useEffect(() => { if (churchId) loadData(); }, [churchId]);

  const loadData = async () => {
    try {
      const { data } = await (supabase as any).from("church_care_requests")
        .select("*").eq("church_id", churchId).in("status", ["open", "in_progress"]).order("is_urgent", { ascending: false }).order("created_at", { ascending: false });

      if (data) {
        const userIds = [...new Set(data.map((r: any) => r.requester_id))] as string[];
        const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", userIds);
        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
        setRequests(data.map((r: any) => ({ ...r, requester: profileMap.get(r.requester_id) })));
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!newReq.title || !newReq.recipient_name) { toast.error("Title and recipient name are required"); return; }
    setSaving(true);
    try {
      await (supabase as any).from("church_care_requests").insert({
        church_id: churchId, requester_id: user!.id, ...newReq,
        start_date: newReq.start_date || null, end_date: newReq.end_date || null,
      });
      toast.success("Care request created. Your church family will see it.");
      setShowCreate(false);
      setNewReq({ title: "", description: "", care_type: "meal_train", recipient_name: "", is_urgent: false, start_date: "", end_date: "" });
      loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSaving(false); }
  };

  const handleRespond = async (requestId: string) => {
    try {
      await (supabase as any).from("church_care_responses").insert({
        care_request_id: requestId, volunteer_id: user!.id, response_type: "help",
        scheduled_date: responseDate || null, notes: responseNotes || null,
      });
      toast.success("Thank you for stepping up! The requester will be notified.");
      setResponding(null);
      setResponseDate("");
      setResponseNotes("");
    } catch (err: any) {
      if (err.code === "23505") toast.error("You've already responded for this date.");
      else toast.error("Failed to respond");
    }
  };

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Care Ministry</CardTitle>
            </div>
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Request</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Care Request</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Title</Label><Input value={newReq.title} onChange={(e) => setNewReq({ ...newReq, title: e.target.value })} placeholder="e.g., Meals for the Smith family" /></div>
                  <div><Label>Description</Label><Textarea value={newReq.description} onChange={(e) => setNewReq({ ...newReq, description: e.target.value })} placeholder="Details about the need..." /></div>
                  <div><Label>Care Type</Label>
                    <Select value={newReq.care_type} onValueChange={(v) => setNewReq({ ...newReq, care_type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{CARE_TYPES.map((t) => <SelectItem key={t} value={t}>{CARE_LABELS[t]}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Recipient Name</Label><Input value={newReq.recipient_name} onChange={(e) => setNewReq({ ...newReq, recipient_name: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Start Date</Label><Input type="date" value={newReq.start_date} onChange={(e) => setNewReq({ ...newReq, start_date: e.target.value })} /></div>
                    <div><Label>End Date</Label><Input type="date" value={newReq.end_date} onChange={(e) => setNewReq({ ...newReq, end_date: e.target.value })} /></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={newReq.is_urgent} onCheckedChange={(v) => setNewReq({ ...newReq, is_urgent: v })} />
                    <Label>Urgent need</Label>
                  </div>
                  <Button onClick={handleCreate} disabled={saving} className="w-full">{saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}Submit Request</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <HandHeart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No active care requests. That's wonderful!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((r) => (
                <Card key={r.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {r.is_urgent && <AlertTriangle className="h-4 w-4 text-red-500" />}
                          <h4 className="font-medium">{r.title}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">For: {r.recipient_name} — Requested by {r.requester?.display_name || "Member"}</p>
                        {r.description && <p className="text-sm text-muted-foreground mt-2">{r.description}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{CARE_LABELS[r.care_type]}</Badge>
                          <Badge variant="outline" className={STATUS_COLORS[r.status]}>{r.status.replace("_"," ")}</Badge>
                          {r.start_date && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />{new Date(r.start_date).toLocaleDateString()}{r.end_date && ` — ${new Date(r.end_date).toLocaleDateString()}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {responding === r.id ? (
                      <div className="mt-3 space-y-2 border-t pt-3">
                        <Input type="date" value={responseDate} onChange={(e) => setResponseDate(e.target.value)} placeholder="When can you help?" />
                        <Input value={responseNotes} onChange={(e) => setResponseNotes(e.target.value)} placeholder="Any notes (dietary restrictions, etc.)" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleRespond(r.id)}><CheckCircle2 className="h-4 w-4 mr-1" />Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={() => setResponding(null)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" className="mt-3" onClick={() => setResponding(r.id)}><HandHeart className="h-4 w-4 mr-1" />I Can Help</Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
