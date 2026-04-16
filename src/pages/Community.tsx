import { useEffect, useState, useMemo, useRef } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { COMMUNITY_TOUR } from "@/data/guidedTours";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { MessageSquare, Plus, Users, Reply, Send, Sparkles, Pencil, Trash2, Filter, Flame, TrendingUp, GraduationCap } from "lucide-react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { communityPostSchema } from "@/lib/validationSchemas";
import { sanitizeHtml } from "@/lib/sanitize";
import { useContentModeration } from "@/hooks/useContentModeration";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserMasterySword } from "@/components/mastery/UserMasterySword";
import { CommunitySearch } from "@/components/community/CommunitySearch";
import { CommunityGuidelines } from "@/components/community/CommunityGuidelines";
import { CommunityNotifications } from "@/components/community/CommunityNotifications";
import { SharedContentCard } from "@/components/community/SharedContentCard";
import { TagInput } from "@/components/community/TagInput";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { QuickPostBar } from "@/components/community/QuickPostBar";
import { DailyChallengeBanner } from "@/components/community/DailyChallengeBanner";
import { WeeklySpotlight } from "@/components/community/WeeklySpotlight";

type SortOption = "latest" | "most_commented" | "needs_feedback" | "trending";
type CategoryFilter = "all" | "general" | "prayer" | "study" | "questions";

const Community = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { activeCount, activeUsers } = useActiveUsers();
  const { moderateContent, moderating } = useContentModeration();
  const [posts, setPosts] = useState<any[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<string>("general");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [replyingTo, setReplyingTo] = useState<Record<string, string | null>>({});
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [editPostTitle, setEditPostTitle] = useState<string>("");
  const [editPostContent, setEditPostContent] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());
  const [tourOpen, setTourOpen] = useState(false);
  const [firstComments, setFirstComments] = useState<Record<string, any>>({});
  const newPostFormRef = useRef<HTMLDivElement>(null);

  // Extract all unique tags from posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      (post.tags || []).forEach((tag: string) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Handle highlight from URL (when navigating from notification)
  useEffect(() => {
    const highlightPostId = searchParams.get("post");
    if (highlightPostId) {
      setExpandedPosts(prev => ({ ...prev, [highlightPostId]: true }));
    }
  }, [searchParams]);

  // Fetch user's existing likes on mount
  useEffect(() => {
    if (!user?.id) return;
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("community_post_likes")
        .select("post_id")
        .eq("user_id", user.id);
      if (data) {
        setLikedPostIds(new Set(data.map(d => d.post_id)));
      }
    };
    fetchLikes();
  }, [user?.id]);

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
          profiles:user_id(username, display_name, avatar_url, master_title, current_floor, daily_study_streak)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: t('community.errorLoadingPosts'),
          description: error.message,
          variant: "destructive",
        });
        return;
      }

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

        if (commentsError) {
          console.error('Error fetching comments:', commentsError);
          toast({
            title: t('community.errorLoadingComments'),
            description: commentsError.message,
            variant: "destructive",
          });
          return;
        }

        if (commentsData) {
          const commentsByPost: Record<string, any[]> = {};
          const firstByPost: Record<string, any> = {};
          commentsData.forEach(comment => {
            if (!commentsByPost[comment.post_id]) {
              commentsByPost[comment.post_id] = [];
            }
            commentsByPost[comment.post_id].push(comment);
            // Track first top-level comment per post
            if (!comment.parent_comment_id && !firstByPost[comment.post_id]) {
              firstByPost[comment.post_id] = comment;
            }
          });
          setComments(commentsByPost);
          setFirstComments(firstByPost);
        }
      }
    } catch (error: any) {
      console.error('Unexpected error fetching posts:', error);
      toast({
        title: t('common.error'),
        description: t('community.failedToLoadData'),
        variant: "destructive",
      });
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user?.id) return;
    const isCurrentlyLiked = likedPostIds.has(postId);

    // Optimistic update
    setLikedPostIds(prev => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });

    try {
      if (isCurrentlyLiked) {
        await supabase
          .from("community_post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
      } else {
        await supabase
          .from("community_post_likes")
          .insert({ post_id: postId, user_id: user.id, reaction_type: "love" });
      }
    } catch (error) {
      // Revert on error
      setLikedPostIds(prev => {
        const next = new Set(prev);
        if (isCurrentlyLiked) {
          next.add(postId);
        } else {
          next.delete(postId);
        }
        return next;
      });
      console.error("Error toggling like:", error);
    }
  };

  const handleQuickPost = (category: string, tags?: string[]) => {
    setNewCategory(category);
    if (tags) setNewTags(tags);
    setShowNewPost(true);
    setTimeout(() => {
      newPostFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
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

      // Moderate content before posting
      const contentToCheck = `${sanitizedTitle} ${sanitizedContent}`;
      const isAllowed = await moderateContent(contentToCheck);
      if (!isAllowed) return;

      const { error } = await supabase
        .from("community_posts")
        .insert([
          {
            user_id: user!.id,
            title: sanitizedTitle,
            content: sanitizedContent,
            category: validatedData.category,
            tags: newTags,
          },
        ]);

      if (error) throw error;

      toast({
        title: t('community.postCreated'),
        description: t('community.postNowLive'),
      });

      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setNewTags([]);
      setShowNewPost(false);

      fetchPosts();
    } catch (error: any) {
      if (error.name === "ZodError") {
        toast({
          title: t('community.validationError'),
          description: error.errors[0]?.message || t('community.invalidInput'),
          variant: "destructive",
        });
      } else {
        toast({
          title: t('common.error'),
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

      const isAllowed = await moderateContent(sanitizedContent);
      if (!isAllowed) return;
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
        title: parentCommentId ? t('community.replyAdded') : t('community.commentAdded'),
      });

      setNewComment({ ...newComment, [postId]: "" });
      setReplyingTo({ ...replyingTo, [postId]: null });

      setTimeout(() => {
        fetchPosts();
      }, 500);
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      toast({ title: t('community.commentDeleted') });
      fetchPosts();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast({
        title: t('community.errorDeletingComment'),
        description: error.message || t('community.failedToDeleteComment'),
        variant: "destructive",
      });
    }
  };

  const startEditComment = (commentId: string, content: string) => {
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
        title: t('common.error'),
        description: t('community.commentCannotBeEmpty'),
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

      if (error) throw error;

      toast({ title: t('community.commentUpdated') });
      setEditingComment(null);
      setEditContent("");
      fetchPosts();
    } catch (error: any) {
      console.error('Error updating comment:', error);
      toast({
        title: t('community.errorUpdatingComment'),
        description: error.message || t('community.failedToUpdateComment'),
        variant: "destructive",
      });
    }
  };

  const startEditPost = (post: any) => {
    setEditingPost(post.id);
    setEditPostTitle(post.title);
    setEditPostContent(post.content);
  };

  const cancelEditPost = () => {
    setEditingPost(null);
    setEditPostTitle("");
    setEditPostContent("");
  };

  const saveEditPost = async (postId: string) => {
    if (!editPostTitle.trim() || !editPostContent.trim()) {
      toast({
        title: t('common.error'),
        description: t('community.titleAndContentRequired'),
        variant: "destructive",
      });
      return;
    }

    try {
      const sanitizedTitle = sanitizeHtml(editPostTitle);
      const sanitizedContent = sanitizeHtml(editPostContent);

      const isAllowed = await moderateContent(`${sanitizedTitle} ${sanitizedContent}`);
      if (!isAllowed) return;

      const { error } = await supabase
        .from("community_posts")
        .update({
          title: sanitizedTitle,
          content: sanitizedContent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId)
        .eq("user_id", user!.id);

      if (error) throw error;

      toast({
        title: t('community.postUpdated'),
        description: t('community.postUpdatedDescription'),
      });

      setEditingPost(null);
      setEditPostTitle("");
      setEditPostContent("");
      fetchPosts();
    } catch (error: any) {
      console.error("Error updating post:", error);
      toast({
        title: t('community.errorUpdatingPost'),
        description: error.message || t('community.failedToUpdatePost'),
        variant: "destructive",
      });
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post? This will also delete all comments.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user!.id);

      if (error) throw error;

      toast({
        title: t('community.postDeleted'),
        description: t('community.postDeletedDescription'),
      });

      fetchPosts();
    } catch (error: any) {
      console.error("Error deleting post:", error);
      toast({
        title: t('community.errorDeletingPost'),
        description: error.message || t('community.failedToDeletePost'),
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

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.content?.toLowerCase().includes(query)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p =>
        selectedTags.some(tag => (p.tags || []).includes(tag))
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (p) =>
          p.category === categoryFilter ||
          (categoryFilter === "questions" && p.category === "question")
      );
    }

    // Sort posts
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "most_commented":
          return (comments[b.id]?.length || 0) - (comments[a.id]?.length || 0);
        case "needs_feedback": {
          const aHasComments = (comments[a.id]?.length || 0) > 0;
          const bHasComments = (comments[b.id]?.length || 0) > 0;
          if (aHasComments === bHasComments) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return aHasComments ? 1 : -1;
        }
        case "trending": {
          // Sort by likes count (most liked first), then recency
          const aLikes = a.likes_count ?? a.likes ?? 0;
          const bLikes = b.likes_count ?? b.likes ?? 0;
          if (bLikes !== aLikes) return bLikes - aLikes;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        case "latest":
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return sorted;
  };

  const handleNavigateToPost = (postId: string) => {
    setExpandedPosts(prev => ({ ...prev, [postId]: true }));
    setTimeout(() => {
      const element = document.getElementById(`post-${postId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  if (!user) return null;

  const filteredPosts = getFilteredAndSortedPosts();
  const needsFeedbackCount = posts.filter(p => (comments[p.id]?.length || 0) === 0).length;
  const unansweredPrayers = posts.filter(p => p.category === "prayer" && (comments[p.id]?.length || 0) === 0).length;
  const unansweredQuestions = posts.filter(p => (p.category === "questions" || p.category === "question") && (comments[p.id]?.length || 0) === 0).length;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <Navigation />
      {tourOpen && <GuidedTourOverlay steps={COMMUNITY_TOUR} onClose={() => setTourOpen(false)} />}
      {user && <CommunityGuidelines userId={user.id} />}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header — Palace Lounge */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-amber-500/10 p-8 border border-border/50 backdrop-blur-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src="/pwa-192x192.png"
                    alt="Phototheology"
                    className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
                  />
                  <div>
                    <h1 className="text-5xl font-bold flex items-center gap-3 mb-2">
                      <Sparkles className="h-10 w-10 text-primary" />
                      The Palace Lounge
                    </h1>
                  <p className="text-muted-foreground text-lg">
                    Where iron sharpens iron
                  </p>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    {unansweredPrayers > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1 border-purple-400/40 text-purple-500 bg-purple-500/5">
                        <span className="text-xs">{"\uD83D\uDD6F"}</span>
                        {unansweredPrayers} unanswered {unansweredPrayers === 1 ? "prayer" : "prayers"}
                      </Badge>
                    )}
                    {unansweredQuestions > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1 border-amber-400/40 text-amber-500 bg-amber-500/5">
                        <span className="text-xs">{"\uD83D\uDC8E"}</span>
                        {unansweredQuestions} unanswered {unansweredQuestions === 1 ? "question" : "questions"}
                      </Badge>
                    )}
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {t('community.activeNow', { count: activeCount })}
                    </Badge>
                  </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
                    <GraduationCap className="h-4 w-4" /> Tour
                  </Button>
                  {user && (
                    <CommunityNotifications
                      userId={user.id}
                      onNavigateToPost={handleNavigateToPost}
                    />
                  )}
                  <Button
                    onClick={() => {
                      const next = !showNewPost;
                      setShowNewPost(next);
                      if (next) {
                        setNewCategory(
                          categoryFilter === "all" ? "general" : categoryFilter
                        );
                        setTimeout(() => {
                          newPostFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 100);
                      }
                    }}
                    size="lg"
                    className="shadow-lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    {t('community.newPost')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Post Bar */}
          <QuickPostBar onQuickPost={handleQuickPost} />

          {/* Search & Tags */}
          <CommunitySearch
            onSearch={setSearchQuery}
            onTagFilter={setSelectedTags}
            selectedTags={selectedTags}
            availableTags={availableTags}
          />

          {/* Who's Online Section */}
          {activeUsers.length > 0 && (
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  {t('community.activeNowTitle', { count: activeCount })}
                </CardTitle>
              </div>
              <CardDescription>{t('community.connectWithMembers')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeUsers.map((activeUser) => {
                  const isCurrentUser = activeUser.id === user.id;
                  return (
                    <button
                      key={activeUser.id}
                      onClick={() => {
                        if (isCurrentUser) return;
                        window.dispatchEvent(
                          new CustomEvent('open-chat-sidebar', {
                            detail: { userId: activeUser.id }
                          })
                        );
                        toast({
                          title: t('community.openingChat'),
                          description: t('community.startingConversation', { name: activeUser.display_name || activeUser.username }),
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

          {/* Daily Challenge Banner */}
          <DailyChallengeBanner />

          {/* Weekly Spotlight */}
          <WeeklySpotlight />

          {showNewPost && (
            <Card ref={newPostFormRef} className="border-primary/20 shadow-lg bg-card/60 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  {t('community.createNewPost')}
                </CardTitle>
                <CardDescription>{t('community.shareInsights')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Input
                  placeholder={t('community.postTitlePlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={200}
                  className="text-lg font-medium"
                />
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('community.selectCategory')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{t('community.categoryGeneralDiscussion')}</SelectItem>
                    <SelectItem value="prayer">{t('community.categoryPrayerRequests')}</SelectItem>
                    <SelectItem value="study">{t('community.categoryBibleStudy')}</SelectItem>
                    <SelectItem value="questions">{t('community.categoryQuestions')}</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <label className="text-sm font-medium mb-2 block">{t('community.tagsOptional')}</label>
                  <TagInput tags={newTags} onChange={setNewTags} maxTags={5} />
                </div>
                <div className="space-y-2">
                  <Textarea
                    placeholder={t('community.shareThoughtsPlaceholder')}
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
                    {t('community.publishPost')}
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setShowNewPost(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters and Sort */}
          <Card className="border-primary/20 bg-card/40 backdrop-blur-md border-border/40">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('community.filterAndSort')}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)} className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-5 w-full sm:w-auto">
                      <TabsTrigger value="all" className="text-xs">{t('community.filterAll')}</TabsTrigger>
                      <TabsTrigger value="general" className="text-xs">{t('community.categoryGeneral')}</TabsTrigger>
                      <TabsTrigger value="prayer" className="text-xs">{t('community.categoryPrayer')}</TabsTrigger>
                      <TabsTrigger value="study" className="text-xs">{t('community.categoryStudy')}</TabsTrigger>
                      <TabsTrigger value="questions" className="text-xs">{t('community.categoryQuestions')}</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">{t('community.sortLatestFirst')}</SelectItem>
                      <SelectItem value="most_commented">{t('community.sortMostCommented')}</SelectItem>
                      <SelectItem value="needs_feedback">{t('community.sortNeedsFeedback')}</SelectItem>
                      <SelectItem value="trending">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Trending
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts List */}
          <div className="space-y-3">
            {filteredPosts.length === 0 ? (
              <Card className="border-dashed bg-card/60 backdrop-blur-sm">
                <CardContent className="pt-12 pb-12 text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">{t('community.noPostsYet')}</p>
                  <p className="text-muted-foreground mb-4">
                    {categoryFilter !== "all"
                      ? t('community.noPostsInCategory', { category: categoryFilter })
                      : t('community.beFirstToShare')}
                  </p>
                  {categoryFilter !== "all" && (
                    <Button
                      variant="outline"
                      onClick={() => setCategoryFilter("all")}
                    >
                      {t('community.viewAllPosts')}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              filteredPosts.map((post) => {
                const postComments = organizeComments(comments[post.id] || []);
                const isExpanded = expandedPosts[post.id];

                return (
                  <div key={post.id} id={`post-${post.id}`}>
                    {/* Edit Post Form */}
                    {editingPost === post.id ? (
                      <Card className="border-primary/20 shadow-lg">
                        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
                          <CardTitle className="flex items-center gap-2">
                            <Pencil className="h-5 w-5 text-primary" />
                            {t('community.editPost')}
                          </CardTitle>
                          <CardDescription>{t('community.updateYourPost')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                          <Input
                            placeholder={t('community.postTitlePlaceholder')}
                            value={editPostTitle}
                            onChange={(e) => setEditPostTitle(e.target.value)}
                            maxLength={200}
                            className="text-lg font-medium"
                          />
                          <div className="space-y-2">
                            <Textarea
                              placeholder={t('community.postContentPlaceholder')}
                              value={editPostContent}
                              onChange={(e) => setEditPostContent(e.target.value)}
                              rows={6}
                              maxLength={10000}
                              className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                              {editPostContent.length}/10,000 characters
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={() => saveEditPost(post.id)} className="flex-1">
                              {t('community.saveChanges')}
                            </Button>
                            <Button variant="outline" onClick={cancelEditPost}>
                              {t('common.cancel')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <CommunityPostCard
                        post={post}
                        commentCount={postComments.length}
                        currentUserId={user?.id}
                        isExpanded={isExpanded}
                        isLiked={likedPostIds.has(post.id)}
                        onExpand={() =>
                          setExpandedPosts({
                            ...expandedPosts,
                            [post.id]: !isExpanded,
                          })
                        }
                        onLike={() => handleLikePost(post.id)}
                        onEdit={() => startEditPost(post)}
                        onDelete={() => deletePost(post.id)}
                        authorBadge={{
                          masterTitle: post.profiles?.master_title,
                          currentFloor: post.profiles?.current_floor,
                          streakDays: post.profiles?.daily_study_streak,
                        }}
                        firstReply={firstComments[post.id] || null}
                      >
                    {/* Comments Section */}
                    {postComments.length > 0 && (
                      <div className="space-y-3">
                        {postComments.map((comment) => (
                          <div key={comment.id} className="space-y-2">
                            {/* Top-level Comment */}
                            <div className="bg-accent/20 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-7 w-7 border border-primary/20">
                                  <AvatarImage
                                    src={comment.profiles?.avatar_url || undefined}
                                  />
                                  <AvatarFallback className="text-xs bg-primary/10">
                                    {(
                                      comment.profiles?.display_name ||
                                      comment.profiles?.username ||
                                      "U"
                                    )
                                      .charAt(0)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold">
                                      {comment.profiles?.display_name ||
                                        comment.profiles?.username ||
                                        "Anonymous"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {new Date(
                                        comment.created_at
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </span>
                                    {comment.replies && comment.replies.length >= 2 && (
                                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-primary/30 text-primary/70">
                                        Sparked {comment.replies.length} replies
                                      </Badge>
                                    )}
                                  </div>
                                  {editingComment === comment.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={editContent}
                                        onChange={(e) =>
                                          setEditContent(e.target.value)
                                        }
                                        rows={2}
                                        className="text-xs"
                                      />
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            saveEditComment(comment.id)
                                          }
                                        >
                                          {t('common.save')}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={cancelEditComment}
                                        >
                                          {t('common.cancel')}
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <p className="text-xs leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 px-2 text-[10px]"
                                          onClick={() =>
                                            setReplyingTo({
                                              ...replyingTo,
                                              [post.id]: comment.id,
                                            })
                                          }
                                        >
                                          <Reply className="h-2.5 w-2.5 mr-1" />
                                          {t('community.reply')}
                                        </Button>
                                        {comment.user_id === user?.id && (
                                          <>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2 text-[10px]"
                                              onClick={() =>
                                                startEditComment(
                                                  comment.id,
                                                  comment.content
                                                )
                                              }
                                            >
                                              <Pencil className="h-2.5 w-2.5 mr-1" />
                                              {t('common.edit')}
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 px-2 text-[10px] text-destructive hover:text-destructive"
                                              onClick={() =>
                                                deleteComment(comment.id)
                                              }
                                            >
                                              <Trash2 className="h-2.5 w-2.5 mr-1" />
                                              {t('common.delete')}
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
                              <div className="ml-8 space-y-2">
                                {comment.replies.map((reply: any) => (
                                  <div
                                    key={reply.id}
                                    className="bg-accent/10 rounded-lg p-2 border-l-2 border-primary/20"
                                  >
                                    <div className="flex items-start gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage
                                          src={
                                            reply.profiles?.avatar_url ||
                                            undefined
                                          }
                                        />
                                        <AvatarFallback className="text-[10px] bg-primary/10">
                                          {(
                                            reply.profiles?.display_name ||
                                            reply.profiles?.username ||
                                            "U"
                                          )
                                            .charAt(0)
                                            .toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 space-y-0.5">
                                        <div className="flex items-center gap-2">
                                          <span className="text-[10px] font-semibold">
                                            {reply.profiles?.display_name ||
                                              reply.profiles?.username ||
                                              "Anonymous"}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground">
                                            {new Date(
                                              reply.created_at
                                            ).toLocaleDateString("en-US", {
                                              month: "short",
                                              day: "numeric",
                                            })}
                                          </span>
                                        </div>
                                        {editingComment === reply.id ? (
                                          <div className="space-y-2">
                                            <Textarea
                                              value={editContent}
                                              onChange={(e) =>
                                                setEditContent(e.target.value)
                                              }
                                              rows={2}
                                              className="text-xs"
                                            />
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                onClick={() =>
                                                  saveEditComment(reply.id)
                                                }
                                              >
                                                {t('common.save')}
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={cancelEditComment}
                                              >
                                                {t('common.cancel')}
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <p className="text-[11px] leading-relaxed whitespace-pre-wrap">
                                              {reply.content}
                                            </p>
                                            {reply.user_id === user?.id && (
                                              <div className="flex items-center gap-2 mt-1">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-5 px-1.5 text-[10px]"
                                                  onClick={() =>
                                                    startEditComment(
                                                      reply.id,
                                                      reply.content
                                                    )
                                                  }
                                                >
                                                  <Pencil className="h-2 w-2 mr-0.5" />
                                                  {t('common.edit')}
                                                </Button>
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="h-5 px-1.5 text-[10px] text-destructive hover:text-destructive"
                                                  onClick={() =>
                                                    deleteComment(reply.id)
                                                  }
                                                >
                                                  <Trash2 className="h-2 w-2 mr-0.5" />
                                                  {t('common.delete')}
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
                              <div className="ml-8 flex gap-2">
                                <Textarea
                                  placeholder={`Reply to ${comment.profiles?.display_name || comment.profiles?.username}...`}
                                  value={newComment[post.id] || ""}
                                  onChange={(e) =>
                                    setNewComment({
                                      ...newComment,
                                      [post.id]: e.target.value,
                                    })
                                  }
                                  rows={2}
                                  className="flex-1 text-xs"
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
                                    onClick={() =>
                                      setReplyingTo({
                                        ...replyingTo,
                                        [post.id]: null,
                                      })
                                    }
                                  >
                                    {"\u2715"}
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
                      <div className="flex gap-2 pt-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs bg-primary/10">
                            {(user?.email || "U").charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 flex gap-2">
                          <Textarea
                            placeholder={t('community.shareYourThoughts')}
                            value={newComment[post.id] || ""}
                            onChange={(e) =>
                              setNewComment({
                                ...newComment,
                                [post.id]: e.target.value,
                              })
                            }
                            rows={2}
                            className="flex-1 text-sm"
                          />
                          <Button
                            onClick={() => addComment(post.id)}
                            disabled={!newComment[post.id]?.trim()}
                            size="sm"
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                      </CommunityPostCard>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {posts.length === 0 && !showNewPost && (
            <Card className="text-center py-16 border-dashed bg-card/60 backdrop-blur-sm">
              <CardContent>
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{t('community.noPostsYet')}</h3>
                <p className="text-muted-foreground mb-6">
                  {t('community.beFirstToShareThoughts')}
                </p>
                <Button onClick={() => setShowNewPost(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  {t('community.createFirstPost')}
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
