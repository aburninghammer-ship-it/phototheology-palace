import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, UserPlus, Calendar } from "lucide-react";
import { formatDistanceToNow, format, isToday, isYesterday, startOfDay } from "date-fns";

interface NewSignup {
  id: string;
  display_name: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  payment_source: string | null;
  created_at: string;
}

type TimeRange = "today" | "3" | "7" | "14" | "30";

export function NewSignupsList() {
  const [loading, setLoading] = useState(true);
  const [signups, setSignups] = useState<NewSignup[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("today");
  const [todayCount, setTodayCount] = useState(0);

  const loadNewSignups = async () => {
    setLoading(true);
    try {
      let startDate: Date;
      
      if (timeRange === "today") {
        startDate = startOfDay(new Date());
      } else {
        startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(timeRange));
      }

      // Only show card-verified signups (exclude abandoned accounts with manual/free)
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, subscription_tier, subscription_status, payment_source, created_at")
        .gte("created_at", startDate.toISOString())
        .in("subscription_status", ["active", "trial", "trialing"])
        .not("payment_source", "eq", "manual")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setSignups(data || []);
      
      const today = startOfDay(new Date());
      const todaySignups = (data || []).filter(s => new Date(s.created_at) >= today);
      setTodayCount(todaySignups.length);
    } catch (error) {
      console.error("Error loading new signups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewSignups();
  }, [timeRange]);

  const getStatusBadge = (status: string | null, tier: string | null) => {
    if (status === "active") {
      return <Badge className="bg-green-600 text-white">Active</Badge>;
    }
    if (status === "trial") {
      return <Badge className="bg-blue-600 text-white">Trial</Badge>;
    }
    if (status === "pending" || tier === "free" || tier === "pending") {
      return <Badge variant="outline" className="border-amber-600 text-amber-600">Pending</Badge>;
    }
    if (status === "cancelled") {
      return <Badge variant="outline" className="border-destructive text-destructive">Cancelled</Badge>;
    }
    return <Badge variant="outline">{status || "New"}</Badge>;
  };

  const getTierBadge = (tier: string | null) => {
    const tierColors: Record<string, string> = {
      premium: "bg-purple-600",
      essential: "bg-blue-600",
      student: "bg-orange-600",
      lifetime: "bg-amber-600",
      church: "bg-emerald-600",
    };

    if (!tier || tier === "free" || tier === "pending") {
      return null;
    }

    return (
      <Badge className={`${tierColors[tier] || "bg-muted"} text-white`}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const formatSignupDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
    return format(date, "MMM d 'at' h:mm a");
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "today": return "today";
      case "3": return "last 3 days";
      case "7": return "last 7 days";
      case "14": return "last 14 days";
      case "30": return "last 30 days";
      default: return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              New Signups
              {todayCount > 0 && timeRange !== "today" && (
                <Badge variant="secondary" className="ml-2">
                  {todayCount} today
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              All new user registrations {getTimeRangeLabel()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="3">Last 3 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadNewSignups} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : signups.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No new signups {getTimeRangeLabel()}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-medium text-primary mb-4 flex items-center gap-2">
              <span className="text-2xl font-bold">{signups.length}</span>
              <span>new signup{signups.length !== 1 ? "s" : ""} {getTimeRangeLabel()}</span>
            </div>
            <div className="max-h-[500px] overflow-y-auto space-y-2">
              {signups.map((signup) => (
                <div
                  key={signup.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">
                      {signup.display_name || "Unnamed User"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatSignupDate(signup.created_at)}
                      <span className="ml-2 text-muted-foreground/60">
                        ({formatDistanceToNow(new Date(signup.created_at), { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusBadge(signup.subscription_status, signup.subscription_tier)}
                    {getTierBadge(signup.subscription_tier)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
