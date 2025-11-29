import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, FileText, Loader2, Edit, Presentation, ArrowLeft, Volume2 } from "lucide-react";
import { QuickAudioButton } from "@/components/audio";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SeriesWizard } from "@/components/series-builder/SeriesWizard";
import { SeriesTemplateList } from "@/components/series-builder/SeriesTemplateList";
import { SeriesList } from "@/components/series-builder/SeriesList";
import { SeriesOnboarding } from "@/components/series-builder/SeriesOnboarding";
import { SeriesProgressTracker } from "@/components/series-builder/SeriesProgressTracker";
import { SeriesShareDialog } from "@/components/series-builder/SeriesShareDialog";

const BibleStudySeriesBuilder = () => {
  const { user } = useAuth();
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [showWizard, setShowWizard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [userSeries, setUserSeries] = useState<any[]>([]);
  const [enrolledSeries, setEnrolledSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadUserSeries();
      loadEnrolledSeries();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (seriesId) {
      loadSeriesDetail(seriesId);
    } else {
      setSelectedSeries(null);
      setLessons([]);
    }
  }, [seriesId]);

  const loadUserSeries = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_template', false)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setUserSeries(data || []);
    } catch (error: any) {
      console.error('Error loading series:', error);
      toast.error('Failed to load your series');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrolledSeries = async () => {
    if (!user) return;

    try {
      const { data: enrollments } = await supabase
        .from('bible_study_series_enrollments')
        .select('series_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (!enrollments?.length) return;

      const seriesIds = enrollments.map(e => e.series_id);
      const { data: series } = await supabase
        .from('bible_study_series')
        .select('*')
        .in('id', seriesIds)
        .neq('user_id', user.id);

      setEnrolledSeries(series || []);
    } catch (error) {
      console.error('Error loading enrolled series:', error);
    }
  };

  const loadSeriesDetail = async (id: string) => {
    try {
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('id', id)
        .single();

      if (seriesError) throw seriesError;
      setSelectedSeries(seriesData);

      const { data: lessonData, error: lessonError } = await supabase
        .from('bible_study_lessons')
        .select('*')
        .eq('series_id', id)
        .order('lesson_number');

      if (lessonError) throw lessonError;
      setLessons(lessonData || []);
    } catch (error) {
      console.error('Error loading series detail:', error);
      toast.error('Failed to load series');
    }
  };

  if (showWizard) {
    return (
      <SeriesWizard 
        onComplete={() => {
          setShowWizard(false);
          loadUserSeries();
        }}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  if (showTemplates) {
    return (
      <SeriesTemplateList 
        onSelect={(template) => {
          setShowTemplates(false);
        }}
        onBack={() => setShowTemplates(false)}
      />
    );
  }

  // Series Detail View
  if (selectedSeries) {
    const isOwner = selectedSeries.user_id === user?.id;

    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        </div>

        <Navigation />
        <main className="container mx-auto px-4 py-8 relative z-10">
          <div className="max-w-6xl mx-auto space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <Button variant="ghost" onClick={() => navigate('/bible-study-series')} className="backdrop-blur-sm bg-background/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Series
              </Button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-start justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  {selectedSeries.title}
                </h1>
                <p className="text-muted-foreground mt-1">{selectedSeries.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-primary/20 text-primary border-primary/30">{selectedSeries.lesson_count} lessons</Badge>
                  <Badge variant="outline" className="backdrop-blur-sm">{selectedSeries.audience_type}</Badge>
                  <Badge variant="outline" className="backdrop-blur-sm">{selectedSeries.context}</Badge>
                  <Badge variant={selectedSeries.status === 'published' ? 'default' : 'secondary'}>
                    {selectedSeries.status}
                  </Badge>
                </div>
              </div>
              {isOwner && (
                <div className="flex gap-2">
                  <SeriesShareDialog
                    seriesId={selectedSeries.id}
                    seriesTitle={selectedSeries.title}
                    isPublic={selectedSeries.is_public}
                    shareToken={selectedSeries.share_token}
                    onUpdate={() => loadSeriesDetail(selectedSeries.id)}
                  />
                  <Button onClick={() => navigate(`/series/${selectedSeries.id}/present`)} className="gradient-palace">
                    <Presentation className="h-4 w-4 mr-2" />
                    Present
                  </Button>
                </div>
              )}
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lessons List */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-4"
              >
                <h2 className="text-xl font-bold">Lessons</h2>
                {lessons.length === 0 ? (
                  <Card variant="glass">
                    <CardContent className="py-8 text-center">
                      <p className="text-muted-foreground">No lessons yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card variant="glass" className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                          <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30">
                                    Lesson {lesson.lesson_number}
                                  </Badge>
                                  <span className="font-medium">{lesson.title}</span>
                                </div>
                                {lesson.big_idea && (
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                    {lesson.big_idea}
                                  </p>
                                )}
                                {lesson.key_passages && (
                                  <p className="text-xs text-primary mt-1">{lesson.key_passages}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                {lesson.big_idea && (
                                  <QuickAudioButton 
                                    text={`${lesson.title}. ${lesson.big_idea}`} 
                                    variant="ghost" 
                                    size="icon" 
                                  />
                                )}
                                {isOwner && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/series/${selectedSeries.id}/lesson/${lesson.lesson_number}`)}
                                    className="hover:bg-primary/10"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Progress Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <SeriesProgressTracker
                  seriesId={selectedSeries.id}
                  lessonCount={selectedSeries.lesson_count}
                  onLessonSelect={(num) => {
                    if (isOwner) {
                      navigate(`/series/${selectedSeries.id}/lesson/${num}`);
                    }
                  }}
                />
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main List View
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Navigation />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-4"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4 backdrop-blur-sm border border-primary/20 shadow-glow"
            >
              <BookOpen className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Build a Bible Study Series with the Palace
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create ready-to-teach studies that walk people through Scripture visually—floor by floor, room by room.
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userSeries.length === 0 && enrolledSeries.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SeriesOnboarding
                onCreateNew={() => setShowWizard(true)}
                onStartFromTemplate={() => setShowTemplates(true)}
                onBrowsePublic={() => navigate('/bible-study-series/discover')}
              />
            </motion.div>
          ) : (
            <>
              {/* Action Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  size="lg" 
                  onClick={() => setShowWizard(true)}
                  className="gap-2 gradient-palace shadow-elegant hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="h-5 w-5" />
                  Create New Series
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowTemplates(true)}
                  className="gap-2 backdrop-blur-sm bg-background/50 hover:bg-primary/10 transition-all duration-300"
                >
                  <FileText className="h-5 w-5" />
                  Start from a Template
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/bible-study-series/discover')}
                  className="gap-2 backdrop-blur-sm bg-background/50 hover:bg-primary/10 transition-all duration-300"
                >
                  <BookOpen className="h-5 w-5" />
                  Discover Public Series
                </Button>
              </motion.div>

              {/* User's Series */}
              {userSeries.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold">Your Series</h2>
                  <SeriesList series={userSeries} onUpdate={loadUserSeries} />
                </motion.div>
              )}

              {/* Enrolled Series */}
              {enrolledSeries.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <h2 className="text-2xl font-bold">Enrolled Series</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {enrolledSeries.map((s, index) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card 
                          variant="glass" 
                          className="hover:shadow-elegant transition-all duration-300 cursor-pointer hover:-translate-y-1" 
                          onClick={() => navigate(`/series/${s.id}`)}
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">{s.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{s.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="bg-primary/10 border-primary/30">{s.lesson_count} lessons</Badge>
                              <Badge variant="secondary">Enrolled</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BibleStudySeriesBuilder;
