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
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useChurchMembership } from "@/hooks/useChurchMembership";
import { useScheduledGames } from "@/hooks/useScheduledGames";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Users, Search, Calendar, Clock, MapPin,
  Flame, UserPlus, MessageSquare, Video, Plus,
  CalendarPlus, Gamepad2, ArrowRight, BookOpen,
  Zap, Shield, Heart, Globe, Lock, Eye, KeyRound
} from "lucide-react";
import { getActivityById } from "@/config/schedulableActivities";
import { LMScheduleTab } from "./LMScheduleTab";
import { LMGamesTab } from "./LMGamesTab";
import { HouseFireDetail } from "./HouseFireDetail";

const GROUP_TYPES = [
  { value: "study", label: "Study Group", icon: BookOpen, description: "Phototheology rooms, Scripture books, guided studies", color: "text-blue-500" },
  { value: "freestyle", label: "Freestyle Training", icon: Zap, description: "Practice Connect Challenge together", color: "text-yellow-500" },
  { value: "apologetics", label: "Apologetics Lab", icon: Shield, description: "Debate simulations, defense training", color: "text-purple-500" },
  { value: "prayer", label: "Prayer & Formation", icon: Heart, description: "Spiritual growth, prayer partnership", color: "text-pink-500" },
  { value: "ministry", label: "Ministry Launch", icon: Globe, description: "Isaiah 58 projects, outreach planning", color: "text-green-500" },
] as const;

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
  group_type: string;
  is_private: boolean;
  invite_code: string | null;
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
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [joiningByCode, setJoiningByCode] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [conductAccepted, setConductAccepted] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    meeting_day: "",
    meeting_time: "",
    meeting_type: "hybrid" as 'in-person' | 'online' | 'hybrid',
    location: "",
    max_members: 7,
    group_type: "study",
    is_private: false
  });

  // Any church member can create a group
  const canCreateGroup = !!memberRole;

  useEffect(() => {
    loadGroups();
  }, [churchId]);

  const loadGroups = async () => {
    try {
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

      if (user) {
        const { data: myMemberships } = await (supabase
          .from('small_group_members' as any)
          .select('group_id')
          .eq('user_id', user.id) as any);

        const myGroupIds = new Set((myMemberships || []).map((m: any) => m.group_id));

        setMyGroups(groupsWithCounts.filter((g: any) => myGroupIds.has(g.id)));
        setGroups(groupsWithCounts.filter((g: any) => !myGroupIds.has(g.id) && g.is_open && !g.is_private));
      } else {
        setGroups(groupsWithCounts.filter((g: any) => g.is_open && !g.is_private));
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

  const handleJoinByCode = async () => {
    if (!user || !joinCode.trim()) return;
    setJoiningByCode(true);
    try {
      const { data: group, error: findError } = await (supabase
        .from('small_groups' as any)
        .select('id, name')
        .eq('invite_code', joinCode.trim().toUpperCase())
        .eq('is_active', true)
        .single() as any);

      if (findError || !group) {
        toast.error("Invalid invite code");
        return;
      }

      const { error } = await (supabase
        .from('small_group_members' as any)
        .insert({
          group_id: group.id,
          user_id: user.id,
          role: 'member'
        }) as any);

      if (error) throw error;

      toast.success(`Joined "${group.name}"!`);
      setJoinCode("");
      loadGroups();
    } catch (error: any) {
      toast.error(error.message || "Failed to join group");
    } finally {
      setJoiningByCode(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!user || !newGroup.name.trim()) {
      toast.error("Please provide a group name");
      return;
    }

    if (!conductAccepted) {
      toast.error("Please accept the Code of Conduct");
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await (supabase
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
          max_members: Math.min(newGroup.max_members, 7),
          is_open: true,
          is_active: true,
          group_type: newGroup.group_type,
          is_private: newGroup.is_private,
          conduct_accepted: true
        })
        .select('invite_code')
        .single() as any);

      if (error) throw error;

      if (newGroup.is_private && data?.invite_code) {
        toast.success(`House Fire created! Invite code: ${data.invite_code}`, { duration: 8000 });
      } else {
        toast.success("House Fire created successfully!");
      }

      setShowCreateDialog(false);
      setConductAccepted(false);
      setNewGroup({
        name: "",
        description: "",
        meeting_day: "",
        meeting_time: "",
        meeting_type: "hybrid",
        location: "",
        max_members: 7,
        group_type: "study",
        is_private: false
      });
      loadGroups();
    } catch (error: any) {
      console.error('Error creating group:', error);
      toast.error(error.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !typeFilter || group.group_type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'online': return <Video className="h-4 w-4" />;
      case 'in-person': return <MapPin className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getGroupTypeConfig = (type: string) => {
    return GROUP_TYPES.find(t => t.value === type) || GROUP_TYPES[0];
  };

  const GroupCard = ({ group, isMember = false }: { group: SmallGroup; isMember?: boolean }) => {
    const typeConfig = getGroupTypeConfig(group.group_type);
    const TypeIcon = typeConfig.icon;

    return (
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
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-xs gap-1">
                <TypeIcon className={`h-3 w-3 ${typeConfig.color}`} />
                {typeConfig.label}
              </Badge>
              {group.is_private && (
                <Badge variant="secondary" className="text-[10px] gap-1">
                  <Lock className="h-2.5 w-2.5" />
                  Private
                </Badge>
              )}
            </div>
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
            <span className="flex items-center gap-1">
              {getMeetingTypeIcon(group.meeting_type)}
              <span className="capitalize">{group.meeting_type}</span>
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
                <Button className="flex-1" onClick={() => setSelectedGroupId(group.id)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open Group
                </Button>
                <Button variant="outline" size="icon">
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
  };

  const { scheduledGames: upcomingStudies } = useScheduledGames(churchId);
  const [activeSubTab, setActiveSubTab] = useState("house-fires");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // If a group is selected, show the detail view
  if (selectedGroupId) {
    return (
      <HouseFireDetail
        groupId={selectedGroupId}
        onBack={() => { setSelectedGroupId(null); loadGroups(); }}
      />
    );
  }

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

            <div className="flex gap-2">
              {canCreateGroup && (
                <Dialog open={showCreateDialog} onOpenChange={(open) => { setShowCreateDialog(open); if (!open) setConductAccepted(false); }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Start a House Fire
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-primary" />
                        Start a New House Fire
                      </DialogTitle>
                      <DialogDescription>
                        Create a micro-community of up to 7 members
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      {/* Group Type Selector */}
                      <div className="space-y-2">
                        <Label>Group Type *</Label>
                        <div className="grid gap-2">
                          {GROUP_TYPES.map(type => {
                            const Icon = type.icon;
                            const isSelected = newGroup.group_type === type.value;
                            return (
                              <button
                                key={type.value}
                                type="button"
                                onClick={() => setNewGroup({ ...newGroup, group_type: type.value })}
                                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-colors ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/30'
                                }`}
                              >
                                <Icon className={`h-5 w-5 ${type.color} shrink-0`} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium">{type.label}</p>
                                  <p className="text-xs text-muted-foreground">{type.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

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

                      {/* Public/Private Toggle */}
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                        <div className="flex items-center gap-2">
                          {newGroup.is_private ? <Lock className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                          <div>
                            <p className="text-sm font-medium">{newGroup.is_private ? 'Private Group' : 'Public Group'}</p>
                            <p className="text-xs text-muted-foreground">
                              {newGroup.is_private ? 'Requires invite code to join' : 'Anyone can find and join'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={newGroup.is_private}
                          onCheckedChange={(checked) => setNewGroup({ ...newGroup, is_private: checked })}
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

                      {/* Code of Conduct */}
                      <div className="p-3 rounded-lg border border-border bg-muted/30 space-y-3">
                        <p className="text-sm font-medium">Code of Conduct</p>
                        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                          <li>Treat all members with respect and dignity</li>
                          <li>Keep discussions Christ-centered and edifying</li>
                          <li>Maintain confidentiality within the group</li>
                          <li>Be consistent in attendance and participation</li>
                          <li>Pray for one another regularly</li>
                        </ul>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="conduct"
                            checked={conductAccepted}
                            onCheckedChange={(checked) => setConductAccepted(checked === true)}
                          />
                          <Label htmlFor="conduct" className="text-sm cursor-pointer">
                            I agree to uphold this Code of Conduct *
                          </Label>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={handleCreateGroup}
                        disabled={creating || !newGroup.name.trim() || !conductAccepted}
                      >
                        {creating ? "Creating..." : "Create House Fire"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {/* Join by Code */}
          <Card variant="glass" className="border-dashed">
            <CardContent className="py-3">
              <div className="flex items-center gap-3 flex-wrap">
                <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground shrink-0">Have an invite code?</span>
                <div className="flex gap-2 flex-1 min-w-[200px]">
                  <Input
                    placeholder="Enter code (e.g. HF3A7B2C)"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    className="font-mono"
                  />
                  <Button
                    size="sm"
                    onClick={handleJoinByCode}
                    disabled={joiningByCode || !joinCode.trim()}
                  >
                    {joiningByCode ? "Joining..." : "Join"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
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

            {/* Type Filter Chips */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <Button
                variant={typeFilter === null ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(null)}
              >
                All
              </Button>
              {GROUP_TYPES.map(type => {
                const Icon = type.icon;
                return (
                  <Button
                    key={type.value}
                    variant={typeFilter === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter(typeFilter === type.value ? null : type.value)}
                    className="gap-1"
                  >
                    <Icon className={`h-3 w-3 ${typeFilter === type.value ? '' : type.color}`} />
                    {type.label}
                  </Button>
                );
              })}
            </div>

            {filteredGroups.length === 0 ? (
              <Card variant="glass">
                <CardContent className="py-12 text-center">
                  <Flame className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Open Groups Available</h3>
                  <p className="text-muted-foreground mb-4">
                    {typeFilter
                      ? "No groups match this filter. Try another type or start your own!"
                      : "All current groups are at capacity. Check back soon or start your own!"}
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
