import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, BookOpen, Filter, Flame, X, GraduationCap } from "lucide-react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { CHARACTER_PROFILES_TOUR } from "@/data/guidedTours";
import { biblicalCharacterProfiles } from "@/data/biblicalCharacterProfiles";
import type { Archetype, SituationCategory } from "@/data/biblicalCharacterProfiles";
import { CharacterProfileCard } from "@/components/character-profiles/CharacterProfileCard";
import { CharacterProfileDetail } from "@/components/character-profiles/CharacterProfileDetail";
import { useCharacterImages } from "@/hooks/useCharacterImages";

const allArchetypes: Archetype[] = [
  "Shepherd", "Warrior", "Prophet", "Strategist", "Survivor",
  "Redeemed", "Seeker", "Manipulator", "Oppressor", "Tragic Hero",
  "Servant", "Matriarch", "Patriarch", "Judge", "King", "Priest",
  "Missionary", "Builder", "Exile", "Martyr",
];

const situationCategories: SituationCategory[] = [
  "Temptation", "Rejection", "Leadership Pressure", "Correction",
  "Fear", "Betrayal", "Waiting", "Power and Success", "Loss",
  "Conflict", "Faith Testing", "Obedience", "Sacrifice",
  "Restoration", "Calling", "Persecution",
];

export default function CharacterProfiles() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [testamentFilter, setTestamentFilter] = useState<"all" | "OT" | "NT">("all");
  const [archetypeFilter, setArchetypeFilter] = useState<Archetype | null>(null);
  const [situationFilter, setSituationFilter] = useState<SituationCategory | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const { data: characterImages } = useCharacterImages();

  const selectedCharacter = useMemo(
    () => biblicalCharacterProfiles.find((c) => c.id === selectedCharacterId) || null,
    [selectedCharacterId]
  );

  const filteredCharacters = useMemo(() => {
    return biblicalCharacterProfiles.filter((char) => {
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = char.name.toLowerCase().includes(q);
        const matchesRole = char.role.toLowerCase().includes(q);
        const matchesMeaning = char.meaning.toLowerCase().includes(q);
        const matchesSituation = char.situations.some(
          (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
        );
        if (!matchesName && !matchesRole && !matchesMeaning && !matchesSituation) return false;
      }

      // Testament
      if (testamentFilter !== "all" && char.testament !== testamentFilter) return false;

      // Archetype
      if (archetypeFilter && !char.archetypes.includes(archetypeFilter)) return false;

      // Situation category
      if (situationFilter && !char.situations.some((s) => s.category === situationFilter))
        return false;

      return true;
    });
  }, [searchQuery, testamentFilter, archetypeFilter, situationFilter]);

  // Count situations across all characters
  const totalSituations = biblicalCharacterProfiles.reduce(
    (sum, c) => sum + c.situations.length,
    0
  );

  // Used archetypes (only show filters for archetypes that exist)
  const usedArchetypes = useMemo(() => {
    const set = new Set<Archetype>();
    biblicalCharacterProfiles.forEach((c) => c.archetypes.forEach((a) => set.add(a)));
    return allArchetypes.filter((a) => set.has(a));
  }, []);

  const usedSituationCategories = useMemo(() => {
    const set = new Set<SituationCategory>();
    biblicalCharacterProfiles.forEach((c) =>
      c.situations.forEach((s) => set.add(s.category))
    );
    return situationCategories.filter((s) => set.has(s));
  }, []);

  const hasActiveFilters = archetypeFilter || situationFilter || testamentFilter !== "all";

  if (selectedCharacter) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <CharacterProfileDetail
          character={selectedCharacter}
          imageUrl={characterImages?.get(selectedCharacter.id)}
          onBack={() => setSelectedCharacterId(null)}
          onNavigateToCharacter={(id) => setSelectedCharacterId(id)}
          allCharacters={biblicalCharacterProfiles}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 mb-8 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8" />
              <h1 className="text-3xl md:text-4xl font-bold">Biblical Character Profiles</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="text-white/80 hover:text-white hover:bg-white/10 gap-1">
              <GraduationCap className="h-4 w-4" /> Tour
            </Button>
          </div>
          {tourOpen && <GuidedTourOverlay steps={CHARACTER_PROFILES_TOUR} onClose={() => setTourOpen(false)} />}
          <p className="text-white/80 text-lg max-w-2xl mb-2">
            Psychological-spiritual analysis of Scripture's most important figures.
            Understand who they were, how they responded under pressure, and what their lives teach us.
          </p>
          <div className="flex gap-4 text-sm text-white/70">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {biblicalCharacterProfiles.length} Characters
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {totalSituations} Situation Analyses
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Old & New Testament
            </span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search characters, roles, or situations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-1 bg-white/20 text-xs">
                Active
              </Badge>
            )}
          </Button>
        </div>

        {/* Testament Tabs */}
        <Tabs value={testamentFilter} onValueChange={(v) => setTestamentFilter(v as "all" | "OT" | "NT")}>
          <TabsList>
            <TabsTrigger value="all">All ({biblicalCharacterProfiles.length})</TabsTrigger>
            <TabsTrigger value="OT">
              Old Testament ({biblicalCharacterProfiles.filter((c) => c.testament === "OT").length})
            </TabsTrigger>
            <TabsTrigger value="NT">
              New Testament ({biblicalCharacterProfiles.filter((c) => c.testament === "NT").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium mb-2">Archetype</h3>
              <div className="flex flex-wrap gap-1">
                {usedArchetypes.map((a) => (
                  <Badge
                    key={a}
                    variant={archetypeFilter === a ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setArchetypeFilter(archetypeFilter === a ? null : a)}
                  >
                    {a}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Situation Type</h3>
              <div className="flex flex-wrap gap-1">
                {usedSituationCategories.map((s) => (
                  <Badge
                    key={s}
                    variant={situationFilter === s ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => setSituationFilter(situationFilter === s ? null : s)}
                  >
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setArchetypeFilter(null);
                  setSituationFilter(null);
                  setTestamentFilter("all");
                }}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" /> Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredCharacters.length} of {biblicalCharacterProfiles.length} characters
      </p>

      {/* Character Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters.map((char) => (
          <CharacterProfileCard
            key={char.id}
            character={char}
            imageUrl={characterImages?.get(char.id)}
            onClick={() => setSelectedCharacterId(char.id)}
          />
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-16">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No characters found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
