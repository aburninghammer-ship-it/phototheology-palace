import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, TrendingUp, ChevronRight, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface TrendingPost {
  id: string;
  title: string;
  content: string;
  likes: number;
  created_at: string;
  profiles: {
    display_name: string;
    avatar_url: string | null;
  } | null;
}

export function CommunityHighlight() {
  const [trendingPost, setTrendingPost] = useState<TrendingPost | null>(null);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadTrendingPost();
  }, []);

  const loadTrendingPost = async () => {
    try {
      // Get the most liked post from last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: posts, error } = await supabase
        .from("community_posts")
        .select(`
          id,
          title,
          content,
          likes,
          created_at,
          profiles:user_id (
            display_name,
            avatar_url
          )
        `)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("likes", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (posts) {
        setTrendingPost(posts as TrendingPost);
        
        // Get comment count
        const { count } = await supabase
          .from("community_comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", posts.id);
        
        setCommentCount(count || 0);
      }
    } catch (error) {
      console.error("Error loading trending post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card variant="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Community Highlight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trendingPost) {
    return (
      <Card variant="glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-5 w-5 text-primary" />
            Join the Community
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Share your insights, ask questions, and connect with fellow students.
          </p>
          <Button 
            onClick={() => navigate("/community")}
            className="w-full"
            variant="outline"
          >
            Explore Community
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Post
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            🔥 Hot
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Author */}
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={trendingPost.profiles?.avatar_url || undefined} />
            <AvatarFallback className="text-xs">
              {trendingPost.profiles?.display_name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {trendingPost.profiles?.display_name || "Anonymous"}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(trendingPost.created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Title & Preview */}
        <div>
          <h4 className="font-semibold text-sm line-clamp-1">{trendingPost.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {trendingPost.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4 text-red-500" />
            {trendingPost.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {commentCount}
          </span>
        </div>

        <Button 
          onClick={() => navigate(`/community`)}
          className="w-full"
          variant="outline"
          size="sm"
        >
          View Discussion
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
