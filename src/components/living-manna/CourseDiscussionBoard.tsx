import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Plus, Pin, Reply, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Discussion {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  replies?: DiscussionReply[];
}

interface DiscussionReply {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface CourseDiscussionBoardProps {
  courseId: string;
  courseType: string;
  churchId?: string;
  courseName?: string;
}

export function CourseDiscussionBoard({ courseId, courseType, churchId, courseName }: CourseDiscussionBoardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [newDiscussion, setNewDiscussion] = useState({ title: "", content: "" });

  useEffect(() => {
    loadDiscussions();
  }, [courseId, courseType]);

  const loadDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from("course_discussions")
        .select("*")
        .eq("course_id", courseId)
        .eq("course_type", courseType)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Load profiles and replies for each discussion
      const discussionsWithData = await Promise.all(
        (data || []).map(async (discussion) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, display_name, avatar_url")
            .eq("id", discussion.user_id)
            .single();
          
          const { data: replies } = await supabase
            .from("course_discussion_replies")
            .select("*")
            .eq("discussion_id", discussion.id)
            .order("created_at", { ascending: true });

          // Load profiles for replies
          const repliesWithProfiles = await Promise.all(
            (replies || []).map(async (reply) => {
              const { data: replyProfile } = await supabase
                .from("profiles")
                .select("username, display_name, avatar_url")
                .eq("id", reply.user_id)
                .single();
              return { ...reply, profiles: replyProfile };
            })
          );

          return { ...discussion, profiles: profile, replies: repliesWithProfiles };
        })
      );

      setDiscussions(discussionsWithData as Discussion[]);
    } catch (error: any) {
      toast({
        title: "Error loading discussions",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async () => {
    if (!newDiscussion.title || !newDiscussion.content) {
      toast({
        title: "Missing fields",
        description: "Please enter a title and content",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from("course_discussions")
        .insert({
          course_id: courseId,
          course_type: courseType,
          church_id: churchId || null,
          user_id: user?.id,
          title: newDiscussion.title,
          content: newDiscussion.content,
        });

      if (error) throw error;
      toast({ title: "Discussion created" });
      setShowNewForm(false);
      setNewDiscussion({ title: "", content: "" });
      loadDiscussions();
    } catch (error: any) {
      toast({
        title: "Error creating discussion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const addReply = async (discussionId: string) => {
    if (!replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from("course_discussion_replies")
        .insert({
          discussion_id: discussionId,
          user_id: user?.id,
          content: replyContent,
        });

      if (error) throw error;
      setReplyContent("");
      loadDiscussions();
    } catch (error: any) {
      toast({
        title: "Error adding reply",
        description: error.message,
        variant: "destructive",
      });
    }
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

  return (
    <Card variant="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">
              Discussion Board
              {courseName && <span className="text-muted-foreground font-normal"> — {courseName}</span>}
            </CardTitle>
          </div>
          <Button size="sm" onClick={() => setShowNewForm(!showNewForm)}>
            <Plus className="h-4 w-4 mr-1" />
            New Topic
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New Discussion Form */}
        {showNewForm && (
          <Card className="border-primary/20">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Discussion title..."
                value={newDiscussion.title}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
              />
              <Textarea
                placeholder="What would you like to discuss?"
                value={newDiscussion.content}
                onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                rows={3}
              />
              <div className="flex gap-2">
                <Button onClick={createDiscussion} disabled={creating}>
                  {creating ? "Creating..." : "Post Discussion"}
                </Button>
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussions List */}
        <ScrollArea className="h-[500px]">
          {discussions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No discussions yet. Start a conversation!
            </div>
          ) : (
            <div className="space-y-3">
              {discussions.map((discussion) => {
                const isExpanded = expandedId === discussion.id;
                const replyCount = discussion.replies?.length || 0;
                const displayName = discussion.profiles?.display_name || discussion.profiles?.username || "Anonymous";

                return (
                  <Card key={discussion.id} className={discussion.is_pinned ? "border-primary/30" : ""}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={discussion.profiles?.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {displayName[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {discussion.is_pinned && (
                              <Pin className="h-3 w-3 text-primary" />
                            )}
                            <h4 className="font-medium">{discussion.title}</h4>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{displayName}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {discussion.content}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 h-7 text-xs"
                            onClick={() => setExpandedId(isExpanded ? null : discussion.id)}
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            {replyCount} {replyCount === 1 ? "reply" : "replies"}
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3 ml-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 ml-1" />
                            )}
                          </Button>

                          {/* Replies */}
                          {isExpanded && (
                            <div className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
                              {discussion.replies?.map((reply) => {
                                const replyName = reply.profiles?.display_name || reply.profiles?.username || "Anonymous";
                                return (
                                  <div key={reply.id} className="flex items-start gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                                      <AvatarFallback className="text-[10px]">
                                        {replyName[0]?.toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-1 text-xs">
                                        <span className="font-medium">{replyName}</span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-muted-foreground">
                                          {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                        </span>
                                      </div>
                                      <p className="text-sm mt-1">{reply.content}</p>
                                    </div>
                                  </div>
                                );
                              })}

                              {/* Reply Input */}
                              <div className="flex gap-2 pt-2">
                                <Input
                                  placeholder="Write a reply..."
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      addReply(discussion.id);
                                    }
                                  }}
                                  className="text-sm"
                                />
                                <Button size="sm" onClick={() => addReply(discussion.id)}>
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
