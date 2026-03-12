import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Sparkles, CheckCircle2, Calendar, Share2, Archive, ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { Navigation } from "@/components/Navigation";
import { QuickAudioButton } from "@/components/audio";

interface PrincipleBreakdown {
  principle_applied: string;
  principle_code: string;
  principle_name: string;
  floor?: string;
  application: string;
  key_insight: string;
  practical_takeaway: string;
}

interface DailyVerse {
  id: string;
  verse_reference: string;
  verse_text: string;
  principles_used: string[];
  breakdown: {
    verse_genre: string;
    breakdown: PrincipleBreakdown[];
  };
  date: string;
}

export default function DailyVerse() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const queryClient = useQueryClient();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    summary: string;
    imageBase64: string;
    appUrl: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"today" | "archive">("today");
  const [selectedArchiveVerse, setSelectedArchiveVerse] = useState<DailyVerse | null>(null);
  const [archiveMonth, setArchiveMonth] = useState(new Date());
  
  const { data: todayVerse, isLoading, refetch } = useQuery({
    queryKey: ['daily-verse', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_verses')
        .select('*')
        .eq('date', today)
        .single();
      
      if (error) throw error;
      
      return data as unknown as DailyVerse;
    },
  });

  const { data: hasRead } = useQuery({
    queryKey: ['verse-reading', todayVerse?.id, user?.id],
    queryFn: async () => {
      if (!todayVerse || !user) return false;
      const { data } = await supabase
        .from('user_verse_readings')
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_id', todayVerse.id)
        .single();
      return !!data;
    },
    enabled: !!todayVerse && !!user,
  });

  const { data: isSaved, refetch: refetchSaved } = useQuery({
    queryKey: ['verse-saved', todayVerse?.id, user?.id],
    queryFn: async () => {
      if (!todayVerse || !user) return false;
      const { data } = await supabase
        .from('saved_daily_verses' as any)
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_id', todayVerse.id)
        .single();
      return !!data;
    },
    enabled: !!todayVerse && !!user,
  });

  const saveVerseMutation = useMutation({
    mutationFn: async () => {
      if (!todayVerse || !user) return;
      if (isSaved) {
        const { error } = await supabase
          .from('saved_daily_verses' as any)
          .delete()
          .eq('user_id', user.id)
          .eq('verse_id', todayVerse.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('saved_daily_verses' as any)
          .insert({ user_id: user.id, verse_id: todayVerse.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      refetchSaved();
      queryClient.invalidateQueries({ queryKey: ['saved-daily-verses'] });
      toast.success(isSaved ? 'Verse removed from saved' : 'Verse saved to your Library!');
    },
  });

  // Archive queries
  const { data: archiveVerses, isLoading: archiveLoading } = useQuery({
    queryKey: ['archive-verses', archiveMonth.getFullYear(), archiveMonth.getMonth()],
    queryFn: async () => {
      const startOfMonth = new Date(archiveMonth.getFullYear(), archiveMonth.getMonth(), 1);
      const endOfMonth = new Date(archiveMonth.getFullYear(), archiveMonth.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from('daily_verses')
        .select('*')
        .gte('date', startOfMonth.toISOString().split('T')[0])
        .lte('date', endOfMonth.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      return data as unknown as DailyVerse[];
    },
    enabled: activeTab === "archive",
  });

  const { data: userReadVerses } = useQuery({
    queryKey: ['user-read-verses', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_verse_readings')
        .select('verse_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(r => r.verse_id);
    },
    enabled: !!user && activeTab === "archive",
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!todayVerse || !user) return;
      const { error } = await supabase
        .from('user_verse_readings')
        .insert({
          user_id: user.id,
          verse_id: todayVerse.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verse-reading'] });
      toast.success(t('dailyVerse.markedAsRead'));
    },
  });

  const handleShare = async () => {
    if (!todayVerse) return;

    // Build share text directly from the actual verse and principles — no AI rewriting
    const verse = todayVerse.verse_text;
    const ref = todayVerse.verse_reference;
    const breakdown = todayVerse.breakdown?.breakdown;

    let principlesText = "";
    if (breakdown && Array.isArray(breakdown)) {
      principlesText = breakdown
        .map((item: any, idx: number) => `Floor ${idx + 1} — ${item.principle_name || item.principle_applied}: ${item.key_insight}`)
        .join("\n");
    }

    const appUrl = "https://phototheologybible.com/daily-verse";
    const summary = `"${verse}"\n— ${ref}\n\n7-Floor Phototheology Analysis:\n${principlesText}\n\nExplore the full analysis:`;

    setShareData({ summary, imageBase64: "", appUrl });
    setShareDialogOpen(true);
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(t('common.copiedToClipboard'));
  };

  const shareToFacebook = () => {
    if (!shareData) return;
    const url = encodeURIComponent(shareData.appUrl);
    const quote = encodeURIComponent(shareData.summary);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  const shareToTwitter = () => {
    if (!shareData) return;
    // Twitter has a 280 char limit — share a shorter version
    const shortText = todayVerse
      ? `"${todayVerse.verse_text}"\n— ${todayVerse.verse_reference}\n\n7-Floor Phototheology Analysis\n${shareData.appUrl}`
      : `${shareData.summary}\n\n${shareData.appUrl}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shortText)}`, '_blank');
  };

  const shareToWhatsApp = () => {
    if (!shareData) return;
    const text = encodeURIComponent(`${shareData.summary}\n\n${shareData.appUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareToInstagram = () => {
    if (!shareData) return;
    // Instagram doesn't support direct link sharing — copy to clipboard for pasting
    const text = `${shareData.summary}\n\n${shareData.appUrl}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard! Paste into your Instagram caption.");
    });
  };

  const goToPreviousMonth = () => {
    setArchiveMonth(new Date(archiveMonth.getFullYear(), archiveMonth.getMonth() - 1, 1));
    setSelectedArchiveVerse(null);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(archiveMonth.getFullYear(), archiveMonth.getMonth() + 1, 1);
    if (nextMonth <= new Date()) {
      setArchiveMonth(nextMonth);
      setSelectedArchiveVerse(null);
    }
  };

  const isVerseRead = (verseId: string) => {
    return userReadVerses?.includes(verseId) || false;
  };

  // Component to render verse details (reused for both today and archive)
  const VerseDetails = ({ verse, showMarkAsRead = false }: { verse: DailyVerse; showMarkAsRead?: boolean }) => (
    <div className="space-y-4">
      {/* Verse Display */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-center flex-1">{verse.verse_reference}</CardTitle>
            <QuickAudioButton
              text={`${verse.verse_reference}. ${verse.verse_text}`}
              variant="outline"
              size="sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <blockquote className="text-xl text-center italic leading-relaxed px-6">
            "{verse.verse_text}"
          </blockquote>
        </CardContent>
      </Card>

      {/* Principles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            {t('dailyVerse.palacePrinciples')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">{t('dailyVerse.principleRevealed')}</h4>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {verse.breakdown?.verse_genre || t('common.loading')}
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold mb-2 text-sm">{t('dailyVerse.principlesApplied')}</h4>
            <div className="flex flex-wrap gap-2">
              {verse.breakdown?.breakdown?.map((item, idx) => (
                <Badge key={`applied-${idx}`} variant="outline">
                  {item.principle_applied}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breakdown */}
      <div className="space-y-4">
        {verse.breakdown?.breakdown
          ?.sort((a, b) => {
            const floorA = parseInt(a.floor?.match(/\d+/)?.[0] || '0');
            const floorB = parseInt(b.floor?.match(/\d+/)?.[0] || '0');
            return floorA - floorB;
          })
          .map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {item.floor && (
                      <Badge variant="secondary" className="text-xs">
                        {item.floor}
                      </Badge>
                    )}
                    <Badge className="w-fit">{item.principle_applied}</Badge>
                  </div>
                  <CardTitle className="text-lg">
                    {item.principle_name}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-primary">{t('dailyVerse.application')}</h4>
                  <p className="text-sm leading-relaxed">{item.application}</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm text-primary">{t('dailyVerse.keyInsight')}</h4>
                  <p className="text-sm">{item.key_insight}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-sm text-primary">{t('dailyVerse.practicalTakeaway')}</h4>
                  <p className="text-sm">{item.practical_takeaway}</p>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">{t('dailyVerse.loadingTodaysVerse')}</div>
        </div>
      </div>
    );
  }

  if (!todayVerse) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-4">{t('dailyVerse.noVerseAvailable')}</p>
              <p className="text-sm text-muted-foreground">{t('dailyVerse.checkBackLater')}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/daily-verse`;
  const shareTitle = todayVerse ? `${todayVerse.verse_reference} - Daily Verse` : "Daily Verse - Phototheology";
  const shareDescription = todayVerse 
    ? `Phototheology's 7-floor analysis of ${todayVerse.verse_reference}: ${todayVerse.verse_text.slice(0, 100)}...`
    : "Explore today's Bible verse through Phototheology's unique 7-floor analysis";

  return (
    <div className="min-h-screen gradient-dreamy">
      <Helmet>
        <title>{shareTitle}</title>
        <meta name="description" content={shareDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={`${window.location.origin}/phototheology-hero.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={shareUrl} />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        <meta name="twitter:image" content={`${window.location.origin}/phototheology-hero.png`} />
      </Helmet>
      
      {preferences.navigation_style === "full" ? <Navigation /> : <SimplifiedNav />}
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              {t('dailyVerse.verseOfTheDay')}
            </h1>
            <p className="text-foreground/80 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(todayVerse.date + 'T12:00:00').toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex gap-2">
            {user && !hasRead && (
              <Button
                onClick={() => markAsReadMutation.mutate()}
                disabled={markAsReadMutation.isPending}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('dailyVerse.markAsRead')}
              </Button>
            )}
            {user && hasRead && (
              <Badge variant="secondary" className="text-sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t('dailyVerse.completedToday')}
              </Badge>
            )}
            <Button
              onClick={async () => {
                try {
                  toast.info(t('dailyVerse.refreshingPrinciples'));
                  const { error } = await supabase.functions.invoke('generate-daily-verse', {
                    body: {
                      force: true,
                      verse_reference: todayVerse.verse_reference,
                    },
                  });
                  if (error) throw error;
                  await refetch();
                  toast.success(t('dailyVerse.updatedPrinciples'));
                } catch (err) {
                  console.error('Error refreshing daily verse principles:', err);
                  toast.error(t('dailyVerse.refreshFailed'));
                }
              }}
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {t('dailyVerse.refreshPrinciples')}
            </Button>
            {user && (
              <Button
                onClick={() => saveVerseMutation.mutate()}
                disabled={saveVerseMutation.isPending}
                variant={isSaved ? "secondary" : "outline"}
              >
                {isSaved ? (
                  <BookmarkCheck className="mr-2 h-4 w-4 text-primary" />
                ) : (
                  <Bookmark className="mr-2 h-4 w-4" />
                )}
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            )}
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              {t('common.share')}
            </Button>
          </div>
        </div>

        {/* Sign Up Prompt for Non-Authenticated Users */}
        {!user && (
          <Card className="border-primary bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">{t('dailyVerse.signUpTitle')}</h3>
                <p className="text-muted-foreground">
                  {t('dailyVerse.signUpDescription')}
                </p>
                <Button asChild size="lg" className="mt-2">
                  <a href="/auth">{t('dailyVerse.signUpFree')}</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Today / Archive */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "today" | "archive")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              {t('dailyVerse.todaysVerse')}
            </TabsTrigger>
            <TabsTrigger value="archive" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              {t('dailyVerse.archive')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <VerseDetails verse={todayVerse} showMarkAsRead={true} />
          </TabsContent>

          <TabsContent value="archive" className="space-y-4">
            {selectedArchiveVerse ? (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedArchiveVerse(null)}
                  className="mb-4"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t('dailyVerse.backToArchive')}
                </Button>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date(selectedArchiveVerse.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {isVerseRead(selectedArchiveVerse.id) && (
                    <Badge variant="secondary" className="ml-2">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      {t('dailyVerse.read')}
                    </Badge>
                  )}
                </p>
                <VerseDetails verse={selectedArchiveVerse} />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={goToPreviousMonth}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t('common.previous')}
                  </Button>
                  <h3 className="text-lg font-semibold">
                    {archiveMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <Button
                    variant="outline"
                    onClick={goToNextMonth}
                    disabled={archiveMonth.getFullYear() === new Date().getFullYear() && archiveMonth.getMonth() === new Date().getMonth()}
                  >
                    {t('common.next')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {archiveLoading ? (
                  <div className="text-center py-12">{t('dailyVerse.loadingArchive')}</div>
                ) : archiveVerses && archiveVerses.length > 0 ? (
                  <div className="grid gap-3">
                    {archiveVerses.map((verse) => (
                      <Card
                        key={verse.id}
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => setSelectedArchiveVerse(verse)}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">
                                  {new Date(verse.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </Badge>
                                {isVerseRead(verse.id) && (
                                  <Badge variant="secondary" className="text-xs">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    {t('dailyVerse.read')}
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-lg">{verse.verse_reference}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {verse.verse_text}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Archive className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">{t('dailyVerse.noVersesForMonth')}</p>
                      <p className="text-sm text-muted-foreground mt-2">{t('dailyVerse.tryDifferentMonth')}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('dailyVerse.shareDailyVerse')}</DialogTitle>
          </DialogHeader>
          
          {shareData ? (
            <div className="space-y-6">
              {/* Share Text Preview */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('dailyVerse.shareText')}</label>
                <div className="p-4 bg-muted rounded-lg whitespace-pre-line">
                  <p className="text-sm">{shareData.summary}</p>
                  <p className="text-sm text-primary mt-2">{shareData.appUrl}</p>
                </div>
                <Button
                  onClick={() => copyToClipboard(`${shareData.summary}\n\n${shareData.appUrl}`)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {t('dailyVerse.copyText')}
                </Button>
              </div>

              {/* Social Media Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={shareToFacebook} className="w-full">
                  Facebook
                </Button>
                <Button onClick={shareToInstagram} variant="outline" className="w-full">
                  Instagram
                </Button>
                <Button onClick={shareToTwitter} className="w-full">
                  Twitter
                </Button>
                <Button onClick={shareToWhatsApp} className="w-full">
                  WhatsApp
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
