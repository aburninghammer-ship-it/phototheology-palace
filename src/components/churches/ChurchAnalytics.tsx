import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, Star, BookOpen, TrendingUp, UserCheck, Droplets } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StudyEngagementAnalytics } from "@/components/living-manna/StudyEngagementAnalytics";
import { BibleWorkerAnalytics } from "./BibleWorkerAnalytics";

interface ChurchAnalyticsProps {
  churchId: string;
  hasTier3Access: boolean;
}

interface MetricCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  subValue?: string;
  progress?: number;
}

function MetricCard({ title, description, icon, value, subValue, progress }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-muted-foreground">{value}</div>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        {progress !== undefined && (
          <Progress value={progress} className="mt-2 h-1" />
        )}
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}

export function ChurchAnalytics({ churchId, hasTier3Access }: ChurchAnalyticsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Church Analytics</h2>
        <p className="text-muted-foreground">Track engagement, identify emerging leaders, and monitor baptism pipeline</p>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="engagement" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
            Engagement
          </TabsTrigger>
          <TabsTrigger value="bible-workers" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Droplets className="h-4 w-4" />
            Bible Workers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          {/* Member Engagement */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Member Engagement
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Active Members"
                description="Members active in the last 7 days"
                icon={<UserCheck className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
                progress={0}
              />
              <MetricCard
                title="Weekly Logins"
                description="Average logins per member"
                icon={<TrendingUp className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
              />
              <MetricCard
                title="Retention Rate"
                description="Members returning weekly"
                icon={<Users className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
                progress={0}
              />
            </div>
          </div>

          {/* Campaign Participation */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Participation
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Active Campaigns"
                description="Currently running campaigns"
                icon={<Target className="h-4 w-4" />}
                value="--"
                subValue="No campaigns yet"
              />
              <MetricCard
                title="Participation Rate"
                description="Members engaging with campaigns"
                icon={<Users className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
                progress={0}
              />
              <MetricCard
                title="Completion Rate"
                description="Campaign challenges completed"
                icon={<TrendingUp className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
                progress={0}
              />
            </div>
          </div>

          {/* Emerging Leaders */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5" />
              Emerging Teachers & Evangelists
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title="Top Contributors"
                description="Most active in discussions"
                icon={<Star className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
              />
              <MetricCard
                title="Study Leaders"
                description="Members leading studies"
                icon={<BookOpen className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
              />
              <MetricCard
                title="Mentorship Activity"
                description="Active mentor-mentee pairs"
                icon={<Users className="h-4 w-4" />}
                value="--"
                subValue="No data yet"
              />
            </div>
          </div>

          {/* Study Engagement Analytics */}
          <StudyEngagementAnalytics churchId={churchId} />

          {/* Ministry Readiness - Tier 3 only */}
          {hasTier3Access && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Ministry Readiness Indicators
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  title="Ready for Ministry"
                  description="Members meeting readiness criteria"
                  icon={<UserCheck className="h-4 w-4" />}
                  value="--"
                  subValue="No data yet"
                />
                <MetricCard
                  title="Training Progress"
                  description="Avg. training completion"
                  icon={<TrendingUp className="h-4 w-4" />}
                  value="--"
                  subValue="No data yet"
                  progress={0}
                />
                <MetricCard
                  title="Ministry Assignments"
                  description="Active ministry roles filled"
                  icon={<Target className="h-4 w-4" />}
                  value="--"
                  subValue="No data yet"
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bible-workers">
          <BibleWorkerAnalytics churchId={churchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
