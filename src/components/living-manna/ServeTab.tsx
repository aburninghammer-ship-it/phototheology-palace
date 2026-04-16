import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeartHandshake, HandHeart, Heart, GraduationCap } from "lucide-react";
import { VolunteerHub } from "./serve/VolunteerHub";
import { CareMinistry } from "./serve/CareMinistry";
import { MentorshipHub } from "./serve/MentorshipHub";

interface ServeTabProps {
  churchId: string;
}

export function ServeTab({ churchId }: ServeTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <CardTitle>Serve</CardTitle>
          </div>
          <CardDescription>
            Volunteer for ministries, support those in need, and grow through mentorship
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="volunteer" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="volunteer" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <HandHeart className="h-4 w-4" />
            Volunteer
          </TabsTrigger>
          <TabsTrigger value="care" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Heart className="h-4 w-4" />
            Care Ministry
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
            Mentorship
          </TabsTrigger>
        </TabsList>

        <TabsContent value="volunteer">
          <VolunteerHub churchId={churchId} />
        </TabsContent>

        <TabsContent value="care">
          <CareMinistry churchId={churchId} />
        </TabsContent>

        <TabsContent value="mentorship">
          <MentorshipHub churchId={churchId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
