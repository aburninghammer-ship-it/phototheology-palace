import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, Sparkles } from "lucide-react";
import { communityPostSchema } from "@/lib/validationSchemas";
import { sanitizeHtml } from "@/lib/sanitize";
import { useActiveUsers } from "@/hooks/useActiveUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommunitySearch } from "@/components/community/CommunitySearch";
import { CommunityGuidelines } from "@/components/community/CommunityGuidelines";
import { CommunityNotifications } from "@/components/community/CommunityNotifications";
import { TagInput } from "@/components/community/TagInput";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { useCommunityComments } from "@/hooks/useCommunityComments";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CommunityCommentThread } from "@/components/community/CommunityCommentThread";
import { PostListSkeleton } from "@/components/community/PostSkeleton";

type SortOption = "latest" | "most_commented" | "needs_feedback";
type CategoryFilter = "all" | "general" | "prayer" | "study" | "questions";

const CommunityOptimized = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { activeCount, activeUsers } = useActiveUsers();

  // UI State
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<string>("general");
  const [newTags, setNewTags] = useState<string[]>([]);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  // Use our optimized hooks
  const {
    posts,
    loading: postsLoading,
    hasMore,
    loadMore,
    refresh: refreshPosts,
    addPost,
    updatePost,
    removePost,
  } = useCommunityPosts({
    pageSize: 10,
    sortBy,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    searchQuery,
    tags: selectedTags,
  });

  // Load comments only for expanded post
  const {
    comments,
    loading: commentsLoading,
    refresh: refreshComments,
    addComment: addCommentOptimistic,
    updateComment: updateCommentOptimistic,
    removeComment: removeCommentOptimistic,
  } = useCommunityComments(expandedPostId);

  // Handle highlight from URL
  useEffect(() => {
    const highlightPostId = searchParams.get("post");
    if (highlightPostId) {
      setExpandedPostId(highlightPostId);
      setTimeout(() => {
        document.getElementById(`post-${highlightPostId}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 500);
    }
  }, [searchParams]);

  // Fetch user's liked post IDs
  useEffect(() => {
    if (!user?.id) return;
    const fetchLikes = async () => {
      const { data } = await supabase
        .from("community_post_likes")
        .select("post_id")
        .eq("user_id", user.id);
      if (data) {
        setLikedPostIds(new Set(data.map((d: any) => d.post_id)));
      }
    };
    fetchLikes();
  }, [user?.id]);

  // Real-time subscriptions - optimized to update specific posts only
  useEffect(() => {
    if (!user?.id) return;

    const postsChannel = supabase
      .channel("community_posts_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "community_posts" },
        () => refreshPosts()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "community_posts" },
        (payload) => {
          // Optimistically update the specific post
          if (payload.new) {
            updatePost(payload.new.id, payload.new as any);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "community_posts" },
        (payload) => {
          // Optimistically remove the post
          if (payload.old) {
            removePost(payload.old.id);
          }
        }
      )
      .subscribe();

    // Only subscribe to comments for expanded post
    let commentsChannel: any = null;
    if (expandedPostId) {
      commentsChannel = supabase
        .channel(`community_comments_${expandedPostId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "community_comments",
            filter: `post_id=eq.${expandedPostId}`
          },
          () => refreshComments()
        )
        .subscribe();
    }

    return () => {
      supabase.removeChannel(postsChannel);
      if (commentsChannel) {
        supabase.removeChannel(commentsChannel);
      }
    };
  }, [user?.id, expandedPostId, refreshPosts, refreshComments, updatePost, removePost]);

  const createPost = async () => {
    if (!user?.id) return;

    try {
      const validatedData = communityPostSchema.parse({
        title: newTitle,
        content: newContent,
        category: newCategory,
      });

      const sanitizedTitle = sanitizeHtml(validatedData.title);
      const sanitizedContent = sanitizeHtml(validatedData.content);

      const { data, error } = await supabase
        .from("community_posts")
        .insert({
          title: sanitizedTitle,
          content: sanitizedContent,
          category: newCategory,
          tags: newTags,
          user_id: user.id,
        })
        .select(`
          *,
          profiles:user_id(username, display_name, avatar_url)
        `)
        .single();

      if (error) throw error;

      if (data) {
        addPost(data as any);
      }

      toast({ title: t('community.postCreated') });
      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setNewTags([]);
      setShowNewPost(false);
    } catch (error: any) {
      toast({
        title: t('community.errorCreatingPost'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!user?.id || !expandedPostId) return;

    const sanitizedContent = sanitizeHtml(content);

    const { data, error } = await supabase
      .from("community_comments")
      .insert({
        post_id: expandedPostId,
        user_id: user.id,
        content: sanitizedContent,
        parent_comment_id: parentId || null,
      })
      .select(`
        *,
        profiles:user_id(username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;

    if (data) {
      addCommentOptimistic(data as any);
    }
  };

  const handleEditComment = async (commentId: string, content: string) => {
    const sanitizedContent = sanitizeHtml(content);

    const { error } = await supabase
      .from("community_comments")
      .update({ content: sanitizedContent })
      .eq("id", commentId);

    if (error) throw error;

    updateCommentOptimistic(commentId, { content: sanitizedContent } as any);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    const { error } = await supabase
      .from("community_comments")
      .delete()
      .eq("id", commentId);

    if (error) throw error;

    removeCommentOptimistic(commentId);
    toast({ title: t('community.commentDeleted') });
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast({
        title: t('community.errorDeletingPost'),
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    removePost(postId);
    toast({ title: t('community.postDeleted') });
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    const alreadyLiked = likedPostIds.has(postId);
    const post = posts.find(p => p.id === postId);
    const currentLikes = post?.likes ?? 0;

    if (alreadyLiked) {
      // Optimistic unlike
      setLikedPostIds(prev => { const next = new Set(prev); next.delete(postId); return next; });
      updatePost(postId, { likes: Math.max(0, currentLikes - 1) } as any);

      const { error } = await supabase
        .from("community_post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);

      if (error) {
        // Revert on failure
        setLikedPostIds(prev => new Set(prev).add(postId));
        updatePost(postId, { likes: currentLikes } as any);
      } else {
        // Update the denormalized count
        await supabase
          .from("community_posts")
          .update({ likes: Math.max(0, currentLikes - 1) })
          .eq("id", postId);
      }
    } else {
      // Optimistic like
      setLikedPostIds(prev => new Set(prev).add(postId));
      updatePost(postId, { likes: currentLikes + 1 } as any);

      const { error } = await supabase
        .from("community_post_likes")
        .insert({ post_id: postId, user_id: user.id });

      if (error) {
        // Revert on failure
        setLikedPostIds(prev => { const next = new Set(prev); next.delete(postId); return next; });
        updatePost(postId, { likes: currentLikes } as any);
      } else {
        // Update the denormalized count
        await supabase
          .from("community_posts")
          .update({ likes: currentLikes + 1 })
          .eq("id", postId);
      }
    }
  };

  if (!user) return null;

  // Extract unique tags from all posts
  const availableTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).sort();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {user && <CommunityGuidelines userId={user.id} />}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/10 to-background p-8 border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src="/pwa-192x192.png"
                    alt="Phototheology"
                    className="h-14 w-14 rounded-xl shadow-lg shadow-primary/20"
                  />
                  <div>
                    <h1 className="text-3xl sm:text-5xl font-bold flex items-center gap-3 mb-2">
                      <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                      {t('community.title')}
                    </h1>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                      {t('community.description')}
                    </p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {t('community.activeNow', { count: activeCount })}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user && (
                    <CommunityNotifications
                      userId={user.id}
                      onNavigateToPost={(postId) => {
                        setExpandedPostId(postId);
                        setTimeout(() => {
                          document.getElementById(`post-${postId}`)?.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                          });
                        }, 100);
                      }}
                    />
                  )}
                  <Button
                    onClick={() => setShowNewPost(!showNewPost)}
                    size="lg"
                    className="shadow-lg"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    <span className="hidden sm:inline">{t('community.newPost')}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Tags */}
          <CommunitySearch
            onSearch={setSearchQuery}
            onTagFilter={setSelectedTags}
            selectedTags={selectedTags}
            availableTags={availableTags}
          />

          {/* Who's Online Section */}
          {activeUsers.length > 0 && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    {t('community.activeNowTitle', { count: activeCount })}
                  </CardTitle>
                </div>
                <CardDescription>{t('community.connectWithMembers')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {activeUsers.slice(0, 10).map((activeUser) => (
                    <div
                      key={activeUser.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activeUser.avatar_url || undefined} />
                        <AvatarFallback>
                          {(activeUser.display_name || activeUser.username || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {activeUser.display_name || activeUser.username}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* New Post Form */}
          {showNewPost && (
            <Card>
              <CardHeader>
                <CardTitle>{t('community.createNewPost')}</CardTitle>
                <CardDescription>{t('community.shareYourThoughts')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={t('community.postTitlePlaceholder')}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Textarea
                  placeholder={t('community.whatsOnYourMind')}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="min-h-[150px]"
                />
                <div className="flex gap-4 flex-wrap">
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t('community.categoryGeneral')}</SelectItem>
                      <SelectItem value="prayer">{t('community.categoryPrayerRequest')}</SelectItem>
                      <SelectItem value="study">{t('community.categoryBibleStudy')}</SelectItem>
                      <SelectItem value="questions">{t('community.categoryQuestions')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <TagInput
                    tags={newTags}
                    onChange={setNewTags}
                    placeholder={t('community.addTagsPlaceholder')}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createPost} disabled={!newTitle.trim() || !newContent.trim()}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('community.createPost')}
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    {t('common.cancel')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex gap-4 flex-wrap items-center">
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('community.allCategories')}</SelectItem>
                <SelectItem value="general">{t('community.categoryGeneral')}</SelectItem>
                <SelectItem value="prayer">{t('community.categoryPrayer')}</SelectItem>
                <SelectItem value="study">{t('community.categoryBibleStudy')}</SelectItem>
                <SelectItem value="questions">{t('community.categoryQuestions')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{t('community.sortLatest')}</SelectItem>
                <SelectItem value="most_commented">{t('community.sortMostCommented')}</SelectItem>
                <SelectItem value="needs_feedback">{t('community.sortNeedsFeedback')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts List */}
          {postsLoading && posts.length === 0 ? (
            <PostListSkeleton count={3} />
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} id={`post-${post.id}`}>
                  <CommunityPostCard
                    post={post}
                    commentCount={post.id === expandedPostId ? comments.length : 0}
                    currentUserId={user?.id}
                    isExpanded={expandedPostId === post.id}
                    isLiked={likedPostIds.has(post.id)}
                    onExpand={() => setExpandedPostId(
                      expandedPostId === post.id ? null : post.id
                    )}
                    onLike={() => handleLikePost(post.id)}
                    onDelete={() => handleDeletePost(post.id)}
                  >
                    {expandedPostId === post.id && (
                      <CommunityCommentThread
                        postId={post.id}
                        comments={comments}
                        currentUserId={user?.id}
                        onAddComment={handleAddComment}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                      />
                    )}
                  </CommunityPostCard>
                </div>
              ))}

              {posts.length === 0 && !postsLoading && (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground">
                    {t('community.noPostsFound')}
                  </p>
                </Card>
              )}

              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={loadMore}
                    disabled={postsLoading}
                    variant="outline"
                    size="lg"
                  >
                    {postsLoading ? t('common.loading') : t('community.loadMorePosts')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CommunityOptimized;
