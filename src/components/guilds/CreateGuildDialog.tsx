import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface CreateGuildDialogProps {
  onCreate: (data: {
    name: string;
    description: string;
    guild_type: 'house' | 'order' | 'squad';
    max_members: number;
  }) => void;
  isCreating: boolean;
}

export const CreateGuildDialog = ({ onCreate, isCreating }: CreateGuildDialogProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<'house' | 'order' | 'squad'>('squad');
  const [maxMembers, setMaxMembers] = useState(12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      guild_type: type,
      max_members: maxMembers,
    });
    setOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Guild
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Your Guild</DialogTitle>
          <DialogDescription>
            Form a community to master the Palace together
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Guild Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Sanctuary Seekers"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your guild's mission?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="type">Guild Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="house">🏰 House (Family-style, 8-15 members)</SelectItem>
                <SelectItem value="order">⚔️ Order (Mission-focused, 15-25 members)</SelectItem>
                <SelectItem value="squad">🛡️ Squad (Small team, 4-8 members)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="maxMembers">Max Members</Label>
            <Input
              id="maxMembers"
              type="number"
              min="4"
              max="25"
              value={maxMembers}
              onChange={(e) => setMaxMembers(parseInt(e.target.value))}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Guild"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};