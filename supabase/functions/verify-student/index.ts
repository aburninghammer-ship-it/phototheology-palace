import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { email } = await req.json();

    // Verify email ends with .edu
    if (!email || !email.toLowerCase().endsWith('.edu')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Please use a valid .edu email address" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Update user's profile with student status
    const studentExpiresAt = new Date();
    studentExpiresAt.setFullYear(studentExpiresAt.getFullYear() + 1); // Expires in 1 year

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        is_student: true,
        student_verified_at: new Date().toISOString(),
        student_expires_at: studentExpiresAt.toISOString(),
        subscription_status: 'active',
        subscription_tier: 'student',
      })
      .eq("id", user.id);

    if (updateError) {
      throw updateError;
    }

    console.log(`Student verified: ${user.id}, expires at: ${studentExpiresAt}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Student status verified! Free access granted for 1 year.",
        expiresAt: studentExpiresAt.toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error verifying student:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
