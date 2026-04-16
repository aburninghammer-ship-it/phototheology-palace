import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Microscope, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { toast } from "sonner";
import type { CharacterProfile } from "@/data/biblicalCharacterProfiles";

interface CharacterDeepAnalysisProps {
  character: CharacterProfile;
}

export function CharacterDeepAnalysis({ character }: CharacterDeepAnalysisProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasCheckedCache, setHasCheckedCache] = useState(false);

  // Check cache on mount
  useEffect(() => {
    const checkCache = async () => {
      const { data } = await supabase
        .from("character_deep_analyses" as any)
        .select("analysis_text")
        .eq("character_id", character.id)
        .single();

      if (data && (data as any).analysis_text) {
        setAnalysis((data as any).analysis_text);
      }
      setHasCheckedCache(true);
    };
    checkCache();
  }, [character.id]);

  const generateAnalysis = async (regenerate = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("character-deep-analysis", {
        body: {
          characterData: {
            id: character.id,
            name: character.name,
            meaning: character.meaning,
            role: character.role,
            era: character.era,
            keyScriptures: character.keyScriptures,
            archetypes: character.archetypes,
            storyArc: character.storyArc,
            strengths: character.strengths,
            weaknesses: character.weaknesses,
            therapyView: character.therapyView,
            journey: character.journey,
            quickCard: character.quickCard,
          },
          regenerate,
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast.error(data.error);
        return;
      }

      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Deep analysis error:", err);
      toast.error("Failed to generate analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hasCheckedCache) return null;

  if (!analysis && !loading) {
    return (
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <Microscope className="h-12 w-12 text-primary/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Deep Character Analysis</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            Generate a comprehensive 1-2 page psychological-spiritual profile exploring {character.name}'s 
            core wounds, defense mechanisms, relational patterns, and redemption arc.
          </p>
          <Button onClick={() => generateAnalysis()} className="gap-2">
            <Microscope className="h-4 w-4" />
            Generate Deep Analysis
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground font-medium">
            Analyzing {character.name}'s psychological and spiritual profile...
          </p>
          <p className="text-xs text-muted-foreground mt-1">This may take 15-30 seconds</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Microscope className="h-5 w-5" /> Deep Character Analysis
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => generateAnalysis(true)}
          className="gap-1 text-xs"
        >
          <RefreshCw className="h-3 w-3" /> Regenerate
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <StyledMarkdown content={analysis!} />
        </div>
      </CardContent>
    </Card>
  );
}
