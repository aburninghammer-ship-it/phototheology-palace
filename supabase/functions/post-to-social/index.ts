import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PostToSocialRequest {
  platform: 'facebook' | 'twitter' | 'linkedin';
  content: string;
  url?: string;
  imageUrl?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { platform, content, url, imageUrl }: PostToSocialRequest = await req.json();

    // Get user's social media connection
    const { data: connection, error: connectionError } = await supabase
      .from("social_media_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("platform", platform)
      .eq("is_active", true)
      .single();

    if (connectionError || !connection) {
      throw new Error(`No active ${platform} connection found. Please connect your account first.`);
    }

    // Check if token is expired
    if (connection.token_expires_at && new Date(connection.token_expires_at) < new Date()) {
      throw new Error(`Your ${platform} token has expired. Please reconnect your account.`);
    }

    let response;
    
    // Post to respective platform
    switch (platform) {
      case 'facebook':
        response = await postToFacebook(content, url, imageUrl, connection.access_token);
        break;
      case 'twitter':
        response = await postToTwitter(content, url, imageUrl, connection.access_token);
        break;
      case 'linkedin':
        response = await postToLinkedIn(content, url, imageUrl, connection.access_token, connection.platform_user_id);
        break;
      default:
        throw new Error("Unsupported platform");
    }

    console.log(`Successfully posted to ${platform}:`, response);

    return new Response(
      JSON.stringify({ success: true, data: response }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error posting to social media:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

async function postToFacebook(message: string, link?: string, imageUrl?: string, accessToken?: string) {
  const pageId = Deno.env.get("FACEBOOK_PAGE_ID");
  const params = new URLSearchParams({
    message,
    access_token: accessToken || "",
  });
  
  if (link) params.append("link", link);
  
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/feed?${params}`,
    { method: "POST" }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Facebook API error: ${JSON.stringify(error)}`);
  }
  
  return await response.json();
}

async function postToTwitter(text: string, url?: string, imageUrl?: string, accessToken?: string) {
  const fullText = url ? `${text}\n\n${url}` : text;
  
  const response = await fetch("https://api.twitter.com/2/tweets", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: fullText }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Twitter API error: ${JSON.stringify(error)}`);
  }
  
  return await response.json();
}

async function postToLinkedIn(
  text: string,
  url?: string,
  imageUrl?: string,
  accessToken?: string,
  userId?: string
) {
  const commentary = url ? `${text}\n\n${url}` : text;
  
  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: `urn:li:person:${userId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: commentary,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`LinkedIn API error: ${JSON.stringify(error)}`);
  }
  
  return await response.json();
}
