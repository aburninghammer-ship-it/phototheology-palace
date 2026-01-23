import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar, Link2, Unlink, RefreshCw, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CalendarSync {
  id: string;
  provider: string;
  sync_enabled: boolean;
  last_synced_at: string | null;
  calendar_id: string | null;
}

export function CalendarSyncSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [syncs, setSyncs] = useState<CalendarSync[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadSyncs();
    }
  }, [user?.id]);

  const loadSyncs = async () => {
    try {
      const { data, error } = await supabase
        .from("user_calendar_sync")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setSyncs(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading calendar sync settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSync = async (provider: string, enabled: boolean) => {
    try {
      const existingSync = syncs.find((s) => s.provider === provider);
      
      if (existingSync) {
        const { error } = await supabase
          .from("user_calendar_sync")
          .update({ sync_enabled: enabled, updated_at: new Date().toISOString() })
          .eq("id", existingSync.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_calendar_sync")
          .insert({
            user_id: user?.id,
            provider,
            sync_enabled: enabled,
          });

        if (error) throw error;
      }

      loadSyncs();
      toast({
        title: enabled ? "Sync enabled" : "Sync disabled",
        description: `${provider} calendar sync has been ${enabled ? "enabled" : "disabled"}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating sync",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const connectCalendar = async (provider: string) => {
    // In a real implementation, this would initiate OAuth flow
    toast({
      title: "Coming Soon",
      description: `${provider} calendar integration is coming soon. We'll notify you when it's available.`,
    });
  };

  const disconnectCalendar = async (provider: string) => {
    try {
      const { error } = await supabase
        .from("user_calendar_sync")
        .delete()
        .eq("user_id", user?.id)
        .eq("provider", provider);

      if (error) throw error;
      loadSyncs();
      toast({
        title: "Calendar disconnected",
        description: `Your ${provider} calendar has been disconnected.`,
      });
    } catch (error: any) {
      toast({
        title: "Error disconnecting",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const providers = [
    {
      id: "google",
      name: "Google Calendar",
      icon: "📅",
      color: "bg-red-500/10 text-red-600 border-red-500/30",
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      icon: "📆",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    },
  ];

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Calendar Sync</CardTitle>
        </div>
        <CardDescription>
          Sync church events with your personal calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {providers.map((provider) => {
          const sync = syncs.find((s) => s.provider === provider.id);
          const isConnected = !!sync?.calendar_id;
          const isSyncEnabled = sync?.sync_enabled ?? false;

          return (
            <Card key={provider.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{provider.icon}</div>
                  <div>
                    <h4 className="font-medium">{provider.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {isConnected ? (
                        <Badge variant="outline" className="text-green-600 border-green-500/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not connected
                        </Badge>
                      )}
                      {sync?.last_synced_at && (
                        <span className="text-xs text-muted-foreground">
                          Last synced: {format(new Date(sync.last_synced_at), "PPp")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isConnected && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`sync-${provider.id}`} className="text-sm">
                        Auto-sync
                      </Label>
                      <Switch
                        id={`sync-${provider.id}`}
                        checked={isSyncEnabled}
                        onCheckedChange={(checked) => toggleSync(provider.id, checked)}
                      />
                    </div>
                  )}

                  {isConnected ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => disconnectCalendar(provider.id)}
                    >
                      <Unlink className="h-4 w-4 mr-1" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => connectCalendar(provider.id)}
                    >
                      <Link2 className="h-4 w-4 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}

        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">How it works</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Connect your calendar to automatically add church events</li>
            <li>• Events you RSVP to will appear in your calendar</li>
            <li>• Get reminders before events start</li>
            <li>• Changes sync automatically every hour</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
