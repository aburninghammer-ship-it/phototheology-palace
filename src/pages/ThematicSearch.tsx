import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Search, Loader2, Copy, Check, BookOpen, Sparkles, 
  ChevronDown, ChevronUp, Link as LinkIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface VerseResult {
  reference: string;
  text: string;
  relevance: string;
}

interface ThemeGroup {
  theme: string;
  verses: VerseResult[];
}

interface SearchResults {
  searchSummary: string;
  totalFound: number;
  groups: ThemeGroup[];
}

const EXAMPLE_SEARCHES = [
  "verses about women weaving fabric for the veil, knitted in the womb, the veil renting in two, Jesus born of a woman, made of a woman, the seed of a woman, fine linen as the righteousness of saints",
  "all verses mentioning blood, the lamb, sacrifice, atonement, and covering for sin",
  "sanctuary furniture: altar, laver, lampstand, table of showbread, incense altar, ark of the covenant, mercy seat",
  "prophetic time periods: 1260 days, 2300 days, 70 weeks, time times and half a time",
  "verses about the remnant, those who keep the commandments, the seal of God, and the testimony of Jesus"
];

const ThematicSearch = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0]));
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim() || query.length < 10) {
      toast({
        title: "Search too short",
        description: "Please describe what you're looking for in more detail (at least 10 characters).",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('thematic-verse-search', {
        body: { thematicQuery: query, maxResults: 50 }
      });

      if (error) throw error;
      
      setResults(data);
      setExpandedGroups(new Set([0])); // Expand first group by default
      
      toast({
        title: "Search Complete",
        description: `Found ${data.totalFound} verses across ${data.groups?.length || 0} themes.`
      });
    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: error.message || "Unable to search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyAllVerses = () => {
    if (!results) return;
    
    const allText = results.groups.map(group => {
      const groupVerses = group.verses.map(v => `${v.reference} - ${v.text}`).join("\n");
      return `=== ${group.theme} ===\n${groupVerses}`;
    }).join("\n\n");
    
    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
    
    toast({
      title: "Copied!",
      description: `${results.totalFound} verses copied to clipboard.`
    });
  };

  const copyGroupVerses = (group: ThemeGroup) => {
    const text = group.verses.map(v => `${v.reference} - ${v.text}`).join("\n");
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${group.verses.length} verses from "${group.theme}" copied.`
    });
  };

  const toggleGroup = (index: number) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedGroups(newExpanded);
  };

  const useExample = (example: string) => {
    setQuery(example);
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Search className="h-10 w-10 text-primary" />
              <h1 className="font-serif text-4xl md:text-5xl font-bold bg-gradient-palace bg-clip-text text-transparent">
                Thematic Verse Search
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Describe a theme, concept, or group of related topics, and Jeeves will find all relevant KJV verses for you.
            </p>
          </div>

          {/* Search Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                What are you looking for?
              </CardTitle>
              <CardDescription>
                Describe multiple related themes or concepts. Jeeves will search across the entire Bible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Example: I'm looking for verses that show women weaving the fabric for the veil in the temple, anything related to being knitted in the womb, the veil in the temple renting in two, Jesus born of a woman, made of a woman, the seed of a woman, the fine linen as the righteousness of the saints..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[120px] resize-y"
              />
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="text-sm text-muted-foreground">
                  {query.length}/10 minimum characters
                </div>
                <div className="flex gap-2">
                  {results && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setQuery("");
                        setResults(null);
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      New Search
                    </Button>
                  )}
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading || query.length < 10}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching Bible...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search Thematically
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Example Searches */}
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_SEARCHES.slice(0, 3).map((example, i) => (
                    <Button 
                      key={i}
                      variant="outline" 
                      size="sm"
                      onClick={() => useExample(example)}
                      className="text-xs"
                    >
                      {example.slice(0, 40)}...
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <div className="space-y-6">
              {/* Summary Bar */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-semibold">{results.searchSummary}</p>
                      <p className="text-sm text-muted-foreground">
                        Found <Badge variant="secondary">{results.totalFound}</Badge> verses in{" "}
                        <Badge variant="secondary">{results.groups.length}</Badge> themes
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={copyAllVerses}
                      className="gap-2"
                    >
                      {copiedAll ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy All Verses
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Theme Groups */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-4 pr-4">
                  {results.groups.map((group, groupIndex) => (
                    <Collapsible 
                      key={groupIndex}
                      open={expandedGroups.has(groupIndex)}
                      onOpenChange={() => toggleGroup(groupIndex)}
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <div>
                                  <CardTitle className="text-lg">{group.theme}</CardTitle>
                                  <CardDescription>
                                    {group.verses.length} verse{group.verses.length !== 1 ? 's' : ''}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    copyGroupVerses(group);
                                  }}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                {expandedGroups.has(groupIndex) ? (
                                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <div className="space-y-4">
                              {group.verses.map((verse, verseIndex) => (
                                <div key={verseIndex} className="border-l-2 border-primary/30 pl-4 py-2">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <Link 
                                        to={`/bible/${encodeURIComponent(verse.reference.split(' ')[0])}/${verse.reference.match(/\d+/)?.[0] || 1}`}
                                        className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                                      >
                                        {verse.reference}
                                        <LinkIcon className="h-3 w-3" />
                                      </Link>
                                      <p className="text-foreground mt-1 italic">"{verse.text}"</p>
                                      <p className="text-sm text-muted-foreground mt-2">
                                        <span className="font-medium">Relevance:</span> {verse.relevance}
                                      </p>
                                    </div>
                                  </div>
                                  {verseIndex < group.verses.length - 1 && (
                                    <Separator className="mt-4" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Empty State */}
          {!results && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <Search className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium mb-2">Describe what you're looking for</p>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a detailed description of related themes, and Jeeves will search the entire KJV Bible to find all relevant verses.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThematicSearch;
