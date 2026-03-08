import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Optional post-auth redirect target (must be a safe relative path)
        const redirectParam = searchParams.get("redirect");
        const safeRedirect =
          redirectParam && redirectParam.startsWith("/") && !redirectParam.startsWith("//")
            ? redirectParam
            : null;

        // Get the platform from query params
        const platform = searchParams.get('platform') as 'facebook' | 'twitter' | 'linkedin' | null;

        // Support both OAuth return modes:
        // - PKCE:     ?code=...
        // - Implicit: #access_token=...&refresh_token=...
        // For implicit, we manually parse the URL hash and store the session.
        const trySetSessionFromHash = async (): Promise<boolean> => {
          if (typeof window === "undefined") return false;
          const hash = window.location.hash;
          if (!hash || !hash.includes("access_token=")) return false;

          const hashParams = new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash);
          const access_token = hashParams.get("access_token") ?? "";
          const refresh_token = hashParams.get("refresh_token") ?? "";

          if (!access_token || !refresh_token) return false;

          const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;

          // Clean up URL (remove tokens from hash)
          try {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          } catch {
            // ignore
          }

          return !!data.session;
        };

        const hasHashTokens = await trySetSessionFromHash();

        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        // Wait for the session to be established — sometimes it takes a moment
        // after code exchange or hash token extraction.
        let session = null;
        let sessionError = null;
        
        for (let attempt = 0; attempt < 5; attempt++) {
          const result = await supabase.auth.getSession();
          sessionError = result.error;
          session = result.data?.session;
          
          if (sessionError || session) break;
          
          // Wait progressively longer between retries
          await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
          console.log(`[AuthCallback] Session not ready, retry ${attempt + 1}/5...`);
        }
        
        if (sessionError) throw sessionError;
        if (!session) {
          throw new Error('No session found after OAuth. Please try signing in again.');
        }

        // If a platform was specified, this is a social media connection (not app auth)
        if (platform) {
          const providerToken = session.provider_token;
          const providerRefreshToken = session.provider_refresh_token;
          
          if (!providerToken) {
            throw new Error('No provider token received');
          }

          // Store the social media connection with encrypted tokens
          // Using base64 encoding - in production, use proper encryption with a server-side key
          const encryptedAccessToken = btoa(providerToken);
          const encryptedRefreshToken = providerRefreshToken ? btoa(providerRefreshToken) : null;

          // Fetch platform user profile to store username/ID
          let platformUserId: string | null = null;
          let platformUsername: string | null = null;

          if (platform === 'facebook') {
            try {
              const fbRes = await fetch(
                `https://graph.facebook.com/me?fields=id,name&access_token=${providerToken}`
              );
              if (fbRes.ok) {
                const fbUser = await fbRes.json();
                platformUserId = fbUser.id || null;
                platformUsername = fbUser.name || null;
              }
            } catch (fbError) {
              console.error('Failed to fetch Facebook profile:', fbError);
            }
          }

          const { error: insertError } = await supabase
            .from('social_media_connections')
            .upsert({
              user_id: session.user.id,
              platform,
              access_token_encrypted: encryptedAccessToken,
              refresh_token_encrypted: encryptedRefreshToken,
              platform_user_id: platformUserId,
              platform_username: platformUsername,
              is_active: true,
            }, {
              onConflict: 'user_id,platform'
            });

          if (insertError) throw insertError;

          toast({
            title: "Connected Successfully",
            description: `Your ${platform} account has been connected${platformUsername ? ` as ${platformUsername}` : ''}.`,
          });

          // Navigate back to profile
          navigate('/profile', { replace: true });
        } else {
          // This was a regular auth flow - check gatehouse status
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('has_entered_palace')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            // Profile might not exist yet for new users - send to gatehouse
            navigate('/gatehouse', { replace: true });
          } else if (profile && !profile.has_entered_palace) {
            navigate('/gatehouse', { replace: true });
          } else {
            // Honor an explicit redirect target when provided
            navigate(safeRedirect ?? '/dashboard', { replace: true });
          }
        }
      } catch (error: any) {
        console.error('OAuth callback error:', error);
        toast({
          title: "Connection Failed",
          description: error.message || "Failed to complete the connection. Please try again.",
          variant: "destructive",
        });
        navigate('/profile', { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, toast]);

  return <LoadingScreen />;
}
