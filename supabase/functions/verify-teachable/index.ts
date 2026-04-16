import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
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

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = user.email;
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "User email not found" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Verifying Teachable enrollment for: ${userEmail}`);

    // Query Teachable API to check if user is enrolled
    // Teachable API v1 - Search for user by email
    const teachableResponse = await fetch(
      `https://developers.teachable.com/v1/users?email=${encodeURIComponent(userEmail)}`,
      {
        headers: {
          "apiKey": TEACHABLE_API_KEY,
          "Accept": "application/json",
        },
      }
    );

    if (!teachableResponse.ok) {
      const errorText = await teachableResponse.text();
      console.error("Teachable API error:", teachableResponse.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          verified: false, 
          error: "Could not verify with Teachable",
          details: `API returned ${teachableResponse.status}`
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const teachableData = await teachableResponse.json();
    console.log("Teachable response:", JSON.stringify(teachableData));

    // Check if user exists in Teachable
    const teachableUser = teachableData.users?.find(
      (u: any) => u.email?.toLowerCase() === userEmail.toLowerCase()
    );

    if (!teachableUser) {
      return new Response(
        JSON.stringify({ 
          verified: false, 
          message: "No Teachable account found with this email" 
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get user's enrollments to verify they have an active MASTER CLASS enrollment
    const enrollmentsResponse = await fetch(
      `https://developers.teachable.com/v1/users/${teachableUser.id}/enrollments`,
      {
        headers: {
          "apiKey": TEACHABLE_API_KEY,
          "Accept": "application/json",
        },
      }
    );

    let courseName = "Phototheology Course";
    let hasActiveMasterClassEnrollment = false;
    const MASTER_CLASS_COURSE_ID = Deno.env.get("TEACHABLE_MASTER_CLASS_COURSE_ID") || "";

    if (enrollmentsResponse.ok) {
      const enrollmentsData = await enrollmentsResponse.json();
      const enrollments = enrollmentsData.enrollments || [];
      
      // Check each enrollment for Master Class specifically
      for (const enrollment of enrollments) {
        // Check if this is the Master Class course (by ID or name)
        const isMasterClass = 
          (MASTER_CLASS_COURSE_ID && String(enrollment.course_id) === MASTER_CLASS_COURSE_ID) ||
          enrollment.course_name?.toLowerCase().includes("master class") ||
          enrollment.course_name?.toLowerCase().includes("phototheology master") ||
          enrollment.course?.name?.toLowerCase().includes("master class");

        if (isMasterClass && (enrollment.is_active === true || enrollment.expired === false)) {
          hasActiveMasterClassEnrollment = true;
          courseName = enrollment.course_name || enrollment.course?.name || "PhotoTheology Master Class";
          break;
        }
      }
    }

    if (!hasActiveMasterClassEnrollment) {
      return new Response(
        JSON.stringify({ 
          verified: false, 
          message: "No active Master Class enrollment found. Only paying Master Class students ($20/month) have access to the PhototheologyOS. Free signups do not include app access.",
          upgradeUrl: "https://your-teachable-school-url/master-class"
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // User is verified! Save to database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: upsertError } = await supabase
      .from("teachable_students")
      .upsert({
        user_id: user.id,
        teachable_email: userEmail,
        teachable_user_id: String(teachableUser.id),
        course_name: courseName,
        is_active: true,
        last_verified_at: new Date().toISOString(),
      }, {
        onConflict: "user_id",
      });

    if (upsertError) {
      console.error("Database error:", upsertError);
      throw upsertError;
    }

    // Also update the user's profile to reflect premium access
    await supabase
      .from("profiles")
      .update({
        subscription_tier: "student",
        subscription_status: "active",
      })
      .eq("id", user.id);

    return new Response(
      JSON.stringify({
        verified: true,
        message: "Successfully verified as Teachable student!",
        courseName,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Error in verify-teachable:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
