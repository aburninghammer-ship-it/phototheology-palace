import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, MapPin, Flame, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ServiceCheckInProps {
  churchId: string;
}

export function ServiceCheckIn({ churchId }: ServiceCheckInProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [serviceType, setServiceType] = useState("sabbath");
  const [message, setMessage] = useState("");
  const [todayCheckins, setTodayCheckins] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (user && churchId) {
      loadData();
    }
  }, [user, churchId]);

  const loadData = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const [myCheckin, allToday] = await Promise.all([
        (supabase as any).from("church_service_checkins")
          .select("id")
          .eq("church_id", churchId)
          .eq("user_id", user!.id)
          .eq("service_date", today)
          .eq("service_type", serviceType)
          .maybeSingle(),
        (supabase as any).from("church_service_checkins")
          .select("id, user_id, message, checked_in_at")
          .eq("church_id", churchId)
          .eq("service_date", today)
          .order("checked_in_at", { ascending: false }),
      ]);

      setCheckedIn(!!myCheckin.data);

      if (allToday.data) {
        const userIds = allToday.data.map((c: any) => c.user_id);
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", userIds);

        const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
        setTodayCheckins(
          allToday.data.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) }))
        );
      }
    } catch (err) {
      console.error("Error loading checkin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    setChecking(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const { error } = await (supabase as any).from("church_service_checkins").insert({
        church_id: churchId,
        user_id: user.id,
        service_type: serviceType,
        service_date: today,
        check_in_method: "button",
        message: message || null,
      });

      if (error) throw error;
      setCheckedIn(true);
      toast.success("You're checked in! God bless your worship today.");
      loadData();
    } catch (err: any) {
      if (err.code === "23505") {
        toast.error("You've already checked in for this service today.");
        setCheckedIn(true);
      } else {
        toast.error("Failed to check in");
      }
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;
  }

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Service Check-In</CardTitle>
            </div>
            {streak > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                {streak} week streak
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {checkedIn ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <h3 className="font-semibold text-lg">You're here!</h3>
              <p className="text-sm text-muted-foreground">Checked in for today's service</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sabbath">Sabbath Service</SelectItem>
                  <SelectItem value="wednesday">Wednesday Prayer</SelectItem>
                  <SelectItem value="prayer">Prayer Meeting</SelectItem>
                  <SelectItem value="special">Special Event</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Share a quick thought... (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
              />
              <Button onClick={handleCheckIn} disabled={checking} className="w-full">
                {checking ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                I'm Here Today
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {todayCheckins.length > 0 && (
        <Card variant="glass">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Who's Here Today</CardTitle>
              <Badge variant="outline"><Users className="h-3 w-3 mr-1" />{todayCheckins.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayCheckins.map((c) => (
                <div key={c.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.profile?.avatar_url} />
                    <AvatarFallback className="text-xs">{(c.profile?.display_name || "?")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{c.profile?.display_name || "Member"}</p>
                    {c.message && <p className="text-xs text-muted-foreground">{c.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
