import { supabase } from "@/integrations/supabase/client";

export type ChallengeType = 
  | 'equation_challenges'
  | 'christ_chapter_challenges'
  | 'sanctuary_challenges'
  | 'dimension_challenges'
  | 'connect6_challenges'
  | 'fruit_check_challenges';

interface ShareChallengeOptions {
  userId: string;
  displayName: string;
  challengeType: ChallengeType;
  title: string;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Share a challenge to the community and notify interested users
 */
export async function shareChallengeToCommunity(options: ShareChallengeOptions) {
  const { userId, displayName, challengeType, title, content, metadata = {} } = options;

  try {
    // Create community post
    const { data: newPost, error: postError } = await supabase
      .from('community_posts')
      .insert({
        user_id: userId,
        title,
        content,
        category: 'challenge'
      })
      .select()
      .single();

    if (postError) throw postError;

    // Get users who want this specific challenge type (excluding the poster)
    const { data: interestedUsers } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq(challengeType, true)
      .neq('user_id', userId);

    // Create notifications for interested users
    if (interestedUsers && interestedUsers.length > 0) {
      const challengeTypeLabels: Record<ChallengeType, string> = {
        equation_challenges: 'Equation Challenge',
        christ_chapter_challenges: 'Christ Chapter Challenge',
        sanctuary_challenges: 'Sanctuary Challenge',
        dimension_challenges: 'Dimension Drill Challenge',
        connect6_challenges: 'Connect-6 Challenge',
        fruit_check_challenges: 'Fruit Check Challenge',
      };

      const notifications = interestedUsers.map(u => ({
        user_id: u.user_id,
        type: challengeType,
        title: `New ${challengeTypeLabels[challengeType]}!`,
        message: `${displayName} shared a new challenge`,
        link: `/community`,
        metadata: {
          post_id: newPost?.id,
          ...metadata
        }
      }));

      await supabase.from('notifications').insert(notifications);
    }

    return { success: true, postId: newPost?.id };
  } catch (error) {
    console.error('Error sharing challenge:', error);
    return { success: false, error };
  }
}