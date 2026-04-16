import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { EnhancedSocialShare } from "@/components/EnhancedSocialShare";
import { blueprintFinancialData, sanctuaryExplanation } from "@/data/blueprintFinancialData";
import { BlueprintMap } from "@/components/blueprint/BlueprintMap";
import { BlueprintEnhancedFeatures } from "@/components/blueprint/BlueprintEnhancedFeatures";
import { useTranslation } from "react-i18next";

const BlueprintFinancial = () => {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState<{ [key: number]: string }>({});
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);
  const { t } = useTranslation();

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
            {t('common.backToOverview')}
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
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.sanctuaryMeaning')}</h3>
                <p className="text-muted-foreground">{currentArticle.sanctuaryMeaning}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.financial.financialPrinciple')}</h3>
                <p className="text-muted-foreground">{currentArticle.financialPrinciple}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.teaching')}</h3>
                <div className="text-muted-foreground whitespace-pre-line">{currentArticle.teaching}</div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.reflectionQuestions')}</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {currentArticle.reflectionQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.actionSteps')}</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {currentArticle.actionSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.scriptureReferences')}</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  {currentArticle.scriptureReferences.map((ref, i) => (
                    <li key={i}>{ref}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.prayerPrompt')}</h3>
                <p className="text-muted-foreground italic">{currentArticle.prayerPrompt}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{t('blueprint.common.yourNotes')}</h3>
                <Textarea
                  value={notes[currentArticle.id] || ""}
                  onChange={(e) => handleNotesChange(currentArticle.id, e.target.value)}
                  placeholder={t('blueprint.common.notesPlaceholder')}
                  className="min-h-[200px]"
                />
              </div>

              {!completedArticles.includes(currentArticle.id) && (
                <Button
                  onClick={() => handleComplete(currentArticle.id)}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {t('common.markAsComplete')}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Interactive Study Tools */}
          <BlueprintEnhancedFeatures
            blueprintType="financial"
            currentArticleId={currentArticle?.id}
            currentArticleTitle={currentArticle?.name}
            currentArticleContent={currentArticle?.teaching}
            dailyCheckItems={[
              t('blueprint.financial.dailyCheck.readArticle'),
              t('blueprint.financial.dailyCheck.trackedSpending'),
              t('blueprint.financial.dailyCheck.avoidedPurchase'),
              t('blueprint.financial.dailyCheck.prayedFinancial'),
              t('blueprint.financial.dailyCheck.gaveGenerously'),
              t('blueprint.financial.dailyCheck.reviewedBudget')
            ]}
          />
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
            {t('blueprint.financial.pageTitle')}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {t('blueprint.financial.pageSubtitle')}
          </p>
          <div className="prose prose-sm max-w-none mb-6 text-left">
            <div className="text-muted-foreground whitespace-pre-line">
              {sanctuaryExplanation}
            </div>
          </div>
          <EnhancedSocialShare
            title={t('blueprint.financial.shareTitle')}
            content={t('blueprint.financial.shareContent')}
            url={window.location.href}
          />
        </div>

        <BlueprintMap
          items={blueprintFinancialData.map(article => ({
            id: article.id,
            name: article.name,
            step: t('blueprint.common.stepLabel', { step: article.id })
          }))}
          completedItems={completedArticles}
          onItemClick={setSelectedArticle}
        />
      </div>
    </div>
  );
};

export default BlueprintFinancial;
