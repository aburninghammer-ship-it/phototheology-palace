import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, FileText, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SeriesWizard } from "@/components/series-builder/SeriesWizard";
import { SeriesTemplateList } from "@/components/series-builder/SeriesTemplateList";
import { SeriesList } from "@/components/series-builder/SeriesList";

const BibleStudySeriesBuilder = () => {
  const { user } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [userSeries, setUserSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserSeries();
    } else {
      setLoading(false);
    }
  }, [user]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Bible Study Series Builder</h1>
            <p className="text-muted-foreground">Please sign in to create and manage Bible study series.</p>
          </div>
        </main>
      </div>
    );
  }

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
        onSelect={async (template) => {
          // Template selected - create series from template logic will go here
          setShowTemplates(false);
          toast.success('Template selected! Customize it to make it yours.');
        }}
        onBack={() => setShowTemplates(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Build a Bible Study Series with the Palace
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create ready-to-teach studies that walk people through Scripture visually—floor by floor, room by room.
            </p>
          </div>

          {/* Intro Text */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                Whether you're leading a church, small group, class, or online study, the Series Builder helps you design a complete Bible study track:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Every lesson tied to Palace floors and rooms</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Clear Christ-centered objectives</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Built-in discussion questions and activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span>Ready for print, slides, or digital delivery</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => setShowWizard(true)}
              className="gap-2"
            >
              <Plus className="h-5 w-5" />
              Create New Series
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowTemplates(true)}
              className="gap-2"
            >
              <FileText className="h-5 w-5" />
              Start from a Template
            </Button>
          </div>

          {/* User's Series List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userSeries.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Your Series</h2>
              <SeriesList series={userSeries} onUpdate={loadUserSeries} />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Series Yet</CardTitle>
                <CardDescription>
                  You don't have any series yet. Start from scratch or grab a template to see how a Palace-based series is structured.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default BibleStudySeriesBuilder;
