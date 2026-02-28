import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Send, Loader2, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface TagFriendButtonProps {
  pageTitle?: string;
  pageDescription?: string;
  pageUrl?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

interface UserProfile {
  id: string;
  display_name: string | null;
  full_name: string | null;
  email?: string;
}

export const TagFriendButton = ({
  pageTitle,
  pageDescription,
  pageUrl,
  variant = "outline",
  size = "default",
  className,
}: TagFriendButtonProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserProfile[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // Get current page info
  const currentPageUrl = pageUrl || window.location.href;
  const currentPageTitle = pageTitle || document.title || "Check out this page!";
  const currentPageDescription = pageDescription || "";

  // Load users when dialog opens
  useEffect(() => {
    if (open && allUsers.length === 0) {
      loadUsers();
    }
  }, [open]);

  // Filter users based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(allUsers);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        allUsers.filter(
          (u) =>
            u.display_name?.toLowerCase().includes(query) ||
            u.full_name?.toLowerCase().includes(query) ||
            u.email?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, allUsers]);

  const loadUsers = async () => {
    if (!user) return;

    setSearching(true);
    try {
      // Get all profiles except current user - only include users with display names
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name")
        .neq("id", user.id)
        .not("display_name", "is", null)
        .neq("display_name", "")
        .limit(100);

      if (error) throw error;

      const mapped = (data || []).map((d: any) => ({ id: d.id, display_name: d.display_name, full_name: d.display_name }));
      setAllUsers(mapped);
      setFilteredUsers(mapped);
    } catch (error: any) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setSearching(false);
    }
  };

  const toggleUser = (userProfile: UserProfile) => {
    setSelectedUsers((prev) =>
      prev.find((u) => u.id === userProfile.id)
        ? prev.filter((u) => u.id !== userProfile.id)
        : [...prev, userProfile]
    );
  };

  const handleSend = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one friend to tag");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to tag friends");
      return;
    }

    setLoading(true);
    try {
      const { data: senderProfile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle();

      const senderName = senderProfile?.display_name || "Someone";

      // Create feature_tags for each selected user
      const tags = selectedUsers.map((recipient) => ({
        sender_id: user.id,
        recipient_id: recipient.id,
        feature_path: currentPageUrl,
        feature_label: currentPageTitle,
        message: message.trim() || `${senderName} wants you to check this out!`,
      }));

      const { error } = await supabase.from("feature_tags").insert(tags);

      if (error) throw error;

      toast.success(`Tagged ${selectedUsers.length} ${selectedUsers.length === 1 ? "friend" : "friends"}!`);

      // Reset and close
      setSelectedUsers([]);
      setMessage("");
      setSearchQuery("");
      setOpen(false);
    } catch (error: any) {
      console.error("Error tagging friends:", error?.message || error?.code || JSON.stringify(error));
      toast.error(error?.message || "Failed to tag friends");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <UserPlus className="h-4 w-4 mr-2" />
          Tag Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tag Friends</DialogTitle>
          <DialogDescription>
            Notify friends to check out: <strong>{currentPageTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-lg">
              {selectedUsers.map((u) => (
                <Badge
                  key={u.id}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer hover:bg-destructive/20"
                  onClick={() => toggleUser(u)}
                >
                  {u.display_name || u.full_name || "User"}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          )}

          {/* User List */}
          <ScrollArea className="h-[200px] border rounded-lg p-2">
            {searching ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                {searchQuery ? "No users found" : "No users available"}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredUsers.map((u) => {
                  const isSelected = selectedUsers.find((su) => su.id === u.id);
                  return (
                    <button
                      key={u.id}
                      onClick={() => toggleUser(u)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {u.display_name || u.full_name || "User"}
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Optional Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Add a message (optional)</label>
            <Textarea
              placeholder="Tell them why you're sharing this..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={loading || selectedUsers.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Tag {selectedUsers.length > 0 ? `${selectedUsers.length} ` : ""}Friend
                {selectedUsers.length !== 1 ? "s" : ""}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
