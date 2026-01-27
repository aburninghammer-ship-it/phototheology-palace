import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Heart, RefreshCw, DollarSign, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface DonationData {
  totalDonations: number;
  totalRevenue: number;
  byAmount: Array<{ amount: number; count: number; total: number }>;
  recentDonations: Array<{
    id: string;
    amount: number;
    email: string;
    created: string;
  }>;
  generatedAt: string;
}

export function DonationStats() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<DonationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = async () => {
    setRefreshing(true);
    try {
      const { data: result, error: fetchError } = await supabase.functions.invoke(
        "get-donation-stats"
      );

      if (fetchError) throw fetchError;
      setData(result);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching donation stats:", err);
      setError(err.message || "Failed to load donation stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive text-sm">{error}</p>
          <Button onClick={fetchDonations} variant="outline" size="sm" className="mt-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-lg">Donations Received</CardTitle>
          </div>
          <Button
            onClick={fetchDonations}
            variant="ghost"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>
          Support from the community • Last updated:{" "}
          {data.generatedAt ? format(new Date(data.generatedAt), "MMM dd, h:mm a") : "N/A"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-card border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              ${data.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-card border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs">Total Donations</span>
            </div>
            <p className="text-2xl font-bold">{data.totalDonations}</p>
          </div>
        </div>

        {/* By Amount Breakdown */}
        {data.byAmount.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">By Amount</p>
            <div className="flex flex-wrap gap-2">
              {data.byAmount
                .sort((a, b) => b.amount - a.amount)
                .map((item) => (
                  <Badge
                    key={item.amount}
                    variant="outline"
                    className="text-xs"
                  >
                    ${item.amount} × {item.count} = ${item.total.toFixed(2)}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Recent Donations */}
        {data.recentDonations.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Recent Donations</p>
            <ScrollArea className="h-[150px]">
              <div className="space-y-2">
                {data.recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-card/50 border text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3 text-primary" />
                      <span className="text-muted-foreground">{donation.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">
                        ${donation.amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(donation.created), "MMM dd")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {data.totalDonations === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No donations recorded yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
