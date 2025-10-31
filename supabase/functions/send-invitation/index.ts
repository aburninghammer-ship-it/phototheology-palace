import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  recipientEmail: string;
  recipientName?: string;
  maxUses?: number;
  isLifetime: boolean;
  accessDurationMonths?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

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

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      return new Response(
        JSON.stringify({ success: false, error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { recipientEmail, recipientName, maxUses, isLifetime, accessDurationMonths }: InvitationRequest = await req.json();

    // Generate access code
    const code = 'PT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const { data: codeData, error: codeError } = await supabase
      .from('special_access_codes')
      .insert({
        code,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
        max_uses: maxUses || null,
        access_duration_months: isLifetime ? null : accessDurationMonths,
        is_lifetime: isLifetime,
      })
      .select()
      .single();

    if (codeError) throw codeError;

    // Send invitation email
    const accessLink = `${Deno.env.get('VITE_SUPABASE_URL')?.replace('/functions/v1', '')}/access?code=${code}`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 20px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
            .highlight { color: #667eea; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 You're Invited to Phototheology!</h1>
            </div>
            <div class="content">
              <p>Hello${recipientName ? ` ${recipientName}` : ''},</p>
              
              <p>You've been invited to join <strong>The Phototheology App</strong> with ${isLifetime ? '<span class="highlight">lifetime premium access</span>' : `<span class="highlight">${accessDurationMonths} months of premium access</span>`}!</p>
              
              <p><strong>What is Phototheology?</strong></p>
              <p>Phototheology is a revolutionary Bible study method that helps you memorize, visualize, and understand Scripture through an 8-floor "palace" system. Master stories, timelines, prophecy, and Christ-centered interpretation with powerful memory techniques.</p>
              
              <h3>Your Access Code:</h3>
              <div class="code-box">${code}</div>
              
              <p style="text-align: center;">
                <a href="${accessLink}" class="button">Claim Your Access Now</a>
              </p>
              
              <p><strong>⏰ Important:</strong> This invitation link expires in 24 hours (${expiresAt.toLocaleString()}).</p>
              
              <p>Once you redeem your code, you'll have ${isLifetime ? 'permanent access' : `${accessDurationMonths} months of premium access`} to:</p>
              <ul>
                <li>📚 The 8-Floor Palace System</li>
                <li>🎯 Advanced Bible study rooms and drills</li>
                <li>🎮 Interactive Bible games and challenges</li>
                <li>💬 AI-powered Bible study assistant (Jeeves)</li>
                <li>🏆 Achievement tracking and leaderboards</li>
                <li>📖 Full Bible with Strong's concordance</li>
              </ul>
              
              <p>Questions? Just reply to this email!</p>
              
              <p>Blessings,<br>The Phototheology Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Phototheology App. All rights reserved.</p>
              <p>This is an exclusive invitation. Please do not share your access code.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Phototheology <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: isLifetime 
        ? "🎉 You've Been Invited to Phototheology - Lifetime Access!" 
        : `🎉 You've Been Invited to Phototheology - ${accessDurationMonths} Months Free!`,
      html: emailHtml,
    });

    console.log(`Invitation sent to ${recipientEmail}, code: ${code}, expires: ${expiresAt}`, emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        code: codeData.code,
        expiresAt: codeData.expires_at,
        emailSent: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error sending invitation:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send invitation' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});