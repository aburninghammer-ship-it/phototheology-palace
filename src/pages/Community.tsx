import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Heart, Users, Reply, Send, Sparkles, Pencil, Trash2, Filter } from "lucide-react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { communityPostSchema } from "@/lib/validationSchemas";
import { sanitizeHtml } from "@/lib/sanitize";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserMasterySword } from "@/components/mastery/UserMasterySword";

type SortOption = "latest" | "most_commented" | "needs_feedback";
type CategoryFilter = "all" | "general" | "prayer" | "study" | "questions";

const Community = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { activeCount, activeUsers } = useActiveUsers();
  const [posts, setPosts] = useState<any[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<string>("general");
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<Record<string, string | null>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");

  useEffect(() => {
    if (user && user.id) {
      fetchPosts();

      const postsChannel = supabase
        .channel("community_posts_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
          fetchPosts();
        })
        .subscribe();

      const commentsChannel = supabase
        .channel("community_comments_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "community_comments" }, () => {
          fetchPosts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(postsChannel);
        supabase.removeChannel(commentsChannel);
      };
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          profiles:user_id(username, display_name, avatar_url)
        `)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error loading posts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Fetched posts with profiles:', data);
      setPosts(data || []);
      
      // Fetch comments for all posts
      if (data && data.length > 0) {
        const postIds = data.map(p => p.id);
        const { data: commentsData, error: commentsError } = await supabase
          .from("community_comments")
          .select(`
            *,
            profiles:user_id(username, display_name, avatar_url)
          `)
          .in("post_id", postIds)
          .order("created_at", { ascending: true });
        
        console.log('Fetched comments with profiles:', commentsData);
        
        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          toast({
            title: "Error loading comments",
            description: commentsError.message,
            variant: "destructive",
          });
          return;
        }
        
        if (commentsData) {
          const commentsByPost: Record<string, any[]> = {};
          commentsData.forEach(comment => {
            if (!commentsByPost[comment.post_id]) {
              commentsByPost[comment.post_id] = [];
            }
            commentsByPost[comment.post_id].push(comment);
          });
          console.log('Comments organized by post:', commentsByPost);
          setComments(commentsByPost);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const createPost = async () => {
    try {
      // Validate input
      const validatedData = communityPostSchema.parse({
        title: newTitle,
        content: newContent,
        category: newCategory
      });

      // Sanitize content before storing
      const sanitizedTitle = sanitizeHtml(validatedData.title);
      const sanitizedContent = sanitizeHtml(validatedData.content);

      const { error } = await supabase
        .from("community_posts")
        .insert({
          user_id: user!.id,
          title: sanitizedTitle,
          content: sanitizedContent,
          category: validatedData.category,
        });

      if (error) throw error;

      toast({
        title: "Post created!",
        description: "Your post is now live.",
      });

      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setShowNewPost(false);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid input",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  const addComment = async (postId: string, parentCommentId: string | null = null) => {
    const content = newComment[postId];
    if (!content?.trim()) return;

    try {
      const sanitizedContent = sanitizeHtml(content);
      
      const { data, error } = await supabase
        .from("community_comments")
        .insert({
          post_id: postId,
          user_id: user!.id,
          content: sanitizedContent,
          parent_comment_id: parentCommentId,
        })
        .select();

      if (error) throw error;

      toast({
        title: parentCommentId ? "Reply added!" : "Comment added!",
      });

      setNewComment({ ...newComment, [postId]: "" });
      setReplyingTo({ ...replyingTo, [postId]: null });
      
      // Wait a moment for realtime to propagate, then refetch
      setTimeout(() => {
        fetchPosts();
      }, 500);
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    console.log('Delete button clicked for comment:', commentId);
    console.log('Current user ID:', user?.id);
    
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId);

      if (error) {
        console.error('Delete error details:', error);
        throw error;
      }

      toast({
        title: "Comment deleted",
      });

      fetchPosts();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Error deleting comment",
        description: error.message || "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  const startEditComment = (commentId: string, content: string) => {
    console.log('Edit button clicked for comment:', commentId);
    console.log('Current user ID:', user?.id);
    setEditingComment(commentId);
    setEditContent(content);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const saveEditComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const sanitizedContent = sanitizeHtml(editContent);
      
      const { error } = await supabase
        .from("community_comments")
        .update({ content: sanitizedContent })
        .eq("id", commentId);

      if (error) {
        console.error('Update error details:', error);
        throw error;
      }

      toast({
        title: "Comment updated",
      });

      setEditingComment(null);
      setEditContent("");
      fetchPosts();
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast({
        title: "Error updating comment",
        description: error.message || "Failed to update comment",
        variant: "destructive",
      });
    }
  };

  const organizeComments = (comments: any[]) => {
    const topLevel = comments.filter(c => !c.parent_comment_id);
    const replies = comments.filter(c => c.parent_comment_id);
    
    const commentMap = new Map();
    topLevel.forEach(c => {
      commentMap.set(c.id, { ...c, replies: [] });
    });
    
    replies.forEach(reply => {
      const parent = commentMap.get(reply.parent_comment_id);
      if (parent) {
        parent.replies.push(reply);
      }
    });
    
    return Array.from(commentMap.values());
  };

  const getFilteredAndSortedPosts = () => {
    let filtered = posts;

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    // Sort posts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "most_commented":
          return (comments[b.id]?.length || 0) - (comments[a.id]?.length || 0);
        case "needs_feedback":
          const aHasComments = (comments[a.id]?.length || 0) > 0;
          const bHasComments = (comments[b.id]?.length || 0) > 0;
          if (aHasComments === bHasComments) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return aHasComments ? 1 : -1;
        case "latest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sorted;
  };

  if (!user) return null;

  const filteredPosts = getFilteredAndSortedPosts();
  const needsFeedbackCount = posts.filter(p => (comments[p.id]?.length || 0) === 0).length;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-background p-8 border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-bold flex items-center gap-3 mb-2">
                    <Sparkles className="h-10 w-10 text-primary" />
                    Community Hub
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Connect, share insights, and grow together in faith
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {needsFeedbackCount > 0 && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {needsFeedbackCount} posts need feedback
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {activeCount} active now
                    </Badge>
                  </div>
                </div>
                <Button onClick={() => setShowNewPost(!showNewPost)} size="lg" className="shadow-lg">
                  <Plus className="mr-2 h-5 w-5" />
                  New Post
                </Button>
              </div>
            </div>
          </div>

          {/* Who's Online Section */}
          {activeUsers.length > 0 && (
            <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Active Now ({activeCount})
                </CardTitle>
              </div>
              <CardDescription>Connect with members online</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeUsers.map((activeUser) => {
                  const isCurrentUser = activeUser.id === user.id;
                  return (
                    <button
                      key={activeUser.id}
                      onClick={() => {
                        if (isCurrentUser) return; // Prevent clicking on own profile
                        window.dispatchEvent(
                          new CustomEvent('open-chat-sidebar', {
                            detail: { userId: activeUser.id }
                          })
                        );
                        toast({
                          title: "Opening chat",
                          description: `Starting conversation with ${activeUser.display_name || activeUser.username}`,
                        });
                      }}
                      className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 border border-primary/10 ${
                        isCurrentUser 
                          ? 'bg-primary/20 cursor-default' 
                          : 'bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 cursor-pointer'
                      }`}
                    >
                      <Avatar className="h-7 w-7 border-2 border-primary/20">
                        <AvatarImage src={activeUser.avatar_url || undefined} />
                        <AvatarFallback className="text-xs bg-primary/10">
                          {(activeUser.display_name || activeUser.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <UserMasterySword 
                        masterTitle={activeUser.master_title} 
                        currentFloor={activeUser.current_floor}
                        size="sm"
                        isOwner={activeUser.id === 'a0e64f17-c9f0-4f71-ac72-d1ca52c8b99b'}
                      />
                      <span className="text-sm font-medium">
                        {activeUser.display_name || activeUser.username}
                      </span>
                      {!isCurrentUser && <MessageSquare className="h-3.5 w-3.5 text-primary" />}
                    </button>
                  );
                })}
                </div>
              </CardContent>
            </Card>
          )}

          {showNewPost && (
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Create New Post
                </CardTitle>
                <CardDescription>Share your insights with the community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Input
                  placeholder="Give your post a title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={200}
                  className="text-lg font-medium"
                />
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Discussion</SelectItem>
                    <SelectItem value="prayer">Prayer Requests</SelectItem>
                    <SelectItem value="study">Bible Study</SelectItem>
                    <SelectItem value="questions">Questions</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your thoughts, insights, or questions... (emojis supported 😊)"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={6}
                    maxLength={10000}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {newContent.length}/10,000 characters
                    </p>
                    <EmojiPicker 
                      onEmojiSelect={(emoji) => setNewContent(newContent + emoji)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createPost} size="lg" className="flex-1">
                    <Send className="mr-2 h-4 w-4" />
                    Publish Post
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Sort */}
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filter & Sort</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)} className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                      <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                      <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
                      <TabsTrigger value="prayer" className="text-xs">Prayer</TabsTrigger>
                      <TabsTrigger value="study" className="text-xs">Study</TabsTrigger>
                      <TabsTrigger value="questions" className="text-xs">Questions</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest First</SelectItem>
                      <SelectItem value="most_commented">Most Commented</SelectItem>
                      <SelectItem value="needs_feedback">Needs Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">No posts yet</p>
                  <p className="text-muted-foreground mb-4">
                    {categoryFilter !== "all" 
                      ? `No posts in the ${categoryFilter} category yet.`
                      : "Be the first to share something with the community!"}
                  </p>
                  {categoryFilter !== "all" && (
                    <Button variant="outline" onClick={() => setCategoryFilter("all")}>
                      View All Posts
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => {
              const postComments = organizeComments(comments[post.id] || []);
              const isExpanded = expandedPosts[post.id];
              
              return (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarImage src={post.profiles?.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10">
                            {(post.profiles?.display_name || post.profiles?.username || user?.email || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle className="text-xl">{post.title}</CardTitle>
                            {postComments.length === 0 && (
                              <Badge variant="secondary" className="flex items-center gap-1 text-xs animate-pulse">
                                <Sparkles className="h-3 w-3" />
                                Needs feedback
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium">{post.profiles?.display_name || post.profiles?.username || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </CardDescription>
                        </div>
                      </div>
                      {post.category && (
                        <Badge variant="secondary" className="capitalize">{post.category}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-6 text-sm">
                      <button className="flex items-center gap-2 hover:text-primary transition-colors group">
                        <Heart className="h-4 w-4 group-hover:fill-primary" />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      <button 
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        onClick={() => setExpandedPosts({ ...expandedPosts, [post.id]: !isExpanded })}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">{postComments.length} {postComments.length === 1 ? 'Comment' : 'Comments'}</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <>
                        <Separator />
                        
                        {/* Comments Section */}
                        {postComments.length > 0 && (
                          <div className="space-y-4">
                            {postComments.map((comment) => (
                              <div key={comment.id} className="space-y-3">
                                {/* Top-level Comment */}
                                  <div className="bg-accent/20 rounded-xl p-4 hover:bg-accent/30 transition-colors">
                                   <div className="flex items-start gap-3">
                                     <Avatar className="h-8 w-8 border border-primary/20">
                                       <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                                       <AvatarFallback className="text-xs bg-primary/10">
                                         {(comment.profiles?.display_name || comment.profiles?.username || 'U').charAt(0).toUpperCase()}
                                       </AvatarFallback>
                                     </Avatar>
                                     <div className="flex-1 space-y-2">
                                       <div className="flex items-center gap-2">
                                         <span className="text-sm font-semibold">
                                           {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
                                         </span>
                                         <span className="text-xs text-muted-foreground">
                                           {new Date(comment.created_at).toLocaleDateString('en-US', { 
                                             month: 'short', 
                                             day: 'numeric',
                                             hour: '2-digit',
                                             minute: '2-digit'
                                           })}
                                         </span>
                                       </div>
                                       {editingComment === comment.id ? (
                                         <div className="space-y-2">
                                           <Textarea
                                             value={editContent}
                                             onChange={(e) => setEditContent(e.target.value)}
                                             rows={3}
                                             className="text-sm"
                                           />
                                           <div className="flex gap-2">
                                             <Button
                                               size="sm"
                                               onClick={() => saveEditComment(comment.id)}
                                             >
                                               Save
                                             </Button>
                                             <Button
                                               size="sm"
                                               variant="ghost"
                                               onClick={cancelEditComment}
                                             >
                                               Cancel
                                             </Button>
                                           </div>
                                         </div>
                                       ) : (
                                         <>
                                           <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                           <div className="flex items-center gap-2">
                                             <Button
                                               variant="ghost"
                                               size="sm"
                                               className="h-7 px-2 text-xs"
                                               onClick={() => setReplyingTo({ ...replyingTo, [post.id]: comment.id })}
                                             >
                                               <Reply className="h-3 w-3 mr-1" />
                                               Reply
                                             </Button>
                                             {comment.user_id === user?.id && (
                                               <>
                                                 <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   className="h-7 px-2 text-xs"
                                                   onClick={() => startEditComment(comment.id, comment.content)}
                                                 >
                                                   <Pencil className="h-3 w-3 mr-1" />
                                                   Edit
                                                 </Button>
                                                 <Button
                                                   variant="ghost"
                                                   size="sm"
                                                   className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                                   onClick={() => deleteComment(comment.id)}
                                                 >
                                                   <Trash2 className="h-3 w-3 mr-1" />
                                                   Delete
                                                 </Button>
                                               </>
                                             )}
                                           </div>
                                         </>
                                       )}
                                     </div>
                                   </div>
                                 </div>

                                {/* Nested Replies */}
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="ml-12 space-y-3">
                                    {comment.replies.map((reply: any) => (
                                       <div key={reply.id} className="bg-accent/10 rounded-lg p-3 border-l-2 border-primary/20">
                                         <div className="flex items-start gap-2">
                                           <Avatar className="h-7 w-7">
                                             <AvatarImage src={reply.profiles?.avatar_url || undefined} />
                                             <AvatarFallback className="text-xs bg-primary/10">
                                               {(reply.profiles?.display_name || reply.profiles?.username || 'U').charAt(0).toUpperCase()}
                                             </AvatarFallback>
                                           </Avatar>
                                           <div className="flex-1 space-y-1">
                                             <div className="flex items-center gap-2">
                                               <span className="text-xs font-semibold">
                                                 {reply.profiles?.display_name || reply.profiles?.username || 'Anonymous'}
                                               </span>
                                               <span className="text-xs text-muted-foreground">
                                                 {new Date(reply.created_at).toLocaleDateString('en-US', { 
                                                   month: 'short', 
                                                   day: 'numeric',
                                                   hour: '2-digit',
                                                   minute: '2-digit'
                                                 })}
                                               </span>
                                             </div>
                                             {editingComment === reply.id ? (
                                               <div className="space-y-2">
                                                 <Textarea
                                                   value={editContent}
                                                   onChange={(e) => setEditContent(e.target.value)}
                                                   rows={2}
                                                   className="text-xs"
                                                 />
                                                 <div className="flex gap-2">
                                                   <Button
                                                     size="sm"
                                                     onClick={() => saveEditComment(reply.id)}
                                                   >
                                                     Save
                                                   </Button>
                                                   <Button
                                                     size="sm"
                                                     variant="ghost"
                                                     onClick={cancelEditComment}
                                                   >
                                                     Cancel
                                                   </Button>
                                                 </div>
                                               </div>
                                             ) : (
                                               <>
                                                 <p className="text-xs leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                                 {reply.user_id === user?.id && (
                                                   <div className="flex items-center gap-2 mt-1">
                                                     <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       className="h-6 px-2 text-xs"
                                                       onClick={() => startEditComment(reply.id, reply.content)}
                                                     >
                                                       <Pencil className="h-2.5 w-2.5 mr-1" />
                                                       Edit
                                                     </Button>
                                                     <Button
                                                       variant="ghost"
                                                       size="sm"
                                                       className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                                                       onClick={() => deleteComment(reply.id)}
                                                     >
                                                       <Trash2 className="h-2.5 w-2.5 mr-1" />
                                                       Delete
                                                     </Button>
                                                   </div>
                                                 )}
                                               </>
                                             )}
                                           </div>
                                         </div>
                                       </div>
                                    ))}
                                  </div>
                                )}

                                {/* Reply Input for this comment */}
                                {replyingTo[post.id] === comment.id && (
                                  <div className="ml-12 flex gap-2">
                                    <Textarea
                                      placeholder={`Reply to ${comment.profiles?.display_name || comment.profiles?.username}...`}
                                      value={newComment[post.id] || ""}
                                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                      rows={2}
                                      className="flex-1 text-sm"
                                    />
                                    <div className="flex flex-col gap-1">
                                      <Button 
                                        size="sm"
                                        onClick={() => addComment(post.id, comment.id)}
                                        disabled={!newComment[post.id]?.trim()}
                                      >
                                        <Send className="h-3 w-3" />
                                      </Button>
                                      <Button 
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setReplyingTo({ ...replyingTo, [post.id]: null })}
                                      >
                                        ✕
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add New Comment */}
                        {!replyingTo[post.id] && (
                          <div className="flex gap-3 pt-2">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10">
                                {(user?.email || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 flex gap-2">
                              <Textarea
                                placeholder="Share your thoughts..."
                                value={newComment[post.id] || ""}
                                onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                                rows={2}
                                className="flex-1"
                              />
                              <Button 
                                onClick={() => addComment(post.id)}
                                disabled={!newComment[post.id]?.trim()}
                                size="sm"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              );
              })
            )}
          </div>

          {posts.length === 0 && !showNewPost && (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your thoughts with the community!
                </p>
                <Button onClick={() => setShowNewPost(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
