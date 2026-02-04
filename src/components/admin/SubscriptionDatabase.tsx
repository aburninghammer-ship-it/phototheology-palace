import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  RefreshCw,
  Search,
  Download,
  Users,
  DollarSign,
  Calendar,
  Crown,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Subscriber {
  id: string;
  email: string;
  displayName: string | null;
  signupDate: string;
  subscriptionTier: string | null;
  subscriptionStatus: string | null;
  paymentSource: string | null;
  amount: number | null;
  patreonConnected: boolean;
  stripeCustomerId: string | null;
}

export function SubscriptionDatabase() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"signupDate" | "amount" | "displayName">("signupDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const [stats, setStats] = useState({
    total: 0,
    premium: 0,
    essential: 0,
    trial: 0,
    totalMRR: 0,
  });

  useEffect(() => {
    loadSubscribers();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [subscribers, searchTerm, tierFilter, sourceFilter, statusFilter, sortField, sortOrder]);

  const loadSubscribers = async () => {
    setLoading(true);
    try {
      // Get all users with their profiles and subscriptions
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select(`
          id,
          display_name,
          subscription_tier,
          subscription_status,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (profileError) throw profileError;

      // Get user subscriptions for more detailed info
      const { data: subscriptions, error: subError } = await supabase
        .from("user_subscriptions")
        .select("*");

      if (subError) console.error("Subscriptions error:", subError);

      // Get Patreon connections
      const { data: patreonConns, error: patreonError } = await supabase
        .from("patreon_connections")
        .select("user_id, entitled_cents, is_active_patron");

      if (patreonError) console.error("Patreon error:", patreonError);

      // Get user emails from auth (via edge function)
      const { data: authData, error: authError } = await supabase.functions.invoke("get-user-emails", {
        body: { userIds: profiles?.map(p => p.id) || [] }
      });

      const emailMap = new Map<string, string>();
      if (authData?.users) {
        authData.users.forEach((u: { id: string; email: string }) => {
          emailMap.set(u.id, u.email);
        });
      }

      // Build subscription map
      const subMap = new Map();
      subscriptions?.forEach(s => {
        subMap.set(s.user_id, s);
      });

      // Build Patreon map
      const patreonMap = new Map();
      patreonConns?.forEach(p => {
        patreonMap.set(p.user_id, p);
      });

      // Combine data
      const combinedData: Subscriber[] = (profiles || []).map(profile => {
        const sub = subMap.get(profile.id);
        const patreon = patreonMap.get(profile.id);

        // Determine amount and payment source
        let amount = 0;
        let paymentSource = sub?.payment_source || null;
        const tier = sub?.subscription_tier || profile.subscription_tier;
        const status = sub?.subscription_status || profile.subscription_status;
        const isActive = status === "active" || status === "trialing";

        if (patreon?.is_active_patron && patreon?.entitled_cents) {
          // Patreon user
          amount = patreon.entitled_cents / 100;
          if (!paymentSource) paymentSource = "patreon";
        } else if (paymentSource === "stripe" || (isActive && sub?.stripe_subscription_id)) {
          // Stripe user - estimate based on tier
          if (tier === "premium") amount = 15;
          else if (tier === "essential") amount = 9;
          else if (tier === "student") amount = 5;
          paymentSource = "stripe";
        } else if (isActive && tier && tier !== "free") {
          // Active premium/essential user without explicit source - likely Stripe
          if (tier === "premium") amount = 15;
          else if (tier === "essential") amount = 9;
          else if (tier === "student") amount = 5;
          // Only set source if we can confirm it
          if (sub?.stripe_customer_id) paymentSource = "stripe";
        }

        return {
          id: profile.id,
          email: emailMap.get(profile.id) || "Unknown",
          displayName: profile.display_name,
          signupDate: profile.created_at,
          subscriptionTier: sub?.subscription_tier || profile.subscription_tier,
          subscriptionStatus: sub?.subscription_status || profile.subscription_status,
          paymentSource,
          amount,
          patreonConnected: !!patreon,
          stripeCustomerId: sub?.stripe_customer_id || null,
        };
      });

      setSubscribers(combinedData);

      // Calculate stats
      const premium = combinedData.filter(s => s.subscriptionTier === "premium").length;
      const essential = combinedData.filter(s => s.subscriptionTier === "essential").length;
      const trial = combinedData.filter(s => s.subscriptionStatus === "trialing").length;
      const totalMRR = combinedData.reduce((sum, s) => {
        if (s.subscriptionStatus === "active" && s.amount) {
          return sum + s.amount;
        }
        return sum;
      }, 0);

      setStats({
        total: combinedData.length,
        premium,
        essential,
        trial,
        totalMRR,
      });

    } catch (error: any) {
      console.error("Load error:", error);
      toast({
        title: "Failed to load subscribers",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSort = () => {
    let filtered = [...subscribers];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.email.toLowerCase().includes(term) ||
        s.displayName?.toLowerCase().includes(term)
      );
    }

    // Tier filter
    if (tierFilter !== "all") {
      filtered = filtered.filter(s => s.subscriptionTier === tierFilter);
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(s => s.paymentSource === sourceFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(s => s.subscriptionStatus === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      if (sortField === "signupDate") {
        aVal = new Date(a.signupDate).getTime();
        bVal = new Date(b.signupDate).getTime();
      } else if (sortField === "amount") {
        aVal = a.amount || 0;
        bVal = b.amount || 0;
      } else if (sortField === "displayName") {
        aVal = a.displayName?.toLowerCase() || a.email.toLowerCase();
        bVal = b.displayName?.toLowerCase() || b.email.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredSubscribers(filtered);
    setPage(1);
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Signup Date", "Tier", "Status", "Source", "Amount"];
    const rows = filteredSubscribers.map(s => [
      s.displayName || "",
      s.email,
      format(new Date(s.signupDate), "yyyy-MM-dd"),
      s.subscriptionTier || "free",
      s.subscriptionStatus || "none",
      s.paymentSource || "none",
      s.amount?.toFixed(2) || "0.00",
    ]);

    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Exported", description: `${filteredSubscribers.length} subscribers exported to CSV` });
  };

  const paginatedSubscribers = filteredSubscribers.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredSubscribers.length / pageSize);

  const getTierBadge = (tier: string | null) => {
    switch (tier) {
      case "premium":
        return <Badge className="bg-purple-600">Premium</Badge>;
      case "essential":
        return <Badge className="bg-blue-600">Essential</Badge>;
      case "student":
        return <Badge className="bg-green-600">Student</Badge>;
      case "lifetime":
        return <Badge className="bg-amber-600">Lifetime</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "active":
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>;
      case "trialing":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Trial</Badge>;
      case "canceled":
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Canceled</Badge>;
      case "past_due":
        return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Past Due</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  const getSourceIcon = (source: string | null) => {
    switch (source) {
      case "patreon":
        return <Crown className="h-4 w-4 text-orange-500" />;
      case "stripe":
        return <CreditCard className="h-4 w-4 text-purple-500" />;
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
              <Users className="h-5 w-5" />
              Subscription Database
            </CardTitle>
            <CardDescription>
              All users with subscription details
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadSubscribers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="p-3 bg-muted rounded-lg text-center">
            <p className="text-2xl font-bold">{stats.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.premium}</p>
            <p className="text-xs text-muted-foreground">Premium</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.essential}</p>
            <p className="text-xs text-muted-foreground">Essential</p>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{stats.trial}</p>
            <p className="text-xs text-muted-foreground">Trialing</p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-600">${stats.totalMRR.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Est. MRR</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="essential">Essential</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="lifetime">Lifetime</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="patreon">Patreon</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={`${sortField}-${sortOrder}`} onValueChange={(v) => {
            const [field, order] = v.split("-") as [typeof sortField, typeof sortOrder];
            setSortField(field);
            setSortOrder(order);
          }}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="signupDate-desc">Newest First</SelectItem>
              <SelectItem value="signupDate-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
              <SelectItem value="displayName-asc">Name A-Z</SelectItem>
              <SelectItem value="displayName-desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {paginatedSubscribers.length} of {filteredSubscribers.length} subscribers
        </p>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Signup Date</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">
                      {subscriber.displayName || <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-sm">{subscriber.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(subscriber.signupDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{getTierBadge(subscriber.subscriptionTier)}</TableCell>
                    <TableCell>{getStatusBadge(subscriber.subscriptionStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getSourceIcon(subscriber.paymentSource)}
                        <span className="text-sm capitalize">{subscriber.paymentSource || "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {subscriber.amount ? `$${subscriber.amount.toFixed(2)}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedSubscribers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No subscribers found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
