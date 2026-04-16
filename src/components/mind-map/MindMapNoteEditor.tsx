import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Pencil, Trash2 } from 'lucide-react';

interface MindMapNoteEditorProps {
  nodeId: string | null;
  nodeLabel: string;
  position: { x: number; y: number } | null;
  initialNote: string;
  onSave: (nodeId: string, note: string) => void;
  onClose: () => void;
}

export default function MindMapNoteEditor({
  nodeId,
  nodeLabel,
  position,
  initialNote,
  onSave,
  onClose,
}: MindMapNoteEditorProps) {
  const [note, setNote] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(!initialNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update note when node changes
  useEffect(() => {
    setNote(initialNote);
    setIsEditing(!initialNote);
  }, [nodeId, initialNote]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (nodeId) {
      onSave(nodeId, note);
      setIsEditing(false);
    }
  }, [nodeId, note, onSave]);

  const handleClear = useCallback(() => {
    if (nodeId) {
      setNote('');
      onSave(nodeId, '');
    }
  }, [nodeId, onSave]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter to save
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    // Escape to close
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  }, [handleSave, onClose]);

  if (!nodeId || !position) return null;

  return (
    <div
      className="absolute z-50 pointer-events-auto"
      style={{
        left: position.x + 20,
        top: position.y - 20,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="bg-card/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-72 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="flex items-center gap-2 min-w-0">
            <Pencil className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs font-semibold text-foreground truncate">
              {nodeLabel}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          {isEditing ? (
            <>
              <textarea
                ref={textareaRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your notes here..."
                className="w-full h-32 px-3 py-2 text-sm bg-background/50 border border-white/10 rounded-lg
                           resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50
                           text-foreground placeholder:text-muted-foreground"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">
                  Cmd+Enter to save
                </span>
                <div className="flex items-center gap-1">
                  {note && (
                    <button
                      onClick={handleClear}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg
                                 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg
                               bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                onClick={() => setIsEditing(true)}
                className="w-full min-h-[80px] px-3 py-2 text-sm bg-background/30 border border-white/5 rounded-lg
                           cursor-pointer hover:bg-background/50 transition-colors"
              >
                {note ? (
                  <p className="text-foreground/90 whitespace-pre-wrap">{note}</p>
                ) : (
                  <p className="text-muted-foreground italic">Click to add notes...</p>
                )}
              </div>
              <div className="flex items-center justify-end mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
                             text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
              </div>
            </>
          )}
        </div>

        {/* Note indicator */}
        {note && !isEditing && (
          <div className="px-3 pb-2">
            <div className="flex items-center gap-1.5 text-[10px] text-green-400">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Note saved
            </div>
          </div>
        )}
      </div>

      {/* Arrow pointer */}
      <div
        className="absolute bottom-0 left-6 w-3 h-3 bg-card/95 border-r border-b border-white/20 transform rotate-45 translate-y-1/2"
      />
    </div>
  );
}
