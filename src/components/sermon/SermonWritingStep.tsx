import { useState, useEffect, useCallback, useRef } from "react";
import { SermonRichTextArea } from "./SermonRichTextArea";
import { SermonSidePanel } from "./SermonSidePanel";
import { SermonPolishTab } from "./SermonPolishTab";
import { SermonBlockEditor } from "./SermonBlockEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PanelRightClose, PanelRight, Save, Check, Loader2, MessageSquare, Sparkles, LayoutGrid, Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAutoScriptureFetch } from "@/hooks/useAutoScriptureFetch";

const AUTOSAVE_KEY = "sermon_autosave_content";

interface SuggestedVerse {
  reference: string;
  text: string;
  reason: string;
  type?: 'proof' | 'descriptive' | 'connection' | 'amplifying';
}

interface SermonWritingStepProps {
  sermon: {
    title: string;
    theme_passage: string;
    sermon_style: string;
    smooth_stones: string[];
    bridges: string[];
    movie_structure: any;
    full_sermon: string;
  };
  setSermon: (sermon: any) => void;
  themePassage: string;
  sermonId?: string;
}

export function SermonWritingStep({ sermon, setSermon, themePassage, sermonId }: SermonWritingStepProps) {
  const [suggestedVerses, setSuggestedVerses] = useState<SuggestedVerse[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>("");
  const lastSavedContentRef = useRef<string>(sermon.full_sermon);
  
  // Auto scripture fetch hook
  const { detectAndFetchScripture } = useAutoScriptureFetch();
  const [isFetchingScripture, setIsFetchingScripture] = useState(false);
  const scriptureFetchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cursor context for verse suggestions
  const [cursorContext, setCursorContext] = useState<{ before: string; after: string; paragraph: string } | null>(null);
  const cursorContextRef = useRef<{ before: string; after: string; paragraph: string } | null>(null);

  // Parentheses-based scripture lookup state
  const [processingRequest, setProcessingRequest] = useState(false);
  const [clarificationDialog, setClarificationDialog] = useState<{
    open: boolean;
    question: string;
    originalRequest: string;
    matchedText: string;
  }>({ open: false, question: "", originalRequest: "", matchedText: "" });
  const [clarificationAnswer, setClarificationAnswer] = useState("");
  const processedRequestsRef = useRef<Set<string>>(new Set());

  // Load autosaved content from localStorage on mount (protects against browser crashes)
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      if (savedData) {
        const { content, timestamp } = JSON.parse(savedData);
        const hoursSaved = (Date.now() - timestamp) / (1000 * 60 * 60);
        const currentContent = sermon.full_sermon || '';
        // Restore if: content exists, within 24 hours, and current content is empty or shorter
        if (content && hoursSaved < 24 && (!currentContent || currentContent.length < content.length)) {
          setSermon({ ...sermon, full_sermon: content });
          toast.success("Restored your autosaved sermon draft");
        }
      }
    } catch (error) {
      console.error("Error loading autosaved content:", error);
    }
  }, []); // Only run once on mount

  // Auto-save every 15 seconds if content has changed (also saves to localStorage)
  useEffect(() => {
    const currentContent = sermon.full_sermon || '';
    autoSaveRef.current = setInterval(() => {
      if (currentContent !== lastSavedContentRef.current) {
        setIsSaving(true);
        lastSavedContentRef.current = currentContent;
        setLastSaved(new Date());
        // Save to localStorage for crash recovery
        try {
          localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({
            content: currentContent,
            timestamp: Date.now(),
            title: sermon.title || "untitled",
          }));
        } catch (e) {
          console.error("Error saving to localStorage:", e);
        }
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 15000);

    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, [sermon.full_sermon, sermon.title]);

  // Process parentheses-based scripture requests
  const processScriptureRequest = useCallback(async (request: string, matchedText: string, additionalContext?: string) => {
    setProcessingRequest(true);
    try {
      // Use sermon-assistant mode with a specific prompt to find scripture
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "sermon-assistant",
          sermon_title: sermon.title,
          themePassage: themePassage,
          sermon_content: (sermon.full_sermon || '').replace(/<[^>]*>/g, '').slice(-300),
          smooth_stones: sermon.smooth_stones,
          chatMessages: [{
            role: "user",
            content: `Find and provide the exact scripture passage for this request: "${request}"${additionalContext ? ` (Additional context: ${additionalContext})` : ''}

IMPORTANT: Respond in this exact JSON format only:
{
  "reference": "Book Chapter:Verse(s)",
  "scripture": "The full text of the scripture passage"
}

If the request is ambiguous, respond with:
{
  "needs_clarification": true,
  "clarification_question": "Your question"
}

Return ONLY the JSON, no other text.`
          }]
        },
      });

      if (error) throw error;

      // Parse the response - it might be in data.content or data directly
      let responseText = data?.content || data?.response || (typeof data === 'string' ? data : JSON.stringify(data));

      // Try to extract JSON from the response
      let parsed: any = null;
      try {
        // Clean markdown code blocks if present
        let cleanResponse = responseText.trim();
        if (cleanResponse.startsWith('```json')) {
          cleanResponse = cleanResponse.slice(7);
        } else if (cleanResponse.startsWith('```')) {
          cleanResponse = cleanResponse.slice(3);
        }
        if (cleanResponse.endsWith('```')) {
          cleanResponse = cleanResponse.slice(0, -3);
        }
        parsed = JSON.parse(cleanResponse.trim());
      } catch {
        // If not JSON, try to extract scripture reference from text
        console.log("Response wasn't JSON, attempting to parse:", responseText);
      }

      if (parsed?.needs_clarification) {
        setClarificationDialog({
          open: true,
          question: parsed.clarification_question || "Could you be more specific about what you're looking for?",
          originalRequest: request,
          matchedText: matchedText,
        });
        setClarificationAnswer("");
        return;
      }

      if (parsed?.scripture && parsed?.reference) {
        const scriptureHtml = `<blockquote><strong>${parsed.reference}</strong>: "${parsed.scripture}"</blockquote>`;
        const newContent = (sermon.full_sermon || '').replace(matchedText, scriptureHtml);
        setSermon({ ...sermon, full_sermon: newContent });
        toast.success(`Scripture added: ${parsed.reference}`);
        processedRequestsRef.current.add(matchedText);
        return;
      }

      // Fallback: if we got any text response, show it
      if (responseText && responseText.length > 10) {
        toast.info("Jeeves found some context but couldn't format it as scripture. Check the assistant panel.");
        processedRequestsRef.current.add(matchedText); // Mark as processed to avoid retry
        return;
      }

      throw new Error("Could not find the requested scripture");
    } catch (error: any) {
      console.error("Error processing scripture request:", error);
      // Mark as processed to avoid infinite retries
      processedRequestsRef.current.add(matchedText);
      // Show more helpful error message
      const errorMsg = error?.message || "Unknown error";
      if (errorMsg.includes("not found") || errorMsg.includes("mode")) {
        toast.error("Scripture lookup encountered an issue. Try using Jeeves chat instead.");
      } else {
        toast.error(`Failed to fetch scripture. Try Jeeves chat for help.`);
      }
    } finally {
      setProcessingRequest(false);
    }
  }, [sermon, setSermon, themePassage]);

  // Handle clarification submission
  const handleClarificationSubmit = async () => {
    if (!clarificationAnswer.trim()) return;

    setClarificationDialog({ ...clarificationDialog, open: false });
    await processScriptureRequest(
      clarificationDialog.originalRequest,
      clarificationDialog.matchedText,
      clarificationAnswer
    );
    setClarificationAnswer("");
  };

  // Check for parentheses requests in content
  const checkForScriptureRequests = useCallback((content: string) => {
    // Only match text in parentheses that STARTS with action words
    // This prevents triggering on normal parenthetical notes
    const regex = /\(([^)]{15,})\)/g;
    const plainContent = content.replace(/<[^>]*>/g, '');
    let match;

    while ((match = regex.exec(plainContent)) !== null) {
      const fullMatch = match[0];
      const innerText = match[1].trim();

      // Skip if already processed
      if (processedRequestsRef.current.has(fullMatch)) continue;

      // STRICT CHECK: Must start with an action word
      const startsWithAction = /^(find|get|pull|insert|add|show|i need|give me|fetch|look up|lookup)/i.test(innerText);

      // OR must contain explicit scripture words
      const hasScriptureWord = /\b(verse|scripture|passage|bible text)\b/i.test(innerText);

      // Only trigger if it's clearly a scripture request
      if (startsWithAction || hasScriptureWord) {
        // Process this request
        processScriptureRequest(innerText, fullMatch);
        break; // Process one at a time
      }
    }
  }, [processScriptureRequest]);

  // Check for partial verse quotes and complete them
  const checkForPartialVerses = useCallback(async (content: string) => {
    const plainContent = content.replace(/<[^>]*>/g, '');

    // Match quoted text that might be a partial verse (10-150 chars, in quotes)
    // Look for patterns like "For God so loved" or 'the Lord is my shepherd'
    const quoteRegex = /["']([^"']{10,150})["']/g;
    let match;

    while ((match = quoteRegex.exec(plainContent)) !== null) {
      const fullMatch = match[0];
      const quotedText = match[1].trim();

      // Skip if already processed
      if (processedRequestsRef.current.has(fullMatch)) continue;

      // Skip if it already has a reference nearby (within 50 chars after)
      const afterText = plainContent.slice(match.index + fullMatch.length, match.index + fullMatch.length + 50);
      if (/\b(\d+:\d+|\w+\s+\d+:\d+|Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalm|Proverbs|Ecclesiastes|Song|Isaiah|Jeremiah|Lamentations|Ezekiel|Daniel|Hosea|Joel|Amos|Obadiah|Jonah|Micah|Nahum|Habakkuk|Zephaniah|Haggai|Zechariah|Malachi|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\b/i.test(afterText)) {
        continue;
      }

      // Check if the text looks like it might be from Scripture
      // Biblical language patterns
      const biblicalPatterns = [
        /\b(Lord|God|Jesus|Christ|Spirit|Father|Son|heaven|earth|faith|love|hope|grace|mercy|salvation|sin|righteous|holy|blessed|glory|eternal|kingdom|covenant|commandment|prophet|apostle|disciple|lamb|shepherd|light|darkness|truth|life|death|resurrection|cross|blood|sacrifice|temple|altar|priest|angel|devil|satan|soul|heart|peace|joy|forgive|redeem|sanctify|justify|believe|pray|worship|praise|amen|hallelujah|selah)\b/i,
        /\b(thou|thee|thy|thine|hath|doth|shalt|unto|hast|saith|verily|behold|thus)\b/i, // KJV language
        /\b(the Lord|my God|our Father|in Christ|by faith|through grace)\b/i,
      ];

      const looksLikeBible = biblicalPatterns.some(pattern => pattern.test(quotedText));

      if (looksLikeBible) {
        // Mark as being processed to avoid duplicates
        processedRequestsRef.current.add(fullMatch);
        setProcessingRequest(true);

        try {
          const { data, error } = await supabase.functions.invoke("jeeves", {
            body: {
              mode: "sermon-assistant",
              sermon_title: sermon.title,
              themePassage: themePassage,
              chatMessages: [{
                role: "user",
                content: `I have a partial Bible verse quote: "${quotedText}"

Please identify which verse this is from and provide the COMPLETE verse text.

IMPORTANT: Respond in this exact JSON format only:
{
  "reference": "Book Chapter:Verse(s)",
  "scripture": "The complete text of the verse(s)",
  "isMatch": true
}

If this doesn't appear to be from the Bible, respond with:
{
  "isMatch": false
}

Return ONLY the JSON, no other text.`
              }]
            },
          });

          if (error) throw error;

          let responseText = data?.content || data?.response || (typeof data === 'string' ? data : '');
          let cleanResponse = responseText.trim();
          if (cleanResponse.startsWith('```json')) cleanResponse = cleanResponse.slice(7);
          if (cleanResponse.startsWith('```')) cleanResponse = cleanResponse.slice(3);
          if (cleanResponse.endsWith('```')) cleanResponse = cleanResponse.slice(0, -3);

          const parsed = JSON.parse(cleanResponse.trim());

          if (parsed?.isMatch && parsed?.scripture && parsed?.reference) {
            // Replace the partial quote with the full verse in a blockquote
            const scriptureHtml = `<blockquote><strong>${parsed.reference}</strong>: "${parsed.scripture}"</blockquote>`;
            const newContent = content.replace(fullMatch, scriptureHtml);
            setSermon({ ...sermon, full_sermon: newContent });
            toast.success(`Completed verse: ${parsed.reference}`);
          }
        } catch (error) {
          console.error("Error completing partial verse:", error);
          // Don't show error toast, just silently fail
        } finally {
          setProcessingRequest(false);
        }

        break; // Process one at a time
      }
    }
  }, [sermon, setSermon, themePassage]);

  // Debounced function to get verse suggestions based on cursor context
  const fetchVerseSuggestions = useCallback(async (content: string, contextOverride?: { before: string; paragraph: string }) => {
    if (!content || content.length < 50) {
      setSuggestedVerses([]);
      return;
    }

    // PRIORITY: Use context override (from cursor position) if provided
    const context = contextOverride;
    let focusedContent: string;
    
    if (context?.paragraph && context.paragraph.length > 15) {
      // Use the paragraph around cursor - this is the BEST context
      focusedContent = context.paragraph;
      console.log("[VerseSuggestions] Using cursor paragraph:", focusedContent.slice(-100));
    } else if (context?.before && context.before.length > 15) {
      // Use text immediately before cursor
      focusedContent = context.before;
      console.log("[VerseSuggestions] Using cursor before text:", focusedContent.slice(-100));
    } else {
      // Fallback to last 400 characters of content (strip HTML)
      const plainText = content.replace(/<[^>]*>/g, '').trim();
      focusedContent = plainText.slice(-400);
      console.log("[VerseSuggestions] Fallback to end of content:", focusedContent.slice(-100));
    }

    // Only fetch if content has meaningfully changed
    if (focusedContent === lastContentRef.current) {
      console.log("[VerseSuggestions] Content unchanged, skipping");
      return;
    }
    lastContentRef.current = focusedContent;

    setLoadingVerses(true);
    try {
      console.log("[VerseSuggestions] Sending to Jeeves:", focusedContent.slice(-150));
      
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "sermon-verse-suggestions",
          sermon_content: focusedContent,
          themePassage: themePassage,
          stones: sermon.smooth_stones.join("\n"),
        },
      });

      if (error) throw error;

      // Parse the JSON response
      if (data?.verses && Array.isArray(data.verses)) {
        setSuggestedVerses(data.verses.slice(0, 5));
      } else if (data?.content) {
        // Try to parse content as JSON
        try {
          const parsed = JSON.parse(data.content);
          if (parsed.verses && Array.isArray(parsed.verses)) {
            setSuggestedVerses(parsed.verses.slice(0, 5));
          }
        } catch {
          // If not JSON, clear suggestions
          setSuggestedVerses([]);
        }
      }
    } catch (error: any) {
      console.error("Error fetching verse suggestions:", error);
      // Don't show toast for every error to avoid spam, but log for debugging
      if (error?.message?.includes("non-2xx")) {
        console.warn("Verse suggestions: Edge function returned an error. The AI may be overloaded.");
      }
    } finally {
      setLoadingVerses(false);
    }
  }, [themePassage, sermon.smooth_stones]);

  // Handle cursor context changes from editor
  const handleCursorContext = useCallback((context: { before: string; after: string; paragraph: string }) => {
    setCursorContext(context);
    cursorContextRef.current = context;
    
    // Trigger verse suggestions based on new cursor position - faster response
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchVerseSuggestions(sermon.full_sermon, { before: context.before, paragraph: context.paragraph });
    }, 800); // Faster response when cursor moves
  }, [sermon.full_sermon, fetchVerseSuggestions]);

  // Auto-detect and fetch scripture references
  const autoFetchScriptureFromContent = useCallback(async (content: string) => {
    if (isFetchingScripture) return;
    
    setIsFetchingScripture(true);
    try {
      const result = await detectAndFetchScripture(content);
      if (result) {
        // Add to suggested verses for easy insertion
        const newVerse: SuggestedVerse = {
          reference: result.scriptureRef,
          text: result.verseText,
          reason: "Detected from your writing",
          type: 'proof'
        };
        
        // Add to beginning of suggestions, avoiding duplicates
        setSuggestedVerses(prev => {
          const exists = prev.some(v => v.reference.toLowerCase() === result.scriptureRef.toLowerCase());
          if (exists) return prev;
          return [newVerse, ...prev].slice(0, 5);
        });
      }
    } catch (error) {
      console.error("Error auto-fetching scripture:", error);
    } finally {
      setIsFetchingScripture(false);
    }
  }, [detectAndFetchScripture, isFetchingScripture]);

  // Handle content change with debounce
  const handleContentChange = (content: string) => {
    setSermon({ ...sermon, full_sermon: content });

    // Debounce the verse suggestions and scripture lookup
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      fetchVerseSuggestions(content);
      // Check for parentheses-based scripture requests and partial verses
      if (!processingRequest) {
        checkForScriptureRequests(content);
        checkForPartialVerses(content);
      }
    }, 2000); // 2 second debounce
    
    // Separate faster debounce for auto-scripture detection
    if (scriptureFetchDebounceRef.current) {
      clearTimeout(scriptureFetchDebounceRef.current);
    }
    scriptureFetchDebounceRef.current = setTimeout(() => {
      autoFetchScriptureFromContent(content);
    }, 1000); // 1 second debounce for scripture detection
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (scriptureFetchDebounceRef.current) {
        clearTimeout(scriptureFetchDebounceRef.current);
      }
    };
  }, []);

  // Insert verse into sermon and remove from suggestions
  const insertVerse = (verse: SuggestedVerse) => {
    const verseHtml = `<blockquote><strong>${verse.reference}</strong>: "${verse.text}"</blockquote>\n`;
    setSermon({ ...sermon, full_sermon: sermon.full_sermon + verseHtml });
    // Remove the inserted verse from suggestions
    setSuggestedVerses(prev => prev.filter(v => v.reference !== verse.reference));
    toast.success(`${verse.reference} added to sermon`);
  };

  const [activeTab, setActiveTab] = useState<"write" | "polish">("write");
  const [blockMode, setBlockMode] = useState(false);

  return (
    <div className="h-[calc(100vh-280px)] min-h-[500px]">
      {/* Clarification Dialog */}
      <Dialog open={clarificationDialog.open} onOpenChange={(open) => setClarificationDialog({ ...clarificationDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Jeeves Needs Clarification
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Your request: <em>"{clarificationDialog.originalRequest}"</em>
            </p>
            <p className="text-sm font-medium">{clarificationDialog.question}</p>
            <Input
              placeholder="Type your answer..."
              value={clarificationAnswer}
              onChange={(e) => setClarificationAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleClarificationSubmit()}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setClarificationDialog({ ...clarificationDialog, open: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleClarificationSubmit} disabled={!clarificationAnswer.trim()}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "write" | "polish")} className="h-full flex flex-col">
        {/* Header bar with tabs and save indicator */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b">
          <div className="flex items-center gap-4">
            <TabsList className="h-9">
              <TabsTrigger value="write" className="gap-2 text-sm">
                <FileText className="w-4 h-4" />
                Write
              </TabsTrigger>
              <TabsTrigger value="polish" className="gap-2 text-sm">
                <Sparkles className="w-4 h-4" />
                Polish
              </TabsTrigger>
            </TabsList>

            {activeTab === "write" && (
              <div className="flex items-center gap-2">
                {processingRequest ? (
                  <Badge variant="outline" className="gap-1 text-xs text-purple-600 border-purple-200">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Fetching scripture...
                  </Badge>
                ) : isSaving ? (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Save className="w-3 h-3 animate-pulse" />
                    Saving...
                  </Badge>
                ) : lastSaved ? (
                  <Badge variant="outline" className="gap-1 text-xs text-green-600 border-green-200">
                    <Check className="w-3 h-3" />
                    Saved {lastSaved.toLocaleTimeString()}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Save className="w-3 h-3" />
                    Auto-saves every 15s
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {(sermon.full_sermon || '').replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            )}
          </div>

          {activeTab === "write" && (
            <div className="flex items-center gap-2">
              {/* Block Mode Toggle */}
              <Button
                variant={blockMode ? "default" : "outline"}
                size="sm"
                onClick={() => setBlockMode(!blockMode)}
                className="gap-2"
                title="Toggle block mode to rearrange content"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {blockMode ? "Exit Blocks" : "Rearrange"}
                </span>
              </Button>

              {/* Panel Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPanel(!showPanel)}
                className="gap-2"
              >
                {showPanel ? (
                  <>
                  <PanelRightClose className="w-4 h-4" />
                  <span className="hidden sm:inline">Hide Assistant</span>
                </>
              ) : (
                <>
                  <PanelRight className="w-4 h-4" />
                  <span className="hidden sm:inline">Show Assistant</span>
                </>
              )}
              </Button>
            </div>
          )}
        </div>

        {/* Write Tab Content */}
        <TabsContent value="write" className="flex-1 mt-0 h-[calc(100%-60px)]">
          {blockMode ? (
            /* Block Editor Mode - Full Width */
            <div className="h-full border rounded-lg overflow-hidden">
              <SermonBlockEditor
                content={sermon.full_sermon}
                onChange={(newContent) => setSermon({ ...sermon, full_sermon: newContent })}
                onClose={() => setBlockMode(false)}
              />
            </div>
          ) : (
            /* Regular Write Mode */
            <div className={`grid gap-4 h-full ${showPanel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              {/* Left: Writing area - full half */}
              <div className="h-full flex flex-col min-h-0">
                <SermonRichTextArea
                  content={sermon.full_sermon}
                  onChange={handleContentChange}
                  placeholder="Begin writing your sermon here. Type (find verse about...) in parentheses to auto-insert scripture. Start with your opening hook, weave through your smooth stones, build bridges between ideas, lead to your climax, and close with a powerful call to action..."
                  minHeight="100%"
                  showTools={true}
                  themePassage={themePassage}
                  onCursorContext={handleCursorContext}
                />
              </div>

              {/* Right: Assistant Panel with Sparks/Verses/Jeeves + Your 5 Stones - full half */}
              {showPanel && (
                <div className="h-full overflow-hidden min-h-0">
                  <SermonSidePanel
                    suggestedVerses={suggestedVerses}
                    loadingVerses={loadingVerses}
                    onInsertVerse={insertVerse}
                    smoothStones={sermon.smooth_stones}
                    sermonTitle={sermon.title}
                    themePassage={themePassage}
                    sermonContent={sermon.full_sermon}
                    sermonId={sermonId}
                    cursorContext={cursorContext?.paragraph}
                  />
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Polish Tab Content */}
        <TabsContent value="polish" className="flex-1 mt-0 h-[calc(100%-60px)]">
          <SermonPolishTab 
            initialSermonText={sermon.full_sermon || ''} 
            themePassage={themePassage}
            sermonId={sermonId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
