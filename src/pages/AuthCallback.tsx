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

        // If this callback arrived with an auth code (PKCE flow), exchange it for a session.
        // Without this, `getSession()` can be null and users bounce back to /auth.
        const code = searchParams.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }
        
        // Handle the OAuth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
          throw new Error('No session found after OAuth');
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

          const { error: insertError } = await supabase
            .from('social_media_connections')
            .upsert({
              user_id: session.user.id,
              platform,
              access_token_encrypted: encryptedAccessToken,
              refresh_token_encrypted: encryptedRefreshToken,
              is_active: true,
            }, {
              onConflict: 'user_id,platform'
            });

          if (insertError) throw insertError;

          toast({
            title: "Connected Successfully",
            description: `Your ${platform} account has been connected.`,
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
