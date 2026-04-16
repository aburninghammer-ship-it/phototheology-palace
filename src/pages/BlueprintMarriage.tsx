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
import { BlueprintEnhancedFeatures } from "@/components/blueprint/BlueprintEnhancedFeatures";
import { useTranslation } from "react-i18next";

export default function BlueprintMarriage() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [completedArticles, setCompletedArticles] = useState<number[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation();

  const currentArticle = selectedArticle
    ? SANCTUARY_MARRIAGE_ARTICLES.find(a => a.id === selectedArticle)
    : null;

  const handleComplete = async (articleId: number) => {
    if (!user) {
      toast({
        title: t('common.signInRequired'),
        description: t('common.signInToTrackProgress'),
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
        title: t('common.progressSaved'),
        description: t('common.articleCompleted', { name: SANCTUARY_MARRIAGE_ARTICLES.find(a => a.id === articleId)?.name }),
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      toast({
        title: t('common.error'),
        description: t('common.failedToSaveProgress'),
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
                  title={t('blueprint.marriage.shareTitle')}
                  content={t('blueprint.marriage.shareContent')}
                  url={window.location.href}
                  defaultMessage={t('blueprint.marriage.shareDefaultMessage')}
                  buttonText={t('blueprint.common.shareThisResource')}
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
                    "{MARRIAGE_BLUEPRINT_INTRO.quote.text}"
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">— {MARRIAGE_BLUEPRINT_INTRO.quote.source}</p>
                </CardContent>
              </Card>
            </section>

            <BlueprintMap
              items={SANCTUARY_MARRIAGE_ARTICLES.map(article => ({
                id: article.id,
                name: article.name,
                step: t('blueprint.common.stepLabel', { step: article.id })
              }))}
              completedItems={completedArticles}
              onItemClick={setSelectedArticle}
            />
          </>
        ) : (
          <>
          <Card variant="glass">
            <CardHeader>
              <Button
                variant="ghost"
                onClick={() => setSelectedArticle(null)}
                className="w-fit mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('common.backToOverview')}
              </Button>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{t('blueprint.common.articleOfTotal', { article: currentArticle?.id, total: 6 })}</Badge>
                {completedArticles.includes(currentArticle?.id || 0) && (
                  <Badge className="bg-green-500">{t('common.completed')}</Badge>
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
                      {t('blueprint.common.sanctuaryMeaning')}
                    </h3>
                    <p className="text-base">{currentArticle?.sanctuaryMeaning}</p>
                  </div>

                  {/* Marriage Principle */}
                  <div className="bg-primary/10 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-lg">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      {t('blueprint.marriage.marriagePrinciple')}
                    </h3>
                    <p className="text-lg font-semibold text-primary">
                      "{currentArticle?.marriagePrinciple}"
                    </p>
                  </div>

                  {/* Detailed Teaching */}
                  <div>
                    <h3 className="font-semibold text-lg mb-3 text-primary">{t('blueprint.common.teaching')}</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line leading-relaxed">
                        {currentArticle?.detailedTeaching}
                      </p>
                    </div>
                  </div>

                  {/* Reflection Questions */}
                  <div className="bg-yellow-500/10 backdrop-blur-sm p-4 rounded-xl border border-yellow-500/20 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">{t('blueprint.common.reflectionQuestions')}</h3>
                    <ul className="space-y-2">
                      {currentArticle?.reflectionQuestions.map((question, i) => (
                        <li key={i} className="text-sm">• {question}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Couple Exercises */}
                  <div className="bg-blue-500/10 backdrop-blur-sm p-4 rounded-xl border border-blue-500/20 shadow-lg">
                    <h3 className="font-semibold text-lg mb-3">{t('blueprint.marriage.exercisesForCouples')}</h3>
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
                    <h3 className="font-semibold text-lg mb-3">{t('blueprint.common.scriptureReferences')}</h3>
                    <ul className="space-y-1">
                      {currentArticle?.scriptureReferences.map((ref, i) => (
                        <li key={i} className="text-sm">• {ref}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Prayer Prompt */}
                  <div className="bg-primary/15 backdrop-blur-sm p-4 rounded-xl border border-primary/30 shadow-lg">
                    <h3 className="font-semibold text-lg mb-2 text-primary">{t('blueprint.marriage.prayerTogether')}</h3>
                    <p className="italic text-base">{currentArticle?.prayerPrompt}</p>
                  </div>

                  {/* Notes Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">{t('blueprint.common.yourNotesAndReflections')}</h3>
                    <Textarea
                      placeholder={t('blueprint.marriage.notesPlaceholder')}
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
                      {t('common.markAsComplete')}
                    </Button>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Interactive Study Tools */}
          <BlueprintEnhancedFeatures
            blueprintType="marriage"
            currentArticleId={currentArticle?.id}
            currentArticleTitle={currentArticle?.name}
            currentArticleContent={currentArticle?.detailedTeaching}
            dailyCheckItems={[
              t('blueprint.marriage.dailyCheck.readPrinciple'),
              t('blueprint.marriage.dailyCheck.prayedTogether'),
              t('blueprint.marriage.dailyCheck.practicedExercise'),
              t('blueprint.marriage.dailyCheck.meaningfulConversation'),
              t('blueprint.marriage.dailyCheck.showedLove')
            ]}
          />
          </>
        )}
      </main>
    </div>
  );
}
