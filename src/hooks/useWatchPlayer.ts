/**
 * useWatchPlayer - Orchestrates Night/Morning Watch playback
 *
 * Flow: User taps "Begin Watch" →
 *   1. callJeeves generates meditation script
 *   2. Script passed as generateAudio callback (Supabase TTS)
 *   3. ImmersiveAudioPlayer opens fullscreen
 */
import { useState, useCallback } from "react";
import { useImmersiveMode, ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { callJeeves } from "@/lib/jeevesClient";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { WatchSession, MorningWatchSession } from "@/data/watchSeries";

function buildNightPrompt(session: WatchSession, tractName: string): string {
  return `Generate a Night Watch meditation session.
Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

Structure this as a 15-minute immersive meditation with 5 phases:
1. ENTRY (2-3 min) - Set the emotional tone, breathing guidance
2. SCENE IMMERSION (6-7 min) - Present tense, sensory-rich narration of the biblical scene
3. MASTER MIND MOMENT (5-6 min) - Observe what Christ does, Recognize the pattern, Receive the transformation
4. HEALING (3-4 min) - Address the primary struggle (${session.struggle}) directly and specifically
5. REST (1-2 min) - Identity reinforcement, fading to peace

This is BIBLICAL meditation - filling the mind with truth through Scripture, not emptying it.
The Master Mind = the mind of Christ (Philippians 2:5).
Use short sentences (3-10 words). Include [pause] markers. Be cinematic and immersive.`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a Morning Watch activation session.
Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Paired Night Watch: "${session.pairedNightTitle}"
Night Insight: ${session.nightInsight}
Night Scripture: ${session.nightScripture}
Morning Scripture: ${session.morningScripture}
Activation Principle: ${session.activationPrinciple}
Energy: ${session.energy}
Commitment Style: ${session.commitmentStyle}
Scenario Types: ${session.scenarioTypes.join(", ")}

Structure this as a 5-8 minute activation session with 5 phases:
1. REMEMBER (1-2 min) - Brief recall of last night's Master Mind insight
2. TRUTH DECLARATION (1-1.5 min) - Core Scripture spoken with weight, identity statement
3. MENTAL ALIGNMENT (1.5-2 min) - Translate the pattern into today's thinking
4. REAL-LIFE SCENARIOS (2-3 min) - 3 distinct scenarios: situation → old reaction → Master Mind response
5. COMMITMENT (30s-1 min) - Brief, resolute, memorable

Night Watch: "See how Christ thinks — and receive it"
Morning Watch: "Now think like Christ — and walk in it"
The Master Mind = the mind of Christ (Philippians 2:5).
Tone should be CLEAR and DIRECT, not dreamy. Energy: ${session.energy}.
Use "you" throughout. Second person. End with resolve, not a question.`;
}

async function generateTTSUrl(script: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: {
        text: script.trim(),
        voice: "onyx",
        provider: "openai",
        speed: 0.9,
        useCache: true,
      },
    });
    if (error) throw error;
    if (data?.audioUrl) return data.audioUrl;
    if (data?.audioContent) {
      const blob = new Blob(
        [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
        { type: "audio/mpeg" },
      );
      return URL.createObjectURL(blob);
    }
    return null;
  } catch (err) {
    console.error("[WatchPlayer] TTS error:", err);
    return null;
  }
}

export function useWatchPlayer() {
  const immersive = useImmersiveMode();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const startNightWatch = useCallback(
    async (session: WatchSession, tractName: string) => {
      setIsGenerating(true);
      try {
        const prompt = buildNightPrompt(session, tractName);
        const { data, error } = await callJeeves(
          { mode: "night-watch", message: prompt },
          "night-watches",
        );
        if (error) throw new Error(String(error));

        const d = data as Record<string, unknown> | string | null;
        const script =
          typeof d === "string"
            ? d
            : d
              ? String((d as any).response || (d as any).result || JSON.stringify(d))
              : "";

        if (!script) throw new Error("Empty script returned");

        const track: ImmersiveTrack = {
          id: `night-${session.dayNumber}-${Date.now()}`,
          title: session.title,
          subtitle: `${tractName} — Day ${session.dayNumber} · ${session.scripture}`,
          type: "devotional",
          icon: "🌙",
          modeName: "Night Watch",
          generateAudio: () => generateTTSUrl(script),
        };

        immersive.openImmersive([track]);
      } catch (err) {
        console.error("[WatchPlayer] Night Watch error:", err);
        toast({
          title: "Generation failed",
          description: "Could not generate the Night Watch session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [immersive, toast],
  );

  const startMorningWatch = useCallback(
    async (session: MorningWatchSession, tractName: string) => {
      setIsGenerating(true);
      try {
        const prompt = buildMorningPrompt(session, tractName);
        const { data, error } = await callJeeves(
          { mode: "morning-watch", message: prompt },
          "morning-watches",
        );
        if (error) throw new Error(String(error));

        const d = data as Record<string, unknown> | string | null;
        const script =
          typeof d === "string"
            ? d
            : d
              ? String((d as any).response || (d as any).result || JSON.stringify(d))
              : "";

        if (!script) throw new Error("Empty script returned");

        const track: ImmersiveTrack = {
          id: `morning-${session.dayNumber}-${Date.now()}`,
          title: session.title,
          subtitle: `${tractName} — Day ${session.dayNumber} · ${session.morningScripture}`,
          type: "devotional",
          icon: "🌅",
          modeName: "Morning Watch",
          generateAudio: () => generateTTSUrl(script),
        };

        immersive.openImmersive([track]);
      } catch (err) {
        console.error("[WatchPlayer] Morning Watch error:", err);
        toast({
          title: "Generation failed",
          description: "Could not generate the Morning Watch session. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [immersive, toast],
  );

  return {
    startNightWatch,
    startMorningWatch,
    isGenerating,
    immersive,
  };
}
