import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export function NotificationPreferences() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    equation_challenges: true,
    community_posts: true,
    study_reminders: true,
  });

  useEffect(() => {
    fetchPreferences();
  }, [user]);

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
          community_posts: data.community_posts,
          study_reminders: data.study_reminders,
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
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="equation-challenges">Equation Challenges</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when someone shares a new equation challenge
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

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="study-reminders">Study Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Receive reminders for daily challenges and streaks
            </p>
          </div>
          <Switch
            id="study-reminders"
            checked={preferences.study_reminders}
            onCheckedChange={(checked) => updatePreference('study_reminders', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}