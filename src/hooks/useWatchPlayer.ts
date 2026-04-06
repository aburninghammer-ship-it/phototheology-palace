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
  return `Generate a Night Watch meditation script to be read aloud as audio. The voice narration should be 800 to 1,200 words — about 5-8 minutes of speaking. The remaining time of the 15-minute session is PURE MUSIC with NO voice. Less is more. Every word must carry weight.

Title: ${session.title}
Series: ${tractName}, Day ${session.dayNumber}
Scripture: ${session.scripture}
Scene: ${session.scene}
Master Mind Insight: ${session.masterMindInsight}
Mood: ${session.mood}
Primary Struggle: ${session.struggle}
Entry Type: ${session.entryType}
Metaphor Family: ${session.metaphor}

ABSOLUTELY NO BREATHING INSTRUCTIONS. ABSOLUTELY NO POSTURE GUIDANCE. NONE. ZERO. Do NOT mention breathing, inhaling, exhaling, deep breaths, settling into the body, relaxing muscles, or any physical awareness exercises. Do NOT use mindfulness language from secular meditation.

THIS IS NOT A DEVOTIONAL. This is not teaching content. This is a mental formation experience — Christian cognitive transformation through Scripture visualization. Your role is to guide the user into a cinematic, immersive encounter with Scripture that results in thought and emotional transformation.

TONE: Meditational. Warm but weighty. Speak the way a wise, trusted guide would speak in a quiet room late at night — unhurried, intimate, with gravity. Not commanding like a drill sergeant. Not soft like a sleep app. Think of someone who deeply respects the moment and the listener. Sentences flow naturally, with pauses that feel like they belong — like the speaker is giving you time to see what they just described. The pace is slow and deliberate. Let each thought land before moving to the next.

HERE IS THE EXACT STYLE TO MATCH. Study this sample carefully and replicate its rhythm, tone, and pacing:

"Lock in.
[pause]
Do not let anything else enter this space.
[pause]
This moment is not casual. It is not background noise. This is sacred time. Guard it.
[long pause]
Push out the distractions. The notifications. The wandering thoughts. They will try to intrude — do not entertain them.
[pause]
Right now, your mind becomes a theater. The screen is not in front of you… the screen is within you. And what you place on that screen will shape you.
[long pause]
Now step into the scene. See it. Not faintly. Not vaguely. See it in full color.
[long pause]
The sky is heavy — dark, unnatural, pressing down. The ground beneath is rough, stained. There is noise — voices, sharp, angry, relentless.
[pause]
You are standing at the foot of the cross. Lift your eyes. There He is.
[long pause]
Now slow down. Do not rush past this moment. This is where the meditation truly begins.
[pause]
What is happening in His mind?
[long pause]
Not what He looks like. Not the wounds. Go deeper. Enter His thoughts.
[pause]
There is no internal debate. No second voice questioning whether this is worth it. He has the power to end this — one thought and it all stops. One command and angels move. But there is no hesitation. No wavering. He has already decided. The decision was made before the foundation of the world.
[long pause]
Now ask — what is He feeling?
[pause]
Not just pain. Beneath the pain — there is something else. A steady, unshakeable love. The kind that does not flinch when mocked. The kind that looks at the very people driving the nails… and feels compassion. He sees faces. Generations. Souls. He sees the guilty. He sees the broken. He sees you. And instead of anger — mercy. Instead of retaliation — restraint. Instead of hatred — a love that simply refuses to let go.
[long pause]
This is the mind of mercy.
[pause]
Now do not just observe this. Enter it. This is the whole purpose. Not information — transformation.
[long pause]
Speak it quietly within yourself: Lord, let me see what You see. Let me feel what You feel. Let me think what You think.
[long pause]
Download Your thoughts into my thoughts. Download Your feelings into my feelings. Not as an idea — as instinct. Override my default reactions. Make this my first response — not my second thought.
[long pause]
Now hold the scene. Someone wrongs you. Someone disrespects you. What rises up naturally — anger? Pride? Defense? Now overlay the cross onto that moment. And choose His mind instead of yours.
[long pause]
Stay here. Let this settle deep. Let it sink beneath words, beneath effort, into the place where your instincts live.
[pause]
What you repeatedly behold, you become. This is how the mind is renewed — not by force, but by beholding.
[long pause]
Say it quietly: I receive the mind of Christ.
[long pause]
And mean it.
[long pause]
Stay here now. Do not rush out of this. Let this seal. The screen stays on. What you continue to behold… you will become. Let the music carry you."

Follow this MANDATORY FLOW:

1. LOCK IN (~1 minute):
Begin with warm authority. "Lock in." "Guard this moment." "Do not let anything crowd this space." Set the tone — sacred, intentional, unhurried. Establish the mind as a screen: "Your mind becomes the screen. The screen is within you. What you place on that screen will shape you." Briefly name the Scripture (${session.scripture}) in spoken form. [long pause]

2. CINEMATIC SCENE ENTRY (~2 minutes):
"Step into the scene. See it in full color." Drop the user into the biblical moment (${session.scene}) with vivid sensory detail — environment, atmosphere, tension, sounds, textures. Use natural flowing sentences. No rushing. No summarizing. Use [long pause] between imagery blocks. Let the images breathe. The listener should feel they are standing inside the scene.

3. ENTER THE MIND — THOUGHTS AND FEELINGS (~2 minutes):
This is the deepest and most critical section. Slow down. "What is happening in His mind?" Do NOT just label emotions — ENTER the thought process. Explore the internal decision-making, the perspective, the unseen mental world. Spend real time here. Then shift: "What is He feeling?" Go beneath the surface emotion to the deeper current — the steady love, the unshakeable peace, the divine restraint. The Master Mind insight: ${session.masterMindInsight}. Clearly NAME the divine mindset: "This is the mind of [mercy/surrender/authority/faith]." Use [long pause] between ideas so each one lands.

4. USER INSERTION AND DOWNLOAD (~1.5 minutes):
"Now do not just observe this. Enter it." Transition to the user's life. Address ${session.struggle} naturally — not as a lecture but as a moment they recognize. Include DOWNLOAD LANGUAGE — make it forceful and specific: "Download Your thoughts into my thoughts. Download Your feelings into my feelings. Not as an idea — as instinct. Override my default reactions. Make this my first response." [long pause]

5. IMPRINT AND SEAL (~1 minute):
"Stay here. Let this settle deep." [long pause] Neuroplasticity anchor (subtle, 1 line): "What you repeatedly behold, you become. This is how the mind is renewed." [long pause] Declaration: "Say it quietly: I receive the mind of Christ." [long pause] Do NOT break immersion with "the voice will end now." Instead, keep the user inside: "Stay here now. Do not rush out of this. Let this seal. The screen stays on. What you continue to behold, you will become. Let the music carry you." Warm, unhurried close.

CRITICAL RULES:
- 800-1,200 WORDS. Voice is 5-8 minutes. The rest of the 15 minutes is ambient music only.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- MEDITATIONAL TONE. Warm, unhurried, intimate, weighty. Not a drill sergeant. Not a sleep app. A trusted guide in a quiet room.
- Write in natural, complete sentences — not overly choppy fragments. Speak like a real person with gravitas.
- Use [pause] (3-5 seconds) frequently between thoughts.
- Use [long pause] (10-20 seconds) between major ideas. At least 8-10 [long pause] markers.
- The "thoughts and feelings" section is the HEART of the meditation — spend the most care here. Do NOT just label ("He felt peace") — ENTER the thought process and emotional current deeply.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Do NOT break immersion at the end. No "the voice will end now" or "the audio is stopping." Keep the listener inside the experience.
- Second person ("you"). Intimate. Cinematic. Meditational.
- TTS: write scripture refs in spoken form ("Genesis chapter one, verse three" not "Genesis 1:3").
- Include exactly ONE subtle neuroplasticity line near the end: "What you repeatedly behold, you become" or "This is how the mind is renewed — not by force, but by beholding."`;
}

function buildMorningPrompt(session: MorningWatchSession, tractName: string): string {
  return `Generate a Morning Watch activation script to be read aloud as audio. The voice narration should be 800 to 1,200 words — about 5-8 minutes of speaking. The remaining time of the 15-minute session is PURE MUSIC with NO voice. Less is more. Every word must carry weight.

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

ABSOLUTELY NO BREATHING INSTRUCTIONS. ABSOLUTELY NO POSTURE GUIDANCE. NONE. ZERO. Do NOT mention breathing, inhaling, exhaling, deep breaths, settling into the body, relaxing muscles, or any physical awareness exercises. Do NOT use mindfulness language from secular meditation.

THIS IS NOT A DEVOTIONAL. This is not teaching content. This is a mental formation experience — Christian cognitive transformation through Scripture visualization. Your role is to guide the user into activating last night's mind-download into today's real life.

TONE: Meditational but with morning clarity. Warm, steady, grounded — like a trusted guide who speaks with quiet conviction at sunrise. Not a drill sergeant. Not a hype man. Not soft or sleepy. Think of someone who has already been in the presence of God this morning and is now helping you access what was placed in you last night. Unhurried but purposeful. Every sentence carries weight, but the delivery feels natural — like someone speaking truth to you across a table. The pace builds gently from reflective to resolute.

HERE IS THE EXACT STYLE TO MATCH. Study this sample carefully and replicate its rhythm, tone, and pacing:

"Lock in.
[pause]
This is not casual. This is not a morning routine you sleepwalk through. This is the moment your mind gets armed for the day.
[long pause]
Your mind is a theatre — and right now, you choose what plays on that screen.
[pause]
Last night, you downloaded something. The thoughts and feelings of Christ. They are still in you. This morning, you install them. You walk in them. You think with His mind.
[long pause]
Let this mind be in you, which was also in Christ Jesus.
[long pause]
Last night you stepped into the scene. You saw what He saw. You entered what He was thinking — and what He was feeling. You asked the Spirit to download those thoughts and feelings into your mind.
[pause]
That download is still active. Those thoughts are still in you. This morning, we activate them.
[long pause]
Now hear this morning's word.
[pause]
This is who you are now. Not who you are trying to become. Who you already are because of what was placed in you.
[long pause]
This is the mind of authority. Not loud authority. Not forced authority. The kind that simply speaks — and things change.
[pause]
Download this into me. Not as an idea — as instinct. Override my hesitation. Override my default reactions. Make this my first response — not my second thought.
[long pause]
Now shift. Bring your life into this.
[pause]
See yourself this morning. There is a conversation you have been avoiding. Something that needs to be said — but fear has kept you quiet. The old reaction says wait. Wait until you feel more confident. Wait until the timing is better.
[pause]
But the Master Mind does not wait for conditions to improve. He speaks light into darkness. Right now. As it is. See yourself opening your mouth — not in anger, not in anxiety — but with the calm certainty of someone whose mind has been downloaded from heaven.
[long pause]
What you repeatedly behold, you become. This is how the mind is renewed.
[long pause]
Say it quietly: I receive the mind of Christ.
[long pause]
Today, you walk differently. When pressure comes — you already have His response loaded. When the moment arrives — this returns. The screen stays on. What you continue to behold, you will become. Let the music carry you."

Follow this MANDATORY FLOW:

1. LOCK IN (~1 minute):
Begin with warm, grounded authority. "Lock in." "Guard this moment." Set the tone — sacred, intentional, unhurried. Establish the mind as a screen: "Your mind is a theatre. You choose what plays on that screen." Reference Philippians 2:5 in spoken form: "Let this mind be in you, which was also in Christ Jesus." [long pause]

2. RECALL THE DOWNLOAD (~1.5 minutes):
Brief vivid flash of last night's scene: "${session.pairedNightTitle}". NOT a full retelling — just a spark that reignites. "Last night you stepped into the scene. You saw ${session.nightInsight}. You entered what He was thinking — and what He was feeling." Weave in ${session.nightScripture} naturally. "That download is still active. This morning, we activate it." [long pause]

3. TRUTH DECLARATION — NAME THE DIVINE MINDSET (~1.5 minutes):
This morning's Scripture: ${session.morningScripture}. Speak it with weight and quiet authority. Unpack it into an identity statement — not who they are trying to become, but who they already are because of what was placed in them. The activation principle: ${session.activationPrinciple}. Clearly NAME the divine mindset: "This is the mind of [authority/mercy/surrender/faith]." Then DOWNLOAD LANGUAGE — forceful and specific: "Download this into me. Not as an idea — as instinct. Override my default reactions. Make this my first response — not my second thought." [long pause]

4. USER INSERTION — ACTIVATE (~2 minutes):
"Now shift. Bring your life into this." One vivid scenario from: ${session.scenarioTypes.join(", ")}. Paint it cinematically — a specific moment the listener recognizes from their own life. Sensory detail, full color. Name the old reaction honestly — the gut response, the fear, the habit. Then overlay Christ's mind — what the Master Mind response looks like in that exact moment. Let the listener SEE themselves responding differently. "This is the download in action." [long pause] A second brief scenario, shorter, different context. [long pause]

5. IMPRINT AND SEAL (~1 minute):
"Stay here. Let this settle deep." [long pause] Neuroplasticity anchor (subtle, 1 line): "What you repeatedly behold, you become. This is how the mind is renewed." [long pause] Declaration: "Say it quietly: I receive the mind of Christ." [long pause] ${session.commitmentStyle} style close. Do NOT break immersion. Keep the listener inside: "Today, you walk differently. When pressure comes — you already have His response loaded. The screen stays on. What you continue to behold, you will become. Let the music carry you." Warm, resolute close.

CRITICAL RULES:
- 800-1,200 WORDS. Voice is 5-8 minutes. The rest of the 15 minutes is ambient music only.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- MEDITATIONAL TONE with morning clarity. Warm, grounded, unhurried, purposeful. Not a drill sergeant. Not a hype man. A trusted guide at sunrise.
- Write in natural, complete sentences — not overly choppy fragments. Speak like a real person with quiet conviction.
- Use [pause] (3-5 seconds) frequently between thoughts.
- Use [long pause] (10-20 seconds) between major ideas. At least 8-10 [long pause] markers.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Do NOT break immersion at the end. No "the voice will end now" or "the audio is stopping." Keep the listener inside the experience.
- Second person ("you"). Intimate. Cinematic. Meditational.
- TTS: write scripture refs in spoken form ("Genesis chapter one, verse three" not "Genesis 1:3").
- Include exactly ONE subtle neuroplasticity line near the end: "What you repeatedly behold, you become" or "This is how the mind is renewed."
- The Master Mind = the mind of Christ (Philippians 2:5). The metaphor is DOWNLOADING thoughts and feelings. The mind is a THEATRE. Godly imagination in VIVID COLOR.`;
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
