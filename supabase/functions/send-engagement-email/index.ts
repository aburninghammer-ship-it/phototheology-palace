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
      }
    }

    // Send emails
    const emailPromises = targetUsers.map(async ({ email, userId: targetUserId, profile }) => {
      try {
        const emailContent = generateEmailContent(campaign, profile, customData);
        
        const emailResponse = await resend.emails.send({
          from: "Phototheology <onboarding@resend.dev>",
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
  const displayName = profile?.display_name || 'Friend';
  
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
