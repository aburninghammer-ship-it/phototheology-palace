import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Copy, Trash2, UserPlus, Link2, RefreshCw } from "lucide-react";
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
    console.log('handleCreateInvitation called with email:', inviteEmail);
    
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (availableSeats <= 0) {
      toast.error("No available seats. Please upgrade your plan.");
      return;
    }

    console.log('Creating invitation...');
    setCreating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: { session } } = await supabase.auth.getSession();
      console.log('User:', user?.id, 'Session:', !!session);
      if (!user || !session) {
        toast.error("You must be logged in to create invitations");
        return;
      }

      // Generate unique invitation code
      const invitationCode = `CHURCH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Get church name for the email
      const { data: churchData } = await supabase
        .from('churches')
        .select('name')
        .eq('id', churchId)
        .single();

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

      toast.success("Invitation created! Sending email…");

      // Send email invitation (non-blocking so the UI never gets stuck)
      void (async () => {
        try {
          const { data: emailResult, error: emailError } = await supabase.functions.invoke(
            "send-church-invitation",
            {
              body: {
                recipientEmail: inviteEmail,
                churchName: churchData?.name || "Your Church",
                churchId,
                invitationCode,
                role: inviteRole,
                expiresAt: expiresAt.toISOString(),
              },
            }
          );

          if (emailError) {
            console.error("Email send error:", emailError);
            toast.warning(
              "Invitation created but email could not be sent. Share the link or code manually."
            );
            return;
          }

          if (emailResult?.success) {
            toast.success("Invitation email sent!");
            return;
          }

          console.error("Email send failed:", emailResult?.error);
          toast.warning(
            "Invitation created but email failed. Share the link or code manually."
          );
        } catch (err) {
          console.error("Email send crashed:", err);
          toast.warning(
            "Invitation created but email could not be sent. Share the link or code manually."
          );
        }
      })();

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

  const handleCopyInviteLink = (code: string) => {
    const url = new URL("/join-church", window.location.origin);
    url.searchParams.set("code", code);
    navigator.clipboard.writeText(url.toString());
    toast.success("Invitation link copied to clipboard");
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

  const handleRenewInvitation = async (id: string) => {
    try {
      // Set new expiration to 30 days from now
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 30);

      const { error } = await supabase
        .from('church_invitations')
        .update({
          expires_at: newExpiresAt.toISOString(),
          status: 'pending' // Reset status in case it was changed
        })
        .eq('id', id);

      if (error) throw error;

      toast.success("Invitation renewed for 30 days");
      loadInvitations();
    } catch (error) {
      console.error('Error renewing invitation:', error);
      toast.error("Failed to renew invitation");
    }
  };

  const handleRoleChange = async (invitationId: string, newRole: 'member' | 'leader') => {
    try {
      const { error } = await supabase
        .from('church_invitations')
        .update({ role: newRole })
        .eq('id', invitationId);

      if (error) throw error;

      toast.success(`Role updated to ${newRole}`);
      loadInvitations();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error("Failed to update role");
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
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Pending Invitations</CardTitle>
            <CardDescription className="text-foreground/70">
              These users have been invited but haven't signed up yet. Share the code with them.
            </CardDescription>
          </div>
          <Button
              onClick={() => setShowCreateDialog(true)}
              disabled={availableSeats <= 0}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Invitation
            </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Invitation</DialogTitle>
                <DialogDescription>
                  Send an invitation to a new member. They will receive an invitation code to join your church.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCreateInvitation();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="invite-email">Email Address</Label>
                  <Input
                    id="invite-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="member@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
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

                <Button type="submit" disabled={creating} className="w-full">
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
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {invitations.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-foreground/40 mx-auto mb-4" />
            <p className="text-foreground/60 mb-4">No invitations yet</p>
            <p className="text-sm text-foreground/50">
              Create an invitation to invite members to your church
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/50 bg-background/30 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-primary font-semibold">Email</TableHead>
                  <TableHead className="text-primary font-semibold">Role</TableHead>
                  <TableHead className="text-primary font-semibold">Invitation Code</TableHead>
                  <TableHead className="text-primary font-semibold">Status</TableHead>
                  <TableHead className="text-primary font-semibold">Expires</TableHead>
                  <TableHead className="text-right text-primary font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id} className="border-border/30 hover:bg-primary/5">
                    <TableCell className="font-medium text-foreground">{invitation.invited_email}</TableCell>
                    <TableCell>
                      {invitation.status === 'pending' ? (
                        <Select
                          value={invitation.role}
                          onValueChange={(newRole) => handleRoleChange(invitation.id, newRole as 'member' | 'leader')}
                        >
                          <SelectTrigger className="w-24 h-8 bg-background/50 text-foreground/80">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="leader">Leader</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="capitalize text-foreground/80">{invitation.role}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-mono">
                          {invitation.invitation_code}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyInviteCode(invitation.invitation_code)}
                          title="Copy code"
                          className="h-7 w-7 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyInviteLink(invitation.invitation_code)}
                          title="Copy invitation link"
                          className="h-7 w-7 p-0 text-primary"
                        >
                          <Link2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invitation.status, invitation.expires_at)}
                    </TableCell>
                    <TableCell className="text-foreground/70">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {invitation.status === 'pending' && new Date(invitation.expires_at) < new Date() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRenewInvitation(invitation.id)}
                            title="Renew invitation for 30 days"
                            className="text-primary hover:text-primary/80"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        {invitation.status === 'pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteInvitation(invitation.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
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
