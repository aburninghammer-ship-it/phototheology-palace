import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { AccessToken } from "https://esm.sh/livekit-server-sdk@2.6.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const livekitApiKey = Deno.env.get("LIVEKIT_API_KEY");
    const livekitApiSecret = Deno.env.get("LIVEKIT_API_SECRET");

    if (!livekitApiKey || !livekitApiSecret) {
      throw new Error("LiveKit credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { roomName, participantName } = await req.json();

    if (!roomName) {
      throw new Error("roomName is required");
    }

    // Check if user is admin/host
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    const isHost = !!adminData;

    // Generate LiveKit access token with role-based permissions
    const at = new AccessToken(livekitApiKey, livekitApiSecret, {
      identity: user.id,
      name: participantName || "Anonymous",
    });

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      // Host can publish video + audio; members can only publish audio
      canPublishSources: isHost
        ? ["camera", "microphone", "screen_share", "screen_share_audio"] as any
        : ["microphone"] as any,
    });

    const jwt = await at.toJwt();

    return new Response(JSON.stringify({ token: jwt, isHost }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating LiveKit token:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to generate token",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
