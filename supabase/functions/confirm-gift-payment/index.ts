import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2023-10-16' });
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const { gift_token } = await req.json();
    if (!gift_token) {
      return new Response(JSON.stringify({ error: 'Missing gift_token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get the gift record
    const { data: gift, error: fetchError } = await supabase
      .from('gift_purchases')
      .select('*')
      .eq('gift_token', gift_token)
      .single();

    if (fetchError || !gift) {
      return new Response(JSON.stringify({ error: 'Gift not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (gift.status === 'paid' || gift.status === 'redeemed') {
      return new Response(JSON.stringify({ success: true, already_confirmed: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Verify payment with Stripe
    if (gift.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(gift.stripe_session_id);
      if (session.payment_status === 'paid') {
        await supabase
          .from('gift_purchases')
          .update({ status: 'paid', stripe_payment_intent: session.payment_intent as string })
          .eq('id', gift.id);

        return new Response(JSON.stringify({ success: true, confirmed: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    return new Response(JSON.stringify({ success: false, error: 'Payment not confirmed yet' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Confirm gift error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
