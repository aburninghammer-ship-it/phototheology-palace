import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { searchBible, searchBibleByWord } from "@/services/bibleApi";
import { Verse } from "@/types/bible";
import { highlightSearchTerm } from "@/lib/highlightSearchTerm";

const BibleSearch = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const searchMode = searchParams.get("mode") || "reference";
  const searchScope = (searchParams.get("scope") as "all" | "ot" | "nt") || "all";
  
  const [results, setResults] = useState<Verse[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const performSearch = async (page: number = 1, append: boolean = false) => {
    if (!query) return;
    
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setResults([]);
    }
    
    try {
      if (searchMode === "word") {
        const { verses, total, hasMore: more } = await searchBibleByWord(query, searchScope, page);
        if (append) {
          setResults(prev => [...prev, ...verses]);
        } else {
          setResults(verses);
        }
        setTotalResults(total);
        setHasMore(more);
        setCurrentPage(page);
      } else {
        const refResults = await searchBible(query, "kjv");
        setResults(refResults);
        setTotalResults(refResults.length);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    performSearch(currentPage + 1, true);
  };

  useEffect(() => {
    setCurrentPage(1);
    performSearch(1, false);
  }, [query, searchMode, searchScope]);

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/bible">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('bibleSearch.backToBible', 'Back to Bible')}
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
              {t('bibleSearch.title', 'Bible Search')}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg text-muted-foreground">
                {t('bibleSearch.searchingFor', 'Searching for:')} <span className="font-semibold">{query}</span>
              </p>
              {searchMode === "word" && (
                <Badge variant="outline">
                  {searchScope === "all" && t('bibleSearch.scopeAll', 'All Bible (66 books)')}
                  {searchScope === "ot" && t('bibleSearch.scopeOT', 'Old Testament (39 books)')}
                  {searchScope === "nt" && t('bibleSearch.scopeNT', 'New Testament (27 books)')}
                </Badge>
              )}
            </div>
            {results.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {results.length === 1
                  ? t('bibleSearch.foundVerse', { defaultValue: 'Found {{count}} verse', count: totalResults > results.length ? totalResults : results.length })
                  : t('bibleSearch.foundVerses', { defaultValue: 'Found {{count}} verses', count: totalResults > results.length ? totalResults : results.length })}
                {results.length < totalResults && t('bibleSearch.showing', ' (showing {{count}})', { count: results.length })}
              </p>
            )}
          </div>

          {/* Search Options */}
          <Card className="p-6 mb-6">
            <Tabs 
              value={searchMode} 
              onValueChange={(value) => {
                searchParams.set("mode", value);
                setSearchParams(searchParams);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="reference">{t('bibleSearch.verseReference', 'Verse Reference')}</TabsTrigger>
                <TabsTrigger value="word">{t('bibleSearch.wordSearch', 'Word Search')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="reference" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  {t('bibleSearch.referenceHint', 'Search by reference (e.g., "John 3:16", "Genesis 1", "Psalms 23:1-6")')}
                </div>
              </TabsContent>

              <TabsContent value="word" className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {t('bibleSearch.wordHint', 'Search for words or phrases across the entire Bible')}
                </div>
                
                <div className="space-y-2">
                  <Label>{t('bibleSearch.searchScope', 'Search Scope')}</Label>
                  <Select
                    value={searchScope}
                    onValueChange={(value) => {
                      searchParams.set("scope", value);
                      setSearchParams(searchParams);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('bibleSearch.scopeAll', 'All Bible (66 books)')}</SelectItem>
                      <SelectItem value="ot">{t('bibleSearch.scopeOT', 'Old Testament (39 books)')}</SelectItem>
                      <SelectItem value="nt">{t('bibleSearch.scopeNT', 'New Testament (27 books)')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((verse, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <Link 
                    to={`/bible/${encodeURIComponent(verse.book)}/${verse.chapter}`}
                    className="block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-primary min-w-[100px]">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </div>
                      <div className="text-foreground">
                        {searchMode === "word" ? highlightSearchTerm(verse.text, query) : verse.text}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
              
              {hasMore && (
                <div className="flex justify-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('bibleSearch.loadingMore', 'Loading more...')}
                      </>
                    ) : (
                      t('bibleSearch.loadMoreResults', 'Load More Results')
                    )}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchMode === "word"
                  ? t('bibleSearch.noWordResults', 'No results found for "{{query}}" in the {{scope}}. Try a different search term.', {
                      query,
                      scope: searchScope === "all" ? t('bibleSearch.entireBible', 'entire Bible') : searchScope === "ot" ? t('bibleSearch.oldTestament', 'Old Testament') : t('bibleSearch.newTestament', 'New Testament')
                    })
                  : t('bibleSearch.noRefResults', 'No results found for "{{query}}". Try searching for a specific verse reference like "John 3:16" or a book and chapter like "Genesis 1".', { query })
                }
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleSearch;
