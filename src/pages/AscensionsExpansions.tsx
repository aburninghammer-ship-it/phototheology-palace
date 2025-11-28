import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, TrendingUp, ArrowUpRight, Maximize, Building2, BookOpen, Clock, Brain, Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ASCENSIONS = [
  {
    level: "Asc-1",
    name: "Text",
    focus: "Word-level analysis (definitions, grammar)",
    description: "Study the word itself. Definitions, grammar, and lexical nuance. This is the foundation - what does this word literally mean in Hebrew or Greek?",
    example: "In John 19:30, 'tetelestai' = 'paid in full' (not just 'finished')"
  },
  {
    level: "Asc-2",
    name: "Chapter",
    focus: "Place verse in chapter storyline",
    description: "Fit the verse into its chapter context. What's happening before and after? How does this moment fit into the larger narrative arc?",
    example: "John 19:30 within the crucifixion arc - the climax of Jesus' earthly ministry"
  },
  {
    level: "Asc-3",
    name: "Book",
    focus: "Fit chapter into book's theme",
    description: "How does this chapter serve the book's overarching purpose? Every book has a theme - how does your passage contribute to it?",
    example: "John's theme = 'that you may believe' (20:31) - the cross is ultimate proof of divine love"
  },
  {
    level: "Asc-4",
    name: "Cycle",
    focus: "Place book in covenant cycle (@Ad → @Re)",
    description: "Position the book within God's eight covenant cycles: Adamic, Noahic, Abrahamic, Mosaic, Cyrusic, Cyrus-Christ, Spirit, and Remnant.",
    example: "John belongs to @CyC (Cyrus-Christ) - the climax of covenant fulfillment"
  },
  {
    level: "Asc-5",
    name: "Heaven",
    focus: "Locate in Day-of-LORD horizon (1H/2H/3H)",
    description: "Place the text in its correct Day-of-the-LORD horizon. Is this about 1H (Babylon/Restoration), 2H (70 AD/New Covenant), or 3H (Final New Creation)?",
    example: "John 19:30 = 2H (DoL²/NE²) - inaugurating the heavenly order"
  }
];

const EXPANSIONS = [
  {
    code: "Exp-W",
    name: "Width",
    focus: "Raw content & memory (Floors 1-2)",
    description: "The horizontal spread of your study. Stock your palace with stories, images, translations, observations, and gems. The wider your shelves, the richer your connections.",
    floors: [1, 2],
    color: "bg-blue-500"
  },
  {
    code: "Exp-T",
    name: "Time",
    focus: "Continuous freestyle practice (Floor 3)",
    description: "Stretch Scripture through your entire day. Nature, personal life, history, and conversations become raw material for reflection. Meditate 'day and night' (Psalm 1:2).",
    floors: [3],
    color: "bg-green-500"
  },
  {
    code: "Exp-D",
    name: "Depth",
    focus: "Christ-centered structure, prophecy (Floors 4-6)",
    description: "Plunge beneath surface reading into theological and cosmic structure. See Christ at the center, understand dimensions, patterns, sanctuary, cycles, and heavens.",
    floors: [4, 5, 6],
    color: "bg-purple-500"
  },
  {
    code: "Exp-H",
    name: "Height",
    focus: "Transformation & mastery (Floors 7-8)",
    description: "Lift study from intellect into experience and mastery. Fire (conviction), meditation (slow marination), and speed (quick application) until Phototheology becomes reflexive.",
    floors: [7, 8],
    color: "bg-amber-500"
  }
];

export default function AscensionsExpansions() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 text-white py-16 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Layers className="h-6 w-6" />
              <span className="font-semibold">Phototheology Framework</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Ascensions & Expansions</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              The staircase and stretching of Phototheology. Learn to climb from text to cosmos and stretch study in every direction.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {/* Introduction */}
          <Card className="mb-12 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <BookOpen className="h-6 w-6 text-primary" />
                Understanding the Framework
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                <strong>Ascensions</strong> are the vertical staircase — climbing from the smallest parts of a text to its cosmic stage. 
                <strong> Expansions</strong> describe how study stretches outward, filling the whole palace in every direction.
              </p>
              <p>
                Together, they ensure that no text is studied in isolation. Every verse has an address (Ascension) and every study grows in all directions (Expansion).
              </p>
            </CardContent>
          </Card>

          {/* Five Ascensions */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">The Five Ascensions</h2>
                <p className="text-muted-foreground">Climb from text to cosmos</p>
              </div>
            </div>

            <div className="space-y-4">
              {ASCENSIONS.map((asc, idx) => (
                <Card key={asc.level} className="overflow-hidden hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <Badge className="bg-amber-600 text-white px-3 py-1 text-sm font-bold">
                          {asc.level}
                        </Badge>
                        {idx < ASCENSIONS.length - 1 && (
                          <div className="w-0.5 h-8 bg-amber-300 mt-2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <ArrowUpRight className="h-5 w-5 text-amber-600" />
                          {asc.name}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">{asc.focus}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pl-20">
                    <p className="text-sm text-muted-foreground mb-3">{asc.description}</p>
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Example:</span>
                      <p className="text-sm mt-1">{asc.example}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Four Expansions */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Maximize className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">The Four Expansions</h2>
                <p className="text-muted-foreground">Stretch study in all directions</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {EXPANSIONS.map((exp) => (
                <Card key={exp.code} className="overflow-hidden hover:shadow-lg transition-all">
                  <CardHeader className={`${exp.color} text-white pb-4`}>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-white/20 text-white border-white/40 text-sm font-bold">
                        {exp.code}
                      </Badge>
                      <div className="flex gap-1">
                        {exp.floors.map(f => (
                          <Badge key={f} variant="outline" className="bg-white/10 text-white border-white/30 text-xs">
                            Floor {f}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardTitle className="text-2xl mt-2">{exp.name}</CardTitle>
                    <CardDescription className="text-white/80">{exp.focus}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How They Work Together */}
          <Card className="mb-12 border-2 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-primary" />
                How They Work Together
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-600" />
                    Static Ascension
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The anchored address system. Every verse has a "home" in its text, chapter, book, cycle, and heaven. This keeps you from error.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-purple-600" />
                    Dynamic Ascension
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The playground mode. Let verses travel across chapters, books, cycles, and heavens to spark creative, Spirit-led insight.
                  </p>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground italic pt-4 border-t">
                Together, they train you like a musician who first masters the sheet music (static) and then learns to improvise (dynamic).
              </p>
            </CardContent>
          </Card>

          {/* Related Resources */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/bible-reference">
              <Button variant="outline" className="gap-2">
                <Building2 className="h-4 w-4" />
                View Full Codebook
              </Button>
            </Link>
            <Link to="/palace">
              <Button variant="outline" className="gap-2">
                <Crown className="h-4 w-4" />
                Explore the Palace
              </Button>
            </Link>
            <Link to="/palace-explorer">
              <Button variant="outline" className="gap-2">
                <Layers className="h-4 w-4" />
                Palace Explorer
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
