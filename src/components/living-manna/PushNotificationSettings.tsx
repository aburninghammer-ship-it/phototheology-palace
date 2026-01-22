import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usePushNotifications, NotificationPreferences } from "@/hooks/usePushNotifications";
import { 
  Bell, 
  BellOff, 
  CalendarCheck, 
  MessageSquare, 
  Megaphone, 
  BookOpen, 
  Heart,
  Smartphone,
  CheckCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface PreferenceSetting {
  key: keyof Omit<NotificationPreferences, 'enabled'>;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const PREFERENCE_SETTINGS: PreferenceSetting[] = [
  {
    key: 'events',
    label: 'Church Events',
    description: 'Event reminders, RSVPs, and updates',
    icon: <CalendarCheck className="h-4 w-4" />,
  },
  {
    key: 'messages',
    label: 'Group Messages',
    description: 'Chat messages from ministry groups',
    icon: <MessageSquare className="h-4 w-4" />,
  },
  {
    key: 'announcements',
    label: 'Announcements',
    description: 'Church-wide announcements and news',
    icon: <Megaphone className="h-4 w-4" />,
  },
  {
    key: 'study_reminders',
    label: 'Study Reminders',
    description: 'Reminders for Bible studies and devotionals',
    icon: <BookOpen className="h-4 w-4" />,
  },
  {
    key: 'prayer_requests',
    label: 'Prayer Requests',
    description: 'New prayer requests from the community',
    icon: <Heart className="h-4 w-4" />,
  },
];

export function PushNotificationSettings() {
  const {
    isSupported,
    isRegistered,
    preferences,
    loading,
    register,
    unregister,
    updatePreferences,
  } = usePushNotifications();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const result = await register();
      if (!result.success && result.error !== "Not supported") {
        toast.error("Failed to enable notifications: " + result.error);
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setIsUnregistering(true);
    try {
      await unregister();
    } finally {
      setIsUnregistering(false);
    }
  };

  const handleToggleAll = async (enabled: boolean) => {
    await updatePreferences({ enabled });
  };

  const handleTogglePreference = async (key: keyof Omit<NotificationPreferences, 'enabled'>, value: boolean) => {
    await updatePreferences({ [key]: value });
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading notification settings...</p>
        </CardContent>
      </Card>
    );
  }

  // Web fallback - show info about native app
  if (!isSupported) {
    return (
      <Card className="backdrop-blur-xl bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Smartphone className="h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Stay connected with your church community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/20 border border-dashed">
            <BellOff className="h-8 w-8 text-muted-foreground mb-3" />
            <p className="font-medium mb-1">Available on Mobile App</p>
            <p className="text-sm text-muted-foreground">
              Push notifications are available when using the Phototheology mobile app on iOS or Android.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5" />
          Push Notifications
        </CardTitle>
        <CardDescription>
          Control which notifications you receive from your church
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registration Status */}
        {!isRegistered ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          >
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-2 rounded-full bg-purple-500/20">
                <Bell className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium">Enable Push Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Never miss important church updates
                </p>
              </div>
            </div>
            <Button
              onClick={handleRegister}
              disabled={isRegistering}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isRegistering ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Enable
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-green-400">Notifications Enabled</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive push notifications
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUnregister}
              disabled={isUnregistering}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              {isUnregistering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Disable"
              )}
            </Button>
          </div>
        )}

        {/* Master Toggle */}
        {isRegistered && (
          <>
            <div className="flex items-center justify-between py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label className="font-medium">All Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Master toggle for all notification types
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.enabled}
                onCheckedChange={handleToggleAll}
              />
            </div>

            {/* Individual Preferences */}
            {preferences.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1"
              >
                {PREFERENCE_SETTINGS.map((setting, index) => (
                  <motion.div
                    key={setting.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between py-3 hover:bg-white/5 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-white/10">
                        {setting.icon}
                      </div>
                      <div>
                        <Label className="text-sm font-medium cursor-pointer">
                          {setting.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={preferences[setting.key]}
                      onCheckedChange={(value) => handleTogglePreference(setting.key, value)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!preferences.enabled && (
              <div className="text-center py-4 text-muted-foreground">
                <BellOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Enable "All Notifications" to customize notification types
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
