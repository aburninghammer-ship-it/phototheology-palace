import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageIcon,
  Loader2,
  Download,
  Sparkles,
  Clock,
  GitCompare,
  Layers,
  ArrowRight,
  List,
  Church,
  FileText,
  BookOpen,
  Zap
} from "lucide-react";
import { useSourceLibrary, SourceDocument } from "@/hooks/useSourceLibrary";
import { useAICredits, FEATURE_COSTS } from "@/hooks/useAICredits";
import { AICreditsDisplay, CreditsRequiredBadge } from "@/components/ai/AICreditsDisplay";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

type InfographicTemplate = "timeline" | "comparison" | "hierarchy" | "process" | "list" | "sanctuary-map";

interface TemplateOption {
  id: InfographicTemplate;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const TEMPLATES: TemplateOption[] = [
  {
    id: "timeline",
    name: "Timeline",
    description: "Chronological events and Bible history",
    icon: <Clock className="h-6 w-6" />,
    color: "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
  },
  {
    id: "comparison",
    name: "Comparison",
    description: "Two concepts side-by-side",
    icon: <GitCompare className="h-6 w-6" />,
    color: "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
  },
  {
    id: "hierarchy",
    name: "Hierarchy",
    description: "Nested concepts and structures",
    icon: <Layers className="h-6 w-6" />,
    color: "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400"
  },
  {
    id: "process",
    name: "Process",
    description: "Step-by-step concepts",
    icon: <ArrowRight className="h-6 w-6" />,
    color: "bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400"
  },
  {
    id: "list",
    name: "Key Points",
    description: "Verses, applications, insights",
    icon: <List className="h-6 w-6" />,
    color: "bg-cyan-100 dark:bg-cyan-950/30 text-cyan-600 dark:text-cyan-400"
  },
  {
    id: "sanctuary-map",
    name: "Sanctuary",
    description: "Sanctuary-themed layout",
    icon: <Church className="h-6 w-6" />,
    color: "bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400"
  }
];

export default function InfographicGenerator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const { sources, isLoading: loadingSources } = useSourceLibrary();
  const { creditsInfo, withCredits } = useAICredits();

  const [selectedTemplate, setSelectedTemplate] = useState<InfographicTemplate | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    searchParams.get("sourceId")
  );
  const [customText, setCustomText] = useState("");
  const [title, setTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);

  const selectedSource = useMemo(
    () => sources.find((s) => s.id === selectedSourceId),
    [sources, selectedSourceId]
  );

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    if (!selectedSourceId && !customText.trim()) return;

    setIsGenerating(true);

    try {
      const result = await withCredits("infographic", async () => {
        // Get source text
        const sourceText = selectedSource?.extracted_text || customText;

        const { data, error } = await supabase.functions.invoke("generate-infographic", {
          body: {
            sourceText,
            template: selectedTemplate,
            title: title || undefined,
            userId: user?.id,
          },
        });

        if (error) throw error;
        return data;
      }, { skipDeduction: true }); // Edge function handles deduction

      if (result) {
        setGeneratedData(result);
        toast({
          title: "Infographic generated!",
          description: "Your infographic is ready to view.",
        });
      }
    } catch (error: any) {
      console.error("Generation failed:", error);
      toast({
        title: "Generation failed",
        description: error.message || "Could not generate infographic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Infographic Generator | Phototheology Palace</title>
        <meta
          name="description"
          content="Generate beautiful infographics from your Bible study documents and notes."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <ImageIcon className="h-8 w-8 text-purple-500" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Infographic Generator</h1>
                  <p className="text-muted-foreground">
                    Create visual summaries from your study materials
                  </p>
                </div>
              </div>

              <AICreditsDisplay variant="badge" />
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Configuration */}
            <div className="space-y-6">
              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">1. Choose Template</CardTitle>
                  <CardDescription>Select the style for your infographic</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {TEMPLATES.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "p-4 rounded-lg border-2 cursor-pointer transition-all text-center",
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <div className={cn("w-12 h-12 rounded-lg mx-auto mb-2 flex items-center justify-center", template.color)}>
                          {template.icon}
                        </div>
                        <h4 className="font-medium text-sm">{template.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Source Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">2. Select Source</CardTitle>
                  <CardDescription>Choose from your library or enter custom text</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingSources ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : sources.length > 0 ? (
                    <Select value={selectedSourceId || ""} onValueChange={setSelectedSourceId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select from library..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source.id} value={source.id}>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {source.title}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Button variant="outline" onClick={() => navigate("/sources")}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Upload documents first
                    </Button>
                  )}

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Text</Label>
                    <Textarea
                      placeholder="Paste your content here..."
                      value={customText}
                      onChange={(e) => {
                        setCustomText(e.target.value);
                        setSelectedSourceId(null);
                      }}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Title & Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3. Customize</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Infographic Title (optional)</Label>
                    <Input
                      placeholder="My Study Infographic"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                className="w-full h-12 text-lg"
                disabled={!selectedTemplate || (!selectedSourceId && !customText.trim()) || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Infographic
                    <CreditsRequiredBadge feature="infographic" />
                  </>
                )}
              </Button>
            </div>

            {/* Right Column - Preview */}
            <div>
              <Card className="min-h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Preview
                    {generatedData && (
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!generatedData ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <ImageIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No infographic yet</h3>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Select a template and source, then click "Generate" to create your infographic.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-center">{generatedData.title}</h3>
                      <Badge className="mx-auto block w-fit">{generatedData.template}</Badge>

                      {generatedData.sections?.map((section: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-semibold">{section.heading}</h4>
                          <ul className="list-disc list-inside mt-2 text-sm">
                            {section.points?.map((point: string, i: number) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                          {section.scriptures?.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {section.scriptures.map((verse: string, i: number) => (
                                <Badge key={i} variant="secondary">{verse}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      <p className="text-xs text-muted-foreground text-center mt-4">
                        Full visual rendering coming soon
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
