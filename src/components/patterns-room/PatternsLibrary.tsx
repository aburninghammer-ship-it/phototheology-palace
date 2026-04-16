import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Search,
  ChevronRight,
  Waves,
  Mountain,
  TreePine,
  Hash,
  Calendar,
  Crown,
  Layers,
  Sparkles
} from "lucide-react";
import {
  watersCourse,
  mountainsCourse,
  treesCourse,
  numbersPattern,
  feastsPattern,
  sixDimensions,
  patternsLibrary,
  getAllChristInBooks,
  getChristInBooksBySection,
  bibleStoryArc,
  type CoursePattern,
  type ChristInBook,
  type BiblicalPattern
} from "@/data/patternsLibrary";

type PatternTab = 'courses' | 'christ' | 'structural' | 'biblical';

const SECTION_LABELS: Record<ChristInBook['section'], string> = {
  'pentateuch': 'Pentateuch (5)',
  'historical': 'Historical (12)',
  'restoration': 'Restoration (3)',
  'wisdom': 'Wisdom (5)',
  'major-prophets': 'Major Prophets (5)',
  'minor-prophets': 'Minor Prophets (12)',
  'gospels': 'Gospels (4)',
  'acts': 'Acts (1)',
  'epistles': 'Epistles (21)',
  'revelation': 'Revelation (1)'
};

const SECTION_ORDER: ChristInBook['section'][] = [
  'pentateuch', 'historical', 'restoration', 'wisdom', 'major-prophets',
  'minor-prophets', 'gospels', 'acts', 'epistles', 'revelation'
];

export function PatternsLibrary() {
  const [activeTab, setActiveTab] = useState<PatternTab>('courses');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<CoursePattern | null>(null);
  const [selectedChristBook, setSelectedChristBook] = useState<ChristInBook | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<BiblicalPattern | null>(null);

  const courses = [watersCourse, mountainsCourse, treesCourse];
  const allChristBooks = getAllChristInBooks();

  // Search across all patterns
  const filteredChristBooks = searchQuery.length >= 2
    ? allChristBooks.filter(b =>
        b.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.christTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.pattern.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredPatterns = searchQuery.length >= 2
    ? patternsLibrary.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.theologicalInsight.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleBack = () => {
    if (selectedChristBook) {
      setSelectedChristBook(null);
    } else if (selectedCourse) {
      setSelectedCourse(null);
    } else if (selectedPattern) {
      setSelectedPattern(null);
    }
  };

  // Course Detail View
  if (selectedCourse) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Courses
        </Button>

        <div className="space-y-4">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-2">
              {selectedCourse.id === 'waters-course' && <Waves className="h-6 w-6 text-blue-500" />}
              {selectedCourse.id === 'mountains-course' && <Mountain className="h-6 w-6 text-amber-600" />}
              {selectedCourse.id === 'trees-course' && <TreePine className="h-6 w-6 text-green-600" />}
              {selectedCourse.name}
            </h3>
            <p className="text-muted-foreground mt-1">{selectedCourse.definition}</p>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {selectedCourse.elements.map((element, index) => (
                <Card key={index} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{element.name}</h4>
                        <p className="text-sm text-muted-foreground">{element.scripture}</p>
                        <p className="text-sm mt-1"><strong>Event:</strong> {element.event}</p>
                        <p className="text-sm"><strong>Significance:</strong> {element.significance}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {selectedCourse.personalApplication && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Personal Application</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {selectedCourse.personalApplication.map((app, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                Christ Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedCourse.christConnection}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Christ in Book Detail View
  if (selectedChristBook) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Books
        </Button>

        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">{SECTION_LABELS[selectedChristBook.section]}</Badge>
            <h3 className="text-2xl font-bold">{selectedChristBook.book}</h3>
            <p className="text-lg text-primary font-semibold mt-1">
              <Crown className="h-5 w-5 inline mr-2 text-amber-500" />
              {selectedChristBook.christTitle}
            </p>
          </div>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">The Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{selectedChristBook.pattern}</p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Fulfillment in Christ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{selectedChristBook.fulfillment}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Key Texts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {selectedChristBook.keyTexts.map((text, i) => (
                  <Badge key={i} variant="secondary">{text}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedChristBook.propheticApplication && (
            <Card className="bg-violet-500/10 border-violet-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prophetic Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{selectedChristBook.propheticApplication}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Pattern Detail View
  if (selectedPattern) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={handleBack} className="mb-2">
          <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
          Back to Patterns
        </Button>

        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2 capitalize">{selectedPattern.category}</Badge>
            <h3 className="text-2xl font-bold">{selectedPattern.name}</h3>
            <p className="text-muted-foreground mt-2 italic">"{selectedPattern.structure}"</p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Biblical Instances</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] pr-4">
                <div className="space-y-3">
                  {selectedPattern.instances.map((instance, i) => (
                    <div key={i} className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-semibold text-primary">{instance.reference}</p>
                      <p className="font-medium">{instance.description}</p>
                      <p className="text-sm text-muted-foreground">{instance.details}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Theological Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedPattern.theologicalInsight}</p>
            </CardContent>
          </Card>

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                Christ Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{selectedPattern.christConnection}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Library View
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patterns, books, courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Search Results */}
      {searchQuery.length >= 2 && (
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Search Results ({filteredChristBooks.length + filteredPatterns.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {filteredChristBooks.length === 0 && filteredPatterns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No results found</p>
              ) : (
                <div className="space-y-2">
                  {filteredChristBooks.map((book) => (
                    <Button
                      key={book.book}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2"
                      onClick={() => {
                        setSelectedChristBook(book);
                        setSearchQuery("");
                      }}
                    >
                      <div className="text-left">
                        <p className="font-medium">{book.book}</p>
                        <p className="text-xs text-muted-foreground">{book.christTitle}</p>
                      </div>
                    </Button>
                  ))}
                  {filteredPatterns.map((pattern) => (
                    <Button
                      key={pattern.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-2"
                      onClick={() => {
                        setSelectedPattern(pattern);
                        setSearchQuery("");
                      }}
                    >
                      <div className="text-left">
                        <p className="font-medium">{pattern.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{pattern.category}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PatternTab)}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="courses" className="text-xs sm:text-sm">
            <Waves className="h-4 w-4 mr-1 hidden sm:inline" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="christ" className="text-xs sm:text-sm">
            <Crown className="h-4 w-4 mr-1 hidden sm:inline" />
            Christ in 66
          </TabsTrigger>
          <TabsTrigger value="structural" className="text-xs sm:text-sm">
            <Hash className="h-4 w-4 mr-1 hidden sm:inline" />
            Structural
          </TabsTrigger>
          <TabsTrigger value="biblical" className="text-xs sm:text-sm">
            <Layers className="h-4 w-4 mr-1 hidden sm:inline" />
            Patterns
          </TabsTrigger>
        </TabsList>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-4">
          <div className="grid gap-3">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedCourse(course)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {course.id === 'waters-course' && <Waves className="h-10 w-10 text-blue-500" />}
                      {course.id === 'mountains-course' && <Mountain className="h-10 w-10 text-amber-600" />}
                      {course.id === 'trees-course' && <TreePine className="h-10 w-10 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold">{course.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{course.definition}</p>
                      <Badge variant="secondary" className="mt-2">
                        {course.elements.length} elements
                      </Badge>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Christ in Every Book Tab */}
        <TabsContent value="christ" className="mt-4">
          <div className="space-y-4">
            {/* Bible Story Arc Summary */}
            <Card className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                  The Story Arc Through Scripture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {bibleStoryArc.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Badge variant="outline" className="flex-shrink-0">{i + 1}</Badge>
                      <div>
                        <span className="font-semibold">{act.act}</span>
                        <span className="text-muted-foreground"> ({act.books})</span>
                        <p className="text-muted-foreground text-xs">{act.theme}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Books by Section */}
            <ScrollArea className="h-[350px] pr-4">
              <Accordion type="single" collapsible className="space-y-2">
                {SECTION_ORDER.map((section) => {
                  const books = getChristInBooksBySection(section);
                  return (
                    <AccordionItem key={section} value={section} className="border rounded-lg px-4">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="font-semibold">{SECTION_LABELS[section]}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2 pt-2">
                          {books.map((book) => (
                            <Button
                              key={book.book}
                              variant="ghost"
                              className="w-full justify-start h-auto py-2"
                              onClick={() => setSelectedChristBook(book)}
                            >
                              <div className="flex items-center gap-3 w-full">
                                <Crown className="h-4 w-4 text-amber-500 flex-shrink-0" />
                                <div className="text-left flex-1 min-w-0">
                                  <p className="font-medium">{book.book}</p>
                                  <p className="text-xs text-muted-foreground truncate">{book.christTitle}</p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              </div>
                            </Button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ScrollArea>
          </div>
        </TabsContent>

        {/* Structural Patterns Tab */}
        <TabsContent value="structural" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {/* Numbers */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Biblical Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {numbersPattern.map((num) => (
                      <div key={num.number} className="p-2 bg-muted/30 rounded-lg">
                        <p className="font-bold text-primary text-lg">{num.number}</p>
                        <p className="text-xs text-muted-foreground">{num.meaning}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Feasts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Seven Feasts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {feastsPattern.map((feast) => (
                      <div key={feast.name} className="p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{feast.name}</span>
                          <Badge variant={feast.timing === 'spring' ? 'default' : 'secondary'} className="text-xs">
                            {feast.timing}
                          </Badge>
                          {feast.fulfilled && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              Fulfilled
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{feast.scripture}</p>
                        <p className="text-sm mt-1"><strong>OT:</strong> {feast.otMeaning}</p>
                        <p className="text-sm"><strong>NT:</strong> {feast.fulfillment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Six Dimensions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    Six Dimensions of Interpretation
                  </CardTitle>
                  <CardDescription>Using "Manna" as example</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {sixDimensions.map((dim, i) => (
                      <div key={dim.dimension} className="flex items-start gap-3 p-2 bg-muted/30 rounded-lg">
                        <Badge variant="outline" className="flex-shrink-0">{i + 1}</Badge>
                        <div>
                          <p className="font-semibold capitalize">{dim.dimension.replace('-', ' ')}</p>
                          <p className="text-xs text-muted-foreground">{dim.definition}</p>
                          <p className="text-sm mt-1">→ {dim.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Biblical Patterns Tab */}
        <TabsContent value="biblical" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-3">
              {patternsLibrary.map((pattern) => (
                <Card
                  key={pattern.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedPattern(pattern)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{pattern.name}</h4>
                          <Badge variant="outline" className="text-xs capitalize">
                            {pattern.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 italic">
                          "{pattern.structure}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {pattern.instances.length} biblical instances
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
