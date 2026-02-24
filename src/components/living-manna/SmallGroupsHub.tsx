import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { useScheduledGames } from "@/hooks/useScheduledGames";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Users, Search, Calendar, Clock, MapPin,
  Flame, UserPlus, MessageSquare, Video, Plus,
  CalendarPlus, Gamepad2, ArrowRight, BookOpen
} from "lucide-react";
import { getActivityById } from "@/config/schedulableActivities";
import { LMScheduleTab } from "./LMScheduleTab";
import { LMGamesTab } from "./LMGamesTab";

interface SmallGroupsHubProps {
  churchId: string;
}

interface SmallGroup {
  id: string;
  name: string;
  description: string | null;
  leader_id: string;
  meeting_day: string | null;
  meeting_time: string | null;
  meeting_type: 'in-person' | 'online' | 'hybrid';
  location: string | null;
  max_members: number;
  current_cycle: string | null;
  is_open: boolean;
  member_count?: number;
  leader_name?: string;
}

export function SmallGroupsHub({ churchId }: SmallGroupsHubProps) {
  const { user } = useAuth();
  const { role: memberRole } = useChurchMembership();
  const [groups, setGroups] = useState<SmallGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SmallGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    meeting_day: "",
    meeting_time: "",
    meeting_type: "hybrid" as 'in-person' | 'online' | 'hybrid',
    location: "",
    max_members: 12
  });

  const canCreateGroup = memberRole === 'admin' || memberRole === 'leader';

  useEffect(() => {
    loadGroups();
  }, [churchId]);

  const loadGroups = async () => {
    try {
      // Load all open groups - using any for new tables
      const { data: allGroups, error } = await (supabase
        .from('small_groups' as any)
        .select(`
          *,
          profiles:leader_id (display_name, avatar_url)
        `)
        .eq('church_id', churchId)
        .eq('is_active', true)
        .order('name') as any);

      if (error) throw error;

      // Get member counts
      const groupsWithCounts = await Promise.all(
        (allGroups || []).map(async (group: any) => {
          const { count } = await (supabase
            .from('small_group_members' as any)
            .select('*', { count: 'exact', head: true })
            .eq('group_id', group.id) as any);

          return {
            ...group,
            member_count: count || 0,
            leader_name: group.profiles?.display_name || 'Unknown'
          };
        })
      );

      // Filter my groups vs available groups
      if (user) {
        const { data: myMemberships } = await (supabase
          .from('small_group_members' as any)
          .select('group_id')
          .eq('user_id', user.id) as any);

        const myGroupIds = new Set((myMemberships || []).map((m: any) => m.group_id));
        
        setMyGroups(groupsWithCounts.filter((g: any) => myGroupIds.has(g.id)));
        setGroups(groupsWithCounts.filter((g: any) => !myGroupIds.has(g.id) && g.is_open));
      } else {
        setGroups(groupsWithCounts.filter((g: any) => g.is_open));
      }
    } catch (error) {
      console.error('Error loading groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!user) {
      toast.error("Please sign in to join a group");
      return;
    }

    try {
      const { error } = await (supabase
        .from('small_group_members' as any)
        .insert({
          group_id: groupId,
          user_id: user.id,
          role: 'member'
        }) as any);

      if (error) throw error;

      toast.success("Successfully joined the group!");
      loadGroups();
    } catch (error: any) {
      console.error('Error joining group:', error);
      toast.error(error.message || "Failed to join group");
    }
  };

  const handleCreateGroup = async () => {
    if (!user || !newGroup.name.trim()) {
      toast.error("Please provide a group name");
      return;
    }

    setCreating(true);
    try {
      const { error } = await (supabase
        .from('small_groups' as any)
        .insert({
          church_id: churchId,
          name: newGroup.name.trim(),
          description: newGroup.description.trim() || null,
          leader_id: user.id,
          meeting_day: newGroup.meeting_day || null,
          meeting_time: newGroup.meeting_time || null,
          meeting_type: newGroup.meeting_type,
          location: newGroup.location.trim() || null,
          max_members: newGroup.max_members,
          is_open: true,
          is_active: true
        }) as any);

      if (error) throw error;

      toast.success("House Fire created successfully!");
      setShowCreateDialog(false);
      setNewGroup({
        name: "",
        description: "",
        meeting_day: "",
        meeting_time: "",
        meeting_type: "hybrid",
        location: "",
        max_members: 12
      });
      loadGroups();
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const GroupCard = ({ group, isMember = false }: { group: SmallGroup; isMember?: boolean }) => (
    <Card variant="glass" className="hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Flame className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <span>Led by {group.leader_name}</span>
              </CardDescription>
            </div>
          </div>
          <Badge variant={group.meeting_type === 'online' ? 'default' : 'outline'}>
            {getMeetingTypeIcon(group.meeting_type)}
            <span className="ml-1 capitalize">{group.meeting_type}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {group.description && (
          <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
        )}
        
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
          {group.meeting_day && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {group.meeting_day}
            </span>
          )}
          {group.meeting_time && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {group.meeting_time}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {group.member_count}/{group.max_members} members
          </span>
        </div>

        {group.current_cycle && (
          <Badge variant="outline" className="mb-4">
            Current: {group.current_cycle}
          </Badge>
        )}

        <div className="flex gap-2">
          {isMember ? (
            <>
              <Button className="flex-1">
                <MessageSquare className="h-4 w-4 mr-2" />
                Open Group
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => handleJoinGroup(group.id)}
              disabled={(group.member_count || 0) >= group.max_members}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {(group.member_count || 0) >= group.max_members ? 'Group Full' : 'Join This House Fire'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const { scheduledGames: upcomingStudies } = useScheduledGames(churchId);
  const [activeSubTab, setActiveSubTab] = useState("house-fires");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Get the next 3 upcoming studies for the preview
  const upcomingPreview = upcomingStudies.slice(0, 3);

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
      <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
        <TabsTrigger value="house-fires" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Flame className="h-4 w-4" />
          House Fires
        </TabsTrigger>
        <TabsTrigger value="schedule" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <CalendarPlus className="h-4 w-4" />
          Schedule
        </TabsTrigger>
        <TabsTrigger value="games" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
          <Gamepad2 className="h-4 w-4" />
          Games
        </TabsTrigger>
      </TabsList>

      {/* House Fires Tab */}
      <TabsContent value="house-fires">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="h-6 w-6 text-primary" />
                House Fires (Small Groups)
              </h2>
              <p className="text-muted-foreground">
                Connect with a community for fellowship, study, and growth
              </p>
            </div>

            {canCreateGroup && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Start a House Fire
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-primary" />
                      Start a New House Fire
                    </DialogTitle>
                    <DialogDescription>
                      Create a small group for fellowship and Bible study
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="group-name">Group Name *</Label>
                      <Input
                        id="group-name"
                        placeholder="e.g., Young Adults, Family Fire, etc."
                        value={newGroup.name}
                        onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="group-description">Description</Label>
                      <Textarea
                        id="group-description"
                        placeholder="What is this group about?"
                        value={newGroup.description}
                        onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="meeting-day">Meeting Day</Label>
                        <Select
                          value={newGroup.meeting_day}
                          onValueChange={(value) => setNewGroup({ ...newGroup, meeting_day: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meeting-time">Meeting Time</Label>
                        <Input
                          id="meeting-time"
                          type="time"
                          value={newGroup.meeting_time}
                          onChange={(e) => setNewGroup({ ...newGroup, meeting_time: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meeting-type">Meeting Type</Label>
                      <Select
                        value={newGroup.meeting_type}
                        onValueChange={(value: 'in-person' | 'online' | 'hybrid') => setNewGroup({ ...newGroup, meeting_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(newGroup.meeting_type === 'in-person' || newGroup.meeting_type === 'hybrid') && (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="Where will you meet?"
                          value={newGroup.location}
                          onChange={(e) => setNewGroup({ ...newGroup, location: e.target.value })}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="max-members">Maximum Members</Label>
                      <Input
                        id="max-members"
                        type="number"
                        min={2}
                        max={50}
                        value={newGroup.max_members}
                        onChange={(e) => setNewGroup({ ...newGroup, max_members: parseInt(e.target.value) || 12 })}
                      />
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCreateGroup}
                      disabled={creating || !newGroup.name.trim()}
                    >
                      {creating ? "Creating..." : "Create House Fire"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* My Groups */}
          {myGroups.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">My Groups</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myGroups.map(group => (
                  <GroupCard key={group.id} group={group} isMember />
                ))}
              </div>
            </div>
          )}

          {/* Find Groups */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Find a House Fire</h3>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {filteredGroups.length === 0 ? (
              <Card variant="glass">
                <CardContent className="py-12 text-center">
                  <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Open Groups Available</h3>
                  <p className="text-muted-foreground mb-4">
                    All current groups are at capacity. Check back soon or contact a leader.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredGroups.map(group => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Studies Preview */}
          {upcomingPreview.length > 0 && (
            <Card variant="glass" className="border-primary/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Studies
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-muted-foreground hover:text-primary"
                    onClick={() => setActiveSubTab("schedule")}
                  >
                    View All
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {upcomingPreview.map((study) => {
                  const activity = getActivityById(study.game_type);
                  const Icon = activity?.icon || BookOpen;
                  const scheduledDate = new Date(study.scheduled_at);
                  return (
                    <div
                      key={study.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setActiveSubTab("schedule")}
                    >
                      <div className={`p-1.5 rounded-md bg-gradient-to-br ${activity?.gradient || 'from-gray-500 to-gray-600'}`}>
                        <Icon className="h-3.5 w-3.5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {study.title || activity?.name || 'Scheduled Session'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(scheduledDate, 'MMM d')} at {format(scheduledDate, 'h:mm a')} · by {study.host_name}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {study.rsvp_count || 0} going
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </TabsContent>

      {/* Schedule Tab */}
      <TabsContent value="schedule">
        <LMScheduleTab churchId={churchId} />
      </TabsContent>

      {/* Games Tab */}
      <TabsContent value="games">
        <LMGamesTab churchId={churchId} />
      </TabsContent>
    </Tabs>
  );
}
