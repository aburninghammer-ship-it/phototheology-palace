import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Film, Plus, Edit, Trash2, Copy, FileText, Calendar, 
  CheckCircle2, Clock, Loader2, ArrowLeft, Presentation,
  Download, ClipboardCopy
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const { t } = useTranslation();
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
      toast.error(t('sermon.archive.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const deleteSermon = async (id: string) => {
    try {
      const { error } = await supabase.from("sermons").delete().eq("id", id);
      if (error) throw error;
      setSermons(sermons.filter(s => s.id !== id));
      toast.success(t('sermon.archive.deleted'));
    } catch (error) {
      console.error("Error deleting sermon:", error);
      toast.error(t('sermon.archive.deleteError'));
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
      toast.success(t('sermon.archive.duplicated'));
      loadSermons();
    } catch (error) {
      console.error("Error duplicating sermon:", error);
      toast.error(t('sermon.archive.duplicateError'));
    }
  };

  const formatSermonText = (sermon: Sermon): string => {
    const parts: string[] = [];
    parts.push(sermon.title);
    parts.push("=".repeat(sermon.title.length));
    if (sermon.theme_passage) parts.push(`\nPassage: ${sermon.theme_passage}`);
    if (sermon.sermon_style) parts.push(`Style: ${sermon.sermon_style}`);
    
    const stones = Array.isArray(sermon.smooth_stones) ? sermon.smooth_stones : [];
    if (stones.length > 0) {
      parts.push("\n--- 5 Smooth Stones ---");
      stones.forEach((s: string, i: number) => parts.push(`${i + 1}. ${s}`));
    }
    
    const bridges = Array.isArray(sermon.bridges) ? sermon.bridges : [];
    if (bridges.length > 0) {
      parts.push("\n--- Bridges ---");
      bridges.forEach((b: string, i: number) => parts.push(`${i + 1}. ${b}`));
    }
    
    const ms = sermon.movie_structure || {};
    if (ms.opening) parts.push(`\n--- Opening ---\n${ms.opening}`);
    if (ms.climax) parts.push(`\n--- Climax ---\n${ms.climax}`);
    if (ms.resolution) parts.push(`\n--- Resolution ---\n${ms.resolution}`);
    if (ms.call_to_action) parts.push(`\n--- Call to Action ---\n${ms.call_to_action}`);
    
    return parts.join("\n");
  };

  const copySermon = (sermon: Sermon) => {
    navigator.clipboard.writeText(formatSermonText(sermon));
    toast.success("Sermon copied to clipboard!");
  };

  const downloadSermonTxt = (sermon: Sermon) => {
    const text = formatSermonText(sermon);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${sermon.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Sermon downloaded!");
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
                <h1 className="text-4xl font-bold text-white">{t('sermon.archive.title')}</h1>
                <p className="text-purple-200 text-lg">{t('sermon.archive.savedCount', { count: sermons.length })}</p>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/sermon-builder")}
              className="bg-white text-purple-900 hover:bg-white/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('sermon.archive.newSermon')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {sermons.length === 0 ? (
          <Card className="bg-white/95">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">{t('sermon.archive.noSermonsTitle')}</h3>
              <p className="text-muted-foreground mb-4">{t('sermon.archive.noSermonsDescription')}</p>
              <Button onClick={() => navigate("/sermon-builder")}>
                <Plus className="w-4 h-4 mr-2" />
                {t('sermon.archive.createFirst')}
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
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> {t('sermon.archive.complete')}</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> {t('sermon.archive.step', { current: sermon.current_step, total: 5 })}</>
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
                      {t('common.edit')}
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => copySermon(sermon)}>
                          <ClipboardCopy className="w-4 h-4 mr-2" />
                          Copy to Clipboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => downloadSermonTxt(sermon)}>
                          <FileText className="w-4 h-4 mr-2" />
                          Download .txt
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <SermonPDFExport sermon={sermon} />
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/sermon-powerpoint?id=${sermon.id}`)}
                    >
                      <Presentation className="w-4 h-4 mr-1" />
                      PPT
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => duplicateSermon(sermon)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {t('common.copy')}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t('sermon.archive.deleteConfirmTitle')}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t('sermon.archive.deleteConfirmDescription', { title: sermon.title })}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteSermon(sermon.id)}>
                            {t('common.delete')}
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
