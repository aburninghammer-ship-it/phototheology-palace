import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateChurchRequest {
  church_name: string;
  tier: 'tier1' | 'tier2' | 'tier3';
  billing_email: string;
  contact_person?: string;
  contact_phone?: string;
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body: CreateChurchRequest = await req.json();

    // Validate required fields
    if (!body.church_name || !body.tier || !body.billing_email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set max seats based on tier
    const tierSeats = {
      tier1: 50,
      tier2: 150,
      tier3: 300
    };

    // Check if user is already part of a church
    const { data: existingMembership } = await supabase
      .from('church_members')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingMembership) {
      return new Response(
        JSON.stringify({ success: false, error: 'You are already a member of a church' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create church
    const { data: church, error: churchError } = await supabase
      .from('churches')
      .insert({
        name: body.church_name,
        tier: body.tier,
        max_seats: tierSeats[body.tier],
        billing_email: body.billing_email,
        contact_person: body.contact_person || null,
        contact_phone: body.contact_phone || null,
        subscription_status: 'active',
      })
      .select()
      .single();

    if (churchError) {
      console.error('Error creating church:', churchError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to create church' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Add creator as admin
    const { error: memberError } = await supabase
      .from('church_members')
      .insert({
        church_id: church.id,
        user_id: user.id,
        role: 'admin'
      });

    if (memberError) {
      console.error('Error adding admin member:', memberError);
      // Rollback: delete the church
      await supabase.from('churches').delete().eq('id', church.id);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to set up admin account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log creation (optional - for admin tracking)
    console.log(`Church created: ${church.name} (${church.id}) by user ${user.id}`);
    if (body.notes) {
      console.log(`Notes: ${body.notes}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        church_id: church.id,
        message: 'Church registered successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in create-church function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
