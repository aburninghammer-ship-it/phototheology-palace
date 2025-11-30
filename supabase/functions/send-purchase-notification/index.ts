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
      subscriptionTier 
    }: PurchaseNotificationRequest = await req.json();

    console.log("Sending purchase notification for:", { userEmail, amount });

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);

    // Determine tier label for subject
    const tierLabel = subscriptionTier 
      ? subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1).toLowerCase()
      : 'Unknown';
    
    const tierEmoji = subscriptionTier === 'premium' ? '👑' 
      : subscriptionTier === 'essential' ? '⭐' 
      : subscriptionTier === 'student' ? '🎓'
      : '💰';

    const emailResponse = await resend.emails.send({
      from: "Phototheology Notifications <onboarding@resend.dev>",
      to: ["aburninghammer@gmail.com"],
      subject: `${tierEmoji} New ${tierLabel} Subscription: ${formattedAmount}`,
      html: `
        <h2>New Purchase Notification</h2>
        <p><strong>Customer Email:</strong> ${userEmail}</p>
        <p><strong>Customer Name:</strong> ${userName || 'Not provided'}</p>
        <p><strong>Amount:</strong> ${formattedAmount}</p>
        ${subscriptionTier ? `<p><strong>Subscription Tier:</strong> ${subscriptionTier}</p>` : ''}
        ${product ? `<p><strong>Product:</strong> ${product}</p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">Purchased at: ${new Date().toLocaleString()}</p>
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
