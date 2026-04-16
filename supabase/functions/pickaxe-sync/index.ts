import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PickaxeUser {
  email: string;
  name: string | null;
  picture: string | null;
  type: "member" | "paid";
  memories: number;
  spend: number;
  currentUses: number;
  totalUses: number;
  files: number;
  feedback: number;
  activeAt: string;
  createdAt: string;
}

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
    
    const { users } = await req.json() as { users: PickaxeUser[] };
    
    if (!users || !Array.isArray(users)) {
      throw new Error("Invalid users data - expected { users: [...] }");
    }

    console.log(`Processing ${users.length} Pickaxe users`);

    const results = {
      total: users.length,
      synced: 0,
      paidUsers: 0,
      accessGranted: 0,
      errors: [] as string[],
    };

    for (const pickaxeUser of users) {
      try {
        const isPaidUser = pickaxeUser.type === "paid";
        
        // Upsert pickaxe connection
        const { error: upsertError } = await supabase
          .from("pickaxe_connections")
          .upsert({
            pickaxe_email: pickaxeUser.email.toLowerCase(),
            pickaxe_name: pickaxeUser.name,
            pickaxe_picture: pickaxeUser.picture,
            is_paid_user: isPaidUser,
            spend_cents: pickaxeUser.spend,
            total_uses: pickaxeUser.totalUses,
            pickaxe_created_at: pickaxeUser.createdAt,
            pickaxe_active_at: pickaxeUser.activeAt,
            synced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }, { onConflict: "pickaxe_email" });

        if (upsertError) {
          results.errors.push(`Failed to sync ${pickaxeUser.email}: ${upsertError.message}`);
          continue;
        }

        results.synced++;
        if (isPaidUser) results.paidUsers++;

        // For paid users, try to link to existing app user and grant access
        if (isPaidUser) {
          // Check if there's an app user with this email
          const { data: appUsers } = await supabase.auth.admin.listUsers();
          const matchingUser = appUsers?.users?.find(
            u => u.email?.toLowerCase() === pickaxeUser.email.toLowerCase()
          );

          if (matchingUser) {
            // Link the pickaxe connection to the app user
            await supabase
              .from("pickaxe_connections")
              .update({ 
                user_id: matchingUser.id,
                access_granted_at: new Date().toISOString()
              })
              .eq("pickaxe_email", pickaxeUser.email.toLowerCase());

            // Grant premium access
            await supabase
              .from("profiles")
              .update({
                subscription_tier: "premium",
                subscription_status: "active",
                payment_source: "pickaxe",
                updated_at: new Date().toISOString()
              })
              .eq("id", matchingUser.id);

            results.accessGranted++;
            console.log(`Granted access to existing user: ${pickaxeUser.email}`);
          }
        }
      } catch (userError) {
        const errorMsg = userError instanceof Error ? userError.message : "Unknown error";
        results.errors.push(`Error processing ${pickaxeUser.email}: ${errorMsg}`);
      }
    }

    console.log("Sync results:", results);

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Pickaxe sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
