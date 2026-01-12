import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SYNC-PATREON-MEMBERS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const creatorAccessToken = Deno.env.get("PATREON_CREATOR_ACCESS_TOKEN");
    if (!creatorAccessToken) {
      throw new Error("PATREON_CREATOR_ACCESS_TOKEN not configured");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized - admin access required");
    logStep("Admin verified", { userId: userData.user.id });

    // First, get the campaign ID
    const campaignResponse = await fetch(
      "https://www.patreon.com/api/oauth2/v2/campaigns?fields[campaign]=creation_name,patron_count",
      {
        headers: {
          "Authorization": `Bearer ${creatorAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!campaignResponse.ok) {
      const errorText = await campaignResponse.text();
      logStep("Campaign fetch error", { status: campaignResponse.status, error: errorText });
      throw new Error(`Failed to fetch campaign: ${errorText}`);
    }

    const campaignData = await campaignResponse.json();
    const campaignId = campaignData.data?.[0]?.id;
    
    if (!campaignId) {
      throw new Error("No campaign found for this creator");
    }

    logStep("Campaign found", { 
      campaignId, 
      name: campaignData.data?.[0]?.attributes?.creation_name,
      patronCount: campaignData.data?.[0]?.attributes?.patron_count 
    });

    // Fetch all members with pagination
    const allMembers: any[] = [];
    let nextUrl: string | null = `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?include=user&fields[member]=full_name,email,patron_status,currently_entitled_amount_cents,lifetime_support_cents,last_charge_status,last_charge_date,pledge_relationship_start&fields[user]=email,full_name&page[count]=500`;
    let pageCount = 0;
    const maxPages = 50; // Safety limit

    while (nextUrl && pageCount < maxPages) {
      pageCount++;
      logStep("Fetching page", { page: pageCount, url: nextUrl.substring(0, 100) + "..." });
      
      const currentUrl = nextUrl;
      nextUrl = null; // Reset before fetch
      
      const membersResponse: Response = await fetch(currentUrl, {
        headers: {
          "Authorization": `Bearer ${creatorAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!membersResponse.ok) {
        const errorText = await membersResponse.text();
        logStep("Members fetch error", { status: membersResponse.status, error: errorText });
        throw new Error(`Failed to fetch members: ${errorText}`);
      }

      const membersData: {
        data?: Array<{
          id: string;
          attributes: {
            email?: string;
            full_name?: string;
            patron_status?: string;
            currently_entitled_amount_cents?: number;
            lifetime_support_cents?: number;
            last_charge_status?: string;
            last_charge_date?: string;
            pledge_relationship_start?: string;
          };
          relationships?: {
            user?: { data?: { id: string } };
          };
        }>;
        included?: Array<{
          type: string;
          id: string;
          attributes: { email?: string; full_name?: string };
        }>;
        links?: { next?: string };
      } = await membersResponse.json();
      
      // Build a map of user data
      const usersMap = new Map<string, { email?: string; full_name?: string }>();
      if (membersData.included) {
        for (const item of membersData.included) {
          if (item.type === 'user') {
            usersMap.set(item.id, item.attributes);
          }
        }
      }

      // Process members
      for (const member of membersData.data || []) {
        const attrs = member.attributes;
        const userId = member.relationships?.user?.data?.id;
        const userDataFromIncluded = userId ? usersMap.get(userId) : null;
        
        allMembers.push({
          patreon_id: member.id,
          email: attrs.email || userDataFromIncluded?.email || null,
          full_name: attrs.full_name || userDataFromIncluded?.full_name || null,
          patron_status: attrs.patron_status,
          pledge_cents: attrs.currently_entitled_amount_cents || 0,
          lifetime_support_cents: attrs.lifetime_support_cents || 0,
          last_charge_status: attrs.last_charge_status,
          last_charge_date: attrs.last_charge_date,
          is_follower: attrs.patron_status === 'free_member',
          joined_at: attrs.pledge_relationship_start,
          synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      logStep("Page processed", { membersInPage: membersData.data?.length, totalSoFar: allMembers.length });

      // Check for next page
      nextUrl = membersData.links?.next || null;
      
      // Small delay to avoid rate limiting
      if (nextUrl) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    logStep("All members fetched", { total: allMembers.length });

    // Upsert all members to database
    let upserted = 0;
    const batchSize = 100;

    for (let i = 0; i < allMembers.length; i += batchSize) {
      const batch = allMembers.slice(i, i + batchSize);
      
      const { error: upsertError } = await supabaseClient
        .from("patreon_members")
        .upsert(batch, { 
          onConflict: 'patreon_id',
          ignoreDuplicates: false 
        });

      if (upsertError) {
        logStep("Upsert error", { batch: i / batchSize, error: upsertError.message });
      } else {
        upserted += batch.length;
      }
    }

    logStep("Sync complete", { total: allMembers.length, upserted });

    // Get stats for the response
    const { data: stats } = await supabaseClient.rpc('get_patreon_member_stats');
    
    // Fallback stats query if RPC doesn't exist
    const { data: countData } = await supabaseClient
      .from("patreon_members")
      .select("patron_status, email")
      .throwOnError();

    const statsResult = {
      total_members: countData?.length || 0,
      active_patrons: countData?.filter(m => m.patron_status === 'active_patron').length || 0,
      with_email: countData?.filter(m => m.email).length || 0,
      free_members: countData?.filter(m => m.patron_status === 'free_member').length || 0,
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        synced: upserted,
        total: allMembers.length,
        stats: statsResult,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
