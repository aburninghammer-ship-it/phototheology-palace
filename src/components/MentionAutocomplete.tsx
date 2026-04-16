import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MentionUser {
  id: string;
  display_name: string;
  avatar_url: string | null;
  username: string | null;
}

interface MentionAutocompleteProps {
  query: string;
  onSelect: (user: MentionUser) => void;
  visible: boolean;
}

export function MentionAutocomplete({ query, onSelect, visible }: MentionAutocompleteProps) {
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchUsers = useCallback(async (q: string) => {
    if (!q) { setUsers([]); return; }
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, username')
        .or(`display_name.ilike.%${q}%,username.ilike.%${q}%`)
        .limit(8);
      setUsers((data as MentionUser[]) || []);
      setSelectedIndex(0);
    } catch { setUsers([]); }
  }, []);

  useEffect(() => {
    if (visible && query) {
      const t = setTimeout(() => fetchUsers(query), 150);
      return () => clearTimeout(t);
    } else {
      setUsers([]);
    }
  }, [query, visible, fetchUsers]);

  if (!visible || users.length === 0) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 z-50 bg-popover border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
      {users.map((user, i) => {
        const initials = (user.display_name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
        return (
          <button
            key={user.id}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-accent/50 transition-colors ${i === selectedIndex ? 'bg-accent/40' : ''}`}
            onMouseDown={(e) => { e.preventDefault(); onSelect(user); }}
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{user.display_name}</span>
            {user.username && <span className="text-muted-foreground text-xs">@{user.username}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Parse message content and render @mentions as highlighted spans */
export function renderWithMentions(content: string) {
  // Match @DisplayName (captures word chars, spaces between words, up to reasonable length)
  const mentionRegex = /@([\w][\w\s]{0,30}[\w]|[\w]+)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="bg-primary/20 text-primary font-semibold rounded px-0.5">
        @{match[1]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}
