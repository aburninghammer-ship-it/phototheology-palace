import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_PRICES = {
  essential_monthly: { priceId: "price_1SZNyiFGDAd3RU8I4JHYEsEi", amount: 1500, label: "Essential Monthly" },
  essential_annual: { priceId: "price_1SZNyuFGDAd3RU8IjeGIvPEb", amount: 15000, label: "Essential Annual" },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', { apiVersion: '2023-10-16' });
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { plan_type, recipient_email, personal_message } = await req.json();

    if (!plan_type || !recipient_email) {
      return new Response(JSON.stringify({ error: 'Missing plan_type or recipient_email' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const plan = PLAN_PRICES[plan_type as keyof typeof PLAN_PRICES];
    if (!plan) {
      return new Response(JSON.stringify({ error: 'Invalid plan type' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Generate gift token
    const giftToken = 'GIFT' + Math.random().toString(36).substring(2, 12).toUpperCase();

    // Create gift record
    const { data: giftRecord, error: insertError } = await supabase
      .from('gift_purchases')
      .insert({
        gifter_user_id: user.id,
        gifter_email: user.email || '',
        recipient_email,
        gift_token: giftToken,
        plan_type,
        amount_cents: plan.amount,
        personal_message: personal_message || null,
        status: 'pending',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      throw new Error('Failed to create gift record');
    }

    const origin = req.headers.get('origin') || 'https://phototheology-palace.lovable.app';

    // Create Stripe checkout session for the gift
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email || undefined,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      mode: 'payment',
      success_url: `${origin}/gift/success?token=${giftToken}`,
      cancel_url: `${origin}/gift?cancelled=true`,
      metadata: {
        gift_id: giftRecord.id,
        gift_token: giftToken,
        gifter_user_id: user.id,
        recipient_email,
        plan_type,
      },
    });

    // Update gift with session ID
    await supabase
      .from('gift_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', giftRecord.id);

    return new Response(
      JSON.stringify({ url: session.url, gift_token: giftToken }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Gift checkout error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
