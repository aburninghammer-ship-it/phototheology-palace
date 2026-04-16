import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { BIBLE_BOOKS } from "@/types/bible";
import { Search, BookOpen, Loader2, Copy, Check, ChevronDown, ChevronUp, Sparkles, Link as LinkIcon } from "lucide-react";
import { ThemeVerseSearch } from "./ThemeVerseSearch";
import { EventSearch } from "./EventSearch";
import { usePreservePage } from "@/hooks/usePreservePage";
import { PageLockToggle } from "@/components/preserve/PageLockToggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const OLD_TESTAMENT_BOOKS = BIBLE_BOOKS.slice(0, 39);
const NEW_TESTAMENT_BOOKS = BIBLE_BOOKS.slice(39);

// Bible section definitions for filtering
const BIBLE_SECTIONS = {
  all: { label: "All Bible (66 books)", books: BIBLE_BOOKS },
  ot: { label: "Old Testament (39 books)", books: OLD_TESTAMENT_BOOKS },
  nt: { label: "New Testament (27 books)", books: NEW_TESTAMENT_BOOKS },
  pentateuch: { label: "Pentateuch (Genesis-Deuteronomy)", books: BIBLE_BOOKS.slice(0, 5) },
  history: { label: "History (Joshua-Esther)", books: BIBLE_BOOKS.slice(5, 17) },
  poetry: { label: "Poetry & Wisdom (Job-Song of Solomon)", books: BIBLE_BOOKS.slice(17, 22) },
  majorProphets: { label: "Major Prophets (Isaiah-Daniel)", books: BIBLE_BOOKS.slice(22, 27) },
  minorProphets: { label: "Minor Prophets (Hosea-Malachi)", books: BIBLE_BOOKS.slice(27, 39) },
  gospels: { label: "Gospels (Matthew-John)", books: BIBLE_BOOKS.slice(39, 43) },
  acts: { label: "Acts", books: ["Acts"] },
  pauline: { label: "Pauline Epistles (Romans-Philemon)", books: BIBLE_BOOKS.slice(44, 57) },
  generalEpistles: { label: "General Epistles (Hebrews-Jude)", books: BIBLE_BOOKS.slice(57, 65) },
  revelation: { label: "Revelation", books: ["Revelation"] },
};

type BibleScope = keyof typeof BIBLE_SECTIONS;

interface GroupVerseResult {
  reference: string;
  text: string;
  relevance: string;
}

interface GroupTheme {
  theme: string;
  verses: GroupVerseResult[];
}

interface GroupSearchResults {
  searchSummary: string;
  totalFound: number;
  groups: GroupTheme[];
}

export const BibleNavigation = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setCustomState, getCustomState } = usePreservePage();
  
  // Restore state from context or use defaults
  const [selectedBook, setSelectedBook] = useState(() => getCustomState<string>('bibleNav_selectedBook') || "John");
  const [chapter, setChapter] = useState(() => getCustomState<string>('bibleNav_chapter') || "1");
  const [verse, setVerse] = useState(() => getCustomState<string>('bibleNav_verse') || "");
  const [searchQuery, setSearchQuery] = useState(() => getCustomState<string>('bibleNav_searchQuery') || "");
  const [searchMode, setSearchMode] = useState<"reference" | "word" | "phrase" | "theme" | "event" | "group">(() => getCustomState<"reference" | "word" | "phrase" | "theme" | "event" | "group">('bibleNav_searchMode') || "reference");
  const [searchScope, setSearchScope] = useState<BibleScope>(() => getCustomState<BibleScope>('bibleNav_searchScope') || "all");
  
  // Phrase search state
  const [phraseWords, setPhraseWords] = useState(() => getCustomState<string>('bibleNav_phraseWords') || "");
  
  // Group search state
  const [groupQuery, setGroupQuery] = useState(() => getCustomState<string>('bibleNav_groupQuery') || "");
  const [groupLoading, setGroupLoading] = useState(false);
  const [groupResults, setGroupResults] = useState<GroupSearchResults | null>(() => getCustomState<GroupSearchResults | null>('bibleNav_groupResults') || null);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]));
  const [copiedAll, setCopiedAll] = useState(false);

  // Persist state changes
  useEffect(() => { setCustomState('bibleNav_selectedBook', selectedBook); }, [selectedBook, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_chapter', chapter); }, [chapter, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_verse', verse); }, [verse, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_searchQuery', searchQuery); }, [searchQuery, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_searchMode', searchMode); }, [searchMode, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_searchScope', searchScope); }, [searchScope, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_phraseWords', phraseWords); }, [phraseWords, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_groupQuery', groupQuery); }, [groupQuery, setCustomState]);
  useEffect(() => { setCustomState('bibleNav_groupResults', groupResults); }, [groupResults, setCustomState]);

  const handleNavigate = () => {
    if (selectedBook && chapter) {
      const path = verse 
        ? `/bible/${selectedBook}/${chapter}?verse=${verse}`
        : `/bible/${selectedBook}/${chapter}`;
      navigate(path);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/bible/search?q=${encodeURIComponent(searchQuery)}&mode=${searchMode === "phrase" ? "word" : searchMode}&scope=${searchScope}`);
    }
  };

  const handlePhraseSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (phraseWords.trim()) {
      // For phrase search, we pass the words to word search - the AI will find verses containing all/most of these words
      navigate(`/bible/search?q=${encodeURIComponent(phraseWords)}&mode=word&scope=${searchScope}`);
    }
  };

  const handleGroupSearch = async () => {
    if (!groupQuery.trim() || groupQuery.length < 10) {
      toast.error("Please describe what you're looking for in more detail.");
      return;
    }

    setGroupLoading(true);
    setGroupResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('thematic-verse-search', {
        body: { 
          thematicQuery: groupQuery, 
          maxResults: 50,
          scope: searchScope,
          scopeBooks: BIBLE_SECTIONS[searchScope].books
        }
      });

      if (error) throw error;
      
      setGroupResults(data);
      setExpandedGroups(new Set([0]));
      toast.success(`Found ${data.totalFound} verses across ${data.groups?.length || 0} themes.`);
    } catch (error: any) {
      console.error("Group search error:", error);
      toast.error(error.message || "Search failed. Please try again.");
    } finally {
      setGroupLoading(false);
    }
  };

  const toggleGroupExpand = (index: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGroups(newExpanded);
  };

  const copyAllVerses = () => {
    if (!groupResults) return;
    
    const allText = groupResults.groups.map(group => {
      const groupVerses = group.verses.map(v => `${v.reference} - ${v.text}`).join("\n");
      return `=== ${group.theme} ===\n${groupVerses}`;
    }).join("\n\n");
    
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    toast.success(`${groupResults.totalFound} verses copied!`);
  };

  const copyGroupVerses = (group: GroupTheme) => {
    const text = group.verses.map(v => `${v.reference} - ${v.text}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success(`${group.verses.length} verses copied!`);
  };

  return (
    <Card variant="glass" className="p-4 sm:p-6">
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-base sm:text-lg font-semibold">{t('bible.navigateBible')}</h3>
          </div>
          <PageLockToggle />
        </div>
        
        {/* Quick Navigation */}
        <div className="space-y-3">
          <Select value={selectedBook} onValueChange={setSelectedBook}>
            <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all text-foreground">
              <SelectValue placeholder={t('bible.selectBook')} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] bg-card/95 backdrop-blur-xl border-white/20 z-50">
              {BIBLE_BOOKS.map((book) => (
                <SelectItem key={book} value={book}>
                  {book}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Input
              type="number"
              placeholder={t('bible.chapter')}
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              min="1"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
            />
            <Input
              type="number"
              placeholder={t('bible.verse')}
              value={verse}
              onChange={(e) => setVerse(e.target.value)}
              min="1"
              className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleNavigate}
          className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-purple hover:shadow-glow hover:scale-[1.02] transition-all duration-300"
        >
          {t('bible.goToChapter')}
        </Button>
        
        {/* Search */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <Tabs value={searchMode} onValueChange={(value) => setSearchMode(value as typeof searchMode)}>
            <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-md border border-white/15">
              <TabsTrigger value="reference" className="text-[10px] sm:text-xs data-[state=active]:bg-primary/30 data-[state=active]:text-primary px-1">{t('bible.ref')}</TabsTrigger>
              <TabsTrigger value="word" className="text-[10px] sm:text-xs data-[state=active]:bg-primary/30 data-[state=active]:text-primary px-1">{t('bible.word')}</TabsTrigger>
              <TabsTrigger value="phrase" className="text-[10px] sm:text-xs data-[state=active]:bg-blue-500/30 data-[state=active]:text-blue-400 px-1">{t('bible.phrase')}</TabsTrigger>
              <TabsTrigger value="theme" className="text-[10px] sm:text-xs data-[state=active]:bg-primary/30 data-[state=active]:text-primary px-1">{t('bible.theme')}</TabsTrigger>
              <TabsTrigger value="event" className="text-[10px] sm:text-xs data-[state=active]:bg-amber-500/30 data-[state=active]:text-amber-400 px-1">{t('bible.event')}</TabsTrigger>
              <TabsTrigger value="group" className="text-[10px] sm:text-xs data-[state=active]:bg-green-500/30 data-[state=active]:text-green-400 px-1">{t('bible.group')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reference" className="mt-3 space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder={t('bible.searchPlaceholderRef')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
                />
                <Button type="submit" size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary hover:bg-white/20 transition-all touch-manipulation flex-shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="word" className="mt-3 space-y-3">
              <Select value={searchScope} onValueChange={(value) => setSearchScope(value as BibleScope)}>
                <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all text-foreground">
                   <SelectValue placeholder={t('bible.searchScope')} />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/20 z-50 max-h-[300px]">
                  {Object.entries(BIBLE_SECTIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder={t('bible.searchPlaceholderWord')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
                />
                <Button type="submit" size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary hover:bg-white/20 transition-all touch-manipulation flex-shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="phrase" className="mt-3 space-y-3">
              <div className="text-xs text-muted-foreground mb-2">
                {t('bible.phraseSearchHint')}
              </div>
              <Select value={searchScope} onValueChange={(value) => setSearchScope(value as BibleScope)}>
                <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 transition-all text-foreground">
                  <SelectValue placeholder={t('bible.searchScope')} />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/20 z-50 max-h-[300px]">
                  {Object.entries(BIBLE_SECTIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <form onSubmit={handlePhraseSearch} className="flex gap-2">
                <Input
                  placeholder={t('bible.searchPlaceholderPhrase')}
                  value={phraseWords}
                  onChange={(e) => setPhraseWords(e.target.value)}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:border-primary/50 hover:bg-white/15 focus:border-primary focus:bg-white/20 transition-all touch-manipulation placeholder:text-muted-foreground/70"
                />
                <Button type="submit" size="icon" variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 hover:border-blue-400 hover:bg-white/20 transition-all touch-manipulation flex-shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="theme" className="mt-3">
              <ThemeVerseSearch className="border-0 bg-transparent p-0" />
            </TabsContent>
            
            <TabsContent value="event" className="mt-3">
              <EventSearch className="border-0 bg-transparent p-0" />
            </TabsContent>

            <TabsContent value="group" className="mt-3 space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium">{t('bible.groupTextsSearch')}</span>
                <Badge variant="secondary" className="text-xs">AI</Badge>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {t('bible.groupTextsHint')}
              </p>

              <Select value={searchScope} onValueChange={(value) => setSearchScope(value as BibleScope)}>
                <SelectTrigger className="bg-white/10 backdrop-blur-md border-white/20 hover:border-green-400/50 hover:bg-white/15 transition-all text-foreground">
                  <SelectValue placeholder={t('bible.searchScope')} />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-white/20 z-50 max-h-[300px]">
                  {Object.entries(BIBLE_SECTIONS).map(([key, { label }]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Textarea
                placeholder="e.g., verses about women weaving the veil, knitted in the womb, the veil renting in two, Jesus born of a woman, seed of a woman, fine linen as righteousness of saints..."
                value={groupQuery}
                onChange={(e) => setGroupQuery(e.target.value)}
                className="min-h-[80px] bg-white/10 backdrop-blur-md border-white/20 hover:border-green-400/50 focus:border-green-400 focus:bg-white/20 transition-all placeholder:text-muted-foreground/70 text-sm"
              />
              
              <Button 
                onClick={handleGroupSearch}
                disabled={groupLoading || groupQuery.length < 10}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400"
              >
                {groupLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching Bible...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Find All Related Verses
                  </>
                )}
              </Button>

              {/* Group Results */}
              {groupResults && (
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-sm font-medium">{groupResults.searchSummary}</p>
                      <p className="text-xs text-muted-foreground">
                        {groupResults.totalFound} verses in {groupResults.groups.length} themes
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAllVerses}
                      className="gap-1 text-xs"
                    >
                      {copiedAll ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedAll ? "Copied!" : "Copy All"}
                    </Button>
                  </div>

                  <ScrollArea className="h-[60vh] max-h-[600px]">
                    <div className="space-y-2 pr-2">
                      {groupResults.groups.map((group, groupIndex) => (
                        <Collapsible 
                          key={groupIndex}
                          open={expandedGroups.has(groupIndex)}
                          onOpenChange={() => toggleGroupExpand(groupIndex)}
                        >
                          <div className="border border-white/10 rounded-lg overflow-hidden">
                            <CollapsibleTrigger asChild>
                              <div className="flex items-center justify-between p-2 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                <div className="flex items-center gap-2">
                                  <BookOpen className="h-4 w-4 text-green-400" />
                                  <span className="text-sm font-medium">{group.theme}</span>
                                  <Badge variant="secondary" className="text-xs">{group.verses.length}</Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyGroupVerses(group);
                                    }}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  {expandedGroups.has(groupIndex) ? (
                                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                              </div>
                            </CollapsibleTrigger>
                            
                            <CollapsibleContent>
                              <ScrollArea className="max-h-[300px]">
                                <div className="p-2 space-y-2 bg-black/20">
                                  {group.verses.map((v, vIndex) => (
                                    <div key={vIndex} className="text-xs border-l-2 border-green-400/30 pl-2 py-1">
                                      <Link 
                                        to={`/bible/${encodeURIComponent(v.reference.split(' ')[0])}/${v.reference.match(/\d+/)?.[0] || 1}`}
                                        className="font-semibold text-green-400 hover:underline inline-flex items-center gap-1"
                                      >
                                        {v.reference}
                                        <LinkIcon className="h-2 w-2" />
                                      </Link>
                                      <p className="text-foreground/90 mt-0.5 italic">"{v.text}"</p>
                                      <p className="text-muted-foreground mt-0.5">{v.relevance}</p>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </CollapsibleContent>
                          </div>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};