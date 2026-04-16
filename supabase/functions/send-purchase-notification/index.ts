import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PurchaseNotificationRequest {
  userEmail: string;
  userName?: string;
  amount: number;
  currency: string;
  product?: string;
  subscriptionTier?: string;
  isTrialing?: boolean;
  trialEndsAt?: string;
  billingInterval?: string; // 'month' or 'year'
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  renewalDate?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      userEmail, 
      userName, 
      amount, 
      currency, 
      product,
      subscriptionTier,
      isTrialing,
      trialEndsAt,
      billingInterval,
      stripeCustomerId,
      stripeSubscriptionId,
      renewalDate,
    }: PurchaseNotificationRequest = await req.json();

    console.log("Sending purchase notification for:", { userEmail, amount, subscriptionTier, isTrialing });

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'usd').toUpperCase(),
    }).format(amount / 100);

    // Determine tier label for subject
    const tierLabel = subscriptionTier === 'donation' ? 'Donation'
      : subscriptionTier 
        ? subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1).toLowerCase()
        : 'Unknown';
    
    const tierEmoji = subscriptionTier === 'donation' ? '💝'
      : subscriptionTier === 'premium' ? '👑' 
      : subscriptionTier === 'essential' ? '⭐' 
      : subscriptionTier === 'student' ? '🎓'
      : '💰';

    // Determine billing cycle
    const billingCycle = billingInterval === 'year' ? 'Annual' 
      : billingInterval === 'month' ? 'Monthly' 
      : '';

    // Format dates nicely
    const formatDate = (dateStr?: string) => {
      if (!dateStr) return null;
      try {
        return new Date(dateStr).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      } catch {
        return dateStr;
      }
    };

    const formattedTrialEnd = formatDate(trialEndsAt);
    const formattedRenewal = formatDate(renewalDate);
    const purchaseTime = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });

    // Build subject line
    const subjectStatus = isTrialing ? '🆓 Trial Started' : `${tierEmoji} New ${tierLabel} Subscriber`;
    const subject = isTrialing 
      ? `🆓 New Trial Started: ${userName || userEmail} (${tierLabel})`
      : `${tierEmoji} New Paid Subscriber: ${userName || userEmail} → ${formattedAmount}/${billingInterval || 'mo'}`;

    // Build Stripe dashboard link
    const stripeCustomerLink = stripeCustomerId 
      ? `https://dashboard.stripe.com/customers/${stripeCustomerId}`
      : null;
    const stripeSubLink = stripeSubscriptionId
      ? `https://dashboard.stripe.com/subscriptions/${stripeSubscriptionId}`
      : null;

    const emailResponse = await resend.emails.send({
      from: "Phototheology Notifications <noreply@thephototheologyapp.com>",
      to: ["aburninghammer@gmail.com"],
      subject,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #f5d742; margin: 0; font-size: 24px;">
              ${isTrialing ? '🆓 New Trial Started!' : `${tierEmoji} New ${tierLabel} Subscriber!`}
            </h1>
          </div>
          
          <div style="background: #f8f9fa; padding: 24px; border: 1px solid #e9ecef;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Customer</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  ${userName || 'Not provided'}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Email</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  <a href="mailto:${userEmail}" style="color: #007bff;">${userEmail}</a>
                </td>
              </tr>
              <tr style="background: #e8f5e9;">
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #2e7d32;">💵 Amount</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right; font-size: 18px; font-weight: bold; color: #2e7d32;">
                  ${formattedAmount}${billingCycle ? ` / ${billingInterval}` : ''}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Plan</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  ${tierLabel}${billingCycle ? ` (${billingCycle})` : ''}
                </td>
              </tr>
              ${isTrialing ? `
              <tr style="background: #fff3e0;">
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #ef6c00;">⏳ Trial Status</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right; color: #ef6c00;">
                  14-Day Trial${formattedTrialEnd ? ` (ends ${formattedTrialEnd})` : ''}
                </td>
              </tr>
              ` : ''}
              ${formattedRenewal ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">📅 Next Renewal</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  ${formattedRenewal}
                </td>
              </tr>
              ` : ''}
              ${product ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">
                  <strong style="color: #495057;">Product</strong>
                </td>
                <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6; text-align: right;">
                  ${product}
                </td>
              </tr>
              ` : ''}
            </table>
            
            ${stripeCustomerLink || stripeSubLink ? `
            <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #dee2e6;">
              <strong style="color: #6c757d; font-size: 12px; text-transform: uppercase;">Stripe Dashboard</strong>
              <div style="margin-top: 8px;">
                ${stripeCustomerLink ? `<a href="${stripeCustomerLink}" style="color: #007bff; margin-right: 16px;">View Customer →</a>` : ''}
                ${stripeSubLink ? `<a href="${stripeSubLink}" style="color: #007bff;">View Subscription →</a>` : ''}
              </div>
            </div>
            ` : ''}
          </div>
          
          <div style="background: #212529; padding: 16px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #adb5bd; margin: 0; font-size: 12px;">
              Purchased at: ${purchaseTime}
            </p>
          </div>
        </div>
      `,
    });

    console.log("Purchase notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending purchase notification:", error);
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
