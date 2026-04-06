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

CRITICAL PHILOSOPHY — READ THIS FIRST:
This meditation has ZERO to do with breathing, posture, or relaxation technique. Do NOT mention deep breathing. Do NOT mention posture. Do NOT mention "getting comfortable." Do NOT mention body scans or physical sensations of relaxation. This is NOT a Calm app session. This is CINEMATIC BIBLICAL MIND TRANSPLANT.

The core concept: The listener's mind is a movie theater. The screen is INSIDE them. What they place on that screen shapes who they become. Tonight, they are projecting a scene from Scripture onto that screen in VIVID, FULL COLOR — and stepping inside it. The goal is to observe the THOUGHTS AND FEELINGS of Christ (or the biblical figure), and then ASK THE HOLY SPIRIT TO DOWNLOAD those exact thoughts and feelings into their own mind. This is what Paul meant: "Let this mind be in you which was also in Christ Jesus" (Philippians 2:5).

Follow this 6-phase structure. Each phase flows seamlessly — no labels, no headers, no time references.

PHASE 1 — LOCK IN (~2 minutes):
Open with authority. Command the listener to LOCK IN. This is not casual. This is not background noise. This is sacred time — guard it. Tell them to push out distractions: notifications, wandering thoughts, the noise of the day. They will try to intrude — do not entertain them. Then establish the metaphor: "Right now, your mind becomes a theater. The screen is not in front of you — the screen is within you. And what you place on that screen will shape you." Explain the Master Mind concept: tonight you are stepping into a scene from Scripture to observe how Christ thinks and feels — and then you are going to ask the Spirit to download those thoughts and feelings directly into your mind. This is not information. This is transformation. [pause]

Briefly introduce tonight's Scripture (${session.scripture}) and theme, connecting it to ${session.struggle}. Frame it as: "Tonight, you are accessing the Master Mind."

PHASE 2 — ENTER THE SCENE (~4 minutes):
Command: "Step into the scene. See it. Not faintly. Not vaguely. See it in FULL COLOR."

Present-tense, hyper-vivid, cinematic narration of the biblical scene (${session.scene}). Paint with extreme sensory detail — the sky, the ground, the air, the sounds, the smells, the light. Place the listener INSIDE the scene as a witness standing right there. Use short, punchy sentences mixed with longer descriptive ones. Use [pause] after every 2-3 sentences. This should feel like a movie unfolding on the screen of the mind. Let images breathe — linger on details that matter.

PHASE 3 — OBSERVE THE MIND (~4 minutes):
This is the heart. Command: "Now stop. Do not rush past this moment. This is where the meditation begins."

Shift from what is SEEN to what is THOUGHT AND FELT. Ask: "What is He thinking?" Enter the inner world of Christ (or the biblical figure). What thoughts are running through His mind? What emotions are present? What choices is He making internally? Be specific and profound. Connect the Master Mind insight (${session.masterMindInsight}) here.

Show the CONTRAST between what a natural human mind would think/feel and what Christ's mind thinks/feels. The natural mind retaliates — His mind forgives. The natural mind panics — His mind trusts. The natural mind gives up — His mind perseveres.

Use [pause] and [long pause] generously. Minimal words, maximum weight. Let the listener sit in the weight of Christ's thoughts and feelings.

PHASE 4 — DOWNLOAD (~3 minutes):
Command: "Now… do not just observe. Enter. This is the purpose. This is the goal. Not information. Transformation."

Guide the listener to speak internally: "Lord, let me see what You see. Let me feel what You feel. Let me think what You think." Then the direct download request: "Download Your thoughts into my thoughts. Download Your feelings into my feelings. Replace my reactions with Yours."

Address ${session.struggle} directly — overlay the scene of Christ onto the listener's real life. "Someone wrongs you. Someone disrespects you. Someone wounds you. What rises up naturally? Now replace it. Overlay the scene onto your life. And choose His mind."

PHASE 5 — IMPRINT (~1.5 minutes):
Reduce words dramatically. Command the listener to HOLD the scene. Let it imprint. Let it sink deeper than words. Let it become instinct. [long pause] [long pause] [long pause] Only 3-4 sentences total in this phase, separated by extended silence.

PHASE 6 — SEAL AND CARRY (~1.5 minutes):
Bring back to present with authority, not gentleness. "Say it: 'I receive the mind of Christ.' And mean it." Final identity declaration rooted in tonight's Scripture. Then: "When you step out of this moment, carry the scene with you. Because the screen never turns off. And what you continue to behold… you will become."

CRITICAL RULES:
- THIS MUST BE 2,500-3,000 WORDS.
- ABSOLUTELY NO mention of breathing, deep breaths, posture, body position, getting comfortable, body scans, or physical relaxation. ZERO. NOT EVEN ONE SENTENCE.
- Do NOT say "take a deep breath." Do NOT say "notice your body." Do NOT say "settle in." Do NOT say "get comfortable."
- The ONLY physical metaphor is the MIND AS A MOVIE THEATER / SCREEN.
- Write in a mix of short punchy lines and flowing sentences. The style should feel cinematic — like a movie narrator mixed with a prophetic voice.
- Use [pause] (3-5 seconds) frequently and [long pause] (10-20 seconds) in phases 4-5.
- Do NOT include section headers, stage directions, labels, or meta-commentary.
- The power is in BEHOLDING, not breathing. The power is in what you SEE and THINK, not how you sit.
- Second person ("you") throughout. Intimate. Authoritative. Cinematic.
- The phrase "Download" is literal — the listener is asking the Spirit to literally transplant Christ's thoughts and feelings into their neural pathways.

TTS FORMATTING RULES (CRITICAL — this text will be read aloud by a text-to-speech engine):
- Write ALL scripture references in SPOKEN form: "John chapter one, verse one" NOT "John 1:1". "Genesis chapter three, verse fifteen" NOT "Genesis 3:15". "Philippians chapter two, verse five" NOT "Philippians 2:5".
- Write numbers as words when under 100: "twelve disciples" not "12 disciples". "forty days" not "40 days".
- Avoid colons, slashes, or abbreviations that TTS will mispronounce.
- Use full book names: "First Corinthians" not "1 Cor". "Second Samuel" not "2 Sam".
- Write "verses" ranges naturally: "verses one through three" not "1-3".`;
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

CRITICAL PHILOSOPHY — READ THIS FIRST:
This meditation has ZERO to do with breathing, posture, or relaxation technique. Do NOT mention deep breathing. Do NOT mention posture. Do NOT mention "getting comfortable." Do NOT mention body scans or physical awareness. This is NOT a wellness app session. This is CINEMATIC BIBLICAL MIND ACTIVATION.

The core concept: Last night the listener BEHELD the thoughts and feelings of Christ on the screen of their mind. This morning, those thoughts and feelings become THEIRS. The download completes. The mind transplant activates. They are not just remembering what Christ thought — they are THINKING WITH HIM today. The screen never turns off. Today, every situation they face gets overlaid with the Master Mind.

Follow this 6-phase structure. Each phase flows seamlessly — no labels, no headers, no time references.

PHASE 1 — LOCK IN AND ACTIVATE (~2 minutes):
Open with energy and authority. "Lock in. The screen is still on. The download from last night is not finished — it activates NOW." This is not a gentle wake-up. This is activation. The listener's mind is a theater, and this morning, the film continues — but now they are not just watching. They are BECOMING the character. They are taking on the Master Mind as their operating system for the day. [pause]

Establish: "This is biblical meditation — not emptying the mind, but FILLING it with the mind of Christ and CARRYING it into your day."

PHASE 2 — RECALL THE SCENE (~2 minutes):
Flash back to last night's Master Mind session: "${session.pairedNightTitle}". Briefly but vividly recall the scene — not retelling it, but triggering the memory. "Last night you stood there. You saw it. You felt it. ${session.nightInsight}." Reference the night scripture (${session.nightScripture}) naturally. The listener should feel the continuity — last night you received; this morning you deploy.

PHASE 3 — TRUTH DECLARATION (~2.5 minutes):
Now bring this morning's Scripture: ${session.morningScripture}. Speak it with weight and conviction. This is not reading — this is DECLARING. Unpack it as an identity upgrade: "This is who you are now. This is how you think now. This is how you respond now." The activation principle: ${session.activationPrinciple}. Repeat the key phrase 2-3 times with [pause] after each. This is planting a flag in the ground. The listener is not hoping to become this — they are CLAIMING it.

PHASE 4 — OVERLAY ONTO REAL LIFE (~4 minutes):
Present 3 vivid, specific, real-life scenarios based on: ${session.scenarioTypes.join(", ")}. For each scenario:
- Paint it cinematically — a specific moment, place, interaction with sensory detail
- Name the OLD reaction honestly — the gut response, the fear, the habit, the default
- Then OVERLAY the Master Mind: "But the screen is still on. And you see it differently now."
- Show what Christ's pattern looks like in THAT EXACT MOMENT — specific thoughts, specific feelings, specific words
- [pause] after each scenario

Make these feel REAL. The listener should recognize their own life. Each scenario should contrast the old mind vs. the downloaded mind.

PHASE 5 — LOCK THE DOWNLOAD (~2 minutes):
"The download is complete. The thoughts of Christ are now running in your system." Guide the listener to declare: "I carry the mind of Christ today. His thoughts are my thoughts. His feelings are my feelings. His reactions are my reactions." [long pause] Let it settle. [long pause] The screen stays on all day.

PHASE 6 — SEND-OFF WITH AUTHORITY (~1.5 minutes):
End with resolve, not a question. ${session.commitmentStyle} energy. "Today, you walk differently. Today, you think differently. Today, when the old mind tries to run its program — you override it. Because you have a new operating system. The Master Mind." Close with a one-line identity statement from the morning Scripture. Final send-off: "Now go. The screen is on. What you behold, you become."

CRITICAL RULES:
- THIS MUST BE 2,500-3,000 WORDS.
- ABSOLUTELY NO mention of breathing, deep breaths, posture, body position, getting comfortable, body scans, wiggling fingers, planting feet, or physical relaxation. ZERO. NOT EVEN ONE SENTENCE.
- Do NOT say "take a breath." Do NOT say "notice your body." Do NOT say "sit up." Do NOT say "ground yourself."
- The ONLY physical metaphor is the MIND AS A MOVIE THEATER / SCREEN / OPERATING SYSTEM.
- Morning Watch tone is CLEAR, BOLD, and ACTIVATED — like a coach before a championship game, not a yoga instructor. Energy level: ${session.energy}.
- Write in a mix of short punchy lines and flowing sentences. Cinematic and prophetic.
- Use [pause] (3-5 seconds) frequently and [long pause] (10-20 seconds) in phase 5.
- Do NOT include section headers, stage directions, labels, or meta-commentary.
- The power is in BEHOLDING and DEPLOYING, not breathing. The download becomes the operating system.
- Second person ("you") throughout. End with authority and momentum.

TTS FORMATTING RULES (CRITICAL — this text will be read aloud by a text-to-speech engine):
- Write ALL scripture references in SPOKEN form: "John chapter one, verse one" NOT "John 1:1". "Genesis chapter three, verse fifteen" NOT "Genesis 3:15". "Philippians chapter two, verse five" NOT "Philippians 2:5".
- Write numbers as words when under 100: "twelve disciples" not "12 disciples". "forty days" not "40 days".
- Avoid colons, slashes, or abbreviations that TTS will mispronounce.
- Use full book names: "First Corinthians" not "1 Cor". "Second Samuel" not "2 Sam".
- Write "verses" ranges naturally: "verses one through three" not "1-3".`;
}

async function generateWatchTTS(script: string, watchType: "night" | "morning"): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("watch-tts", {
      body: {
        text: script.trim(),
        watchType,
      },
    });
    if (error) throw error;
    if (data?.audioUrl) return data.audioUrl;
    if (data?.audioContent) {
      // base64 fallback
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      return audioUrl;
    }
    return null;
  } catch (err) {
    console.error("[WatchPlayer] ElevenLabs TTS error:", err);
    // Fallback to OpenAI TTS
    console.log("[WatchPlayer] Falling back to OpenAI TTS...");
    return generateFallbackTTS(script);
  }
}

async function generateFallbackTTS(script: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke("text-to-speech", {
      body: {
        text: script.trim(),
        voice: "nova",
        provider: "openai",
        speed: 0.9,
        useCache: true,
      },
    });
    if (error) throw error;
    if (data?.audioUrl) return data.audioUrl;
    if (data?.audioContent) {
      return `data:audio/mpeg;base64,${data.audioContent}`;
    }
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
        console.log("[WatchPlayer] Starting Night Watch generation for day", session.dayNumber);
        const prompt = buildNightPrompt(session, tractName);
        console.log("[WatchPlayer] Prompt length:", prompt.length, "chars");
        const { data, error } = await callJeeves(
          { mode: "night-watch", message: prompt },
          "night-watches",
        );
        console.log("[WatchPlayer] Jeeves response:", { hasData: !!data, error: error ? String(error) : null });
        if (error) throw new Error(String(error));

        const d = data as Record<string, unknown> | string | null;
        const script =
          typeof d === "string"
            ? d
            : d
              ? String((d as any).response || (d as any).result || JSON.stringify(d))
              : "";

        console.log("[WatchPlayer] Script length:", script.length, "chars");
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
        console.log("[WatchPlayer] Starting Morning Watch generation for day", session.dayNumber);
        const prompt = buildMorningPrompt(session, tractName);
        console.log("[WatchPlayer] Prompt length:", prompt.length, "chars");
        const { data, error } = await callJeeves(
          { mode: "morning-watch", message: prompt },
          "morning-watches",
        );
        console.log("[WatchPlayer] Jeeves response:", { hasData: !!data, error: error ? String(error) : null });
        if (error) throw new Error(String(error));

        const d = data as Record<string, unknown> | string | null;
        const script =
          typeof d === "string"
            ? d
            : d
              ? String((d as any).response || (d as any).result || JSON.stringify(d))
              : "";

        console.log("[WatchPlayer] Script length:", script.length, "chars");
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
