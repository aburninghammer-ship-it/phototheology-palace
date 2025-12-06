import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Loader2, FolderOpen, Tag, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type StudyExportType = 
  | "commentary" 
  | "thought-analysis" 
  | "gem" 
  | "card-deck" 
  | "room-insight"
  | "apologetics"
  | "general";

interface ExportToStudyButtonProps {
  type: StudyExportType;
  title: string;
  content: string;
  metadata?: {
    book?: string;
    chapter?: number;
    verse?: string;
    room?: string;
    floor?: string;
    score?: number;
    depth?: string;
  };
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const TYPE_LABELS: Record<StudyExportType, { label: string; icon: string; color: string }> = {
  commentary: { label: "Jeeves Commentary", icon: "🎙️", color: "bg-amber-500/20 text-amber-600" },
  "thought-analysis": { label: "Thought Analysis", icon: "🧠", color: "bg-purple-500/20 text-purple-600" },
  gem: { label: "Gem", icon: "💎", color: "bg-emerald-500/20 text-emerald-600" },
  "card-deck": { label: "Card Deck Study", icon: "🃏", color: "bg-blue-500/20 text-blue-600" },
  "room-insight": { label: "Room Insight", icon: "🏛️", color: "bg-indigo-500/20 text-indigo-600" },
  apologetics: { label: "Apologetics", icon: "⚔️", color: "bg-red-500/20 text-red-600" },
  general: { label: "Study", icon: "📖", color: "bg-gray-500/20 text-gray-600" },
};

export function ExportToStudyButton({
  type,
  title,
  content,
  metadata,
  variant = "outline",
  size = "sm",
  className,
}: ExportToStudyButtonProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [studyTitle, setStudyTitle] = useState(title);
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([type]);
  const [newTag, setNewTag] = useState("");

  const typeInfo = TYPE_LABELS[type];

  const formatContent = () => {
    const date = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    let formatted = `# ${studyTitle}\n\n`;
    formatted += `**Exported from:** ${typeInfo.icon} ${typeInfo.label}\n`;
    formatted += `**Date:** ${date}\n\n`;

    if (metadata) {
      formatted += `---\n\n`;
      formatted += `## Study Details\n\n`;
      if (metadata.book) formatted += `- **Book:** ${metadata.book}\n`;
      if (metadata.chapter) formatted += `- **Chapter:** ${metadata.chapter}\n`;
      if (metadata.verse) formatted += `- **Verse:** ${metadata.verse}\n`;
      if (metadata.room) formatted += `- **Palace Room:** ${metadata.room}\n`;
      if (metadata.floor) formatted += `- **Floor:** ${metadata.floor}\n`;
      if (metadata.depth) formatted += `- **Depth Level:** ${metadata.depth}\n`;
      if (metadata.score !== undefined) formatted += `- **Score:** ${metadata.score}/100\n`;
      formatted += `\n`;
    }

    formatted += `---\n\n`;
    formatted += `## Content\n\n`;
    formatted += content;

    if (notes.trim()) {
      formatted += `\n\n---\n\n`;
      formatted += `## My Notes\n\n`;
      formatted += notes;
    }

    formatted += `\n\n---\n\n`;
    formatted += `## Next Steps\n\n`;
    formatted += `- [ ] Review this study\n`;
    formatted += `- [ ] Connect to related passages\n`;
    formatted += `- [ ] Apply to daily life\n`;
    formatted += `- [ ] Share insights with others\n`;

    return formatted;
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleExport = async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        toast.error("Please sign in to save studies");
        return;
      }

      const formattedContent = formatContent();

      const { data, error } = await supabase
        .from("user_studies")
        .insert({
          user_id: session.user.id,
          title: studyTitle,
          content: formattedContent,
          tags: tags,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Exported to My Studies!", {
        action: {
          label: "View",
          onClick: () => navigate(`/my-studies/${data.id}`),
        },
      });

      setOpen(false);
    } catch (error) {
      console.error("Error exporting to study:", error);
      toast.error("Failed to export. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <FolderOpen className="w-4 h-4 mr-2" />
          Save to My Studies
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Export to My Studies
          </DialogTitle>
          <DialogDescription>
            Save this {typeInfo.label.toLowerCase()} to continue studying later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Type Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Type:</span>
            <Badge className={typeInfo.color}>
              {typeInfo.icon} {typeInfo.label}
            </Badge>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="study-title">Study Title</Label>
            <Input
              id="study-title"
              value={studyTitle}
              onChange={(e) => setStudyTitle(e.target.value)}
              placeholder="Enter a title for your study..."
            />
          </div>

          {/* Preview of metadata */}
          {metadata && (
            <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
              {metadata.book && metadata.chapter && (
                <p><span className="text-muted-foreground">Reference:</span> {metadata.book} {metadata.chapter}{metadata.verse ? `:${metadata.verse}` : ""}</p>
              )}
              {metadata.room && (
                <p><span className="text-muted-foreground">Room:</span> {metadata.room}</p>
              )}
              {metadata.score !== undefined && (
                <p><span className="text-muted-foreground">Score:</span> {metadata.score}/100</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Add Personal Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any personal notes or reflections..."
              className="min-h-[80px]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                className="flex-1"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                <Tag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={saving || !studyTitle.trim()}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Save to My Studies
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
