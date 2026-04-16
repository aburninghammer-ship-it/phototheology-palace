import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Loader2,
  Sparkles,
  FileText,
  Users,
  GraduationCap,
  Baby,
  Crown,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  Download,
  Edit,
  Zap
} from "lucide-react";
import { useSourceLibrary, SourceDocument } from "@/hooks/useSourceLibrary";
import { useAICredits, FEATURE_COSTS } from "@/hooks/useAICredits";
import { useSubscription } from "@/hooks/useSubscription";
import { AICreditsDisplay, CreditsRequiredBadge } from "@/components/ai/AICreditsDisplay";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type TargetAudience = "adults" | "youth" | "children" | "mixed";

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: "studySeries.stepSelectSources", description: "studySeries.stepSelectSourcesDesc" },
  { id: 2, title: "studySeries.stepConfigure", description: "studySeries.stepConfigureDesc" },
  { id: 3, title: "studySeries.stepGenerate", description: "studySeries.stepGenerateDesc" },
  { id: 4, title: "studySeries.stepReview", description: "studySeries.stepReviewDesc" },
];

const AUDIENCE_OPTIONS = [
  { id: "adults", label: "studySeries.audienceAdults", icon: Users, description: "studySeries.audienceAdultsDesc" },
  { id: "youth", label: "studySeries.audienceYouth", icon: GraduationCap, description: "studySeries.audienceYouthDesc" },
  { id: "children", label: "studySeries.audienceChildren", icon: Baby, description: "studySeries.audienceChildrenDesc" },
  { id: "mixed", label: "studySeries.audienceMixed", icon: Users, description: "studySeries.audienceMixedDesc" },
];

export default function StudySeriesGenerator() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sources, isLoading: loadingSources } = useSourceLibrary();
  const { creditsInfo, withCredits, checkCredits } = useAICredits();
  const { subscription } = useSubscription();

  const isPremium = subscription.hasAccess && (
    subscription.tier === "premium" ||
    subscription.tier === "patron" ||
    creditsInfo?.has_unlimited
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>(
    searchParams.get("sourceId") ? [searchParams.get("sourceId")!] : []
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState<TargetAudience>("adults");
  const [lessonCount, setLessonCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState("");
  const [generatedSeries, setGeneratedSeries] = useState<any>(null);

  const selectedSources = useMemo(
    () => sources.filter((s) => selectedSourceIds.includes(s.id)),
    [sources, selectedSourceIds]
  );

  const totalCost = FEATURE_COSTS["study-series-outline"] + (lessonCount * FEATURE_COSTS["study-series-lesson"]);

  const toggleSourceSelection = (sourceId: string) => {
    setSelectedSourceIds((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleGenerate = async () => {
    if (selectedSourceIds.length === 0) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStatus(t('studySeries.preparingSourceMaterials'));

    try {
      // Check if user has enough credits for the full series
      const check = await checkCredits("study-series-outline");
      if (!check.has_credits && !check.user_has_unlimited) {
        toast({
          title: t('studySeries.insufficientCredits'),
          description: t('studySeries.insufficientCreditsDesc', { needed: totalCost, available: check.credits_available }),
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Collect source texts
      const sourceTexts = selectedSources.map((s) => s.extracted_text || "").filter(Boolean);

      setGenerationProgress(10);
      setGenerationStatus(t('studySeries.generatingOutline'));

      // Call edge function for full series generation
      const { data, error } = await supabase.functions.invoke("generate-study-series", {
        body: {
          action: "full",
          sourceTexts,
          title: title || undefined,
          description: description || undefined,
          targetAudience,
          lessonCount,
          userId: user?.id,
        },
      });

      if (error) throw error;

      // Update progress as we receive the result
      setGenerationProgress(100);
      setGenerationStatus(t('studySeries.complete'));

      setGeneratedSeries(data);
      setCurrentStep(4);

      toast({
        title: t('studySeries.seriesGenerated'),
        description: t('studySeries.createdLessons', { count: data.lessons?.length || lessonCount }),
      });
    } catch (error: any) {
      console.error("Generation failed:", error);
      toast({
        title: t('studySeries.generationFailed'),
        description: error.message || t('studySeries.couldNotGenerate'),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  // Premium gate
  if (!isPremium) {
    return (
      <ProtectedRoute>
        <Helmet>
          <title>Study Series Generator | Phototheology Palace</title>
        </Helmet>

        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle className="text-2xl">{t('studySeries.premiumFeature')}</CardTitle>
              <CardDescription>
                {t('studySeries.premiumDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">{t('studySeries.whatYouGet')}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('studySeries.benefitMultiLesson')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('studySeries.benefitAiPowered')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('studySeries.benefitExport')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {t('studySeries.benefitUnlimited')}
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">{t('studySeries.pricePerMonth')}</p>
                <p className="text-sm text-muted-foreground">{t('studySeries.unlimitedAiPremium')}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => navigate("/pricing?tier=unlimited")}>
                <Crown className="h-4 w-4 mr-2" />
                {t('studySeries.upgradeToPremium')}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                {t('studySeries.goBack')}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Study Series Generator | Phototheology Palace</title>
        <meta
          name="description"
          content={t('studySeries.metaDescription')}
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <BookOpen className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{t('studySeries.pageTitle')}</h1>
                  <p className="text-muted-foreground">
                    {t('studySeries.pageSubtitle')}
                  </p>
                </div>
              </div>

              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Crown className="h-3 w-3 mr-1" />
                {t('studySeries.premiumFeature')}
              </Badge>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {WIZARD_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center",
                    index < WIZARD_STEPS.length - 1 && "flex-1"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors",
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
                  </div>
                  {index < WIZARD_STEPS.length - 1 && (
                    <div
                      className={cn(
                        "flex-1 h-1 mx-2",
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {WIZARD_STEPS.map((step) => (
                <div key={step.id} className="text-center" style={{ width: "25%" }}>
                  <p className="text-xs font-medium">{t(step.title)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card>
            {/* Step 1: Select Sources */}
            {currentStep === 1 && (
              <>
                <CardHeader>
                  <CardTitle>{t('studySeries.selectSourceDocuments')}</CardTitle>
                  <CardDescription>
                    {t('studySeries.selectSourceDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingSources ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : sources.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">{t('studySeries.noDocumentsYet')}</p>
                      <Button onClick={() => navigate("/sources")}>
                        {t('studySeries.uploadDocuments')}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {sources.map((source) => (
                        <div
                          key={source.id}
                          className={cn(
                            "p-4 border rounded-lg cursor-pointer transition-colors",
                            selectedSourceIds.includes(source.id)
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          )}
                          onClick={() => toggleSourceSelection(source.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedSourceIds.includes(source.id)}
                              onCheckedChange={() => toggleSourceSelection(source.id)}
                            />
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="font-medium">{source.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {source.document_type.toUpperCase()} • {t('studySeries.nWords', { count: source.extracted_text?.split(/\s+/).length || 0 })}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => navigate(-1)}>
                    {t('studySeries.cancel')}
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={selectedSourceIds.length === 0}
                  >
                    {t('studySeries.next')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* Step 2: Configure */}
            {currentStep === 2 && (
              <>
                <CardHeader>
                  <CardTitle>{t('studySeries.configureYourSeries')}</CardTitle>
                  <CardDescription>
                    {t('studySeries.configureDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>{t('studySeries.seriesTitle')}</Label>
                    <Input
                      placeholder={t('studySeries.seriesTitlePlaceholder')}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('studySeries.descriptionOptional')}</Label>
                    <Textarea
                      placeholder={t('studySeries.descriptionPlaceholder')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('studySeries.targetAudience')}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {AUDIENCE_OPTIONS.map((option) => (
                        <div
                          key={option.id}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-colors",
                            targetAudience === option.id
                              ? "border-primary bg-primary/5"
                              : "hover:border-primary/50"
                          )}
                          onClick={() => setTargetAudience(option.id as TargetAudience)}
                        >
                          <div className="flex items-center gap-2">
                            <option.icon className="h-5 w-5" />
                            <span className="font-medium">{t(option.label)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{t(option.description)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('studySeries.numberOfLessons')}</Label>
                    <Select value={lessonCount.toString()} onValueChange={(v) => setLessonCount(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {t('studySeries.nLessons', { count: num })}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{t('studySeries.estimatedCredits')}</span>
                      <Badge variant="secondary">
                        <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                        {t('studySeries.nCredits', { count: totalCost })}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {creditsInfo?.has_unlimited ? t('studySeries.includedWithUnlimited') : t('studySeries.youHaveCredits', { count: creditsInfo?.credits_balance })}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('studySeries.back')}
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    {t('studySeries.next')}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* Step 3: Generate */}
            {currentStep === 3 && (
              <>
                <CardHeader>
                  <CardTitle>{t('studySeries.generateYourSeries')}</CardTitle>
                  <CardDescription>
                    {t('studySeries.reviewAndStart')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg border space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('studySeries.titleLabel')}:</span>
                      <span className="font-medium">{title || t('studySeries.untitledSeries')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('studySeries.sourcesLabel')}:</span>
                      <span className="font-medium">{t('studySeries.nDocuments', { count: selectedSourceIds.length })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('studySeries.audienceLabel')}:</span>
                      <span className="font-medium capitalize">{targetAudience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('studySeries.lessonsLabel')}:</span>
                      <span className="font-medium">{lessonCount}</span>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-4">
                      <Progress value={generationProgress} className="h-3" />
                      <p className="text-center text-sm text-muted-foreground">
                        {generationStatus || t('studySeries.generatingYourSeries')}
                      </p>
                      <p className="text-center text-xs text-muted-foreground">
                        {t('studySeries.mayTakeMinutes')}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isGenerating}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('studySeries.back')}
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('studySeries.generating')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        {t('studySeries.generateSeries')}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && generatedSeries && (
              <>
                <CardHeader>
                  <CardTitle>{t('studySeries.seriesReady')}</CardTitle>
                  <CardDescription>
                    {t('studySeries.reviewAndExport')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        {t('studySeries.generationComplete')}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      {t('studySeries.createdLessonsWithDetails', { count: generatedSeries.lessons.length })}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">{generatedSeries.title}</h3>
                    <div className="space-y-2">
                      {generatedSeries.lessons.map((lesson: any) => (
                        <div key={lesson.id} className="p-3 border rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">{lesson.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {t('studySeries.sectionsAndQuestions', { sections: lesson.sections.length, questions: lesson.discussionQuestions.length })}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    {t('studySeries.createAnother')}
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      {t('studySeries.exportPdf')}
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      {t('studySeries.exportDocx')}
                    </Button>
                  </div>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
