import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3?target=deno";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PLAN_DURATIONS: Record<string, number> = {
  essential_monthly: 1,
  essential_annual: 12,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { gift_token } = await req.json();
    if (!gift_token) {
      return new Response(JSON.stringify({ error: 'Missing gift_token' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get the gift
    const { data: gift, error: fetchError } = await supabase
      .from('gift_purchases')
      .select('*')
      .eq('gift_token', gift_token)
      .single();

    if (fetchError || !gift) {
      return new Response(JSON.stringify({ error: 'Invalid gift code' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (gift.status !== 'paid') {
      return new Response(JSON.stringify({ error: gift.status === 'redeemed' ? 'This gift has already been redeemed' : 'This gift is not available' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (new Date(gift.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'This gift has expired' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Grant access
    const months = PLAN_DURATIONS[gift.plan_type] || 1;
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + months);

    await supabase
      .from('profiles')
      .update({
        subscription_tier: 'premium',
        subscription_status: 'active',
        promotional_access_expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Mark gift as redeemed
    await supabase
      .from('gift_purchases')
      .update({ status: 'redeemed', redeemed_by: user.id, redeemed_at: new Date().toISOString() })
      .eq('id', gift.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Premium access granted for ${months} month${months > 1 ? 's' : ''}!`,
        plan_type: gift.plan_type,
        months,
        personal_message: gift.personal_message,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Redeem gift error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
