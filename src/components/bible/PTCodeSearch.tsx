import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Layers } from "lucide-react";

interface PTCodeSearchProps {
  onSearchResults?: (results: SearchResult[]) => void;
}

interface SearchResult {
  code: string;
  name: string;
  description: string;
  category: "room" | "cycle" | "heaven" | "dimension" | "floor";
  relatedPassages?: string[];
}

const PT_CODE_DATABASE: SearchResult[] = [
  // Rooms - Floor 1
  { code: "SR", name: "Story Room", description: "Memory of biblical narratives", category: "room" },
  { code: "IR", name: "Imagination Room", description: "Immersive visualization", category: "room" },
  { code: "24F", name: "24FPS", description: "Chapter frame-by-frame", category: "room" },
  { code: "BR", name: "Bible Rendered", description: "Visual rendering blocks", category: "room" },
  { code: "TR", name: "Translation Room", description: "Word-to-image translation", category: "room" },
  { code: "GR", name: "Gems Room", description: "Collected insights", category: "room" },
  
  // Rooms - Floor 2
  { code: "OR", name: "Observation Room", description: "Detailed text analysis", category: "room" },
  { code: "DC", name: "Def-Com", description: "Definitions & Commentary", category: "room" },
  { code: "ST", name: "Symbols/Types", description: "Typology identification", category: "room" },
  { code: "QR", name: "Questions Room", description: "Interrogative study", category: "room" },
  { code: "QA", name: "Q&A Chains", description: "Scripture cross-examination", category: "room" },
  
  // Rooms - Floor 3
  { code: "NF", name: "Nature Freestyle", description: "Creation as sermon", category: "room" },
  { code: "PF", name: "Personal Freestyle", description: "Life as object lesson", category: "room" },
  { code: "BF", name: "Bible Freestyle", description: "Verse genetics", category: "room" },
  { code: "HF", name: "History Freestyle", description: "Events as illustrations", category: "room" },
  { code: "LR", name: "Listening Room", description: "Responsive connections", category: "room" },
  
  // Rooms - Floor 4
  { code: "CR", name: "Concentration Room", description: "Christ-centered focus", category: "room" },
  { code: "DR", name: "Dimensions Room", description: "5-dimension analysis", category: "room" },
  { code: "C6", name: "Connect 6", description: "Genre classification", category: "room" },
  { code: "TRm", name: "Theme Room", description: "Structural walls", category: "room" },
  { code: "TZ", name: "Time Zone", description: "Past/Present/Future Heaven/Earth", category: "room" },
  { code: "PRm", name: "Patterns Room", description: "Recurring motifs", category: "room" },
  { code: "P‖", name: "Parallels Room", description: "Mirrored actions", category: "room" },
  { code: "FRt", name: "Fruit Room", description: "Character test", category: "room" },
  { code: "CEC", name: "Christ in Every Chapter", description: "Trace Christ-thread", category: "room" },
  { code: "R66", name: "Room 66", description: "One theme through 66 books", category: "room" },
  
  // Rooms - Floor 5
  { code: "BL", name: "Blue Room", description: "Sanctuary blueprint", category: "room" },
  { code: "PR", name: "Prophecy Room", description: "Timeline telescope", category: "room" },
  { code: "3A", name: "Three Angels", description: "Final gospel message", category: "room" },
  
  // Rooms - Floor 6
  { code: "JR", name: "Juice Room", description: "Full-book squeeze", category: "room" },
  
  // Rooms - Floor 7
  { code: "FRm", name: "Fire Room", description: "Emotional conviction", category: "room" },
  { code: "MR", name: "Meditation Room", description: "Slow marination", category: "room" },
  { code: "SRm", name: "Speed Room", description: "Rapid application", category: "room" },
  
  // Cycles
  { code: "@Ad", name: "Adamic", description: "Eden → Promise", category: "cycle" },
  { code: "@No", name: "Noahic", description: "Flood → Covenant", category: "cycle" },
  { code: "@Ab", name: "Abrahamic", description: "Call → Covenant People", category: "cycle" },
  { code: "@Mo", name: "Mosaic", description: "Exodus → Sanctuary", category: "cycle" },
  { code: "@Cy", name: "Cyrusic", description: "Exile → Return", category: "cycle" },
  { code: "@CyC", name: "Cyrus-Christ", description: "Type → Antitype Deliverer", category: "cycle" },
  { code: "@Sp", name: "Spirit", description: "Pentecost → Revivals", category: "cycle" },
  { code: "@Re", name: "Remnant", description: "End-Time → Second Coming", category: "cycle" },
  
  // Three Heavens
  { code: "1H", name: "First Heaven", description: "Babylon → Post-exilic restoration (DoL¹/NE¹)", category: "heaven" },
  { code: "2H", name: "Second Heaven", description: "70 AD → New Covenant order (DoL²/NE²)", category: "heaven" },
  { code: "3H", name: "Third Heaven", description: "Final judgment → Literal New Creation (DoL³/NE³)", category: "heaven" },
  { code: "DoL¹", name: "Day of the Lord 1", description: "586 BC Babylon destroys Jerusalem", category: "heaven" },
  { code: "DoL²", name: "Day of the Lord 2", description: "70 AD Rome destroys Temple", category: "heaven" },
  { code: "DoL³", name: "Day of the Lord 3", description: "Final global judgment", category: "heaven" },
  { code: "NE¹", name: "New Earth 1", description: "Post-exilic restoration (typological)", category: "heaven" },
  { code: "NE²", name: "New Earth 2", description: "New Covenant/heavenly order", category: "heaven" },
  { code: "NE³", name: "New Earth 3", description: "Literal New Creation", category: "heaven" },
  
  // Five Dimensions
  { code: "1D", name: "Literal", description: "Plain text meaning", category: "dimension" },
  { code: "2D", name: "Christ", description: "Reveals Christ", category: "dimension" },
  { code: "3D", name: "Me", description: "Personal application", category: "dimension" },
  { code: "4D", name: "Church", description: "Corporate body", category: "dimension" },
  { code: "5D", name: "Heaven", description: "Celestial realm", category: "dimension" },
  
  // Floors
  { code: "F1", name: "Floor 1", description: "Furnishing (Width)", category: "floor" },
  { code: "F2", name: "Floor 2", description: "Investigation (Width)", category: "floor" },
  { code: "F3", name: "Floor 3", description: "Freestyle (Time)", category: "floor" },
  { code: "F4", name: "Floor 4", description: "Next Level (Depth)", category: "floor" },
  { code: "F5", name: "Floor 5", description: "Vision (Depth)", category: "floor" },
  { code: "F6", name: "Floor 6", description: "Three Heavens (Depth)", category: "floor" },
  { code: "F7", name: "Floor 7", description: "Spiritual/Emotional (Height)", category: "floor" },
  { code: "F8", name: "Floor 8", description: "Master (Height)", category: "floor" },
];

export const PTCodeSearch = ({ onSearchResults }: PTCodeSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const query = searchQuery.toUpperCase().trim();
    const matches = PT_CODE_DATABASE.filter(
      (item) =>
        item.code.toUpperCase().includes(query) ||
        item.name.toUpperCase().includes(query) ||
        item.description.toUpperCase().includes(query)
    );

    setResults(matches);
    setShowResults(true);
    if (onSearchResults) {
      onSearchResults(matches);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "room": return "bg-blue-500";
      case "cycle": return "bg-purple-500";
      case "heaven": return "bg-amber-500";
      case "dimension": return "bg-green-500";
      case "floor": return "bg-pink-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card className="p-4 space-y-3 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 border-2 border-indigo-500/20">
      <div className="flex items-center gap-2">
        <Search className="h-5 w-5 text-indigo-600" />
        <h4 className="font-semibold text-sm text-foreground">PT Code Search</h4>
      </div>

      <p className="text-xs text-muted-foreground">
        Search by PT codes (e.g., CR, @CyC, 1H, DoL²) or names
      </p>

      <div className="flex gap-2">
        <Input
          placeholder="Enter PT code (CR, @Mo, 1H, etc.)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="text-sm"
        />
        <Button onClick={handleSearch} size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showResults && (
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No PT codes found matching "{searchQuery}"
            </p>
          ) : (
            <>
              <p className="text-xs font-semibold text-foreground">
                Found {results.length} result{results.length !== 1 ? "s" : ""}:
              </p>
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-mono font-bold text-sm text-primary">
                          {result.code}
                        </code>
                        <Badge
                          variant="secondary"
                          className={`${getCategoryColor(result.category)} text-white text-xs`}
                        >
                          {result.category}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {result.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {result.description}
                      </p>
                    </div>
                    <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      <div className="bg-accent/10 p-2 rounded border border-accent/20">
        <p className="text-xs text-muted-foreground">
          <Layers className="h-3 w-3 inline mr-1" />
          <strong>Tip:</strong> Use codes like CR (Christ Room), @CyC (Cyrus-Christ Cycle), or 2H (Second Heaven) to quickly locate PT principles
        </p>
      </div>
    </Card>
  );
};
