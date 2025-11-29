import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Flame, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import { SANCTUARY_MARRIAGE_ARTICLES, MARRIAGE_BLUEPRINT_INTRO } from "@/data/blueprintMarriageData";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";
import { BlueprintMap } from "@/components/blueprint/BlueprintMap";

export default function BlueprintMarriage() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const currentArticle = selectedArticle 
    ? SANCTUARY_MARRIAGE_ARTICLES.find(a => a.id === selectedArticle) 
    : null;

  const handleComplete = async (articleId: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track your progress",
        variant: "destructive"
      });
      return;
    }

    try {
      // Save to database
      const { error } = await supabase
        .from('marriage_blueprint_progress')
        .upsert({
          user_id: user.id,
          article_id: articleId,
          completed_at: new Date().toISOString(),
          notes: notes[articleId] || null
        });

      if (error) throw error;

      setCompletedArticles(prev => [...prev, articleId]);
      toast({
        title: "Progress saved!",
        description: `${SANCTUARY_MARRIAGE_ARTICLES.find(a => a.id === articleId)?.name} completed`,
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!selectedArticle ? (
          <>
            <section className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Heart className="w-12 h-12 text-primary" />
                <h1 className="text-4xl font-bold">{MARRIAGE_BLUEPRINT_INTRO.title}</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                {MARRIAGE_BLUEPRINT_INTRO.subtitle}
              </p>
              <div className="flex justify-center">
                <EnhancedSocialShare
                  title="The Sanctuary Blueprint for Dating, Courtship & Marriage"
                  content="Discover God's 6-step blueprint for relationships—from dating to covenant marriage. A powerful sanctuary-based guide!"
                  url={window.location.href}
                  defaultMessage="🏛️ Just discovered this amazing resource: The Sanctuary Blueprint for Dating, Courtship & Marriage!\n\nIt maps God's 6-step sanctuary pattern to relationships—from surrender & self-reflection to covenant marriage.\n\nThis has completely changed how I view relationships! 💍✨"
                  buttonText="Share This Resource"
                />
              </div>
              
              {/* Sanctuary Explanation */}
              <Card variant="glass" className="max-w-4xl mx-auto">
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-line text-base leading-relaxed">
                      {MARRIAGE_BLUEPRINT_INTRO.sanctuaryExplanation}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass" className="max-w-3xl mx-auto border-primary/30">
                <CardContent className="pt-6">
                  <p className="text-base leading-relaxed whitespace-pre-line">
                    {MARRIAGE_BLUEPRINT_INTRO.description}
                  </p>
                  <p className="mt-4 text-lg font-semibold italic text-primary">
                    "{MARRIAGE_BLUEPRINT_INTRO.quote}"
                  </p>
                </CardContent>
              </Card>
            </section>

            <BlueprintMap
              items={SANCTUARY_MARRIAGE_ARTICLES.map(article => ({
                id: article.id,
                name: article.name,
                step: `Step ${article.id}`
              }))}
              completedItems={completedArticles}
              onItemClick={setSelectedArticle}
            />
          </>
        ) : (
          <Card variant="glass">
            <CardHeader>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedArticle(null)} 
                className="w-fit mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Overview
              </Button>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">Article {currentArticle?.id} of 6</Badge>
                {completedArticles.includes(currentArticle?.id || 0) && (
                  <Badge className="bg-green-500">Completed</Badge>
                )}
              </div>
              <div className="flex items-start gap-3">
                <Flame className="w-10 h-10 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="text-3xl mb-2">{currentArticle?.name}</CardTitle>
                  <CardDescription className="text-xl font-semibold">
                    {currentArticle?.principle}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {/* Sanctuary Meaning */}
                  <div className="bg-background/60 backdrop-blur-sm p-4 rounded-xl border border-primary/20 shadow-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Sanctuary Meaning
                    </h3>
                    <p className="text-base">{currentArticle?.sanctuaryMeaning}</p>
                  </div>

                  {/* Marriage Principle */}
                  <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Marriage Principle
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      "{currentArticle?.marriagePrinciple}"
                    </p>
                  </div>

                  {/* Detailed Teaching */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">Teaching</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line leading-relaxed">
                        {currentArticle?.detailedTeaching}
                      </p>
                    </div>
                  </div>

                  {/* Reflection Questions */}
                  <div className="bg-yellow-500/10 backdrop-blur-sm p-4 rounded-xl border border-yellow-500/20 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">💭 Reflection Questions</h3>
                    <ul className="space-y-2">
                      {currentArticle?.reflectionQuestions.map((question, i) => (
                        <li key={i} className="text-sm">• {question}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Couple Exercises */}
                  <div className="bg-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">👫 Exercises for Couples</h3>
                    <ol className="space-y-3">
                      {currentArticle?.coupleExercises.map((exercise, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-semibold">{i + 1}.</span> {exercise}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Scripture References */}
                  <div className="bg-purple-500/10 backdrop-blur-sm p-4 rounded-xl border border-purple-500/20 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">📖 Scripture References</h3>
                    <ul className="space-y-1">
                      {currentArticle?.scriptureReferences.map((ref, i) => (
                        <li key={i} className="text-sm">• {ref}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prayer Prompt */}
                  <div className="bg-primary/15 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary">🙏 Prayer Together</h3>
                    <p className="italic text-base">{currentArticle?.prayerPrompt}</p>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">📝 Your Notes & Reflections</h3>
                    <Textarea
                      placeholder="Write your thoughts, commitments, and insights here..."
                      className="min-h-[150px]"
                      value={notes[currentArticle?.id || 0] || ""}
                      onChange={(e) => setNotes(prev => ({
                        ...prev,
                        [currentArticle?.id || 0]: e.target.value
                      }))}
                    />
                  </div>

                  {/* Complete Button */}
                  {!completedArticles.includes(currentArticle?.id || 0) && (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() => handleComplete(currentArticle?.id || 0)}
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
