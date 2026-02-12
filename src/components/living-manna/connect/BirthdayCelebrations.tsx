import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Cake, Heart, PartyPopper, Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface BirthdayCelebrationsProps {
  churchId: string;
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function BirthdayCelebrations({ churchId }: BirthdayCelebrationsProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
  const [myData, setMyData] = useState<any>(null);
  const [birthdayMonth, setBirthdayMonth] = useState("");
  const [birthdayDay, setBirthdayDay] = useState("");
  const [weddingMonth, setWeddingMonth] = useState("");
  const [weddingDay, setWeddingDay] = useState("");
  const [showBirthday, setShowBirthday] = useState(true);
  const [showAnniversary, setShowAnniversary] = useState(true);

  useEffect(() => {
    if (user && churchId) loadData();
  }, [user, churchId]);

  const loadData = async () => {
    try {
      const [myRes, upcomingRes] = await Promise.all([
        (supabase as any).from("church_member_celebrations")
          .select("*")
          .eq("church_id", churchId)
          .eq("user_id", user!.id)
          .maybeSingle(),
        (supabase as any).from("church_member_celebrations")
          .select("user_id, birthday_month, birthday_day, show_birthday")
          .eq("church_id", churchId)
          .eq("show_birthday", true)
          .not("birthday_month", "is", null),
      ]);

      if (myRes.data) {
        setMyData(myRes.data);
        setBirthdayMonth(myRes.data.birthday_month?.toString() || "");
        setBirthdayDay(myRes.data.birthday_day?.toString() || "");
        setWeddingMonth(myRes.data.wedding_anniversary_month?.toString() || "");
        setWeddingDay(myRes.data.wedding_anniversary_day?.toString() || "");
        setShowBirthday(myRes.data.show_birthday);
        setShowAnniversary(myRes.data.show_anniversary);
      }

      if (upcomingRes.data) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentDay = now.getDate();
        const upcoming = upcomingRes.data
          .filter((c: any) => {
            if (c.birthday_month === currentMonth && c.birthday_day >= currentDay) return true;
            if (c.birthday_month === (currentMonth % 12) + 1) return true;
            return false;
          })
          .sort((a: any, b: any) => a.birthday_month - b.birthday_month || a.birthday_day - b.birthday_day);

        const userIds = upcoming.map((c: any) => c.user_id);
        if (userIds.length > 0) {
          const { data: profiles } = await supabase
            .from("profiles")
            .select("id, display_name, avatar_url")
            .in("id", userIds);
          const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);
          setUpcomingBirthdays(upcoming.map((c: any) => ({ ...c, profile: profileMap.get(c.user_id) })));
        }
      }
    } catch (err) {
      console.error("Error loading celebrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const data = {
        church_id: churchId,
        user_id: user.id,
        birthday_month: birthdayMonth ? parseInt(birthdayMonth) : null,
        birthday_day: birthdayDay ? parseInt(birthdayDay) : null,
        wedding_anniversary_month: weddingMonth ? parseInt(weddingMonth) : null,
        wedding_anniversary_day: weddingDay ? parseInt(weddingDay) : null,
        show_birthday: showBirthday,
        show_anniversary: showAnniversary,
      };

      const { error } = await (supabase as any).from("church_member_celebrations").upsert(data, { onConflict: "church_id,user_id" });
      if (error) throw error;
      toast.success("Celebration dates saved!");
      loadData();
    } catch (err: any) {
      toast.error("Failed to save: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Card variant="glass"><CardContent className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></CardContent></Card>;
  }

  return (
    <div className="space-y-4">
      {/* Upcoming Birthdays */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Upcoming Birthdays</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {upcomingBirthdays.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming birthdays. Add yours below!</p>
          ) : (
            <div className="space-y-3">
              {upcomingBirthdays.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={c.profile?.avatar_url} />
                    <AvatarFallback>{(c.profile?.display_name || "?")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{c.profile?.display_name || "Member"}</p>
                    <p className="text-xs text-muted-foreground">
                      {MONTHS[c.birthday_month - 1]} {c.birthday_day}
                    </p>
                  </div>
                  <Cake className="h-4 w-4 text-pink-400" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* My Dates */}
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">My Celebration Dates</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Birthday</Label>
            <div className="flex gap-2">
              <Select value={birthdayMonth} onValueChange={setBirthdayMonth}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Day"
                value={birthdayDay}
                onChange={(e) => setBirthdayDay(e.target.value)}
                min={1}
                max={31}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showBirthday} onCheckedChange={setShowBirthday} />
              <Label className="text-xs text-muted-foreground">Show my birthday to the congregation</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Wedding Anniversary</Label>
            <div className="flex gap-2">
              <Select value={weddingMonth} onValueChange={setWeddingMonth}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Month" /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Day"
                value={weddingDay}
                onChange={(e) => setWeddingDay(e.target.value)}
                min={1}
                max={31}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showAnniversary} onCheckedChange={setShowAnniversary} />
              <Label className="text-xs text-muted-foreground">Show my anniversary to the congregation</Label>
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save Dates
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
