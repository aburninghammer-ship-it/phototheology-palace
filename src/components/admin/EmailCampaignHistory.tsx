import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, CheckCircle, XCircle, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EmailLog {
  id: string;
  campaign_name: string;
  recipient_email: string;
  recipient_name: string | null;
  email_type: string;
  status: string;
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

interface CampaignSummary {
  campaign_name: string;
  total_sent: number;
  successful: number;
  failed: number;
  pending: number;
  last_sent: string;
}

export function EmailCampaignHistory() {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  useEffect(() => {
    loadEmailHistory();
  }, []);

  const loadEmailHistory = async () => {
    setLoading(true);
    try {
      // Get all email logs
      const { data: logsData, error: logsError } = await supabase
        .from("email_campaign_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (logsError) throw logsError;
      setLogs(logsData || []);

      // Calculate campaign summaries
      const summaryMap = new Map<string, CampaignSummary>();
      
      for (const log of logsData || []) {
        const existing = summaryMap.get(log.campaign_name) || {
          campaign_name: log.campaign_name,
          total_sent: 0,
          successful: 0,
          failed: 0,
          pending: 0,
          last_sent: log.created_at,
        };

        existing.total_sent++;
        if (log.status === "sent") existing.successful++;
        else if (log.status === "failed") existing.failed++;
        else existing.pending++;

        if (new Date(log.created_at) > new Date(existing.last_sent)) {
          existing.last_sent = log.created_at;
        }

        summaryMap.set(log.campaign_name, existing);
      }

      setCampaigns(Array.from(summaryMap.values()).sort((a, b) => 
        new Date(b.last_sent).getTime() - new Date(a.last_sent).getTime()
      ));
    } catch (error) {
      console.error("Error loading email history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (selectedCampaign !== "all" && log.campaign_name !== selectedCampaign) return false;
    if (selectedType !== "all" && log.email_type !== selectedType) return false;
    return true;
  });

  const uniqueTypes = [...new Set(logs.map(l => l.email_type).filter(Boolean))];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Sent</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Campaign History
          </CardTitle>
          <CardDescription>
            {logs.length === 0 
              ? "No emails have been sent yet"
              : `${logs.length} total emails sent across ${campaigns.length} campaigns`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No email campaigns have been run yet. Emails sent through the Pickaxe, Teachable, 
              or other campaign tools will appear here.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.campaign_name} className="bg-muted/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium truncate mb-2">{campaign.campaign_name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-emerald-600 dark:text-emerald-400">{campaign.successful} sent</span>
                      {campaign.failed > 0 && (
                        <span className="text-destructive">{campaign.failed} failed</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last: {format(new Date(campaign.last_sent), "MMM d, yyyy h:mm a")}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Logs */}
      {logs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Email Delivery Log</CardTitle>
            <div className="flex gap-4 mt-4">
              <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by campaign" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {campaigns.map((c) => (
                    <SelectItem key={c.campaign_name} value={c.campaign_name}>
                      {c.campaign_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <p className="font-medium text-sm">{log.recipient_email}</p>
                        {log.recipient_name && (
                          <p className="text-xs text-muted-foreground">{log.recipient_name}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {log.email_type || "campaign"}
                      </Badge>
                      {getStatusBadge(log.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), "MMM d, h:mm a")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
