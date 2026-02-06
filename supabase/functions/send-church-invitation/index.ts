import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const withTimeout = async <T,>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> => {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
  });

  return (await Promise.race([promise, timeout])) as T;
};

interface ChurchInvitationRequest {
  recipientEmail: string;
  recipientName?: string;
  churchName: string;
  churchId: string;
  invitationCode: string;
  role: string;
  expiresAt: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    console.log('send-church-invitation: Starting...');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header');
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Unauthorized:', authError);
      throw new Error('Unauthorized');
    }

    console.log('send-church-invitation: User authenticated:', user.id);

    const { 
      recipientEmail, 
      recipientName, 
      churchName, 
      churchId, 
      invitationCode, 
      role,
      expiresAt 
    }: ChurchInvitationRequest = await req.json();

    console.log('send-church-invitation: Sending to:', recipientEmail, 'for church:', churchName);

    // Verify user is a member/leader/admin of this church
    const { data: memberData, error: memberError } = await supabase
      .from('church_members')
      .select('role')
      .eq('church_id', churchId)
      .eq('user_id', user.id)
      .single();

    if (memberError || !memberData) {
      console.error('User is not a member of this church:', memberError);
      return new Response(
        JSON.stringify({ success: false, error: 'You must be a member of this church to send invitations' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only admins and leaders can send invitations
    if (!['admin', 'leader'].includes(memberData.role)) {
      console.error('User does not have permission to send invitations');
      return new Response(
        JSON.stringify({ success: false, error: 'Only admins and leaders can send invitations' }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

     const getBaseUrlFromRequest = (r: Request): string | null => {
       const origin = r.headers.get('origin');
       if (origin) return origin;
       const referer = r.headers.get('referer');
       if (referer) {
         try {
           return new URL(referer).origin;
         } catch {
           // ignore
         }
       }
       return null;
     };

     const appBaseUrl = (getBaseUrlFromRequest(req) || Deno.env.get('PUBLIC_APP_URL') || 'https://phototheologybible.com').replace(/\/$/, '');
     const joinLink = `${appBaseUrl}/join-church?code=${invitationCode}`;
    const expiresDate = new Date(expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });


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
              <h1>🙏 You're Invited to Join ${churchName}!</h1>
            </div>
            <div class="content">
              <p>Hello${recipientName ? ` ${recipientName}` : ''},</p>
              
              <p>You've been invited to join <strong>${churchName}</strong> on the Phototheology platform as a <span class="highlight">${role}</span>!</p>
              
              <p><strong>What is Living Manna?</strong></p>
              <p>Living Manna is a church discipleship program built on Phototheology's powerful Bible study method. Join your church community for guided spiritual growth, cohort learning, and pastoral care.</p>
              
              <h3>Your Invitation Code:</h3>
              <div class="code-box">${invitationCode}</div>
              
              <p style="text-align: center;">
                <a href="${joinLink}" class="button">Join ${churchName} Now</a>
              </p>
              
              <p><strong>⏰ Important:</strong> This invitation expires on ${expiresDate}.</p>
              
              <p>As a ${role}, you'll have access to:</p>
              <ul>
                <li>📚 Church discipleship cohorts and study groups</li>
                <li>🎯 Personalized devotional plans from your leaders</li>
                <li>🤝 Fellowship with your church community</li>
                <li>📈 Progress tracking and spiritual growth metrics</li>
                <li>💬 Direct connection with church leadership</li>
              </ul>
              
              <p>Questions? Reach out to your church leadership!</p>
              
              <p>Blessings,<br>The Phototheology Team</p>
            </div>
            <div class="footer">
              <p>© 2025 Phototheology. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log('send-church-invitation: Sending email via Resend...');

    const sendStartedAt = Date.now();

    const { data: emailData, error: resendError } = await withTimeout(
      resend.emails.send({
        from: "Phototheology <noreply@thephototheologyapp.com>",
        to: [recipientEmail],
        subject: `🙏 You're Invited to Join ${churchName} on Phototheology!`,
        html: emailHtml,
      }),
      15000,
      'Resend email send'
    );

    console.log(
      'send-church-invitation: Resend finished in',
      Date.now() - sendStartedAt,
      'ms'
    );
    if (resendError) {
      console.error('Resend email error:', resendError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: resendError.message || 'Email service rejected the invitation.',
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('send-church-invitation: Email sent successfully to', recipientEmail, emailData);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailSent: true,
        messageId: emailData?.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error sending church invitation:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send invitation' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
