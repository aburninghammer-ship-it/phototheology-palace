import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookmarkPlus, Loader2, Save, Gem, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SaveJeevesResponseButtonProps {
  question: string;
  response: string;
  context?: string;
  variant?: "icon" | "button" | "small";
  className?: string;
}

const FLOOR_ROOMS: Record<number, { label: string; rooms: { id: string; name: string }[] }> = {
  1: { label: "Furnishing", rooms: [
    { id: "sr", name: "Story Room" }, { id: "ir", name: "Imagination Room" },
    { id: "24fps", name: "24FPS" }, { id: "br", name: "Bible Rendered" },
    { id: "tr", name: "Translation" }, { id: "gr", name: "Gems Room" },
  ]},
  2: { label: "Investigation", rooms: [
    { id: "or", name: "Observation" }, { id: "dc", name: "Def-Com" },
    { id: "st", name: "Symbols/Types" }, { id: "qr", name: "Questions" },
    { id: "qa", name: "Q&A Chains" },
  ]},
  3: { label: "Freestyle", rooms: [
    { id: "nf", name: "Nature Freestyle" }, { id: "pf", name: "Personal Freestyle" },
    { id: "bf", name: "Bible Freestyle" }, { id: "hf", name: "History Freestyle" },
    { id: "lr", name: "Listening Room" },
  ]},
  4: { label: "Next Level", rooms: [
    { id: "cr", name: "Concentration" }, { id: "dr", name: "Dimensions" },
    { id: "c6", name: "Connect 6" }, { id: "trm", name: "Theme Room" },
    { id: "tz", name: "Time Zone" }, { id: "prm", name: "Patterns" },
    { id: "par", name: "Parallels" }, { id: "frt", name: "Fruit" },
  ]},
  5: { label: "Vision", rooms: [
    { id: "bl", name: "Blue (Sanctuary)" }, { id: "pr", name: "Prophecy" },
    { id: "3a", name: "Three Angels" }, { id: "fe", name: "Feasts" },
  ]},
  6: { label: "Three Heavens", rooms: [
    { id: "jr", name: "Juice Room" }, { id: "math", name: "Mathematics" },
  ]},
  7: { label: "Spiritual", rooms: [
    { id: "frm", name: "Fire Room" }, { id: "mr", name: "Meditation" },
    { id: "srm", name: "Speed Room" },
  ]},
};

export function SaveJeevesResponseButton({
  question,
  response,
  context,
  variant = "small",
  className,
}: SaveJeevesResponseButtonProps) {
  const [open, setOpen] = useState(false);

  const trigger = variant === "icon" ? (
    <Button variant="ghost" size="icon" className={className} title="Save Jeeves Dialogue">
      <BookmarkPlus className="h-4 w-4" />
    </Button>
  ) : variant === "button" ? (
    <Button variant="outline" size="sm" className={className}>
      <Save className="h-4 w-4 mr-2" />
      Save
    </Button>
  ) : (
    <Button variant="ghost" size="sm" className={className}>
      <BookmarkPlus className="h-3 w-3 mr-1" />
      Save
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <SaveDialog
        question={question}
        response={response}
        context={context}
        onClose={() => setOpen(false)}
      />
    </Dialog>
  );
}

interface SaveDialogProps {
  question: string;
  response: string;
  context?: string;
  onClose: () => void;
}

function SaveDialog({ question, response, context, onClose }: SaveDialogProps) {
  const [tab, setTab] = useState<"study" | "gem">("gem");
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [floorNumber, setFloorNumber] = useState<number>(1);
  const [roomId, setRoomId] = useState<string>("gr");
  const [category, setCategory] = useState<string>("jeeves-dialogue");

  const extractTags = () => {
    const bibleBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "Samuel", "Kings", "Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "Thessalonians", "Timothy", "Titus", "Philemon", "Hebrews", "James", "Peter", "Jude", "Revelation"];
    const combined = `${question} ${response}`;
    const tags: string[] = ["jeeves"];
    bibleBooks.forEach(book => {
      if (combined.toLowerCase().includes(book.toLowerCase())) tags.push(book);
    });
    return [...new Set(tags)];
  };

  const handleSaveAsStudy = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to save"); return; }

      const date = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      const studyTitle = title.trim() || `Jeeves Dialogue: ${question.slice(0, 50)}${question.length > 50 ? '...' : ''}`;

      let content = `# ${studyTitle}\n\n**Date:** ${date}\n\n`;
      if (context) content += `**Context:** ${context}\n\n`;
      content += `---\n\n## Question\n\n${question}\n\n## Jeeves Response\n\n${response}\n\n`;
      if (notes.trim()) content += `---\n\n## My Notes\n\n${notes}\n\n`;

      const { error } = await supabase.from("user_studies").insert({
        user_id: user.id,
        title: studyTitle,
        content,
        tags: extractTags(),
      });
      if (error) throw error;

      toast.success("Saved to My Studies!");
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save to My Studies");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAsGem = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Please sign in to save gems"); return; }

      const gemTitle = title.trim() || `Jeeves Gem: ${question.slice(0, 50)}${question.length > 50 ? '...' : ''}`;

      let gemContent = `**Question:**\n${question}\n\n**Jeeves Response:**\n${response}`;
      if (notes.trim()) gemContent += `\n\n**My Notes:**\n${notes}`;

      const { error } = await (supabase as any).from("user_gems").insert({
        user_id: user.id,
        gem_name: gemTitle,
        gem_content: gemContent,
        floor_number: floorNumber,
        room_id: roomId,
        category: category,
      });
      if (error) throw error;

      toast.success("Gem saved! 💎", { description: "Your Jeeves dialogue has been saved to the Gems Room." });
      onClose();
    } catch (error) {
      console.error("Error saving gem:", error);
      toast.error("Failed to save gem");
    } finally {
      setSaving(false);
    }
  };

  const currentRooms = FLOOR_ROOMS[floorNumber]?.rooms || [];

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Save Jeeves Dialogue</DialogTitle>
      </DialogHeader>

      <Tabs value={tab} onValueChange={(v) => setTab(v as "study" | "gem")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gem" className="gap-1.5">
            <Gem className="h-3.5 w-3.5" />
            Save as Gem
          </TabsTrigger>
          <TabsTrigger value="study" className="gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            Save to Studies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gem" className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="gem-title">Gem Title</Label>
            <Input
              id="gem-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Jeeves Gem: ${question.slice(0, 30)}...`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Palace Floor</Label>
              <Select
                value={String(floorNumber)}
                onValueChange={(v) => {
                  const f = Number(v);
                  setFloorNumber(f);
                  setRoomId(FLOOR_ROOMS[f]?.rooms[0]?.id || "gr");
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(FLOOR_ROOMS).map(([num, { label }]) => (
                    <SelectItem key={num} value={num}>F{num}: {label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Room</Label>
              <Select value={roomId} onValueChange={setRoomId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {currentRooms.map(r => (
                    <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
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
                <SelectItem value="jeeves-dialogue">Jeeves Dialogue</SelectItem>
                <SelectItem value="insight">Insight</SelectItem>
                <SelectItem value="pattern">Pattern</SelectItem>
                <SelectItem value="connection">Connection</SelectItem>
                <SelectItem value="prophecy">Prophecy</SelectItem>
                <SelectItem value="sanctuary">Sanctuary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gem-notes">My Notes (optional)</Label>
            <Textarea
              id="gem-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why is this gem valuable to you?"
              rows={2}
            />
          </div>

          <div className="rounded-md bg-amber-500/10 border border-amber-500/20 p-3">
            <p className="text-xs text-amber-200/80">
              <Gem className="h-3 w-3 inline mr-1" />
              Gems are insights you've uncovered through Jeeves dialogues. Tag them with the Palace room that best describes the principle at work.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="study" className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="study-title">Study Title</Label>
            <Input
              id="study-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Jeeves Dialogue: ${question.slice(0, 30)}...`}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="study-notes">Add Notes (optional)</Label>
            <Textarea
              id="study-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your own thoughts or notes..."
              rows={3}
            />
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button
          onClick={tab === "gem" ? handleSaveAsGem : handleSaveAsStudy}
          disabled={saving}
          className={tab === "gem" ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white" : ""}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : tab === "gem" ? (
            <Gem className="h-4 w-4 mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {tab === "gem" ? "Save as Gem 💎" : "Save to My Studies"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
