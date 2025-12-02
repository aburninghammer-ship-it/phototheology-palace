import { useState } from 'react';
import { MessageReaction } from '@/hooks/useDirectMessages';
import { useMessageReactions } from '@/hooks/useMessageReactions';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MessageReactionsProps {
  messageId: string;
  reactions: MessageReaction[];
}

const EMOJI_REACTIONS = ['❤️', '👍', '😂', '😮', '😢', '🙏', '🔥'];

export const MessageReactions = ({ messageId, reactions }: MessageReactionsProps) => {
  const { user } = useAuth();
  const { addReaction } = useMessageReactions();
  const [open, setOpen] = useState(false);

  // Group reactions by type
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.reaction_type]) {
      acc[reaction.reaction_type] = [];
    }
    acc[reaction.reaction_type].push(reaction);
    return acc;
  }, {} as Record<string, MessageReaction[]>);

  const handleReactionClick = async (emoji: string) => {
    await addReaction(messageId, emoji);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {/* Display existing reactions */}
      {Object.entries(groupedReactions).map(([type, reactionList]) => {
        const hasUserReacted = reactionList.some(r => r.user_id === user?.id);
        return (
          <button
            key={type}
            onClick={() => addReaction(messageId, type)}
            className={cn(
              "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs",
              "hover:bg-accent transition-colors",
              hasUserReacted && "bg-primary/20 ring-1 ring-primary/30"
            )}
          >
            <span>{type}</span>
            <span className="text-muted-foreground">{reactionList.length}</span>
          </button>
        );
      })}

      {/* Add reaction button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs hover:bg-accent"
          >
            <span className="text-base">+</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {EMOJI_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="p-2 text-2xl hover:bg-accent rounded-md transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
