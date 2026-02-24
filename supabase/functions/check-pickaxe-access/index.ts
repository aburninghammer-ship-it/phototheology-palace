import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function checks if a user signing up/logging in has Pickaxe premium access
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user?.email) {
      throw new Error("User not authenticated");
    }

    console.log(`Checking Pickaxe access for: ${user.email}`);

    // Check if this email has a Pickaxe paid subscription
    let pickaxeConnection = null;
    try {
      const { data, error: pickaxeError } = await supabase
        .from("pickaxe_connections")
        .select("*")
        .eq("pickaxe_email", user.email.toLowerCase())
        .eq("is_paid_user", true)
        .maybeSingle();

      if (pickaxeError) {
        console.error("Error checking pickaxe connection:", pickaxeError);
        // Return gracefully instead of throwing - treat as no access
        return new Response(
          JSON.stringify({ hasPremiumAccess: false, error: "db_timeout" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      pickaxeConnection = data;
    } catch (dbError) {
      console.error("DB connection error:", dbError);
      return new Response(
        JSON.stringify({ hasPremiumAccess: false, error: "db_timeout" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!pickaxeConnection) {
      console.log(`No paid Pickaxe subscription found for: ${user.email}`);
      return new Response(
        JSON.stringify({ hasPremiumAccess: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Found Pickaxe premium for: ${user.email}, linking account...`);

    // Link the connection to this user if not already linked
    if (!pickaxeConnection.user_id) {
      await supabase
        .from("pickaxe_connections")
        .update({ 
          user_id: user.id,
          access_granted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq("id", pickaxeConnection.id);
    }

    // Grant premium access to the user's profile
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        subscription_tier: "premium",
        subscription_status: "active",
        payment_source: "pickaxe",
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
    }

    console.log(`Premium access granted to: ${user.email}`);

    return new Response(
      JSON.stringify({ 
        hasPremiumAccess: true,
        pickaxeName: pickaxeConnection.pickaxe_name,
        accessGranted: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Check Pickaxe access error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
