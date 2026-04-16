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
  MessageSquare,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Flame,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { CommunityReactions } from "./CommunityReactions";
import { UserMasterySword } from "@/components/mastery/UserMasterySword";

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
  authorBadge?: {
    masterTitle?: string;
    currentFloor?: number;
    streakDays?: number;
  };
  firstReply?: {
    profiles?: { display_name?: string; username?: string };
    content?: string;
  } | null;
  children?: React.ReactNode;
}

const PREVIEW_LENGTH = 180;

const getCategoryStyle = (category: string) => {
  switch (category) {
    case "prayer":
      return {
        badge: "bg-purple-400/10 text-purple-400 border-purple-400/30",
        border: "border-l-purple-400",
        glow: "shadow-[inset_4px_0_8px_-4px_rgba(168,85,247,0.4)]",
        tint: "from-purple-500/5",
        icon: "\uD83D\uDE4F",
      };
    case "study":
      return {
        badge: "bg-blue-400/10 text-blue-400 border-blue-400/30",
        border: "border-l-blue-400",
        glow: "shadow-[inset_4px_0_8px_-4px_rgba(96,165,250,0.4)]",
        tint: "from-blue-500/5",
        icon: "\uD83D\uDCD6",
      };
    case "questions":
    case "question":
      return {
        badge: "bg-amber-400/10 text-amber-400 border-amber-400/30",
        border: "border-l-amber-400",
        glow: "shadow-[inset_4px_0_8px_-4px_rgba(251,191,36,0.4)]",
        tint: "from-amber-500/5",
        icon: "\u2753",
      };
    case "general":
    default:
      return {
        badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
        border: "border-l-emerald-400",
        glow: "shadow-[inset_4px_0_8px_-4px_rgba(52,211,153,0.4)]",
        tint: "from-emerald-500/5",
        icon: "\uD83D\uDCAC",
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
  authorBadge,
  firstReply,
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

  const categoryStyle = getCategoryStyle(post.category);

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 border-l-4 ${categoryStyle.border} ${categoryStyle.glow}
        bg-card/60 backdrop-blur-sm border-border/50 bg-gradient-to-r ${categoryStyle.tint} to-transparent`}
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
              {authorBadge?.masterTitle && (
                <UserMasterySword
                  masterTitle={authorBadge.masterTitle}
                  currentFloor={authorBadge.currentFloor || 1}
                  size="sm"
                />
              )}
              {authorBadge?.streakDays && authorBadge.streakDays >= 7 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1 py-0 h-4 border-orange-400/40 text-orange-500 bg-orange-500/5"
                >
                  <Flame className="h-2.5 w-2.5 mr-0.5" />
                  {authorBadge.streakDays}
                </Badge>
              )}
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
              {commentCount >= 3 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 border-orange-400/40 text-orange-500 bg-orange-500/5"
                >
                  <Flame className="h-2.5 w-2.5 mr-0.5" />
                  Sparked {commentCount} responses
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

        {/* Top reply preview (when collapsed) */}
        {!isExpanded && commentCount > 0 && firstReply && (
          <div
            className="bg-muted/30 rounded-md px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={onExpand}
          >
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground/70">
                {firstReply.profiles?.display_name ||
                  firstReply.profiles?.username ||
                  "Someone"}
              </span>{" "}
              replied:{" "}
              <span className="italic">
                {firstReply.content && firstReply.content.length > 80
                  ? firstReply.content.slice(0, 80) + "..."
                  : firstReply.content}
              </span>
            </p>
          </div>
        )}

        <Separator className="my-1" />

        {/* Actions Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group/reactions">
            <CommunityReactions
              postId={post.id}
              currentUserId={currentUserId}
            />

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
