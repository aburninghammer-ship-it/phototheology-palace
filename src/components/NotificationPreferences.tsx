import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Bell, Volume2, Vibrate, BellOff, CheckCircle } from "lucide-react";
import { 
  getNotificationSoundEnabled, 
  setNotificationSoundEnabled,
  getNotificationVibrationEnabled,
  setNotificationVibrationEnabled 
} from "@/utils/notificationSound";

export function NotificationPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>("default");
  const [preferences, setPreferences] = useState({
    equation_challenges: true,
    christ_chapter_challenges: true,
    sanctuary_challenges: true,
    dimension_challenges: true,
    connect6_challenges: true,
    fruit_check_challenges: true,
    community_posts: true,
    study_reminders: true,
    renewal_reminders: true,
    video_tutorials: true,
    daily_verse: true,
    // Granular study reminders
    reading_plan_reminders: true,
    devotional_reminders: true,
    palace_practice_reminders: true,
    memory_challenge_reminders: true,
    streak_protection_alerts: true,
  });

  useEffect(() => {
    fetchPreferences();
    // Load local preferences for sound and vibration
    setSoundEnabled(getNotificationSoundEnabled());
    setVibrationEnabled(getNotificationVibrationEnabled());
    // Check browser notification permission
    if ("Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, [user]);

  const requestBrowserPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Browser notifications not supported");
      return;
    }
    
    const permission = await Notification.requestPermission();
    setBrowserPermission(permission);
    
    if (permission === "granted") {
      toast.success("Browser notifications enabled!");
      // Send test notification
      new Notification("Phototheology", {
        body: "Daily verse notifications are now enabled!",
        icon: "/favicon.ico"
      });
    } else if (permission === "denied") {
      toast.error("Notification permission denied. Enable in browser settings.");
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPreferences({
          equation_challenges: data.equation_challenges,
          christ_chapter_challenges: data.christ_chapter_challenges,
          sanctuary_challenges: data.sanctuary_challenges,
          dimension_challenges: data.dimension_challenges,
          connect6_challenges: data.connect6_challenges,
          fruit_check_challenges: data.fruit_check_challenges,
          community_posts: data.community_posts,
          study_reminders: data.study_reminders,
          renewal_reminders: data.renewal_reminders ?? true,
          video_tutorials: data.video_tutorials ?? true,
          daily_verse: data.daily_verse ?? true,
          reading_plan_reminders: data.reading_plan_reminders ?? true,
          devotional_reminders: data.devotional_reminders ?? true,
          palace_practice_reminders: data.palace_practice_reminders ?? true,
          memory_challenge_reminders: data.memory_challenge_reminders ?? true,
          streak_protection_alerts: data.streak_protection_alerts ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (key: keyof typeof preferences, value: boolean) => {
    if (!user) return;

    try {
      // Update local state immediately for better UX
      setPreferences(prev => ({ ...prev, [key]: value }));

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: user.id,
          [key]: value,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Notification preferences updated");
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error("Failed to update preferences");
      // Revert local state on error
      fetchPreferences();
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose what notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Browser Permission Banner */}
        {"Notification" in window && browserPermission !== "granted" && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-dashed mb-4">
            <div className="flex items-center gap-3">
              <BellOff className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Enable Push Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Get daily verse reminders even when you're away
                </p>
              </div>
            </div>
            <Button size="sm" onClick={requestBrowserPermission}>
              Enable
            </Button>
          </div>
        )}
        
        {browserPermission === "granted" && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Push notifications enabled</span>
          </div>
        )}

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Challenge Notifications</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Choose which challenge types you want to be notified about
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="equation-challenges">Equation Challenges</Label>
            <p className="text-sm text-muted-foreground">
              Phototheology equation building challenges
            </p>
          </div>
          <Switch
            id="equation-challenges"
            checked={preferences.equation_challenges}
            onCheckedChange={(checked) => updatePreference('equation_challenges', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="christ-chapter">Christ in Every Chapter</Label>
            <p className="text-sm text-muted-foreground">
              Find Christ in every chapter challenges
            </p>
          </div>
          <Switch
            id="christ-chapter"
            checked={preferences.christ_chapter_challenges}
            onCheckedChange={(checked) => updatePreference('christ_chapter_challenges', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sanctuary">Sanctuary Map Challenges</Label>
            <p className="text-sm text-muted-foreground">
              Biblical sanctuary pattern challenges
            </p>
          </div>
          <Switch
            id="sanctuary"
            checked={preferences.sanctuary_challenges}
            onCheckedChange={(checked) => updatePreference('sanctuary_challenges', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="dimension">5 Dimension Drill Challenges</Label>
            <p className="text-sm text-muted-foreground">
              Multi-dimensional Bible study challenges
            </p>
          </div>
          <Switch
            id="dimension"
            checked={preferences.dimension_challenges}
            onCheckedChange={(checked) => updatePreference('dimension_challenges', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="connect6">Connect-6 Genre Challenges</Label>
            <p className="text-sm text-muted-foreground">
              Biblical genre classification challenges
            </p>
          </div>
          <Switch
            id="connect6"
            checked={preferences.connect6_challenges}
            onCheckedChange={(checked) => updatePreference('connect6_challenges', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="fruit-check">Fruit Check Challenges</Label>
            <p className="text-sm text-muted-foreground">
              Spiritual fruit application challenges
            </p>
          </div>
          <Switch
            id="fruit-check"
            checked={preferences.fruit_check_challenges}
            onCheckedChange={(checked) => updatePreference('fruit_check_challenges', checked)}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-4">Other Notifications</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="community-posts">Community Posts</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about new community discussions
            </p>
          </div>
          <Switch
            id="community-posts"
            checked={preferences.community_posts}
            onCheckedChange={(checked) => updatePreference('community_posts', checked)}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2">📚 Daily Study Reminders (8 AM)</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get morning reminders for activities you haven't completed yet
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reading-plan-reminders">📖 Reading Plan Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Remind me if I haven't completed today's reading
            </p>
          </div>
          <Switch
            id="reading-plan-reminders"
            checked={preferences.reading_plan_reminders}
            onCheckedChange={(checked) => updatePreference('reading_plan_reminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="devotional-reminders">🙏 Devotional Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Remind me if I haven't done today's devotional
            </p>
          </div>
          <Switch
            id="devotional-reminders"
            checked={preferences.devotional_reminders}
            onCheckedChange={(checked) => updatePreference('devotional_reminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="palace-practice-reminders">🏛️ Palace Practice Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Remind me to practice my PT rooms daily
            </p>
          </div>
          <Switch
            id="palace-practice-reminders"
            checked={preferences.palace_practice_reminders}
            onCheckedChange={(checked) => updatePreference('palace_practice_reminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="memory-challenge-reminders">🧠 Memory Challenge Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Remind me to complete memory challenges
            </p>
          </div>
          <Switch
            id="memory-challenge-reminders"
            checked={preferences.memory_challenge_reminders}
            onCheckedChange={(checked) => updatePreference('memory_challenge_reminders', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="streak-protection-alerts">🔥 Streak Protection Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Alert me if my streak is at risk (3+ days)
            </p>
          </div>
          <Switch
            id="streak-protection-alerts"
            checked={preferences.streak_protection_alerts}
            onCheckedChange={(checked) => updatePreference('streak_protection_alerts', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="daily-verse">Daily Verse of the Day</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications for the daily verse and its breakdown
            </p>
          </div>
          <Switch
            id="daily-verse"
            checked={preferences.daily_verse}
            onCheckedChange={(checked) => updatePreference('daily_verse', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="video-tutorials">New Video Tutorials</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when new training videos are published
            </p>
          </div>
          <Switch
            id="video-tutorials"
            checked={preferences.video_tutorials}
            onCheckedChange={(checked) => updatePreference('video_tutorials', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="renewal-reminders">Subscription Renewal Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get notified 30 days before your annual subscription renews
            </p>
          </div>
          <Switch
            id="renewal-reminders"
            checked={preferences.renewal_reminders}
            onCheckedChange={(checked) => updatePreference('renewal_reminders', checked)}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-4">Notification Settings</h3>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label htmlFor="sound-notifications">Notification Sound</Label>
              <p className="text-sm text-muted-foreground">
                Play sound when receiving messages
              </p>
            </div>
          </div>
          <Switch
            id="sound-notifications"
            checked={soundEnabled}
            onCheckedChange={(checked) => {
              setSoundEnabled(checked);
              setNotificationSoundEnabled(checked);
              toast.success(checked ? 'Sound enabled' : 'Sound disabled', {
                description: checked 
                  ? 'You will now hear sounds for new messages' 
                  : 'Message sounds are now muted',
              });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5 flex items-center gap-2">
            <Vibrate className="h-4 w-4 text-muted-foreground" />
            <div>
              <Label htmlFor="vibration-notifications">Vibration</Label>
              <p className="text-sm text-muted-foreground">
                Vibrate device when receiving messages (mobile)
              </p>
            </div>
          </div>
          <Switch
            id="vibration-notifications"
            checked={vibrationEnabled}
            onCheckedChange={(checked) => {
              setVibrationEnabled(checked);
              setNotificationVibrationEnabled(checked);
              toast.success(checked ? 'Vibration enabled' : 'Vibration disabled', {
                description: checked 
                  ? 'Device will vibrate for new messages' 
                  : 'Vibration is now disabled',
              });
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}