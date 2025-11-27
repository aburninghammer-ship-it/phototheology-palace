import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Film, Plus, Edit, Trash2, Copy, FileText, Calendar, 
  CheckCircle2, Clock, Loader2, ArrowLeft 
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SermonPDFExport } from "@/components/sermon/SermonPDFExport";

interface Sermon {
  id: string;
  title: string;
  theme_passage: string;
  sermon_style: string;
  smooth_stones: any;
  bridges: any;
  movie_structure: any;
  status: string;
  current_step: number;
  created_at: string;
  updated_at: string;
}

export default function SermonArchive() {
  const navigate = useNavigate();
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSermon, setSelectedSermon] = useState<Sermon | null>(null);

  useEffect(() => {
    loadSermons();
  }, []);

  const loadSermons = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setSermons(data || []);
    } catch (error) {
      console.error("Error loading sermons:", error);
      toast.error("Failed to load sermons");
    } finally {
      setLoading(false);
    }
  };

  const deleteSermon = async (id: string) => {
    try {
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) throw error;
      setSermons(sermons.filter(s => s.id !== id));
      toast.success("Sermon deleted");
    } catch (error) {
      console.error("Error deleting sermon:", error);
      toast.error("Failed to delete sermon");
    }
  };

  const duplicateSermon = async (sermon: Sermon) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("sermons").insert({
        user_id: user.id,
        title: `${sermon.title} (Copy)`,
        theme_passage: sermon.theme_passage,
        sermon_style: sermon.sermon_style,
        smooth_stones: sermon.smooth_stones,
        bridges: sermon.bridges,
        movie_structure: sermon.movie_structure,
        status: "in_progress",
        current_step: sermon.current_step,
      });

      if (error) throw error;
      toast.success("Sermon duplicated");
      loadSermons();
    } catch (error) {
      console.error("Error duplicating sermon:", error);
      toast.error("Failed to duplicate sermon");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Navigation />
      
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Film className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-4xl font-bold text-white">Sermon Archive</h1>
                <p className="text-purple-200 text-lg">{sermons.length} saved sermons</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/sermon-builder")}
              className="bg-white text-purple-900 hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Sermon
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {sermons.length === 0 ? (
          <Card className="bg-white/95">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Sermons Yet</h3>
              <p className="text-muted-foreground mb-4">Start building your first sermon using the 5 Smooth Stones method</p>
              <Button onClick={() => navigate("/sermon-builder")}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Sermon
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <Card key={sermon.id} className="bg-white/95 hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{sermon.title}</CardTitle>
                    <Badge variant={sermon.status === "complete" ? "default" : "secondary"}>
                      {sermon.status === "complete" ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Complete</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Step {sermon.current_step}/5</>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground line-clamp-2">{sermon.theme_passage}</p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(sermon.updated_at), "MMM d, yyyy")}
                    </div>
                    <Badge variant="outline" className="text-xs">{sermon.sermon_style}</Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/sermon-builder?id=${sermon.id}`)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    
                    <SermonPDFExport sermon={sermon} />
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => duplicateSermon(sermon)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Sermon?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{sermon.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteSermon(sermon.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
