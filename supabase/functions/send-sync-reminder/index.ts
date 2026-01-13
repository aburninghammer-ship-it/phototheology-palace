import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-SYNC-REMINDER] ${step}${detailsStr}`);
};

interface ReminderRequest {
  testMode?: boolean;
  testEmail?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");
    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Authentication failed");

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Unauthorized - admin access required");
    logStep("Admin verified", { userId: userData.user.id });

    const { testMode, testEmail }: ReminderRequest = await req.json();
    logStep("Request parsed", { testMode });

    // Get all Stripe customers with active/trialing subscriptions
    const subscriptionsResponse = await fetch(
      "https://api.stripe.com/v1/subscriptions?status=active&limit=100",
      {
        headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
      }
    );
    const activeSubscriptions = await subscriptionsResponse.json();

    const trialingResponse = await fetch(
      "https://api.stripe.com/v1/subscriptions?status=trialing&limit=100",
      {
        headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
      }
    );
    const trialingSubscriptions = await trialingResponse.json();

    const allSubscriptions = [
      ...(activeSubscriptions.data || []),
      ...(trialingSubscriptions.data || []),
    ];

    logStep("Fetched Stripe subscriptions", { count: allSubscriptions.length });

    // Get customer emails from Stripe
    const customerEmails = new Map<string, { email: string; tier: string }>();
    
    for (const sub of allSubscriptions) {
      const customerId = sub.customer;
      const customerResponse = await fetch(
        `https://api.stripe.com/v1/customers/${customerId}`,
        {
          headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
        }
      );
      const customer = await customerResponse.json();
      
      if (customer.email) {
        const priceId = sub.items?.data?.[0]?.price?.id || '';
        let tier = 'unknown';
        if (priceId.includes('student')) tier = 'Student';
        else if (priceId.includes('annual') || priceId.includes('year')) tier = 'Annual';
        else if (priceId.includes('pro')) tier = 'Pro';
        else if (priceId.includes('month')) tier = 'Monthly';
        
        customerEmails.set(customer.email.toLowerCase(), { email: customer.email, tier });
      }
    }

    logStep("Collected Stripe customer emails", { count: customerEmails.size });

    // Get auth users
    const { data: authUsers } = await supabaseClient.auth.admin.listUsers();
    const authEmails = new Set(
      authUsers?.users?.map(u => u.email?.toLowerCase()).filter(Boolean) || []
    );

    logStep("Fetched auth users", { count: authEmails.size });

    // Find unsynced users (in Stripe but not in auth)
    const unsyncedUsers: { email: string; tier: string }[] = [];
    for (const [emailLower, data] of customerEmails) {
      if (!authEmails.has(emailLower)) {
        unsyncedUsers.push(data);
      }
    }

    logStep("Found unsynced users", { count: unsyncedUsers.length });

    let emails: string[] = [];

    if (testMode && testEmail) {
      emails = [testEmail];
      logStep("Test mode - sending to", { testEmail });
    } else {
      emails = unsyncedUsers.map(u => u.email);
    }

    if (emails.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "No unsynced users to email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create email content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 24px; font-weight: bold; color: #1a1a2e; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; padding: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">📖 PhotoTheology</div>
    </div>
    <div class="content">
      <h2>Your Subscription is Active!</h2>
      <p>Thank you for subscribing to PhotoTheology! We noticed you haven't logged into the app yet.</p>
      <p>To access all your premium features, please sign up or log in using the same email address you used for your subscription.</p>
      <p style="text-align: center;">
        <a href="https://thephototheologyapp.com/auth" class="cta-button">Access Your Account →</a>
      </p>
      <p>Once logged in, you'll have full access to:</p>
      <ul>
        <li>All 8 Floors of the PhotoTheology Palace</li>
        <li>Jeeves AI Bible Study Assistant</li>
        <li>Daily Challenges & Community Features</li>
        <li>Premium Study Tools & Resources</li>
      </ul>
      <p>If you have any questions, just reply to this email!</p>
    </div>
    <div class="footer">
      <p>© 2024 PhotoTheology. All rights reserved.</p>
      <p>You received this because you have an active subscription.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Send emails in batches
    const batchSize = 50;
    let totalSent = 0;
    const errors: string[] = [];

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      
      try {
        const response = await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(batch.map(email => ({
            from: "PhotoTheology <support@thephototheologyapp.com>",
            to: [email],
            subject: "Your PhotoTheology Subscription is Ready! 📖",
            html: htmlContent,
          }))),
        });

        if (!response.ok) {
          const errorText = await response.text();
          logStep("Batch send error", { batch: i / batchSize, error: errorText });
          errors.push(`Batch ${i / batchSize}: ${errorText}`);
        } else {
          totalSent += batch.length;
          logStep("Batch sent successfully", { batch: i / batchSize, count: batch.length });
        }
      } catch (batchError: unknown) {
        const errorMsg = batchError instanceof Error ? batchError.message : String(batchError);
        errors.push(`Batch ${i / batchSize}: ${errorMsg}`);
      }

      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    logStep("Email sending complete", { totalSent, errors: errors.length });

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent: totalSent, 
        total: emails.length,
        unsyncedCount: unsyncedUsers.length,
        errors: errors.length > 0 ? errors : undefined,
        message: `Successfully sent ${totalSent} reminder emails to unsynced subscribers` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
