import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Shield, Video, Calendar, Bell, BarChart3, TrendingUp, Droplets, MapPin } from "lucide-react";
import { LeaderOnboarding } from "./LeaderOnboarding";
import { SermonHub } from "./SermonHub";
import { ChurchEvents } from "./ChurchEvents";
import { PushNotificationSettings } from "./PushNotificationSettings";
import { StudyEngagementAnalytics } from "./StudyEngagementAnalytics";
import { ContentPerformanceAnalytics } from "./ContentPerformanceAnalytics";
import { BaptismTrack } from "./baptism-track/BaptismTrack";
import { ServiceCheckIn } from "./grow/ServiceCheckIn";

interface GrowTabProps {
  churchId: string;
}

export function GrowTab({ churchId }: GrowTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-primary" />
            <CardTitle>Grow & Lead</CardTitle>
          </div>
          <CardDescription>
            Deepen your walk, train for leadership, and access teaching resources
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="baptism" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="baptism" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Droplets className="h-4 w-4" />
            Baptism Track
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="sermons" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Video className="h-4 w-4" />
            Sermons
          </TabsTrigger>
          <TabsTrigger value="leader-training" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4" />
            Leader Training
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="content-analytics" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
            Content Performance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="checkin" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <MapPin className="h-4 w-4" />
            Check-In
          </TabsTrigger>
        </TabsList>

        <TabsContent value="baptism">
          <BaptismTrack churchId={churchId} />
        </TabsContent>

        <TabsContent value="events">
          <ChurchEvents churchId={churchId} />
        </TabsContent>

        <TabsContent value="sermons">
          <SermonHub churchId={churchId} />
        </TabsContent>

        <TabsContent value="leader-training">
          <LeaderOnboarding churchId={churchId} />
        </TabsContent>

        <TabsContent value="analytics">
          <StudyEngagementAnalytics churchId={churchId} />
        </TabsContent>

        <TabsContent value="content-analytics">
          <ContentPerformanceAnalytics churchId={churchId} />
        </TabsContent>

        <TabsContent value="notifications">
          <PushNotificationSettings />
        </TabsContent>

        <TabsContent value="checkin">
          <ServiceCheckIn churchId={churchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
