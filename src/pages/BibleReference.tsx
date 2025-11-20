import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import {
  Book,
  Layers,
  Code,
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  Building2,
  Clock,
  Target,
  Search,
  Users,
  MapPin,
  Calendar,
  BarChart3,
  Loader2
} from "lucide-react";

const BibleReference = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] = useState<"events" | "maps" | "prophecy" | "charts" | "people">("events");
  const [searchResults, setSearchResults] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResults("");

    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "encyclopedia",
          category: searchCategory,
          query: searchQuery,
        },
      });

      if (error) throw error;

      setSearchResults(data.content || "No results found.");
    } catch (error: any) {
      console.error("Encyclopedia search error:", error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search encyclopedia",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // PT Principles - Floors and Rooms
  const floors = [
    {
      number: 1,
      name: "Furnishing Floor",
      focus: "Memory & Visualization (Width)",
      rooms: [
        { code: "SR", name: "Story Room", purpose: "Collect & memorize Bible stories in sequence" },
        { code: "IR", name: "Imagination Room", purpose: "Immersive participation in biblical scenes" },
        { code: "24F", name: "24FPS Room", purpose: "One symbolic image per chapter" },
        { code: "BR", name: "Bible Rendered", purpose: "One master image per 24-chapter block" },
        { code: "TR", name: "Translation Room", purpose: "Turn abstract texts into concrete images" },
        { code: "GR", name: "Gems Room", purpose: "Store powerful insights & discoveries" }
      ]
    },
    {
      number: 2,
      name: "Investigation Floor",
      focus: "Detective Work (Width)",
      rooms: [
        { code: "OR", name: "Observation Room", purpose: "Notice details without rushing to meaning" },
        { code: "DC", name: "Def-Com Room", purpose: "Greek/Hebrew definitions & commentary" },
        { code: "@T", name: "Symbols/Types", purpose: "God's universal language & shadows of Christ" },
        { code: "QR", name: "Questions Room", purpose: "75 questions per passage (intra/inter/PT)" },
        { code: "QA", name: "Q&A Chains", purpose: "Scripture answers Scripture" }
      ]
    },
    {
      number: 3,
      name: "Freestyle Floor",
      focus: "Spontaneous Connections (Time)",
      rooms: [
        { code: "NF", name: "Nature Freestyle", purpose: "Creation as second book" },
        { code: "PF", name: "Personal Freestyle", purpose: "Life experiences as object lessons" },
        { code: "BF", name: "Bible Freestyle", purpose: "Verse genetics - every verse has relatives" },
        { code: "HF", name: "History/Social Freestyle", purpose: "Culture & current events" },
        { code: "LR", name: "Listening Room", purpose: "Turn conversations into connections" }
      ]
    },
    {
      number: 4,
      name: "Next Level Floor",
      focus: "Christ-Centered Depth",
      rooms: [
        { code: "CR", name: "Concentration Room", purpose: "Every text reveals Christ" },
        { code: "DR", name: "Dimensions Room", purpose: "5D: Literal, Christ, Me, Church, Heaven" },
        { code: "C6", name: "Connect 6", purpose: "Genre classification (prophecy, poetry, etc.)" },
        { code: "TRm", name: "Theme Room", purpose: "Great walls: Sanctuary, Life of Christ, etc." },
        { code: "TZ", name: "Time Zone", purpose: "Past, present, future (heaven/earth)" },
        { code: "PRm", name: "Patterns Room", purpose: "God's recurring motifs" },
        { code: "P‖", name: "Parallels Room", purpose: "Mirrored actions across time" },
        { code: "FRt", name: "Fruit Room", purpose: "Does it produce Christlike character?" }
      ]
    },
    {
      number: 5,
      name: "Vision Floor",
      focus: "Prophecy & Sanctuary",
      rooms: [
        { code: "BL", name: "Blue Room", purpose: "Sanctuary as redemption blueprint" },
        { code: "PR", name: "Prophecy Room", purpose: "Daniel & Revelation timelines", link: "/prophecy-watch" },
        { code: "3A", name: "Three Angels' Room", purpose: "Final gospel appeal (Rev 14:6-12)" }
      ]
    },
    {
      number: 6,
      name: "Three Heavens Floor",
      focus: "Cycles & Cosmic Context",
      description: "Situate texts in cycles and heavens - never read in isolation"
    },
    {
      number: 7,
      name: "Spiritual & Emotional Floor",
      focus: "Transformation (Height)",
      rooms: [
        { code: "FRm", name: "Fire Room", purpose: "Emotional weight & conviction" },
        { code: "MR", name: "Meditation Room", purpose: "Slow marination in truth" },
        { code: "SRm", name: "Speed Room", purpose: "Rapid application & reflexes" }
      ]
    },
    {
      number: 8,
      name: "Master Floor",
      focus: "Reflexive Mastery",
      description: "No rooms - the palace is inside you. PT becomes natural thought."
    }
  ];

  // The Eight Cycles
  const cycles = [
    {
      code: "@Ad",
      name: "Adamic Cycle",
      pattern: "Fall → Covenant (Gen 3:15) → Sanctuary (Skins, Abel's offering) → Enemy (Serpent, Cain) → Restoration (Seth's line)",
      description: "Pilot episode - every theme appears here first"
    },
    {
      code: "@No",
      name: "Noahic Cycle",
      pattern: "Fall (Violence) → Covenant (Ark) → Sanctuary (Floating temple) → Enemy (Mockery, judgment waters) → Restoration (Rainbow covenant)",
      description: "Reset button - external cleansing can't solve internal problem"
    },
    {
      code: "@Ab",
      name: "Abrahamic Cycle",
      pattern: "Fall (Babel scatter) → Covenant (Father of nations) → Sanctuary (Altars, Moriah) → Enemy (Famine, foreign kings) → Restoration (Isaac's miracle birth)",
      description: "Main character selected - one family for the Seed"
    },
    {
      code: "@Mo",
      name: "Mosaic Cycle",
      pattern: "Fall (Egyptian slavery) → Covenant (Sinai) → Sanctuary (Tabernacle pattern) → Enemy (Pharaoh, wilderness rebellion) → Restoration (Canaan conquest)",
      description: "Nation-state launch - covenant goes public"
    },
    {
      code: "@Cy",
      name: "Cyrusic Cycle",
      pattern: "Fall (Babylon exile) → Covenant (Return promised) → Sanctuary (Temple rebuilt) → Enemy (Local opposition) → Restoration (Ezra/Nehemiah reforms)",
      description: "Rebuilding season - house restored but fragile"
    },
    {
      code: "@CyC",
      name: "Cyrus–Christ Cycle",
      pattern: "Fall (Post-exilic weakness) → Covenant (True Anointed appears) → Sanctuary (Christ as temple) → Enemy (Herod, Caesar, Satan, death) → Restoration (Resurrection, heavenly ministry)",
      description: "Fulfillment arc - type meets antitype"
    },
    {
      code: "@Sp",
      name: "Holy Spirit Cycle",
      pattern: "Fall (Disciples scatter) → Covenant (Spirit promise) → Sanctuary (Pentecost - homes as temples) → Enemy (Persecution, heresies) → Restoration (Revivals, Reformation, missions)",
      description: "Spread arc - global by Spirit, not might"
    },
    {
      code: "@Re",
      name: "Remnant Cycle",
      pattern: "Fall (Final apostasy) → Covenant (Rev 12:17 remnant) → Sanctuary (Heavenly judgment - Dan 8:14) → Enemy (Dragon, beast, false prophet) → Restoration (Second Coming, new heaven/earth)",
      description: "Final season - great controversy ends"
    }
  ];

  // Three Heavens (Day-of-the-LORD Model)
  const heavens = [
    {
      code: "1H",
      name: "DoL¹/NE¹",
      judgment: "586 BC - Babylon destroys Jerusalem",
      renewal: "Post-exilic restoration under Cyrus",
      description: "First Day of LORD → First New Heavens & Earth (typological)",
      cycles: "@Mo → @Cy",
      texts: "Jeremiah, Ezekiel, Isaiah 40–66, Ezra–Nehemiah"
    },
    {
      code: "2H",
      name: "DoL²/NE²",
      judgment: "70 AD - Rome destroys Jerusalem/Temple",
      renewal: "New-Covenant order: church as temple, heavenly sanctuary",
      description: "Second Day of LORD → Second New Heavens & Earth (covenantal/ecclesial)",
      cycles: "@CyC → @Sp",
      texts: "Synoptics (Olivet), Acts, Hebrews, 1 Peter, Revelation 1–3"
    },
    {
      code: "3H",
      name: "DoL³/NE³",
      judgment: "Final global judgment - elements melt (2 Pet 3)",
      renewal: "Literal New Creation - no temple, no night, no death",
      description: "Final Day of LORD → Final/Literal New Heavens & Earth",
      cycles: "@Re",
      texts: "2 Peter 3, Revelation 19–22, Isaiah 66 (ultimate horizon)"
    }
  ];

  // Symbol Library
  const symbols = [
    {
      category: "Christ Symbols",
      items: [
        { symbol: "Lamb", meaning: "Christ as sacrifice (John 1:29)" },
        { symbol: "Rock", meaning: "Christ as foundation (1 Cor 10:4)" },
        { symbol: "Light", meaning: "Truth/Christ (John 8:12)" },
        { symbol: "Bread", meaning: "Word/Christ (John 6:35)" },
        { symbol: "Water", meaning: "Spirit/Word (John 7:38; Eph 5:26)" },
        { symbol: "Vine", meaning: "Christ, we are branches (John 15:5)" }
      ]
    },
    {
      category: "Types (Shadows → Christ)",
      items: [
        { symbol: "Passover Lamb", meaning: "Calvary sacrifice" },
        { symbol: "Manna", meaning: "Bread of Life" },
        { symbol: "Ark", meaning: "Salvation in Christ" },
        { symbol: "High Priest", meaning: "Christ's intercession" },
        { symbol: "Brazen Serpent", meaning: "Christ lifted up (John 3:14)" },
        { symbol: "Day of Atonement", meaning: "Final judgment" }
      ]
    },
    {
      category: "Parallels (Mirrored Actions)",
      items: [
        { event1: "Tower of Babel", event2: "Pentecost", parallel: "Languages divided → Languages united" },
        { event1: "Israel leaving Egypt", event2: "Israel leaving Babylon", parallel: "Exodus pattern repeats" },
        { event1: "Jesus fasting 40 days", event2: "Israel wandering 40 years", parallel: "Testing period mirror" }
      ]
    }
  ];

  // Memory Tools
  const memoryTools = [
    {
      name: "24FPS System",
      description: "One symbolic image per chapter - 1,189 chapters total",
      example: "Genesis 1 = birthday cake earth (creation), Genesis 3 = snake biting apple-clock (fall into time)",
      purpose: "Flip through books mentally like a movie strip"
    },
    {
      name: "Bible Rendered",
      description: "One master image per 24-chapter block - only 51 images for entire Bible",
      example: "Genesis 1–24 = slash '/' (division theme), Genesis 25–50 = '×' (multiplication theme)",
      purpose: "Scan entire Bible in under 1 minute"
    },
    {
      name: "Five Ascensions",
      description: "Text → Chapter → Book → Cycle → Heaven",
      purpose: "Never read a verse in isolation - always climb to cosmic context"
    },
    {
      name: "Four Expansions",
      description: "Width (content), Time (daily practice), Depth (structure), Height (transformation)",
      purpose: "Stretch study in every direction"
    }
  ];

  // Ascensions & Expansions
  const framework = [
    {
      title: "Five Ascensions",
      subtitle: "Climb from text to cosmos",
      steps: [
        { level: "Asc-1", name: "Text", focus: "Word-level analysis (definitions, grammar)" },
        { level: "Asc-2", name: "Chapter", focus: "Place verse in chapter storyline" },
        { level: "Asc-3", name: "Book", focus: "Fit chapter into book's theme" },
        { level: "Asc-4", name: "Cycle", focus: "Place book in covenant cycle (@Ad → @Re)" },
        { level: "Asc-5", name: "Heaven", focus: "Locate in Day-of-LORD horizon (1H/2H/3H)" }
      ]
    },
    {
      title: "Four Expansions",
      subtitle: "Stretch study in all directions",
      dimensions: [
        { code: "Exp-W", name: "Width", focus: "Raw content & memory (Floors 1-2)" },
        { code: "Exp-T", name: "Time", focus: "Continuous freestyle practice (Floor 3)" },
        { code: "Exp-D", name: "Depth", focus: "Christ-centered structure, prophecy (Floors 4-6)" },
        { code: "Exp-H", name: "Height", focus: "Transformation & mastery (Floors 7-8)" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Building2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Phototheology Codebook
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete Reference Manual: Principles, Cycles, Symbols & Memory Tools
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              8 Floors • 8 Cycles • 3 Heavens
            </Badge>
            <Badge variant="outline">
              Complete PT System
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="principles" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="principles" className="gap-2">
              <Building2 className="h-4 w-4" />
              PT Principles
            </TabsTrigger>
            <TabsTrigger value="cycles" className="gap-2">
              <Clock className="h-4 w-4" />
              Cycles & Heavens
            </TabsTrigger>
            <TabsTrigger value="symbols" className="gap-2">
              <Code className="h-4 w-4" />
              Symbol Library
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              Memory Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="principles" className="space-y-6">
            {/* Palace Floors */}
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">The Eight-Floor Palace</h2>
                <p className="text-muted-foreground">Each floor builds on the one below - ascending from memory to mastery</p>
              </div>
              
              {floors.map((floor) => (
                <Card key={floor.number} className="overflow-hidden">
                  <CardHeader className="bg-accent/50">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2">Floor {floor.number}</Badge>
                        <CardTitle className="text-2xl">{floor.name}</CardTitle>
                        <CardDescription className="mt-1">{floor.focus}</CardDescription>
                      </div>
                      <Building2 className="h-8 w-8 text-primary opacity-50" />
                    </div>
                  </CardHeader>
                  {floor.rooms ? (
                    <CardContent className="pt-6">
                      <div className="grid gap-3 md:grid-cols-2">
                        {floor.rooms.map((room, i) => (
                          <div key={i} className="p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-2 flex-1">
                                <Badge variant="secondary" className="text-xs">{room.code}</Badge>
                                <div className="flex-1">
                                  <div className="font-semibold text-sm">{room.name}</div>
                                  <div className="text-xs text-muted-foreground mt-1">{room.purpose}</div>
                                </div>
                              </div>
                              {room.link && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 px-2"
                                  onClick={() => navigate(room.link)}
                                >
                                  <ChevronRight className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  ) : (
                    <CardContent className="pt-6">
                      <p className="text-sm text-muted-foreground italic">{floor.description}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* Five Ascensions & Four Expansions */}
            <div className="grid gap-6 md:grid-cols-2 mt-8">
              {framework.map((item, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Layers className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription>{item.subtitle}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.steps?.map((step, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-accent/50">
                          <Badge variant="outline" className="text-xs">{step.level}</Badge>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{step.name}</div>
                            <div className="text-xs text-muted-foreground">{step.focus}</div>
                          </div>
                        </div>
                      ))}
                      {item.dimensions?.map((dim, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded bg-accent/50">
                          <Badge variant="outline" className="text-xs">{dim.code}</Badge>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{dim.name}</div>
                            <div className="text-xs text-muted-foreground">{dim.focus}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cycles" className="space-y-6">
            {/* The Eight Cycles */}
            <div>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">The Eight Cycles</h2>
                <p className="text-muted-foreground">Fall → Covenant → Sanctuary → Enemy → Restoration</p>
              </div>
              
              <div className="space-y-4">
                {cycles.map((cycle) => (
                  <Card key={cycle.code} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{cycle.code}</Badge>
                            <CardTitle className="text-xl">{cycle.name}</CardTitle>
                          </div>
                          <CardDescription className="text-sm italic mb-3">
                            {cycle.description}
                          </CardDescription>
                          <div className="p-3 rounded-lg bg-accent/30 text-sm">
                            <div className="font-mono text-xs leading-relaxed">{cycle.pattern}</div>
                          </div>
                        </div>
                        <Target className="h-6 w-6 text-primary opacity-50 flex-shrink-0" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Three Heavens */}
            <div className="mt-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-2">The Three Heavens</h2>
                <p className="text-muted-foreground">Day-of-the-LORD Horizons: Judgment → Renewal</p>
              </div>
              
              <div className="space-y-4">
                {heavens.map((heaven) => (
                  <Card key={heaven.code} className="hover:shadow-lg transition-shadow border-primary/30">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Badge className="text-lg px-3 py-1">{heaven.code}</Badge>
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{heaven.name}</CardTitle>
                          <CardDescription className="mb-3">{heaven.description}</CardDescription>
                          <div className="space-y-2 text-sm">
                            <div className="p-2 rounded bg-destructive/10">
                              <span className="font-semibold">Judgment:</span> {heaven.judgment}
                            </div>
                            <div className="p-2 rounded bg-primary/10">
                              <span className="font-semibold">Renewal:</span> {heaven.renewal}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                              <div><span className="font-semibold">Cycles:</span> {heaven.cycles}</div>
                              <div><span className="font-semibold">Key Texts:</span> {heaven.texts}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Prophecy Watch Link */}
            <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      Current Prophecy Updates
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Track real-time fulfillment of biblical prophecy in today's world
                    </CardDescription>
                  </div>
                  <Button onClick={() => navigate('/prophecy-watch')} className="gap-2">
                    View Updates
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="p-3 rounded-lg bg-background/50">
                    <div className="font-semibold text-sm mb-1">World Events</div>
                    <div className="text-xs text-muted-foreground">
                      Current events mapped to prophetic timelines
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <div className="font-semibold text-sm mb-1">Signs Tracking</div>
                    <div className="text-xs text-muted-foreground">
                      Monitor fulfillment of end-time signs
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background/50">
                    <div className="font-semibold text-sm mb-1">Biblical Analysis</div>
                    <div className="text-xs text-muted-foreground">
                      Compare headlines with Scripture
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="symbols" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Symbol Library</h2>
              <p className="text-muted-foreground">God's universal language across Scripture</p>
            </div>

            {symbols.map((section, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Code className="h-6 w-6 text-primary" />
                    <CardTitle>{section.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                        {item.symbol && (
                          <>
                            <div className="flex-shrink-0 w-32">
                              <Badge variant="outline" className="w-full justify-center">{item.symbol}</Badge>
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <div className="text-sm flex-1">{item.meaning}</div>
                          </>
                        )}
                        {item.event1 && (
                          <div className="flex-1 space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{item.event1}</Badge>
                              <span className="text-muted-foreground">↔</span>
                              <Badge variant="outline" className="text-xs">{item.event2}</Badge>
                            </div>
                            <div className="text-muted-foreground">{item.parallel}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="memory" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Memory Tools</h2>
              <p className="text-muted-foreground">Transform Scripture into unforgettable visual patterns</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {memoryTools.map((tool, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-6 w-6 text-primary" />
                      <CardTitle>{tool.name}</CardTitle>
                    </div>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg bg-accent/50">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Example:</div>
                      <div className="text-sm">{tool.example}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-primary/10">
                      <div className="text-xs font-semibold text-muted-foreground mb-1">Purpose:</div>
                      <div className="text-sm">{tool.purpose}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Integration Card */}
            <Card className="border-primary/50 mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start Using These Tools
                </CardTitle>
                <CardDescription>
                  All memory tools are integrated throughout the Phototheology app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/palace")}>
                  Explore the Palace
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/bible-rendered-room")}>
                  Bible Rendered Room
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/bible")}>
                  Study Scripture
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="encyclopedia" className="space-y-6">
            {/* Header */}
            <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/30">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-2">
                  <Book className="h-8 w-8 text-primary" />
                  Bible Encyclopedia
                </CardTitle>
                <CardDescription className="text-lg">
                  Comprehensive biblical reference powered by AI with Seventh-day Adventist understanding
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Search Categories */}
            <div className="grid gap-3 md:grid-cols-5">
              <Button
                variant={searchCategory === "events" ? "default" : "outline"}
                className={searchCategory === "events" ? "gradient-palace text-white" : ""}
                onClick={() => setSearchCategory("events")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Events
              </Button>
              <Button
                variant={searchCategory === "maps" ? "default" : "outline"}
                className={searchCategory === "maps" ? "gradient-palace text-white" : ""}
                onClick={() => setSearchCategory("maps")}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Maps
              </Button>
              <Button
                variant={searchCategory === "prophecy" ? "default" : "outline"}
                className={searchCategory === "prophecy" ? "gradient-palace text-white" : ""}
                onClick={() => setSearchCategory("prophecy")}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Prophecy
              </Button>
              <Button
                variant={searchCategory === "charts" ? "default" : "outline"}
                className={searchCategory === "charts" ? "gradient-palace text-white" : ""}
                onClick={() => setSearchCategory("charts")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Charts
              </Button>
              <Button
                variant={searchCategory === "people" ? "default" : "outline"}
                className={searchCategory === "people" ? "gradient-palace text-white" : ""}
                onClick={() => setSearchCategory("people")}
              >
                <Users className="h-4 w-4 mr-2" />
                People
              </Button>
            </div>

            {/* Search Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  {searchCategory === "events" && "Search Biblical Events"}
                  {searchCategory === "maps" && "Search Places & Geography"}
                  {searchCategory === "prophecy" && "Search Prophetic Events (SDA Understanding)"}
                  {searchCategory === "charts" && "Search Timelines & Charts"}
                  {searchCategory === "people" && "Search Biblical People"}
                </CardTitle>
                <CardDescription>
                  {searchCategory === "events" && "Major events, miracles, and historical moments in scripture"}
                  {searchCategory === "maps" && "Biblical locations, journeys, and geographical context"}
                  {searchCategory === "prophecy" && "Prophetic timelines and end-time events from an SDA perspective"}
                  {searchCategory === "charts" && "Visual timelines, genealogies, and comparative charts"}
                  {searchCategory === "people" && "Biographical information about biblical figures"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Search ${searchCategory}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        handleSearch();
                      }
                    }}
                    disabled={isSearching}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isSearching}
                    className="gradient-palace text-white"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Quick Examples */}
                {!searchResults && (
                  <div className="pt-4 border-t">
                    <div className="text-sm font-semibold mb-2 text-muted-foreground">Quick Examples:</div>
                    <div className="flex gap-2 flex-wrap">
                      {searchCategory === "events" && (
                        <>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Exodus from Egypt"); }}>Exodus from Egypt</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Babylonian Captivity"); }}>Babylonian Captivity</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Pentecost"); }}>Pentecost</Badge>
                        </>
                      )}
                      {searchCategory === "maps" && (
                        <>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Jerusalem in Jesus' time"); }}>Jerusalem in Jesus' time</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Paul's missionary journeys"); }}>Paul's journeys</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("The Promised Land"); }}>Promised Land</Badge>
                        </>
                      )}
                      {searchCategory === "prophecy" && (
                        <>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("70 weeks prophecy"); }}>70 weeks prophecy</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("2300 day prophecy"); }}>2300 days</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Mark of the Beast"); }}>Mark of the Beast</Badge>
                        </>
                      )}
                      {searchCategory === "charts" && (
                        <>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Daniel 2 timeline"); }}>Daniel 2 timeline</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Kings of Israel and Judah"); }}>Kings chart</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Sanctuary services"); }}>Sanctuary services</Badge>
                        </>
                      )}
                      {searchCategory === "people" && (
                        <>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("King David"); }}>King David</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Apostle Paul"); }}>Apostle Paul</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => { setSearchQuery("Prophet Daniel"); }}>Prophet Daniel</Badge>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Results */}
                {searchResults && (
                  <div className="pt-4 border-t">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div className="whitespace-pre-wrap">{searchResults}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BibleReference;
