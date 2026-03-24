import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Search, Download, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface UserWithSubscription {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  created_at: string | null;
  last_seen: string | null;
  subscription_status: string | null;
  subscription_tier: string | null;
  payment_source: string | null;
  has_lifetime_access: boolean;
  stripe_customer_id: string | null;
  trial_ends_at: string | null;
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [stripeActiveCount, setStripeActiveCount] = useState<number | null>(null);
  const pageSize = 50;

  useEffect(() => {
    loadUsers();
    loadStripeStats();
  }, []);

  const loadStripeStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-subscriber-stats');
      if (!error && data?.stripe?.active_subscriptions) {
        setStripeActiveCount(data.stripe.active_subscriptions);
      }
    } catch (e) {
      console.error("Error loading Stripe stats:", e);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Use user_subscriptions as the source of truth for subscription data
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from("user_subscriptions")
        .select(`
          user_id,
          subscription_status,
          subscription_tier,
          payment_source,
          stripe_customer_id,
          trial_ends_at,
          has_lifetime_access,
          created_at,
          updated_at
        `)
        .order("created_at", { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      // Get profiles for additional metadata (username, display_name, last_seen)
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, username, display_name, last_seen, created_at");

      // Create a map of user_id to profile data
      const profileMap = new Map();
      profilesData?.forEach(profile => {
        profileMap.set(profile.id, profile);
      });

      // Get active Patreon connections to properly identify Patreon users
      const { data: patreonConnectionsData } = await supabase
        .from("patreon_connections")
        .select("user_id, is_active_patron, entitled_cents");

      // Create a map of user_id to Patreon connection status
      const patreonMap = new Map<string, { isActive: boolean; entitledCents: number }>();
      patreonConnectionsData?.forEach(conn => {
        patreonMap.set(conn.user_id, {
          isActive: conn.is_active_patron || false,
          entitledCents: conn.entitled_cents || 0
        });
      });

      // Get user emails via edge function
      const { data: emailsData, error: emailsError } = await supabase.functions.invoke('get-user-emails');
      
      const emailMap = new Map<string, string>();
      if (!emailsError && emailsData?.users) {
        emailsData.users.forEach((u: { id: string; email: string }) => {
          emailMap.set(u.id, u.email);
        });
      }

      // Build users list from user_subscriptions (source of truth)
      const mergedUsers: UserWithSubscription[] = (subscriptionsData || []).map(sub => {
        const profile = profileMap.get(sub.user_id);
        const patreonConn = patreonMap.get(sub.user_id);
        
        // Determine payment source - prioritize Patreon if user has active connection
        let paymentSource = sub.payment_source;
        if (patreonConn?.isActive && patreonConn.entitledCents > 0) {
          paymentSource = 'patreon';
        }
        
        return {
          id: sub.user_id,
          email: emailMap.get(sub.user_id) || 'N/A',
          username: profile?.username || 'N/A',
          display_name: profile?.display_name,
          created_at: profile?.created_at || sub.created_at,
          last_seen: profile?.last_seen,
          subscription_status: sub.subscription_status,
          subscription_tier: sub.subscription_tier,
          payment_source: paymentSource,
          has_lifetime_access: sub.has_lifetime_access || false,
          stripe_customer_id: sub.stripe_customer_id,
          trial_ends_at: sub.trial_ends_at,
        };
      });

      setUsers(mergedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        searchTerm === "" ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.display_name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === "all" ||
        (statusFilter === "active" && user.subscription_status === "active") ||
        (statusFilter === "trial" && user.subscription_status === "trial") ||
        (statusFilter === "canceled" && user.subscription_status === "canceled") ||
        (statusFilter === "lifetime" && user.has_lifetime_access) ||
        (statusFilter === "none" && !user.subscription_status && !user.has_lifetime_access);

      const matchesTier = 
        tierFilter === "all" ||
        user.subscription_tier === tierFilter;

      const matchesSource = 
        sourceFilter === "all" ||
        user.payment_source === sourceFilter;

      return matchesSearch && matchesStatus && matchesTier && matchesSource;
    });
  }, [users, searchTerm, statusFilter, tierFilter, sourceFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Stats
  const stats = useMemo(() => {
    const active = users.filter(u => u.subscription_status === "active").length;
    const trial = users.filter(u => u.subscription_status === "trial").length;
    const lifetime = users.filter(u => u.has_lifetime_access).length;
    const stripe = users.filter(u => u.payment_source === "stripe").length;
    const patreon = users.filter(u => u.payment_source === "patreon").length;
    return { active, trial, lifetime, stripe, patreon, total: users.length };
  }, [users]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Email", "Username", "Display Name", "Status", "Tier", "Payment Source", "Lifetime", "Created At", "Last Seen"];
    const rows = filteredUsers.map(user => [
      user.email,
      user.username,
      user.display_name || "",
      user.subscription_status || "none",
      user.subscription_tier || "none",
      user.payment_source || "none",
      user.has_lifetime_access ? "Yes" : "No",
      user.created_at ? format(new Date(user.created_at), "yyyy-MM-dd") : "",
      user.last_seen ? format(new Date(user.last_seen), "yyyy-MM-dd HH:mm") : "Never",
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (user: UserWithSubscription) => {
    if (user.has_lifetime_access) {
      return <Badge className="bg-purple-500">Lifetime</Badge>;
    }
    switch (user.subscription_status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "trial":
        return <Badge className="bg-blue-500">Trial</Badge>;
      case "canceled":
        return <Badge variant="destructive">Canceled</Badge>;
      default:
        return <Badge variant="outline">None</Badge>;
    }
  };

  const getTierBadge = (tier: string | null) => {
    if (!tier) return null;
    const colors: Record<string, string> = {
      essential: "bg-amber-500",
      premium: "bg-primary",
      student: "bg-cyan-500",
    };
    return <Badge className={colors[tier] || "bg-muted"}>{tier}</Badge>;
  };

  const getSourceBadge = (source: string | null) => {
    if (!source) return null;
    const colors: Record<string, string> = {
      stripe: "bg-indigo-500",
      patreon: "bg-orange-500",
      pickaxe: "bg-purple-500",
    };
    return <Badge variant="outline" className={`border-2 ${colors[source] ? `border-${colors[source].replace('bg-', '')}` : ''}`}>{source}</Badge>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-green-500/50">
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stripeActiveCount ?? stats.active}</div>
          </CardContent>
        </Card>
        <Card className="border-blue-500/50">
          <CardHeader className="pb-2">
            <CardDescription>Trial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.trial}</div>
          </CardContent>
        </Card>
        <Card className="border-purple-500/50">
          <CardHeader className="pb-2">
            <CardDescription>Lifetime</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.lifetime}</div>
          </CardContent>
        </Card>
        <Card className="border-indigo-500/50">
          <CardHeader className="pb-2">
            <CardDescription>Stripe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{stripeActiveCount ?? stats.stripe}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-500/50">
          <CardHeader className="pb-2">
            <CardDescription>Patreon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.patreon}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>
            Showing {filteredUsers.length} of {users.length} users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, username, or name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="lifetime">Lifetime</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
                <SelectItem value="none">No Subscription</SelectItem>
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={(v) => { setTierFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="essential">Essential</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={(v) => { setSourceFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="patreon">Patreon</SelectItem>
                <SelectItem value="pickaxe">Pickaxe</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={loadUsers}>
              Refresh
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium max-w-[200px] truncate" title={user.email}>
                      {user.email}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={user.display_name || user.username}>
                      {user.display_name || user.username}
                    </TableCell>
                    <TableCell>{getStatusBadge(user)}</TableCell>
                    <TableCell>{getTierBadge(user.subscription_tier)}</TableCell>
                    <TableCell>{getSourceBadge(user.payment_source)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.created_at ? format(new Date(user.created_at), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {user.last_seen ? format(new Date(user.last_seen), "MMM d, HH:mm") : "Never"}
                    </TableCell>
                  </TableRow>
                ))}
                {paginatedUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No users found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
