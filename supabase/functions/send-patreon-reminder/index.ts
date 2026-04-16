import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify admin access
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user }, error: authError } = await createClient(
        supabaseUrl,
        Deno.env.get("SUPABASE_ANON_KEY")!
      ).auth.getUser(token);
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if user is admin
      const { data: adminUser } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!adminUser) {
        return new Response(
          JSON.stringify({ error: "Admin access required" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const patreonAccessToken = Deno.env.get("PATREON_CREATOR_ACCESS_TOKEN");
    if (!patreonAccessToken) {
      throw new Error("PATREON_CREATOR_ACCESS_TOKEN not configured");
    }

    // Fetch campaign ID first
    console.log("Fetching Patreon campaign...");
    const campaignResponse = await fetch(
      "https://www.patreon.com/api/oauth2/v2/campaigns?fields[campaign]=created_at,creation_name",
      {
        headers: {
          Authorization: `Bearer ${patreonAccessToken}`,
        },
      }
    );

    if (!campaignResponse.ok) {
      const errorText = await campaignResponse.text();
      console.error("Campaign fetch failed:", errorText);
      throw new Error(`Failed to fetch Patreon campaign: ${campaignResponse.status}`);
    }

    const campaignData = await campaignResponse.json();
    const campaignId = campaignData.data?.[0]?.id;
    
    if (!campaignId) {
      throw new Error("No Patreon campaign found");
    }

    console.log("Campaign ID:", campaignId);

    // Fetch all members of the campaign
    console.log("Fetching Patreon members...");
    const membersResponse = await fetch(
      `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=user&fields[member]=email,full_name,patron_status,currently_entitled_amount_cents&fields[user]=email,full_name`,
      {
        headers: {
          Authorization: `Bearer ${patreonAccessToken}`,
        },
      }
    );

    if (!membersResponse.ok) {
      const errorText = await membersResponse.text();
      console.error("Members fetch failed:", errorText);
      throw new Error(`Failed to fetch Patreon members: ${membersResponse.status}`);
    }

    const membersData = await membersResponse.json();
    console.log("Raw members data:", JSON.stringify(membersData, null, 2));

    // Get active patrons with emails
    const activePatrons: { email: string; name: string; patreonUserId: string }[] = [];
    
    for (const member of membersData.data || []) {
      const attrs = member.attributes;
      if (attrs.patron_status === "active_patron" && attrs.email) {
        // Get user ID from relationships
        const userId = member.relationships?.user?.data?.id;
        activePatrons.push({
          email: attrs.email,
          name: attrs.full_name || "Patron",
          patreonUserId: userId || member.id,
        });
      }
    }

    console.log("Active patrons found:", activePatrons.length);

    // Get already connected Patreon users
    const { data: connectedUsers, error: connError } = await supabase
      .from("patreon_connections")
      .select("patreon_user_id");

    if (connError) {
      console.error("Error fetching connected users:", connError);
      throw connError;
    }

    const connectedPatreonIds = new Set(
      (connectedUsers || []).map((u) => u.patreon_user_id)
    );

    console.log("Connected Patreon IDs:", Array.from(connectedPatreonIds));

    // Filter to only unconnected patrons
    const unconnectedPatrons = activePatrons.filter(
      (p) => !connectedPatreonIds.has(p.patreonUserId)
    );

    console.log("Unconnected patrons to remind:", unconnectedPatrons.length);

    if (unconnectedPatrons.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "All active patrons are already connected!",
          totalPatrons: activePatrons.length,
          connectedPatrons: connectedPatreonIds.size,
          emailsSent: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send reminder emails using Resend API directly
    const emailResults: { email: string; success: boolean; error?: string }[] = [];
    const appUrl = "https://phototheologybible.com";

    for (const patron of unconnectedPatrons) {
      try {
        console.log(`Sending reminder to ${patron.email}...`);
        
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Phototheology <noreply@thephototheologyapp.com>",
            to: [patron.email],
            subject: "Connect Your Patreon for Premium Access 🎁",
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #1a1a2e; margin-bottom: 24px;">Hey ${patron.name}! 👋</h1>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">
                  Thank you for being an amazing Patreon supporter! We noticed you haven't connected your Patreon account to Phototheology yet.
                </p>
                
                <p style="font-size: 16px; line-height: 1.6; color: #333;">
                  By connecting, you'll unlock your <strong>Premium benefits</strong> including:
                </p>
                
                <ul style="font-size: 16px; line-height: 1.8; color: #333;">
                  <li>✨ Full access to all Palace floors and rooms</li>
                  <li>🤖 Unlimited Jeeves AI conversations</li>
                  <li>📚 All Bible study tools and challenges</li>
                  <li>🎯 Exclusive Patreon-only content</li>
                </ul>
                
                <div style="text-align: center; margin: 32px 0;">
                  <a href="${appUrl}/auth?patreon=true" 
                     style="display: inline-block; background: linear-gradient(135deg, #FF424D 0%, #FF6B6B 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Connect Patreon Now
                  </a>
                </div>
                
                <p style="font-size: 14px; color: #666; margin-top: 24px;">
                  If you have any questions, just reply to this email!
                </p>
                
                <p style="font-size: 16px; color: #333;">
                  Blessings,<br>
                  The Phototheology Team
                </p>
              </div>
            `,
          }),
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          throw new Error(errorData.message || `HTTP ${emailResponse.status}`);
        }

        const result = await emailResponse.json();
        emailResults.push({ email: patron.email, success: true });
        console.log(`Email sent to ${patron.email}:`, result);
      } catch (emailError: any) {
        console.error(`Failed to send to ${patron.email}:`, emailError);
        emailResults.push({ 
          email: patron.email, 
          success: false, 
          error: emailError.message 
        });
      }
    }

    const successCount = emailResults.filter((r) => r.success).length;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${successCount} reminder emails`,
        totalPatrons: activePatrons.length,
        connectedPatrons: connectedPatreonIds.size,
        emailsSent: successCount,
        results: emailResults,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-patreon-reminder:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
