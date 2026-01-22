import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePreservePage } from "@/hooks/usePreservePage";
import { formatDistanceToNow } from "date-fns";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  BookOpen,
  FileText,
  Sparkles,
  Flame,
  BookMarked,
  PlayCircle,
  Star,
  Brain
} from "lucide-react";
import { GlassBubbles } from "@/components/ui/glass-bubbles";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { myStudiesSteps } from "@/config/howItWorksSteps";
import { StudyPreviewCard } from "@/components/studies/StudyPreviewCard";
import { StudySortFilter, SortOption } from "@/components/studies/StudySortFilter";
import { StudyStats } from "@/components/studies/StudyStats";
import { StudyTagsManager } from "@/components/studies/StudyTagsManager";
import { StudyAnalytics } from "@/components/studies/StudyAnalytics";
import { SessionLibrary } from "@/components/session/SessionLibrary";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
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
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";

const VERSE_ANALYSIS_TEMPLATE = `# Verse Analysis

**Verse:** [Book Chapter:Verse]

**Text:**
[Insert verse text here]

## Observation (OR)
• What do I notice in this verse?
• Key words and phrases:
• Context:

## Interpretation (IR)
• What does this mean?
• How does this apply?

## Christ Connection (CR)
• How does this reveal Christ?

## Application
• How does this apply to my life today?

## Prayer
[Write a prayer based on this verse]`;

const CHAPTER_STUDY_TEMPLATE = `# Chapter Study

**Book & Chapter:** [Book Chapter]

## Overview
• Main theme:
• Key events:
• Important characters:

## Verse-by-Verse Notes
[Take notes on key verses]

## Dimensions (5D)
1. **Literal:** What happened?
2. **Christ:** How does this point to Christ?
3. **Personal:** What does this mean for me?
4. **Church:** What does this mean for the church?
5. **Heaven:** What does this reveal about eternity?

## Cross-References
• Related passages:

## Key Takeaways
1.
2.
3.

## Application
How will I apply this today?`;

const THEME_STUDY_TEMPLATE = `# Theme Study

**Theme:** [Your theme here]

## Definition
What is this theme about?

## Old Testament Examples
• 
• 
• 

## New Testament Examples
• 
• 
• 

## Christ Connection
How does Christ fulfill or embody this theme?

## Key Verses
1.
2.
3.

## Personal Application
How does this theme apply to my life?

## Questions to Explore
• 
• `;

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { setCustomState, getCustomState } = usePreservePage();
  
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(() => getCustomState<string>('myStudies_searchQuery') || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => searchParams.get('tab') || 'notes');

  // Sparks integration
  const {
    sparks,
    preferences: sparkPreferences,
    generateSpark,
    openSpark,
    saveSpark,
    dismissSpark,
    exploreSpark,
    updatePreferences: updateSparkPreferences
  } = useSparks({
    surface: 'study',
    contextType: 'study',
    contextId: 'my-studies',
    maxSparks: 3,
    debounceMs: 90000
  });

  // Persist search query and sync tab with URL
  useEffect(() => { setCustomState('myStudies_searchQuery', searchQuery); }, [searchQuery, setCustomState]);
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

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
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a study",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get a fresh session to ensure auth token is current
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user?.id) {
        console.error("Session error:", sessionError);
        throw new Error("Unable to verify authentication. Please try signing out and back in.");
      }

      // Use the session's access token explicitly
      const { data, error } = await supabase
        .from("user_studies")
        .insert({
          user_id: session.user.id,
          title,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        // Check if it's an RLS error
        if (error.message.includes("row-level security")) {
          throw new Error("Permission denied. Please try signing out and back in.");
        }
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Study created successfully",
      });
      navigate(`/my-studies/${data.id}`);
    } catch (error) {
      console.error("Error creating study:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create new study. Please try again.",
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

const [sortOption, setSortOption] = useState<SortOption>("updated");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from studies
  const allTags = [...new Set(studies.flatMap(s => s.tags))].sort();

  const filteredStudies = studies.filter((study) => {
    const matchesSearch = 
      study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => study.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  // Sort studies based on selected option
  const sortedStudies = [...filteredStudies].sort((a, b) => {
    switch (sortOption) {
      case "updated":
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      case "created":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "favorites":
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      default:
        return 0;
    }
  });

  const favoriteCount = filteredStudies.filter((study) => study.is_favorite).length;
  const mostRecentStudy = sortedStudies[0];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Sparks Container */}
      {sparks.length > 0 && (
        <div className="fixed bottom-24 right-4 md:bottom-auto md:top-20 z-50">
          <SparkContainer
            sparks={sparks}
            onOpen={openSpark}
            onSave={saveSpark}
            onDismiss={dismissSpark}
            onExplore={exploreSpark}
            position="floating"
          />
        </div>
      )}

      {/* Spark Settings */}
      <div className="fixed bottom-24 md:bottom-4 right-4 z-40">
        <SparkSettings
          preferences={sparkPreferences}
          onUpdate={updateSparkPreferences}
        />
      </div>

      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header - Glass Card */}
        <Card variant="glass" className="mb-8 p-6">
          <GlassBubbles />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Studies</h1>
              <p className="text-muted-foreground">
                Your personal Bible study notes and insights
              </p>
            </div>
            <div className="flex gap-2">
              <HowItWorksDialog title="How to Use My Studies" steps={myStudiesSteps} />
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
        </Card>

        {/* Tabs for different content types */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6 w-full justify-start">
            <TabsTrigger value="notes" className="gap-2">
              <FileText className="h-4 w-4" />
              Study Notes
            </TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2">
              <Brain className="h-4 w-4" />
              Study Buddy Sessions
            </TabsTrigger>
          </TabsList>

          {/* Study Notes Tab */}
          <TabsContent value="notes" className="mt-0">
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
              <div className="space-y-8">
                {/* Welcome Card */}
                <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-background border-primary/20">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl mb-2">Welcome to My Studies</CardTitle>
                    <CardDescription className="text-base max-w-2xl mx-auto">
                      This is where your Bible studies will live. Each study is a personal space where you can:
                      explore passages, apply Phototheology principles, save insights, and build your understanding of Scripture.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    Quick Start
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card 
                      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                      onClick={() => handleTemplateSelect({ name: "Verse Analysis", content: VERSE_ANALYSIS_TEMPLATE })}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Study a Verse</CardTitle>
                        <CardDescription>Deep dive into a single verse with guided questions</CardDescription>
                      </CardHeader>
                    </Card>

                    <Card 
                      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                      onClick={() => handleTemplateSelect({ name: "Chapter Study", content: CHAPTER_STUDY_TEMPLATE })}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-secondary/50 flex items-center justify-center mb-3 group-hover:bg-secondary/70 transition-colors">
                          <FileText className="w-6 h-6 text-secondary-foreground" />
                        </div>
                        <CardTitle className="text-lg">Study a Chapter</CardTitle>
                        <CardDescription>Comprehensive analysis of an entire chapter</CardDescription>
                      </CardHeader>
                    </Card>

                    <Card 
                      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                      onClick={() => handleTemplateSelect({ name: "Theme Study", content: THEME_STUDY_TEMPLATE })}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-accent/50 flex items-center justify-center mb-3 group-hover:bg-accent/70 transition-colors">
                          <Flame className="w-6 h-6 text-accent-foreground" />
                        </div>
                        <CardTitle className="text-lg">Study a Theme</CardTitle>
                        <CardDescription>Explore a biblical theme across Scripture</CardDescription>
                      </CardHeader>
                    </Card>

                    <Card 
                      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all group"
                      onClick={() => createNewStudy()}
                    >
                      <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3 group-hover:bg-muted/80 transition-colors">
                          <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <CardTitle className="text-lg">Start Blank</CardTitle>
                        <CardDescription>Create a custom study from scratch</CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                </div>

                {/* Tips Card */}
                <Card className="bg-muted/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookMarked className="w-5 h-5" />
                      Why Save Studies?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Build Your Palace</h4>
                        <p className="text-sm text-muted-foreground">Each study applies Palace Rooms and Phototheology principles to help you memorize and understand Scripture deeply.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Track Your Growth</h4>
                        <p className="text-sm text-muted-foreground">Review past insights and see how your understanding evolves over time.</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-primary font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">Prepare Lessons</h4>
                        <p className="text-sm text-muted-foreground">Use your studies as sermon seeds, teaching material, or discussion starters.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Progress Stats */}
                <StudyStats studies={studies} />

                {/* Analytics */}
                <StudyAnalytics studies={studies} />

                {/* Continue Where You Left Off - Enhanced */}
                {mostRecentStudy && (
                  <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/30 p-6 mb-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <PlayCircle className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold mb-1">Continue Your Study</h2>
                          <p className="text-lg font-medium text-foreground/90 line-clamp-1">{mostRecentStudy.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Last edited {formatDistanceToNow(new Date(mostRecentStudy.updated_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button 
                          onClick={() => navigate(`/my-studies/${mostRecentStudy.id}`)}
                          size="lg"
                          className="gap-2 flex-1 md:flex-none"
                        >
                          <PlayCircle className="w-5 h-5" />
                          Resume Study
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => toggleFavorite(mostRecentStudy.id, mostRecentStudy.is_favorite)}
                        >
                          <Star 
                            className={`w-5 h-5 ${mostRecentStudy.is_favorite ? "fill-amber-500 text-amber-500" : ""}`}
                          />
                        </Button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Sort & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                  <StudyTagsManager
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={(tag) => setSelectedTags(prev => [...prev, tag])}
                    onTagDeselect={(tag) => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    onClearFilters={() => setSelectedTags([])}
                  />
                  <StudySortFilter
                    currentSort={sortOption}
                    onSortChange={setSortOption}
                    totalCount={filteredStudies.length}
                    favoriteCount={favoriteCount}
                  />
                </div>

                {/* All Studies Grid */}
                {sortedStudies.length > 1 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sortedStudies.slice(1).map((study) => (
                      <StudyPreviewCard
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
              </div>
            )}
          </TabsContent>

          {/* Study Buddy Sessions Tab */}
          <TabsContent value="sessions" className="mt-0">
            <SessionLibrary />
          </TabsContent>
        </Tabs>
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

export default MyStudies;
