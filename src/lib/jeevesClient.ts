import { supabase } from "@/integrations/supabase/client";
import { trackJeevesInteraction } from "@/hooks/useAnalyticsTracking";

interface JeevesRequest {
  mode: string;
  message?: string;
  [key: string]: unknown;
}

interface JeevesResponse {
  data: unknown;
  error: Error | null;
}

// Cache the user's first name so we don't fetch it on every call
let _cachedUserName: string | null = null;
let _cacheUserId: string | null = null;

async function getUserName(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Return cached if same user
    if (_cacheUserId === user.id && _cachedUserName) return _cachedUserName;

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();

    _cacheUserId = user.id;
    if (profile?.display_name) {
      _cachedUserName = profile.display_name.trim().split(/\s+/)[0];
    } else if (profile?.username) {
      _cachedUserName = profile.username;
    } else {
      _cachedUserName = null;
    }
    return _cachedUserName;
  } catch {
    return _cachedUserName;
  }
}

/**
 * Wrapper for Jeeves function calls that automatically tracks interactions
 * and injects the user's name into every request
 */
export const callJeeves = async (
  body: JeevesRequest,
  pageContext?: string
): Promise<JeevesResponse> => {
  // Auto-inject userName if not already provided
  if (!body.userName) {
    const name = await getUserName();
    if (name) body.userName = name;
  }

  // Auto-inject experienceMode from localStorage
  if (!body.experienceMode) {
    const storedMode = localStorage.getItem("pt-experience-mode");
    if (storedMode === "simple" || storedMode === "guided" || storedMode === "master") {
      body.experienceMode = storedMode;
    }
  }

  const { data, error } = await supabase.functions.invoke("jeeves", { body });
  
  // Track the interaction asynchronously (don't block the response)
  const question = body.message || body.mode || "unknown";
  const featureUsed = body.mode || "unknown";
  const responsePreview = typeof data === "string" 
    ? data.substring(0, 200) 
    : data?.response?.substring(0, 200) || null;
  
  trackJeevesInteraction(question, featureUsed, responsePreview, pageContext);
  
  return { data, error };
};
