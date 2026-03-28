import { useState } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { BIBLE_ATLAS_TOUR } from "@/data/guidedTours";
import { ResearchToolsNav } from "@/components/bible/research/ResearchToolsNav";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { MapPin, BookOpen, Search, Globe, Compass, Mountain, Waves, GraduationCap } from "lucide-react";

interface BibleLocation {
  id: string;
  name: string;
  modernName?: string;
  description: string;
  scriptures: string[];
  category: string;
  lat: number;
  lng: number;
  events: string[];
}

const LOCATION_CATEGORIES = [
  { id: "city", label: "Cities", icon: <Globe className="h-3 w-3" /> },
  { id: "mountain", label: "Mountains", icon: <Mountain className="h-3 w-3" /> },
  { id: "water", label: "Bodies of Water", icon: <Waves className="h-3 w-3" /> },
  { id: "region", label: "Regions", icon: <Compass className="h-3 w-3" /> },
];

const BIBLE_LOCATIONS: BibleLocation[] = [
  { id: "1", name: "Jerusalem", modernName: "Jerusalem", description: "The holy city — site of Solomon's Temple, Christ's crucifixion and resurrection, and Pentecost. Center of God's earthly covenant activity.", scriptures: ["2 Samuel 5:7", "Matthew 21", "Acts 2"], category: "city", lat: 31.77, lng: 35.23, events: ["Temple built", "Crucifixion", "Pentecost", "Destroyed 586 BC & 70 AD"] },
  { id: "2", name: "Bethlehem", modernName: "Bethlehem", description: "Birthplace of David and of Christ. 'Little among the clans of Judah' yet the origin of the eternal King.", scriptures: ["Micah 5:2", "Matthew 2:1", "Luke 2:4-7"], category: "city", lat: 31.70, lng: 35.20, events: ["Birth of David", "Birth of Jesus"] },
  { id: "3", name: "Mount Sinai", modernName: "Jebel Musa (traditional)", description: "Where God descended in fire and thunder to give the Ten Commandments. The covenant is formalized here.", scriptures: ["Exodus 19-20", "Deuteronomy 5"], category: "mountain", lat: 28.54, lng: 33.97, events: ["Ten Commandments given", "Golden calf incident", "Tabernacle instructions"] },
  { id: "4", name: "Mount Moriah", modernName: "Temple Mount, Jerusalem", description: "Abraham offered Isaac here; Solomon built the Temple here. The altar of heaven on earth.", scriptures: ["Genesis 22:2", "2 Chronicles 3:1"], category: "mountain", lat: 31.78, lng: 35.24, events: ["Binding of Isaac", "Temple construction"] },
  { id: "5", name: "Jordan River", modernName: "Jordan River", description: "Israel crossed into the Promised Land here. Jesus was baptized by John in its waters.", scriptures: ["Joshua 3", "Matthew 3:13-17"], category: "water", lat: 31.84, lng: 35.55, events: ["Israel's crossing", "Jesus' baptism", "Naaman healed"] },
  { id: "6", name: "Sea of Galilee", modernName: "Lake Kinneret", description: "Center of Christ's Galilean ministry. Here He calmed storms, walked on water, and called fishermen as disciples.", scriptures: ["Matthew 4:18", "Mark 4:39", "John 21"], category: "water", lat: 32.83, lng: 35.59, events: ["Calling of disciples", "Walking on water", "Post-resurrection appearance"] },
  { id: "7", name: "Babylon", modernName: "Hillah, Iraq", description: "Capital of the empire that destroyed Jerusalem. Symbol of false worship and opposition to God throughout Revelation.", scriptures: ["2 Kings 25", "Daniel 1-4", "Revelation 17-18"], category: "city", lat: 32.54, lng: 44.42, events: ["Exile of Judah", "Daniel's visions", "Fiery furnace"] },
  { id: "8", name: "Egypt", modernName: "Egypt", description: "Land of Israel's bondage — a prophetic type of sin's slavery. God delivered His people with mighty signs.", scriptures: ["Exodus 1-15", "Genesis 46"], category: "region", lat: 26.82, lng: 30.80, events: ["Israel's bondage", "Ten plagues", "Exodus"] },
  { id: "9", name: "Nineveh", modernName: "Mosul, Iraq", description: "Capital of Assyria. Jonah was sent to preach repentance here. The city repented — a sign of God's mercy to all nations.", scriptures: ["Jonah 1-4", "Nahum 1-3"], category: "city", lat: 36.36, lng: 43.15, events: ["Jonah's preaching", "Nineveh repents", "Later destruction"] },
  { id: "10", name: "Mount Carmel", modernName: "Mount Carmel", description: "Where Elijah confronted 450 prophets of Baal. Fire from heaven proved YHWH is God.", scriptures: ["1 Kings 18:20-40"], category: "mountain", lat: 32.74, lng: 35.04, events: ["Elijah vs. Baal prophets", "Fire from heaven"] },
  { id: "11", name: "Nazareth", modernName: "Nazareth", description: "Hometown of Jesus. 'Can anything good come from Nazareth?' — yet the Savior grew up here in obscurity.", scriptures: ["Luke 1:26", "Luke 4:16-30", "John 1:46"], category: "city", lat: 32.70, lng: 35.30, events: ["Annunciation", "Jesus' childhood", "Rejected in synagogue"] },
  { id: "12", name: "Garden of Eden", modernName: "Unknown (Mesopotamia)", description: "God's original paradise. The tree of life, the river, the first sanctuary where God walked with humanity.", scriptures: ["Genesis 2:8-14"], category: "region", lat: 31.0, lng: 47.0, events: ["Creation of Adam & Eve", "The Fall", "Expulsion"] },
  { id: "13", name: "Mount Calvary / Golgotha", modernName: "Jerusalem", description: "The 'Place of the Skull' where Christ was crucified — the true altar of burnt offering.", scriptures: ["Matthew 27:33", "John 19:17", "Hebrews 13:12"], category: "mountain", lat: 31.78, lng: 35.23, events: ["Crucifixion of Christ"] },
  { id: "14", name: "Patmos", modernName: "Patmos, Greece", description: "Island where John received the Revelation — the final prophetic panorama of Revelation 1-22.", scriptures: ["Revelation 1:9"], category: "region", lat: 37.32, lng: 26.55, events: ["John's exile", "Revelation written"] },
  { id: "15", name: "Rome", modernName: "Rome, Italy", description: "Capital of the empire that destroyed the second Temple (DoL²). Paul wrote epistles from Roman imprisonment.", scriptures: ["Acts 28", "Romans 1:7", "Daniel 2:40"], category: "city", lat: 41.90, lng: 12.50, events: ["Paul's imprisonment", "Destruction of Jerusalem (70 AD)"] },
  { id: "16", name: "Antioch", modernName: "Antakya, Turkey", description: "Where believers were first called 'Christians.' Launchpad for Paul's missionary journeys.", scriptures: ["Acts 11:26", "Acts 13:1-3"], category: "city", lat: 36.20, lng: 36.16, events: ["Christians named", "Paul's missions launched"] },
];

const BibleAtlas = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tourOpen, setTourOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<BibleLocation | null>(null);

  const filteredLocations = BIBLE_LOCATIONS.filter((loc) => {
    const matchesSearch = !search || loc.name.toLowerCase().includes(search.toLowerCase()) || loc.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !selectedCategory || loc.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <>
      <Helmet>
        <title>Bible Atlas — Maps of Scripture | Phototheology</title>
        <meta name="description" content="Explore key locations from the Bible — cities, mountains, rivers, and regions — with scriptural references and historical context." />
      </Helmet>

      {tourOpen && <GuidedTourOverlay steps={BIBLE_ATLAS_TOUR} onClose={() => setTourOpen(false)} />}
      <div className={cn("min-h-screen flex flex-col", isDark ? "bg-[hsl(225,40%,8%)]" : "bg-gradient-to-br from-slate-50 via-amber-50/20 to-white")}>
        {/* Header */}
        <div className={cn("border-b px-4 py-3 shrink-0 backdrop-blur-xl", isDark ? "border-[hsl(32,70%,45%)/0.3] bg-[hsl(230,35%,12%)/0.95]" : "border-amber-200/50 bg-white/90")}>
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-[hsl(180,60%,40%)] to-[hsl(200,70%,45%)]">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <h1 className={cn("font-serif text-xl font-semibold", isDark ? "text-[hsl(45,80%,70%)]" : "text-amber-900")}>
                Bible Atlas
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                <BookOpen className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
                <GraduationCap className="h-4 w-4" /> Tour
              </Button>
            </div>
          </div>
          <div className="mt-2 max-w-7xl mx-auto">
            <ResearchToolsNav />
          </div>

          <div className="flex items-center gap-2 mt-3 max-w-7xl mx-auto flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search locations..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-9" />
            </div>
            <div className="flex gap-1.5">
              {LOCATION_CATEGORIES.map((cat) => (
                <Badge
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  className="cursor-pointer text-xs gap-1"
                  onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                >
                  {cat.icon} {cat.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Location List */}
          <ScrollArea className="w-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredLocations.map((loc) => (
                <div
                  key={loc.id}
                  className={cn(
                    "rounded-xl border p-4 cursor-pointer transition-all hover:shadow-lg",
                    selectedLocation?.id === loc.id
                      ? isDark ? "border-[hsl(32,70%,50%)] bg-[hsl(230,30%,16%)]" : "border-amber-400 bg-amber-50/50"
                      : isDark ? "border-[hsl(32,70%,45%)/0.2] bg-[hsl(230,30%,14%)] hover:border-[hsl(32,70%,45%)/0.4]" : "border-amber-100 bg-white hover:border-amber-300"
                  )}
                  onClick={() => setSelectedLocation(selectedLocation?.id === loc.id ? null : loc)}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      isDark ? "bg-[hsl(32,60%,25%)]" : "bg-amber-100"
                    )}>
                      <MapPin className={cn("h-4 w-4", isDark ? "text-[hsl(45,70%,65%)]" : "text-amber-600")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("font-serif font-semibold", isDark ? "text-[hsl(45,80%,85%)]" : "text-amber-900")}>
                        {loc.name}
                      </h3>
                      {loc.modernName && loc.modernName !== loc.name && (
                        <p className={cn("text-xs", isDark ? "text-[hsl(45,20%,50%)]" : "text-slate-400")}>
                          Modern: {loc.modernName}
                        </p>
                      )}
                      <p className={cn("text-sm mt-1 line-clamp-3", isDark ? "text-[hsl(45,20%,65%)]" : "text-slate-600")}>
                        {loc.description}
                      </p>
                    </div>
                  </div>

                  {selectedLocation?.id === loc.id && (
                    <div className="mt-3 pt-3 border-t border-dashed" style={{ borderColor: isDark ? "hsl(32,70%,45%,0.2)" : "hsl(32,80%,80%)" }}>
                      <div className="mb-2">
                        <span className={cn("text-xs font-semibold uppercase tracking-wider", isDark ? "text-[hsl(45,60%,55%)]" : "text-amber-600")}>
                          Key Events
                        </span>
                        <ul className="mt-1 space-y-0.5">
                          {loc.events.map((ev, i) => (
                            <li key={i} className={cn("text-xs flex items-center gap-1.5", isDark ? "text-[hsl(45,20%,65%)]" : "text-slate-500")}>
                              <span className="w-1 h-1 rounded-full bg-current shrink-0" /> {ev}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {loc.scriptures.map((ref) => (
                          <Badge key={ref} variant="secondary" className={cn("text-xs", isDark ? "bg-[hsl(32,60%,20%)] text-[hsl(45,70%,70%)]" : "bg-amber-50 text-amber-700")}>
                            <BookOpen className="h-3 w-3 mr-1" /> {ref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default BibleAtlas;
