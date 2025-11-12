import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Calculate which day in the 30-day rotation
    const startDate = new Date('2025-01-01'); // Reference start date
    const today = new Date();
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const dayInRotation = (daysSinceStart % 30) + 1;

    // Check if we need to generate new challenges (on day 25 of each cycle)
    if (dayInRotation === 25) {
      console.log('Day 25 detected - triggering new challenge generation');
      const { error: genError } = await supabase.functions.invoke('generate-30-challenges');
      if (genError) {
        console.error('Error generating new challenges:', genError);
      } else {
        console.log('✅ New 30-day challenge cycle generated');
      }
    }

    console.log(`Sending daily challenge for day ${dayInRotation} of rotation`);

    // Fetch today's challenge
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .eq('challenge_type', 'daily')
      .eq('day_in_rotation', dayInRotation)
      .single();

    if (challengeError || !challenge) {
      console.error('Error fetching challenge:', challengeError);
      return new Response(
        JSON.stringify({ error: 'No challenge found for today' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Get all user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id');

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create notifications for all users
    const notifications = profiles.map(profile => ({
      user_id: profile.id,
      type: 'daily_challenge',
      title: '🌅 Daily Challenge Available!',
      message: `Today's challenge: ${challenge.title}`,
      metadata: {
        challengeId: challenge.id,
        challengeType: challenge.challenge_subtype,
        difficulty: challenge.difficulty,
        link: '/daily-challenges'
      }
    }));

    const { error: notificationError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notificationError) {
      console.error('Error creating notifications:', notificationError);
      return new Response(
        JSON.stringify({ error: 'Failed to create notifications' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Broadcast live notification to all connected users
    const channel = supabase.channel('daily-challenge-broadcast');
    await channel.send({
      type: 'broadcast',
      event: 'daily-challenge',
      payload: {
        type: 'daily_challenge',
        message: '🌅 New Daily Challenge!',
        challengeType: challenge.challenge_subtype,
        title: challenge.title,
        link: '/daily-challenges'
      }
    });

    console.log(`✅ Sent daily challenge notifications to ${profiles.length} users`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        challengeTitle: challenge.title,
        dayInRotation,
        userCount: profiles.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-daily-challenge:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
