// ─── Weapon Forge ───────────────────────────────────────────────────────────
// Interactive AI-evaluated weapon forging exercise for War College manuscripts.
// Users write an apologetic argument, Jeeves scores it, and they sharpen until >= 9.

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Flame, Loader2, CheckCircle2, Swords, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface SharpeningEntry {
  draft: string;
  score: number;
  feedback: string;
  strengths: string;
  improvement: string;
}

interface WeaponForgeProps {
  manuscript: string;
  forgeExercise: string;
  dayNumber: number;
  avatarId: string;
  avatarName: string;
  track: string;
  title: string;
}

export function WeaponForge({
  manuscript, forgeExercise, dayNumber, avatarId, avatarName, track, title,
}: WeaponForgeProps) {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [evaluation, setEvaluation] = useState<{
    score: number; feedback: string; strengths: string; improvement: string;
  } | null>(null);
  const [history, setHistory] = useState<SharpeningEntry[]>([]);
  const [forged, setForged] = useState(false);
  const [forgedWeapon, setForgedWeapon] = useState<{ text: string; score: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Check for existing weapon on mount
  useEffect(() => {
    if (!user) { setChecking(false); return; }
    (async () => {
      const { data } = await (supabase as any)
        .from("war_college_weapons")
        .select("weapon_text, score, sharpening_history")
        .eq("user_id", user.id)
        .eq("avatar_id", avatarId)
        .eq("day_number", dayNumber)
        .maybeSingle();

      if (data && (data as any).score >= 9) {
        setForgedWeapon({ text: (data as any).weapon_text, score: (data as any).score });
        setHistory(((data as any).sharpening_history as unknown as SharpeningEntry[]) || []);
        setForged(true);
      } else if (data) {
        setDraft((data as any).weapon_text);
        setHistory(((data as any).sharpening_history as unknown as SharpeningEntry[]) || []);
      }
      setChecking(false);
    })();
  }, [user, avatarId, dayNumber]);

  const handleSubmit = async () => {
    if (!draft.trim() || !user) return;
    setLoading(true);
    setEvaluation(null);

    try {
      const systemPrompt = `You are Jeeves, the master evaluator of the Phototheology War College. You evaluate forged weapons — original apologetic arguments crafted by students after studying a manuscript.

Score the weapon on a scale of 1-10 based on:
1. Biblical accuracy — is it scripturally sound?
2. Logical coherence — does the argument flow clearly?
3. Understanding of manuscript argument — does it reflect the manuscript's core teaching?
4. Original articulation — is this the student's own phrasing, not a copy?
5. Practical applicability — could this be used in real conversation?

A score of 9 or 10 means the weapon is battle-ready.
A score below 9 means the student needs to sharpen further.

Return ONLY valid JSON — no markdown, no code blocks:
{
  "score": <number 1-10>,
  "feedback": "<2-3 sentence overall assessment>",
  "strengths": "<what the student did well>",
  "improvement": "<specific suggestion to reach a 9 or 10>"
}`;

      const userPrompt = `Evaluate this forged weapon from a War College student.

Track: ${track}
Day ${dayNumber}: ${title}
Apologist: ${avatarName}

FORGE EXERCISE PROMPT:
${forgeExercise}

MANUSCRIPT CONTEXT (first 4000 chars):
${manuscript.substring(0, 4000)}

STUDENT'S WEAPON:
${draft}`;

      const { data, error } = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        },
      });

      if (error) throw error;

      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("No content returned");

      let parsed;
      try {
        const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
        parsed = JSON.parse(jsonStr);
      } catch {
        parsed = JSON.parse(content);
      }

      const entry: SharpeningEntry = {
        draft,
        score: parsed.score,
        feedback: parsed.feedback,
        strengths: parsed.strengths,
        improvement: parsed.improvement,
      };

      const newHistory = [...history, entry];
      setHistory(newHistory);
      setEvaluation(parsed);

      // If score >= 9, save to DB
      if (parsed.score >= 9) {
        await (supabase as any).from("war_college_weapons").upsert({
          user_id: user.id,
          avatar_id: avatarId,
          day_number: dayNumber,
          weapon_text: draft,
          score: parsed.score,
          sharpening_history: newHistory as any,
        }, { onConflict: "user_id,avatar_id,day_number" });
        setForgedWeapon({ text: draft, score: parsed.score });
        setForged(true);
      } else {
        // Save progress even if not yet forged
        await (supabase as any).from("war_college_weapons").upsert({
          user_id: user.id,
          avatar_id: avatarId,
          day_number: dayNumber,
          weapon_text: draft,
          score: parsed.score,
          sharpening_history: newHistory as any,
        }, { onConflict: "user_id,avatar_id,day_number" });
      }
    } catch (err) {
      console.error("Weapon evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
        <CardContent className="p-5 text-center">
          <Loader2 className="h-6 w-6 animate-spin text-amber-400 mx-auto" />
        </CardContent>
      </Card>
    );
  }

  // ─── Forged state ───
  if (forged && forgedWeapon) {
    return (
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-900/5">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-amber-400">
              <Flame className="h-4 w-4" /> Weapon Forged
            </h3>
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
              <Swords className="h-3 w-3 mr-1" /> Score: {forgedWeapon.score}/10
            </Badge>
          </div>
          <p className="text-sm leading-relaxed p-3 rounded-lg bg-amber-500/5 border border-amber-500/15">
            {forgedWeapon.text}
          </p>
          {history.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {history.length} sharpening attempt{history.length > 1 ? "s" : ""}
              </button>
              {showHistory && (
                <div className="mt-2 space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="text-xs p-2 rounded bg-muted/30 border border-border/30">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">Attempt {i + 1}</span>
                        <Badge variant="outline" className="text-[10px]">Score: {h.score}/10</Badge>
                      </div>
                      <p className="text-muted-foreground">{h.feedback}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ─── Active forge ───
  return (
    <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
      <CardContent className="p-5 space-y-3">
        <h3 className="font-bold flex items-center gap-2 text-amber-400">
          <Flame className="h-4 w-4" /> Forge a Weapon
        </h3>
        <p className="text-sm">{forgeExercise}</p>

        <Textarea
          placeholder="Write your forged weapon here — craft an original apologetic argument..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          className="bg-background/50"
          disabled={loading}
        />

        {/* Evaluation feedback */}
        {evaluation && (
          <div className={`p-3 rounded-lg text-sm space-y-2 ${
            evaluation.score >= 9
              ? "bg-green-500/10 border border-green-500/20"
              : "bg-amber-500/10 border border-amber-500/20"
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {evaluation.score >= 9 ? (
                  <span className="flex items-center gap-1 text-green-400">
                    <CheckCircle2 className="h-4 w-4" /> Weapon Forged!
                  </span>
                ) : (
                  <span className="text-amber-400">Needs Sharpening</span>
                )}
              </span>
              <Badge variant="outline" className="text-xs">
                Score: {evaluation.score}/10
              </Badge>
            </div>
            <p className="text-muted-foreground">{evaluation.feedback}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded bg-green-500/5 border border-green-500/10">
                <p className="font-medium text-green-400 mb-0.5">Strengths</p>
                <p className="text-muted-foreground">{evaluation.strengths}</p>
              </div>
              {evaluation.score < 9 && (
                <div className="p-2 rounded bg-amber-500/5 border border-amber-500/10">
                  <p className="font-medium text-amber-400 mb-0.5">To Improve</p>
                  <p className="text-muted-foreground">{evaluation.improvement}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sharpening history */}
        {history.length > 0 && !forged && (
          <div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {history.length} previous attempt{history.length > 1 ? "s" : ""}
            </button>
            {showHistory && (
              <div className="mt-2 space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="text-xs p-2 rounded bg-muted/30 border border-border/30">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">Attempt {i + 1}</span>
                      <Badge variant="outline" className="text-[10px]">Score: {h.score}/10</Badge>
                    </div>
                    <p className="text-muted-foreground">{h.feedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={loading || !draft.trim()}
            className="gap-2 bg-gradient-to-r from-amber-600 to-amber-500"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Evaluating...</>
            ) : evaluation && evaluation.score < 9 ? (
              <><RotateCcw className="h-4 w-4" /> Resubmit for Evaluation</>
            ) : (
              <><Swords className="h-4 w-4" /> Submit for Evaluation</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
