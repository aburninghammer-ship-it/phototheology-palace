import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Loader2, Send, BookOpen, Pin, PinOff } from "lucide-react";
import { usePersonalPageFeed } from "@/hooks/usePersonalPageFeed";
import { useAuth } from "@/hooks/useAuth";
import { PersonalPageComposer } from "./PersonalPageComposer";
import { SharedContentCard } from "@/components/social/SharedContentCard";
import { SHARE_SOURCE_CONFIG } from "@/types/sharedContent";

interface PersonalPageFeedProps {
  userId: string;
}

const TYPE_COLORS: Record<string, string> = {
  note: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  reflection: "bg-purple-500/10 text-purple-600 border-purple-500/30",
  question: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  insight: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  prayer: "bg-pink-500/10 text-pink-600 border-pink-500/30",
  gem: "bg-cyan-500/10 text-cyan-600 border-cyan-500/30",
};

export function PersonalPageFeed({ userId }: PersonalPageFeedProps) {
  const { user } = useAuth();
  const { entries, loading, hasMore, likedEntries, comments, pinnedIds, loadFeed, toggleLike, loadComments, addComment, togglePin } = usePersonalPageFeed(userId);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const isOwnProfile = user?.id === userId;

  useEffect(() => { loadFeed(true); }, [userId]);

  const handleToggleComments = async (entryId: string) => {
    if (commentingOn === entryId) {
      setCommentingOn(null);
    } else {
      setCommentingOn(entryId);
      if (!comments[entryId]) {
        await loadComments(entryId);
      }
    }
  };

  const handleAddComment = async (entryId: string) => {
    if (!commentText.trim()) return;
    await addComment(entryId, commentText);
    setCommentText("");
  };

  if (loading && entries.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="p-6 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  // Sort: pinned first, then by date
  const sortedEntries = [...entries].sort((a, b) => {
    const aPinned = pinnedIds.has(a.id);
    const bPinned = pinnedIds.has(b.id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-4">
      {/* Composer (own profile only) */}
      {isOwnProfile && <PersonalPageComposer onPostCreated={() => loadFeed(true)} />}

      {/* Feed */}
      {sortedEntries.length === 0 ? (
        <Card variant="glass">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isOwnProfile ? "Share your first devotion or study above!" : "No posts yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        sortedEntries.map((entry) => {
          const isPinned = pinnedIds.has(entry.id);
          return (
            <Card key={entry.id} variant="glass" className={isPinned ? "ring-1 ring-primary/30" : ""}>
              <CardContent className="p-4 space-y-2">
                {/* Pinned indicator */}
                {isPinned && (
                  <div className="flex items-center gap-1 text-[10px] text-primary font-medium">
                    <Pin className="h-3 w-3" /> Pinned
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={entry.profile?.avatar_url} />
                      <AvatarFallback className="text-xs">{(entry.profile?.display_name || "?")[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{entry.profile?.display_name}</span>
                    {entry.type === "profile_share" && entry.shared_content ? (
                      <Badge variant="outline" className={`text-[10px] ${SHARE_SOURCE_CONFIG[entry.shared_content.source_type as keyof typeof SHARE_SOURCE_CONFIG]?.badgeClass || ""}`}>
                        Shared
                      </Badge>
                    ) : (
                      <Badge variant="outline" className={`text-[10px] ${TYPE_COLORS[entry.entry_type] || ""}`}>
                        {entry.entry_type}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleDateString()}</span>
                </div>

                {/* Title */}
                {entry.title && <h4 className="font-medium text-sm">{entry.title}</h4>}

                {/* Shared Content Card */}
                {entry.shared_content && (
                  <SharedContentCard sharedContent={entry.shared_content} />
                )}

                {/* Content */}
                <p className="text-sm whitespace-pre-wrap">{entry.content}</p>

                {/* Verse Reference */}
                {entry.verse_reference && (
                  <p className="text-xs text-primary font-medium">{entry.verse_reference}</p>
                )}

                {/* Thread Name */}
                {entry.user_study_threads && (
                  <p className="text-xs text-muted-foreground">
                    in <span className="font-medium">{entry.user_study_threads.title}</span>
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => toggleLike(entry.id)}>
                    <Heart className={`h-3.5 w-3.5 ${likedEntries.has(entry.id) ? "fill-red-500 text-red-500" : ""}`} />
                    {entry.likes_count || 0}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => handleToggleComments(entry.id)}>
                    <MessageCircle className="h-3.5 w-3.5" />
                    Comments
                  </Button>
                  {isOwnProfile && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => togglePin(entry.id)}>
                      {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                      {isPinned ? "Unpin" : "Pin"}
                    </Button>
                  )}
                </div>

                {/* Comments */}
                {commentingOn === entry.id && (
                  <div className="space-y-2 pt-2 border-t">
                    {(comments[entry.id] || []).map((c: any) => (
                      <div key={c.id} className="flex items-start gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={c.profile?.avatar_url} />
                          <AvatarFallback className="text-[8px]">{(c.profile?.display_name || "?")[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-xs font-medium">{c.profile?.display_name}</span>
                          <p className="text-xs text-muted-foreground">{c.content}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="text-xs h-8"
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(entry.id)}
                      />
                      <Button size="sm" className="h-8" onClick={() => handleAddComment(entry.id)}>
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Load More */}
      {hasMore && entries.length > 0 && (
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={() => loadFeed(false)} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
