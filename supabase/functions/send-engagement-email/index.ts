import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  userId?: string;
  campaignType: 'welcome' | 'engagement' | 're-engagement' | 'achievement' | 'milestone';
  customData?: any;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { userId, campaignType, customData }: EmailRequest = await req.json();

    // Get campaign details
    const { data: campaign, error: campaignError } = await supabase
      .from('email_campaigns')
      .select('*')
      .eq('type', campaignType)
      .eq('is_active', true)
      .single();

    if (campaignError || !campaign) {
      throw new Error('Campaign not found or inactive');
    }

    // Get user details
    let targetUsers: any[] = [];
    
    if (userId) {
      // Send to specific user
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profile) {
        const { data: { user } } = await supabase.auth.admin.getUserById(userId);
        if (user?.email) {
          targetUsers.push({ profile, email: user.email, userId });
        }
      }
    } else {
      // Send based on campaign trigger
      switch (campaignType) {
        case 'engagement':
          // Users inactive for 7 days
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          
          const { data: inactiveUsers } = await supabase
            .from('user_engagement')
            .select('user_id')
            .lt('last_activity_at', sevenDaysAgo.toISOString());

          if (inactiveUsers) {
            for (const { user_id } of inactiveUsers) {
              const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
              if (user?.email) {
                targetUsers.push({ email: user.email, userId: user_id });
              }
            }
          }
          break;
        
        case 're-engagement':
          // Win-back: Users with expired trials or cancelled subscriptions
          const { data: expiredUsers } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .in('subscription_status', ['expired', 'cancelled'])
            .eq('has_lifetime_access', false);

          if (expiredUsers) {
            // Also check they haven't received a win-back email in last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            for (const { user_id } of expiredUsers) {
              // Check if already sent win-back recently
              const { data: recentEmail } = await supabase
                .from('email_logs')
                .select('id')
                .eq('user_id', user_id)
                .eq('status', 'sent')
                .gte('sent_at', thirtyDaysAgo.toISOString())
                .limit(1);
              
              if (!recentEmail || recentEmail.length === 0) {
                const { data: { user } } = await supabase.auth.admin.getUserById(user_id);
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('display_name')
                  .eq('id', user_id)
                  .single();
                
                if (user?.email) {
                  targetUsers.push({ email: user.email, userId: user_id, profile });
                }
              }
            }
          }
          break;
      }
    }

    // Send emails
    const emailPromises = targetUsers.map(async ({ email, userId: targetUserId, profile }) => {
      try {
        const emailContent = generateEmailContent(campaign, profile, customData);
        
        const emailResponse = await resend.emails.send({
          from: "Phototheology <noreply@thephototheologyapp.com>",
          to: [email],
          subject: campaign.subject,
          html: emailContent,
        });

        // Log successful email
        await supabase
          .from('email_logs')
          .insert({
            user_id: targetUserId,
            campaign_id: campaign.id,
            email_address: email,
            status: 'sent',
          });

        return { success: true, email };
      } catch (error: any) {
        // Log failed email
        await supabase
          .from('email_logs')
          .insert({
            user_id: targetUserId,
            campaign_id: campaign.id,
            email_address: email,
            status: 'failed',
            error_message: error.message,
          });

        return { success: false, email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successCount = results.filter(r => r.success).length;

    console.log(`Sent ${successCount}/${results.length} emails for campaign: ${campaign.name}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Sent ${successCount}/${results.length} emails`,
        results 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-engagement-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function generateEmailContent(campaign: any, profile: any, customData: any): string {
  const displayName = profile?.display_name || 'there';
  
  switch (campaign.type) {
    case 'welcome':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Welcome to Phototheology, ${displayName}! 🎉</h1>
          <p>We're thrilled to have you join our community of Bible scholars studying through the Phototheology method.</p>
          <p>Here's what you can explore:</p>
          <ul>
            <li>📚 8 Floors of the Phototheology Palace</li>
            <li>🎮 Interactive Bible study games</li>
            <li>🏆 Achievement system to track your progress</li>
            <li>👥 Connect with study partners</li>
          </ul>
          <a href="${Deno.env.get('SUPABASE_URL')}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Start Your Journey
          </a>
        </div>
      `;
    
    case 're-engagement':
      const appUrl = Deno.env.get('FRONTEND_URL') || 'https://phototheology.app';
      return `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9; padding: 40px 30px;">
          <h1 style="color: #fbbf24; margin-bottom: 10px;">We Miss You, ${displayName}! 🏛️</h1>
          <p style="font-size: 16px; line-height: 1.6;">Your journey through the Phototheology Palace isn't over — it's just waiting for you to return.</p>
          
          <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; padding: 25px; margin: 25px 0; border-left: 4px solid #fbbf24;">
            <h2 style="color: #fbbf24; margin-top: 0; font-size: 20px;">🗺️ Your 7-Day Quick-Start Path</h2>
            <p style="margin-bottom: 15px; color: #94a3b8;">Here's exactly how to use Phototheology in just 7 days:</p>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #475569;">
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 1</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Complete the 24FPS Tour — Learn the image-per-chapter method</td>
              </tr>
              <tr style="border-bottom: 1px solid #475569;">
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 2</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Try the Genesis High Rise Challenge — Your first memory conquest</td>
              </tr>
              <tr style="border-bottom: 1px solid #475569;">
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 3</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Explore the Story Room — Build your biblical narrative library</td>
              </tr>
              <tr style="border-bottom: 1px solid #475569;">
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 4</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Complete a Daily Challenge — 5 minutes of focused study</td>
              </tr>
              <tr style="border-bottom: 1px solid #475569;">
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 5</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Ask Jeeves a question — Your AI study companion</td>
              </tr>
              <tr style="border-bottom: 1px solid #475569;">
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 6</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Try an Escape Room — Biblical puzzle adventure</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">Day 7</td>
                <td style="padding: 10px 0; color: #e2e8f0;">Share a Gem with the community — Teach what you've learned</td>
              </tr>
            </table>
          </div>
          
          <p style="font-size: 15px; color: #94a3b8; margin: 20px 0;">This path is designed to give you a taste of everything the Palace offers. No pressure, no rush — just discovery.</p>
          
          <a href="${appUrl}/palace/floor/1/room/24fps" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #0f172a; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin-top: 10px;">
            Start Day 1 Now →
          </a>
          
          <p style="font-size: 13px; color: #64748b; margin-top: 30px; border-top: 1px solid #334155; padding-top: 20px;">
            Questions? Reply to this email — we read every message.<br>
            <span style="color: #475569;">The Phototheology Team</span>
          </p>
        </div>
      `;
    
    case 'engagement':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Keep Your Streak Going, ${displayName}! 🔥</h1>
          <p>We noticed you haven't logged in for a while. Your Bible study journey is waiting!</p>
          <p><strong>What you're missing:</strong></p>
          <ul>
            <li>New daily challenges and drills</li>
            <li>Updated leaderboards</li>
            <li>Fresh escape rooms to conquer</li>
          </ul>
          <p>Don't lose momentum - come back and continue mastering the Phototheology method!</p>
          <a href="${Deno.env.get('SUPABASE_URL')}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Continue Learning
          </a>
        </div>
      `;
    
    case 'achievement':
      const achievementName = customData?.achievementName || 'New Achievement';
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Achievement Unlocked! 🏆</h1>
          <p>Congratulations ${displayName}!</p>
          <div style="background: #f0f9ff; border: 2px solid #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; color: #1e40af;">${achievementName}</h2>
            <p style="margin: 10px 0 0 0; color: #64748b;">${customData?.description || ''}</p>
          </div>
          <p>Keep up the great work in your Bible study journey!</p>
          <a href="${Deno.env.get('SUPABASE_URL')}/achievements" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            View All Achievements
          </a>
        </div>
      `;
    
    case 'milestone':
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Your Week in Review 📊</h1>
          <p>Hi ${displayName}!</p>
          <p>Here's what you accomplished this week:</p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0;">This Week's Stats:</h3>
            <p><strong>Study Sessions:</strong> ${customData?.sessions || 0}</p>
            <p><strong>Challenges Completed:</strong> ${customData?.challenges || 0}</p>
            <p><strong>Points Earned:</strong> ${customData?.points || 0}</p>
            <p><strong>Current Streak:</strong> ${customData?.streak || 0} days 🔥</p>
          </div>
          <p>Great progress! Keep building your Bible study skills.</p>
          <a href="${Deno.env.get('SUPABASE_URL')}/dashboard" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
            Continue Learning
          </a>
        </div>
      `;
    
    default:
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Message from Phototheology</h1>
          <p>Hi ${displayName},</p>
          <p>${campaign.subject}</p>
        </div>
      `;
  }
}

serve(handler);
