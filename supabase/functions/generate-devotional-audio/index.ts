import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json().catch(() => ({}));
    const voice = body.voice || "nova";

    // Process ONE devotional at a time to avoid timeouts
    const { data: devotionals, error } = await supabase
      .from("daily_audio_devotionals")
      .select("*")
      .in("status", ["text_ready", "failed"])
      .order("day_number", { ascending: true })
      .limit(1);

    if (error) throw error;

    if (!devotionals || devotionals.length === 0) {
      return new Response(
        JSON.stringify({ message: "No devotionals need audio generation" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const dev = devotionals[0];
    console.log(`[DevotionalAudio] Generating audio for day ${dev.day_number}, voice: ${voice}`);

    await supabase
      .from("daily_audio_devotionals")
      .update({ status: "generating_audio", updated_at: new Date().toISOString() })
      .eq("id", dev.id);

    try {
      const script = buildAudioScript(dev);
      const chunks = splitIntoChunks(script, 4000);
      const audioBuffers: Uint8Array[] = [];

      for (const chunk of chunks) {
        const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "tts-1-hd",
            input: chunk,
            voice: voice,
            response_format: "mp3",
            speed: 0.95,
          }),
        });

        if (!ttsResponse.ok) {
          const errText = await ttsResponse.text();
          throw new Error(`OpenAI TTS error ${ttsResponse.status}: ${errText}`);
        }

        const arrayBuffer = await ttsResponse.arrayBuffer();
        audioBuffers.push(new Uint8Array(arrayBuffer));
      }

      // Combine audio chunks
      const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of audioBuffers) {
        combined.set(buf, offset);
        offset += buf.length;
      }

      // Upload to storage
      const storagePath = `day-${String(dev.day_number).padStart(3, "0")}.mp3`;

      const { error: uploadError } = await supabase.storage
        .from("daily-devotional-audio")
        .upload(storagePath, combined, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("daily-devotional-audio")
        .getPublicUrl(storagePath);

      const wordCount = script.split(/\s+/).length;
      const estimatedDuration = Math.round((wordCount / 150) * 60);

      await supabase
        .from("daily_audio_devotionals")
        .update({
          audio_storage_path: storagePath,
          audio_url: urlData.publicUrl,
          audio_duration_seconds: estimatedDuration,
          status: "ready",
          error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dev.id);

      console.log(`[DevotionalAudio] Day ${dev.day_number}: audio ready (${estimatedDuration}s)`);

      return new Response(
        JSON.stringify({ day: dev.day_number, status: "ready", duration: estimatedDuration }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      console.error(`[DevotionalAudio] Day ${dev.day_number} failed:`, err.message);
      await supabase
        .from("daily_audio_devotionals")
        .update({ status: "failed", error_message: err.message, updated_at: new Date().toISOString() })
        .eq("id", dev.id);
      return new Response(
        JSON.stringify({ day: dev.day_number, status: "failed", error: err.message }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error: any) {
    console.error("[DevotionalAudio] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildAudioScript(devotional: any): string {
  const parts: string[] = [];
  parts.push(`Day ${devotional.day_number}. ${devotional.title}.`);
  parts.push("");
  if (devotional.scripture_reference) {
    parts.push(`Today's scripture: ${devotional.scripture_reference}.`);
  }
  if (devotional.scripture_text) {
    parts.push(`"${devotional.scripture_text}"`);
    parts.push("");
  }
  parts.push(devotional.devotional_text);
  parts.push("");
  if (devotional.prayer) {
    parts.push(`Let us pray. ${devotional.prayer}`);
  }
  // Replace {{name}} with "friend" for the generic audio version
  return parts.join("\n").replace(/\{\{name\}\}/g, "friend");
}

function splitIntoChunks(text: string, maxLen: number): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";
  for (const sentence of sentences) {
    if ((current + " " + sentence).length > maxLen && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? current + " " + sentence : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}
