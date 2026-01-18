import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Palette, Copy, Check, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StyledMarkdown } from "@/components/ui/styled-markdown";
import { fetchChapter } from "@/services/bibleApi";

// Book name variants for verse reference detection
const BOOK_VARIANTS: Record<string, string> = {
  "gen": "Genesis", "genesis": "Genesis", "gn": "Genesis",
  "exo": "Exodus", "exodus": "Exodus", "exod": "Exodus", "ex": "Exodus",
  "lev": "Leviticus", "leviticus": "Leviticus", "lv": "Leviticus",
  "num": "Numbers", "numbers": "Numbers", "nm": "Numbers",
  "deu": "Deuteronomy", "deut": "Deuteronomy", "deuteronomy": "Deuteronomy", "dt": "Deuteronomy",
  "jos": "Joshua", "josh": "Joshua", "joshua": "Joshua",
  "jdg": "Judges", "judg": "Judges", "judges": "Judges",
  "rut": "Ruth", "ruth": "Ruth",
  "1sa": "1 Samuel", "1sam": "1 Samuel", "1 sam": "1 Samuel", "1 samuel": "1 Samuel",
  "2sa": "2 Samuel", "2sam": "2 Samuel", "2 sam": "2 Samuel", "2 samuel": "2 Samuel",
  "1ki": "1 Kings", "1kgs": "1 Kings", "1 kings": "1 Kings",
  "2ki": "2 Kings", "2kgs": "2 Kings", "2 kings": "2 Kings",
  "1ch": "1 Chronicles", "1chr": "1 Chronicles", "1 chronicles": "1 Chronicles",
  "2ch": "2 Chronicles", "2chr": "2 Chronicles", "2 chronicles": "2 Chronicles",
  "ezr": "Ezra", "ezra": "Ezra",
  "neh": "Nehemiah", "nehemiah": "Nehemiah",
  "est": "Esther", "esth": "Esther", "esther": "Esther",
  "job": "Job",
  "psa": "Psalms", "psalm": "Psalms", "psalms": "Psalms", "ps": "Psalms",
  "pro": "Proverbs", "prov": "Proverbs", "proverbs": "Proverbs",
  "ecc": "Ecclesiastes", "eccl": "Ecclesiastes", "ecclesiastes": "Ecclesiastes",
  "sng": "Song of Solomon", "song": "Song of Solomon", "song of solomon": "Song of Solomon", "sos": "Song of Solomon",
  "isa": "Isaiah", "isaiah": "Isaiah",
  "jer": "Jeremiah", "jeremiah": "Jeremiah",
  "lam": "Lamentations", "lamentations": "Lamentations",
  "ezk": "Ezekiel", "ezek": "Ezekiel", "ezekiel": "Ezekiel",
  "dan": "Daniel", "daniel": "Daniel",
  "hos": "Hosea", "hosea": "Hosea",
  "jol": "Joel", "joel": "Joel",
  "amo": "Amos", "amos": "Amos",
  "oba": "Obadiah", "obad": "Obadiah", "obadiah": "Obadiah",
  "jon": "Jonah", "jonah": "Jonah",
  "mic": "Micah", "micah": "Micah",
  "nam": "Nahum", "nahum": "Nahum",
  "hab": "Habakkuk", "habakkuk": "Habakkuk",
  "zep": "Zephaniah", "zeph": "Zephaniah", "zephaniah": "Zephaniah",
  "hag": "Haggai", "haggai": "Haggai",
  "zec": "Zechariah", "zech": "Zechariah", "zechariah": "Zechariah",
  "mal": "Malachi", "malachi": "Malachi",
  "mat": "Matthew", "matt": "Matthew", "matthew": "Matthew", "mt": "Matthew",
  "mrk": "Mark", "mark": "Mark", "mk": "Mark",
  "luk": "Luke", "luke": "Luke", "lk": "Luke",
  "jhn": "John", "john": "John", "jn": "John",
  "act": "Acts", "acts": "Acts",
  "rom": "Romans", "romans": "Romans",
  "1co": "1 Corinthians", "1cor": "1 Corinthians", "1 cor": "1 Corinthians", "1 corinthians": "1 Corinthians",
  "2co": "2 Corinthians", "2cor": "2 Corinthians", "2 cor": "2 Corinthians", "2 corinthians": "2 Corinthians",
  "gal": "Galatians", "galatians": "Galatians",
  "eph": "Ephesians", "ephesians": "Ephesians",
  "php": "Philippians", "phil": "Philippians", "philippians": "Philippians",
  "col": "Colossians", "colossians": "Colossians",
  "1th": "1 Thessalonians", "1thess": "1 Thessalonians", "1 thessalonians": "1 Thessalonians",
  "2th": "2 Thessalonians", "2thess": "2 Thessalonians", "2 thessalonians": "2 Thessalonians",
  "1ti": "1 Timothy", "1tim": "1 Timothy", "1 timothy": "1 Timothy",
  "2ti": "2 Timothy", "2tim": "2 Timothy", "2 timothy": "2 Timothy",
  "tit": "Titus", "titus": "Titus",
  "phm": "Philemon", "philem": "Philemon", "philemon": "Philemon",
  "heb": "Hebrews", "hebrews": "Hebrews",
  "jas": "James", "james": "James",
  "1pe": "1 Peter", "1pet": "1 Peter", "1 peter": "1 Peter",
  "2pe": "2 Peter", "2pet": "2 Peter", "2 peter": "2 Peter",
  "1jn": "1 John", "1john": "1 John", "1 john": "1 John",
  "2jn": "2 John", "2john": "2 John", "2 john": "2 John",
  "3jn": "3 John", "3john": "3 John", "3 john": "3 John",
  "jud": "Jude", "jude": "Jude",
  "rev": "Revelation", "revelation": "Revelation", "revelations": "Revelation"
};

interface ParsedReference {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

function parseVerseReference(text: string): ParsedReference | null {
  const pattern = /\b((?:[123]|I{1,3})?\s*[A-Za-z]+(?:\s+of\s+[A-Za-z]+)?)\s+(\d{1,3}):(\d{1,3})(?:-(\d{1,3}))?\b/i;
  const match = pattern.exec(text);
  if (!match) return null;

  const [, bookPart, chapterStr, verseStartStr, verseEndStr] = match;
  const bookKey = bookPart.toLowerCase().trim();
  const book = BOOK_VARIANTS[bookKey];
  if (!book) return null;

  return {
    book,
    chapter: parseInt(chapterStr, 10),
    verseStart: parseInt(verseStartStr, 10),
    verseEnd: verseEndStr ? parseInt(verseEndStr, 10) : undefined
  };
}

async function fetchVerseText(ref: ParsedReference): Promise<string> {
  const chapter = await fetchChapter(ref.book, ref.chapter, "kjv");
  const verses = chapter.verses.filter(v =>
    v.verse >= ref.verseStart && v.verse <= (ref.verseEnd || ref.verseStart)
  );

  const reference = `${ref.book} ${ref.chapter}:${ref.verseStart}${ref.verseEnd ? `-${ref.verseEnd}` : ''}`;
  const verseText = verses.map(v => `${v.verse} ${v.text}`).join(' ');

  return `[${reference}] ${verseText}`;
}

export function WordPictureTranslator() {
  const [inputText, setInputText] = useState("");
  const [wordPicture, setWordPicture] = useState("");
  const [sourceText, setSourceText] = useState(""); // Full source text from Bible
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter a verse or passage to translate");
      return;
    }

    setIsLoading(true);
    setWordPicture("");
    setSourceText("");

    try {
      let textToTranslate = inputText.trim();
      let fetchedSourceText = "";

      // Check if input is or contains a verse reference
      const ref = parseVerseReference(textToTranslate);
      if (ref) {
        // User provided a reference - fetch the full text
        try {
          fetchedSourceText = await fetchVerseText(ref);
          textToTranslate = fetchedSourceText;
          setSourceText(fetchedSourceText);
          toast.success("Loaded verse text!");
        } catch (fetchError) {
          console.error("Error fetching verse:", fetchError);
          // Continue with original input if fetch fails
        }
      }

      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "word_picture_translation",
          text: textToTranslate,
          includeSourceText: true, // Tell Jeeves to include the source text in response
        },
      });

      if (error) throw error;

      const result = data?.wordPicture || data?.content;
      if (result) {
        setWordPicture(result);
        toast.success("Word picture created!");
      } else {
        throw new Error("No word picture returned");
      }
    } catch (error) {
      console.error("Error translating to word picture:", error);
      toast.error("Failed to create word picture. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!wordPicture) return;
    
    await navigator.clipboard.writeText(wordPicture);
    setCopied(true);
    toast.success("Word picture copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setWordPicture("");
    setSourceText("");
  };

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-6 w-6 text-primary" />
          <span>Word Picture Translator</span>
          <Sparkles className="h-5 w-5 text-amber-500" />
        </CardTitle>
        <CardDescription>
          Transform Scripture into vivid, memorable word-pictures. Enter a verse or passage and Jeeves will paint it with evocative imagery that anchors truth in your imagination.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Enter a Verse or Passage</label>
          <Textarea
            placeholder={`e.g., "The Lord is my shepherd; I shall not want." (Psalm 23:1)\n\nor paste a longer passage to translate into word imagery...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Painting Word Picture...
              </>
            ) : (
              <>
                <Palette className="mr-2 h-4 w-4" />
                Translate to Word Picture
              </>
            )}
          </Button>
          {(inputText || wordPicture) && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>

        {/* Source Text Display */}
        {sourceText && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-100 mb-2">
                  Source Text (KJV)
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {sourceText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Word Picture Output */}
        {wordPicture && (
          <div className="relative mt-6 p-6 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800">
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">🎨</span>
              <div>
                <h4 className="font-semibold text-lg text-amber-900 dark:text-amber-100">
                  Word Picture
                </h4>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  A vivid rendering for your imagination
                </p>
              </div>
            </div>

            <div className="prose prose-amber dark:prose-invert max-w-none">
              <StyledMarkdown content={wordPicture} className="text-foreground leading-relaxed italic" />
            </div>
          </div>
        )}

        {/* Example Tip */}
        {!wordPicture && !isLoading && (
          <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Tip:</strong> Word pictures turn abstract truths into concrete mental images. 
              Instead of just reading "God is my refuge," you'll see a fortress rising from mountain rock, 
              feel its cool stone walls, and hear the storm raging harmlessly outside.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
