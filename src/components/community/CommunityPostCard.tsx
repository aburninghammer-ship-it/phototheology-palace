import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { UserMasterySword } from '@/components/mastery/UserMasterySword';

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
    profiles: {
      username: string;
      display_name: string | null;
      avatar_url: string | null;
    };
  };
  commentCount?: number;
  currentUserId?: string;
  isExpanded?: boolean;
  onExpand?: () => void;
  onLike?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  children?: React.ReactNode; // For comments section
}

export const CommunityPostCard = ({
  post,
  commentCount = 0,
  currentUserId,
  isExpanded = false,
  onExpand,
  onLike,
  onEdit,
  onDelete,
  children,
}: CommunityPostCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const isAuthor = currentUserId === post.user_id;

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const displayName = post.profiles?.display_name || post.profiles?.username || 'Anonymous';
  const username = post.profiles?.username || 'anonymous';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.profiles?.avatar_url || undefined} />
              <AvatarFallback>{displayName[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{displayName}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                @{username} · {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {isAuthor && (
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        </div>

        <CardTitle className="mt-3">{post.title}</CardTitle>
        <CardDescription>
          <Badge variant="secondary" className="mr-2">
            {post.category}
          </Badge>
          {post.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="mr-1">
              #{tag}
            </Badge>
          ))}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div
          className="prose prose-sm dark:prose-invert max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex items-center gap-4 pt-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes_count || 0}
          </Button>

          <Button variant="ghost" size="sm" onClick={onExpand}>
            <MessageSquare className="h-4 w-4 mr-1" />
            {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>

        {isExpanded && children}
      </CardContent>
    </Card>
  );
};
