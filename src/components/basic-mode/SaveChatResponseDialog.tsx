/**
 * SaveChatResponseDialog — Save a Jeeves chat response as a Gem or Study
 */
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Gem, BookOpen, Loader2, X, Sparkles } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

interface SaveChatResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responseContent: string;
  userQuestion: string;
  conversationHistory?: { role: string; content: string }[];
}

const FLOOR_OPTIONS = [
  { value: 1, label: "Floor 1 — Furnishing" },
  { value: 2, label: "Floor 2 — Investigation" },
  { value: 3, label: "Floor 3 — Freestyle" },
  { value: 4, label: "Floor 4 — Next Level" },
  { value: 5, label: "Floor 5 — Vision" },
  { value: 6, label: "Floor 6 — Three Heavens" },
  { value: 7, label: "Floor 7 — Spiritual" },
];

const ROOM_OPTIONS: Record<number, { value: string; label: string }[]> = {
  1: [
    { value: "SR", label: "Story Room" },
    { value: "IR", label: "Imagination Room" },
    { value: "24", label: "24FPS" },
    { value: "BR", label: "Bible Rendered" },
    { value: "TR", label: "Translation" },
    { value: "GR", label: "Gems" },
  ],
  2: [
    { value: "OR", label: "Observation" },
    { value: "DC", label: "Def-Com" },
    { value: "ST", label: "Symbols/Types" },
    { value: "QR", label: "Questions" },
    { value: "QA", label: "Q&A Chains" },
  ],
  3: [
    { value: "NF", label: "Nature Freestyle" },
    { value: "PF", label: "Personal Freestyle" },
    { value: "BF", label: "Bible Freestyle" },
    { value: "HF", label: "History/Social" },
    { value: "LR", label: "Listening Room" },
  ],
  4: [
    { value: "CR", label: "Concentration" },
    { value: "DR", label: "Dimensions" },
    { value: "C6", label: "Connect 6" },
    { value: "TRm", label: "Theme Room" },
    { value: "TZ", label: "Time Zone" },
    { value: "PRm", label: "Patterns" },
    { value: "P", label: "Parallels" },
    { value: "FRt", label: "Fruit" },
  ],
  5: [
    { value: "BL", label: "Blue (Sanctuary)" },
    { value: "PR", label: "Prophecy" },
    { value: "3A", label: "Three Angels" },
  ],
  6: [
    { value: "JR", label: "Juice Room" },
    { value: "CY", label: "Cycles" },
    { value: "TH", label: "Three Heavens" },
  ],
  7: [
    { value: "FRm", label: "Fire Room" },
    { value: "MR", label: "Meditation" },
    { value: "SRm", label: "Speed Room" },
  ],
};

const CATEGORY_OPTIONS = [
  "Insight",
  "Pattern",
  "Connection",
  "Prophecy",
  "Christ Type",
  "Sanctuary Link",
  "Application",
  "Question",
  "Other",
];

export function SaveChatResponseDialog({
  open,
  onOpenChange,
  responseContent,
  userQuestion,
  conversationHistory,
}: SaveChatResponseDialogProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<"gem" | "study">("gem");
  const [saving, setSaving] = useState(false);

  // Gem fields
  const [gemName, setGemName] = useState("");
  const [floor, setFloor] = useState<number>(1);
  const [room, setRoom] = useState("");
  const [category, setCategory] = useState("Insight");

  // Study fields
  const [studyTitle, setStudyTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleSaveGem = async () => {
    if (!user || !gemName.trim() || !room) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("user_gems").insert({
        user_id: user.id,
        gem_name: gemName.trim(),
        gem_content: responseContent,
        floor_number: floor,
        room_id: room,
        category,
      });
      if (error) throw error;
      toast.success("Gem saved to your treasury!");
      onOpenChange(false);
      resetFields();
    } catch (err) {
      console.error("Error saving gem:", err);
      toast.error("Failed to save gem");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStudy = async () => {
    if (!user || !studyTitle.trim()) return;
    setSaving(true);
    try {
      const convo = conversationHistory || [
        { role: "user", content: userQuestion },
        { role: "assistant", content: responseContent },
      ];
      const { error } = await supabase.from("user_studies").insert({
        user_id: user.id,
        title: studyTitle.trim(),
        content: responseContent,
        tags,
        jeeves_conversation: convo as unknown as Json,
      });
      if (error) throw error;
      toast.success("Study saved!");
      onOpenChange(false);
      resetFields();
    } catch (err) {
      console.error("Error saving study:", err);
      toast.error("Failed to save study");
    } finally {
      setSaving(false);
    }
  };

  const resetFields = () => {
    setGemName("");
    setFloor(1);
    setRoom("");
    setCategory("Insight");
    setStudyTitle("");
    setTags([]);
    setTagInput("");
  };

  const rooms = ROOM_OPTIONS[floor] || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Save This Response
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "gem" | "study")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gem" className="flex items-center gap-1.5">
              <Gem className="h-3.5 w-3.5" />
              Save as Gem
            </TabsTrigger>
            <TabsTrigger value="study" className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Save to Studies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gem" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Gem Name</Label>
              <Input
                value={gemName}
                onChange={(e) => setGemName(e.target.value)}
                placeholder="e.g., Christ in Genesis 22"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Floor</Label>
                <Select
                  value={String(floor)}
                  onValueChange={(v) => {
                    setFloor(Number(v));
                    setRoom("");
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FLOOR_OPTIONS.map((f) => (
                      <SelectItem key={f.value} value={String(f.value)}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Room</Label>
                <Select value={room} onValueChange={setRoom}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground max-h-24 overflow-y-auto">
              {responseContent.slice(0, 300)}
              {responseContent.length > 300 && "..."}
            </div>

            <Button
              onClick={handleSaveGem}
              disabled={saving || !gemName.trim() || !room}
              className="w-full"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Gem className="h-4 w-4 mr-2" />}
              Save Gem
            </Button>
          </TabsContent>

          <TabsContent value="study" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Study Title</Label>
              <Input
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                placeholder="e.g., Deep dive on the Passover Lamb"
              />
            </div>
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-xs">
                      {tag}
                      <button onClick={() => setTags(tags.filter((t) => t !== tag))} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground max-h-24 overflow-y-auto">
              {responseContent.slice(0, 300)}
              {responseContent.length > 300 && "..."}
            </div>

            <Button
              onClick={handleSaveStudy}
              disabled={saving || !studyTitle.trim()}
              className="w-full"
            >
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BookOpen className="h-4 w-4 mr-2" />}
              Save Study
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
