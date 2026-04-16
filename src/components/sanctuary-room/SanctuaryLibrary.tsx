import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  ChevronRight,
  Library,
  Sparkles,
  Cross,
  Crown,
  Heart,
  Star,
  Shirt,
  Clock,
  Gift
} from "lucide-react";
import {
  sanctuaryZones,
  sanctuaryElements,
  priestlyGarments,
  sanctuaryServices,
  sanctuaryOfferings,
  getSanctuaryElementsByZone,
  getGarmentsByWho,
  getServicesByFrequency,
  getOfferingsByType,
  searchSanctuary,
  getTotalSanctuaryItems,
  type SanctuaryElement,
  type SanctuaryService,
  type SanctuaryOffering,
  type PriestlyGarment,
  type SanctuaryZone
} from "@/data/sanctuaryLibrary";

interface SanctuaryLibraryProps {
  onClose?: () => void;
}

const zoneConfig: Record<string, { icon: string; gradient: string }> = {
  "camp": { icon: "🏕️", gradient: "from-amber-500 to-orange-600" },
  "courtyard": { icon: "⛪", gradient: "from-blue-500 to-cyan-600" },
  "holy-place": { icon: "🕯️", gradient: "from-purple-500 to-indigo-600" },
  "most-holy-place": { icon: "👑", gradient: "from-amber-400 to-yellow-500" }
};

type LibraryTab = "zones" | "garments" | "services" | "offerings";

export function SanctuaryLibrary({ onClose }: SanctuaryLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("zones");
  const [selectedZone, setSelectedZone] = useState<typeof sanctuaryZones[number] | null>(null);
  const [selectedElement, setSelectedElement] = useState<SanctuaryElement | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<PriestlyGarment | null>(null);
  const [selectedService, setSelectedService] = useState<SanctuaryService | null>(null);
  const [selectedOffering, setSelectedOffering] = useState<SanctuaryOffering | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    elements: SanctuaryElement[];
    garments: PriestlyGarment[];
    services: SanctuaryService[];
    offerings: SanctuaryOffering[];
  } | null>(null);

  const totalItems = getTotalSanctuaryItems();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      setSearchResults(searchSanctuary(query));
      clearSelections();
    } else {
      setSearchResults(null);
    }
  };

  const clearSelections = () => {
    setSelectedZone(null);
    setSelectedElement(null);
    setSelectedGarment(null);
    setSelectedService(null);
    setSelectedOffering(null);
  };

  const clearAll = () => {
    clearSelections();
    setSearchQuery("");
    setSearchResults(null);
  };

  // Element Detail View
  if (selectedElement) {
    const config = zoneConfig[selectedElement.zone];
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedElement(null)} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{config.icon}</span>
            <div>
              <CardTitle className="text-xl">{selectedElement.name}</CardTitle>
              {selectedElement.hebrewName && (
                <p className="text-sm text-muted-foreground">{selectedElement.hebrewName} — "{selectedElement.hebrewMeaning}"</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge className={`bg-gradient-to-r ${config.gradient} text-white capitalize`}>
              {selectedElement.zone.replace(/-/g, " ")}
            </Badge>
            <Badge variant="outline" className="capitalize">{selectedElement.category}</Badge>
          </div>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-5">
            <div>
              <h4 className="font-semibold mb-2">Physical Description</h4>
              <p className="text-muted-foreground text-sm">{selectedElement.physicalDescription}</p>
              {selectedElement.dimensions && (
                <p className="text-xs text-muted-foreground mt-1"><strong>Dimensions:</strong> {selectedElement.dimensions}</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Materials</h4>
              <div className="flex flex-wrap gap-1">
                {selectedElement.materials.map((m, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{m}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Purpose</h4>
              <p className="text-muted-foreground text-sm">{selectedElement.purpose}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><Crown className="h-4 w-4 text-purple-500" />Priestly Service</h4>
              <p className="text-muted-foreground text-sm">{selectedElement.priestlyService}</p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2"><Cross className="h-4 w-4 text-primary" />Christ Connection</h4>
              <p className="text-muted-foreground text-sm">{selectedElement.christConnection}</p>
            </div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" />For You Today</h4>
              <p className="text-muted-foreground text-sm">{selectedElement.believerApplication}</p>
            </div>
            {selectedElement.prophetic && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Prophetic Significance</h4>
                <p className="text-muted-foreground text-sm">{selectedElement.prophetic}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-500" />Key Verses</h4>
              <div className="flex flex-wrap gap-2">
                {selectedElement.keyVerses.map((verse) => (
                  <Badge key={verse} variant="secondary">{verse}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  // Garment Detail View
  if (selectedGarment) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedGarment(null)} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back
          </Button>
          <div className="flex items-center gap-3">
            <Shirt className="h-8 w-8 text-purple-500" />
            <div>
              <CardTitle className="text-xl">{selectedGarment.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{selectedGarment.hebrewName} — "{selectedGarment.hebrewMeaning}"</p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit mt-2 capitalize">Worn by: {selectedGarment.wornBy.replace(/-/g, " ")}</Badge>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-5">
            <div><h4 className="font-semibold mb-2">Description</h4><p className="text-muted-foreground text-sm">{selectedGarment.description}</p></div>
            <div className="grid grid-cols-2 gap-4">
              <div><h4 className="font-semibold mb-2">Materials</h4><div className="flex flex-wrap gap-1">{selectedGarment.materials.map((m, i) => (<Badge key={i} variant="secondary" className="text-xs">{m}</Badge>))}</div></div>
              <div><h4 className="font-semibold mb-2">Colors</h4><div className="flex flex-wrap gap-1">{selectedGarment.colors.map((c, i) => (<Badge key={i} variant="outline" className="text-xs">{c}</Badge>))}</div></div>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-500" />Symbolism</h4><p className="text-muted-foreground text-sm">{selectedGarment.symbolism}</p></div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Cross className="h-4 w-4 text-primary" />Christ Connection</h4><p className="text-muted-foreground text-sm">{selectedGarment.christConnection}</p></div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" />For You Today</h4><p className="text-muted-foreground text-sm">{selectedGarment.believerApplication}</p></div>
            <div><h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-500" />Key Verses</h4><div className="flex flex-wrap gap-2">{selectedGarment.keyVerses.map((verse) => (<Badge key={verse} variant="secondary">{verse}</Badge>))}</div></div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  // Service Detail View
  if (selectedService) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedService(null)} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back
          </Button>
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-amber-500" />
            <div><CardTitle className="text-xl">{selectedService.name}</CardTitle>{selectedService.hebrewName && (<p className="text-sm text-muted-foreground">{selectedService.hebrewName}</p>)}</div>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">{selectedService.frequency}</Badge>
            <Badge variant="outline">{selectedService.timing}</Badge>
          </div>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-5">
            <div><h4 className="font-semibold mb-2">Description</h4><p className="text-muted-foreground text-sm">{selectedService.description}</p></div>
            <div><h4 className="font-semibold mb-2">Procedure</h4><ol className="list-decimal list-inside space-y-1">{selectedService.procedure.map((step, i) => (<li key={i} className="text-sm text-muted-foreground">{step}</li>))}</ol></div>
            <div><h4 className="font-semibold mb-2">Offerings Required</h4><div className="flex flex-wrap gap-1">{selectedService.offerings.map((o, i) => (<Badge key={i} variant="secondary" className="text-xs">{o}</Badge>))}</div></div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Crown className="h-4 w-4 text-purple-500" />Priestly Role</h4><p className="text-muted-foreground text-sm">{selectedService.priestlyRole}</p></div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Cross className="h-4 w-4 text-primary" />Christ's Fulfillment</h4><p className="text-muted-foreground text-sm">{selectedService.christFulfillment}</p></div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" />For You Today</h4><p className="text-muted-foreground text-sm">{selectedService.believerApplication}</p></div>
            <div><h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-500" />Key Verses</h4><div className="flex flex-wrap gap-2">{selectedService.keyVerses.map((verse) => (<Badge key={verse} variant="secondary">{verse}</Badge>))}</div></div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  // Offering Detail View
  if (selectedOffering) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedOffering(null)} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back
          </Button>
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 text-rose-500" />
            <div><CardTitle className="text-xl">{selectedOffering.name}</CardTitle><p className="text-sm text-muted-foreground">{selectedOffering.hebrewName} — "{selectedOffering.hebrewMeaning}"</p></div>
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="capitalize">{selectedOffering.type} offering</Badge>
            <Badge variant="outline" className="capitalize">{selectedOffering.category}</Badge>
          </div>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-5">
            <div><h4 className="font-semibold mb-2 flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" />Purpose</h4><p className="text-muted-foreground text-sm">{selectedOffering.purpose}</p></div>
            <div><h4 className="font-semibold mb-2">Description</h4><p className="text-muted-foreground text-sm">{selectedOffering.description}</p></div>
            <div><h4 className="font-semibold mb-2">What Was Offered</h4><div className="flex flex-wrap gap-1">{selectedOffering.animalOrMaterial.map((item, i) => (<Badge key={i} variant="secondary" className="text-xs">{item}</Badge>))}</div></div>
            <div><h4 className="font-semibold mb-2">Procedure</h4><ol className="list-decimal list-inside space-y-1">{selectedOffering.procedure.map((step, i) => (<li key={i} className="text-sm text-muted-foreground">{step}</li>))}</ol></div>
            <div className="grid grid-cols-2 gap-4"><div><h4 className="font-semibold mb-1 text-sm">Who Offers</h4><p className="text-xs text-muted-foreground">{selectedOffering.whoOffers}</p></div><div><h4 className="font-semibold mb-1 text-sm">When Offered</h4><p className="text-xs text-muted-foreground">{selectedOffering.whenOffered}</p></div></div>
            <div className="grid grid-cols-2 gap-4"><div><h4 className="font-semibold mb-1 text-sm">Priest's Portion</h4><p className="text-xs text-muted-foreground">{selectedOffering.priestPortion}</p></div><div><h4 className="font-semibold mb-1 text-sm">Offerer's Portion</h4><p className="text-xs text-muted-foreground">{selectedOffering.offererPortion}</p></div></div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Cross className="h-4 w-4 text-primary" />Christ in This Offering</h4><p className="text-muted-foreground text-sm">{selectedOffering.christTypology}</p></div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" />Spiritual Lesson</h4><p className="text-muted-foreground text-sm">{selectedOffering.spiritualLesson}</p></div>
            <div><h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-500" />Key Verses</h4><div className="flex flex-wrap gap-2">{selectedOffering.keyVerses.map((verse) => (<Badge key={verse} variant="secondary">{verse}</Badge>))}</div></div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  // Zone Elements View
  if (selectedZone) {
    const elementsInZone = getSanctuaryElementsByZone(selectedZone.id as SanctuaryZone);
    const config = zoneConfig[selectedZone.id];
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedZone(null)} className="w-fit mb-2">
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back to Zones
          </Button>
          <div className="flex items-center gap-3"><span className="text-3xl">{config.icon}</span><div><CardTitle>{selectedZone.name}</CardTitle><CardDescription>{selectedZone.description}</CardDescription></div></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4"><h4 className="font-semibold mb-2 text-sm">Spiritual Meaning</h4><p className="text-sm text-muted-foreground">{selectedZone.spiritualMeaning}</p></div>
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4"><h4 className="font-semibold mb-2 text-sm flex items-center gap-2"><Cross className="h-4 w-4 text-primary" />Christ Connection</h4><p className="text-sm text-muted-foreground">{selectedZone.christConnection}</p></div>
          <div><h4 className="font-semibold mb-3">Elements in {selectedZone.name} ({elementsInZone.length})</h4>
            <ScrollArea className="h-[300px]"><div className="space-y-2 pr-4">{elementsInZone.map((element) => (
              <Card key={element.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedElement(element)}>
                <CardContent className="p-3"><div className="flex items-center justify-between"><div><h4 className="font-medium text-sm">{element.name}</h4>{element.hebrewName && (<p className="text-xs text-muted-foreground">{element.hebrewName}</p>)}</div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></CardContent>
              </Card>
            ))}</div></ScrollArea>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Search Results View
  if (searchResults) {
    const totalResults = searchResults.elements.length + searchResults.garments.length + searchResults.services.length + searchResults.offerings.length;
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={clearAll} className="w-fit mb-2"><ChevronRight className="h-4 w-4 rotate-180 mr-1" />Clear Search</Button>
          <CardTitle>Search Results</CardTitle><CardDescription>Found {totalResults} items for "{searchQuery}"</CardDescription>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-6">
            {searchResults.elements.length > 0 && (<div><h4 className="font-semibold mb-2 text-sm">Sanctuary Elements ({searchResults.elements.length})</h4><div className="space-y-2">{searchResults.elements.map((e) => (<Card key={e.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedElement(e)}><CardContent className="p-3 flex items-center justify-between"><span className="text-sm">{e.name}</span><Badge variant="outline" className="text-xs capitalize">{e.zone.replace(/-/g, " ")}</Badge></CardContent></Card>))}</div></div>)}
            {searchResults.garments.length > 0 && (<div><h4 className="font-semibold mb-2 text-sm">Priestly Garments ({searchResults.garments.length})</h4><div className="space-y-2">{searchResults.garments.map((g) => (<Card key={g.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedGarment(g)}><CardContent className="p-3 flex items-center justify-between"><span className="text-sm">{g.name}</span><Badge variant="outline" className="text-xs capitalize">{g.wornBy.replace(/-/g, " ")}</Badge></CardContent></Card>))}</div></div>)}
            {searchResults.services.length > 0 && (<div><h4 className="font-semibold mb-2 text-sm">Sanctuary Services ({searchResults.services.length})</h4><div className="space-y-2">{searchResults.services.map((s) => (<Card key={s.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedService(s)}><CardContent className="p-3 flex items-center justify-between"><span className="text-sm">{s.name}</span><Badge variant="outline" className="text-xs capitalize">{s.frequency}</Badge></CardContent></Card>))}</div></div>)}
            {searchResults.offerings.length > 0 && (<div><h4 className="font-semibold mb-2 text-sm">Offerings ({searchResults.offerings.length})</h4><div className="space-y-2">{searchResults.offerings.map((o) => (<Card key={o.id} className="cursor-pointer hover:bg-accent/50" onClick={() => setSelectedOffering(o)}><CardContent className="p-3 flex items-center justify-between"><span className="text-sm">{o.name}</span><Badge variant="outline" className="text-xs capitalize">{o.type}</Badge></CardContent></Card>))}</div></div>)}
            {totalResults === 0 && (<div className="text-center py-8 text-muted-foreground"><Search className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No results found for "{searchQuery}"</p></div>)}
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  // Main Library View with Tabs
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div><CardTitle className="flex items-center gap-2"><Library className="h-5 w-5 text-blue-600" />Sanctuary Library</CardTitle><CardDescription>{totalItems} items across 4 categories</CardDescription></div>
          {onClose && (<Button variant="ghost" size="sm" onClick={onClose}>Close</Button>)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search elements, garments, services..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" /></div>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="zones" className="text-xs"><span className="hidden sm:inline">Zones</span><span className="sm:hidden">⛪</span></TabsTrigger>
            <TabsTrigger value="garments" className="text-xs"><span className="hidden sm:inline">Garments</span><span className="sm:hidden">👔</span></TabsTrigger>
            <TabsTrigger value="services" className="text-xs"><span className="hidden sm:inline">Services</span><span className="sm:hidden">🕯️</span></TabsTrigger>
            <TabsTrigger value="offerings" className="text-xs"><span className="hidden sm:inline">Offerings</span><span className="sm:hidden">🎁</span></TabsTrigger>
          </TabsList>
          <TabsContent value="zones">
            <ScrollArea className="h-[400px]"><div className="space-y-3 pr-4">{sanctuaryZones.map((zone) => { const config = zoneConfig[zone.id]; const count = getSanctuaryElementsByZone(zone.id as SanctuaryZone).length; return (<Card key={zone.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedZone(zone)}><CardContent className="p-4"><div className="flex items-start justify-between mb-2"><span className="text-2xl">{config.icon}</span><Badge variant="secondary">{count} items</Badge></div><h4 className="font-semibold">{zone.name}</h4><p className="text-xs text-muted-foreground mt-1 line-clamp-2">{zone.description}</p></CardContent></Card>); })}</div></ScrollArea>
          </TabsContent>
          <TabsContent value="garments">
            <ScrollArea className="h-[400px]"><div className="space-y-2 pr-4"><div className="mb-3"><Badge variant="outline" className="mb-2">High Priest Only</Badge>{getGarmentsByWho("high-priest").filter(g => g.wornBy === "high-priest").map((garment) => (<Card key={garment.id} className="cursor-pointer hover:bg-accent/50 transition-colors mb-2" onClick={() => setSelectedGarment(garment)}><CardContent className="p-3"><div className="flex items-center justify-between"><div><h4 className="font-medium text-sm">{garment.name}</h4><p className="text-xs text-muted-foreground">{garment.hebrewName}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></CardContent></Card>))}</div><div><Badge variant="outline" className="mb-2">All Priests</Badge>{priestlyGarments.filter(g => g.wornBy === "both").map((garment) => (<Card key={garment.id} className="cursor-pointer hover:bg-accent/50 transition-colors mb-2" onClick={() => setSelectedGarment(garment)}><CardContent className="p-3"><div className="flex items-center justify-between"><div><h4 className="font-medium text-sm">{garment.name}</h4><p className="text-xs text-muted-foreground">{garment.hebrewName}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></CardContent></Card>))}</div></div></ScrollArea>
          </TabsContent>
          <TabsContent value="services">
            <ScrollArea className="h-[400px]"><div className="space-y-2 pr-4">{["daily", "weekly", "monthly", "annual"].map((freq) => { const services = getServicesByFrequency(freq as SanctuaryService["frequency"]); if (services.length === 0) return null; return (<div key={freq} className="mb-4"><Badge variant="outline" className="mb-2 capitalize">{freq}</Badge>{services.map((service) => (<Card key={service.id} className="cursor-pointer hover:bg-accent/50 transition-colors mb-2" onClick={() => setSelectedService(service)}><CardContent className="p-3"><div className="flex items-center justify-between"><div><h4 className="font-medium text-sm">{service.name}</h4><p className="text-xs text-muted-foreground">{service.timing}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></CardContent></Card>))}</div>); })}</div></ScrollArea>
          </TabsContent>
          <TabsContent value="offerings">
            <ScrollArea className="h-[400px]"><div className="space-y-2 pr-4">{["blood", "non-blood"].map((type) => { const offerings = getOfferingsByType(type as SanctuaryOffering["type"]); if (offerings.length === 0) return null; return (<div key={type} className="mb-4"><Badge variant="outline" className="mb-2 capitalize">{type} Offerings</Badge>{offerings.map((offering) => (<Card key={offering.id} className="cursor-pointer hover:bg-accent/50 transition-colors mb-2" onClick={() => setSelectedOffering(offering)}><CardContent className="p-3"><div className="flex items-center justify-between"><div><h4 className="font-medium text-sm">{offering.name}</h4><p className="text-xs text-muted-foreground">{offering.hebrewName} — {offering.category}</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></div></CardContent></Card>))}</div>); })}</div></ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
