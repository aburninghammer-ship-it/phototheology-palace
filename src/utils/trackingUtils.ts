/**
 * UTM Tracking Utilities
 * Captures and forwards UTM parameters to payment links for ad attribution
 */

// UTM parameter keys we track
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id', 'fbclid', 'gclid'] as const;

// Storage key for persisting UTM params across page navigations
const UTM_STORAGE_KEY = 'pt_utm_params';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_id?: string;
  fbclid?: string; // Facebook click ID
  gclid?: string;  // Google click ID
}

/**
 * Capture UTM parameters from the current URL and store them
 * Call this on app initialization
 */
export function captureUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};
  
  let hasParams = false;
  for (const param of UTM_PARAMS) {
    const value = urlParams.get(param);
    if (value) {
      utmParams[param] = value;
      hasParams = true;
    }
  }
  
  // Store if we found any UTM params (don't overwrite existing with empty)
  if (hasParams) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utmParams));
    } catch (e) {
      console.warn('Failed to store UTM params:', e);
    }
  }
  
  return utmParams;
}

/**
 * Get stored UTM parameters
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to retrieve UTM params:', e);
  }
  
  return {};
}

/**
 * Build a payment link URL with UTM parameters appended
 * Stripe Payment Links support custom query params via client_reference_id
 */
export function buildTrackedPaymentLink(baseUrl: string, productName?: string): string {
  const utmParams = getStoredUTMParams();
  
  // Build a reference ID that includes attribution data
  const attributionData: Record<string, string> = {};
  
  if (utmParams.utm_source) attributionData.src = utmParams.utm_source;
  if (utmParams.utm_medium) attributionData.med = utmParams.utm_medium;
  if (utmParams.utm_campaign) attributionData.cmp = utmParams.utm_campaign;
  if (utmParams.gclid) attributionData.gclid = utmParams.gclid.substring(0, 20); // Truncate for length
  if (utmParams.fbclid) attributionData.fbclid = utmParams.fbclid.substring(0, 20);
  
  // If we have attribution data, append to URL
  if (Object.keys(attributionData).length > 0) {
    const url = new URL(baseUrl);
    
    // Stripe Payment Links support prefilled_email and client_reference_id
    // We'll encode attribution in client_reference_id (max 200 chars)
    const refId = Object.entries(attributionData)
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    
    url.searchParams.set('client_reference_id', refId.substring(0, 200));
    
    return url.toString();
  }
  
  return baseUrl;
}

/**
 * Get attribution source as a readable string
 */
export function getAttributionSource(): string {
  const params = getStoredUTMParams();
  
  if (params.gclid) return 'Google Ads';
  if (params.fbclid) return 'Facebook/Meta Ads';
  if (params.utm_source) {
    const source = params.utm_source.toLowerCase();
    if (source.includes('google')) return 'Google';
    if (source.includes('facebook') || source.includes('fb') || source.includes('meta')) return 'Facebook/Meta';
    if (source.includes('instagram') || source.includes('ig')) return 'Instagram';
    if (source.includes('youtube') || source.includes('yt')) return 'YouTube';
    if (source.includes('tiktok')) return 'TikTok';
    return params.utm_source;
  }
  
  return 'Direct';
}
