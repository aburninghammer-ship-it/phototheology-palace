import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function PTModeToggle() {
  const { user } = useAuth();
  const [ptMode, setPtMode] = useState<'beginner' | 'expert'>('beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_pt_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setPtMode(data.pt_mode as 'beginner' | 'expert');
      }
    } catch (error) {
      console.error('Error loading PT preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = async (checked: boolean) => {
    const newMode = checked ? 'expert' : 'beginner';
    setPtMode(newMode);

    try {
      const { error } = await supabase
        .from('user_pt_preferences')
        .upsert({
          user_id: user?.id,
          pt_mode: newMode,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success(`Switched to ${newMode} mode`);
    } catch (error) {
      console.error('Error updating PT mode:', error);
      toast.error('Failed to update mode');
      // Revert on error
      setPtMode(checked ? 'beginner' : 'expert');
    }
  };

  if (loading) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {ptMode === 'beginner' ? (
            <GraduationCap className="h-5 w-5" />
          ) : (
            <Sparkles className="h-5 w-5" />
          )}
          PT Learning Mode
        </CardTitle>
        <CardDescription>
          {ptMode === 'beginner' 
            ? 'Get explanations for PT principles' 
            : 'Streamlined interface for experienced users'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch
            id="pt-mode"
            checked={ptMode === 'expert'}
            onCheckedChange={toggleMode}
          />
          <Label htmlFor="pt-mode" className="cursor-pointer">
            {ptMode === 'beginner' ? 'Beginner Mode' : 'Expert Mode'}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
