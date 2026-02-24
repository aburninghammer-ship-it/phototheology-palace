// PT Scrabble Verse Selection Screen
// Select a seed verse/story to start Bible study scrabble game

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Book, Search, Sparkles, BookOpen, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { fetchChapter } from '@/services/bibleApi';
import { toast } from 'sonner';

export interface SelectedVerse {
  reference: string;
  text: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
}

interface VerseSelectionScreenProps {
  onVerseSelected: (verse: SelectedVerse) => void;
  onBack: () => void;
}

// Large pool of seed verses for randomized selection
const ALL_POPULAR_VERSES = [
  // Gospel & Love
  { ref: 'John 3:16', label: 'God\'s Love' },
  { ref: 'Romans 5:8', label: 'God\'s Love Demonstrated' },
  { ref: 'John 15:13', label: 'Greatest Love' },
  { ref: '1 John 4:7-8', label: 'Love from God' },
  
  // Creation & Origins
  { ref: 'Genesis 1:1', label: 'Creation' },
  { ref: 'Genesis 1:26-27', label: 'Image of God' },
  { ref: 'John 1:1-14', label: 'The Word Made Flesh' },
  { ref: 'Colossians 1:15-17', label: 'Christ the Creator' },
  
  // Types & Shadows
  { ref: 'Exodus 12:1-13', label: 'Passover Lamb' },
  { ref: 'Genesis 22:1-14', label: 'Abraham\'s Sacrifice' },
  { ref: 'Numbers 21:4-9', label: 'Bronze Serpent' },
  { ref: 'Jonah 1:17-2:10', label: 'Sign of Jonah' },
  
  // Suffering Servant
  { ref: 'Isaiah 53:5-6', label: 'Suffering Servant' },
  { ref: 'Isaiah 53:1-12', label: 'Full Suffering Servant' },
  { ref: 'Psalm 22:1-18', label: 'Messianic Psalm' },
  { ref: 'Isaiah 9:6-7', label: 'Prince of Peace' },
  
  // Shepherd & Refuge
  { ref: 'Psalm 23:1-6', label: 'The Good Shepherd' },
  { ref: 'John 10:11-18', label: 'I Am the Good Shepherd' },
  { ref: 'Ezekiel 34:11-16', label: 'God Seeks His Sheep' },
  { ref: 'Psalm 91:1-4', label: 'Under His Wings' },
  
  // Prophecy
  { ref: 'Daniel 2:31-45', label: 'Nebuchadnezzar\'s Dream' },
  { ref: 'Daniel 7:13-14', label: 'Son of Man' },
  { ref: 'Revelation 14:6-12', label: 'Three Angels' },
  { ref: 'Daniel 9:24-27', label: 'Seventy Weeks' },
  
  // Commission & Mission
  { ref: 'Matthew 28:18-20', label: 'Great Commission' },
  { ref: 'Acts 1:8', label: 'Witnesses to the Ends' },
  { ref: 'Isaiah 6:1-8', label: 'Here Am I, Send Me' },
  { ref: 'Romans 10:13-15', label: 'Beautiful Feet' },
  
  // Sanctuary
  { ref: 'Hebrews 9:11-14', label: 'Greater Tabernacle' },
  { ref: 'Exodus 25:8-9', label: 'Build Me a Sanctuary' },
  { ref: 'Hebrews 4:14-16', label: 'Our High Priest' },
  { ref: 'Revelation 11:19', label: 'Ark in Heaven' },
  
  // Faith & Trust
  { ref: 'Hebrews 11:1-6', label: 'Faith Defined' },
  { ref: 'Romans 8:28', label: 'All Things Work Together' },
  { ref: 'Proverbs 3:5-6', label: 'Trust in the Lord' },
  { ref: 'Jeremiah 29:11', label: 'Plans for Hope' },
  
  // Salvation
  { ref: 'Ephesians 2:8-10', label: 'Saved by Grace' },
  { ref: 'Titus 3:4-7', label: 'Washing of Regeneration' },
  { ref: 'Romans 6:23', label: 'Gift of God' },
  { ref: 'Acts 4:12', label: 'No Other Name' },
  
  // Second Coming
  { ref: 'John 14:1-3', label: 'I Will Come Again' },
  { ref: '1 Thessalonians 4:16-17', label: 'Caught Up Together' },
  { ref: 'Revelation 22:12-14', label: 'Behold I Come Quickly' },
  { ref: 'Matthew 24:30-31', label: 'Coming in Clouds' },
];

// Shuffle array using Fisher-Yates algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Parse a scripture reference string
function parseReference(ref: string): { book: string; chapter: number; verseStart: number; verseEnd?: number } | null {
  const pattern = /^((?:\d\s*)?[A-Za-z]+(?:\s+[A-Za-z]+)?)\s*(\d+)(?::(\d+)(?:\s*[-–—]\s*(\d+))?)?$/;
  const match = ref.trim().match(pattern);
  
  if (!match) return null;
  
  const [, book, chapter, verseStart, verseEnd] = match;
  
  return {
    book: book.trim(),
    chapter: parseInt(chapter),
    verseStart: verseStart ? parseInt(verseStart) : 1,
    verseEnd: verseEnd ? parseInt(verseEnd) : undefined,
  };
}

export function VerseSelectionScreen({ onVerseSelected, onBack }: VerseSelectionScreenProps) {
  const [tab, setTab] = useState<'search' | 'quick' | 'custom'>('quick');
  const [searchRef, setSearchRef] = useState('');
  const [customRef, setCustomRef] = useState('');
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedVerse, setFetchedVerse] = useState<SelectedVerse | null>(null);

  // Randomize popular verses on each mount (empty deps = once per component mount)
  const popularVerses = useMemo(() => shuffleArray(ALL_POPULAR_VERSES).slice(0, 8), []);

  const handleFetchVerse = useCallback(async (ref: string) => {
    const parsed = parseReference(ref);
    if (!parsed) {
      toast.error('Invalid reference format. Try "John 3:16" or "Genesis 1:1-5"');
      return;
    }

    setIsLoading(true);
    try {
      const chapterData = await fetchChapter(parsed.book, parsed.chapter);
      
      if (!chapterData?.verses?.length) {
        toast.error('Could not fetch verses. Check the reference.');
        return;
      }

      const verseEnd = parsed.verseEnd || parsed.verseStart;
      const versesInRange = chapterData.verses.filter(
        v => v.verse >= parsed.verseStart && v.verse <= verseEnd
      );

      if (versesInRange.length === 0) {
        toast.error('Verses not found in that chapter.');
        return;
      }

      // Format verse text
      const text = versesInRange.length > 1
        ? versesInRange.map(v => `[${v.verse}] ${v.text}`).join(' ')
        : versesInRange[0].text;

      const verse: SelectedVerse = {
        reference: ref.trim(),
        text,
        book: parsed.book,
        chapter: parsed.chapter,
        verseStart: parsed.verseStart,
        verseEnd: parsed.verseEnd,
      };

      setFetchedVerse(verse);
      toast.success(`Loaded ${ref}`);
    } catch (error) {
      console.error('Error fetching verse:', error);
      toast.error('Failed to fetch verse. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleQuickSelect = useCallback((ref: string) => {
    setSearchRef(ref);
    handleFetchVerse(ref);
  }, [handleFetchVerse]);

  const handleCustomSubmit = useCallback(() => {
    if (!customRef.trim() || !customText.trim()) {
      toast.error('Please enter both reference and text');
      return;
    }

    const parsed = parseReference(customRef);
    if (!parsed) {
      toast.error('Invalid reference format');
      return;
    }

    const verse: SelectedVerse = {
      reference: customRef.trim(),
      text: customText.trim(),
      book: parsed.book,
      chapter: parsed.chapter,
      verseStart: parsed.verseStart,
      verseEnd: parsed.verseEnd,
    };

    onVerseSelected(verse);
  }, [customRef, customText, onVerseSelected]);

  const handleStartGame = useCallback(() => {
    if (fetchedVerse) {
      onVerseSelected(fetchedVerse);
    }
  }, [fetchedVerse, onVerseSelected]);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
              <Book className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Choose Your Seed Verse</CardTitle>
          <CardDescription>
            Select a Bible verse or passage to study. You'll then apply Phototheology principles 
            to understand it more deeply through the PT Palace framework.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="quick" className="gap-2">
                <Star className="h-4 w-4" />
                Quick Pick
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="custom" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Custom
              </TabsTrigger>
            </TabsList>

            {/* Quick Pick Tab */}
            <TabsContent value="quick" className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground text-center">
                Select a popular passage to get started quickly
              </p>
              <div className="grid grid-cols-2 gap-2">
                {popularVerses.map(({ ref, label }) => (
                  <motion.button
                    key={ref}
                    onClick={() => handleQuickSelect(ref)}
                    className="p-3 text-left border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <p className="font-medium text-sm">{ref}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </motion.button>
                ))}
              </div>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter reference (e.g., John 3:16)"
                  value={searchRef}
                  onChange={(e) => setSearchRef(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleFetchVerse(searchRef)}
                />
                <Button 
                  onClick={() => handleFetchVerse(searchRef)} 
                  disabled={isLoading || !searchRef.trim()}
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Supports formats: "John 3:16", "Genesis 1:1-5", "1 Corinthians 13:4-7"
              </p>
            </TabsContent>

            {/* Custom Tab */}
            <TabsContent value="custom" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="custom-ref">Reference</Label>
                  <Input
                    id="custom-ref"
                    placeholder="e.g., Matthew 5:3-12"
                    value={customRef}
                    onChange={(e) => setCustomRef(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="custom-text">Verse Text</Label>
                  <Textarea
                    id="custom-text"
                    placeholder="Paste or type the verse text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button 
                  onClick={handleCustomSubmit}
                  disabled={!customRef.trim() || !customText.trim()}
                  className="w-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start Study with This Passage
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {/* Fetched Verse Preview */}
          {fetchedVerse && tab !== 'custom' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-primary/30 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-primary">{fetchedVerse.reference}</h4>
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <p className="text-sm leading-relaxed italic">
                "{fetchedVerse.text}"
              </p>
            </motion.div>
          )}

          {/* Start Game Button - Always visible when not on custom tab */}
          {tab !== 'custom' && (
            <Button
              onClick={handleStartGame}
              disabled={!fetchedVerse}
              size="lg"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              {fetchedVerse ? 'Start Bible Study Game' : 'Select a verse above to start'}
            </Button>
          )}

          {/* Back Button */}
          <Button variant="ghost" onClick={onBack} className="w-full">
            Back to Menu
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
