import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookmarkPlus, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SaveJeevesResponseButtonProps {
  question: string;
  response: string;
  context?: string;
  variant?: "icon" | "button" | "small";
  className?: string;
}

export function SaveJeevesResponseButton({
  question,
  response,
  context,
  variant = "small",
  className,
}: SaveJeevesResponseButtonProps) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to save to My Studies");
        return;
      }

      const date = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });

      const studyTitle = title.trim() || `Jeeves Response: ${question.slice(0, 50)}${question.length > 50 ? '...' : ''}`;

      let content = `# ${studyTitle}\n\n`;
      content += `**Date:** ${date}\n\n`;
      if (context) {
        content += `**Context:** ${context}\n\n`;
      }
      content += `---\n\n`;
      content += `## Question\n\n`;
      content += `${question}\n\n`;
      content += `## Jeeves Response\n\n`;
      content += `${response}\n\n`;
      
      if (notes.trim()) {
        content += `---\n\n`;
        content += `## My Notes\n\n`;
        content += `${notes}\n\n`;
      }

      // Extract tags from question and response
      const bibleBooks = ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "Samuel", "Kings", "Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs", "Ecclesiastes", "Song", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "Thessalonians", "Timothy", "Titus", "Philemon", "Hebrews", "James", "Peter", "Jude", "Revelation"];
      
      const combinedText = `${question} ${response}`;
      const tags: string[] = ["jeeves"];
      
      bibleBooks.forEach(book => {
        if (combinedText.toLowerCase().includes(book.toLowerCase())) {
          tags.push(book);
        }
      });

      const { error } = await supabase
        .from("user_studies")
        .insert({
          user_id: user.id,
          title: studyTitle,
          content,
          tags: [...new Set(tags)],
        });

      if (error) throw error;

      toast.success("Saved to My Studies!");
      setOpen(false);
      setTitle("");
      setNotes("");
    } catch (error) {
      console.error("Error saving Jeeves response:", error);
      toast.error("Failed to save to My Studies");
    } finally {
      setSaving(false);
    }
  };

  if (variant === "icon") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className={className} title="Save to My Studies">
            <BookmarkPlus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <SaveDialog
          title={title}
          setTitle={setTitle}
          notes={notes}
          setNotes={setNotes}
          saving={saving}
          onSave={handleSave}
          question={question}
        />
      </Dialog>
    );
  }

  if (variant === "button") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className={className}>
            <Save className="h-4 w-4 mr-2" />
            Save to Study
          </Button>
        </DialogTrigger>
        <SaveDialog
          title={title}
          setTitle={setTitle}
          notes={notes}
          setNotes={setNotes}
          saving={saving}
          onSave={handleSave}
          question={question}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <BookmarkPlus className="h-3 w-3 mr-1" />
          Save
        </Button>
      </DialogTrigger>
      <SaveDialog
        title={title}
        setTitle={setTitle}
        notes={notes}
        setNotes={setNotes}
        saving={saving}
        onSave={handleSave}
        question={question}
      />
    </Dialog>
  );
}

interface SaveDialogProps {
  title: string;
  setTitle: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  saving: boolean;
  onSave: () => void;
  question: string;
}

function SaveDialog({ title, setTitle, notes, setNotes, saving, onSave, question }: SaveDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Save Jeeves Response</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="study-title">Study Title</Label>
          <Input
            id="study-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Jeeves Response: ${question.slice(0, 30)}...`}
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
      </div>
      <DialogFooter>
        <Button onClick={onSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save to My Studies
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
