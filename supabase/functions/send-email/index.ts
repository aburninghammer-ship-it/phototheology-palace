import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type EmailType =
  | "admin-signup"
  | "daily-challenge"
  | "devotional-ready"
  | "engagement"
  | "feedback"
  | "invitation"
  | "partner-nudge"
  | "purchase-notification"
  | "renewal-reminder"
  | "signup-notification";

interface EmailRequest {
  type: EmailType;
  data: Record<string, any>;
}

/**
 * Consolidated email function that handles all email types
 * Replaces 8 separate email functions with a single unified handler
 */
// HTML escape helper to prevent injection
function escapeHtml(str: string): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    const { type, data }: EmailRequest = await req.json();

    // ===== MANDATORY AUTH CHECK (except for service-triggered types) =====
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Admin-only types require admin check
    const adminOnlyTypes: EmailType[] = ['admin-signup', 'daily-challenge', 'engagement', 'renewal-reminder', 'signup-notification', 'partner-nudge', 'purchase-notification', 'devotional-ready'];
    if (adminOnlyTypes.includes(type)) {
      const { data: adminCheck } = await supabaseAdmin
        .from('admin_users').select('id').eq('user_id', user.id).maybeSingle();
      if (!adminCheck) {
        return new Response(JSON.stringify({ error: 'Admin access required' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    // ===== END AUTH CHECK =====

    console.log(`Sending ${type} email`);

    let emailConfig: {
      from: string;
      to: string | string[];
      subject: string;
      html: string;
    };

    // Route to appropriate email template based on type
    switch (type) {
      case "admin-signup":
        emailConfig = {
          from: "Phototheology <onboarding@resend.dev>",
          to: ["aburninghammer@gmail.com"],
          subject: `📧 Latest Signup Details: ${data.userName}`,
          html: `
            <h2>Latest User Signup</h2>
            <p><strong>Name:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> ${data.userEmail}</p>
            <p><strong>Signed Up:</strong> ${data.signupTime}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent from Phototheology Admin</p>
          `,
        };
        break;

      case "daily-challenge":
        emailConfig = {
          from: "Phototheology <daily@thephototheologyapp.com>",
          to: data.email,
          subject: `🎯 Your Daily Challenge for ${data.date}`,
          html: `
            <h2>Today's Challenge</h2>
            <p>Hi ${data.name},</p>
            <p>${data.challengeText}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <a href="${data.challengeUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Start Challenge
            </a>
            <hr>
            <p style="color: #666; font-size: 12px;">Don't want daily emails? <a href="${data.unsubscribeUrl}">Unsubscribe</a></p>
          `,
        };
        break;

      case "engagement":
        emailConfig = {
          from: "Phototheology <hello@thephototheologyapp.com>",
          to: data.email,
          subject: data.subject || "We miss you at Phototheology!",
          html: `
            <h2>${data.heading}</h2>
            <p>Hi ${data.name},</p>
            <p>${data.message}</p>
            ${data.ctaUrl ? `
              <a href="${data.ctaUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                ${data.ctaText || 'Continue Learning'}
              </a>
            ` : ''}
            <hr>
            <p style="color: #666; font-size: 12px;">Phototheology - Master Scripture Through Visual Memory</p>
          `,
        };
        break;

      case "feedback":
        emailConfig = {
          from: "Phototheology <feedback@thephototheologyapp.com>",
          to: ["aburninghammer@gmail.com"],
          subject: `💬 New Feedback from ${data.userName}`,
          html: `
            <h2>New User Feedback</h2>
            <p><strong>From:</strong> ${data.userName} (${data.userEmail})</p>
            <p><strong>Category:</strong> ${data.category || 'General'}</p>
            <p><strong>Rating:</strong> ${data.rating ? '⭐'.repeat(data.rating) : 'N/A'}</p>
            <hr>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Sent: ${data.timestamp}</p>
          `,
        };
        break;

      case "invitation":
        const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verify user authorization for invitations
        const authHeader = req.headers.get('authorization');
        if (!authHeader) throw new Error('No authorization header');

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);
        if (authError || !user) throw new Error('Unauthorized');

        emailConfig = {
          from: "Phototheology <invite@thephototheologyapp.com>",
          to: data.recipientEmail,
          subject: `${data.senderName || 'Someone'} invited you to Phototheology!`,
          html: `
            <h2>You're Invited to Phototheology!</h2>
            <p>Hi ${data.recipientName || 'there'},</p>
            <p>${data.senderName || 'Someone'} has invited you to join Phototheology, the visual Bible memory platform.</p>
            ${data.message ? `<p><em>"${data.message}"</em></p>` : ''}
            <a href="${data.inviteUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Accept Invitation
            </a>
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              This invitation ${data.maxUses ? `can be used ${data.maxUses} times` : 'is for single use'}
              ${data.expiresAt ? ` and expires on ${new Date(data.expiresAt).toLocaleDateString()}` : ''}.
            </p>
            <hr>
            <p style="color: #666; font-size: 12px;">Phototheology - Master Scripture Through Visual Memory</p>
          `,
        };
        break;

      case "partner-nudge":
        emailConfig = {
          from: "Phototheology <partners@thephototheologyapp.com>",
          to: data.email,
          subject: `👥 Your study partner ${data.partnerName} is waiting!`,
          html: `
            <h2>Study Partner Activity</h2>
            <p>Hi ${data.name},</p>
            <p>${data.partnerName} ${data.activityMessage}</p>
            <p>Keep the momentum going!</p>
            <a href="${data.activityUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              View Activity
            </a>
            <hr>
            <p style="color: #666; font-size: 12px;">Partner notifications • <a href="${data.settingsUrl}">Settings</a></p>
          `,
        };
        break;

      case "purchase-notification":
        emailConfig = {
          from: "Phototheology <billing@thephototheologyapp.com>",
          to: ["aburninghammer@gmail.com"],
          subject: `💰 New Purchase: ${data.amount} - ${data.userName}`,
          html: `
            <h2>New Purchase Alert</h2>
            <p><strong>Customer:</strong> ${data.userName} (${data.userEmail})</p>
            <p><strong>Amount:</strong> $${data.amount}</p>
            <p><strong>Plan:</strong> ${data.planName}</p>
            <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
            <p><strong>Date:</strong> ${data.purchaseDate}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">Phototheology Admin Notification</p>
          `,
        };
        break;

      case "renewal-reminder":
        emailConfig = {
          from: "Phototheology <billing@thephototheologyapp.com>",
          to: data.email,
          subject: `🔔 Your Phototheology subscription ${data.daysUntilRenewal <= 0 ? 'has renewed' : 'renews soon'}`,
          html: `
            <h2>Subscription ${data.daysUntilRenewal <= 0 ? 'Renewed' : 'Renewal Reminder'}</h2>
            <p>Hi ${data.name},</p>
            ${data.daysUntilRenewal > 0 ? `
              <p>Your ${data.planName} subscription will renew in ${data.daysUntilRenewal} days.</p>
              <p><strong>Renewal Amount:</strong> $${data.amount}</p>
              <p><strong>Renewal Date:</strong> ${new Date(data.renewalDate).toLocaleDateString()}</p>
            ` : `
              <p>Your ${data.planName} subscription has been renewed successfully.</p>
              <p><strong>Amount Charged:</strong> $${data.amount}</p>
              <p><strong>Next Renewal:</strong> ${new Date(data.nextRenewalDate).toLocaleDateString()}</p>
            `}
            <a href="${data.manageUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Manage Subscription
            </a>
            <hr>
            <p style="color: #666; font-size: 12px;">Questions? Contact support@thephototheologyapp.com</p>
          `,
        };
        break;

      case "devotional-ready":
        emailConfig = {
          from: "Phototheology <devotionals@thephototheologyapp.com>",
          to: data.email,
          subject: `🎉 Your Devotional "${data.planTitle}" is Ready!`,
          html: `
            <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="margin: 0; font-size: 28px; color: white;">🎉 Your Devotional is Ready!</h1>
              </div>
              <div style="background: #1a1a2e; padding: 30px; color: #ffffff;">
                <p style="font-size: 18px; color: #e4e4e7;">Hi ${data.name},</p>
                <p style="color: #a1a1aa; line-height: 1.7;">
                  Great news! Your ${data.duration}-day devotional "<strong style="color: #a78bfa;">${data.planTitle}</strong>" 
                  on the theme of "${data.theme}" has been generated and Day 1 is now available!
                </p>
                
                <div style="background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                  <h3 style="margin: 0 0 10px 0; color: #a78bfa;">📖 Day 1: ${data.firstDayTitle}</h3>
                  <p style="margin: 0; color: #d4d4d8;">${data.firstDayScripture}</p>
                </div>
                
                <p style="color: #a1a1aa; line-height: 1.7;">
                  <strong style="color: #34d399;">How it works:</strong> A new day will unlock every 24 hours, 
                  and you'll receive an email each morning with that day's devotional content. 
                  This drip-release format helps you savor each day's insights without rushing ahead.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://phototheology.app/devotional/${data.planId}" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                    Start Day 1 Now →
                  </a>
                </div>
              </div>
              <div style="background: #0f0f1a; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
                <p style="margin: 0; color: #71717a; font-size: 12px;">
                  Phototheology - Master Scripture Through Visual Memory
                </p>
              </div>
            </div>
          `,
        };
        break;

      case "signup-notification":
        emailConfig = {
          from: "Phototheology <welcome@thephototheologyapp.com>",
          to: data.email,
          subject: "🎉 Welcome to Phototheology!",
          html: `
            <h2>Welcome to Phototheology!</h2>
            <p>Hi ${data.name},</p>
            <p>We're excited to have you join our community of Scripture masters!</p>
            <p><strong>Here's what you can do next:</strong></p>
            <ul>
              <li>📖 Explore your first Memory Palace</li>
              <li>🎮 Try a Bible memory game</li>
              <li>🎯 Complete your first daily challenge</li>
              <li>👥 Find a study partner</li>
            </ul>
            <a href="${data.dashboardUrl}" style="display: inline-block; padding: 10px 20px; background: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              Get Started
            </a>
            ${data.hasPromoCode ? `
              <p style="margin-top: 20px; padding: 15px; background: #F3F4F6; border-radius: 5px;">
                <strong>🎁 Special Offer:</strong> Use code <code style="background: white; padding: 2px 8px; border-radius: 3px;">${data.promoCode}</code> for ${data.promoDiscount} off!
              </p>
            ` : ''}
            <hr>
            <p style="color: #666; font-size: 12px;">Need help getting started? <a href="${data.helpUrl}">Check out our guide</a></p>
          `,
        };
        break;

      default:
        throw new Error(`Unknown email type: ${type}`);
    }

    const emailResponse = await resend.emails.send(emailConfig);
    console.log(`${type} email sent successfully:`, emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
