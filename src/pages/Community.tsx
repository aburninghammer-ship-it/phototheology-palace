import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Plus, Heart } from "lucide-react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { communityPostSchema } from "@/lib/validationSchemas";
import { sanitizeHtml } from "@/lib/sanitize";

const Community = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    if (user) {
      fetchPosts();

      const channel = supabase
        .channel("community_posts_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
          fetchPosts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select("*, profiles!community_posts_user_id_fkey(username, display_name)")
      .order("created_at", { ascending: false });
    
    setPosts(data || []);
  };

  const createPost = async () => {
    try {
      // Validate input
      const validatedData = communityPostSchema.parse({
        title: newTitle,
        content: newContent,
        category: "general"
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <MessageSquare className="h-8 w-8" />
              Community
            </h1>
            <Button onClick={() => setShowNewPost(!showNewPost)}>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </div>

          {showNewPost && (
            <Card>
              <CardHeader>
                <CardTitle>Create New Post</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Post title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={200}
                />
                <div className="space-y-2">
                  <Textarea
                    placeholder="Share your thoughts... (emojis supported 😊)"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    rows={4}
                    maxLength={10000}
                  />
                  <div className="flex justify-end">
                    <EmojiPicker 
                      onEmojiSelect={(emoji) => setNewContent(newContent + emoji)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={createPost}>Post</Button>
                  <Button variant="outline" onClick={() => setShowNewPost(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    by {post.profiles?.display_name || post.profiles?.username} •{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <Heart className="h-4 w-4" />
                      {post.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <MessageSquare className="h-4 w-4" />
                      Comments
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No posts yet. Be the first to share!
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Community;
