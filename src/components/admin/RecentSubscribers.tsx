import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw, UserPlus, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface RecentSubscriber {
  id: string;
  email: string;
  display_name: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  payment_source: string | null;
  created_at: string;
}

type TimeRange = "3" | "7" | "14" | "30";

export function RecentSubscribers() {
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<RecentSubscriber[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("7");

  const loadRecentSubscribers = async () => {
    setLoading(true);
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));

      const { data, error } = await (supabase
        .from("profiles")
        .select("id, display_name, subscription_tier, subscription_status, payment_source, created_at")
        .eq("subscription_status", "active")
        .in("subscription_tier", ["monthly", "annual", "essential", "premium", "student", "lifetime"])
        .gte("created_at", daysAgo.toISOString())
        .order("created_at", { ascending: false }) as any);

      if (error) throw error;
      // Map data to expected interface shape (email is not in profiles table)
      const mappedData = (data || []).map((d: any) => ({
        ...d,
        email: d.display_name || 'N/A'
      }));
      setSubscribers(mappedData);
    } catch (error) {
      console.error("Error loading recent subscribers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentSubscribers();
  }, [timeRange]);

  const getTierColor = (tier: string | null) => {
    switch (tier) {
      case "premium":
        return "bg-purple-500";
      case "essential":
        return "bg-blue-500";
      case "monthly":
        return "bg-green-500";
      case "annual":
        return "bg-emerald-600";
      case "student":
        return "bg-orange-500";
      case "lifetime":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSourceBadge = (source: string | null) => {
    switch (source) {
      case "stripe":
        return <Badge variant="outline" className="text-xs border-indigo-500 text-indigo-600">Stripe</Badge>;
      case "patreon":
        return <Badge variant="outline" className="text-xs border-red-500 text-red-600">Patreon</Badge>;
      case "teachable":
        return <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">Teachable</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-green-500" />
              Recent Paid Subscribers
            </CardTitle>
            <CardDescription>
              New paying customers in the last {timeRange} days
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
              <SelectTrigger className="w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Last 3 days</SelectItem>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={loadRecentSubscribers} disabled={loading}>
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
        ) : subscribers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <UserPlus className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>No new paid subscribers in the last {timeRange} days</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-medium text-green-600 mb-4">
              {subscribers.length} new paid subscriber{subscribers.length !== 1 ? "s" : ""}
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {subscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{sub.email}</div>
                    {sub.display_name && (
                      <div className="text-sm text-muted-foreground truncate">
                        {sub.display_name}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(new Date(sub.created_at), "MMM d, yyyy 'at' h:mm a")}
                      <span className="ml-2 text-muted-foreground/60">
                        ({formatDistanceToNow(new Date(sub.created_at), { addSuffix: true })})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {getSourceBadge(sub.payment_source)}
                    <Badge className={`${getTierColor(sub.subscription_tier)} text-white`}>
                      {sub.subscription_tier || "Unknown"}
                    </Badge>
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
