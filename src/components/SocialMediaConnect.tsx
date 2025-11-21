import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Facebook, Twitter, Linkedin, Unlink, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";

type Platform = 'facebook' | 'twitter' | 'linkedin';

interface SocialConnection {
  id: string;
  platform: Platform;
  platform_username: string | null;
  is_active: boolean;
  created_at: string;
}

export const SocialMediaConnect = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState<Platform | null>(null);

  const { data: connections, refetch } = useQuery({
    queryKey: ['social-connections', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('social_media_connections')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as SocialConnection[];
    },
    enabled: !!user,
  });

  const handleConnect = async (platform: Platform) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect social media accounts.",
        variant: "destructive",
      });
      return;
    }

    setConnecting(platform);
    
    try {
      let provider: 'facebook' | 'twitter' | 'linkedin_oidc';
      let scopes = '';
      
      switch (platform) {
        case 'facebook':
          provider = 'facebook';
          scopes = 'public_profile,email,pages_manage_posts';
          break;
        case 'twitter':
          provider = 'twitter';
          scopes = 'tweet.read,tweet.write,users.read';
          break;
        case 'linkedin':
          provider = 'linkedin_oidc';
          scopes = 'openid,profile,email,w_member_social';
          break;
        default:
          throw new Error('Unsupported platform');
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          scopes,
          redirectTo: `${window.location.origin}/auth/callback?platform=${platform}`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        if (error.message?.includes('not enabled') || error.message?.includes('Provider')) {
          toast({
            title: "OAuth Not Configured",
            description: `${platform.charAt(0).toUpperCase() + platform.slice(1)} OAuth is not set up yet. Please contact the administrator to configure social media integrations.`,
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setConnecting(null);
        return;
      }

      toast({
        title: "Redirecting...",
        description: `Opening ${platform} authorization page...`,
      });
    } catch (error: any) {
      console.error('OAuth connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || `Failed to connect to ${platform}. Please try again.`,
        variant: "destructive",
      });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: Platform) => {
    try {
      const { error } = await supabase
        .from('social_media_connections')
        .delete()
        .eq('user_id', user?.id)
        .eq('platform', platform);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: `Your ${platform} account has been disconnected.`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isConnected = (platform: Platform) => {
    return connections?.some(c => c.platform === platform && c.is_active);
  };

  const getUsername = (platform: Platform) => {
    return connections?.find(c => c.platform === platform)?.platform_username;
  };

  const platforms = [
    {
      name: 'facebook' as Platform,
      icon: Facebook,
      label: 'Facebook',
      color: 'text-blue-600',
    },
    {
      name: 'twitter' as Platform,
      icon: Twitter,
      label: 'Twitter',
      color: 'text-sky-500',
    },
    {
      name: 'linkedin' as Platform,
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'text-blue-700',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Accounts</CardTitle>
        <CardDescription>
          Connect your social media accounts to share challenges directly to your feed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const connected = isConnected(platform.name);
          const username = getUsername(platform.name);

          return (
            <div
              key={platform.name}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-6 w-6 ${platform.color}`} />
                <div>
                  <p className="font-medium">{platform.label}</p>
                  {connected && username && (
                    <p className="text-sm text-muted-foreground">@{username}</p>
                  )}
                </div>
                {connected && (
                  <Badge variant="secondary" className="gap-1">
                    <Check className="h-3 w-3" />
                    Connected
                  </Badge>
                )}
              </div>
              
              {connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(platform.name)}
                  className="gap-2"
                >
                  <Unlink className="h-4 w-4" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleConnect(platform.name)}
                  disabled={connecting === platform.name}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  Connect
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
