/**
 * useWatchPlayer - Orchestrates Night/Morning Watch playback
 *
 * Flow: User taps "Begin Watch" →
 *   1. callJeeves generates meditation script
 *   2. Script passed as generateAudio callback (Supabase TTS)
 *   3. ImmersiveAudioPlayer opens fullscreen
 *   4. On close, onComplete fires to mark day as done
 */
import { useState, useCallback, useRef } from "react";
import { useImmersiveMode, ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { callJeeves } from "@/lib/jeevesClient";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { WatchSession, MorningWatchSession } from "@/data/watchSeries";

function buildNightPrompt(session: WatchSession, tractName: string): string {
  return `Generate a Night Watch meditation script to be read aloud as audio.
Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

Structure the script in 5 phases (no time stamps, no duration labels — just flow naturally):
1. ENTRY — Set the emotional tone with gentle breathing guidance. Settle the listener.
2. SCENE IMMERSION — Present tense, sensory-rich narration of the biblical scene. Paint the setting vividly.
3. MASTER MIND MOMENT — Observe what Christ does. Recognize the pattern. Receive the transformation.
4. HEALING — Address the struggle of ${session.struggle} directly and specifically with compassion.
5. REST — Identity reinforcement, fading to peace.

CRITICAL RULES:
- Write in complete, flowing sentences. Not fragments or bullet-style phrases. Each thought should be a full sentence that reads naturally when spoken aloud.
- Include [pause] markers generously between sentences and sections — these create silence in the audio. Use [pause] after every 1-2 sentences minimum.
- Do NOT include any time references like "for the next 7 minutes" or "over the next few minutes." The listener should not be aware of time.
- Do NOT include stage directions, section headers, or meta-commentary. Only include words that should be spoken aloud.
- This is BIBLICAL meditation — filling the mind with truth through Scripture, not emptying it.
- The Master Mind = the mind of Christ (Philippians 2:5).
- Be cinematic, intimate, and immersive. Second person ("you") throughout.`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a Morning Watch activation script to be read aloud as audio.
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

Structure the script in 5 phases (no time stamps, no duration labels — just flow naturally):
1. REMEMBER — Brief recall of last night's Master Mind insight.
2. TRUTH DECLARATION — Core Scripture spoken with weight, followed by an identity statement.
3. MENTAL ALIGNMENT — Translate the pattern into today's thinking.
4. REAL-LIFE SCENARIOS — 3 distinct scenarios: situation, old reaction, then the Master Mind response.
5. COMMITMENT — Brief, resolute, memorable.

CRITICAL RULES:
- Write in complete, flowing sentences. Not fragments or bullet-style phrases. Each thought should be a full sentence that reads naturally when spoken aloud.
- Include [pause] markers generously between sentences and sections — these create silence in the audio. Use [pause] after every 1-2 sentences minimum.
- Do NOT include any time references like "for the next 5 minutes" or "over the next few minutes." The listener should not be aware of time.
- Do NOT include stage directions, section headers, or meta-commentary. Only include words that should be spoken aloud.
- Night Watch: "See how Christ thinks — and receive it." Morning Watch: "Now think like Christ — and walk in it."
- The Master Mind = the mind of Christ (Philippians 2:5).
- Tone should be CLEAR and DIRECT, not dreamy. Energy: ${session.energy}.
- Use "you" throughout. Second person. End with resolve, not a question.`;
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

interface UseWatchPlayerOptions {
  onComplete?: (tractId: string, dayNumber: number) => void;
}

export function useWatchPlayer(options?: UseWatchPlayerOptions) {
  const immersive = useImmersiveMode();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const activeRef = useRef<{ tractId: string; day: number } | null>(null);

  const handleClose = useCallback(() => {
    immersive.closeImmersive();
    if (activeRef.current && options?.onComplete) {
      options.onComplete(activeRef.current.tractId, activeRef.current.day);
    }
    activeRef.current = null;
  }, [immersive, options]);

  const startNightWatch = useCallback(
    async (session: WatchSession, tractName: string, tractId?: string) => {
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

        if (tractId) {
          activeRef.current = { tractId, day: session.dayNumber };
        }
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
    async (session: MorningWatchSession, tractName: string, tractId?: string) => {
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

        if (tractId) {
          activeRef.current = { tractId, day: session.dayNumber };
        }
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
    handleClose,
  };
}
