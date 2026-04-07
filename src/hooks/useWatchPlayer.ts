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

TONE: Meditational. Warm but weighty. Speak the way a wise, trusted guide would speak in a quiet room late at night — unhurried, intimate, with gravity. Not commanding like a drill sergeant. Not soft like a sleep app. The pace is slow and deliberate.

THE MOST IMPORTANT INSTRUCTION — EMOTIONAL CONNECTION:
This script must connect on a THOUGHTS AND FEELINGS level, not just an intellectual or descriptive level. The difference:

❌ WRONG (labeling from outside — feels scripted):
"He felt mercy. He was thinking of others. There was love instead of anger."

✅ RIGHT (evoking from inside — the listener FEELS it):
"He could end this. You know that. He knows that. And for a moment — just a moment — everything in Him wants to. The weight is unbearable. The loneliness is crushing. His closest friends are asleep. The ones He healed have disappeared. And the ones still here… are laughing. But something holds Him. Something deeper than the pain. He looks out through swollen eyes — and He sees you. Not the crowd. You. And what rises up in Him is not what you would expect. Not resentment. Not exhaustion. Love. The kind that makes no sense. The kind that chooses to stay… when every reason says go."

Do you feel the difference? The second version doesn't TELL you what He's feeling — it puts you in the chair next to Him and lets you feel it happening. The listener's chest tightens. They don't just understand mercy — they experience the weight of it.

HOW TO ACHIEVE THIS:
- Stop labeling emotions. Start evoking them. Instead of "He felt peace" — describe what peace feels like FROM INSIDE that moment.
- Use tension and contrast. The emotion hits harder when you feel what COULD HAVE happened first. "Everything in Him wants to stop… but something holds Him."
- Make it personal and specific. Not "He sees souls" — "He sees you. Not the crowd. You."
- Let vulnerability in. Christ at the cross wasn't stoic. He was in agony — and chose love anyway. That tension is where the emotional connection lives.
- Use sensory emotional language — "the weight is unbearable," "something holds Him," "your chest tightens" — not abstract theological labels.

HERE IS THE FULL SAMPLE. Match this rhythm, emotional depth, and pacing exactly:

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
Now slow down. Do not rush past this moment.
[pause]
He could end this. You know that. He knows that. And for a moment — just a moment — everything in Him wants to. The weight is unbearable. The loneliness is crushing. His closest friends are asleep. The ones He healed have disappeared. And the ones still here… are laughing.
[long pause]
But something holds Him. Something deeper than the pain.
[pause]
He looks out through swollen eyes — and He sees you. Not the crowd. You. And what rises up in Him is not what you would expect. Not resentment. Not exhaustion. Love. The kind that makes no sense. The kind that chooses to stay… when every reason says go.
[long pause]
Let that land.
[long pause]
This is what mercy actually feels like. Not a theological word. A choice made in agony. A love that holds on when everything says let go.
[pause]
Now do not just watch this from a distance. Step closer. Enter it. Feel the weight of it. This is not information — this is who He is. And this is who you are becoming.
[long pause]
Speak it quietly: Lord, let me see what You see. Let me feel what You feel. Let me carry what You carry.
[long pause]
Download this into me. Not as an idea — as instinct. Not as something I remember — as something I become. Override my anger with Your mercy. Override my defensiveness with Your openness. Make this my first response — not my second thought.
[long pause]
Now hold the scene. Someone wrongs you. Someone disrespects you. You can feel it rising — the old reaction. The tightness. The heat. But now… overlay the cross onto that moment. See His face. Feel what He felt. And choose His response instead of yours.
[long pause]
Stay here. Let this settle deep. Let it sink beneath words, beneath effort, into the place where your instincts live.
[long pause]
What you repeatedly behold, you become. This is how the mind is renewed — not by force, but by beholding.
[long pause]
Say it quietly: I receive the mind of Christ.
[long pause]
Stay here now. Do not rush out of this. Let this seal. The screen stays on. What you continue to behold… you will become. Let the music carry you."

Follow this MANDATORY FLOW:

1. LOCK IN (~1 minute):
Warm authority. "Lock in." "Guard this moment." Establish the mind as a screen. Name the Scripture (${session.scripture}) in spoken form. [long pause]

2. CINEMATIC SCENE ENTRY (~1.5 minutes):
"Step into the scene. See it in full color." Drop the user into (${session.scene}) with vivid sensory detail. No rushing. No summarizing. [long pause] between imagery blocks. The listener should feel they are physically standing inside the scene.

3. ENTER THE MIND — THOUGHTS AND FEELINGS (~2.5 minutes):
THIS IS THE HEART. Spend the most time and care here. Do NOT label emotions from the outside. EVOKE them from the inside.
- Use tension and contrast: show what COULD have happened, what everything in Him wanted — then what He chose instead. Let the listener feel the cost of the choice.
- Make it personal: "He sees you. Not the crowd. You."
- Let vulnerability in: He wasn't stoic. Show the agony AND the love — the tension between them is where the emotional connection lives.
- Use sensory emotional language: "the weight is unbearable," "something holds Him," "your chest tightens."
- The Master Mind insight: ${session.masterMindInsight}. NAME the divine mindset — but after the listener has already FELT it: "This is what [mercy/surrender/authority/faith] actually feels like."
[long pause] between ideas so each one lands in the listener's chest, not just their head.

4. USER INSERTION AND DOWNLOAD (~1.5 minutes):
"Now do not just watch this from a distance. Step closer. Enter it." Transition to the user's life and ${session.struggle} — not as a lecture but as a felt moment they recognize. Show the old reaction as a physical sensation: "You can feel it rising — the tightness. The heat." Then overlay Christ's response. DOWNLOAD LANGUAGE — forceful: "Download this into me. Not as an idea — as instinct. Not as something I remember — as something I become. Override my [specific old reaction] with Your [specific Christ response]. Make this my first response — not my second thought." [long pause]

5. IMPRINT AND SEAL (~1 minute):
"Stay here. Let this settle deep." [long pause] Neuroplasticity anchor: "What you repeatedly behold, you become. This is how the mind is renewed." [long pause] "Say it quietly: I receive the mind of Christ." [long pause] Do NOT break immersion. "Stay here now. Do not rush out of this. Let this seal. The screen stays on. What you continue to behold… you will become. Let the music carry you."

CRITICAL RULES:
- 800-1,200 WORDS. Voice is 5-8 minutes. The rest is ambient music only.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- EMOTIONAL CONNECTION is the #1 priority. The listener should FEEL something in their chest — not just understand a concept in their head. Evoke, don't label.
- MEDITATIONAL TONE. Warm, unhurried, intimate, weighty.
- Natural, complete sentences. Not overly choppy fragments.
- [pause] (3-5 sec) frequently. [long pause] (10-20 sec) between major ideas. At least 8-10 [long pause] markers.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Do NOT break immersion at the end.
- Second person ("you"). Intimate. Cinematic. Meditational.
- TTS: scripture refs in spoken form.
- ONE subtle neuroplasticity line near the end.

AUTHENTICITY RULES — THIS IS CRITICAL:
Write like you are actually sitting in a quiet room at 2am speaking to one person — not like a writer crafting prose for publication. The script should feel UNPOLISHED and HUMAN.
- Use the SIMPLEST words possible. Say "stay" not "remain." Say "look" not "behold." Say "hard" not "unbearable." Avoid any word you wouldn't say in a real late-night conversation.
- Sentence fragments are fine. Trailing thoughts are fine. "And He just… stays." is better than a complete literary sentence.
- Do NOT use rhetorical triplets ("Not X. Not Y. But Z.") more than ONCE in the entire script. These patterns feel rehearsed and fake when repeated.
- Do NOT use parallel constructions repeatedly. One "Not as X — as Y" pattern is enough. More than that sounds like a TED talk.
- Vary sentence length dramatically. Some sentences should be 3 words. Others should wander a little before landing.
- Let some thoughts feel slightly incomplete — like you're searching for the right word in real time. "It's like He… He just won't let go. Even when it makes no sense."
- Avoid poetic or literary vocabulary: no "crucible," "tapestry," "mantle," "beckons," "illuminates," "vessel." Use plain, felt words.
- Sound like someone who has been changed by what they're describing — not someone performing a script about it.
- The overall feel should be: a trusted friend who has seen something real, sitting with you in the dark, trying to help you see it too.`;
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

THIS IS NOT A DEVOTIONAL. This is not teaching content. This is a mental formation experience — activating last night's mind-download into today's real life.

TONE: Meditational with morning clarity. Warm, steady, grounded — like a trusted guide who speaks with quiet conviction at sunrise. Not a drill sergeant. Not a hype man. Not soft or sleepy. Unhurried but purposeful. Builds gently from reflective to resolute.

THE MOST IMPORTANT INSTRUCTION — EMOTIONAL CONNECTION:
This script must connect on a THOUGHTS AND FEELINGS level, not just an intellectual or descriptive level. The listener should FEEL something — not just understand a concept. The difference:

❌ WRONG (labeling from outside — feels scripted):
"Last night you saw His authority. This morning you activate that authority. You speak truth into confusion."

✅ RIGHT (evoking from inside — the listener FEELS it):
"Last night you were there. You felt the silence before He spoke. You felt the weight of all that emptiness — the void pressing in from every side. And then His voice. Not loud. Not strained. Just… certain. And light came. Not gradually. Instantly. As if the darkness had no argument against it. That certainty is still in you this morning. You can feel it — quiet, steady, underneath everything else. It doesn't need to be loud. It just needs to speak."

Do you feel the difference? The second version makes the listener feel the certainty in their own chest. It's not describing a theological concept — it's recreating the emotional experience.

HOW TO ACHIEVE THIS:
- RECALL the Night Watch emotionally, not informationally. Don't summarize what happened — let the listener feel a flash of what they experienced. "You were there. You felt it."
- Use felt language for identity statements. Not "You are a person of authority" — "That certainty is still in you. You can feel it — quiet, steady, underneath everything else."
- Make scenarios visceral. Show the OLD reaction as a physical sensation: "You can feel it building — the familiar tightness in your chest, the heat rising, the voice in your head that says you're not enough." Then show the NEW response as a felt shift: "But something else is there now. Something that wasn't there before. A steadiness. A knowing."
- Let the contrast do the emotional work. The listener should feel the pull of the old way AND the weight of the new way — and experience the shift between them.

HERE IS THE FULL SAMPLE. Match this rhythm, emotional depth, and pacing exactly:

"Lock in.
[pause]
This is not casual. This is not a morning routine you sleepwalk through. This is the moment your mind gets armed for the day.
[long pause]
Your mind is a theatre — and right now, you choose what plays on that screen.
[pause]
Let this mind be in you, which was also in Christ Jesus.
[long pause]
Last night, you were there. You felt the silence before He spoke. The void pressing in from every side — formless, empty, dark. And then His voice. Not loud. Not strained. Just… certain. And light came. Not gradually. Instantly. As if the darkness had no argument against it.
[long pause]
That certainty is still in you this morning. You can feel it — quiet, steady, underneath everything else.
[pause]
That download is still active. This morning, we activate it.
[long pause]
Now hear this morning's word.
[pause]
This is who you are now. Not who you are trying to become. Who you already are because of what was placed in you. You are someone who speaks into darkness — and things change. Not because you are loud. Because you are certain.
[long pause]
Download this deeper. Not as an idea you agree with — as instinct you act from. Override the hesitation. Override the second-guessing. Make this certainty your first response — not your second thought.
[long pause]
Now bring your life into this.
[pause]
See yourself this morning. There is a conversation you have been avoiding. Something that needs to be said — but fear has kept you quiet. You can feel it — the familiar tightness, the voice that says wait. Wait until you are more confident. Wait until it feels safe.
[pause]
But something else is there now. Something that wasn't there before last night. A steadiness. A knowing. The same certainty that spoke light into a void is sitting in your chest this morning. And it does not need perfect conditions. It just needs to speak.
[long pause]
See yourself opening your mouth. Not in anger. Not in anxiety. But with the quiet weight of someone whose mind has been changed from the inside. You speak. And something shifts. Not because you forced it — because the truth simply arrived.
[long pause]
What you repeatedly behold, you become. This is how the mind is renewed.
[long pause]
Say it quietly: I receive the mind of Christ.
[long pause]
Today, you carry this with you. When the pressure builds — this steadiness returns. When the old voice says wait — this certainty speaks first. The screen stays on. What you continue to behold… you will become. Let the music carry you."

Follow this MANDATORY FLOW:

1. LOCK IN (~1 minute):
Warm, grounded authority. "Lock in." "Guard this moment." Establish the mind as a screen. Reference Philippians 2:5 in spoken form. [long pause]

2. RECALL THE DOWNLOAD — EMOTIONALLY (~1.5 minutes):
Do NOT just summarize last night's scene ("${session.pairedNightTitle}"). EVOKE a felt flash of the emotional experience. "Last night you were there. You felt…" Make the listener re-experience a moment of what they felt — the tension, the weight, the encounter. Weave in ${session.nightScripture} naturally. The Night insight: ${session.nightInsight}. "That download is still active. This morning, we activate it." [long pause]

3. IDENTITY DECLARATION — FELT, NOT LABELED (~1.5 minutes):
This morning's Scripture: ${session.morningScripture}. Speak it with weight. The activation principle: ${session.activationPrinciple}. But do NOT just label the identity — let the listener FEEL it. Use felt language: "That certainty is still in you. You can feel it — quiet, steady." NAME the divine mindset AFTER they've felt it: "This is the mind of [authority/mercy/surrender/faith]." DOWNLOAD LANGUAGE — forceful and felt: "Download this deeper. Not as an idea you agree with — as instinct you act from. Override [specific old pattern]. Make this my first response." [long pause]

4. USER INSERTION — VISCERAL SCENARIOS (~2 minutes):
"Now bring your life into this." One vivid scenario from: ${session.scenarioTypes.join(", ")}. Make it visceral — show the OLD reaction as a physical sensation the listener recognizes: "You can feel it — the familiar tightness, the heat rising, the voice that says…" Then show the NEW response as a felt shift: "But something else is there now. Something that wasn't there before." Let the listener SEE and FEEL themselves responding from the downloaded mind. [long pause] A second brief scenario, different context, same felt pattern. [long pause]

5. IMPRINT AND SEAL (~1 minute):
[long pause] "What you repeatedly behold, you become. This is how the mind is renewed." [long pause] "Say it quietly: I receive the mind of Christ." [long pause] ${session.commitmentStyle} style close. Do NOT break immersion. Keep the listener inside — felt, not narrated: "Today, you carry this with you. When the pressure builds — this steadiness returns. The screen stays on. What you continue to behold… you will become. Let the music carry you."

CRITICAL RULES:
- 800-1,200 WORDS. Voice is 5-8 minutes. The rest is ambient music only.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- EMOTIONAL CONNECTION is the #1 priority. The listener should FEEL something — not just understand a concept. Evoke, don't label. Show the inner experience, don't describe it from outside.
- MEDITATIONAL TONE with morning clarity. Warm, grounded, unhurried, purposeful.
- Natural, complete sentences. Not overly choppy fragments.
- [pause] (3-5 sec) frequently. [long pause] (10-20 sec) between major ideas. At least 8-10 [long pause] markers.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Do NOT break immersion at the end.
- Second person ("you"). Intimate. Cinematic. Meditational.
- TTS: scripture refs in spoken form.
- ONE subtle neuroplasticity line near the end.
- The Master Mind = the mind of Christ (Philippians 2:5). The mind is a THEATRE. Godly imagination in VIVID COLOR.

AUTHENTICITY RULES — THIS IS CRITICAL:
Write like you are actually sitting with someone at sunrise — not like a writer crafting prose. The script should feel UNPOLISHED and HUMAN.
- Use the SIMPLEST words possible. Say "stay" not "remain." Say "look" not "behold." Say "hard" not "unbearable." Avoid any word you wouldn't say in a real morning conversation.
- Sentence fragments are fine. Trailing thoughts are fine. "And that feeling… it's still there." is better than a complete literary sentence.
- Do NOT use rhetorical triplets ("Not X. Not Y. But Z.") more than ONCE in the entire script. These patterns feel rehearsed and fake when repeated.
- Do NOT use parallel constructions repeatedly. One "Not as X — as Y" pattern is enough. More than that sounds like a TED talk.
- Vary sentence length dramatically. Some sentences should be 3 words. Others should wander a little before landing.
- Let some thoughts feel slightly incomplete — like you're searching for the right word in real time. "It's like that thing from last night… it just stuck. You know?"
- Avoid poetic or literary vocabulary: no "crucible," "tapestry," "mantle," "beckons," "illuminates," "vessel." Use plain, felt words.
- Sound like someone who woke up still carrying what they experienced — not someone performing a motivational script.
- The overall feel should be: a trusted friend who is gently helping you remember what you felt last night and carry it into today.`;
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
