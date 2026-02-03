import { useState, useMemo } from "react";
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
  { id: 1, title: "Select Sources", description: "Choose documents from your library" },
  { id: 2, title: "Configure", description: "Set title, audience, and lesson count" },
  { id: 3, title: "Generate", description: "AI creates your study series" },
  { id: 4, title: "Review", description: "Edit and export your series" },
];

const AUDIENCE_OPTIONS = [
  { id: "adults", label: "Adults", icon: Users, description: "Mature theological discussions" },
  { id: "youth", label: "Youth", icon: GraduationCap, description: "Engaging for teens" },
  { id: "children", label: "Children", icon: Baby, description: "Simple, visual approach" },
  { id: "mixed", label: "Mixed Ages", icon: Users, description: "Family-friendly content" },
];

export default function StudySeriesGenerator() {
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
    setGenerationStatus("Preparing source materials...");

    try {
      // Check if user has enough credits for the full series
      const check = await checkCredits("study-series-outline");
      if (!check.has_credits && !check.user_has_unlimited) {
        toast({
          title: "Insufficient credits",
          description: `You need ${totalCost} credits for this series. You have ${check.credits_available}.`,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Collect source texts
      const sourceTexts = selectedSources.map((s) => s.extracted_text || "").filter(Boolean);

      setGenerationProgress(10);
      setGenerationStatus("Generating series outline...");

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
      setGenerationStatus("Complete!");

      setGeneratedSeries(data);
      setCurrentStep(4);

      toast({
        title: "Series generated!",
        description: `Created ${data.lessons?.length || lessonCount} lessons successfully.`,
      });
    } catch (error: any) {
      console.error("Generation failed:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate study series. Please try again.",
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
              <CardTitle className="text-2xl">Premium Feature</CardTitle>
              <CardDescription>
                The Bible Study Series Generator is available to premium subscribers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-2">What you get:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Generate complete multi-lesson Bible studies
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    AI-powered outline and content creation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Export to PDF and Word
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Unlimited AI credits included
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">$30/month</p>
                <p className="text-sm text-muted-foreground">Unlimited AI + Premium Features</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" onClick={() => navigate("/pricing?tier=unlimited")}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(-1)}>
                Go Back
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
          content="Generate complete Bible study series from your documents with AI."
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
                  <h1 className="text-3xl font-bold">Study Series Generator</h1>
                  <p className="text-muted-foreground">
                    Create multi-lesson Bible studies from your documents
                  </p>
                </div>
              </div>

              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Crown className="h-3 w-3 mr-1" />
                Premium Feature
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
                  <p className="text-xs font-medium">{step.title}</p>
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
                  <CardTitle>Select Source Documents</CardTitle>
                  <CardDescription>
                    Choose one or more documents from your library to generate a study series.
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
                      <p className="text-muted-foreground mb-4">No documents in your library yet.</p>
                      <Button onClick={() => navigate("/sources")}>
                        Upload Documents
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
                                {source.document_type.toUpperCase()} • {source.extracted_text?.split(/\s+/).length || 0} words
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
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={selectedSourceIds.length === 0}
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* Step 2: Configure */}
            {currentStep === 2 && (
              <>
                <CardHeader>
                  <CardTitle>Configure Your Series</CardTitle>
                  <CardDescription>
                    Set the title, target audience, and number of lessons.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Series Title</Label>
                    <Input
                      placeholder="e.g., Journey Through the Psalms"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      placeholder="Describe what this study series will cover..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Target Audience</Label>
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
                            <span className="font-medium">{option.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Lessons</Label>
                    <Select value={lessonCount.toString()} onValueChange={(v) => setLessonCount(parseInt(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} lessons
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Estimated AI credits:</span>
                      <Badge variant="secondary">
                        <Zap className="h-3 w-3 mr-1 text-yellow-500" />
                        {totalCost} credits
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {creditsInfo?.has_unlimited ? "Included with your unlimited plan" : `You have ${creditsInfo?.credits_balance} credits`}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep(3)}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* Step 3: Generate */}
            {currentStep === 3 && (
              <>
                <CardHeader>
                  <CardTitle>Generate Your Series</CardTitle>
                  <CardDescription>
                    Review your settings and start the AI generation.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg border space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Title:</span>
                      <span className="font-medium">{title || "Untitled Series"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sources:</span>
                      <span className="font-medium">{selectedSourceIds.length} document(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Audience:</span>
                      <span className="font-medium capitalize">{targetAudience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Lessons:</span>
                      <span className="font-medium">{lessonCount}</span>
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="space-y-4">
                      <Progress value={generationProgress} className="h-3" />
                      <p className="text-center text-sm text-muted-foreground">
                        {generationStatus || "Generating your study series..."}
                      </p>
                      <p className="text-center text-xs text-muted-foreground">
                        This may take 1-2 minutes depending on the number of lessons.
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} disabled={isGenerating}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleGenerate} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Series
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
                  <CardTitle>Your Study Series is Ready!</CardTitle>
                  <CardDescription>
                    Review and export your generated Bible study series.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        Generation Complete!
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-500">
                      Created {generatedSeries.lessons.length} lessons with discussion questions and application points.
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
                              {lesson.sections.length} sections • {lesson.discussionQuestions.length} questions
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
                    Create Another
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Export DOCX
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
