import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Loader2, Check, Unlink, ExternalLink, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface PatreonConnection {
  id: string;
  patreon_name: string | null;
  patreon_email: string | null;
  is_active_patron: boolean | null;
  entitled_cents: number | null;
}

export const PatreonConnect = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const { data: connection, isLoading, refetch } = useQuery({
    queryKey: ['patreon-connection', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('patreon_connections')
        .select('id, patreon_name, patreon_email, is_active_patron, entitled_cents')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data as PatreonConnection | null;
    },
    enabled: !!user,
  });

  const handleConnect = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to connect your Patreon account.",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);

    try {
      // Use canonical domain for Patreon OAuth to avoid redirect URI mismatches across domains
      const redirectUri = "https://phototheology.app/patreon-callback";

      const { data, error: fnError } = await supabase.functions.invoke("patreon-auth", {
        body: { redirectUri, userId: user.id },
      });

      if (fnError) throw fnError;

      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("Failed to get Patreon authorization URL");
      }
    } catch (error: any) {
      console.error("Patreon connect error:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Patreon. Please try again.",
        variant: "destructive",
      });
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !connection) return;

    setDisconnecting(true);

    try {
      const { error } = await supabase
        .from('patreon_connections')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Patreon Disconnected",
        description: "Your Patreon account has been disconnected.",
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['patreon-connection'] });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disconnect Patreon account.",
        variant: "destructive",
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const formatPledgeAmount = (cents: number | null) => {
    if (!cents) return null;
    return `$${(cents / 100).toFixed(2)}/month`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-orange-500" />
            Patreon Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-orange-500" />
          Patreon Connection
        </CardTitle>
        <CardDescription>
          {connection
            ? "Your Patreon account is connected"
            : "Connect your Patreon account to access your patron benefits"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connection ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/20">
                  <Crown className="h-5 w-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm sm:text-base">
                      {connection.patreon_name || "Patreon Account"}
                    </p>
                    {connection.is_active_patron ? (
                      <Badge variant="secondary" className="gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <Check className="h-3 w-3" />
                        Active Patron
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <AlertCircle className="h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {connection.patreon_email && (
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {connection.patreon_email}
                    </p>
                  )}
                  {connection.entitled_cents && connection.entitled_cents > 0 && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mt-1">
                      Pledging {formatPledgeAmount(connection.entitled_cents)}
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="gap-2 w-full sm:w-auto"
              >
                {disconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="h-4 w-4" />
                )}
                Disconnect
              </Button>
            </div>

            {!connection.is_active_patron && (
              <Alert className="bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-sm">
                  Your Patreon account is connected but you don't have an active pledge.
                  <a
                    href="https://www.patreon.com/phototheology"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 underline"
                  >
                    Become a patron <ExternalLink className="h-3 w-3" />
                  </a>
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border rounded-lg">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Crown className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm sm:text-base">Patreon</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Not connected
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleConnect}
                disabled={connecting}
                className="gap-2 w-full sm:w-auto bg-[#FF424D] hover:bg-[#E63946] text-white"
              >
                {connecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Crown className="h-4 w-4" />
                    Connect Patreon
                  </>
                )}
              </Button>
            </div>

            <Alert className="bg-muted/50">
              <Crown className="h-4 w-4 text-orange-500" />
              <AlertDescription className="text-sm">
                Already a Patreon supporter? Connect your account to unlock your patron benefits automatically.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};
