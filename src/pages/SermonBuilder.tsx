import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Film, Mic, BookOpen, TrendingUp, ArrowRight, CheckCircle2, Loader2, Archive } from "lucide-react";
import { sermonTitleSchema, sermonThemeSchema, sermonStoneSchema, sermonBridgeSchema } from "@/lib/validationSchemas";
import { sanitizeText } from "@/lib/sanitize";
import { SermonRichTextArea } from "@/components/sermon/SermonRichTextArea";
import { SermonPDFExport } from "@/components/sermon/SermonPDFExport";

const STEPS = [
  { num: 1, title: "Setup", icon: BookOpen },
  { num: 2, title: "Smooth Stones", icon: TrendingUp },
  { num: 3, title: "Build Bridges", icon: ArrowRight },
  { num: 4, title: "Movie Structure", icon: Film },
  { num: 5, title: "Complete", icon: CheckCircle2 },
];

const SERMON_STYLES = [
  "Inductive (Experience → Principle)",
  "Deductive (Principle → Application)",
  "Narrative (Story-Driven)",
  "Expository (Verse-by-Verse)",
  "Topical (Theme-Focused)"
];

export default function SermonBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id");
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [asking, setAsking] = useState(false);
  
  const [sermon, setSermon] = useState({
    title: "",
    theme_passage: "",
    sermon_style: SERMON_STYLES[0],
    smooth_stones: [] as string[],
    bridges: [] as string[],
    movie_structure: {} as any,
  });

  const [newStone, setNewStone] = useState("");
  const [newBridge, setNewBridge] = useState("");
  const [aiHelp, setAiHelp] = useState("");

  useEffect(() => {
    checkAuth();
    if (editId) {
      loadSermon(editId);
    }
  }, [editId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) navigate("/auth");
  };

  const loadSermon = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setSermon({
          title: data.title,
          theme_passage: data.theme_passage,
          sermon_style: data.sermon_style,
          smooth_stones: Array.isArray(data.smooth_stones) ? (data.smooth_stones as string[]) : [],
          bridges: Array.isArray(data.bridges) ? (data.bridges as string[]) : [],
          movie_structure: data.movie_structure || {},
        });
        setCurrentStep(data.current_step || 1);
      }
    } catch (error) {
      console.error("Error loading sermon:", error);
      toast.error("Failed to load sermon");
    } finally {
      setLoading(false);
    }
  };

  const askJeeves = async (mode: string, context: any) => {
    setAsking(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: { mode, ...context },
      });

      if (error) throw error;
      setAiHelp(data.content);
      toast.success("Jeeves has provided guidance!");
    } catch (error) {
      console.error("Error getting help:", error);
      toast.error("Failed to get AI assistance");
    } finally {
      setAsking(false);
    }
  };

  const addSmoothStone = () => {
    const plainText = newStone.replace(/<[^>]*>/g, '').trim();
    try {
      const validated = sermonStoneSchema.parse(plainText);
      const sanitized = sanitizeText(validated);
      setSermon({ ...sermon, smooth_stones: [...sermon.smooth_stones, newStone] });
      setNewStone("");
      toast.success("Smooth stone added!");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Invalid stone format");
    }
  };

  const addBridge = () => {
    const plainText = newBridge.replace(/<[^>]*>/g, '').trim();
    try {
      const validated = sermonBridgeSchema.parse(plainText);
      const sanitized = sanitizeText(validated);
      setSermon({ ...sermon, bridges: [...sermon.bridges, newBridge] });
      setNewBridge("");
      toast.success("Bridge added!");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Invalid bridge format");
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      try {
        sermonTitleSchema.parse(sermon.title);
        sermonThemeSchema.parse(sermon.theme_passage.replace(/<[^>]*>/g, ''));
      } catch (error: any) {
        toast.error(error.errors?.[0]?.message || "Invalid input");
        return;
      }
    }
    if (currentStep === 2 && sermon.smooth_stones.length < 5) {
      toast.error("Please add 5 smooth stones (insights)");
      return;
    }
    if (currentStep === 3 && sermon.bridges.length < 4) {
      toast.error("Please add at least 4 bridges");
      return;
    }
    
    setCurrentStep(Math.min(currentStep + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const saveSermon = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const sermonData = {
        user_id: user.id,
        title: sermon.title,
        theme_passage: sermon.theme_passage,
        sermon_style: sermon.sermon_style,
        smooth_stones: sermon.smooth_stones,
        bridges: sermon.bridges,
        movie_structure: sermon.movie_structure,
        current_step: currentStep,
        status: currentStep === 5 ? "complete" : "in_progress",
      };

      if (editId) {
        const { error } = await supabase
          .from("sermons")
          .update(sermonData)
          .eq("id", editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("sermons").insert(sermonData);
        if (error) throw error;
      }

      toast.success("Sermon saved successfully!");
    } catch (error) {
      console.error("Error saving sermon:", error);
      toast.error("Failed to save sermon");
    } finally {
      setLoading(false);
    }
  };

  if (loading && editId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <Navigation />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <Navigation />
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 backdrop-blur-sm border-b border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Film className="w-12 h-12 text-white" />
              <div>
                <h1 className="text-4xl font-bold text-white">Sermon Builder</h1>
                <p className="text-purple-200 text-lg">Movie-Model Approach with 5 Smooth Stones</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate("/sermon-archive")}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Archive className="w-4 h-4 mr-2" />
              My Sermons
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {STEPS.map((step) => (
            <Button
              key={step.num}
              variant={currentStep === step.num ? "default" : "outline"}
              className={`flex-1 min-w-[150px] ${
                currentStep === step.num
                  ? "bg-white text-purple-900"
                  : currentStep > step.num
                  ? "bg-white/20 text-white border-white/40"
                  : "bg-transparent text-white/60 border-white/20"
              }`}
              onClick={() => setCurrentStep(step.num)}
            >
              {step.num}. {step.title}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Main Content */}
          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Start New Sermon"}
                {currentStep === 2 && "Gather Your 5 Smooth Stones"}
                {currentStep === 3 && "Build Bridges"}
                {currentStep === 4 && "Structure Like a Movie"}
                {currentStep === 5 && "Complete & Review"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sermon Title</label>
                    <div className="relative">
                      <Input
                        placeholder="Enter a catchy, movie-like title..."
                        value={sermon.title}
                        onChange={(e) => setSermon({ ...sermon, title: e.target.value })}
                        className="pr-10"
                        maxLength={200}
                      />
                      <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Theme / Main Passage</label>
                    <SermonRichTextArea
                      content={sermon.theme_passage}
                      onChange={(content) => setSermon({ ...sermon, theme_passage: content })}
                      placeholder="Enter Bible passage or main theme (e.g., 'John 3:16' or 'God's love for humanity')"
                      minHeight="100px"
                      themePassage={sermon.theme_passage}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sermon Style</label>
                    <Select value={sermon.sermon_style} onValueChange={(v) => setSermon({ ...sermon, sermon_style: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERMON_STYLES.map((style) => (
                          <SelectItem key={style} value={style}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-setup", { title: sermon.title, theme: sermon.theme_passage, style: sermon.sermon_style })}
                    disabled={asking || !sermon.title || !sermon.theme_passage}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Ask Jeeves for Setup Guidance
                  </Button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Like David selecting 5 smooth stones for Goliath, identify 5 powerful AHA moments that will captivate your audience.
                  </p>
                  
                  <div className="space-y-2">
                    {sermon.smooth_stones.map((stone, idx) => (
                      <div key={idx} className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-purple-900">Stone {idx + 1}:</span>
                          <div className="text-sm text-foreground flex-1 prose prose-sm" dangerouslySetInnerHTML={{ __html: stone }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <SermonRichTextArea
                      content={newStone}
                      onChange={setNewStone}
                      placeholder="Enter a Phototheology insight or AHA moment..."
                      minHeight="80px"
                      themePassage={sermon.theme_passage}
                    />
                    <Button onClick={addSmoothStone} className="w-full">
                      Add Stone ({sermon.smooth_stones.length}/5)
                    </Button>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-stones", { theme: sermon.theme_passage, existingStones: sermon.smooth_stones })}
                    disabled={asking}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Ask Jeeves for Stone Ideas
                  </Button>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Create narrative bridges that connect your 5 stones into a flowing story. Each bridge transitions smoothly between insights.
                  </p>
                  
                  <div className="space-y-2">
                    {sermon.bridges.map((bridge, idx) => (
                      <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2">
                          <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="text-sm text-foreground prose prose-sm" dangerouslySetInnerHTML={{ __html: bridge }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <SermonRichTextArea
                      content={newBridge}
                      onChange={setNewBridge}
                      placeholder="Enter a bridge connection (e.g., 'This leads us to understand...')"
                      minHeight="80px"
                      themePassage={sermon.theme_passage}
                    />
                    <Button onClick={addBridge} className="w-full">
                      Add Bridge ({sermon.bridges.length}/4+)
                    </Button>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-bridges", { stones: sermon.smooth_stones, existingBridges: sermon.bridges })}
                    disabled={asking}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Ask Jeeves for Bridge Ideas
                  </Button>
                </>
              )}

              {currentStep === 4 && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Structure your sermon like a movie: Opening Hook → Rising Action → Climax → Resolution → Call to Action
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Opening Hook</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.opening || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, opening: content }})}
                        placeholder="How will you grab attention in the first 2 minutes?"
                        minHeight="80px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Climax / Main Point</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.climax || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, climax: content }})}
                        placeholder="What's the transformative moment?"
                        minHeight="100px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Resolution</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.resolution || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, resolution: content }})}
                        placeholder="How does everything come together?"
                        minHeight="80px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Call to Action</label>
                      <SermonRichTextArea
                        content={sermon.movie_structure.call_to_action || ""}
                        onChange={(content) => setSermon({ ...sermon, movie_structure: { ...sermon.movie_structure, call_to_action: content }})}
                        placeholder="What should the audience do now?"
                        minHeight="80px"
                        themePassage={sermon.theme_passage}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => askJeeves("sermon-structure", { stones: sermon.smooth_stones, bridges: sermon.bridges })}
                    disabled={asking}
                    variant="outline"
                    className="w-full"
                  >
                    {asking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Ask Jeeves for Structure Help
                  </Button>
                </>
              )}

              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
                    <h3 className="font-bold text-green-900 mb-1">Sermon Complete!</h3>
                    <p className="text-sm text-green-800">
                      Your sermon framework is ready. Review all sections and save your work.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">Title:</p>
                      <p className="text-foreground">{sermon.title}</p>
                    </div>
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">Smooth Stones: {sermon.smooth_stones.length}</p>
                    </div>
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">Bridges: {sermon.bridges.length}</p>
                    </div>
                    <div className="p-3 bg-card rounded border">
                      <p className="font-medium text-sm">Movie Structure: Complete</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveSermon} disabled={loading} className="flex-1" size="lg">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Save Sermon
                    </Button>
                    <SermonPDFExport sermon={sermon} size="lg" variant="secondary" />
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={prevStep} disabled={currentStep === 1} variant="outline" className="flex-1">
                  Previous
                </Button>
                <Button onClick={nextStep} disabled={currentStep === 5} className="flex-1">
                  Next Step
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="bg-blue-50/90 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <BookOpen className="w-6 h-6" />
                  The 5 Smooth Stones Approach
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-blue-900">
                <p>
                  Like David selecting 5 smooth stones to face Goliath, you'll gather 5 powerful AHA moments that will captivate your audience.
                </p>
                <div className="space-y-2">
                  <div className="flex gap-2 items-start">
                    <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Each stone is a mind-blowing Phototheology insight</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <ArrowRight className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Bridges connect stones into a flowing narrative</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <Film className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Structure it like a movie with climax and resolution</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Help Display */}
            {aiHelp && (
              <Card className="bg-purple-50/90 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-purple-900">Jeeves&apos; Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                    {aiHelp}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
