import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useUserMusic } from "@/hooks/useUserMusic";

export const AddExternalMusicDialog = () => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [mood, setMood] = useState("");
  const { addExternalMusic } = useUserMusic();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !name) return;

    addExternalMusic(
      { url, name, mood: mood || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          setUrl("");
          setName("");
          setMood("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Music Link
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Music to Playlist</DialogTitle>
            <DialogDescription>
              Add external music links (Suno, YouTube, etc.) to your playlist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="url">Music URL</Label>
              <Input
                id="url"
                placeholder="https://suno.com/s/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Track Name</Label>
              <Input
                id="name"
                placeholder="My favorite song"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mood">Mood (optional)</Label>
              <Input
                id="mood"
                placeholder="peaceful, energetic, etc."
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add to Playlist</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
