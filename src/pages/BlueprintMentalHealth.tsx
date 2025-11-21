import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { MENTAL_HEALTH_ARTICLES, MENTAL_HEALTH_INTRO, MentalHealthArticle } from "@/data/blueprintMentalHealthData";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function BlueprintMentalHealth() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("mental_health_blueprint_progress")
      .select("article_id, notes")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error loading progress:", error);
      return;
    }

    if (data) {
      setCompletedArticles(data.map((item) => item.article_id));
    }
  };

  const handleComplete = async (articleId: number) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your progress.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("mental_health_blueprint_progress")
      .upsert({
        user_id: user.id,
        article_id: articleId,
        notes: notes,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save progress. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Progress Saved",
      description: "Your progress has been saved successfully.",
    });

    loadProgress();
    setNotes("");
    setSelectedArticle(null);
  };

  const currentArticle = selectedArticle
    ? MENTAL_HEALTH_ARTICLES.find((a) => a.id === selectedArticle)
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {!currentArticle ? (
          <>
            <div className="text-center mb-12 space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {MENTAL_HEALTH_INTRO.title}
              </h1>
              <p className="text-xl text-muted-foreground">
                {MENTAL_HEALTH_INTRO.subtitle}
              </p>
              <p className="text-base text-foreground/80 max-w-3xl mx-auto">
                {MENTAL_HEALTH_INTRO.description}
              </p>
              <blockquote className="text-lg italic text-primary border-l-4 border-primary pl-4 py-2 my-6 max-w-2xl mx-auto">
                {MENTAL_HEALTH_INTRO.quote}
              </blockquote>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENTAL_HEALTH_ARTICLES.map((article) => (
                <Card
                  key={article.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all hover:border-primary relative"
                  onClick={() => setSelectedArticle(article.id)}
                >
                  {completedArticles.includes(article.id) && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="text-sm font-semibold text-primary">
                      Article {article.id}
                    </div>
                    <h3 className="text-xl font-bold">{article.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold text-primary">Sanctuary Meaning:</span>
                        <p className="text-muted-foreground">{article.sanctuaryMeaning}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-primary">Mental Health Principle:</span>
                        <p className="text-muted-foreground">{article.mentalHealthPrinciple}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedArticle(null)}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Overview
            </Button>

            <Card className="p-8">
              <ScrollArea className="h-[70vh]">
                <div className="space-y-6 pr-4">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-2">
                      Article {currentArticle.id} of 6
                    </div>
                    <h1 className="text-3xl font-bold mb-4">{currentArticle.name}</h1>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-primary mb-2">Sanctuary Meaning</h3>
                      <p className="text-muted-foreground">{currentArticle.sanctuaryMeaning}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Mental Health Principle</h3>
                      <p className="text-muted-foreground">{currentArticle.mentalHealthPrinciple}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Teaching</h3>
                      <p className="whitespace-pre-line text-foreground">{currentArticle.teaching}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Biblical Foundation</h3>
                      <p className="text-foreground">{currentArticle.biblicalFoundation}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Practical Steps</h3>
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {currentArticle.practicalSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Reflection Questions</h3>
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {currentArticle.reflectionQuestions.map((question, idx) => (
                          <li key={idx}>{question}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Weekly Challenge</h3>
                      <p className="text-foreground">{currentArticle.weeklyChallenge}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Scripture References</h3>
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {currentArticle.scriptureReferences.map((ref, idx) => (
                          <li key={idx}>{ref}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary mb-2">Prayer Prompt</h3>
                      <p className="italic text-foreground">{currentArticle.prayerPrompt}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <h3 className="font-semibold text-primary mb-2">Your Notes</h3>
                    <Textarea
                      placeholder="Write your personal reflections, insights, or commitments here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[150px]"
                    />
                  </div>

                  {!completedArticles.includes(currentArticle.id) && (
                    <Button
                      onClick={() => handleComplete(currentArticle.id)}
                      className="w-full"
                      size="lg"
                    >
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
