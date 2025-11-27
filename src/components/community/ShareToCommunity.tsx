import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Share2, X, Plus } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";

export interface SharedContent {
  type: "gem" | "study" | "deck" | "palace" | "series" | "sermon";
  id: string;
  title: string;
  preview: string;
  metadata?: Record<string, any>;
}

interface ShareToCommunityProps {
  content: SharedContent;
  userId: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
}

export const ShareToCommunity = ({ 
  content, 
  userId, 
  trigger,
  onSuccess 
}: ShareToCommunityProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(`Check out my ${content.type}: ${content.title}`);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([content.type]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (newTag && !tags.includes(newTag.toLowerCase()) && tags.length < 5) {
      setTags([...tags, newTag.toLowerCase()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleShare = async () => {
    if (!title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedDescription = sanitizeHtml(description);

      const { error } = await supabase
        .from("community_posts")
        .insert([{
          user_id: userId,
          title: sanitizedTitle,
          content: sanitizedDescription || `I'm sharing my ${content.type} with the community. Check it out!`,
          category: "study",
          tags,
          shared_content: content as any
        }]);

      if (error) throw error;

      toast({ title: "Shared to community!" });
      setOpen(false);
      onSuccess?.();
    } catch (error: any) {
      toast({ 
        title: "Failed to share", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      gem: "💎 Gem",
      study: "📖 Study",
      deck: "🃏 Study Deck",
      palace: "🏛️ Palace Mapping",
      series: "📚 Bible Study Series",
      sermon: "🎤 Sermon"
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share to Community
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share to Community</DialogTitle>
          <DialogDescription>
            Share your {content.type} with the Phototheology community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Card */}
          <div className="p-4 rounded-lg bg-muted/50 border">
            <Badge variant="secondary" className="mb-2">
              {getTypeLabel(content.type)}
            </Badge>
            <h4 className="font-semibold">{content.title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {content.preview}
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium">Post Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Add Context (optional)</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share what you learned or why this is meaningful..."
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="icon" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeTag(tag)} 
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSubmitting}>
            {isSubmitting ? "Sharing..." : "Share"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
