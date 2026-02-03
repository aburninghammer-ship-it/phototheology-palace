import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Search,
  Link2,
  Loader2,
  Check,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppUser {
  id: string;
  email: string;
  displayName: string | null;
  subscriptionTier: string | null;
  patreonConnected: boolean;
  patreonEmail: string | null;
  isActivePatron: boolean | null;
  entitledCents: number | null;
}

interface PatreonMember {
  id: string;
  email: string;
  full_name: string | null;
  patron_status: string;
  pledge_cents: number | null;
  patreon_user_id: string | null;
}

interface UnlinkedStats {
  totalActivePatrons: number;
  notInApp: number;
  inAppNotConnected: number;
}

export function PatreonManualLink() {
  const { toast } = useToast();

  // Search state
  const [appEmail, setAppEmail] = useState("");
  const [patreonEmail, setPatreonEmail] = useState("");
  const [searchingApp, setSearchingApp] = useState(false);
  const [searchingPatreon, setSearchingPatreon] = useState(false);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [patreonMembers, setPatreonMembers] = useState<PatreonMember[]>([]);

  // Selection state
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [selectedPatreon, setSelectedPatreon] = useState<PatreonMember | null>(null);
  const [linking, setLinking] = useState(false);

  // Unlinked members state
  const [loadingUnlinked, setLoadingUnlinked] = useState(false);
  const [unlinkedStats, setUnlinkedStats] = useState<UnlinkedStats | null>(null);
  const [notInApp, setNotInApp] = useState<PatreonMember[]>([]);
  const [inAppNotConnected, setInAppNotConnected] = useState<PatreonMember[]>([]);

  const searchAppUsers = async () => {
    if (!appEmail.trim()) return;
    setSearchingApp(true);
    setAppUsers([]);
    setSelectedUser(null);

    try {
      const { data, error } = await supabase.functions.invoke("admin-link-patreon", {
        body: { action: "search_app_user", appEmail: appEmail.trim() }
      });

      if (error) throw error;
      setAppUsers(data.users || []);

      if (data.users?.length === 0) {
        toast({ title: "No users found", description: "Try a different email" });
      }
    } catch (err: any) {
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setSearchingApp(false);
    }
  };

  const searchPatreonMembers = async () => {
    if (!patreonEmail.trim()) return;
    setSearchingPatreon(true);
    setPatreonMembers([]);
    setSelectedPatreon(null);

    try {
      const { data, error } = await supabase.functions.invoke("admin-link-patreon", {
        body: { action: "search_patreon_member", patreonEmail: patreonEmail.trim() }
      });

      if (error) throw error;
      setPatreonMembers(data.members || []);

      if (data.members?.length === 0) {
        toast({ title: "No Patreon members found", description: "Try a different email" });
      }
    } catch (err: any) {
      toast({ title: "Search failed", description: err.message, variant: "destructive" });
    } finally {
      setSearchingPatreon(false);
    }
  };

  const linkAccounts = async () => {
    if (!selectedUser || !selectedPatreon) return;
    setLinking(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-link-patreon", {
        body: {
          action: "link",
          userId: selectedUser.id,
          patreonMemberId: selectedPatreon.id
        }
      });

      if (error) throw error;

      toast({
        title: "Accounts Linked!",
        description: data.message,
      });

      // Reset selections
      setSelectedUser(null);
      setSelectedPatreon(null);
      setAppUsers([]);
      setPatreonMembers([]);
      setAppEmail("");
      setPatreonEmail("");
    } catch (err: any) {
      toast({ title: "Link failed", description: err.message, variant: "destructive" });
    } finally {
      setLinking(false);
    }
  };

  const loadUnlinkedMembers = async () => {
    setLoadingUnlinked(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-link-patreon", {
        body: { action: "get_unlinked" }
      });

      if (error) throw error;

      setUnlinkedStats(data.stats);
      setNotInApp(data.notInApp || []);
      setInAppNotConnected(data.inAppNotConnected || []);
    } catch (err: any) {
      toast({ title: "Failed to load", description: err.message, variant: "destructive" });
    } finally {
      setLoadingUnlinked(false);
    }
  };

  const quickLinkByEmail = async (patreonMember: PatreonMember) => {
    // Search for app user with same email
    setSearchingApp(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-link-patreon", {
        body: { action: "search_app_user", appEmail: patreonMember.email }
      });

      if (error) throw error;

      const exactMatch = data.users?.find(
        (u: AppUser) => u.email.toLowerCase() === patreonMember.email.toLowerCase()
      );

      if (exactMatch) {
        // Auto-link
        const { data: linkData, error: linkError } = await supabase.functions.invoke("admin-link-patreon", {
          body: {
            action: "link",
            userId: exactMatch.id,
            patreonMemberId: patreonMember.id
          }
        });

        if (linkError) throw linkError;

        toast({
          title: "Linked!",
          description: `${patreonMember.email} - ${linkData.message}`,
        });

        // Refresh the list
        loadUnlinkedMembers();
      } else {
        toast({
          title: "No exact match",
          description: `No app user found with email ${patreonMember.email}`,
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({ title: "Link failed", description: err.message, variant: "destructive" });
    } finally {
      setSearchingApp(false);
    }
  };

  const formatPledge = (cents: number | null) => {
    if (!cents) return "$0";
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-orange-500" />
          Manual Patreon Linking
        </CardTitle>
        <CardDescription>
          Link Patreon accounts to app users when automatic connection fails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="manual">Manual Link</TabsTrigger>
            <TabsTrigger value="unlinked">Unlinked Members</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-6">
            {/* Step 1: Search App User */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Step 1: Find App User</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by app email..."
                  value={appEmail}
                  onChange={(e) => setAppEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchAppUsers()}
                />
                <Button onClick={searchAppUsers} disabled={searchingApp}>
                  {searchingApp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {appUsers.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {appUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === user.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          {user.displayName && (
                            <p className="text-sm text-muted-foreground">{user.displayName}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {user.patreonConnected ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              <Check className="h-3 w-3 mr-1" />
                              Patreon Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline">No Patreon</Badge>
                          )}
                          {user.subscriptionTier === "premium" && (
                            <Badge className="bg-purple-100 text-purple-700">Premium</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedUser && (
                <Alert className="bg-blue-50 border-blue-200">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Selected: <strong>{selectedUser.email}</strong>
                    {selectedUser.patreonConnected && (
                      <span className="text-orange-600 ml-2">(Already has Patreon connection)</span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Step 2: Search Patreon Member */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Step 2: Find Patreon Member</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by Patreon email..."
                  value={patreonEmail}
                  onChange={(e) => setPatreonEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchPatreonMembers()}
                />
                <Button onClick={searchPatreonMembers} disabled={searchingPatreon}>
                  {searchingPatreon ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                </Button>
              </div>

              {patreonMembers.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {patreonMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedPatreon(member)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedPatreon?.id === member.id
                          ? "border-orange-500 bg-orange-50"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{member.email}</p>
                          {member.full_name && (
                            <p className="text-sm text-muted-foreground">{member.full_name}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={member.patron_status === "active_patron" ? "default" : "secondary"}
                            className={member.patron_status === "active_patron" ? "bg-green-600" : ""}
                          >
                            {member.patron_status?.replace("_", " ") || "Unknown"}
                          </Badge>
                          <Badge variant="outline" className="font-mono">
                            {formatPledge(member.pledge_cents)}/mo
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPatreon && (
                <Alert className="bg-orange-50 border-orange-200">
                  <Crown className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    Selected: <strong>{selectedPatreon.email}</strong>
                    <span className="ml-2">({formatPledge(selectedPatreon.pledge_cents)}/mo)</span>
                    {(selectedPatreon.pledge_cents || 0) < 1500 && (
                      <span className="text-red-600 ml-2">(Below $15/mo minimum)</span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Step 3: Link */}
            {selectedUser && selectedPatreon && (
              <div className="pt-4 border-t">
                <Button
                  onClick={linkAccounts}
                  disabled={linking}
                  className="w-full gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  {linking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  Link {selectedUser.email} to {selectedPatreon.email}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="unlinked" className="space-y-4">
            <Button onClick={loadUnlinkedMembers} disabled={loadingUnlinked} className="w-full">
              {loadingUnlinked ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Load Unlinked Patreon Members
            </Button>

            {unlinkedStats && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-2xl font-bold">{unlinkedStats.totalActivePatrons}</p>
                  <p className="text-xs text-muted-foreground">Total Active Patrons</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-600">{unlinkedStats.inAppNotConnected}</p>
                  <p className="text-xs text-muted-foreground">In App, Not Connected</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-red-600">{unlinkedStats.notInApp}</p>
                  <p className="text-xs text-muted-foreground">Not In App</p>
                </div>
              </div>
            )}

            {inAppNotConnected.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-orange-500" />
                  In App But Not Connected ({inAppNotConnected.length})
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  These patrons have app accounts but haven't connected Patreon. Click to auto-link.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {inAppNotConnected.map((member) => (
                    <div
                      key={member.id}
                      className="p-3 border rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-sm">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.full_name}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {formatPledge(member.pledge_cents)}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => quickLinkByEmail(member)}
                          className="gap-1"
                        >
                          <Link2 className="h-3 w-3" />
                          Link
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {notInApp.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <UserX className="h-4 w-4 text-red-500" />
                  Not In App ({notInApp.length})
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  These patrons haven't signed up for the app yet.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notInApp.slice(0, 20).map((member) => (
                    <div
                      key={member.id}
                      className="p-3 border rounded-lg flex items-center justify-between opacity-70"
                    >
                      <div>
                        <p className="font-medium text-sm">{member.email}</p>
                        <p className="text-xs text-muted-foreground">{member.full_name}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatPledge(member.pledge_cents)}
                      </Badge>
                    </div>
                  ))}
                  {notInApp.length > 20 && (
                    <p className="text-xs text-center text-muted-foreground">
                      ... and {notInApp.length - 20} more
                    </p>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
