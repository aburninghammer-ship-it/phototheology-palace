import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRevenueAnalytics } from "@/hooks/useRevenueAnalytics";
import { Loader2, TrendingUp, TrendingDown, DollarSign, Users, RefreshCw, ArrowDownRight, Target, Percent, Clock, AlertTriangle, Calendar, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RevenueDashboard() {
  const { loading, metrics, trialMetrics, pdfMetrics, cohorts, onboardingFunnel, refetch } = useRevenueAnalytics();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!metrics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
          <p className="text-muted-foreground">MRR, Churn, Trial Analytics & Cohort Analysis</p>
        </div>
        <Button variant="outline" onClick={refetch} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Monthly Recurring Revenue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${metrics.mrr.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">ARR: ${metrics.arr.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeSubscribers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ARPU: ${metrics.averageRevenuePerUser.toFixed(2)}/mo
            </p>
          </CardContent>
        </Card>

        <Card className={metrics.churnRate > 5 ? "border-red-500/20 bg-red-500/5" : ""}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              Churn Rate (MTD)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${metrics.churnRate > 5 ? "text-red-500" : ""}`}>
              {metrics.churnRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.churnedThisMonth} churned this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Trial → Paid Rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.conversionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{metrics.newSubscribersThisMonth} new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trial Analytics Section */}
      {trialMetrics && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-blue-500/20 bg-blue-500/5">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active Trials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{trialMetrics.totalTrials}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg age: {trialMetrics.avgTrialAge} days
                </p>
              </CardContent>
            </Card>

            <Card className={trialMetrics.trialsExpiringSoon > 10 ? "border-orange-500/20 bg-orange-500/5" : ""}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Expiring Soon (3 days)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${trialMetrics.trialsExpiringSoon > 10 ? "text-orange-500" : ""}`}>
                  {trialMetrics.trialsExpiringSoon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Need conversion nudge
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-500/20 bg-red-500/5">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Expired (Unconverted)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{trialMetrics.trialsExpiredUnconverted}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lost opportunities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Conversion Potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${((trialMetrics.totalTrials * 0.1) * 12.47).toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Est. MRR at 10% conversion
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Trial Conversion Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Trial Conversion by Day</CardTitle>
              <CardDescription>When do trials convert to paid?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trialMetrics.trialConversionByDay}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="day" 
                      tickFormatter={(d) => `Day ${d}`}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Conversions']}
                      labelFormatter={(label) => `Day ${label} of trial`}
                    />
                    <Bar dataKey="converted" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-muted-foreground text-center">
                Most conversions typically happen on Day 1 (immediate) or Day 13-14 (before expiry)
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* PDF Purchases Section */}
      {pdfMetrics && (
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              PDF Purchases
            </CardTitle>
            <CardDescription>
              One-time product sales (Genesis in 6 Days, Quick-Start Guide, Study Suite)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold text-purple-600">{pdfMetrics.totalPurchases}</div>
                <p className="text-sm text-muted-foreground">Total PDF Sales</p>
              </div>
              <div className="p-4 rounded-lg bg-background border">
                <div className="text-3xl font-bold text-green-600">${pdfMetrics.totalRevenue.toFixed(2)}</div>
                <p className="text-sm text-muted-foreground">Total PDF Revenue</p>
              </div>
            </div>

            {pdfMetrics.purchases.length > 0 && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pdfMetrics.purchases.slice(0, 20).map((purchase) => (
                      <TableRow key={purchase.id}>
                        <TableCell className="font-mono text-sm">
                          {format(new Date(purchase.date), 'MMM d, yyyy h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-purple-600 border-purple-300">
                            {purchase.product}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {purchase.name && <span className="font-medium">{purchase.name}</span>}
                            {purchase.email ? (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {purchase.email}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground italic">Email in Stripe Dashboard</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-medium text-green-600">
                          ${purchase.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {pdfMetrics.purchases.length > 20 && (
                  <div className="p-2 text-center text-sm text-muted-foreground border-t">
                    Showing 20 of {pdfMetrics.purchases.length} purchases
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cohort Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cohort Retention</CardTitle>
          <CardDescription>Users who signed up by month and are still paying</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cohorts.map((cohort) => (
              <div key={cohort.cohortDate} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">{cohort.cohortDate}</div>
                <div className="flex-1">
                  <Progress value={cohort.retentionRate} className="h-2" />
                </div>
                <div className="w-32 text-sm text-muted-foreground text-right">
                  {cohort.stillActive}/{cohort.totalUsers} ({cohort.retentionRate}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Onboarding Funnel</CardTitle>
          <CardDescription>Drop-off at each onboarding step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={onboardingFunnel} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="step" type="category" width={150} />
                <Tooltip 
                  formatter={(value: number) => [value, 'Users']}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {onboardingFunnel.map((step, i) => (
              <div key={step.step} className="text-center p-2 rounded-lg bg-muted/50">
                <div className="text-lg font-bold">{step.count}</div>
                <div className="text-xs text-muted-foreground truncate">{step.step}</div>
                {step.dropoff > 0 && (
                  <Badge variant="destructive" className="mt-1 text-xs">
                    -{step.dropoff}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
