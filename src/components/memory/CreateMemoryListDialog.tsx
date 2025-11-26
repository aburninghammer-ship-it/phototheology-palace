import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface CreateMemoryListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
}

const BIBLE_VERSIONS = [
  { value: "kjv", label: "King James Version (KJV)" },
  { value: "niv", label: "New International Version (NIV)" },
  { value: "esv", label: "English Standard Version (ESV)" },
  { value: "nlt", label: "New Living Translation (NLT)" },
  { value: "nasb", label: "New American Standard Bible (NASB)" },
];

export function CreateMemoryListDialog({ open, onOpenChange, userId }: CreateMemoryListDialogProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [bibleVersion, setBibleVersion] = useState("kjv");
  const [isPublic, setIsPublic] = useState(false);
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [targetVerseCount, setTargetVerseCount] = useState(10);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("memory_verse_lists")
        .insert({
          user_id: userId,
          title: title.trim(),
          description: description.trim(),
          topic: topic.trim(),
          bible_version: bibleVersion,
          is_public: isPublic,
          is_collaborative: isCollaborative,
          target_verse_count: targetVerseCount,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Memory list created!");
      onOpenChange(false);
      
      // Reset form
      setTitle("");
      setDescription("");
      setTopic("");
      setBibleVersion("kjv");
      setIsPublic(false);
      setIsCollaborative(false);
      setTargetVerseCount(10);

      // Navigate to the list editor
      navigate(`/memory/list/${data.id}`);
    } catch (error) {
      console.error("Error creating list:", error);
      toast.error("Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Memory List</DialogTitle>
          <DialogDescription>
            Create a custom list of verses to memorize with interactive games
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Psalms of Comfort"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Faith, Prayer, Love"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this list is about..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bible-version">Bible Version</Label>
            <Select value={bibleVersion} onValueChange={setBibleVersion}>
              <SelectTrigger id="bible-version">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BIBLE_VERSIONS.map((version) => (
                  <SelectItem key={version.value} value={version.value}>
                    {version.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-count">Target Verse Count</Label>
            <Input
              id="target-count"
              type="number"
              min={1}
              max={50}
              value={targetVerseCount}
              onChange={(e) => setTargetVerseCount(parseInt(e.target.value) || 10)}
            />
            <p className="text-sm text-muted-foreground">
              Recommended: 10 verses per list
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public">Public List</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to discover and use this list
              </p>
            </div>
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="collaborative">Collaborative</Label>
              <p className="text-sm text-muted-foreground">
                Enable team memorization with others
              </p>
            </div>
            <Switch
              id="collaborative"
              checked={isCollaborative}
              onCheckedChange={setIsCollaborative}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create List"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
