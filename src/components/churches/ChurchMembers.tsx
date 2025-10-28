import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Search, Shield, Users as UsersIcon, Trash2, UserCog } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Member {
  id: string;
  user_id: string;
  role: 'admin' | 'leader' | 'member';
  joined_at: string;
  profiles: {
    display_name: string;
    username: string;
    avatar_url: string | null;
  };
}

interface ChurchMembersProps {
  churchId: string;
  onMemberChange: () => void;
}

export function ChurchMembers({ churchId, onMemberChange }: ChurchMembersProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    loadMembers();
  }, [churchId]);

  const loadMembers = async () => {
    try {
      const { data: memberData, error } = await supabase
        .from('church_members')
        .select('id, user_id, role, joined_at')
        .eq('church_id', churchId)
        .order('joined_at', { ascending: false });

      if (error) throw error;

      if (!memberData) {
        setMembers([]);
        return;
      }

      // Fetch profiles separately
      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url')
        .in('id', memberData.map(m => m.user_id));

      // Combine data
      const combined = memberData.map(member => ({
        ...member,
        profiles: profileData?.find(p => p.id === member.user_id) || {
          display_name: 'Unknown User',
          username: 'unknown',
          avatar_url: null
        }
      }));

      setMembers(combined as Member[]);
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'leader' | 'member') => {
    try {
      const { error } = await supabase
        .from('church_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast.success("Member role updated successfully");
      loadMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error("Failed to update member role");
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    setRemoving(true);
    try {
      const { error } = await supabase
        .from('church_members')
        .delete()
        .eq('id', memberToRemove.id);

      if (error) throw error;

      toast.success("Member removed successfully");
      setMemberToRemove(null);
      loadMembers();
      onMemberChange();
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error("Failed to remove member");
    } finally {
      setRemoving(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.profiles.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.profiles.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      leader: "default",
      member: "secondary"
    };
    return (
      <Badge variant={variants[role as keyof typeof variants] as any}>
        {role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
        {role === 'leader' && <UserCog className="h-3 w-3 mr-1" />}
        {role === 'member' && <UsersIcon className="h-3 w-3 mr-1" />}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Church Members</CardTitle>
          <CardDescription>Manage your church members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No members found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                              {member.profiles.display_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{member.profiles.display_name}</p>
                            <p className="text-sm text-muted-foreground">@{member.profiles.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={member.role}
                          onValueChange={(value: 'admin' | 'leader' | 'member') => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue>{getRoleBadge(member.role)}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="leader">Leader</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {new Date(member.joined_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setMemberToRemove(member)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Total Members: {members.length}
          </div>
        </CardContent>
      </Card>

      {/* Remove Member Dialog */}
      <AlertDialog open={!!memberToRemove} onOpenChange={(open) => !open && setMemberToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {memberToRemove?.profiles.display_name} from your church?
              They will lose access to all church features immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveMember}
              disabled={removing}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {removing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Removing...
                </>
              ) : (
                'Remove Member'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
