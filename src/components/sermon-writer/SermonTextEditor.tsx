import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { VerseHoverOverlay } from './VerseHoverOverlay';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useState, useCallback, useRef } from 'react';
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
import { toast } from 'sonner';
import { VoiceInputButton } from '@/components/ui/VoiceInputButton';

// Bible verse reference pattern - matches "Book Chapter:Verse" or "Book Chapter:Verse-Verse"
const VERSE_PATTERN = /\b((?:1|2|3|I|II|III)?\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?\b/g;

// Cache for expanded verses to avoid re-fetching
const expandedVerseCache = new Map<string, string>();

// Fetch verse text from Bible API
async function fetchVerseText(book: string, chapter: number, startVerse: number, endVerse?: number): Promise<string | null> {
  try {
    const reference = endVerse
      ? `${book} ${chapter}:${startVerse}-${endVerse}`
      : `${book} ${chapter}:${startVerse}`;

    const cacheKey = reference.toLowerCase();
    if (expandedVerseCache.has(cacheKey)) {
      return expandedVerseCache.get(cacheKey)!;
    }

    const apiRef = endVerse
      ? `${book}+${chapter}:${startVerse}-${endVerse}`
      : `${book}+${chapter}:${startVerse}`;

    const response = await fetch(`https://bible-api.com/${encodeURIComponent(apiRef)}?translation=kjv`);
    if (!response.ok) return null;

    const data = await response.json();

    let verseText = '';
    if (data.verses && Array.isArray(data.verses)) {
      verseText = data.verses.map((v: any) => v.text?.trim()).filter(Boolean).join(' ');
    } else if (data.text) {
      verseText = data.text.trim();
    }

    if (verseText) {
      expandedVerseCache.set(cacheKey, verseText);
      return verseText;
    }
    return null;
  } catch (error) {
    console.error('Error fetching verse:', error);
    return null;
  }
}

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
  const [isExpandingVerse, setIsExpandingVerse] = useState(false);
  const verseExpandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExpandedRef = useRef<string>('');
  const editorContainerRef = useRef<HTMLDivElement>(null);

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

      // Debounced verse expansion - wait for user to stop typing
      if (verseExpandTimeoutRef.current) {
        clearTimeout(verseExpandTimeoutRef.current);
      }
      verseExpandTimeoutRef.current = setTimeout(() => {
        expandVerseReferences(editor);
      }, 1500); // Wait 1.5 seconds after typing stops
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to, ' ');
      setSelectedText(text.trim());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[400px] px-4 py-3',
        spellcheck: 'true',
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (verseExpandTimeoutRef.current) {
        clearTimeout(verseExpandTimeoutRef.current);
      }
    };
  }, []);

  // Expand verse references in the editor
  const expandVerseReferences = useCallback(async (editorInstance: any) => {
    if (!editorInstance || isExpandingVerse) return;

    const html = editorInstance.getHTML();
    const textContent = editorInstance.getText();

    // Find all verse references in the text
    const matches = [...textContent.matchAll(VERSE_PATTERN)];
    if (matches.length === 0) return;

    // Find verses that aren't already expanded (not followed by a quote)
    for (const match of matches) {
      const fullMatch = match[0];
      const book = match[1].trim();
      const chapter = parseInt(match[2]);
      const startVerse = parseInt(match[3]);
      const endVerse = match[4] ? parseInt(match[4]) : undefined;

      // Create a unique key for this reference
      const refKey = `${book} ${chapter}:${startVerse}${endVerse ? `-${endVerse}` : ''}`.toLowerCase();

      // Skip if we just expanded this reference
      if (lastExpandedRef.current === refKey) continue;

      // Check if this reference is already followed by verse text (already expanded)
      const refIndex = html.indexOf(fullMatch);
      if (refIndex === -1) continue;

      // Look for a blockquote immediately following the reference
      const afterRef = html.substring(refIndex + fullMatch.length, refIndex + fullMatch.length + 100);
      if (afterRef.includes('<blockquote>') || afterRef.includes('—') || afterRef.includes('"')) {
        continue; // Already expanded
      }

      // Expand this verse
      setIsExpandingVerse(true);
      lastExpandedRef.current = refKey;

      try {
        const verseText = await fetchVerseText(book, chapter, startVerse, endVerse);

        if (verseText && editorInstance) {
          // Find the position of this reference in the editor
          const doc = editorInstance.state.doc;
          let pos = -1;

          doc.descendants((node: any, nodePos: number) => {
            if (pos !== -1) return false;
            if (node.isText && node.text?.includes(fullMatch)) {
              pos = nodePos + node.text.indexOf(fullMatch);
              return false;
            }
          });

          if (pos !== -1) {
            const formattedRef = `${book} ${chapter}:${startVerse}${endVerse ? `-${endVerse}` : ''}`;

            // Create the expanded content with blockquote
            const expandedContent = `<strong>${formattedRef}</strong><blockquote>"${verseText}"</blockquote>`;

            // Replace just the reference with the expanded version
            editorInstance
              .chain()
              .focus()
              .setTextSelection({ from: pos, to: pos + fullMatch.length })
              .deleteSelection()
              .insertContent(expandedContent)
              .run();

            toast.success(`Populated ${formattedRef}`, { duration: 2000 });
          }
        }
      } catch (error) {
        console.error('Error expanding verse:', error);
      } finally {
        setIsExpandingVerse(false);
      }

      // Only expand one verse at a time
      break;
    }
  }, [isExpandingVerse]);

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

        <Separator orientation="vertical" className="h-6 mx-1 bg-slate-700" />

        {/* Voice Input Button */}
        <VoiceInputButton
          onTranscript={(text) => {
            editor.chain().focus().insertContent(text + ' ').run();
          }}
          disabled={disabled}
          className="h-8 w-8 text-slate-400 hover:text-white"
        />

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
      <div className="overflow-y-auto max-h-[500px] sermon-editor relative" ref={editorContainerRef}>
        <EditorContent editor={editor} />
        <VerseHoverOverlay containerRef={editorContainerRef} />
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
