import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  source: "patreon" | "teachable";
  pledgeAmount?: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const { email, name, source, pledgeAmount }: WelcomeEmailRequest = await req.json();

    console.log(`Sending welcome email to ${email} (${name}) from ${source}`);

    const firstName = name.split(" ")[0] || name;
    const sourceDisplay = source === "patreon" ? "Patreon" : "Teachable Master Class";
    const appUrl = "https://phototheology-palace.lovable.app";

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to PhototheologyOS!</title>
</head>
<body style="font-family: 'Georgia', serif; line-height: 1.6; color: #2c1810; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #faf8f5;">
  <div style="background: linear-gradient(135deg, #8B4513 0%, #654321 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
    <h1 style="color: #f5e6d3; margin: 0; font-size: 28px;">Welcome to PhototheologyOS!</h1>
    <p style="color: #d4c4b0; margin: 10px 0 0 0; font-size: 16px;">Your Phototheology Journey Begins</p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5d5c5; border-top: none; border-radius: 0 0 12px 12px;">
    <p style="font-size: 18px; margin-bottom: 20px;">Dear ${firstName},</p>
    
    <p style="margin-bottom: 20px;">Thank you for joining us through <strong>${sourceDisplay}</strong>${pledgeAmount ? ` at $${(pledgeAmount / 100).toFixed(2)}/month` : ""}! 🎉</p>
    
    <p style="margin-bottom: 20px;">You now have access to <strong>PhototheologyOS</strong> — a powerful platform designed to help you study Scripture through the Phototheology method.</p>
    
    <div style="background: #f9f5f0; border-left: 4px solid #8B4513; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
      <h3 style="color: #654321; margin: 0 0 15px 0; font-size: 18px;">📋 How to Get Started:</h3>
      <ol style="margin: 0; padding-left: 20px; color: #4a3728;">
        <li style="margin-bottom: 10px;"><strong>Create an account</strong> at PhototheologyOS using the same email address (<strong>${email}</strong>)</li>
        <li style="margin-bottom: 10px;"><strong>Connect your ${source === "patreon" ? "Patreon" : "Teachable"} account</strong> by clicking the "${source === "patreon" ? "Connect with Patreon" : "Verify Teachable"}" button on the Pricing page</li>
        <li style="margin-bottom: 10px;"><strong>Start exploring</strong> the Palace floors, Bible reader, and all premium features!</li>
      </ol>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${appUrl}/auth" style="display: inline-block; background: linear-gradient(135deg, #8B4513 0%, #654321 100%); color: #ffffff; padding: 15px 35px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Get Started Now →</a>
    </div>
    
    <p style="margin-bottom: 20px;">If you have any questions, simply reply to this email or reach out at <a href="mailto:aburninghammer@gmail.com" style="color: #8B4513;">aburninghammer@gmail.com</a>.</p>
    
    <p style="margin-bottom: 5px;">Blessings on your study,</p>
    <p style="margin: 0; font-weight: bold; color: #654321;">The Phototheology Team</p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #8a7a6a; font-size: 12px;">
    <p style="margin: 0;">© ${new Date().getFullYear()} Phototheology Palace. All rights reserved.</p>
  </div>
</body>
</html>
    `.trim();

    // Send welcome email to the new subscriber
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Phototheology <onboarding@resend.dev>",
        to: [email],
        subject: `Welcome to PhototheologyOS, ${firstName}! 📖`,
        html: emailHtml,
        reply_to: "aburninghammer@gmail.com",
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);
      throw new Error(`Failed to send welcome email: ${errorText}`);
    }

    console.log("Welcome email sent successfully");

    // Also notify admin
    const adminEmailHtml = `
      <h2>New ${sourceDisplay} Subscriber!</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${pledgeAmount ? `<p><strong>Pledge:</strong> $${(pledgeAmount / 100).toFixed(2)}/month</p>` : ""}
      <p><strong>Source:</strong> ${sourceDisplay}</p>
      <p><strong>Time:</strong> ${new Date().toISOString()}</p>
      <hr>
      <p>A welcome email with connection instructions has been sent to them automatically.</p>
    `;

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Phototheology Alerts <onboarding@resend.dev>",
        to: ["aburninghammer@gmail.com"],
        subject: `🎉 New ${sourceDisplay} Subscriber: ${name}`,
        html: adminEmailHtml,
      }),
    });

    console.log("Admin notification sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
