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

// Product configurations with Stripe IDs and storage file mappings
const PRODUCT_CONFIG = {
  "genesis-6-days": {
    name: "Genesis in 6 Days",
    priceId: "price_1SnQAcFGDAd3RU8IRqoiIPsh",
    productId: "prod_Tkw2inXRI6c6Ow",
    amount: 900, // $9.00
    files: ["GENESIS-IN-6-DAYS.pdf"],
    description: "Master Genesis using the Phototheology method in just 6 days"
  },
  "study-suite": {
    name: "PhototheologyOS",
    priceId: "price_1SnNoGFGDAd3RU8I4ALn4b0N",
    productId: "prod_TktboSZYb6oAQt",
    amount: 9700, // $97.00
    files: ["FLOOR-2.pdf", "FLOOR-4-The-Next-Level-Floor.pdf", "FLOOR-6.pdf"],
    description: "The complete PhototheologyOS collection"
  },
  "quick-start-guide": {
    name: "Phototheology Quick-Start Guide",
    priceId: "price_1SnPPvFGDAd3RU8ID1mGI7TR",
    productId: "prod_TktbhIk7zIQ28w",
    amount: 1200, // $12.00
    files: ["THE-PHOTOTHEOLOGY-QUICK-START-GUIDE.pdf"],
    description: "Your fast-track introduction to the PhototheologyOS"
  }
};

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

    // Parse request for dry run mode and product filter
    let dryRun = true;
    let productFilter: string | null = null; // null = all products
    try {
      const body = await req.json();
      dryRun = body.dryRun !== false;
      productFilter = body.product || null;
    } catch {
      // Default to dry run if no body
    }

    logStep("Mode", { dryRun, productFilter });

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

    // Get existing email logs to skip already-sent emails
    const { data: existingLogs } = await supabase
      .from("pdf_email_logs")
      .select("checkout_session_id, success")
      .eq("success", true);
    
    const sentSessionIds = new Set(existingLogs?.map(log => log.checkout_session_id) || []);
    logStep("Already sent sessions", { count: sentSessionIds.size });

    // Find PDF purchases grouped by product
    const pdfPurchases: Array<{
      email: string;
      name: string | null;
      sessionId: string;
      date: string;
      productKey: string;
      productName: string;
    }> = [];

    for (const session of sessions.data) {
      if (session.mode !== 'payment') continue;
      if (session.payment_status !== 'paid') continue;
      if (!session.customer_details?.email) continue;
      
      // Skip if already sent
      if (sentSessionIds.has(session.id)) continue;

      // Check against each product
      for (const [productKey, config] of Object.entries(PRODUCT_CONFIG)) {
        // Skip if filtering by product and this isn't it
        if (productFilter && productFilter !== productKey) continue;

        let isMatch = false;

        // Check by line items first
        if (session.line_items?.data) {
          for (const item of session.line_items.data) {
            if (item.price?.id === config.priceId || 
                item.price?.product === config.productId) {
              isMatch = true;
              break;
            }
          }
        }

        // Fallback: check by amount
        if (!isMatch && session.amount_total === config.amount) {
          isMatch = true;
        }

        if (isMatch) {
          pdfPurchases.push({
            email: session.customer_details.email,
            name: session.customer_details.name,
            sessionId: session.id,
            date: new Date((session.created || 0) * 1000).toISOString(),
            productKey,
            productName: config.name,
          });
          break; // Don't double-count
        }
      }
    }

    logStep("Found PDF purchases needing emails", { count: pdfPurchases.length });

    if (dryRun) {
      // Group by product for summary
      const byProduct: Record<string, number> = {};
      for (const p of pdfPurchases) {
        byProduct[p.productName] = (byProduct[p.productName] || 0) + 1;
      }

      return new Response(
        JSON.stringify({
          mode: "dry-run",
          message: "Set dryRun: false to actually send emails",
          purchases: pdfPurchases,
          byProduct,
          totalCount: pdfPurchases.length,
          alreadySentCount: sentSessionIds.size,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Generate signed URLs for each product's files and send emails
    const results: Array<{
      email: string;
      product: string;
      success: boolean;
      error?: string;
    }> = [];

    // Cache signed URLs by product to avoid regenerating
    const signedUrlCache: Record<string, { name: string; url: string }[]> = {};

    for (const purchase of pdfPurchases) {
      try {
        const config = PRODUCT_CONFIG[purchase.productKey as keyof typeof PRODUCT_CONFIG];
        
        // Get or generate signed URLs for this product
        if (!signedUrlCache[purchase.productKey]) {
          const downloadLinks: { name: string; url: string }[] = [];
          
          for (const fileName of config.files) {
            const { data, error } = await supabase.storage
              .from("products")
              .createSignedUrl(fileName, 604800); // 7 days

            if (error) {
              logStep(`Failed to generate URL for ${fileName}`, { error: error.message });
              continue;
            }

            const displayName = fileName
              .replace('.pdf', '')
              .replace(/-/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');

            downloadLinks.push({ name: displayName, url: data.signedUrl });
          }

          signedUrlCache[purchase.productKey] = downloadLinks;
        }

        const downloadLinks = signedUrlCache[purchase.productKey];
        if (downloadLinks.length === 0) {
          throw new Error("No download links generated");
        }

        const customerName = purchase.name || purchase.email.split('@')[0];

        // Build download links HTML
        const downloadLinksHtml = downloadLinks.map(link => `
          <tr>
            <td style="padding: 8px 0;">
              <a href="${link.url}" 
                 style="display: inline-block; background: linear-gradient(135deg, #f5d742, #c9a800); color: #1a1a2e; 
                        padding: 14px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                📥 Download ${link.name}
              </a>
            </td>
          </tr>
        `).join('');

        const emailResponse = await resend.emails.send({
          from: "Phototheology <noreply@thephototheologyapp.com>",
          to: [purchase.email],
          subject: `Your ${config.name} is Ready! 📖`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
              <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: #f5d742; margin: 0; font-size: 28px;">
                  Your PDF is Ready! 📥
                </h1>
                <p style="color: #adb5bd; margin-top: 8px; font-size: 16px;">
                  ${config.name}
                </p>
              </div>
              
              <div style="padding: 32px; border: 1px solid #e9ecef; border-top: none;">
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                  Hi ${customerName},
                </p>
                
                <p style="color: #495057; font-size: 16px; line-height: 1.6;">
                  Thank you for purchasing <strong>${config.name}</strong>! 
                  ${config.description}.
                </p>

                <div style="margin: 32px 0; padding: 24px; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; text-align: center;">
                  <h2 style="color: #f5d742; margin: 0 0 16px 0; font-size: 20px;">
                    📥 Your Download${downloadLinks.length > 1 ? 's' : ''}
                  </h2>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${downloadLinksHtml}
                  </table>
                  <p style="color: #adb5bd; font-size: 12px; margin-top: 16px;">
                    Links expire in 7 days. Having trouble? Reply to this email.
                  </p>
                </div>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #f5d742;">
                  <h3 style="color: #1a1a2e; margin: 0 0 8px 0; font-size: 16px;">💡 What's Next?</h3>
                  <p style="color: #495057; margin: 0; font-size: 14px; line-height: 1.6;">
                    Ready to explore the entire Phototheology Palace? Start your 7-day free trial 
                    at <a href="https://phototheologybible.com/pricing" style="color: #007bff;">phototheologybible.com/pricing</a>
                  </p>
                </div>
              </div>
              
              <div style="background: #212529; padding: 24px; border-radius: 0 0 12px 12px; text-align: center;">
                <p style="color: #f5d742; margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">
                  The Phototheology App
                </p>
                <p style="color: #6c757d; margin: 0; font-size: 12px;">
                  Questions? Reply to this email or contact support@phototheologybible.com
                </p>
              </div>
            </div>
          `,
        });

        // Log successful email to database
        await supabase.from("pdf_email_logs").insert({
          email: purchase.email,
          product_key: purchase.productKey,
          checkout_session_id: purchase.sessionId,
          success: true,
        });

        results.push({
          email: purchase.email,
          product: config.name,
          success: true,
        });

        logStep("Email sent", { email: purchase.email, product: config.name });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Log failed email to database
        await supabase.from("pdf_email_logs").insert({
          email: purchase.email,
          product_key: purchase.productKey,
          checkout_session_id: purchase.sessionId,
          success: false,
          error_message: errorMessage,
        });

        results.push({
          email: purchase.email,
          product: purchase.productName,
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
