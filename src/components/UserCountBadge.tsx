import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users } from "lucide-react";

export function UserCountBadge() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .or("subscription_status.eq.active,subscription_status.eq.trial,has_lifetime_access.eq.true");
      
      setUserCount(count || 0);
    };

    fetchUserCount();

    // Subscribe to real-time INSERT events on profiles table
    const channel = supabase
      .channel('user-count-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('New user signed up:', payload);
          // Increment count when new user signs up with active or trial status
          const newProfile = payload.new as any;
          if (
            newProfile.subscription_status === 'active' || 
            newProfile.subscription_status === 'trial' ||
            newProfile.has_lifetime_access === true
          ) {
            setUserCount((prev) => (prev || 0) + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (userCount === null) return null;

  return (
    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className="relative">
        <Users className="w-6 h-6 text-primary" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-2xl font-bold text-primary tabular-nums">
          {userCount}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Users & Counting
        </span>
      </div>
    </div>
  );
}
