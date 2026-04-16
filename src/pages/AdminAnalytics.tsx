import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { Loader2, Eye, MessageSquare, Users, TrendingUp, RefreshCw, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from "date-fns";
import { DonationStats } from "@/components/admin/DonationStats";

const AdminAnalytics = () => {
  const {
    isAdmin,
    loading,
    pageViewStats,
    recentJeevesQueries,
    dailyActivity,
    totalPageViews,
    totalJeevesQueries,
    uniqueUsers,
    liveUsersCount,
    refetch,
  } = useAdminAnalytics();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto p-6">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
              <p className="text-muted-foreground">You don't have permission to view this page.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Analytics</h1>
            <p className="text-muted-foreground">Track user activity and Jeeves usage</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Live Users - Prominent Display */}
        <Card className="border-green-500/50 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/20 animate-pulse">
                <Radio className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-4xl font-bold text-green-600">{liveUsersCount}</p>
                <p className="text-sm text-muted-foreground">Users Online Right Now</p>
              </div>
            </div>
            <Badge variant="outline" className="gap-1 text-green-600 border-green-500/50">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live
            </Badge>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPageViews}</p>
                <p className="text-xs text-muted-foreground">Page Views (30d)</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <MessageSquare className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalJeevesQueries}</p>
                <p className="text-xs text-muted-foreground">Jeeves Queries</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueUsers}</p>
                <p className="text-xs text-muted-foreground">Unique Pages</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pageViewStats.length}</p>
                <p className="text-xs text-muted-foreground">Active Pages</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Daily Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Activity (Last 14 Days)</CardTitle>
              <CardDescription>Page views and Jeeves queries over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyActivity}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="page_views" 
                      stackId="1"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      name="Page Views"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="jeeves_queries" 
                      stackId="2"
                      stroke="#8b5cf6" 
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      name="Jeeves Queries"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageViewStats.slice(0, 8)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis 
                      type="category" 
                      dataKey="page_path" 
                      width={100}
                      className="text-xs"
                      tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Donations */}
        <DonationStats />

        {/* Recent Jeeves Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jeeves Questions</CardTitle>
            <CardDescription>See what users are asking Jeeves</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {recentJeevesQueries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No Jeeves queries tracked yet. They will appear here once users start interacting.
                  </p>
                ) : (
                  recentJeevesQueries.map((query) => (
                    <div key={query.id} className="p-3 rounded-lg border bg-card/50 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm line-clamp-2">{query.question}</p>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          {query.feature_used}
                        </Badge>
                      </div>
                      {query.page_context && (
                        <p className="text-xs text-muted-foreground">
                          Page: {query.page_context}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(query.created_at), 'MMM dd, yyyy h:mm a')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* All Pages Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Page Views</CardTitle>
            <CardDescription>Complete breakdown of page visits</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-1">
                {pageViewStats.map((stat, idx) => (
                  <div key={stat.page_path} className="flex items-center justify-between py-2 px-3 rounded hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground text-sm w-6">{idx + 1}.</span>
                      <span className="text-sm font-mono">{stat.page_path}</span>
                    </div>
                    <Badge variant="outline">{stat.count} views</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
