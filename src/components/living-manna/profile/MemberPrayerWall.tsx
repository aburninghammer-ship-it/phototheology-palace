import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HandHeart, CheckCircle2, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface MemberPrayerWallProps {
  prayerRequests: any[];
  targetUserId: string;
}

export function MemberPrayerWall({ prayerRequests, targetUserId }: MemberPrayerWallProps) {
  const { user } = useAuth();
  const [prayedFor, setPrayedFor] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(prayerRequests.map((p) => [p.id, p.prayer_count || 0]))
  );

  const handlePray = async (requestId: string) => {
    if (!user || prayedFor.has(requestId)) return;
    try {
      // Insert prayer response (the trigger increments the count)
      await (supabase as any).from("prayer_responses").insert({
        prayer_request_id: requestId,
        user_id: user.id,
      });
      setPrayedFor((prev) => new Set([...prev, requestId]));
      setCounts((prev) => ({ ...prev, [requestId]: (prev[requestId] || 0) + 1 }));
      toast.success("Prayer noted 🙏");
    } catch (err: any) {
      // May fail if already prayed - that's ok
      if (err?.message?.includes("duplicate")) {
        setPrayedFor((prev) => new Set([...prev, requestId]));
      } else {
        console.error(err);
      }
    }
  };

  if (prayerRequests.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="p-8 text-center">
          <HandHeart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No public prayer requests.</p>
          <p className="text-xs text-muted-foreground mt-1">
            {user?.id === targetUserId
              ? "Share prayer requests from your profile settings."
              : "This member hasn't shared any prayer requests yet."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {prayerRequests.map((req) => (
        <Card
          key={req.id}
          variant="glass"
          className={req.is_answered ? "border-emerald-500/30" : ""}
        >
          <CardContent className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium">{req.title}</h4>
              {req.is_answered && (
                <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Answered
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{req.content}</p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-muted-foreground">
                {new Date(req.created_at).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  🙏 {counts[req.id] || 0} prayers
                </span>
                {user && user.id !== targetUserId && (
                  <Button
                    variant={prayedFor.has(req.id) ? "secondary" : "outline"}
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => handlePray(req.id)}
                    disabled={prayedFor.has(req.id)}
                  >
                    <Heart className={`h-3 w-3 ${prayedFor.has(req.id) ? "fill-pink-500 text-pink-500" : ""}`} />
                    {prayedFor.has(req.id) ? "Prayed" : "Pray"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
