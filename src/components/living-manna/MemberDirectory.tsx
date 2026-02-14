import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Users, MapPin, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDirectMessagesContext } from "@/contexts/DirectMessagesContext";
import { useAuth } from "@/hooks/useAuth";
import { FollowButton } from "./connect/FollowButton";
import { MemberProfileView } from "./profile/MemberProfileView";
import { useChurchActiveUsers } from "@/hooks/useChurchActiveUsers";

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profiles: {
    id: string;
    username: string;
    display_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    ministry_tags: string[] | null;
    location: string | null;
  };
}

interface MemberDirectoryProps {
  churchId: string;
}

export function MemberDirectory({ churchId }: MemberDirectoryProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [messagingUserId, setMessagingUserId] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const { startConversation, setActiveConversationId } = useDirectMessagesContext();
  const { liveMembers } = useChurchActiveUsers(churchId);
  const liveUserIds = new Set(liveMembers.map((m) => m.id));

  const handleMessage = async (memberId: string) => {
    if (!memberId || memberId === user?.id) return;

    setMessagingUserId(memberId);
    try {
      const conversationId = await startConversation(memberId);
      if (conversationId) {
        setActiveConversationId(conversationId);
        window.dispatchEvent(new CustomEvent('open-chat-sidebar', {
          detail: { conversationId, userId: memberId }
        }));
        toast({
          title: "Chat opened",
          description: "You can now message this member",
        });
      }
    } catch (error: any) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setMessagingUserId(null);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [churchId]);

  const loadMembers = async (attempt = 0) => {
    try {
      // First get church members
      const { data: membersData, error: membersError } = await supabase
        .from("church_members")
        .select("id, user_id, role, joined_at")
        .eq("church_id", churchId)
        .order("joined_at", { ascending: false });

      if (membersError) throw membersError;

      if (!membersData || membersData.length === 0) {
        setMembers([]);
        return;
      }

      // Get user IDs to fetch profiles
      const userIds = membersData.map(m => m.user_id);

      // Fetch profiles separately
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url, bio, ministry_tags, location")
        .in("id", userIds);

      if (profilesError) throw profilesError;

      // Merge members with their profiles
      const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
      const mergedMembers = membersData.map(member => ({
        ...member,
        profiles: profilesMap.get(member.user_id) || null
      }));

      setMembers(mergedMembers as any);
    } catch (error: any) {
      // Retry up to 2 times on network errors
      if (attempt < 2 && error?.message?.includes("Failed to fetch")) {
        console.warn(`[MemberDirectory] Retry attempt ${attempt + 1}`);
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        return loadMembers(attempt + 1);
      }
      toast({
        title: "Error loading members",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members
    .filter((member) => {
      const name = member.profiles?.display_name || member.profiles?.username || "";
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.profiles?.bio?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = !selectedRole || member.role === selectedRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      const aOnline = liveUserIds.has(a.user_id) ? 1 : 0;
      const bOnline = liveUserIds.has(b.user_id) ? 1 : 0;
      return bOnline - aOnline;
    });

  const roles = ["admin", "leader", "member"];
  const roleColors: Record<string, string> = {
    admin: "bg-red-500/10 text-red-600 border-red-500/30",
    leader: "bg-purple-500/10 text-purple-600 border-purple-500/30",
    member: "bg-blue-500/10 text-blue-600 border-blue-500/30",
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

  // Show member profile when a card is clicked
  if (selectedMemberId) {
    return (
      <MemberProfileView
        userId={selectedMemberId}
        churchId={churchId}
        onBack={() => setSelectedMemberId(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Member Directory</CardTitle>
            </div>
            <Badge variant="secondary">{members.length} members</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRole === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRole(null)}
              >
                All
              </Button>
              {roles.map((role) => (
                <Button
                  key={role}
                  variant={selectedRole === role ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role === selectedRole ? null : role)}
                  className="capitalize"
                >
                  {role}s
                </Button>
              ))}
            </div>
          </div>

          {/* Member Grid */}
          <ScrollArea className="h-[500px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedMemberId(member.user_id)}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                          <AvatarImage src={member.profiles?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {(member.profiles?.display_name || member.profiles?.username || "?")[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {liveUserIds.has(member.user_id) && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium truncate">
                            {member.profiles?.display_name || member.profiles?.username}
                          </h4>
                          <Badge variant="outline" className={`text-xs ${roleColors[member.role]}`}>
                            {member.role}
                          </Badge>
                        </div>
                        {member.profiles?.bio && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {member.profiles.bio}
                          </p>
                        )}
                        {member.profiles?.location && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{member.profiles.location}</span>
                          </div>
                        )}
                        {member.profiles?.ministry_tags && member.profiles.ministry_tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {member.profiles.ministry_tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={(e) => { e.stopPropagation(); handleMessage(member.user_id); }}
                        disabled={messagingUserId === member.user_id || member.user_id === user?.id}
                      >
                        {messagingUserId === member.user_id ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Mail className="h-3 w-3 mr-1" />
                        )}
                        {member.user_id === user?.id ? "You" : "Message"}
                      </Button>
                      <div onClick={(e) => e.stopPropagation()}>
                        <FollowButton
                          targetUserId={member.user_id}
                          isCurrentUser={member.user_id === user?.id}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No members found matching your search.
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
