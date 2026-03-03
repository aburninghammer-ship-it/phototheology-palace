import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Friday Game Night window: 6pm ET – 1am ET (Saturday)
const GAME_NIGHT_START_HOUR = 18; // 6pm ET
const GAME_NIGHT_END_HOUR = 1;    // 1am ET (next day = Saturday)

export interface GameNightInvite {
  id: string;
  invite_code: string;
  guest_name: string | null;
  guest_email: string | null;
  allowed_games: string[];
  max_uses: number;
  times_used: number;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}

export interface GameNightGuest {
  id: string;
  invite_id: string;
  guest_email: string;
  guest_name: string | null;
  session_token: string;
  games_played: string[];
  total_play_time_minutes: number;
  first_played_at: string;
  last_active_at: string;
  converted_to_user: boolean;
}

/** Check if it's currently Friday Game Night (6pm–1am ET) using client clock */
export function isGameNightNow(): boolean {
  const now = new Date();
  // Convert to ET
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay(); // 0=Sun, 5=Fri, 6=Sat
  const hour = et.getHours();

  // Friday 6pm–11:59pm
  if (day === 5 && hour >= GAME_NIGHT_START_HOUR) return true;
  // Saturday 12am–12:59am (before 1am)
  if (day === 6 && hour < GAME_NIGHT_END_HOUR) return true;

  return false;
}

/** Get next game night start time */
export function getNextGameNight(): Date {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  
  let daysUntilFriday = (5 - day + 7) % 7;
  if (daysUntilFriday === 0 && et.getHours() >= GAME_NIGHT_START_HOUR) {
    // It's Friday past 6pm, check if we're still in window
    if (!isGameNightNow()) daysUntilFriday = 7;
  }
  if (daysUntilFriday === 0 && et.getHours() < GAME_NIGHT_START_HOUR) {
    // It's Friday before 6pm - same day
  } else if (day === 6 && et.getHours() < GAME_NIGHT_END_HOUR) {
    // We're in the window (Saturday before 1am)
    daysUntilFriday = 0;
  }

  const next = new Date(et);
  next.setDate(next.getDate() + daysUntilFriday);
  next.setHours(GAME_NIGHT_START_HOUR, 0, 0, 0);
  return next;
}

/** Get the end time of the current/next game night window */
function getGameNightEndTime(): string {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay();
  const hour = et.getHours();

  const end = new Date(et);

  if (day === 5 && hour >= GAME_NIGHT_START_HOUR) {
    // Friday after 6pm → end is Saturday 1am
    end.setDate(end.getDate() + 1);
  } else if (day === 6 && hour < GAME_NIGHT_END_HOUR) {
    // Saturday before 1am → end is later today at 1am
  } else {
    // Not during game night — calculate next Saturday 1am
    let daysUntilSaturday = (6 - day + 7) % 7;
    if (daysUntilSaturday === 0) daysUntilSaturday = 7;
    end.setDate(end.getDate() + daysUntilSaturday);
  }

  end.setHours(GAME_NIGHT_END_HOUR, 0, 0, 0);
  return end.toISOString();
}

export function useGameNight() {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(isGameNightNow());
  const [myInvites, setMyInvites] = useState<GameNightInvite[]>([]);
  const [myGuests, setMyGuests] = useState<GameNightGuest[]>([]);
  const [loading, setLoading] = useState(false);

  // Poll every minute to check if game night started/ended
  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive(isGameNightNow());
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Fetch user's invites
  const fetchInvites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from("game_night_invites")
        .select("*")
        .eq("host_user_id", user.id)
        .order("created_at", { ascending: false });
      setMyInvites((data as any[]) || []);

      // Also fetch guests for these invites
      if (data && data.length > 0) {
        const inviteIds = data.map((i: any) => i.id);
        const { data: guests } = await supabase
          .from("game_night_guests")
          .select("*")
          .in("invite_id", inviteIds)
          .order("first_played_at", { ascending: false });
        setMyGuests((guests as any[]) || []);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

  // Create invite
  const createInvite = useCallback(async (
    allowedGames: string[],
    guestName?: string,
    guestEmail?: string,
    maxUses: number = 1,
  ): Promise<GameNightInvite | null> => {
    if (!user) return null;

    // Generate invite code via DB function
    const { data: codeData } = await supabase.rpc("generate_game_night_invite_code");
    const code = (codeData as string) || `FN${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { data, error } = await supabase
      .from("game_night_invites")
      .insert({
        host_user_id: user.id,
        invite_code: code,
        allowed_games: allowedGames,
        guest_name: guestName || null,
        guest_email: guestEmail || null,
        max_uses: maxUses,
        expires_at: getGameNightEndTime(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating invite:", error);
      return null;
    }

    await fetchInvites();
    return data as any;
  }, [user, fetchInvites]);

  // Deactivate invite
  const deactivateInvite = useCallback(async (inviteId: string) => {
    await supabase
      .from("game_night_invites")
      .update({ is_active: false })
      .eq("id", inviteId);
    await fetchInvites();
  }, [fetchInvites]);

  // Stats
  const stats = useMemo(() => {
    const totalGuests = myGuests.length;
    const uniqueEmails = new Set(myGuests.map(g => g.guest_email)).size;
    const converted = myGuests.filter(g => g.converted_to_user).length;
    const activeInvites = myInvites.filter(i => i.is_active).length;
    return { totalGuests, uniqueEmails, converted, activeInvites };
  }, [myInvites, myGuests]);

  return {
    isActive,
    myInvites,
    myGuests,
    loading,
    createInvite,
    deactivateInvite,
    fetchInvites,
    stats,
  };
}

// ─── Guest-side functions (no auth required) ───

/** Validate an invite code and return invite details */
export async function validateInviteCode(code: string): Promise<{
  valid: boolean;
  invite?: GameNightInvite;
  error?: string;
}> {
  // Check if game night is active
  if (!isGameNightNow()) {
    return { valid: false, error: "Game Night is only available Friday 6pm–1am ET. Come back this Friday!" };
  }

  const { data, error } = await supabase
    .from("game_night_invites")
    .select("*")
    .eq("invite_code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return { valid: false, error: "Invalid or expired invite code." };
  }

  const invite = data as any as GameNightInvite;

  if (invite.times_used >= invite.max_uses) {
    return { valid: false, error: "This invite has reached its maximum uses." };
  }

  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return { valid: false, error: "This invite has expired." };
  }

  return { valid: true, invite };
}

/** Register a guest session */
export async function registerGuest(
  inviteId: string,
  email: string,
  name?: string,
): Promise<{ success: boolean; sessionToken?: string; error?: string }> {
  const token = `GS${Date.now()}${Math.random().toString(36).slice(2, 10)}`;

  const { error } = await supabase
    .from("game_night_guests")
    .insert({
      invite_id: inviteId,
      guest_email: email,
      guest_name: name || null,
      session_token: token,
    });

  if (error) {
    console.error("Guest registration error:", error);
    return { success: false, error: "Failed to register. Please try again." };
  }

  // Increment uses on invite
  await supabase.rpc("generate_game_night_invite_code"); // dummy to avoid RPC issues
  // Actually just update directly
  const { data: invite } = await supabase
    .from("game_night_invites")
    .select("times_used")
    .eq("id", inviteId)
    .single();
  
  if (invite) {
    await supabase
      .from("game_night_invites")
      .update({ times_used: (invite as any).times_used + 1 })
      .eq("id", inviteId);
  }

  // Schedule follow-up emails
  const { data: guestData } = await supabase
    .from("game_night_guests")
    .select("id")
    .eq("session_token", token)
    .single();

  if (guestData) {
    const now = new Date();
    const followUps = [
      { follow_up_type: "immediate", scheduled_for: new Date(now.getTime() + 30 * 60000).toISOString() },
      { follow_up_type: "drip_day1", scheduled_for: new Date(now.getTime() + 24 * 3600000).toISOString() },
      { follow_up_type: "drip_day2", scheduled_for: new Date(now.getTime() + 48 * 3600000).toISOString() },
      { follow_up_type: "drip_day3", scheduled_for: new Date(now.getTime() + 72 * 3600000).toISOString() },
      { follow_up_type: "weekly_reminder", scheduled_for: new Date(now.getTime() + 7 * 24 * 3600000).toISOString() },
    ];

    await supabase.from("game_night_follow_ups").insert(
      followUps.map(f => ({ guest_id: (guestData as any).id, ...f }))
    );
  }

  return { success: true, sessionToken: token };
}
