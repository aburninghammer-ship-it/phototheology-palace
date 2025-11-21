import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";
import { blueprintFinancialData, sanctuaryExplanation } from "@/data/blueprintFinancialData";

const BlueprintFinancial = () => {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem("blueprintFinancialNotes");
    const savedCompleted = localStorage.getItem("blueprintFinancialCompleted");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedCompleted) setCompletedArticles(JSON.parse(savedCompleted));
  }, []);

  const handleComplete = (articleId: number) => {
    const newCompleted = [...completedArticles, articleId];
    setCompletedArticles(newCompleted);
    localStorage.setItem("blueprintFinancialCompleted", JSON.stringify(newCompleted));
    localStorage.setItem("blueprintFinancialNotes", JSON.stringify(notes));
  };

  const handleNotesChange = (articleId: number, value: string) => {
    const newNotes = { ...notes, [articleId]: value };
    setNotes(newNotes);
    localStorage.setItem("blueprintFinancialNotes", JSON.stringify(newNotes));
  };

  const currentArticle = blueprintFinancialData.find(a => a.id === selectedArticle);

  if (selectedArticle && currentArticle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => setSelectedArticle(null)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{currentArticle.name}</CardTitle>
              <CardDescription className="text-lg">
                {currentArticle.principle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Sanctuary Meaning</h3>
                <p className="text-muted-foreground">{currentArticle.sanctuaryMeaning}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Financial Principle</h3>
                <p className="text-muted-foreground">{currentArticle.financialPrinciple}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Teaching</h3>
                <div className="text-muted-foreground whitespace-pre-line">{currentArticle.teaching}</div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Reflection Questions</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {currentArticle.reflectionQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Action Steps</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {currentArticle.actionSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Scripture References</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {currentArticle.scriptureReferences.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Prayer Prompt</h3>
                <p className="text-muted-foreground italic">{currentArticle.prayerPrompt}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Your Notes</h3>
                <Textarea
                  value={notes[currentArticle.id] || ""}
                  onChange={(e) => handleNotesChange(currentArticle.id, e.target.value)}
                  placeholder="Write your personal notes, reflections, and commitments here..."
                  className="min-h-[200px]"
                />
              </div>

              {!completedArticles.includes(currentArticle.id) && (
                <Button
                  onClick={() => handleComplete(currentArticle.id)}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            The Sanctuary Blueprint for Financial Stability
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            How God's Six-Furniture Pattern Guides Money, Spending, Earning, Saving, and Generosity
          </p>
          <div className="prose prose-sm max-w-none mb-6 text-left">
            <div className="text-muted-foreground whitespace-pre-line">
              {sanctuaryExplanation}
            </div>
          </div>
          <EnhancedSocialShare
            title="The Sanctuary Blueprint for Financial Stability"
            content="Discover God's master plan for economic stewardship through the sanctuary pattern"
            url={window.location.href}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blueprintFinancialData.map((article) => (
            <Card
              key={article.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedArticle(article.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-primary">{article.step}</span>
                  {completedArticles.includes(article.id) && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <CardTitle>{article.name}</CardTitle>
                <CardDescription>{article.principle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <strong>Sanctuary:</strong> {article.sanctuaryMeaning}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  <strong>Financial:</strong> {article.financialPrinciple}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlueprintFinancial;
