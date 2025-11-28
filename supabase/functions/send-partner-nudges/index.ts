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

    const today = new Date().toISOString().split('T')[0];
    console.log(`Checking partner activity for ${today}`);

    // Get all active partnerships
    const { data: partnerships, error: partnershipError } = await supabase
      .from('study_partnerships')
      .select('*')
      .eq('status', 'active');

    if (partnershipError) {
      console.error('Error fetching partnerships:', partnershipError);
      throw partnershipError;
    }

    if (!partnerships || partnerships.length === 0) {
      console.log('No active partnerships found');
      return new Response(
        JSON.stringify({ message: 'No active partnerships', nudgesSent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${partnerships.length} active partnerships`);

    let nudgesSent = 0;

    for (const partnership of partnerships) {
      // Get today's activity for both partners
      const { data: activities } = await supabase
        .from('partnership_daily_activity')
        .select('*')
        .eq('partnership_id', partnership.id)
        .eq('activity_date', today);

      const user1Activity = activities?.find(a => a.user_id === partnership.user1_id);
      const user2Activity = activities?.find(a => a.user_id === partnership.user2_id);

      const user1Completed = user1Activity && (
        user1Activity.completed_mastery || 
        user1Activity.completed_reading || 
        user1Activity.completed_challenge
      );
      const user2Completed = user2Activity && (
        user2Activity.completed_mastery || 
        user2Activity.completed_reading || 
        user2Activity.completed_challenge
      );

      // Get partner profiles for personalized messages
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', [partnership.user1_id, partnership.user2_id]);

      const user1Profile = profiles?.find(p => p.id === partnership.user1_id);
      const user2Profile = profiles?.find(p => p.id === partnership.user2_id);

      // If one completed but not the other, send nudge to the incomplete partner
      if (user1Completed && !user2Completed) {
        // User 1 completed, nudge user 2
        const { error } = await supabase.from('notifications').insert({
          user_id: partnership.user2_id,
          type: 'partnership_reminder',
          title: '⏰ Your Partner is Waiting!',
          message: `${user1Profile?.display_name || 'Your partner'} has already studied today. Don't break your ${partnership.partnership_streak}-day streak!`,
          metadata: { partnership_id: partnership.id, partner_completed: true },
        });

        if (!error) {
          nudgesSent++;
          console.log(`Sent nudge to user ${partnership.user2_id}`);
        }
      } else if (user2Completed && !user1Completed) {
        // User 2 completed, nudge user 1
        const { error } = await supabase.from('notifications').insert({
          user_id: partnership.user1_id,
          type: 'partnership_reminder',
          title: '⏰ Your Partner is Waiting!',
          message: `${user2Profile?.display_name || 'Your partner'} has already studied today. Don't break your ${partnership.partnership_streak}-day streak!`,
          metadata: { partnership_id: partnership.id, partner_completed: true },
        });

        if (!error) {
          nudgesSent++;
          console.log(`Sent nudge to user ${partnership.user1_id}`);
        }
      } else if (!user1Completed && !user2Completed && partnership.partnership_streak > 0) {
        // Neither completed and they have an active streak - nudge both
        const notifications = [
          {
            user_id: partnership.user1_id,
            type: 'partnership_reminder',
            title: '🔥 Protect Your Streak!',
            message: `You and ${user2Profile?.display_name || 'your partner'} have a ${partnership.partnership_streak}-day streak. Study today to keep it going!`,
            metadata: { partnership_id: partnership.id, streak_at_risk: true },
          },
          {
            user_id: partnership.user2_id,
            type: 'partnership_reminder',
            title: '🔥 Protect Your Streak!',
            message: `You and ${user1Profile?.display_name || 'your partner'} have a ${partnership.partnership_streak}-day streak. Study today to keep it going!`,
            metadata: { partnership_id: partnership.id, streak_at_risk: true },
          },
        ];

        const { error } = await supabase.from('notifications').insert(notifications);
        if (!error) {
          nudgesSent += 2;
          console.log(`Sent streak reminder to both partners in partnership ${partnership.id}`);
        }
      }
    }

    console.log(`✅ Sent ${nudgesSent} partner nudges`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        nudgesSent,
        partnershipsChecked: partnerships.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-partner-nudges:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
