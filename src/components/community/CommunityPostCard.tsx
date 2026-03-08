import { useState } from "react";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageSquare,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface CommunityPostCardProps {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    tags?: string[];
    user_id: string;
    created_at: string;
    likes_count?: number;
    likes?: number;
    profiles: {
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
    shared_content?: any;
  };
  commentCount?: number;
  currentUserId?: string;
  isExpanded?: boolean;
  isLiked?: boolean;
  onExpand?: () => void;
  onLike?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode;
}

const PREVIEW_LENGTH = 180;

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "prayer":
      return {
        badge: "bg-purple-500/10 text-purple-600 border-purple-500/30",
        border: "border-l-purple-500",
        icon: "🙏",
      };
    case "study":
      return {
        badge: "bg-blue-500/10 text-blue-600 border-blue-500/30",
        border: "border-l-blue-500",
        icon: "📖",
      };
    case "questions":
    case "question":
      return {
        badge: "bg-amber-500/10 text-amber-600 border-amber-500/30",
        border: "border-l-amber-500",
        icon: "❓",
      };
    case "general":
    default:
      return {
        badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
        border: "border-l-emerald-500",
        icon: "💬",
      };
  }
};

export const CommunityPostCard = ({
  post,
  commentCount = 0,
  currentUserId,
  isExpanded = false,
  isLiked = false,
  onExpand,
  onLike,
  onEdit,
  onDelete,
  children,
}: CommunityPostCardProps) => {
  const [showFullContent, setShowFullContent] = useState(false);

  const isAuthor = currentUserId === post.user_id;
  const displayName =
    post.profiles?.display_name || post.profiles?.username || "Anonymous";
  const username = post.profiles?.username || "anonymous";

  const contentIsLong = post.content && post.content.length > PREVIEW_LENGTH;
  const displayContent =
    contentIsLong && !showFullContent
      ? post.content.slice(0, PREVIEW_LENGTH) + "..."
      : post.content;

  const handleLike = () => {
    onLike?.();
  };

  const categoryStyle = getCategoryStyle(post.category);
  const likesCount = post.likes_count ?? post.likes ?? 0;

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 border-l-4 ${categoryStyle.border}`}
    >
      {/* Compact Header */}
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9 border border-border shrink-0">
            <AvatarImage src={post.profiles?.avatar_url || undefined} />
            <AvatarFallback className="text-xs bg-muted">
              {displayName[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{displayName}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </span>
              {commentCount === 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 border-amber-500/40 text-amber-600 bg-amber-500/5"
                >
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  Needs reply
                </Badge>
              )}
            </div>
            <CardTitle className="text-base mt-1 line-clamp-2 leading-snug">
              {post.title}
            </CardTitle>
          </div>

          <Badge
            variant="outline"
            className={`capitalize text-xs shrink-0 ${categoryStyle.badge}`}
          >
            <span className="mr-1">{categoryStyle.icon}</span>
            {post.category === "question" ? "questions" : post.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2 space-y-3">
        {/* Tags - compact */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 4).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 font-normal"
              >
                #{tag}
              </Badge>
            ))}
            {post.tags.length > 4 && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-5 font-normal"
              >
                +{post.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Content Preview */}
        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
          {displayContent}
        </p>
        {contentIsLong && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-primary"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? "Show less" : "Read more"}
          </Button>
        )}

        <Separator className="my-1" />

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 text-xs transition-colors group ${
                isLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${isLiked ? "fill-current" : "group-hover:fill-red-500/20"}`}
              />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={onExpand}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>
                {commentCount} {commentCount === 1 ? "reply" : "replies"}
              </span>
            </button>

            {isAuthor && (
              <>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <button
                  onClick={onDelete}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onExpand}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1" />
                {commentCount > 0 ? "View" : "Reply"}
              </>
            )}
          </Button>
        </div>

        {/* Expanded Comments Section */}
        {isExpanded && <div className="pt-3">{children}</div>}
      </CardContent>
    </Card>
  );
};
