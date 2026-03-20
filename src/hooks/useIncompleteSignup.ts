import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const EXPLORE_DELAY_MS = 10 * 60 * 1000; // 10 minutes of exploring before prompting
const SESSION_KEY = "checkout_modal_dismissed";

/**
 * Detects users who created an account but never completed Stripe checkout.
 * Shows a checkout modal after a delay to let them explore first.
 */
export function useIncompleteSignup() {
  const { user } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();
  const [checked, setChecked] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!user || checked) return;

    // Don't show if user already dismissed this session
    if (sessionStorage.getItem(SESSION_KEY)) {
      setChecked(true);
      return;
    }

    const checkSignupStatus = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, subscription_tier, subscription_status, payment_source, has_lifetime_access, promotional_access_expires_at")
          .eq("id", user.id)
          .single();

        if (!profile) return;

        // User completed payment, has access, or is on a no-card trial — don't show
        if (
          profile.has_lifetime_access ||
          profile.subscription_status === "active" ||
          (profile.payment_source && profile.payment_source !== "manual") ||
          (profile.promotional_access_expires_at && new Date(profile.promotional_access_expires_at) > new Date())
        ) {
          setChecked(true);
          return;
        }

        // Check external memberships (church, patreon, etc.)
        const { data: churchAccess } = await supabase
          .rpc("has_church_access", { _user_id: user.id });

        if (churchAccess?.[0]?.has_access) {
          setChecked(true);
          return;
        }

        // User is on free/manual with no external access → incomplete signup
        if (
          profile.payment_source === "manual" &&
          (!profile.subscription_tier || profile.subscription_tier === "free")
        ) {
          setUserName(profile.display_name || undefined);
          
          // Show modal after explore delay so user has time to look around
          timerRef.current = setTimeout(() => {
            setShowCheckoutModal(true);
          }, EXPLORE_DELAY_MS);
        }
      } catch (err) {
        console.error("[useIncompleteSignup] Error checking status:", err);
      } finally {
        setChecked(true);
      }
    };

    checkSignupStatus();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, checked]);

  const dismissModal = () => {
    setShowCheckoutModal(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  };

  return { showCheckoutModal, userName, dismissModal };
}
