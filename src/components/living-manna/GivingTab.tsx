import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, History, Target, CreditCard, Loader2, TrendingUp, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface GivingTabProps { churchId: string; }

const GIVING_TYPES = [
  { value: "tithe", label: "Tithe" },
  { value: "offering", label: "Offering" },
  { value: "building_fund", label: "Building Fund" },
  { value: "missions", label: "Missions" },
  { value: "special", label: "Special" },
  { value: "other", label: "Other" },
];

const AMOUNTS = [10, 25, 50, 100, 250, 500];

export function GivingTab({ churchId }: GivingTabProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState("");
  const [givingType, setGivingType] = useState("tithe");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [yearTotal, setYearTotal] = useState(0);

  useEffect(() => { if (user && churchId) loadData(); }, [user, churchId]);

  const loadData = async () => {
    try {
      const currentYear = new Date().getFullYear();
      const [historyRes, goalsRes] = await Promise.all([
        (supabase as any).from("church_giving_records")
          .select("*").eq("church_id", churchId).eq("user_id", user!.id)
          .order("created_at", { ascending: false }).limit(50),
        (supabase as any).from("church_giving_goals")
          .select("*").eq("church_id", churchId).eq("is_active", true),
      ]);
      const records = historyRes.data || [];
      setHistory(records);
      setGoals(goalsRes.data || []);

      const thisYearTotal = records
        .filter((r: any) => new Date(r.created_at).getFullYear() === currentYear && r.status === "completed")
        .reduce((sum: number, r: any) => sum + r.amount_cents, 0);
      setYearTotal(thisYearTotal);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleGive = async () => {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!cents || cents < 100) { toast.error("Minimum amount is $1.00"); return; }
    setSubmitting(true);
    try {
      await (supabase as any).from("church_giving_records").insert({
        church_id: churchId, user_id: user!.id,
        amount_cents: cents, giving_type: givingType, note: note || null,
        payment_method: "card", status: "completed",
      });
      toast.success(`$${(cents / 100).toFixed(2)} ${givingType} recorded. Thank you for your generosity!`);
      setAmount("");
      setNote("");
      loadData();
    } catch (err: any) { toast.error(err.message); } finally { setSubmitting(false); }
  };

  const formatCents = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            <CardTitle>Giving & Tithe</CardTitle>
          </div>
          <CardDescription>Support your church through tithes and offerings</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="give" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="give" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="h-4 w-4" />Give Now
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <History className="h-4 w-4" />History
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Target className="h-4 w-4" />Goals
          </TabsTrigger>
        </TabsList>

        {/* Give Now */}
        <TabsContent value="give">
          {/* Adventist Giving CTA for Tithe */}
          <Card variant="glass" className="mb-4 border-primary/30 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2.5 flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">Give Tithe & Offerings</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Submit your tithe and offerings securely through the official Adventist Giving portal — the denomination's trusted platform for faithful stewardship.
                  </p>
                  <Button asChild className="gap-2 w-full sm:w-auto" size="lg">
                    <a href="https://adventistgiving.org/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Give at AdventistGiving.org
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Local church offering tracker */}
          <Card variant="glass">
            <CardContent className="p-6 space-y-4">
              <div className="text-center mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Local Church Giving Tracker</p>
                <p className="text-3xl font-bold text-primary">{formatCents(yearTotal)}</p>
                <p className="text-sm text-muted-foreground">Your giving this year</p>
              </div>

              <div>
                <Label>Amount</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {AMOUNTS.map((a) => (
                    <Button
                      key={a}
                      variant={amount === a.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAmount(a.toString())}
                    >
                      ${a}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  placeholder="Custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-2"
                  min="1"
                  step="0.01"
                />
              </div>

              <div>
                <Label>Giving Type</Label>
                <Select value={givingType} onValueChange={setGivingType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{GIVING_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div>
                <Label>Note (optional)</Label>
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g., Youth retreat fund" />
              </div>

              <Button onClick={handleGive} disabled={submitting || !amount} className="w-full" size="lg">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CreditCard className="h-4 w-4 mr-2" />}
                Record Giving {amount ? formatCents(Math.round(parseFloat(amount) * 100)) : ""}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history">
          <Card variant="glass">
            <CardContent className="p-6">
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No giving history yet.</p>
              ) : (
                <div className="space-y-2">
                  {history.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-card/50">
                      <div>
                        <p className="text-sm font-medium">{formatCents(r.amount_cents)}</p>
                        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{r.giving_type}</Badge>
                        <Badge variant={r.status === "completed" ? "secondary" : "outline"} className="text-[10px]">{r.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals */}
        <TabsContent value="goals">
          <Card variant="glass">
            <CardContent className="p-6">
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No active giving goals.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.map((g) => {
                    const pct = g.target_amount_cents > 0 ? (g.current_amount_cents / g.target_amount_cents) * 100 : 0;
                    return (
                      <div key={g.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">{g.title}</h4>
                          <span className="text-sm font-semibold text-primary">{Math.round(pct)}%</span>
                        </div>
                        {g.description && <p className="text-xs text-muted-foreground">{g.description}</p>}
                        <Progress value={Math.min(pct, 100)} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCents(g.current_amount_cents)} raised</span>
                          <span>Goal: {formatCents(g.target_amount_cents)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
