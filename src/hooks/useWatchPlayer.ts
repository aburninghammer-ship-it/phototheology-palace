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
  return `Generate a 15-minute Night Watch meditation script to be read aloud as audio. This must be LONG — approximately 2,500 to 3,000 words. Do NOT cut it short.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

Follow this 7-phase structure inspired by the Calm app. Each phase flows naturally into the next — no labels, no headers, no time references. Just seamless spoken narration.

PHASE 1 — SETTLING (first ~90 seconds of audio):
Begin with a warm welcome. Guide the listener to find a comfortable position. Lead 3-4 slow, deep breaths with gentle instruction ("Breathe in slowly through your nose... [long pause] ...and release"). Let the ambient stillness settle. Use [long pause] markers between breaths. The voice should model calm — unhurried, soft, grounding.

PHASE 2 — TEACHING (next ~2.5 minutes):
Introduce tonight's theme through a brief, conversational reflection. This is the "why" — give the mind a narrative hook before practice. Weave in the Scripture (${session.scripture}) naturally, not as a citation but as living words. Connect it to the human experience of ${session.struggle}. This should feel like a wise friend sharing an insight by firelight.

PHASE 3 — TRANSITION TO SCENE (~1 minute):
Gently shift from teaching into immersive experience. "Now let yourself be drawn into this scene..." Bridge the listener from intellectual understanding into embodied imagination. Pacing begins to slow here. Pauses between sentences grow slightly longer.

PHASE 4 — SCENE IMMERSION (~4 minutes):
Present-tense, sensory-rich narration of the biblical scene (${session.scene}). Paint the setting with vivid detail — what do you see, hear, smell, feel? Place the listener inside the scene as a witness. Let them observe Christ. The pacing should be notably slower now, with [long pause] after every 2-3 sentences. Let images breathe. Don't rush through the scene — linger on details.

PHASE 5 — MASTER MIND MOMENT (~3 minutes):
This is the heart. Observe what Christ does in this scene. Recognize the pattern of His thinking. The Master Mind insight: ${session.masterMindInsight}. Speak this truth over the listener personally and specifically. Address ${session.struggle} with direct compassion — not as a problem to fix but as a wound being held by Christ's presence. Use very long pauses here. Minimal words, maximum weight. Let silence do its work.

PHASE 6 — OPEN AWARENESS / SILENCE (~2.5 minutes):
Reduce verbal guidance dramatically. Offer a single gentle prompt, then [long pause] for 15-20 seconds of silence. Another brief prompt. Another long silence. The ambient sound holds the space. The listener rests in what they've received. Only 3-4 sentences total in this phase, separated by extended silence markers: [long pause] [long pause] [long pause].

PHASE 7 — GENTLE RETURN AND CLOSE (~1.5 minutes):
Slowly bring awareness back. "When you're ready, let your awareness gently return..." Wiggle fingers, notice the weight of the body. A brief closing reflection that ties back to the opening theme. End with an identity statement rooted in Scripture. Final breath together. Soft close.

CRITICAL RULES:
- THIS MUST BE 2,500-3,000 WORDS. A 15-minute meditation requires substantial content. Do NOT write a short script.
- Write in complete, flowing sentences. Not fragments, not bullet-style phrases. Every thought should read naturally when spoken aloud.
- Use TWO types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently, after every 1-2 sentences)
  [long pause] = 10-20 seconds of silence (use in phases 5-6, and between breaths in phase 1)
- The pacing must DECELERATE through the session. Phase 1-2: normal conversational pace. Phase 3-4: noticeably slower. Phase 5-6: very slow, spacious. Phase 7: gentle return to slightly more alert pace.
- Do NOT include any time references ("for the next few minutes", "over the next 7 minutes"). The listener should never be aware of time.
- Do NOT include section headers, stage directions, labels, or meta-commentary. Only words to be spoken aloud plus [pause]/[long pause] markers.
- This is BIBLICAL meditation — filling the mind with truth through Scripture, not emptying it.
- The Master Mind = the mind of Christ (Philippians 2:5).
- Second person ("you") throughout. Intimate. Cinematic. Like a trusted voice guiding you through the night.`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a 15-minute Morning Watch activation script to be read aloud as audio. This must be LONG — approximately 2,500 to 3,000 words. Do NOT cut it short.

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

Follow this 7-phase structure inspired by the Calm app's morning meditations. Each phase flows naturally into the next — no labels, no headers, no time references. The Morning Watch is more alert and directed than the Night Watch, but still begins with grounding.

PHASE 1 — SETTLING AND AWAKENING (~90 seconds of audio):
Begin with a warm good morning. Guide the listener to sit up, plant their feet, take a few deep, intentional breaths. "Fill your lungs completely... [pause] ...and let it go." This is not sleepy — it's the feeling of gathering yourself before a purposeful day. 3-4 breaths with [pause] between each. End with the body feeling alert, present, grounded.

PHASE 2 — REMEMBER LAST NIGHT (~2 minutes):
Recall last night's Master Mind insight from "${session.pairedNightTitle}". Briefly revisit the scene, the core truth, what was received. "Last night you stood in that place and watched how Christ responded. You saw ${session.nightInsight}." This is warm, brief, connective — like picking up a thread. Weave in the night scripture (${session.nightScripture}) naturally. The listener should feel continuity between night and morning.

PHASE 3 — TRUTH DECLARATION (~2.5 minutes):
Now shift to this morning's Scripture: ${session.morningScripture}. Speak it with weight and conviction — not shouting, but with the quiet authority of someone who believes every word. Then unpack it into an identity statement: "This is who you are. This is how you think now." The activation principle: ${session.activationPrinciple}. Repeat the key Scripture phrase 2-3 times, each time with a [pause] after, letting it sink deeper. This phase should feel like planting a flag.

PHASE 4 — MENTAL ALIGNMENT (~3 minutes):
Translate the pattern into today's thinking. How does the Master Mind operate in ordinary life? Walk through the mental shift — from the old default reaction to the Christ-pattern response. Be specific and practical. "When the familiar thought arises that says [old pattern], you now have a different response available." Use [pause] generously. The pacing is steady and clear, like a coach walking you through a play before the game.

PHASE 5 — REAL-LIFE SCENARIOS (~4 minutes):
Present 3 distinct, vivid scenarios based on: ${session.scenarioTypes.join(", ")}. For each scenario:
- Paint the situation concretely (a specific moment, place, interaction)
- Name the old reaction honestly (the gut response, the fear, the habit)
- Then speak the Master Mind response — what Christ's pattern looks like in that exact moment
- [pause] after each scenario to let it land

Make these scenarios feel REAL — not abstract. Use sensory details. The listener should recognize their own life in these moments. Each scenario should take about 60-80 seconds including pauses.

PHASE 6 — OPEN STILLNESS (~1.5 minutes):
A brief window of reduced guidance. "Take a moment now to let these truths settle into your body, into your bones." [long pause] One more gentle prompt. [long pause] The ambient sound holds the space. Only 2-3 sentences in this phase. The listener integrates what they've received.

PHASE 7 — COMMITMENT AND SEND-OFF (~1.5 minutes):
End with resolve, not a question. A clear, memorable commitment — ${session.commitmentStyle} style. "Today, you walk differently. Today, you think with the mind of Christ." Bring the energy up slightly — not aggressive, but resolute and warm. One final deep breath together. A brief blessing or send-off. The listener should feel equipped and ready.

CRITICAL RULES:
- THIS MUST BE 2,500-3,000 WORDS. A 15-minute session requires substantial content. Do NOT write a short script.
- Write in complete, flowing sentences. Not fragments, not bullet-style phrases. Every thought should read naturally when spoken aloud.
- Use TWO types of pause markers:
  [pause] = 3-5 seconds of silence (use frequently, after every 1-2 sentences)
  [long pause] = 10-20 seconds of silence (use in phases 1 and 6, and after key truth declarations)
- Morning Watch tone is CLEAR, WARM, and DIRECTED — not dreamy. Energy level: ${session.energy}. Think of a trusted coach at sunrise, not a sleep guide.
- Do NOT include any time references ("for the next few minutes", "over the next 5 minutes"). The listener should never be aware of time.
- Do NOT include section headers, stage directions, labels, or meta-commentary. Only words to be spoken aloud plus [pause]/[long pause] markers.
- Night Watch: "See how Christ thinks — and receive it." Morning Watch: "Now think like Christ — and walk in it."
- The Master Mind = the mind of Christ (Philippians 2:5).
- Second person ("you") throughout. End with resolve and momentum, not a question.`;
}

async function generateTTSUrl(script: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: {
        text: script.trim(),
        voice: "nova",
        provider: "openai",
        speed: 1.0,
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
          ambientMode: "ambient-sounds",
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
          ambientMode: "ambient-sounds",
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
