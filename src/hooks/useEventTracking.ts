import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Generate a session ID that persists for the browser session
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("pt_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("pt_session_id", sessionId);
  }
  return sessionId;
};

interface TrackEventParams {
  eventType: string;
  eventData?: Record<string, unknown>;
  pagePath?: string;
}

// First win action types for tracking
export type FirstWinAction = 
  | "completed_guided_tour"
  | "saved_study"
  | "saved_gem"
  | "completed_challenge"
  | "completed_game"
  | "generated_ai_content"
  | "finished_chapter_commentary"
  | "earned_achievement";

export function useEventTracking() {
  const { user } = useAuth();

  const trackEvent = useCallback(
    async ({ eventType, eventData = {}, pagePath }: TrackEventParams) => {
      try {
        await supabase.from("user_events").insert([{
          user_id: user?.id ?? undefined,
          event_type: eventType,
          event_data: eventData as any,
          page_path: pagePath || window.location.pathname,
          session_id: getSessionId(),
        }]);
      } catch (error) {
        console.debug("Event tracking error:", error);
      }
    },
    [user]
  );

  // Common event helpers
  const trackButtonClick = useCallback(
    (buttonName: string, additionalData?: Record<string, unknown>) => {
      trackEvent({
        eventType: "button_click",
        eventData: { button: buttonName, ...additionalData },
      });
    },
    [trackEvent]
  );

  const trackFormStart = useCallback(
    (formName: string) => {
      trackEvent({
        eventType: "form_start",
        eventData: { form: formName },
      });
    },
    [trackEvent]
  );

  const trackFormSubmit = useCallback(
    (formName: string, success: boolean) => {
      trackEvent({
        eventType: "form_submit",
        eventData: { form: formName, success },
      });
    },
    [trackEvent]
  );

  const trackSignupStarted = useCallback(() => {
    trackEvent({ eventType: "signup_started" });
  }, [trackEvent]);

  const trackSignupCompleted = useCallback(() => {
    trackEvent({ eventType: "signup_completed" });
  }, [trackEvent]);

  const trackOnboardingStep = useCallback(
    (step: number, stepName: string) => {
      trackEvent({
        eventType: "onboarding_step",
        eventData: { step, step_name: stepName },
      });
    },
    [trackEvent]
  );

  const trackFeatureUsed = useCallback(
    (featureName: string, details?: Record<string, unknown>) => {
      trackEvent({
        eventType: "feature_used",
        eventData: { feature: featureName, ...details },
      });
    },
    [trackEvent]
  );

  const trackVideoPlay = useCallback(
    (videoId: string, videoTitle?: string) => {
      trackEvent({
        eventType: "video_play",
        eventData: { video_id: videoId, title: videoTitle },
      });
    },
    [trackEvent]
  );

  const trackScrollDepth = useCallback(
    (depth: number) => {
      trackEvent({
        eventType: "scroll_depth",
        eventData: { depth_percent: depth },
      });
    },
    [trackEvent]
  );

  // === FUNNEL TRACKING EVENTS ===
  
  // Track when user starts their first study session
  const trackFirstStudySession = useCallback(
    (sessionType: string, details?: Record<string, unknown>) => {
      trackEvent({
        eventType: "first_study_session",
        eventData: { session_type: sessionType, ...details },
      });
    },
    [trackEvent]
  );

  // Track when user completes a "first win" action
  const trackFirstWin = useCallback(
    (action: FirstWinAction, details?: Record<string, unknown>) => {
      trackEvent({
        eventType: "first_win_completed",
        eventData: { action, ...details },
      });
    },
    [trackEvent]
  );

  // Track when user hits a paywall/upgrade prompt
  const trackPaywallHit = useCallback(
    (feature: string, context: string, details?: Record<string, unknown>) => {
      trackEvent({
        eventType: "paywall_hit",
        eventData: { feature, context, ...details },
      });
    },
    [trackEvent]
  );

  // Track when user clicks upgrade button
  const trackUpgradeClick = useCallback(
    (source: string, feature?: string) => {
      trackEvent({
        eventType: "upgrade_clicked",
        eventData: { source, feature },
      });
    },
    [trackEvent]
  );

  // Track successful purchase
  const trackPurchaseCompleted = useCallback(
    (planType: string, amount?: number) => {
      trackEvent({
        eventType: "purchase_completed",
        eventData: { plan_type: planType, amount },
      });
    },
    [trackEvent]
  );

  // Track value moment (when user experiences value)
  const trackValueMoment = useCallback(
    (momentType: string, details?: Record<string, unknown>) => {
      trackEvent({
        eventType: "value_moment",
        eventData: { moment_type: momentType, ...details },
      });
    },
    [trackEvent]
  );

  // === CHECKOUT FUNNEL TRACKING ===

  // Track when account is created (before checkout)
  const trackAccountCreated = useCallback(
    (method: 'email' | 'google' | 'social', details?: Record<string, unknown>) => {
      trackEvent({
        eventType: "checkout_funnel_account_created",
        eventData: { signup_method: method, ...details },
      });
    },
    [trackEvent]
  );

  // Track when user is redirected to Stripe checkout
  const trackCheckoutRedirect = useCallback(
    (plan: string, billing: string) => {
      trackEvent({
        eventType: "checkout_funnel_redirect_to_stripe",
        eventData: { plan, billing, timestamp: new Date().toISOString() },
      });
    },
    [trackEvent]
  );

  // Track when user abandons checkout (comes back without completing)
  const trackCheckoutAbandoned = useCallback(
    (reason?: string) => {
      trackEvent({
        eventType: "checkout_funnel_abandoned",
        eventData: { reason: reason || 'user_cancelled', timestamp: new Date().toISOString() },
      });
    },
    [trackEvent]
  );

  // Track when checkout is completed successfully
  const trackCheckoutCompleted = useCallback(
    (plan: string, billing: string, trialDays?: number) => {
      trackEvent({
        eventType: "checkout_funnel_completed",
        eventData: { plan, billing, trial_days: trialDays, timestamp: new Date().toISOString() },
      });
    },
    [trackEvent]
  );

  // Track external membership detected (Patreon/Teachable/Pickaxe)
  const trackExternalMembershipDetected = useCallback(
    (source: 'patreon' | 'teachable' | 'pickaxe') => {
      trackEvent({
        eventType: "checkout_funnel_external_membership",
        eventData: { source, timestamp: new Date().toISOString() },
      });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackButtonClick,
    trackFormStart,
    trackFormSubmit,
    trackSignupStarted,
    trackSignupCompleted,
    trackOnboardingStep,
    trackFeatureUsed,
    trackVideoPlay,
    trackScrollDepth,
    // Funnel tracking
    trackFirstStudySession,
    trackFirstWin,
    trackPaywallHit,
    trackUpgradeClick,
    trackPurchaseCompleted,
    trackValueMoment,
    // Checkout funnel tracking
    trackAccountCreated,
    trackCheckoutRedirect,
    trackCheckoutAbandoned,
    trackCheckoutCompleted,
    trackExternalMembershipDetected,
  };
}
