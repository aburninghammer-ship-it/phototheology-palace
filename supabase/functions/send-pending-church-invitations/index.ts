import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    console.log('send-pending-church-invitations: Starting...');
    
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const resend = new Resend(resendApiKey);

    // Get all pending invitations with church info
    const { data: invitations, error: fetchError } = await supabase
      .from('church_invitations')
      .select(`
        id,
        invited_email,
        invitation_code,
        role,
        expires_at,
        church_id,
        churches!inner(name)
      `)
      .eq('status', 'pending');

    if (fetchError) {
      console.error('Error fetching invitations:', fetchError);
      throw fetchError;
    }

    console.log(`Found ${invitations?.length || 0} pending invitations`);

    const results = [];
    const origin = (Deno.env.get('PUBLIC_APP_URL') || 'https://phototheologybible.com').replace(/\/$/, '');

    for (const invitation of invitations || []) {
      const churchName = (invitation.churches as any)?.name || 'Living Manna';
      const joinLink = `${origin}/join-church?code=${invitation.invitation_code}`;
      const expiresDate = new Date(invitation.expires_at).toLocaleDateString('en-US', {
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
                <p>Hello,</p>
                
                <p>You've been invited to join <strong>${churchName}</strong> on the Phototheology platform as a <span class="highlight">${invitation.role}</span>!</p>
                
                <p><strong>What is Living Manna?</strong></p>
                <p>Living Manna is a church discipleship program built on Phototheology's powerful Bible study method. Join your church community for guided spiritual growth, cohort learning, and pastoral care.</p>
                
                <h3>Your Invitation Code:</h3>
                <div class="code-box">${invitation.invitation_code}</div>
                
                <p style="text-align: center;">
                  <a href="${joinLink}" class="button">Join ${churchName} Now</a>
                </p>
                
                <p><strong>⏰ Important:</strong> This invitation expires on ${expiresDate}.</p>
                
                <p>As a ${invitation.role}, you'll have access to:</p>
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

      try {
        console.log(`Sending email to ${invitation.invited_email}...`);
        
        const { data: emailData, error: resendError } = await resend.emails.send({
          from: "Phototheology <noreply@thephototheologyapp.com>",
          to: [invitation.invited_email],
          subject: `🙏 You're Invited to Join ${churchName} on Phototheology!`,
          html: emailHtml,
        });

        if (resendError) {
          console.error(`Failed to send to ${invitation.invited_email}:`, resendError);
          results.push({ email: invitation.invited_email, success: false, error: resendError.message });
        } else {
          console.log(`Email sent to ${invitation.invited_email}`, emailData);
          results.push({ email: invitation.invited_email, success: true, messageId: emailData?.id });
        }
      } catch (emailErr) {
        console.error(`Error sending to ${invitation.invited_email}:`, emailErr);
        results.push({ email: invitation.invited_email, success: false, error: String(emailErr) });
      }
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`Sent ${successCount}/${results.length} emails successfully`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        totalInvitations: invitations?.length || 0,
        emailsSent: successCount,
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send invitations' 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
