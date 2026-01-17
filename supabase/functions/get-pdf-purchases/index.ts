import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-PDF-PURCHASES] ${step}${detailsStr}`);
};

// Product ID for Genesis in 6 Days PDF
const GENESIS_PDF_PRODUCT_ID = "prod_Tkw2inXRI6c6Ow";
const GENESIS_PDF_PRICE_ID = "price_1SnQAcFGDAd3RU8IRqoiIPsh";
const GENESIS_PDF_AMOUNT = 900; // $9.00 in cents

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Verify admin access
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error("Authentication failed");
    }

    // Check if user is admin using user_roles table
    const { data: isAdmin } = await supabaseClient
      .rpc('has_role', { _user_id: userData.user.id, _role: 'admin' });

    if (!isAdmin) {
      throw new Error("Admin access required");
    }

    logStep("Admin verified", { userId: userData.user.id });

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    logStep("Fetching payment intents for PDF products");

    // Fetch recent checkout sessions that are completed one-time payments
    // We'll look for sessions where the amount matches the PDF price
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      expand: ['data.line_items'],
    });

    logStep("Got checkout sessions", { count: sessions.data.length });

    // Filter for Genesis PDF purchases (one-time payments of $9.00)
    const pdfPurchases: any[] = [];

    for (const session of sessions.data) {
      if (session.mode !== 'payment') continue;
      if (session.payment_status !== 'paid') continue;
      if (session.amount_total !== GENESIS_PDF_AMOUNT) continue;

      // Check if this is the Genesis PDF by line items
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

      // If no line items but amount matches, still include it
      if (!session.line_items?.data?.length && session.amount_total === GENESIS_PDF_AMOUNT) {
        isGenesisPdf = true;
      }

      if (isGenesisPdf) {
        pdfPurchases.push({
          id: session.id,
          product: "Genesis in 6 Days PDF",
          amount: (session.amount_total || 0) / 100,
          email: session.customer_details?.email || null,
          name: session.customer_details?.name || null,
          date: new Date((session.created || 0) * 1000).toISOString(),
        });
      }
    }

    logStep("Found PDF purchases", { count: pdfPurchases.length });

    // Sort by date descending
    pdfPurchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return new Response(
      JSON.stringify({
        purchases: pdfPurchases,
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
