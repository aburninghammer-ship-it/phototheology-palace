import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { searchBible } from "@/services/bibleApi";
import { Verse } from "@/types/bible";

const BibleSearch = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      setLoading(true);
      searchBible(query)
        .then(setResults)
        .finally(() => setLoading(false));
    }
  }, [query]);

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to="/bible">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Bible
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2 bg-gradient-palace bg-clip-text text-transparent">
              Search Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Searching for: <span className="font-semibold">{query}</span>
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((verse, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <Link 
                    to={`/bible/${verse.book}/${verse.chapter}`}
                    className="block"
                  >
                    <div className="flex items-start gap-4">
                      <div className="font-semibold text-primary min-w-[100px]">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </div>
                      <div className="text-foreground">
                        {verse.text}
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                No results found for "{query}". Try searching for a specific verse reference like "John 3:16" or a book and chapter like "Genesis 1".
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BibleSearch;
