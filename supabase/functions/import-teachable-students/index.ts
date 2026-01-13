import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TEACHABLE_API_KEY = Deno.env.get("TEACHABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!TEACHABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("id")
      .eq("user_id", user.id)
      .single();

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .single();

    if (!adminData && !roleData) {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get optional startPage parameter for resuming
    const body = await req.json().catch(() => ({}));
    const startPage = body.startPage || 1;
    const maxPagesPerRun = 50; // Process 50 pages per run to avoid timeout

    console.log(`Starting Teachable import from page ${startPage}...`);

    // Fetch users from Teachable API with pagination
    let allUsers: any[] = [];
    let page = startPage;
    let hasMore = true;
    let pagesProcessed = 0;

    while (hasMore && pagesProcessed < maxPagesPerRun) {
      console.log(`Fetching page ${page}...`);
      
      const response = await fetch(
        `https://developers.teachable.com/v1/users?page=${page}&per_page=100`,
        {
          headers: {
            "apiKey": TEACHABLE_API_KEY,
            "Accept": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Teachable API error:", response.status, errorText);
        throw new Error(`Teachable API error: ${response.status}`);
      }

      const data = await response.json();
      const users = data.users || [];
      
      if (users.length === 0) {
        hasMore = false;
      } else {
        allUsers = [...allUsers, ...users];
        page++;
        pagesProcessed++;
      }
    }

    console.log(`Fetched ${allUsers.length} users from ${pagesProcessed} pages`);

    // Prepare students for insert
    const studentsToInsert: any[] = [];

    for (const teachableUser of allUsers) {
      if (!teachableUser.email) continue;

      // Extract MRR (monthly recurring revenue) from Teachable user data
      // Teachable stores this in the user object
      const mrr = teachableUser.monthly_recurring_revenue || 
                  teachableUser.mrr || 
                  teachableUser.current_monthly_revenue || 
                  0;

      studentsToInsert.push({
        teachable_email: teachableUser.email.toLowerCase(),
        teachable_user_id: String(teachableUser.id),
        course_name: "PhotoTheology Course",
        is_active: true,
        last_verified_at: new Date().toISOString(),
        mrr: parseFloat(mrr) || 0,
      });
    }

    console.log(`Inserting ${studentsToInsert.length} students...`);

    // Batch upsert students
    const batchSize = 500;
    let insertedCount = 0;
    let errorCount = 0;

    for (let i = 0; i < studentsToInsert.length; i += batchSize) {
      const batch = studentsToInsert.slice(i, i + batchSize);
      
      const { error: upsertError } = await supabase
        .from("teachable_students")
        .upsert(batch, {
          onConflict: "teachable_email",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        console.error("Batch upsert error:", upsertError);
        errorCount += batch.length;
      } else {
        insertedCount += batch.length;
      }
    }

    console.log(`Import batch complete: ${insertedCount} inserted, ${errorCount} errors`);

    // Determine if there are more pages to process
    const needsContinuation = hasMore && pagesProcessed >= maxPagesPerRun;

    return new Response(
      JSON.stringify({
        success: true,
        totalFound: allUsers.length,
        imported: insertedCount,
        errors: errorCount,
        pagesProcessed,
        nextPage: needsContinuation ? page : null,
        needsContinuation,
        message: needsContinuation 
          ? `Imported ${insertedCount} students (pages ${startPage}-${page - 1}). More pages available.`
          : `Successfully imported ${insertedCount} Teachable students`,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in import-teachable-students:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
