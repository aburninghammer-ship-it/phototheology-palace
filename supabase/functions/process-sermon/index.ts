import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// YouTube transcript fetching
async function fetchYouTubeTranscript(videoId: string): Promise<{
  transcript: string;
  source: "youtube_auto" | "youtube_manual";
  hasTimestamps: boolean;
  segments: Array<{ text: string; start: number; duration: number }>;
} | null> {
  try {
    // Try to get transcript via YouTube's timedtext API
    const langCodes = ["en", "en-US", "en-GB", "a.en"]; // Try multiple language codes

    for (const lang of langCodes) {
      try {
        // Fetch the video page to get transcript data
        const pageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
        const pageHtml = await pageResponse.text();

        // Extract captions data from the page
        const captionsMatch = pageHtml.match(/"captions":\s*(\{[^}]+\})/);
        if (!captionsMatch) continue;

        // Look for timedtext URL
        const timedtextMatch = pageHtml.match(/https:\/\/www\.youtube\.com\/api\/timedtext[^"]+/);
        if (timedtextMatch) {
          let timedtextUrl = timedtextMatch[0].replace(/\\u0026/g, "&");

          // Fetch the transcript
          const transcriptResponse = await fetch(timedtextUrl);
          if (transcriptResponse.ok) {
            const transcriptXml = await transcriptResponse.text();

            // Parse XML transcript
            const segments: Array<{ text: string; start: number; duration: number }> = [];
            const textMatches = transcriptXml.matchAll(/<text start="([^"]+)" dur="([^"]+)"[^>]*>([^<]*)<\/text>/g);

            for (const match of textMatches) {
              segments.push({
                start: parseFloat(match[1]),
                duration: parseFloat(match[2]),
                text: decodeHtmlEntities(match[3]),
              });
            }

            if (segments.length > 0) {
              const fullTranscript = segments.map(s => s.text).join(" ");
              return {
                transcript: fullTranscript,
                source: "youtube_auto",
                hasTimestamps: true,
                segments,
              };
            }
          }
        }
      } catch (e) {
        console.log(`Failed to fetch transcript for lang ${lang}:`, e);
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    return null;
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Extract YouTube video ID from various URL formats
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch YouTube video metadata
async function fetchVideoMetadata(videoId: string): Promise<{
  title: string;
  channel: string;
  publishedAt: string;
  duration: number;
  thumbnail: string;
} | null> {
  try {
    // Use oEmbed API (no API key required)
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const response = await fetch(oembedUrl);

    if (!response.ok) return null;

    const data = await response.json();

    return {
      title: data.title || "Untitled Sermon",
      channel: data.author_name || "Unknown",
      publishedAt: new Date().toISOString(),
      duration: 0, // oEmbed doesn't provide duration
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { action, youtubeUrl, sermonId, transcript: pastedTranscript } = body;

    // =========================================================================
    // ACTION: SUBMIT - Create new sermon from YouTube URL
    // =========================================================================
    if (action === "submit_youtube") {
      if (!youtubeUrl) {
        return new Response(JSON.stringify({ error: "YouTube URL required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        return new Response(JSON.stringify({ error: "Invalid YouTube URL" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Check if sermon already exists
      const { data: existingSermon } = await supabase
        .from("lm_sermons")
        .select("id, title, status")
        .eq("source_id", videoId)
        .single();

      if (existingSermon) {
        return new Response(JSON.stringify({
          success: true,
          sermon: existingSermon,
          message: "Sermon already exists",
          isExisting: true,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Fetch video metadata
      const metadata = await fetchVideoMetadata(videoId);
      if (!metadata) {
        return new Response(JSON.stringify({ error: "Could not fetch video information" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create sermon record
      const { data: sermon, error: sermonError } = await supabase
        .from("lm_sermons")
        .insert({
          source_type: "youtube",
          source_url: `https://www.youtube.com/watch?v=${videoId}`,
          source_id: videoId,
          title: metadata.title,
          speaker: "Pastor Ivor Myers", // Default for Living Manna
          thumbnail_url: metadata.thumbnail,
          status: "fetching_transcript",
          submitted_by: user.id,
        })
        .select()
        .single();

      if (sermonError) {
        console.error("Error creating sermon:", sermonError);
        return new Response(JSON.stringify({ error: "Failed to create sermon" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Try to fetch transcript
      const transcriptData = await fetchYouTubeTranscript(videoId);

      if (transcriptData) {
        // Save transcript
        await supabase.from("lm_sermon_transcripts").insert({
          sermon_id: sermon.id,
          raw_text: transcriptData.transcript,
          transcript_source: transcriptData.source,
          has_timestamps: transcriptData.hasTimestamps,
          word_count: transcriptData.transcript.split(/\s+/).length,
        });

        // Update sermon status
        await supabase
          .from("lm_sermons")
          .update({ status: "transcript_ready" })
          .eq("id", sermon.id);

        return new Response(JSON.stringify({
          success: true,
          sermon: { ...sermon, status: "transcript_ready" },
          hasTranscript: true,
          message: "Sermon submitted with transcript",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        // No transcript found
        await supabase
          .from("lm_sermons")
          .update({ status: "pending" })
          .eq("id", sermon.id);

        return new Response(JSON.stringify({
          success: true,
          sermon: { ...sermon, status: "pending" },
          hasTranscript: false,
          message: "Sermon submitted but no transcript found. Please paste transcript manually or request audio transcription.",
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // =========================================================================
    // ACTION: PASTE_TRANSCRIPT - Add transcript manually
    // =========================================================================
    if (action === "paste_transcript") {
      if (!sermonId || !pastedTranscript) {
        return new Response(JSON.stringify({ error: "Sermon ID and transcript required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Save transcript
      const { error: transcriptError } = await supabase
        .from("lm_sermon_transcripts")
        .insert({
          sermon_id: sermonId,
          raw_text: pastedTranscript,
          transcript_source: "user_pasted",
          has_timestamps: false,
          word_count: pastedTranscript.split(/\s+/).length,
        });

      if (transcriptError) {
        console.error("Error saving transcript:", transcriptError);
        return new Response(JSON.stringify({ error: "Failed to save transcript" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Update sermon status
      await supabase
        .from("lm_sermons")
        .update({ status: "transcript_ready" })
        .eq("id", sermonId);

      return new Response(JSON.stringify({
        success: true,
        message: "Transcript saved successfully",
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // =========================================================================
    // ACTION: GET_STATUS - Check sermon processing status
    // =========================================================================
    if (action === "get_status") {
      if (!sermonId) {
        return new Response(JSON.stringify({ error: "Sermon ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: sermon, error } = await supabase
        .from("lm_sermons")
        .select(`
          *,
          lm_sermon_transcripts (id, word_count, transcript_source),
          lm_sermon_segments (count),
          lm_sermon_insights (count)
        `)
        .eq("id", sermonId)
        .single();

      if (error || !sermon) {
        return new Response(JSON.stringify({ error: "Sermon not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true, sermon }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in process-sermon:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
