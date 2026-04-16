import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Sparkles, Heart, Loader2, Share2, ExternalLink, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShareDevotionalDialog } from "@/components/devotionals/ShareDevotionalDialog";
import { SEO } from "@/components/SEO";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { DevotionalPlan, DevotionalDay } from "@/hooks/useDevotionals";

const formatGradients: Record<string, string> = {
  standard: "from-blue-500 via-cyan-500 to-teal-500",
  "24fps": "from-purple-500 via-pink-500 to-rose-500",
  blueprint: "from-amber-500 via-orange-500 to-red-500",
  "room-driven": "from-emerald-500 via-teal-500 to-cyan-500",
  "verse-genetics": "from-rose-500 via-pink-500 to-purple-500",
};

export default function PublicDevotionalView() {
  const { t } = useTranslation();
  const { shareToken } = useParams<{ shareToken: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");

  const handleCrossReferenceClick = (ref: string) => {
    navigator.clipboard.writeText(ref);
    toast({
      title: t('public.referenceCopied'),
      description: t('public.copiedToClipboard', { ref }),
    });
  };

  // Fetch plan by share token
  const { data: plan, isLoading: planLoading } = useQuery({
    queryKey: ["public-devotional-plan", shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_plans")
        .select("*")
        .eq("share_token", shareToken)
        .eq("is_public", true)
        .single();

      if (error) throw error;
      return data as DevotionalPlan;
    },
    enabled: !!shareToken,
  });

  // Fetch days for the plan
  const { data: days } = useQuery({
    queryKey: ["public-devotional-days", plan?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("devotional_days")
        .select("*")
        .eq("plan_id", plan?.id)
        .order("day_number", { ascending: true });

      if (error) throw error;
      return data as DevotionalDay[];
    },
    enabled: !!plan?.id,
  });

  if (planLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('public.loadingDevotional')}</p>
        </div>
      </div>
    );
  }

  if (!plan || !days || days.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">{t('public.devotionalNotFound')}</h2>
            <p className="text-muted-foreground mb-6">
              {t('public.devotionalNotFoundDescription')}
            </p>
            <Link to="/auth">
              <Button>
                <Gift className="h-4 w-4 mr-2" />
                {t('public.getPhototheologyFree')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentDay = days[selectedDayIndex];
  const gradient = formatGradients[plan.format] || formatGradients.standard;

  const goToPrevDay = () => setSelectedDayIndex(Math.max(0, selectedDayIndex - 1));
  const goToNextDay = () => setSelectedDayIndex(Math.min(days.length - 1, selectedDayIndex + 1));

  // Build SEO description from current day content
  const seoDescription = currentDay?.devotional_text
    ? currentDay.devotional_text.substring(0, 155) + '...'
    : currentDay?.christ_connection
      ? currentDay.christ_connection.substring(0, 155) + '...'
      : `A ${plan.duration}-day devotional journey on: ${plan.theme}`;

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={plan.title}
        description={seoDescription}
      />
      {/* Get Phototheology Free Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white py-3 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="font-medium">{t('public.getFreeAccessBanner')}</span>
            </div>
            <Link to="/auth?plan=devotionals">
              <Button size="sm" variant="secondary" className="bg-white text-purple-700 hover:bg-white/90">
                {t('public.getStartedFree')}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Colorful Header */}
      <div className={`relative bg-gradient-to-r ${gradient} py-6 px-4`}>
        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-bold text-white text-lg truncate max-w-[200px] md:max-w-none">{plan.title}</h1>
                <p className="text-white/80 text-sm">Day {selectedDayIndex + 1} of {plan.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {plan && currentDay && (
                <ShareDevotionalDialog 
                  plan={plan} 
                  day={currentDay}
                  isPublicView={true}
                  trigger={
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  }
                />
              )}
              <Button variant="ghost" size="icon" onClick={goToPrevDay} disabled={selectedDayIndex === 0} className="text-white hover:bg-white/20 disabled:opacity-30">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={goToNextDay} disabled={selectedDayIndex === days.length - 1} className="text-white hover:bg-white/20 disabled:opacity-30">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Day Progress - Colorful Pills */}
      <div className="bg-background/95 backdrop-blur border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {days.map((day, idx) => (
                <button
                  key={day.id}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={cn(
                    "w-10 h-10 rounded-full text-xs font-bold flex-shrink-0 transition-all shadow-md",
                    idx === selectedDayIndex
                      ? `bg-gradient-to-br ${gradient} text-white scale-110`
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      {currentDay && (
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {/* Day Header */}
          <div className="text-center space-y-3">
            {currentDay.room_assignment && (
              <Badge className={`bg-gradient-to-r ${gradient} text-white border-0`}>
                {currentDay.room_assignment}
              </Badge>
            )}
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              {currentDay.title}
            </h2>
          </div>

          {/* Scripture Card */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className={`h-2 bg-gradient-to-r ${gradient}`} />
            <CardHeader className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 pb-2">
              <CardTitle className="text-base flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                <BookOpen className="h-5 w-5" />
                {currentDay.scripture_reference}
              </CardTitle>
            </CardHeader>
            <CardContent className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 pt-0">
              <p className="text-xl italic leading-relaxed text-indigo-900 dark:text-indigo-100 font-serif">
                "{currentDay.scripture_text}"
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="devotion" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 relative z-10">
              <TabsTrigger value="devotion" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                💡 Devotion
              </TabsTrigger>
              <TabsTrigger value="practice" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                🎯 Practice
              </TabsTrigger>
              <TabsTrigger value="journal" className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all">
                📝 Journal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="devotion" className="space-y-4 mt-4">
              {/* Visual Imagery */}
              {currentDay.visual_imagery && (
                <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Sparkles className="h-5 w-5 text-amber-500" />
                      {t('public.mentalPicture')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-900 dark:text-purple-100 leading-relaxed">{currentDay.visual_imagery}</p>
                  </CardContent>
                </Card>
              )}

              {/* Memory Hook */}
              {currentDay.memory_hook && (
                <Card className="border-0 bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white shadow-lg">
                  <CardContent className="py-4">
                    <p className="font-bold text-lg">
                      🔗 {currentDay.memory_hook}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Application */}
              {currentDay.application && (
                <Card className="border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-emerald-700 dark:text-emerald-300">📌 {t('public.todaysApplication')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-900 dark:text-emerald-100">{currentDay.application}</p>
                  </CardContent>
                </Card>
              )}

              {/* Christ Connection */}
              <Card className="border-0 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 text-white shadow-2xl overflow-hidden">
                <CardHeader className="pb-2 relative">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-6 w-6 fill-white" />
                    {t('public.christConnection')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-lg leading-relaxed font-medium">{currentDay.christ_connection}</p>
                </CardContent>
              </Card>

              {/* Cross References */}
              {currentDay.cross_references && currentDay.cross_references.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2 text-muted-foreground">📖 {t('public.crossReferences')}</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentDay.cross_references.map((ref, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCrossReferenceClick(ref)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-700 dark:text-blue-300 hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-800 dark:hover:to-cyan-800 transition-all cursor-pointer active:scale-95"
                      >
                        {ref}
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="practice" className="space-y-4 mt-4">
              {/* Prayer */}
              {currentDay.prayer && (
                <Card className="border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-indigo-700 dark:text-indigo-300">🙏 {t('public.prayer')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="italic text-indigo-900 dark:text-indigo-100">{currentDay.prayer}</p>
                  </CardContent>
                </Card>
              )}

              {/* Challenge */}
              {currentDay.challenge && (
                <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">🎯 {t('public.todaysChallenge')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{currentDay.challenge}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="journal" className="space-y-4 mt-4">
              {/* Journal Prompt */}
              {currentDay.journal_prompt && (
                <Card className="border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-amber-700 dark:text-amber-300">💭 {t('public.reflectionPrompt')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-amber-900 dark:text-amber-100">{currentDay.journal_prompt}</p>
                  </CardContent>
                </Card>
              )}

              {/* Journal Entry */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    📝 {t('public.myReflection')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={t('public.reflectionPlaceholder')}
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                    className="min-h-[150px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {user ? t('public.journalSavedAuto') : t('public.signUpToSave')}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Share & Get Free Access CTA */}
          <Card className="border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-950/30 dark:via-pink-950/30 dark:to-rose-950/30">
            <CardContent className="py-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                  <Gift className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                {t('public.enjoyingDevotional')}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {t('public.getFreeAccessDescription')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!user && (
                  <Link to="/auth?plan=devotionals">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Gift className="h-4 w-4 mr-2" />
                      {t('public.getStartedFree')}
                    </Button>
                  </Link>
                )}
                {plan && currentDay && (
                  <ShareDevotionalDialog 
                    plan={plan} 
                    day={currentDay}
                    isPublicView={true}
                    trigger={
                      <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('public.shareThisDevotional')}
                      </Button>
                    }
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
