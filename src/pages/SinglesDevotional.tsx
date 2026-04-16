import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Heart, Sun, BookOpen, Calendar, ChevronRight,
  RefreshCw, Sparkles, Check, Star, Clock, Loader2,
  ArrowLeft, MessageSquare, Bookmark, Share2
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Series {
  id: string;
  title: string;
  description: string;
  theme: string;
  total_days: number;
  tags: string[];
  anchor_scriptures: string[];
  is_featured: boolean;
}

interface DailyDevotional {
  id?: string;
  title: string;
  scriptureReference: string;
  scriptureText: string;
  openingThought: string;
  mainContent: string;
  reflectionQuestions: string[];
  prayerPrompt: string;
  practicalApplication: string;
  christConnection: string;
  theme?: string;
}

interface UserProgress {
  series_id: string;
  completed_entries: number;
}

export default function SinglesDevotional() {
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"daily" | "series">("daily");
  const [series, setSeries] = useState<Series[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [dailyDevotional, setDailyDevotional] = useState<DailyDevotional | null>(null);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Fetch series
  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('singles_devotional_series')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (error) throw error;
        setSeries((data as Series[]) || []);
      } catch (err) {
        console.error('Error fetching series:', err);
        toast.error('Failed to load devotional series');
      } finally {
        setSeriesLoading(false);
      }
    };

    fetchSeries();
  }, []);

  // Fetch daily devotional
  useEffect(() => {
    const fetchDaily = async () => {
      setDailyLoading(true);
      try {
        // First check cache
        const today = new Date().toISOString().split('T')[0];
        const { data: cached, error: cacheError } = await (supabase as any)
          .from('daily_singles_devotional_cache')
          .select('*')
          .eq('date_for', today)
          .maybeSingle();

        if (cached && !cacheError) {
          const c = cached as any;
          setDailyDevotional({
            id: c.id,
            title: c.title,
            scriptureReference: c.scripture_reference,
            scriptureText: c.scripture_text || '',
            openingThought: c.opening_thought,
            mainContent: c.main_content,
            reflectionQuestions: c.reflection_questions || [],
            prayerPrompt: c.prayer_prompt || '',
            practicalApplication: c.practical_application || '',
            christConnection: c.christ_connection || '',
            theme: c.theme,
          });
          setDailyLoading(false);
          return;
        }

        // Generate new if not cached
        await generateDaily();
      } catch (err) {
        console.error('Error fetching daily:', err);
        setDailyLoading(false);
      }
    };

    fetchDaily();
  }, []);

  // Fetch user progress
  useEffect(() => {
    if (!user?.id) return;

    const fetchProgress = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('user_singles_devotional_progress')
          .select('series_id')
          .eq('user_id', user.id);

        if (error) throw error;

        // Count completed entries per series
        const progress: Record<string, number> = {};
        ((data as any[]) || []).forEach((p: any) => {
          if (p.series_id) {
            progress[p.series_id] = (progress[p.series_id] || 0) + 1;
          }
        });
        setUserProgress(progress);
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };

    fetchProgress();
  }, [user?.id]);

  const generateDaily = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-singles-devotional', {
        body: { mode: 'daily' }
      });

      if (error) throw error;

      if (data?.devotional) {
        setDailyDevotional(data.devotional);
      }
    } catch (err) {
      console.error('Error generating daily:', err);
      toast.error('Failed to generate daily devotional');
    } finally {
      setGenerating(false);
      setDailyLoading(false);
    }
  };

  const featuredSeries = series.filter(s => s.is_featured);
  const otherSeries = series.filter(s => !s.is_featured);

  return (
    <div className="min-h-screen bg-background">
      {preferences.navigation_style === "simplified" ? <SimplifiedNav /> : <Navigation />}

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 py-12 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/20 to-pink-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-rose-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm shadow-xl">
              <Heart className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Singles Devotional</h1>
              <p className="text-white/80 text-lg">Daily encouragement for your journey</p>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap mt-6">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sun className="h-3 w-3 mr-1" />
              Daily Devotional
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <BookOpen className="h-3 w-3 mr-1" />
              {series.length} Series
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 pb-28 md:pb-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="daily" className="gap-2">
              <Sun className="h-4 w-4" />
              Today's Devotional
            </TabsTrigger>
            <TabsTrigger value="series" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Series
            </TabsTrigger>
          </TabsList>

          {/* Daily Devotional Tab */}
          <TabsContent value="daily" className="space-y-6">
            {dailyLoading || generating ? (
              <Card className="overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-rose-500 to-purple-500" />
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                    <span className="ml-3 text-muted-foreground">
                      {generating ? 'Generating today\'s devotional...' : 'Loading...'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : dailyDevotional ? (
              <Card className="overflow-hidden border-2 border-rose-200 dark:border-rose-800">
                <div className="h-2 bg-gradient-to-r from-rose-500 to-purple-500" />
                <CardHeader className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <CardTitle className="text-2xl font-serif">{dailyDevotional.title}</CardTitle>
                  <CardDescription className="text-base font-medium text-rose-600 dark:text-rose-400">
                    {dailyDevotional.scriptureReference}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  {/* Scripture */}
                  <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-rose-400">
                    <p className="italic text-lg leading-relaxed font-serif">
                      "{dailyDevotional.scriptureText}"
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 text-right">
                      — {dailyDevotional.scriptureReference} (KJV)
                    </p>
                  </div>

                  {/* Opening Thought */}
                  <div>
                    <p className="text-lg leading-relaxed text-muted-foreground italic">
                      {dailyDevotional.openingThought}
                    </p>
                  </div>

                  {/* Main Content */}
                  <div className="prose prose-rose dark:prose-invert max-w-none">
                    {dailyDevotional.mainContent.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="leading-relaxed">{paragraph}</p>
                    ))}
                  </div>

                  {/* Reflection Questions */}
                  <div
                    className={cn(
                      "rounded-lg border transition-all cursor-pointer",
                      expandedSection === 'reflection'
                        ? "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setExpandedSection(expandedSection === 'reflection' ? null : 'reflection')}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-purple-500" />
                        <span className="font-semibold">Reflection Questions</span>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-transform",
                        expandedSection === 'reflection' && "rotate-90"
                      )} />
                    </div>
                    {expandedSection === 'reflection' && (
                      <div className="px-4 pb-4 space-y-3">
                        {dailyDevotional.reflectionQuestions.map((q, i) => (
                          <div key={i} className="flex gap-3">
                            <span className="font-bold text-purple-500">{i + 1}.</span>
                            <p>{q}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Prayer Prompt */}
                  <div
                    className={cn(
                      "rounded-lg border transition-all cursor-pointer",
                      expandedSection === 'prayer'
                        ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setExpandedSection(expandedSection === 'prayer' ? null : 'prayer')}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span className="font-semibold">Prayer Prompt</span>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-transform",
                        expandedSection === 'prayer' && "rotate-90"
                      )} />
                    </div>
                    {expandedSection === 'prayer' && (
                      <div className="px-4 pb-4">
                        <p className="italic">{dailyDevotional.prayerPrompt}</p>
                      </div>
                    )}
                  </div>

                  {/* Practical Application */}
                  <div
                    className={cn(
                      "rounded-lg border transition-all cursor-pointer",
                      expandedSection === 'application'
                        ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => setExpandedSection(expandedSection === 'application' ? null : 'application')}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <span className="font-semibold">Today's Application</span>
                      </div>
                      <ChevronRight className={cn(
                        "h-5 w-5 transition-transform",
                        expandedSection === 'application' && "rotate-90"
                      )} />
                    </div>
                    {expandedSection === 'application' && (
                      <div className="px-4 pb-4">
                        <p>{dailyDevotional.practicalApplication}</p>
                      </div>
                    )}
                  </div>

                  {/* Christ Connection */}
                  <div className="bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/30 dark:to-purple-950/30 rounded-lg p-4 border border-rose-200 dark:border-rose-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-rose-500" />
                      <span className="font-semibold text-rose-700 dark:text-rose-300">Connection to Christ</span>
                    </div>
                    <p className="text-sm leading-relaxed">{dailyDevotional.christConnection}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button variant="outline" className="flex-1">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-rose-200 dark:border-rose-800">
                <CardContent className="py-12 text-center">
                  <Sun className="h-12 w-12 mx-auto text-rose-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Devotional Today</h3>
                  <p className="text-muted-foreground mb-4">Generate a fresh devotional for today</p>
                  <Button
                    onClick={generateDaily}
                    className="bg-gradient-to-r from-rose-500 to-purple-500"
                    disabled={generating}
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Generate Devotional
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Series Tab */}
          <TabsContent value="series" className="space-y-8">
            {seriesLoading ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-2 w-full" />
                    <CardContent className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Featured Series */}
                {featuredSeries.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      Featured Series
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {featuredSeries.map((s) => (
                        <SeriesCard
                          key={s.id}
                          series={s}
                          progress={userProgress[s.id] || 0}
                          onClick={() => navigate(`/singles-devotional/series/${s.id}`)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Other Series */}
                {otherSeries.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-rose-500" />
                      All Series
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {otherSeries.map((s) => (
                        <SeriesCard
                          key={s.id}
                          series={s}
                          progress={userProgress[s.id] || 0}
                          onClick={() => navigate(`/singles-devotional/series/${s.id}`)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {series.length === 0 && (
                  <Card className="border-2 border-dashed">
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Series Available</h3>
                      <p className="text-muted-foreground">Check back soon for new devotional series!</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Series Card Component
function SeriesCard({
  series,
  progress,
  onClick
}: {
  series: Series;
  progress: number;
  onClick: () => void;
}) {
  const progressPercent = Math.round((progress / series.total_days) * 100);

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden border-2 hover:border-rose-400 dark:hover:border-rose-600"
      onClick={onClick}
    >
      <div className="h-2 bg-gradient-to-r from-rose-400 to-purple-400" />
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              {series.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {series.description}
            </CardDescription>
          </div>
          {series.is_featured && (
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 shrink-0">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {series.total_days} days
          </span>
          {progress > 0 && (
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" />
              {progress}/{series.total_days} completed
            </span>
          )}
        </div>

        {progress > 0 && (
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-purple-500 transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-1.5">
          {series.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {series.anchor_scriptures[0]}
          </span>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-rose-500 transition-colors" />
        </div>
      </CardContent>
    </Card>
  );
}
