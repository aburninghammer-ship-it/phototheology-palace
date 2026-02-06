import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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

    // Check for existing pending verification (rate limiting)
    const { data: existingVerification } = await supabase
      .from("pending_student_verifications")
      .select("*")
      .eq("user_id", user.id)
      .gt("expires_at", new Date().toISOString())
      .is("verified_at", null)
      .single();

    if (existingVerification) {
      // If same email and created within last 5 minutes, don't resend
      const createdAt = new Date(existingVerification.created_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (existingVerification.edu_email === email.toLowerCase() && createdAt > fiveMinutesAgo) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Verification code already sent. Please check your .edu email.",
            pending: true
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing pending verifications for this user
    await supabase
      .from("pending_student_verifications")
      .delete()
      .eq("user_id", user.id);

    // Create new pending verification
    const { error: insertError } = await supabase
      .from("pending_student_verifications")
      .insert({
        user_id: user.id,
        edu_email: email.toLowerCase(),
        verification_code: verificationCode,
      });

    if (insertError) {
      console.error('Error creating verification:', insertError);
      throw new Error('Failed to create verification');
    }

    // Send verification email
    const { error: emailError } = await resend.emails.send({
      from: "Phototheology <noreply@thephototheologyapp.com>",
      to: [email.toLowerCase()],
      subject: "Verify Your Student Email - Palace of Study",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 20px;">Verify Your Student Email</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            Thank you for verifying your student status with Palace of Study. Use the verification code below to complete your registration:
          </p>
          <div style="background: #f4f4f4; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1a1a1a;">${verificationCode}</span>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.5;">
            This code will expire in 24 hours. If you didn't request this verification, you can safely ignore this email.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">
            — The Palace of Study Team
          </p>
        </div>
      `,
    });

    if (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error('Failed to send verification email');
    }

    console.log(`Student verification email sent to ${email} for user ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Verification code sent! Please check your .edu email inbox.",
        pending: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error in verify-student:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Verification failed' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
