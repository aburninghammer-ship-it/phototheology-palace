import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowUp, ChevronRight, RotateCcw, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CopyButton } from "@/components/ui/copy-button";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { num: 1, label: "Text", code: "Asc-1", description: "Word-level forensic analysis", icon: "🔬" },
  { num: 2, label: "Chapter", code: "Asc-2", description: "Chapter narrative context", icon: "📖" },
  { num: 3, label: "Book", code: "Asc-3", description: "Book-level theme & purpose", icon: "📚" },
  { num: 4, label: "Cycle", code: "Asc-4", description: "Which of the 8 Cycles", icon: "🔄" },
  { num: 5, label: "Heaven", code: "Asc-5", description: "Which Day-of-the-Lord horizon", icon: "🌌" },
];

const CYCLES = [
  { code: "@Ad", name: "Adamic" }, { code: "@No", name: "Noahic" },
  { code: "@Ab", name: "Abrahamic" }, { code: "@Mo", name: "Mosaic" },
  { code: "@Cy", name: "Cyrusic" }, { code: "@CyC", name: "Cyrus-Christ" },
  { code: "@Sp", name: "Holy Spirit" }, { code: "@Re", name: "Remnant" },
];

const HEAVENS = [
  { code: "1H", name: "1st Heaven (DoL¹/NE¹)" },
  { code: "2H", name: "2nd Heaven (DoL²/NE²)" },
  { code: "3H", name: "3rd Heaven (DoL³/NE³)" },
];

const SAMPLE_BOOKS = [
  "Genesis", "Exodus", "Leviticus", "Psalms", "Isaiah", "Daniel",
  "Matthew", "John", "Romans", "Hebrews", "Revelation",
];

const SAMPLE_CHAPTERS = [
  "Genesis 1", "Genesis 22", "Exodus 12", "Exodus 25", "Psalm 22", "Psalm 23",
  "Isaiah 53", "Daniel 7", "Matthew 24", "John 17", "Romans 8", "Hebrews 9", "Revelation 5",
];

interface AscensionResult {
  step: number;
  content: string;
  mode: "static" | "dynamic";
  dynamicTarget?: Record<string, string>;
}

export function FiveAscensionsStudy() {
  const [verseRef, setVerseRef] = useState("");
  const [isDynamic, setIsDynamic] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = not started
  const [results, setResults] = useState<AscensionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dynamicTargets, setDynamicTargets] = useState<Record<number, Record<string, string>>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [results, isLoading]);

  const generateDynamicTargets = () => {
    const randomChapter = SAMPLE_CHAPTERS[Math.floor(Math.random() * SAMPLE_CHAPTERS.length)];
    const randomBook = SAMPLE_BOOKS[Math.floor(Math.random() * SAMPLE_BOOKS.length)];
    const randomCycle = CYCLES[Math.floor(Math.random() * CYCLES.length)];
    const randomHeaven = HEAVENS[Math.floor(Math.random() * HEAVENS.length)];

    setDynamicTargets({
      2: { chapter: randomChapter },
      3: { book: randomBook },
      4: { cycle: randomCycle.code },
      5: { heaven: randomHeaven.code },
    });
  };

  const runStep = async (step: number) => {
    if (!verseRef.trim()) {
      toast({ title: "Enter a verse reference", description: "e.g., John 3:16, Daniel 7:13-14", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setCurrentStep(step);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      let userName = null;
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).single();
        userName = profile?.display_name?.trim().split(/\s+/)[0] || null;
      }

      const dynamicTarget = isDynamic ? dynamicTargets[step] : undefined;

      const { data, error } = await supabase.functions.invoke("five-ascensions", {
        body: {
          verseReference: verseRef,
          mode: isDynamic ? "dynamic" : "static",
          step,
          dynamicTarget,
          userName,
        },
      });

      if (error) throw error;

      if (data?.response) {
        const newResult: AscensionResult = {
          step,
          content: data.response,
          mode: isDynamic ? "dynamic" : "static",
          dynamicTarget,
        };
        setResults(prev => {
          const filtered = prev.filter(r => r.step !== step);
          return [...filtered, newResult].sort((a, b) => a.step - b.step);
        });
      }
    } catch (error: any) {
      console.error("Five Ascensions error:", error);
      toast({ title: "Error", description: error.message || "Failed to generate analysis.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const runAllSteps = async () => {
    if (isDynamic) generateDynamicTargets();
    for (let i = 1; i <= 5; i++) {
      await runStep(i);
    }
  };

  const resetStudy = () => {
    setResults([]);
    setCurrentStep(0);
    setDynamicTargets({});
  };

  const saveStudy = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast({ title: "Sign in to save", variant: "destructive" }); return; }

      const fullContent = results.map(r => {
        const stepInfo = STEPS.find(s => s.num === r.step);
        return `## ${stepInfo?.icon} Ascension ${r.step}: ${stepInfo?.label} (${r.mode})\n\n${r.content}`;
      }).join("\n\n---\n\n");

      const { error } = await supabase.from("user_studies").insert({
        user_id: user.id,
        title: `Five Ascensions: ${verseRef} (${isDynamic ? "Dynamic" : "Static"})`,
        content: fullContent,
        study_type: "five-ascensions",
        metadata: { verseReference: verseRef, mode: isDynamic ? "dynamic" : "static", dynamicTargets, stepsCompleted: results.length },
      });

      if (error) throw error;
      toast({ title: "Study saved!", description: "Find it in your saved studies." });
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const getStepStatus = (stepNum: number) => {
    if (results.find(r => r.step === stepNum)) return "complete";
    if (isLoading && currentStep === stepNum) return "loading";
    return "pending";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-primary/20">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ArrowUp className="h-5 w-5 text-primary" />
            Five Ascensions Study
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Climb from word-level analysis to cosmic context — the staircase of Phototheology
          </p>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Label className="text-sm font-medium mb-1.5 block">Verse Reference</Label>
              <Input
                value={verseRef}
                onChange={e => setVerseRef(e.target.value)}
                placeholder="e.g., John 3:16, Daniel 7:13-14, Psalm 23:1"
                className="text-base"
                onKeyDown={e => { if (e.key === "Enter") runAllSteps(); }}
              />
            </div>
            <Button onClick={runAllSteps} disabled={isLoading || !verseRef.trim()} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isLoading ? "Ascending..." : "Ascend All 5"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch
                id="dynamic-mode"
                checked={isDynamic}
                onCheckedChange={(checked) => {
                  setIsDynamic(checked);
                  if (checked) generateDynamicTargets();
                }}
              />
              <Label htmlFor="dynamic-mode" className="text-sm cursor-pointer">
                {isDynamic ? "🎵 Dynamic Mode — Creative exploration" : "📌 Static Mode — Anchored study"}
              </Label>
            </div>
            {isDynamic && (
              <Button variant="ghost" size="sm" onClick={generateDynamicTargets} className="text-xs gap-1">
                <RotateCcw className="h-3 w-3" /> Shuffle Targets
              </Button>
            )}
          </div>

          {isDynamic && Object.keys(dynamicTargets).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {dynamicTargets[2]?.chapter && (
                <Badge variant="outline" className="text-xs">Ch: {dynamicTargets[2].chapter}</Badge>
              )}
              {dynamicTargets[3]?.book && (
                <Badge variant="outline" className="text-xs">Book: {dynamicTargets[3].book}</Badge>
              )}
              {dynamicTargets[4]?.cycle && (
                <Badge variant="outline" className="text-xs">Cycle: {CYCLES.find(c => c.code === dynamicTargets[4].cycle)?.name}</Badge>
              )}
              {dynamicTargets[5]?.heaven && (
                <Badge variant="outline" className="text-xs">Heaven: {dynamicTargets[5].heaven}</Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Staircase Progress */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((step, idx) => {
          const status = getStepStatus(step.num);
          return (
            <div key={step.num} className="flex items-center">
              <Button
                variant={status === "complete" ? "default" : status === "loading" ? "secondary" : "outline"}
                size="sm"
                className={`gap-1.5 text-xs whitespace-nowrap ${status === "complete" ? "bg-primary" : ""}`}
                onClick={() => runStep(step.num)}
                disabled={isLoading}
              >
                <span>{step.icon}</span>
                <span>{step.label}</span>
                {status === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
                {status === "complete" && <span className="text-primary-foreground">✓</span>}
              </Button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground mx-0.5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>

      {/* Results */}
      <AnimatePresence mode="popLayout">
        {results.map(result => {
          const stepInfo = STEPS.find(s => s.num === result.step);
          return (
            <motion.div
              key={result.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="text-lg">{stepInfo?.icon}</span>
                      Ascension {result.step}: {stepInfo?.label}
                      <Badge variant={result.mode === "dynamic" ? "secondary" : "outline"} className="text-[10px]">
                        {result.mode === "dynamic" ? "🎵 Dynamic" : "📌 Static"}
                      </Badge>
                    </CardTitle>
                    <CopyButton text={result.content} size="sm" className="h-7 text-xs" />
                  </div>
                  {result.dynamicTarget && (
                    <p className="text-xs text-muted-foreground">
                      Target: {JSON.stringify(result.dynamicTarget)}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[500px]">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{result.content}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Loading indicator */}
      {isLoading && (
        <Card className="border-primary/20">
          <CardContent className="py-8 flex items-center justify-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <div>
              <p className="font-medium">Ascending to Level {currentStep}...</p>
              <p className="text-sm text-muted-foreground">{STEPS.find(s => s.num === currentStep)?.description}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {results.length > 0 && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={resetStudy} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
          <Button size="sm" onClick={saveStudy} className="gap-1.5">
            <Save className="h-4 w-4" /> Save Study
          </Button>
        </div>
      )}

      <div ref={scrollRef} />
    </div>
  );
}
