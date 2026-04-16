import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Users, Loader2, CheckCircle } from "lucide-react";

export default function PublicSeriesBrowser() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [series, setSeries] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    loadPublicSeries();
    if (user) {
      loadEnrollments();
    }
  }, [user]);

  const loadPublicSeries = async () => {
    try {
      const { data, error } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSeries(data || []);
    } catch (error) {
      console.error('Error loading public series:', error);
      toast.error(t('public.failedToLoadSeries'));
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('bible_study_series_enrollments')
        .select('series_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      setEnrollments((data || []).map(e => e.series_id));
    } catch (error) {
      console.error('Error loading enrollments:', error);
    }
  };

  const handleEnroll = async (seriesId: string) => {
    if (!user) {
      toast.error(t('public.signInToEnroll'));
      return;
    }

    setEnrolling(seriesId);
    try {
      const { error } = await supabase
        .from('bible_study_series_enrollments')
        .insert({
          user_id: user.id,
          series_id: seriesId
        });

      if (error) throw error;

      setEnrollments([...enrollments, seriesId]);
      toast.success(t('public.enrolledSuccessfully'));
    } catch (error: any) {
      if (error.code === '23505') {
        toast.info(t('public.alreadyEnrolled'));
      } else {
        console.error('Error enrolling:', error);
        toast.error(t('public.failedToEnroll'));
      }
    } finally {
      setEnrolling(null);
    }
  };

  const filteredSeries = series.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.theme_subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">{t('public.discoverSeries')}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('public.discoverSeriesSubtitle')}
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('public.searchSeriesPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Series Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSeries.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery ? t('public.noSeriesMatch') : t('public.noPublicSeries')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSeries.map((s) => {
                const isEnrolled = enrollments.includes(s.id);
                return (
                  <Card key={s.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2">{s.title}</CardTitle>
                        {isEnrolled && (
                          <Badge variant="default" className="shrink-0">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {t('public.enrolled')}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {s.description || s.primary_goal}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{t('public.lessonsCount', { count: s.lesson_count })}</Badge>
                        <Badge variant="outline">{s.audience_type}</Badge>
                        <Badge variant="outline">{s.context}</Badge>
                      </div>

                      <div className="flex gap-2">
                        {isEnrolled ? (
                          <Button 
                            className="flex-1"
                            onClick={() => navigate(`/series/${s.id}/study`)}
                          >
                            {t('public.continueStudying')}
                          </Button>
                        ) : (
                          <Button 
                            className="flex-1"
                            onClick={() => handleEnroll(s.id)}
                            disabled={enrolling === s.id}
                          >
                            {enrolling === s.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              t('public.enroll')
                            )}
                          </Button>
                        )}
                        <Button 
                          variant="outline"
                          onClick={() => navigate(`/series/${s.id}/preview`)}
                        >
                          {t('public.preview')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
