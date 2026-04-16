import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react';
import { ScriptureLookup } from './ScriptureLookup';
import { PTIntegrationPanel } from './PTIntegrationPanel';
import { SavedMaterialsPicker } from './SavedMaterialsPicker';
import { PalaceConnectionsOverlay } from './PalaceConnectionsOverlay';
import { usePalaceConnections } from '@/hooks/usePalaceConnections';
import { fetchChapter } from '@/services/bibleApi';
import { toast } from 'sonner';

export interface SermonRichTextAreaHandle {
  insertAtCursor: (text: string) => void;
}

interface SermonRichTextAreaProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
  showTools?: boolean;
  themePassage?: string;
  onCursorContext?: (context: { before: string; after: string; paragraph: string }) => void;
}

// Regex pattern to match Bible verse references like "John 3:16", "1 Corinthians 13:4-7", "Genesis 1:1"
const VERSE_REFERENCE_PATTERN = /\b([1-3]?\s?[A-Za-z]+)\s+(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/g;

// Pattern to detect verse references inside blockquotes (already expanded)
const BLOCKQUOTE_VERSE_PATTERN = /<blockquote><strong>([^<]+)<\/strong>:\s*"([^"]*)"<\/blockquote>/g;

// Parse a verse reference string into components
function parseVerseReference(ref: string): { book: string; chapter: number; verseStart: number; verseEnd?: number } | null {
  const match = ref.match(/^([1-3]?\s?[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?$/);
  if (!match) return null;
  
  return {
    book: match[1].trim(),
    chapter: parseInt(match[2], 10),
    verseStart: parseInt(match[3], 10),
    verseEnd: match[4] ? parseInt(match[4], 10) : undefined
  };
}

export const SermonRichTextArea = forwardRef<SermonRichTextAreaHandle, SermonRichTextAreaProps>(({
  content,
  onChange,
  placeholder = "Start writing...",
  minHeight = "120px",
  showTools = true,
  themePassage,
  onCursorContext
}, ref) => {
  const lastProcessedRef = useRef<Set<string>>(new Set());
  const verseContentMapRef = useRef<Map<string, string>>(new Map()); // Track ref -> verse text
  const processingRef = useRef(false);
  const { connections, isAnalyzing, analyzeText } = usePalaceConnections();

  const cursorContextDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Extract text around cursor position - focus on what user is currently typing
  const extractCursorContext = useCallback((editor: any) => {
    if (!editor || !onCursorContext) return;

    const { from } = editor.state.selection;
    const doc = editor.state.doc;
    
    // Get the full text content and cursor position
    let fullText = '';
    let cursorOffset = 0;
    let foundCursor = false;
    
    doc.descendants((node: any, pos: number) => {
      if (node.isText) {
        const nodeText = node.text || '';
        const nodeStart = pos;
        const nodeEnd = pos + nodeText.length;
        
        if (!foundCursor && nodeEnd >= from) {
          // Cursor is in or after this node
          const offsetInNode = Math.max(0, from - nodeStart);
          cursorOffset = fullText.length + offsetInNode;
          foundCursor = true;
        }
        fullText += nodeText;
      } else if (node.isBlock && fullText.length > 0 && !fullText.endsWith('\n\n')) {
        // Add paragraph breaks between blocks
        fullText += '\n\n';
        if (!foundCursor && pos >= from) {
          cursorOffset = fullText.length;
          foundCursor = true;
        }
      }
      return true;
    });
    
    // If cursor wasn't found in text nodes, put it at end
    if (!foundCursor) {
      cursorOffset = fullText.length;
    }
    
    // Get text before and after cursor
    const beforeText = fullText.slice(0, cursorOffset);
    const afterText = fullText.slice(cursorOffset);
    
    // Find the current paragraph/sentence the user is typing in
    // Look for the paragraph containing the cursor
    const paragraphsBefore = beforeText.split(/\n\n/);
    const paragraphsAfter = afterText.split(/\n\n/);
    
    const currentParagraphBefore = paragraphsBefore[paragraphsBefore.length - 1] || '';
    const currentParagraphAfter = paragraphsAfter[0] || '';
    // Add space between before and after if both exist and before doesn't end with space
    const needsSpace = currentParagraphBefore && currentParagraphAfter && !currentParagraphBefore.endsWith(' ') && !currentParagraphAfter.startsWith(' ');
    const paragraph = (currentParagraphBefore + (needsSpace ? ' ' : '') + currentParagraphAfter).trim();

    // For suggestions, prioritize the most recent content near cursor
    // Take last 300 chars before cursor for context
    const recentBefore = beforeText.slice(-300).trim();

    console.log("[CursorContext] Paragraph around cursor:", paragraph.slice(-100));
    console.log("[CursorContext] Before cursor:", recentBefore.slice(-80));

    onCursorContext({
      before: recentBefore,
      after: afterText.slice(0, 100).trim(),
      paragraph
    });
  }, [onCursorContext]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      // Also update cursor context on content change (when typing)
      if (cursorContextDebounceRef.current) {
        clearTimeout(cursorContextDebounceRef.current);
      }
      cursorContextDebounceRef.current = setTimeout(() => {
        extractCursorContext(editor);
      }, 400);
    },
    onSelectionUpdate: ({ editor }) => {
      // Debounce cursor context updates - shorter delay for responsive feel
      if (cursorContextDebounceRef.current) {
        clearTimeout(cursorContextDebounceRef.current);
      }
      cursorContextDebounceRef.current = setTimeout(() => {
        extractCursorContext(editor);
      }, 300);
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none px-3 py-2 h-full overflow-y-auto`,
        style: `min-height: ${minHeight}`,
        spellcheck: 'true',
      },
    },
  });

  // Fetch verse text for a given reference with retry logic
  const fetchVerseText = useCallback(async (parsed: { book: string; chapter: number; verseStart: number; verseEnd?: number }, retryCount = 0): Promise<string | null> => {
    const maxRetries = 2;

    try {
      console.log(`[Verse Fetch] Fetching ${parsed.book} ${parsed.chapter}:${parsed.verseStart}${parsed.verseEnd ? `-${parsed.verseEnd}` : ''}`);
      const chapterData = await fetchChapter(parsed.book, parsed.chapter);

      // Check for error or empty verses
      if (!chapterData?.verses?.length || (chapterData as any).error) {
        console.warn(`[Verse Fetch] No verses available for ${parsed.book} ${parsed.chapter}`);

        // Retry if we haven't exceeded max retries
        if (retryCount < maxRetries) {
          console.log(`[Verse Fetch] Retrying... (attempt ${retryCount + 2}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return fetchVerseText(parsed, retryCount + 1);
        }

        toast.error(`Could not fetch ${parsed.book} ${parsed.chapter}:${parsed.verseStart}. Please check your connection.`);
        return null;
      }

      const verseEnd = parsed.verseEnd || parsed.verseStart;
      const verses = chapterData.verses.filter(
        v => v.verse >= parsed.verseStart && v.verse <= verseEnd
      );

      if (verses.length > 0) {
        // Filter out any verses that contain error messages
        const validVerses = verses.filter(v => v.text && !v.text.includes('temporarily unavailable'));
        if (validVerses.length > 0) {
          console.log(`[Verse Fetch] Success! Found ${validVerses.length} verses`);
          return validVerses.map(v => v.text).join(' ');
        }
      }

      console.warn(`[Verse Fetch] Verses ${parsed.verseStart}-${verseEnd} not found in chapter`);
      return null;
    } catch (error) {
      console.error('[Verse Fetch] Error:', error);

      // Retry on error
      if (retryCount < maxRetries) {
        console.log(`[Verse Fetch] Retrying after error... (attempt ${retryCount + 2}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return fetchVerseText(parsed, retryCount + 1);
      }

      toast.error(`Error fetching ${parsed.book} ${parsed.chapter}. Please try again.`);
      return null;
    }
  }, []);

  // Auto-detect and expand verse references + detect edits to existing blockquotes
  const processVerseReferences = useCallback(async () => {
    if (!editor || processingRef.current) return;
    
    const html = editor.getHTML();
    const plainText = html.replace(/<[^>]*>/g, ' ');
    
    // First, check for edited blockquotes (verse reference changed inside an existing blockquote)
    const blockquoteMatches = [...html.matchAll(BLOCKQUOTE_VERSE_PATTERN)];
    for (const match of blockquoteMatches) {
      const refInBlockquote = match[1]; // The verse reference inside <strong>
      const currentVerseText = match[2]; // The current verse text
      
      const parsed = parseVerseReference(refInBlockquote);
      if (!parsed) continue;
      
      // Check if we have a cached version and if it differs
      const cachedText = verseContentMapRef.current.get(refInBlockquote);
      
      if (cachedText === undefined) {
        // First time seeing this ref - cache it
        verseContentMapRef.current.set(refInBlockquote, currentVerseText);
      } else if (cachedText !== currentVerseText) {
        // User might have edited the reference, but the text changed too - skip
        // This is for detecting ref changes, not text changes
      }
    }
    
    // Find all verse references in the text
    const matches = [...plainText.matchAll(VERSE_REFERENCE_PATTERN)];
    
    for (const match of matches) {
      const fullRef = match[0];
      
      // Skip if already processed or inside a blockquote (already expanded)
      if (lastProcessedRef.current.has(fullRef)) continue;
      if (html.includes(`<strong>${fullRef}</strong>`)) {
        lastProcessedRef.current.add(fullRef);
        continue;
      }
      
      const parsed = parseVerseReference(fullRef);
      if (!parsed) continue;
      
      processingRef.current = true;
      console.log(`[Verse Detect] Processing reference: ${fullRef}`);

      try {
        const verseText = await fetchVerseText(parsed);

        if (verseText) {
          // Find and replace the reference with the full verse
          const currentHtml = editor.getHTML();

          // Only replace if it's a standalone reference (not already in a blockquote)
          const refPattern = new RegExp(`(?<!<strong>)${fullRef.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!</strong>)`, 'g');

          if (refPattern.test(currentHtml) && !currentHtml.includes(`"${verseText}"`)) {
            const newHtml = currentHtml.replace(
              refPattern,
              `<blockquote><strong>${fullRef}</strong>: "${verseText}"</blockquote>`
            );

            editor.commands.setContent(newHtml);
            lastProcessedRef.current.add(fullRef);
            verseContentMapRef.current.set(fullRef, verseText);
            toast.success(`Inserted ${fullRef}`);
          } else {
            lastProcessedRef.current.add(fullRef);
          }
        } else {
          // Mark as processed even if fetch failed to avoid infinite retries
          lastProcessedRef.current.add(fullRef);
          console.warn(`[Verse Detect] Could not fetch verse text for ${fullRef}`);
        }
      } catch (error) {
        console.error('[Verse Detect] Error fetching verse:', error);
        // Mark as processed to prevent infinite loop
        lastProcessedRef.current.add(fullRef);
      } finally {
        processingRef.current = false;
      }
    }
  }, [editor, fetchVerseText]);

  // Detect when a verse reference in a blockquote is edited and refresh the verse
  const detectBlockquoteEdits = useCallback(async () => {
    if (!editor || processingRef.current) return;
    
    const html = editor.getHTML();
    const blockquoteMatches = [...html.matchAll(BLOCKQUOTE_VERSE_PATTERN)];
    
    // Build a set of current refs in blockquotes
    const currentRefs = new Set<string>();
    
    for (const match of blockquoteMatches) {
      const refInBlockquote = match[1];
      currentRefs.add(refInBlockquote);
      
      const parsed = parseVerseReference(refInBlockquote);
      if (!parsed) continue;
      
      // If we've processed this ref before but haven't cached its verse text yet
      // OR the ref was just created, fetch and update
      if (!verseContentMapRef.current.has(refInBlockquote) && lastProcessedRef.current.has(refInBlockquote)) {
        // Already handled by processVerseReferences
        continue;
      }
    }
    
    // Check if any previously cached ref is no longer present (user deleted or changed it)
    const cachedRefs = [...verseContentMapRef.current.keys()];
    for (const cachedRef of cachedRefs) {
      if (!currentRefs.has(cachedRef)) {
        // This ref was removed or changed - clean up cache
        verseContentMapRef.current.delete(cachedRef);
        lastProcessedRef.current.delete(cachedRef);
      }
    }
    
    // Look for blockquotes where the verse reference might have been manually edited
    // This detects patterns like <blockquote><strong>John 3:17</strong>: "old text for John 3:16"</blockquote>
    for (const match of blockquoteMatches) {
      const refInBlockquote = match[1];
      const currentVerseText = match[2];
      
      const parsed = parseVerseReference(refInBlockquote);
      if (!parsed) continue;
      
      // Check if this reference is new (user changed the ref inside the blockquote)
      if (!lastProcessedRef.current.has(refInBlockquote)) {
        processingRef.current = true;
        
        try {
          const newVerseText = await fetchVerseText(parsed);
          
          if (newVerseText && newVerseText !== currentVerseText) {
            // Update the blockquote with the correct verse text
            const currentHtml = editor.getHTML();
            const oldBlockquote = `<blockquote><strong>${refInBlockquote}</strong>: "${currentVerseText}"</blockquote>`;
            const newBlockquote = `<blockquote><strong>${refInBlockquote}</strong>: "${newVerseText}"</blockquote>`;
            
            if (currentHtml.includes(oldBlockquote)) {
              const updatedHtml = currentHtml.replace(oldBlockquote, newBlockquote);
              editor.commands.setContent(updatedHtml);
              lastProcessedRef.current.add(refInBlockquote);
              verseContentMapRef.current.set(refInBlockquote, newVerseText);
              toast.success(`Updated verse to ${refInBlockquote}`);
            }
          } else {
            lastProcessedRef.current.add(refInBlockquote);
            if (newVerseText) {
              verseContentMapRef.current.set(refInBlockquote, newVerseText);
            }
          }
        } catch (error) {
          console.error('Error updating verse:', error);
        } finally {
          processingRef.current = false;
        }
      }
    }
  }, [editor, fetchVerseText]);

  // Debounced verse detection - trigger after user stops typing
  useEffect(() => {
    if (!editor) return;
    
    const timeoutId = setTimeout(() => {
      processVerseReferences();
      detectBlockquoteEdits();
    }, 1500); // 1.5 second delay after typing stops
    
    return () => clearTimeout(timeoutId);
  }, [content, processVerseReferences, detectBlockquoteEdits, editor]);

  // Analyze text for Palace connections as user writes
  useEffect(() => {
    if (content) {
      analyzeText(content);
    }
  }, [content, analyzeText]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const insertText = (text: string) => {
    if (editor) {
      editor.chain().focus().insertContent(text + '\n\n').run();
    }
  };

  // Expose insertAtCursor method to parent via ref
  useImperativeHandle(ref, () => ({
    insertAtCursor: (text: string) => {
      if (editor) {
        // Insert at current cursor position with a newline before and after
        editor.chain().focus().insertContent('\n' + text + '\n').run();
      }
    }
  }), [editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg overflow-hidden bg-background h-full flex flex-col">
      {showTools && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          >
            <Quote className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />
          
          <ScriptureLookup onInsert={insertText} />
          <PTIntegrationPanel onInsert={insertText} themePassage={themePassage} />
          <SavedMaterialsPicker onSelectMaterial={(content, title) => insertText(`**From: ${title}**\n${content}`)} />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>
      <PalaceConnectionsOverlay connections={connections} isAnalyzing={isAnalyzing} />
    </div>
  );
});
