import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  BookOpen,
  Star,
  Calendar,
  Trash2,
  Edit,
  FileText
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { StudyTemplates } from "@/components/studies/StudyTemplates";

interface Study {
  id: string;
  title: string;
  content: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

const MyStudies = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      fetchStudies();
    }
  }, [user, authLoading]);

  const fetchStudies = async () => {
    try {
      const { data, error } = await supabase
        .from("user_studies")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setStudies(data || []);
    } catch (error) {
      console.error("Error fetching studies:", error);
      toast({
        title: "Error",
        description: "Failed to load your studies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewStudy = async (title = "Untitled Study", content = "") => {
    // Verify we have a valid session before proceeding
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("No valid session:", sessionError);
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a study",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_studies")
        .insert([
          {
            user_id: session.user.id,
            title,
            content,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      navigate(`/my-studies/${data.id}`);
      toast({
        title: "Success",
        description: "Study created successfully",
      });
    } catch (error) {
      console.error("Error creating study:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create new study",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (template: { name: string; content: string }) => {
    createNewStudy(template.name, template.content);
  };

  const toggleFavorite = async (studyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("user_studies")
        .update({ is_favorite: !currentStatus })
        .eq("id", studyId);

      if (error) throw error;
      fetchStudies();
    } catch (error) {
      console.error("Error updating favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive",
      });
    }
  };

  const deleteStudy = async () => {
    if (!studyToDelete) return;

    try {
      const { error } = await supabase
        .from("user_studies")
        .delete()
        .eq("id", studyToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Study deleted successfully",
      });
      fetchStudies();
    } catch (error) {
      console.error("Error deleting study:", error);
      toast({
        title: "Error",
        description: "Failed to delete study",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setStudyToDelete(null);
    }
  };

  const filteredStudies = studies.filter((study) =>
    study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const favoriteStudies = filteredStudies.filter((study) => study.is_favorite);
  const regularStudies = filteredStudies.filter((study) => !study.is_favorite);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Studies</h1>
            <p className="text-muted-foreground">
              Your personal Bible study notes and insights
            </p>
          </div>
          <div className="flex gap-2">
            <StudyTemplates onSelect={handleTemplateSelect} />
            <Button 
              onClick={() => createNewStudy()} 
              size="lg" 
              className="gap-2"
              disabled={authLoading || !user}
            >
              <Plus className="w-5 h-5" />
              New Study
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search studies by title, content, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>

        {loading || authLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your studies...</p>
          </div>
        ) : studies.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No studies yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first study to start taking notes
              </p>
              <Button onClick={() => createNewStudy()} className="gap-2" disabled={authLoading || !user}>
                <Plus className="w-5 h-5" />
                Create First Study
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Favorites Section */}
            {favoriteStudies.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-2xl font-semibold">Favorites</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onToggleFavorite={toggleFavorite}
                      onDelete={(id) => {
                        setStudyToDelete(id);
                        setDeleteDialogOpen(true);
                      }}
                      onEdit={(id) => navigate(`/my-studies/${id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Studies */}
            {regularStudies.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {favoriteStudies.length > 0 ? "All Studies" : ""}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularStudies.map((study) => (
                    <StudyCard
                      key={study.id}
                      study={study}
                      onToggleFavorite={toggleFavorite}
                      onDelete={(id) => {
                        setStudyToDelete(id);
                        setDeleteDialogOpen(true);
                      }}
                      onEdit={(id) => navigate(`/my-studies/${id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredStudies.length === 0 && searchQuery && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search query
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this study. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteStudy} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface StudyCardProps {
  study: Study;
  onToggleFavorite: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const StudyCard = ({ study, onToggleFavorite, onDelete, onEdit }: StudyCardProps) => {
  const contentPreview = study.content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .slice(0, 150);

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
      <CardHeader onClick={() => onEdit(study.id)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {study.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-xs">
              <Calendar className="w-3 h-3" />
              {formatDistanceToNow(new Date(study.updated_at), { addSuffix: true })}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(study.id, study.is_favorite);
            }}
            className="shrink-0"
          >
            <Star
              className={`w-4 h-4 ${
                study.is_favorite ? "fill-amber-500 text-amber-500" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent onClick={() => onEdit(study.id)}>
        {contentPreview && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {contentPreview}...
          </p>
        )}
        
        {study.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {study.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {study.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{study.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(study.id);
            }}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(study.id);
            }}
            className="gap-2 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyStudies;
