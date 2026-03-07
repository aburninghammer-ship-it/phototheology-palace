import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  ChevronDown, CheckCircle2, BookOpen, Telescope, Heart,
  Megaphone, Flame, Loader2, Lock, Send
} from "lucide-react";

interface MicroStudyDayProps {
  day: {
    day: number;
    title: string;
    focus: string;
    passages: string[];
    study_prompt: string;
    reflection_question?: string;
    social_media_template?: string;
    one_minute_explainer?: string;
    palace_room?: string;
  };
  dayNumber: number;
  packetId: string;
  completed: boolean;
  onComplete: () => void;
}

const DAY_ICONS: Record<number, typeof BookOpen> = {
  1: BookOpen,
  2: Telescope,
  3: Flame,
  4: Heart,
  5: Megaphone,
};

const DAY_COLORS: Record<number, string> = {
  1: "text-blue-500",
  2: "text-purple-500",
  3: "text-amber-500",
  4: "text-rose-500",
  5: "text-green-500",
};

export function MicroStudyDay({ day, dayNumber, packetId, completed, onComplete }: MicroStudyDayProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [summaryResponse, setSummaryResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const Icon = DAY_ICONS[dayNumber] || BookOpen;
  const color = DAY_COLORS[dayNumber] || "text-primary";

  // Days must be completed in order — lock if previous day not done
  // For simplicity we just show all unlocked here; parent can add gating logic

  const handleSubmit = async () => {
    if (!user || !summaryResponse.trim()) {
      toast.error("Please write your response before submitting");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from("sermon_micro_study_progress")
        .upsert({
          packet_id: packetId,
          user_id: user.id,
          day_number: dayNumber,
          completed_at: new Date().toISOString(),
          summary_response: summaryResponse,
        }, { onConflict: "packet_id,user_id,day_number" });

      if (error) throw error;
      toast.success(`Day ${dayNumber} completed!`);
      onComplete();
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error("Failed to save progress");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Card className={`transition-all ${completed ? "border-green-500/30 bg-green-500/5" : ""}`}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${completed ? "bg-green-500/10" : "bg-muted"}`}>
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Icon className={`h-5 w-5 ${color}`} />
                  )}
                </div>
                <div>
                  <CardTitle className="text-sm flex items-center gap-2">
                    Day {dayNumber}: {day.title}
                    {completed && <Badge variant="secondary" className="text-[10px]">Complete</Badge>}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">{day.focus}</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Key Passages */}
            {day.passages?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Key Passages</p>
                <div className="flex flex-wrap gap-1">
                  {day.passages.map((p, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{p}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Study Prompt */}
            {day.study_prompt && (
              <div className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs font-medium text-muted-foreground mb-1">📖 Study Instructions</p>
                <p className="text-sm leading-relaxed whitespace-pre-line">{day.study_prompt}</p>
              </div>
            )}

            {/* Reflection Question */}
            {day.reflection_question && (
              <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                <p className="text-xs font-medium text-primary mb-1">💭 Reflection</p>
                <p className="text-sm italic">{day.reflection_question}</p>
              </div>
            )}

            {/* Day 5 special: social media + explainer */}
            {dayNumber === 5 && day.social_media_template && (
              <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                <p className="text-xs font-medium text-green-600 mb-1">📱 Social Media Template</p>
                <p className="text-sm">{day.social_media_template}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(day.social_media_template!);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  Copy Post
                </Button>
              </div>
            )}

            {dayNumber === 5 && day.one_minute_explainer && (
              <div className="bg-green-500/5 rounded-lg p-3 border border-green-500/10">
                <p className="text-xs font-medium text-green-600 mb-1">🎙️ 1-Minute Explainer Script</p>
                <p className="text-sm whitespace-pre-line">{day.one_minute_explainer}</p>
              </div>
            )}

            {/* Palace Room */}
            {day.palace_room && (
              <p className="text-xs text-muted-foreground">
                🏰 Palace Room: <span className="font-medium">{day.palace_room}</span>
              </p>
            )}

            {/* Response area (forced interaction) */}
            {!completed && (
              <div className="space-y-2 pt-2 border-t">
                <p className="text-xs font-medium">✍️ Your Response (required to complete)</p>
                <Textarea
                  placeholder={
                    dayNumber === 1 ? "Write a 1-paragraph summary of what you learned..." :
                    dayNumber === 2 ? "What doctrinal truth stood out most and why?" :
                    dayNumber === 3 ? "How does this connect to the sanctuary/prophetic framework?" :
                    dayNumber === 4 ? "What is God calling you to change or do differently?" :
                    "Write one evangelistic question you could ask someone..."
                  }
                  value={summaryResponse}
                  onChange={(e) => setSummaryResponse(e.target.value)}
                  rows={3}
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={submitting || !summaryResponse.trim()}
                  className="w-full"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                  Complete Day {dayNumber}
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
