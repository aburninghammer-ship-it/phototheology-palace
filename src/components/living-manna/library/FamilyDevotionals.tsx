import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Baby, BookHeart, Loader2, Palette, MessageCircleQuestion } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FamilyDevotionalsProps { churchId: string; }

const AGE_LABELS: Record<string, string> = {
  toddler: "Toddler (1-3)",
  preschool: "Preschool (4-5)",
  elementary: "Elementary (6-10)",
  preteen: "Preteen (11-13)",
  teen: "Teen (14-17)",
  all: "All Ages",
};

const AGE_COLORS: Record<string, string> = {
  toddler: "bg-pink-500/10 text-pink-600",
  preschool: "bg-purple-500/10 text-purple-600",
  elementary: "bg-blue-500/10 text-blue-600",
  preteen: "bg-green-500/10 text-green-600",
  teen: "bg-orange-500/10 text-orange-600",
  all: "bg-primary/10 text-primary",
};

export function FamilyDevotionals({ churchId }: FamilyDevotionalsProps) {
  const [loading, setLoading] = useState(true);
  const [devotionals, setDevotionals] = useState<any[]>([]);
  const [selectedAge, setSelectedAge] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { if (churchId) loadData(); }, [churchId]);

  const loadData = async () => {
    try {
      let query = (supabase as any).from("church_family_devotionals")
        .select("*").eq("church_id", churchId).order("week_date", { ascending: false });
      if (selectedAge !== "all") query = query.eq("age_group", selectedAge);
      const { data } = await query;
      setDevotionals(data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { if (churchId) { setLoading(true); loadData(); } }, [selectedAge]);

  if (loading) return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookHeart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Family Devotionals</CardTitle>
            </div>
            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ages</SelectItem>
                {Object.entries(AGE_LABELS).filter(([k]) => k !== "all").map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {devotionals.length === 0 ? (
            <div className="text-center py-8">
              <Baby className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No family devotionals available yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Leaders can create devotionals tied to the weekly study.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {devotionals.map((d) => (
                <Card key={d.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpandedId(expandedId === d.id ? null : d.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{d.title}</h4>
                        {d.description && <p className="text-sm text-muted-foreground mt-1">{d.description}</p>}
                      </div>
                      <Badge variant="outline" className={AGE_COLORS[d.age_group] || ""}>{AGE_LABELS[d.age_group]}</Badge>
                    </div>

                    {expandedId === d.id && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {d.parents_guide && (
                          <div>
                            <h5 className="text-sm font-semibold flex items-center gap-1"><BookHeart className="h-3.5 w-3.5" />Parents Guide</h5>
                            <p className="text-sm text-muted-foreground mt-1">{d.parents_guide}</p>
                          </div>
                        )}
                        {d.opening_activity && (
                          <div>
                            <h5 className="text-sm font-semibold flex items-center gap-1"><Palette className="h-3.5 w-3.5" />Opening Activity</h5>
                            <p className="text-sm text-muted-foreground mt-1">{d.opening_activity}</p>
                          </div>
                        )}
                        {d.simplified_lesson && (
                          <div>
                            <h5 className="text-sm font-semibold">Lesson</h5>
                            <p className="text-sm text-muted-foreground mt-1">{d.simplified_lesson}</p>
                          </div>
                        )}
                        {d.discussion_questions?.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold flex items-center gap-1"><MessageCircleQuestion className="h-3.5 w-3.5" />Discussion Questions</h5>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {d.discussion_questions.map((q: string, i: number) => (
                                <li key={i} className="text-sm text-muted-foreground">{q}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {d.memory_verse_simplified && (
                          <div>
                            <h5 className="text-sm font-semibold">Memory Verse</h5>
                            <p className="text-sm text-muted-foreground italic mt-1">"{d.memory_verse_simplified}"</p>
                          </div>
                        )}
                        {d.closing_activity && (
                          <div>
                            <h5 className="text-sm font-semibold flex items-center gap-1"><Palette className="h-3.5 w-3.5" />Closing Activity</h5>
                            <p className="text-sm text-muted-foreground mt-1">{d.closing_activity}</p>
                          </div>
                        )}
                      </div>
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
