import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  PenLine, 
  Plus, 
  Trash2, 
  Cloud, 
  CloudOff, 
  Check,
  Edit2,
  X
} from "lucide-react";
import { useOfflineNotes, OfflineNote } from "@/hooks/useOfflineNotes";
import { format } from "date-fns";
import { useSparks } from "@/hooks/useSparks";
import { SparkContainer, SparkSettings } from "@/components/sparks";
import { VoiceInputButton } from "@/components/ui/VoiceInputButton";

interface QuickNotesProps {
  className?: string;
  compact?: boolean;
}

export const QuickNotes = ({ className = "", compact = false }: QuickNotesProps) => {
  const { notes, addNote, updateNote, deleteNote, isOnline, isSyncing } = useOfflineNotes();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContent, setNewContent] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const pauseDetectRef = useRef<NodeJS.Timeout | null>(null);

  // Sparks integration
  const { 
    sparks, 
    preferences,
    generateSpark, 
    openSpark, 
    saveSpark, 
    dismissSpark,
    exploreSpark,
    updatePreferences,
    generating 
  } = useSparks({
    surface: 'notes',
    contextType: 'note_block',
    contextId: editingId || 'new'
  });


  // Detect typing pause for spark generation
  const handleContentChange = useCallback((content: string) => {
    if (pauseDetectRef.current) {
      clearTimeout(pauseDetectRef.current);
    }

    // Only trigger spark if content is substantial (280+ chars)
    if (content.length >= 280 && preferences?.intensity !== 'off') {
      pauseDetectRef.current = setTimeout(() => {
        generateSpark(content);
      }, 10000); // 10 second pause
    }
  }, [generateSpark, preferences?.intensity]);

  // Trigger spark on save
  const handleSaveWithSpark = useCallback((content: string) => {
    if (content.length >= 100 && preferences?.intensity !== 'off') {
      generateSpark(content);
    }
  }, [generateSpark, preferences?.intensity]);

  // Auto-save while typing (debounced) + trigger spark detection
  useEffect(() => {
    if (editingId && editContent) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
      autoSaveRef.current = setTimeout(() => {
        updateNote(editingId, editContent, editTitle);
      }, 1000);
      
      // Trigger pause detection for sparks
      handleContentChange(editContent);
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, [editContent, editTitle, editingId, updateNote, handleContentChange]);

  const handleAddNote = () => {
    if (!newContent.trim()) return;
    addNote(newContent, newTitle || undefined);
    handleSaveWithSpark(newContent);
    setNewContent("");
    setNewTitle("");
    setIsAdding(false);
  };

  const startEditing = (note: OfflineNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
    setEditTitle(note.title || "");
  };

  const stopEditing = () => {
    if (editingId && editContent) {
      updateNote(editingId, editContent, editTitle);
      handleSaveWithSpark(editContent);
    }
    setEditingId(null);
    setEditContent("");
    setEditTitle("");
  };

  if (compact) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Quick Notes
            </CardTitle>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Cloud className="h-3 w-3 text-green-500" />
              ) : (
                <CloudOff className="h-3 w-3 text-muted-foreground" />
              )}
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(true)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {isAdding && (
            <div className="space-y-2 mb-3">
              <Input
                placeholder="Title (optional)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-8 text-sm"
              />
              <Textarea
                placeholder="Jot down your thoughts..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="min-h-[60px] text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddNote} disabled={!newContent.trim()}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          <ScrollArea className="h-[150px]">
            <div className="space-y-2">
              {notes.slice(0, 5).map((note) => (
                <div
                  key={note.id}
                  className="p-2 rounded-md bg-muted/50 text-xs cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => startEditing(note)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium truncate">{note.title}</span>
                    {note.synced && <Check className="h-3 w-3 text-green-500" />}
                  </div>
                  <p className="text-muted-foreground line-clamp-2">{note.content}</p>
                </div>
              ))}
              {notes.length === 0 && !isAdding && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No notes yet. Tap + to add one.
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} relative`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PenLine className="h-5 w-5" />
            My Notes
            <Badge variant="secondary" className="ml-2">
              {notes.length}
            </Badge>
            {sparks.length > 0 && (
              <Badge variant="outline" className="ml-1 text-amber-500 border-amber-500/30">
                🔥 {sparks.length}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <SparkSettings
              preferences={preferences}
              onUpdate={updatePreferences}
            />
            {isOnline ? (
              <Badge variant="outline" className="text-xs">
                <Cloud className="h-3 w-3 mr-1 text-green-500" />
                Online
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <CloudOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            )}
            <Button size="sm" onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-1" />
              New Note
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {/* Spark Container - shows in top right */}
      {sparks.length > 0 && (
        <div className="absolute top-16 right-4 z-10">
          <SparkContainer
            sparks={sparks}
            onOpen={openSpark}
            onSave={saveSpark}
            onDismiss={dismissSpark}
            onExplore={exploreSpark}
          />
        </div>
      )}
      
      
      <CardContent>
        {isAdding && (
          <Card className="mb-4 border-primary/30">
            <CardContent className="pt-4 space-y-3">
              <div className="relative">
                <Input
                  placeholder="Note title (optional)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="pr-10"
                />
                <VoiceInputButton
                  onTranscript={(text) => setNewTitle(prev => prev + (prev ? ' ' : '') + text)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                />
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Write your thoughts, contemplations, insights..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="min-h-[100px] pr-10"
                  autoFocus
                />
                <VoiceInputButton
                  onTranscript={(text) => setNewContent(prev => prev + (prev ? ' ' : '') + text)}
                  className="absolute right-2 top-2"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddNote} disabled={!newContent.trim()}>
                  <Check className="h-4 w-4 mr-1" />
                  Save Note
                </Button>
                <Button variant="ghost" onClick={() => setIsAdding(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={`transition-all ${editingId === note.id ? "ring-2 ring-primary" : ""}`}
              >
                <CardContent className="pt-4">
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          placeholder="Title"
                          className="pr-10"
                        />
                        <VoiceInputButton
                          onTranscript={(text) => setEditTitle(prev => prev + (prev ? ' ' : '') + text)}
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                        />
                      </div>
                      <div className="relative">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[80px] pr-10"
                          autoFocus
                        />
                        <VoiceInputButton
                          onTranscript={(text) => setEditContent(prev => prev + (prev ? ' ' : '') + text)}
                          className="absolute right-2 top-2"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Auto-saving...</span>
                        <Button size="sm" variant="ghost" onClick={stopEditing}>
                          <X className="h-4 w-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{note.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(note.updated_at), "MMM d, yyyy h:mm a")}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {note.synced && <Check className="h-4 w-4 text-green-500" />}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => startEditing(note)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
            {notes.length === 0 && !isAdding && (
              <div className="text-center py-8">
                <PenLine className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notes yet</p>
                <p className="text-sm text-muted-foreground">
                  Start jotting down your thoughts and contemplations
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
