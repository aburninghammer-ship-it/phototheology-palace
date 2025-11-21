import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Flame, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import { WEIGHT_LOSS_ARTICLES, WEIGHT_LOSS_INTRO } from "@/data/blueprintWeightLossData";
import { useToast } from "@/hooks/use-toast";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";
import { BlueprintMap } from "@/components/blueprint/BlueprintMap";

const STORAGE_KEY = "weightloss_blueprint_progress";

export default function BlueprintWeightLoss() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);
  const { toast } = useToast();

  const currentArticle = selectedArticle 
    ? WEIGHT_LOSS_ARTICLES.find(a => a.id === selectedArticle) 
    : null;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setCompletedArticles(parsed.completed || []);
      setNotes(parsed.notes || {});
    }
  }, []);

  const handleComplete = (articleId: number) => {
    const updated = [...completedArticles, articleId];
    setCompletedArticles(updated);
    
    const data = {
      completed: updated,
      notes: notes
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    toast({
      title: "Progress saved!",
      description: `${WEIGHT_LOSS_ARTICLES.find(a => a.id === articleId)?.name} completed`,
    });
  };

  const handleNotesChange = (articleId: number, value: string) => {
    const updated = { ...notes, [articleId]: value };
    setNotes(updated);
    
    const data = {
      completed: completedArticles,
      notes: updated
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {!selectedArticle ? (
          <>
            <section className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Scale className="w-12 h-12 text-primary" />
                <h1 className="text-4xl font-bold">{WEIGHT_LOSS_INTRO.title}</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                {WEIGHT_LOSS_INTRO.subtitle}
              </p>
              <div className="flex justify-center">
                <EnhancedSocialShare
                  title="The Sanctuary Blueprint for Weight Loss"
                  content="God's 6-step pattern for healthy weight loss—combining sanctuary wisdom with biblical nutrition and fitness principles."
                  url={window.location.href}
                  defaultMessage="⚖️ Found this powerful approach to weight loss:\n\nThe Sanctuary Blueprint for Weight Loss maps God's 6-step sanctuary pattern to healthy living—from surrender and hydration to metabolism and lasting transformation.\n\nIt's not just another diet—it's God's design for the body! 💪✨"
                  buttonText="Share This Resource"
                />
              </div>
              
              {/* Sanctuary Explanation */}
              <div className="max-w-4xl mx-auto bg-muted/30 p-8 rounded-lg border-2 border-primary/30">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-line text-base leading-relaxed">
                    {WEIGHT_LOSS_INTRO.sanctuaryExplanation}
                  </div>
                </div>
              </div>

              <div className="max-w-3xl mx-auto bg-primary/5 p-6 rounded-lg border border-primary/20">
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {WEIGHT_LOSS_INTRO.description}
                </p>
                <p className="mt-4 text-lg font-semibold italic text-primary">
                  "{WEIGHT_LOSS_INTRO.quote}"
                </p>
              </div>
            </section>

            <BlueprintMap
              items={WEIGHT_LOSS_ARTICLES.map(article => ({
                id: article.id,
                name: article.name,
                step: `Step ${article.id}`
              }))}
              completedItems={completedArticles}
              onItemClick={setSelectedArticle}
            />
          </>
        ) : (
          <Card>
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
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Sanctuary Meaning
                    </h3>
                    <p className="text-base">{currentArticle?.sanctuaryMeaning}</p>
                  </div>

                  {/* Weight Loss Principle */}
                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      Weight Loss Principle
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      "{currentArticle?.weightLossPrinciple}"
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

                  {/* Biblical Foundation */}
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">📖 Biblical Foundation</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line leading-relaxed text-sm">
                        {currentArticle?.biblicalFoundation}
                      </p>
                    </div>
                  </div>

                  {/* Practical Steps */}
                  <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">✅ Practical Steps</h3>
                    <ol className="space-y-2">
                      {currentArticle?.practicalSteps.map((step, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-semibold">{i + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Reflection Questions */}
                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">💭 Reflection Questions</h3>
                    <ul className="space-y-2">
                      {currentArticle?.reflectionQuestions.map((question, i) => (
                        <li key={i} className="text-sm">• {question}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Weekly Challenge */}
                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">🎯 7-Day Challenge</h3>
                    <p className="text-sm leading-relaxed">{currentArticle?.weeklyChallenge}</p>
                  </div>

                  {/* Scripture References */}
                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">📖 Scripture References</h3>
                    <ul className="space-y-1">
                      {currentArticle?.scriptureReferences.map((ref, i) => (
                        <li key={i} className="text-sm">• {ref}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prayer Prompt */}
                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-lg mb-2 text-primary">🙏 Prayer</h3>
                    <p className="italic text-base">{currentArticle?.prayerPrompt}</p>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">📝 Your Notes & Progress</h3>
                    <Textarea
                      placeholder="Write your commitments, victories, struggles, and insights here..."
                      className="min-h-[150px]"
                      value={notes[currentArticle?.id || 0] || ""}
                      onChange={(e) => handleNotesChange(currentArticle?.id || 0, e.target.value)}
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
