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

function buildNightPrompt(session: WatchSession, tractName: string): string {
  return `Generate a Night Watch meditation script to be read aloud as audio. This is a SHORT, SPACIOUS script — only 700 to 1,000 words of actual spoken text. The voice portion should last only 5-7 minutes. The remaining 8-10 minutes of the 15-minute session is PURE MUSIC with NO voice. Less is more. Every word must carry weight.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

ABSOLUTELY NO BREATHING INSTRUCTIONS. ABSOLUTELY NO POSTURE GUIDANCE. NONE. ZERO.

THE STYLE: Write in SHORT, PUNCHY lines — often just 1 to 5 words per line. Use line breaks aggressively. Think of the sample below as your exact template for rhythm and pacing. The voice speaks a thought, then STOPS. Silence. Then another thought. Then STOPS. Long reflective gaps between ideas. This is NOT a lecture. This is NOT a sermon. This is cinematic, sparse, powerful.

SAMPLE RHYTHM (match this exact style):
"Lock in.
[pause]
Do not let anything else enter this space.
[pause]
This moment is not casual. It is not background noise.
This is sacred time. Guard it.
[long pause]
Your mind becomes a theater.
The screen is not in front of you.
The screen is within you.
[long pause]
Now step into the scene.
See it.
Not faintly. Not vaguely.
See it in full color.
[long pause]"

Follow this structure — keep it SPARSE and SHORT:

PHASE 1 — LOCK IN (~1 minute):
Command the listener to lock in. Guard this time. Push out distractions. Your mind is a movie theatre. The screen is within you. Tonight you are downloading the thoughts and feelings of Christ. You are accessing the Master Mind. [long pause] Briefly name the Scripture (${session.scripture}).

PHASE 2 — ENTER THE SCENE (~2 minutes):
"Step into the scene. See it. Full color." Vivid, sensory narration of the scene (${session.scene}) in SHORT punchy lines. What do you see? Hear? Present tense. Place the listener there. Use [long pause] after every 2-3 lines. Let images breathe. Do NOT rush. Do NOT over-describe. A few vivid details are better than many.

PHASE 3 — THE MIND OF CHRIST (~2 minutes):
"Now stop. What is He thinking?" Enter Christ's inner world. What thoughts? What feelings? The Master Mind insight: ${session.masterMindInsight}. Short, weighty lines. [long pause] between ideas. Then: "Do not just observe. Enter." Ask the Spirit to download these thoughts. "Download Your thoughts into my thoughts. Replace my reactions with Yours." Address ${session.struggle} briefly. [long pause]

PHASE 4 — SEAL AND RELEASE (~1 minute):
"Stay in this moment. Let it imprint." [long pause] "Say it: I receive the mind of Christ." [long pause] "The screen never turns off. What you behold, you become." Then: "The voice will end now. Take the rest of this time to sit with what you received. Let the music hold the space." Soft close.

CRITICAL RULES:
- ONLY 700-1,000 WORDS OF SPOKEN TEXT. Do NOT exceed this. The session is 15 minutes but the voice is only 5-7 minutes. The rest is music.
- NO BREATHING. NO POSTURE. NONE.
- Write in SHORT lines. 1-5 words per line is ideal. Use line breaks constantly.
- Use [pause] (3-5 seconds) VERY frequently — after almost every thought.
- Use [long pause] (10-20 seconds) between major ideas and throughout phases 3-4. At least 8-10 [long pause] markers in the script.
- The script should feel SPACIOUS. More silence than words. The voice drops a thought, then silence. Another thought, then silence.
- No section headers, stage directions, labels, or meta-commentary.
- Second person ("you"). Intimate. Cinematic. Authoritative. Sparse.
- TTS formatting: write scripture refs in spoken form ("Philippians chapter two, verse five" not "Philippians 2:5").`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a Morning Watch activation script to be read aloud as audio. This is a SHORT, SPACIOUS script — only 700 to 1,000 words of actual spoken text. The voice portion should last only 5-7 minutes. The remaining 8-10 minutes of the 15-minute session is PURE MUSIC with NO voice. Less is more. Every word must carry weight.

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

ABSOLUTELY NO BREATHING INSTRUCTIONS. ABSOLUTELY NO POSTURE GUIDANCE. NONE. ZERO.

THE STYLE: Write in SHORT, PUNCHY lines — often just 1 to 5 words per line. Use line breaks aggressively. Think of the sample below as your exact template for rhythm and pacing. The voice speaks a thought, then STOPS. Silence. Then another thought. Then STOPS. Long reflective gaps between ideas. This is NOT a lecture. This is NOT a sermon. This is cinematic, sparse, powerful.

SAMPLE RHYTHM (match this exact style):
"Lock in.
[pause]
This is not casual.
This is not a morning routine you sleepwalk through.
[pause]
This is the moment your mind gets armed.
[long pause]
Last night, you downloaded something.
The thoughts and feelings of Christ.
They are still in you.
[long pause]
This morning, you install them.
You walk in them.
You think with His mind.
[long pause]"

Follow this structure — keep it SPARSE and SHORT:

PHASE 1 — LOCK IN (~1 minute):
"Lock in." Command the listener. This is not casual. Your mind is a theatre. You choose what plays on that screen. Last night you downloaded the thoughts and feelings of Christ. This morning you install them. You think WITH Him. Briefly reference Philippians 2:5 in spoken form. [long pause]

PHASE 2 — RECALL THE DOWNLOAD (~1 minute):
Brief vivid flash of last night's scene: "${session.pairedNightTitle}". NOT a full retelling — just a spark. "Last night you stepped into the scene. You saw ${session.nightInsight}." Weave in ${session.nightScripture} naturally. "That download is still active. This morning, we activate it." [long pause]

PHASE 3 — TRUTH DECLARATION (~1 minute):
This morning's Scripture: ${session.morningScripture}. Speak it with weight. Unpack it into an identity statement in 2-3 SHORT lines. The activation principle: ${session.activationPrinciple}. Repeat the key phrase once with [long pause] after. "This is who you are now." [long pause]

PHASE 4 — ACTIVATE (~1.5 minutes):
One vivid scenario from: ${session.scenarioTypes.join(", ")}. Paint it in full color — SHORT lines. Name the old reaction in one line. Then overlay Christ's mind — what the Master Mind response looks like. "This is the download in action." [long pause] Then a second brief scenario, even shorter. [long pause]

PHASE 5 — COMMISSION AND RELEASE (~1 minute):
${session.commitmentStyle} style. "Today, you walk differently." [pause] "When pressure comes — you already have His response loaded." [long pause] "The voice will end now. Take the rest of this time in silence. Ask the Spirit to seal what was downloaded. Let the music hold the space." Soft but resolute close.

CRITICAL RULES:
- ONLY 700-1,000 WORDS OF SPOKEN TEXT. Do NOT exceed this. The session is 15 minutes but the voice is only 5-7 minutes. The rest is music.
- NO BREATHING. NO POSTURE. NONE.
- Write in SHORT lines. 1-5 words per line is ideal. Use line breaks constantly.
- Use [pause] (3-5 seconds) VERY frequently — after almost every thought.
- Use [long pause] (10-20 seconds) between major ideas and between phases. At least 8-10 [long pause] markers in the script.
- The script should feel SPACIOUS. More silence than words. The voice drops a thought, then silence. Another thought, then silence.
- No section headers, stage directions, labels, or meta-commentary.
- Morning Watch tone is CLEAR, WARM, and DIRECTED. Energy level: ${session.energy}. Think trusted coach at sunrise, not sleep guide.
- The Master Mind = the mind of Christ (Philippians 2:5). The metaphor is DOWNLOADING thoughts and feelings. The mind is a THEATRE. Godly imagination in VIVID COLOR.
- Second person ("you"). Intimate. Cinematic. Authoritative. Sparse.
- TTS formatting: write scripture refs in spoken form ("Philippians chapter two, verse five" not "Philippians 2:5").`;
}

async function generateWatchTTS(script: string, watchType: "night" | "morning"): Promise<string | null> {
  // Try ElevenLabs first
  try {
    console.log(`[WatchPlayer] Generating ${watchType} TTS via ElevenLabs (${script.length} chars)...`);
    const { data, error } = await supabase.functions.invoke("watch-tts", {
      body: {
        text: script.trim(),
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
  return generateFallbackTTS(script);
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

        if (!script) throw new Error("Empty script returned");

        const track: ImmersiveTrack = {
          id: `night-${session.dayNumber}-${Date.now()}`,
          title: session.title,
          subtitle: `${tractName} — Day ${session.dayNumber} · ${session.scripture}`,
          type: "devotional",
          icon: "🌙",
          modeName: "Night Watch",
          generateAudio: () => generateWatchTTS(script, "night"),
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

        if (!script) throw new Error("Empty script returned");

        const track: ImmersiveTrack = {
          id: `morning-${session.dayNumber}-${Date.now()}`,
          title: session.title,
          subtitle: `${tractName} — Day ${session.dayNumber} · ${session.morningScripture}`,
          type: "devotional",
          icon: "🌅",
          modeName: "Morning Watch",
          generateAudio: () => generateWatchTTS(script, "morning"),
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
