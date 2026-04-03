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

PHASE 1 — SETTLING AND FRAMING (first ~2 minutes of audio):
Begin with a warm welcome. Invite the listener to get comfortable and take a moment to simply be still. Do NOT make deep breathing the centerpiece — you may mention one calming breath briefly, but do not dwell on breathing technique as if it has mystical power. Instead, quickly move into framing the purpose of this session:

Explain that this is a Night Watch — a practice of beholding the thoughts and feelings of Christ. Biblical meditation is not about emptying the mind or breathing exercises. It is about filling the mind with the thoughts of Jesus. The goal tonight is to step into a scene from Scripture, observe how Christ thinks and feels, and begin to take those thoughts and feelings as your own. This is what Paul meant when he said "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). Tonight, you are accessing the Master Mind — the thoughts and feelings of Christ — and making them your own. [pause]

Then briefly introduce tonight's specific theme and Scripture (${session.scripture}), connecting it to ${session.struggle}. This should feel like a wise friend explaining what you're about to experience together.

PHASE 2 — TEACHING (next ~2 minutes):
Go deeper into the Scripture and tonight's theme. This is conversational and warm — the "why" behind tonight's meditation. Weave in the Scripture naturally, not as a citation but as living words. Connect it to the human experience of ${session.struggle}. This should feel like insight by firelight.

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
- This is BIBLICAL meditation — beholding the thoughts and feelings of Christ and making them your own. NOT emptying the mind, NOT breathing exercises, NOT Eastern mysticism. The power is in what you behold, not how you breathe.
- The Master Mind = the mind of Christ (Philippians 2:5). The goal is to ACCESS His thoughts and feelings and take them as your own.
- Do NOT spend more than one sentence on breathing. Get to the Scripture and Christ quickly.
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

PHASE 1 — AWAKENING AND FRAMING (~2 minutes of audio):
Begin with a warm good morning. Invite the listener to sit up, plant their feet, and gather themselves. You may mention one centering breath, but do NOT dwell on breathing technique — move quickly into the purpose.

Explain that this is a Morning Watch — the activation half of the Master Mind practice. Last night you beheld the thoughts and feelings of Christ. You watched how He thinks, how He responds, what He feels. This morning, the goal is to TAKE those thoughts and feelings as your own and carry them into your day. This is biblical meditation — not emptying the mind, but filling it with the mind of Christ. "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5). Today you are not just remembering what Christ thought — you are thinking WITH Him. [pause]

PHASE 2 — REMEMBER LAST NIGHT (~2 minutes):
Recall last night's Master Mind insight from "${session.pairedNightTitle}". Briefly revisit the scene, the core truth, what was received. "Last night you beheld the thoughts and feelings of Christ. You saw ${session.nightInsight}." This is warm, brief, connective — like picking up a thread. Weave in the night scripture (${session.nightScripture}) naturally. The listener should feel continuity between night and morning.

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
- Night Watch: "Behold the thoughts and feelings of Christ — and receive them." Morning Watch: "Now take those thoughts as your own — and walk in them."
- The Master Mind = the mind of Christ (Philippians 2:5). The goal is to ACCESS His thoughts and feelings and make them your own.
- Do NOT spend more than one sentence on breathing. The power is in beholding Christ, not in breath work.
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
