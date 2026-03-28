import { useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { BIBLE_TIMELINE_TOUR } from "@/data/guidedTours";
import { ResearchToolsNav } from "@/components/bible/research/ResearchToolsNav";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Clock, BookOpen, Search, ChevronRight, MapPin, Crown, Sword, Flame, Star, Scroll, GraduationCap } from "lucide-react";

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  scriptures: string[];
  era: string;
  icon: React.ReactNode;
  cycle?: string;
  heaven?: string;
}

const TIMELINE_ERAS = [
  { id: "creation", label: "Creation & Patriarchs", color: "hsl(142, 60%, 40%)" },
  { id: "exodus", label: "Exodus & Conquest", color: "hsl(32, 80%, 50%)" },
  { id: "kingdom", label: "Kingdom Era", color: "hsl(262, 60%, 50%)" },
  { id: "exile", label: "Exile & Return", color: "hsl(0, 60%, 45%)" },
  { id: "intertestamental", label: "Intertestamental", color: "hsl(200, 40%, 45%)" },
  { id: "christ", label: "Life of Christ", color: "hsl(45, 90%, 50%)" },
  { id: "church", label: "Early Church", color: "hsl(180, 60%, 40%)" },
  { id: "prophecy", label: "Prophetic Future", color: "hsl(280, 70%, 55%)" },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  { id: "1", year: "~4000 BC", title: "Creation", description: "God creates heavens, earth, and humanity in six days. The Sabbath is instituted as a memorial of creation.", scriptures: ["Genesis 1-2"], era: "creation", icon: <Star className="h-4 w-4" />, cycle: "@Ad", heaven: "1H" },
  { id: "2", year: "~4000 BC", title: "The Fall", description: "Adam and Eve sin; the protoevangelium (Genesis 3:15) promises a Deliverer — the Seed of the woman.", scriptures: ["Genesis 3"], era: "creation", icon: <Flame className="h-4 w-4" />, cycle: "@Ad", heaven: "1H" },
  { id: "3", year: "~3000 BC", title: "Cain & Abel", description: "Two seeds diverge: Abel offers by faith, Cain by works. The great controversy begins on earth.", scriptures: ["Genesis 4"], era: "creation", icon: <Sword className="h-4 w-4" />, cycle: "@Ad", heaven: "1H" },
  { id: "4", year: "~2350 BC", title: "The Flood", description: "Global judgment by water. Noah's ark — a floating sanctuary with one door — preserves a remnant.", scriptures: ["Genesis 6-9"], era: "creation", icon: <Flame className="h-4 w-4" />, cycle: "@No", heaven: "1H" },
  { id: "5", year: "~2200 BC", title: "Tower of Babel", description: "Humanity unites in rebellion; God scatters nations by confusing languages. Foreshadows Pentecost's reversal.", scriptures: ["Genesis 11"], era: "creation", icon: <Crown className="h-4 w-4" />, cycle: "@No", heaven: "1H" },
  { id: "6", year: "~2091 BC", title: "Call of Abraham", description: "God narrows covenant focus to one family: 'In you all nations shall be blessed.' The Abrahamic cycle begins.", scriptures: ["Genesis 12"], era: "creation", icon: <Star className="h-4 w-4" />, cycle: "@Ab", heaven: "1H" },
  { id: "7", year: "~2066 BC", title: "Binding of Isaac", description: "Abraham offers Isaac on Mount Moriah — prophetic type of the Father offering the Son. 'God will provide Himself a lamb.'", scriptures: ["Genesis 22"], era: "creation", icon: <Scroll className="h-4 w-4" />, cycle: "@Ab", heaven: "1H" },
  { id: "8", year: "~1876 BC", title: "Joseph in Egypt", description: "Joseph sold by brothers, imprisoned, exalted — a type of Christ rejected, suffering, then reigning.", scriptures: ["Genesis 37-50"], era: "creation", icon: <Crown className="h-4 w-4" />, cycle: "@Ab", heaven: "1H" },
  { id: "9", year: "~1446 BC", title: "The Exodus", description: "God delivers Israel from Egypt with mighty signs. The Passover lamb's blood protects — type of Christ our Passover.", scriptures: ["Exodus 1-15"], era: "exodus", icon: <Flame className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "10", year: "~1446 BC", title: "Sinai Covenant", description: "God gives the Ten Commandments and the covenant is formalized. Israel becomes a kingdom of priests.", scriptures: ["Exodus 19-24"], era: "exodus", icon: <Scroll className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "11", year: "~1445 BC", title: "Tabernacle Built", description: "The sanctuary — God's dwelling among His people. Every article points to Christ's work of redemption.", scriptures: ["Exodus 25-40"], era: "exodus", icon: <Star className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "12", year: "~1406 BC", title: "Conquest of Canaan", description: "Joshua leads Israel into the Promised Land. Jericho falls by faith, not human might.", scriptures: ["Joshua 1-12"], era: "exodus", icon: <Sword className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "13", year: "~1050 BC", title: "United Kingdom Begins", description: "Saul anointed as first king, then David — a man after God's own heart. The Davidic covenant promises an eternal throne.", scriptures: ["1 Samuel 16", "2 Samuel 7"], era: "kingdom", icon: <Crown className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "14", year: "~966 BC", title: "Solomon's Temple", description: "Solomon builds the Temple — God's glory fills the house. The sanctuary pattern expands from tent to stone.", scriptures: ["1 Kings 5-8"], era: "kingdom", icon: <Star className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "15", year: "~930 BC", title: "Kingdom Divided", description: "Israel splits: 10 northern tribes (Israel) and 2 southern (Judah). Apostasy escalates in the north.", scriptures: ["1 Kings 12"], era: "kingdom", icon: <Sword className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "16", year: "722 BC", title: "Fall of Northern Israel", description: "Assyria conquers the 10 tribes. Scattering judgment for covenant unfaithfulness.", scriptures: ["2 Kings 17"], era: "kingdom", icon: <Flame className="h-4 w-4" />, cycle: "@Mo", heaven: "1H" },
  { id: "17", year: "586 BC", title: "Babylonian Exile", description: "Jerusalem and Solomon's Temple destroyed. DoL¹ — the first Day of the Lord. Exile begins.", scriptures: ["2 Kings 25", "Jeremiah 52"], era: "exile", icon: <Flame className="h-4 w-4" />, cycle: "@Cy", heaven: "1H" },
  { id: "18", year: "538 BC", title: "Cyrus Decree", description: "Cyrus of Persia decrees Israel's return. NE¹ — the first 'new heavens and earth' as post-exilic restoration begins.", scriptures: ["Ezra 1", "Isaiah 44:28-45:1"], era: "exile", icon: <Crown className="h-4 w-4" />, cycle: "@Cy", heaven: "1H" },
  { id: "19", year: "516 BC", title: "Second Temple", description: "Temple rebuilt under Zerubbabel. Smaller, but God promises greater glory to come.", scriptures: ["Ezra 6", "Haggai 2:9"], era: "exile", icon: <Star className="h-4 w-4" />, cycle: "@Cy", heaven: "1H" },
  { id: "20", year: "445 BC", title: "Nehemiah Rebuilds Walls", description: "Jerusalem's walls rebuilt in 52 days. The 70 weeks prophecy of Daniel 9 begins its countdown.", scriptures: ["Nehemiah 1-6", "Daniel 9:25"], era: "exile", icon: <MapPin className="h-4 w-4" />, cycle: "@Cy", heaven: "1H" },
  { id: "21", year: "~400-5 BC", title: "Silent Years", description: "400 years of prophetic silence between Malachi and Matthew. Greece, then Rome, dominate. Stage set for the Messiah.", scriptures: ["Daniel 2", "Daniel 8"], era: "intertestamental", icon: <Clock className="h-4 w-4" />, cycle: "@CyC" },
  { id: "22", year: "~5 BC", title: "Birth of Christ", description: "The Word becomes flesh. Born in Bethlehem, laid in a manger — the Lamb enters the world.", scriptures: ["Matthew 1-2", "Luke 2", "John 1:14"], era: "christ", icon: <Star className="h-4 w-4" />, cycle: "@CyC", heaven: "2H" },
  { id: "23", year: "~27 AD", title: "Baptism of Jesus", description: "Jesus baptized in Jordan. The Spirit descends; the Father speaks. Ministry begins — the 70th week of Daniel 9.", scriptures: ["Matthew 3", "Luke 3"], era: "christ", icon: <Flame className="h-4 w-4" />, cycle: "@CyC", heaven: "2H" },
  { id: "24", year: "~31 AD", title: "Crucifixion", description: "'It is finished.' The true Passover Lamb is slain. The veil tears. Heaven's altar receives the ultimate sacrifice.", scriptures: ["Matthew 27", "John 19", "1 Corinthians 5:7"], era: "christ", icon: <Scroll className="h-4 w-4" />, cycle: "@CyC", heaven: "2H" },
  { id: "25", year: "~31 AD", title: "Resurrection & Ascension", description: "Christ rises on the third day — Firstfruits fulfilled. He ascends to the heavenly sanctuary as High Priest.", scriptures: ["Matthew 28", "Acts 1", "Hebrews 8:1-2"], era: "christ", icon: <Star className="h-4 w-4" />, cycle: "@CyC", heaven: "2H" },
  { id: "26", year: "~31 AD", title: "Pentecost", description: "The Spirit falls like fire. Babel reversed — languages unite in the gospel. The church is born.", scriptures: ["Acts 2"], era: "church", icon: <Flame className="h-4 w-4" />, cycle: "@Sp", heaven: "2H" },
  { id: "27", year: "~34 AD", title: "Stoning of Stephen", description: "The gospel breaks beyond Jerusalem. Paul is converted. The 70th week closes; gospel goes to all nations.", scriptures: ["Acts 7-9"], era: "church", icon: <Sword className="h-4 w-4" />, cycle: "@Sp", heaven: "2H" },
  { id: "28", year: "70 AD", title: "Destruction of Jerusalem", description: "DoL² — Rome destroys Jerusalem and the Temple. The old covenant order ends. NE² — the New Covenant heavenly order is established.", scriptures: ["Matthew 24", "Luke 21:20-24", "Hebrews 12:26-28"], era: "church", icon: <Flame className="h-4 w-4" />, cycle: "@Sp", heaven: "2H" },
  { id: "29", year: "1798 AD", title: "End of 1260 Years", description: "Papal supremacy ends. The time prophecy of Daniel 7:25 and Revelation 13:5 fulfilled.", scriptures: ["Daniel 7:25", "Revelation 13:5"], era: "church", icon: <Clock className="h-4 w-4" />, cycle: "@Re", heaven: "2H" },
  { id: "30", year: "1844 AD", title: "Heavenly Judgment Begins", description: "The 2300 days of Daniel 8:14 conclude. Christ enters the Most Holy Place — the antitypical Day of Atonement.", scriptures: ["Daniel 8:14", "Revelation 14:7"], era: "church", icon: <Star className="h-4 w-4" />, cycle: "@Re", heaven: "2H" },
  { id: "31", year: "Future", title: "Three Angels' Messages", description: "The final gospel call: worship the Creator, Babylon is fallen, warning against the mark. The remnant is sealed.", scriptures: ["Revelation 14:6-12"], era: "prophecy", icon: <Scroll className="h-4 w-4" />, cycle: "@Re", heaven: "3H" },
  { id: "32", year: "Future", title: "Second Coming", description: "DoL³ — Christ returns in glory. Every eye sees Him. The dead in Christ rise. Earth is judged.", scriptures: ["Revelation 19", "1 Thessalonians 4:16-17"], era: "prophecy", icon: <Crown className="h-4 w-4" />, cycle: "@Re", heaven: "3H" },
  { id: "33", year: "Future", title: "New Heaven & New Earth", description: "NE³ — God makes all things new. No more death, pain, or curse. The Lamb is its light. Eden restored.", scriptures: ["Revelation 21-22"], era: "prophecy", icon: <Star className="h-4 w-4" />, cycle: "@Re", heaven: "3H" },
];

const BibleTimeline = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [tourOpen, setTourOpen] = useState(false);
  const [selectedEra, setSelectedEra] = useState<string | null>(null);

  const filteredEvents = TIMELINE_EVENTS.filter((e) => {
    const matchesSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.description.toLowerCase().includes(search.toLowerCase());
    const matchesEra = !selectedEra || e.era === selectedEra;
    return matchesSearch && matchesEra;
  });

  const getEraColor = (eraId: string) => TIMELINE_ERAS.find(e => e.id === eraId)?.color || "hsl(0,0%,50%)";

  return (
    <>
      <Helmet>
        <title>Bible Timeline — Chronology of Scripture | Phototheology</title>
        <meta name="description" content="Explore the chronological timeline of Bible events from Creation to the New Earth, mapped to Phototheology cycles and heavens." />
      </Helmet>

      {tourOpen && <GuidedTourOverlay steps={BIBLE_TIMELINE_TOUR} onClose={() => setTourOpen(false)} />}
      <div className={cn("min-h-screen flex flex-col", isDark ? "bg-[hsl(225,40%,8%)]" : "bg-gradient-to-br from-slate-50 via-amber-50/20 to-white")}>
        {/* Header */}
        <div className={cn("border-b px-4 py-3 shrink-0 backdrop-blur-xl", isDark ? "border-[hsl(32,70%,45%)/0.3] bg-[hsl(230,35%,12%)/0.95]" : "border-amber-200/50 bg-white/90")}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(32,80%,50%)] to-[hsl(45,90%,50%)]">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <h1 className={cn("font-serif text-xl font-semibold", isDark ? "text-[hsl(45,80%,70%)]" : "text-amber-900")}>
                Bible Timeline
              </h1>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <BookOpen className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
              <GraduationCap className="h-4 w-4" /> Tour
            </Button>
          </div>
          <div className="mt-2 max-w-7xl mx-auto">
            <ResearchToolsNav />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-3 max-w-7xl mx-auto flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {TIMELINE_ERAS.map((era) => (
                <Badge
                  key={era.id}
                  variant={selectedEra === era.id ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  style={selectedEra === era.id ? { backgroundColor: era.color, borderColor: era.color } : {}}
                  onClick={() => setSelectedEra(selectedEra === era.id ? null : era.id)}
                >
                  {era.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <ScrollArea className="flex-1">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="relative">
              {/* Center line */}
              <div className={cn("absolute left-8 top-0 bottom-0 w-0.5", isDark ? "bg-[hsl(32,70%,45%)/0.3]" : "bg-amber-200")} />

              {filteredEvents.map((event, i) => {
                const eraColor = getEraColor(event.era);
                return (
                  <div key={event.id} className="relative flex gap-6 mb-8 group">
                    {/* Timeline dot */}
                    <div className="relative z-10 flex-shrink-0 w-16 flex items-start justify-center pt-1">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: eraColor }}
                      >
                        <span className="text-white">{event.icon}</span>
                      </div>
                    </div>

                    {/* Content card */}
                    <div className={cn(
                      "flex-1 rounded-xl p-4 border transition-all group-hover:shadow-lg",
                      isDark
                        ? "bg-[hsl(230,30%,14%)] border-[hsl(32,70%,45%)/0.2] group-hover:border-[hsl(32,70%,45%)/0.4]"
                        : "bg-white border-amber-100 group-hover:border-amber-300"
                    )}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn("text-xs font-mono font-bold", isDark ? "text-[hsl(45,60%,65%)]" : "text-amber-600")}>
                              {event.year}
                            </span>
                            {event.cycle && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1">{event.cycle}</Badge>
                            )}
                            {event.heaven && (
                              <Badge variant="outline" className="text-[10px] h-4 px-1">{event.heaven}</Badge>
                            )}
                          </div>
                          <h3 className={cn("font-serif text-lg font-semibold", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                            {event.title}
                          </h3>
                          <p className={cn("text-sm mt-1 leading-relaxed", isDark ? "text-[hsl(45,20%,65%)]" : "text-slate-600")}>
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {event.scriptures.map((ref) => (
                          <Badge
                            key={ref}
                            variant="secondary"
                            className={cn("text-xs cursor-pointer hover:opacity-80", isDark ? "bg-[hsl(32,60%,20%)] text-[hsl(45,70%,70%)]" : "bg-amber-50 text-amber-700")}
                          >
                            <BookOpen className="h-3 w-3 mr-1" />
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default BibleTimeline;
