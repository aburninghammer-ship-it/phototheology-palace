import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListPlus, Check, Plus } from "lucide-react";
import { usePlaylist } from "@/hooks/usePlaylist";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface AddToPlaylistButtonProps {
  title: string;
  description?: string;
  audioType: string;
  audioUrl?: string;
  audioMeta?: Record<string, any>;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showLabel?: boolean;
}

export function AddToPlaylistButton({
  title,
  description,
  audioType,
  audioUrl,
  audioMeta,
  variant = "ghost",
  size = "sm",
  className,
  showLabel = true,
}: AddToPlaylistButtonProps) {
  const { addItem, playlists, createPlaylist } = usePlaylist();
  const [open, setOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const handleAddTo = async (playlistId: string) => {
    const ok = await addItem({
      title,
      description,
      audio_type: audioType,
      audio_url: audioUrl,
      audio_meta: audioMeta,
      targetPlaylistId: playlistId,
    });
    if (ok) {
      setJustAdded(playlistId);
      setTimeout(() => setJustAdded(null), 2000);
      setOpen(false);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const pl = await createPlaylist(newName.trim());
    if (pl) {
      await handleAddTo(pl.id);
      setNewName("");
    }
    setCreating(false);
  };

  if (justAdded) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Check className="h-4 w-4" />
        {showLabel && <span className="ml-1">Added!</span>}
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          title={`Add "${title}" to a playlist`}
        >
          <ListPlus className="h-4 w-4" />
          {showLabel && <span className="ml-1">+ Playlist</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <p className="text-xs font-medium text-muted-foreground px-2 py-1">Add to playlist</p>
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {playlists.length === 0 && (
            <p className="text-xs text-muted-foreground px-2 py-2">No playlists yet</p>
          )}
          {playlists.map((pl) => (
            <button
              key={pl.id}
              onClick={() => handleAddTo(pl.id)}
              className="w-full text-left px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors truncate"
            >
              {pl.name}
            </button>
          ))}
        </div>
        <div className="border-t border-border mt-1 pt-1">
          <div className="flex gap-1 px-1">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New playlist name..."
              className="h-7 text-xs"
              onKeyDown={(e) => e.key === "Enter" && handleCreateAndAdd()}
            />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 shrink-0"
              onClick={handleCreateAndAdd}
              disabled={creating || !newName.trim()}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
