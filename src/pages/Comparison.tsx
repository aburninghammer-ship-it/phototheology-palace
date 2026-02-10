import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Sparkles, BookOpen, Brain, Users, Target, Shield, Building2, Zap, Trophy, ChevronRight } from "lucide-react";

const StatusIcon = ({ status }: { status: boolean | string }) => {
  if (status === true) return <Check className="h-5 w-5 text-green-500" />;
  if (status === false) return <X className="h-5 w-5 text-red-400" />;
  if (status === "partial") return <Minus className="h-5 w-5 text-yellow-500" />;
  return null;
};

export default function Comparison() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const comparisonData = {
    features: [
      {
        category: t('comparison.categoryStudyMethodology'),
        items: [
          {
            feature: t('comparison.featureStructuredFramework'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.noteEightFloorPalace'),
            othersNote: t('comparison.noteGeneralSearch'),
          },
          {
            feature: t('comparison.featureSanctuaryBlueprint'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.noteBuiltIntoAnalysis'),
            othersNote: t('comparison.noteNotMethodology'),
          },
          {
            feature: t('comparison.featureChristCentered'),
            pt: true,
            logos: "partial",
            accordance: "partial",
            chatgpt: "partial",
            ptNote: t('comparison.noteAutomatic'),
            othersNote: t('comparison.noteManualCrossRef'),
          },
          {
            feature: t('comparison.featureTypeAntitype'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteAiAssisted'),
            othersNote: t('comparison.noteUserMustKnow'),
          },
          {
            feature: t('comparison.featurePropheticPattern'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteSystematicGuardrails'),
            othersNote: t('comparison.noteNoFramework'),
          },
        ],
      },
      {
        category: t('comparison.categoryAiIntegration'),
        items: [
          {
            feature: t('comparison.featureTheologicalAi'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteJeevesKnows'),
            othersNote: t('comparison.noteGenericAi'),
          },
          {
            feature: t('comparison.featureGuardrails'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.noteTheologicalBoundaries'),
            othersNote: t('comparison.noteCanGenerateAnything'),
          },
          {
            feature: t('comparison.featureContextualChat'),
            pt: true,
            logos: "partial",
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteJeevesEveryContext'),
            othersNote: t('comparison.noteSeparateTools'),
          },
          {
            feature: t('comparison.featureSermonGeneration'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteEightFloorScaffold'),
            othersNote: t('comparison.noteGenericOutlines'),
          },
        ],
      },
      {
        category: t('comparison.categoryLearningEngagement'),
        items: [
          {
            feature: t('comparison.featureGamified'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.noteXpBadges'),
            othersNote: t('comparison.noteTraditionalTools'),
          },
          {
            feature: t('comparison.featureWeeklyChallenges'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.noteAiJudged'),
            othersNote: t('comparison.noteNoCommunity'),
          },
          {
            feature: t('comparison.featureMemoryPalace'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.note3dVisual'),
            othersNote: t('comparison.noteTextOnly'),
          },
          {
            feature: t('comparison.featureSpacedRepetition'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: false,
            ptNote: t('comparison.noteFlashcards'),
            othersNote: t('comparison.noteNoMemoryTools'),
          },
        ],
      },
      {
        category: t('comparison.categoryContentResources'),
        items: [
          {
            feature: t('comparison.featureOriginalLanguage'),
            pt: true,
            logos: true,
            accordance: true,
            chatgpt: "partial",
            ptNote: t('comparison.noteStrongsAi'),
            othersNote: t('comparison.noteStrongsAcademic'),
          },
          {
            feature: t('comparison.featureCrossReference'),
            pt: true,
            logos: true,
            accordance: true,
            chatgpt: "partial",
            ptNote: t('comparison.noteChainLinks'),
            othersNote: t('comparison.noteTsk'),
          },
          {
            feature: t('comparison.featureCommentary'),
            pt: true,
            logos: true,
            accordance: true,
            chatgpt: "partial",
            ptNote: t('comparison.noteAiClassic'),
            othersNote: t('comparison.notePurchasedSeparately'),
          },
          {
            feature: t('comparison.featureSermonBuilder'),
            pt: true,
            logos: "partial",
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteFullWorkflow'),
            othersNote: t('comparison.noteBasicOrNone'),
          },
        ],
      },
      {
        category: t('comparison.categoryAccessibilityPricing'),
        items: [
          {
            feature: t('comparison.featureMobileFirst'),
            pt: true,
            logos: "partial",
            accordance: "partial",
            chatgpt: true,
            ptNote: t('comparison.notePwaResponsive'),
            othersNote: t('comparison.noteSeparateMobile'),
          },
          {
            feature: t('comparison.featureFreeTier'),
            pt: true,
            logos: false,
            accordance: false,
            chatgpt: "partial",
            ptNote: t('comparison.noteGenerousFree'),
            othersNote: t('comparison.noteHighCost'),
          },
          {
            feature: t('comparison.featureOfflineAccess'),
            pt: true,
            logos: true,
            accordance: true,
            chatgpt: false,
            ptNote: t('comparison.notePwaCaching'),
            othersNote: t('comparison.noteDesktopOnly'),
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={t('comparison.seoTitle')} description={t('comparison.seoDescription')} />
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            {t('comparison.whyPhototheology')}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('comparison.heroTitle')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('comparison.heroDescription')}
          </p>
        </div>

        {/* Key Differentiators */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{t('comparison.structuredFramework')}</CardTitle>
              <CardDescription>
                {t('comparison.structuredFrameworkDescription')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardHeader>
              <Shield className="h-10 w-10 text-amber-500 mb-2" />
              <CardTitle>{t('comparison.theologicalGuardrails')}</CardTitle>
              <CardDescription>
                {t('comparison.theologicalGuardrailsDescription')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader>
              <Trophy className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle>{t('comparison.activeLearning')}</CardTitle>
              <CardDescription>
                {t('comparison.activeLearningDescription')}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Comparison vs ChatGPT */}
        <Card className="mb-16 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle className="text-2xl">{t('comparison.whyNotChatgpt')}</CardTitle>
                <CardDescription>
                  {t('comparison.whyNotChatgptDescription')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  {t('comparison.problemsGenericAi')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.noGuardrailsBold')}</strong> - {t('comparison.noGuardrailsDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.noFrameworkBold')}</strong> - {t('comparison.noFrameworkDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.hallucinatesBold')}</strong> - {t('comparison.hallucinatesDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.noSanctuaryBold')}</strong> - {t('comparison.noSanctuaryDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.noProgressionBold')}</strong> - {t('comparison.noProgressionDesc')}
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  {t('comparison.ptApproach')}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.jeevesTrainedBold')}</strong> - {t('comparison.jeevesTrainedDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.palaceFrameworkBold')}</strong> - {t('comparison.palaceFrameworkDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.scriptureFirstBold')}</strong> - {t('comparison.scriptureFirstDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.sanctuaryLensBold')}</strong> - {t('comparison.sanctuaryLensDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t('comparison.adaptsLevelBold')}</strong> - {t('comparison.adaptsLevelDesc')}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison vs Logos/Accordance */}
        <Card className="mb-16 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-b">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle className="text-2xl">{t('comparison.whyNotTraditional')}</CardTitle>
                <CardDescription>
                  {t('comparison.whyNotTraditionalDescription')}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">{t('comparison.traditionalStrengths')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('comparison.strengthAcademic')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('comparison.strengthLanguage')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('comparison.strengthCommentary')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('comparison.strengthProfessional')}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">{t('comparison.whatTheyMissing')}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    {t('comparison.missingMethodology')}
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    {t('comparison.missingHighPrice')}
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    {t('comparison.missingSteepCurve')}
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    {t('comparison.missingGamification')}
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    {t('comparison.missingAi')}
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    {t('comparison.missingTeaching')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('comparison.ptDifference')}
              </h4>
              <p className="text-muted-foreground">
                {t('comparison.ptDifferenceDescription')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">{t('comparison.featureByFeature')}</h2>

          {comparisonData.features.map((category) => (
            <Card key={category.category} className="mb-6 overflow-hidden">
              <CardHeader className="bg-muted/50 py-3">
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-3 min-w-[200px]">{t('comparison.feature')}</th>
                        <th className="text-center p-3 min-w-[100px]">
                          <span className="font-bold text-primary">PT</span>
                        </th>
                        <th className="text-center p-3 min-w-[80px]">Logos</th>
                        <th className="text-center p-3 min-w-[80px]">Accordance</th>
                        <th className="text-center p-3 min-w-[80px]">ChatGPT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, idx) => (
                        <tr key={item.feature} className={idx % 2 === 0 ? "bg-muted/10" : ""}>
                          <td className="p-3">
                            <div className="font-medium">{item.feature}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.ptNote}
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.pt} />
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.logos} />
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.accordance} />
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.chatgpt} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>{t('comparison.fullSupport')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-yellow-500" />
              <span>{t('comparison.partialSupport')}</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-400" />
              <span>{t('comparison.notAvailable')}</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">{t('comparison.readyToExperience')}</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              {t('comparison.readyToExperienceDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {t('comparison.startFreeTrial')}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/interactive-demo")}
              >
                {t('comparison.tryInteractiveDemo')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
