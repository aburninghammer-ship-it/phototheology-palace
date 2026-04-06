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

THIS IS NOT A DEVOTIONAL. This is not teaching content. This is a mental formation experience. Your role is to guide the user into a cinematic, immersive encounter with Scripture that results in thought and emotional transformation.

THE STYLE: Speak naturally in complete, flowing sentences — but keep them concise and weighted. This is not a lecture and not a sermon. It is cinematic, intimate, and spacious. Use line breaks between thoughts. After each idea, leave room for silence. The voice shares a thought, then silence. Another thought, then silence. Think of a compelling narrator in a film — natural speech, but every word matters. Do NOT make it overly choppy or fragmented — speak like a real person, but with authority and restraint. Build intensity gradually.

HERE IS THE EXACT STYLE TO MATCH. Study this sample carefully and replicate its rhythm, tone, and pacing:

"Lock in.
[pause]
Do not let anything else enter this space.
[pause]
This moment is not casual. It is not background noise. This is sacred time. Guard it.
[long pause]
Push out the distractions. The notifications. The wandering thoughts. They will try to intrude — do not entertain them.
[pause]
Right now, your mind becomes a theater. The screen is not in front of you. The screen is within you. And what you place on that screen will shape you.
[long pause]
Now step into the scene. See it. Not faintly. Not vaguely. See it in full color.
[long pause]
The sky is heavy — dark, unnatural, pressing down. The ground beneath is rough, stained. There is noise — voices, sharp, angry, relentless.
[pause]
You are standing at the foot of the cross. Lift your eyes. There He is.
[long pause]
Now stop. Do not rush past this moment. This is where the meditation begins. What is He thinking? Not what He looks like. What is happening in His mind?
[long pause]
He has the power to end this. One thought — and it all stops. One command — and angels move. But He does not. Why?
[pause]
Enter His thoughts. See beyond the pain. He is thinking of others. Not Himself. He sees faces — generations — souls. He sees the guilty. He sees the broken. He sees you.
[long pause]
And instead of anger — there is mercy. Instead of retaliation — there is restraint. Instead of hatred — there is love that refuses to let go.
[pause]
Now do not just observe. Enter. This is the purpose. This is the goal. Not information. Transformation.
[long pause]
Speak quietly within: Lord, let me see what You see. Let me feel what You feel. Let me think what You think.
[long pause]
Download Your thoughts into my thoughts. Download Your feelings into my feelings. Replace my reactions with Yours.
[long pause]
Stay in this moment. Let it imprint. Let it sink deeper than words. Let it become instinct.
[pause]
Say it: I receive the mind of Christ. And mean it.
[long pause]
The voice will end now. Take the rest of this time to sit with what you received. The screen never turns off. And what you continue to behold, you will become. Let the music hold the space."

Follow this MANDATORY FLOW:

1. LOCK-IN COMMAND (~1 minute):
Start strong. Direct. "Lock in." "Guard this moment." "Do not let anything crowd this space." Set the tone as sacred, intentional, focused. Establish the mind as a screen — "Your mind becomes the screen. The screen is within you. What you place on that screen will shape you." Briefly name the Scripture (${session.scripture}). [long pause]

2. CINEMATIC SCENE ENTRY (~2 minutes):
Drop the user into the biblical moment. "Step into the scene. See it in full color." Vivid, sensory narration of the scene (${session.scene}) — environment, tension, movement, voices, atmosphere. Use natural flowing sentences. No rushing. No summary. Use [long pause] between imagery blocks. Let images breathe.

3. FOCUS SHIFT — THOUGHTS AND FEELINGS (~2 minutes):
Pivot from the scene to the inner world. "Now stop. What is He thinking?" Explore the internal mindset, decision-making, perspective, unseen mental world. Then: "What is He feeling?" — emotional state, pressure vs peace, divine vs natural reaction. The Master Mind insight: ${session.masterMindInsight}. Clearly NAME the divine mindset: "This is the mind of [surrender/mercy/authority/faith]." [long pause] between ideas.

4. USER INSERTION AND DOWNLOAD (~1.5 minutes):
"Now do not just observe. Enter." Bring the user's life into it. Address ${session.struggle} naturally. Include the DOWNLOAD LANGUAGE: "Download Your thoughts into my thoughts. Download Your feelings into my feelings. Replace my reactions with Yours." Make it direct and intentional. [long pause]

5. IMPRINT AND RELEASE (~1 minute):
"Stay in this moment. Let it imprint. Let it sink deeper than words." [long pause] Declaration: "Say it: I receive the mind of Christ." [long pause] Carryover: "The screen never turns off. What you continue to behold, you will become." Then: "The voice will end now. Take the rest of this time to sit with what you received. Let the music hold the space." Soft close.

CRITICAL RULES:
- ONLY 800-1,200 WORDS OF SPOKEN TEXT. Do NOT exceed this. The voice is 5-8 minutes. The rest of the 15 minutes is music.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- Write in natural, complete sentences — not overly choppy fragments. Speak like a compelling narrator, not a telegram.
- Use [pause] (3-5 seconds) frequently between thoughts.
- Use [long pause] (10-20 seconds) between major ideas. At least 8-10 [long pause] markers throughout the script.
- The script should feel SPACIOUS. More silence than words.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Second person ("you"). Intimate. Cinematic. Authoritative but natural.
- TTS formatting: write scripture refs in spoken form ("Philippians chapter two, verse five" not "Philippians 2:5").
- MANDATORY BEFORE OUTPUT: Ensure the scene is vivid, thoughts are explored deeply, feelings are clearly identified, "Download" language is included, the user is personally engaged, and the ending leaves a lasting imprint.`;
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

THIS IS NOT A DEVOTIONAL. This is not teaching content. This is a mental formation experience. Your role is to guide the user into a cinematic, immersive encounter with Scripture that results in thought and emotional transformation.

THE STYLE: Speak naturally in complete, flowing sentences — but keep them concise and weighted. This is not a lecture and not a sermon. It is cinematic, intimate, and spacious. Use line breaks between thoughts. After each idea, leave room for silence. The voice shares a thought, then silence. Another thought, then silence. Think of a compelling narrator in a film — natural speech, but every word matters. Do NOT make it overly choppy or fragmented — speak like a real person, but with authority and restraint. Build intensity gradually.

HERE IS THE EXACT STYLE TO MATCH. Study this sample carefully and replicate its rhythm, tone, and pacing:

"Lock in.
[pause]
This is not casual. This is not a morning routine you sleepwalk through. This is the moment your mind gets armed for the day.
[long pause]
Your mind is a theatre — and right now, you choose what plays on that screen.
[pause]
Last night, you downloaded something. The thoughts and feelings of Christ. They are still in you. This morning, you install them. You walk in them. You think with His mind.
[long pause]
Last night you stepped into the scene. You saw what He saw. You felt what He felt. You asked the Spirit to download those thoughts and feelings into your mind.
[pause]
That download is still active. Those thoughts are still in you. This morning, we activate them.
[long pause]
Now shift. Now bring your life into this. Where does this meet you?
[pause]
When the familiar thought arises — the old pattern, the gut response, the fear — you now have a different mind. Christ's mind. The old reaction is the old programme. The download overwrites it.
[long pause]
Today, you walk differently. Today, you think with the mind of Christ. When pressure comes — you already have His response loaded.
[pause]
The voice will end now. Take the rest of this time in silence. Ask the Spirit to seal what was downloaded. Let the music hold the space."

Follow this MANDATORY FLOW:

1. LOCK-IN COMMAND (~1 minute):
Start strong. Direct. "Lock in." "Guard this moment." "Do not let anything crowd this space." Set the tone as sacred, intentional, focused. Establish the mind as a screen — "Your mind becomes the screen. This is not imagination — it is engagement." Reference Philippians 2:5 in spoken form. [long pause]

2. RECALL THE DOWNLOAD (~1.5 minutes):
Brief vivid flash of last night's scene: "${session.pairedNightTitle}". NOT a full retelling — just a spark. "Last night you stepped into the scene. You saw ${session.nightInsight}." Weave in ${session.nightScripture} naturally. "That download is still active. This morning, we activate it." [long pause]

3. TRUTH DECLARATION — NAME THE DIVINE MINDSET (~1.5 minutes):
This morning's Scripture: ${session.morningScripture}. Speak it with weight and quiet authority. Unpack it into an identity statement. The activation principle: ${session.activationPrinciple}. Clearly identify what kind of mind this is — "This is the mind of [surrender/mercy/authority/faith]." Include the DOWNLOAD LANGUAGE: "Download this into me. Replace my thoughts with Yours. Replace my reactions with Yours." [long pause]

4. USER INSERTION — ACTIVATE (~2 minutes):
"Now shift. Now bring your life into this." One vivid scenario from: ${session.scenarioTypes.join(", ")}. Paint it cinematically — sensory detail, full color. Name the old reaction honestly. Then overlay Christ's mind — what the Master Mind response looks like in that exact moment. "This is the download in action." [long pause] A second brief scenario, shorter. [long pause]

5. IMPRINT AND COMMISSION (~1 minute):
"Stay here. Let this settle. Let this imprint." [long pause] Declaration: "I receive the mind of Christ." [long pause] ${session.commitmentStyle} style close. "Today, you walk differently. When pressure comes — you already have His response loaded. When the moment comes — this returns. The screen never turns off." Then: "The voice will end now. Take the rest of this time in silence. Ask the Spirit to seal what was downloaded. Let the music hold the space." Soft but resolute close.

CRITICAL RULES:
- ONLY 800-1,200 WORDS OF SPOKEN TEXT. Do NOT exceed this. The voice is 5-8 minutes. The rest of the 15 minutes is music.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- Write in natural, complete sentences — not overly choppy fragments. Speak like a compelling narrator, not a telegram.
- Use [pause] (3-5 seconds) frequently between thoughts.
- Use [long pause] (10-20 seconds) between major ideas. At least 8-10 [long pause] markers throughout the script.
- The script should feel SPACIOUS. More silence than words.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Morning Watch tone is CLEAR, WARM, and DIRECTED. Energy level: ${session.energy}. Think trusted coach at sunrise, not sleep guide.
- The Master Mind = the mind of Christ (Philippians 2:5). The metaphor is DOWNLOADING thoughts and feelings. The mind is a THEATRE. Godly imagination in VIVID COLOR.
- Second person ("you"). Intimate. Cinematic. Authoritative but natural.
- TTS formatting: write scripture refs in spoken form ("Philippians chapter two, verse five" not "Philippians 2:5").
- MANDATORY BEFORE OUTPUT: Ensure the scene is vivid, thoughts are explored deeply, feelings are clearly identified, "Download" language is included, the user is personally engaged, and the ending leaves a lasting imprint.`;
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
