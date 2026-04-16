import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Users, Clock } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export function UserCountBadge() {
  const { t } = useTranslation();
  const [activeCount, setActiveCount] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchActiveInLastHour = async () => {
      // Get users who have been active in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const { count, error } = await supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .gte("last_seen", oneHourAgo);

      if (error) {
        console.error("Error fetching active user count:", error);
        setActiveCount(0);
        return;
      }

      setActiveCount(count || 0);
    };

    fetchActiveInLastHour();

    // Refresh count every 30 seconds
    const interval = setInterval(fetchActiveInLastHour, 30000);

    // Subscribe to real-time updates on profiles table
    const channel = supabase
      .channel('active-users-hourly')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          // Check if this is a new user signup
          if (payload.eventType === 'INSERT') {
            console.log('New user signed up:', payload);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
          // Refresh the count
          fetchActiveInLastHour();
        }
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  if (activeCount === null) return null;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      <div className="inline-flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative">
            <Users className="w-6 h-6 text-primary" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-2xl font-bold text-primary tabular-nums">
              {activeCount.toLocaleString()}
            </span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('userCount.activeThisHour')}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
