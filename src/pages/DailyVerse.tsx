import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Book, Sparkles, CheckCircle2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface PrincipleBreakdown {
  principle_code: string;
  principle_name: string;
  application: string;
  key_insight: string;
  practical_takeaway: string;
}

interface DailyVerse {
  id: string;
  verse_reference: string;
  verse_text: string;
  principles_used: string[];
  breakdown: {
    breakdown: PrincipleBreakdown[];
  };
  date: string;
}

export default function DailyVerse() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: todayVerse, isLoading } = useQuery({
    queryKey: ['daily-verse', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_verses')
        .select('*')
        .eq('date', today)
        .single();
      
      if (error) throw error;
      return data as unknown as DailyVerse;
    },
  });

  const { data: hasRead } = useQuery({
    queryKey: ['verse-reading', todayVerse?.id, user?.id],
    queryFn: async () => {
      if (!todayVerse || !user) return false;
      const { data } = await supabase
        .from('user_verse_readings')
        .select('id')
        .eq('user_id', user.id)
        .eq('verse_id', todayVerse.id)
        .single();
      return !!data;
    },
    enabled: !!todayVerse && !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!todayVerse || !user) return;
      const { error } = await supabase
        .from('user_verse_readings')
        .insert({
          user_id: user.id,
          verse_id: todayVerse.id
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verse-reading'] });
      toast.success("Marked as read! Keep up the daily practice.");
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">Loading today's verse...</div>
        </div>
      </div>
    );
  }

  if (!todayVerse) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardContent className="text-center py-12">
              <Book className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg mb-4">No verse available for today yet.</p>
              <p className="text-sm text-muted-foreground">Check back later!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy">
      <SimplifiedNav />
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              Verse of the Day
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(todayVerse.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          {!hasRead && (
            <Button
              onClick={() => markAsReadMutation.mutate()}
              disabled={markAsReadMutation.isPending}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark as Read
            </Button>
          )}
          {hasRead && (
            <Badge variant="secondary" className="text-sm">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed Today
            </Badge>
          )}
        </div>

        {/* Verse Display */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{todayVerse.verse_reference}</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-xl text-center italic leading-relaxed px-6">
              "{todayVerse.verse_text}"
            </blockquote>
          </CardContent>
        </Card>

        {/* Principles Applied */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Palace Principles Applied
            </CardTitle>
            <CardDescription>
              Today we're exploring this verse through {todayVerse.principles_used.length} powerful principles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {todayVerse.principles_used.map((code) => (
                <Badge key={code} variant="outline">
                  {code}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Breakdown */}
        <div className="space-y-4">
          {todayVerse.breakdown.breakdown.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Badge>{item.principle_code}</Badge>
                  {item.principle_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-primary">Application</h4>
                  <p className="text-sm leading-relaxed">{item.application}</p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-sm text-primary">💎 Key Insight</h4>
                  <p className="text-sm">{item.key_insight}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h4 className="font-semibold mb-2 text-sm text-primary">✨ Practical Takeaway</h4>
                  <p className="text-sm">{item.practical_takeaway}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
