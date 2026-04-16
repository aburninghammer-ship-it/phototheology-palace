import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { 
  Users, Shield, Flame, BookOpen, Heart, GraduationCap,
  UserPlus, Trash2, Search, ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MinistryLeadershipManagerProps {
  churchId: string;
}

type MinistryRole = 'site_admin' | 'small_group_leader' | 'evangelism_lead' | 'prayer_lead' | 'sabbath_school_lead' | 'youth_lead' | 'personal_ministry_admin' | 'bible_worker' | 'announcements_lead' | 'events_lead' | 'community_lead' | 'livestream_lead' | 'discipleship_lead';

interface MinistryLeader {
  id: string;
  user_id: string;
  role: MinistryRole;
  is_active: boolean;
  assigned_group_id: string | null;
  created_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
    email?: string;
  };
  group_name?: string;
}

interface ChurchMember {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

const ROLE_CONFIG: Record<MinistryRole, { label: string; icon: typeof Shield; color: string; description: string }> = {
  site_admin: { 
    label: "Site Admin", 
    icon: Shield, 
    color: "text-yellow-500",
    description: "Full access to all Living Manna features"
  },
  announcements_lead: {
    label: "Announcements Lead",
    icon: Flame,
    color: "text-amber-500",
    description: "Post and manage church announcements"
  },
  events_lead: {
    label: "Events Coordinator",
    icon: Users,
    color: "text-cyan-500",
    description: "Create and manage church events & campaigns"
  },
  community_lead: {
    label: "Community Moderator",
    icon: Users,
    color: "text-indigo-500",
    description: "Moderate community posts, chat rooms, and engagement"
  },
  livestream_lead: {
    label: "Livestream Host",
    icon: Flame,
    color: "text-red-500",
    description: "Manage sermon broadcasts and live commentary"
  },
  discipleship_lead: {
    label: "Discipleship Coach",
    icon: GraduationCap,
    color: "text-teal-500",
    description: "Guide members through Palace journey & training programs"
  },
  small_group_leader: { 
    label: "Small Group Leader", 
    icon: Flame, 
    color: "text-orange-500",
    description: "Lead a small group and generate studies"
  },
  evangelism_lead: { 
    label: "Evangelism Lead", 
    icon: Users, 
    color: "text-blue-500",
    description: "Manage evangelism campaigns and interests"
  },
  prayer_lead: { 
    label: "Prayer Ministry Lead", 
    icon: Heart, 
    color: "text-pink-500",
    description: "Coordinate prayer teams and requests"
  },
  sabbath_school_lead: { 
    label: "Sabbath School Lead", 
    icon: BookOpen, 
    color: "text-green-500",
    description: "Manage Sabbath School classes and materials"
  },
  youth_lead: { 
    label: "Youth Ministry Lead", 
    icon: GraduationCap, 
    color: "text-purple-500",
    description: "Oversee youth programs and activities"
  },
  personal_ministry_admin: {
    label: "Personal Ministries",
    icon: Heart,
    color: "text-rose-500",
    description: "Coordinate personal ministries and outreach"
  },
  bible_worker: {
    label: "Bible Worker",
    icon: BookOpen,
    color: "text-emerald-500",
    description: "Conduct Bible studies and follow up with interests"
  }
};

export function MinistryLeadershipManager({ churchId }: MinistryLeadershipManagerProps) {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<MinistryLeader[]>([]);
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Add leader form
  const [selectedMember, setSelectedMember] = useState("");
  const [selectedRole, setSelectedRole] = useState<MinistryRole | "">("");
  const [selectedGroupForLeader, setSelectedGroupForLeader] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadData();
  }, [churchId]);

  const loadData = async () => {
    try {
      // Load ministry leaders
      const { data: leadersData } = await (supabase
        .from('ministry_leaders' as any)
        .select(`
          *,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('church_id', churchId)
        .order('role') as any);

      // Get group names for leaders
      const leadersWithGroups = await Promise.all(
        (leadersData || []).map(async (leader: any) => {
          let groupName = null;
          if (leader.assigned_group_id) {
            const { data: group } = await (supabase
              .from('small_groups' as any)
              .select('name')
              .eq('id', leader.assigned_group_id)
              .single() as any);
            groupName = group?.name;
          }
          return {
            ...leader,
            profile: leader.profiles,
            group_name: groupName
          };
        })
      );
      
      setLeaders(leadersWithGroups);

      // Load church members for adding new leaders
      const { data: membersData } = await (supabase
        .from('church_members' as any)
        .select(`
          user_id,
          profiles:user_id (display_name, avatar_url)
        `)
        .eq('church_id', churchId) as any);

      setMembers((membersData || []).map((m: any) => ({
        user_id: m.user_id,
        display_name: m.profiles?.display_name || 'Unknown',
        avatar_url: m.profiles?.avatar_url
      })));

      // Load small groups
      const { data: groupsData } = await (supabase
        .from('small_groups' as any)
        .select('id, name')
        .eq('church_id', churchId)
        .eq('is_active', true) as any);
      
      setGroups(groupsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLeader = async () => {
    if (!selectedMember || !selectedRole || !user) {
      toast.error("Please select a member and role");
      return;
    }

    if (selectedRole === 'small_group_leader' && !selectedGroupForLeader) {
      toast.error("Please assign a group to the small group leader");
      return;
    }

    setAdding(true);
    try {
      const { error } = await (supabase
        .from('ministry_leaders' as any)
        .insert({
          church_id: churchId,
          user_id: selectedMember,
          role: selectedRole,
          assigned_group_id: selectedRole === 'small_group_leader' ? selectedGroupForLeader : null,
          assigned_by: user.id,
          is_active: true
        }) as any);

      if (error) throw error;

      toast.success("Ministry leader added!");
      setSelectedMember("");
      setSelectedRole("");
      setSelectedGroupForLeader("");
      loadData();
    } catch (error: any) {
      console.error('Error adding leader:', error);
      if (error.code === '23505') {
        toast.error("This member already has this role");
      } else {
        toast.error(error.message || "Failed to add leader");
      }
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveLeader = async (leaderId: string) => {
    try {
      const { error } = await (supabase
        .from('ministry_leaders' as any)
        .delete()
        .eq('id', leaderId) as any);

      if (error) throw error;

      toast.success("Leader removed");
      loadData();
    } catch (error) {
      console.error('Error removing leader:', error);
      toast.error("Failed to remove leader");
    }
  };

  const handleToggleActive = async (leaderId: string, currentStatus: boolean) => {
    try {
      const { error } = await (supabase
        .from('ministry_leaders' as any)
        .update({ is_active: !currentStatus })
        .eq('id', leaderId) as any);

      if (error) throw error;

      toast.success(currentStatus ? "Leader deactivated" : "Leader activated");
      loadData();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error("Failed to update status");
    }
  };

  const filteredLeaders = leaders.filter(leader =>
    leader.profile?.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ROLE_CONFIG[leader.role].label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group leaders by role
  const leadersByRole = Object.keys(ROLE_CONFIG).reduce((acc, role) => {
    acc[role as MinistryRole] = filteredLeaders.filter(l => l.role === role);
    return acc;
  }, {} as Record<MinistryRole, MinistryLeader[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Ministry Leadership
          </h2>
          <p className="text-muted-foreground">
            Assign and manage ministry leaders for your church
          </p>
        </div>
      </div>

      {/* Add Leader Card */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Ministry Leader
          </CardTitle>
          <CardDescription>Assign a church member to a ministry role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Member Selection */}
            <div className="space-y-2">
              <Label>Church Member</Label>
              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full p-2 rounded-lg bg-background border border-border"
              >
                <option value="">Select member...</option>
                {members.map(member => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.display_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Ministry Role</Label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as MinistryRole)}
                className="w-full p-2 rounded-lg bg-background border border-border"
              >
                <option value="">Select role...</option>
                {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Group Assignment (for small group leaders) */}
            {selectedRole === 'small_group_leader' && (
              <div className="space-y-2">
                <Label>Assign to Group</Label>
                <select
                  value={selectedGroupForLeader}
                  onChange={(e) => setSelectedGroupForLeader(e.target.value)}
                  className="w-full p-2 rounded-lg bg-background border border-border"
                >
                  <option value="">Select group...</option>
                  {groups.map(group => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add Button */}
            <div className="flex items-end">
              <Button 
                onClick={handleAddLeader} 
                disabled={adding || !selectedMember || !selectedRole}
                className="w-full"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Leader
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leaders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Leaders by Role */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(ROLE_CONFIG).map(([role, config]) => {
          const roleLeaders = leadersByRole[role as MinistryRole];
          const Icon = config.icon;
          
          return (
            <Card key={role} variant="glass">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${config.color}`} />
                    {config.label}
                  </CardTitle>
                  <Badge variant="outline">{roleLeaders.length}</Badge>
                </div>
                <CardDescription className="text-xs">{config.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {roleLeaders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No leaders assigned
                  </p>
                ) : (
                  <div className="space-y-2">
                    {roleLeaders.map(leader => (
                      <div 
                        key={leader.id}
                        className={`flex items-center justify-between p-2 rounded-lg bg-background/50 border ${
                          leader.is_active ? 'border-border/50' : 'border-red-500/30 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {leader.profile?.display_name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{leader.profile?.display_name}</p>
                            {leader.group_name && (
                              <p className="text-xs text-muted-foreground">{leader.group_name}</p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleToggleActive(leader.id, leader.is_active)}>
                              {leader.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleRemoveLeader(leader.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
