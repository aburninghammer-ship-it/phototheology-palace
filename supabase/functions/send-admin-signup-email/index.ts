import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupEmailRequest {
  userName: string;
  userEmail: string;
  signupTime: string;
  churchMember?: boolean;
  churchId?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userName, userEmail, signupTime, churchMember, churchId }: SignupEmailRequest = await req.json();

    console.log("Sending admin signup email for:", { userName, userEmail, churchMember });

    const churchBadge = churchMember 
      ? `<p style="background: #0d9488; color: white; display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">⛪ CHURCH MEMBER AUTO-JOINED</p>`
      : '';

    const emailResponse = await resend.emails.send({
      from: "Phototheology <noreply@thephototheologyapp.com>",
      to: ["aburninghammer@gmail.com"],
      subject: `${churchMember ? '⛪' : '📧'} ${churchMember ? 'Church Member Signed Up' : 'Latest Signup Details'}: ${userName}`,
      html: `
        <h2>${churchMember ? '⛪ New Church Member Account Created!' : 'Latest User Signup'}</h2>
        ${churchBadge}
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Signed Up:</strong> ${signupTime}</p>
        ${churchMember ? `<p><strong>Church ID:</strong> ${churchId}</p><p style="color: #0d9488; font-weight: 600;">✅ This member was automatically added to Living Manna Church from the pre-approved list.</p>` : ''}
        <hr>
        <p style="color: #666; font-size: 12px;">Sent from Phototheology Admin</p>
      `,
    });

    console.log("Admin signup email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending admin signup email:", error);
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
