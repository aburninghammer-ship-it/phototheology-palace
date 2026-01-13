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

    // Get user from auth header and verify admin
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

    // Check if user is admin
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

    console.log("Starting Teachable import...");

    // Fetch all users from Teachable API with pagination
    let allUsers: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      console.log(`Fetching Teachable users page ${page}...`);
      
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
        
        // Safety limit to prevent infinite loops
        if (page > 100) {
          hasMore = false;
        }
      }
    }

    console.log(`Found ${allUsers.length} total Teachable users`);

    // Process each user and get their enrollments
    const studentsToInsert: any[] = [];
    let processedCount = 0;

    for (const teachableUser of allUsers) {
      processedCount++;
      
      if (!teachableUser.email) continue;

      // Get enrollments for this user
      let courseName = "Phototheology Course";
      let isActive = true;

      try {
        const enrollmentsResponse = await fetch(
          `https://developers.teachable.com/v1/users/${teachableUser.id}/enrollments`,
          {
            headers: {
              "apiKey": TEACHABLE_API_KEY,
              "Accept": "application/json",
            },
          }
        );

        if (enrollmentsResponse.ok) {
          const enrollmentsData = await enrollmentsResponse.json();
          const enrollments = enrollmentsData.enrollments || [];
          
          if (enrollments.length > 0) {
            const activeEnrollment = enrollments.find((e: any) => e.is_active || !e.expired);
            if (activeEnrollment) {
              courseName = activeEnrollment.course_name || courseName;
              isActive = true;
            } else {
              isActive = false;
            }
          }
        }
      } catch (e) {
        console.error(`Error fetching enrollments for user ${teachableUser.id}:`, e);
      }

      studentsToInsert.push({
        teachable_email: teachableUser.email.toLowerCase(),
        teachable_user_id: String(teachableUser.id),
        course_name: courseName,
        is_active: isActive,
        last_verified_at: new Date().toISOString(),
      });

      // Log progress every 50 users
      if (processedCount % 50 === 0) {
        console.log(`Processed ${processedCount}/${allUsers.length} users...`);
      }
    }

    console.log(`Inserting ${studentsToInsert.length} students into database...`);

    // Batch upsert students
    const batchSize = 100;
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

    console.log(`Import complete: ${insertedCount} inserted, ${errorCount} errors`);

    return new Response(
      JSON.stringify({
        success: true,
        totalFound: allUsers.length,
        imported: insertedCount,
        errors: errorCount,
        message: `Successfully imported ${insertedCount} Teachable students`,
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
