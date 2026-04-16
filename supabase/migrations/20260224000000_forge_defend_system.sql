-- ============================================================================
-- FORGE & DEFEND: 6-Week Team-Based Defense Mode Challenge System
-- ============================================================================

-- 1. SEASONS — 6-week challenge cycles
CREATE TABLE public.forge_defend_seasons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  season_number INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL DEFAULT 'Season 1: The Furnace',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'recruiting', 'active', 'completed')),
  week_current INT NOT NULL DEFAULT 0 CHECK (week_current >= 0 AND week_current <= 6),
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TEAMS — 3-4 member squads
CREATE TABLE public.forge_defend_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.forge_defend_seasons(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  team_motto TEXT,
  team_banner_color TEXT NOT NULL DEFAULT 'violet-600',
  team_avatar_emoji TEXT NOT NULL DEFAULT '⚔️',
  ai_enemy_squad JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_points INT NOT NULL DEFAULT 0,
  team_level TEXT NOT NULL DEFAULT 'bronze' CHECK (team_level IN ('bronze', 'silver', 'gold', 'platinum', 'remnant-elite')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. TEAM MEMBERS — with participation tracking (anti-carry)
CREATE TABLE public.forge_defend_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.forge_defend_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'warrior' CHECK (role IN ('captain', 'warrior')),
  total_speaking_turns INT NOT NULL DEFAULT 0,
  total_rounds_participated INT NOT NULL DEFAULT 0,
  weapons_contributed INT NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);

-- 4. BATTLES — team vs AI squad encounters
CREATE TABLE public.forge_defend_battles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.forge_defend_teams(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES public.forge_defend_seasons(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number >= 1 AND week_number <= 6),
  opponent_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  difficulty_tier TEXT NOT NULL DEFAULT 'foundational' CHECK (difficulty_tier IN ('foundational', 'advanced', 'elite')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  battle_type TEXT NOT NULL DEFAULT 'standard' CHECK (battle_type IN ('standard', 'boss')),
  total_rounds INT NOT NULL DEFAULT 0,
  team_score INT NOT NULL DEFAULT 0,
  ai_score INT NOT NULL DEFAULT 0,
  participation_balanced BOOLEAN,
  jeeves_battle_summary TEXT,
  weapons_used JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 5. BATTLE ROUNDS — per-member round tracking
CREATE TABLE public.forge_defend_battle_rounds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  battle_id UUID NOT NULL REFERENCES public.forge_defend_battles(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES auth.users(id),
  round_number INT NOT NULL,
  opponent_attack TEXT NOT NULL,
  member_response TEXT,
  weapon_used UUID,
  jeeves_coaching TEXT,
  round_score INT DEFAULT 0,
  speaking_time_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. WEEKLY SCORES — aggregated team points per week
CREATE TABLE public.forge_defend_weekly_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.forge_defend_teams(id) ON DELETE CASCADE,
  season_id UUID NOT NULL REFERENCES public.forge_defend_seasons(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number >= 1 AND week_number <= 6),
  battle_points INT NOT NULL DEFAULT 0,
  weapon_forge_points INT NOT NULL DEFAULT 0,
  participation_bonus INT NOT NULL DEFAULT 0,
  carry_penalty INT NOT NULL DEFAULT 0,
  total_points INT NOT NULL DEFAULT 0,
  rank_this_week INT,
  jeeves_weekly_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(team_id, week_number, season_id)
);

-- 7. DRAFT HISTORY — records of team formation
CREATE TABLE public.forge_defend_draft_picks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID NOT NULL REFERENCES public.forge_defend_seasons(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.forge_defend_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  pick_number INT NOT NULL,
  draft_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_fd_seasons_church ON public.forge_defend_seasons(church_id);
CREATE INDEX idx_fd_seasons_status ON public.forge_defend_seasons(status);
CREATE INDEX idx_fd_teams_season ON public.forge_defend_teams(season_id);
CREATE INDEX idx_fd_members_team ON public.forge_defend_team_members(team_id);
CREATE INDEX idx_fd_members_user ON public.forge_defend_team_members(user_id);
CREATE INDEX idx_fd_battles_team ON public.forge_defend_battles(team_id);
CREATE INDEX idx_fd_battles_season_week ON public.forge_defend_battles(season_id, week_number);
CREATE INDEX idx_fd_rounds_battle ON public.forge_defend_battle_rounds(battle_id);
CREATE INDEX idx_fd_rounds_member ON public.forge_defend_battle_rounds(member_id);
CREATE INDEX idx_fd_scores_season ON public.forge_defend_weekly_scores(season_id);
CREATE INDEX idx_fd_scores_team ON public.forge_defend_weekly_scores(team_id);
CREATE INDEX idx_fd_draft_season ON public.forge_defend_draft_picks(season_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.forge_defend_seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_defend_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_defend_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_defend_battles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_defend_battle_rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_defend_weekly_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forge_defend_draft_picks ENABLE ROW LEVEL SECURITY;

-- SEASONS: All authenticated can read, creator/admin manages
CREATE POLICY "Anyone can view seasons" ON public.forge_defend_seasons
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Creator can insert seasons" ON public.forge_defend_seasons
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator can update seasons" ON public.forge_defend_seasons
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- TEAMS: Authenticated users can read all teams in their season, system manages
CREATE POLICY "Anyone can view teams" ON public.forge_defend_teams
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert teams" ON public.forge_defend_teams
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update own teams" ON public.forge_defend_teams
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.forge_defend_team_members
      WHERE team_id = forge_defend_teams.id AND user_id = auth.uid()
    )
  );

-- TEAM MEMBERS: View own team members, system manages join
CREATE POLICY "Anyone can view team members" ON public.forge_defend_team_members
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert team members" ON public.forge_defend_team_members
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Members can update own record" ON public.forge_defend_team_members
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- BATTLES: Team members can read own battles, system manages
CREATE POLICY "Anyone can view battles" ON public.forge_defend_battles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team members can insert battles" ON public.forge_defend_battles
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forge_defend_team_members
      WHERE team_id = forge_defend_battles.team_id AND user_id = auth.uid()
    )
  );
CREATE POLICY "Team members can update battles" ON public.forge_defend_battles
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.forge_defend_team_members
      WHERE team_id = forge_defend_battles.team_id AND user_id = auth.uid()
    )
  );

-- BATTLE ROUNDS: Team members can read/insert rounds
CREATE POLICY "Anyone can view battle rounds" ON public.forge_defend_battle_rounds
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Members can insert rounds" ON public.forge_defend_battle_rounds
  FOR INSERT TO authenticated WITH CHECK (member_id = auth.uid());
CREATE POLICY "Members can update own rounds" ON public.forge_defend_battle_rounds
  FOR UPDATE TO authenticated USING (member_id = auth.uid());

-- WEEKLY SCORES: All authenticated can read (leaderboard), system manages
CREATE POLICY "Anyone can view weekly scores" ON public.forge_defend_weekly_scores
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert scores" ON public.forge_defend_weekly_scores
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update scores" ON public.forge_defend_weekly_scores
  FOR UPDATE TO authenticated USING (true);

-- DRAFT PICKS: All church members can read
CREATE POLICY "Anyone can view draft picks" ON public.forge_defend_draft_picks
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert draft picks" ON public.forge_defend_draft_picks
  FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get the currently active season for a church
CREATE OR REPLACE FUNCTION public.get_active_season(p_church_id UUID)
RETURNS SETOF public.forge_defend_seasons
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT * FROM public.forge_defend_seasons
  WHERE church_id = p_church_id
    AND status IN ('recruiting', 'active')
  ORDER BY created_at DESC
  LIMIT 1;
$$;

-- Get team leaderboard for a season
CREATE OR REPLACE FUNCTION public.get_team_leaderboard(p_season_id UUID)
RETURNS TABLE (
  team_id UUID,
  team_name TEXT,
  team_avatar_emoji TEXT,
  team_banner_color TEXT,
  team_level TEXT,
  total_points INT,
  rank BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    t.id AS team_id,
    t.team_name,
    t.team_avatar_emoji,
    t.team_banner_color,
    t.team_level,
    t.total_points,
    ROW_NUMBER() OVER (ORDER BY t.total_points DESC) AS rank
  FROM public.forge_defend_teams t
  WHERE t.season_id = p_season_id
  ORDER BY t.total_points DESC;
$$;

-- Check participation balance for a battle
CREATE OR REPLACE FUNCTION public.check_participation_balance(p_team_id UUID, p_battle_id UUID)
RETURNS TABLE (
  member_id UUID,
  speaking_pct NUMERIC,
  is_carrying BOOLEAN,
  is_absent BOOLEAN
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  WITH battle_totals AS (
    SELECT
      COALESCE(SUM(speaking_time_seconds), 0) AS total_time
    FROM public.forge_defend_battle_rounds
    WHERE battle_id = p_battle_id
  ),
  member_times AS (
    SELECT
      r.member_id,
      COALESCE(SUM(r.speaking_time_seconds), 0) AS member_time
    FROM public.forge_defend_battle_rounds r
    WHERE r.battle_id = p_battle_id
    GROUP BY r.member_id
  ),
  all_members AS (
    SELECT user_id
    FROM public.forge_defend_team_members
    WHERE team_id = p_team_id
  )
  SELECT
    am.user_id AS member_id,
    CASE WHEN bt.total_time > 0
      THEN ROUND((COALESCE(mt.member_time, 0)::NUMERIC / bt.total_time) * 100, 1)
      ELSE 0
    END AS speaking_pct,
    CASE WHEN bt.total_time > 0
      THEN (COALESCE(mt.member_time, 0)::NUMERIC / bt.total_time) > 0.6
      ELSE false
    END AS is_carrying,
    mt.member_id IS NULL AS is_absent
  FROM all_members am
  CROSS JOIN battle_totals bt
  LEFT JOIN member_times mt ON mt.member_id = am.user_id;
$$;
