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
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userName, userEmail, signupTime }: SignupEmailRequest = await req.json();

    console.log("Sending admin signup email for:", { userName, userEmail });

    const emailResponse = await resend.emails.send({
      from: "Phototheology <onboarding@resend.dev>",
      to: ["aburninghammer@gmail.com"],
      subject: `📧 Latest Signup Details: ${userName}`,
      html: `
        <h2>Latest User Signup</h2>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Signed Up:</strong> ${signupTime}</p>
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
