import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GameInviteRequest {
  recipientEmail: string;
  gameType: string; // "room" | "chess" | "escape" | "quiz" | "uno"
  gameName: string;
  inviteLink: string;
  roomCode?: string;
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

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('No authorization header');

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Unauthorized');

    // Get sender's display name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, username')
      .eq('id', user.id)
      .single();

    const senderName = profile?.display_name || profile?.username || 'A friend';

    const { recipientEmail, gameType, gameName, inviteLink, roomCode }: GameInviteRequest = await req.json();

    if (!recipientEmail) throw new Error('Recipient email is required');

    const gameEmoji = {
      room: '🏰',
      chess: '♟️',
      escape: '🔐',
      quiz: '🧠',
      uno: '🃏',
    }[gameType] || '🎮';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .code-box { background: white; border: 2px dashed #667eea; padding: 15px; border-radius: 6px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 3px; margin: 15px 0; color: #764ba2; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 13px; }
            .highlight { color: #667eea; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${gameEmoji} You've Been Challenged!</h1>
            </div>
            <div class="content">
              <p>Hey there!</p>
              
              <p><strong>${senderName}</strong> is challenging you to a <span class="highlight">${gameName}</span> game on Phototheology!</p>
              
              ${roomCode ? `
              <h3>🔑 Room Code:</h3>
              <div class="code-box">${roomCode}</div>
              ` : ''}
              
              <p style="text-align: center;">
                <a href="${inviteLink}" class="button">Accept the Challenge ${gameEmoji}</a>
              </p>
              
              <p>Don't keep them waiting — jump in and show what you've got!</p>
              
              <p>Blessings,<br>The Phototheology Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Phototheology. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data: emailData, error: resendError } = await resend.emails.send({
      from: "Phototheology <noreply@thephototheologyapp.com>",
      to: [recipientEmail],
      subject: `${gameEmoji} ${senderName} challenged you to ${gameName} on Phototheology!`,
      html: emailHtml,
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return new Response(
        JSON.stringify({ success: false, error: resendError.message || 'Failed to send email' }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Game invite sent to', recipientEmail, emailData);

    return new Response(
      JSON.stringify({ success: true, messageId: emailData?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error('Error sending game invite:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to send invite' }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
