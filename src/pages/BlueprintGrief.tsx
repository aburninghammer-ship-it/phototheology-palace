import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Flame, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";
import { SANCTUARY_GRIEF_ARTICLES, GRIEF_BLUEPRINT_INTRO } from "@/data/blueprintGriefData";
import { useToast } from "@/hooks/use-toast";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";

const STORAGE_KEY = "grief_blueprint_progress";

export default function BlueprintGrief() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setNotes(data.notes || {});
      setCompletedArticles(data.completed || []);
    }
  }, []);

  const currentArticle = selectedArticle 
    ? SANCTUARY_GRIEF_ARTICLES.find(a => a.id === selectedArticle) 
    : null;

  const handleComplete = (articleId: number) => {
    const newCompleted = [...completedArticles, articleId];
    setCompletedArticles(newCompleted);
    
    const progressData = {
      notes,
      completed: newCompleted
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));

    toast({
      title: "Progress saved!",
      description: `${SANCTUARY_GRIEF_ARTICLES.find(a => a.id === articleId)?.name} completed`,
    });
  };

  const handleNotesChange = (articleId: number, value: string) => {
    const newNotes = { ...notes, [articleId]: value };
    setNotes(newNotes);
    
    const progressData = {
      notes: newNotes,
      completed: completedArticles
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
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
                <h1 className="text-4xl font-bold">{GRIEF_BLUEPRINT_INTRO.title}</h1>
              </div>
              <p className="text-xl text-muted-foreground">
                {GRIEF_BLUEPRINT_INTRO.subtitle}
              </p>
              <div className="flex justify-center">
                <EnhancedSocialShare
                  title="The Sanctuary Blueprint for Grieving"
                  content="God's 6-step pattern to navigate grief—from shock to restoration. A sacred map through loss and pain."
                  url={window.location.href}
                  defaultMessage="💙 Found this powerful resource for anyone walking through grief:\n\nThe Sanctuary Blueprint for Grieving maps God's healing process through 6 sanctuary steps—from surrender and tears to hope and restoration.\n\nGrief is sacred terrain, and this is the map. 🕊️"
                  buttonText="Share This Resource"
                />
              </div>
              <div className="max-w-3xl mx-auto bg-primary/5 p-6 rounded-lg border border-primary/20">
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {GRIEF_BLUEPRINT_INTRO.description}
                </p>
                <p className="mt-4 text-lg font-semibold italic text-primary">
                  "{GRIEF_BLUEPRINT_INTRO.quote}"
                </p>
              </div>
            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {SANCTUARY_GRIEF_ARTICLES.map((article) => {
                const isCompleted = completedArticles.includes(article.id);
                
                return (
                  <Card 
                    key={article.id}
                    className="cursor-pointer hover:border-primary transition-all hover:shadow-lg relative"
                    onClick={() => setSelectedArticle(article.id)}
                  >
                    {isCompleted && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <Flame className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <Badge variant="outline" className="mb-2">
                            Step {article.id} of 6
                          </Badge>
                          <CardTitle className="text-xl mb-2">{article.name}</CardTitle>
                          <CardDescription className="text-base font-semibold">
                            {article.principle}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="font-semibold">Sanctuary:</span> {article.sanctuaryMeaning}
                      </p>
                      <p className="text-sm text-primary font-semibold">
                        Grief: "{article.griefPrinciple}"
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
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
                <Badge variant="secondary">Step {currentArticle?.id} of 6</Badge>
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
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      Sanctuary Meaning
                    </h3>
                    <p className="text-base">{currentArticle?.sanctuaryMeaning}</p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      Grief Principle
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      "{currentArticle?.griefPrinciple}"
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">Teaching</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line leading-relaxed">
                        {currentArticle?.detailedTeaching}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">💭 Reflection Questions</h3>
                    <ul className="space-y-2">
                      {currentArticle?.reflectionQuestions.map((question, i) => (
                        <li key={i} className="text-sm">• {question}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">🌱 Healing Exercises</h3>
                    <ol className="space-y-3">
                      {currentArticle?.healingExercises.map((exercise, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-semibold">{i + 1}.</span> {exercise}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">📖 Scripture References</h3>
                    <ul className="space-y-1">
                      {currentArticle?.scriptureReferences.map((ref, i) => (
                        <li key={i} className="text-sm">• {ref}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-lg mb-2 text-primary">🙏 Prayer</h3>
                    <p className="italic text-base">{currentArticle?.prayerPrompt}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">📝 Your Notes & Reflections</h3>
                    <Textarea
                      placeholder="Write your thoughts, feelings, and insights here..."
                      className="min-h-[150px]"
                      value={notes[currentArticle?.id || 0] || ""}
                      onChange={(e) => handleNotesChange(currentArticle?.id || 0, e.target.value)}
                    />
                  </div>

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
