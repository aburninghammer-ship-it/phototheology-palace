import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Sparkles, CheckCircle2, Calendar, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
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
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const queryClient = useQueryClient();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    summary: string;
    imageBase64: string;
    appUrl: string;
  } | null>(null);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  
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
      toast.success("Marked as read! Keep up the daily practice.");
    },
  });

  const handleShare = async () => {
    if (!todayVerse) return;
    
    setIsGeneratingShare(true);
    setShareDialogOpen(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-daily-verse-share', {
        body: {
          verseReference: todayVerse.verse_reference,
          verseText: todayVerse.verse_text,
          breakdown: todayVerse.breakdown.breakdown,
        },
      });

      if (error) throw error;
      setShareData(data);
    } catch (error) {
      console.error('Error generating share content:', error);
      toast.error("Share generation failed. Please try again later.");
      setShareDialogOpen(false);
    } finally {
      setIsGeneratingShare(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const shareToFacebook = () => {
    if (!shareData) return;
    const url = encodeURIComponent(shareData.appUrl);
    const quote = encodeURIComponent(shareData.summary);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${quote}`, '_blank');
  };

  const shareToTwitter = () => {
    if (!shareData) return;
    const text = encodeURIComponent(`${shareData.summary}\n\n${shareData.appUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToWhatsApp = () => {
    if (!shareData) return;
    const text = encodeURIComponent(`${shareData.summary}\n\n${shareData.appUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">Loading today's verse...</div>
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
              <p className="text-lg mb-4">No verse available for today yet.</p>
              <p className="text-sm text-muted-foreground">Check back later!</p>
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
              Verse of the Day
            </h1>
            <p className="text-foreground/80 font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(todayVerse.date).toLocaleDateString('en-US', { 
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
                Mark as Read
              </Button>
            )}
            {user && hasRead && (
              <Badge variant="secondary" className="text-sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completed Today
              </Badge>
            )}
            <Button
              onClick={async () => {
                try {
                  toast.info("Refreshing principles for today's verse...");
                  const { error } = await supabase.functions.invoke('generate-daily-verse', {
                    body: {
                      force: true,
                      verse_reference: todayVerse.verse_reference,
                    },
                  });
                  if (error) throw error;
                  await refetch();
                  toast.success("Updated principles for today's verse.");
                } catch (err) {
                  console.error('Error refreshing daily verse principles:', err);
                  toast.error("Could not refresh principles. Please try again.");
                }
              }}
              variant="outline"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Refresh Principles
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Sign Up Prompt for Non-Authenticated Users */}
        {!user && (
          <Card className="border-primary bg-gradient-to-r from-primary/10 to-accent/10">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Get Your Daily Verse Every Day</h3>
                <p className="text-muted-foreground">
                  Sign up to track your progress, mark verses as read, and unlock the full Phototheology experience with 7 unique perspectives on every verse.
                </p>
                <Button asChild size="lg" className="mt-2">
                  <a href="/auth">Sign Up Free</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verse Display */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-center flex-1">{todayVerse.verse_reference}</CardTitle>
              <QuickAudioButton 
                text={`${todayVerse.verse_reference}. ${todayVerse.verse_text}`} 
                variant="outline"
                size="sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <blockquote className="text-xl text-center italic leading-relaxed px-6">
              "{todayVerse.verse_text}"
            </blockquote>
          </CardContent>
        </Card>

        {/* Principles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Palace Principles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">Principle Revealed (Verse Category)</h4>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {todayVerse.breakdown?.verse_genre || 'Loading...'}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">7 Principles Applied</h4>
              <div className="flex flex-wrap gap-2">
                {todayVerse.breakdown?.breakdown?.map((item, idx) => (
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
          {todayVerse.breakdown?.breakdown
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
                  <h4 className="font-semibold mb-2 text-sm text-primary">Application</h4>
                  <p className="text-sm leading-relaxed">{item.application}</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm text-primary">💎 Key Insight</h4>
                  <p className="text-sm">{item.key_insight}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-sm text-primary">✨ Practical Takeaway</h4>
                  <p className="text-sm">{item.practical_takeaway}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Share Daily Verse</DialogTitle>
          </DialogHeader>
          
          {isGeneratingShare ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Generating shareable content...</p>
              </div>
            </div>
          ) : shareData ? (
            <div className="space-y-6">
              {/* Generated Image */}
              <div className="rounded-lg overflow-hidden border">
                <img 
                  src={shareData.imageBase64} 
                  alt="Daily Verse" 
                  className="w-full h-auto"
                />
              </div>

              {/* Share Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Share Text</label>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm">{shareData.summary}</p>
                  <p className="text-sm text-primary mt-2">{shareData.appUrl}</p>
                </div>
                <Button 
                  onClick={() => copyToClipboard(`${shareData.summary}\n\n${shareData.appUrl}`)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Copy Text
                </Button>
              </div>

              {/* Social Media Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button onClick={shareToFacebook} className="w-full">
                  Facebook
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
