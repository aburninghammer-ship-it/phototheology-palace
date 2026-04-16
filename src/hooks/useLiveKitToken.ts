import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UseLiveKitTokenResult {
  token: string | null;
  isHost: boolean;
  isLoading: boolean;
}

export function useLiveKitToken(
  roomName: string | null,
  participantName: string
): UseLiveKitTokenResult {
  const [token, setToken] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!roomName) {
      setToken(null);
      return;
    }

    let cancelled = false;

    const fetchToken = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          "generate-livekit-token",
          {
            body: { roomName, participantName },
          }
        );

        if (error) throw error;
        if (cancelled) return;

        setToken(data.token);
        setIsHost(data.isHost);
      } catch (err) {
        console.error("Failed to fetch LiveKit token:", err);
        if (!cancelled) {
          setToken(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchToken();

    return () => {
      cancelled = true;
    };
  }, [roomName, participantName]);

  return { token, isHost, isLoading };
}
