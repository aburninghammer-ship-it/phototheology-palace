import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Save, Trash2, Edit2, StickyNote, BookOpen } from "lucide-react";
import { useVerseNotes, VerseNote } from "@/hooks/useVerseNotes";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface ResearchUserNotesPanelProps {
  book: string;
  chapter: number;
  verse: number | null;
  verseText: string;
}

export const ResearchUserNotesPanel = ({
  book,
  chapter,
  verse,
  verseText,
}: ResearchUserNotesPanelProps) => {
  const { user } = useAuth();
  const { notes, loading, addNote, updateNote, deleteNote, getNotesForVerse } = useVerseNotes(book, chapter);
  
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);

  const verseNotes = verse ? getNotesForVerse(verse) : [];
  const allChapterNotes = notes;

  const handleAddNote = async () => {
    if (!newNoteContent.trim() || !verse) return;
    setSaving(true);
    await addNote(verse, newNoteContent.trim());
    setNewNoteContent("");
    setSaving(false);
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return;
    setSaving(true);
    await updateNote(noteId, editContent.trim());
    setEditingId(null);
    setEditContent("");
    setSaving(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
  };

  const startEdit = (note: VerseNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <StickyNote className="h-10 w-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm mb-2">Sign in to save your notes</p>
        <p className="text-xs text-muted-foreground/70">
          Your study notes will be synced across devices
        </p>
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="p-6">
        <div className="text-center text-muted-foreground mb-6">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select a verse to add notes</p>
        </div>
        
        {/* Show all chapter notes */}
        {allChapterNotes.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              All notes for {book} {chapter}
            </h4>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2 pr-2">
                {allChapterNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-lg bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-[10px]">
                        Verse {note.verse}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(note.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4">
      {/* Verse Reference Header */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs bg-primary/20 border-primary/30">
            {book} {chapter}:{verse}
          </Badge>
        </div>
        <p className="text-sm italic text-muted-foreground line-clamp-3">
          "{verseText}"
        </p>
      </div>

      {/* Add New Note */}
      <div className="space-y-2">
        <Textarea
          placeholder="Write your notes, observations, or reflections on this verse..."
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          className="min-h-[100px] text-sm bg-white/5 border-white/10 resize-none"
        />
        <Button
          onClick={handleAddNote}
          disabled={!newNoteContent.trim() || saving}
          className="w-full"
          size="sm"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Add Note
        </Button>
      </div>

      {/* Existing Notes for this Verse */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : verseNotes.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-amber-500" />
            Your Notes ({verseNotes.length})
          </h4>
          <ScrollArea className="max-h-[250px]">
            <div className="space-y-2 pr-2">
              {verseNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-3 rounded-lg bg-white/5 border border-white/10 transition-all",
                    editingId === note.id && "ring-1 ring-primary"
                  )}
                >
                  {editingId === note.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px] text-sm bg-white/5 border-white/10"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdateNote(note.id)}
                          disabled={saving}
                          className="h-7"
                        >
                          {saving ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Save className="h-3 w-3 mr-1" />
                          )}
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
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(note.updated_at).toLocaleString()}
                        </span>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(note)}
                            className="h-6 w-6"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteNote(note.id)}
                            className="h-6 w-6 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          <p className="text-xs">No notes yet for this verse</p>
        </div>
      )}
    </div>
  );
};
