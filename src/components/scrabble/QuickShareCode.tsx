// Quick Share Game Code
// Allows the host to search and DM game room codes to other users without leaving the lobby

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, X, Check, Loader2, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface UserResult {
  id: string;
  display_name: string;
  avatar_url: string | null;
  username: string | null;
}

interface QuickShareCodeProps {
  roomCode: string;
  gameName?: string;
}

export function QuickShareCode({ roomCode, gameName = 'PT Scrabble' }: QuickShareCodeProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentTo, setSentTo] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState<string | null>(null);

  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2 || !user) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, username')
        .neq('id', user.id)
        .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  }, [user]);

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const timeout = setTimeout(() => searchUsers(value), 300);
    return () => clearTimeout(timeout);
  };

  const sendCodeToUser = async (recipient: UserResult) => {
    if (!user || sending) return;

    setSending(recipient.id);
    try {
      // Get or create conversation
      const { data: conversationId, error: convoError } = await supabase.rpc(
        'get_or_create_conversation',
        { other_user_id: recipient.id }
      );

      if (convoError) throw convoError;

      // Send the game code as a message
      const message = `🎮 Join my ${gameName} game!\n\nRoom Code: ${roomCode}\n\nGo to Games → PT Scrabble → Join Game and enter the code above!`;

      const { error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: message,
        });

      if (msgError) throw msgError;

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      setSentTo(prev => new Set([...prev, recipient.id]));
      toast.success(`Code sent to ${recipient.display_name}!`);
    } catch (err: any) {
      console.error('Failed to send code:', err);
      toast.error('Failed to send code. Try again.');
    } finally {
      setSending(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Send Code to Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Share Game Code
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Room code display */}
          <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-2xl font-mono font-bold tracking-wider text-primary">
              {roomCode}
            </span>
          </div>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {/* Results */}
          <ScrollArea className="max-h-64">
            <div className="space-y-1">
              {isSearching && (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Searching...
                </div>
              )}

              {!isSearching && searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Users className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No users found</p>
                </div>
              )}

              {!isSearching && searchQuery.length < 2 && searchQuery.length > 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Type at least 2 characters to search
                </p>
              )}

              <AnimatePresence>
                {searchResults.map((person) => {
                  const alreadySent = sentTo.has(person.id);
                  const isSending = sending === person.id;

                  return (
                    <motion.div
                      key={person.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-lg transition-colors',
                        alreadySent ? 'bg-green-500/10' : 'hover:bg-muted'
                      )}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={person.avatar_url || undefined} />
                        <AvatarFallback>
                          {(person.display_name || '?').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {person.display_name || 'Unknown'}
                        </p>
                        {person.username && (
                          <p className="text-xs text-muted-foreground truncate">
                            @{person.username}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant={alreadySent ? 'ghost' : 'default'}
                        disabled={alreadySent || isSending}
                        onClick={() => sendCodeToUser(person)}
                        className={cn(
                          'shrink-0',
                          alreadySent && 'text-green-500'
                        )}
                      >
                        {isSending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : alreadySent ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Sent
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {sentTo.size > 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Code sent to {sentTo.size} {sentTo.size === 1 ? 'person' : 'people'} ✅
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
