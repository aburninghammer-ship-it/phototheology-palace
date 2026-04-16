import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-PDF-PURCHASES] ${step}${detailsStr}`);
};

// Product configurations matching send-pdf-emails-batch
const PRODUCT_CONFIG = {
  "genesis-6-days": {
    name: "Genesis in 6 Days",
    priceId: "price_1SnQAcFGDAd3RU8IRqoiIPsh",
    productId: "prod_Tkw2inXRI6c6Ow",
    amount: 900, // $9.00
  },
  "study-suite": {
    name: "PhototheologyOS",
    priceId: "price_1SnNoGFGDAd3RU8I4ALn4b0N",
    productId: "prod_TktboSZYb6oAQt",
    amount: 9700, // $97.00
  },
  "quick-start-guide": {
    name: "Phototheology Quick-Start Guide",
    priceId: "price_1SnPPvFGDAd3RU8ID1mGI7TR",
    productId: "prod_TktbhIk7zIQ28w",
    amount: 1200, // $12.00
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      throw new Error("No authorization header provided");
    }

    // Use service role client to verify the user token (ES256 compatible)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: authUser }, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !authUser) {
      logStep("Auth failed", { error: userError?.message });
      throw new Error("Authentication failed");
    }

    // Check if user is admin using user_roles table
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: isAdmin, error: roleError } = await supabaseClient
      .rpc('has_role', { _user_id: authUser.id, _role: 'admin' });

    if (roleError || !isAdmin) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified", { userId: authUser.id });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    logStep("Fetching checkout sessions for PDF products");

    // Fetch recent checkout sessions that are completed one-time payments
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items'],
    });

    logStep("Got checkout sessions", { count: sessions.data.length });

    // Get email logs from database (reuse supabaseAdmin from above)
    
    const { data: emailLogs } = await supabaseAdmin
      .from("pdf_email_logs")
      .select("checkout_session_id, email, product_key, sent_at, success");
    
    // Create a map for quick lookup
    const emailLogMap = new Map<string, { sent_at: string; success: boolean }>();
    emailLogs?.forEach(log => {
      if (log.checkout_session_id) {
        emailLogMap.set(log.checkout_session_id, {
          sent_at: log.sent_at,
          success: log.success,
        });
      }
    });

    // Find all PDF purchases
    const pdfPurchases: any[] = [];

    for (const session of sessions.data) {
      if (session.mode !== 'payment') continue;
      if (session.payment_status !== 'paid') continue;

      // Check against each product
      for (const [productKey, config] of Object.entries(PRODUCT_CONFIG)) {
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
          const emailLog = emailLogMap.get(session.id);
          pdfPurchases.push({
            id: session.id,
            product: config.name,
            productKey,
            amount: (session.amount_total || 0) / 100,
            email: session.customer_details?.email || null,
            name: session.customer_details?.name || null,
            date: new Date((session.created || 0) * 1000).toISOString(),
            pdfSent: emailLog?.success || false,
            pdfSentAt: emailLog?.sent_at || null,
          });
          break; // Don't double-count
        }
      }
    }

    logStep("Found PDF purchases", { count: pdfPurchases.length });

    // Sort by date descending
    pdfPurchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Group by product for summary
    const byProduct: Record<string, { count: number; revenue: number }> = {};
    for (const p of pdfPurchases) {
      if (!byProduct[p.product]) {
        byProduct[p.product] = { count: 0, revenue: 0 };
      }
      byProduct[p.product].count++;
      byProduct[p.product].revenue += p.amount;
    }

    return new Response(
      JSON.stringify({
        purchases: pdfPurchases,
        byProduct,
        totalRevenue: pdfPurchases.reduce((sum, p) => sum + p.amount, 0),
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
