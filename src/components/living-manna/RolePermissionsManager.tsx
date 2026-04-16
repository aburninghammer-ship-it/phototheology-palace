import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Save, Users, Calendar, MessageSquare, BookOpen, Palette, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  role: string;
  permission: string;
}

interface RolePermissionsManagerProps {
  churchId: string;
}

const ALL_PERMISSIONS = [
  { key: "manage_members", label: "Manage Members", icon: Users, description: "Add, remove, and edit member roles" },
  { key: "manage_events", label: "Manage Events", icon: Calendar, description: "Create, edit, and delete events" },
  { key: "manage_announcements", label: "Manage Announcements", icon: MessageSquare, description: "Post and manage announcements" },
  { key: "manage_studies", label: "Manage Studies", icon: BookOpen, description: "Create and manage Bible studies" },
  { key: "manage_branding", label: "Manage Branding", icon: Palette, description: "Customize church branding" },
  { key: "view_analytics", label: "View Analytics", icon: BarChart3, description: "Access engagement analytics" },
  { key: "manage_permissions", label: "Manage Permissions", icon: Shield, description: "Modify role permissions" },
  { key: "create_events", label: "Create Events", icon: Calendar, description: "Create new events" },
  { key: "post_announcements", label: "Post Announcements", icon: MessageSquare, description: "Post announcements" },
  { key: "create_studies", label: "Create Studies", icon: BookOpen, description: "Create Bible studies" },
  { key: "view_events", label: "View Events", icon: Calendar, description: "View church events" },
  { key: "rsvp_events", label: "RSVP to Events", icon: Calendar, description: "RSVP to events" },
  { key: "post_community", label: "Post in Community", icon: MessageSquare, description: "Create community posts" },
  { key: "join_chat", label: "Join Chat Rooms", icon: MessageSquare, description: "Participate in chat rooms" },
  { key: "view_community", label: "View Community", icon: Users, description: "View community content" },
];

const ROLES = ["admin", "leader", "member", "guest"];

const roleColors: Record<string, string> = {
  admin: "bg-red-500/10 text-red-600 border-red-500/30",
  leader: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  member: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  guest: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

export function RolePermissionsManager({ churchId }: RolePermissionsManagerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, Set<string>>>({
    admin: new Set(),
    leader: new Set(),
    member: new Set(),
    guest: new Set(),
  });

  useEffect(() => {
    loadPermissions();
  }, [churchId]);

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("church_permissions")
        .select("*")
        .eq("church_id", churchId);

      if (error) throw error;

      const permMap: Record<string, Set<string>> = {
        admin: new Set(),
        leader: new Set(),
        member: new Set(),
        guest: new Set(),
      };

      (data || []).forEach((p) => {
        if (permMap[p.role]) {
          permMap[p.role].add(p.permission);
        }
      });

      setPermissions(permMap);
    } catch (error: any) {
      toast({
        title: "Error loading permissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePermission = (role: string, permission: string) => {
    setPermissions((prev) => {
      const newPerms = { ...prev };
      const rolePerms = new Set(prev[role]);
      if (rolePerms.has(permission)) {
        rolePerms.delete(permission);
      } else {
        rolePerms.add(permission);
      }
      newPerms[role] = rolePerms;
      return newPerms;
    });
  };

  const savePermissions = async () => {
    setSaving(true);
    try {
      // Delete existing permissions for this church
      await supabase
        .from("church_permissions")
        .delete()
        .eq("church_id", churchId);

      // Insert new permissions
      const inserts: { church_id: string; role: string; permission: string }[] = [];
      Object.entries(permissions).forEach(([role, perms]) => {
        perms.forEach((permission) => {
          inserts.push({ church_id: churchId, role, permission });
        });
      });

      if (inserts.length > 0) {
        const { error } = await supabase
          .from("church_permissions")
          .insert(inserts);

        if (error) throw error;
      }

      toast({
        title: "Permissions saved",
        description: "Role permissions have been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving permissions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Role Permissions</CardTitle>
          </div>
          <CardDescription>Configure what each role can do in your church space</CardDescription>
        </CardHeader>
      </Card>

      {/* Permission Matrix */}
      <Card variant="glass">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-4 text-left font-medium">Permission</th>
                  {ROLES.map((role) => (
                    <th key={role} className="p-4 text-center">
                      <Badge variant="outline" className={roleColors[role]}>
                        {role}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_PERMISSIONS.map((perm) => {
                  const Icon = perm.icon;
                  return (
                    <tr key={perm.key} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-sm">{perm.label}</div>
                            <div className="text-xs text-muted-foreground">{perm.description}</div>
                          </div>
                        </div>
                      </td>
                      {ROLES.map((role) => (
                        <td key={role} className="p-4 text-center">
                          <Switch
                            checked={permissions[role]?.has(perm.key) || false}
                            onCheckedChange={() => togglePermission(role, perm.key)}
                            disabled={role === "admin" && perm.key === "manage_permissions"}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button onClick={savePermissions} disabled={saving} className="w-full">
        <Save className="h-4 w-4 mr-2" />
        {saving ? "Saving..." : "Save Permissions"}
      </Button>
    </div>
  );
}
