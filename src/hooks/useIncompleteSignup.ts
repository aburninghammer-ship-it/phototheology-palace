import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Detects users who created an account but never completed Stripe checkout.
 * These users have payment_source = 'manual' and subscription_tier = 'free'.
 * Returns whether the checkout modal should be shown.
 */
export function useIncompleteSignup() {
  const { user } = useAuth();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user || checked) return;

    const checkSignupStatus = async () => {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, subscription_tier, subscription_status, payment_source, has_lifetime_access")
          .eq("id", user.id)
          .single();

        if (!profile) return;

        // User completed payment or has access — don't show
        if (
          profile.has_lifetime_access ||
          profile.subscription_status === "active" ||
          (profile.payment_source && profile.payment_source !== "manual")
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
          setShowCheckoutModal(true);
        }
      } catch (err) {
        console.error("[useIncompleteSignup] Error checking status:", err);
      } finally {
        setChecked(true);
      }
    };

    checkSignupStatus();
  }, [user, checked]);

  const dismissModal = () => setShowCheckoutModal(false);

  return { showCheckoutModal, userName, dismissModal };
}
