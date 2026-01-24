import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Video, Shield, UserCog } from "lucide-react";
import { ChurchBrandingSettings } from "./ChurchBrandingSettings";
import { LivestreamManager } from "./LivestreamManager";
import { RolePermissionsManager } from "./RolePermissionsManager";
import { EnhancedProfileEditor } from "./EnhancedProfileEditor";
import { useChurchMembership } from "@/hooks/useChurchMembership";

interface ChurchAdminTabProps {
  churchId: string;
}

export function ChurchAdminTab({ churchId }: ChurchAdminTabProps) {
  const { role } = useChurchMembership();
  const isAdmin = role === "admin";
  const isLeaderOrAdmin = role === "admin" || role === "leader";

  if (!isLeaderOrAdmin) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>
            You need leader or admin permissions to access church administration settings.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <CardTitle>Church Administration</CardTitle>
          </div>
          <CardDescription>
            Manage church branding, livestreams, permissions, and member profiles
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="branding" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="livestream" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Video className="h-4 w-4" />
            Livestream
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="permissions" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4" />
              Permissions
            </TabsTrigger>
          )}
          <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <UserCog className="h-4 w-4" />
            My Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <ChurchBrandingSettings churchId={churchId} />
        </TabsContent>

        <TabsContent value="livestream">
          <LivestreamManager churchId={churchId} />
        </TabsContent>

        {isAdmin && (
          <TabsContent value="permissions">
            <RolePermissionsManager churchId={churchId} />
          </TabsContent>
        )}

        <TabsContent value="profile">
          <EnhancedProfileEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
}
