import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Copy, Trash2, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Invitation {
  id: string;
  invited_email: string;
  invitation_code: string;
  role: string;
  status: string;
  created_at: string;
  expires_at: string;
}

interface ChurchInvitationsProps {
  churchId: string;
  availableSeats: number;
}

export function ChurchInvitations({ churchId, availableSeats }: ChurchInvitationsProps) {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"member" | "leader">("member");

  useEffect(() => {
    loadInvitations();
  }, [churchId]);

  const loadInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('church_invitations')
        .select('*')
        .eq('church_id', churchId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error loading invitations:', error);
      toast.error("Failed to load invitations");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvitation = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (availableSeats <= 0) {
      toast.error("No available seats. Please upgrade your plan.");
      return;
    }

    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create invitations");
        return;
      }

      // Generate unique invitation code
      const invitationCode = `CHURCH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error } = await supabase
        .from('church_invitations')
        .insert({
          church_id: churchId,
          invited_email: inviteEmail,
          invitation_code: invitationCode,
          role: inviteRole,
          invited_by: user.id,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      toast.success("Invitation created successfully");
      setInviteEmail("");
      setInviteRole("member");
      setShowCreateDialog(false);
      loadInvitations();
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      if (error.message?.includes('duplicate')) {
        toast.error("This email has already been invited");
      } else {
        toast.error("Failed to create invitation");
      }
    } finally {
      setCreating(false);
    }
  };

  const handleCopyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Invitation code copied to clipboard");
  };

  const handleDeleteInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('church_invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Invitation deleted");
      loadInvitations();
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast.error("Failed to delete invitation");
    }
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const expired = new Date(expiresAt) < new Date();
    
    if (expired) {
      return <Badge variant="secondary">Expired</Badge>;
    }
    
    if (status === 'accepted') {
      return <Badge variant="default" className="bg-green-500">Accepted</Badge>;
    }
    
    return <Badge variant="outline">Pending</Badge>;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Church Invitations</CardTitle>
            <CardDescription>Invite new members to join your church</CardDescription>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button disabled={availableSeats <= 0}>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Invitation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Invitation</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new member. They will receive an invitation code to join your church.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="member@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                    <SelectTrigger id="invite-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="leader">Leader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleCreateInvitation}
                  disabled={creating}
                  className="w-full"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Create Invitation
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No invitations yet</p>
            <p className="text-sm text-muted-foreground">
              Create an invitation to invite members to your church
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Invitation Code</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">{invitation.invited_email}</TableCell>
                    <TableCell className="capitalize">{invitation.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {invitation.invitation_code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyInviteCode(invitation.invitation_code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invitation.status, invitation.expires_at)}
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {invitation.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvitation(invitation.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
