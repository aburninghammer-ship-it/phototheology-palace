import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateChallengeDialogProps {
  guildId: string;
  onCreate: (data: {
    guild_id: string;
    room_id: string;
    challenge_title: string;
    challenge_description: string;
    target_completions: number;
    starts_at: string;
    ends_at: string;
    reward_xp: number;
  }) => void;
  isCreating: boolean;
}

export const CreateChallengeDialog = ({ guildId, onCreate, isCreating }: CreateChallengeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("CR");
  const [targetCompletions, setTargetCompletions] = useState(5);
  const [rewardXp, setRewardXp] = useState(100);
  const [durationDays, setDurationDays] = useState(7);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const endsAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    onCreate({
      guild_id: guildId,
      room_id: roomId,
      challenge_title: title,
      challenge_description: description,
      target_completions: targetCompletions,
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      reward_xp: rewardXp,
    });
    setOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Guild Challenge</DialogTitle>
          <DialogDescription>
            Set a challenge for your guild members to complete together
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Challenge Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Master the Concentration Room"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenge and what members need to do..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room">Room</Label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CR">Concentration Room</SelectItem>
                  <SelectItem value="DR">Dimensions Room</SelectItem>
                  <SelectItem value="BL">Blue Room (Sanctuary)</SelectItem>
                  <SelectItem value="PR">Prophecy Room</SelectItem>
                  <SelectItem value="C6">Connect 6</SelectItem>
                  <SelectItem value="TRm">Theme Room</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="target">Target Completions</Label>
              <Input
                id="target"
                type="number"
                min="1"
                value={targetCompletions}
                onChange={(e) => setTargetCompletions(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
              />
            </div>

            <div>
              <Label htmlFor="xp">Reward XP (per completion)</Label>
              <Input
                id="xp"
                type="number"
                min="10"
                step="10"
                value={rewardXp}
                onChange={(e) => setRewardXp(parseInt(e.target.value))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Challenge"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
