import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Calendar, MessageSquare, Megaphone, BookOpen, Heart } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationSettings() {
  const {
    isNative,
    permissionStatus,
    preferences,
    isLoading,
    requestPermission,
    updatePreferences,
  } = usePushNotifications();

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardContent className="py-8 text-center">
          <div className="animate-pulse">Loading notification settings...</div>
        </CardContent>
      </Card>
    );
  }

  const notificationTypes = [
    {
      key: "events_enabled" as const,
      label: "Event Reminders",
      description: "Get notified about upcoming church events",
      icon: Calendar,
    },
    {
      key: "messages_enabled" as const,
      label: "Messages",
      description: "Direct messages from church members",
      icon: MessageSquare,
    },
    {
      key: "announcements_enabled" as const,
      label: "Announcements",
      description: "Important church announcements",
      icon: Megaphone,
    },
    {
      key: "study_reminders_enabled" as const,
      label: "Study Reminders",
      description: "Reminders for weekly studies and devotionals",
      icon: BookOpen,
    },
    {
      key: "prayer_requests_enabled" as const,
      label: "Prayer Requests",
      description: "New prayer requests from your church family",
      icon: Heart,
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Push Notifications</CardTitle>
            </div>
            <Badge
              variant={permissionStatus === "granted" ? "default" : "secondary"}
              className="gap-1"
            >
              {permissionStatus === "granted" ? (
                <>
                  <Bell className="h-3 w-3" /> Enabled
                </>
              ) : (
                <>
                  <BellOff className="h-3 w-3" /> Disabled
                </>
              )}
            </Badge>
          </div>
          <CardDescription>
            Manage how you receive notifications from your church
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isNative && (
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Push notifications are available on mobile devices. Download our app for the
                full notification experience.
              </p>
            </div>
          )}

          {isNative && permissionStatus !== "granted" && (
            <div className="bg-primary/10 rounded-lg p-4 mb-6">
              <p className="text-sm mb-3">
                Enable push notifications to stay connected with your church family.
              </p>
              <Button onClick={requestPermission} className="gap-2">
                <Bell className="h-4 w-4" />
                Enable Notifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">Notification Preferences</CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div key={type.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor={type.key} className="font-medium">
                      {type.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{type.description}</p>
                  </div>
                </div>
                <Switch
                  id={type.key}
                  checked={preferences[type.key]}
                  onCheckedChange={(checked) => updatePreferences({ [type.key]: checked })}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
