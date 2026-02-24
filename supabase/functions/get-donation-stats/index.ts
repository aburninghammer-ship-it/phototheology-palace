import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Known donation price IDs from create-donation edge function
const DONATION_PRICE_IDS = [
  "price_1ScyykFGDAd3RU8Id72ENqCz", // $5
  "price_1Sd0K6FGDAd3RU8IqILqXG5l", // $50
  "price_1Sd0LZFGDAd3RU8IlC2ABtJt", // $500
];

// Donation amounts in cents (for custom donations)
const KNOWN_DONATION_AMOUNTS = [500, 5000, 50000]; // $5, $50, $500

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[GET-DONATION-STATS] Function started");
    
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Get all successful checkout sessions for donations
    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      status: "complete",
    });

    const donations: Array<{
      id: string;
      amount: number;
      email: string | null;
      created: string;
      isDonation: boolean;
    }> = [];

    for (const session of sessions.data) {
      // Only count sessions explicitly marked as donations (submit_type = 'donate')
      // Skip subscription sessions entirely - they are NOT donations
      if (session.mode === "subscription") continue;
      if (session.submit_type === "donate") {
        if (session.amount_total) {
          donations.push({
            id: session.id,
            amount: session.amount_total,
            email: session.customer_email,
            created: new Date(session.created * 1000).toISOString(),
            isDonation: true,
          });
        }
      }
    }

    // Calculate stats
    const totalDonations = donations.length;
    const totalRevenue = donations.reduce((sum, d) => sum + d.amount, 0);
    
    // Group by amount
    const byAmount: Record<number, { count: number; total: number }> = {};
    for (const d of donations) {
      const amountKey = d.amount;
      if (!byAmount[amountKey]) {
        byAmount[amountKey] = { count: 0, total: 0 };
      }
      byAmount[amountKey].count++;
      byAmount[amountKey].total += d.amount;
    }

    // Recent donations (last 10)
    const recentDonations = donations
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .slice(0, 10)
      .map(d => ({
        id: d.id,
        amount: d.amount / 100, // Convert to dollars
        email: d.email ? d.email.replace(/(.{2}).*(@.*)/, "$1***$2") : "Anonymous",
        created: d.created,
      }));

    console.log("[GET-DONATION-STATS] Found donations:", totalDonations);

    return new Response(
      JSON.stringify({
        totalDonations,
        totalRevenue: totalRevenue / 100, // Convert to dollars
        byAmount: Object.entries(byAmount).map(([amount, data]) => ({
          amount: parseInt(amount) / 100,
          count: data.count,
          total: data.total / 100,
        })),
        recentDonations,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[GET-DONATION-STATS] Error:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
