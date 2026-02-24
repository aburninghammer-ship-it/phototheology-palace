import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ChurchMembership {
  churchId: string | null;
  churchName: string | null;
  churchLogoUrl: string | null;
  churchWebsiteUrl: string | null;
  role: string | null;
  isLoading: boolean;
  isMember: boolean;
}

export function useChurchMembership(): ChurchMembership {
  const { user } = useAuth();
  const [churchId, setChurchId] = useState<string | null>(null);
  const [churchName, setChurchName] = useState<string | null>(null);
  const [churchLogoUrl, setChurchLogoUrl] = useState<string | null>(null);
  const [churchWebsiteUrl, setChurchWebsiteUrl] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkMembership() {
      if (!user) {
        setChurchId(null);
        setChurchName(null);
        setChurchLogoUrl(null);
        setChurchWebsiteUrl(null);
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is a church member
        const { data: membership, error } = await supabase
          .from("church_members")
          .select(`
            church_id,
            role,
            churches (
              id,
              name,
              logo_url
            )
          `)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking church membership:", error);
          setIsLoading(false);
          return;
        }

        if (membership?.church_id) {
          setChurchId(membership.church_id);
          setRole(membership.role);
          // @ts-ignore - nested join returns object
          const church = membership.churches as any;
          setChurchName(church?.name || null);
          setChurchLogoUrl(church?.logo_url || null);
          setChurchWebsiteUrl(church?.website_url || null);
        }
      } catch (err) {
        console.error("Error in useChurchMembership:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkMembership();
  }, [user]);

  return {
    churchId,
    churchName,
    churchLogoUrl,
    churchWebsiteUrl,
    role,
    isLoading,
    isMember: !!churchId,
  };
}
