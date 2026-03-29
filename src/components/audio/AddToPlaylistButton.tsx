import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListPlus, Check } from "lucide-react";
import { usePlaylist } from "@/hooks/usePlaylist";
import { toast } from "sonner";

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
  const { addItem, isFull, items } = usePlaylist();
  const [justAdded, setJustAdded] = useState(false);

  const alreadyInPlaylist = items.some(
    (i) => i.title === title && i.audio_type === audioType
  );

  const handleAdd = async () => {
    if (alreadyInPlaylist) {
      toast.info("Already in your playlist");
      return;
    }
    const ok = await addItem({
      title,
      description,
      audio_type: audioType,
      audio_url: audioUrl,
      audio_meta: audioMeta,
    });
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  if (alreadyInPlaylist || justAdded) {
    return (
      <Button variant={variant} size={size} className={className} disabled>
        <Check className="h-4 w-4" />
        {showLabel && <span className="ml-1">In Playlist</span>}
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleAdd}
      disabled={isFull}
      title={isFull ? "Playlist full (7 max)" : `Add "${title}" to playlist`}
    >
      <ListPlus className="h-4 w-4" />
      {showLabel && <span className="ml-1">+ Playlist</span>}
    </Button>
  );
}
