/**
 * useWatchPlayer - Orchestrates Night/Morning Watch playback
 *
 * Flow: User taps "Begin Watch" →
 *   1. callJeeves generates meditation script
 *   2. Script passed to watch-tts edge function (ElevenLabs, calming female voice)
 *   3. ImmersiveAudioPlayer opens fullscreen with ambient music
 *   4. On close, onComplete fires to mark day as done
 */
import { useState, useCallback, useRef } from "react";
import { useImmersiveMode, ImmersiveTrack } from "@/hooks/useImmersiveMode";
import { callJeeves } from "@/lib/jeevesClient";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { WatchSession, MorningWatchSession } from "@/data/watchSeries";


type WatchKind = "night" | "morning";

function sanitizeWatchScript(script: string, watchType: WatchKind): string {
  let cleaned = script
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\[?\s*music\s*break\s*\]?/gi, "[long pause]\n\n[long pause]")
    .replace(/\[?\s*music\s*\]?/gi, "[long pause]")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/[–—]/g, ", ")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (watchType === "morning") {
    cleaned = cleaned
      .replace(/\blast night's\b/gi, "this morning's")
      .replace(/\blast night\b/gi, "this morning")
      .replace(/\bprevious session\b/gi, "this time")
      .replace(/\bearlier session\b/gi, "this time")
      .replace(/\bpaired session\b/gi, "this time");
  }

  return cleaned;
}

function buildNightPrompt(session: WatchSession, tractName: string): string {
  return `Write a standalone Night Watch script for spoken audio.

SESSION DETAILS:
Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

NON-NEGOTIABLE RULES:
- This watch must stand completely alone. Never mention a previous session or a future session.
- Never say "music break", "[music break]", or "[music]". Use only [pause] and [long pause].
- Stretch the full fifteen minutes with silence between sentences and paragraphs, not by naming silence.
- No breathing, posture, body awareness, mindfulness, or New Age language.
- Keep it Christ-centered, warm, weighty, intimate, and unhurried.
- Use second person.
- Use plain spoken English only. No markdown. No emojis. No abbreviations. No strange symbols. No invented words.
- Every word must sound natural when read aloud by TTS.
- Write Scripture references in full spoken form.

PACING:
- Aim for about twelve hundred to sixteen hundred words of voice.
- Use [pause] often between one to three sentences.
- Use [long pause] between major turns and at the end of paragraphs.

FLOW:
1. Open quietly and anchor the listener in tonight.
2. Enter the Scripture scene with vivid sensory detail.
3. Linger in Christ's thoughts, feelings, and chosen response.
4. Bring the listener's struggle into the scene without overly specific modern examples.
5. End with a quiet prayer, deep pauses, and a gentle seal.

Make it feel fresh, human, and emotionally real. Deliver only the script.`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Write a standalone Morning Watch script for spoken audio.

SESSION DETAILS:
Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Morning Scripture: ${session.morningScripture}
Activation Principle: ${session.activationPrinciple}
Energy: ${session.energy}
Commitment Style: ${session.commitmentStyle}
Scenario Types: ${session.scenarioTypes.join(", ")}

NON-NEGOTIABLE RULES:
- This watch must stand completely alone. Never mention last night, a previous session, a paired session, or a future night watch.
- Never say "music break", "[music break]", or "[music]". Use only [pause] and [long pause].
- Stretch the full fifteen minutes with silence between sentences and paragraphs, not by naming silence.
- No breathing, posture, body awareness, mindfulness, or New Age language.
- Keep it Christ-centered, warm, grounded, clear, and purposeful.
- Use second person.
- Use plain spoken English only. No markdown. No emojis. No abbreviations. No strange symbols. No invented words.
- Every word must sound natural when read aloud by TTS.
- Write Scripture references in full spoken form.

PACING:
- Aim for about twelve hundred to sixteen hundred words of voice.
- Use [pause] often between one to three sentences.
- Use [long pause] between major turns and at the end of paragraphs.

FLOW:
1. Open quietly and anchor the listener in this morning.
2. Enter the morning Scripture directly. If it is narrative, step into the scene. If it is not narrative, build a vivid image from the text itself.
3. Draw out Christ's character and the activation principle for today.
4. Bring the listener's daily struggle into the text without overly specific modern examples.
5. End with a quiet commitment, deep pauses, and a gentle seal.

Make it feel fresh, human, emotionally real, and fully independent. Deliver only the script.`;
}

export async function generateWatchTTS(script: string, watchType: "night" | "morning"): Promise<string | null> {
  const cleanedScript = sanitizeWatchScript(script, watchType);

  // Try ElevenLabs first
  try {
    console.log(`[WatchPlayer] Generating ${watchType} TTS via ElevenLabs (${cleanedScript.length} chars)...`);
    const { data, error } = await supabase.functions.invoke("watch-tts", {
      body: {
        text: cleanedScript.trim(),
        watchType,
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    if (data?.audioUrl) {
      console.log("[WatchPlayer] ElevenLabs TTS success:", data.audioUrl);
      return data.audioUrl;
    }
    if (data?.audioContent) {
      console.log("[WatchPlayer] ElevenLabs TTS success (base64)");
      return `data:audio/mpeg;base64,${data.audioContent}`;
    }
    console.warn("[WatchPlayer] ElevenLabs returned no audio data:", data);
    throw new Error("No audio data in ElevenLabs response");
  } catch (err) {
    console.error("[WatchPlayer] ElevenLabs TTS error:", err);
    console.log("[WatchPlayer] Falling back to OpenAI TTS...");
  }

  // Fallback to OpenAI
  return generateFallbackTTS(cleanedScript);
}

async function generateFallbackTTS(script: string): Promise<string | null> {
  try {
    console.log(`[WatchPlayer] OpenAI fallback TTS (${script.length} chars)...`);
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: {
        text: script.trim(),
        voice: "nova",
        provider: "openai",
        speed: 0.9,
        useCache: false,
      },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    if (data?.audioUrl) {
      console.log("[WatchPlayer] OpenAI fallback TTS success:", data.audioUrl);
      return data.audioUrl;
    }
    if (data?.audioContent) {
      console.log("[WatchPlayer] OpenAI fallback TTS success (base64)");
      return `data:audio/mpeg;base64,${data.audioContent}`;
    }
    console.warn("[WatchPlayer] OpenAI returned no audio data:", data);
    return null;
  } catch (err) {
    console.error("[WatchPlayer] Fallback TTS error:", err);
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

        const cleanedScript = sanitizeWatchScript(script, "night");
        if (!cleanedScript) throw new Error("Empty script returned");

        const track: ImmersiveTrack = {
          id: `night-${session.dayNumber}-${Date.now()}`,
          title: session.title,
          subtitle: `${tractName} — Day ${session.dayNumber} · ${session.scripture}`,
          type: "devotional",
          icon: "🌙",
          modeName: "Night Watch",
          generateAudio: () => generateWatchTTS(cleanedScript, "night"),
          ambientMode: "ambient-sounds",
          sessionDurationSec: 15 * 60, // 15-minute session
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

        const cleanedScript = sanitizeWatchScript(script, "morning");
        if (!cleanedScript) throw new Error("Empty script returned");

        const track: ImmersiveTrack = {
          id: `morning-${session.dayNumber}-${Date.now()}`,
          title: session.title,
          subtitle: `${tractName} — Day ${session.dayNumber} · ${session.morningScripture}`,
          type: "devotional",
          icon: "🌅",
          modeName: "Morning Watch",
          generateAudio: () => generateWatchTTS(cleanedScript, "morning"),
          ambientMode: "ambient-sounds",
          sessionDurationSec: 15 * 60, // 15-minute session
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
