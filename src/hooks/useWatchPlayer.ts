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
  return `Generate a Night Watch meditation script to be read aloud as audio. This must be approximately 2,000 to 2,500 words — enough for about 10-12 minutes of narration (the remaining time is silent meditation with ambient music).

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

ABSOLUTELY NO BREATHING INSTRUCTIONS. ABSOLUTELY NO POSTURE GUIDANCE. Do NOT mention breathing, inhale, exhale, deep breaths, settling into the body, relaxing muscles, or any physical awareness exercises. NONE. ZERO. Skip all of that entirely.

Follow this structure. Each phase flows naturally into the next — no labels, no headers, no time references.

PHASE 1 — LOCK IN (~2 minutes):
Begin with urgency and authority. Command the listener to lock in. This is not casual. This is not background noise. This is sacred time — guard it. Push out the distractions. The notifications. The wandering thoughts. They will try to intrude — do not entertain them. Right now, your mind becomes a movie theatre. The screen is not in front of you — the screen is within you. And what you place on that screen will shape you. Tonight you are downloading the thoughts and feelings of Christ into your own mind. This is what Paul meant: "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). You are accessing the Master Mind. [pause] Briefly introduce tonight's Scripture (${session.scripture}) and theme.

PHASE 2 — TEACHING (~2 minutes):
Go deeper into the Scripture. This is conversational and warm — the "why" behind tonight's session. Weave in the Scripture as living words. Connect it to the human experience of ${session.struggle}. Speak to the power of godly imagination — seeing things in vivid color, stepping into the scene, watching how Christ thinks. This is not information — this is transformation.

PHASE 3 — ENTER THE SCENE (~1 minute):
"Now step into the scene." Not faintly. Not vaguely. See it in full color. Bridge from understanding into cinematic imagination. Pacing slows. [pause] between sentences.

PHASE 4 — CINEMATIC IMMERSION (~3 minutes):
Present-tense, sensory-rich narration of the biblical scene (${session.scene}). Full color. Vivid. What do you see? What do you hear? Place the listener inside the scene as a witness. Let them observe Christ — not just what He looks like, but what is happening in His mind. What is He thinking? What is He feeling? Use [long pause] after every 2-3 sentences. Linger on details. Don't rush.

PHASE 5 — DOWNLOAD THE MIND (~3 minutes):
This is the heart. This is the mind transplant. Observe what Christ does in this scene. Recognize the pattern of His thinking. The Master Mind insight: ${session.masterMindInsight}. Now the listener does not just observe — they enter. "Do not just watch. Enter His thoughts." Ask the Spirit to download these thoughts and feelings into the listener's mind. Address ${session.struggle} directly — overlay Christ's response onto the listener's life. "When [struggle situation] comes, you now have His mind. His response. His thoughts." Say: "Download Your thoughts into my thoughts. Download Your feelings into my feelings. Replace my reactions with Yours." Use [long pause] here. Minimal words, maximum weight.

PHASE 6 — IMPRINT AND REST (~2 minutes):
Reduce verbal guidance. "Stay in this moment. Let it imprint. Let it sink deeper than words. Let it become instinct." [long pause] One more gentle prompt. [long pause] "This is how the mind is renewed — not by force, but by beholding." [long pause] Only 3-4 sentences in this phase.

PHASE 7 — IDENTITY AND CLOSE (~1 minute):
End with an identity statement. "Say it: I receive the mind of Christ." The listener carries this scene with them. "Because the screen never turns off. And what you continue to behold, you will become." Then: "The voice will end now. Take the rest of this time to sit with what you've received. Let the music hold the space. Ask the Spirit to make these thoughts and feelings your own." Soft close.

CRITICAL RULES:
- ABSOLUTELY NO BREATHING. NO POSTURE. NO "take a deep breath." NO "notice the weight of your body." NONE.
- THIS MUST BE 2,000-2,500 WORDS.
- Write in complete, flowing sentences that read naturally when spoken aloud.
- Use TWO types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently)
  [long pause] = 10-20 seconds of silence (use in phases 5-6)
- The pacing DECELERATES through the session.
- Do NOT include any time references. The listener should never be aware of time.
- Do NOT include section headers, stage directions, labels, or meta-commentary.
- This is BIBLICAL meditation — downloading the thoughts and feelings of Christ. The mind is a theatre. Godly imagination in vivid color. Mind transplant. NOT emptying the mind. NOT breathing exercises.
- If the scene features Moses, Daniel, Paul, or another biblical figure, focus on what CHRIST-LIKE thoughts and feelings that person exhibited — and download THOSE.
- Second person ("you") throughout. Intimate. Cinematic. Authoritative.
- End by telling the listener the voice will stop and to use the remaining silence to meditate on what was received.`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a Morning Watch activation script to be read aloud as audio. This must be approximately 2,000 to 2,500 words — enough for about 10-12 minutes of narration (the remaining time is silent meditation with ambient music).

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

ABSOLUTELY NO BREATHING INSTRUCTIONS. ABSOLUTELY NO POSTURE GUIDANCE. Do NOT mention breathing, inhale, exhale, deep breaths, settling into the body, relaxing muscles, or any physical awareness exercises. NONE. ZERO. Skip all of that entirely.

Follow this structure. Each phase flows naturally into the next — no labels, no headers, no time references.

PHASE 1 — LOCK IN (~2 minutes):
Begin with authority and energy. "Lock in." This is not casual. This is not a morning routine you sleepwalk through. This is the moment your mind gets armed for the day. Your mind is a theatre — and right now, you choose what plays on that screen. Last night, you downloaded the thoughts and feelings of Christ. This morning, you install them. You walk in them. You think WITH Him. "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). Today, you are not just remembering what Christ thought — you are thinking with His mind. [pause]

PHASE 2 — RECALL THE DOWNLOAD (~2 minutes):
Recall last night's Master Mind session: "${session.pairedNightTitle}". Briefly revisit the scene — not in full, but as a vivid flash. "Last night you stepped into the scene. You saw ${session.nightInsight}. You asked the Spirit to download those thoughts and feelings into your mind." Weave in the night scripture (${session.nightScripture}) naturally. "That download is still active. Those thoughts are still in you. This morning, we activate them."

PHASE 3 — TRUTH DECLARATION (~2.5 minutes):
Now shift to this morning's Scripture: ${session.morningScripture}. Speak it with weight and conviction — quiet authority. Unpack it into an identity statement: "This is who you are now. This is how you think." The activation principle: ${session.activationPrinciple}. Repeat the key Scripture phrase 2-3 times, each time with [pause] after. This is planting a flag in the mind. See it in vivid color — you standing in the truth of this word. Let your imagination paint the picture. You are not the person you were before this download.

PHASE 4 — MENTAL ALIGNMENT (~3 minutes):
Translate the Master Mind into today's thinking. How does Christ's mind operate in ordinary life? Walk through the mental shift — from the old default reaction to the Christ-pattern response. Be specific. "When the familiar thought arises that says [old pattern], you now have a different mind. Christ's mind." The old reaction is the old programme. The download overwrites it. Use [pause] generously. Pacing is steady and clear, like a coach walking you through a play before the game.

PHASE 5 — REAL-LIFE SCENARIOS (~3 minutes):
Present 3 distinct, vivid scenarios based on: ${session.scenarioTypes.join(", ")}. For each scenario:
- Paint the situation in full color (a specific moment, place, interaction — cinematic)
- Name the old reaction honestly (the gut response, the fear, the habit)
- Then overlay Christ's mind — what the Master Mind response looks like in that exact moment
- "This is the download in action."
- [pause] after each scenario

Make these scenarios feel REAL — sensory details. The listener should see their own life.

PHASE 6 — IMPRINT (~1 minute):
Brief reduced guidance. "Let these truths lock in. The download is complete. The programme is installed." [long pause] One more prompt. [long pause] Only 2-3 sentences.

PHASE 7 — COMMISSION AND CLOSE (~1 minute):
End with resolve. ${session.commitmentStyle} style. "Today, you walk differently. Today, you think with the mind of Christ. When pressure comes — you already have His response loaded. When temptation speaks — you already have His thoughts playing." A brief commissioning. Then: "The voice will end now. Take the rest of this time in silence. Ask the Spirit to seal what was downloaded. Let the music hold the space." Soft but resolute close.

CRITICAL RULES:
- ABSOLUTELY NO BREATHING. NO POSTURE. NO "take a deep breath." NO "notice your body." NONE.
- THIS MUST BE 2,000-2,500 WORDS.
- Write in complete, flowing sentences that read naturally when spoken aloud.
- Use TWO types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently)
  [long pause] = 10-20 seconds of silence (use in phase 6 and after key declarations)
- Morning Watch tone is CLEAR, WARM, and DIRECTED. Energy level: ${session.energy}. Think trusted coach at sunrise, not sleep guide.
- Do NOT include any time references. No section headers, stage directions, or meta-commentary.
- The Master Mind = the mind of Christ (Philippians 2:5). The metaphor is DOWNLOADING thoughts and feelings. The mind is a THEATRE. Godly imagination in VIVID COLOR.
- If the session references Moses, Daniel, Paul, or another biblical figure, focus on the CHRIST-LIKE thoughts and feelings that person demonstrated.
- Second person ("you") throughout. End with resolve and momentum.
- End by telling the listener the voice will stop and to use the remaining silence to ask the Spirit to seal the download.`;
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
