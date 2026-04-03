import { useMemo } from 'react';
import { buildTrackedPaymentLink } from '@/utils/trackingUtils';

// Stripe Payment Link base URLs
export const STRIPE_LINKS = {
  genesis6Days: "https://buy.stripe.com/bJe14n92b5rgbzieeU6EU0f",
  quickStartGuide: "https://buy.stripe.com/7sY4gzdirbPE46Qc6M6EU0d",
  
  essentialMonthly: "https://buy.stripe.com/9AQ5kD1zJ2f41YI9YE6EU01",
  essentialAnnual: "https://buy.stripe.com/bIY14n7Y73jaaqe9YE6EU02",
} as const;

/**
 * Hook that returns tracked payment links with UTM parameters
 */
export function useTrackedPaymentLinks() {
  return useMemo(() => ({
    genesis6Days: buildTrackedPaymentLink(STRIPE_LINKS.genesis6Days),
    quickStartGuide: buildTrackedPaymentLink(STRIPE_LINKS.quickStartGuide),
    studySuite: buildTrackedPaymentLink(STRIPE_LINKS.studySuite),
    essentialMonthly: buildTrackedPaymentLink(STRIPE_LINKS.essentialMonthly),
    essentialAnnual: buildTrackedPaymentLink(STRIPE_LINKS.essentialAnnual),
  }), []);
}

/**
 * Get a single tracked payment link
 */
export function getTrackedPaymentLink(product: keyof typeof STRIPE_LINKS): string {
  return buildTrackedPaymentLink(STRIPE_LINKS[product]);
}
