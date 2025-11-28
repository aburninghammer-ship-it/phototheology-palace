import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StickyNote, Plus, Trash2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerseNote } from "@/hooks/useVerseNotes";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VerseNoteEditorProps {
  verse: number;
  notes: VerseNote[];
  onAdd: (verse: number, content: string) => Promise<VerseNote | null>;
  onUpdate: (noteId: string, content: string) => void;
  onDelete: (noteId: string) => void;
}

export const VerseNoteEditor = ({
  verse,
  notes,
  onAdd,
  onUpdate,
  onDelete,
}: VerseNoteEditorProps) => {
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAdd = async () => {
    if (!newNote.trim()) return;
    await onAdd(verse, newNote.trim());
    setNewNote("");
  };

  const startEdit = (note: VerseNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const saveEdit = () => {
    if (editingId && editContent.trim()) {
      onUpdate(editingId, editContent.trim());
      setEditingId(null);
      setEditContent("");
    }
  };

  const hasNotes = notes.length > 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
            hasNotes && "opacity-100"
          )}
        >
          <StickyNote className={cn(
            "h-3 w-3",
            hasNotes ? "text-amber-500" : "text-muted-foreground"
          )} />
          {hasNotes && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {notes.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Notes for verse {verse}</h4>
          
          {notes.length > 0 && (
            <ScrollArea className="max-h-48">
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="p-2 rounded-lg bg-muted/50 text-sm">
                    {editingId === note.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px] text-sm"
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <Button size="sm" onClick={saveEdit} className="h-7">
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingId(null)}
                            className="h-7"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="whitespace-pre-wrap">{note.content}</p>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEdit(note)}
                            className="h-6 text-xs"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete(note.id)}
                            className="h-6 text-xs text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <div className="space-y-2">
            <Textarea
              placeholder="Add a note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[60px] text-sm"
            />
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={!newNote.trim()}
              className="w-full"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Note
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
