import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getContentBehavioralEngine } from '../_shared/content-behavioral-engine.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let userId: string | null = null;
    if (token && token !== SUPABASE_SERVICE_ROLE_KEY) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = user.id;
    }

    const { lessonId, forceRegenerate = false } = await req.json();

    if (!lessonId) {
      return new Response(JSON.stringify({ error: "lessonId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check for existing ready audio
    if (!forceRegenerate) {
      const { data: existing } = await supabase
        .from("baptism_study_audio")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("voice", "nova")
        .eq("status", "ready")
        .maybeSingle();

      if (existing?.public_url) {
        return new Response(JSON.stringify({
          status: "ready",
          audioUrl: existing.public_url,
          shareToken: existing.share_token,
          durationSeconds: existing.duration_seconds,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Get lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from("baptism_lessons")
      .select("*")
      .eq("id", lessonId)
      .single();

    if (lessonError || !lesson) {
      return new Response(JSON.stringify({ error: "Lesson not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create or update the audio record as "generating"
    const shareToken = "BS" + crypto.randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase();

    const { data: audioRecord, error: insertError } = await supabase
      .from("baptism_study_audio")
      .upsert({
        lesson_id: lessonId,
        fundamental_number: lesson.fundamental_number,
        title: lesson.title,
        storage_path: `lesson-${lesson.fundamental_number}/audio.mp3`,
        voice: "nova",
        status: "generating",
        share_token: shareToken,
        generated_by: userId,
      }, { onConflict: "lesson_id,voice" })
      .select()
      .single();

    if (insertError) {
      console.error("[BaptismAudio] Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create audio record" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate the teaching script via Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const scripturePack = lesson.scripture_pack || {};
    const scriptureList = Array.isArray(scripturePack)
      ? scripturePack.map((s: any) => `${s.reference}: ${s.text || ""}`).join("\n")
      : typeof scripturePack === "object"
        ? Object.entries(scripturePack).map(([k, v]) => `${k}: ${v}`).join("\n")
        : String(scripturePack);

    console.log(`[BaptismAudio] Generating script for lesson ${lesson.fundamental_number}: ${lesson.title}`);

    const scriptResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a warm, clear Bible teacher creating an audio lesson for baptismal candidates. 
Write a 10-15 minute spoken script (approximately 1500-2000 words) that teaches this fundamental belief.

Guidelines:
- Use KJV Scripture quotes throughout
- Speak directly to the listener ("you", "we")  
- Open with a warm greeting and the lesson title
- Present the teaching clearly with Scripture support
- Address common questions or objections briefly
- Close with encouragement and a prayer
- Use natural spoken language, NOT written/academic style
- Include brief pauses indicated by "..." for dramatic effect
- Do NOT include stage directions, headers, or formatting — just the spoken words`,
          },
          {
            role: "user",
            content: `Create a spoken audio lesson for Fundamental Belief #${lesson.fundamental_number}: "${lesson.title}"

Description: ${lesson.description || ""}

Key Scriptures:
${scriptureList}

Write the complete spoken script now.`,
          },
        ],
        max_tokens: 4000,
      }),
    });

    if (!scriptResponse.ok) {
      const errText = await scriptResponse.text();
      console.error("[BaptismAudio] AI error:", scriptResponse.status, errText);

      // Handle rate limits
      if (scriptResponse.status === 429 || scriptResponse.status === 402) {
        await supabase.from("baptism_study_audio").update({
          status: "error",
          error_message: scriptResponse.status === 429 ? "Rate limited, try again later" : "Credits required",
        }).eq("id", audioRecord.id);

        return new Response(JSON.stringify({
          error: scriptResponse.status === 429 ? "Rate limited, please try again in a moment" : "AI credits needed. Please try again later.",
        }), {
          status: scriptResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI generation failed: ${scriptResponse.status}`);
    }

    const scriptData = await scriptResponse.json();
    const script = scriptData.choices?.[0]?.message?.content;

    if (!script) {
      throw new Error("No script generated");
    }

    console.log(`[BaptismAudio] Script generated: ${script.length} chars`);

    // Generate TTS via the existing text-to-speech function
    // Split into segments if needed (max ~3900 chars per segment for OpenAI TTS)
    const MAX_SEGMENT = 3900;
    const segments: string[] = [];
    let remaining = script;

    while (remaining.length > 0) {
      if (remaining.length <= MAX_SEGMENT) {
        segments.push(remaining);
        break;
      }
      // Find a good break point
      let breakPoint = remaining.lastIndexOf(".", MAX_SEGMENT);
      if (breakPoint < MAX_SEGMENT * 0.5) breakPoint = remaining.lastIndexOf(" ", MAX_SEGMENT);
      if (breakPoint < MAX_SEGMENT * 0.5) breakPoint = MAX_SEGMENT;
      segments.push(remaining.substring(0, breakPoint + 1));
      remaining = remaining.substring(breakPoint + 1).trim();
    }

    console.log(`[BaptismAudio] Generating TTS for ${segments.length} segments`);

    // Generate audio for each segment
    const audioChunks: Uint8Array[] = [];

    for (let i = 0; i < segments.length; i++) {
      console.log(`[BaptismAudio] TTS segment ${i + 1}/${segments.length} (${segments[i].length} chars)`);

      const ttsResponse = await fetch(`${SUPABASE_URL}/functions/v1/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          text: segments[i],
          voice: "nova",
          returnType: "base64",
        }),
      });

      if (!ttsResponse.ok) {
        const errBody = await ttsResponse.text();
        console.error(`[BaptismAudio] TTS error segment ${i + 1}:`, errBody);
        throw new Error(`TTS failed for segment ${i + 1}: ${ttsResponse.status}`);
      }

      const ttsData = await ttsResponse.json();

      if (ttsData.audioContent) {
        // Decode base64 to bytes
        const binaryStr = atob(ttsData.audioContent);
        const bytes = new Uint8Array(binaryStr.length);
        for (let j = 0; j < binaryStr.length; j++) {
          bytes[j] = binaryStr.charCodeAt(j);
        }
        audioChunks.push(bytes);
      } else if (ttsData.audioUrl) {
        // Fetch the audio from URL
        const audioResp = await fetch(ttsData.audioUrl);
        if (audioResp.ok) {
          const blob = await audioResp.arrayBuffer();
          audioChunks.push(new Uint8Array(blob));
        }
      }

      // Brief pause between segments
      if (i < segments.length - 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }

    if (audioChunks.length === 0) {
      throw new Error("No audio generated");
    }

    // Concatenate all chunks
    const totalLength = audioChunks.reduce((sum, c) => sum + c.length, 0);
    const fullAudio = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      fullAudio.set(chunk, offset);
      offset += chunk.length;
    }

    console.log(`[BaptismAudio] Total audio: ${totalLength} bytes`);

    // Upload to storage
    const storagePath = `lesson-${lesson.fundamental_number}/audio-${Date.now()}.mp3`;

    const { error: uploadError } = await supabase.storage
      .from("baptism-study-audio")
      .upload(storagePath, fullAudio, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      console.error("[BaptismAudio] Upload error:", uploadError);
      throw new Error("Failed to upload audio");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("baptism-study-audio")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // Estimate duration (~150 words per minute, ~5 chars per word)
    const estimatedDuration = Math.round((script.length / 5 / 150) * 60);

    // Update record
    await supabase.from("baptism_study_audio").update({
      storage_path: storagePath,
      public_url: publicUrl,
      status: "ready",
      file_size_bytes: totalLength,
      duration_seconds: estimatedDuration,
      error_message: null,
    }).eq("id", audioRecord.id);

    console.log(`[BaptismAudio] ✅ Complete: ${lesson.title} — ${publicUrl}`);

    return new Response(JSON.stringify({
      status: "ready",
      audioUrl: publicUrl,
      shareToken: audioRecord.share_token,
      durationSeconds: estimatedDuration,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[BaptismAudio] Error:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error",
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
