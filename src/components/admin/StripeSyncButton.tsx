import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SyncResult {
  total: number;
  synced: number;
  skipped: number;
  errors: number;
  details: Array<{
    email?: string;
    subscriptionId: string;
    tier?: string;
    status: string;
    reason?: string;
    error?: string;
  }>;
}

export function StripeSyncButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);

  const runSync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('sync-stripe-subscriptions');
      
      if (error) throw error;
      
      setResult(data);
      toast.success(`Synced ${data.synced} subscriptions from Stripe`);
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Failed to sync: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-500" />
          Stripe Subscription Sync
        </CardTitle>
        <CardDescription>
          Fetch all active subscriptions from Stripe and sync to database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runSync} disabled={loading} className="w-full">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing from Stripe...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync All Stripe Subscriptions
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2 bg-muted rounded">
                <div className="text-2xl font-bold">{result.total}</div>
                <div className="text-xs text-muted-foreground">Total in Stripe</div>
              </div>
              <div className="p-2 bg-green-500/10 rounded">
                <div className="text-2xl font-bold text-green-600">{result.synced}</div>
                <div className="text-xs text-muted-foreground">Synced</div>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded">
                <div className="text-2xl font-bold text-yellow-600">{result.skipped}</div>
                <div className="text-xs text-muted-foreground">Skipped</div>
              </div>
              <div className="p-2 bg-red-500/10 rounded">
                <div className="text-2xl font-bold text-red-600">{result.errors}</div>
                <div className="text-xs text-muted-foreground">Errors</div>
              </div>
            </div>

            {result.details.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-1 text-sm">
                {result.details.slice(0, 20).map((d, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5 bg-muted/50 rounded text-xs">
                    {d.status === 'synced' && <CheckCircle className="h-3 w-3 text-green-500" />}
                    {d.status === 'skipped' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                    {d.status === 'error' && <XCircle className="h-3 w-3 text-red-500" />}
                    <span className="truncate flex-1">{d.email || d.subscriptionId}</span>
                    {d.tier && <Badge variant="outline" className="text-xs">{d.tier}</Badge>}
                    {d.reason && <span className="text-muted-foreground">{d.reason}</span>}
                  </div>
                ))}
                {result.details.length > 20 && (
                  <div className="text-xs text-muted-foreground text-center">
                    +{result.details.length - 20} more...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
