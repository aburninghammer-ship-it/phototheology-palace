import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp } from "lucide-react";
import { WARRIOR_CHARACTERISTICS } from "@/data/artOfWarLessons";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CharacteristicData {
  id: string;
  characteristic_name: string;
  level: number;
  practices_completed: number;
  last_practiced_at: string | null;
}

export const CharacteristicTracker = () => {
  const [characteristics, setCharacteristics] = useState<CharacteristicData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCharacteristics();
    }
  }, [userId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  };

  const fetchCharacteristics = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('warrior_characteristics')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      setCharacteristics(data);
    }
  };

  const handlePractice = async (characteristicId: string) => {
    if (!userId) {
      toast.error("Please log in to track progress");
      return;
    }

    setIsLoading(true);

    try {
      // Check if characteristic exists
      const existing = characteristics.find(c => c.characteristic_name === characteristicId);

      if (existing) {
        // Calculate new level (level up every 10 practices)
        const newPractices = existing.practices_completed + 1;
        const newLevel = Math.min(10, Math.floor(newPractices / 10) + 1);

        const { error } = await supabase
          .from('warrior_characteristics')
          .update({
            practices_completed: newPractices,
            level: newLevel,
            last_practiced_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;

        if (newLevel > existing.level) {
          toast.success(`Level Up! ${characteristicId} is now level ${newLevel}! 🎉`);
        } else {
          toast.success("Practice recorded!");
        }
      } else {
        // Create new characteristic
        const { error } = await supabase
          .from('warrior_characteristics')
          .insert({
            user_id: userId,
            characteristic_name: characteristicId,
            level: 1,
            practices_completed: 1,
            last_practiced_at: new Date().toISOString()
          });

        if (error) throw error;
        toast.success("New characteristic tracked!");
      }

      await fetchCharacteristics();
    } catch (error) {
      console.error("Error recording practice:", error);
      toast.error("Failed to record practice");
    } finally {
      setIsLoading(false);
    }
  };

  const getCharacteristicData = (id: string) => {
    return characteristics.find(c => c.characteristic_name === id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            <CardTitle>Warrior Characteristics Development</CardTitle>
          </div>
          <CardDescription>
            Track your growth in the characteristics of mighty men and women of God. Practice makes permanent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WARRIOR_CHARACTERISTICS.map((char) => {
              const data = getCharacteristicData(char.id);
              const level = data?.level || 0;
              const practices = data?.practices_completed || 0;
              const progressToNext = ((practices % 10) / 10) * 100;

              return (
                <Card key={char.id} className="border-2">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{char.name}</CardTitle>
                        {level > 0 && (
                          <Badge variant="default" className="text-xs">
                            Level {level}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs">
                        {char.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {level > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progress to Level {level + 1}</span>
                          <span>{practices % 10}/10</span>
                        </div>
                        <Progress value={progressToNext} className="h-2" />
                      </div>
                    )}
                    <Button 
                      onClick={() => handlePractice(char.id)}
                      disabled={isLoading}
                      size="sm"
                      className="w-full"
                    >
                      {practices > 0 ? "Practice Again" : "Start Training"}
                    </Button>
                    {practices > 0 && (
                      <p className="text-xs text-center text-muted-foreground">
                        Practiced {practices} {practices === 1 ? 'time' : 'times'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {!userId && (
        <Card className="border-amber-500">
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Log in to track your characteristic development and progress
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};