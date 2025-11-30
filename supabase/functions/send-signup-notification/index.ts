import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupNotificationRequest {
  userEmail: string;
  displayName?: string;
  userId: string;
  subscriptionTier?: string; // 'free', 'essential', 'premium', 'student'
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, displayName, userId, subscriptionTier }: SignupNotificationRequest = await req.json();

    console.log("Sending signup notification for:", { userEmail, userId, subscriptionTier });

    // Determine tier label and emoji for subject
    const tier = subscriptionTier || 'free';
    const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
    const tierEmoji = tier === 'premium' ? '👑' 
      : tier === 'essential' ? '⭐' 
      : tier === 'student' ? '🎓'
      : '🆓'; // Free

    const emailResponse = await resend.emails.send({
      from: "Phototheology Notifications <onboarding@resend.dev>",
      to: ["aburninghammer@gmail.com"],
      subject: `${tierEmoji} New ${tierLabel} Sign-Up: ${displayName || userEmail}`,
      html: `
        <h2>New User Registration</h2>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Name:</strong> ${displayName || 'Not provided'}</p>
        <p><strong>Tier:</strong> ${tierLabel}</p>
        <p><strong>User ID:</strong> ${userId}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Signed up at: ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Signup notification sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending signup notification:", error);
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
