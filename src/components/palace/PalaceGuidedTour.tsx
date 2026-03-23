import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, ChevronRight, ChevronLeft, BookOpen, Sparkles, Loader2,
  Eye, Film, Image as ImageIcon, Gem, Target, Brain, Layers, Crown,
  Telescope, Heart, Flame, Clock, Scale, Link2, Scroll, Search
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const PALACE_ROOMS = [
  // Floor 1
  { code: "SR", name: "Story Room", floor: 1, floorName: "Furnishing", icon: BookOpen, gradient: "from-violet-500 to-purple-600", guide: "jeeves" },
  { code: "IR", name: "Imagination Room", floor: 1, floorName: "Furnishing", icon: Eye, gradient: "from-purple-500 to-fuchsia-600", guide: "reginald" },
  { code: "24F", name: "24FPS Room", floor: 1, floorName: "Furnishing", icon: Film, gradient: "from-indigo-500 to-violet-600", guide: "jeeves" },
  { code: "BR", name: "Bible Rendered", floor: 1, floorName: "Furnishing", icon: ImageIcon, gradient: "from-blue-500 to-indigo-600", guide: "reginald" },
  { code: "TR", name: "Translation Room", floor: 1, floorName: "Furnishing", icon: Scroll, gradient: "from-cyan-500 to-blue-600", guide: "jeeves" },
  { code: "GR", name: "Gems Room", floor: 1, floorName: "Furnishing", icon: Gem, gradient: "from-amber-500 to-yellow-600", guide: "reginald" },
  // Floor 2
  { code: "OR", name: "Observation Room", floor: 2, floorName: "Investigation", icon: Eye, gradient: "from-blue-500 to-sky-600", guide: "jeeves" },
  { code: "DC", name: "Def-Com Room", floor: 2, floorName: "Investigation", icon: BookOpen, gradient: "from-indigo-500 to-blue-600", guide: "reginald" },
  { code: "ST", name: "Symbols/Types", floor: 2, floorName: "Investigation", icon: Target, gradient: "from-teal-500 to-cyan-600", guide: "jeeves" },
  { code: "QR", name: "Questions Room", floor: 2, floorName: "Investigation", icon: Brain, gradient: "from-sky-500 to-blue-600", guide: "reginald" },
  { code: "QA", name: "Q&A Room", floor: 2, floorName: "Investigation", icon: Link2, gradient: "from-blue-500 to-indigo-600", guide: "jeeves" },
  // Floor 3
  { code: "NF", name: "Nature Freestyle", floor: 3, floorName: "Freestyle", icon: Sparkles, gradient: "from-emerald-500 to-green-600", guide: "reginald" },
  { code: "PF", name: "Personal Freestyle", floor: 3, floorName: "Freestyle", icon: Heart, gradient: "from-green-500 to-emerald-600", guide: "jeeves" },
  { code: "BF", name: "Bible Freestyle", floor: 3, floorName: "Freestyle", icon: BookOpen, gradient: "from-lime-500 to-green-600", guide: "reginald" },
  { code: "HF", name: "History Freestyle", floor: 3, floorName: "Freestyle", icon: Clock, gradient: "from-teal-500 to-emerald-600", guide: "jeeves" },
  { code: "LR", name: "Listening Room", floor: 3, floorName: "Freestyle", icon: Brain, gradient: "from-emerald-500 to-teal-600", guide: "reginald" },
  // Floor 4
  { code: "CR", name: "Concentration Room", floor: 4, floorName: "Next Level", icon: Crown, gradient: "from-amber-500 to-orange-600", guide: "jeeves" },
  { code: "DR", name: "Dimensions Room", floor: 4, floorName: "Next Level", icon: Layers, gradient: "from-orange-500 to-amber-600", guide: "reginald" },
  { code: "C6", name: "Connect 6", floor: 4, floorName: "Next Level", icon: BookOpen, gradient: "from-yellow-500 to-amber-600", guide: "jeeves" },
  { code: "TRm", name: "Theme Room", floor: 4, floorName: "Next Level", icon: Target, gradient: "from-amber-500 to-yellow-600", guide: "reginald" },
  { code: "TZ", name: "Time Zone Room", floor: 4, floorName: "Next Level", icon: Clock, gradient: "from-orange-500 to-red-600", guide: "jeeves" },
  { code: "PRm", name: "Patterns Room", floor: 4, floorName: "Next Level", icon: Layers, gradient: "from-amber-500 to-orange-600", guide: "reginald" },
  { code: "P||", name: "Parallels Room", floor: 4, floorName: "Next Level", icon: Scale, gradient: "from-yellow-500 to-orange-600", guide: "jeeves" },
  { code: "FRt", name: "Fruit Room", floor: 4, floorName: "Next Level", icon: Heart, gradient: "from-rose-500 to-pink-600", guide: "reginald" },
  { code: "CEC", name: "Christ Every Chapter", floor: 4, floorName: "Next Level", icon: Crown, gradient: "from-green-500 to-emerald-600", guide: "jeeves" },
  { code: "R66", name: "Room 66", floor: 4, floorName: "Next Level", icon: BookOpen, gradient: "from-emerald-500 to-green-600", guide: "reginald" },
  // Floor 5
  { code: "BL", name: "Blue Room (Sanctuary)", floor: 5, floorName: "Vision", icon: Telescope, gradient: "from-blue-600 to-indigo-700", guide: "jeeves" },
  { code: "PR", name: "Prophecy Room", floor: 5, floorName: "Vision", icon: Telescope, gradient: "from-indigo-500 to-purple-600", guide: "reginald" },
  { code: "3A", name: "Three Angels'", floor: 5, floorName: "Vision", icon: Sparkles, gradient: "from-purple-500 to-violet-600", guide: "jeeves" },
  { code: "FE", name: "Feasts Room", floor: 5, floorName: "Vision", icon: Crown, gradient: "from-orange-500 to-yellow-600", guide: "reginald" },
  // Floor 6
  { code: "JR", name: "Juice Room", floor: 6, floorName: "Three Heavens", icon: Sparkles, gradient: "from-fuchsia-500 to-pink-600", guide: "jeeves" },
  // Floor 7
  { code: "FRm", name: "Fire Room", floor: 7, floorName: "Spiritual", icon: Flame, gradient: "from-red-500 to-rose-600", guide: "reginald" },
  { code: "MR", name: "Meditation Room", floor: 7, floorName: "Spiritual", icon: Brain, gradient: "from-pink-500 to-fuchsia-600", guide: "jeeves" },
  { code: "SRm", name: "Speed Room", floor: 7, floorName: "Spiritual", icon: Sparkles, gradient: "from-fuchsia-500 to-pink-600", guide: "reginald" },
];

interface TourStep {
  room: typeof PALACE_ROOMS[number];
  content: string;
}

export function PalaceGuidedTour() {
  const [open, setOpen] = useState(false);
  const [verse, setVerse] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [generating, setGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentRoom = steps[currentStep]?.room;
  const isLastStep = currentStep === steps.length - 1;
  const guide = currentRoom?.guide || "jeeves";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [currentStep]);

  const startTour = async () => {
    if (!verse.trim()) return;
    setLoading(true);
    setStarted(true);
    setSteps([]);
    setCurrentStep(0);

    try {
      // Generate first batch of rooms (Floor 1)
      await generateBatch(0, verse.trim());
    } catch (err) {
      console.error("Tour start error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateBatch = async (startIdx: number, verseRef: string) => {
    setGenerating(true);
    const batchSize = 4;
    const batch = PALACE_ROOMS.slice(startIdx, startIdx + batchSize);

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "palace_guided_tour",
          verse: verseRef,
          rooms: batch.map(r => ({ code: r.code, name: r.name, floor: r.floor, floorName: r.floorName })),
        },
      });

      if (error) throw error;

      const content = data?.response || data?.content || (typeof data === 'string' ? data : '');
      
      // Parse response - expect sections delimited by room codes
      const newSteps: TourStep[] = [];
      for (const room of batch) {
        const regex = new RegExp(`\\[${room.code.replace(/[|]/g, '\\$&')}\\]([\\s\\S]*?)(?=\\[(?:${batch.map(r => r.code.replace(/[|]/g, '\\$&')).join('|')})\\]|$)`);
        const match = content.match(regex);
        newSteps.push({
          room,
          content: match ? match[1].trim() : `Apply the ${room.name} principle to this verse by considering how ${room.name} techniques illuminate the text.`,
        });
      }

      setSteps(prev => [...prev, ...newSteps]);
    } catch (err) {
      console.error("Batch generation error:", err);
      // Add placeholder steps
      const placeholders = batch.map(room => ({
        room,
        content: `The ${room.name} on Floor ${room.floor} invites you to explore this verse through its unique lens.`,
      }));
      setSteps(prev => [...prev, ...placeholders]);
    } finally {
      setGenerating(false);
    }
  };

  const handleNext = () => {
    if (isLastStep) return;
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    // Pre-fetch next batch when nearing end of current batch
    if (nextStep >= steps.length - 2 && steps.length < PALACE_ROOMS.length && !generating) {
      generateBatch(steps.length, verse.trim());
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const resetTour = () => {
    setStarted(false);
    setSteps([]);
    setCurrentStep(0);
    setVerse("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetTour(); }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2 h-12 md:h-11 text-base border-primary/30 hover:border-primary/60">
          <Compass className="h-5 w-5 text-primary" />
          Palace Guided Tour
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        {!started ? (
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                Palace Guided Tour
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0">J</div>
                <Card variant="glass" className="flex-1">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Jeeves:</strong> Welcome! Reginald and I will walk you through every room in the Palace, showing how each principle illuminates your chosen verse. Ready?
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shrink-0">R</div>
                <Card variant="glass" className="flex-1">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Reginald:</strong> I'll handle the creative rooms — imagination, freestyle, devotion. Jeeves covers the analytical side. Together, we'll show you the full power of Phototheology!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Enter a verse reference to tour:</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. John 3:16 or Psalm 23:1"
                  value={verse}
                  onChange={(e) => setVerse(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startTour()}
                  className="flex-1"
                />
                <Button onClick={startTour} disabled={!verse.trim() || loading} className="gap-2">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Start Tour
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                We'll walk through all {PALACE_ROOMS.length} rooms across 8 floors, applying each principle to your verse.
              </p>
            </div>
          </div>
        ) : loading && steps.length === 0 ? (
          <div className="p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Compass className="h-12 w-12 text-primary" />
            </motion.div>
            <p className="text-lg font-medium">Preparing your Palace tour...</p>
            <p className="text-sm text-muted-foreground">Jeeves and Reginald are studying <strong>{verse}</strong></p>
          </div>
        ) : (
          <div className="flex flex-col h-full max-h-[85vh]">
            {/* Header */}
            <div className={`p-4 border-b bg-gradient-to-r ${currentRoom?.gradient || 'from-primary to-accent'} bg-opacity-10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${currentRoom?.gradient || 'from-primary to-accent'} text-white`}>
                    {currentRoom && <currentRoom.icon className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{currentRoom?.name}</span>
                      <Badge variant="outline" className="text-[10px] font-mono text-white/80 border-white/30">{currentRoom?.code}</Badge>
                    </div>
                    <p className="text-xs text-white/70">Floor {currentRoom?.floor} • {currentRoom?.floorName}</p>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-white/30">
                  {currentStep + 1} / {PALACE_ROOMS.length}
                </Badge>
              </div>
              {/* Progress */}
              <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white/80 rounded-full"
                  animate={{ width: `${((currentStep + 1) / PALACE_ROOMS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Guide avatar */}
                  <div className="flex gap-3 items-start">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 ${
                      guide === "jeeves" 
                        ? "bg-gradient-to-br from-amber-400 to-amber-600" 
                        : "bg-gradient-to-br from-emerald-400 to-emerald-600"
                    }`}>
                      {guide === "jeeves" ? "J" : "R"}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {guide === "jeeves" ? "Jeeves" : "Reginald"} • {currentRoom?.name}
                      </p>
                      {steps[currentStep] ? (
                        <StyledMarkdown content={steps[currentStep].content} className="text-sm leading-relaxed" />
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Preparing this room...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verse reference reminder */}
                  <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <BookOpen className="h-3.5 w-3.5" />
                      Touring: <strong className="text-foreground">{verse}</strong>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </ScrollArea>

            {/* Navigation */}
            <div className="flex items-center justify-between p-4 border-t bg-card">
              <Button variant="ghost" onClick={handleBack} disabled={currentStep === 0} className="gap-1.5">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setOpen(false); resetTour(); }}>
                  End Tour
                </Button>
                {!isLastStep ? (
                  <Button onClick={handleNext} disabled={currentStep >= steps.length - 1 && generating} className="gap-1.5">
                    Next Room
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => { setOpen(false); resetTour(); }} className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Sparkles className="h-4 w-4" />
                    Complete Tour
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
