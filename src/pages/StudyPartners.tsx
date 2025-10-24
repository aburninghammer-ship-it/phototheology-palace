import { useEffect, useState } from "react";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Check, X, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

export default function StudyPartners() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [requests, setRequests] = useState<Partner[]>([]);
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadPartners();
    }
  }, [user]);

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
          <p className="text-muted-foreground">
            Connect with others to learn together
          </p>
        </div>

        {/* Add Partner */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Study Partner</CardTitle>
            <CardDescription>Search by username to connect</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendRequest()}
              />
              <Button onClick={sendRequest}>
                <UserPlus className="h-4 w-4 mr-2" />
                Send Request
              </Button>
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
                No study partners yet. Send a request to get started!
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
    </div>
  );
}
