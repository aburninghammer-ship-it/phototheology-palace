import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Authenticate user
    const authHeader = req.headers.get('authorization');
    if (!authHeader) throw new Error('Not authenticated');
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error('Invalid auth');

    const userId = user.id;
    const { target } = await req.json(); // "jeeves" or "reginald"

    // Run all queries in parallel for speed
    const [
      profileResult,
      masteryResult,
      gemsResult,
      studiesResult,
      streakResult,
      readingProgressResult,
      challengeSubmissionsResult,
      pageViewsResult,
      christFindingsResult,
      floorProgressResult,
    ] = await Promise.all([
      // Profile & path
      supabase.from('profiles').select('display_name, selected_path, subscription_tier, current_floor, master_title, points, created_at').eq('id', userId).single(),
      // Room mastery levels (top rooms)
      supabase.from('room_mastery_levels').select('room_id, mastery_level, xp_current, total_drills_completed, last_activity_at').eq('user_id', userId).order('mastery_level', { ascending: false }).limit(15),
      // Recent gems
      supabase.from('user_gems').select('title, verse_reference, room_code, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
      // Recent studies
      supabase.from('user_studies').select('title, study_type, created_at, updated_at').eq('user_id', userId).order('updated_at', { ascending: false }).limit(8),
      // Mastery streak
      supabase.from('mastery_streaks').select('current_streak, longest_streak, total_active_days, last_activity_date').eq('user_id', userId).single(),
      // Reading progress
      supabase.from('user_reading_progress').select('book, chapter, completed_at').eq('user_id', userId).order('completed_at', { ascending: false }).limit(5),
      // Challenge submissions (recent)
      supabase.from('challenge_submissions').select('principle_applied, rating, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      // Page views (recent activity for Reginald)
      supabase.from('page_views').select('page_path, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
      // Christ chapter findings
      supabase.from('christ_chapter_findings').select('book, chapter, christ_name, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
      // Floor progress
      supabase.from('user_floor_progress').select('floor_number, is_unlocked, rooms_completed, rooms_required, floor_completed_at').eq('user_id', userId).order('floor_number', { ascending: true }),
    ]);

    const profile = profileResult.data;
    const mastery = masteryResult.data || [];
    const gems = gemsResult.data || [];
    const studies = studiesResult.data || [];
    const streak = streakResult.data;
    const readingProgress = readingProgressResult.data || [];
    const challengeSubs = challengeSubmissionsResult.data || [];
    const pageViews = pageViewsResult.data || [];
    const christFindings = christFindingsResult.data || [];
    const floorProgress = floorProgressResult.data || [];

    // Build compact Jeeves context
    if (target === "jeeves") {
      const topRooms = mastery.filter(r => r.mastery_level >= 2).map(r => `${r.room_id}(L${r.mastery_level})`).join(', ');
      const weakRooms = mastery.filter(r => r.mastery_level <= 1 && r.total_drills_completed > 0).map(r => r.room_id).join(', ');
      const recentGems = gems.slice(0, 5).map(g => `"${g.title}" (${g.verse_reference || 'no ref'}, ${g.room_code || ''})`).join('; ');
      const recentStudies = studies.slice(0, 5).map(s => `"${s.title}" (${s.study_type})`).join('; ');
      const recentReading = readingProgress.slice(0, 3).map(r => `${r.book} ${r.chapter}`).join(', ');
      const christWork = christFindings.slice(0, 3).map(c => `${c.book} ${c.chapter}: ${c.christ_name}`).join('; ');
      
      // Determine user's theological interests from their activity
      const roomCodes = mastery.map(r => r.room_id);
      const interests: string[] = [];
      if (roomCodes.some(r => ['BL', 'PR', '3A', 'FE'].includes(r))) interests.push('Prophecy & Sanctuary');
      if (roomCodes.some(r => ['CR', 'CEC', 'R66'].includes(r))) interests.push('Christ-centered study');
      if (roomCodes.some(r => ['NF', 'PF', 'BF', 'HF', 'LR'].includes(r))) interests.push('Freestyle connections');
      if (roomCodes.some(r => ['OR', 'DC', 'ST', 'QR', 'QA'].includes(r))) interests.push('Deep investigation');
      if (roomCodes.some(r => ['FRm', 'MR', 'SRm'].includes(r))) interests.push('Devotional depth');

      const currentFloor = profile?.current_floor || 1;
      const daysSinceJoin = profile?.created_at ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / 86400000) : 0;
      
      const snapshot = {
        userName: profile?.display_name?.split(' ')[0] || null,
        tier: profile?.subscription_tier || 'free',
        masterTitle: profile?.master_title || 'none',
        currentFloor,
        points: profile?.points || 0,
        daysSinceJoin,
        selectedPath: profile?.selected_path || null,
        streak: streak?.current_streak || 0,
        longestStreak: streak?.longest_streak || 0,
        totalActiveDays: streak?.total_active_days || 0,
        topRooms,
        weakRooms,
        interests,
        recentGems,
        recentStudies,
        recentReading,
        christWork,
        recentChallengeScores: challengeSubs.map(c => c.rating).filter(Boolean),
        floorsCompleted: floorProgress.filter(f => f.floor_completed_at).length,
        promptBlock: buildJeevesPromptBlock({
          userName: profile?.display_name?.split(' ')[0],
          currentFloor,
          topRooms,
          weakRooms,
          interests,
          recentGems,
          recentStudies,
          recentReading,
          christWork,
          streak: streak?.current_streak || 0,
          daysSinceJoin,
          masterTitle: profile?.master_title,
        }),
      };

      return new Response(JSON.stringify(snapshot), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Reginald context (feature discovery)
    if (target === "reginald") {
      const visitedPaths = new Set(pageViews.map(p => p.page_path?.split('?')[0]));
      
      // All major features in the app
      const allFeatures = [
        { path: '/palace', name: 'The Palace (Rooms & Floors)', category: 'core' },
        { path: '/bible', name: 'Bible Reader', category: 'core' },
        { path: '/my-studies', name: 'My Studies Library', category: 'core' },
        { path: '/gems', name: 'Gems Collection', category: 'core' },
        { path: '/challenges', name: 'Daily & Weekly Challenges', category: 'growth' },
        { path: '/games', name: 'Palace Games', category: 'fun' },
        { path: '/memory', name: 'Memory Tools (First Letter & Memory Palace)', category: 'growth' },
        { path: '/drills', name: 'Room Drills', category: 'growth' },
        { path: '/mind-map', name: 'Mind Map Tool', category: 'advanced' },
        { path: '/sermon-writer', name: 'Sermon Writer', category: 'ministry' },
        { path: '/sermon-simmer', name: 'Sermon Simmer', category: 'ministry' },
        { path: '/blueprint-course', name: 'Blueprint Course', category: 'learning' },
        { path: '/freestyle', name: 'Freestyle Mode', category: 'growth' },
        { path: '/palace-ai', name: 'Palace AI Dashboard', category: 'advanced' },
        { path: '/jeeves-reasoning', name: 'Jeeves Reasoning Engine', category: 'advanced' },
        { path: '/devotionals', name: 'Devotionals', category: 'devotional' },
        { path: '/living-manna', name: 'Living Manna', category: 'community' },
        { path: '/community', name: 'Community Posts', category: 'community' },
        { path: '/leaderboard', name: 'Leaderboard', category: 'fun' },
        { path: '/encyclopedia', name: 'Encyclopedia', category: 'learning' },
        { path: '/video-training', name: 'Video Training', category: 'learning' },
        { path: '/research', name: 'Research Mode', category: 'advanced' },
      ];

      const unexplored = allFeatures.filter(f => !visitedPaths.has(f.path));
      const explored = allFeatures.filter(f => visitedPaths.has(f.path));

      // Build personalized suggestions based on their level and interests
      const suggestions: string[] = [];
      const currentFloor = profile?.current_floor || 1;
      
      if (mastery.length === 0) {
        suggestions.push("Start with the Story Room (SR) on Floor 1 — it's the foundation of everything.");
      }
      if (!visitedPaths.has('/challenges') && mastery.length > 2) {
        suggestions.push("Try the Daily Challenges — they'll sharpen your skills with Jeeves feedback.");
      }
      if (!visitedPaths.has('/gems') && gems.length === 0) {
        suggestions.push("Open the Gems Room and start saving your best discoveries.");
      }
      if (!visitedPaths.has('/freestyle') && currentFloor >= 3) {
        suggestions.push("You've unlocked Floor 3 — the Freestyle Floor is perfect for spontaneous Bible connections.");
      }
      if (!visitedPaths.has('/games')) {
        suggestions.push("The Palace Games section has card battles, escape rooms, and more — great for learning through play.");
      }
      if (!visitedPaths.has('/memory') && gems.length >= 3) {
        suggestions.push("With gems saved, try the Memory Tools to lock those verses into long-term memory.");
      }
      if (!visitedPaths.has('/mind-map') && studies.length >= 3) {
        suggestions.push("You've built up studies — try the Mind Map to visualize how your insights connect.");
      }
      if (!visitedPaths.has('/jeeves-reasoning') && currentFloor >= 4) {
        suggestions.push("The Jeeves Reasoning Engine offers Explorer, Auditor, and Architect modes for deeper analysis.");
      }
      if ((streak?.current_streak || 0) === 0 && mastery.length > 0) {
        suggestions.push("Start a study streak today! Even 5 minutes of daily practice compounds remarkably.");
      }

      const snapshot = {
        userName: profile?.display_name?.split(' ')[0] || null,
        currentFloor,
        exploredFeatures: explored.map(f => f.name),
        unexploredFeatures: unexplored.map(f => ({ name: f.name, path: f.path, category: f.category })),
        suggestions: suggestions.slice(0, 4),
        streak: streak?.current_streak || 0,
        totalGems: gems.length,
        totalStudies: studies.length,
        masteryRooms: mastery.length,
        promptBlock: buildReginaldPromptBlock({
          userName: profile?.display_name?.split(' ')[0],
          currentFloor,
          explored: explored.map(f => f.name),
          unexplored: unexplored.slice(0, 8).map(f => `${f.name} (${f.path})`),
          suggestions,
          streak: streak?.current_streak || 0,
          gems: gems.length,
          studies: studies.length,
        }),
      };

      return new Response(JSON.stringify(snapshot), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error('Invalid target — use "jeeves" or "reginald"');
  } catch (error) {
    console.error("[user-context-snapshot] Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function buildJeevesPromptBlock(ctx: any): string {
  return `
──── USER PROFILE (Use this to personalize your responses) ────
Name: ${ctx.userName || 'Unknown'}
Palace Floor: ${ctx.currentFloor}/8 | Title: ${ctx.masterTitle || 'Novice'}
Days in Palace: ${ctx.daysSinceJoin} | Current Streak: ${ctx.streak} days
Strong Rooms: ${ctx.topRooms || 'None yet'}
Rooms Needing Growth: ${ctx.weakRooms || 'N/A'}
Interests: ${ctx.interests?.join(', ') || 'Still discovering'}
Recent Gems: ${ctx.recentGems || 'None saved yet'}
Recent Studies: ${ctx.recentStudies || 'None yet'}
Recent Reading: ${ctx.recentReading || 'Just getting started'}
Christ Findings: ${ctx.christWork || 'None yet'}

PERSONALIZATION RULES:
- Reference their recent studies and gems when relevant — show you REMEMBER their work
- If they're strong in certain rooms, build on that strength; if weak, gently guide them
- Match your depth to their floor level — don't overwhelm Floor 1 users with Floor 6 concepts
- Celebrate milestones naturally ("Your work in the Concentration Room is really paying off, ${ctx.userName}")
- Connect new topics to things they've already studied when possible
- If they have a streak going, acknowledge it occasionally
────────────────────────────────────`;
}

function buildReginaldPromptBlock(ctx: any): string {
  return `
──── USER ACTIVITY PROFILE ────
Name: ${ctx.userName || 'Guest'}
Current Floor: ${ctx.currentFloor}/8
Study Streak: ${ctx.streak} days
Gems Saved: ${ctx.gems} | Studies Created: ${ctx.studies}
Features Explored: ${ctx.explored.join(', ') || 'Just arrived'}
Features NOT YET Tried: ${ctx.unexplored.join(', ') || 'Everything explored!'}

PERSONALIZED SUGGESTIONS FOR THIS USER:
${ctx.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

COACHING RULES:
- When the user asks "What should I try next?" or similar, draw from the suggestions above
- Naturally weave in ONE suggestion per conversation (don't overwhelm)
- Reference features they HAVE used positively before suggesting new ones
- If they seem stuck on one area, gently expand their horizons
- Frame suggestions as exciting discoveries, not homework
────────────────────────────────`;
}
