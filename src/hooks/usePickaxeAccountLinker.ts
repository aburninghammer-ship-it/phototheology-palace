import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * This hook automatically checks if a logged-in user has Pickaxe premium access
 * and links their account if they do. It runs once per session after authentication.
 */
export const usePickaxeAccountLinker = () => {
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    const checkAndLinkPickaxeAccess = async () => {
      // Only check once per session
      if (hasCheckedRef.current) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.access_token) return;
        
        hasCheckedRef.current = true;
        
        // Call the check-pickaxe-access edge function
        const { data, error } = await supabase.functions.invoke("check-pickaxe-access", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) {
          console.error("[PickaxeLinker] Error checking access:", error);
          return;
        }

        if (data?.accessGranted) {
          console.log("[PickaxeLinker] Premium access granted from Pickaxe:", data.pickaxeName);
        }
      } catch (error) {
        console.error("[PickaxeLinker] Unexpected error:", error);
      }
    };

    // Check on auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Reset the check flag on new sign-in
        if (event === 'SIGNED_IN') {
          hasCheckedRef.current = false;
        }
        checkAndLinkPickaxeAccess();
      }
    });

    // Also check immediately if already signed in
    checkAndLinkPickaxeAccess();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
};
