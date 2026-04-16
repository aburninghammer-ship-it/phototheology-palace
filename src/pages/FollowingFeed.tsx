import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Loader2, BookOpen, Users, Rss, MessageCircle, Repeat2 } from "lucide-react";
import { useFollowingFeed, FeedEntry } from "@/hooks/useFollowingFeed";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { SharedContentCard } from "@/components/social/SharedContentCard";

const TYPE_COLORS: Record<string, string> = {
  note: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  reflection: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  question: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  insight: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  prayer: "bg-pink-500/10 text-pink-600 border-pink-500/30",
  gem: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
};

export default function FollowingFeed() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { entries, loading, hasMore, likedEntries, repostedEntries, loadFeed, toggleLike, toggleRepost } = useFollowingFeed();

  useEffect(() => {
    if (user) loadFeed(true);
  }, [user]);

  const handleRepost = async (entry: FeedEntry) => {
    const success = await toggleRepost(entry.id, entry.type);
    if (success) {
      toast.success(repostedEntries.has(entry.id) ? t('followingFeedPage.repostRemoved') : t('followingFeedPage.sharedToFollowers'));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Rss className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('followingFeedPage.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('followingFeedPage.subtitle')}</p>
          </div>
        </div>

        {/* Loading */}
        {loading && entries.length === 0 && (
          <Card>
            <CardContent className="p-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && entries.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <Users className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-semibold text-lg mb-1">{t('followingFeedPage.emptyTitle')}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('followingFeedPage.emptyDescription')}
                </p>
                <Button asChild variant="outline">
                  <Link to="/community">{t('followingFeedPage.discoverPeople')}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <FeedCard
              key={`${entry.type}-${entry.id}`}
              entry={entry}
              isLiked={likedEntries.has(entry.id)}
              isReposted={repostedEntries.has(entry.id)}
              onLike={() => toggleLike(entry.id)}
              onRepost={() => handleRepost(entry)}
              currentUserId={user?.id}
            />
          ))}
        </div>

        {/* Load More */}
        {hasMore && entries.length > 0 && (
          <div className="text-center mt-6">
            <Button variant="outline" size="sm" onClick={() => loadFeed(false)} disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t('followingFeedPage.loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedCard({
  entry,
  isLiked,
  isReposted,
  onLike,
  onRepost,
  currentUserId,
}: {
  entry: FeedEntry;
  isLiked: boolean;
  isReposted: boolean;
  onLike: () => void;
  onRepost: () => void;
  currentUserId?: string;
}) {
  const { t } = useTranslation();
  const isOwnPost = entry.user_id === currentUserId;

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        {/* Repost indicator */}
        {entry.reposted_by && (
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Repeat2 className="h-3 w-3" />
            <Link to={`/user/${entry.reposted_by.id}`} className="hover:underline font-medium">
              {entry.reposted_by.display_name}
            </Link>
            <span>{t('followingFeedPage.sharedThis')}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to={`/user/${entry.user_id}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Avatar className="h-7 w-7">
              <AvatarImage src={entry.profile?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">{(entry.profile?.display_name || "?")[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{entry.profile?.display_name || t('followingFeedPage.unknown')}</span>
          </Link>
          <div className="flex items-center gap-2">
            {entry.type === "study_entry" && entry.entry_type && (
              <Badge variant="outline" className={`text-[10px] ${TYPE_COLORS[entry.entry_type] || ""}`}>
                {entry.entry_type}
              </Badge>
            )}
            {entry.type === "community_post" && (
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30">
                {t('followingFeedPage.community')}
              </Badge>
            )}
            {entry.category && (
              <Badge variant="secondary" className="text-[10px]">{entry.category}</Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(entry.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Title */}
        {entry.title && <h4 className="font-medium text-sm">{entry.title}</h4>}

        {/* Shared Content Card */}
        {entry.shared_content && (
          <SharedContentCard sharedContent={entry.shared_content} />
        )}

        {/* Content */}
        <p className="text-sm whitespace-pre-wrap line-clamp-6">{entry.content}</p>

        {/* Verse Reference */}
        {entry.verse_reference && (
          <p className="text-xs text-primary font-medium">{entry.verse_reference}</p>
        )}

        {/* Thread Name */}
        {entry.thread_title && (
          <p className="text-xs text-muted-foreground">
            {t('followingFeedPage.in')} <span className="font-medium">{entry.thread_title}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={onLike}>
            <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
            {entry.likes_count || 0}
          </Button>
          {!isOwnPost && (
            <Button variant="ghost" size="sm" className={`h-7 text-xs gap-1 ${isReposted ? "text-emerald-500" : ""}`} onClick={onRepost}>
              <Repeat2 className={`h-3.5 w-3.5 ${isReposted ? "text-emerald-500" : ""}`} />
              {isReposted ? t('followingFeedPage.shared') : t('followingFeedPage.share')}
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" asChild>
            <Link to={`/user/${entry.user_id}`}>
              <MessageCircle className="h-3.5 w-3.5" />
              {t('followingFeedPage.viewProfile')}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
