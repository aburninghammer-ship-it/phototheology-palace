import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// The Phototheology Master Class course ID - this is the paid $20/month course
// You may need to update this with the actual course ID from Teachable
const MASTER_CLASS_COURSE_ID = Deno.env.get("TEACHABLE_MASTER_CLASS_COURSE_ID") || "";

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
      console.log(`[IMPORT-TEACHABLE] Welcome email sent to ${email}`);
      return true;
    } else {
      console.warn(`[IMPORT-TEACHABLE] Failed to send welcome email to ${email}`);
      return false;
    }
  } catch (err) {
    console.error(`[IMPORT-TEACHABLE] Error sending welcome email:`, err);
    return false;
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

    // Process each user to determine their enrollment status
    const studentsToInsert: any[] = [];
    const newMasterClassEmails: string[] = []; // Track new Master Class students for welcome emails
    let masterClassCount = 0;
    let freeUserCount = 0;
    let processedForEnrollments = 0;

    // First, get existing Master Class students to avoid re-welcoming them
    const { data: existingStudents } = await supabase
      .from("teachable_students")
      .select("teachable_email, is_master_class, is_active")
      .eq("is_master_class", true);
    
    const existingMasterClassEmails = new Set(
      (existingStudents || []).map(s => s.teachable_email?.toLowerCase())
    );

    for (const teachableUser of allUsers) {
      if (!teachableUser.email) continue;

      // Default values - assume free user
      let isMasterClassStudent = false;
      let hasActiveEnrollment = false;
      let mrr = 0;
      let courseName = "Free Signup";

      // Check user's enrollments to see if they're in the Master Class
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

          // Check each enrollment
          for (const enrollment of enrollments) {
            // Check if this is the Master Class course (by ID or name)
            const isMasterClass = 
              (MASTER_CLASS_COURSE_ID && String(enrollment.course_id) === MASTER_CLASS_COURSE_ID) ||
              enrollment.course_name?.toLowerCase().includes("master class") ||
              enrollment.course_name?.toLowerCase().includes("phototheology master") ||
              enrollment.course?.name?.toLowerCase().includes("master class");

            if (isMasterClass) {
              isMasterClassStudent = true;
              courseName = enrollment.course_name || enrollment.course?.name || "PhotoTheology Master Class";
              
              // Check if enrollment is active (not expired, not cancelled)
              if (enrollment.is_active === true || enrollment.expired === false) {
                hasActiveEnrollment = true;
                // Set MRR based on Master Class price ($20/month)
                mrr = 20;
              }
              break;
            }
          }

          processedForEnrollments++;
        }

        // Rate limit - avoid hitting Teachable API limits
        if (processedForEnrollments % 10 === 0) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

      } catch (enrollmentError) {
        console.warn(`Failed to fetch enrollments for user ${teachableUser.id}:`, enrollmentError);
      }

      if (isMasterClassStudent) {
        masterClassCount++;
        // Track NEW active Master Class students for welcome emails
        const emailLower = teachableUser.email.toLowerCase();
        if (hasActiveEnrollment && !existingMasterClassEmails.has(emailLower)) {
          newMasterClassEmails.push(emailLower);
        }
      } else {
        freeUserCount++;
      }

      studentsToInsert.push({
        teachable_email: teachableUser.email.toLowerCase(),
        teachable_user_id: String(teachableUser.id),
        course_name: courseName,
        is_active: hasActiveEnrollment,
        is_master_class: isMasterClassStudent,
        last_verified_at: new Date().toISOString(),
        mrr: mrr,
        enrollment_status: hasActiveEnrollment ? "active" : (isMasterClassStudent ? "inactive" : "free"),
      });
    }

    console.log(`Classified users: ${masterClassCount} Master Class students, ${freeUserCount} free users`);
    console.log(`Found ${newMasterClassEmails.length} NEW Master Class students to welcome`);
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

    // Send welcome emails to NEW Master Class students
    let welcomeEmailsSent = 0;
    if (newMasterClassEmails.length > 0) {
      console.log(`Sending welcome emails to ${newMasterClassEmails.length} new Master Class students...`);
      for (const email of newMasterClassEmails.slice(0, 20)) { // Limit to 20 per run to avoid timeout
        const name = email.split("@")[0]; // Use email prefix as name
        const sent = await sendWelcomeEmail(email, name);
        if (sent) welcomeEmailsSent++;
        // Small delay between emails
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      console.log(`Welcome emails sent: ${welcomeEmailsSent}`);
    }

    // Determine if there are more pages to process
    const needsContinuation = hasMore && pagesProcessed >= maxPagesPerRun;

    return new Response(
      JSON.stringify({
        success: true,
        totalFound: allUsers.length,
        imported: insertedCount,
        errors: errorCount,
        masterClassStudents: masterClassCount,
        freeUsers: freeUserCount,
        newMasterClassStudents: newMasterClassEmails.length,
        welcomeEmailsSent,
        pagesProcessed,
        nextPage: needsContinuation ? page : null,
        needsContinuation,
        message: needsContinuation 
          ? `Imported ${insertedCount} students (${masterClassCount} Master Class, ${freeUserCount} free). ${welcomeEmailsSent} welcome emails sent. More pages available.`
          : `Successfully imported ${insertedCount} Teachable students (${masterClassCount} Master Class, ${freeUserCount} free users). ${welcomeEmailsSent} welcome emails sent.`,
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
