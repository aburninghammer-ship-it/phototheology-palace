import { useEffect, useState } from "react";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Check, X, Search, Loader2, Sparkles, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/Footer";

interface Partner {
  id: string;
  user_id: string;
  partner_id: string;
  status: string;
  created_at: string;
  partner_profile?: {
    username: string;
    display_name: string;
    points: number;
  };
}

interface DiscoverableUser {
  id: string;
  username: string;
  display_name: string;
  points: number;
}

export default function StudyPartners() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [requests, setRequests] = useState<Partner[]>([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Array<{ id: string; username: string; display_name: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [lookingForPartner, setLookingForPartner] = useState(false);
  const [discoverableUsers, setDiscoverableUsers] = useState<DiscoverableUser[]>([]);
  const [loadingDiscoverable, setLoadingDiscoverable] = useState(false);
  const [pendingRequestIds, setPendingRequestIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadPartners();
      loadUserPreference();
      loadDiscoverableUsers();
    }
  }, [user]);

  const loadUserPreference = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("looking_for_partner")
      .eq("id", user.id)
      .single();
    
    if (data) {
      setLookingForPartner(data.looking_for_partner || false);
    }
  };

  const toggleLookingForPartner = async (checked: boolean) => {
    if (!user) return;
    
    setLookingForPartner(checked);
    
    const { error } = await supabase
      .from("profiles")
      .update({ looking_for_partner: checked })
      .eq("id", user.id);
    
    if (error) {
      console.error("Error updating preference:", error);
      setLookingForPartner(!checked);
      toast({
        title: "Error",
        description: "Failed to update preference",
        variant: "destructive",
      });
    } else {
      toast({
        title: checked ? "You're now discoverable!" : "Discovery turned off",
        description: checked 
          ? "Other users looking for partners can now find you" 
          : "You won't appear in partner discovery",
      });
    }
  };

  const loadDiscoverableUsers = async () => {
    if (!user) return;
    
    setLoadingDiscoverable(true);
    try {
      // Get users who are looking for partners (excluding self and existing partners)
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, points")
        .eq("looking_for_partner", true)
        .neq("id", user.id)
        .limit(20);
      
      if (error) throw error;
      
      // Get existing partner IDs and pending request IDs
      const { data: existingPartners } = await supabase
        .from("study_partners")
        .select("partner_id, user_id, status")
        .or(`user_id.eq.${user.id},partner_id.eq.${user.id}`);
      
      const partnerIds = new Set<string>();
      const pendingIds = new Set<string>();
      
      existingPartners?.forEach(p => {
        const otherId = p.user_id === user.id ? p.partner_id : p.user_id;
        partnerIds.add(otherId);
        if (p.status === 'pending' && p.user_id === user.id) {
          pendingIds.add(p.partner_id);
        }
      });
      
      setPendingRequestIds(pendingIds);
      
      // Filter out existing partners
      const filteredUsers = users?.filter(u => !partnerIds.has(u.id)) || [];
      setDiscoverableUsers(filteredUsers);
    } catch (error) {
      console.error("Error loading discoverable users:", error);
    } finally {
      setLoadingDiscoverable(false);
    }
  };

  const sendRequestToUser = async (targetUserId: string, displayName: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from("study_partners").insert({
        user_id: user.id,
        partner_id: targetUserId,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Request already sent",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setPendingRequestIds(prev => new Set([...prev, targetUserId]));
      
      toast({
        title: "Request sent!",
        description: `Study partner request sent to ${displayName}`,
      });
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name")
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const loadPartners = async () => {
    if (!user) return;

    try {
      // Load accepted partners
      const { data: partnerData, error: partnerError } = await supabase
        .from("study_partners")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "accepted");

      if (partnerError) throw partnerError;

      // Get partner profiles
      const partnerIds = partnerData?.map((p) => p.partner_id) || [];
      const { data: partnerProfiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, points")
        .in("id", partnerIds);

      // Merge data
      const partnersWithProfiles = partnerData?.map((partner) => ({
        ...partner,
        partner_profile: partnerProfiles?.find((p) => p.id === partner.partner_id),
      }));

      // Load pending requests (incoming)
      const { data: requestData, error: requestError } = await supabase
        .from("study_partners")
        .select("*")
        .eq("partner_id", user.id)
        .eq("status", "pending");

      if (requestError) throw requestError;

      // Get requester profiles
      const requesterIds = requestData?.map((r) => r.user_id) || [];
      const { data: requesterProfiles } = await supabase
        .from("profiles")
        .select("id, username, display_name, points")
        .in("id", requesterIds);

      // Merge data
      const requestsWithProfiles = requestData?.map((request) => ({
        ...request,
        partner_profile: requesterProfiles?.find((p) => p.id === request.user_id),
      }));

      setPartners(partnersWithProfiles || []);
      setRequests(requestsWithProfiles || []);
    } catch (error) {
      console.error("Error loading partners:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async () => {
    if (!user || !searchUsername) return;

    try {
      // Find user by username
      const { data: targetUser, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", searchUsername)
        .single();

      if (userError || !targetUser) {
        toast({
          title: "User not found",
          description: "No user with that username exists",
          variant: "destructive",
        });
        return;
      }

      if (targetUser.id === user.id) {
        toast({
          title: "Cannot add yourself",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("study_partners").insert({
        user_id: user.id,
        partner_id: targetUser.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Request already sent",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Request sent!",
        description: `Study partner request sent to ${searchUsername}`,
      });

      setSearchUsername("");
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  const acceptRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("study_partners")
        .update({
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Request accepted!",
      });

      loadPartners();
      loadDiscoverableUsers();
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const declineRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from("study_partners")
        .delete()
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Request declined",
      });

      loadPartners();
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <SimplifiedNav />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Users className="h-8 w-8" />
            Study Partners
          </h1>
          <p className="text-foreground/80">
            Connect with others to learn together
          </p>
        </div>

        {/* Looking for Partner Toggle */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="looking-toggle" className="text-base font-medium flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Looking for a Study Partner
                </Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, other users can discover you and send partner requests
                </p>
              </div>
              <Switch
                id="looking-toggle"
                checked={lookingForPartner}
                onCheckedChange={toggleLookingForPartner}
              />
            </div>
          </CardContent>
        </Card>

        {/* Discover Partners */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Discover Partners
            </CardTitle>
            <CardDescription>
              Users who are looking for study partners
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDiscoverable ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : discoverableUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No users currently looking for partners. Check back later!
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {discoverableUsers.map((discoveredUser) => (
                  <div
                    key={discoveredUser.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
                  >
                    <div>
                      <p className="font-medium">{discoveredUser.display_name}</p>
                      <p className="text-sm text-muted-foreground">
                        @{discoveredUser.username} • {discoveredUser.points || 0} pts
                      </p>
                    </div>
                    {pendingRequestIds.has(discoveredUser.id) ? (
                      <Badge variant="secondary">Pending</Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => sendRequestToUser(discoveredUser.id, discoveredUser.display_name)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Partner by Username */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search by Username</CardTitle>
            <CardDescription>Know someone's username? Search directly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search by username or display name..."
                    value={searchUsername}
                    onChange={(e) => {
                      setSearchUsername(e.target.value);
                      searchUsers(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendRequest()}
                  />
                  {searching && (
                    <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-3 text-muted-foreground" />
                  )}
                </div>
                <Button onClick={sendRequest} disabled={!searchUsername.trim()}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Request
                </Button>
              </div>
              
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <Card className="border shadow-lg">
                  <CardContent className="p-2">
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {searchResults.map((result) => (
                        <button
                          key={result.id}
                          onClick={() => {
                            setSearchUsername(result.username);
                            setSearchResults([]);
                          }}
                          className="w-full text-left p-2 rounded-md hover:bg-accent transition-colors"
                        >
                          <div className="font-medium text-sm">{result.display_name}</div>
                          <div className="text-xs text-muted-foreground">@{result.username}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        {requests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">
                      {request.partner_profile?.display_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{request.partner_profile?.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => acceptRequest(request.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => declineRequest(request.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* My Partners */}
        <Card>
          <CardHeader>
            <CardTitle>My Study Partners ({partners.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {partners.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No study partners yet. Discover partners above or search by username!
              </p>
            ) : (
              <div className="space-y-3">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        {partner.partner_profile?.display_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        @{partner.partner_profile?.username} •{" "}
                        {partner.partner_profile?.points} points
                      </p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
