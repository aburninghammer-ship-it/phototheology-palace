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
        // Get the platform from query params
        const platform = searchParams.get('platform') as 'facebook' | 'twitter' | 'linkedin' | null;
        
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
          // This was a regular auth flow
          navigate('/dashboard', { replace: true });
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
