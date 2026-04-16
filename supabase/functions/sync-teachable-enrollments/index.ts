import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper to send welcome email
async function sendWelcomeEmail(email: string, name: string) {
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/send-welcome-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, source: "teachable" }),
    });
    if (response.ok) {
      console.log(`[SYNC-TEACHABLE] Welcome email sent to ${email}`);
    } else {
      console.warn(`[SYNC-TEACHABLE] Failed to send welcome email to ${email}`);
    }
  } catch (err) {
    console.error(`[SYNC-TEACHABLE] Error sending welcome email:`, err);
  }
}

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

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    console.log("[SYNC-TEACHABLE] Starting daily enrollment sync");

    const MASTER_CLASS_COURSE_ID = Deno.env.get("TEACHABLE_MASTER_CLASS_COURSE_ID") || "";

    // Get all teachable students from our database (only Master Class students)
    const { data: students, error: fetchError } = await supabase
      .from("teachable_students")
      .select("id, user_id, teachable_email, teachable_user_id, is_active, access_expires_at, enrollment_status, is_master_class")
      .eq("is_master_class", true); // Only sync Master Class students

    if (fetchError) {
      throw new Error(`Failed to fetch students: ${fetchError.message}`);
    }

    console.log(`[SYNC-TEACHABLE] Found ${students?.length || 0} Master Class students to check`);

    let processed = 0;
    let revoked = 0;
    let maintained = 0;
    let expired = 0;

    for (const student of students || []) {
      try {
        // Check if access already expired (grace period ended)
        if (student.access_expires_at && new Date(student.access_expires_at) < new Date()) {
          // Grace period ended - actually revoke access now
          await supabase.from("profiles").update({
            subscription_tier: "free",
            subscription_status: "cancelled",
            updated_at: new Date().toISOString(),
          }).eq("id", student.user_id);

          await supabase.from("teachable_students").update({
            is_active: false,
            enrollment_status: "expired",
            last_sync_at: new Date().toISOString(),
          }).eq("id", student.id);

          console.log(`[SYNC-TEACHABLE] Grace period expired for user ${student.user_id}`);
          expired++;
          continue;
        }

        // Query Teachable API for this user
        const enrollmentsResponse = await fetch(
          `https://developers.teachable.com/v1/users/${student.teachable_user_id}/enrollments`,
          {
            headers: {
              "apiKey": TEACHABLE_API_KEY,
              "Accept": "application/json",
            },
          }
        );

        if (!enrollmentsResponse.ok) {
          console.warn(`[SYNC-TEACHABLE] Failed to check enrollments for ${student.teachable_email}`);
          continue;
        }

        const enrollmentsData = await enrollmentsResponse.json();
        const enrollments = enrollmentsData.enrollments || [];

        // Check specifically for active MASTER CLASS enrollment
        let hasActiveMasterClassEnrollment = false;
        for (const enrollment of enrollments) {
          const isMasterClass = 
            (MASTER_CLASS_COURSE_ID && String(enrollment.course_id) === MASTER_CLASS_COURSE_ID) ||
            enrollment.course_name?.toLowerCase().includes("master class") ||
            enrollment.course_name?.toLowerCase().includes("phototheology master") ||
            enrollment.course?.name?.toLowerCase().includes("master class");

          if (isMasterClass && (enrollment.is_active === true || enrollment.expired === false)) {
            hasActiveMasterClassEnrollment = true;
            break;
          }
        }

        if (hasActiveMasterClassEnrollment) {
          // Still enrolled in Master Class - maintain access
          if (student.enrollment_status === "cancelled") {
            // They re-enrolled! Restore access and send welcome email
            await supabase.from("profiles").update({
              subscription_tier: "student",
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            }).eq("id", student.user_id);

            // Send welcome email for re-enrollment
            await sendWelcomeEmail(student.teachable_email, student.teachable_email.split("@")[0]);
          }

          await supabase.from("teachable_students").update({
            is_active: true,
            enrollment_status: "active",
            access_expires_at: null, // Clear any pending expiration
            last_sync_at: new Date().toISOString(),
          }).eq("id", student.id);

          maintained++;
        } else if (student.is_active && !student.access_expires_at) {
          // Just cancelled Master Class - start grace period (30 days)
          const gracePeriodEnd = new Date();
          gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);

          await supabase.from("teachable_students").update({
            enrollment_status: "cancelled",
            access_expires_at: gracePeriodEnd.toISOString(),
            last_sync_at: new Date().toISOString(),
          }).eq("id", student.id);

          console.log(`[SYNC-TEACHABLE] User ${student.user_id} cancelled, grace period until ${gracePeriodEnd.toISOString()}`);
          revoked++;
        }

        processed++;

        // Rate limit - 1 request per 100ms to avoid hitting Teachable API limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (studentError) {
        console.error(`[SYNC-TEACHABLE] Error processing student ${student.user_id}:`, studentError);
      }
    }

    console.log(`[SYNC-TEACHABLE] Sync complete: ${processed} processed, ${maintained} maintained, ${revoked} cancelled (grace period started), ${expired} expired`);

    return new Response(
      JSON.stringify({
        success: true,
        processed,
        maintained,
        revoked,
        expired,
        timestamp: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("[SYNC-TEACHABLE] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
