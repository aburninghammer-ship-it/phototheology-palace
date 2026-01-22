import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Shield, Video, Settings } from "lucide-react";
import { LeaderOnboarding } from "./LeaderOnboarding";
import { SermonHub } from "./SermonHub";
import { PushNotificationSettings } from "./PushNotificationSettings";

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

      <Tabs defaultValue="sermons" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="sermons" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Video className="h-4 w-4" />
            Sermons
          </TabsTrigger>
          <TabsTrigger value="leader-training" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Shield className="h-4 w-4" />
            Leader Training
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sermons">
          <SermonHub churchId={churchId} />
        </TabsContent>

        <TabsContent value="leader-training">
          <LeaderOnboarding churchId={churchId} />
        </TabsContent>

        <TabsContent value="settings">
          <div className="space-y-6">
            <PushNotificationSettings />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
