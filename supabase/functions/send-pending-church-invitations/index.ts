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

    // Get pending invitations in small batches to avoid timeout
    const batchSize = 10;
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
      .eq('status', 'pending')
      .limit(batchSize);

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
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #e0e0e0; background: #0a0e1a; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #0f3460 0%, #16213e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; border-bottom: 3px solid #2dd4bf; }
              .content { background: #1a1f2e; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%); color: #0a0e1a; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; font-size: 16px; }
              .code-box { background: #0f1629; border: 2px dashed #2dd4bf; padding: 20px; border-radius: 6px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0; color: #2dd4bf; }
              .footer { text-align: center; padding: 20px; color: #888; font-size: 14px; }
              .highlight { color: #2dd4bf; font-weight: bold; }
              .help-section { background: #0f1629; border: 1px solid #2dd4bf44; border-radius: 8px; padding: 24px; margin: 24px 0; }
              .help-section h3 { color: #2dd4bf; margin-top: 0; }
              .step { margin: 12px 0; padding-left: 8px; }
              .step-number { display: inline-block; background: #2dd4bf; color: #0a0e1a; width: 24px; height: 24px; border-radius: 50%; text-align: center; font-weight: bold; font-size: 14px; line-height: 24px; margin-right: 8px; }
              ul { padding-left: 20px; }
              li { margin: 6px 0; color: #c0c0c0; }
              p { color: #d0d0d0; }
              a { color: #2dd4bf; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🙏 You're Invited to Join ${churchName}!</h1>
                <p style="margin: 0; opacity: 0.9;">Your church is waiting for you on Phototheology</p>
              </div>
              <div class="content">
                <p>Hello,</p>
                
                <p>You've been invited to join <strong>${churchName}</strong> on the Phototheology Bible Study platform as a <span class="highlight">${invitation.role}</span>!</p>
                
                <p>As a church member, you get <span class="highlight">immediate full access</span> — no trial, no credit card, no waiting. Just sign up and start studying!</p>
                
                <h3 style="color: #2dd4bf;">Your Invitation Code:</h3>
                <div class="code-box">${invitation.invitation_code}</div>
                
                <p style="text-align: center;">
                  <a href="${joinLink}" class="button">Join ${churchName} Now →</a>
                </p>
                
                <p><strong>⏰ Important:</strong> This invitation expires on ${expiresDate}.</p>
                
                <div class="help-section">
                  <h3>🛠️ Trouble Creating an Account?</h3>
                  <p style="margin-bottom: 16px;">Follow these simple steps to get started:</p>
                  
                  <div class="step"><span class="step-number">1</span> <strong>Click the button above</strong> — or copy/paste this link into your browser:<br><a href="${joinLink}" style="font-size: 13px; word-break: break-all;">${joinLink}</a></div>
                  
                  <div class="step"><span class="step-number">2</span> <strong>Create a new account</strong> — Use <strong>this email address</strong> (${invitation.invited_email}) when signing up. Enter your name, this email, and choose a password.</div>
                  
                  <div class="step"><span class="step-number">3</span> <strong>Verify your email</strong> — Check your inbox for a verification link and click it.</div>
                  
                  <div class="step"><span class="step-number">4</span> <strong>You're in!</strong> — Once verified, you'll be automatically connected to ${churchName} with <span class="highlight">immediate full premium access</span>. No payment needed.</div>
                  
                  <p style="margin-top: 16px; font-size: 13px; color: #999;"><strong>Important:</strong> You must sign up with <strong>${invitation.invited_email}</strong> for automatic church access. If you use a different email, the system won't recognize you as a pre-approved member.</p>
                </div>
                
                <p>As a ${invitation.role}, you'll have access to:</p>
                <ul>
                  <li>📚 The full Phototheology Study Bible</li>
                  <li>🏰 The 8-Floor Mind Map Palace</li>
                  <li>🤝 Church discipleship cohorts and study groups</li>
                  <li>🎯 Personalized devotional plans from your leaders</li>
                  <li>📈 Progress tracking and spiritual growth metrics</li>
                  <li>💬 AI-powered Bible study assistant (Jeeves)</li>
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
        // Rate limit: wait 1200ms between sends to stay well under Resend's 2/sec limit
        if (results.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 1200));
        }
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
          // Mark as sent so we don't re-send on next batch
          await supabase
            .from('church_invitations')
            .update({ status: 'sent' })
            .eq('id', invitation.id);
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
