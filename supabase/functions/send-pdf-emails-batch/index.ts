import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { Resend } from "https://esm.sh/resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[BATCH-SEND-PDF-EMAILS] ${step}${detailsStr}`);
};

// Product configuration
const GENESIS_PDF_PRICE_ID = "price_1SnQAcFGDAd3RU8IRqoiIPsh";
const GENESIS_PDF_PRODUCT_ID = "prod_Tkw2inXRI6c6Ow";
const GENESIS_PDF_AMOUNT = 900;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Verify admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    // Create a client scoped to the current user (so PostgREST/RPC runs as authenticated)
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }

    // Check if user is admin using role function (avoids RLS issues)
    const { data: isAdmin, error: roleError } = await supabaseClient.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });

    logStep("Admin check", { userId: userData.user.id, isAdmin });

    if (roleError) {
      logStep("Admin role check error", { message: roleError.message });
      throw new Error("Admin access required");
    }

    if (!isAdmin) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified", { userId: userData.user.id });

    // Parse request for dry run mode
    let dryRun = true;
    try {
      const body = await req.json();
      dryRun = body.dryRun !== false;
    } catch {
      // Default to dry run if no body
    }

    logStep("Mode", { dryRun });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Create Supabase client for storage access
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    logStep("Fetching checkout sessions");

    // Fetch all checkout sessions
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items'],
    });

    logStep("Got checkout sessions", { count: sessions.data.length });

    // Find Genesis PDF purchases
    const pdfPurchases: Array<{
      email: string;
      name: string | null;
      sessionId: string;
      date: string;
    }> = [];

    for (const session of sessions.data) {
      if (session.mode !== 'payment') continue;
      if (session.payment_status !== 'paid') continue;
      if (session.amount_total !== GENESIS_PDF_AMOUNT) continue;
      if (!session.customer_details?.email) continue;

      // Check if this is the Genesis PDF
      let isGenesisPdf = false;
      if (session.line_items?.data) {
        for (const item of session.line_items.data) {
          if (item.price?.id === GENESIS_PDF_PRICE_ID || 
              item.price?.product === GENESIS_PDF_PRODUCT_ID) {
            isGenesisPdf = true;
            break;
          }
        }
      }

      // If amount matches, include it
      if (session.amount_total === GENESIS_PDF_AMOUNT) {
        isGenesisPdf = true;
      }

      if (isGenesisPdf) {
        pdfPurchases.push({
          email: session.customer_details.email,
          name: session.customer_details.name,
          sessionId: session.id,
          date: new Date((session.created || 0) * 1000).toISOString(),
        });
      }
    }

    logStep("Found PDF purchases with emails", { count: pdfPurchases.length });

    if (dryRun) {
      // Just return the list without sending
      return new Response(
        JSON.stringify({
          mode: "dry-run",
          message: "Set dryRun: false to actually send emails",
          purchases: pdfPurchases,
          totalCount: pdfPurchases.length,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Generate signed URL for the PDF
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("products")
      .createSignedUrl("GENESIS-IN-6-DAYS.pdf", 604800); // 7 days

    if (signedUrlError || !signedUrlData) {
      throw new Error("Failed to generate download link");
    }

    const downloadUrl = signedUrlData.signedUrl;
    logStep("Generated signed URL for PDF");

    // Send emails to all purchasers
    const results: Array<{
      email: string;
      success: boolean;
      error?: string;
    }> = [];

    for (const purchase of pdfPurchases) {
      try {
        const customerName = purchase.name || purchase.email.split('@')[0];

        const emailResponse = await resend.emails.send({
          from: "Phototheology <noreply@thephototheologyapp.com>",
          to: [purchase.email],
          subject: `Your Genesis in 6 Days PDF is Ready! 📖`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #f5d742; margin: 0; font-size: 28px;">
                  Your PDF is Ready! 📥
                </h1>
                <p style="color: #adb5bd; margin-top: 8px; font-size: 16px;">
                  Genesis in 6 Days
                </p>
              </div>
              
              <div style="padding: 32px; border: 1px solid #e9ecef; border-top: none;">
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                  Hi ${customerName},
                </p>
                
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                  Thank you for purchasing <strong>Genesis in 6 Days</strong>! 
                  Here's your download link:
                </p>

                <div style="margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; text-align: center;">
                  <a href="${downloadUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #f5d742, #c9a800); color: #1a1a2e; 
                            padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 18px;">
                    📥 Download Genesis in 6 Days PDF
                  </a>
                  <p style="color: #adb5bd; font-size: 12px; margin-top: 16px;">
                    Link expires in 7 days. Having trouble? Reply to this email.
                  </p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #f5d742;">
                  <h3 style="color: #1a1a2e; margin: 0 0 8px 0; font-size: 16px;">💡 What's Next?</h3>
                  <p style="color: #495057; margin: 0; font-size: 14px; line-height: 1.6;">
                    Ready to explore the entire Phototheology Palace? Start your 7-day free trial 
                    at <a href="https://thephototheologyapp.com/pricing" style="color: #007bff;">thephototheologyapp.com/pricing</a>
                  </p>
                </div>
              </div>
              
              <div style="background: #212529; padding: 24px; border-radius: 0 0 12px 12px; text-align: center;">
                <p style="color: #f5d742; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                  The Phototheology App
                </p>
                <p style="color: #6c757d; margin: 0; font-size: 12px;">
                  Questions? Reply to this email or contact support@thephototheologyapp.com
                </p>
              </div>
            </div>
          `,
        });

        results.push({
          email: purchase.email,
          success: true,
        });

        logStep("Email sent", { email: purchase.email });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        results.push({
          email: purchase.email,
          success: false,
          error: errorMessage,
        });
        logStep("Email failed", { email: purchase.email, error: errorMessage });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    logStep("Batch complete", { successCount, failCount });

    return new Response(
      JSON.stringify({
        mode: "sent",
        results,
        successCount,
        failCount,
        totalCount: pdfPurchases.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
