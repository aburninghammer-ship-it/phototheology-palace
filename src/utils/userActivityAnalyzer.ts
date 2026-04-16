// Analyzes user activity across PhototheologyOS to determine strengths for Forge & Defend drafting

import { supabase } from "@/integrations/supabase/client";

export interface UserStrengths {
  userId: string;
  displayName: string;
  overallScore: number;
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
  topicStrengths: {
    sabbath: number;
    sanctuary: number;
    prophecy: number;
    trinity: number;
    stateOfDead: number;
    lawGospel: number;
    remnant: number;
  };
  activityMetrics: {
    bibleStudyHours: number;
    quizScoreAvg: number;
    defenseWinRate: number;
    totalEngagement: number;
  };
  strengthDescription: string;
}

export async function analyzeUserActivity(userId: string): Promise<UserStrengths> {
  try {
    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", userId)
      .single();

    // Initialize metrics
    let bibleStudyHours = 0;
    let quizScoreAvg = 0;
    let defenseWinRate = 0;
    let totalEngagement = 0;

    // Analyze Bible study activity
    const { data: studySessions } = await (supabase as any)
      .from("study_sessions")
      .select("duration_seconds, topic")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()); // Last 90 days

    if (studySessions) {
      bibleStudyHours = studySessions.reduce((sum: number, s: any) => sum + (s.duration_seconds || 0), 0) / 3600;
      totalEngagement += studySessions.length * 10;
    }

    // Analyze quiz/game performance
    const { data: gameScores } = await (supabase as any)
      .from("game_scores")
      .select("score, max_score, game_type")
      .eq("user_id", userId)
      .gte("created_at", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (gameScores && gameScores.length > 0) {
      const avgPct = gameScores.reduce((sum: number, g: any) => {
        const pct = g.max_score > 0 ? (g.score / g.max_score) * 100 : 0;
        return sum + pct;
      }, 0) / gameScores.length;
      quizScoreAvg = avgPct;
      totalEngagement += gameScores.length * 5;
    }

    // Analyze Defense Mode performance
    const { data: defenseActivity } = await (supabase as any)
      .from("defense_member_weekly_activity")
      .select("battles_participated, battles_won")
      .eq("user_id", userId)
      .gte("week_start", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());

    if (defenseActivity && defenseActivity.length > 0) {
      const totalBattles = defenseActivity.reduce((sum: number, a: any) => sum + (a.battles_participated || 0), 0);
      const totalWins = defenseActivity.reduce((sum: number, a: any) => sum + (a.battles_won || 0), 0);
      defenseWinRate = totalBattles > 0 ? (totalWins / totalBattles) * 100 : 0;
      totalEngagement += totalBattles * 15;
    }

    // Analyze topic strengths based on study sessions and quiz performance
    const topicStrengths = {
      sabbath: calculateTopicStrength(studySessions, gameScores, ["sabbath", "fourth_commandment", "seventh_day"]),
      sanctuary: calculateTopicStrength(studySessions, gameScores, ["sanctuary", "1844", "investigative_judgment"]),
      prophecy: calculateTopicStrength(studySessions, gameScores, ["prophecy", "daniel", "revelation"]),
      trinity: calculateTopicStrength(studySessions, gameScores, ["trinity", "godhead", "holy_spirit"]),
      stateOfDead: calculateTopicStrength(studySessions, gameScores, ["death", "soul", "hell", "immortality"]),
      lawGospel: calculateTopicStrength(studySessions, gameScores, ["law", "gospel", "grace", "commandments"]),
      remnant: calculateTopicStrength(studySessions, gameScores, ["remnant", "ellen_white", "sda_church"]),
    };

    // Calculate overall score (0-100)
    const overallScore = Math.min(100, Math.round(
      (bibleStudyHours * 5) +
      (quizScoreAvg * 0.3) +
      (defenseWinRate * 0.2) +
      (totalEngagement * 0.5)
    ));

    // Determine skill level
    let skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
    if (overallScore < 25) skillLevel = "beginner";
    else if (overallScore < 50) skillLevel = "intermediate";
    else if (overallScore < 75) skillLevel = "advanced";
    else skillLevel = "expert";

    // Generate strength description
    const topStrengths = Object.entries(topicStrengths)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([topic]) => formatTopicName(topic));

    const strengthDescription = topStrengths.length > 0
      ? `${skillLevel} - Strong in ${topStrengths.join(" & ")}`
      : `${skillLevel} - General apologetics`;

    return {
      userId,
      displayName: profile?.display_name || "Warrior",
      overallScore,
      skillLevel,
      topicStrengths,
      activityMetrics: {
        bibleStudyHours: Math.round(bibleStudyHours * 10) / 10,
        quizScoreAvg: Math.round(quizScoreAvg),
        defenseWinRate: Math.round(defenseWinRate),
        totalEngagement: Math.round(totalEngagement),
      },
      strengthDescription,
    };
  } catch (error) {
    console.error("Error analyzing user activity:", error);
    // Return default values on error
    return {
      userId,
      displayName: "Warrior",
      overallScore: 0,
      skillLevel: "beginner",
      topicStrengths: {
        sabbath: 0,
        sanctuary: 0,
        prophecy: 0,
        trinity: 0,
        stateOfDead: 0,
        lawGospel: 0,
        remnant: 0,
      },
      activityMetrics: {
        bibleStudyHours: 0,
        quizScoreAvg: 0,
        defenseWinRate: 0,
        totalEngagement: 0,
      },
      strengthDescription: "beginner - General apologetics",
    };
  }
}

function calculateTopicStrength(
  studySessions: any[] | null,
  gameScores: any[] | null,
  keywords: string[]
): number {
  let strength = 0;

  // Check study sessions for topic
  if (studySessions) {
    const topicSessions = studySessions.filter((s: any) =>
      keywords.some((kw) => s.topic?.toLowerCase().includes(kw))
    );
    strength += topicSessions.length * 10;
  }

  // Check game scores for topic
  if (gameScores) {
    const topicGames = gameScores.filter((g: any) =>
      keywords.some((kw) => g.game_type?.toLowerCase().includes(kw))
    );
    if (topicGames.length > 0) {
      const avgScore = topicGames.reduce((sum: number, g: any) => {
        const pct = g.max_score > 0 ? (g.score / g.max_score) * 100 : 0;
        return sum + pct;
      }, 0) / topicGames.length;
      strength += avgScore * 0.5;
    }
  }

  return Math.min(100, Math.round(strength));
}

function formatTopicName(topic: string): string {
  const names: Record<string, string> = {
    sabbath: "Sabbath",
    sanctuary: "Sanctuary/1844",
    prophecy: "Prophecy",
    trinity: "Trinity",
    stateOfDead: "State of the Dead",
    lawGospel: "Law & Gospel",
    remnant: "Remnant Church",
  };
  return names[topic] || topic;
}

export async function analyzeBatchUsers(userIds: string[]): Promise<UserStrengths[]> {
  const results = await Promise.all(userIds.map((id) => analyzeUserActivity(id)));
  return results;
}
