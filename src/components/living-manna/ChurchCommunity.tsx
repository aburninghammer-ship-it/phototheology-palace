import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, MessageSquare, Send, Heart, Plus, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChurchPost {
  id: string;
  title: string;
  content: string;
  user_id: string;
  church_id: string;
  created_at: string;
  category: string | null;
  likes: number;
  profiles: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  };
  comment_count?: number;
  like_count?: number;
}

interface ChurchCommunityProps {
  churchId: string;
}

const POST_CATEGORIES = [
  { value: 'general', label: 'General' },
  { value: 'testimony', label: 'Testimony' },
  { value: 'prayer', label: 'Prayer Request' },
  { value: 'encouragement', label: 'Encouragement' },
  { value: 'study', label: 'Bible Study' },
  { value: 'announcement', label: 'Announcement' },
];

export function ChurchCommunity({ churchId }: ChurchCommunityProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ChurchPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [creating, setCreating] = useState(false);
  const [liking, setLiking] = useState<string | null>(null);
  const [likedPostIds, setLikedPostIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
  }, [churchId]);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('church_community_posts')
        .select(`
          *,
          profiles:user_id(username, display_name, avatar_url)
        `)
        .eq('church_id', churchId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      const postsData = (data as ChurchPost[]) || [];

      // Fetch like counts for all posts
      if (postsData.length > 0) {
        const postIds = postsData.map(p => p.id);
        const { data: likeCounts } = await supabase
          .from('church_community_post_likes' as any)
          .select('post_id')
          .in('post_id', postIds);

        // Count likes per post
        const countMap: Record<string, number> = {};
        ((likeCounts as any[]) || []).forEach((row: any) => {
          countMap[row.post_id] = (countMap[row.post_id] || 0) + 1;
        });
        postsData.forEach(p => { p.like_count = countMap[p.id] || 0; });

        // Fetch current user's likes
        if (user) {
          const { data: myLikes } = await supabase
            .from('church_community_post_likes' as any)
            .select('post_id')
            .eq('user_id', user.id)
            .in('post_id', postIds);
          setLikedPostIds(new Set(((myLikes as any[]) || []).map((l: any) => l.post_id)));
        }
      }

      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please fill in title and content");
      return;
    }

    setCreating(true);
    try {
      const { error } = await supabase
        .from('church_community_posts')
        .insert({
          user_id: user!.id,
          church_id: churchId,
          title: newTitle.trim(),
          content: newContent.trim(),
          category: newCategory,
        });

      if (error) throw error;

      toast.success("Post shared with your church community!");
      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      setShowCreateDialog(false);
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;
    setLiking(postId);
    const alreadyLiked = likedPostIds.has(postId);

    try {
      if (alreadyLiked) {
        // Remove like
        const { error } = await supabase
          .from('church_community_post_likes' as any)
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        if (error) throw error;

        setLikedPostIds(prev => { const next = new Set(prev); next.delete(postId); return next; });
        setPosts(prev => prev.map(p =>
          p.id === postId ? { ...p, like_count: Math.max((p.like_count || 0) - 1, 0) } : p
        ));
      } else {
        // Add like
        const { error } = await supabase
          .from('church_community_post_likes' as any)
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;

        setLikedPostIds(prev => new Set(prev).add(postId));
        setPosts(prev => prev.map(p =>
          p.id === postId ? { ...p, like_count: (p.like_count || 0) + 1 } : p
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLiking(null);
    }
  };

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case 'testimony': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'prayer': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'encouragement': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'study': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'announcement': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Church Community</CardTitle>
                <p className="text-foreground/70 text-sm mt-1">
                  Share with your church family — members and guests only
                </p>
              </div>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border border-border shadow-xl max-h-[85vh] overflow-y-auto z-[100]">
                <DialogHeader>
                  <DialogTitle>Share with your Church</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="bg-background/50"
                  />
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {POST_CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="What's on your heart?"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="bg-background/50 min-h-[120px]"
                  />
                  <Button
                    onClick={handleCreatePost}
                    disabled={creating}
                    className="w-full"
                  >
                    {creating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Share Post
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card variant="glass">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 text-foreground/30 mx-auto mb-4" />
              <p className="text-foreground/60">No posts yet</p>
              <p className="text-sm text-foreground/50 mt-1">
                Be the first to share something with your church family!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} variant="glass" className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      {(post.profiles?.display_name || post.profiles?.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground">
                        {post.profiles?.display_name || post.profiles?.username || 'Anonymous'}
                      </span>
                      {post.category && (
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(post.category)}`}>
                          {POST_CATEGORIES.find(c => c.value === post.category)?.label || post.category}
                        </Badge>
                      )}
                      <span className="text-xs text-foreground/50">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mt-2">{post.title}</h3>
                    <p className="text-foreground/80 mt-1 whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 hover:text-red-500 ${likedPostIds.has(post.id) ? 'text-red-500' : 'text-foreground/60'}`}
                        onClick={() => handleLike(post.id)}
                        disabled={liking === post.id}
                      >
                        <Heart className={`h-4 w-4 ${likedPostIds.has(post.id) ? 'fill-current' : ''} ${liking === post.id ? 'animate-pulse' : ''}`} />
                        {post.like_count || 0}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1 text-foreground/60 hover:text-primary">
                        <MessageSquare className="h-4 w-4" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
