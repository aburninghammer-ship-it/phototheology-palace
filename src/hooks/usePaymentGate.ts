import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

/**
 * This hook checks if a user has valid payment access (Stripe, Patreon, Pickaxe, Teachable, lifetime, etc.)
 * If not, it redirects them to pricing page to enter a credit card.
 * 
 * Flow:
 * 1. Check profile for lifetime access or active subscription
 * 2. Check Patreon connections
 * 3. Check Pickaxe connections
 * 4. Check Stripe subscription
 * 5. If none found → redirect to /pricing for trial checkout
 */
export function usePaymentGate() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [paymentFailed, setPaymentFailed] = useState(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!user || hasCheckedRef.current) {
      setChecking(false);
      return;
    }

    const checkAccess = async () => {
      try {
        console.log("[PaymentGate] Checking access for:", user.email);

        // 0. Check if user is an admin/owner — always grant access
        const { data: adminCheck } = await supabase
          .from("admin_users")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (adminCheck) {
          console.log("[PaymentGate] User is admin/owner — access granted");
          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // 1. Check profile for lifetime access, active subscription, or manual grant
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_lifetime_access, subscription_status, subscription_tier, payment_source")
          .eq("id", user.id)
          .single();

        // CRITICAL: Check for payment failure FIRST — immediately redirect
        if (profile?.subscription_status === "payment_failed") {
          console.log("[PaymentGate] PAYMENT FAILED — redirecting to fix-billing");
          setPaymentFailed(true);
          setHasAccess(false);
          hasCheckedRef.current = true;
          setChecking(false);
          if (!location.pathname.startsWith("/fix-billing")) {
            navigate("/fix-billing", { replace: true });
          }
          return;
        }

        if (profile?.has_lifetime_access) {
          console.log("[PaymentGate] User has lifetime access");
          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // Active subscription in profile (from Stripe webhooks, Patreon, manual, etc.)
        if (profile?.subscription_status === "active" && profile?.subscription_tier) {
          console.log("[PaymentGate] User has active subscription:", profile.subscription_tier);
          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }
        // 2. Check church membership (church subscription covers member access)
        const { data: churchAccess } = await supabase
          .rpc("has_church_access", { _user_id: user.id });

        // Belt-and-suspenders: if RPC says no church access, check preapproved list by email
        let churchHasAccess = churchAccess && churchAccess.length > 0 && churchAccess[0].has_access;
        if (!churchHasAccess && user.email) {
          const { data: preapproved } = await supabase
            .from("church_preapproved_members")
            .select("church_id")
            .eq("email", user.email.toLowerCase())
            .limit(1)
            .maybeSingle();

          if (preapproved) {
            console.log("[PaymentGate] Email found in church_preapproved_members — granting access");
            churchHasAccess = true;
          }
        }

        if (churchHasAccess) {
          const churchTier = churchAccess?.[0]?.church_tier || "premium";
          console.log("[PaymentGate] User has church membership access, tier:", churchTier);
          // Persist to profile so other hooks pick it up without re-checking
          await supabase
            .from("profiles")
            .update({
              subscription_status: "active",
              subscription_tier: churchTier,
              payment_source: "church" as any,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // 3. Check Patreon connections
        const { data: patreonConnection } = await supabase
          .from("patreon_connections")
          .select("is_active_patron, entitled_cents")
          .eq("user_id", user.id)
          .maybeSingle();

        // Minimum Patreon pledge: $15/month = 1500 cents
        if (patreonConnection?.is_active_patron && patreonConnection.entitled_cents >= 1500) {
          console.log("[PaymentGate] User has active Patreon access");
          // Update profile to reflect Patreon access
          await supabase
            .from("profiles")
            .update({
              subscription_status: "active",
              subscription_tier: "premium",
              payment_source: "patreon",
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // 4. Check Pickaxe connections (by email)
        const { data: pickaxeConnection } = await supabase
          .from("pickaxe_connections")
          .select("is_paid_user")
          .eq("pickaxe_email", user.email?.toLowerCase() || "")
          .eq("is_paid_user", true)
          .maybeSingle();

        if (pickaxeConnection?.is_paid_user) {
          console.log("[PaymentGate] User has Pickaxe premium access");
          await supabase
            .from("profiles")
            .update({
              subscription_status: "active",
              subscription_tier: "premium",
              payment_source: "pickaxe" as any,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // 5. Check Teachable students (Master Class paying members)
        const { data: teachableStudent } = await supabase
          .from("teachable_students")
          .select("is_active")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .maybeSingle();

        if (teachableStudent?.is_active) {
          console.log("[PaymentGate] User has Teachable Master Class access");
          await supabase
            .from("profiles")
            .update({
              subscription_status: "active",
              subscription_tier: "student",
              payment_source: "teachable" as any,
              updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);

          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // 6. Check Stripe directly (fallback)
        try {
          const { data: stripeCheck, error: stripeError } = await supabase.functions.invoke(
            "check-stripe-subscription"
          );

          if (!stripeError && stripeCheck?.payment_failed) {
            console.log("[PaymentGate] Stripe reports PAYMENT FAILED — redirecting");
            setPaymentFailed(true);
            setHasAccess(false);
            hasCheckedRef.current = true;
            setChecking(false);
            if (!location.pathname.startsWith("/fix-billing")) {
              navigate("/fix-billing", { replace: true });
            }
            return;
          }

          if (!stripeError && stripeCheck?.subscribed) {
            console.log("[PaymentGate] User has active Stripe subscription");
            setHasAccess(true);
            hasCheckedRef.current = true;
            setChecking(false);
            return;
          }
        } catch (stripeErr) {
          console.warn("[PaymentGate] Stripe check failed:", stripeErr);
        }

        // 7. Check user_subscriptions for active or trialing status
        const { data: userSub } = await supabase
          .from("user_subscriptions")
          .select("subscription_status, trial_ends_at")
          .eq("user_id", user.id)
          .maybeSingle();

        if (userSub?.subscription_status === "active") {
          console.log("[PaymentGate] User has active subscription in DB");
          setHasAccess(true);
          hasCheckedRef.current = true;
          setChecking(false);
          return;
        }

        // Check if trial is still valid
        if (userSub?.subscription_status === "trial" && userSub.trial_ends_at) {
          const trialEnd = new Date(userSub.trial_ends_at);
          if (trialEnd > new Date()) {
            console.log("[PaymentGate] User has valid trial");
            setHasAccess(true);
            hasCheckedRef.current = true;
            setChecking(false);
            return;
          }
        }

        // No valid access found - redirect to pricing
        console.log("[PaymentGate] No valid access found, redirecting to pricing");
        hasCheckedRef.current = true;
        setHasAccess(false);
        setChecking(false);

        // Only redirect if not already on auth-related pages
        const excludedPaths = ["/pricing", "/auth", "/patreon-callback", "/stripe-success", "/stripe-cancel", "/fix-billing", "/show-me"];
        if (!excludedPaths.some((path) => location.pathname.startsWith(path))) {
          navigate("/show-me", { replace: true });
        }
      } catch (error) {
        console.error("[PaymentGate] Error checking access:", error);
        setChecking(false);
        // On error, default to requiring payment
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [user, navigate, location.pathname]);

  // Reset check flag when user changes
  useEffect(() => {
    hasCheckedRef.current = false;
  }, [user?.id]);

  return { checking, hasAccess, paymentFailed };
}
