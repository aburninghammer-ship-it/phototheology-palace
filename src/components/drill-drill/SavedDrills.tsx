import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Calendar, Trash2, Eye, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { format } from "date-fns";
import { DrillMindMap } from "./DrillMindMap";
import { DrillSession } from "@/pages/DrillDrill";

interface SavedDrill {
  id: string;
  verse_reference: string;
  verse_text: string;
  mode: string;
  name: string;
  drill_data: any;
  created_at: string;
  completed_at: string;
}

export const SavedDrills = () => {
  const { user } = useAuth();
  const [drills, setDrills] = useState<SavedDrill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrill, setSelectedDrill] = useState<DrillSession | null>(null);

  useEffect(() => {
    if (user) {
      fetchDrills();
    }
  }, [user]);

  const fetchDrills = async () => {
    try {
      const { data, error } = await supabase
        .from("drill_sessions" as any)
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDrills((data || []) as unknown as SavedDrill[]);
    } catch (error) {
      console.error("Error fetching drills:", error);
      toast.error("Failed to load saved drills");
    } finally {
      setLoading(false);
    }
  };

  const deleteDrill = async (id: string) => {
    try {
      const { error } = await supabase
        .from("drill_sessions" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      setDrills(prev => prev.filter(d => d.id !== id));
      toast.success("Drill deleted");
    } catch (error) {
      console.error("Error deleting drill:", error);
      toast.error("Failed to delete drill");
    }
  };

  const viewDrill = (drill: SavedDrill) => {
    const isThought = drill.verse_reference?.startsWith("Thought:");
    const session: DrillSession = {
      id: drill.id,
      verse: drill.verse_reference,
      verseText: drill.verse_text,
      thought: isThought ? drill.drill_data?.thought : undefined,
      drillType: isThought ? "thought" : "verse",
      mode: drill.mode as any,
      difficulty: (drill.drill_data?.difficulty || "intermediate") as any,
      responses: drill.drill_data?.responses || [],
      mindMap: drill.drill_data?.mindMap,
      createdAt: new Date(drill.created_at),
      completedAt: drill.completed_at ? new Date(drill.completed_at) : undefined,
      name: drill.name
    };
    setSelectedDrill(session);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Please sign in to view saved drills</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (selectedDrill) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setSelectedDrill(null)}>
          ← Back to Saved Drills
        </Button>
        <DrillMindMap 
          session={selectedDrill} 
          onSave={() => {}} 
        />
      </div>
    );
  }

  if (drills.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Saved Drills</h3>
          <p className="text-muted-foreground">
            Complete a drill and save it to see it here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {drills.map(drill => (
        <Card key={drill.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{drill.name || drill.verse_reference}</CardTitle>
                {drill.name && (
                  <CardDescription>{drill.verse_reference}</CardDescription>
                )}
              </div>
              <Badge variant="outline">{drill.mode}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {drill.verse_text && (
              <p className="text-sm text-muted-foreground italic mb-4 line-clamp-2">
                "{drill.verse_text}"
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {format(new Date(drill.created_at), "MMM d, yyyy")}
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => viewDrill(drill)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => deleteDrill(drill.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
