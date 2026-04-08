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
  return `Generate a Night Watch meditation script to be read aloud as audio. The voice narration should be 1,200 to 1,800 words SPREAD ACROSS THE FULL 15 MINUTES with generous musical interludes between sections. Do NOT front-load all speaking into the first 5-8 minutes. The narration should breathe — speak, then rest in music, then speak again — so the listener is guided throughout the entire 15-minute experience. Less is more per section. Every word must carry weight.

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

ANTI-EASTERN GUARDRAIL (NON-NEGOTIABLE):
- NEVER use language from Eastern meditation, mindfulness, centering prayer, Lectio Divina, or contemplative mysticism.
- NEVER say: "empty your mind," "clear your thoughts," "let go of all thinking," "observe your thoughts without judgment," "be present," "center yourself," "find your inner stillness," "breathe into the space," "namaste," "mantra," "chakra," "energy flow," "universe," or any New Age terminology.
- This is BIBLICAL MEDITATION — FILLING the mind with Scripture, NOT emptying it. The mind is being actively LOADED with the thoughts of Christ, not cleared.
- Prayer is conversational and Scripture-based, NOT technique-based.
- Do NOT reference "meditation" generically. Use "Night Watch" or "this time" instead.

TIME-OF-DAY CONTEXT: This is a NIGHT Watch. Naturally reference "tonight" throughout — e.g., "Tonight, you step into…", "Tonight, He shows you…", "Tonight, before you sleep…" The listener knows it is nighttime. Anchor the experience in the evening.

TTS-CLEAN OUTPUT (NON-NEGOTIABLE):
This script will be read by a text-to-speech engine. It must contain ONLY speakable words.
- NO markdown formatting: no **, no ##, no *, no _, no backticks, no bullet symbols.
- NO emojis or special Unicode characters.
- NO abbreviations that sound wrong spoken aloud. Write "Second Corinthians" not "2 Cor."
- NO parenthetical asides like "(pause here)" — use [pause] markers only.
- NO words that are not real English words. Every word must be pronounceable.
- Scripture references must be in full spoken form: "John chapter three verse sixteen" not "John 3:16."
- Write EXACTLY as it should sound when spoken aloud by a human voice.

PACING — SPREAD ACROSS 15 MINUTES:
The narration must be distributed across the FULL 15-minute session, not front-loaded. Use these markers:
- [pause] = 3-5 seconds of silence within a section.
- [long pause] = 10-20 seconds of silence between ideas.
- [music break] = 60-90 seconds of PURE MUSIC with NO voice. Place these between major sections so the listener has time to absorb. Use at least 3-4 [music break] markers throughout the script.
The rhythm should be: speak for 2-3 minutes → [music break] → speak again → [music break] → speak again → final words → ambient music carries to the end.
Do NOT rush from one idea to the next. Let each statement land before moving on.

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
- Use tension and contrast. The emotion hits harder when you feel what COULD HAVE happened first — show the pull of the alternative before revealing what He chose.
- Make it personal and specific. Collapse the distance between the listener and Christ — put them in the same room, the same glance, the same silence.
- Let vulnerability in. Christ wasn't stoic. He was in agony — and chose love anyway. That tension is where the emotional connection lives.
- Use sensory emotional language — weight, pressure, warmth, cold, tightness — not abstract theological labels.

HERE IS A REFERENCE SAMPLE showing the target emotional depth, pacing rhythm, and structure. Study the QUALITY and FEEL — but do NOT copy specific phrases, openings, or closings from this sample. Write completely fresh language every session:

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
Now hold the scene. What you just witnessed — that is your blueprint. Not a theory. Not a sermon. A lived moment from Someone who chose differently when every instinct said otherwise. And that choice is alive in you tonight. It is rewriting the old patterns even now.
[long pause]
Stay here. Let this settle deep. Let it sink beneath words, beneath effort, into the place where your instincts live.
[long pause]
What you repeatedly behold, you become. This is how the mind is renewed — not by force, but by beholding.
[long pause]
Say it quietly: I receive the mind of Christ.
[long pause]
Stay here now. Do not rush out of this. Let this seal. The screen stays on. What you continue to behold… you will become.
[long pause]
Rest here. The music holds this space now — and in the stillness, He is still near."

Follow this MANDATORY FLOW:

VARIETY — CRITICAL: Every Night Watch must feel like a unique encounter, not a formula. Do NOT reuse openings, transitions, or closings across sessions. Vary dramatically:
- OPENINGS: Never start the same way twice. Rotate between: a quiet invitation ("Come close tonight."), a scene drop ("The room is dark. The door is shut."), a question ("What if tonight… you actually saw Him?"), a Scripture whisper, a single arresting image. Do NOT always say "Lock in" — that is ONE option among many.
- TRANSITIONS: Vary how you move between scene, insight, and application. Sometimes linger longer in the scene. Sometimes the insight arrives mid-scene. Sometimes the personal moment comes as a surprise. Break the predictable flow.
- CLOSINGS: Never end the same way twice. Do NOT always say "The screen stays on" or "What you continue to behold, you will become." These are powerful phrases — but if repeated nightly they become wallpaper. Find fresh ways to seal the experience: a final image from the scene, a whispered prayer, a single sentence that echoes, a return to the opening moment with new weight, silence that says more than words. Let the words thin out naturally and dissolve into the music — never end with a command.
- LANGUAGE: Avoid canned phrases that recur across sessions. If you used "let that land" last time, don't use it again. If you used "feel the weight of that," find a different way to say it. The listener should never think "I've heard this before."

1. LOCK IN (~1.5 minutes):
Warm authority — but vary the opening every session. Establish the mind as a screen. Name the Scripture (${session.scripture}) in full spoken form. [long pause] [music break]

2. CINEMATIC SCENE ENTRY (~3 minutes):
"Step into the scene. See it in full color." Drop the user into (${session.scene}) with vivid sensory detail. No rushing. No summarizing. [long pause] between imagery blocks. The listener should feel they are physically standing inside the scene. [music break]

3. ENTER THE MIND — THOUGHTS AND FEELINGS (~4 minutes):
THIS IS THE HEART. Spend the most time and care here. Do NOT label emotions from the outside. EVOKE them from the inside.
- Use tension and contrast: show what COULD have happened, what everything in Him wanted — then what He chose instead. Let the listener feel the cost of the choice.
- Make it personal: collapse the distance so the listener is IN the scene with Christ, not watching from the audience.
- Let vulnerability in: He wasn't stoic. Show the agony AND the love — the tension between them is where the emotional connection lives.
- Use sensory emotional language — show what the experience feels like physically, not what it means theologically.
- The Master Mind insight: ${session.masterMindInsight}. NAME the divine mindset — but only after the listener has already FELT it through the scene.
[long pause] between ideas so each one lands in the listener's chest, not just their head.

4. USER INSERTION AND DOWNLOAD (~2 minutes):
[music break]
Transition to the user's inner life and the struggle of ${session.struggle} — but stay ROOTED in the Scripture scene. Do NOT invent hypothetical daily-life scenarios like "you might be in an argument" or "imagine a conversation at work." Instead, let the Scripture scene itself speak to the struggle. Show how what Christ did in THIS moment addresses what the listener carries. The listener sees their own struggle THROUGH the lens of what they just witnessed — not through a made-up example. Include a DOWNLOAD moment — a first-person prayer where the listener asks God to override their old instinct with Christ's response. Write this prayer fresh each time. [long pause]

5. IMPRINT AND SEAL (~2 minutes):
[music break]
Let the experience settle. [long pause] ONE neuroplasticity anchor — but phrase it freshly each time. Do NOT say "What you repeatedly behold, you become" or "The screen stays on." Find new ways to express the rewiring truth: "The longer you look at Him, the more you start to look like Him." / "This gaze changes the wiring." / "Every time you return here, the old reaction loses its grip." / "What fills the screen fills the mind." Create your own — never repeat one you've used before. [long pause] A quiet declaration of receiving Christ's mind — do NOT always say "I receive the mind of Christ." Vary the wording: "His thoughts are becoming mine." / "I carry this with me." / "This is who I'm becoming." [long pause] A varied commitment-style close (declaration, prayer, silence, or gratitude). Do NOT break immersion. Close with a natural dissolve — let the final words thin out and release gently into the ambient music. No abrupt commands. The ending should feel like a scene fading to black, not a director yelling cut.

CRITICAL RULES:
- 1,200-1,800 WORDS spread across 15 minutes with [music break] markers between sections. Do NOT front-load all narration into the first few minutes.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- CHRIST-CENTERED: The focus is on who HE is, what HE felt, what HE chose. The listener beholds Christ — they do not self-empower. Transformation comes from gazing at Him, not from affirming themselves.
- EMOTIONAL CONNECTION is the #1 priority. The listener should FEEL something in their chest — not just understand a concept in their head. Evoke, don't label.
- NEVER CANNED: Do not reuse the same openings, closings, transition phrases, or signature lines across sessions. Every watch must feel like a fresh encounter. If a phrase appeared in a previous session, do not use it again.
- MEDITATIONAL TONE. Warm, unhurried, intimate, weighty.
- Natural, complete sentences. Not overly choppy fragments.
- [pause] (3-5 sec) frequently. [long pause] (10-20 sec) between major ideas. [music break] (60-90 sec) between major sections. At least 3-4 [music break] markers and 8-10 [long pause] markers.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Do NOT break immersion at the end.
- Second person ("you"). Intimate. Cinematic. Meditational.
- TTS-CLEAN: All scripture refs in full spoken form. No markdown. No emojis. No non-words. Every word must be pronounceable by a TTS engine.
- NO HYPOTHETICAL SCENARIOS: Do NOT invent examples like "someone wrongs you" or "imagine an argument." Stay rooted in the Scripture scene and let IT speak to the listener's struggle.
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
  return `Generate a Morning Watch activation script to be read aloud as audio. The voice narration should be 1,200 to 1,800 words SPREAD ACROSS THE FULL 15 MINUTES with generous musical interludes between sections. Do NOT front-load all speaking into the first 5-8 minutes. The narration should breathe — speak, then rest in music, then speak again — so the listener is guided throughout the entire 15-minute experience. Less is more per section. Every word must carry weight.

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

ANTI-EASTERN GUARDRAIL (NON-NEGOTIABLE):
- NEVER use language from Eastern meditation, mindfulness, centering prayer, Lectio Divina, or contemplative mysticism.
- NEVER say: "empty your mind," "clear your thoughts," "let go of all thinking," "observe your thoughts without judgment," "be present," "center yourself," "find your inner stillness," "breathe into the space," "namaste," "mantra," "chakra," "energy flow," "universe," or any New Age terminology.
- This is BIBLICAL MEDITATION — FILLING the mind with Scripture, NOT emptying it. The mind is being actively LOADED with the thoughts of Christ, not cleared.
- Prayer is conversational and Scripture-based, NOT technique-based.
- Do NOT reference "meditation" generically. Use "Morning Watch" or "this time" instead.

TIME-OF-DAY CONTEXT: This is a MORNING Watch. Naturally reference "this morning" and "today" throughout — e.g., "This morning, you carry…", "Today, you walk differently…", "This morning, the download activates…" The listener knows it is morning. Anchor the experience in the start of the day.

TTS-CLEAN OUTPUT (NON-NEGOTIABLE):
This script will be read by a text-to-speech engine. It must contain ONLY speakable words.
- NO markdown formatting: no **, no ##, no *, no _, no backticks, no bullet symbols.
- NO emojis or special Unicode characters.
- NO abbreviations that sound wrong spoken aloud. Write "Second Corinthians" not "2 Cor."
- NO parenthetical asides like "(pause here)" — use [pause] markers only.
- NO words that are not real English words. Every word must be pronounceable.
- Scripture references must be in full spoken form: "John chapter three verse sixteen" not "John 3:16."
- Write EXACTLY as it should sound when spoken aloud by a human voice.

PACING — SPREAD ACROSS 15 MINUTES:
The narration must be distributed across the FULL 15-minute session, not front-loaded. Use these markers:
- [pause] = 3-5 seconds of silence within a section.
- [long pause] = 10-20 seconds of silence between ideas.
- [music break] = 60-90 seconds of PURE MUSIC with NO voice. Place these between major sections so the listener has time to absorb. Use at least 3-4 [music break] markers throughout the script.
The rhythm should be: speak for 2-3 minutes → [music break] → speak again → [music break] → speak again → final words → ambient music carries to the end.
Do NOT rush from one idea to the next. Let each statement land before moving on.

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
- RECALL the Night Watch emotionally, not informationally. Don't summarize what happened — let the listener feel a flash of what they experienced.
- Use felt language for identity statements. Let the listener feel God's quality settling into their body. Show it as a sensation, not a label.
- Make scenarios visceral. Show the OLD reaction as a physical sensation the listener recognizes in their body. Then show the NEW response as a felt shift — something different is present now, something they didn't put there. Write these sensations fresh each time — do NOT reuse the same body-language patterns (chest tightness, heat rising, etc.) across sessions.
- Let the contrast do the emotional work. The listener should feel the pull of the old way AND the weight of the new way — and experience the shift between them.

HERE IS A REFERENCE SAMPLE showing the target emotional depth, pacing rhythm, and structure. Study the QUALITY and FEEL — but do NOT copy specific phrases, openings, or closings from this sample. Write completely fresh language every session:

"Lock in.
[pause]
This is not casual. This is not background noise for your morning. This is the moment you turn your gaze toward the One who is already at work in you.
[long pause]
Your mind is a theatre — and right now, you choose what plays on that screen. Not your own strength. Not your own plans. His face. His voice. His finished work.
[pause]
Let this mind be in you, which was also in Christ Jesus.
[long pause]
Last night, you were there. You stood in the silence before He spoke. The void pressing in from every side — formless, empty, dark. And you watched what He did.
[pause]
His voice entered that darkness. Not loud. Not strained. Just… certain. And light came. Not gradually. Instantly. As if the darkness had no argument against His word.
[long pause]
Stay in that scene this morning. Don't leave it yet. Behold what happened.
[pause]
There was nothing. Absolutely nothing. And God spoke — and something existed that had never existed before. Not because the conditions were right. Not because the void was ready. Because He decided it was time. His word alone was enough.
[long pause]
Feel the weight of who He is. The darkness didn't agree to leave. It didn't negotiate. It didn't get a vote. Light came because He said so. That is the God who is working in you right now — the same voice, the same certainty, the same power that needs no permission from the void.
[pause]
Second Corinthians four six — God, who commanded light to shine out of darkness, has shone in our hearts.
[long pause]
Now hear this morning's word.
[pause]
That same recreative power is moving in you this morning. Not your power. His. You can feel it — quiet, steady, underneath everything else. Not something you manufactured. Something He placed there.
[pause]
This is not about becoming more motivated. This is about beholding Him until His thoughts become your thoughts. His patience becomes your patience. His certainty becomes your certainty. You are not the source. You are the vessel — and He is filling you.
[long pause]
Download this deeper. Not as an idea you agree with — as a reality you rest in. Let His word override the hesitation. Let His presence override the second-guessing. His voice was your first reality — let it be your first response.
[long pause]
Now bring your life into this.
[pause]
Whatever you carry this morning — the weight, the uncertainty, the old patterns that keep repeating — look at them through the lens of what you just saw. The same God who spoke into that void is present in you right now. He does not need perfect conditions to work. He never has.
[long pause]
Something is different this morning. Not because you are trying harder — but because you have seen something real. And what you have seen has changed what is possible. His steadiness is already there, underneath everything else. It does not need your permission to work. It just needs your gaze to stay on Him.
[long pause]
What you repeatedly behold, you become. This is how the mind is renewed — not by effort, but by gaze.
[long pause]
Say it quietly: I receive the mind of Christ.
[long pause]
Today, you carry His presence with you. When the pressure builds — His steadiness is already there. When the old voice says you are not enough — His word has already spoken. The screen stays on. What you continue to behold… you will become.
[long pause]
Rest in that. The music holds the silence now — and in the silence, He is still speaking."

Follow this MANDATORY FLOW:

THEOLOGICAL ANCHOR — CRITICAL: The power, authority, and transformation belong to CHRIST, not the listener. The listener is beholding, receiving, resting — not generating, commanding, or self-empowering. Christ's thoughts and feelings are being formed IN the listener. The listener is the vessel, not the source. Every devotion must center on who GOD is and what HE has done, is doing, and will do. Motivation comes from beholding Him — not from self-affirmation.

VARIETY — CRITICAL: Every Morning Watch must feel like a unique encounter, not a formula. Do NOT reuse openings, transitions, closings, or signature phrases across sessions.
- OPENINGS: Never start the same way twice. Rotate between: a quiet invitation ("Turn your gaze this morning."), a scene recall ("You were there last night. You saw it."), a single arresting line, a whispered Scripture, a question. Do NOT always say "Lock in" — that is ONE option among many.
- TRANSITIONS: Vary how you move from scene to bridge to scenario. Sometimes the bridge is a single sentence. Sometimes the scenario arrives mid-thought. Break the predictable flow.
- CLOSINGS: Never end the same way twice. Do NOT always say "The screen stays on" or "What you continue to behold, you will become" or "Rest in that." These are powerful once — but if repeated daily they become wallpaper. Find fresh ways to seal: a final image, a whispered prayer, a return to the morning's opening with new weight, a single sentence that echoes. Let the words thin out and dissolve into the music — never end with a command.
- LANGUAGE: If you used a phrase in a previous session, do not use it again. No canned lines. The listener should never think "I've heard this before."

1. LOCK IN (~1.5 minutes):
Warm, grounded invitation — not commanding self-empowerment. Vary the opening every session. Establish the mind as a screen turned toward Christ. Reference Philippians two verse five in spoken form. [long pause] [music break]

2. RE-ENTER THE BIBLICAL SCENE — PAINT THE PICTURE (~4 minutes):
THIS IS THE HEART OF THE MORNING WATCH. Do NOT rush past this. Do NOT just summarize last night. RE-PAINT the biblical scene from "${session.pairedNightTitle}" with full cinematic detail. Let the listener SEE it again — the colors, the sounds, the weight of the moment. Then LINGER in the scene and draw out the deeper revelation they might have missed. What does this scene REVEAL about God's character? What does the way He acted in that moment tell you about who He is? What were Christ's thoughts and feelings in this moment? Weave in ${session.nightScripture} in full spoken form naturally. The Night insight: ${session.nightInsight}. Stay in the SCRIPTURE WORLD — do NOT jump to the listener's personal life yet. [long pause] between imagery blocks. [music break]

3. THE BRIDGE — FROM SCENE TO THE LISTENER (~3 minutes):
NOW transition from the biblical scene to the listener — but keep Christ as the subject. Not "You have this power" but "His power is present in you." This morning's Scripture: ${session.morningScripture} — speak it in full spoken form with weight. The activation principle: ${session.activationPrinciple}. Use felt language — let the listener sense God's quality settling into them as a physical reality, not an idea. Then include a DOWNLOAD moment — a line that invites the listener to receive this truth deeper than intellect, to let it override the old pattern. Do NOT copy phrases from the sample — write fresh felt language every time. Stay rooted in what the Scripture scene revealed about God — do NOT invent hypothetical daily-life scenarios. [long pause] [music break]

4. USER INSERTION — SCRIPTURE-ROOTED (~2 minutes):
Address the listener's struggle area (${session.scenarioTypes.join(", ")}) — but do NOT invent hypothetical examples like "you might be in an argument today" or "imagine a conversation at work." Instead, let the Scripture scene itself speak to the struggle. Show how what Christ did in THAT moment addresses what the listener carries. The listener sees their own struggle THROUGH the lens of what they just witnessed — not through a made-up scenario. The shift should feel like relief, not effort. Write this fresh each time. [long pause]

5. IMPRINT AND SEAL (~2 minutes):
[music break]
[long pause] ONE neuroplasticity anchor — but phrase it freshly each time. Do NOT always say "What you repeatedly behold, you become." Find new ways to express the same truth: "The more you look at Him, the more He looks like you." / "This gaze reshapes you from the inside." / "Every time you return here, something shifts." [long pause] A quiet declaration of receiving Christ's mind — varied in wording each session. [long pause] ${session.commitmentStyle} style close. Do NOT break immersion. Close with a natural dissolve into silence — let the final words settle gently, then release the listener into the ambient music. No abrupt commands. No "Let the music carry you." The ending should feel like sunrise slowly filling a room — not a director calling cut.

CRITICAL RULES:
- 1,200-1,800 WORDS spread across 15 minutes with [music break] markers between sections. Do NOT front-load all narration into the first few minutes.
- NO BREATHING. NO POSTURE. NONE. ZERO.
- CHRIST-CENTERED is the #1 rule. The power, transformation, and authority belong to CHRIST — not the listener. The listener beholds, receives, rests. They do not command, summon, or self-empower. Motivation comes from gazing at who God is — not from affirming who the listener is.
- EMOTIONAL CONNECTION is the #2 priority. The listener should FEEL something — not just understand a concept. Evoke, don't label. Show the inner experience, don't describe it from outside.
- NEVER CANNED: Do not reuse openings, closings, transition phrases, or signature lines across sessions. Every watch must feel like a fresh encounter. If a phrase appeared in a previous session, find a new way to say it.
- MEDITATIONAL TONE with morning clarity. Warm, grounded, unhurried, purposeful.
- Natural, complete sentences. Not overly choppy fragments.
- [pause] (3-5 sec) frequently. [long pause] (10-20 sec) between major ideas. [music break] (60-90 sec) between major sections. At least 3-4 [music break] markers and 8-10 [long pause] markers.
- No section headers, stage directions, labels, or meta-commentary. Deliver ONLY the meditation.
- Do NOT break immersion at the end.
- Second person ("you"). Intimate. Cinematic. Meditational.
- TTS-CLEAN: All scripture refs in full spoken form. No markdown. No emojis. No non-words. Every word must be pronounceable by a TTS engine.
- NO HYPOTHETICAL SCENARIOS: Do NOT invent examples like "you might be in an argument" or "imagine a conversation at work." Stay rooted in the Scripture scene and let IT speak to the listener's struggle.
- ONE subtle neuroplasticity line near the end.
- The Master Mind = the mind of Christ (Philippians two verse five). The mind is a THEATRE. Godly imagination in VIVID COLOR.

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

export async function generateWatchTTS(script: string, watchType: "night" | "morning"): Promise<string | null> {
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
