import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame, Loader2, Sparkles, ChevronRight, BookOpen, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = [
  { id: "end-time", label: "End-Time Discernment" },
  { id: "current-events", label: "Current Events" },
  { id: "righteousness-by-faith", label: "Righteousness by Faith" },
  { id: "prophecy", label: "Prophecy" },
  { id: "sanctuary", label: "Sanctuary" },
  { id: "everlasting-gospel", label: "Everlasting Gospel" },
  { id: "series-builder", label: "Series Builder" },
];

interface GeneratedStarter {
  starterTitle: string;
  bigIdea: string;
  palaceAnchors: string[];
  keyTexts?: {
    oldTestament?: string[];
    gospels?: string[];
    epistles?: string[];
    revelation?: string[];
  };
}

export function SermonForgeWidget() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<string>("any");
  const [generating, setGenerating] = useState(false);
  const [starter, setStarter] = useState<GeneratedStarter | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setGenerating(true);
    setStarter(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-sermon-starter", {
        body: {
          topic: topic.trim(),
          level: "Intermediate",
          category: category !== "any" ? category : undefined,
        },
      });

      if (error) throw error;

      if (data?.starter) {
        setStarter(data.starter);
        toast.success("Sermon starter generated!");
      }
    } catch (err) {
      console.error("Generation error:", err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const allTexts = starter?.keyTexts
    ? [
        ...(starter.keyTexts.oldTestament || []),
        ...(starter.keyTexts.gospels || []),
        ...(starter.keyTexts.epistles || []),
        ...(starter.keyTexts.revelation || []),
      ].slice(0, 4)
    : [];

  return (
    <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Sermon Forge</CardTitle>
              <CardDescription className="text-xs">PT-driven sermon generation</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sermon-topics")}
            className="text-xs"
          >
            Browse Topics
            <ChevronRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Generate Form */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter a topic (e.g., Faith, Hope, Sabbath)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            className="flex-1"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Category</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generating || !topic.trim()}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Forging Sermon Starter...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Starter
            </>
          )}
        </Button>

        {/* Generated Result */}
        <AnimatePresence>
          {starter && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-lg bg-card border space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-sm">{starter.starterTitle}</h3>
                <Sparkles className="h-4 w-4 text-amber-500 flex-shrink-0" />
              </div>

              <p className="text-xs text-muted-foreground italic">
                "{starter.bigIdea}"
              </p>

              {/* Palace Anchors */}
              {starter.palaceAnchors && starter.palaceAnchors.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {starter.palaceAnchors.slice(0, 3).map((anchor, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {anchor}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Key Texts */}
              {allTexts.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3" />
                  {allTexts.join(" | ")}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => navigate("/sermon-topics")}
                >
                  View Full Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    // TODO: Export to sermon builder
                    toast.info("Export to Sermon Builder coming soon!");
                  }}
                >
                  Send to Builder
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
