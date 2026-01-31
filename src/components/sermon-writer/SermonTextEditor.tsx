import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Languages,
  Loader2,
  Book,
  Search,
} from 'lucide-react';
import { searchStrongs, StrongsEntry, getStrongsEntry } from '@/services/strongsApi';
import { StrongsModal } from '@/components/bible/StrongsModal';

interface SermonTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SermonTextEditor = ({
  content,
  onChange,
  disabled = false,
  placeholder = "Start writing your sermon here...",
}: SermonTextEditorProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [lookupResults, setLookupResults] = useState<StrongsEntry[]>([]);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showStrongsModal, setShowStrongsModal] = useState(false);
  const [selectedStrongsNumber, setSelectedStrongsNumber] = useState('');
  const [lookupPopoverOpen, setLookupPopoverOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-emerald-400 underline hover:text-emerald-300 cursor-pointer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text.trim());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3',
      },
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Update disabled state
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled);
    }
  }, [disabled, editor]);

  // Look up the selected word in Strong's concordance
  const lookupWord = useCallback(async () => {
    if (!selectedText || selectedText.length < 2) return;

    setIsLookingUp(true);
    setLookupResults([]);
    setLookupPopoverOpen(true);

    try {
      // Clean the word - remove punctuation
      const cleanWord = selectedText.replace(/[.,!?;:'"()[\]{}]/g, '').trim().toLowerCase();

      // Search for the word
      const results = await searchStrongs(cleanWord);
      setLookupResults(results);
    } catch (error) {
      console.error('Error looking up word:', error);
    } finally {
      setIsLookingUp(false);
    }
  }, [selectedText]);

  const openStrongsDetails = (strongsNumber: string) => {
    setSelectedStrongsNumber(strongsNumber);
    setShowStrongsModal(true);
    setLookupPopoverOpen(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900/50">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-700 bg-slate-800/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 w-8 ${editor.isActive('bold') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 w-8 ${editor.isActive('italic') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-8 w-8 ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 w-8 ${editor.isActive('bulletList') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 w-8 ${editor.isActive('orderedList') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 w-8 ${editor.isActive('blockquote') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          className="h-8 w-8 text-slate-400 hover:text-white"
          disabled={disabled || !editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          className="h-8 w-8 text-slate-400 hover:text-white"
          disabled={disabled || !editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>

        {/* Hebrew/Greek Lookup Button */}
        <div className="ml-auto">
          <Popover open={lookupPopoverOpen} onOpenChange={setLookupPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={lookupWord}
                disabled={disabled || !selectedText || selectedText.length < 2}
                className={`gap-2 ${
                  selectedText && selectedText.length >= 2
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
                    : 'bg-slate-800/50 border-slate-600 text-slate-400'
                }`}
              >
                <Languages className="h-4 w-4" />
                {selectedText && selectedText.length >= 2 ? (
                  <span className="hidden sm:inline">Look up "{selectedText.slice(0, 15)}{selectedText.length > 15 ? '...' : ''}"</span>
                ) : (
                  <span className="hidden sm:inline">Select word to lookup</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-80 p-0 bg-slate-900 border-slate-700"
              align="end"
            >
              <div className="p-3 border-b border-slate-700">
                <h4 className="font-medium text-white flex items-center gap-2">
                  <Languages className="h-4 w-4 text-emerald-400" />
                  Greek/Hebrew Lookup
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Looking up: <span className="text-emerald-400 font-medium">"{selectedText}"</span>
                </p>
              </div>

              <ScrollArea className="max-h-64">
                {isLookingUp ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                  </div>
                ) : lookupResults.length > 0 ? (
                  <div className="p-2 space-y-2">
                    {lookupResults.map((entry) => (
                      <button
                        key={entry.number}
                        onClick={() => openStrongsDetails(entry.number)}
                        className="w-full text-left p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <Badge variant="outline" className="shrink-0 bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
                            {entry.number}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-serif text-white">{entry.word}</span>
                              <span className="text-xs text-slate-400 italic">{entry.transliteration}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {entry.definition}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {entry.usage.slice(0, 3).map((use, idx) => (
                                <Badge key={idx} variant="secondary" className="text-[10px] bg-slate-700 text-slate-300">
                                  {use}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="h-8 w-8 mx-auto mb-3 text-slate-500 opacity-50" />
                    <p className="text-slate-400 text-sm">No matches found</p>
                    <p className="text-slate-500 text-xs mt-1">
                      Try common biblical words like "love", "faith", "grace"
                    </p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bubble Menu - appears on selection */}
      {editor && (
        <BubbleMenu
          editor={editor}
          className="flex items-center gap-1 p-1 rounded-lg bg-slate-800 border border-slate-600 shadow-xl"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`h-7 w-7 ${editor.isActive('bold') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`h-7 w-7 ${editor.isActive('italic') ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <Separator orientation="vertical" className="h-4 mx-0.5 bg-slate-600" />
          <Button
            variant="ghost"
            size="sm"
            onClick={lookupWord}
            className="h-7 px-2 gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-slate-700"
          >
            <Languages className="h-3.5 w-3.5" />
            <span className="text-xs">Hebrew/Greek</span>
          </Button>
        </BubbleMenu>
      )}

      {/* Editor Content */}
      <div className="overflow-y-auto max-h-[500px] sermon-editor">
        <EditorContent editor={editor} />
      </div>

      {/* Strong's Modal */}
      <StrongsModal
        strongsNumber={selectedStrongsNumber}
        isOpen={showStrongsModal}
        onClose={() => setShowStrongsModal(false)}
      />

      <style>{`
        .sermon-editor .ProseMirror {
          min-height: 400px;
        }
        .sermon-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #64748b;
          pointer-events: none;
          position: absolute;
        }
        .sermon-editor .ProseMirror:focus {
          outline: none;
        }
        .sermon-editor .ProseMirror h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: white;
        }
        .sermon-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: white;
        }
        .sermon-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: white;
        }
        .sermon-editor .ProseMirror p {
          color: #e2e8f0;
          line-height: 1.75;
          margin-bottom: 0.75rem;
        }
        .sermon-editor .ProseMirror blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1rem;
          margin-left: 0;
          color: #94a3b8;
          font-style: italic;
        }
        .sermon-editor .ProseMirror ul,
        .sermon-editor .ProseMirror ol {
          padding-left: 1.5rem;
          color: #e2e8f0;
        }
        .sermon-editor .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .sermon-editor .ProseMirror code {
          background: #1e293b;
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};
