import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, ChevronRight, Library, Sparkles, Heart, Cloud, Swords, Clock, Church, Book, HelpCircle, Link2 } from "lucide-react";
import { themesLibrary, themeCategories, getThemesByCategory, searchThemes, getThemeCategoryInfo, type ThemeEntry } from "@/data/themesLibrary";

interface ThemesLibraryProps { onClose?: () => void; }

const themeIcons: Record<ThemeEntry["theme"], React.ReactNode> = {
  "life-of-jesus": <Heart className="h-5 w-5 text-rose-500" />,
  "gospel": <Book className="h-5 w-5 text-amber-500" />,
  "heaven": <Cloud className="h-5 w-5 text-sky-500" />,
  "great-controversy": <Swords className="h-5 w-5 text-purple-500" />,
  "time-prophecy": <Clock className="h-5 w-5 text-emerald-500" />,
  "sanctuary": <Church className="h-5 w-5 text-yellow-600" />
};

const themeEmojis: Record<ThemeEntry["theme"], string> = {
  "life-of-jesus": "❤️", "gospel": "📖", "heaven": "☁️",
  "great-controversy": "⚔️", "time-prophecy": "⏰", "sanctuary": "⛪"
};

type LibraryTab = "overview" | ThemeEntry["theme"];

export function ThemesLibrary({ onClose }: ThemesLibraryProps) {
  const [activeTab, setActiveTab] = useState<LibraryTab>("overview");
  const [selectedTheme, setSelectedTheme] = useState<ThemeEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ThemeEntry[]>([]);

  const handleSearch = (query: string) => { setSearchQuery(query); if (query.length >= 2) { setSearchResults(searchThemes(query)); setSelectedTheme(null); } else { setSearchResults([]); } };
  const clearSelection = () => { setSelectedTheme(null); setSearchQuery(""); setSearchResults([]); };

  if (selectedTheme) {
    const categoryInfo = getThemeCategoryInfo(selectedTheme.theme);
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedTheme(null)} className="w-fit mb-2"><ChevronRight className="h-4 w-4 rotate-180 mr-1" />Back</Button>
          <div className="flex items-center gap-3">{themeIcons[selectedTheme.theme]}<div><CardTitle className="text-xl">{selectedTheme.title}</CardTitle>{selectedTheme.subTheme && (<p className="text-sm text-muted-foreground">{selectedTheme.subTheme}</p>)}</div></div>
          <Badge className={`w-fit bg-gradient-to-r ${categoryInfo.color} text-white mt-2`}>{categoryInfo.name}</Badge>
        </CardHeader>
        <ScrollArea className="h-[500px]">
          <CardContent className="space-y-5">
            <div><h4 className="font-semibold mb-2">Overview</h4><p className="text-sm text-muted-foreground">{selectedTheme.description}</p></div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4"><h4 className="font-semibold mb-3 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary" />Key Verses</h4><div className="space-y-3">{selectedTheme.keyVerses.map((verse, i) => (<div key={i} className="border-l-2 border-primary/30 pl-3"><p className="text-sm italic text-muted-foreground">"{verse.text}"</p><Badge variant="secondary" className="mt-1 text-xs">{verse.reference}</Badge></div>))}</div></div>
            {selectedTheme.connections.length > 0 && (<div><h4 className="font-semibold mb-2 flex items-center gap-2"><Link2 className="h-4 w-4 text-amber-500" />Connections</h4><div className="flex flex-wrap gap-2">{selectedTheme.connections.map((conn, i) => (<Badge key={i} variant="outline" className="text-xs">{conn}</Badge>))}</div></div>)}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-purple-500" />Study Questions</h4><ul className="space-y-2">{selectedTheme.studyQuestions.map((q, i) => (<li key={i} className="text-sm text-muted-foreground flex items-start gap-2"><span className="text-purple-500 mt-1">{i + 1}.</span>{q}</li>))}</ul></div>
            <div className="bg-accent/5 border border-accent/20 rounded-lg p-4"><h4 className="font-semibold mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" />Practical Application</h4><p className="text-sm text-muted-foreground">{selectedTheme.practicalApplication}</p></div>
          </CardContent>
        </ScrollArea>
      </Card>
    );
  }

  if (searchResults.length > 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4"><Button variant="ghost" size="sm" onClick={clearSelection} className="w-fit mb-2"><ChevronRight className="h-4 w-4 rotate-180 mr-1" />Clear Search</Button><CardTitle>Search Results</CardTitle><CardDescription>Found {searchResults.length} themes for "{searchQuery}"</CardDescription></CardHeader>
        <ScrollArea className="h-[500px]"><CardContent className="space-y-2 pr-4">{searchResults.map((theme) => { const categoryInfo = getThemeCategoryInfo(theme.theme); return (<Card key={theme.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedTheme(theme)}><CardContent className="p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3">{themeIcons[theme.theme]}<div><h4 className="font-medium">{theme.title}</h4>{theme.subTheme && (<p className="text-xs text-muted-foreground">{theme.subTheme}</p>)}</div></div><Badge className={`bg-gradient-to-r ${categoryInfo.color} text-white text-xs`}>{themeEmojis[theme.theme]}</Badge></div></CardContent></Card>); })}</CardContent></ScrollArea>
      </Card>
    );
  }

  const ThemeList = ({ themes }: { themes: ThemeEntry[] }) => (<div className="space-y-3">{themes.map((theme) => (<Card key={theme.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setSelectedTheme(theme)}><CardContent className="p-4"><div className="flex items-start justify-between mb-2"><div className="flex items-center gap-2">{themeIcons[theme.theme]}<div><h4 className="font-semibold">{theme.title}</h4>{theme.subTheme && (<p className="text-xs text-muted-foreground">{theme.subTheme}</p>)}</div></div></div><p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p><div className="flex flex-wrap gap-1 mt-2">{theme.keyVerses.slice(0, 2).map((v, i) => (<Badge key={i} variant="secondary" className="text-xs">{v.reference}</Badge>))}{theme.keyVerses.length > 2 && (<Badge variant="secondary" className="text-xs">+{theme.keyVerses.length - 2} more</Badge>)}</div></CardContent></Card>))}</div>);

  return (
    <Card className="h-full">
      <CardHeader className="pb-4"><div className="flex items-center justify-between"><div><CardTitle className="flex items-center gap-2"><Library className="h-5 w-5 text-amber-500" />PT Themes Library</CardTitle><CardDescription>{themesLibrary.length} themes across 6 walls of biblical truth</CardDescription></div>{onClose && (<Button variant="ghost" size="sm" onClick={onClose}>Close</Button>)}</div></CardHeader>
      <CardContent className="space-y-4">
        <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search themes, verses, topics..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" /></div>
        {searchQuery.length >= 2 && searchResults.length === 0 && (<div className="text-center py-8 text-muted-foreground"><Search className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No themes found for "{searchQuery}"</p></div>)}
        {searchQuery.length < 2 && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryTab)}>
            <TabsList className="grid grid-cols-4 w-full mb-2"><TabsTrigger value="overview" className="text-xs">All</TabsTrigger><TabsTrigger value="life-of-jesus" className="text-xs"><span className="hidden sm:inline">Jesus</span><span className="sm:hidden">❤️</span></TabsTrigger><TabsTrigger value="gospel" className="text-xs"><span className="hidden sm:inline">Gospel</span><span className="sm:hidden">📖</span></TabsTrigger><TabsTrigger value="heaven" className="text-xs"><span className="hidden sm:inline">Heaven</span><span className="sm:hidden">☁️</span></TabsTrigger></TabsList>
            <TabsList className="grid grid-cols-3 w-full"><TabsTrigger value="great-controversy" className="text-xs"><span className="hidden sm:inline">Controversy</span><span className="sm:hidden">⚔️</span></TabsTrigger><TabsTrigger value="time-prophecy" className="text-xs"><span className="hidden sm:inline">Prophecy</span><span className="sm:hidden">⏰</span></TabsTrigger><TabsTrigger value="sanctuary" className="text-xs"><span className="hidden sm:inline">Sanctuary</span><span className="sm:hidden">⛪</span></TabsTrigger></TabsList>
            <TabsContent value="overview"><ScrollArea className="h-[350px]"><div className="pr-4 space-y-4"><div className="grid grid-cols-2 gap-3">{Object.entries(themeCategories).map(([key, cat]) => { const count = getThemesByCategory(key as ThemeEntry["theme"]).length; return (<Card key={key} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => setActiveTab(key as LibraryTab)}><CardContent className="p-3"><div className="flex items-center justify-between mb-1"><span className="text-xl">{themeEmojis[key as ThemeEntry["theme"]]}</span><Badge variant="secondary">{count}</Badge></div><h4 className="font-semibold text-sm">{cat.name}</h4><p className="text-xs text-muted-foreground line-clamp-2">{cat.description}</p></CardContent></Card>); })}</div></div></ScrollArea></TabsContent>
            {(Object.keys(themeCategories) as ThemeEntry["theme"][]).map((themeKey) => (<TabsContent key={themeKey} value={themeKey}><ScrollArea className="h-[350px]"><div className="pr-4"><div className={`bg-${themeKey === 'life-of-jesus' ? 'rose' : themeKey === 'gospel' ? 'amber' : themeKey === 'heaven' ? 'sky' : themeKey === 'great-controversy' ? 'purple' : themeKey === 'time-prophecy' ? 'emerald' : 'yellow'}-500/10 border border-${themeKey === 'life-of-jesus' ? 'rose' : themeKey === 'gospel' ? 'amber' : themeKey === 'heaven' ? 'sky' : themeKey === 'great-controversy' ? 'purple' : themeKey === 'time-prophecy' ? 'emerald' : 'yellow'}-500/20 rounded-lg p-3 mb-4`}><h4 className="font-semibold flex items-center gap-2">{themeIcons[themeKey]}{themeCategories[themeKey].name}</h4><p className="text-xs text-muted-foreground mt-1">{themeCategories[themeKey].description}</p></div><ThemeList themes={getThemesByCategory(themeKey)} /></div></ScrollArea></TabsContent>))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
