import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function SavedVersesLibrary() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: savedVerses, isLoading } = useQuery({
    queryKey: ["saved-daily-verses", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_daily_verses" as any)
        .select("id, saved_at, verse_id, daily_verses!inner(id, verse_reference, verse_text, date, principles_used)")
        .eq("user_id", user.id)
        .order("saved_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!user,
  });

  const unsaveMutation = useMutation({
    mutationFn: async (savedId: string) => {
      const { error } = await supabase
        .from("saved_daily_verses" as any)
        .delete()
        .eq("id", savedId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-daily-verses"] });
      toast.success("Verse removed from saved");
    },
  });

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Saved Verses of the Day</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!savedVerses || savedVerses.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Bookmark className="h-10 w-10 mx-auto text-muted-foreground/40" />
              <p className="text-muted-foreground">No saved verses yet.</p>
              <p className="text-sm text-muted-foreground">Tap the Save button on any Verse of the Day to keep it here.</p>
              <Button variant="outline" size="sm" onClick={() => navigate("/daily-verse")} className="mt-2">
                <ExternalLink className="h-4 w-4 mr-2" />
                Go to Verse of the Day
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedVerses.map((saved: any) => {
                const verse = saved.daily_verses;
                return (
                  <Card key={saved.id} className="border-primary/10 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-primary text-sm">{verse?.verse_reference}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {new Date(verse?.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </Badge>
                          </div>
                          <p className="text-sm italic text-muted-foreground line-clamp-3">"{verse?.verse_text}"</p>
                          {verse?.principles_used?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {verse.principles_used.slice(0, 3).map((p: string, i: number) => (
                                <Badge key={i} variant="secondary" className="text-[10px]">{p}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => navigate("/daily-verse")}
                            title="View verse"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => unsaveMutation.mutate(saved.id)}
                            disabled={unsaveMutation.isPending}
                            title="Remove saved verse"
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
        </CardContent>
      </Card>
    </div>
  );
}
